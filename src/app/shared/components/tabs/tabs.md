<p align="right"><a href="./tabs.en.md">English</a></p>

# Tabs

Abas no padrão **WAI-ARIA** (`tablist` / `tab` / `tabpanel`) para alternar entre seções de uma mesma tela.

- **Arquivos:** `src/app/shared/components/tabs/` (`app-tabs`, `app-tab`, `appTabLabel`, `appTabContent`)

```ts
import { TABS_IMPORTS } from 'src/app/shared/components/tabs';

@Component({ imports: [...TABS_IMPORTS] })
```

> **Tabs ou Stepper?** Abas são seções independentes, abertas em qualquer ordem. Para um fluxo com etapas em sequência, use o `app-stepper`.

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar as Tabs em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/tabs/` |

Depende só de `@angular/common`, `@angular/core`. Ao todo: 8 arquivos, ~414 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Uso

```html
<app-tabs ariaLabel="Conta" [(selected)]="aba">
  <app-tab key="perfil" label="Perfil">…</app-tab>
  <app-tab key="pedidos" label="Pedidos" [badge]="pendentes()">…</app-tab>
  <app-tab key="arquivo" label="Arquivo" disabled>…</app-tab>
</app-tabs>
```

### Rótulo com ícone

```html
<app-tab key="config">
  <ng-template appTabLabel let-active>
    <svg aria-hidden="true">…</svg> Configurações
  </ng-template>
  …
</app-tab>
```

`let-active` diz se a aba está aberta (para trocar o ícone, por exemplo). Ícones decorativos levam `aria-hidden="true"`.

### Conteúdo sob demanda

O conteúdo direto do `app-tab` é criado junto com a página e só fica escondido: o estado (campos digitados, rolagem) continua lá ao voltar.

Para conteúdo pesado ou que busca dados ao iniciar, use `<ng-template appTabContent>`: ele só é criado quando a aba é aberta e é destruído ao sair. Com `keepAlive` no `app-tabs`, é mantido depois da primeira visita.

```html
<app-tabs ariaLabel="Relatórios" keepAlive>
  <app-tab key="vendas" label="Vendas">
    <ng-template appTabContent><app-relatorio-vendas /></ng-template>
  </app-tab>
</app-tabs>
```

### Muitas abas

A lista rola na horizontal (dedo, trackpad, Shift+roda) sem criar rolagem na página, e a aba aberta é trazida para a vista — inclusive quando aberta por `[(selected)]` ou ao girar o celular.

## API

### `app-tabs`

| Propriedade  | Tipo                 | Padrão   | Descrição |
|--------------|----------------------|----------|-----------|
| `selected`   | `string \| null`     | `null`   | Chave da aba aberta. Two-way via `[(selected)]`. Vazia, inexistente ou desabilitada → primeira aba habilitada. |
| `activation` | `'auto' \| 'manual'` | `'auto'` | `auto`: as setas já abrem a aba. `manual`: as setas só movem o foco; Enter/Espaço abrem (use quando abrir a aba for custoso). |
| `keepAlive`  | `boolean`            | `false`  | Mantém o conteúdo `appTabContent` depois da primeira visita. |
| `ariaLabel`  | `string \| null`     | `null`   | Nome da lista de abas para leitor de tela (ex.: "Seções da conta"). |

| Evento           | Payload  | Quando dispara |
|------------------|----------|----------------|
| `selectedChange` | `string` | O usuário abriu outra aba. |

### `app-tab`

| Propriedade | Tipo                       | Padrão  | Descrição |
|-------------|----------------------------|---------|-----------|
| `key`       | `string \| null`           | `null`  | Identificador usado em `selected`. Sem ele, vale a posição (`"0"`, `"1"`...). |
| `label`     | `string`                   | `''`    | Texto da aba (ou use `appTabLabel`). |
| `badge`     | `string \| number \| null` | `null`  | Contador ao lado do rótulo; lido como "Pedidos (3)". |
| `disabled`  | `boolean`                  | `false` | Não pode ser aberta; as setas pulam a aba. |

### Tokens

`--tabs-border`, `--tabs-fg`, `--tabs-fg-hover`, `--tabs-active` (texto da aba aberta), `--tabs-indicator` (sublinhado), `--tabs-hover-bg`, `--tabs-badge-bg`, `--tabs-badge-fg`, `--tabs-badge-border`. Por padrão vêm do accent do tema.

## Acessibilidade

- **Tab** entra na aba aberta e o próximo **Tab** vai para o painel (só uma aba fica na ordem de tabulação).
- **← →** trocam de aba, pulando as desabilitadas e dando a volta; **Home/End** vão para a primeira/última.
- Cada aba aponta para o seu painel (`aria-controls`) e o painel é nomeado pela aba (`aria-labelledby`); a aba aberta tem `aria-selected="true"`.
- O contador não vira "Pedidos3": o número visível é escondido do leitor, que ouve "Pedidos (3)".
- Em alto contraste do Windows, o sublinhado da aba aberta usa a cor do sistema.
