import { Look, MagazineEdition } from '../../types';

export interface StoryCropSpec {
  drawX: number;
  drawY: number;
  drawW: number;
  drawH: number;
  focalX: number;
  focalY: number;
}

export interface StoryVisualSpec {
  editionId: 'august' | 'september' | 'october';
  viewportW: number;
  viewportH: number;
  crop: StoryCropSpec;
  accentColor: string;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Calculates canonical object-fit: cover coordinates with focal point matching DOM CSS.
 */
export function calculateStoryCrop(
  viewportW: number,
  viewportH: number,
  imgW: number,
  imgH: number,
  focalX: number,
  focalY: number
): StoryCropSpec {
  const imgAspect = imgW && imgH ? imgW / imgH : 5 / 7;
  const containerAspect = viewportW / viewportH;

  let drawW = viewportW;
  let drawH = viewportH;
  let drawX = 0;
  let drawY = 0;

  if (containerAspect > imgAspect) {
    drawW = viewportW;
    drawH = viewportW / imgAspect;
    drawY = (viewportH - drawH) * focalY;
    drawX = 0;
  } else {
    drawH = viewportH;
    drawW = viewportH * imgAspect;
    drawX = (viewportW - drawW) * focalX;
    drawY = 0;
  }

  return {
    drawX,
    drawY,
    drawW,
    drawH,
    focalX,
    focalY
  };
}

/**
 * Helper to wrap text into multiple lines given a max pixel width.
 */
export function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (!text) return [];
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Universal rounded rectangle helper.
 */
export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.arcTo(x + w, y, x + w, y + rad, rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.arcTo(x + w, y + h, x + w - rad, y + h, rad);
  ctx.lineTo(x + rad, y + h);
  ctx.arcTo(x, y + h, x, y + h - rad, rad);
  ctx.lineTo(x, y + rad);
  ctx.arcTo(x, y, x + rad, y, rad);
  ctx.closePath();
}

/**
 * Renders the story visually identical to the DOM story onto a canvas.
 * Consumes the exact typography, positions, paddings, focal points, and subtle vignettes.
 */
export function renderStoryToCanvas(
  ctx: CanvasRenderingContext2D,
  edition: MagazineEdition,
  look: Look,
  index: number,
  total: number,
  img: HTMLImageElement,
  W: number,
  H: number,
  scale: number
) {
  ctx.save();
  ctx.scale(scale, scale);

  const editionId = (edition.id || 'august') as 'august' | 'september' | 'october';
  const focalX = 0.5;
  const focalY = editionId === 'august' ? 0.45 : 0.5;
  const imgW = img.naturalWidth || img.width || 1000;
  const imgH = img.naturalHeight || img.height || 1400;
  const crop = calculateStoryCrop(W, H, imgW, imgH, focalX, focalY);

  // 1. Dark Base Background
  ctx.fillStyle = '#080d11';
  ctx.fillRect(0, 0, W, H);

  // 2. Full-bleed Photographic Layer
  if (img.complete && imgW > 0) {
    ctx.drawImage(img, crop.drawX, crop.drawY, crop.drawW, crop.drawH);
  }

  // 3. Editorial Subtle Vignette (Matching DOM CoverStorySurface line 168-173 at progress=1.0)
  // Top: 0.2 black * 0.3 opacity = 0.06; Bottom: 0.8 black * 0.3 opacity = 0.24
  const vig = ctx.createLinearGradient(0, H, 0, 0);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0.24)');
  vig.addColorStop(0.5, 'rgba(0, 0, 0, 0.0)');
  vig.addColorStop(1, 'rgba(0, 0, 0, 0.06)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  const accentColor = look.acento || '#e8b23a';
  const isMd = W >= 768;
  const indicatorSideX = isMd ? 48 : 24;
  const indicatorBottomY = H - 40;

  // =========================================================================
  // AUGUST COMPOSITION
  // =========================================================================
  if (editionId === 'august') {
    // B. Bottom Right Editorial Section: Chip, Headline, Subtitle
    ctx.save();
    const rightMargin = clamp(0.045 * W, 16, 44);
    const bottomMargin = clamp(0.05 * H, 22, 42);
    const sectionRightX = W - rightMargin;
    const sectionBottomY = H - bottomMargin;

    const maxSubW = Math.min(440, 0.82 * W);
    const subFontSize = 14.5;
    const subLineHeight = subFontSize * 1.58;
    ctx.font = `normal ${subFontSize}px "Space Grotesk", sans-serif`;
    const subLines = wrapCanvasText(ctx, look.sub || '', maxSubW);
    const subTotalH = (subLines.length - 1) * subLineHeight + subFontSize;

    const headlineFontSize = clamp(0.042 * W + 16, 30, 52);
    const headlineLineHeight = headlineFontSize * 1.04;
    const headlineLines =
      look.lineas && look.lineas.length > 0
        ? look.lineas
        : [{ t: look.chip, em: false }];
    const headlineTotalH =
      (headlineLines.length - 1) * headlineLineHeight + headlineFontSize;

    // Work upwards from sectionBottomY
    const subBaselineY = sectionBottomY;
    const headlineBottomY = subBaselineY - subTotalH - 14;

    // Draw Subtitle (lines from top to bottom)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `normal ${subFontSize}px "Space Grotesk", sans-serif`;
    ctx.fillStyle = '#f4f7f8';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;

    let currentSubY = subBaselineY - (subLines.length - 1) * subLineHeight;
    for (const sLine of subLines) {
      ctx.fillText(sLine, sectionRightX, currentSubY);
      currentSubY += subLineHeight;
    }

    // Draw Headline lines (Abril Fatface)
    ctx.font = `normal ${headlineFontSize}px "Abril Fatface", Georgia, serif`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    let curHeadY = headlineBottomY - (headlineLines.length - 1) * headlineLineHeight;
    for (let lIdx = 0; lIdx < headlineLines.length; lIdx++) {
      const line = headlineLines[lIdx];
      ctx.fillStyle = line.em ? accentColor : '#ffffff';
      ctx.fillText(line.t, sectionRightX, curHeadY);
      curHeadY += headlineLineHeight;
    }

    // Draw Chip above headline
    const chipY = headlineBottomY - headlineTotalH - 18;
    const chipText = (look.chip || '').toUpperCase();
    ctx.font = 'bold 11.5px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '3.4px';
    const chipTextW = ctx.measureText(chipText).width;
    const dotSpacing = 8;
    const dotDiameter = 5.5;
    const chipInnerW = chipTextW + dotSpacing + dotDiameter;
    const chipPadX = 11;
    const chipPadY = 4.5;
    const chipTotalW = chipInnerW + chipPadX * 2;
    const chipTotalH = 11.5 + chipPadY * 2;
    const chipLeftX = sectionRightX - chipTotalW;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = accentColor;
    drawRoundedRect(ctx, chipLeftX, chipY, chipTotalW, chipTotalH, 4);
    ctx.fill();

    // Chip text
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#0c1216';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(chipText, chipLeftX + chipPadX, chipY + chipTotalH / 2);

    // Chip dot
    ctx.beginPath();
    ctx.arc(
      chipLeftX + chipPadX + chipTextW + dotSpacing + dotDiameter / 2,
      chipY + chipTotalH / 2,
      dotDiameter / 2,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = '#0c1216';
    ctx.fill();

    ctx.restore(); // End August Editorial Section

    // C. Indicator: Bottom Left for August
    renderIndicator(ctx, index, total, indicatorSideX, indicatorBottomY, 'left');
  }

  // =========================================================================
  // SEPTEMBER COMPOSITION
  // =========================================================================
  else if (editionId === 'september') {
    // A. Top Left: Metadata (Catálogo Nº 09 / Septiembre · 2026 · MX)
    ctx.save();
    const metaTop = 26;
    const metaLeft = clamp(0.04 * W, 16, 36);
    ctx.font = '500 9.5px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '3.0px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(242, 236, 221, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 1;

    ctx.fillText('CATÁLOGO ', metaLeft, metaTop);
    const catW = ctx.measureText('CATÁLOGO ').width;
    ctx.save();
    ctx.font = 'bold 9.5px "Space Grotesk", sans-serif';
    ctx.fillStyle = accentColor;
    ctx.fillText('Nº 09', metaLeft + catW, metaTop);
    ctx.restore();

    ctx.fillText('SEPTIEMBRE · 2026 · MX', metaLeft, metaTop + 18);
    ctx.restore();

    // B. Left Editorial Cartel (Parchment Note Box)
    renderCartel(
      ctx,
      look,
      accentColor,
      W,
      H,
      'rgba(242, 236, 221, 0.95)',
      'rgba(7, 21, 18, 0.2)',
      '#071512',
      '#2c3d35'
    );

    // D. Indicator: Bottom Right for September
    renderIndicator(ctx, index, total, W - indicatorSideX, indicatorBottomY, 'right');
  }

  // =========================================================================
  // OCTOBER COMPOSITION
  // =========================================================================
  else if (editionId === 'october') {
    // A. Top Left: Metadata (Catálogo Nº 10 / Octubre · 2026 · MX)
    ctx.save();
    const metaTop = 26;
    const metaLeft = clamp(0.04 * W, 16, 36);
    ctx.font = '500 9.5px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '3.0px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(246, 241, 230, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 1;

    ctx.fillText('CATÁLOGO ', metaLeft, metaTop);
    const catW = ctx.measureText('CATÁLOGO ').width;
    ctx.save();
    ctx.font = 'bold 9.5px "Space Grotesk", sans-serif';
    ctx.fillStyle = accentColor;
    ctx.fillText('Nº 10', metaLeft + catW, metaTop);
    ctx.restore();

    ctx.fillText('OCTUBRE · 2026 · MX', metaLeft, metaTop + 18);
    ctx.restore();

    // B. Left Editorial Note Box (Warm Cream Card)
    renderCartel(
      ctx,
      look,
      accentColor,
      W,
      H,
      'rgba(246, 241, 230, 0.92)',
      'rgba(23, 19, 16, 0.2)',
      '#171310',
      '#4a4238'
    );

    // D. Indicator: Bottom Right for October
    renderIndicator(ctx, index, total, W - indicatorSideX, indicatorBottomY, 'right');
  }

  ctx.restore();
}

/**
 * Shared Cartel (Parchment Card) layout for September and October.
 */
function renderCartel(
  ctx: CanvasRenderingContext2D,
  look: Look,
  accentColor: string,
  W: number,
  H: number,
  boxBg: string,
  boxBorder: string,
  headlineColor: string,
  subColor: string
) {
  ctx.save();

  const cartelLeft = clamp(0.06 * W, 18, 56);
  const cartelTop = clamp(0.18 * H, 80, 140);
  const maxCartelW = Math.min(510, 0.84 * W);
  const padX = 24;
  const padTop = 20;
  const padBottom = 22;
  const innerW = maxCartelW - padX * 2;

  // Measure Chip
  const chipText = (look.chip || '').toUpperCase();
  const chipFontSize = 11;
  const chipLetterSpacing = '3.0px';
  ctx.font = `bold ${chipFontSize}px "Space Grotesk", sans-serif`;
  ctx.letterSpacing = chipLetterSpacing;
  const chipTextW = ctx.measureText(chipText).width;
  const chipPadX = 10;
  const chipPadY = 4.5;
  const chipW = chipTextW + chipPadX * 2;
  const chipH = chipFontSize + chipPadY * 2;

  // Measure Headline
  const headlineFontSize = clamp(0.038 * W + 14, 24, 44);
  const headlineLineHeight = headlineFontSize * 1.04;
  const headlineLines =
    look.lineas && look.lineas.length > 0
      ? look.lineas
      : [{ t: look.chip, em: false }];
  const headlineH = (headlineLines.length - 1) * headlineLineHeight + headlineFontSize;

  // Measure Subtitle
  const subFontSize = 13.5;
  const subLineHeight = subFontSize * 1.56;
  ctx.font = `500 ${subFontSize}px "Space Grotesk", sans-serif`;
  ctx.letterSpacing = 'normal';
  const subLines = wrapCanvasText(ctx, look.sub || '', innerW);
  const subH = (subLines.length - 1) * subLineHeight + subFontSize;

  // Total Card Height
  const gapAfterChip = 12;
  const gapAfterHeadline = 10;
  const cardTotalH = padTop + chipH + gapAfterChip + headlineH + gapAfterHeadline + subH + padBottom;

  // Draw Card Container with Shadow and Border
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = boxBg;
  drawRoundedRect(ctx, cartelLeft, cartelTop, maxCartelW, cardTotalH, 8);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = boxBorder;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Draw Chip inside card
  const chipX = cartelLeft + padX;
  const chipY = cartelTop + padTop;
  ctx.fillStyle = accentColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;
  drawRoundedRect(ctx, chipX, chipY, chipW, chipH, 4);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.font = `bold ${chipFontSize}px "Space Grotesk", sans-serif`;
  ctx.letterSpacing = chipLetterSpacing;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(chipText, chipX + chipPadX, chipY + chipH / 2);

  // Draw Headline
  ctx.font = `normal ${headlineFontSize}px "Abril Fatface", Georgia, serif`;
  ctx.textBaseline = 'top';
  let curHeadY = chipY + chipH + gapAfterChip;
  for (let l = 0; l < headlineLines.length; l++) {
    const line = headlineLines[l];
    ctx.fillStyle = line.em ? accentColor : headlineColor;
    ctx.fillText(line.t, cartelLeft + padX, curHeadY);
    curHeadY += headlineLineHeight;
  }

  // Draw Subtitle
  ctx.font = `500 ${subFontSize}px "Space Grotesk", sans-serif`;
  ctx.letterSpacing = 'normal';
  ctx.fillStyle = subColor;
  let curSubY = curHeadY - headlineLineHeight + headlineFontSize + gapAfterHeadline;
  for (const sLine of subLines) {
    ctx.fillText(sLine, cartelLeft + padX, curSubY);
    curSubY += subLineHeight;
  }

  ctx.restore();
}

/**
 * Editorial Look Indicator (01 / 04 and progress bars) matching DOM CoverStorySurface.
 */
function renderIndicator(
  ctx: CanvasRenderingContext2D,
  index: number,
  total: number,
  anchorX: number,
  baselineY: number,
  align: 'left' | 'right'
) {
  ctx.save();
  const indText = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  ctx.font = '600 12px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';

  const textY = baselineY - 14;
  ctx.fillText(indText, anchorX, textY);

  // Indicator Bars
  const barGap = 8;
  const barH = 2;
  const totalBarsW =
    total * 16 + (32 - 16) + (total - 1) * barGap; // one bar is 32px, others 16px

  let startX = align === 'left' ? anchorX : anchorX - totalBarsW;
  for (let b = 0; b < total; b++) {
    const isCurrent = b === index;
    const barW = isCurrent ? 32 : 16;
    ctx.fillStyle = isCurrent ? 'rgba(255, 255, 255, 1.0)' : 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(startX, baselineY, barW, barH);
    startX += barW + barGap;
  }

  ctx.restore();
}
