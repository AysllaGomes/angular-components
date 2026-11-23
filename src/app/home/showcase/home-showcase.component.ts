import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { TPipe } from '../../shared/i18n/t.pipe';
import { I18nService } from '../../shared/services/i18n.service';
import { ToastService } from '../../shared/services/toast.service';
import { ColumnDef } from '../../shared/model/interface/column-def.interface';
import { TableBulkAction } from '../../shared/model/interface/table-bulk-action.interface';
import { TableComponent } from '../../shared/components/table/table.component';

interface ShowcaseRow { doc: string; nome: string; tipo: 'holder' | 'additional'; limite: string; }

/**
 * Vitrine da home: a Tabela da biblioteca funcionando de verdade (não é imagem).
 * Seleção com ações em massa, colunas que se recolhem e paginação local.
 */
@Component({
  selector: 'app-home-showcase',
  imports: [TableComponent, TPipe],
  templateUrl: './home-showcase.component.html',
  styleUrl: './home-showcase.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeShowcaseComponent {
  private readonly i18n = inject(I18nService);
  private readonly toast = inject(ToastService);

  readonly rows: ShowcaseRow[] = [
    { doc: '111.222.333-44', nome: 'Ana Souza',    tipo: 'holder',     limite: 'R$ 5.000' },
    { doc: '555.666.777-88', nome: 'Bruno Lima',   tipo: 'additional', limite: 'R$ 1.500' },
    { doc: '012.345.678-90', nome: 'Carla Dias',   tipo: 'additional', limite: 'R$ 2.000' },
    { doc: '098.765.432-10', nome: 'Diego Alves',  tipo: 'holder',     limite: 'R$ 8.000' },
    { doc: '111.111.111-11', nome: 'Elisa Rocha',  tipo: 'additional', limite: 'R$ 1.000' },
    { doc: '999.000.111-22', nome: 'Felipe Nunes', tipo: 'additional', limite: 'R$ 3.000' },
  ];

  /** começa com duas linhas marcadas, para a barra de ações em massa aparecer */
  readonly selected = signal<string[]>(['111.222.333-44', '555.666.777-88']);
  readonly page = signal(0);

  /** cabeçalhos e chips acompanham o idioma da página */
  readonly columns = computed<ColumnDef<ShowcaseRow>[]>(() => [
    { key: 'nome', header: this.i18n.t('home.showcase.col.name') },
    {
      key: 'tipo', header: this.i18n.t('home.showcase.col.type'), type: 'chip', priority: 2,
      chipMap: {
        holder: { label: this.i18n.t('home.showcase.holder'), variant: 'teal' },
        additional: { label: this.i18n.t('home.showcase.additional'), variant: 'orange' },
      }
    },
    { key: 'doc', header: this.i18n.t('home.showcase.col.doc') },
    { key: 'limite', header: this.i18n.t('home.showcase.col.limit'), priority: 3 },
  ]);

  readonly bulkActions = computed<TableBulkAction<string>[]>(() => [
    { type: 'export', label: this.i18n.t('home.showcase.export') },
  ]);

  onBulk(e: { type: string; keys: unknown[] }) {
    if (e.type === 'export') this.toast.success(this.i18n.t('home.showcase.exported', { n: e.keys.length }));
  }
}
