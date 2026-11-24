/** lado (abaixo/acima do botão) e alinhamento (pela borda inicial/final do botão) */
export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export interface MenuBox { top: number; left: number; width: number; height: number; }

/** distância entre o botão e o menu */
export const MENU_GAP = 4;
/** margem mínima até a borda da janela */
export const MENU_MARGIN = 8;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max));

/**
 * Onde abrir o menu (coordenadas de `position: fixed`).
 *
 * - abre do lado pedido; se não couber e o outro tiver mais espaço, vira;
 * - alinha pela borda pedida do botão e depois encosta dentro da janela;
 * - `maxHeight` é o espaço do lado escolhido: um menu longo rola em vez de sair da tela.
 */
export function placeMenu(
  preferred: MenuPlacement,
  anchor: MenuBox,
  menu: { width: number; height: number },
  viewport: { width: number; height: number },
): { placement: MenuPlacement; top: number; left: number; maxHeight: number } {
  const [side, align] = preferred.split('-') as ['bottom' | 'top', 'start' | 'end'];
  const space = {
    bottom: viewport.height - (anchor.top + anchor.height) - MENU_GAP - MENU_MARGIN,
    top: anchor.top - MENU_GAP - MENU_MARGIN,
  };
  const other = side === 'bottom' ? 'top' : 'bottom';
  const finalSide = space[side] < menu.height && space[other] > space[side] ? other : side;

  const maxHeight = Math.max(0, space[finalSide]);
  const height = Math.min(menu.height, maxHeight);
  const top = finalSide === 'bottom' ? anchor.top + anchor.height + MENU_GAP : anchor.top - MENU_GAP - height;
  const wanted = align === 'start' ? anchor.left : anchor.left + anchor.width - menu.width;
  const left = clamp(wanted, MENU_MARGIN, viewport.width - menu.width - MENU_MARGIN);

  return { placement: `${finalSide}-${align}`, top, left, maxHeight };
}
