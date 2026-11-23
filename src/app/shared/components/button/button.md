<p align="right"><a href="./button.en.md">English</a></p>

# Button (appButton)

Diretiva que dá o visual do tema a um `<button>` ou `<a>` nativo: variante, tom e tamanho, com estados de carregando e desabilitado.

- **Arquivo:** `src/app/shared/components/button/button.directive.ts` (estilo global em `button.sass`)

## Por que existe

Um componente de botão que envolve o `<button>` costuma esconder atributos nativos (`type`, `disabled`, `aria-*`) e atrapalhar formulários e links. Como diretiva, o `appButton` só aplica o visual (variante, tom e tamanho com os tokens do tema) e deixa o elemento nativo fazer o resto: teclado, foco, envio de formulário e navegação.

## Quando usar

### Use quando

- Qualquer ação na tela: use num `<button>`.
- Um link que precisa parecer botão: use num `<a href>`, que continua sendo link.
- Ações destrutivas: use `tone="danger"`.

### Prefira outro

- Um botão só com ícone: use o botão e dê o nome com o [Tooltip](../tooltip/tooltip.md) (`tooltipAsLabel`).
- Ir para outra página dentro de um texto: use um link comum, sem `appButton`.

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o Button em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/button/` |

Estilos globais: acrescente no `styles.sass` (ou `styles.scss`) do seu projeto:

```sass
@use '<sua-pasta>/shared/components/button/button' as *
```

Depende só de `@angular/core`. Ao todo: 3 arquivos, ~269 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Uso

```html
<button appButton type="submit">Salvar</button>
<button appButton="ghost" tone="neutral" type="button">Voltar</button>
<button appButton="outline" tone="danger" type="button">Excluir</button>
<button appButton [busy]="salvando()" type="submit">Enviar</button>
<a appButton variant="link" href="/ajuda">Saiba mais</a>
```

A variante pode vir no próprio atributo (`appButton="ghost"`) ou em `variant`, que tem prioridade. O atributo vazio (`<button appButton>`) é `solid`.

## API

### Inputs

| Propriedade | Tipo | Padrão | Descrição |
|---|---|---|---|
| `appButton` / `variant` | `'solid' \| 'outline' \| 'ghost' \| 'pill' \| 'link'` | `'solid'` | Forma do botão. `variant` vence `appButton`. |
| `tone` | `'accent' \| 'neutral' \| 'danger'` | `'accent'` | Paleta: destaque do tema, neutra ou de ação destrutiva. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho. |
| `block` | `boolean` | `false` | Ocupa a largura toda. Aceita o atributo vazio. |
| `iconOnly` | `boolean` | `false` | Quadrado para um ícone só. Precisa de nome (`aria-label` ou Tooltip com `tooltipAsLabel`). |
| `busy` | `boolean` | `false` | Carregando: mostra um spinner, marca `aria-busy` e bloqueia o clique. |
| `disabled` | `boolean` | `false` | Desabilita. No `<button>` usa o `disabled` nativo; no `<a>`, `aria-disabled` e sai da ordem do Tab. |

## Acessibilidade

- Continua sendo o `<button>` ou `<a>` nativo: Enter e Espaço, envio de formulário e navegação funcionam sem nada a mais.
- `busy` e `disabled` bloqueiam o clique. No `<button>` viram o atributo `disabled`; no `<a>`, que não tem `disabled`, viram `aria-disabled="true"` e `tabindex="-1"`.
- `busy` marca `aria-busy="true"`; o texto do botão continua lá para o leitor de tela.
- Anel de foco (`:focus-visible`) na cor de destaque do tema, só no foco por teclado.
- Botão só com ícone (`iconOnly`) não tem texto visível: dê o nome com `aria-label` ou com o [Tooltip](../tooltip/tooltip.md) (`tooltipAsLabel`).
