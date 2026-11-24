<p align="right"><a href="./toast.en.md">English</a></p>

# Toast (Standalone, HTML + Sass)

> Textos padrão em **inglês**, trocáveis num lugar só com [`provideUiLabels`](../../labels/labels.md) (`labels.*` nas tabelas abaixo); o input de cada instância vence.

Componente de **toasts** leve e acessível: **serviço + container**. O **serviço** gerencia a fila (signals) e o **container** apenas renderiza a pilha. Sem framework de UI.

---

## Por que existe

Avisos que aparecem e somem precisam ser anunciados pelo leitor de tela sem roubar o foco, empilhar sem se sobrepor, continuar clicáveis mesmo com um modal aberto e não depender de timers no servidor (SSR). Este componente separa a fila (um serviço com signals) da exibição (um container), então qualquer parte do app chama `toast.success(...)`.

## Quando usar

### Use quando

- Confirmar que uma ação deu certo (salvo, enviado, copiado).
- Avisar de um erro que não impede de continuar.
- Oferecer uma ação rápida e opcional, como "Desfazer".

### Prefira outro

- A pessoa precisa decidir algo antes de seguir: use o [Dialog](../dialog/dialog.md).
- Erro de um campo de formulário: mostre junto do campo ([Formulários](../../forms/forms.md)).
- Informação que precisa ficar na tela: use um aviso fixo na página, não um toast que some.

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o Toast em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/toast/` |
| Componentes que ele usa | `components/button/` |
| Textos padrão | `labels/` ([Textos dos componentes](../../labels/labels.md)) |

Estilos globais: acrescente no `styles.sass` (ou `styles.scss`) do seu projeto:

```sass
@use '<sua-pasta>/shared/components/button/button' as *
```

Depende só de `@angular/common`, `@angular/core`. Ao todo: 10 arquivos, ~849 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Arquivos
```
src/app/shared/components/toast/
  ├─ toast.types.ts
  ├─ toast.service.ts
  ├─ toast-container.component.ts
  ├─ toast-container.component.html
  └─ toast-container.component.sass
```

---

## API

### Tipos
```ts
export type ToastKind = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  duration?: number;          // ms; 0 = não fecha sozinho (padrão: 4000, ou 0 com actionLabel)
  dismissible?: boolean;      // default: true
  actionLabel?: string;
  onAction?: () => void;
}
```

### Serviço (`ToastService`)
| Método | Retorno | Descrição |
|---|---|---|
| `show(message, kind?, options?)` | `number` (id) | Mostra um toast. `kind` padrão `'info'`; `options` são os campos opcionais de `Toast` (`duration` padrão `4000` ms, `0` não fecha sozinho; **com `actionLabel` o padrão é `0`**, para a ação não sumir antes de a pessoa chegar nela). |
| `success(message, options?)` | `number` | Atalho para `show(message, 'success', options)`. |
| `error(message, options?)` | `number` | Atalho para `show(message, 'error', options)`; anunciado com `role="alert"`. |
| `info(message, options?)` | `number` | Atalho para `show(message, 'info', options)`. |
| `warning(message, options?)` | `number` | Atalho para `show(message, 'warning', options)`. |
| `dismiss(id)` | `void` | Fecha um toast pelo id. |
| `clear()` | `void` | Fecha todos. |
| `pause()` / `resume()` | `void` | Para / retoma o tempo de todos os toasts, de onde parou. O container já chama sozinho (mouse sobre um toast, foco na pilha); use se quiser pausar por outro motivo. |
| `toasts` | `Signal<Toast[]>` | A pilha atual, do mais novo para o mais antigo (só leitura; no máximo 5). |

> **SSR-safe**: timers só são criados no browser.

### Container (`<app-toast-container>`)  
Sem inputs: lê `toast.toasts()` do serviço e desenha a pilha. Também faz o anúncio para leitor de tela e pausa o tempo enquanto a pessoa lê ou usa um toast (veja Acessibilidade).

---

## Uso

1) **Coloque o container** uma vez (ex.: na Demo Page / App):
```html
<app-toast-container></app-toast-container>
```

2) **Injete e dispare** no seu componente:
```ts
import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({ standalone: true, template: `
  <button (click)="ok()">Success</button>
  <button (click)="fail()">Error</button>
`})
export class Exemplo {
  private toast = inject(ToastService);

  ok()   { this.toast.success('Cartão solicitado com sucesso.'); }
  fail() { this.toast.error('Falha ao solicitar cartão.', { duration: 7000 }); }
  withAction() {
    this.toast.info('Arquivo pronto.', { actionLabel: 'Baixar', onAction: () => {/*...*/} });
  }
}
```

---

## Theming (CSS Custom Properties)

Tokens globais (sobrescreva no `:root` ou por página):

```sass
:root
  --toast-radius: .75rem
  --toast-shadow: 0 6px 20px rgba(0,0,0,.12)
```
Cores por variante (já definidas no Sass do container):
- **success**: `#ecfdf5` / `#86efac` / `#065f46`
- **error**:   `#fee2e2` / `#fca5a5` / `#7f1d1d`
- **info**:    `#eff6ff` / `#93c5fd` / `#1e3a8a`
- **warning**: `#fff7ed` / `#fdba74` / `#7c2d12`

---

## Acessibilidade
- **Anúncio**: duas regiões vivas invisíveis que existem desde o primeiro render (uma região criada junto com o texto costuma não ser lida): erros em `role="alert"` (assertivo), o resto em `role="status"` (educado). Cada toast é anunciado uma vez; a pilha visual não é região viva.
- **Pilha**: `<section>` com nome (`labels.notifications`) só enquanto tem toasts; não usa `<nav>`, porque não é navegação.
- **Tempo** (WCAG 2.2.1): com o mouse sobre um toast ou o foco dentro da pilha, o tempo de todos para e depois continua de onde estava. Toast com `actionLabel` não fecha sozinho, a menos que você passe `duration`.
- Botão de fechar com nome (`labels.close`, "Close" por padrão).
- Foco visível em botões de ação/fechar.
- Continua clicável com um Dialog aberto (o resto da página fica inerte).

---

## Dicas
- Manter na tela até fechar: `{ duration: 0 }`.
- Fila: no máximo 5 toasts; o mais antigo sai quando chega o sexto.
- Ação custom: `actionLabel` + `onAction()` fecha após executar.

---

## Troubleshooting
- **Toasts não aparecem**: faltou `<app-toast-container>` no DOM.
- **Estouro de timers no SSR**: verifique se não criou `setTimeout` fora do serviço (que já é SSR-safe).

---

## Roadmap
- [ ] Empilhar lado a lado em telas largas (layout “stacked/inline”)
- [ ] Animação de saída com swipe
- [ ] Suporte a ícones custom (slot) e densidade compacta
