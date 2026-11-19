import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe';
import { stubLayout } from '../../../testing/layout-stub';

import { ColumnDef } from '../model/interface/column-def.interface';
import { TreeNode } from '../model/interface/tree-select/tree-node.interface';
import { SelectOption } from '../model/interface/select/select-option.interface';

import { ToastService } from '../services/toast.service';
import { TableComponent } from './table/table.component';
import { DialogComponent } from './dialog/dialog.component';
import { SelectComponent } from './select/select.component';
import { ButtonDirective } from './button/button.directive';
import { StepperComponent } from './stepper/stepper.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { SwitchComponent } from './switch/switch.component';
import { RadioGroupComponent } from './radio/radio-group.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { MaskDirective } from '../forms/mask.directive';
import { ActionBarComponent } from './actionbar/actionbar.component';
import { PaginationComponent } from './pagination/pagination.component';
import { TreeSelectComponent } from './tree-select/tree-select.component';
import { TABS_IMPORTS } from './tabs';
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
    ButtonDirective, CheckboxComponent, RadioGroupComponent, SwitchComponent, FormFieldComponent, MaskDirective, SelectComponent, TreeSelectComponent, StepperComponent,
    TableComponent, PaginationComponent, DialogComponent, ActionBarComponent, ToastContainerComponent, ...TABS_IMPORTS,
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

      <!-- Stepper -->
      <section id="stepper">
        <app-stepper [steps]="steps" [current]="1" />
      </section>

      <!-- Tabela + Paginação -->
      <section id="table">
        <app-table [columns]="columns" [data]="rows" [selectable]="true" rowKey="id" />
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
      providers: [provideZonelessChangeDetection()]
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

  it('Button', async () => { await expectNoA11yViolations(section('button')); });

  it('Checkbox (todos os estados)', async () => { await expectNoA11yViolations(section('checkbox')); });

  it('Radio group (obrigatório, horizontal com erro, desabilitado)', async () => { await expectNoA11yViolations(section('radio')); });

  it('Switch (ligado, rótulo antes, desabilitado, só aria-label)', async () => { await expectNoA11yViolations(section('switch')); });

  it('Form field (dica, erro, máscara, textarea)', async () => { await expectNoA11yViolations(section('formfield')); });

  it('Select fechado e aberto', async () => {
    await expectNoA11yViolations(section('select'));
    await open(section('select'));
    await expectNoA11yViolations(section('select'));
  });

  it('TreeSelect fechado e aberto (single e checkbox)', async () => {
    await expectNoA11yViolations(section('treeselect'));
    const [single, multi] = Array.from(section('treeselect').querySelectorAll<HTMLElement>('app-tree-select'));
    await open(single);
    await expectNoA11yViolations(section('treeselect'));
    await open(multi);
    await expectNoA11yViolations(section('treeselect'));
  });

  it('TreeSelect sob demanda: aberto, com erro de carregamento anunciado', async () => {
    const lazy = section('treeselect').querySelectorAll<HTMLElement>('app-tree-select')[2];
    await open(lazy);
    lazy.querySelector<HTMLElement>('.twisty')!.click();
    await new Promise(r => setTimeout(r));
    await fixture.whenStable();
    expect(lazy.querySelector('.node-error')).not.toBeNull();
    expect(lazy.querySelector('[role="status"]')!.textContent).toContain('São Paulo');
    await expectNoA11yViolations(section('treeselect'));
  });

  it('Tabs (contador, rótulo com ícone, desabilitada, sob demanda)', async () => { await expectNoA11yViolations(section('tabs')); });

  it('Stepper', async () => { await expectNoA11yViolations(section('stepper')); });

  it('Tabela e Paginação', async () => { await expectNoA11yViolations(section('table')); });

  it('Toasts', async () => {
    await expectNoA11yViolations(el.querySelector('app-toast-container')!);
  });

  it('Dialog e ActionBar abertos', async () => {
    fixture.componentInstance.overlays.set(true);
    await new Promise(r => setTimeout(r));
    await fixture.whenStable();
    await expectNoA11yViolations(el.querySelector('app-dialog')!);
    await expectNoA11yViolations(el.querySelector('app-actionbar')!);
  });
});
