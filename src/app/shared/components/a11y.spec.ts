import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
// os testes conferem os textos em português (o padrão dos componentes é inglês)
import { UI_LABELS_PT, provideUiLabels } from '../labels';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectNoA11yViolations, writeA11yReport } from '../../../testing/axe';
import { stubLayout } from '../../../testing/layout-stub';

import { ColumnDef, TableAction, TableBulkAction } from './table/table.types';
import { TreeNode } from './tree-select/tree-select.types';
import { SelectOption } from './select/select.types';

import { ToastService } from './toast/toast.service';
import { TableComponent } from './table/table.component';
import { DialogComponent } from './dialog/dialog.component';
import { SelectComponent } from './select/select.component';
import { ButtonDirective } from './button/button.directive';
import { StepperComponent } from './stepper/stepper.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { SwitchComponent } from './switch/switch.component';
import { RadioGroupComponent } from './radio/radio-group.component';
import { CheckboxGroupComponent } from './checkbox-group/checkbox-group.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { MaskDirective } from '../forms/mask.directive';
import { ActionBarComponent } from './actionbar/actionbar.component';
import { PaginationComponent } from './pagination/pagination.component';
import { TreeSelectComponent } from './tree-select/tree-select.component';
import { TABS_IMPORTS } from './tabs';
import { TooltipDirective } from './tooltip/tooltip.directive';
import { ToastContainerComponent } from './toast/toast-container.component';

/**
 * Regras de acessibilidade (axe-core) em cada componente, nos estados que
 * importam: aberto, com seleção, com erro, desabilitado...
 * Uma falha aqui lista a regra, a explicação e o elemento.
 */

const OPTIONS: SelectOption<string>[] = [
  { label: 'Banana', value: 'banana', group: 'Frutas' },
  { label: 'Cenoura', value: 'carrot', group: 'Legumes' },
  { label: 'Bolo', value: 'cake', disabled: true },
];

const TREE: TreeNode[] = [
  { key: 'br', label: 'Brasil', children: [
    { key: 'sp', label: 'São Paulo', children: [{ key: 'campinas', label: 'Campinas' }, { key: 'santos', label: 'Santos' }] },
  ] },
  { key: 'pt', label: 'Portugal', disabled: true, children: [{ key: 'lisboa', label: 'Lisboa' }] },
];

interface Row { id: string; nome: string; tipo: string; }

@Component({
  imports: [
    ButtonDirective, CheckboxComponent, CheckboxGroupComponent, RadioGroupComponent, SwitchComponent, FormFieldComponent, MaskDirective, SelectComponent, TreeSelectComponent, StepperComponent,
    TableComponent, PaginationComponent, DialogComponent, ActionBarComponent, ToastContainerComponent, ...TABS_IMPORTS, TooltipDirective,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <main>
      <!-- Button -->
      <section id="button">
        <button appButton type="button">Salvar</button>
        <button appButton="ghost" tone="danger" type="button" disabled>Excluir</button>
        <a appButton="link" href="#x">Saiba mais</a>
      </section>

      <!-- Checkbox -->
      <section id="checkbox">
        <app-checkbox>Aceito</app-checkbox>
        <app-checkbox [indeterminate]="true">Todos</app-checkbox>
        <app-checkbox disabled [checked]="true">Bloqueado</app-checkbox>
        <app-checkbox hint="Obrigatório" error="Você precisa aceitar">Termos</app-checkbox>
        <app-checkbox ariaLabel="Selecionar linha" />
      </section>

      <!-- Campos de texto (form-field + máscara) -->
      <section id="formfield">
        <app-form-field label="Nome" required hint="Como no documento"><input></app-form-field>
        <app-form-field label="CPF" error="CPF inválido"><input appMask="cpf"></app-form-field>
        <app-form-field label="Obs."><textarea></textarea></app-form-field>
      </section>

      <!-- Checkbox group -->
      <section id="checkboxgroup">
        <app-checkbox-group label="Avisos" selectAll required [options]="plans" [value]="['basic']" hint="Escolha quantos quiser" />
        <app-checkbox-group label="Dias" orientation="horizontal" [options]="plans" error="Escolha pelo menos um" />
        <app-checkbox-group label="Bloqueado" disabled [options]="plans" [value]="['pro']" />
      </section>

      <!-- Radio group e Switch -->
      <section id="radio">
        <app-radio-group label="Plano" required [options]="plans" value="basic" hint="Pode mudar depois" />
        <app-radio-group label="Entrega" orientation="horizontal" [options]="plans" error="Escolha uma opção" />
        <app-radio-group label="Bloqueado" disabled [options]="plans" value="pro" />
      </section>
      <section id="switch">
        <app-switch [checked]="true" hint="Por e-mail">Notificações</app-switch>
        <app-switch labelFirst>Modo compacto</app-switch>
        <app-switch disabled [checked]="true">Bloqueado</app-switch>
        <app-switch ariaLabel="Ativar linha" />
      </section>

      <!-- Select (aberto, com grupos) -->
      <section id="select">
        <app-select label="Comida" responsive="menu" [options]="options" value="banana"
                    [clearable]="true" hint="Escolha uma" />
      </section>

      <!-- TreeSelect: single aberto e checkbox com seleção -->
      <section id="treeselect">
        <app-tree-select label="Cidade" responsive="menu" [nodes]="tree" value="campinas" [clearable]="true" />
        <app-tree-select label="Cidades" responsive="menu" selectionMode="checkbox" filterable
                         filterPlaceholder="Filtrar" [nodes]="tree" [value]="['santos']"
                         [expandedKeys]="['br', 'sp']" error="Revise a seleção" />
        <app-tree-select label="Estados" responsive="menu" selectionMode="checkbox" valueMode="summary"
                         [nodes]="lazyTree" [loadChildren]="failLoad" [value]="['ba']" />
      </section>

      <!-- Tabs: contador, rótulo próprio, desabilitada, sob demanda -->
      <section id="tabs">
        <app-tabs ariaLabel="Conta" selected="pedidos">
          <app-tab key="perfil" label="Perfil"><p>Dados</p></app-tab>
          <app-tab key="pedidos" label="Pedidos" [badge]="3"><p>Lista</p></app-tab>
          <app-tab key="config"><ng-template appTabLabel><svg aria-hidden="true" width="16" height="16"></svg> Configurações</ng-template><p>Opções</p></app-tab>
          <app-tab key="arquivo" label="Arquivo" disabled />
          <app-tab key="rel" label="Relatórios"><ng-template appTabContent><p>Relatório</p></ng-template></app-tab>
        </app-tabs>
      </section>

      <!-- Tooltip: como nome (botão só com ícone), como descrição e em aria-disabled -->
      <section id="tooltip">
        <button type="button" appTooltip="Editar" tooltipAsLabel><svg aria-hidden="true" width="16" height="16"></svg></button>
        <button type="button" aria-label="Sobre o prazo" appTooltip="Dias úteis após o pagamento">i</button>
        <button type="button" aria-disabled="true" appTooltip="Só administradores">Excluir</button>
      </section>

      <!-- Stepper -->
      <section id="stepper">
        <app-stepper [steps]="steps" [current]="1" />
      </section>

      <!-- Tabela + Paginação -->
      <section id="table">
        <app-table [columns]="columns" [data]="rows" [selectable]="true" rowKey="id" [actions]="tableActions" />
        <app-table [columns]="columns" [data]="rows" [selectable]="true" rowKey="id" [selected]="['a']" [bulkActions]="bulkActions" />
        <app-table [columns]="columns" [data]="rows" [selectable]="true" rowKey="id" paginate="client" [pageSize]="1" [pageSizeOptions]="[1, 2]" />
        <app-table [columns]="columns" [data]="[]" [selectable]="true" [actions]="tableActions" error="Não foi possível carregar os dados." />
        <app-pagination ariaLabel="Páginas da tabela" [total]="42" [pageSize]="5" [pageIndex]="2" showFirstLast />
        <app-pagination ariaLabel="Páginas resumidas" [total]="42" [pageSize]="5" compact />
      </section>

      <!-- Toasts -->
      <app-toast-container />
    </main>

    <!-- Overlays: só abertos no teste deles (aberto, o resto da página fica inerte e o axe o ignora) -->
    <app-dialog title="Confirmar" [opened]="overlays()" describedBy="dlg-desc"
                primaryLabel="Confirmar" secondaryLabel="Cancelar">
      <p id="dlg-desc">Tem certeza?</p>
    </app-dialog>
    <app-actionbar title="Detalhes" [opened]="overlays()" primaryLabel="Salvar">
      <p>Conteúdo</p>
    </app-actionbar>
  `
})
class GalleryComponent {
  options = OPTIONS;
  plans = [{ label: 'Básico', value: 'basic', description: 'Grátis' }, { label: 'Pro', value: 'pro' }, { label: 'Empresa', value: 'ent', disabled: true }];
  tree = TREE;
  lazyTree: TreeNode[] = [{ key: 'sp', label: 'São Paulo', leaf: false }, { key: 'ba', label: 'Bahia', leaf: false }];
  failLoad = () => Promise.reject(new Error('500'));
  steps = [{ label: 'Entrega', caption: 'Endereço' }, { label: 'Produto' }, { label: 'Resumo' }];
  columns: ColumnDef<Row>[] = [{ key: 'nome', header: 'Nome' }, { key: 'tipo', header: 'Tipo' }];
  rows: Row[] = [{ id: 'a', nome: 'Ana', tipo: 'Titular' }, { id: 'b', nome: 'Bruno', tipo: 'Adicional' }];
  tableActions: TableAction<Row>[] = [{ kind: 'edit' }, { kind: 'delete', disabled: r => r.tipo === 'Titular', disabledReason: () => 'o titular não pode ser excluído' }];
  bulkActions: TableBulkAction[] = [{ type: 'export', label: 'Exportar' }, { type: 'delete', label: 'Excluir', danger: true, disabled: keys => keys.includes('a'), disabledReason: () => 'o titular não pode ser excluído' }];
  overlays = signal(false);
}

describe('Acessibilidade (axe-core)', () => {
  let fixture: ComponentFixture<GalleryComponent>;
  let el: HTMLElement;
  let restoreLayout: () => void;

  const section = (id: string) => el.querySelector<HTMLElement>(`#${id}`)!;
  const open = async (scope: HTMLElement) => {
    scope.querySelector<HTMLButtonElement>('button.control')!.click();
    await new Promise(r => setTimeout(r));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    restoreLayout = stubLayout();
    await TestBed.configureTestingModule({
      imports: [GalleryComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(GalleryComponent);
    el = fixture.nativeElement;
    TestBed.inject(ToastService).success('Salvo com sucesso', { duration: 0 });
    TestBed.inject(ToastService).error('Falha ao salvar', { duration: 0 });
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
    restoreLayout();
  });

  // relatório público (public/a11y-report.json): o site mostra o resultado de cada componente
  afterAll(() => writeA11yReport());

  it('Button', async () => { await expectNoA11yViolations(section('button'), { component: 'button', state: { pt: 'sólido, fantasma desabilitado e link', en: 'solid, disabled ghost and link' } }); });

  it('Checkbox (todos os estados)', async () => { await expectNoA11yViolations(section('checkbox'), { component: 'checkbox', state: { pt: 'marcado, parcial, desabilitado, com erro e só aria-label', en: 'checked, partial, disabled, with error and aria-label only' } }); });

  it('Checkbox group (selecionar todos parcial, horizontal com erro, desabilitado)', async () => { await expectNoA11yViolations(section('checkboxgroup'), { component: 'checkboxgroup', state: { pt: 'selecionar todos parcial, horizontal com erro e desabilitado', en: 'partial select all, horizontal with error and disabled' } }); });
  it('Radio group (obrigatório, horizontal com erro, desabilitado)', async () => { await expectNoA11yViolations(section('radio'), { component: 'radio', state: { pt: 'obrigatório, horizontal com erro e desabilitado', en: 'required, horizontal with error and disabled' } }); });

  it('Switch (ligado, rótulo antes, desabilitado, só aria-label)', async () => { await expectNoA11yViolations(section('switch'), { component: 'switch', state: { pt: 'ligado, rótulo antes, desabilitado e só aria-label', en: 'on, label first, disabled and aria-label only' } }); });

  it('Form field (dica, erro, máscara, textarea)', async () => { await expectNoA11yViolations(section('formfield'), { component: 'validation', state: { pt: 'campo com dica, erro, máscara e área de texto', en: 'field with hint, error, mask and textarea' } }); });

  it('Select fechado e aberto', async () => {
    await expectNoA11yViolations(section('select'), { component: 'select', state: { pt: 'fechado', en: 'closed' } });
    await open(section('select'));
    await expectNoA11yViolations(section('select'), { component: 'select', state: { pt: 'aberto, com grupos', en: 'open, with groups' } });
  });

  it('TreeSelect fechado e aberto (single e checkbox)', async () => {
    await expectNoA11yViolations(section('treeselect'), { component: 'treeselect', state: { pt: 'fechados', en: 'closed' } });
    const [single, multi] = Array.from(section('treeselect').querySelectorAll<HTMLElement>('app-tree-select'));
    await open(single);
    await expectNoA11yViolations(section('treeselect'), { component: 'treeselect', state: { pt: 'seleção única, aberto', en: 'single selection, open' } });
    await open(multi);
    await expectNoA11yViolations(section('treeselect'), { component: 'treeselect', state: { pt: 'com caixas, aberto e com erro', en: 'checkbox mode, open and with error' } });
  });

  it('TreeSelect sob demanda: aberto, com erro de carregamento anunciado', async () => {
    const lazy = section('treeselect').querySelectorAll<HTMLElement>('app-tree-select')[2];
    await open(lazy);
    lazy.querySelector<HTMLElement>('.twisty')!.click();
    await new Promise(r => setTimeout(r));
    await fixture.whenStable();
    expect(lazy.querySelector('.node-error')).not.toBeNull();
    expect(lazy.querySelector('[role="status"]')!.textContent).toContain('São Paulo');
    await expectNoA11yViolations(section('treeselect'), { component: 'treeselect', state: { pt: 'sob demanda, com erro de carregamento anunciado', en: 'on demand, with an announced loading error' } });
  });

  it('Tabs (contador, rótulo com ícone, desabilitada, sob demanda)', async () => { await expectNoA11yViolations(section('tabs'), { component: 'tabs', state: { pt: 'contador, rótulo com ícone, desabilitada e sob demanda', en: 'badge, icon label, disabled and on demand' } }); });

  it('Tooltip fechado e aberto (como nome e como descrição)', async () => {
    const scope = section('tooltip');
    await expectNoA11yViolations(scope, { component: 'tooltip', state: { pt: 'fechado', en: 'closed' } });

    const [named, described] = Array.from(scope.querySelectorAll<HTMLButtonElement>('button'));
    expect(named.getAttribute('aria-labelledby')).toMatch(/^tip-/);
    expect(described.getAttribute('aria-describedby')).toMatch(/^tip-/);

    described.focus();
    const tip = document.getElementById(described.getAttribute('aria-describedby')!)!;
    expect(tip.hidden).toBe(false);
    await expectNoA11yViolations(scope, { component: 'tooltip', state: { pt: 'aberto, como nome e como descrição', en: 'open, as a name and as a description' } });
    // o balão fica no <body>, fora da seção
    await expectNoA11yViolations(tip, { component: 'tooltip', state: { pt: 'o balão aberto', en: 'the open bubble' } });
  });

  it('Stepper', async () => { await expectNoA11yViolations(section('stepper'), { component: 'stepper', state: { pt: 'etapa ativa, concluída e futuras', en: 'active, done and upcoming steps' } }); });

  it('Tabela e Paginação', async () => {
    // cada variação separada, para o relatório dizer o que foi verificado
    const [actions, bulk, paged, error] = Array.from(section('table').querySelectorAll('app-table'));
    await expectNoA11yViolations(actions, { component: 'table', state: { pt: 'ações por linha, com dica e indisponível', en: 'row actions, with tooltip and unavailable' } });
    await expectNoA11yViolations(bulk, { component: 'table', state: { pt: 'ações em massa, com seleção', en: 'bulk actions, with a selection' } });
    await expectNoA11yViolations(paged, { component: 'table', state: { pt: 'paginada, com itens por página', en: 'paginated, with rows per page' } });
    await expectNoA11yViolations(error, { component: 'table', state: { pt: 'estado de erro, com Tentar novamente', en: 'error state, with Try again' } });
    const [full, compact] = Array.from(section('table').querySelectorAll('app-pagination'));
    await expectNoA11yViolations(full, { component: 'pagination', state: { pt: 'completa, com primeira e última', en: 'full, with first and last' } });
    await expectNoA11yViolations(compact, { component: 'pagination', state: { pt: 'compacta', en: 'compact' } });
  });

  it('Toasts', async () => {
    await expectNoA11yViolations(el.querySelector('app-toast-container')!, { component: 'toast', state: { pt: 'sucesso e erro na pilha', en: 'success and error in the stack' } });
  });

  it('Dialog e ActionBar abertos', async () => {
    fixture.componentInstance.overlays.set(true);
    await new Promise(r => setTimeout(r));
    await fixture.whenStable();
    await expectNoA11yViolations(el.querySelector('app-dialog')!, { component: 'dialog', state: { pt: 'aberto', en: 'open' } });
    await expectNoA11yViolations(el.querySelector('app-actionbar')!, { component: 'actionbar', state: { pt: 'aberto', en: 'open' } });
  });
});
