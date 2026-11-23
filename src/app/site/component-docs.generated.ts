// GERADO por `npm run docs:pages` a partir dos .md de cada componente. Não edite à mão:
// mude o .md e rode o script (o CI confere com `npm run check:pages`).
import { ComponentDocs } from './component-docs.types';

/** componentes com página completa (têm "Por que existe" nos dois idiomas) */
export const COMPONENT_PAGES_READY: readonly string[] = ["select","table","tabs"];

export const COMPONENT_DOCS: Record<string, ComponentDocs> = {
  "actionbar": {
    "pt": {
      "lead": "Sheet lateral com título, conteúdo e ações. Abre da <strong>direita para a esquerda</strong>, herda as cores do tema atual e respeita o <strong>accent</strong>.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": null,
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Input",
            "Tipo",
            "Default",
            "Descrição"
          ],
          "rows": [
            [
              "<code>title</code>",
              "<code>string</code>",
              "<code>'ActionBar'</code>",
              "Título exibido no header."
            ],
            [
              "<code>size</code>",
              "<code>'sm' | 'md' | 'lg' | 'auto'</code>",
              "<code>'auto'</code>",
              "Largura do sheet. <code>auto</code> usa o conteúdo para decidir."
            ],
            [
              "<code>closeOnBackdrop</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "Fecha ao clicar no backdrop."
            ],
            [
              "<code>primaryLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Texto do botão primário (mostra se definido)."
            ],
            [
              "<code>secondaryLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Texto do botão secundário (mostra se definido)."
            ],
            [
              "<code>opened</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Controla a abertura. Use <code>[(opened)]</code> para two‑way."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Output",
            "Tipo",
            "Dispara quando"
          ],
          "rows": [
            [
              "<code>primary</code>",
              "<code>void</code>",
              "Clicar no botão primário."
            ],
            [
              "<code>secondary</code>",
              "<code>void</code>",
              "Clicar no botão secundário."
            ],
            [
              "<code>openedChange</code>",
              "<code>boolean</code>",
              "O painel abre/fecha por conta própria (ESC, backdrop, ×, <code>openBar()</code>/<code>close()</code>). Parte do <code>[(opened)]</code>; não dispara quando o pai muda <code>[opened]</code>."
            ]
          ]
        },
        {
          "title": "Métodos públicos",
          "head": [
            "Método",
            "Descrição"
          ],
          "rows": [
            [
              "<code>openBar()</code>",
              "Abre a ActionBar."
            ],
            [
              "<code>close()</code>",
              "Fecha a ActionBar."
            ]
          ]
        }
      ],
      "a11y": [
        "<code>role=&quot;dialog&quot;</code> + <code>aria-modal=&quot;true&quot;</code> + <code>aria-labelledby</code> amarrado ao título.",
        "<strong>Teclado:</strong> <code>Esc</code> fecha; Tab mantém o foco preso dentro do sheet (focus‑trap).",
        "<strong>Foco inicial:</strong> ao abrir, o foco vai para o botão de fechar.",
        "<strong>Foco devolvido:</strong> ao fechar (botão, <code>Esc</code>, backdrop ou <code>opened=false</code>), o foco volta ao elemento que estava focado antes de abrir (normalmente o botão que abriu), se ele ainda estiver na página.",
        "<strong>Fundo inerte e sem rolagem:</strong> enquanto aberto, a rolagem da página trava e o resto da página recebe <code>inert</code> (sem foco, clique ou leitor de tela). Ao fechar, só o que o painel marcou é liberado. Elementos com <code>data-dialog-keep-active</code> continuam ativos (o <code>app-toast-container</code> já vem com ele).",
        "Botões possuem <strong>focus-visible</strong> de alto contraste."
      ],
      "tokens": [
        "--surface",
        "--fg",
        "--border",
        "--accent"
      ],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/actionbar/</code>"
            ]
          },
          {
            "what": "Componentes que ele usa",
            "items": [
              "<code>components/button/</code>"
            ]
          },
          {
            "what": "Tipos",
            "items": [
              "<code>model/type/ab-size.type.ts</code>",
              "<code>model/type/button/bnt-size.type.ts</code>",
              "<code>model/type/button/bnt-tone.type.ts</code>",
              "<code>model/type/button/bnt-variant.type.ts</code>"
            ]
          },
          {
            "what": "Textos padrão",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.md\">Textos dos componentes</a>)"
            ]
          }
        ],
        "globals": [
          "@use '<sua-pasta>/shared/components/button/button' as *"
        ],
        "summary": "Depende só de <code>@angular/core</code>. Ao todo: 12 arquivos, ~890 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/actionbar/actionbar.md"
    },
    "en": {
      "lead": "Right‑side sheet with header, scrollable content and footer actions. It inherits the current theme and respects the <strong>accent</strong>.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": null,
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Input",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>title</code>",
              "<code>string</code>",
              "<code>'ActionBar'</code>",
              "Header title."
            ],
            [
              "<code>size</code>",
              "<code>'sm' | 'md' | 'lg' | 'auto'</code>",
              "<code>'auto'</code>",
              "Sheet width. <code>auto</code> picks a size based on content width."
            ],
            [
              "<code>closeOnBackdrop</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "Close on backdrop click."
            ],
            [
              "<code>primaryLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Primary button label (renders if set)."
            ],
            [
              "<code>secondaryLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Secondary button label (renders if set)."
            ],
            [
              "<code>opened</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Open state. Use <code>[(opened)]</code> for two‑way binding."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Output",
            "Type",
            "Fires"
          ],
          "rows": [
            [
              "<code>primary</code>",
              "<code>void</code>",
              "When primary button is clicked."
            ],
            [
              "<code>secondary</code>",
              "<code>void</code>",
              "When secondary button is clicked."
            ],
            [
              "<code>openedChange</code>",
              "<code>boolean</code>",
              "When the panel opens/closes by itself (ESC, backdrop, ×, <code>openBar()</code>/<code>close()</code>). Part of <code>[(opened)]</code>; not fired when the parent changes <code>[opened]</code>."
            ]
          ]
        },
        {
          "title": "Public methods",
          "head": [
            "Method",
            "Description"
          ],
          "rows": [
            [
              "<code>openBar()</code>",
              "Opens the ActionBar."
            ],
            [
              "<code>close()</code>",
              "Closes the ActionBar."
            ]
          ]
        }
      ],
      "a11y": [
        "<code>role=&quot;dialog&quot;</code>, <code>aria-modal=&quot;true&quot;</code>, and <code>aria-labelledby</code> bound to the title.",
        "<strong>Keyboard:</strong> <code>Esc</code> closes; Tab keeps focus trapped inside.",
        "<strong>Initial focus:</strong> goes to the close button when opening.",
        "<strong>Focus restore:</strong> on close (button, <code>Esc</code>, backdrop or <code>opened=false</code>), focus returns to the element that was focused before opening (usually the opener), if it is still in the page.",
        "<strong>Inert, non-scrolling background:</strong> while open, page scrolling is locked and the rest of the page gets <code>inert</code> (no focus, clicks or screen reader access). On close, only what the sheet marked is released. Elements with <code>data-dialog-keep-active</code> stay active (<code>app-toast-container</code> already has it).",
        "Buttons have a high‑contrast <strong>focus-visible</strong> outline."
      ],
      "tokens": [
        "--surface",
        "--fg",
        "--border",
        "--accent"
      ],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/actionbar/</code>"
            ]
          },
          {
            "what": "Components it uses",
            "items": [
              "<code>components/button/</code>"
            ]
          },
          {
            "what": "Types",
            "items": [
              "<code>model/type/ab-size.type.ts</code>",
              "<code>model/type/button/bnt-size.type.ts</code>",
              "<code>model/type/button/bnt-tone.type.ts</code>",
              "<code>model/type/button/bnt-variant.type.ts</code>"
            ]
          },
          {
            "what": "Default texts",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md\">Component texts</a>)"
            ]
          }
        ],
        "globals": [
          "@use '<your-folder>/shared/components/button/button' as *"
        ],
        "summary": "Depends only on <code>@angular/core</code>. In total: 12 files, ~890 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/actionbar/actionbar.en.md"
    }
  },
  "button": {
    "pt": {
      "lead": "Diretiva reutilizável para estilizar <code>&lt;button&gt;</code>/<code>&lt;a&gt;</code> com tokens do tema.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": null,
      "api": [],
      "a11y": [],
      "tokens": [],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/button/</code>"
            ]
          },
          {
            "what": "Tipos",
            "items": [
              "<code>model/type/button/bnt-size.type.ts</code>",
              "<code>model/type/button/bnt-tone.type.ts</code>",
              "<code>model/type/button/bnt-variant.type.ts</code>"
            ]
          }
        ],
        "globals": [
          "@use '<sua-pasta>/shared/components/button/button' as *"
        ],
        "summary": "Depende só de <code>@angular/core</code>. Ao todo: 5 arquivos, ~269 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/button/button.md"
    },
    "en": {
      "lead": "Reusable directive to style <code>&lt;button&gt;</code>/<code>&lt;a&gt;</code> with theme tokens.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": null,
      "api": [],
      "a11y": [],
      "tokens": [],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/button/</code>"
            ]
          },
          {
            "what": "Types",
            "items": [
              "<code>model/type/button/bnt-size.type.ts</code>",
              "<code>model/type/button/bnt-tone.type.ts</code>",
              "<code>model/type/button/bnt-variant.type.ts</code>"
            ]
          }
        ],
        "globals": [
          "@use '<your-folder>/shared/components/button/button' as *"
        ],
        "summary": "Depends only on <code>@angular/core</code>. In total: 5 files, ~269 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/button/button.en.md"
    }
  },
  "checkbox": {
    "pt": {
      "lead": "Checkbox acessível com <strong>estado parcial</strong> (indeterminado), integrado a formulários. Construído com <strong>Angular Standalone + HTML/Sass</strong>, sem dependências de UI libs.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<app-checkbox [(checked)]=\"aceito\">Aceito os termos</app-checkbox>",
      "api": [],
      "a11y": [
        "Por baixo há um <strong><code>&lt;input type=&quot;checkbox&quot;&gt;</code> nativo</strong> (invisível, sobre a caixa): teclado (<code>Espaço</code>), clique no rótulo, <code>required</code> e foco vêm do navegador.",
        "O estado parcial usa a <strong>propriedade nativa <code>indeterminate</code></strong>, que leitores de tela anunciam como &quot;parcialmente marcado&quot;.",
        "Dica e erro ligados por <code>aria-describedby</code>; erro com <code>aria-invalid=&quot;true&quot;</code>.",
        "Foco por teclado mostra um anel na caixa (<code>--cb-focus-ring</code>); hover da linha inteira realça a caixa."
      ],
      "tokens": [
        "--cb-size",
        "--cb-radius",
        "--cb-border",
        "--cb-bg",
        "--surface",
        "--cb-checked-bg",
        "--accent",
        "--cb-mark",
        "--cb-disabled-bg",
        "--cb-disabled-border",
        "--cb-disabled-checked-bg",
        "--cb-hover-ring",
        "--cb-focus-ring"
      ],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/checkbox/</code>"
            ]
          }
        ],
        "globals": [],
        "summary": "Depende só de <code>@angular/core</code>, <code>@angular/forms</code>. Ao todo: 5 arquivos, ~246 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/checkbox/checkbox.md"
    },
    "en": {
      "lead": "Accessible checkbox with a <strong>partial</strong> (indeterminate) state, integrated with forms. Built with <strong>Angular Standalone + HTML/Sass</strong>, no UI libraries.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<app-checkbox [(checked)]=\"accepted\">I accept the terms</app-checkbox>",
      "api": [],
      "a11y": [
        "Underneath there is a <strong>native <code>&lt;input type=&quot;checkbox&quot;&gt;</code></strong> (invisible, over the box): keyboard (<code>Space</code>), label click, <code>required</code> and focus come from the browser.",
        "The partial state uses the <strong>native <code>indeterminate</code> property</strong>, which screen readers announce as &quot;partially checked&quot;.",
        "Hint and error linked via <code>aria-describedby</code>; error sets <code>aria-invalid=&quot;true&quot;</code>.",
        "Keyboard focus shows a ring on the box (<code>--cb-focus-ring</code>); hovering the whole row highlights the box."
      ],
      "tokens": [
        "--cb-size",
        "--cb-radius",
        "--cb-border",
        "--cb-bg",
        "--surface",
        "--cb-checked-bg",
        "--accent",
        "--cb-mark",
        "--cb-disabled-bg",
        "--cb-disabled-border",
        "--cb-disabled-checked-bg",
        "--cb-hover-ring",
        "--cb-focus-ring"
      ],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/checkbox/</code>"
            ]
          }
        ],
        "globals": [],
        "summary": "Depends only on <code>@angular/core</code>, <code>@angular/forms</code>. In total: 5 files, ~246 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/checkbox/checkbox.en.md"
    }
  },
  "dialog": {
    "pt": {
      "lead": "Sheet/modal acessível e leve para confirmações e pequenos formulários. Construído com <strong>Angular Standalone + HTML/Sass</strong>, sem dependências de UI libs.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": null,
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Propriedade",
            "Tipo",
            "Padrão",
            "Descrição"
          ],
          "rows": [
            [
              "<code>title</code>",
              "<code>string</code>",
              "<code>'Dialog'</code>",
              "Título mostrado no cabeçalho."
            ],
            [
              "<code>size</code>",
              "<code>'sm' | 'md' | 'lg' | 'xl' | 'auto'</code>",
              "<code>'md'</code>",
              "Largura do dialog. <code>auto</code> mede o conteúdo ao abrir (via <code>ResizeObserver</code>) e escolhe entre <code>sm</code>…<code>xl</code>."
            ],
            [
              "<code>opened</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Controla abertura. Suporta two‑way via <code>[(opened)]</code>."
            ],
            [
              "<code>closeOnBackdrop</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "Fecha ao clicar no backdrop."
            ],
            [
              "<code>describedBy</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Id (ou ids separados por espaço) do texto que descreve o dialog → <code>aria-describedby</code>."
            ],
            [
              "<code>primaryLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Texto do botão primário padrão. Se <code>null</code>, não renderiza."
            ],
            [
              "<code>secondaryLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Texto do botão secundário padrão. Se <code>null</code>, não renderiza."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Evento",
            "Payload",
            "Quando dispara"
          ],
          "rows": [
            [
              "<code>openedChange</code>",
              "<code>boolean</code>",
              "Espelha mudanças de <code>opened</code> (two‑way)."
            ],
            [
              "<code>primary</code>",
              "<code>void</code>",
              "Clique no botão primário padrão."
            ],
            [
              "<code>secondary</code>",
              "<code>void</code>",
              "Clique no botão secundário padrão."
            ]
          ]
        },
        {
          "title": "Slots / Projeções",
          "head": [
            "Seleção",
            "Descrição"
          ],
          "rows": [
            [
              "<strong>conteúdo padrão</strong>",
              "Corpo do diálogo."
            ],
            [
              "<code>[dialog-actions]</code>",
              "Slot opcional para <strong>ações customizadas</strong>. Se usado, o componente não renderiza <code>primary/secondary</code> padrões."
            ]
          ]
        }
      ],
      "a11y": [
        "<code>role=&quot;dialog&quot;</code> e <code>aria-modal=&quot;true&quot;</code> no contêiner do sheet.",
        "<code>aria-labelledby</code> aponta para o ID do título.",
        "<code>aria-describedby</code> (opcional, via <code>describedBy</code>) aponta para o texto que descreve o dialog, lido junto com o título ao abrir.",
        "<strong>Foco inicial</strong> vai para o botão “fechar”. <strong>Trap de foco</strong> mantém a navegação dentro do diálogo.",
        "<strong>Foco devolvido</strong>: ao fechar (botão, <code>Esc</code>, backdrop ou <code>opened=false</code>), o foco volta ao elemento que estava focado antes de abrir — normalmente o botão que abriu —, se ele ainda estiver na página.",
        "<strong>Fundo inerte</strong>: enquanto aberto, o resto da página recebe <code>inert</code> (sem foco, clique ou leitura por leitor de tela). Ao fechar, só os elementos marcados pelo dialog são liberados (o que já era <code>inert</code> continua). Para manter algo ativo — como avisos —, use o atributo <code>data-dialog-keep-active</code> nesse elemento; o <code>app-toast-container</code> já vem com ele.",
        "<strong>Teclado:</strong> <code>Esc</code> fecha; <code>Tab</code>/<code>Shift+Tab</code> navega entre itens focáveis.",
        "<strong>Backdrop:</strong> habilitado por padrão; pode ser desativado com <code>closeOnBackdrop=false</code>."
      ],
      "tokens": [
        "--accent",
        "--dlg-bg",
        "--surface",
        "--dlg-fg",
        "--fg",
        "--dlg-border",
        "--border",
        "--dlg-title",
        "--dlg-close",
        "--muted",
        "--dlg-shadow",
        "--dlg-backdrop",
        "--ghost"
      ],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/dialog/</code>"
            ]
          },
          {
            "what": "Tipos",
            "items": [
              "<code>model/type/dialog-size.type.ts</code>"
            ]
          },
          {
            "what": "Textos padrão",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.md\">Textos dos componentes</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depende só de <code>@angular/common</code>, <code>@angular/core</code>. Ao todo: 7 arquivos, ~630 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/dialog/dialog.md"
    },
    "en": {
      "lead": "Accessible, lightweight modal for confirmations and small forms. Built with <strong>Angular Standalone + HTML/Sass</strong>, no UI frameworks.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": null,
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Prop",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>title</code>",
              "<code>string</code>",
              "<code>'Dialog'</code>",
              "Header title."
            ],
            [
              "<code>size</code>",
              "<code>'sm' | 'md' | 'lg' | 'xl' | 'auto'</code>",
              "<code>'md'</code>",
              "Dialog width. <code>auto</code> measures the content on open (via <code>ResizeObserver</code>) and picks <code>sm</code>…<code>xl</code>."
            ],
            [
              "<code>opened</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Controls visibility. Supports two‑way as <code>[(opened)]</code>."
            ],
            [
              "<code>closeOnBackdrop</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "Close when clicking the backdrop."
            ],
            [
              "<code>describedBy</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Id (or space-separated ids) of the text describing the dialog → <code>aria-describedby</code>."
            ],
            [
              "<code>primaryLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Default primary button label. If <code>null</code>, it’s hidden."
            ],
            [
              "<code>secondaryLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Default secondary button label. If <code>null</code>, it’s hidden."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Event",
            "Payload",
            "When"
          ],
          "rows": [
            [
              "<code>openedChange</code>",
              "<code>boolean</code>",
              "Mirrors <code>opened</code> changes (two‑way)."
            ],
            [
              "<code>primary</code>",
              "<code>void</code>",
              "Click on the default primary button."
            ],
            [
              "<code>secondary</code>",
              "<code>void</code>",
              "Click on the default secondary button."
            ]
          ]
        },
        {
          "title": "Slots / Projections",
          "head": [
            "Selector",
            "Description"
          ],
          "rows": [
            [
              "<strong>default content</strong>",
              "Dialog body."
            ],
            [
              "<code>[dialog-actions]</code>",
              "Optional slot for <strong>custom actions</strong>. If present, default buttons are not rendered."
            ]
          ]
        }
      ],
      "a11y": [
        "<code>role=&quot;dialog&quot;</code> and <code>aria-modal=&quot;true&quot;</code> on the sheet.",
        "<code>aria-labelledby</code> points to the title element ID.",
        "<code>aria-describedby</code> (optional, via <code>describedBy</code>) points to the text describing the dialog, read together with the title when it opens.",
        "<strong>Initial focus</strong> goes to the close button. <strong>Focus trap</strong> keeps tabbing inside.",
        "<strong>Focus restore</strong>: on close (button, <code>Esc</code>, backdrop or <code>opened=false</code>), focus returns to the element that was focused before opening (usually the opener), if it is still in the page.",
        "<strong>Inert background</strong>: while open, the rest of the page gets <code>inert</code> (no focus, clicks or screen reader access). On close, only the elements the dialog marked are released (already-<code>inert</code> ones stay inert). To keep something active (such as notifications), add the <code>data-dialog-keep-active</code> attribute to it; <code>app-toast-container</code> already has it.",
        "<strong>Keys:</strong> <code>Esc</code> closes; <code>Tab</code>/<code>Shift+Tab</code> cycles focus.",
        "<strong>Backdrop:</strong> enabled by default; can be disabled with <code>closeOnBackdrop=false</code>."
      ],
      "tokens": [
        "--dlg-bg",
        "--surface",
        "--dlg-fg",
        "--fg",
        "--dlg-border",
        "--border",
        "--dlg-title",
        "--dlg-close",
        "--muted",
        "--dlg-shadow",
        "--dlg-backdrop",
        "--ghost"
      ],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/dialog/</code>"
            ]
          },
          {
            "what": "Types",
            "items": [
              "<code>model/type/dialog-size.type.ts</code>"
            ]
          },
          {
            "what": "Default texts",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md\">Component texts</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depends only on <code>@angular/common</code>, <code>@angular/core</code>. In total: 7 files, ~630 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/dialog/dialog.en.md"
    }
  },
  "pagination": {
    "pt": {
      "lead": "Componente de <strong>paginação independente</strong> (não acopla à Tabela), pensado para funcionar tanto com <strong>fatiamento client-side</strong> quanto <strong>server-side</strong>. Visual em “bolhas”, setas laterais e controles acessíveis.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": null,
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Propriedade",
            "Tipo",
            "Padrão",
            "Descrição"
          ],
          "rows": [
            [
              "<code>total</code>",
              "<code>number</code>",
              "—",
              "<strong>Total</strong> de itens na coleção."
            ],
            [
              "<code>pageSize</code>",
              "<code>number</code>",
              "<code>10</code>",
              "Itens por página."
            ],
            [
              "<code>pageIndex</code>",
              "<code>number</code>",
              "<code>0</code>",
              "Índice da página atual (<strong>0‑based</strong>)."
            ],
            [
              "<code>maxVisible</code>",
              "<code>number</code>",
              "<code>5</code>",
              "Máximo de botões numéricos exibidos."
            ],
            [
              "<code>compact</code>",
              "<code>boolean | 'auto'</code>",
              "<code>false</code>",
              "<code>true</code>: mostra &quot;Página X de Y&quot; entre as setas no lugar dos números. <code>'auto'</code>: só em telas ≤ 420px (CSS). Aceita o atributo vazio (<code>compact</code>)."
            ],
            [
              "<code>showFirstLast</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Mostra os botões « Primeira / Última » nas pontas (desabilitados quando já está nela). Aceita o atributo vazio."
            ],
            [
              "<code>ariaLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Nome da navegação (padrão: <code>labels.pagination.nav</code>). Use nomes diferentes se houver mais de uma paginação na página."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Evento",
            "Payload",
            "Quando dispara"
          ],
          "rows": [
            [
              "<code>pageChange</code>",
              "<code>number</code>",
              "Emite o <strong>novo</strong> <code>pageIndex</code> (0‑based)."
            ]
          ]
        }
      ],
      "a11y": [
        "Botões com <code>aria-label</code> (setas) e <code>aria-current=&quot;page&quot;</code> (ativo).",
        "Suporte a navegação por Tab; foco visível.",
        "Títulos com <code>&lt;nav aria-label=&quot;Paginação&quot;&gt;</code> no HTML."
      ],
      "tokens": [
        "--pg-active-bg",
        "--tbl-action",
        "--pg-active-fg",
        "--pg-page-bg",
        "--pg-ghost-bg",
        "--pg-hover",
        "--pg-fg"
      ],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/pagination/</code>"
            ]
          },
          {
            "what": "Componentes que ele usa",
            "items": [
              "<code>components/button/</code>"
            ]
          },
          {
            "what": "Tipos",
            "items": [
              "<code>model/type/button/bnt-size.type.ts</code>",
              "<code>model/type/button/bnt-tone.type.ts</code>",
              "<code>model/type/button/bnt-variant.type.ts</code>"
            ]
          },
          {
            "what": "Textos padrão",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.md\">Textos dos componentes</a>)"
            ]
          }
        ],
        "globals": [
          "@use '<sua-pasta>/shared/components/button/button' as *"
        ],
        "summary": "Depende só de <code>@angular/core</code>. Ao todo: 10 arquivos, ~752 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/pagination/pagination.md"
    },
    "en": {
      "lead": "A <strong>standalone pagination</strong> component (numeric bubbles + arrows). It <strong>doesn’t</strong> slice data; the <strong>container</strong> controls <code>pageIndex/pageSize</code> and passes the sliced array to whatever view (e.g., the Table).",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<app-table [columns]=\"columns\" [data]=\"pagedRows()\" (action)=\"onAction($event)\"></app-table>\n\n@if (rows.length > pageSize) {\n  <div class=\"tbl-footer\">\n    <span class=\"total\">Total: {{ rows.length }}</span>\n    <app-pagination\n      [total]=\"rows.length\"\n      [pageSize]=\"pageSize\"\n      [pageIndex]=\"pageIndex()\"\n      (pageChange)=\"pageIndex.set($event)\">\n    </app-pagination>\n  </div>\n}",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Input",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>total</code>",
              "<code>number</code>",
              "—",
              "Total item count."
            ],
            [
              "<code>pageSize</code>",
              "<code>number</code>",
              "<code>10</code>",
              "Items per page."
            ],
            [
              "<code>pageIndex</code>",
              "<code>number</code>",
              "<code>0</code>",
              "Zero‑based page index."
            ],
            [
              "<code>maxVisible</code>",
              "<code>number</code>",
              "<code>5</code>",
              "Maximum visible numeric buttons."
            ],
            [
              "<code>compact</code>",
              "<code>boolean | 'auto'</code>",
              "<code>false</code>",
              "<code>true</code>: shows &quot;Page X of Y&quot; between the arrows instead of numbers. <code>'auto'</code>: only on screens ≤ 420px (CSS). Accepts the bare attribute (<code>compact</code>)."
            ],
            [
              "<code>showFirstLast</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Shows the « First / Last » buttons at the ends (disabled when already there). Accepts the bare attribute."
            ],
            [
              "<code>ariaLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Navigation name (default: <code>labels.pagination.nav</code>). Use different names when there is more than one on the page."
            ]
          ]
        },
        {
          "title": "Output",
          "head": [
            "Output",
            "Payload",
            "When"
          ],
          "rows": [
            [
              "<code>pageChange</code>",
              "<code>number</code>",
              "Emits the new <code>pageIndex</code> (0‑based)."
            ]
          ]
        }
      ],
      "a11y": [
        "<code>&lt;nav&gt;</code> named by <code>ariaLabel</code> (default <code>labels.pagination.nav</code>); give each pagination its own name if there is more than one on the page.",
        "Visible focus and proper labels on the arrows.",
        "When <code>pageSize</code> changes, ensure <code>pageIndex</code> is still valid (often reset to <code>0</code>)."
      ],
      "tokens": [
        "--pg-active-bg",
        "--tbl-action",
        "--pg-active-fg",
        "--pg-page-bg",
        "--pg-ghost-bg",
        "--pg-hover",
        "--pg-fg"
      ],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/pagination/</code>"
            ]
          },
          {
            "what": "Components it uses",
            "items": [
              "<code>components/button/</code>"
            ]
          },
          {
            "what": "Types",
            "items": [
              "<code>model/type/button/bnt-size.type.ts</code>",
              "<code>model/type/button/bnt-tone.type.ts</code>",
              "<code>model/type/button/bnt-variant.type.ts</code>"
            ]
          },
          {
            "what": "Default texts",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md\">Component texts</a>)"
            ]
          }
        ],
        "globals": [
          "@use '<your-folder>/shared/components/button/button' as *"
        ],
        "summary": "Depends only on <code>@angular/core</code>. In total: 10 files, ~752 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/pagination/pagination.en.md"
    }
  },
  "radio": {
    "pt": {
      "lead": "Escolha <strong>única</strong> entre poucas opções visíveis. Construído sobre <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code> e <code>&lt;input type=&quot;radio&quot;&gt;</code> <strong>nativos</strong>, com os tokens de cor do Checkbox (<code>--cb-*</code>).",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<app-radio-group label=\"Plano\" [options]=\"plans\" [(value)]=\"plano\" />\n\n<app-radio-group label=\"Entrega\" orientation=\"horizontal\" required\n  [options]=\"entregas\" [formControl]=\"entrega\"\n  [error]=\"entrega.touched && entrega.invalid ? 'Escolha uma forma de entrega.' : null\" />",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Propriedade",
            "Tipo",
            "Padrão",
            "Descrição"
          ],
          "rows": [
            [
              "<code>options</code>",
              "<code>RadioOption&lt;T&gt;[]</code>",
              "—",
              "<code>{ label, value, disabled?, description? }</code>."
            ],
            [
              "<code>label</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Nome do grupo (vira o <code>&lt;legend&gt;</code>)."
            ],
            [
              "<code>value</code>",
              "<code>T | null</code>",
              "<code>null</code>",
              "Two-way via <code>[(value)]</code>; com formulários, use <code>formControl</code>/<code>ngModel</code>."
            ],
            [
              "<code>orientation</code>",
              "<code>'vertical' | 'horizontal'</code>",
              "<code>'vertical'</code>",
              "Disposição das opções (horizontal quebra linha se faltar espaço)."
            ],
            [
              "<code>name</code>",
              "<code>string | null</code>",
              "gerado",
              "<code>name</code> dos inputs (único por grupo por padrão)."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Desabilita o grupo inteiro (o formulário também pode)."
            ],
            [
              "<code>required</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Mostra &quot;requerido&quot; e repassa <code>required</code>. Para validar, use <code>Validators.required</code>."
            ],
            [
              "<code>hint</code> / <code>error</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Texto de apoio / erro (erro marca <code>aria-invalid</code>)."
            ],
            [
              "<code>requiredLabel</code>",
              "<code>string</code>",
              "<code>labels.required</code>",
              "Texto do indicador (i18n)."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Evento",
            "Payload",
            "Quando dispara"
          ],
          "rows": [
            [
              "<code>valueChange</code>",
              "<code>T | null</code>",
              "O usuário escolheu outra opção."
            ]
          ]
        }
      ],
      "a11y": [
        "<code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code>: o leitor de tela anuncia o nome do grupo ao entrar nele.",
        "Radios <strong>nativos</strong> com o mesmo <code>name</code>: <code>Tab</code> entra no grupo (na opção marcada) e sai dele; <strong>setas</strong> trocam a opção, pulando as desabilitadas; <code>Espaço</code> marca a focada.",
        "A <code>description</code> de cada opção, a dica e o erro são ligados por <code>aria-describedby</code>."
      ],
      "tokens": [],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/radio/</code>"
            ]
          },
          {
            "what": "Tipos",
            "items": [
              "<code>model/interface/radio/radio-option.interface.ts</code>"
            ]
          },
          {
            "what": "Textos padrão",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.md\">Textos dos componentes</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depende só de <code>@angular/core</code>, <code>@angular/forms</code>. Ao todo: 6 arquivos, ~479 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/radio/radio-group.md"
    },
    "en": {
      "lead": "",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<app-radio-group label=\"Plan\" [options]=\"plans\" [(value)]=\"plan\" />\n\n<app-radio-group label=\"Shipping\" orientation=\"horizontal\" required\n  [options]=\"methods\" [formControl]=\"shipping\"\n  [error]=\"shipping.touched && shipping.invalid ? 'Choose a shipping method.' : null\" />",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Input",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>options</code>",
              "<code>RadioOption&lt;T&gt;[]</code>",
              "—",
              "<code>{ label, value, disabled?, description? }</code>."
            ],
            [
              "<code>label</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Group name (becomes the <code>&lt;legend&gt;</code>)."
            ],
            [
              "<code>value</code>",
              "<code>T | null</code>",
              "<code>null</code>",
              "Two-way via <code>[(value)]</code>; with forms, use <code>formControl</code>/<code>ngModel</code>."
            ],
            [
              "<code>orientation</code>",
              "<code>'vertical' | 'horizontal'</code>",
              "<code>'vertical'</code>",
              "Options layout (horizontal wraps when space runs out)."
            ],
            [
              "<code>name</code>",
              "<code>string | null</code>",
              "generated",
              "Inputs <code>name</code> (unique per group by default)."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Disables the whole group (the form can too)."
            ],
            [
              "<code>required</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Shows &quot;required&quot; and passes <code>required</code>. To validate, use <code>Validators.required</code>."
            ],
            [
              "<code>hint</code> / <code>error</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Helper text / error (error sets <code>aria-invalid</code>)."
            ],
            [
              "<code>requiredLabel</code>",
              "<code>string</code>",
              "<code>labels.required</code>",
              "Indicator text (i18n)."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Output",
            "Payload",
            "When"
          ],
          "rows": [
            [
              "<code>valueChange</code>",
              "<code>T | null</code>",
              "The user picked another option."
            ]
          ]
        }
      ],
      "a11y": [
        "<code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code>: screen readers announce the group name when entering it.",
        "<strong>Native</strong> radios sharing a <code>name</code>: <code>Tab</code> enters the group (on the checked option) and leaves it; <strong>arrows</strong> change the option, skipping disabled ones; <code>Space</code> checks the focused one.",
        "Each option <code>description</code>, the hint and the error are linked via <code>aria-describedby</code>."
      ],
      "tokens": [],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/radio/</code>"
            ]
          },
          {
            "what": "Types",
            "items": [
              "<code>model/interface/radio/radio-option.interface.ts</code>"
            ]
          },
          {
            "what": "Default texts",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md\">Component texts</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depends only on <code>@angular/core</code>, <code>@angular/forms</code>. In total: 6 files, ~479 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/radio/radio-group.en.md"
    }
  },
  "select": {
    "pt": {
      "lead": "Componente de <strong>select</strong> leve, acessível e tematizável por <strong>CSS Variables</strong>. Suporta <strong>filtro</strong> no painel, navegação por teclado, validação de obrigatório e integração simples com i18n. Mantém compatibilidade com os tokens globais de tema/acentos.",
      "why": [
        "O <code>&lt;select&gt;</code> nativo é acessível, mas difícil de estilizar e não tem busca, grupos visuais nem botão de limpar. Recriar um select do zero costuma quebrar o teclado e o leitor de tela. Este componente segue o padrão de listbox: setas, Home/End, escolha por digitação, grupos, limpar, validação de obrigatório, formulários e um painel que vira folha no celular."
      ],
      "useWhen": [
        "A pessoa escolhe uma opção entre várias, mais do que cabem confortavelmente na tela.",
        "As opções têm grupos, ou a lista é longa e vale ter busca.",
        "O campo faz parte de um formulário (Reactive Forms ou <code>ngModel</code>)."
      ],
      "preferOther": [
        "Poucas opções que cabem na tela: use o <a href=\"/componentes/radio\">Radio group</a>, que mostra tudo sem abrir nada.",
        "Opções em árvore (categorias e subcategorias): use o <a href=\"/componentes/treeselect\">TreeSelect</a>.",
        "Ligar ou desligar uma configuração: use o <a href=\"/componentes/switch\">Switch</a>."
      ],
      "example": "<app-select\n  label=\"Categoria\"\n  placeholder=\"Selecione\"\n  [required]=\"true\"\n  [options]=\"options\"\n  [value]=\"categoria()\"\n  (valueChange)=\"categoria.set($event)\"\n  hint=\"Usada para organizar os relatórios.\">\n</app-select>",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Propriedade",
            "Tipo",
            "Padrão",
            "Descrição"
          ],
          "rows": [
            [
              "<code>label</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Rótulo acima do campo."
            ],
            [
              "<code>required</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Exibe o selo “requerido” e ativa validação de obrigatório."
            ],
            [
              "<code>placeholder</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Texto quando nada selecionado."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Desabilita interação. Com formulários, prefira <code>control.disable()</code>."
            ],
            [
              "<code>filterable</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Mostra campo de filtro no painel."
            ],
            [
              "<code>filterPlaceholder</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Placeholder do filtro (quando <code>filterable</code>)."
            ],
            [
              "<code>clearable</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Mostra um botão (×) para limpar a seleção."
            ],
            [
              "<code>error</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Mensagem de erro externa (prioritária)."
            ],
            [
              "<code>requiredLabel</code>",
              "<code>string</code>",
              "<code>labels.required</code>",
              "Texto ao lado do label quando <code>required</code>."
            ],
            [
              "<code>requiredError</code>",
              "<code>string</code>",
              "<code>labels.requiredError</code>",
              "Mensagem interna de obrigatório."
            ],
            [
              "<code>autoValidate</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "Valida ao desfocar/fechar o painel."
            ],
            [
              "<code>hint</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Texto auxiliar abaixo do campo (quando não há erro)."
            ],
            [
              "<code>options</code>",
              "<code>SelectOption&lt;T&gt;[]</code>",
              "—",
              "Lista de opções <code>{ label, value, disabled?, group? }</code>."
            ],
            [
              "<code>value</code>",
              "<code>T | null</code>",
              "<code>null</code>",
              "Valor selecionado (sem formulários)."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Evento",
            "Payload",
            "Quando dispara"
          ],
          "rows": [
            [
              "<code>valueChange</code>",
              "<code>T | null</code>",
              "Ao selecionar uma opção (ou ao limpar, o componente emite <code>null</code>)."
            ]
          ]
        }
      ],
      "a11y": [
        "<strong>Botão</strong> control: <code>aria-haspopup=&quot;listbox&quot;</code>, <code>aria-expanded</code>, <code>aria-controls</code> (só com a lista aberta, quando ela existe) e <code>aria-invalid</code> quando há erro.",
        "<strong>Lista</strong>: <code>role=&quot;listbox&quot;</code>, itens com <code>role=&quot;option&quot;</code> e <code>aria-selected</code>; a opção destacada é anunciada (<code>aria-activedescendant</code>).",
        "<strong>Rótulo</strong>: o <code>label</code> nomeia o botão (junto com o valor: &quot;Comida, Banana&quot;) e a lista (<code>aria-labelledby</code>). Ao abrir, o foco vai para a busca ou para a lista.",
        "Fecha com <strong>Escape</strong>, clique fora e ao selecionar.",
        "<strong>Teclado</strong>: <code>Enter</code>/<code>Space</code> abre; no painel use <code>↑/↓</code> para navegar, <code>Home/End</code> para extremos e <code>Enter</code> para escolher.",
        "<strong>Typeahead</strong>: com o campo focado e fechado, digitar escolhe a primeira opção cujo rótulo começa com o texto (sem acento/caixa), sem abrir o painel; repetir a mesma letra alterna entre as opções com essa inicial. Com o painel aberto, digitar só move o destaque (<code>Enter</code> confirma). Opções desabilitadas são puladas; a busca recomeça após 500 ms sem digitar. Com <code>filterable</code>, o texto vai para o filtro.",
        "<strong>Foco</strong>: ao selecionar, o foco retorna ao botão.",
        "<strong>Limpar</strong> (<code>clearable</code>): o botão é focável e tem nome (<code>labels.clearSelection</code>, &quot;Clear selection&quot; por padrão). <strong>Enter/Space</strong> limpa e devolve o foco ao botão do controle."
      ],
      "tokens": [
        "--sel-bg",
        "--surface",
        "--sel-fg",
        "--fg",
        "--sel-border",
        "--border",
        "--sel-placeholder",
        "--sel-caret",
        "--muted",
        "--sel-disabled-bg",
        "--surface-2",
        "--sel-disabled-border",
        "--sel-error",
        "--sel-focus-ring",
        "--accent",
        "--sel-menu-bg",
        "--sel-menu-border",
        "--sel-scrollbar-thumb",
        "--sel-option-hover",
        "--sel-option-active"
      ],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/select/</code>"
            ]
          },
          {
            "what": "Tipos",
            "items": [
              "<code>model/interface/select/select-option.interface.ts</code>",
              "<code>model/type/responsive-mode.type.ts</code>"
            ]
          },
          {
            "what": "Textos padrão",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.md\">Textos dos componentes</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depende só de <code>@angular/common</code>, <code>@angular/core</code>, <code>@angular/forms</code>. Ao todo: 7 arquivos, ~947 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/select/select.md"
    },
    "en": {
      "lead": "A lightweight, accessible <strong>select</strong> themed with <strong>CSS Variables</strong>. Supports optional <strong>filtering</strong>, keyboard navigation, required validation and simple i18n. Compatible with your global theme/accent tokens.",
      "why": [
        "The native <code>&lt;select&gt;</code> is accessible, but hard to style and has no search, visual groups or clear button. Rebuilding a select from scratch often breaks the keyboard and screen readers. This component follows the listbox pattern: arrow keys, Home/End, pick by typing, groups, clear, required validation, forms and a panel that becomes a sheet on phones."
      ],
      "useWhen": [
        "People pick one option among many, more than fit comfortably on screen.",
        "The options have groups, or the list is long and search helps.",
        "The field is part of a form (Reactive Forms or <code>ngModel</code>)."
      ],
      "preferOther": [
        "A few options that fit on screen: use the <a href=\"/componentes/radio\">Radio group</a>, which shows them all without opening anything.",
        "Options in a tree (categories and subcategories): use the <a href=\"/componentes/treeselect\">TreeSelect</a>.",
        "Turning a setting on or off: use the <a href=\"/componentes/switch\">Switch</a>."
      ],
      "example": "<app-select\n  label=\"Category\"\n  placeholder=\"Select\"\n  [required]=\"true\"\n  [options]=\"options\"\n  [value]=\"category()\"\n  (valueChange)=\"category.set($event)\"\n  hint=\"Used to organize the reports.\">\n</app-select>",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Prop",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>label</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Field label."
            ],
            [
              "<code>required</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Shows “required” badge and enables required validation."
            ],
            [
              "<code>placeholder</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Text when no selection."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Disables the control. With forms, prefer <code>control.disable()</code>."
            ],
            [
              "<code>filterable</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Shows a filter input inside the panel."
            ],
            [
              "<code>filterPlaceholder</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Filter placeholder."
            ],
            [
              "<code>clearable</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Shows a small (×) <strong>clear</strong> button."
            ],
            [
              "<code>error</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "External error message (takes precedence)."
            ],
            [
              "<code>requiredLabel</code>",
              "<code>string</code>",
              "<code>labels.required</code>",
              "Text near the label when <code>required</code>."
            ],
            [
              "<code>requiredError</code>",
              "<code>string</code>",
              "<code>labels.requiredError</code>",
              "Built-in required message."
            ],
            [
              "<code>autoValidate</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "Validate on blur/close."
            ],
            [
              "<code>hint</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Helper text (when no error)."
            ],
            [
              "<code>options</code>",
              "<code>SelectOption&lt;T&gt;[]</code>",
              "—",
              "Options <code>{ label, value, disabled?, group? }</code>."
            ],
            [
              "<code>value</code>",
              "<code>T | null</code>",
              "<code>null</code>",
              "Selected value (without forms)."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Event",
            "Payload",
            "When"
          ],
          "rows": [
            [
              "<code>valueChange</code>",
              "<code>T | null</code>",
              "Emitted after selecting an option (or <code>null</code> when cleared)."
            ]
          ]
        }
      ],
      "a11y": [
        "<strong>Button</strong> control: <code>aria-haspopup=&quot;listbox&quot;</code>, <code>aria-expanded</code>, <code>aria-controls</code> (only while the list is open, when it exists) and <code>aria-invalid</code> on error.",
        "<strong>List</strong>: <code>role=&quot;listbox&quot;</code>, items with <code>role=&quot;option&quot;</code> and <code>aria-selected</code>; the highlighted option is announced (<code>aria-activedescendant</code>).",
        "<strong>Label</strong>: <code>label</code> names the button (together with the value: &quot;Food, Banana&quot;) and the list (<code>aria-labelledby</code>). On open, focus moves to the search or the list.",
        "Closes on <strong>Escape</strong>, outside click and after selection.",
        "<strong>Keyboard</strong>: <code>Enter</code>/<code>Space</code> to open; inside the panel use <code>↑/↓</code>, <code>Home/End</code>, <code>Enter</code> to select.",
        "<strong>Typeahead</strong>: with the field focused and closed, typing picks the first option whose label starts with the text (accent/case-insensitive) without opening; repeating the same letter cycles through options with that initial. With the panel open, typing only moves the highlight (<code>Enter</code> confirms). Disabled options are skipped; the search resets after 500 ms of no typing. With <code>filterable</code>, text goes to the filter.",
        "<strong>Focus</strong> returns to the button after selection.",
        "<strong>Clear</strong> (<code>clearable</code>): the button is focusable and named (<code>labels.clearSelection</code>, &quot;Clear selection&quot; by default). <strong>Enter/Space</strong> clears and returns focus to the control button."
      ],
      "tokens": [
        "--sel-bg",
        "--surface",
        "--sel-fg",
        "--fg",
        "--sel-border",
        "--border",
        "--sel-placeholder",
        "--sel-caret",
        "--muted",
        "--sel-disabled-bg",
        "--surface-2",
        "--sel-disabled-border",
        "--sel-error",
        "--sel-focus-ring",
        "--accent",
        "--sel-menu-bg",
        "--sel-menu-border",
        "--sel-scrollbar-thumb",
        "--sel-option-hover",
        "--sel-option-active"
      ],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/select/</code>"
            ]
          },
          {
            "what": "Types",
            "items": [
              "<code>model/interface/select/select-option.interface.ts</code>",
              "<code>model/type/responsive-mode.type.ts</code>"
            ]
          },
          {
            "what": "Default texts",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md\">Component texts</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depends only on <code>@angular/common</code>, <code>@angular/core</code>, <code>@angular/forms</code>. In total: 7 files, ~947 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/select/select.en.md"
    }
  },
  "stepper": {
    "pt": {
      "lead": "Um <strong>componente de etapas</strong> leve e acessível, implementado em <strong>HTML + Sass</strong>, exposto como Angular <strong>Standalone</strong>. Sem dependência de UI framework.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<app-stepper\n  [steps]=\"steps\"\n  [current]=\"current\"\n  [clickable]=\"true\"\n  [showIndex]=\"true\"\n  [showCaption]=\"true\"\n  (stepChange)=\"goTo($event)\">\n</app-stepper>",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Propriedade",
            "Tipo",
            "Padrão",
            "Descrição"
          ],
          "rows": [
            [
              "<code>steps</code>",
              "<code>StepItem[]</code>",
              "—",
              "Lista ordenada de etapas."
            ],
            [
              "<code>current</code>",
              "<code>number</code>",
              "<code>0</code>",
              "Índice base-0 da etapa ativa."
            ],
            [
              "<code>clickable</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "Habilita clique para navegar (até <code>current + 1</code>)."
            ],
            [
              "<code>showIndex</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "Exibe número dentro do bullet nas etapas não concluídas."
            ],
            [
              "<code>showCaption</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "Exibe legenda abaixo do rótulo."
            ],
            [
              "<code>ariaLabel</code>",
              "<code>string</code>",
              "<code>labels.stepper.label</code>",
              "Nome da navegação para leitores de tela."
            ],
            [
              "<code>doneLabel</code>",
              "<code>string</code>",
              "<code>labels.stepper.done</code>",
              "Texto (só leitor de tela) das etapas concluídas."
            ]
          ]
        },
        {
          "title": "Output",
          "head": [
            "Evento",
            "Payload",
            "Descrição"
          ],
          "rows": [
            [
              "<code>stepChange</code>",
              "<code>number</code>",
              "Emite o índice clicado quando permitido."
            ]
          ]
        }
      ],
      "a11y": [
        "É uma <strong>navegação com lista ordenada</strong> (não abas): <code>nav[aria-label] &gt; ol &gt; li &gt; button</code>. Use nomes diferentes (<code>ariaLabel</code>) se houver mais de um stepper na página.",
        "<code>aria-current=&quot;step&quot;</code> marca a etapa atual; etapas concluídas têm um texto só para leitor de tela (<code>doneLabel</code>, padrão &quot;concluída&quot;). Etapas não alcançáveis ficam <code>disabled</code>.",
        "Regra padrão de clique: voltar livre; avançar <strong>até</strong> <code>current + 1</code> (evita “pular” validações). Ajuste essa regra no método <code>canClick()</code> conforme seu fluxo."
      ],
      "tokens": [
        "--stepper-connector",
        "--stepper-connector-active",
        "--stepper-color-active",
        "--stepper-bullet-bg",
        "--stepper-color-number-active",
        "--stepper-color-done",
        "--stepper-color-default",
        "--stepper-color-disabled",
        "--stepper-text",
        "--stepper-caption",
        "--stepper-bullet-muted-bg",
        "--stepper-bullet-size",
        "--token"
      ],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/stepper/</code>"
            ]
          },
          {
            "what": "Tipos",
            "items": [
              "<code>model/interface/step-item.interface.ts</code>",
              "<code>model/type/step-state.type.ts</code>"
            ]
          },
          {
            "what": "Textos padrão",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.md\">Textos dos componentes</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depende só de <code>@angular/core</code>. Ao todo: 7 arquivos, ~536 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/stepper/stepper.md"
    },
    "en": {
      "lead": "An <strong>accessible, framework-free</strong> horizontal stepper built with <strong>plain HTML + Sass</strong> and exposed as a <strong>standalone Angular</strong> component. It supports active/done/disabled states, optional index/caption, and theme tokens via CSS variables.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<app-stepper\n  [steps]=\"steps\"\n  [current]=\"current()\"\n  [clickable]=\"true\"\n  (stepChange)=\"goTo($event)\">\n</app-stepper>",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Input",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>steps</code>",
              "<code>{ label: string; caption?: string }[]</code>",
              "—",
              "Step list (label + optional caption)."
            ],
            [
              "<code>current</code>",
              "<code>number</code>",
              "<code>0</code>",
              "Zero‑based index of the active step."
            ],
            [
              "<code>clickable</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "If <code>true</code>, allows clicking on previous/next steps."
            ],
            [
              "<code>showIndex</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "Show numeric index inside the bullet when not done."
            ],
            [
              "<code>showCaption</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "Show the caption under the label (hidden on narrow screens)."
            ],
            [
              "<code>ariaLabel</code>",
              "<code>string</code>",
              "<code>labels.stepper.label</code>",
              "Navigation name for screen readers."
            ],
            [
              "<code>doneLabel</code>",
              "<code>string</code>",
              "<code>labels.stepper.done</code>",
              "Screen-reader-only text for completed steps."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Output",
            "Payload",
            "When"
          ],
          "rows": [
            [
              "<code>stepChange</code>",
              "<code>number</code>",
              "When a step is clicked (if <code>clickable</code>) or programmatically triggered."
            ]
          ]
        }
      ],
      "a11y": [
        "Semantic structure: a <strong>navigation with an ordered list</strong> (not tabs): <code>nav[aria-label] &gt; ol &gt; li &gt; button</code>. Give each stepper its own <code>ariaLabel</code> if there is more than one on the page.",
        "The current step has <code>aria-current=&quot;step&quot;</code>; completed steps carry screen-reader-only text (<code>doneLabel</code>, default &quot;concluída&quot;). Unreachable steps are <code>disabled</code>.",
        "Focus visible on buttons; bullets use <code>aria-hidden</code> for decorative content.",
        "Use short labels; captions are optional and collapse below ~720px."
      ],
      "tokens": [
        "--stepper-color-default",
        "--stepper-color-active",
        "--stepper-color-done",
        "--stepper-color-disabled",
        "--stepper-text",
        "--stepper-caption",
        "--stepper-bullet-bg",
        "--stepper-connector",
        "--stepper-connector-active",
        "--stepper-color-number-active"
      ],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/stepper/</code>"
            ]
          },
          {
            "what": "Types",
            "items": [
              "<code>model/interface/step-item.interface.ts</code>",
              "<code>model/type/step-state.type.ts</code>"
            ]
          },
          {
            "what": "Default texts",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md\">Component texts</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depends only on <code>@angular/core</code>. In total: 7 files, ~536 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/stepper/stepper.en.md"
    }
  },
  "switch": {
    "pt": {
      "lead": "Liga/desliga para <strong>configurações que valem na hora</strong> (ex.: &quot;Notificações&quot;). Construído sobre <code>&lt;input type=&quot;checkbox&quot; role=&quot;switch&quot;&gt;</code> <strong>nativo</strong>, com os tokens de cor do Checkbox (<code>--cb-*</code>).",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<app-switch [(checked)]=\"notificacoes\">Notificações por e-mail</app-switch>\n\n<!-- lista de configurações: rótulo à esquerda, switch à direita -->\n<app-switch labelFirst [formControl]=\"modoCompacto\">Modo compacto</app-switch>",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Propriedade",
            "Tipo",
            "Padrão",
            "Descrição"
          ],
          "rows": [
            [
              "<code>checked</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Ligado. Two-way via <code>[(checked)]</code>; com formulários, use <code>formControl</code>/<code>ngModel</code>."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Desabilita (o formulário também pode)."
            ],
            [
              "<code>labelFirst</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Rótulo à esquerda e switch à direita, ocupando a largura."
            ],
            [
              "<code>hint</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Texto de apoio, ligado por <code>aria-describedby</code>."
            ],
            [
              "<code>ariaLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Rótulo para leitor de tela sem texto visível."
            ],
            [
              "<code>name</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "<code>name</code> do input nativo."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Evento",
            "Payload",
            "Quando dispara"
          ],
          "rows": [
            [
              "<code>checkedChange</code>",
              "<code>boolean</code>",
              "O usuário ligou/desligou."
            ]
          ]
        }
      ],
      "a11y": [
        "<code>role=&quot;switch&quot;</code> num checkbox nativo: o leitor de tela anuncia &quot;ligado&quot;/&quot;desligado&quot;; <code>Espaço</code> alterna; clicar no rótulo também.",
        "Foco por teclado mostra um anel no trilho. Com &quot;reduzir movimento&quot;, a bolinha não anima."
      ],
      "tokens": [
        "--cb-border",
        "--cb-checked-bg",
        "--cb-mark",
        "--cb-disabled-",
        "--cb-hover-ring",
        "--cb-focus-ring",
        "--sw-w",
        "--sw-h",
        "--sw-pad"
      ],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/switch/</code>"
            ]
          }
        ],
        "globals": [],
        "summary": "Depende só de <code>@angular/core</code>, <code>@angular/forms</code>. Ao todo: 3 arquivos, ~181 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/switch/switch.md"
    },
    "en": {
      "lead": "On/off for <strong>settings that apply immediately</strong> (e.g. &quot;Notifications&quot;). Built on a <strong>native</strong> <code>&lt;input type=&quot;checkbox&quot; role=&quot;switch&quot;&gt;</code>, using the Checkbox color tokens (<code>--cb-*</code>).",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<app-switch [(checked)]=\"notifications\">Email notifications</app-switch>\n\n<!-- settings list: label on the left, switch on the right -->\n<app-switch labelFirst [formControl]=\"compactMode\">Compact mode</app-switch>",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Input",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>checked</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "On. Two-way via <code>[(checked)]</code>; with forms, use <code>formControl</code>/<code>ngModel</code>."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Disables it (the form can too)."
            ],
            [
              "<code>labelFirst</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Label on the left and switch on the right, full width."
            ],
            [
              "<code>hint</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Helper text, linked via <code>aria-describedby</code>."
            ],
            [
              "<code>ariaLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Screen reader label with no visible text."
            ],
            [
              "<code>name</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Native input <code>name</code>."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Output",
            "Payload",
            "When"
          ],
          "rows": [
            [
              "<code>checkedChange</code>",
              "<code>boolean</code>",
              "The user turned it on/off."
            ]
          ]
        }
      ],
      "a11y": [
        "<code>role=&quot;switch&quot;</code> on a native checkbox: screen readers announce &quot;on&quot;/&quot;off&quot;; <code>Space</code> toggles; clicking the label too.",
        "Keyboard focus shows a ring on the track. With &quot;reduce motion&quot;, the thumb does not animate."
      ],
      "tokens": [
        "--cb-border",
        "--cb-checked-bg",
        "--cb-mark",
        "--cb-disabled-",
        "--cb-hover-ring",
        "--cb-focus-ring",
        "--sw-w",
        "--sw-h",
        "--sw-pad"
      ],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/switch/</code>"
            ]
          }
        ],
        "globals": [],
        "summary": "Depends only on <code>@angular/core</code>, <code>@angular/forms</code>. In total: 3 files, ~181 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/switch/switch.en.md"
    }
  },
  "table": {
    "pt": {
      "lead": "Uma <strong>tabela personalizável</strong> com seleção por checkbox, coluna de ações, <em>chips</em> e células customizáveis — tudo em <strong>HTML + Sass</strong>, exposta como componente <strong>standalone</strong> (sem framework de UI).",
      "why": [
        "Tabelas de dados juntam muitas necessidades de uma vez: selecionar linhas (inclusive entre páginas), agir sobre uma ou várias, ordenar, paginar, avisar quando está carregando, vazia ou com erro, e continuar legível em telas estreitas. Feito à mão, isso costuma deixar o teclado, o leitor de tela e o foco para depois. Esta tabela reúne esses recursos sobre um <code>&lt;table&gt;</code> de verdade, sem biblioteca, e cada um é opcional."
      ],
      "useWhen": [
        "Os dados têm linhas e colunas que a pessoa compara ou percorre.",
        "É preciso selecionar linhas e agir sobre elas, uma a uma ou em massa.",
        "A lista é longa: pagine no navegador ou no servidor."
      ],
      "preferOther": [
        "Poucos itens, sem colunas para comparar: uma lista simples (<code>&lt;ul&gt;</code>) é mais leve.",
        "Escolher um item para preencher um campo: use o <a href=\"/componentes/select\">Select</a>.",
        "Escolher em dados hierárquicos: use o <a href=\"/componentes/treeselect\">TreeSelect</a>."
      ],
      "example": "<app-table\n  [columns]=\"columns\"\n  [data]=\"rows\"\n  [selectable]=\"true\"\n  [actions]=\"['edit']\"\n  [selected]=\"selected()\"\n  (selectedChange)=\"selected.set($event)\"\n  (action)=\"onAction($event)\">\n</app-table>",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Propriedade",
            "Tipo",
            "Padrão",
            "Descrição"
          ],
          "rows": [
            [
              "<code>data</code>",
              "<code>T[]</code>",
              "—",
              "Linhas da tabela."
            ],
            [
              "<code>columns</code>",
              "<code>ColumnDef&lt;T&gt;[]</code>",
              "—",
              "Colunas declarativas."
            ],
            [
              "<code>selectable</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Mostra checkbox por linha e “selecionar tudo”."
            ],
            [
              "<code>rowKey</code>",
              "<code>keyof T | (row, i) =&gt; unknown</code>",
              "—",
              "Identificador estável da linha. Com ele, <code>selected</code> guarda <strong>chaves</strong> e a seleção sobrevive a ordenação/paginação."
            ],
            [
              "<code>selected</code>",
              "<code>any[]</code>",
              "<code>[]</code>",
              "Seleção controlada: chaves (com <code>rowKey</code>) ou índices em <code>data</code> (sem <code>rowKey</code>)."
            ],
            [
              "<code>showActions</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "(Opcional) força a coluna de ações. Normalmente <strong>não precisa</strong> quando você usa <code>[actions]</code> ou <code>appActions</code>."
            ],
            [
              "<code>actions</code>",
              "<code>(TableAction | ActionKind)[]</code>",
              "<code>[]</code>",
              "Define ações <strong>declarativas</strong> com ícones padrão ou por <code>iconUrl</code>."
            ],
            [
              "<code>actionsLabel</code>",
              "<code>string</code>",
              "<code>labels.table.actions</code>",
              "Nome da coluna de ações para leitor de tela (o cabeçalho é visualmente vazio)."
            ],
            [
              "<code>actionsColWidth</code>",
              "<code>string | number</code>",
              "<code>44</code>",
              "Largura da coluna de ações (número = px)."
            ],
            [
              "<code>loading</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Mostra estado de carregamento com skeleton."
            ],
            [
              "<code>loadingRows</code>",
              "<code>number</code>",
              "<code>5</code>",
              "Quantidade de linhas do skeleton."
            ],
            [
              "<code>emptyMessage</code>",
              "<code>string</code>",
              "<code>labels.table.empty</code>",
              "Mensagem para o estado vazio."
            ],
            [
              "<code>error</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Mensagem de falha ao buscar os dados: mostra o erro no lugar das linhas (anunciado). <code>loading</code> vence."
            ],
            [
              "<code>retryLabel</code>",
              "<code>string | null</code>",
              "<code>labels.table.retry</code>",
              "Texto do botão que emite <code>retry</code>; <code>null</code> esconde o botão."
            ],
            [
              "<code>bulkActions</code>",
              "<code>TableBulkAction[]</code>",
              "<code>[]</code>",
              "Botões da barra de ações em massa (exige <code>selectable</code>)."
            ],
            [
              "<code>bulkActionsLabel</code>",
              "<code>string</code>",
              "<code>labels.table.bulkActions</code>",
              "Nome do grupo da barra para leitor de tela."
            ],
            [
              "<code>selectedCountLabel</code>",
              "<code>(n: number) =&gt; string</code>",
              "<code>labels.table.selectedCount</code>",
              "Texto do contador (também anunciado a cada mudança)."
            ],
            [
              "<code>clearSelectionLabel</code>",
              "<code>string</code>",
              "<code>labels.clearSelection</code>",
              "Texto do botão que limpa a seleção."
            ],
            [
              "<code>noSelectionLabel</code>",
              "<code>string</code>",
              "<code>labels.table.noSelection</code>",
              "Texto sem seleção: visível com <code>bulkBarIdle=&quot;hint&quot;</code>, senão só anunciado."
            ],
            [
              "<code>bulkBarIdle</code>",
              "<code>'space' | 'hint' | 'hidden'</code>",
              "<code>'space'</code>",
              "O que a barra mostra sem seleção (ver Ações em massa)."
            ],
            [
              "<code>sortKey</code>",
              "<code>string</code>",
              "—",
              "Chave da coluna ordenada (controlado)."
            ],
            [
              "<code>sortDir</code>",
              "<code>'asc' | 'desc'</code>",
              "<code>'asc'</code>",
              "Direção da ordenação (controlado)."
            ],
            [
              "<code>paginate</code>",
              "<code>'client' | 'server' | null</code>",
              "<code>null</code>",
              "Liga a paginação integrada (ver Paginação). Sem ela, mostra <code>data</code> inteiro."
            ],
            [
              "<code>pageIndex</code>",
              "<code>number</code>",
              "<code>0</code>",
              "Página atual (0-based); aceita <code>[(pageIndex)]</code>."
            ],
            [
              "<code>pageSize</code>",
              "<code>number</code>",
              "<code>10</code>",
              "Linhas por página; aceita <code>[(pageSize)]</code>."
            ],
            [
              "<code>totalItems</code>",
              "<code>number | null</code>",
              "<code>null</code>",
              "Total no servidor (<code>paginate=&quot;server&quot;</code>)."
            ],
            [
              "<code>pageSizeOptions</code>",
              "<code>number[]</code>",
              "<code>[]</code>",
              "Opções de &quot;Itens por página&quot;; vazio esconde o seletor."
            ],
            [
              "<code>rangeLabel</code>",
              "<code>(start, end, total) =&gt; string</code>",
              "<code>labels.table.range</code>",
              "Texto do intervalo no rodapé (anunciado ao trocar de página)."
            ],
            [
              "<code>pageSizeLabel</code>",
              "<code>string</code>",
              "<code>labels.table.pageSize</code>",
              "Rótulo do seletor."
            ],
            [
              "<code>paginationLabel</code>",
              "<code>string</code>",
              "<code>labels.table.pagination</code>",
              "Nome da navegação de páginas."
            ],
            [
              "<code>detailsLabel</code>",
              "<code>string</code>",
              "<code>labels.table.details</code>",
              "Nome (para leitor de tela) da coluna do botão de detalhes."
            ],
            [
              "<code>expandLabel</code>",
              "<code>string</code>",
              "<code>labels.table.expand</code>",
              "Nome do botão que abre a linha de detalhes."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Evento",
            "Payload",
            "Quando dispara"
          ],
          "rows": [
            [
              "<code>selectedChange</code>",
              "<code>any[]</code> (chaves ou índices)",
              "Alterou seleção (linha ou “selecionar tudo”)."
            ],
            [
              "<code>action</code>",
              "<code>{ type: ActionKind; row: T; index: number }</code>",
              "Clique numa ação declarativa (quando usando <code>[actions]</code>)."
            ],
            [
              "<code>retry</code>",
              "<code>void</code>",
              "Clicou em &quot;Tentar novamente&quot; no estado de erro."
            ],
            [
              "<code>bulkAction</code>",
              "<code>{ type: string; keys: any[] }</code>",
              "Clique numa ação em massa (chaves ou índices selecionados)."
            ],
            [
              "<code>pageIndexChange</code>",
              "<code>number</code>",
              "Mudou de página (clique, ordenação ou correção após <code>data</code> encolher)."
            ],
            [
              "<code>pageSizeChange</code>",
              "<code>number</code>",
              "Trocou &quot;Itens por página&quot;."
            ],
            [
              "<code>sortChange</code>",
              "<code>{ key: string; dir: 'asc' | 'desc' }</code>",
              "Usuário clicou no cabeçalho e mudou a ordenação."
            ]
          ]
        }
      ],
      "a11y": [
        "Cabeçalho clicável com <code>aria-sort=&quot;ascending|descending|none&quot;</code> e foco visível no <code>th</code> (Enter/Espaço para alternar).",
        "Estado de erro: mensagem anunciada (<code>role=&quot;alert&quot;</code>), <code>aria-busy</code> na tabela enquanto carrega e o foco não se perde ao tentar de novo.",
        "Colunas recolhidas: botão &quot;Mostrar detalhes&quot; com <code>aria-expanded</code> e <code>aria-controls</code> apontando para a linha de detalhes; a coluna do botão tem nome (<code>detailsLabel</code>).",
        "Ações em massa: barra com <code>role=&quot;group&quot;</code> e nome (<code>bulkActionsLabel</code>), contador anunciado (<code>aria-live=&quot;polite&quot;</code>) e o foco vai para &quot;Selecionar tudo&quot; quando os botões somem.",
        "Ações declarativas: o nome também aparece como dica; ações indisponíveis usam <code>aria-disabled</code> (focáveis, com o motivo) e o cabeçalho da coluna de ações tem nome para leitor de tela (<code>actionsLabel</code>)."
      ],
      "tokens": [
        "--tbl-header-bg",
        "--tbl-header-fg",
        "--tbl-row-bg",
        "--tbl-row-gray-medium",
        "--tbl-row-border",
        "--tbl-fg",
        "--tbl-muted",
        "--tbl-action",
        "--chip-radius",
        "--chip-h",
        "--chip-pad-x",
        "--chip-fs",
        "--chip-teal-border",
        "--chip-teal-bg",
        "--chip-teal-fg",
        "--chip-orange-border",
        "--chip-orange-bg",
        "--chip-orange-fg"
      ],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/table/</code>"
            ]
          },
          {
            "what": "Componentes que ele usa",
            "items": [
              "<code>components/button/</code>",
              "<code>components/pagination/</code>",
              "<code>components/tooltip/</code>"
            ]
          },
          {
            "what": "Tipos",
            "items": [
              "<code>model/interface/chip-map-entry.interface.ts</code>",
              "<code>model/interface/column-def.interface.ts</code>",
              "<code>model/interface/table-action.interface.ts</code>",
              "<code>model/interface/table-bulk-action.interface.ts</code>",
              "<code>model/type/action-kind.type.ts</code>",
              "<code>model/type/align.type.ts</code>",
              "<code>model/type/button/bnt-size.type.ts</code>",
              "<code>model/type/button/bnt-tone.type.ts</code>",
              "<code>model/type/button/bnt-variant.type.ts</code>",
              "<code>model/type/cell.type.ts</code>",
              "<code>model/type/sort-dir.type.ts</code>"
            ]
          },
          {
            "what": "Textos padrão",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.md\">Textos dos componentes</a>)"
            ]
          }
        ],
        "globals": [
          "@use '<sua-pasta>/shared/components/button/button' as *",
          "@use '<sua-pasta>/shared/components/tooltip/tooltip'"
        ],
        "summary": "Depende só de <code>@angular/common</code>, <code>@angular/core</code>. Ao todo: 33 arquivos, ~2860 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/table/table.md"
    },
    "en": {
      "lead": "A <strong>customizable table</strong> with optional row selection (checkbox), <strong>actions column</strong> (declarative via <code>[actions]</code> or via <code>appActions</code> slot), <strong>chips</strong>, and <strong>custom cells</strong> — all in <strong>plain HTML + Sass</strong> as a <strong>standalone Angular</strong> component.",
      "why": [
        "Data tables bring many needs together: selecting rows (across pages too), acting on one or many, sorting, paginating, telling people when it is loading, empty or failed, and staying readable on narrow screens. Built by hand, keyboard, screen reader and focus often come last. This table puts those features on a real <code>&lt;table&gt;</code>, with no library, and each one is optional."
      ],
      "useWhen": [
        "The data has rows and columns people compare or scan.",
        "People need to select rows and act on them, one by one or in bulk.",
        "The list is long: paginate in the browser or on the server."
      ],
      "preferOther": [
        "A few items with nothing to compare across columns: a plain list (<code>&lt;ul&gt;</code>) is lighter.",
        "Picking an item to fill a field: use the <a href=\"/componentes/select\">Select</a>.",
        "Picking from hierarchical data: use the <a href=\"/componentes/treeselect\">TreeSelect</a>."
      ],
      "example": "<app-table\n  [columns]=\"columns\"\n  [data]=\"rows\"\n  [selectable]=\"true\"\n  [actions]=\"['edit']\"\n  (action)=\"onAction($event)\">\n</app-table>",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Input",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>data</code>",
              "<code>T[]</code>",
              "—",
              "Table rows."
            ],
            [
              "<code>columns</code>",
              "<code>ColumnDef&lt;T&gt;[]</code>",
              "—",
              "Declarative columns."
            ],
            [
              "<code>selectable</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Show row checkbox and “select all”."
            ],
            [
              "<code>showActions</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Show actions column. (Automatically true if <code>[actions]</code> or <code>appActions</code> is provided.)"
            ],
            [
              "<code>rowKey</code>",
              "<code>keyof T | (row, i) =&gt; unknown</code>",
              "—",
              "Stable row id. With it, <code>selected</code> holds <strong>keys</strong> and survives sorting/pagination."
            ],
            [
              "<code>selected</code>",
              "<code>any[]</code>",
              "<code>[]</code>",
              "Controlled selection: keys (with <code>rowKey</code>) or indices into <code>data</code> (without it)."
            ],
            [
              "<code>actions</code>",
              "<code>(TableAction&lt;T&gt;|ActionKind)[]</code>",
              "<code>[]</code>",
              "Declarative actions rendered automatically when no <code>appActions</code> slot is provided."
            ],
            [
              "<code>actionsLabel</code>",
              "<code>string</code>",
              "<code>labels.table.actions</code>",
              "Screen-reader name of the actions column (its header is visually empty)."
            ],
            [
              "<code>actionsColWidth</code>",
              "<code>string | number</code>",
              "<code>44</code>",
              "Width of the actions column (number = px)."
            ],
            [
              "<code>loading</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Shows skeleton loading state."
            ],
            [
              "<code>loadingRows</code>",
              "<code>number</code>",
              "<code>5</code>",
              "Number of skeleton rows."
            ],
            [
              "<code>emptyMessage</code>",
              "<code>string</code>",
              "<code>labels.table.empty</code>",
              "Empty-state message."
            ],
            [
              "<code>error</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Load failure message: shown instead of the rows (announced). <code>loading</code> wins."
            ],
            [
              "<code>retryLabel</code>",
              "<code>string | null</code>",
              "<code>labels.table.retry</code>",
              "Text of the button that emits <code>retry</code>; <code>null</code> hides it."
            ],
            [
              "<code>bulkActions</code>",
              "<code>TableBulkAction[]</code>",
              "<code>[]</code>",
              "Buttons of the bulk actions bar (requires <code>selectable</code>)."
            ],
            [
              "<code>bulkActionsLabel</code>",
              "<code>string</code>",
              "<code>labels.table.bulkActions</code>",
              "Screen-reader name of the bar."
            ],
            [
              "<code>selectedCountLabel</code>",
              "<code>(n: number) =&gt; string</code>",
              "<code>labels.table.selectedCount</code>",
              "Counter text (also announced on every change)."
            ],
            [
              "<code>clearSelectionLabel</code>",
              "<code>string</code>",
              "<code>labels.clearSelection</code>",
              "Text of the button that clears the selection."
            ],
            [
              "<code>noSelectionLabel</code>",
              "<code>string</code>",
              "<code>labels.table.noSelection</code>",
              "Text without a selection: visible with <code>bulkBarIdle=&quot;hint&quot;</code>, otherwise only announced."
            ],
            [
              "<code>bulkBarIdle</code>",
              "<code>'space' | 'hint' | 'hidden'</code>",
              "<code>'space'</code>",
              "What the bar shows without a selection (see Bulk actions)."
            ],
            [
              "<code>sortKey</code>",
              "<code>string</code>",
              "—",
              "Controlled sort column key."
            ],
            [
              "<code>sortDir</code>",
              "<code>'asc'|'desc'</code>",
              "<code>'asc'</code>",
              "Controlled sort direction."
            ],
            [
              "<code>paginate</code>",
              "<code>'client' | 'server' | null</code>",
              "<code>null</code>",
              "Turns on built-in pagination (see Pagination). Without it, shows all of <code>data</code>."
            ],
            [
              "<code>pageIndex</code>",
              "<code>number</code>",
              "<code>0</code>",
              "Current page (0-based); supports <code>[(pageIndex)]</code>."
            ],
            [
              "<code>pageSize</code>",
              "<code>number</code>",
              "<code>10</code>",
              "Rows per page; supports <code>[(pageSize)]</code>."
            ],
            [
              "<code>totalItems</code>",
              "<code>number | null</code>",
              "<code>null</code>",
              "Server-side total (<code>paginate=&quot;server&quot;</code>)."
            ],
            [
              "<code>pageSizeOptions</code>",
              "<code>number[]</code>",
              "<code>[]</code>",
              "&quot;Itens por página&quot; options; empty hides the selector."
            ],
            [
              "<code>rangeLabel</code>",
              "<code>(start, end, total) =&gt; string</code>",
              "<code>labels.table.range</code>",
              "Footer range text (announced on page change)."
            ],
            [
              "<code>pageSizeLabel</code>",
              "<code>string</code>",
              "<code>labels.table.pageSize</code>",
              "Selector label."
            ],
            [
              "<code>paginationLabel</code>",
              "<code>string</code>",
              "<code>labels.table.pagination</code>",
              "Name of the page navigation."
            ],
            [
              "<code>detailsLabel</code>",
              "<code>string</code>",
              "<code>labels.table.details</code>",
              "Screen-reader name of the details button column."
            ],
            [
              "<code>expandLabel</code>",
              "<code>string</code>",
              "<code>labels.table.expand</code>",
              "Name of the button that opens the details row."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Output",
            "Payload",
            "When"
          ],
          "rows": [
            [
              "<code>selectedChange</code>",
              "<code>any[]</code> (keys or indices)",
              "Row or “select all” changes."
            ],
            [
              "<code>action</code>",
              "<code>{ type: string; row: T; index: number }</code>",
              "When a declarative action is clicked (auto-rendered)."
            ],
            [
              "<code>retry</code>",
              "<code>void</code>",
              "The retry button was clicked in the error state."
            ],
            [
              "<code>bulkAction</code>",
              "<code>{ type: string; keys: any[] }</code>",
              "A bulk action was clicked (selected keys or indices)."
            ],
            [
              "<code>pageIndexChange</code>",
              "<code>number</code>",
              "Page changed (click, sorting, or fix after <code>data</code> shrinks)."
            ],
            [
              "<code>pageSizeChange</code>",
              "<code>number</code>",
              "&quot;Itens por página&quot; changed."
            ],
            [
              "<code>sortChange</code>",
              "<code>{ key: string; dir: 'asc' | 'desc' }</code>",
              "User clicked a header and changed sorting."
            ]
          ]
        }
      ],
      "a11y": [
        "Semantic <code>&lt;table&gt;</code>, sticky <code>&lt;thead&gt;</code>, labeled checkboxes (<code>aria-label</code>).",
        "Visible focus on action buttons (<code>:focus-visible</code>).",
        "Error state: announced message (<code>role=&quot;alert&quot;</code>), <code>aria-busy</code> on the table while loading, and focus is not lost on retry.",
        "Collapsed columns: &quot;Mostrar detalhes&quot; button with <code>aria-expanded</code> and <code>aria-controls</code> pointing to the details row; the button column has a name (<code>detailsLabel</code>).",
        "Bulk actions: bar with <code>role=&quot;group&quot;</code> and a name (<code>bulkActionsLabel</code>), announced counter (<code>aria-live=&quot;polite&quot;</code>), and focus moves to &quot;select all&quot; when the buttons go away.",
        "Declarative actions: the name is also a tooltip; unavailable actions use <code>aria-disabled</code> (focusable, with the reason) and the actions column header has a screen-reader name (<code>actionsLabel</code>).",
        "Avoid global resets like <code>button { border: none !important; ... }</code> — scope styles to <code>.icon-btn</code> instead.",
        "Clickable header with <code>aria-sort=&quot;ascending|descending|none&quot;</code> and visible focus on the <code>th</code> (Enter/Space toggles)."
      ],
      "tokens": [
        "--tbl-header-bg",
        "--tbl-header-fg",
        "--tbl-row-bg",
        "--tbl-row-gray-medium",
        "--tbl-row-border",
        "--tbl-fg",
        "--tbl-muted",
        "--tbl-action",
        "--chip-"
      ],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/table/</code>"
            ]
          },
          {
            "what": "Components it uses",
            "items": [
              "<code>components/button/</code>",
              "<code>components/pagination/</code>",
              "<code>components/tooltip/</code>"
            ]
          },
          {
            "what": "Types",
            "items": [
              "<code>model/interface/chip-map-entry.interface.ts</code>",
              "<code>model/interface/column-def.interface.ts</code>",
              "<code>model/interface/table-action.interface.ts</code>",
              "<code>model/interface/table-bulk-action.interface.ts</code>",
              "<code>model/type/action-kind.type.ts</code>",
              "<code>model/type/align.type.ts</code>",
              "<code>model/type/button/bnt-size.type.ts</code>",
              "<code>model/type/button/bnt-tone.type.ts</code>",
              "<code>model/type/button/bnt-variant.type.ts</code>",
              "<code>model/type/cell.type.ts</code>",
              "<code>model/type/sort-dir.type.ts</code>"
            ]
          },
          {
            "what": "Default texts",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md\">Component texts</a>)"
            ]
          }
        ],
        "globals": [
          "@use '<your-folder>/shared/components/button/button' as *",
          "@use '<your-folder>/shared/components/tooltip/tooltip'"
        ],
        "summary": "Depends only on <code>@angular/common</code>, <code>@angular/core</code>. In total: 33 files, ~2860 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/table/table.en.md"
    }
  },
  "tabs": {
    "pt": {
      "lead": "Abas no padrão <strong>WAI-ARIA</strong> (<code>tablist</code> / <code>tab</code> / <code>tabpanel</code>) para alternar entre seções de uma mesma tela.",
      "why": [
        "Abas parecem simples, mas acertar o comportamento dá trabalho: as setas trocam de aba, só a aba aberta entra na ordem do Tab, cada aba aponta para o seu painel, as desabilitadas são puladas e, com muitas abas no celular, a aberta precisa continuar à vista. Este componente resolve isso uma vez, no padrão WAI-ARIA, para você só declarar as abas."
      ],
      "useWhen": [
        "As seções são da mesma tela e podem ser abertas em qualquer ordem.",
        "A pessoa precisa trocar de visão sem sair da página.",
        "Alguma seção é pesada: com <code>appTabContent</code> ela só é criada quando aberta."
      ],
      "preferOther": [
        "Etapas em sequência, uma dependendo da outra: use o <a href=\"/componentes/stepper\">Stepper</a>.",
        "Poucas opções que mudam um valor de formulário: use o <a href=\"/componentes/radio\">Radio group</a>.",
        "Ir para outra página: use links, não abas."
      ],
      "example": "<app-tabs ariaLabel=\"Conta\" [(selected)]=\"aba\">\n  <app-tab key=\"perfil\" label=\"Perfil\">…</app-tab>\n  <app-tab key=\"pedidos\" label=\"Pedidos\" [badge]=\"pendentes()\">…</app-tab>\n  <app-tab key=\"arquivo\" label=\"Arquivo\" disabled>…</app-tab>\n</app-tabs>",
      "api": [
        {
          "title": "<code>app-tabs</code>",
          "head": [
            "Propriedade",
            "Tipo",
            "Padrão",
            "Descrição"
          ],
          "rows": [
            [
              "<code>selected</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Chave da aba aberta. Two-way via <code>[(selected)]</code>. Vazia, inexistente ou desabilitada → primeira aba habilitada."
            ],
            [
              "<code>activation</code>",
              "<code>'auto' | 'manual'</code>",
              "<code>'auto'</code>",
              "<code>auto</code>: as setas já abrem a aba. <code>manual</code>: as setas só movem o foco; Enter/Espaço abrem (use quando abrir a aba for custoso)."
            ],
            [
              "<code>keepAlive</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Mantém o conteúdo <code>appTabContent</code> depois da primeira visita."
            ],
            [
              "<code>ariaLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Nome da lista de abas para leitor de tela (ex.: &quot;Seções da conta&quot;)."
            ]
          ]
        },
        {
          "title": "<code>app-tabs</code> · Evento",
          "head": [
            "Evento",
            "Payload",
            "Quando dispara"
          ],
          "rows": [
            [
              "<code>selectedChange</code>",
              "<code>string</code>",
              "O usuário abriu outra aba."
            ]
          ]
        },
        {
          "title": "<code>app-tab</code>",
          "head": [
            "Propriedade",
            "Tipo",
            "Padrão",
            "Descrição"
          ],
          "rows": [
            [
              "<code>key</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Identificador usado em <code>selected</code>. Sem ele, vale a posição (<code>&quot;0&quot;</code>, <code>&quot;1&quot;</code>...)."
            ],
            [
              "<code>label</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Texto da aba (ou use <code>appTabLabel</code>)."
            ],
            [
              "<code>badge</code>",
              "<code>string | number | null</code>",
              "<code>null</code>",
              "Contador ao lado do rótulo; lido como &quot;Pedidos (3)&quot;."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Não pode ser aberta; as setas pulam a aba."
            ]
          ]
        }
      ],
      "a11y": [
        "<strong>Tab</strong> entra na aba aberta e o próximo <strong>Tab</strong> vai para o painel (só uma aba fica na ordem de tabulação).",
        "<strong>← →</strong> trocam de aba, pulando as desabilitadas e dando a volta; <strong>Home/End</strong> vão para a primeira/última.",
        "Cada aba aponta para o seu painel (<code>aria-controls</code>) e o painel é nomeado pela aba (<code>aria-labelledby</code>); a aba aberta tem <code>aria-selected=&quot;true&quot;</code>.",
        "O contador não vira &quot;Pedidos3&quot;: o número visível é escondido do leitor, que ouve &quot;Pedidos (3)&quot;.",
        "Em alto contraste do Windows, o sublinhado da aba aberta usa a cor do sistema."
      ],
      "tokens": [
        "--tabs-border",
        "--tabs-fg",
        "--tabs-fg-hover",
        "--tabs-active",
        "--tabs-indicator",
        "--tabs-hover-bg",
        "--tabs-badge-bg",
        "--tabs-badge-fg",
        "--tabs-badge-border"
      ],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/tabs/</code>"
            ]
          }
        ],
        "globals": [],
        "summary": "Depende só de <code>@angular/common</code>, <code>@angular/core</code>. Ao todo: 8 arquivos, ~414 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/tabs/tabs.md"
    },
    "en": {
      "lead": "@Component({ imports: [...TABS_IMPORTS] }) ```",
      "why": [
        "Tabs look simple, but getting the behavior right takes work: arrow keys switch tabs, only the open tab is in the Tab order, each tab points to its panel, disabled tabs are skipped and, with many tabs on a phone, the open one has to stay in view. This component solves it once, following WAI-ARIA, so you only declare the tabs."
      ],
      "useWhen": [
        "The sections belong to the same screen and can be opened in any order.",
        "People need to switch views without leaving the page.",
        "A section is heavy: with <code>appTabContent</code> it is only created when opened."
      ],
      "preferOther": [
        "Steps in sequence, one depending on the other: use the <a href=\"/componentes/stepper\">Stepper</a>.",
        "A few options that set a form value: use the <a href=\"/componentes/radio\">Radio group</a>.",
        "Going to another page: use links, not tabs."
      ],
      "example": "<app-tabs ariaLabel=\"Account\" [(selected)]=\"tab\">\n  <app-tab key=\"profile\" label=\"Profile\">…</app-tab>\n  <app-tab key=\"orders\" label=\"Orders\" [badge]=\"pending()\">…</app-tab>\n  <app-tab key=\"archive\" label=\"Archive\" disabled>…</app-tab>\n</app-tabs>",
      "api": [
        {
          "title": "<code>app-tabs</code>",
          "head": [
            "Input",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>selected</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Key of the open tab. Two-way via <code>[(selected)]</code>. Empty, unknown or disabled → first enabled tab."
            ],
            [
              "<code>activation</code>",
              "<code>'auto' | 'manual'</code>",
              "<code>'auto'</code>",
              "<code>auto</code>: arrows open the tab right away. <code>manual</code>: arrows only move focus; Enter/Space open it (use when opening a tab is expensive)."
            ],
            [
              "<code>keepAlive</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Keeps <code>appTabContent</code> content after the first visit."
            ],
            [
              "<code>ariaLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Screen-reader name of the tab list (e.g. &quot;Account sections&quot;)."
            ]
          ]
        },
        {
          "title": "<code>app-tabs</code> · Output",
          "head": [
            "Output",
            "Payload",
            "When"
          ],
          "rows": [
            [
              "<code>selectedChange</code>",
              "<code>string</code>",
              "The user opened another tab."
            ]
          ]
        },
        {
          "title": "<code>app-tab</code>",
          "head": [
            "Input",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>key</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Identifier used by <code>selected</code>. Without it, the position is used (<code>&quot;0&quot;</code>, <code>&quot;1&quot;</code>...)."
            ],
            [
              "<code>label</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Tab text (or use <code>appTabLabel</code>)."
            ],
            [
              "<code>badge</code>",
              "<code>string | number | null</code>",
              "<code>null</code>",
              "Counter next to the label; read as &quot;Orders (3)&quot;."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Cannot be opened; arrows skip it."
            ]
          ]
        }
      ],
      "a11y": [
        "<strong>Tab</strong> enters the open tab and the next <strong>Tab</strong> moves to the panel (only one tab is in the Tab order).",
        "<strong>← →</strong> switch tabs, skipping disabled ones and wrapping; <strong>Home/End</strong> go to the first/last.",
        "Each tab points to its panel (<code>aria-controls</code>) and the panel is named by its tab (<code>aria-labelledby</code>); the open tab has <code>aria-selected=&quot;true&quot;</code>.",
        "The badge does not become &quot;Orders3&quot;: the visible number is hidden from screen readers, which hear &quot;Orders (3)&quot;.",
        "In Windows high contrast mode, the open tab's underline uses the system color."
      ],
      "tokens": [
        "--tabs-border",
        "--tabs-fg",
        "--tabs-fg-hover",
        "--tabs-active",
        "--tabs-indicator",
        "--tabs-hover-bg",
        "--tabs-badge-bg",
        "--tabs-badge-fg",
        "--tabs-badge-border"
      ],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/tabs/</code>"
            ]
          }
        ],
        "globals": [],
        "summary": "Depends only on <code>@angular/common</code>, <code>@angular/core</code>. In total: 8 files, ~414 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/tabs/tabs.en.md"
    }
  },
  "toast": {
    "pt": {
      "lead": "Componente de <strong>toasts</strong> leve e acessível: <strong>serviço + container</strong>. O <strong>serviço</strong> gerencia a fila (signals) e o <strong>container</strong> apenas renderiza a pilha. Sem framework de UI.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<app-toast-container></app-toast-container>",
      "api": [],
      "a11y": [
        "<code>aria-live=&quot;polite&quot;</code> na pilha; para erro, <code>role=&quot;alert&quot;</code> (assertivo).",
        "Botão de fechar com <code>aria-label=&quot;Fechar&quot;</code>.",
        "Foco visível em botões de ação/fechar."
      ],
      "tokens": [
        "--toast-radius",
        "--toast-shadow"
      ],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/toast/</code>"
            ]
          },
          {
            "what": "Componentes que ele usa",
            "items": [
              "<code>components/button/</code>"
            ]
          },
          {
            "what": "Tipos",
            "items": [
              "<code>model/interface/toast.interface.ts</code>",
              "<code>model/type/button/bnt-size.type.ts</code>",
              "<code>model/type/button/bnt-tone.type.ts</code>",
              "<code>model/type/button/bnt-variant.type.ts</code>",
              "<code>model/type/toast.types.ts</code>"
            ]
          },
          {
            "what": "Textos padrão",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.md\">Textos dos componentes</a>)"
            ]
          },
          {
            "what": "Serviço",
            "items": [
              "<code>services/toast.service.ts</code>"
            ]
          }
        ],
        "globals": [
          "@use '<sua-pasta>/shared/components/button/button' as *"
        ],
        "summary": "Depende só de <code>@angular/common</code>, <code>@angular/core</code>. Ao todo: 13 arquivos, ~712 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/toast/toast.md"
    },
    "en": {
      "lead": "A lightweight, accessible <strong>toast</strong> solution built from <strong>service + container</strong>. The <strong>service</strong> manages the queue (signals) and the <strong>container</strong> renders the stack. No UI framework.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<app-toast-container></app-toast-container>",
      "api": [],
      "a11y": [
        "<code>aria-live=&quot;polite&quot;</code> on the stack; <code>role=&quot;alert&quot;</code> for errors (assertive).",
        "Close button with <code>aria-label=&quot;Close&quot;</code>.",
        "Visible focus styles for action/close buttons."
      ],
      "tokens": [
        "--toast-radius",
        "--toast-shadow"
      ],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/toast/</code>"
            ]
          },
          {
            "what": "Components it uses",
            "items": [
              "<code>components/button/</code>"
            ]
          },
          {
            "what": "Types",
            "items": [
              "<code>model/interface/toast.interface.ts</code>",
              "<code>model/type/button/bnt-size.type.ts</code>",
              "<code>model/type/button/bnt-tone.type.ts</code>",
              "<code>model/type/button/bnt-variant.type.ts</code>",
              "<code>model/type/toast.types.ts</code>"
            ]
          },
          {
            "what": "Default texts",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md\">Component texts</a>)"
            ]
          },
          {
            "what": "Service",
            "items": [
              "<code>services/toast.service.ts</code>"
            ]
          }
        ],
        "globals": [
          "@use '<your-folder>/shared/components/button/button' as *"
        ],
        "summary": "Depends only on <code>@angular/common</code>, <code>@angular/core</code>. In total: 13 files, ~712 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/toast/toast.en.md"
    }
  },
  "tooltip": {
    "pt": {
      "lead": "Dica curta sobre um elemento, mostrada ao <strong>passar o mouse</strong> ou <strong>focar pelo teclado</strong>. É uma diretiva: vai em qualquer elemento focável (<code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>, <code>appButton</code>...).",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<button appButton=\"ghost\" iconOnly type=\"button\" appTooltip=\"Editar\" tooltipAsLabel>\n  <svg aria-hidden=\"true\">…</svg>\n</button>",
      "api": [],
      "a11y": [
        "<code>role=&quot;tooltip&quot;</code>, ligado ao elemento por <code>aria-describedby</code> (ou <code>aria-labelledby</code> com <code>tooltipAsLabel</code>). O balão existe desde o início (escondido), então a dica é lida assim que o elemento recebe foco, sem esperar a animação.",
        "<strong>WCAG 1.4.13 (conteúdo em hover ou foco):</strong> - <strong>dispensável:</strong> <strong>Esc</strong> fecha a dica sem mover o foco. O Esc para na dica, então um Dialog aberto por trás só fecha no próximo Esc; - <strong>passível de hover:</strong> dá para levar o mouse até o balão (para ler ou ampliar) sem ele sumir; - <strong>persistente:</strong> fica aberto enquanto houver mouse ou foco, sem tempo limite.",
        "Dentro de Dialog/ActionBar o balão não fica inerte (<code>data-dialog-keep-active</code>).",
        "Alto contraste do Windows: borda na cor do sistema; com &quot;reduzir movimento&quot;, sem animação."
      ],
      "tokens": [
        "--tip-bg",
        "--tip-fg",
        "--tip-radius",
        "--tip-max-width",
        "--tip-font-size",
        "--tip-shadow",
        "--tip-z"
      ],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/tooltip/</code>"
            ]
          }
        ],
        "globals": [
          "@use '<sua-pasta>/shared/components/tooltip/tooltip'"
        ],
        "summary": "Depende só de <code>@angular/common</code>, <code>@angular/core</code>. Ao todo: 3 arquivos, ~445 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/tooltip/tooltip.md"
    },
    "en": {
      "lead": "A short hint about an element, shown on <strong>hover</strong> or <strong>keyboard focus</strong>. It is a directive: it goes on any focusable element (<code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>, <code>appButton</code>...).",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<button appButton=\"ghost\" iconOnly type=\"button\" appTooltip=\"Edit\" tooltipAsLabel>\n  <svg aria-hidden=\"true\">…</svg>\n</button>",
      "api": [],
      "a11y": [
        "<code>role=&quot;tooltip&quot;</code>, linked to the element through <code>aria-describedby</code> (or <code>aria-labelledby</code> with <code>tooltipAsLabel</code>). The bubble exists from the start (hidden), so the hint is read as soon as the element gets focus, without waiting for the animation.",
        "<strong>WCAG 1.4.13 (content on hover or focus):</strong> - <strong>dismissible:</strong> <strong>Esc</strong> closes the hint without moving focus. The Esc stops at the hint, so a Dialog behind it only closes on the next Esc; - <strong>hoverable:</strong> the pointer can move onto the bubble (to read or zoom it) without it disappearing; - <strong>persistent:</strong> it stays open while hovered or focused, with no timeout.",
        "Inside Dialog/ActionBar the bubble is not made inert (<code>data-dialog-keep-active</code>).",
        "Windows High Contrast: border in the system color; with &quot;reduce motion&quot;, no animation."
      ],
      "tokens": [
        "--tip-bg",
        "--tip-fg",
        "--tip-radius",
        "--tip-max-width",
        "--tip-font-size",
        "--tip-shadow",
        "--tip-z"
      ],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/tooltip/</code>"
            ]
          }
        ],
        "globals": [
          "@use '<your-folder>/shared/components/tooltip/tooltip'"
        ],
        "summary": "Depends only on <code>@angular/common</code>, <code>@angular/core</code>. In total: 3 files, ~445 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/tooltip/tooltip.en.md"
    }
  },
  "treeselect": {
    "pt": {
      "lead": "Select cujas opções formam uma <strong>árvore</strong>: escolha um nó (com o caminho no campo) ou marque grupos inteiros com checkbox. Construído com <strong>Angular Standalone + HTML/Sass</strong>, sem dependências de UI libs.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<app-tree-select label=\"Cidade\" [nodes]=\"lugares\" [(value)]=\"cidade\" />",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Propriedade",
            "Tipo",
            "Padrão",
            "Descrição"
          ],
          "rows": [
            [
              "<code>nodes</code>",
              "<code>TreeNode&lt;T&gt;[]</code>",
              "—",
              "A árvore (obrigatório)."
            ],
            [
              "<code>selectionMode</code>",
              "<code>'single' | 'checkbox'</code>",
              "<code>'single'</code>",
              "Um nó ou várias folhas."
            ],
            [
              "<code>value</code>",
              "<code>string | string[] | null</code>",
              "<code>null</code> / <code>[]</code>",
              "Valor. Two-way via <code>[(value)]</code>; com formulários, use <code>formControl</code>/<code>ngModel</code>."
            ],
            [
              "<code>leafOnly</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "<code>single</code>: só folhas podem ser escolhidas."
            ],
            [
              "<code>expandedKeys</code>",
              "<code>string[]</code>",
              "<code>[]</code>",
              "Nós que começam abertos."
            ],
            [
              "<code>filterable</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Campo de busca no painel (sem acento/caixa)."
            ],
            [
              "<code>filterPlaceholder</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Placeholder da busca."
            ],
            [
              "<code>emptyMessage</code>",
              "<code>string</code>",
              "<code>labels.treeSelect.empty</code>",
              "Texto quando a busca não encontra nada."
            ],
            [
              "<code>label</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Rótulo do campo."
            ],
            [
              "<code>placeholder</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Texto com o campo vazio."
            ],
            [
              "<code>pathSeparator</code>",
              "<code>string</code>",
              "<code>' › '</code>",
              "Separador do caminho (<code>single</code>)."
            ],
            [
              "<code>maxChips</code>",
              "<code>number</code>",
              "<code>3</code>",
              "Chips antes do &quot;+N&quot; (<code>checkbox</code>)."
            ],
            [
              "<code>valueMode</code>",
              "<code>'leaves' | 'summary'</code>",
              "<code>'leaves'</code>",
              "<code>checkbox</code>: keys das folhas, ou grupo completo como uma key."
            ],
            [
              "<code>loadChildren</code>",
              "<code>(node) =&gt; Promise&lt;TreeNode[]&gt; | Observable&lt;TreeNode[]&gt;</code>",
              "<code>null</code>",
              "Busca os filhos dos nós <code>leaf: false</code> ao abri-los."
            ],
            [
              "<code>loadingLabel</code>, <code>loadErrorLabel</code>",
              "<code>string</code>",
              "<code>labels.treeSelect.loading</code> / <code>labels.treeSelect.loadError</code>",
              "Textos do carregamento e do erro (i18n)."
            ],
            [
              "<code>clearable</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Botão &quot;×&quot; para limpar."
            ],
            [
              "<code>required</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Mostra &quot;requerido&quot; e valida ao fechar/sair."
            ],
            [
              "<code>error</code> / <code>hint</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Erro externo (prioridade) e texto de apoio."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Desabilita (o formulário também pode)."
            ],
            [
              "<code>responsive</code>",
              "<code>'auto' | 'menu' | 'sheet'</code>",
              "<code>'auto'</code>",
              "<code>auto</code>: vira *sheet* (painel de baixo) até <code>sheetBreakpoint</code> px."
            ],
            [
              "<code>sheetBreakpoint</code>",
              "<code>number</code>",
              "<code>560</code>",
              "Largura máxima para o modo *sheet*."
            ],
            [
              "<code>panelTitle</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Título da *sheet* (padrão: <code>label</code>)."
            ],
            [
              "<code>requiredLabel</code>, <code>requiredError</code>, <code>clearAriaLabel</code>, <code>closeAriaLabel</code>",
              "<code>string</code>",
              "<code>labels.required</code> / <code>requiredError</code> / <code>clearSelection</code> / <code>close</code>",
              "Textos para i18n."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Evento",
            "Payload",
            "Quando dispara"
          ],
          "rows": [
            [
              "<code>valueChange</code>",
              "<code>string | string[] | null</code>",
              "O usuário mudou a seleção."
            ]
          ]
        }
      ],
      "a11y": [],
      "tokens": [],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/tree-select/</code>"
            ]
          },
          {
            "what": "Componentes que ele usa",
            "items": [
              "<code>components/checkbox/</code>"
            ]
          },
          {
            "what": "Tipos",
            "items": [
              "<code>model/interface/tree-select/tree-node.interface.ts</code>",
              "<code>model/type/responsive-mode.type.ts</code>"
            ]
          },
          {
            "what": "Textos padrão",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.md\">Textos dos componentes</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depende só de <code>@angular/core</code>, <code>@angular/forms</code>, <code>rxjs</code>. Ao todo: 13 arquivos, ~1587 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/tree-select/tree-select.md"
    },
    "en": {
      "lead": "A select whose options form a <strong>tree</strong>: pick one node (with its path in the field) or check whole groups with checkboxes. Built with <strong>Angular Standalone + HTML/Sass</strong>, no UI libraries.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": "<app-tree-select label=\"City\" [nodes]=\"places\" [(value)]=\"city\" />",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Input",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>nodes</code>",
              "<code>TreeNode&lt;T&gt;[]</code>",
              "—",
              "The tree (required)."
            ],
            [
              "<code>selectionMode</code>",
              "<code>'single' | 'checkbox'</code>",
              "<code>'single'</code>",
              "One node or several leaves."
            ],
            [
              "<code>value</code>",
              "<code>string | string[] | null</code>",
              "<code>null</code> / <code>[]</code>",
              "Value. Two-way via <code>[(value)]</code>; with forms, use <code>formControl</code>/<code>ngModel</code>."
            ],
            [
              "<code>leafOnly</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "<code>single</code>: only leaves can be picked."
            ],
            [
              "<code>valueMode</code>",
              "<code>'leaves' | 'summary'</code>",
              "<code>'leaves'</code>",
              "<code>checkbox</code>: leaf keys, or a complete group as one key."
            ],
            [
              "<code>loadChildren</code>",
              "<code>(node) =&gt; Promise&lt;TreeNode[]&gt; | Observable&lt;TreeNode[]&gt;</code>",
              "<code>null</code>",
              "Fetches the children of <code>leaf: false</code> nodes when opened."
            ],
            [
              "<code>loadingLabel</code>, <code>loadErrorLabel</code>",
              "<code>string</code>",
              "<code>labels.treeSelect.loading</code> / <code>labels.treeSelect.loadError</code>",
              "Loading and error texts (i18n)."
            ],
            [
              "<code>expandedKeys</code>",
              "<code>string[]</code>",
              "<code>[]</code>",
              "Nodes open at start."
            ],
            [
              "<code>filterable</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Search box in the panel (accent/case-insensitive)."
            ],
            [
              "<code>filterPlaceholder</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Search placeholder."
            ],
            [
              "<code>emptyMessage</code>",
              "<code>string</code>",
              "<code>labels.treeSelect.empty</code>",
              "Text when the search finds nothing."
            ],
            [
              "<code>label</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Field label."
            ],
            [
              "<code>placeholder</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Text when empty."
            ],
            [
              "<code>pathSeparator</code>",
              "<code>string</code>",
              "<code>' › '</code>",
              "Path separator (<code>single</code>)."
            ],
            [
              "<code>maxChips</code>",
              "<code>number</code>",
              "<code>3</code>",
              "Chips before &quot;+N&quot; (<code>checkbox</code>)."
            ],
            [
              "<code>clearable</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "&quot;×&quot; clear button."
            ],
            [
              "<code>required</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Shows &quot;required&quot; and validates on close/blur."
            ],
            [
              "<code>error</code> / <code>hint</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "External error (wins) and helper text."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Disables it (the form can too)."
            ],
            [
              "<code>responsive</code>",
              "<code>'auto' | 'menu' | 'sheet'</code>",
              "<code>'auto'</code>",
              "<code>auto</code>: becomes a bottom *sheet* up to <code>sheetBreakpoint</code> px."
            ],
            [
              "<code>sheetBreakpoint</code>",
              "<code>number</code>",
              "<code>560</code>",
              "Max width for the *sheet* mode."
            ],
            [
              "<code>panelTitle</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "*Sheet* title (default: <code>label</code>)."
            ],
            [
              "<code>requiredLabel</code>, <code>requiredError</code>, <code>clearAriaLabel</code>, <code>closeAriaLabel</code>",
              "<code>string</code>",
              "<code>labels.required</code> / <code>requiredError</code> / <code>clearSelection</code> / <code>close</code>",
              "Texts for i18n."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Output",
            "Payload",
            "When"
          ],
          "rows": [
            [
              "<code>valueChange</code>",
              "<code>string | string[] | null</code>",
              "The user changed the selection."
            ]
          ]
        }
      ],
      "a11y": [],
      "tokens": [],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/tree-select/</code>"
            ]
          },
          {
            "what": "Components it uses",
            "items": [
              "<code>components/checkbox/</code>"
            ]
          },
          {
            "what": "Types",
            "items": [
              "<code>model/interface/tree-select/tree-node.interface.ts</code>",
              "<code>model/type/responsive-mode.type.ts</code>"
            ]
          },
          {
            "what": "Default texts",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md\">Component texts</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depends only on <code>@angular/core</code>, <code>@angular/forms</code>, <code>rxjs</code>. In total: 13 files, ~1587 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/tree-select/tree-select.en.md"
    }
  },
  "validation": {
    "pt": {
      "lead": "Peças para formulários reativos (Angular Forms) que funcionam com todos os componentes da biblioteca (<code>app-select</code>, <code>app-tree-select</code>, <code>app-checkbox</code>, <code>app-radio-group</code>, <code>app-switch</code>) e com inputs nativos.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": null,
      "api": [],
      "a11y": [],
      "tokens": [],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>forms/</code>",
              "<code>components/form-field/</code>"
            ]
          },
          {
            "what": "Textos padrão",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.md\">Textos dos componentes</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depende só de <code>@angular/core</code>, <code>@angular/forms</code>. Ao todo: 12 arquivos, ~760 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/forms/forms.md"
    },
    "en": {
      "lead": "Pieces for reactive forms (Angular Forms) that work with every component of the library (<code>app-select</code>, <code>app-tree-select</code>, <code>app-checkbox</code>, <code>app-radio-group</code>, <code>app-switch</code>) and with native inputs.",
      "why": [],
      "useWhen": [],
      "preferOther": [],
      "example": null,
      "api": [],
      "a11y": [],
      "tokens": [],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>forms/</code>",
              "<code>components/form-field/</code>"
            ]
          },
          {
            "what": "Default texts",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md\">Component texts</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depends only on <code>@angular/core</code>, <code>@angular/forms</code>. In total: 12 files, ~760 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/forms/forms.en.md"
    }
  }
};
