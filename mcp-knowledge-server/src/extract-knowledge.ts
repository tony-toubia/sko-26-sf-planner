#!/usr/bin/env tsx
/**
 * PDF Knowledge Extraction Script
 *
 * Extracts text from reference PDFs, chunks by semantic boundaries,
 * and produces a structured JSON knowledge base that the MCP server
 * and API endpoints can query.
 *
 * Usage: npx tsx src/extract-knowledge.ts
 *
 * Outputs: src/knowledge-base.json
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

async function extractPdfText(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const uint8 = new Uint8Array(buffer);
  const parser = new PDFParse(uint8);
  const result = await parser.getText();
  // result is { pages: [{ text: string, num: number }] }
  return result.pages.map((p: { text: string }) => p.text).join('\n\n');
}

// ============================================================================
// TYPES
// ============================================================================

interface KnowledgeChunk {
  id: string;
  source: string;         // PDF filename
  sourceShortName: string; // Human-readable source name
  section: string;        // Section/slide heading
  content: string;        // Chunk text content
  topics: string[];       // Topic tags for filtering
  disciplines: string[];  // messaging-personalization, loyalty, data-identity, etc.
  chunkType: 'offering-summary' | 'pricing' | 'sales-narrative' | 'methodology'
    | 'case-study' | 'market-data' | 'strategic-framework' | 'engagement-definition'
    | 'capability' | 'general';
  offerings: string[];    // Specific offering names mentioned
  pricePoints: string[];  // Any pricing mentioned
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

// ============================================================================
// PDF SOURCE DEFINITIONS
// ============================================================================

const PDF_SOURCES: {
  filename: string;
  shortName: string;
  discipline: string;
  topics: string[];
}[] = [
  {
    filename: 'CRM-Messaging_Offering_v1.4.pdf',
    shortName: 'CRM & Messaging Offering',
    discipline: 'messaging-personalization',
    topics: ['crm', 'messaging', 'email', 'sms', 'campaigns', 'journeys', 'marketing-cloud'],
  },
  {
    filename: 'Modern CRM POV Pre Jan 2026 v3.pdf',
    shortName: 'Modern CRM POV',
    discipline: 'messaging-personalization',
    topics: ['crm', 'strategy', 'personalization', 'modern-crm', 'transformation'],
  },
  {
    filename: 'HumanLoyaltyOffering-v1.3.pdf',
    shortName: 'Human Loyalty Offering',
    discipline: 'loyalty',
    topics: ['loyalty', 'programs', 'rewards', 'retention', 'engagement'],
  },
  {
    filename: 'Merkury Consumer 360 GTM- Offering Toolkit - New Theme.pdf',
    shortName: 'Merkury Consumer 360',
    discipline: 'data-identity',
    topics: ['data', 'identity', 'merkury', 'cdp', 'consumer-360', 'data-cloud'],
  },
  {
    filename: 'Experiential-Promotions-24 GTM- Offering Toolkit v2.1.pdf',
    shortName: 'Experiential Promotions',
    discipline: 'loyalty',
    topics: ['promotions', 'experiential', 'sweepstakes', 'contests', 'engagement'],
  },
  {
    filename: 'Gamification-Branded-Games-24 GTM- Offering Toolkit v2.1.pdf',
    shortName: 'Gamification & Branded Games',
    discipline: 'loyalty',
    topics: ['gamification', 'games', 'engagement', 'behavioral', 'interactive'],
  },
];

// Also include NBC_V2 parts
const NBC_PARTS = Array.from({ length: 12 }, (_, i) => ({
  filename: `NBC_V2-part-${i + 1}.pdf`,
  shortName: `NBC V2 Part ${i + 1}`,
  discipline: 'messaging-personalization',
  topics: ['maturity', 'framework', 'salesforce', 'marketing-cloud', 'best-practices'],
}));

// ============================================================================
// EXTRACTION LOGIC
// ============================================================================

function cleanText(text: string): string {
  return text
    // Normalize whitespace
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    // Remove excessive blank lines
    .replace(/\n{4,}/g, '\n\n\n')
    // Remove page numbers/footers
    .replace(/©\s*20\d{2}\s*Merkle.*?Confidential\.?/gi, '')
    .replace(/INTERNAL/g, '')
    .replace(/EXTERNAL/g, '')
    // Clean up bullet artifacts
    .replace(/•\s*/g, '• ')
    // Remove excessive spaces
    .replace(/ {3,}/g, '  ')
    .trim();
}

function detectChunkType(text: string, section: string): KnowledgeChunk['chunkType'] {
  const lower = text.toLowerCase() + ' ' + section.toLowerCase();

  if (lower.includes('pricing') || lower.includes('$') || lower.includes('usd') || lower.includes('cost')) {
    return 'pricing';
  }
  if (lower.includes('offering summary') || lower.includes('what it is') || lower.includes('key business outcomes')) {
    return 'offering-summary';
  }
  if (lower.includes('case stud') || lower.includes('client example') || lower.includes('results')) {
    return 'case-study';
  }
  if (lower.includes('methodology') || lower.includes('approach') || lower.includes('framework') || lower.includes('maturity')) {
    return 'methodology';
  }
  if (lower.includes('market') || lower.includes('industry') || lower.includes('trend') || lower.includes('statistic')) {
    return 'market-data';
  }
  if (lower.includes('sales') || lower.includes('pitch') || lower.includes('value prop') || lower.includes('narrative')) {
    return 'sales-narrative';
  }
  if (lower.includes('engagement definition') || lower.includes('wedge') || lower.includes('package')) {
    return 'engagement-definition';
  }
  if (lower.includes('strategic') || lower.includes('strategy') || lower.includes('vision') || lower.includes('pov')) {
    return 'strategic-framework';
  }
  if (lower.includes('capability') || lower.includes('feature') || lower.includes('platform')) {
    return 'capability';
  }
  return 'general';
}

function extractPricePoints(text: string): string[] {
  const prices: string[] = [];
  // Match patterns like $50K, $100-$350K, $1M+, $50-150k USD
  const priceRegex = /\$[\d,.]+[kKmM]?\s*[-–]?\s*\$?[\d,.]*[kKmM]?\+?\s*(?:USD)?/g;
  const matches = text.match(priceRegex);
  if (matches) {
    prices.push(...matches.map(m => m.trim()));
  }
  return [...new Set(prices)];
}

function extractOfferings(text: string): string[] {
  const offerings: string[] = [];
  const offeringPatterns = [
    /(?:Messaging|CRM)\s+(?:Tech|Strategy)\s+Assessment/gi,
    /CRM\s+(?:Strategy\s+)?Blueprint/gi,
    /CRM\s+Implementation\s+or\s+Migration/gi,
    /Intelligent\s+Messaging/gi,
    /Loyalty\s+(?:Program\s+)?Assessment/gi,
    /Loyalty\s+Blueprint/gi,
    /Salesforce\s+Loyalty\s+Management\s+Implementation/gi,
    /Loyalty\s+Partnerships/gi,
    /AI\s+Data\s+Readiness\s+Audit/gi,
    /Data\s+Strategy/gi,
    /Martech\s+Roadmap/gi,
    /Merkury\s+Consumer\s+360/gi,
    /Clean\s+Room/gi,
    /Gamification\s+(?:Assessment|Workshop|Blueprint|Concepts|Feature\s+Design)/gi,
    /Promotion(?:s)?\s+(?:Assessment|Strategy|Blueprint|Platform)/gi,
  ];
  for (const pattern of offeringPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      offerings.push(...matches.map(m => m.trim()));
    }
  }
  return [...new Set(offerings)];
}

/**
 * Split PDF text into semantic chunks based on slide/section boundaries.
 * PDFs from these offering toolkits are slide-based, so we chunk by
 * detecting slide boundaries (page breaks, numbered slides, section headers).
 */
function chunkText(text: string, source: typeof PDF_SOURCES[0]): Omit<KnowledgeChunk, 'id'>[] {
  const chunks: Omit<KnowledgeChunk, 'id'>[] = [];

  // Split by double+ newlines (rough slide/section boundaries)
  const sections = text.split(/\n{2,}/);

  let currentSection = '';
  let currentContent = '';
  let slideNumber = 0;

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed || trimmed.length < 20) continue;

    // Detect section headers (ALL CAPS lines, or lines that look like headers)
    const isHeader = /^[A-Z\s&/]{10,}$/.test(trimmed.split('\n')[0]) ||
      /^(?:OFFERING|WHAT'S|ENGAGEMENT|SALES|VALUE|KEY|ABOUT|MARKET)/.test(trimmed);

    if (isHeader && currentContent.length > 100) {
      // Save previous chunk
      const content = currentContent.trim();
      if (content.length > 50) {
        chunks.push({
          source: source.filename,
          sourceShortName: source.shortName,
          section: currentSection || `Section ${slideNumber}`,
          content,
          topics: [...source.topics],
          disciplines: [source.discipline],
          chunkType: detectChunkType(content, currentSection),
          offerings: extractOfferings(content),
          pricePoints: extractPricePoints(content),
        });
      }
      currentSection = trimmed.split('\n')[0].trim();
      currentContent = trimmed;
      slideNumber++;
    } else {
      currentContent += '\n\n' + trimmed;
    }

    // Force chunk break if content gets too large (~2000 chars)
    if (currentContent.length > 2000) {
      const content = currentContent.trim();
      chunks.push({
        source: source.filename,
        sourceShortName: source.shortName,
        section: currentSection || `Section ${slideNumber}`,
        content,
        topics: [...source.topics],
        disciplines: [source.discipline],
        chunkType: detectChunkType(content, currentSection),
        offerings: extractOfferings(content),
        pricePoints: extractPricePoints(content),
      });
      currentContent = '';
      slideNumber++;
    }
  }

  // Save final chunk
  if (currentContent.trim().length > 50) {
    chunks.push({
      source: source.filename,
      sourceShortName: source.shortName,
      section: currentSection || `Section ${slideNumber}`,
      content: currentContent.trim(),
      topics: [...source.topics],
      disciplines: [source.discipline],
      chunkType: detectChunkType(currentContent, currentSection),
      offerings: extractOfferings(currentContent),
      pricePoints: extractPricePoints(currentContent),
    });
  }

  return chunks;
}

// ============================================================================
// MAIN EXTRACTION
// ============================================================================

async function extractKnowledge(): Promise<void> {
  const scriptDir = path.dirname(new URL(import.meta.url).pathname);
  const referencePath = path.resolve(scriptDir, '../../reference');
  const rootPath = path.resolve(scriptDir, '../..');
  const outputPath = path.resolve(scriptDir, 'knowledge-base.json');

  const knowledgeBase: KnowledgeBase = {
    version: '1.0.0',
    extractedAt: new Date().toISOString(),
    sources: [],
    chunks: [],
  };

  let chunkId = 0;

  // Process new reference PDFs
  for (const source of PDF_SOURCES) {
    const pdfPath = path.join(referencePath, source.filename);

    if (!fs.existsSync(pdfPath)) {
      console.warn(`  SKIP: ${source.filename} not found`);
      continue;
    }

    console.log(`Processing: ${source.shortName}...`);

    try {
      const rawText = await extractPdfText(pdfPath);
      const cleanedText = cleanText(rawText);
      const wordCount = cleanedText.split(/\s+/).length;

      const chunks = chunkText(cleanedText, source);

      // Add IDs to chunks
      for (const chunk of chunks) {
        knowledgeBase.chunks.push({
          ...chunk,
          id: `chunk-${chunkId++}`,
        });
      }

      knowledgeBase.sources.push({
        filename: source.filename,
        shortName: source.shortName,
        discipline: source.discipline,
        wordCount,
        chunkCount: chunks.length,
      });

      console.log(`  → ${wordCount} words, ${chunks.length} chunks`);
    } catch (err) {
      console.error(`  ERROR processing ${source.filename}:`, err);
    }
  }

  // Process NBC_V2 parts
  for (const source of NBC_PARTS) {
    const pdfPath = path.join(rootPath, source.filename);

    if (!fs.existsSync(pdfPath)) {
      console.warn(`  SKIP: ${source.filename} not found`);
      continue;
    }

    console.log(`Processing: ${source.shortName}...`);

    try {
      const rawText = await extractPdfText(pdfPath);
      const cleanedText = cleanText(rawText);
      const wordCount = cleanedText.split(/\s+/).length;

      const chunks = chunkText(cleanedText, source);

      for (const chunk of chunks) {
        knowledgeBase.chunks.push({
          ...chunk,
          id: `chunk-${chunkId++}`,
        });
      }

      knowledgeBase.sources.push({
        filename: source.filename,
        shortName: source.shortName,
        discipline: source.discipline,
        wordCount,
        chunkCount: chunks.length,
      });

      console.log(`  → ${wordCount} words, ${chunks.length} chunks`);
    } catch (err) {
      console.error(`  ERROR processing ${source.filename}:`, err);
    }
  }

  // Write knowledge base
  fs.writeFileSync(outputPath, JSON.stringify(knowledgeBase, null, 2));

  console.log(`\nKnowledge base written to: ${outputPath}`);
  console.log(`  Sources: ${knowledgeBase.sources.length}`);
  console.log(`  Total chunks: ${knowledgeBase.chunks.length}`);
  console.log(`  Total words: ${knowledgeBase.sources.reduce((sum, s) => sum + s.wordCount, 0)}`);
}

extractKnowledge().catch(console.error);
