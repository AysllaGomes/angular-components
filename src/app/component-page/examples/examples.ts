import { ChangeDetectionStrategy, Component, Type, computed, inject, signal } from '@angular/core';

import { I18nService } from '../../site/services/i18n.service';
import { TABS_IMPORTS } from '../../shared/components/tabs';
import { TableComponent } from '../../shared/components/table/table.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { ColumnDef } from '../../shared/components/table/table.types';
import { SelectOption } from '../../shared/components/select/select.types';

/*
 * Exemplos ao vivo das páginas de componente. Cada um reproduz o exemplo de "Uso"
 * do .md (o que a aba "Código" mostra), no idioma da página: o código e o exemplo
 * precisam bater.
 */

/** tabs.md → ## Uso */
@Component({
  selector: 'app-tabs-example',
  imports: [...TABS_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let en = isEn();
    <app-tabs [ariaLabel]="en ? 'Account' : 'Conta'" [(selected)]="tab">
      <app-tab [key]="en ? 'profile' : 'perfil'" [label]="en ? 'Profile' : 'Perfil'">
        <p>{{ en ? 'Name, email and photo of the account.' : 'Nome, e-mail e foto da conta.' }}</p>
      </app-tab>
      <app-tab [key]="en ? 'orders' : 'pedidos'" [label]="en ? 'Orders' : 'Pedidos'" [badge]="pending()">
        <p>{{ en ? '3 orders waiting for payment.' : '3 pedidos aguardando pagamento.' }}</p>
      </app-tab>
      <app-tab [key]="en ? 'archive' : 'arquivo'" [label]="en ? 'Archive' : 'Arquivo'" disabled />
    </app-tabs>
  `,
  styles: `
p
  margin: 1rem 0 0
  color: var(--muted, #5f6a75)
`
})
export class TabsExampleComponent {
  private readonly i18n = inject(I18nService);
  readonly isEn = computed(() => this.i18n.lang() === 'en');
  readonly tab = signal<string | null>(null);
  readonly pending = signal(3);
}

interface Person { id: string; nome: string; tipo: string; }

/** table.md → ## Uso (ações declarativas) */
@Component({
  selector: 'app-table-example',
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-table
      [columns]="columns()"
      [data]="rows"
      [selectable]="true"
      rowKey="id"
      [actions]="['edit']"
      [selected]="selected()"
      (selectedChange)="selected.set($event)"
      (action)="onAction($event)" />
    <p class="status" role="status">{{ last() }}</p>
  `,
  styles: `
.status
  margin: .75rem 0 0
  min-height: 1.5em
  color: var(--muted, #5f6a75)
  font-size: .9375rem
`
})
export class TableExampleComponent {
  private readonly i18n = inject(I18nService);
  readonly rows: Person[] = [
    { id: 'a', nome: 'Ana Souza', tipo: 'Titular' },
    { id: 'b', nome: 'Bruno Lima', tipo: 'Adicional' },
    { id: 'c', nome: 'Carla Dias', tipo: 'Adicional' },
  ];
  readonly columns = computed<ColumnDef<Person>[]>(() => {
    const en = this.i18n.lang() === 'en';
    return [
      { key: 'nome', header: en ? 'Name' : 'Nome' },
      { key: 'tipo', header: en ? 'Type' : 'Tipo' },
    ];
  });
  readonly selected = signal<string[]>([]);
  readonly last = signal('');

  onAction(e: { type: string; row: Person }) {
    const en = this.i18n.lang() === 'en';
    this.last.set(en ? `Action "${e.type}" on ${e.row.nome}` : `Ação "${e.type}" em ${e.row.nome}`);
  }
}

/** select.md → ## Uso básico */
@Component({
  selector: 'app-select-example',
  imports: [SelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let en = isEn();
    <app-select
      [label]="en ? 'Category' : 'Categoria'"
      [placeholder]="en ? 'Select' : 'Selecione'"
      [required]="true"
      [options]="options()"
      [value]="category()"
      (valueChange)="category.set($event)"
      [hint]="en ? 'Used to organize the reports.' : 'Usada para organizar os relatórios.'" />
  `,
  styles: `
:host
  display: block
  max-width: 22rem
`
})
export class SelectExampleComponent {
  private readonly i18n = inject(I18nService);
  readonly isEn = computed(() => this.i18n.lang() === 'en');
  readonly category = signal<string | null>(null);
  readonly options = computed<SelectOption<string>[]>(() => this.isEn()
    ? [{ label: 'Sales', value: 'sales' }, { label: 'Marketing', value: 'marketing' }, { label: 'Support', value: 'support' }]
    : [{ label: 'Vendas', value: 'vendas' }, { label: 'Marketing', value: 'marketing' }, { label: 'Suporte', value: 'suporte' }]);
}

/** componentes com exemplo ao vivo na página; os outros mostram o código e o link da demo */
export const LIVE_EXAMPLES: Record<string, Type<unknown>> = {
  tabs: TabsExampleComponent,
  table: TableExampleComponent,
  select: SelectExampleComponent,
};
