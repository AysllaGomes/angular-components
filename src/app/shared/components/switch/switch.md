<p align="right"><a href="./switch.en.md">English</a></p>

# Switch

Liga/desliga para **configurações que valem na hora** (ex.: "Notificações"). Construído sobre `<input type="checkbox" role="switch">` **nativo**, com os tokens de cor do Checkbox (`--cb-*`).

- **Arquivo:** `src/app/shared/components/switch/switch.component.ts`

> **Switch ou Checkbox?** Switch muda algo imediatamente. Para aceitar termos, marcar itens de uma lista ou escolhas que só valem ao enviar um formulário, use o `app-checkbox`.

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o Switch em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/switch/` |

Depende só de `@angular/core`, `@angular/forms`. Ao todo: 3 arquivos, ~181 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Uso

```html
<app-switch [(checked)]="notificacoes">Notificações por e-mail</app-switch>

<!-- lista de configurações: rótulo à esquerda, switch à direita -->
<app-switch labelFirst [formControl]="modoCompacto">Modo compacto</app-switch>
```

O **rótulo é o conteúdo**. Sem texto visível, use `ariaLabel`.

## API

### Inputs

| Propriedade  | Tipo             | Padrão  | Descrição |
|--------------|------------------|---------|-----------|
| `checked`    | `boolean`        | `false` | Ligado. Two-way via `[(checked)]`; com formulários, use `formControl`/`ngModel`. |
| `disabled`   | `boolean`        | `false` | Desabilita (o formulário também pode). |
| `labelFirst` | `boolean`        | `false` | Rótulo à esquerda e switch à direita, ocupando a largura. |
| `hint`       | `string \| null` | `null`  | Texto de apoio, ligado por `aria-describedby`. |
| `ariaLabel`  | `string \| null` | `null`  | Rótulo para leitor de tela sem texto visível. |
| `name`       | `string \| null` | `null`  | `name` do input nativo. |

### Outputs

| Evento          | Payload   | Quando dispara |
|-----------------|-----------|----------------|
| `checkedChange` | `boolean` | O usuário ligou/desligou. |

### Tokens

Usa `--cb-border`, `--cb-checked-bg`, `--cb-mark`, `--cb-disabled-*` e os anéis `--cb-hover-ring`/`--cb-focus-ring`. Tamanho no próprio componente: `--sw-w` (40px), `--sw-h` (22px), `--sw-pad` (3px).

## Acessibilidade

- `role="switch"` num checkbox nativo: o leitor de tela anuncia "ligado"/"desligado"; `Espaço` alterna; clicar no rótulo também.
- Foco por teclado mostra um anel no trilho. Com "reduzir movimento", a bolinha não anima.
