import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';

import { TPipe } from '../../../site/i18n/t.pipe';

import { I18nService } from '../../../site/services/i18n.service';

import { SortState, AdicionalRow } from './adicional.types';

import { ColumnDef, TableAction, TableBulkAction, TableBulkBarIdle } from '../../../shared/components/table/table.types';

import { TableComponent } from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [TableComponent, TPipe],
  templateUrl: './table-demo.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './table-demo.component.sass'
})
export class TableDemoComponent {
  private i18n = inject(I18nService);

  actions = computed<TableAction<AdicionalRow>[]>(() => [
    { kind: 'edit', label: this.i18n.t('table.action.edit') },
    {
      kind: 'delete',
      label: this.i18n.t('table.action.delete'),
      // correntista: o botão fica indisponível e a dica explica o motivo
      disabled: row => row.tipo === 'Correntista',
      disabledReason: () => this.i18n.t('table.action.delete.blocked'),
    },
  ]);

  private readonly initialRows: AdicionalRow[] = [
    { nome: 'Nome Colaborador',   tipo: 'Correntista',     documento: '111.222.333-44', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO' },
    { nome: 'Nome Colaborador - Não correntista', tipo: 'Não correntista', documento: '555.666.777-88', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO 2' },
    { nome: 'Nome Colaborador - Correntista 2',tipo: 'Correntista', documento: '012.345.678-90', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO 3' },
    { nome: 'Nome Colaborador - Não correntista 3',tipo: 'Não correntista', documento: '098.765.432-10', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO 4' },
    { nome: 'Nome Colaborador - Correntista 3',tipo: 'Correntista', documento: '111.111.111-11', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO 5' },
    { nome: 'Nome Colaborador - Não correntista 5',tipo: 'Não correntista', documento: '999.000.111-22', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO 6' },
  ];

  /** signal: "Excluir" em massa remove linhas de verdade ("Restaurar linhas" devolve) */
  rows = signal<AdicionalRow[]>(this.initialRows);
  removedCount = computed(() => this.initialRows.length - this.rows().length);

  /** ações em massa: recebem os documentos selecionados (inclusive de outras páginas) */
  bulkActions = computed<TableBulkAction<string>[]>(() => [
    { type: 'export', label: this.i18n.t('table.bulk.export') },
    {
      type: 'delete',
      label: this.i18n.t('table.bulk.delete'),
      danger: true,
      // como na ação da linha: correntista só pela agência
      disabled: docs => this.rows().some(r => docs.includes(r.documento) && r.tipo === 'Correntista'),
      disabledReason: () => this.i18n.t('table.bulk.delete.blocked'),
    },
  ]);

  /** o que a barra mostra sem seleção; o botão da toolbar alterna os três modos */
  bulkIdle = signal<TableBulkBarIdle>('space');

  cycleIdle() {
    const modes: TableBulkBarIdle[] = ['space', 'hint', 'hidden'];
    this.bulkIdle.update(m => modes[(modes.indexOf(m) + 1) % modes.length]);
  }

  /** lê o idioma dentro da função: o contador acompanha a troca de idioma */
  countLabel = (n: number) => this.i18n.t(n === 1 ? 'table.bulk.count.one' : 'table.bulk.count.other', { n });

  loading = signal(false);
  empty = signal(false);

  /** documentos selecionados (rowKey="documento"): sobrevive a ordenação e paginação */
  selected = signal<string[]>([]);

  /** priority: sem espaço, somem primeiro as de número maior (limite → nome impresso → tipo); nome e documento ficam */
  columns: ColumnDef<AdicionalRow>[] = [
    { key: 'nome',        header: 'Nome do adicional' },
    {
      key: 'tipo',
      header: 'Tipo de adicional',
      type: 'chip',
      align: 'center',
      width: '180px',
      priority: 2,
      chipMap: {
        'Correntista':     { label: 'Correntista',     variant: 'orange' },
        'Não correntista': { label: 'Não correntista', variant: 'teal'   },
      }
    },
    { key: 'documento',   header: 'Documento',         width: '160px' },
    { key: 'limite',      header: 'Limite atribuído',  width: '220px', priority: 3 },
    { key: 'nomeImpresso',header: 'Nome impresso',     width: '180px', priority: 2 },
  ];

  /** paginação integrada (paginate="client"): a tabela fatia, ajusta a página e volta à primeira ao ordenar */
  pageSize = signal(5);
  pageIndex = signal(0);

  /** lê o idioma dentro da função: o texto acompanha a troca de idioma */
  rangeLabel = (start: number, end: number, total: number) =>
    this.i18n.t('pagination.range', { start, end, total });

  sort = signal<SortState | null>(null);

  // comparador amigável p/ strings e números
  private collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

  sortedRows = computed(() => {
    const rows = this.empty() ? [] : this.rows();
    const s = this.sort();
    if (!s) return rows;

    const key = s.key as keyof AdicionalRow;
    const dir = s.dir === 'asc' ? 1 : -1;

    return [...rows].sort((a, b) => {
      const av = a[key] as any;
      const bv = b[key] as any;
      const cmp = (typeof av === 'number' && typeof bv === 'number')
        ? av - bv
        : this.collator.compare(String(av ?? ''), String(bv ?? ''));
      return cmp * dir;
    });
  });

  onSort(e: SortState) {
    this.sort.set(e); // a tabela já volta para a primeira página
  }

  onEdit(row: AdicionalRow, index: number) {
    console.log('editar', index, row);
  }

  onAction(e: { type: string; row: AdicionalRow; index: number }) {
    if (e.type === 'edit') this.onEdit(e.row, e.index);
    if (e.type === 'delete') console.log('excluir', e.index, e.row);
  }

  onBulk(e: { type: string; keys: string[] }) {
    if (e.type === 'export') console.log('exportar', e.keys);
    if (e.type === 'delete') {
      this.rows.update(rows => rows.filter(r => !e.keys.includes(r.documento)));
      this.selected.set([]); // os botões somem e o foco vai para "Selecionar tudo"
      // se a página atual deixar de existir, a tabela corrige pageIndex
    }
  }

  restoreRows() {
    this.rows.set(this.initialRows);
  }

  /** erro simulado: guarda a chave, então a mensagem acompanha o idioma da demo */
  errorKey = signal<string | null>(null);

  simulateLoad() {
    if (this.loading()) return;
    this.load(true);
  }

  /** a busca falha; "Tentar novamente" (retry) busca de novo e dá certo */
  simulateError() {
    if (this.loading()) return;
    this.load(false);
  }

  /** a mensagem continua no estado: enquanto carrega, a tabela mostra o skeleton */
  private load(ok: boolean) {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.errorKey.set(ok ? null : 'table.error.load');
    }, 1500);
  }

  retryLoad() { this.load(true); }

  toggleEmpty() {
    this.empty.update(v => !v);
  }
}
