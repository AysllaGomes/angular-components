import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';

import { TPipe } from '../../../shared/i18n/t.pipe';
import { I18nService } from '../../../shared/services/i18n.service';

import { TreeNode } from '../../../shared/model/interface/tree-select/tree-node.interface';
import { TreeChildrenLoader, TreeSelectComponent, TreeSelectValue } from '../../../shared/components/tree-select/tree-select.component';

/** nomes próprios: iguais nos dois idiomas */
const PLACES: TreeNode[] = [
  { key: 'br', label: 'Brasil', children: [
    { key: 'br-sp', label: 'São Paulo', children: [
      { key: 'campinas', label: 'Campinas' },
      { key: 'santos', label: 'Santos' },
      { key: 'sao-paulo', label: 'São Paulo (capital)' },
    ] },
    { key: 'br-rj', label: 'Rio de Janeiro', children: [
      { key: 'niteroi', label: 'Niterói' },
      { key: 'petropolis', label: 'Petrópolis' },
    ] },
    { key: 'br-ba', label: 'Bahia', children: [
      { key: 'salvador', label: 'Salvador' },
    ] },
  ] },
  { key: 'pt', label: 'Portugal', children: [
    { key: 'lisboa', label: 'Lisboa' },
    { key: 'porto', label: 'Porto' },
  ] },
];

/** "banco" da API simulada */
const CITIES: Record<string, string[]> = {
  sp: ['Campinas', 'Santos', 'São Paulo (capital)'],
  rj: ['Niterói', 'Petrópolis'],
  ba: ['Salvador', 'Ilhéus'],
  mg: ['Belo Horizonte', 'Ouro Preto', 'Tiradentes'],
};
const normalizeKey = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

@Component({
  selector: 'app-tree-select-demo',
  standalone: true,
  imports: [TPipe, TreeSelectComponent],
  templateUrl: './tree-select-demo.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TreeSelectDemoComponent {
  private i18n = inject(I18nService);

  places = PLACES;
  city = signal<TreeSelectValue>('campinas');
  leafCity = signal<TreeSelectValue>(null);

  permissions = computed<TreeNode[]>(() => {
    const t = (k: string) => this.i18n.t(k);
    return [
      { key: 'sales', label: t('perm.sales'), children: [
        { key: 'sales.view', label: t('perm.sales.view') },
        { key: 'sales.create', label: t('perm.sales.create') },
        { key: 'sales.refund', label: t('perm.sales.refund'), disabled: true },
      ] },
      { key: 'finance', label: t('perm.finance'), children: [
        { key: 'finance.reports', label: t('perm.finance.reports') },
        { key: 'finance.export', label: t('perm.finance.export') },
      ] },
      { key: 'admin', label: t('perm.admin'), children: [
        { key: 'admin.users', label: t('perm.admin.users'), children: [
          { key: 'admin.users.invite', label: t('perm.admin.users.invite') },
          { key: 'admin.users.remove', label: t('perm.admin.users.remove') },
        ] },
        { key: 'admin.audit', label: t('perm.admin.audit') },
      ] },
    ];
  });
  perms = signal<TreeSelectValue>(['sales.view', 'finance.reports']);

  // ---- sob demanda: estados vêm sem cidades; a "API" devolve as cidades com atraso
  states: TreeNode[] = [
    { key: 'sp', label: 'São Paulo', leaf: false },
    { key: 'rj', label: 'Rio de Janeiro', leaf: false },
    { key: 'ba', label: 'Bahia', leaf: false },
    { key: 'mg', label: 'Minas Gerais', leaf: false },
  ];
  served = signal<TreeSelectValue>([]);
  private bahiaFailed = false;
  loadCities: TreeChildrenLoader = node => new Promise((resolve, reject) => {
    setTimeout(() => {
      // a Bahia falha na primeira tentativa, para mostrar o erro e o "tentar de novo"
      if (node.key === 'ba' && !this.bahiaFailed) { this.bahiaFailed = true; reject(new Error('503')); return; }
      resolve((CITIES[node.key] ?? []).map(label => ({ key: `${node.key}-${normalizeKey(label)}`, label })));
    }, 900);
  });

  // ---- valor resumido
  permsSummary = signal<TreeSelectValue>(['finance', 'sales.view']);

  show(v: TreeSelectValue) { return JSON.stringify(v); }
}
