export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface Box { top: number; left: number; width: number; height: number; }

export interface TooltipPlacement {
  /** lado usado de fato (pode ter virado para o oposto por falta de espaço) */
  position: TooltipPosition;
  top: number;
  left: number;
  /** posição da seta, a partir da borda do balão, apontando para o centro do alvo */
  arrow: number;
}

const OPPOSITE: Record<TooltipPosition, TooltipPosition> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

/** distância entre o alvo e o balão (inclui a seta) */
export const TOOLTIP_GAP = 8;
/** margem mínima até a borda da janela */
export const TOOLTIP_MARGIN = 8;
/** a seta nunca encosta nos cantos arredondados */
const ARROW_INSET = 12;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max));

/**
 * Onde colocar o balão (coordenadas de `position: fixed`).
 *
 * - tenta o lado pedido; se não couber e o oposto couber, vira (ou fica com o
 *   lado de mais espaço quando nenhum cabe);
 * - no outro eixo centraliza no alvo e depois encosta dentro da janela;
 * - a seta continua apontando para o centro do alvo mesmo com o balão deslocado.
 */
export function placeTooltip(
  preferred: TooltipPosition,
  anchor: Box,
  tip: { width: number; height: number },
  viewport: { width: number; height: number },
): TooltipPlacement {
  const space: Record<TooltipPosition, number> = {
    top: anchor.top,
    bottom: viewport.height - (anchor.top + anchor.height),
    left: anchor.left,
    right: viewport.width - (anchor.left + anchor.width),
  };
  const needed = (p: TooltipPosition) =>
    (p === 'top' || p === 'bottom' ? tip.height : tip.width) + TOOLTIP_GAP + TOOLTIP_MARGIN;

  let position = preferred;
  if (space[preferred] < needed(preferred)) {
    const other = OPPOSITE[preferred];
    if (space[other] >= needed(other) || space[other] > space[preferred]) position = other;
  }

  const cx = anchor.left + anchor.width / 2;
  const cy = anchor.top + anchor.height / 2;

  if (position === 'top' || position === 'bottom') {
    const left = clamp(cx - tip.width / 2, TOOLTIP_MARGIN, viewport.width - tip.width - TOOLTIP_MARGIN);
    const top = position === 'top' ? anchor.top - tip.height - TOOLTIP_GAP : anchor.top + anchor.height + TOOLTIP_GAP;
    return { position, top, left, arrow: clamp(cx - left, ARROW_INSET, tip.width - ARROW_INSET) };
  }

  const top = clamp(cy - tip.height / 2, TOOLTIP_MARGIN, viewport.height - tip.height - TOOLTIP_MARGIN);
  const left = position === 'left' ? anchor.left - tip.width - TOOLTIP_GAP : anchor.left + anchor.width + TOOLTIP_GAP;
  return { position, top, left, arrow: clamp(cy - top, ARROW_INSET, tip.height - ARROW_INSET) };
}
