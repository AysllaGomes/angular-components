import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

/** estado visual da caixa */
export type CheckState = 'unchecked' | 'checked' | 'mixed';

/**
 * Só a caixa do checkbox (desmarcado / marcado / parcial), sem comportamento.
 *
 * É decorativa (`aria-hidden`): quem anuncia o estado é o elemento que a usa,
 * como o `<input type="checkbox">` do `app-checkbox` ou um `treeitem` com
 * `aria-checked`. Use-a para desenhar checkboxes dentro de outros componentes.
 *
 * O visual vem dos tokens `--cb-*`. Para realçar a caixa no hover/foco de uma
 * linha inteira, o componente pai pode sobrescrever `--cbm-border` e `--cbm-ring`
 * no próprio `app-checkbox-mark`.
 */
@Component({
  selector: 'app-checkbox-mark',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './checkbox-mark.component.sass',
  host: {
    'aria-hidden': 'true',
    '[class.is-on]': "state() !== 'unchecked'",
    '[class.is-disabled]': 'disabled()',
  },
  template: `
    @switch (state()) {
      @case ('checked') {
        <svg viewBox="0 0 16 16" focusable="false">
          <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      }
      @case ('mixed') {
        <span class="bar"></span>
      }
    }
  `,
})
export class CheckboxMarkComponent {
  readonly state = input<CheckState>('unchecked');
  readonly disabled = input(false, { transform: booleanAttribute });
}
