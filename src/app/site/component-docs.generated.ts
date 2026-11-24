// GERADO por `npm run docs:pages` a partir dos .md de cada componente. Não edite à mão:
// mude o .md e rode o script (o CI confere com `npm run check:pages`).
import { ComponentDocs } from './component-docs.types';

/** componentes com página completa (têm "Por que existe" nos dois idiomas) */
export const COMPONENT_PAGES_READY: readonly string[] = ["actionbar","button","checkbox","checkboxgroup","dialog","pagination","radio","select","stepper","switch","table","tabs","toast","tooltip","treeselect","validation"];

export const COMPONENT_DOCS: Record<string, ComponentDocs> = {
  "actionbar": {
    "pt": {
      "lead": "Sheet lateral com título, conteúdo e ações. Abre da <strong>direita para a esquerda</strong>, herda as cores do tema atual e respeita o <strong>accent</strong>.",
      "why": [
        "Painéis laterais têm os mesmos cuidados de um modal (foco preso e devolvido, <code>Esc</code>, fundo inerte, rolagem da página travada) e ainda precisam de largura que se adapte ao conteúdo. Este componente resolve isso uma vez, com título, conteúdo rolável e ações fixas no rodapé."
      ],
      "useWhen": [
        "Fluxos de revisão, confirmação ou edição que não justificam trocar de rota.",
        "Formulários auxiliares e wizards curtos, mantendo a tela de origem à vista.",
        "O conteúdo é maior do que cabe confortavelmente num Dialog."
      ],
      "preferOther": [
        "Uma confirmação curta: use o <a href=\"componentes/dialog\">Dialog</a>.",
        "Conteúdo muito longo ou navegação completa: use uma página."
      ],
      "example": "<app-actionbar\n  [title]=\"'Título do actionbar'\"\n  size=\"md\"\n  [(opened)]=\"open\"\n  primaryLabel=\"Confirmar\"\n  secondaryLabel=\"Cancelar\"\n  (primary)=\"onConfirm()\"\n  (secondary)=\"open=false\">\n  <!-- seu conteúdo -->\n</app-actionbar>",
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
        "<strong>Um modal sobre outro</strong> (ex.: um Dialog de confirmação aberto a partir de uma ActionBar, ou o contrário): só o de cima responde a <code>Esc</code> e <code>Tab</code>; cada <code>Esc</code> fecha um, de cima para baixo. O de cima continua usável mesmo sendo irmão do de baixo (que tinha deixado o resto da página inerte), e ao fechar volta a ser fundo dele.",
        "<strong><code>Esc</code> já tratado dentro do modal</strong> não fecha o modal: fechar um Select, TreeSelect ou Tooltip aberto dentro dele fecha só o painel.",
        "<strong>Foco inicial:</strong> ao abrir, o foco vai para o botão de fechar.",
        "<strong>Foco devolvido:</strong> ao fechar (botão, <code>Esc</code>, backdrop ou <code>opened=false</code>), o foco volta ao elemento que estava focado antes de abrir (normalmente o botão que abriu), se ele ainda estiver na página.",
        "<strong>Fundo inerte e sem rolagem:</strong> enquanto aberto, a rolagem da página trava e o resto da página recebe <code>inert</code> (sem foco, clique ou leitor de tela). Ao fechar, só o que o painel marcou é liberado. Elementos com <code>data-dialog-keep-active</code> continuam ativos (o <code>app-toast-container</code> já vem com ele).",
        "Botões possuem <strong>focus-visible</strong> de alto contraste."
      ],
      "tokens": [
        "--surface",
        "--fg",
        "--border",
        "--accent",
        "--accent-fill",
        "--accent-text"
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
            "what": "Arquivos auxiliares",
            "items": [
              "<code>a11y/modal-session.ts</code>"
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
        "summary": "Depende só de <code>@angular/core</code>. Ao todo: 10 arquivos, ~991 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/actionbar/actionbar.md"
    },
    "en": {
      "lead": "Right‑side sheet with header, scrollable content and footer actions. It inherits the current theme and respects the <strong>accent</strong>.",
      "why": [
        "Side panels need the same care as a modal (focus trapped and returned, <code>Esc</code>, inert background, page scroll locked) and also a width that adapts to the content. This component solves it once, with a title, scrollable content and actions fixed at the bottom."
      ],
      "useWhen": [
        "Review, confirm or edit flows that do not deserve a route change.",
        "Auxiliary forms and short wizards, keeping the original screen in view.",
        "The content is larger than fits comfortably in a Dialog."
      ],
      "preferOther": [
        "A short confirmation: use the <a href=\"componentes/dialog\">Dialog</a>.",
        "Very long content or full navigation: use a page."
      ],
      "example": "<app-actionbar\n  [title]=\"'Action bar title'\"\n  size=\"md\"\n  [(opened)]=\"open\"\n  primaryLabel=\"Confirm\"\n  secondaryLabel=\"Cancel\"\n  (primary)=\"onConfirm()\"\n  (secondary)=\"open=false\">\n  <!-- your content -->\n</app-actionbar>",
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
        "<strong>A modal over another</strong> (e.g. a confirmation Dialog opened from an ActionBar, or the other way around): only the top one answers <code>Esc</code> and <code>Tab</code>; each <code>Esc</code> closes one, top to bottom. The top one stays usable even as a sibling of the one below (which had made the rest of the page inert), and goes back to being its background when it closes.",
        "<strong>An <code>Esc</code> already handled inside the modal</strong> does not close it: closing a Select, TreeSelect or Tooltip open inside it closes just that panel.",
        "<strong>Initial focus:</strong> goes to the close button when opening.",
        "<strong>Focus restore:</strong> on close (button, <code>Esc</code>, backdrop or <code>opened=false</code>), focus returns to the element that was focused before opening (usually the opener), if it is still in the page.",
        "<strong>Inert, non-scrolling background:</strong> while open, page scrolling is locked and the rest of the page gets <code>inert</code> (no focus, clicks or screen reader access). On close, only what the sheet marked is released. Elements with <code>data-dialog-keep-active</code> stay active (<code>app-toast-container</code> already has it).",
        "Buttons have a high‑contrast <strong>focus-visible</strong> outline."
      ],
      "tokens": [
        "--surface",
        "--fg",
        "--border",
        "--accent",
        "--accent-fill",
        "--accent-text"
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
            "what": "Helper files",
            "items": [
              "<code>a11y/modal-session.ts</code>"
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
        "summary": "Depends only on <code>@angular/core</code>. In total: 10 files, ~991 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/actionbar/actionbar.en.md"
    }
  },
  "button": {
    "pt": {
      "lead": "Diretiva que dá o visual do tema a um <code>&lt;button&gt;</code> ou <code>&lt;a&gt;</code> nativo: variante, tom e tamanho, com estados de carregando e desabilitado.",
      "why": [
        "Um componente de botão que envolve o <code>&lt;button&gt;</code> costuma esconder atributos nativos (<code>type</code>, <code>disabled</code>, <code>aria-*</code>) e atrapalhar formulários e links. Como diretiva, o <code>appButton</code> só aplica o visual (variante, tom e tamanho com os tokens do tema) e deixa o elemento nativo fazer o resto: teclado, foco, envio de formulário e navegação."
      ],
      "useWhen": [
        "Qualquer ação na tela: use num <code>&lt;button&gt;</code>.",
        "Um link que precisa parecer botão: use num <code>&lt;a href&gt;</code>, que continua sendo link.",
        "Ações destrutivas: use <code>tone=&quot;danger&quot;</code>."
      ],
      "preferOther": [
        "Um botão só com ícone: use o botão e dê o nome com o <a href=\"componentes/tooltip\">Tooltip</a> (<code>tooltipAsLabel</code>).",
        "Ir para outra página dentro de um texto: use um link comum, sem <code>appButton</code>."
      ],
      "example": "<button appButton type=\"submit\">Salvar</button>\n<button appButton=\"ghost\" tone=\"neutral\" type=\"button\">Voltar</button>\n<button appButton=\"outline\" tone=\"danger\" type=\"button\">Excluir</button>\n<button appButton [busy]=\"salvando()\" type=\"submit\">Enviar</button>\n<a appButton variant=\"link\" href=\"/ajuda\">Saiba mais</a>",
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
              "<code>appButton</code> / <code>variant</code>",
              "<code>'solid' | 'outline' | 'ghost' | 'pill' | 'link'</code>",
              "<code>'solid'</code>",
              "Forma do botão. <code>variant</code> vence <code>appButton</code>."
            ],
            [
              "<code>tone</code>",
              "<code>'accent' | 'neutral' | 'danger'</code>",
              "<code>'accent'</code>",
              "Paleta: destaque do tema, neutra ou de ação destrutiva."
            ],
            [
              "<code>size</code>",
              "<code>'xs' | 'sm' | 'md' | 'lg'</code>",
              "<code>'md'</code>",
              "Tamanho."
            ],
            [
              "<code>block</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Ocupa a largura toda. Aceita o atributo vazio."
            ],
            [
              "<code>iconOnly</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Quadrado para um ícone só. Precisa de nome (<code>aria-label</code> ou Tooltip com <code>tooltipAsLabel</code>)."
            ],
            [
              "<code>busy</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Carregando: mostra um spinner, marca <code>aria-busy</code> e bloqueia o clique."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Desabilita. No <code>&lt;button&gt;</code> usa o <code>disabled</code> nativo; no <code>&lt;a&gt;</code>, <code>aria-disabled</code> e sai da ordem do Tab."
            ]
          ]
        }
      ],
      "a11y": [
        "Continua sendo o <code>&lt;button&gt;</code> ou <code>&lt;a&gt;</code> nativo: Enter e Espaço, envio de formulário e navegação funcionam sem nada a mais.",
        "<code>busy</code> e <code>disabled</code> bloqueiam o clique. No <code>&lt;button&gt;</code> viram o atributo <code>disabled</code>; no <code>&lt;a&gt;</code>, que não tem <code>disabled</code>, viram <code>aria-disabled=&quot;true&quot;</code> e <code>tabindex=&quot;-1&quot;</code>. No <code>&lt;a&gt;</code> o clique é barrado antes de qualquer outro tratador do elemento: nem o seu <code>(click)</code> nem o <code>routerLink</code> rodam.",
        "<strong>Contraste</strong> (≥ 4,5:1, também no hover): o <code>solid</code> usa texto branco sobre <code>--accent-fill</code>, <code>--neutral-fill</code> ou <code>--danger-fill</code>, que o tema escurece quando a cor de destaque é clara demais (ex.: laranja); o hover <strong>escurece</strong> o fundo. <code>outline</code>, <code>ghost</code> e <code>link</code> usam <code>--accent-text</code>, e no hover o texto se aproxima de <code>--fg</code>. Sem o tema, os valores padrão já passam.",
        "<code>busy</code> marca <code>aria-busy=&quot;true&quot;</code>; o texto do botão continua lá para o leitor de tela.",
        "Anel de foco (<code>:focus-visible</code>) na cor de destaque do tema, só no foco por teclado.",
        "Botão só com ícone (<code>iconOnly</code>) não tem texto visível: dê o nome com <code>aria-label</code> ou com o <a href=\"componentes/tooltip\">Tooltip</a> (<code>tooltipAsLabel</code>)."
      ],
      "tokens": [],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/button/</code>"
            ]
          }
        ],
        "globals": [
          "@use '<sua-pasta>/shared/components/button/button' as *"
        ],
        "summary": "Depende só de <code>@angular/core</code>. Ao todo: 3 arquivos, ~282 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/button/button.md"
    },
    "en": {
      "lead": "Directive that gives a native <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code> the theme look: variant, tone and size, with busy and disabled states.",
      "why": [
        "A button component that wraps <code>&lt;button&gt;</code> often hides native attributes (<code>type</code>, <code>disabled</code>, <code>aria-*</code>) and gets in the way of forms and links. As a directive, <code>appButton</code> only applies the look (variant, tone and size with the theme tokens) and lets the native element do the rest: keyboard, focus, form submission and navigation."
      ],
      "useWhen": [
        "Any action on the screen: use it on a <code>&lt;button&gt;</code>.",
        "A link that has to look like a button: use it on an <code>&lt;a href&gt;</code>, which is still a link.",
        "Destructive actions: use <code>tone=&quot;danger&quot;</code>."
      ],
      "preferOther": [
        "An icon-only button: use the button and name it with the <a href=\"componentes/tooltip\">Tooltip</a> (<code>tooltipAsLabel</code>).",
        "Going to another page inside a sentence: use a plain link, without <code>appButton</code>."
      ],
      "example": "<button appButton type=\"submit\">Save</button>\n<button appButton=\"ghost\" tone=\"neutral\" type=\"button\">Back</button>\n<button appButton=\"outline\" tone=\"danger\" type=\"button\">Delete</button>\n<button appButton [busy]=\"saving()\" type=\"submit\">Send</button>\n<a appButton variant=\"link\" href=\"/help\">Learn more</a>",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Property",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>appButton</code> / <code>variant</code>",
              "<code>'solid' | 'outline' | 'ghost' | 'pill' | 'link'</code>",
              "<code>'solid'</code>",
              "Button shape. <code>variant</code> wins over <code>appButton</code>."
            ],
            [
              "<code>tone</code>",
              "<code>'accent' | 'neutral' | 'danger'</code>",
              "<code>'accent'</code>",
              "Palette: theme accent, neutral or destructive action."
            ],
            [
              "<code>size</code>",
              "<code>'xs' | 'sm' | 'md' | 'lg'</code>",
              "<code>'md'</code>",
              "Size."
            ],
            [
              "<code>block</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Takes the full width. Accepts the empty attribute."
            ],
            [
              "<code>iconOnly</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Square for a single icon. Needs a name (<code>aria-label</code> or a Tooltip with <code>tooltipAsLabel</code>)."
            ],
            [
              "<code>busy</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Loading: shows a spinner, sets <code>aria-busy</code> and blocks clicks."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Disables. On <code>&lt;button&gt;</code> it uses the native <code>disabled</code>; on <code>&lt;a&gt;</code>, <code>aria-disabled</code> and it leaves the Tab order."
            ]
          ]
        }
      ],
      "a11y": [
        "It is still the native <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>: Enter and Space, form submission and navigation work with nothing extra.",
        "<code>busy</code> and <code>disabled</code> block clicks. On <code>&lt;button&gt;</code> they become the <code>disabled</code> attribute; on <code>&lt;a&gt;</code>, which has no <code>disabled</code>, they become <code>aria-disabled=&quot;true&quot;</code> and <code>tabindex=&quot;-1&quot;</code>. On <code>&lt;a&gt;</code> the click is stopped before any other handler on the element: neither your <code>(click)</code> nor <code>routerLink</code> runs.",
        "<strong>Contrast</strong> (≥ 4.5:1, hover included): <code>solid</code> uses white text on <code>--accent-fill</code>, <code>--neutral-fill</code> or <code>--danger-fill</code>, which the theme darkens when the accent is too light (e.g. orange); hover <strong>darkens</strong> the background. <code>outline</code>, <code>ghost</code> and <code>link</code> use <code>--accent-text</code>, and on hover the text moves toward <code>--fg</code>. Without the theme, the default values already pass.",
        "<code>busy</code> sets <code>aria-busy=&quot;true&quot;</code>; the button text stays there for screen readers.",
        "Focus ring (<code>:focus-visible</code>) in the theme accent color, on keyboard focus only.",
        "An icon-only button (<code>iconOnly</code>) has no visible text: name it with <code>aria-label</code> or with the <a href=\"componentes/tooltip\">Tooltip</a> (<code>tooltipAsLabel</code>)."
      ],
      "tokens": [],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/button/</code>"
            ]
          }
        ],
        "globals": [
          "@use '<your-folder>/shared/components/button/button' as *"
        ],
        "summary": "Depends only on <code>@angular/core</code>. In total: 3 files, ~282 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/button/button.en.md"
    }
  },
  "checkbox": {
    "pt": {
      "lead": "Checkbox acessível com <strong>estado parcial</strong> (indeterminado), integrado a formulários. Construído com <strong>Angular Standalone + HTML/Sass</strong>, sem dependências de UI libs.",
      "why": [
        "O checkbox nativo não tem o estado parcial no HTML (só por JavaScript), é difícil de estilizar e não traz dica nem erro. Este componente acrescenta o estado parcial (indeterminado), integra com Reactive Forms e <code>ngModel</code> e liga rótulo, dica e erro ao campo, sem perder o comportamento nativo de teclado e leitor de tela."
      ],
      "useWhen": [
        "Aceitar algo antes de enviar (termos, consentimento).",
        "Marcar vários itens de uma lista, com um &quot;selecionar todos&quot; que fica parcial.",
        "Escolhas que só valem ao enviar o formulário."
      ],
      "preferOther": [
        "Ligar ou desligar algo que vale na hora: use o <a href=\"componentes/switch\">Switch</a>.",
        "Escolher uma única opção entre poucas: use o <a href=\"componentes/radio\">Radio group</a>.",
        "Várias opções de uma lista, com o valor em lista: use o <a href=\"componentes/checkboxgroup\">Checkbox group</a>.",
        "Muitas opções em níveis: use o <a href=\"componentes/treeselect\">TreeSelect</a>."
      ],
      "example": "<app-checkbox [(checked)]=\"aceito\">Aceito os termos</app-checkbox>",
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
              "Marcado. Two-way via <code>[(checked)]</code>. Com formulários, use <code>formControl</code>/<code>ngModel</code>."
            ],
            [
              "<code>indeterminate</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Estado <strong>parcial</strong> (&quot;−&quot;). Tem prioridade visual sobre <code>checked</code>. Ao clicar, sai do parcial e fica marcado. Two-way via <code>[(indeterminate)]</code>."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Desabilita. Aceita o atributo vazio. O formulário também desabilita (<code>control.disable()</code>)."
            ],
            [
              "<code>required</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Repassa <code>required</code> ao input nativo. Para validar, use <code>Validators.requiredTrue</code>."
            ],
            [
              "<code>name</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "<code>name</code> do input nativo."
            ],
            [
              "<code>ariaLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Rótulo para leitor de tela quando não há texto visível."
            ],
            [
              "<code>hint</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Texto de apoio abaixo, ligado por <code>aria-describedby</code>."
            ],
            [
              "<code>error</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Mensagem de erro: substitui a dica, deixa a caixa vermelha e marca <code>aria-invalid</code>."
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
              "O usuário marcou/desmarcou."
            ],
            [
              "<code>indeterminateChange</code>",
              "<code>boolean</code>",
              "O usuário clicou num checkbox parcial (sai do parcial)."
            ]
          ]
        },
        {
          "title": "<code>app-checkbox-mark</code>",
          "head": [
            "Propriedade",
            "Tipo",
            "Padrão",
            "Descrição"
          ],
          "rows": [
            [
              "<code>state</code>",
              "<code>'unchecked' | 'checked' | 'mixed'</code>",
              "<code>'unchecked'</code>",
              "Estado desenhado."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Visual desabilitado."
            ]
          ]
        }
      ],
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
      "why": [
        "The native checkbox has no partial state in HTML (only through JavaScript), is hard to style and has no hint or error. This component adds the partial (indeterminate) state, works with Reactive Forms and <code>ngModel</code> and ties label, hint and error to the field, without losing the native keyboard and screen reader behavior."
      ],
      "useWhen": [
        "Accepting something before submitting (terms, consent).",
        "Checking several items of a list, with a &quot;select all&quot; that becomes partial.",
        "Choices that only apply when the form is submitted."
      ],
      "preferOther": [
        "Turning something on or off right away: use the <a href=\"componentes/switch\">Switch</a>.",
        "Picking one option among a few: use the <a href=\"componentes/radio\">Radio group</a>.",
        "Several options from a list, with a list value: use the <a href=\"componentes/checkboxgroup\">Checkbox group</a>.",
        "Many options in levels: use the <a href=\"componentes/treeselect\">TreeSelect</a>."
      ],
      "example": "<app-checkbox [(checked)]=\"accepted\">I accept the terms</app-checkbox>",
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
              "Checked. Two-way via <code>[(checked)]</code>. With forms, use <code>formControl</code>/<code>ngModel</code>."
            ],
            [
              "<code>indeterminate</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "<strong>Partial</strong> state (&quot;−&quot;). Visually wins over <code>checked</code>. Clicking leaves the partial state and checks it. Two-way via <code>[(indeterminate)]</code>."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Disables it. Accepts the bare attribute. The form can disable it too (<code>control.disable()</code>)."
            ],
            [
              "<code>required</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Passes <code>required</code> to the native input. To validate, use <code>Validators.requiredTrue</code>."
            ],
            [
              "<code>name</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Native input <code>name</code>."
            ],
            [
              "<code>ariaLabel</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Screen reader label when there is no visible text."
            ],
            [
              "<code>hint</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Helper text below, linked via <code>aria-describedby</code>."
            ],
            [
              "<code>error</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Error message: replaces the hint, turns the box red and sets <code>aria-invalid</code>."
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
              "The user checked/unchecked it."
            ],
            [
              "<code>indeterminateChange</code>",
              "<code>boolean</code>",
              "The user clicked a partial checkbox (it leaves the partial state)."
            ]
          ]
        },
        {
          "title": "<code>app-checkbox-mark</code>",
          "head": [
            "Input",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>state</code>",
              "<code>'unchecked' | 'checked' | 'mixed'</code>",
              "<code>'unchecked'</code>",
              "State to draw."
            ],
            [
              "<code>disabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Disabled look."
            ]
          ]
        }
      ],
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
  "checkboxgroup": {
    "pt": {
      "lead": "Escolha <strong>múltipla</strong> entre opções visíveis: o valor é a lista do que está marcado. Construído sobre <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code> e <code>&lt;input type=&quot;checkbox&quot;&gt;</code> <strong>nativos</strong>, com a mesma caixa do Checkbox (<code>app-checkbox-mark</code>, tokens <code>--cb-*</code>) e um &quot;Selecionar todos&quot; opcional.",
      "why": [
        "Uma lista de checkboxes parece simples, mas o grupo precisa de <code>&lt;fieldset&gt;</code> com <code>&lt;legend&gt;</code>, um valor em lista que não dependa da ordem dos cliques, erro e dica ligados a cada caixa e integração com formulários; e o &quot;Selecionar todos&quot; precisa do estado parcial e não pode mexer nas opções desabilitadas. Este componente monta tudo isso a partir de uma lista de opções, com o mesmo visual do Checkbox."
      ],
      "useWhen": [
        "A pessoa pode marcar várias opções, ou nenhuma, entre poucas (até umas 10).",
        "Vale mostrar todas as opções de uma vez, como preferências de aviso ou permissões."
      ],
      "preferOther": [
        "Só uma opção pode ser escolhida: use o <a href=\"componentes/radio\">Radio group</a>.",
        "Um único sim/não, como aceitar os termos: use o <a href=\"componentes/checkbox\">Checkbox</a>.",
        "Muitas opções, ou organizadas em grupos dentro de grupos: use o <a href=\"componentes/treeselect\">TreeSelect</a> no modo <code>checkbox</code>.",
        "A mudança vale na hora, como ligar uma configuração: use o <a href=\"componentes/switch\">Switch</a>."
      ],
      "example": "<app-checkbox-group label=\"Avisos por e-mail\" selectAll required\n  [options]=\"topicos\" [formControl]=\"avisos\"\n  [error]=\"avisos.touched && avisos.invalid ? 'Escolha pelo menos um aviso.' : null\" />\n\n<!-- sem formulário -->\n<app-checkbox-group label=\"Interesses\" orientation=\"horizontal\" [options]=\"interesses\" [(value)]=\"escolhidos\" />",
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
              "<code>CheckboxOption&lt;T&gt;[]</code>",
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
              "<code>T[] | null</code>",
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
              "<code>selectAll</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Mostra a caixa &quot;Selecionar todos&quot; acima das opções."
            ],
            [
              "<code>selectAllLabel</code>",
              "<code>string</code>",
              "<code>labels.selectAll</code>",
              "Texto da caixa &quot;Selecionar todos&quot; (i18n)."
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
              "Mostra &quot;requerido&quot; no rótulo. Para validar, use <code>Validators.required</code>."
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
              "<code>T[]</code>",
              "O usuário marcou ou desmarcou uma opção (ou usou &quot;Selecionar todos&quot;)."
            ]
          ]
        }
      ],
      "a11y": [
        "<code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code>: o leitor de tela anuncia o nome do grupo ao entrar nele.",
        "Checkboxes <strong>nativos</strong>: <code>Tab</code> passa por cada caixa (pulando as desabilitadas) e <code>Espaço</code> marca/desmarca; clicar no texto também marca.",
        "&quot;Selecionar todos&quot; é um checkbox nativo com estado <strong>parcial</strong> (<code>indeterminate</code>), anunciado como &quot;parcialmente marcado&quot;, e aponta para as caixas que controla (<code>aria-controls</code>).",
        "A <code>description</code> de cada opção, a dica e o erro são ligados por <code>aria-describedby</code>; o erro marca <code>aria-invalid</code> em cada caixa."
      ],
      "tokens": [
        "--cb-size",
        "--cb-border",
        "--cb-bg",
        "--cb-checked-bg",
        "--cb-hover-ring",
        "--cb-focus-ring",
        "--cb-disabled-border",
        "--cb-disabled-bg",
        "--danger"
      ],
      "copy": {
        "rows": [
          {
            "what": "O componente",
            "items": [
              "<code>components/checkbox-group/</code>"
            ]
          },
          {
            "what": "Componentes que ele usa",
            "items": [
              "<code>components/checkbox/</code>"
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
        "summary": "Depende só de <code>@angular/core</code>, <code>@angular/forms</code>. Ao todo: 11 arquivos, ~780 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/checkbox-group/checkbox-group.md"
    },
    "en": {
      "lead": "<strong>Multiple</strong> choice among visible options: the value is the list of what is checked. Built on <strong>native</strong> <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code> and <code>&lt;input type=&quot;checkbox&quot;&gt;</code>, with the same box as the Checkbox (<code>app-checkbox-mark</code>, <code>--cb-*</code> tokens) and an optional &quot;Select all&quot;.",
      "why": [
        "A list of checkboxes looks simple, but the group needs a <code>&lt;fieldset&gt;</code> with a <code>&lt;legend&gt;</code>, a list value that does not depend on the click order, error and hint linked to every box, and forms integration; and &quot;Select all&quot; needs the partial state and must not touch disabled options. This component builds all of that from a list of options, with the same look as the Checkbox."
      ],
      "useWhen": [
        "People can check several options, or none, among a few (up to about 10).",
        "It helps to show every option at once, like notification preferences or permissions."
      ],
      "preferOther": [
        "Only one option can be chosen: use the <a href=\"componentes/radio\">Radio group</a>.",
        "A single yes/no, like accepting the terms: use the <a href=\"componentes/checkbox\">Checkbox</a>.",
        "Many options, or groups within groups: use the <a href=\"componentes/treeselect\">TreeSelect</a> in <code>checkbox</code> mode.",
        "The change applies right away, like turning a setting on: use the <a href=\"componentes/switch\">Switch</a>."
      ],
      "example": "<app-checkbox-group label=\"Email alerts\" selectAll required\n  [options]=\"topics\" [formControl]=\"alerts\"\n  [error]=\"alerts.touched && alerts.invalid ? 'Choose at least one alert.' : null\" />\n\n<!-- without forms -->\n<app-checkbox-group label=\"Interests\" orientation=\"horizontal\" [options]=\"interests\" [(value)]=\"chosen\" />",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Property",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>options</code>",
              "<code>CheckboxOption&lt;T&gt;[]</code>",
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
              "<code>T[] | null</code>",
              "<code>null</code>",
              "Two-way via <code>[(value)]</code>; with forms, use <code>formControl</code>/<code>ngModel</code>."
            ],
            [
              "<code>orientation</code>",
              "<code>'vertical' | 'horizontal'</code>",
              "<code>'vertical'</code>",
              "Layout of the options (horizontal wraps when space runs out)."
            ],
            [
              "<code>name</code>",
              "<code>string | null</code>",
              "generated",
              "<code>name</code> of the inputs (unique per group by default)."
            ],
            [
              "<code>selectAll</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Shows the &quot;Select all&quot; box above the options."
            ],
            [
              "<code>selectAllLabel</code>",
              "<code>string</code>",
              "<code>labels.selectAll</code>",
              "Text of the &quot;Select all&quot; box (i18n)."
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
              "Shows &quot;required&quot; on the label. To validate, use <code>Validators.required</code>."
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
              "Marker text (i18n)."
            ]
          ]
        },
        {
          "title": "Outputs",
          "head": [
            "Event",
            "Payload",
            "When it fires"
          ],
          "rows": [
            [
              "<code>valueChange</code>",
              "<code>T[]</code>",
              "The user checked or unchecked an option (or used &quot;Select all&quot;)."
            ]
          ]
        }
      ],
      "a11y": [
        "<code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code>: screen readers announce the group name when entering it.",
        "<strong>Native</strong> checkboxes: <code>Tab</code> goes through each box (skipping disabled ones) and <code>Space</code> checks/unchecks; clicking the text checks too.",
        "&quot;Select all&quot; is a native checkbox with a <strong>partial</strong> state (<code>indeterminate</code>), announced as &quot;partially checked&quot;, and points to the boxes it controls (<code>aria-controls</code>).",
        "Each option's <code>description</code>, the hint and the error are linked by <code>aria-describedby</code>; the error sets <code>aria-invalid</code> on each box."
      ],
      "tokens": [
        "--cb-size",
        "--cb-border",
        "--cb-bg",
        "--cb-checked-bg",
        "--cb-hover-ring",
        "--cb-focus-ring",
        "--cb-disabled-border",
        "--cb-disabled-bg",
        "--danger"
      ],
      "copy": {
        "rows": [
          {
            "what": "The component",
            "items": [
              "<code>components/checkbox-group/</code>"
            ]
          },
          {
            "what": "Components it uses",
            "items": [
              "<code>components/checkbox/</code>"
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
        "summary": "Depends only on <code>@angular/core</code>, <code>@angular/forms</code>. In total: 11 files, ~780 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/checkbox-group/checkbox-group.en.md"
    }
  },
  "dialog": {
    "pt": {
      "lead": "Sheet/modal acessível e leve para confirmações e pequenos formulários. Construído com <strong>Angular Standalone + HTML/Sass</strong>, sem dependências de UI libs.",
      "why": [
        "Um modal precisa de mais do que uma caixa por cima da página: foco que entra, fica preso dentro e volta ao botão que abriu, <code>Esc</code> para fechar, fundo inerte para o leitor de tela e título ligado ao diálogo. Esquecer qualquer um deixa quem usa teclado ou leitor de tela perdido. Este componente faz isso sozinho, com tamanhos e ações padrão."
      ],
      "useWhen": [
        "A pessoa precisa confirmar uma ação antes de seguir (excluir, descartar alterações).",
        "Um formulário pequeno que não justifica trocar de página.",
        "A tarefa deve ser resolvida antes de voltar ao resto da tela."
      ],
      "preferOther": [
        "Formulário ou revisão mais longos, ao lado do conteúdo: use o <a href=\"componentes/actionbar\">ActionBar</a>.",
        "Avisar que algo aconteceu, sem interromper: use o <a href=\"componentes/toast\">Toast</a>.",
        "Uma explicação curta sobre um elemento: use o <a href=\"componentes/tooltip\">Tooltip</a>."
      ],
      "example": "<button appButton type=\"button\" (click)=\"aberto = true\">Excluir pedido</button>\n\n<app-dialog\n  title=\"Excluir pedido?\"\n  [(opened)]=\"aberto\"\n  describedBy=\"excluir-desc\"\n  primaryLabel=\"Excluir\"\n  secondaryLabel=\"Cancelar\"\n  (primary)=\"excluir()\">\n  <p id=\"excluir-desc\">Esta ação não pode ser desfeita.</p>\n</app-dialog>",
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
        "<strong>Um modal sobre outro</strong> (ex.: um Dialog de confirmação aberto a partir de uma ActionBar, ou o contrário): só o de cima responde a <code>Esc</code> e <code>Tab</code>; cada <code>Esc</code> fecha um, de cima para baixo. O de cima continua usável mesmo sendo irmão do de baixo (que tinha deixado o resto da página inerte), e ao fechar volta a ser fundo dele.",
        "<strong><code>Esc</code> já tratado dentro do modal</strong> não fecha o modal: fechar um Select, TreeSelect ou Tooltip aberto dentro dele fecha só o painel.",
        "<strong>Backdrop:</strong> habilitado por padrão; pode ser desativado com <code>closeOnBackdrop=false</code>."
      ],
      "tokens": [
        "--accent",
        "--accent-fill",
        "--accent-text",
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
            "what": "Arquivos auxiliares",
            "items": [
              "<code>a11y/modal-session.ts</code>"
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
        "summary": "Depende só de <code>@angular/common</code>, <code>@angular/core</code>. Ao todo: 7 arquivos, ~717 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/dialog/dialog.md"
    },
    "en": {
      "lead": "Accessible, lightweight modal for confirmations and small forms. Built with <strong>Angular Standalone + HTML/Sass</strong>, no UI frameworks.",
      "why": [
        "A modal needs more than a box on top of the page: focus that moves in, stays trapped and returns to the button that opened it, <code>Esc</code> to close, an inert background for screen readers and a title tied to the dialog. Missing any of them leaves keyboard and screen reader users lost. This component does it on its own, with sizes and default actions."
      ],
      "useWhen": [
        "People must confirm an action before moving on (delete, discard changes).",
        "A small form that does not deserve its own page.",
        "The task has to be finished before going back to the rest of the screen."
      ],
      "preferOther": [
        "A longer form or review, beside the content: use the <a href=\"componentes/actionbar\">ActionBar</a>.",
        "Telling that something happened, without interrupting: use the <a href=\"componentes/toast\">Toast</a>.",
        "A short explanation about an element: use the <a href=\"componentes/tooltip\">Tooltip</a>."
      ],
      "example": "<button appButton type=\"button\" (click)=\"open = true\">Delete order</button>\n\n<app-dialog\n  title=\"Delete order?\"\n  [(opened)]=\"open\"\n  describedBy=\"delete-desc\"\n  primaryLabel=\"Delete\"\n  secondaryLabel=\"Cancel\"\n  (primary)=\"delete()\">\n  <p id=\"delete-desc\">This action cannot be undone.</p>\n</app-dialog>",
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
        "<strong>A modal over another</strong> (e.g. a confirmation Dialog opened from an ActionBar, or the other way around): only the top one answers <code>Esc</code> and <code>Tab</code>; each <code>Esc</code> closes one, top to bottom. The top one stays usable even as a sibling of the one below (which had made the rest of the page inert), and goes back to being its background when it closes.",
        "<strong>An <code>Esc</code> already handled inside the modal</strong> does not close it: closing a Select, TreeSelect or Tooltip open inside it closes just that panel.",
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
            "what": "Helper files",
            "items": [
              "<code>a11y/modal-session.ts</code>"
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
        "summary": "Depends only on <code>@angular/common</code>, <code>@angular/core</code>. In total: 7 files, ~717 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/dialog/dialog.en.md"
    }
  },
  "pagination": {
    "pt": {
      "lead": "Componente de <strong>paginação independente</strong> (não acopla à Tabela), pensado para funcionar tanto com <strong>fatiamento client-side</strong> quanto <strong>server-side</strong>. Visual em “bolhas”, setas laterais e controles acessíveis.",
      "why": [
        "Paginar parece só uma fileira de números, mas é preciso decidir quais páginas mostrar sem estourar a largura, desabilitar as setas nas pontas, marcar a página atual para o leitor de tela e funcionar igual com dados no navegador ou no servidor. Este componente cuida só da navegação: quem decide quais itens mostrar é a sua tela."
      ],
      "useWhen": [
        "Uma lista ou tabela longa demais para uma tela só.",
        "Os dados vêm do servidor em páginas.",
        "A pessoa precisa voltar a uma posição específica da lista."
      ],
      "preferOther": [
        "Listas curtas: mostre tudo, sem paginar.",
        "Dados em tabela: a <a href=\"componentes/table\">Table</a> já traz a paginação no rodapé."
      ],
      "example": "<app-pagination\n  [total]=\"42\"\n  [pageSize]=\"10\"\n  [pageIndex]=\"pageIndex\"\n  [maxVisible]=\"5\"\n  (pageChange)=\"pageIndex = $event\">\n</app-pagination>",
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
            "what": "Textos padrão",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.md\">Textos dos componentes</a>)"
            ]
          }
        ],
        "globals": [
          "@use '<sua-pasta>/shared/components/button/button' as *"
        ],
        "summary": "Depende só de <code>@angular/core</code>. Ao todo: 8 arquivos, ~773 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/pagination/pagination.md"
    },
    "en": {
      "lead": "A <strong>standalone pagination</strong> component (numeric bubbles + arrows). It <strong>doesn’t</strong> slice data; the <strong>container</strong> controls <code>pageIndex/pageSize</code> and passes the sliced array to whatever view (e.g., the Table).",
      "why": [
        "Pagination looks like a row of numbers, but it has to decide which pages to show without overflowing, disable the arrows at the ends, mark the current page for screen readers and work the same with data in the browser or on the server. This component only handles navigation: your screen decides which items to show."
      ],
      "useWhen": [
        "A list or table too long for one screen.",
        "Data comes from the server in pages.",
        "People need to go back to a specific position in the list."
      ],
      "preferOther": [
        "Short lists: show everything, without pages.",
        "Data in a table: the <a href=\"componentes/table\">Table</a> already has pagination in its footer."
      ],
      "example": "<app-pagination\n  [total]=\"42\"\n  [pageSize]=\"10\"\n  [pageIndex]=\"pageIndex\"\n  [maxVisible]=\"5\"\n  (pageChange)=\"pageIndex = $event\">\n</app-pagination>",
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
            "what": "Default texts",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md\">Component texts</a>)"
            ]
          }
        ],
        "globals": [
          "@use '<your-folder>/shared/components/button/button' as *"
        ],
        "summary": "Depends only on <code>@angular/core</code>. In total: 8 files, ~773 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/pagination/pagination.en.md"
    }
  },
  "radio": {
    "pt": {
      "lead": "Escolha <strong>única</strong> entre poucas opções visíveis. Construído sobre <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code> e <code>&lt;input type=&quot;radio&quot;&gt;</code> <strong>nativos</strong>, com os tokens de cor do Checkbox (<code>--cb-*</code>).",
      "why": [
        "Radios nativos já são acessíveis, mas o grupo precisa de <code>&lt;fieldset&gt;</code> com <code>&lt;legend&gt;</code>, um <code>name</code> em comum, erro ligado ao grupo e integração com formulários, e isso costuma ser esquecido. Este componente monta o grupo certo a partir de uma lista de opções, com o mesmo visual do Checkbox."
      ],
      "useWhen": [
        "A pessoa escolhe uma única opção entre poucas (até umas 5).",
        "Vale mostrar todas as opções de uma vez, para comparar."
      ],
      "preferOther": [
        "Muitas opções, ou pouco espaço: use o <a href=\"componentes/select\">Select</a>.",
        "Ligar ou desligar uma configuração: use o <a href=\"componentes/switch\">Switch</a>.",
        "Várias opções ao mesmo tempo: use o <a href=\"componentes/checkboxgroup\">Checkbox group</a>."
      ],
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
            "what": "Textos padrão",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.md\">Textos dos componentes</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depende só de <code>@angular/core</code>, <code>@angular/forms</code>. Ao todo: 6 arquivos, ~489 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/radio/radio-group.md"
    },
    "en": {
      "lead": "<strong>Single</strong> choice among a few visible options. Built on a <strong>native</strong> <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code> and <code>&lt;input type=&quot;radio&quot;&gt;</code>, using the Checkbox color tokens (<code>--cb-*</code>).",
      "why": [
        "Native radios are already accessible, but the group needs a <code>&lt;fieldset&gt;</code> with a <code>&lt;legend&gt;</code>, a shared <code>name</code>, an error tied to the group and form integration, and that is often forgotten. This component builds the right group from a list of options, with the same look as the Checkbox."
      ],
      "useWhen": [
        "People pick a single option among a few (up to about 5).",
        "Showing every option at once helps compare them."
      ],
      "preferOther": [
        "Many options, or little space: use the <a href=\"componentes/select\">Select</a>.",
        "Turning a setting on or off: use the <a href=\"componentes/switch\">Switch</a>.",
        "Several options at the same time: use the <a href=\"componentes/checkboxgroup\">Checkbox group</a>."
      ],
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
            "what": "Default texts",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md\">Component texts</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depends only on <code>@angular/core</code>, <code>@angular/forms</code>. In total: 6 files, ~489 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
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
        "Poucas opções que cabem na tela: use o <a href=\"componentes/radio\">Radio group</a>, que mostra tudo sem abrir nada.",
        "Opções em árvore (categorias e subcategorias): use o <a href=\"componentes/treeselect\">TreeSelect</a>.",
        "Ligar ou desligar uma configuração: use o <a href=\"componentes/switch\">Switch</a>."
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
              "<code>responsive</code>",
              "<code>'auto' | 'menu' | 'sheet'</code>",
              "<code>'auto'</code>",
              "<code>auto</code>: vira *sheet* (painel de baixo) até <code>sheetBreakpoint</code> px; <code>menu</code>/<code>sheet</code> fixam um dos dois."
            ],
            [
              "<code>sheetBreakpoint</code>",
              "<code>number</code>",
              "<code>560</code>",
              "Largura máxima (px) da janela para o modo *sheet* em <code>auto</code>."
            ],
            [
              "<code>hint</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Texto auxiliar abaixo do campo (quando não há erro)."
            ],
            [
              "<code>emptyMessage</code>",
              "<code>string</code>",
              "<code>labels.noOptions</code>",
              "Mensagem do painel sem opções (ex.: busca sem resultado), mostrada e anunciada."
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
        "<strong>Dica e erro</strong>: o botão aponta para a mensagem que está na tela (<code>aria-describedby</code>): o erro, quando há, senão a dica. Ao focar, o leitor de tela lê o motivo do erro, não só &quot;inválido&quot;.",
        "<strong>Lista</strong>: <code>role=&quot;listbox&quot;</code>, itens com <code>role=&quot;option&quot;</code> e <code>aria-selected</code>; a opção destacada é anunciada (<code>aria-activedescendant</code>). O filtro e o cabeçalho da folha ficam fora da lista (um listbox só contém opções e grupos); o filtro aponta para ela (<code>aria-controls</code>).",
        "<strong>Busca sem resultado</strong>: o painel mostra <code>emptyMessage</code> (<code>labels.noOptions</code>, &quot;No options found&quot; por padrão) e a mensagem é anunciada numa região <code>role=&quot;status&quot;</code>, sem tirar o foco do filtro.",
        "<strong>Rótulo</strong>: o <code>label</code> nomeia o botão (junto com o valor: &quot;Comida, Banana&quot;) e a lista (<code>aria-labelledby</code>). Ao abrir, o foco vai para a busca ou para a lista.",
        "Fecha com <strong>Escape</strong>, clique fora e ao selecionar.",
        "<strong>Menu e folha se comportam diferente</strong>, de propósito: - <strong>menu</strong> (popup sob o campo): fecha quando o foco sai do Select (<code>Tab</code>, clique em outro campo), sem roubar o foco de onde ele foi; - <strong>folha</strong> (celular, com fundo escurecido): é um <strong>modal</strong>. O resto da página fica inerte e sem rolagem, o <code>Tab</code> circula só dentro dela, e <strong>toda</strong> forma de fechar (×, tocar no fundo, <code>Esc</code>, escolher) devolve o foco ao campo.",
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
            "what": "Arquivos auxiliares",
            "items": [
              "<code>a11y/modal-session.ts</code>"
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
        "summary": "Depende só de <code>@angular/common</code>, <code>@angular/core</code>, <code>@angular/forms</code>. Ao todo: 7 arquivos, ~1191 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
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
        "A few options that fit on screen: use the <a href=\"componentes/radio\">Radio group</a>, which shows them all without opening anything.",
        "Options in a tree (categories and subcategories): use the <a href=\"componentes/treeselect\">TreeSelect</a>.",
        "Turning a setting on or off: use the <a href=\"componentes/switch\">Switch</a>."
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
              "<code>responsive</code>",
              "<code>'auto' | 'menu' | 'sheet'</code>",
              "<code>'auto'</code>",
              "<code>auto</code>: becomes a bottom *sheet* up to <code>sheetBreakpoint</code> px; <code>menu</code>/<code>sheet</code> force one of them."
            ],
            [
              "<code>sheetBreakpoint</code>",
              "<code>number</code>",
              "<code>560</code>",
              "Max window width (px) for the *sheet* mode in <code>auto</code>."
            ],
            [
              "<code>hint</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Helper text (when no error)."
            ],
            [
              "<code>emptyMessage</code>",
              "<code>string</code>",
              "<code>labels.noOptions</code>",
              "Message for a panel with no options (e.g. a search with no match), shown and announced."
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
        "<strong>Hint and error</strong>: the button points to the message on screen (<code>aria-describedby</code>): the error when there is one, otherwise the hint. On focus, screen readers read why it is invalid, not just &quot;invalid&quot;.",
        "<strong>List</strong>: <code>role=&quot;listbox&quot;</code>, items with <code>role=&quot;option&quot;</code> and <code>aria-selected</code>; the highlighted option is announced (<code>aria-activedescendant</code>). The filter and the sheet header sit outside the list (a listbox only holds options and groups); the filter points to it (<code>aria-controls</code>).",
        "<strong>Search with no match</strong>: the panel shows <code>emptyMessage</code> (<code>labels.noOptions</code>, &quot;No options found&quot; by default) and the message is announced in a <code>role=&quot;status&quot;</code> region, without moving focus from the filter.",
        "<strong>Label</strong>: <code>label</code> names the button (together with the value: &quot;Food, Banana&quot;) and the list (<code>aria-labelledby</code>). On open, focus moves to the search or the list.",
        "Closes on <strong>Escape</strong>, outside click and after selection.",
        "<strong>Menu and sheet behave differently</strong>, on purpose: - <strong>menu</strong> (popup under the field): closes when focus leaves the Select (<code>Tab</code>, clicking another field), without taking focus back; - <strong>sheet</strong> (phones, with a dimmed background): it is a <strong>modal</strong>. The rest of the page is inert and does not scroll, <code>Tab</code> cycles inside it only, and <strong>every</strong> way of closing it (×, tapping the background, <code>Esc</code>, picking) returns focus to the field.",
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
            "what": "Helper files",
            "items": [
              "<code>a11y/modal-session.ts</code>"
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
        "summary": "Depends only on <code>@angular/common</code>, <code>@angular/core</code>, <code>@angular/forms</code>. In total: 7 files, ~1191 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/select/select.en.md"
    }
  },
  "stepper": {
    "pt": {
      "lead": "Um <strong>componente de etapas</strong> leve e acessível, implementado em <strong>HTML + Sass</strong>, exposto como Angular <strong>Standalone</strong>. Sem dependência de UI framework.",
      "why": [
        "Um fluxo em etapas precisa mostrar onde a pessoa está, o que já foi feito e o que ainda falta, e isso também para quem usa leitor de tela (<code>aria-current=&quot;step&quot;</code>, etapas concluídas anunciadas). Também precisa impedir que alguém pule etapas sem passar pela validação. Este componente cuida da apresentação e da regra de clique; o conteúdo de cada etapa fica com você."
      ],
      "useWhen": [
        "Uma tarefa longa dividida em etapas que seguem uma ordem (cadastro, checkout).",
        "Uma etapa depende do que foi preenchido na anterior.",
        "A pessoa precisa ver quanto falta para terminar."
      ],
      "preferOther": [
        "Seções independentes, abertas em qualquer ordem: use as <a href=\"componentes/tabs\">Tabs</a>.",
        "Um formulário curto que cabe numa tela: não divida em etapas."
      ],
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
            "what": "Textos padrão",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.md\">Textos dos componentes</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depende só de <code>@angular/core</code>. Ao todo: 6 arquivos, ~543 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/stepper/stepper.md"
    },
    "en": {
      "lead": "An <strong>accessible, framework-free</strong> horizontal stepper built with <strong>plain HTML + Sass</strong> and exposed as a <strong>standalone Angular</strong> component. It supports active/done/disabled states, optional index/caption, and theme tokens via CSS variables.",
      "why": [
        "A step-by-step flow has to show where people are, what is done and what is left, for screen reader users too (<code>aria-current=&quot;step&quot;</code>, completed steps announced). It also has to stop people from skipping steps without passing validation. This component handles the display and the click rule; the content of each step stays with you."
      ],
      "useWhen": [
        "A long task split into steps that follow an order (sign-up, checkout).",
        "A step depends on what was filled in the previous one.",
        "People need to see how much is left."
      ],
      "preferOther": [
        "Independent sections, opened in any order: use the <a href=\"componentes/tabs\">Tabs</a>.",
        "A short form that fits on one screen: do not split it into steps."
      ],
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
            "what": "Default texts",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md\">Component texts</a>)"
            ]
          }
        ],
        "globals": [],
        "summary": "Depends only on <code>@angular/core</code>. In total: 6 files, ~543 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/stepper/stepper.en.md"
    }
  },
  "switch": {
    "pt": {
      "lead": "Liga/desliga para <strong>configurações que valem na hora</strong> (ex.: &quot;Notificações&quot;). Construído sobre <code>&lt;input type=&quot;checkbox&quot; role=&quot;switch&quot;&gt;</code> <strong>nativo</strong>, com os tokens de cor do Checkbox (<code>--cb-*</code>).",
      "why": [
        "Um checkbox comum não diz ao leitor de tela que a mudança vale na hora. O Switch usa o <code>&lt;input type=&quot;checkbox&quot;&gt;</code> nativo com <code>role=&quot;switch&quot;</code>, então é anunciado como &quot;ligado/desligado&quot;, funciona com Espaço e com formulários, e ganha o visual de chave com os tokens de cor do Checkbox."
      ],
      "useWhen": [
        "Uma configuração que vale assim que muda (notificações, modo escuro).",
        "Um único liga/desliga, sem botão de salvar."
      ],
      "preferOther": [
        "A escolha só vale ao enviar o formulário, ou é um aceite: use o <a href=\"componentes/checkbox\">Checkbox</a>.",
        "Mais de duas opções: use o <a href=\"componentes/radio\">Radio group</a>."
      ],
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
      "why": [
        "A plain checkbox does not tell screen readers that the change applies right away. The Switch uses the native <code>&lt;input type=&quot;checkbox&quot;&gt;</code> with <code>role=&quot;switch&quot;</code>, so it is announced as &quot;on/off&quot;, works with Space and with forms, and gets the switch look with the Checkbox color tokens."
      ],
      "useWhen": [
        "A setting that applies as soon as it changes (notifications, dark mode).",
        "A single on/off, with no save button."
      ],
      "preferOther": [
        "The choice only applies when the form is submitted, or it is an agreement: use the <a href=\"componentes/checkbox\">Checkbox</a>.",
        "More than two options: use the <a href=\"componentes/radio\">Radio group</a>."
      ],
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
        "Escolher um item para preencher um campo: use o <a href=\"componentes/select\">Select</a>.",
        "Escolher em dados hierárquicos: use o <a href=\"componentes/treeselect\">TreeSelect</a>."
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
              "<code>keyof T | (row, i) =&gt; K</code>",
              "—",
              "Identificador estável da linha. Com ele, <code>selected</code> guarda <strong>chaves</strong> e a seleção sobrevive a ordenação/paginação."
            ],
            [
              "<code>selected</code>",
              "<code>TableKey&lt;T, R&gt;[]</code>",
              "<code>[]</code>",
              "Seleção controlada: chaves (com <code>rowKey</code>) ou índices em <code>data</code> (sem <code>rowKey</code>). O tipo vem do <code>rowKey</code> (Tipo das chaves)."
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
              "<code>selectColWidth</code>",
              "<code>string | number</code>",
              "<code>36</code>",
              "Largura da coluna de seleção (checkbox); número = px."
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
              "<code>TableKey&lt;T, R&gt;[]</code> (chaves ou índices)",
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
              "<code>{ type: string; keys: TableKey&lt;T, R&gt;[] }</code>",
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
        },
        {
          "title": "Tipo das chaves",
          "head": [
            "<code>rowKey</code>",
            "Chaves",
            "Exemplo"
          ],
          "rows": [
            [
              "nome de propriedade",
              "o tipo dela",
              "<code>rowKey=&quot;id&quot;</code> com <code>id: number</code> → <code>number[]</code>"
            ],
            [
              "função",
              "o que ela devolve",
              "<code>[rowKey]=&quot;porEmail&quot;</code> com <code>(u) =&gt; string</code> → <code>string[]</code>"
            ],
            [
              "sem <code>rowKey</code>",
              "índices em <code>data</code>",
              "<code>number[]</code>"
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
        "summary": "Depende só de <code>@angular/common</code>, <code>@angular/core</code>. Ao todo: 24 arquivos, ~2904 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
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
        "Picking an item to fill a field: use the <a href=\"componentes/select\">Select</a>.",
        "Picking from hierarchical data: use the <a href=\"componentes/treeselect\">TreeSelect</a>."
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
              "<code>keyof T | (row, i) =&gt; K</code>",
              "—",
              "Stable row id. With it, <code>selected</code> holds <strong>keys</strong> and survives sorting/pagination."
            ],
            [
              "<code>selected</code>",
              "<code>TableKey&lt;T, R&gt;[]</code>",
              "<code>[]</code>",
              "Controlled selection: keys (with <code>rowKey</code>) or indices into <code>data</code> (without it). The type comes from <code>rowKey</code> (Key type)."
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
              "<code>selectColWidth</code>",
              "<code>string | number</code>",
              "<code>36</code>",
              "Width of the selection (checkbox) column; number = px."
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
              "<code>TableKey&lt;T, R&gt;[]</code> (keys or indices)",
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
              "<code>{ type: string; keys: TableKey&lt;T, R&gt;[] }</code>",
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
        },
        {
          "title": "Key type",
          "head": [
            "<code>rowKey</code>",
            "Keys",
            "Example"
          ],
          "rows": [
            [
              "property name",
              "its type",
              "<code>rowKey=&quot;id&quot;</code> with <code>id: number</code> → <code>number[]</code>"
            ],
            [
              "function",
              "what it returns",
              "<code>[rowKey]=&quot;byEmail&quot;</code> with <code>(u) =&gt; string</code> → <code>string[]</code>"
            ],
            [
              "no <code>rowKey</code>",
              "indices into <code>data</code>",
              "<code>number[]</code>"
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
        "summary": "Depends only on <code>@angular/common</code>, <code>@angular/core</code>. In total: 24 files, ~2904 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
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
        "Etapas em sequência, uma dependendo da outra: use o <a href=\"componentes/stepper\">Stepper</a>.",
        "Poucas opções que mudam um valor de formulário: use o <a href=\"componentes/radio\">Radio group</a>.",
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
      "lead": "<strong>WAI-ARIA</strong> tabs (<code>tablist</code> / <code>tab</code> / <code>tabpanel</code>) to switch between sections of the same screen.",
      "why": [
        "Tabs look simple, but getting the behavior right takes work: arrow keys switch tabs, only the open tab is in the Tab order, each tab points to its panel, disabled tabs are skipped and, with many tabs on a phone, the open one has to stay in view. This component solves it once, following WAI-ARIA, so you only declare the tabs."
      ],
      "useWhen": [
        "The sections belong to the same screen and can be opened in any order.",
        "People need to switch views without leaving the page.",
        "A section is heavy: with <code>appTabContent</code> it is only created when opened."
      ],
      "preferOther": [
        "Steps in sequence, one depending on the other: use the <a href=\"componentes/stepper\">Stepper</a>.",
        "A few options that set a form value: use the <a href=\"componentes/radio\">Radio group</a>.",
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
      "why": [
        "Avisos que aparecem e somem precisam ser anunciados pelo leitor de tela sem roubar o foco, empilhar sem se sobrepor, continuar clicáveis mesmo com um modal aberto e não depender de timers no servidor (SSR). Este componente separa a fila (um serviço com signals) da exibição (um container), então qualquer parte do app chama <code>toast.success(...)</code>."
      ],
      "useWhen": [
        "Confirmar que uma ação deu certo (salvo, enviado, copiado).",
        "Avisar de um erro que não impede de continuar.",
        "Oferecer uma ação rápida e opcional, como &quot;Desfazer&quot;."
      ],
      "preferOther": [
        "A pessoa precisa decidir algo antes de seguir: use o <a href=\"componentes/dialog\">Dialog</a>.",
        "Erro de um campo de formulário: mostre junto do campo (<a href=\"componentes/validation\">Formulários</a>).",
        "Informação que precisa ficar na tela: use um aviso fixo na página, não um toast que some."
      ],
      "example": "<app-toast-container></app-toast-container>",
      "api": [
        {
          "title": "Serviço (<code>ToastService</code>)",
          "head": [
            "Método",
            "Retorno",
            "Descrição"
          ],
          "rows": [
            [
              "<code>show(message, kind?, options?)</code>",
              "<code>number</code> (id)",
              "Mostra um toast. <code>kind</code> padrão <code>'info'</code>; <code>options</code> são os campos opcionais de <code>Toast</code> (<code>duration</code> padrão <code>4000</code> ms, <code>0</code> não fecha sozinho; <strong>com <code>actionLabel</code> o padrão é <code>0</code></strong>, para a ação não sumir antes de a pessoa chegar nela)."
            ],
            [
              "<code>success(message, options?)</code>",
              "<code>number</code>",
              "Atalho para <code>show(message, 'success', options)</code>."
            ],
            [
              "<code>error(message, options?)</code>",
              "<code>number</code>",
              "Atalho para <code>show(message, 'error', options)</code>; anunciado com <code>role=&quot;alert&quot;</code>."
            ],
            [
              "<code>info(message, options?)</code>",
              "<code>number</code>",
              "Atalho para <code>show(message, 'info', options)</code>."
            ],
            [
              "<code>warning(message, options?)</code>",
              "<code>number</code>",
              "Atalho para <code>show(message, 'warning', options)</code>."
            ],
            [
              "<code>dismiss(id)</code>",
              "<code>void</code>",
              "Fecha um toast pelo id."
            ],
            [
              "<code>clear()</code>",
              "<code>void</code>",
              "Fecha todos."
            ],
            [
              "<code>pause()</code> / <code>resume()</code>",
              "<code>void</code>",
              "Para / retoma o tempo de todos os toasts, de onde parou. O container já chama sozinho (mouse sobre um toast, foco na pilha); use se quiser pausar por outro motivo."
            ],
            [
              "<code>toasts</code>",
              "<code>Signal&lt;Toast[]&gt;</code>",
              "A pilha atual, do mais novo para o mais antigo (só leitura; no máximo 5)."
            ]
          ]
        }
      ],
      "a11y": [
        "<strong>Anúncio</strong>: duas regiões vivas invisíveis que existem desde o primeiro render (uma região criada junto com o texto costuma não ser lida): erros em <code>role=&quot;alert&quot;</code> (assertivo), o resto em <code>role=&quot;status&quot;</code> (educado). Cada toast é anunciado uma vez; a pilha visual não é região viva.",
        "<strong>Pilha</strong>: <code>&lt;section&gt;</code> com nome (<code>labels.notifications</code>) só enquanto tem toasts; não usa <code>&lt;nav&gt;</code>, porque não é navegação.",
        "<strong>Tempo</strong> (WCAG 2.2.1): com o mouse sobre um toast ou o foco dentro da pilha, o tempo de todos para e depois continua de onde estava. Toast com <code>actionLabel</code> não fecha sozinho, a menos que você passe <code>duration</code>.",
        "Botão de fechar com nome (<code>labels.close</code>, &quot;Close&quot; por padrão).",
        "Foco visível em botões de ação/fechar.",
        "Continua clicável com um Dialog aberto (o resto da página fica inerte)."
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
            "what": "Textos padrão",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.md\">Textos dos componentes</a>)"
            ]
          }
        ],
        "globals": [
          "@use '<sua-pasta>/shared/components/button/button' as *"
        ],
        "summary": "Depende só de <code>@angular/common</code>, <code>@angular/core</code>. Ao todo: 10 arquivos, ~849 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/toast/toast.md"
    },
    "en": {
      "lead": "A lightweight, accessible <strong>toast</strong> solution built from <strong>service + container</strong>. The <strong>service</strong> manages the queue (signals) and the <strong>container</strong> renders the stack. No UI framework.",
      "why": [
        "Messages that appear and go away have to be announced by screen readers without stealing focus, stack without overlapping, stay clickable even with a modal open and not rely on timers on the server (SSR). This component splits the queue (a service with signals) from the display (a container), so any part of the app calls <code>toast.success(...)</code>."
      ],
      "useWhen": [
        "Confirming that an action worked (saved, sent, copied).",
        "Warning about an error that does not block moving on.",
        "Offering a quick, optional action, like &quot;Undo&quot;."
      ],
      "preferOther": [
        "People must decide something before moving on: use the <a href=\"componentes/dialog\">Dialog</a>.",
        "A form field error: show it next to the field (<a href=\"componentes/validation\">Forms</a>).",
        "Information that must stay on screen: use a fixed notice on the page, not a toast that goes away."
      ],
      "example": "<app-toast-container></app-toast-container>",
      "api": [
        {
          "title": "Service (<code>ToastService</code>)",
          "head": [
            "Method",
            "Returns",
            "Description"
          ],
          "rows": [
            [
              "<code>show(message, kind?, options?)</code>",
              "<code>number</code> (id)",
              "Shows a toast. <code>kind</code> defaults to <code>'info'</code>; <code>options</code> are the optional <code>Toast</code> fields (<code>duration</code> defaults to <code>4000</code> ms, <code>0</code> never closes on its own; <strong>with <code>actionLabel</code> the default is <code>0</code></strong>, so the action does not vanish before the person reaches it)."
            ],
            [
              "<code>success(message, options?)</code>",
              "<code>number</code>",
              "Shortcut for <code>show(message, 'success', options)</code>."
            ],
            [
              "<code>error(message, options?)</code>",
              "<code>number</code>",
              "Shortcut for <code>show(message, 'error', options)</code>; announced with <code>role=&quot;alert&quot;</code>."
            ],
            [
              "<code>info(message, options?)</code>",
              "<code>number</code>",
              "Shortcut for <code>show(message, 'info', options)</code>."
            ],
            [
              "<code>warning(message, options?)</code>",
              "<code>number</code>",
              "Shortcut for <code>show(message, 'warning', options)</code>."
            ],
            [
              "<code>dismiss(id)</code>",
              "<code>void</code>",
              "Closes one toast by id."
            ],
            [
              "<code>clear()</code>",
              "<code>void</code>",
              "Closes all of them."
            ],
            [
              "<code>pause()</code> / <code>resume()</code>",
              "<code>void</code>",
              "Stops / resumes the time of every toast, from where it stopped. The container already calls them (pointer over a toast, focus in the stack); use them to pause for another reason."
            ],
            [
              "<code>toasts</code>",
              "<code>Signal&lt;Toast[]&gt;</code>",
              "The current stack, newest first (read-only; at most 5)."
            ]
          ]
        }
      ],
      "a11y": [
        "<strong>Announcements</strong>: two invisible live regions that exist from the first render (a region created together with its text is often not read): errors in <code>role=&quot;alert&quot;</code> (assertive), the rest in <code>role=&quot;status&quot;</code> (polite). Each toast is announced once; the visual stack is not a live region.",
        "<strong>Stack</strong>: a <code>&lt;section&gt;</code> named <code>labels.notifications</code> only while it has toasts; not a <code>&lt;nav&gt;</code>, since it is not navigation.",
        "<strong>Timing</strong> (WCAG 2.2.1): with the pointer over a toast or focus inside the stack, every timer stops and later continues from where it was. A toast with <code>actionLabel</code> does not close on its own unless you pass <code>duration</code>.",
        "Close button with a name (<code>labels.close</code>, &quot;Close&quot; by default).",
        "Visible focus styles for action/close buttons.",
        "Still clickable while a Dialog is open (the rest of the page is inert)."
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
            "what": "Default texts",
            "items": [
              "<code>labels/</code> (<a href=\"https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md\">Component texts</a>)"
            ]
          }
        ],
        "globals": [
          "@use '<your-folder>/shared/components/button/button' as *"
        ],
        "summary": "Depends only on <code>@angular/common</code>, <code>@angular/core</code>. In total: 10 files, ~849 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/toast/toast.en.md"
    }
  },
  "tooltip": {
    "pt": {
      "lead": "Dica curta sobre um elemento, mostrada ao <strong>passar o mouse</strong> ou <strong>focar pelo teclado</strong>. É uma diretiva: vai em qualquer elemento focável (<code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>, <code>appButton</code>...).",
      "why": [
        "O atributo <code>title</code> do navegador não abre pelo teclado, não pode ser estilizado e some sozinho. Uma dica acessível precisa abrir no foco de teclado, ser lida pelo leitor de tela, fechar com <code>Esc</code>, deixar o mouse chegar até ela e não ser cortada por <code>overflow: hidden</code>. Esta diretiva faz isso em qualquer elemento focável."
      ],
      "useWhen": [
        "Dar nome a um botão só com ícone.",
        "Uma explicação curta e opcional sobre um elemento.",
        "Explicar por que uma ação está indisponível."
      ],
      "preferOther": [
        "Informação essencial: deixe no texto da tela, porque no celular não existe &quot;passar o mouse&quot;.",
        "Conteúdo com links ou botões: use o <a href=\"componentes/dialog\">Dialog</a> ou o <a href=\"componentes/actionbar\">ActionBar</a>."
      ],
      "example": "<button appButton=\"ghost\" iconOnly type=\"button\" appTooltip=\"Editar\" tooltipAsLabel>\n  <svg aria-hidden=\"true\">…</svg>\n</button>",
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
              "<code>appTooltip</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Texto da dica. Vazio ou <code>null</code> desliga."
            ],
            [
              "<code>tooltipPosition</code>",
              "<code>'top' | 'bottom' | 'left' | 'right'</code>",
              "<code>'top'</code>",
              "Lado preferido. Sem espaço, vira para o oposto; o balão nunca sai da janela."
            ],
            [
              "<code>tooltipAsLabel</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "A dica é o nome do elemento (<code>aria-labelledby</code>), para botões só com ícone."
            ],
            [
              "<code>tooltipDisabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Desliga a dica sem apagar o texto."
            ],
            [
              "<code>tooltipShowDelay</code>",
              "<code>number</code> (ms)",
              "<code>300</code>",
              "Espera para abrir no mouse. Foco pelo teclado abre na hora; passando de uma dica para outra também."
            ],
            [
              "<code>tooltipHideDelay</code>",
              "<code>number</code> (ms)",
              "<code>100</code>",
              "Espera para fechar, dando tempo de levar o mouse até o balão."
            ]
          ]
        }
      ],
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
      "why": [
        "The browser's <code>title</code> attribute does not open from the keyboard, cannot be styled and disappears on its own. An accessible tooltip has to open on keyboard focus, be read by screen readers, close with <code>Esc</code>, let the mouse reach it and not be clipped by <code>overflow: hidden</code>. This directive does it on any focusable element."
      ],
      "useWhen": [
        "Naming an icon-only button.",
        "A short, optional explanation about an element.",
        "Explaining why an action is unavailable."
      ],
      "preferOther": [
        "Essential information: keep it in the screen text, since phones have no hover.",
        "Content with links or buttons: use the <a href=\"componentes/dialog\">Dialog</a> or the <a href=\"componentes/actionbar\">ActionBar</a>."
      ],
      "example": "<button appButton=\"ghost\" iconOnly type=\"button\" appTooltip=\"Edit\" tooltipAsLabel>\n  <svg aria-hidden=\"true\">…</svg>\n</button>",
      "api": [
        {
          "title": "Inputs",
          "head": [
            "Property",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>appTooltip</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Hint text. Empty or <code>null</code> turns it off."
            ],
            [
              "<code>tooltipPosition</code>",
              "<code>'top' | 'bottom' | 'left' | 'right'</code>",
              "<code>'top'</code>",
              "Preferred side. Without room it flips to the opposite one; the bubble never leaves the window."
            ],
            [
              "<code>tooltipAsLabel</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "The hint is the element's name (<code>aria-labelledby</code>), for icon-only buttons."
            ],
            [
              "<code>tooltipDisabled</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Turns the hint off without clearing the text."
            ],
            [
              "<code>tooltipShowDelay</code>",
              "<code>number</code> (ms)",
              "<code>300</code>",
              "Delay before opening on hover. Keyboard focus opens right away; so does moving from one hint to another."
            ],
            [
              "<code>tooltipHideDelay</code>",
              "<code>number</code> (ms)",
              "<code>100</code>",
              "Delay before closing, so the pointer can reach the bubble."
            ]
          ]
        }
      ],
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
      "why": [
        "Escolher numa lista com níveis (país → estado → cidade) é comum, e o <code>&lt;select&gt;</code> nativo não tem árvore. Montar uma à mão exige o padrão WAI-ARIA de tree (setas abrem e fecham níveis, foco num item só), checkbox com estado parcial para marcar grupos inteiros e carregar filhos só quando o nível é aberto. Este componente junta tudo e devolve só as keys."
      ],
      "useWhen": [
        "As opções têm níveis e a pessoa escolhe um nó, vendo o caminho até ele.",
        "Faz sentido marcar um grupo inteiro de uma vez (todos os estados de um país).",
        "A árvore é grande e os filhos devem ser buscados só quando o nível abre (<code>loadChildren</code>)."
      ],
      "preferOther": [
        "Lista sem níveis: use o <a href=\"componentes/select\">Select</a>.",
        "Um único sim/não: use o <a href=\"componentes/checkbox\">Checkbox</a>."
      ],
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
              "<code>autoValidate</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "Com <code>required</code>, mostra o erro de obrigatório ao fechar/sair vazio. <code>false</code> deixa a validação com o formulário (<code>error</code>)."
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
      "a11y": [
        "Com <code>filterable</code>, o foco abre na busca; <code>↓</code> leva para a árvore.",
        "<code>single</code>: o nó escolhido tem <code>aria-selected=&quot;true&quot;</code>. <code>checkbox</code>: cada nó tem <code>aria-checked</code> (<code>true</code>/<code>false</code>/<code>mixed</code>); a caixa visual é só decoração.",
        "Os chips são lidos como lista (&quot;Ver pedidos, Relatórios, +1&quot;).",
        "Carregando filhos: <code>aria-busy</code> na linha e anúncio numa região <code>role=&quot;status&quot;</code> (também para o erro).",
        "Busca sem resultado: a mesma região anuncia <code>emptyMessage</code>, sem tirar o foco da busca.",
        "Dica e erro: o campo aponta para a mensagem que está na tela (<code>aria-describedby</code>): o erro, quando há, senão a dica.",
        "Clique fora fecha.",
        "<strong>Menu e folha se comportam diferente</strong>, de propósito: - <strong>menu</strong> (popup sob o campo): fecha quando o foco sai do TreeSelect (<code>Tab</code>, clique em outro campo), sem roubar o foco de onde ele foi; - <strong>folha</strong> (celular, com fundo escurecido): é um <strong>modal</strong>. O resto da página fica inerte e sem rolagem, o <code>Tab</code> circula só dentro dela, e <strong>toda</strong> forma de fechar (×, tocar no fundo, <code>Esc</code>, escolher) devolve o foco ao campo."
      ],
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
            "what": "Arquivos auxiliares",
            "items": [
              "<code>a11y/modal-session.ts</code>"
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
        "summary": "Depende só de <code>@angular/core</code>, <code>@angular/forms</code>, <code>rxjs</code>. Ao todo: 13 arquivos, ~1798 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/tree-select/tree-select.md"
    },
    "en": {
      "lead": "A select whose options form a <strong>tree</strong>: pick one node (with its path in the field) or check whole groups with checkboxes. Built with <strong>Angular Standalone + HTML/Sass</strong>, no UI libraries.",
      "why": [
        "Picking from a list with levels (country → state → city) is common, and the native <code>&lt;select&gt;</code> has no tree. Building one by hand takes the WAI-ARIA tree pattern (arrows open and close levels, focus on a single item), checkboxes with a partial state to check whole groups, and loading children only when a level opens. This component puts it together and returns just the keys."
      ],
      "useWhen": [
        "Options have levels and people pick one node, seeing the path to it.",
        "Checking a whole group at once makes sense (every state of a country).",
        "The tree is large and children should be fetched only when a level opens (<code>loadChildren</code>)."
      ],
      "preferOther": [
        "A list without levels: use the <a href=\"componentes/select\">Select</a>.",
        "A single yes/no: use the <a href=\"componentes/checkbox\">Checkbox</a>."
      ],
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
              "<code>autoValidate</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "With <code>required</code>, shows the required error on close/blur when empty. <code>false</code> leaves validation to the form (<code>error</code>)."
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
      "a11y": [
        "With <code>filterable</code>, focus opens on the search; <code>↓</code> moves into the tree.",
        "<code>single</code>: the picked node has <code>aria-selected=&quot;true&quot;</code>. <code>checkbox</code>: each node has <code>aria-checked</code> (<code>true</code>/<code>false</code>/<code>mixed</code>); the visual box is decoration only.",
        "Chips are read as a list (&quot;View orders, Reports, +1&quot;).",
        "Loading children: <code>aria-busy</code> on the row and an announcement in a <code>role=&quot;status&quot;</code> region (also for errors).",
        "Search with no match: the same region announces <code>emptyMessage</code>, without moving focus from the search.",
        "Hint and error: the field points to the message on screen (<code>aria-describedby</code>): the error when there is one, otherwise the hint.",
        "Clicking outside closes it.",
        "<strong>Menu and sheet behave differently</strong>, on purpose: - <strong>menu</strong> (popup under the field): closes when focus leaves the TreeSelect (<code>Tab</code>, clicking another field), without taking focus back; - <strong>sheet</strong> (phones, with a dimmed background): it is a <strong>modal</strong>. The rest of the page is inert and does not scroll, <code>Tab</code> cycles inside it only, and <strong>every</strong> way of closing it (×, tapping the background, <code>Esc</code>, picking) returns focus to the field."
      ],
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
            "what": "Helper files",
            "items": [
              "<code>a11y/modal-session.ts</code>"
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
        "summary": "Depends only on <code>@angular/core</code>, <code>@angular/forms</code>, <code>rxjs</code>. In total: 13 files, ~1798 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/tree-select/tree-select.en.md"
    }
  },
  "validation": {
    "pt": {
      "lead": "Peças para formulários reativos (Angular Forms) que funcionam com todos os componentes da biblioteca (<code>app-select</code>, <code>app-tree-select</code>, <code>app-checkbox</code>, <code>app-radio-group</code>, <code>app-switch</code>) e com inputs nativos.",
      "why": [
        "Sem um lugar central, cada tela escreve as mensagens de erro de novo, valida CPF/CNPJ de um jeito diferente e, ao enviar, deixa a pessoa procurando o campo com problema. Estas peças juntam as mensagens num lugar só (e traduzidas), mostram todos os erros e focam o primeiro campo inválido no envio, e funcionam igual nos componentes da biblioteca e nos inputs nativos."
      ],
      "useWhen": [
        "Qualquer formulário reativo com validação.",
        "Campos de documento brasileiro (CPF, CNPJ, inclusive o alfanumérico).",
        "Campos com formato fixo que ficam mais claros com máscara (telefone, CEP)."
      ],
      "preferOther": [
        "Avisar o resultado do envio (salvo, falhou): use o <a href=\"componentes/toast\">Toast</a>.",
        "Validação que depende do servidor: faça a chamada e mostre o erro no campo com a mesma mensagem central."
      ],
      "example": "<form [formGroup]=\"form\" appFormValidation (validSubmit)=\"salvar($event)\">\n  <app-form-field label=\"Nome completo\" required [error]=\"form.controls.nome | fieldError\">\n    <input formControlName=\"nome\" autocomplete=\"name\">\n  </app-form-field>\n\n  <app-form-field label=\"CPF ou CNPJ\" required [error]=\"form.controls.doc | fieldError\">\n    <input appMask=\"cpfCnpj\" formControlName=\"doc\">\n  </app-form-field>\n\n  <app-form-field label=\"Telefone\">\n    <input appMask=\"phone\" formControlName=\"fone\" type=\"tel\">\n  </app-form-field>\n\n  <app-radio-group label=\"Plano\" required [options]=\"planos\" formControlName=\"plano\"\n                   [error]=\"form.controls.plano | fieldError\" />\n\n  <app-checkbox formControlName=\"termos\" required [error]=\"form.controls.termos | fieldError\">\n    Li e aceito os termos\n  </app-checkbox>\n\n  <button appButton type=\"submit\">Enviar</button>\n</form>",
      "api": [
        {
          "title": "<code>AppValidators</code>",
          "head": [
            "Validador",
            "Erro",
            "Regra"
          ],
          "rows": [
            [
              "<code>AppValidators.cpf()</code>",
              "<code>{ cpf: true }</code>",
              "11 dígitos e dígitos verificadores corretos"
            ],
            [
              "<code>AppValidators.cnpj()</code>",
              "<code>{ cnpj: true }</code>",
              "14 caracteres; numérico <strong>ou alfanumérico</strong>"
            ],
            [
              "<code>AppValidators.cpfOrCnpj()</code>",
              "<code>{ cpfCnpj: true }</code>",
              "11 caracteres → CPF; 14 → CNPJ"
            ]
          ]
        },
        {
          "title": "<code>appFormValidation</code> · Outputs",
          "head": [
            "Evento",
            "Payload",
            "Quando dispara"
          ],
          "rows": [
            [
              "<code>validSubmit</code>",
              "<code>form.getRawValue()</code>",
              "Formulário enviado e válido."
            ],
            [
              "<code>invalidSubmit</code>",
              "<code>void</code>",
              "Formulário enviado e inválido; o foco já foi para o primeiro campo com erro."
            ]
          ]
        },
        {
          "title": "<code>appMask</code> · Inputs",
          "head": [
            "Propriedade",
            "Tipo",
            "Padrão",
            "Descrição"
          ],
          "rows": [
            [
              "<code>appMask</code>",
              "<code>'cpf' | 'cnpj' | 'cpfCnpj' | 'phone' | 'cep' | 'date' | string</code>",
              "obrigatório",
              "Máscara pronta ou padrão próprio (<code>0</code> dígito, <code>A</code> letra, <code>*</code> letra ou dígito)."
            ],
            [
              "<code>unmask</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "O formulário recebe o valor sem máscara. Com <code>false</code>, recebe o texto formatado."
            ]
          ]
        },
        {
          "title": "Pipe <code>fieldError</code>",
          "head": [
            "Uso",
            "Retorno",
            "Descrição"
          ],
          "rows": [
            [
              "<code>control | fieldError</code>",
              "<code>string | null</code>",
              "Mensagem do primeiro erro (<code>required</code> antes dos outros), só depois que o campo foi tocado ou o formulário enviado."
            ]
          ]
        },
        {
          "title": "<code>app-form-field</code>",
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
              "Rótulo (ligado ao campo por <code>for</code>/<code>id</code>)."
            ],
            [
              "<code>required</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Mostra &quot;requerido&quot; e marca <code>aria-required</code>."
            ],
            [
              "<code>hint</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Texto de apoio (<code>aria-describedby</code>)."
            ],
            [
              "<code>error</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Erro: substitui a dica, deixa a borda vermelha e marca <code>aria-invalid</code>."
            ],
            [
              "<code>requiredLabel</code>",
              "<code>string</code>",
              "<code>labels.required</code>",
              "Texto do indicador (i18n)."
            ]
          ]
        }
      ],
      "a11y": [
        "O erro de cada campo fica ligado a ele por <code>aria-describedby</code> e o campo recebe <code>aria-invalid</code>, nos componentes da biblioteca e no <code>app-form-field</code>.",
        "As mensagens só aparecem depois que a pessoa sai do campo, para ninguém ser interrompido no meio da digitação.",
        "Ao enviar com erro, o foco vai para o primeiro campo inválido na ordem da tela (inclusive dentro do Select, do Radio group...), rolando até ele. Não há toast: o erro fica junto do campo.",
        "<code>app-form-field</code> liga rótulo e campo por <code>for</code>/<code>id</code> e marca <code>aria-required</code> quando obrigatório.",
        "<code>appMask</code> mantém o cursor no lugar ao editar e abre o teclado numérico no celular (<code>inputmode=&quot;numeric&quot;</code>) nas máscaras só de dígitos.",
        "Placeholder mostra só o formato e nunca substitui o rótulo; a cor tem contraste AA nos dois temas."
      ],
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
        "summary": "Depende só de <code>@angular/core</code>, <code>@angular/forms</code>. Ao todo: 12 arquivos, ~768 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/forms/forms.md"
    },
    "en": {
      "lead": "Pieces for reactive forms (Angular Forms) that work with every component of the library (<code>app-select</code>, <code>app-tree-select</code>, <code>app-checkbox</code>, <code>app-radio-group</code>, <code>app-switch</code>) and with native inputs.",
      "why": [
        "Without a central place, every screen writes its error messages again, validates CPF/CNPJ in a different way and, on submit, leaves people searching for the field with the problem. These pieces keep the messages in one place (and translated), show every error and focus the first invalid field on submit, and work the same with the library components and native inputs."
      ],
      "useWhen": [
        "Any reactive form with validation.",
        "Brazilian document fields (CPF, CNPJ, including the alphanumeric one).",
        "Fields with a fixed format that read better with a mask (phone, ZIP code)."
      ],
      "preferOther": [
        "Telling the submit result (saved, failed): use the <a href=\"componentes/toast\">Toast</a>.",
        "Validation that depends on the server: make the call and show the error on the field with the same central message."
      ],
      "example": "<form [formGroup]=\"form\" appFormValidation (validSubmit)=\"save($event)\">\n  <app-form-field label=\"Full name\" required [error]=\"form.controls.name | fieldError\">\n    <input formControlName=\"name\" autocomplete=\"name\">\n  </app-form-field>\n\n  <app-form-field label=\"CPF or CNPJ\" required [error]=\"form.controls.doc | fieldError\">\n    <input appMask=\"cpfCnpj\" formControlName=\"doc\">\n  </app-form-field>\n\n  <app-form-field label=\"Phone\">\n    <input appMask=\"phone\" formControlName=\"phone\" type=\"tel\">\n  </app-form-field>\n\n  <app-radio-group label=\"Plan\" required [options]=\"plans\" formControlName=\"plan\"\n                   [error]=\"form.controls.plan | fieldError\" />\n\n  <app-checkbox formControlName=\"terms\" required [error]=\"form.controls.terms | fieldError\">\n    I accept the terms\n  </app-checkbox>\n\n  <button appButton type=\"submit\">Submit</button>\n</form>",
      "api": [
        {
          "title": "<code>AppValidators</code>",
          "head": [
            "Validator",
            "Error",
            "Rule"
          ],
          "rows": [
            [
              "<code>AppValidators.cpf()</code>",
              "<code>{ cpf: true }</code>",
              "11 digits with correct check digits"
            ],
            [
              "<code>AppValidators.cnpj()</code>",
              "<code>{ cnpj: true }</code>",
              "14 characters; numeric <strong>or alphanumeric</strong>"
            ],
            [
              "<code>AppValidators.cpfOrCnpj()</code>",
              "<code>{ cpfCnpj: true }</code>",
              "11 characters → CPF; 14 → CNPJ"
            ]
          ]
        },
        {
          "title": "<code>appFormValidation</code> · Outputs",
          "head": [
            "Event",
            "Payload",
            "When"
          ],
          "rows": [
            [
              "<code>validSubmit</code>",
              "<code>form.getRawValue()</code>",
              "The form was submitted and is valid."
            ],
            [
              "<code>invalidSubmit</code>",
              "<code>void</code>",
              "The form was submitted and is invalid; focus already moved to the first invalid field."
            ]
          ]
        },
        {
          "title": "<code>appMask</code> · Inputs",
          "head": [
            "Input",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>appMask</code>",
              "<code>'cpf' | 'cnpj' | 'cpfCnpj' | 'phone' | 'cep' | 'date' | string</code>",
              "required",
              "Built-in mask or custom pattern (<code>0</code> digit, <code>A</code> letter, <code>*</code> letter or digit)."
            ],
            [
              "<code>unmask</code>",
              "<code>boolean</code>",
              "<code>true</code>",
              "The form receives the unmasked value. With <code>false</code>, it receives the formatted text."
            ]
          ]
        },
        {
          "title": "<code>fieldError</code> pipe",
          "head": [
            "Usage",
            "Returns",
            "Description"
          ],
          "rows": [
            [
              "<code>control | fieldError</code>",
              "<code>string | null</code>",
              "Message for the first error (<code>required</code> before the others), only after the field was touched or the form submitted."
            ]
          ]
        },
        {
          "title": "<code>app-form-field</code>",
          "head": [
            "Input",
            "Type",
            "Default",
            "Description"
          ],
          "rows": [
            [
              "<code>label</code>",
              "<code>string</code>",
              "<code>''</code>",
              "Label (linked to the field via <code>for</code>/<code>id</code>)."
            ],
            [
              "<code>required</code>",
              "<code>boolean</code>",
              "<code>false</code>",
              "Shows &quot;required&quot; and sets <code>aria-required</code>."
            ],
            [
              "<code>hint</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Helper text (<code>aria-describedby</code>)."
            ],
            [
              "<code>error</code>",
              "<code>string | null</code>",
              "<code>null</code>",
              "Error: replaces the hint, turns the border red and sets <code>aria-invalid</code>."
            ],
            [
              "<code>requiredLabel</code>",
              "<code>string</code>",
              "<code>labels.required</code>",
              "Indicator text (i18n)."
            ]
          ]
        }
      ],
      "a11y": [
        "Each field's error is tied to it with <code>aria-describedby</code> and the field gets <code>aria-invalid</code>, in the library components and in <code>app-form-field</code>.",
        "Messages only show up after people leave the field, so nobody is interrupted while typing.",
        "On an invalid submit, focus moves to the first invalid field in screen order (including inside the Select, the Radio group...), scrolling to it. No toast: the error stays next to the field.",
        "<code>app-form-field</code> ties label and field with <code>for</code>/<code>id</code> and sets <code>aria-required</code> when required.",
        "<code>appMask</code> keeps the caret in place while editing and opens the numeric keyboard on phones (<code>inputmode=&quot;numeric&quot;</code>) for digit-only masks.",
        "The placeholder only shows the format and never replaces the label; its color has AA contrast in both themes."
      ],
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
        "summary": "Depends only on <code>@angular/core</code>, <code>@angular/forms</code>. In total: 12 files, ~768 lines. CSS variables have defaults: the look works without this project's theme, which can still override them."
      },
      "source": "https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/forms/forms.en.md"
    }
  }
};
