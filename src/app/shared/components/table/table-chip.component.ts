import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Chip das colunas `type: 'chip'` da `app-table` (uso interno). Fica num componente
 * próprio para levar o estilo junto (com valores padrão, para funcionar sem o tema
 * global). Variantes prontas: `teal` e `orange`; outras recebem a classe `chip--<nome>`
 * e podem ser estilizadas pelo app.
 */
@Component({
  selector: 'app-table-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ label() }}`,
  host: { '[class]': 'classes()' },
  // inlineStyleLanguage do projeto: sass (sintaxe indentada)
  styles: `
:host
  display: inline-flex
  align-items: center
  height: var(--chip-h, 24px)
  padding: 0 var(--chip-pad-x, .6rem)
  border-radius: var(--chip-radius, 9999px)
  font-size: var(--chip-fs, .8rem)
  border: 1px solid var(--tbl-row-border, #e6e9ed)
  color: var(--tbl-muted, #6b7280)
  background: var(--surface, #fff)

:host(.chip--teal)
  border-color: var(--chip-teal-border, #009688)
  color: var(--chip-teal-fg, #03857F)
  background: var(--chip-teal-bg, #FFFFFF)

:host(.chip--orange)
  border-color: var(--chip-orange-border, #c76b2b)
  color: var(--chip-orange-fg, #DD5C02)
  background: var(--chip-orange-bg, #FFFFFF)
`
})
export class TableChipComponent {
  readonly label = input.required<string>();
  readonly variant = input<string | undefined>();

  /** "chip" + a variante: as mesmas classes de antes, para quem estiliza por fora */
  readonly classes = computed(() => (this.variant() ? `chip chip--${this.variant()}` : 'chip'));
}
