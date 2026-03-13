/**
 * Knowledge Query for API endpoints (Vercel serverless).
 *
 * Loads the pre-extracted knowledge base JSON and provides
 * filtered, formatted markdown for injection into Claude's system prompt.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadKnowledgeBase(): KnowledgeBase {
  const kbPath = path.join(__dirname, 'knowledge-base.json');
  const raw = fs.readFileSync(kbPath, 'utf-8');
  return JSON.parse(raw) as KnowledgeBase;
}

let _kb: KnowledgeBase | null = null;

function getKB(): KnowledgeBase {
  if (!_kb) _kb = loadKnowledgeBase();
  return _kb;
}

// ============================================================================
// TYPES
// ============================================================================

interface KnowledgeChunk {
  id: string;
  source: string;
  sourceShortName: string;
  section: string;
  content: string;
  topics: string[];
  disciplines: string[];
  chunkType: string;
  offerings: string[];
  pricePoints: string[];
}

interface KnowledgeBase {
  version: string;
  extractedAt: string;
  sources: { filename: string; shortName: string; discipline: string; wordCount: number; chunkCount: number }[];
  chunks: KnowledgeChunk[];
}

// kb is lazily loaded via getKB()

// ============================================================================
// TOKENIZATION & SCORING
// ============================================================================

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

interface ScoredChunk {
  chunk: KnowledgeChunk;
  score: number;
}

function scoreChunk(
  chunk: KnowledgeChunk,
  disciplines?: string[],
  chunkTypes?: string[],
  queryTerms?: string[]
): number {
  let score = 0;

  // Discipline match
  if (disciplines?.length) {
    const matches = disciplines.filter(d => chunk.disciplines.includes(d));
    if (matches.length > 0) {
      score += 0.3 * (matches.length / disciplines.length);
    } else {
      score -= 0.5;
    }
  }

  // Chunk type match
  if (chunkTypes?.length) {
    if (chunkTypes.includes(chunk.chunkType)) {
      score += 0.2;
    }
  }

  // Keyword match
  if (queryTerms?.length) {
    const content = chunk.content.toLowerCase();
    const section = chunk.section.toLowerCase();
    let matched = 0;

    for (const term of queryTerms) {
      if (content.includes(term) || section.includes(term) || chunk.topics.includes(term)) {
        matched++;
      }
    }

    if (matched > 0) {
      score += 0.3 * (matched / queryTerms.length);
    }
  }

  return score;
}

function search(
  disciplines?: string[],
  chunkTypes?: string[],
  query?: string,
  limit = 10,
  minScore = 0.1
): ScoredChunk[] {
  const queryTerms = query ? tokenize(query) : undefined;
  const results: ScoredChunk[] = [];

  for (const chunk of getKB().chunks) {
    const score = scoreChunk(chunk, disciplines, chunkTypes, queryTerms);
    if (score >= minScore) {
      results.push({ chunk, score });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

// ============================================================================
// FORMATTING
// ============================================================================

function formatChunks(chunks: ScoredChunk[], heading: string): string {
  if (chunks.length === 0) return '';

  const lines: string[] = [`### ${heading}`];
  const bySource = new Map<string, ScoredChunk[]>();

  for (const sc of chunks) {
    const key = sc.chunk.sourceShortName;
    if (!bySource.has(key)) bySource.set(key, []);
    bySource.get(key)!.push(sc);
  }

  for (const [source, items] of bySource) {
    lines.push(`\n**${source}**`);
    for (const { chunk } of items) {
      const content = chunk.content.length > 500
        ? chunk.content.slice(0, 500) + '...'
        : chunk.content;
      lines.push(`- **${chunk.section}** _(${chunk.chunkType})_: ${content.replace(/\n/g, ' ').trim()}`);
      if (chunk.pricePoints.length > 0) {
        lines.push(`  - Pricing: ${chunk.pricePoints.join(', ')}`);
      }
    }
  }

  return lines.join('\n');
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Get knowledge for plan generation — combined offerings, sales intelligence, and methodology.
 * Returns formatted markdown ready for system prompt injection.
 */
export function getPlanKnowledge(disciplines: string[]): string {
  const sections: string[] = [];

  // Offering intelligence
  const offerings = search(disciplines, ['offering-summary', 'pricing', 'engagement-definition'], undefined, 10);
  const offeringMd = formatChunks(offerings, 'Merkle Offering Intelligence');
  if (offeringMd) sections.push(offeringMd);

  // Sales narratives and case studies
  const sales = search(disciplines, ['sales-narrative', 'case-study', 'market-data'], undefined, 8);
  const salesMd = formatChunks(sales, 'Sales & Market Intelligence');
  if (salesMd) sections.push(salesMd);

  // Methodology and frameworks
  const methodology = search(disciplines, ['methodology', 'strategic-framework', 'capability'], undefined, 8);
  const methodMd = formatChunks(methodology, 'Methodology & Strategic Frameworks');
  if (methodMd) sections.push(methodMd);

  if (sections.length === 0) return '';

  return `\n## Merkle Reference Intelligence (from offering toolkits)\n\n${sections.join('\n\n')}`;
}

/**
 * Get knowledge relevant to a specific query for chat responses.
 */
export function getChatKnowledge(query: string, disciplines?: string[]): string {
  const results = search(disciplines, undefined, query, 8, 0.1);
  if (results.length === 0) return '';

  return formatChunks(results, 'Relevant Merkle Knowledge');
}
