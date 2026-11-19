import { Directive } from '@angular/core';

/**
 * Rótulo próprio da aba (ícone, formatação...), no lugar do input `label`.
 * Contexto: `let-active` = a aba está selecionada.
 *
 * ```html
 * <app-tab key="config">
 *   <ng-template appTabLabel><svg aria-hidden="true">…</svg> Configurações</ng-template>
 *   …
 * </app-tab>
 * ```
 */
@Directive({ selector: 'ng-template[appTabLabel]', standalone: true })
export class TabLabelDirective {}

/**
 * Conteúdo **sob demanda**: só é criado quando a aba é aberta (e destruído ao
 * sair, a menos que o `app-tabs` tenha `keepAlive`). Use para conteúdo pesado
 * ou que busca dados ao iniciar.
 *
 * ```html
 * <app-tab key="relatorios" label="Relatórios">
 *   <ng-template appTabContent><app-relatorios /></ng-template>
 * </app-tab>
 * ```
 */
@Directive({ selector: 'ng-template[appTabContent]', standalone: true })
export class TabContentDirective {}
