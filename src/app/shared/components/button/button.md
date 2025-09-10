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
