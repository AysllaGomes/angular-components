<p align="right"><a href="./menu.en.md">English</a></p>

# Menu (`app-menu`)

Lista de **ações** que abre a partir de um botão (padrão WAI-ARIA *menu button*). O botão ganha `[appMenuTrigger]`, e os itens são `<button>` e `<a>` **nativos** com `appMenuItem`: o seu `(click)`, `routerLink`, `href` e ícones funcionam como sempre. Abre junto ao botão com `position: fixed` (não é cortado por `overflow`) e vira para cima quando falta espaço.

- **Arquivos:** `src/app/shared/components/menu/` (importe `MENU_IMPORTS` de `menu/index.ts`)

| Quando usar | Componente |
|---|---|
| Várias **ações** atrás de um botão ("Ações", "⋮") | **`app-menu`** |
| Escolher um **valor** que fica no campo | `app-select` |
| Navegar entre seções da mesma tela | `app-tabs` |
| Uma ou duas ações visíveis | `appButton` direto |

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o Menu em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/menu/` |

Depende só de `@angular/core`. Ao todo: 7 arquivos, ~473 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Por que existe

Um "menu" feito com `<div>`s e `*ngIf` costuma falhar no teclado e no leitor de tela: o foco não entra na lista, as setas não andam, o Esc não fecha, o foco se perde ao escolher, e o painel some cortado dentro de uma tabela com rolagem. Este componente segue o padrão de *menu button*: foco gerenciado pelas setas, busca pela inicial, Esc e Tab fecham, o foco volta ao botão, e o painel flutua por cima de tudo.

## Quando usar

### Use quando

- Há várias ações para o mesmo item e não cabem todas na tela, como "Editar, Duplicar, Arquivar, Excluir" numa linha de tabela.
- As ações são secundárias e ficariam pesadas como botões soltos.

### Prefira outro

- A pessoa escolhe um **valor** que fica visível no campo: use o [Select](../select/select.md).
- Uma ou duas ações importantes: deixe como botões visíveis ([Button](../button/button.md)); esconder a ação principal num menu atrapalha.
- Trocar de seção na mesma tela: use as [Tabs](../tabs/tabs.md).

## Uso

```ts
import { MENU_IMPORTS } from './shared/components/menu';

@Component({ imports: [...MENU_IMPORTS, ButtonDirective], ... })
```

```html
<button appButton variant="outline" [appMenuTrigger]="acoes">Ações</button>
<app-menu #acoes>
  <button appMenuItem (click)="editar()">Editar</button>
  <a appMenuItem routerLink="/pedidos/1042">Abrir o pedido</a>
  <button appMenuItem disabled>Mover (sem permissão)</button>
  <hr appMenuSeparator>
  <button appMenuItem tone="danger" (click)="excluir()">Excluir</button>
</app-menu>

<!-- só ícone: dê nome ao botão; o menu é nomeado pelo label -->
<button appButton variant="ghost" iconOnly aria-label="Mais ações do pedido 1042" [appMenuTrigger]="mais">⋮</button>
<app-menu #mais label="Ações do pedido 1042" placement="bottom-end">...</app-menu>
```

- **Escolher um item** fecha o menu e devolve o foco ao botão **antes** de rodar o `(click)` do item. Se a ação abrir um [Dialog](../dialog/dialog.md) de confirmação, ele guarda o botão do menu e devolve o foco a ele ao fechar.
- **Desabilitado** (`disabled`): o item continua focável pelas setas (para a pessoa saber que existe), com `aria-disabled`, mas não age. O `disabled` nativo é retirado de propósito.
- **Posição** (`placement`): `bottom-start` (padrão), `bottom-end`, `top-start`, `top-end`. Sem espaço, vira para o outro lado; um menu mais alto que o espaço rola.

## API

### `app-menu` · Inputs

| Propriedade | Tipo            | Padrão           | Descrição |
|-------------|-----------------|------------------|-----------|
| `label`     | `string \| null` | `null`          | Nome do menu (`aria-label`). Sem ele, o menu é nomeado pelo texto do botão (`aria-labelledby`). |
| `placement` | `MenuPlacement` | `'bottom-start'` | Lado e alinhamento preferidos: `bottom-start`, `bottom-end`, `top-start`, `top-end`. |

### `app-menu` · Outputs e métodos

| Nome          | Tipo / payload | Descrição |
|---------------|----------------|-----------|
| `openedChange` | `boolean`     | Abriu (`true`) ou fechou (`false`). |
| `close()`     | método         | Fecha (devolve o foco ao botão). Use com `#acoes` no template. |

### `[appMenuTrigger]`

| Entrada          | Tipo            | Descrição |
|------------------|-----------------|-----------|
| `appMenuTrigger` | `MenuComponent` | O menu que o botão abre (a variável `#acoes` do `<app-menu>`). |

### `appMenuItem` (em `<button>` ou `<a>`)

| Entrada    | Tipo                    | Padrão      | Descrição |
|------------|-------------------------|-------------|-----------|
| `disabled` | `boolean`               | `false`     | Focável mas sem ação (`aria-disabled`). |
| `tone`     | `'default' \| 'danger'` | `'default'` | `danger` para ações destrutivas (texto vermelho). |

`appMenuSeparator` (em `<hr>`): linha entre grupos de itens (`role="separator"`).

## Acessibilidade e teclado

| Tecla | No botão | No menu |
|---|---|---|
| `Enter` / `Espaço` | Abre no primeiro item | Escolhe o item (`Espaço` também em links) |
| `↓` / `↑` | Abre no primeiro / último item | Próximo / anterior (dá a volta) |
| `Home` / `End` | — | Primeiro / último item |
| Letras | — | Próximo item que começa com o texto (sem acento nem caixa) |
| `Esc` | Fecha o menu, se estiver aberto | Fecha e volta ao botão (um Dialog por trás não fecha junto) |
| `Tab` / `Shift+Tab` | — | Fecha e segue para o próximo / anterior (no `Shift+Tab`, normalmente o próprio botão) |

- O botão tem `aria-haspopup="menu"`, `aria-expanded` e `aria-controls` (enquanto aberto).
- `role="menu"` com nome (`label`, ou o texto do botão); itens `role="menuitem"` fora da ordem do Tab (o menu move o foco).
- Clique fora fecha sem roubar o foco; escolher um item devolve o foco ao botão.
- Botão só com ícone: dê `aria-label` a ele (o Tooltip ajuda quem enxerga).

## Tokens

Com valor padrão: `--menu-bg` (`--surface`), `--menu-fg` (`--fg`), `--menu-border` (`--border`), `--menu-shadow`, `--menu-item-hover` (tinta do `--accent`). O item `danger` usa `--danger`; o desabilitado, `--muted`; o foco, `--accent`.
