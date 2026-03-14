/**
 * PowerPoint export for generated plans.
 * Uses pptxgenjs to build a branded deck from GeneratedPlan + OpportunityAssessment data.
 */

import PptxGenJS from 'pptxgenjs';
import type { GeneratedPlan, OpportunityAssessment } from '../types';

// ─── Brand constants ─────────────────────────────────────────────────────────
const C = {
  blue: '0057A3',         // Merkle blue
  cyan: '00B5E2',         // Merkle cyan
  teal: '00A5B5',         // Merkle teal
  dark: '001E3C',         // Title-slide dark navy
  white: 'FFFFFF',
  offWhite: 'F8FAFC',
  textDark: '1E293B',
  textMid: '475569',
  textLight: '94A3B8',
  border: 'E2E8F0',
  phase: ['0057A3', 'EA580C', '059669', '7C3AED'] as const,
  priority: {
    critical: 'DC2626',
    high: 'EA580C',
    medium: 'D97706',
    low: '3B82F6',
    'nice-to-have': '3B82F6',
  } as Record<string, string>,
};

// Slide dimensions (LAYOUT_WIDE = 13.33" × 7.5")
const W = 13.33;
const H = 7.5;
const PAD = 0.6; // standard margin

// ─── Helpers ─────────────────────────────────────────────────────────────────

function addBackground(slide: PptxGenJS.Slide, color: string) {
  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x: 0, y: 0, w: W, h: H,
    fill: { color },
    line: { color, width: 0 },
  });
}

function addAccentBar(slide: PptxGenJS.Slide, color = C.cyan, thickness = 0.06) {
  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x: 0, y: 0, w: W, h: thickness,
    fill: { color },
    line: { color, width: 0 },
  });
}

function addSlideTitle(slide: PptxGenJS.Slide, title: string, y = 0.35) {
  slide.addText(title, {
    x: PAD, y, w: W - PAD * 2, h: 0.45,
    fontSize: 20,
    bold: true,
    color: C.textDark,
    fontFace: 'Calibri',
  });
  // Underline rule
  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x: PAD, y: y + 0.5, w: W - PAD * 2, h: 0.02,
    fill: { color: C.border },
    line: { color: C.border, width: 0 },
  });
}

function addFooter(slide: PptxGenJS.Slide, client: string, date: string) {
  slide.addText(`${client}  ·  Confidential  ·  ${date}`, {
    x: PAD, y: H - 0.32, w: W - PAD * 2, h: 0.25,
    fontSize: 8,
    color: C.textLight,
    fontFace: 'Calibri',
    align: 'right',
  });
  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x: 0, y: H - 0.06, w: W, h: 0.06,
    fill: { color: C.blue },
    line: { color: C.blue, width: 0 },
  });
}

function labelValuePair(
  slide: PptxGenJS.Slide,
  label: string,
  value: string,
  x: number, y: number, w: number,
) {
  slide.addText(label.toUpperCase(), {
    x, y, w, h: 0.18,
    fontSize: 7, bold: true, color: C.cyan, fontFace: 'Calibri',
  });
  slide.addText(value, {
    x, y: y + 0.2, w, h: 0.28,
    fontSize: 11, color: C.textDark, fontFace: 'Calibri',
  });
}

function statBox(
  slide: PptxGenJS.Slide,
  value: string,
  label: string,
  x: number, y: number, w = 1.8, h = 0.9,
  color = C.blue,
) {
  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x, y, w, h,
    fill: { color: C.offWhite },
    line: { color: C.border, width: 1 },
    rectRadius: 0.06,
  });
  slide.addText(value, {
    x, y: y + 0.1, w, h: 0.45,
    fontSize: 22, bold: true, color, align: 'center', fontFace: 'Calibri',
  });
  slide.addText(label, {
    x, y: y + 0.52, w, h: 0.28,
    fontSize: 8, color: C.textMid, align: 'center', fontFace: 'Calibri',
  });
}

function bullet(
  slide: PptxGenJS.Slide,
  items: string[],
  x: number, y: number, w: number, h: number,
  options: Partial<PptxGenJS.TextPropsOptions> = {},
) {
  if (!items.length) return;
  slide.addText(
    items.map((t) => ({ text: t, options: { bullet: { type: 'bullet' }, paraSpaceAfter: 4 } })),
    { x, y, w, h, fontSize: 10, color: C.textMid, fontFace: 'Calibri', valign: 'top', ...options },
  );
}

// ─── Slide builders ──────────────────────────────────────────────────────────

function addTitleSlide(pptx: PptxGenJS, plan: GeneratedPlan, assessment?: OpportunityAssessment | null) {
  const slide = pptx.addSlide();

  // Dark navy background
  addBackground(slide, C.dark);

  // Cyan accent top bar
  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x: 0, y: 0, w: W, h: 0.12,
    fill: { color: C.cyan }, line: { color: C.cyan, width: 0 },
  });

  // Blue vertical left band
  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x: 0, y: 0.12, w: 0.5, h: H - 0.12,
    fill: { color: C.blue }, line: { color: C.blue, width: 0 },
  });

  // "MERKLE | dentsu" wordmark (top-left)
  slide.addText('MERKLE  |  dentsu', {
    x: 0.7, y: 0.2, w: 4, h: 0.35,
    fontSize: 11, bold: true, color: C.white, fontFace: 'Calibri',
    charSpacing: 2,
  });

  // Client name — hero text
  slide.addText(plan.executiveSummary.clientName, {
    x: 0.7, y: 1.8, w: W - 1.2, h: 1.1,
    fontSize: 40, bold: true, color: C.white, fontFace: 'Calibri',
  });

  // Opportunity name
  if (plan.executiveSummary.opportunityName) {
    slide.addText(plan.executiveSummary.opportunityName, {
      x: 0.7, y: 2.95, w: W - 1.2, h: 0.5,
      fontSize: 18, color: C.cyan, fontFace: 'Calibri',
    });
  }

  // "Personalized Roadmap" label
  const labelY = plan.executiveSummary.opportunityName ? 3.55 : 3.05;
  slide.addText('Personalized Implementation Roadmap', {
    x: 0.7, y: labelY, w: W - 1.2, h: 0.4,
    fontSize: 14, color: '8FBFE8', fontFace: 'Calibri',
  });

  // Discipline tags (if present)
  const disciplines = assessment?.disciplines || [];
  if (disciplines.length > 0) {
    const tags = disciplines.map((d) => {
      const names: Record<string, string> = {
        'messaging-personalization': 'Messaging & Personalization',
        loyalty: 'Loyalty',
        commerce: 'Commerce',
        service: 'Service',
        abm: 'Account-Based Marketing',
        abs: 'Account-Based Selling',
        absa: 'Account-Based Service',
      };
      return names[d] || d;
    });
    slide.addText(tags.join('  ·  '), {
      x: 0.7, y: labelY + 0.5, w: W - 1.2, h: 0.32,
      fontSize: 10, color: '6BA3D0', fontFace: 'Calibri',
    });
  }

  // Date + industry bottom row
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const industryStr = assessment?.industry
    ? {
        'retail-cpg-qsr': 'Retail, CPG & QSR',
        'financial-services': 'Financial Services',
        'healthcare-life-sciences': 'Healthcare & Life Sciences',
        manufacturing: 'Manufacturing',
        'travel-hospitality': 'Travel & Hospitality',
        'media-entertainment': 'Media & Entertainment',
        technology: 'Technology',
      }[assessment.industry] ?? assessment.industry
    : '';

  slide.addText(
    [industryStr, dateStr].filter(Boolean).join('  ·  '),
    {
      x: 0.7, y: H - 0.8, w: W - 1.2, h: 0.3,
      fontSize: 9, color: '6BA3D0', fontFace: 'Calibri',
    },
  );

  // Confidential footer
  slide.addText('Confidential — Prepared by Merkle', {
    x: 0.7, y: H - 0.5, w: W - 1.2, h: 0.28,
    fontSize: 8, color: '4A6FA5', fontFace: 'Calibri',
  });
}

function addExecutiveSummarySlide(pptx: PptxGenJS, plan: GeneratedPlan, dateStr: string) {
  const slide = pptx.addSlide();
  addAccentBar(slide);
  addSlideTitle(slide, 'Executive Summary');
  addFooter(slide, plan.executiveSummary.clientName, dateStr);

  const es = plan.executiveSummary;

  // Overall recommendation — large callout box
  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x: PAD, y: 1.05, w: W - PAD * 2, h: 1.1,
    fill: { color: '002D6B' },
    line: { color: '002D6B', width: 0 },
    rectRadius: 0.07,
  });
  slide.addText(es.overallRecommendation, {
    x: PAD + 0.2, y: 1.1, w: W - PAD * 2 - 0.4, h: 1.0,
    fontSize: 13, color: C.white, fontFace: 'Calibri', bold: true, valign: 'middle',
  });

  // Strategic rationale
  slide.addText(es.strategicRationale, {
    x: PAD, y: 2.3, w: W * 0.62, h: 1.5,
    fontSize: 10, color: C.textMid, fontFace: 'Calibri', valign: 'top',
    wrap: true,
  });

  // Stat boxes — right column
  const sx = PAD + W * 0.65;
  const sy = 2.3;
  const sbW = 1.65;
  const sbGap = 0.12;

  statBox(slide, String(es.totalCapabilities), 'Capabilities\nRecommended', sx, sy, sbW);
  statBox(slide, String(es.immediateCapabilities), 'Immediate\nOpportunities', sx + sbW + sbGap, sy, sbW, 0.9, C.cyan.replace('#', ''));
  statBox(slide, String(es.nearFutureCapabilities), 'Near-Future\nCapabilities', sx, sy + 1.0, sbW, 0.9, '059669');
  statBox(slide, es.recommendedTimeframe, 'Recommended\nTimeframe', sx + sbW + sbGap, sy + 1.0, sbW, 0.9, 'EA580C');

  // Phases summary row
  if (plan.phases.length > 0) {
    slide.addText('IMPLEMENTATION OVERVIEW', {
      x: PAD, y: 4.0, w: W - PAD * 2, h: 0.22,
      fontSize: 7.5, bold: true, color: C.cyan, fontFace: 'Calibri', charSpacing: 1.5,
    });

    const phaseW = (W - PAD * 2) / plan.phases.length - 0.1;
    plan.phases.forEach((phase, i) => {
      const px = PAD + i * (phaseW + 0.1);
      const pcolor = C.phase[i] || C.phase[0];
      slide.addShape('rect' as PptxGenJS.ShapeType, {
        x: px, y: 4.3, w: phaseW, h: 1.65,
        fill: { color: C.offWhite },
        line: { color: pcolor, width: 2 },
        rectRadius: 0.06,
      });
      // Phase color top bar
      slide.addShape('rect' as PptxGenJS.ShapeType, {
        x: px, y: 4.3, w: phaseW, h: 0.18,
        fill: { color: pcolor },
        line: { color: pcolor, width: 0 },
        rectRadius: 0.06,
      });
      slide.addText(`Phase ${phase.phaseNumber}: ${phase.name}`, {
        x: px + 0.1, y: 4.52, w: phaseW - 0.2, h: 0.3,
        fontSize: 9.5, bold: true, color: C.textDark, fontFace: 'Calibri',
      });
      slide.addText(phase.duration, {
        x: px + 0.1, y: 4.84, w: phaseW - 0.2, h: 0.22,
        fontSize: 8.5, color: pcolor, fontFace: 'Calibri',
      });
      slide.addText(`${phase.capabilities.length} capabilities`, {
        x: px + 0.1, y: 5.06, w: phaseW - 0.2, h: 0.22,
        fontSize: 8, color: C.textMid, fontFace: 'Calibri',
      });
      if (phase.totalEstimate) {
        slide.addText(phase.totalEstimate, {
          x: px + 0.1, y: 5.3, w: phaseW - 0.2, h: 0.22,
          fontSize: 8, color: C.textMid, fontFace: 'Calibri',
        });
      }
    });
  }
}

function addPhaseSlide(
  pptx: PptxGenJS,
  phase: GeneratedPlan['phases'][0],
  phaseIndex: number,
  plan: GeneratedPlan,
  dateStr: string,
) {
  const slide = pptx.addSlide();
  const pcolor = C.phase[phaseIndex] || C.phase[0];

  // Colored accent bar
  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x: 0, y: 0, w: W, h: 0.06,
    fill: { color: pcolor }, line: { color: pcolor, width: 0 },
  });

  // Phase header band
  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x: 0, y: 0.06, w: W, h: 0.72,
    fill: { color: pcolor }, line: { color: pcolor, width: 0 },
  });
  slide.addText(`Phase ${phase.phaseNumber}: ${phase.name}`, {
    x: PAD, y: 0.1, w: W * 0.65, h: 0.5,
    fontSize: 18, bold: true, color: C.white, fontFace: 'Calibri',
  });
  slide.addText(phase.duration, {
    x: W * 0.68, y: 0.1, w: W * 0.28, h: 0.25,
    fontSize: 11, color: 'CCEEFF', fontFace: 'Calibri', align: 'right',
  });
  if (phase.totalEstimate) {
    slide.addText(phase.totalEstimate, {
      x: W * 0.68, y: 0.36, w: W * 0.28, h: 0.25,
      fontSize: 10, color: 'CCEEFF', fontFace: 'Calibri', align: 'right',
    });
  }

  addFooter(slide, plan.executiveSummary.clientName, dateStr);

  // Description
  slide.addText(phase.description, {
    x: PAD, y: 0.9, w: W - PAD * 2, h: 0.45,
    fontSize: 10, color: C.textMid, fontFace: 'Calibri',
  });

  // ── Capabilities table ──
  const colCapW = W * 0.38;
  const colRatW = W * 0.35;
  const colPriW = W * 0.13;
  const tableY = 1.45;
  const rowH = 0.38;

  // Header row
  const headerColor = 'E8F0FA';
  [[0, colCapW, 'Capability'], [colCapW + 0.06, colRatW, 'Rationale'], [colCapW + colRatW + 0.12, colPriW, 'Priority']].forEach(
    ([x, w, label]) => {
      slide.addShape('rect' as PptxGenJS.ShapeType, {
        x: PAD + (x as number), y: tableY, w: w as number, h: 0.3,
        fill: { color: headerColor }, line: { color: C.border, width: 1 },
      });
      slide.addText(label as string, {
        x: PAD + (x as number) + 0.08, y: tableY + 0.05, w: (w as number) - 0.12, h: 0.22,
        fontSize: 8.5, bold: true, color: C.textDark, fontFace: 'Calibri',
      });
    },
  );

  // Limit rows to available space
  const maxRows = Math.min(phase.capabilities.length, 9);
  phase.capabilities.slice(0, maxRows).forEach((cap, ci) => {
    const ry = tableY + 0.3 + ci * rowH;
    const bg = ci % 2 === 0 ? C.white : 'F8FAFC';

    [[0, colCapW], [colCapW + 0.06, colRatW], [colCapW + colRatW + 0.12, colPriW]].forEach(([x, w]) => {
      slide.addShape('rect' as PptxGenJS.ShapeType, {
        x: PAD + (x as number), y: ry, w: w as number, h: rowH,
        fill: { color: bg }, line: { color: C.border, width: 1 },
      });
    });

    // Capability name
    slide.addText(cap.capabilityName, {
      x: PAD + 0.08, y: ry + 0.04, w: colCapW - 0.12, h: rowH - 0.08,
      fontSize: 9, bold: true, color: C.textDark, fontFace: 'Calibri', valign: 'middle',
    });

    // Rationale
    slide.addText(cap.rationale || '', {
      x: PAD + colCapW + 0.14, y: ry + 0.04, w: colRatW - 0.12, h: rowH - 0.08,
      fontSize: 8, color: C.textMid, fontFace: 'Calibri', valign: 'middle',
    });

    // Priority badge
    const priColor = C.priority[cap.priority] || C.priority.low;
    const priLabel = cap.priority.charAt(0).toUpperCase() + cap.priority.slice(1).replace('-', ' ');
    slide.addShape('rect' as PptxGenJS.ShapeType, {
      x: PAD + colCapW + colRatW + 0.2, y: ry + 0.1, w: colPriW - 0.12, h: 0.2,
      fill: { color: priColor }, line: { color: priColor, width: 0 }, rectRadius: 0.04,
    });
    slide.addText(priLabel, {
      x: PAD + colCapW + colRatW + 0.2, y: ry + 0.1, w: colPriW - 0.12, h: 0.2,
      fontSize: 7, bold: true, color: C.white, align: 'center', fontFace: 'Calibri',
    });
  });

  if (phase.capabilities.length > maxRows) {
    slide.addText(`+ ${phase.capabilities.length - maxRows} more capabilities`, {
      x: PAD, y: tableY + 0.3 + maxRows * rowH + 0.05, w: 4, h: 0.22,
      fontSize: 8, color: C.textLight, fontFace: 'Calibri',
    });
  }

  // ── Key Milestones ── (right column if space)
  if (phase.keyMilestones.length > 0) {
    const milY = tableY + 0.3 + Math.min(maxRows, 5) * rowH + 0.15;
    if (milY < H - 0.6) {
      slide.addText('KEY MILESTONES', {
        x: PAD, y: milY, w: 5, h: 0.2,
        fontSize: 7.5, bold: true, color: C.cyan, fontFace: 'Calibri', charSpacing: 1.5,
      });
      bullet(slide, phase.keyMilestones.slice(0, 4), PAD, milY + 0.22, W * 0.55, 1.0);
    }
  }
}

function addQuickWinsSlide(pptx: PptxGenJS, plan: GeneratedPlan, dateStr: string) {
  if (!plan.quickWins.length) return;
  const slide = pptx.addSlide();
  addAccentBar(slide, C.teal);
  addSlideTitle(slide, 'Quick Wins — Where to Start Immediately');
  addFooter(slide, plan.executiveSummary.clientName, dateStr);

  const cols = Math.min(plan.quickWins.length, 4);
  const cardW = (W - PAD * 2 - 0.1 * (cols - 1)) / cols;

  plan.quickWins.slice(0, 4).forEach((win, i) => {
    const cx = PAD + i * (cardW + 0.1);
    slide.addShape('rect' as PptxGenJS.ShapeType, {
      x: cx, y: 1.1, w: cardW, h: 4.5,
      fill: { color: C.offWhite }, line: { color: C.teal, width: 2 }, rectRadius: 0.08,
    });
    slide.addShape('rect' as PptxGenJS.ShapeType, {
      x: cx, y: 1.1, w: cardW, h: 0.2,
      fill: { color: C.teal }, line: { color: C.teal, width: 0 }, rectRadius: 0.08,
    });
    // Win number
    slide.addText(`${i + 1}`, {
      x: cx + 0.1, y: 1.38, w: 0.35, h: 0.38,
      fontSize: 18, bold: true, color: C.teal, fontFace: 'Calibri',
    });
    // Name
    slide.addText(win.capabilityName, {
      x: cx + 0.5, y: 1.38, w: cardW - 0.6, h: 0.42,
      fontSize: 10.5, bold: true, color: C.textDark, fontFace: 'Calibri', valign: 'middle',
    });
    // Description
    slide.addText(win.description, {
      x: cx + 0.15, y: 1.9, w: cardW - 0.3, h: 1.6,
      fontSize: 9, color: C.textMid, fontFace: 'Calibri', valign: 'top', wrap: true,
    });
    // Impact
    slide.addText('EXPECTED IMPACT', {
      x: cx + 0.15, y: 3.6, w: cardW - 0.3, h: 0.2,
      fontSize: 7, bold: true, color: C.teal, fontFace: 'Calibri', charSpacing: 1,
    });
    slide.addText(win.impact, {
      x: cx + 0.15, y: 3.82, w: cardW - 0.3, h: 0.8,
      fontSize: 8.5, color: C.textDark, fontFace: 'Calibri', valign: 'top', wrap: true,
    });
  });
}

function addInvestmentSlide(pptx: PptxGenJS, plan: GeneratedPlan, dateStr: string) {
  const slide = pptx.addSlide();
  addAccentBar(slide);
  addSlideTitle(slide, 'Commercial Recommendation & Investment');
  addFooter(slide, plan.executiveSummary.clientName, dateStr);

  const cs = plan.commercialSummary;

  // Recommended model box
  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x: PAD, y: 1.1, w: W * 0.42, h: 1.5,
    fill: { color: '002D6B' }, line: { color: '002D6B', width: 0 }, rectRadius: 0.07,
  });
  slide.addText('RECOMMENDED ENGAGEMENT MODEL', {
    x: PAD + 0.15, y: 1.18, w: W * 0.4, h: 0.22,
    fontSize: 7.5, bold: true, color: C.cyan, fontFace: 'Calibri', charSpacing: 1,
  });
  slide.addText(cs.recommendedModel, {
    x: PAD + 0.15, y: 1.42, w: W * 0.4, h: 0.38,
    fontSize: 13, bold: true, color: C.white, fontFace: 'Calibri',
  });
  slide.addText(cs.modelRationale, {
    x: PAD + 0.15, y: 1.82, w: W * 0.4, h: 0.65,
    fontSize: 9, color: '8FBFE8', fontFace: 'Calibri', valign: 'top',
  });

  // Phased investment table
  const tableX = PAD + W * 0.45;
  const tableW = W - tableX - PAD;

  slide.addText('PHASED INVESTMENT', {
    x: tableX, y: 1.1, w: tableW, h: 0.22,
    fontSize: 7.5, bold: true, color: C.cyan, fontFace: 'Calibri', charSpacing: 1,
  });

  const rowH = 0.42;
  cs.phasedInvestment.slice(0, 4).forEach((ph, i) => {
    const ry = 1.36 + i * rowH;
    const pcolor = C.phase[i] || C.phase[0];
    slide.addShape('rect' as PptxGenJS.ShapeType, {
      x: tableX, y: ry, w: 0.06, h: rowH - 0.04,
      fill: { color: pcolor }, line: { color: pcolor, width: 0 },
    });
    slide.addText(`Phase ${ph.phase}`, {
      x: tableX + 0.12, y: ry + 0.04, w: 0.7, h: 0.2,
      fontSize: 8.5, bold: true, color: pcolor, fontFace: 'Calibri',
    });
    slide.addText(ph.description, {
      x: tableX + 0.12, y: ry + 0.24, w: tableW * 0.55, h: 0.18,
      fontSize: 8, color: C.textMid, fontFace: 'Calibri',
    });
    slide.addText(ph.estimateRange, {
      x: tableX + tableW * 0.6, y: ry + 0.08, w: tableW * 0.38, h: 0.28,
      fontSize: 12, bold: true, color: C.textDark, fontFace: 'Calibri', align: 'right',
    });
  });

  // Total investment (from plan summary if available)
  if (plan.executiveSummary.estimatedTotalInvestment) {
    slide.addShape('rect' as PptxGenJS.ShapeType, {
      x: tableX, y: 1.36 + cs.phasedInvestment.length * rowH + 0.1, w: tableW, h: 0.42,
      fill: { color: 'E8F0FA' }, line: { color: C.blue, width: 1 }, rectRadius: 0.04,
    });
    slide.addText('Total Estimated Investment', {
      x: tableX + 0.15, y: 1.36 + cs.phasedInvestment.length * rowH + 0.18, w: tableW * 0.6, h: 0.25,
      fontSize: 9, bold: true, color: C.textDark, fontFace: 'Calibri',
    });
    slide.addText(plan.executiveSummary.estimatedTotalInvestment, {
      x: tableX, y: 1.36 + cs.phasedInvestment.length * rowH + 0.18, w: tableW - 0.15, h: 0.25,
      fontSize: 12, bold: true, color: C.blue, fontFace: 'Calibri', align: 'right',
    });
  }

  // Foundation requirements
  const frY = 2.8;
  const notMetReqs = plan.foundationRequirements.filter((r) => r.status !== 'met');
  if (notMetReqs.length > 0) {
    slide.addText('FOUNDATION REQUIREMENTS', {
      x: PAD, y: frY, w: W * 0.42, h: 0.22,
      fontSize: 7.5, bold: true, color: C.cyan, fontFace: 'Calibri', charSpacing: 1,
    });
    bullet(
      slide,
      notMetReqs.slice(0, 5).map((r) => `${r.requirement} (${r.status.replace('-', ' ')})`),
      PAD, frY + 0.25, W * 0.42, 1.8,
    );
  }

  // Alternative models
  if (cs.alternativeModels && cs.alternativeModels.length > 0) {
    slide.addText('ALTERNATIVE MODELS', {
      x: PAD, y: frY + 2.1, w: W * 0.42, h: 0.22,
      fontSize: 7.5, bold: true, color: C.textLight, fontFace: 'Calibri', charSpacing: 1,
    });
    bullet(
      slide,
      cs.alternativeModels.slice(0, 3).map((m) => `${m.model}: ${m.tradeoffs}`),
      PAD, frY + 2.35, W * 0.42, 1.2,
      { fontSize: 8.5, color: C.textLight },
    );
  }
}

function addSuccessMetricsSlide(pptx: PptxGenJS, plan: GeneratedPlan, dateStr: string) {
  if (!plan.successMetrics.length) return;
  const slide = pptx.addSlide();
  addAccentBar(slide, '059669');
  addSlideTitle(slide, 'Success Metrics & KPIs');
  addFooter(slide, plan.executiveSummary.clientName, dateStr);

  const cols = 3;
  const rows = Math.ceil(Math.min(plan.successMetrics.length, 9) / cols);
  const cardW = (W - PAD * 2 - 0.1 * (cols - 1)) / cols;
  const cardH = (H - 1.7) / rows - 0.1;

  plan.successMetrics.slice(0, 9).forEach((m, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = PAD + col * (cardW + 0.1);
    const cy = 1.15 + row * (cardH + 0.1);

    slide.addShape('rect' as PptxGenJS.ShapeType, {
      x: cx, y: cy, w: cardW, h: cardH,
      fill: { color: C.offWhite }, line: { color: C.border, width: 1 }, rectRadius: 0.06,
    });
    slide.addText(m.metric, {
      x: cx + 0.12, y: cy + 0.1, w: cardW - 0.24, h: 0.36,
      fontSize: 10, bold: true, color: C.textDark, fontFace: 'Calibri',
    });
    if (m.baseline) {
      labelValuePair(slide, 'Baseline', m.baseline, cx + 0.12, cy + 0.5, cardW * 0.45);
    }
    labelValuePair(slide, 'Target', m.target, cx + (m.baseline ? cardW * 0.5 : 0.12), cy + 0.5, cardW * 0.45);
    slide.addText(m.timeframe, {
      x: cx + 0.12, y: cy + cardH - 0.32, w: cardW - 0.24, h: 0.24,
      fontSize: 8, color: C.cyan, fontFace: 'Calibri',
    });
  });
}

function addRisksSlide(pptx: PptxGenJS, plan: GeneratedPlan, dateStr: string) {
  if (!plan.risks.length) return;
  const slide = pptx.addSlide();
  addAccentBar(slide, 'EA580C');
  addSlideTitle(slide, 'Key Risks & Mitigations');
  addFooter(slide, plan.executiveSummary.clientName, dateStr);

  const rowH = 0.7;
  const tableY = 1.1;
  const colWidths = [W * 0.32, W * 0.12, W * 0.12, W * 0.36];
  const headers = ['Risk', 'Likelihood', 'Impact', 'Mitigation'];
  const colX = colWidths.reduce<number[]>((acc, _w, i) => {
    acc.push(i === 0 ? PAD : acc[i - 1] + colWidths[i - 1] + 0.02);
    return acc;
  }, []);

  // Header row
  headers.forEach((h, i) => {
    slide.addShape('rect' as PptxGenJS.ShapeType, {
      x: colX[i], y: tableY, w: colWidths[i], h: 0.3,
      fill: { color: 'E8F0FA' }, line: { color: C.border, width: 1 },
    });
    slide.addText(h, {
      x: colX[i] + 0.08, y: tableY + 0.05, w: colWidths[i] - 0.12, h: 0.22,
      fontSize: 8.5, bold: true, color: C.textDark, fontFace: 'Calibri',
    });
  });

  const riskColors: Record<string, string> = { high: 'DC2626', medium: 'D97706', low: '059669' };

  plan.risks.slice(0, 8).forEach((risk, ri) => {
    const ry = tableY + 0.3 + ri * rowH;
    const bg = ri % 2 === 0 ? C.white : 'F8FAFC';
    colWidths.forEach((w, ci) => {
      slide.addShape('rect' as PptxGenJS.ShapeType, {
        x: colX[ci], y: ry, w, h: rowH,
        fill: { color: bg }, line: { color: C.border, width: 1 },
      });
    });
    slide.addText(risk.risk, {
      x: colX[0] + 0.08, y: ry + 0.08, w: colWidths[0] - 0.12, h: rowH - 0.12,
      fontSize: 8.5, color: C.textDark, fontFace: 'Calibri', valign: 'middle',
    });
    const lColor = riskColors[risk.likelihood] || C.textMid;
    const iColor = riskColors[risk.impact] || C.textMid;
    slide.addText(risk.likelihood.charAt(0).toUpperCase() + risk.likelihood.slice(1), {
      x: colX[1] + 0.08, y: ry + 0.08, w: colWidths[1] - 0.12, h: rowH - 0.12,
      fontSize: 9, bold: true, color: lColor, fontFace: 'Calibri', valign: 'middle',
    });
    slide.addText(risk.impact.charAt(0).toUpperCase() + risk.impact.slice(1), {
      x: colX[2] + 0.08, y: ry + 0.08, w: colWidths[2] - 0.12, h: rowH - 0.12,
      fontSize: 9, bold: true, color: iColor, fontFace: 'Calibri', valign: 'middle',
    });
    slide.addText(risk.mitigation, {
      x: colX[3] + 0.08, y: ry + 0.08, w: colWidths[3] - 0.12, h: rowH - 0.12,
      fontSize: 8.5, color: C.textMid, fontFace: 'Calibri', valign: 'middle',
    });
  });
}

function addNextStepsSlide(pptx: PptxGenJS, plan: GeneratedPlan, dateStr: string) {
  if (!plan.nextSteps.length) return;
  const slide = pptx.addSlide();
  addAccentBar(slide);
  addSlideTitle(slide, 'Next Steps');
  addFooter(slide, plan.executiveSummary.clientName, dateStr);

  const ownerConfig: Record<string, { color: string; label: string }> = {
    merkle: { color: C.blue, label: 'Merkle' },
    client: { color: '059669', label: 'Client' },
    joint: { color: 'EA580C', label: 'Joint' },
  };

  const rowH = 0.58;
  const tableY = 1.1;

  const colWidths = [W * 0.48, W * 0.16, W * 0.25];
  const headers = ['Action', 'Owner', 'Timeline'];
  const colX = colWidths.reduce<number[]>((acc, _w, i) => {
    acc.push(i === 0 ? PAD : acc[i - 1] + colWidths[i - 1] + 0.02);
    return acc;
  }, []);

  // Header row
  headers.forEach((h, i) => {
    slide.addShape('rect' as PptxGenJS.ShapeType, {
      x: colX[i], y: tableY, w: colWidths[i], h: 0.3,
      fill: { color: 'E8F0FA' }, line: { color: C.border, width: 1 },
    });
    slide.addText(h, {
      x: colX[i] + 0.08, y: tableY + 0.05, w: colWidths[i] - 0.12, h: 0.22,
      fontSize: 8.5, bold: true, color: C.textDark, fontFace: 'Calibri',
    });
  });

  plan.nextSteps.slice(0, 9).forEach((ns, i) => {
    const ry = tableY + 0.3 + i * rowH;
    const bg = i % 2 === 0 ? C.white : 'F8FAFC';
    colWidths.forEach((w, ci) => {
      slide.addShape('rect' as PptxGenJS.ShapeType, {
        x: colX[ci], y: ry, w, h: rowH,
        fill: { color: bg }, line: { color: C.border, width: 1 },
      });
    });
    // Step number + text
    slide.addText(`${i + 1}`, {
      x: colX[0] + 0.08, y: ry + 0.08, w: 0.25, h: rowH - 0.12,
      fontSize: 9, bold: true, color: C.blue, fontFace: 'Calibri', valign: 'middle',
    });
    slide.addText(ns.step, {
      x: colX[0] + 0.36, y: ry + 0.06, w: colWidths[0] - 0.4, h: rowH - 0.1,
      fontSize: 9, color: C.textDark, fontFace: 'Calibri', valign: 'middle',
    });
    const ownerCfg = ownerConfig[ns.owner] || ownerConfig.joint;
    slide.addShape('rect' as PptxGenJS.ShapeType, {
      x: colX[1] + 0.1, y: ry + 0.16, w: colWidths[1] - 0.2, h: 0.26,
      fill: { color: ownerCfg.color }, line: { color: ownerCfg.color, width: 0 }, rectRadius: 0.04,
    });
    slide.addText(ownerCfg.label, {
      x: colX[1] + 0.1, y: ry + 0.16, w: colWidths[1] - 0.2, h: 0.26,
      fontSize: 8, bold: true, color: C.white, align: 'center', fontFace: 'Calibri',
    });
    slide.addText(ns.timeline, {
      x: colX[2] + 0.08, y: ry + 0.08, w: colWidths[2] - 0.12, h: rowH - 0.12,
      fontSize: 9, color: C.textMid, fontFace: 'Calibri', valign: 'middle',
    });
  });
}

function addClosingSlide(pptx: PptxGenJS, plan: GeneratedPlan) {
  const slide = pptx.addSlide();
  addBackground(slide, C.dark);

  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x: 0, y: 0, w: W, h: 0.12,
    fill: { color: C.cyan }, line: { color: C.cyan, width: 0 },
  });
  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x: 0, y: 0.12, w: 0.5, h: H - 0.12,
    fill: { color: C.blue }, line: { color: C.blue, width: 0 },
  });

  slide.addText('Ready to move forward?', {
    x: 0.7, y: 2.0, w: W - 1.2, h: 0.75,
    fontSize: 28, bold: true, color: C.white, fontFace: 'Calibri',
  });
  slide.addText("Let's build your personalized roadmap together.", {
    x: 0.7, y: 2.85, w: W - 1.2, h: 0.45,
    fontSize: 15, color: C.cyan, fontFace: 'Calibri',
  });

  // Next step CTA
  if (plan.nextSteps.length > 0) {
    slide.addText(plan.nextSteps[0].step, {
      x: 0.7, y: 3.5, w: W - 1.2, h: 0.4,
      fontSize: 12, color: '8FBFE8', fontFace: 'Calibri',
    });
  }

  slide.addText('MERKLE  |  dentsu', {
    x: 0.7, y: H - 0.65, w: 4, h: 0.3,
    fontSize: 11, bold: true, color: '4A6FA5', fontFace: 'Calibri', charSpacing: 2,
  });
}

// ─── Main export function ─────────────────────────────────────────────────────

export async function generatePlanPptx(
  plan: GeneratedPlan,
  assessment?: OpportunityAssessment | null,
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Merkle';
  pptx.company = 'Merkle | dentsu';
  pptx.subject = `${plan.executiveSummary.clientName} — Personalized Roadmap`;
  pptx.title = plan.executiveSummary.opportunityName || `${plan.executiveSummary.clientName} Roadmap`;

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  // Slide order
  addTitleSlide(pptx, plan, assessment);
  addExecutiveSummarySlide(pptx, plan, dateStr);
  plan.phases.forEach((phase, i) => addPhaseSlide(pptx, phase, i, plan, dateStr));
  addQuickWinsSlide(pptx, plan, dateStr);
  addInvestmentSlide(pptx, plan, dateStr);
  addSuccessMetricsSlide(pptx, plan, dateStr);
  addRisksSlide(pptx, plan, dateStr);
  addNextStepsSlide(pptx, plan, dateStr);
  addClosingSlide(pptx, plan);

  const fileName = `${plan.executiveSummary.clientName.replace(/[^a-zA-Z0-9]/g, '-')}-roadmap-${
    new Date().toISOString().slice(0, 10)
  }.pptx`;

  await pptx.writeFile({ fileName });
}
