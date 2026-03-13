/**
 * Knowledge Query Library
 *
 * Provides semantic search over the extracted PDF knowledge base.
 * Used by both the MCP server (stdio) and the API endpoints (direct import).
 *
 * Search strategies:
 * - Topic-based: Filter by discipline, topic tags, chunk type
 * - Keyword: TF-IDF-style relevance scoring on content
 * - Combined: Topic filters + keyword scoring for best results
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ============================================================================
// TYPES
// ============================================================================

export interface KnowledgeChunk {
  id: string;
  source: string;
  sourceShortName: string;
  section: string;
  content: string;
  topics: string[];
  disciplines: string[];
  chunkType:
    | 'offering-summary'
    | 'pricing'
    | 'sales-narrative'
    | 'methodology'
    | 'case-study'
    | 'market-data'
    | 'strategic-framework'
    | 'engagement-definition'
    | 'capability'
    | 'general';
  offerings: string[];
  pricePoints: string[];
}

interface KnowledgeBase {
  version: string;
  extractedAt: string;
  sources: {
    filename: string;
    shortName: string;
    discipline: string;
    wordCount: number;
    chunkCount: number;
  }[];
  chunks: KnowledgeChunk[];
}

export interface QueryOptions {
  /** Filter by discipline (e.g., 'messaging-personalization', 'loyalty', 'data-identity') */
  disciplines?: string[];
  /** Filter by topic tags */
  topics?: string[];
  /** Filter by chunk type */
  chunkTypes?: KnowledgeChunk['chunkType'][];
  /** Filter by source short name */
  sources?: string[];
  /** Free-text keyword search */
  query?: string;
  /** Max results to return (default: 10) */
  limit?: number;
  /** Minimum relevance score 0-1 (default: 0.1) */
  minScore?: number;
}

export interface QueryResult {
  chunk: KnowledgeChunk;
  score: number;
  matchReasons: string[];
}

// ============================================================================
// KNOWLEDGE STORE
// ============================================================================

let _knowledgeBase: KnowledgeBase | null = null;
let _termIndex: Map<string, Set<string>> | null = null; // term -> chunk IDs

function getKnowledgeBasePath(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, 'knowledge-base.json');
}

/**
 * Load the knowledge base from JSON. Cached after first load.
 */
export function loadKnowledgeBase(customPath?: string): KnowledgeBase {
  if (_knowledgeBase) return _knowledgeBase;

  const kbPath = customPath || getKnowledgeBasePath();
  if (!fs.existsSync(kbPath)) {
    throw new Error(`Knowledge base not found at ${kbPath}. Run extract-knowledge.ts first.`);
  }

  const raw = fs.readFileSync(kbPath, 'utf-8');
  _knowledgeBase = JSON.parse(raw) as KnowledgeBase;
  _termIndex = null; // Reset index
  return _knowledgeBase;
}

/**
 * Load from a pre-parsed object (for Vercel serverless where we import JSON directly).
 */
export function loadKnowledgeBaseFromData(data: KnowledgeBase): void {
  _knowledgeBase = data;
  _termIndex = null;
}

// ============================================================================
// TERM INDEX (for keyword search)
// ============================================================================

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

function buildTermIndex(kb: KnowledgeBase): Map<string, Set<string>> {
  if (_termIndex) return _termIndex;

  const index = new Map<string, Set<string>>();

  for (const chunk of kb.chunks) {
    const terms = new Set([
      ...tokenize(chunk.content),
      ...tokenize(chunk.section),
      ...chunk.topics,
      ...chunk.disciplines,
      ...chunk.offerings.flatMap(o => tokenize(o)),
    ]);

    for (const term of terms) {
      if (!index.has(term)) index.set(term, new Set());
      index.get(term)!.add(chunk.id);
    }
  }

  _termIndex = index;
  return index;
}

// ============================================================================
// SCORING
// ============================================================================

function scoreChunk(chunk: KnowledgeChunk, options: QueryOptions, termIndex: Map<string, Set<string>>): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Discipline match (strong signal)
  if (options.disciplines?.length) {
    const matches = options.disciplines.filter(d => chunk.disciplines.includes(d));
    if (matches.length > 0) {
      score += 0.3 * (matches.length / options.disciplines.length);
      reasons.push(`discipline: ${matches.join(', ')}`);
    } else {
      // If disciplines specified but none match, heavily penalize
      score -= 0.5;
    }
  }

  // Topic match
  if (options.topics?.length) {
    const matches = options.topics.filter(t => chunk.topics.includes(t));
    if (matches.length > 0) {
      score += 0.2 * (matches.length / options.topics.length);
      reasons.push(`topics: ${matches.join(', ')}`);
    }
  }

  // Chunk type match
  if (options.chunkTypes?.length) {
    if (options.chunkTypes.includes(chunk.chunkType)) {
      score += 0.15;
      reasons.push(`type: ${chunk.chunkType}`);
    }
  }

  // Source match
  if (options.sources?.length) {
    if (options.sources.some(s => chunk.sourceShortName.toLowerCase().includes(s.toLowerCase()))) {
      score += 0.1;
      reasons.push(`source: ${chunk.sourceShortName}`);
    }
  }

  // Keyword search (TF-IDF-lite)
  if (options.query) {
    const queryTerms = tokenize(options.query);
    if (queryTerms.length > 0) {
      let keywordScore = 0;
      const matchedTerms: string[] = [];
      const totalChunks = _knowledgeBase?.chunks.length || 1;

      for (const term of queryTerms) {
        const chunkContent = chunk.content.toLowerCase();
        const sectionContent = chunk.section.toLowerCase();

        // Term frequency in this chunk
        const contentMatches = (chunkContent.match(new RegExp(term, 'g')) || []).length;
        const sectionMatch = sectionContent.includes(term) ? 1 : 0;
        const topicMatch = chunk.topics.includes(term) ? 1 : 0;

        if (contentMatches > 0 || sectionMatch || topicMatch) {
          // IDF: rarer terms score higher
          const docsWithTerm = termIndex.get(term)?.size || 1;
          const idf = Math.log(totalChunks / docsWithTerm);

          // TF: normalize by content length
          const tf = contentMatches / (chunk.content.split(/\s+/).length || 1);

          // Boost section/topic matches
          const boost = sectionMatch * 2 + topicMatch * 1.5;

          keywordScore += (tf * idf + boost) / queryTerms.length;
          matchedTerms.push(term);
        }
      }

      if (matchedTerms.length > 0) {
        // Normalize keyword score to 0-0.5 range
        const normalizedKeywordScore = Math.min(0.5, keywordScore * 0.5);
        score += normalizedKeywordScore;
        reasons.push(`keywords: ${matchedTerms.join(', ')}`);
      }

      // Penalize if no keyword matches at all
      if (matchedTerms.length === 0 && queryTerms.length > 0) {
        score -= 0.2;
      }
    }
  }

  // Bonus: chunks with price points when querying pricing
  if (options.chunkTypes?.includes('pricing') && chunk.pricePoints.length > 0) {
    score += 0.1;
    reasons.push(`has pricing: ${chunk.pricePoints.join(', ')}`);
  }

  // Bonus: chunks with offerings when querying offerings
  if (options.chunkTypes?.includes('offering-summary') && chunk.offerings.length > 0) {
    score += 0.1;
    reasons.push(`has offerings: ${chunk.offerings.join(', ')}`);
  }

  return { score, reasons };
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Search the knowledge base with combined filtering and relevance scoring.
 */
export function queryKnowledge(options: QueryOptions): QueryResult[] {
  const kb = loadKnowledgeBase();
  const termIndex = buildTermIndex(kb);
  const limit = options.limit || 10;
  const minScore = options.minScore ?? 0.1;

  const results: QueryResult[] = [];

  for (const chunk of kb.chunks) {
    const { score, reasons } = scoreChunk(chunk, options, termIndex);

    if (score >= minScore) {
      results.push({ chunk, score, matchReasons: reasons });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}

/**
 * Get chunks by discipline, formatted as markdown context for prompt injection.
 */
export function getKnowledgeForDiscipline(
  discipline: string,
  options?: { chunkTypes?: KnowledgeChunk['chunkType'][]; limit?: number }
): string {
  const results = queryKnowledge({
    disciplines: [discipline],
    chunkTypes: options?.chunkTypes,
    limit: options?.limit || 15,
    minScore: 0.05,
  });

  if (results.length === 0) return '';

  return formatResultsAsMarkdown(results, `${discipline} Knowledge`);
}

/**
 * Get offering-specific knowledge (summaries, pricing, engagement definitions).
 */
export function getOfferingKnowledge(
  discipline?: string,
  options?: { limit?: number }
): string {
  const results = queryKnowledge({
    disciplines: discipline ? [discipline] : undefined,
    chunkTypes: ['offering-summary', 'pricing', 'engagement-definition'],
    limit: options?.limit || 20,
    minScore: 0.05,
  });

  if (results.length === 0) return '';

  return formatResultsAsMarkdown(results, 'Offering Intelligence');
}

/**
 * Get sales narrative and case study knowledge for compelling recommendations.
 */
export function getSalesIntelligence(
  discipline?: string,
  query?: string,
  options?: { limit?: number }
): string {
  const results = queryKnowledge({
    disciplines: discipline ? [discipline] : undefined,
    chunkTypes: ['sales-narrative', 'case-study', 'market-data'],
    query,
    limit: options?.limit || 15,
    minScore: 0.05,
  });

  if (results.length === 0) return '';

  return formatResultsAsMarkdown(results, 'Sales & Market Intelligence');
}

/**
 * Get methodology and framework knowledge for strategic recommendations.
 */
export function getMethodologyKnowledge(
  discipline?: string,
  query?: string,
  options?: { limit?: number }
): string {
  const results = queryKnowledge({
    disciplines: discipline ? [discipline] : undefined,
    chunkTypes: ['methodology', 'strategic-framework', 'capability'],
    query,
    limit: options?.limit || 15,
    minScore: 0.05,
  });

  if (results.length === 0) return '';

  return formatResultsAsMarkdown(results, 'Methodology & Frameworks');
}

/**
 * Combined intelligence query for plan generation.
 * Returns formatted markdown covering offerings, sales narratives, and methodology.
 */
export function getPlanGenerationKnowledge(
  disciplines: string[],
  query?: string
): string {
  const sections: string[] = [];

  // 1. Offering intelligence
  for (const disc of disciplines) {
    const offeringKnowledge = getOfferingKnowledge(disc, { limit: 8 });
    if (offeringKnowledge) sections.push(offeringKnowledge);
  }

  // 2. Sales narratives and case studies
  const salesKnowledge = getSalesIntelligence(
    disciplines[0],
    query,
    { limit: 8 }
  );
  if (salesKnowledge) sections.push(salesKnowledge);

  // 3. Methodology and frameworks
  const methodologyKnowledge = getMethodologyKnowledge(
    disciplines[0],
    query,
    { limit: 8 }
  );
  if (methodologyKnowledge) sections.push(methodologyKnowledge);

  if (sections.length === 0) return '';

  return `\n## Merkle Reference Intelligence\n\n${sections.join('\n\n')}`;
}

// ============================================================================
// FORMATTING
// ============================================================================

function formatResultsAsMarkdown(results: QueryResult[], heading: string): string {
  const lines: string[] = [`### ${heading}`];

  // Group by source for cleaner output
  const bySource = new Map<string, QueryResult[]>();
  for (const r of results) {
    const key = r.chunk.sourceShortName;
    if (!bySource.has(key)) bySource.set(key, []);
    bySource.get(key)!.push(r);
  }

  for (const [source, chunks] of bySource) {
    lines.push(`\n**Source: ${source}**`);
    for (const { chunk } of chunks) {
      // Truncate long content for prompt injection (keep first ~500 chars)
      const content = chunk.content.length > 500
        ? chunk.content.slice(0, 500) + '...'
        : chunk.content;
      lines.push(`\n> **${chunk.section}** _(${chunk.chunkType})_`);
      lines.push(`> ${content.replace(/\n/g, '\n> ')}`);
      if (chunk.pricePoints.length > 0) {
        lines.push(`> 💰 Pricing: ${chunk.pricePoints.join(', ')}`);
      }
      if (chunk.offerings.length > 0) {
        lines.push(`> 📦 Offerings: ${chunk.offerings.join(', ')}`);
      }
    }
  }

  return lines.join('\n');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get available sources summary.
 */
export function getSourcesSummary(): string {
  const kb = loadKnowledgeBase();
  const lines = ['### Available Knowledge Sources'];
  for (const s of kb.sources) {
    lines.push(`- **${s.shortName}** (${s.discipline}): ${s.chunkCount} chunks, ${s.wordCount} words`);
  }
  return lines.join('\n');
}

/**
 * Get all unique topics across the knowledge base.
 */
export function getAvailableTopics(): string[] {
  const kb = loadKnowledgeBase();
  const topics = new Set<string>();
  for (const chunk of kb.chunks) {
    for (const t of chunk.topics) topics.add(t);
  }
  return [...topics].sort();
}

/**
 * Get all unique disciplines across the knowledge base.
 */
export function getAvailableDisciplines(): string[] {
  const kb = loadKnowledgeBase();
  const disciplines = new Set<string>();
  for (const chunk of kb.chunks) {
    for (const d of chunk.disciplines) disciplines.add(d);
  }
  return [...disciplines].sort();
}
