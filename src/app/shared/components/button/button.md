# Botão (appButton)

Diretiva reutilizável para estilizar `<button>`/`<a>` com tokens do tema.

**Entradas**
- `variant`: `"solid" | "outline" | "ghost" | "link"` (padrão `"solid"`)
- `tone`: `"accent" | "neutral" | "danger"` (padrão `"accent"`)
- `size`: `"xs" | "sm" | "md" | "lg"` (padrão `"md"`)

**Exemplos**
```html
<button appButton="ghost">Salvar</button>
<button appButton="ghost" tone="neutral">Voltar</button>
<button appButton="ghost" size="sm">‹</button>
<a appButton variante="link" href="#">Saiba mais</a>
```

**A11y**
- Mantém semântica nativa de `<button>/<a>`.
- Estados `:focus-visible` com anel consistente ao tema/accent.

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o Button em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/button/` |
| Tipos | `model/type/button/bnt-size.type.ts`<br>`model/type/button/bnt-tone.type.ts`<br>`model/type/button/bnt-variant.type.ts` |

Estilos globais: acrescente no `styles.sass` (ou `styles.scss`) do seu projeto:

```sass
@use '<sua-pasta>/shared/components/button/button' as *
```

Depende só de `@angular/core`. Ao todo: 5 arquivos, ~269 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->
