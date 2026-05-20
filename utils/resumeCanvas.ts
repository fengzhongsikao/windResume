import type { BasicInfo, ModuleItem } from '../types/resume';
import { getTemplateColors, type TemplateColor } from './templateColors';

export const CANVAS_LOGICAL_WIDTH = 750;
const BODY_PADDING_X = 40;
const BODY_PADDING_BOTTOM = 48;

interface DrawContext {
  basicInfo: BasicInfo;
  modules: ModuleItem[];
  colors: TemplateColor;
  templateId: number;
  avatarText: string;
}

function measureTextWidth(ctx: any | null, text: string, fontSize: number): number {
  if (ctx) {
    ctx.setFontSize(fontSize);
    if (ctx.measureText) {
      return ctx.measureText(text).width || text.length * fontSize * 0.55;
    }
  }
  return text.length * fontSize * 0.55;
}

function wrapTextLines(ctx: any | null, text: string, maxWidth: number, fontSize: number): string[] {
  if (!text) return [];
  const lines: string[] = [];
  let line = '';
  for (const char of text) {
    const next = line + char;
    if (measureTextWidth(ctx, next, fontSize) > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrappedText(
  ctx: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  lineHeight: number,
  color: string,
  maxLines = 30,
): number {
  const lines = wrapTextLines(ctx, text, maxWidth, fontSize).slice(0, maxLines);
  ctx.setFillStyle(color);
  ctx.setFontSize(fontSize);
  lines.forEach((line, i) => {
    ctx.fillText(line, x, y + i * lineHeight);
  });
  return y + lines.length * lineHeight;
}

function fillHeaderGradient(ctx: any, x: number, y: number, w: number, h: number, colors: TemplateColor) {
  if (colors.headerBg === colors.headerEnd) {
    ctx.setFillStyle(colors.headerBg);
  } else {
    const angle = colors.headerGradientAngle ?? 135;
    const rad = (angle * Math.PI) / 180;
    const x2 = x + w * Math.cos(rad);
    const y2 = y + h * Math.sin(rad);
    const gradient = ctx.createLinearGradient(x, y, x2, y2);
    gradient.addColorStop(0, colors.headerBg);
    gradient.addColorStop(1, colors.headerEnd);
    ctx.setFillStyle(gradient);
  }
  ctx.fillRect(x, y, w, h);
}

function drawAvatar(ctx: any, cx: number, cy: number, size: number, text: string, colors: TemplateColor) {
  const r = size / 2;
  ctx.setFillStyle(colors.avatarBg);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.setFillStyle(colors.avatarColor);
  ctx.setFontSize(Math.round(size * 0.4));
  ctx.setTextAlign('center');
  ctx.fillText(text, cx, cy + size * 0.14, size);
  ctx.setTextAlign('left');
}

function drawTag(
  ctx: any,
  label: string,
  x: number,
  y: number,
  colors: TemplateColor,
  fontSize = 24,
): { width: number; height: number } {
  const padX = colors.tagBg === 'transparent' ? 12 : 20;
  const padY = colors.tagBg === 'transparent' ? 4 : 8;
  const tw = measureTextWidth(ctx, label, fontSize);
  const w = tw + padX * 2;
  const h = fontSize + padY * 2;

  if (colors.tagBg !== 'transparent') {
    ctx.setFillStyle(colors.tagBg);
    ctx.fillRect(x, y, w, h);
  } else if (colors.tagBorder) {
    ctx.setStrokeStyle(colors.tagBorder);
    ctx.setLineWidth(1);
    ctx.strokeRect(x, y, w, h);
  }

  ctx.setFillStyle(colors.tagColor);
  ctx.setFontSize(fontSize);
  ctx.fillText(label, x + padX, y + padY + fontSize - 4, w);
  return { width: w, height: h };
}

function drawSkillTag(
  ctx: any,
  name: string,
  level: string,
  x: number,
  y: number,
  colors: TemplateColor,
): { width: number; height: number } {
  const fontSize = 24;
  const padX = 18;
  const padY = 8;
  const gap = 8;
  const nameW = measureTextWidth(ctx, name, fontSize);
  const levelW = level ? measureTextWidth(ctx, level, 20) + gap : 0;
  const w = nameW + levelW + padX * 2;
  const h = fontSize + padY * 2;

  ctx.setFillStyle(colors.tagBg);
  ctx.fillRect(x, y, w, h);
  ctx.setFillStyle(colors.tagColor);
  ctx.setFontSize(fontSize);
  ctx.fillText(name, x + padX, y + padY + fontSize - 4, nameW + padX);

  if (level) {
    ctx.setFillStyle(colors.tagColor);
    ctx.setFontSize(20);
    ctx.fillText(level, x + padX + nameW + gap, y + padY + fontSize - 6, levelW);
  }
  return { width: w, height: h };
}

function drawContactsRow(
  ctx: any,
  basicInfo: BasicInfo,
  x: number,
  y: number,
  colors: TemplateColor,
  vertical = false,
): number {
  const items: string[] = [];
  if (basicInfo.age) items.push(`${basicInfo.age}岁`);
  if (basicInfo.email) items.push(basicInfo.email);
  if (basicInfo.phone) items.push(basicInfo.phone);
  if (items.length === 0) return y;

  if (vertical) {
    let cy = y;
    ctx.setFontSize(22);
    for (const item of items) {
      const tw = measureTextWidth(ctx, item, 22);
      const tagW = tw + 28;
      if (colors.contactBg !== 'transparent') {
        ctx.setFillStyle(colors.contactBg);
        ctx.fillRect(x, cy, tagW, 34);
      }
      ctx.setFillStyle(colors.contactColor);
      ctx.fillText(item, x + 14, cy + 24, tagW);
      cy += 42;
    }
    return cy;
  }

  let cx = x;
  const gap = 16;
  ctx.setFontSize(22);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const tw = measureTextWidth(ctx, item, 22);
    const tagW = tw + 28;
    if (colors.contactBg !== 'transparent') {
      ctx.setFillStyle(colors.contactBg);
      ctx.fillRect(cx, y, tagW, 34);
    }
    ctx.setFillStyle(colors.contactColor);
    ctx.fillText(item, cx + 14, y + 24, tagW);
    cx += tagW + gap;
  }
  return y + 36;
}

function measureModuleHeight(mod: ModuleItem, contentWidth: number): number {
  let h = 36 + 56;
  const d = mod.data as any;

  switch (mod.type) {
    case 'jobIntention':
      h += 52;
      break;
    case 'education':
    case 'internship':
    case 'workExperience':
    case 'projectExperience':
      h += 56;
      if (d.description) {
        const lines = wrapTextLines(null, d.description, contentWidth, 24).length;
        h += lines * 34 + 8;
      }
      break;
    case 'skills':
    case 'hobbies': {
      const list = Array.isArray(d) ? d.filter((i: any) => i.name) : [];
      if (list.length > 0) h += 48;
      break;
    }
    case 'selfEvaluation':
      if (d.content) {
        const lines = wrapTextLines(null, d.content, contentWidth, 26).length;
        h += lines * 38 + 8;
      } else {
        h += 36;
      }
      break;
  }
  return h + 12;
}

export function estimateResumeHeight(
  basicInfo: BasicInfo,
  modules: ModuleItem[],
  templateId: number,
): number {
  const colors = getTemplateColors(templateId);
  const isSidebar = colors.layout === 'sidebar';
  const sidebarW = colors.sidebarWidth || 240;
  const contentWidth = isSidebar
    ? CANVAS_LOGICAL_WIDTH - sidebarW - BODY_PADDING_X * 2
    : CANVAS_LOGICAL_WIDTH - BODY_PADDING_X * 2;

  let bodyH = BODY_PADDING_BOTTOM;
  for (const mod of modules) {
    bodyH += measureModuleHeight(mod, contentWidth);
  }
  if (modules.length === 0) bodyH += 120;

  if (isSidebar) {
    const headerH = Math.max(520, bodyH + 96);
    return headerH;
  }

  const headerH = 184;
  return headerH + bodyH + 24;
}

function drawSectionTitle(ctx: any, label: string, x: number, y: number, colors: TemplateColor): number {
  ctx.setFillStyle(colors.dotColor);
  ctx.beginPath();
  ctx.arc(x + 15, y + 10, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.setFillStyle(colors.titleColor);
  ctx.setFontSize(30);
  ctx.fillText(label, x + 32, y + 16, 600);
  return y + 48;
}

function drawModuleContent(
  ctx: any,
  mod: ModuleItem,
  x: number,
  y: number,
  contentWidth: number,
  colors: TemplateColor,
): number {
  const d = mod.data as any;

  switch (mod.type) {
    case 'jobIntention': {
      const tags = [
        d.position || '未填写',
        d.city || '未填写',
        d.salary || '未填写',
        d.type || '未填写',
      ];
      let px = x;
      let rowY = y;
      const rowH = 44;
      for (const tag of tags) {
        const { width, height } = drawTag(ctx, tag, px, rowY, colors);
        px += width + 12;
        if (px + 80 > x + contentWidth) {
          px = x;
          rowY += height + 10;
        }
      }
      return rowY + rowH;
    }
    case 'education': {
      ctx.setFillStyle(colors.textPrimary);
      ctx.setFontSize(28);
      ctx.fillText(d.school || '未填写', x, y + 10, contentWidth - 180);

      ctx.setFillStyle(colors.textSecondary);
      ctx.setFontSize(22);
      ctx.setTextAlign('right');
      ctx.fillText(`${d.startDate || ''} - ${d.endDate || ''}`, x + contentWidth, y + 10, 180);
      ctx.setTextAlign('left');
      ctx.fillText(`${d.major || ''} · ${d.degree || ''}`, x, y + 38, contentWidth);

      let ny = y + 58;
      if (d.description) {
        ny = drawWrappedText(ctx, d.description, x, ny, contentWidth, 24, 34, colors.textTertiary);
      }
      return ny + 8;
    }
    case 'internship':
    case 'workExperience': {
      ctx.setFillStyle(colors.textPrimary);
      ctx.setFontSize(28);
      ctx.fillText(d.position || '未填写', x, y + 10, contentWidth - 180);

      ctx.setFillStyle(colors.textSecondary);
      ctx.setFontSize(22);
      ctx.setTextAlign('right');
      ctx.fillText(`${d.startDate || ''} - ${d.endDate || ''}`, x + contentWidth, y + 10, 180);
      ctx.setTextAlign('left');
      ctx.fillText(d.company || '未填写', x, y + 38, contentWidth);

      let ny = y + 58;
      if (d.description) {
        ny = drawWrappedText(ctx, d.description, x, ny, contentWidth, 24, 34, colors.textTertiary);
      }
      return ny + 8;
    }
    case 'projectExperience': {
      ctx.setFillStyle(colors.textPrimary);
      ctx.setFontSize(28);
      ctx.fillText(d.name || '未填写', x, y + 10, contentWidth - 180);

      ctx.setFillStyle(colors.textSecondary);
      ctx.setFontSize(22);
      ctx.setTextAlign('right');
      ctx.fillText(`${d.startDate || ''} - ${d.endDate || ''}`, x + contentWidth, y + 10, 180);
      ctx.setTextAlign('left');
      ctx.fillText(d.role || '未填写', x, y + 38, contentWidth);

      let ny = y + 58;
      if (d.description) {
        ny = drawWrappedText(ctx, d.description, x, ny, contentWidth, 24, 34, colors.textTertiary);
      }
      return ny + 8;
    }
    case 'skills': {
      const list = Array.isArray(d) ? d : [];
      if (list.length === 0) return y;
      let px = x;
      let rowY = y;
      for (const s of list) {
        const { width, height } = drawSkillTag(ctx, s.name || ' ', s.level || '', px, rowY, colors);
        px += width + 12;
        if (px + 60 > x + contentWidth) {
          px = x;
          rowY += height + 10;
        }
      }
      return rowY + 48;
    }
    case 'hobbies': {
      const list = Array.isArray(d) ? d : [];
      if (list.length === 0) return y;
      let px = x;
      let rowY = y;
      for (const h of list) {
        const { width, height } = drawTag(ctx, h.name || ' ', px, rowY, colors);
        px += width + 12;
        if (px + 60 > x + contentWidth) {
          px = x;
          rowY += height + 10;
        }
      }
      return rowY + 48;
    }
    case 'selfEvaluation': {
      const text = d.content || '未填写';
      return drawWrappedText(ctx, text, x, y, contentWidth, 26, 38, colors.textTertiary) + 8;
    }
    default:
      return y;
  }
}

function drawVerticalHeader(ctx: any, options: DrawContext, headerH: number) {
  const { basicInfo, colors, avatarText } = options;
  fillHeaderGradient(ctx, 0, 0, CANVAS_LOGICAL_WIDTH, headerH, colors);

  const avatarSize = 100;
  const avatarCx = BODY_PADDING_X + avatarSize / 2;
  const avatarCy = 48 + avatarSize / 2;
  drawAvatar(ctx, avatarCx, avatarCy, avatarSize, avatarText, colors);

  const textX = BODY_PADDING_X + avatarSize + 28;
  let textY = 56;
  ctx.setFillStyle(colors.nameColor);
  ctx.setFontSize(40);
  ctx.fillText(basicInfo.name || '未填写', textX, textY + 36, 500);
  textY += 56;
  drawContactsRow(ctx, basicInfo, textX, textY, colors, false);
}

function drawSidebarHeader(ctx: any, options: DrawContext, totalH: number) {
  const { basicInfo, colors, avatarText } = options;
  const sidebarW = colors.sidebarWidth || 240;

  fillHeaderGradient(ctx, 0, 0, sidebarW, totalH, colors);

  const avatarSize = options.templateId === 6 ? 80 : 80;
  const cx = sidebarW / 2;
  let y = 48;
  drawAvatar(ctx, cx, y + avatarSize / 2, avatarSize, avatarText, colors);
  y += avatarSize + 28;

  ctx.setFillStyle(colors.nameColor);
  ctx.setFontSize(options.templateId === 9 ? 30 : 32);
  ctx.setTextAlign('center');
  ctx.fillText(basicInfo.name || '未填写', cx, y + 28, sidebarW - 32);
  y += 48;

  ctx.setTextAlign('left');
  const items: string[] = [];
  if (basicInfo.age) items.push(`${basicInfo.age}岁`);
  if (basicInfo.email) items.push(basicInfo.email);
  if (basicInfo.phone) items.push(basicInfo.phone);

  ctx.setFontSize(20);
  for (const item of items) {
    const tw = measureTextWidth(ctx, item, 20);
    const tagW = Math.min(tw + 24, sidebarW - 32);
    const tagX = (sidebarW - tagW) / 2;
    if (colors.contactBg !== 'transparent') {
      ctx.setFillStyle(colors.contactBg);
      ctx.fillRect(tagX, y, tagW, 32);
    }
    ctx.setFillStyle(colors.contactColor);
    ctx.setTextAlign('center');
    ctx.fillText(item, cx, y + 22, tagW);
    y += 40;
  }
  ctx.setTextAlign('left');
}

export function drawResumeToCanvas(
  ctx: any,
  basicInfo: BasicInfo,
  modules: ModuleItem[],
  templateId: number,
  avatarText: string,
  options?: { skipBackground?: boolean },
): number {
  const colors = getTemplateColors(templateId);
  const drawOptions: DrawContext = { basicInfo, modules, colors, templateId, avatarText };
  const isSidebar = colors.layout === 'sidebar';
  const sidebarW = colors.sidebarWidth || 240;

  const estimatedH = estimateResumeHeight(basicInfo, modules, templateId);
  if (!options?.skipBackground) {
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(0, 0, CANVAS_LOGICAL_WIDTH, estimatedH + 20);
  }

  const bodyX = isSidebar ? sidebarW + BODY_PADDING_X : BODY_PADDING_X;
  const contentWidth = isSidebar
    ? CANVAS_LOGICAL_WIDTH - sidebarW - BODY_PADDING_X * 2
    : CANVAS_LOGICAL_WIDTH - BODY_PADDING_X * 2;

  if (isSidebar) {
    drawSidebarHeader(ctx, drawOptions, estimatedH);
    if (colors.bodyBorder) {
      ctx.setFillStyle(colors.bodyBorder);
      ctx.fillRect(sidebarW, 0, 4, estimatedH);
    }
  } else {
    const headerH = 184;
    drawVerticalHeader(ctx, drawOptions, headerH);
    if (colors.bodyBorder) {
      ctx.setFillStyle(colors.bodyBorder);
      ctx.fillRect(0, headerH, CANVAS_LOGICAL_WIDTH, 4);
    }
  }

  let y = isSidebar ? 32 : 200;

  for (const mod of modules) {
    y += 36;
    y = drawSectionTitle(ctx, mod.label, bodyX, y, colors);
    y = drawModuleContent(ctx, mod, bodyX, y, contentWidth, colors);
  }

  if (modules.length === 0) {
    ctx.setFillStyle('#cccccc');
    ctx.setFontSize(26);
    ctx.setTextAlign('center');
    ctx.fillText('暂未添加模块，请先在编辑页添加', CANVAS_LOGICAL_WIDTH / 2, y + 60, contentWidth);
    ctx.setTextAlign('left');
    y += 120;
  }

  return y + BODY_PADDING_BOTTOM;
}
