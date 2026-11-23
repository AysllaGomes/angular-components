<p align="right"><a href="./tooltip.en.md">English</a></p>

# Tooltip

Dica curta sobre um elemento, mostrada ao **passar o mouse** ou **focar pelo teclado**. É uma diretiva: vai em qualquer elemento focável (`<button>`, `<a>`, `appButton`...).

- **Arquivos:** `src/app/shared/components/tooltip/` (`appTooltip`, estilo global em `tooltip.sass`)

```ts
import { TooltipDirective } from 'src/app/shared/components/tooltip/tooltip.directive';

@Component({ imports: [TooltipDirective] })
```

O estilo já entra pelo `styles.sass` (`@use './app/shared/components/tooltip/tooltip'`): o balão é criado no `<body>`, fora de qualquer componente.

## Por que existe

O atributo `title` do navegador não abre pelo teclado, não pode ser estilizado e some sozinho. Uma dica acessível precisa abrir no foco de teclado, ser lida pelo leitor de tela, fechar com `Esc`, deixar o mouse chegar até ela e não ser cortada por `overflow: hidden`. Esta diretiva faz isso em qualquer elemento focável.

## Quando usar

### Use quando

- Dar nome a um botão só com ícone.
- Uma explicação curta e opcional sobre um elemento.
- Explicar por que uma ação está indisponível.

### Prefira outro

- Informação essencial: deixe no texto da tela, porque no celular não existe "passar o mouse".
- Conteúdo com links ou botões: use o [Dialog](../dialog/dialog.md) ou o [ActionBar](../actionbar/actionbar.md).

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o Tooltip em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/tooltip/` |

Estilos globais: acrescente no `styles.sass` (ou `styles.scss`) do seu projeto:

```sass
@use '<sua-pasta>/shared/components/tooltip/tooltip'
```

Depende só de `@angular/common`, `@angular/core`. Ao todo: 3 arquivos, ~445 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Uso

### Botão só com ícone: a dica é o nome

```html
<button appButton="ghost" iconOnly type="button" appTooltip="Editar" tooltipAsLabel>
  <svg aria-hidden="true">…</svg>
</button>
```

Com `tooltipAsLabel` o texto vira o **nome** do botão (`aria-labelledby`): o leitor de tela anuncia "Editar, botão". Sem ele, o botão ficaria sem nome.

### Explicação extra: a dica é a descrição

```html
<button type="button" aria-label="Sobre o prazo" appTooltip="Dias úteis após o pagamento" tooltipPosition="right">
  <svg aria-hidden="true">…</svg>
</button>
```

Sem `tooltipAsLabel`, o texto é a **descrição** (`aria-describedby`), lida depois do nome: "Sobre o prazo, botão, Dias úteis após o pagamento". Ids que já estavam no `aria-describedby` continuam lá.

### Explicando uma ação indisponível

Um botão `disabled` não recebe foco nem eventos de mouse, então a dica nunca apareceria. Use `aria-disabled="true"` e ignore o clique:

```html
<button type="button" aria-disabled="true" (click)="$event.preventDefault()"
        appTooltip="Só administradores podem excluir a conta.">
  Excluir conta
</button>
```

### Texto dinâmico / i18n

```html
<button [appTooltip]="'acoes.editar' | t" tooltipAsLabel>…</button>
<button [appTooltip]="podeSalvar() ? null : 'Preencha os campos obrigatórios'">Salvar</button>
```

Texto vazio ou `null` desliga a dica (e tira a referência ARIA).

## API

### Inputs

| Propriedade        | Tipo                                     | Padrão  | Descrição |
|--------------------|------------------------------------------|---------|-----------|
| `appTooltip`       | `string \| null`                         | `null`  | Texto da dica. Vazio ou `null` desliga. |
| `tooltipPosition`  | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Lado preferido. Sem espaço, vira para o oposto; o balão nunca sai da janela. |
| `tooltipAsLabel`   | `boolean`                                | `false` | A dica é o nome do elemento (`aria-labelledby`), para botões só com ícone. |
| `tooltipDisabled`  | `boolean`                                | `false` | Desliga a dica sem apagar o texto. |
| `tooltipShowDelay` | `number` (ms)                            | `300`   | Espera para abrir no mouse. Foco pelo teclado abre na hora; passando de uma dica para outra também. |
| `tooltipHideDelay` | `number` (ms)                            | `100`   | Espera para fechar, dando tempo de levar o mouse até o balão. |

### Tokens

`--tip-bg`, `--tip-fg`, `--tip-radius`, `--tip-max-width` (padrão `18rem`), `--tip-font-size`, `--tip-shadow`, `--tip-z` (padrão `1000`, acima do Dialog e do ActionBar). No tema escuro o balão inverte (claro sobre a página escura).

## Comportamento

- O balão é criado no `<body>` com `position: fixed`: não é cortado por `overflow: hidden` (tabelas, cards, Dialog) e acompanha rolagem e redimensionamento enquanto aberto.
- Só um balão aberto por vez.
- Clicar no elemento fecha a dica (ela não cobre o menu ou o diálogo que o clique abre).
- Foco por clique e toque não abrem a dica; só mouse por cima e foco de teclado (`:focus-visible`).

## Acessibilidade

- `role="tooltip"`, ligado ao elemento por `aria-describedby` (ou `aria-labelledby` com `tooltipAsLabel`). O balão existe desde o início (escondido), então a dica é lida assim que o elemento recebe foco, sem esperar a animação.
- **WCAG 1.4.13 (conteúdo em hover ou foco):**
  - **dispensável:** **Esc** fecha a dica sem mover o foco. O Esc para na dica, então um Dialog aberto por trás só fecha no próximo Esc;
  - **passível de hover:** dá para levar o mouse até o balão (para ler ou ampliar) sem ele sumir;
  - **persistente:** fica aberto enquanto houver mouse ou foco, sem tempo limite.
- Dentro de Dialog/ActionBar o balão não fica inerte (`data-dialog-keep-active`).
- Alto contraste do Windows: borda na cor do sistema; com "reduzir movimento", sem animação.
