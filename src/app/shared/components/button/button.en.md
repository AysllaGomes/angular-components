# Button (appButton)

Reusable directive to style `<button>`/`<a>` with theme tokens.

**Inputs**
- `variant`: `"solid" | "outline" | "ghost" | "link"` (default `"solid"`)
- `tone`: `"accent" | "neutral" | "danger"` (default `"accent"`)
- `size`: `"xs" | "sm" | "md" | "lg" (default `"md"`)

**Examples**
```html
<button appButton="ghost">Save</button>
<button appButton="ghost" tone="neutral">Back</button>
<button appButton="ghost" size="sm">‹</button>
<a appButton variant="link" href="#">Learn more</a>
```

**A11y**
- Maintains native `<button>/<a>` semantics.
- `:focus-visible` states with theme/accent-consistent ring.
