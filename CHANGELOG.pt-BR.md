# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [3.12.1](https://github.com/AysllaGomes/angular-components/compare/v3.12.0...v3.12.1) (2026-11-24)
### Correções
- **menu:** com o primeiro item focado, Shift+Tab levava o foco ao botão mas
  deixava o menu aberto (`aria-expanded="true"`), e o Esc no botão não fechava.
  Agora Tab e Shift+Tab fecham e deixam o navegador mover o foco; Esc no botão
  fecha um menu aberto; clicar no botão continua só fechando (não fecha e
  reabre).
- **select, tree-select:** aberto numa janela larga e depois reduzido para
  celular, o painel virava folha mas não era modal: sem fundo inerte, sem travar
  a rolagem, e o `Tab` saía dela. Agora a sessão modal acompanha o modo com o
  painel aberto (folha liga, menu desliga sem mover o foco), e a folha devolve o
  foco ao campo.
- **form-field:** os listeners de `input` e `submit` nunca eram removidos;
  com campos em `@if` num formulário que fica na página, os de `submit` se
  acumulavam no formulário (5 para 1 campo vivo depois de 4 ciclos) e prendiam
  instâncias destruídas na memória. Agora saem ao trocar de campo e quando o
  componente é destruído.

### Interno
- **test:** cada correção tem um teste que falha com o código anterior
  (unitário), e os cenários relatados rodam no navegador: Shift+Tab no Menu, e
  Select e TreeSelect abertos no desktop com a janela virando celular.

## [3.12.0](https://github.com/AysllaGomes/angular-components/compare/v3.11.0...v3.12.0) (2026-11-24)
### Features
- **menu:** novo Menu: ações atrás de um botão, no padrão WAI-ARIA *menu
  button*. `app-menu` + `[appMenuTrigger]` + `appMenuItem` em `<button>`/`<a>`
  **nativos** (o seu `(click)`, `routerLink` e ícones continuam funcionando) +
  `appMenuSeparator`, importados com `MENU_IMPORTS`:
  - o botão ganha `aria-haspopup`, `aria-expanded` e `aria-controls`; Enter,
    Espaço e ↓ abrem no primeiro item, ↑ no último;
  - no menu: setas (dão a volta), Home/End, busca pela inicial, Espaço também em
    links; Esc fecha sem chegar a um Dialog por trás; Tab e clique fora fecham
    sem puxar o foco;
  - escolher um item fecha o menu e devolve o foco ao botão **antes** do
    `(click)` do item, então um Dialog de confirmação aberto pela ação devolve o
    foco ao botão quando fecha;
  - item desabilitado continua alcançável (`aria-disabled`; o `disabled` nativo
    é retirado de propósito) e não age; `tone="danger"` para ações destrutivas;
  - `position: fixed` junto ao botão: vira quando falta espaço, fica dentro da
    janela, rola quando é alto e não é cortado por `overflow` (ex.: dentro de
    uma tabela com rolagem); `placement` `bottom-start` | `bottom-end` |
    `top-start` | `top-end`.
- **site:** página do Menu com exemplo ao vivo, seção na demo (ações com
  confirmação e um menu por linha numa lista com rolagem), menu, catálogo da home
  (18 componentes), relatório do axe e entrada no "O que copiar".

### Interno
- **test:** specs unitários (teclado, foco, clique na fase de captura,
  `placeMenu`), axe fechado e aberto, testes de navegador (teclado real, foco
  passando para o Dialog e voltando, painel fora da lista com rolagem); os itens
  do menu entram na matriz de contraste.
- **lint:** `eslint-disable` sem uso agora também é erro nos templates.

## [3.11.0](https://github.com/AysllaGomes/angular-components/compare/v3.10.2...v3.11.0) (2026-11-24)
### Features
- **form-field:** o Campo de texto (`app-form-field`) vira um componente
  próprio, e continua envolvendo o `<input>`/`<textarea>`/`<select>` **nativo**
  (formulários, `appMask`, `type`, `autocomplete` seguem funcionando):
  - `counter`: "42/280" a partir do `maxlength` do campo, ligado por
    `aria-describedby` ("42 de 280 caracteres"); acompanha a digitação e os
    valores do formulário; perto do limite (`counterAnnounceAt`, padrão os
    últimos 20%) o leitor de tela ouve "Restam 5 caracteres" depois de 1 s de
    pausa, não a cada tecla;
  - `[ffPrefix]` / `[ffSuffix]`: texto ou ícone dentro da caixa, fora do
    valor; com texto ("R$", "kg"), também descreve o campo;
  - `passwordToggle`: botão com nome fixo ("Mostrar senha") e `aria-pressed`;
    a senha volta a ficar oculta quando o formulário é enviado;
  - `appAutosize` no `<textarea>`: cresce com o texto até N linhas (padrão 8)
    e depois rola; acompanha `setValue`/`reset` e a largura do campo;
  - a caixa (borda, anel de foco por `:focus-within`) passa do input para o
    `.ff__control`, para prefixo, sufixo e botão ficarem dentro dela;
  - textos novos `labels.formField` (`counter`, `remaining`, `showPassword`)
    no `provideUiLabels`.
- **site:** página "Campo de texto" com exemplo ao vivo, seção na demo, menu,
  catálogo da home (17 componentes) e relatório do axe; o "O que copiar" ganha
  entrada própria para ele, e a documentação de Formulários aponta para ela.

### Interno
- **test:** specs unitários (contador, prefixo/sufixo, senha, textarea que
  cresce), axe (prefixo/sufixo, senha visível e oculta, contador) e testes de
  navegador (textarea que cresce com layout de verdade, senha mantém o foco no
  botão, prefixo dentro da caixa).

## [3.10.2](https://github.com/AysllaGomes/angular-components/compare/v3.10.1...v3.10.2) (2026-11-24)
### Correções
- **select:** o rótulo do campo era um `<label>` sem controle (o campo é um
  botão, nomeado por `aria-labelledby`); agora é um `<div class="label">`, como
  no TreeSelect.

### Interno
- **ci:** lint com angular-eslint (`npm run lint`), primeiro passo do CI e antes
  de cada deploy: TypeScript (recommended + stylistic), templates Angular e
  acessibilidade nos templates. A biblioteca (`shared/`) precisa ser OnPush; as
  exceções ficam ao lado do código, com o motivo, e uma exceção que não se aplica
  mais vira erro.
- **refactor:** o que o lint apontou: `inject()` no lugar de injeção pelo
  construtor, `any` → `unknown` onde a API não muda (os genéricos públicos
  `T = any`, `validSubmit` e `ErrorMessage` ficam, com o motivo), imports sem
  uso e o motivo escrito de cada exceção de acessibilidade nos templates (fundos
  clicáveis que o Esc fecha, contêineres que delegam teclas, opções com
  `aria-activedescendant`).

## [3.10.1](https://github.com/AysllaGomes/angular-components/compare/v3.10.0...v3.10.1) (2026-11-24)
### Correções
- **dialog, actionbar:** confirmar num Dialog aberto sobre uma ActionBar fecha os
  dois na mesma atualização, e a página ficava com a rolagem travada (`overflow:
  hidden` no `body`) e o foco no `<body>`:
  - cada modal guardava e restaurava o `overflow` do body por conta própria, e um
    devolvia o `hidden` do outro; agora a pilha de modais guarda o valor original
    no primeiro e o devolve quando o último fecha;
  - um modal que fecha com outro ainda por cima não foca mais o fundo (inerte); o
    de cima herda o destino de foco dele, e o foco termina onde a sequência
    começou.
- **select, tree-select:** contrato de foco explícito para menu e folha:
  - **menu**: fecha quando o foco sai do componente, sem roubar o foco (o painel
    do Select ficava aberto depois do `Tab`);
  - **folha** (celular): é um modal, via `ModalSession`: fundo inerte e sem
    rolagem, `Tab` preso nela; o × e o fundo escurecido agora devolvem o foco ao
    campo (ia para o `<body>`), como o `Esc` e a escolha de uma opção;
  - o modo folha é recalculado ao abrir (mudar `responsive` depois do primeiro
    render não tinha efeito);
  - o "O que copiar" do Select e do TreeSelect passa a incluir
    `a11y/modal-session.ts`.
- **tema:** contraste de texto ≥ 4,5:1 com todas as cores de destaque e temas,
  também no hover:
  - relatado: branco sobre laranja nos botões sólidos, 3,21:1. Uma matriz nova no
    navegador achou mais: o hover do sólido clareava o fundo (nenhuma cor passava,
    2,76–4,18), laranja como texto no tema claro (outline/ghost/link, ação
    secundária do Dialog), a tinta no hover de outline/ghost (teal, azul, rose,
    violeta) e, no tema escuro, branco sobre os tons claros de neutral/danger
    (2,56/2,77) e a ação secundária do Dialog usando `--accent` em vez de
    `--accent-text`;
  - tokens novos `--accent-fill`, `--neutral-fill`, `--danger-fill` para fundos
    com texto branco (laranja `#A85A17`; no escuro, neutral `#475569` e danger
    `#b91c1c`), `--accent-text` laranja `#A85A17` no tema claro; o hover do
    sólido agora escurece, e o de outline/ghost aproxima o texto de `--fg`;
  - os valores padrão dos componentes também passam sem o tema (danger padrão
    `#b91c1c`).

### Interno
- **test:** matriz de contraste no navegador (`e2e/contrast.spec.ts`):
  claro/escuro × 5 cores × todo texto que usa a cor de destaque, com hover, no CI
  antes de publicar; e2e de fechar os dois modais (rolagem e foco) e do contrato
  de foco do Select/TreeSelect no celular (390px) e no desktop, com `Tab` real.
  Cada um conferido falhando com o código anterior.

## [3.10.0](https://github.com/AysllaGomes/angular-components/compare/v3.9.0...v3.10.0) (2026-11-24)
### Features
- **table:** o tipo das chaves da seleção agora vem do `rowKey`, sem escrever
  genéricos: `selected`, `selectedChange`, `bulkAction` e as funções de
  `TableBulkAction` usam o tipo da propriedade (`rowKey="id"` → `T['id']`), o
  retorno da função de `rowKey`, ou `number` (índices) sem `rowKey`; antes eram
  `any[]`, e um handler com tipo errado agora é erro de compilação:
  - pode revelar erros de tipo que estavam escondidos (ex.: `signal<number[]>`
    ligado a um `rowKey` cuja propriedade é texto);
  - no `appBulkActions`, `keys` continua `any[]` (o template não enxerga os
    tipos da tabela).
- **demo:** confirmação a partir da ActionBar: "Excluir pedido" no painel abre
  um Dialog de confirmação por cima dele.

### Correções
- **dialog, actionbar:** um modal aberto sobre outro (um Dialog de confirmação a
  partir de uma ActionBar, ou o contrário):
  - o de cima não podia ser usado: o de baixo deixa `inert` tudo fora dele,
    inclusive o de cima quando é irmão, que ficava sem foco nem clique; agora
    ele é reativado enquanto está aberto e volta a ser fundo ao fechar;
  - um `Esc` fechava os dois; agora só o modal de cima responde a `Esc` e
    `Tab`, um por vez, de cima para baixo;
  - o `Esc` que fecha um Select ou TreeSelect aberto dentro de um modal não
    fecha mais o modal junto;
  - o `Tab` traz de volta o foco que estiver fora do modal e pula elementos
    `inert`, `hidden` e desabilitados; o focus trap, duplicado no Dialog e na
    ActionBar, passou para a `ModalSession`.

### Interno
- **test:** testes de navegador com Playwright (`npm run e2e`), no CI e antes
  de cada deploy, no site servido como o GitHub Pages serve (sob
  `/angular-components/`, e sem o app fora dele, como o GitHub faz): navegação
  entre páginas de componente, página 404, Select sem resultado, foco e `inert`
  do Dialog, Dialog sobre ActionBar. Conferido que falham com o bug do link da
  3.8.1 e o de `inert` acima de volta.

## [3.9.0](https://github.com/AysllaGomes/angular-components/compare/v3.8.1...v3.9.0) (2026-11-24)
### Features
- **select:** busca sem resultado agora avisa: o painel mostra `emptyMessage` e
  a mensagem é anunciada numa região `role="status"`, sem tirar o foco do
  filtro; novo label `noOptions` no `provideUiLabels` ("No options found" /
  "Nenhuma opção encontrada").

### Correções
- **select:** o campo aponta para a mensagem que está na tela
  (`aria-describedby`: o erro, senão a dica), como os outros campos de
  formulário já faziam; o leitor de tela diz o motivo do erro, não só
  "inválido":
  - com `filterable`, a busca e o cabeçalho da folha ficavam dentro do
    `role="listbox"`, que só pode ter opções e grupos (axe
    `aria-required-children`); a lista agora é um elemento próprio, com o foco
    e o `aria-activedescendant`, e o filtro aponta para ela (`aria-controls`).
- **tree-select:** o mesmo `aria-describedby` para dica/erro, e a busca sem
  resultado é anunciada na região `role="status"` que já existia.
- **toast:** tempo e anúncios seguem o WCAG 2.2.1:
  - o tempo de todos os toasts para com o mouse sobre um toast ou o foco na
    pilha e continua de onde estava (novos `pause()`/`resume()` no serviço);
  - toast com `actionLabel` não fecha mais sozinho em 4 s (o `duration` padrão
    passa a ser `0`), a menos que você passe `duration`;
  - o anúncio vem de duas regiões vivas que existem desde o primeiro render
    (`status`, e `alert` para erros), uma vez por toast; a pilha virou
    `<section>`, com nome só quando tem toasts, em vez de `<nav>` com
    `aria-live`;
  - `toasts` é só leitura (`Signal<Toast[]>`), e os toasts que saem pelo
    limite de 5 não deixam timer para trás.
- **button:** um `<a appButton>` desabilitado ou ocupado ainda rodava o
  `(click)` e navegava com `routerLink`; o clique agora é barrado na fase de
  captura, antes de qualquer outro tratador do elemento.

### Interno
- **test:** specs de Toast (serviço e container), Button e FormField, que só
  tinham a checagem do axe; o axe também cobre o Select com erro e busca sem
  resultado (338 testes).

## [3.8.1](https://github.com/AysllaGomes/angular-components/compare/v3.8.0...v3.8.1) (2026-11-24)
### Correções
- **site:** links entre as páginas de componente não levam mais a um 404 no
  GitHub Pages:
  - os links que vêm da documentação (ex.: "Radio group" em "Prefira outro",
    na página do Select) apontavam para `/componentes/radio`, ignorando o
    base href `/angular-components/`; agora são relativos a ele, e o clique
    simples navega sem recarregar a página (Ctrl/clique do meio continuam
    abrindo nova aba);
  - o exemplo "Docs (link)" da demo do Button apontava para `/docs`, rota que
    não existe; agora abre a página do Button.
- **docs:** a documentação do Select (PT e EN) perde sobras editoriais ("componente
  enviado por você", "Novo:" no Clearable); a lista de ideias, com itens já
  feitos, vira "Limitações conhecidas" (sem carregamento remoto, sem virtual
  scroll, painel no fluxo da página).

### Interno
- **ci:** novo `npm run check:links`, depois do build no CI e no deploy: lê o
  site pré-renderizado e resolve cada link interno a partir do `<base href>`,
  como o navegador; falha em link que sai do site, página que não existe ou
  âncora ausente (teria pego os dois links acima).

## [3.8.0](https://github.com/AysllaGomes/angular-components/compare/v3.7.2...v3.8.0) (2026-11-23)
### Features
- **checkbox-group:** novo [`app-checkbox-group`](https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/components/checkbox-group/checkbox-group.md), o
  par do Radio group para várias opções: `fieldset`/`legend` e checkboxes
  nativos, a caixa do Checkbox, descrições, vertical/horizontal, dica e erro,
  integração com formulários:
  - o valor é uma lista, sempre na ordem das opções (não na dos cliques);
    valores que não estão entre as opções são mantidos;
  - "Selecionar todos" opcional (`selectAll`), com estado parcial, que não
    mexe nas opções desabilitadas; novo label `selectAll` no
    `provideUiLabels`;
  - `required` só mostra o marcador; valide com `Validators.required`, que
    trata a lista vazia como inválida;
  - no site: página própria com exemplo ao vivo, seção na demo, menu,
    catálogo da home e relatório do axe (16 componentes).

### Correções
- **docs:** entradas que faltavam na documentação agora estão documentadas:
  `responsive` e `sheetBreakpoint` do Select (a seção "Mobile" dizia que não
  havia props extras), `selectColWidth` da Tabela e `autoValidate` do
  TreeSelect:
  - Tabela: a seção "Largura da coluna de seleção" mandava usar o token
    `--tbl-select-w`, que o componente nunca usou, com o padrão errado; a
    largura vem de `selectColWidth` (36px).
- **copiar:** as listas "O que copiar" consideram os imports de todos os
  arquivos de uma pasta copiada, não só os do arquivo principal.

### Interno
- **ci:** novo `npm run check:api`, no CI e no deploy: todo input, model e
  output público precisa aparecer na documentação do componente, em PT e EN.

## [3.7.2](https://github.com/AysllaGomes/angular-components/compare/v3.7.1...v3.7.2) (2026-11-23)
### Correções
- **site:** as páginas de Acessibilidade e 404 usam a mesma largura do resto
  do site e se alinham com o cabeçalho (eram estreitas e centralizadas, com
  960px e 760px); só o que é leitura mantém um limite próprio:
  - Acessibilidade: texto até 44em e a tabela do relatório até 56rem; os
    números do topo usam a largura toda;
  - 404: o texto, o cartão "Você quis dizer" e o campo de busca ficam numa
    largura boa de ler; a grade de componentes usa a largura toda (7 por linha
    em telas de 1920px).

## [3.7.1](https://github.com/AysllaGomes/angular-components/compare/v3.7.0...v3.7.1) (2026-11-23)
### Correções
- **site:** o cabeçalho cabe em telas de 360px: abaixo de 480px as cores de
  destaque saem da barra e vão para o fim do menu ☰, com alvo de toque de
  28px (eram 18px):
  - as cores agora dizem qual está escolhida (`aria-pressed`) e têm o nome
    no idioma da página (eram "Teal", "Orange"... só em inglês);
  - o menu do celular não rola mais para o lado (os links passavam 11px).
- **docs:** os exemplos do Select e do Dialog não usam mais o pipe `| t` e
  as chaves do dicionário do site, que não existem no seu projeto; agora
  usam texto simples:
  - Select: a seção "i18n (chaves usadas)", que listava chaves do site, virou
    "Textos": de onde vem cada texto interno (`provideUiLabels`) e o input
    que troca numa instância;
  - Dialog: saem o bloco "Sugestão de chaves" e as classes de botão da demo.

## [3.7.0](https://github.com/AysllaGomes/angular-components/compare/v3.6.0...v3.7.0) (2026-11-23)
### Features
- **site:** todas as páginas de componente agora têm exemplo ao vivo: as 15,
  não só Tabs, Tabela e Select:
  - cada um reproduz o código de "Uso" que a aba "Código" mostra, no idioma
    da página;
  - Dialog e ActionBar vêm com o botão que os abre e uma linha de status
    depois de confirmar; o Toast tem botões de sucesso e de erro;
  - testado: todo componente do site tem exemplo, e cada um aparece na página
    e passa no axe.

### Interno
- **ci:** novo `npm run check:copy-compile`, no CI e no deploy: para cada
  componente, copia só o que "O que copiar" lista para uma pasta vazia e
  compila com TypeScript estrito, e confere que todo `templateUrl`/`styleUrl`
  veio junto, provando que a lista basta (~4 s para os 15).

## [3.6.0](https://github.com/AysllaGomes/angular-components/compare/v3.5.0...v3.6.0) (2026-11-23)
### ⚠ Caminhos que mudaram (se você já copiou componentes)
- os tipos públicos agora ficam junto de cada componente, em `<x>.types.ts`
  (ex.: `components/table/table.types.ts` com `ColumnDef`, `TableAction`,
  `TableBulkAction`...); a pasta `shared/model/` não existe mais.
- o `ToastService` foi para `components/toast/toast.service.ts`.

### Features
- **copiar:** copiar um componente ficou mais simples: cada pasta leva os
  próprios tipos, e as listas "O que copiar" encolheram (Tabela: de 33 para 24
  arquivos; Toast: de 13 para 10). O TreeSelect continua sendo copiado sem o
  Select.

### Correções
- **copiar:** as listas do Dialog e do ActionBar agora mostram
  `a11y/modal-session.ts` em "Arquivos auxiliares"; ele entrava na contagem
  mas não aparecia na lista, e sem ele o Dialog não compila.
- **site:** o estilo da página de componente voltou para dentro do orçamento
  de 5 kB (tinha passado 6 bytes na 3.5.0).

### Interno
- `src/app/shared/` é só a biblioteca (componentes, formulários, labels,
  a11y); as traduções, os serviços e o cabeçalho/rodapé do site foram para
  `src/app/site/`, e os tipos dos dados de exemplo da tabela da demo para
  `demo/sections/table/`.
- verificado: as listas de cópia da Tabela, TreeSelect, Dialog, Toast e
  Formulários compilam sozinhas numa pasta vazia.

## [3.5.0](https://github.com/AysllaGomes/angular-components/compare/v3.4.0...v3.5.0) (2026-11-23)
### Features
- **docs:** os outros 12 componentes ganharam "Por que existe" e "Quando usar",
  e as 15 páginas de componente ficam completas nos dois idiomas:
  - **Button:** documentação reescrita com Uso, Acessibilidade e a API
    completa, incluindo `block`, `iconOnly`, `busy` e `disabled`, que
    estavam na diretiva mas não no doc; corrige `variante=` no doc em PT;
  - **Dialog:** o exemplo não usa mais o pipe `| t` da demo e funciona em
    qualquer projeto;
  - **Pagination:** o doc em inglês ganhou o exemplo de uso independente;
  - **Forms:** novas seções de API e Acessibilidade; **Toast:** métodos do
    serviço em tabela; **Tooltip:** tabela de entradas sob `### Inputs`.
- **site:** cabeçalho, rodapé e todas as páginas têm a mesma largura (até
  1600px) e a mesma margem lateral (24px; 16px no celular); em telas largas
  sobra menos espaço vazio nas laterais, e o cabeçalho fica alinhado com o
  menu lateral.
- **site:** no desktop, o menu do topo fica logo ao lado de "Angular
  Components", e idioma, tema e cores ficam à direita.

### Interno
- o gerador das páginas usa a seção "Exemplos" quando não há "Uso", acha
  "acessibilidade" em qualquer posição do título, aceita `## API — <nome>`, e
  o resumo não pula mais parágrafos que começam em negrito.

## [3.4.0](https://github.com/AysllaGomes/angular-components/compare/v3.3.0...v3.4.0) (2026-11-23)
### Features
- **site:** cada componente tem a própria página em `/componentes/<id>` (os
  15, pré-renderizados): resumo, exemplo, por que existe, quando usar, API,
  acessibilidade, o que copiar e tokens de tema, com anterior/próximo:
  - Tabs, Tabela e Select estão completos, com exemplo ao vivo e o código lado
    a lado (o mesmo código da documentação, no idioma da página); os outros 12
    mostram o código e levam à demo, e se completam sozinhos quando a
    documentação ganhar "Por que existe" e "Quando usar";
  - as tabelas da API aparecem nas Tabs da própria biblioteca;
  - menu lateral por grupo (recolhido no celular), caminho e "Nesta página";
    um componente que não existe mostra a página 404.
- **a11y:** relatório real do axe por componente e estado, gravado pelos testes
  de acessibilidade a cada deploy e publicado junto com o site (versão do axe,
  data, commit e link do run no GitHub):
  - cada página de componente mostra "0 violações em N estados verificados",
    uma barra por estado (os números estão numa tabela de verdade; as barras
    só os desenham) e explica cada item que o axe não conseguiu decidir sozinho;
  - nova página de [Acessibilidade](https://aysllagomes.github.io/angular-components/acessibilidade):
    hoje **15 componentes, 25 estados, 0 violações**, com como é verificado,
    as regras desligadas nos testes e por quê, e o que o axe não vê;
  - sem o relatório, as páginas dizem isso em vez de mostrar números.
- **docs:** as páginas de componente são geradas dos `.md` (PT e EN), e a
  documentação continua sendo a única fonte; `npm run docs:pages` regenera e
  `npm run check:pages` falha no CI e no deploy quando ficam desatualizadas.
- **site:** o menu do topo agora reflete o site: **Componentes ▾** (os 4 grupos
  lado a lado, cada item levando à página dele), **Demo** e **Acessibilidade**,
  com a página atual marcada:
  - o menu não leva mais direto às seções da demo; cada página de componente
    tem "Ver na demo", e links como `/demo#table` continuam valendo.
- **site:** o catálogo da home ("Conhecer Tabela") e as sugestões da 404 agora
  levam às páginas de componente, e o rodapé leva à página de Acessibilidade.
- **labels:** novo texto `selectTitle` para o título da folha do Select no
  celular (era um `'Selecionar'` fixo); opcional no `provideUiLabels`.

### Correções
- **actionbar:** a folha é um `<div role="dialog">` em vez de `<aside>`, que
  não aceita esse papel.
- **select, treeselect:** o `aria-controls` só aponta para a lista enquanto ela
  está aberta (fechada, a lista não existe).

### Interno
- O deploy falha se as páginas de componente ou a de Acessibilidade não forem
  pré-renderizadas.

## [3.3.0](https://github.com/AysllaGomes/angular-components/compare/v3.2.0...v3.3.0) (2026-11-23)
### Features
- **components:** agora funcionam copiados para outro projeto, sem o
  `styles.sass` deste: toda variável CSS que usam tem valor padrão
  (`var(--x, valor)`, o valor do tema claro já resolvido), 268 usos em 18
  arquivos:
  - o tema global continua sobrescrevendo os padrões (claro/escuro, as 5
    cores); sem ele, os componentes mantêm o visual no teal padrão;
  - conferido no navegador com a folha global desligada: Switch, Radio, Tabela,
    Paginação e Stepper mantêm o visual;
  - `npm run check:css` falha se um componente usar variável sem padrão, e roda
    no CI e no deploy antes dos testes.
- **docs:** a documentação de cada componente tem a seção **O que copiar**,
  gerada a partir dos imports de verdade: a pasta dele, os componentes que ele
  usa (inclusive os indiretos, ex.: Tabela → Button pela Paginação), os tipos
  arquivo por arquivo, `labels/`, serviços, os estilos globais a acrescentar
  (Button, Tooltip) e o total:
  - `npm run docs:copy` regenera as seções; `npm run check:copy` falha no CI e
    no deploy quando alguma fica desatualizada;
  - conferido: os 33 arquivos listados para a Tabela compilam sozinhos numa
    pasta isolada, e tirar qualquer um faz falhar.
- **site:** o passo "Copie o componente" da home agora aponta para essa lista,
  em vez de dizer que todo componente vive na própria pasta.

### Interno
- Os chips da Tabela foram para um `app-table-chip` interno (mesmas classes
  `chip` / `chip--<variante>`), e o estilo da Tabela foi enxugado (tokens
  privados no `:host`, larguras mortas dos breakpoints removidas) para caber no
  orçamento de 5 kB com os novos padrões.

## [3.2.0](https://github.com/AysllaGomes/angular-components/compare/v3.1.0...v3.2.0) (2026-11-23)
### Features
- **site:** página 404 de verdade: endereços desconhecidos não caem mais na home
  sem aviso; a página diz o que aconteceu, mostra o endereço como foi digitado e
  oferece caminhos (início, demo):
  - "Você quis dizer…?": quando o endereço lembra um componente, leva à seção
    dele na demo; entende nomes em português e inglês e pequenos erros de
    digitação (`/tabla` → Tabela, `/dialgo` → Dialog), e fica quieta em
    endereços sem relação;
  - busca de componentes por nome ou apelido ("dica" encontra o Tooltip), com a
    quantidade anunciada ao leitor de tela e um aviso quando nada é encontrado;
  - um botão cheio por vez: com sugestão, "Ir para o início" vira secundário;
  - o título da aba acompanha o idioma, e a página pede aos buscadores para não
    ser indexada (`noindex`, retirado ao sair); o status HTTP 404 já vem do
    GitHub Pages;
  - conferida com axe (sem violações), com e sem sugestão.
- **site:** a lista de componentes (ids e apelidos) fica num lugar só,
  `src/app/site/site-components.ts`, usada pelo catálogo da home e pela 404.

## [3.1.0](https://github.com/AysllaGomes/angular-components/compare/v3.0.0...v3.1.0) (2026-11-23)
### Features
- **site:** home de apresentação na [raiz do site](https://aysllagomes.github.io/angular-components/):
  o que é o projeto, por que usar e como começar; a demo completa continua em
  `/demo` (links como `/demo#table` seguem valendo):
  - a home usa a própria biblioteca: a vitrine é a Tabela de verdade (seleção,
    ações em massa, colunas que se recolhem, paginação) e as duas visões ("Para
    quem vai usar" / "Como foi feito") são as Tabs da biblioteca;
  - "Em números" só afirma o que o repositório comprova (nenhuma dependência
    além do Angular, axe em cada componente, PT·EN, 2 temas × 5 cores) e evita
    um número exato de testes, que ficaria velho;
  - catálogo dos 15 componentes, com o nome de cada um no link para o leitor de
    tela; português e inglês, trocando ao vivo junto com os outros textos;
  - conferida com axe (sem violações) num teste novo, no claro/escuro e na
    largura de celular.
- **demo:** o cabeçalho é o mesmo nas duas páginas; a marca leva à home, e os
  links de seção clicados fora da demo vão para `/demo#seção` sem recarregar.

### Bug Fixes
- **demo:** seguir um link `/demo#seção` não esconde mais o título da seção atrás
  do cabeçalho fixo (a rolagem do roteador agora desconta a altura dele).
- **demo:** a sombra de rolagem do wrapper da tabela pintava o fundo inteiro e
  aparecia como uma faixa cinza no espaço guardado da barra de ações em massa;
  agora as sombras ficam só nas bordas.

### CI
- O deploy não grava mais na raiz uma página que redirecionava para `/demo/`: a
  raiz é a home pré-renderizada, o `404.html` é a casca sem pré-renderização, e
  o job falha se alguma das duas páginas não foi pré-renderizada.

## [3.0.0](https://github.com/AysllaGomes/angular-components/compare/v2.11.0...v3.0.0) (2026-11-23)
### ⚠ Mudanças incompatíveis
- **Os textos padrão dos componentes agora são em inglês.** Para manter tudo
  como na 2.x, uma linha na configuração do app: `provideUiLabels(UI_LABELS_PT)`.
- `provideFormErrorMessages` não aceita mais chaves do i18n da demo (ex.:
  `'form.error.cnpj'`); passe o texto (com `{{param}}`) ou uma função.

### Features
- **labels:** os componentes não dependem de nada além do Angular, nem de
  biblioteca de i18n: os textos próprios deles vêm de um lugar só, sem
  dependências, `src/app/shared/labels`:
  - pacotes `UI_LABELS_EN` (padrão) e `UI_LABELS_PT`; `provideUiLabels({...})`
    troca só o que nomear (os grupos podem vir pela metade);
  - `provideUiLabels(() => ...)` roda no contexto de injeção e pode devolver um
    signal, então os textos acompanham o idioma do app ao vivo;
  - os inputs de texto de cada componente (`emptyMessage`, `closeAriaLabel`,
    `rangeLabel`...) mantêm o nome e continuam vencendo, por instância;
  - textos que estavam fixos nos templates agora também são trocáveis: "Fechar"
    (Dialog, ActionBar, Toast), "Selecionar tudo"/"Selecionar linha" (Tabela),
    "Filtrar opções" (Select), "Notificações" (Toast);
  - as mensagens de erro de formulário (`fieldError`, `FormErrorsService`) vêm de
    `labels.formErrors`, e `provideFormErrorMessages` continua sobrescrevendo.
- **pagination:** não depende mais do i18n do projeto (`TPipe`), então pode ser
  copiada sozinha.

### Documentação
- Página nova [Textos dos componentes](src/app/shared/labels/labels.md) (PT/EN)
  com todos os textos, a ordem de prioridade e como migrar da 2.x; a coluna
  "Padrão" de cada componente agora aponta para `labels.*`; os READMEs ganham a
  seção "Textos e idiomas".

### Demo
- Continua bilíngue ligando o i18n dela ao `provideUiLabels` com um signal
  (`src/app/app.config.ts`); chaves `form.error.*` e da paginação que ficaram sem
  uso saíram do dicionário.

## [2.11.0](https://github.com/AysllaGomes/angular-components/compare/v2.10.0...v2.11.0) (2026-11-23)
### Features
- **table:** colunas que se recolhem: quando a tabela fica mais larga que o
  espaço disponível, ela esconde colunas pela `priority` do `ColumnDef` em vez
  de rolar na horizontal, e um botão "Mostrar detalhes" em cada linha abre os
  valores escondidos:
  - `priority` 1 (padrão) nunca some; maiores somem primeiro (empate: a mais à
    direita) e voltam na ordem inversa quando há espaço de novo;
  - a conta usa a largura da tabela (o wrapper), não a da tela, então também
    funciona dentro de um card estreito; tabelas sem `priority` não mudam, e o
    modo cartão (≤ 640px) continua mostrando todos os campos;
  - a linha de detalhes mostra "Rótulo: valor" das colunas escondidas, alinhada
    com a primeira coluna de dados; chips e células custom (`appCell`) aparecem
    como na coluna;
  - o botão tem `aria-expanded` e `aria-controls` (apontando para a linha de
    detalhes), e a coluna dele tem nome para leitor de tela; textos:
    `detailsLabel`, `expandLabel`;
  - no servidor (SSR) todas as colunas são renderizadas; o recolhimento começa
    no navegador, depois da primeira medida;
  - as listras das linhas agora vêm de uma classe, então a linha de detalhes
    mantém a cor da linha dela.

### Demo
- Colunas da tabela com prioridade: "Limite atribuído" some primeiro, depois
  "Nome impresso" e "Tipo"; "Nome" e "Documento" ficam sempre.

### Interno
- A lista de detalhes é um componente interno `app-table-detail`, e o estilo da
  Tabela foi enxugado (o botão de detalhes reaproveita o `.icon-btn`, regras de
  foco agrupadas, declarações sem efeito removidas) para caber no orçamento de
  5 kB por componente.

## [2.10.0](https://github.com/AysllaGomes/angular-components/compare/v2.9.0...v2.10.0) (2026-11-23)
### Features
- **table:** paginação integrada com `paginate`: rodapé com o intervalo
  ("Mostrando 1–5 de 6"), seletor opcional de itens por página e as páginas:
  - `'client'`: passe todas as linhas em `data` e a tabela mostra a fatia da
    página; ordenar volta para a primeira página e, se `data` encolher (ex.:
    exclusão na última página), a tabela corrige `pageIndex` (não enquanto
    `loading`);
  - `'server'`: `data` é a página atual e o total vem de `totalItems`; a tabela
    só emite `pageIndexChange`/`pageSizeChange`;
  - `[(pageIndex)]` e `[(pageSize)]` nos dois sentidos; `pageSizeOptions` mostra
    um `<select>` nativo e, ao trocar o tamanho, mantém na tela a primeira linha
    que estava visível;
  - o rodapé some com erro e sem linhas, o intervalo é anunciado ao leitor de
    tela e ele fica inteiro à vista quando a tabela rola na horizontal (a tabela
    mede a largura do wrapper);
  - com `paginate="client"`, o `index` de `(action)`, de `appCell`/`appActions`
    e da seleção por índice é a posição em `data`, não na página; tabelas sem
    `paginate` não mudam;
  - textos: `rangeLabel`, `pageSizeLabel`, `paginationLabel`.

### Demo
- A seção da tabela usa a paginação integrada (2/5/10 por página) em vez de
  fatiar e montar o rodapé à mão.

### CI
- Deploy do site separado nos jobs `build` e `deploy`: num job só, o
  `deploy-pages` às vezes procurava o artefato logo depois do upload e não
  achava (actions/deploy-pages#451), o que quebrou o deploy da v2.9.0.
- Actions atualizadas para as versões em Node 24 (checkout v7, setup-node v7,
  configure-pages v6, upload-pages-artifact v5, deploy-pages v5,
  action-gh-release v3), sem o aviso de Node 20 obsoleto.

## [2.9.0](https://github.com/AysllaGomes/angular-components/compare/v2.8.0...v2.9.0) (2026-11-23)
### Features
- **table:** ações em massa na seleção: com `selectable` e `[bulkActions]`, uma
  barra acima da tabela mostra o contador ("3 selecionados"), "Limpar seleção"
  e os botões; o clique emite `(bulkAction)` com `{ type, keys }`:
  - as chaves incluem linhas selecionadas em outras páginas (a seleção já
    atravessa páginas com `rowKey`); sem `rowKey`, índices em `data`;
  - `TableBulkAction`: `type`, `label`, `danger` (vermelho),
    `disabled`/`disabledReason` (continua focável com `aria-disabled`, motivo na
    dica);
  - *slot* `appBulkActions` (`keys`, `count`, `clear()`) substitui os botões; o
    contador e "Limpar seleção" continuam;
  - o contador é anunciado ao leitor de tela a cada mudança; quando os botões
    somem (seleção limpa), o foco vai para "Selecionar tudo", e não para o
    `<body>`;
  - a barra fica à vista quando o wrapper rola na horizontal (`position:
    sticky`; o host da tabela agora acompanha a largura dela com
    `min-width: min-content`);
  - textos: `bulkActionsLabel`, `selectedCountLabel`, `noSelectionLabel`,
    `clearSelectionLabel`.
- **table:** `bulkBarIdle` define o que a barra mostra sem seleção: `'space'`
  (padrão) não mostra nada mas guarda o espaço, então a tabela não pula ao
  marcar a primeira linha; `'hint'` mostra `noSelectionLabel`; `'hidden'` só
  aparece com seleção.

### Demo
- Ações em massa "Exportar" e "Excluir selecionados" (excluir fica indisponível
  quando a seleção tem correntistas, e remove as linhas de verdade), "Restaurar
  linhas (n)" e um botão que alterna os três modos de `bulkBarIdle`.

### Interno
- A barra é um componente interno `app-table-bulk-bar` com estilo próprio, o que
  mantém a Tabela dentro do orçamento de 5 kB de estilo por componente.

## [2.8.0](https://github.com/AysllaGomes/angular-components/compare/v2.7.0...v2.8.0) (2026-11-23)
### Features
- **table:** estado de erro: com `error`, a tabela mostra a mensagem no lugar das
  linhas e do "vazio", com ícone, anunciada ao leitor de tela (`role="alert"`):
  - precedência: carregando > erro > dados > vazio; não precisa limpar `error`
    antes de tentar de novo, a mensagem só volta se continuar preenchida quando
    `loading` terminar;
  - `retryLabel` (padrão "Tentar novamente") define o botão que emite `retry`;
    `null` esconde, para erros que não adianta repetir;
  - o foco não se perde ao tentar de novo: vai para a tabela enquanto carrega
    (`tabindex="-1"`, contorno só pelo teclado) e volta ao botão se falhar;
  - `aria-busy` na tabela enquanto carrega; "Selecionar tudo" fica desabilitado
    sem linhas visíveis (carregando, erro ou vazio); no modo cartão (celular) a
    mensagem ocupa o cartão todo.

### Demo
- Botão "Simular erro" na seção da tabela: a busca falha, "Tentar novamente"
  busca de novo e dá certo; a paginação some enquanto houver erro.

### Testes
- `npm run test:shuffle` roda os specs em ordem aleatória (eles compartilham o
  ambiente e o CI usa outra ordem); a semente aparece no início e `SEED=<n>`
  repete a ordem.
- **tooltip:** fake timers só para `setTimeout`, sem travar outros specs.

## [2.7.0](https://github.com/AysllaGomes/angular-components/compare/v2.6.0...v2.7.0) (2026-11-23)
### Features
- **tooltip:** nova diretiva `appTooltip`: dica curta ao passar o mouse ou focar
  pelo teclado:
  - como nome de botões só com ícone (`tooltipAsLabel` → `aria-labelledby`) ou
    como descrição (`aria-describedby`, mantendo os ids que já estavam lá); o
    balão existe desde o início (escondido), então é lido ao focar;
  - balão no `<body>` com `position: fixed`: não é cortado por `overflow`, vira
    para o lado oposto sem espaço, nunca sai da janela e a seta continua
    apontando para o elemento; acompanha rolagem e redimensionamento;
  - WCAG 1.4.13: Esc fecha sem mover o foco (e não fecha junto um Dialog por
    trás), dá para levar o mouse até o balão, fica aberto enquanto houver mouse
    ou foco;
  - foco por clique e toque não abrem; clicar no elemento fecha; um aberto por
    vez, e passando de uma dica para outra não há espera;
  - `tooltipPosition`, `tooltipDisabled`, `tooltipShowDelay`, `tooltipHideDelay`;
    tokens `--tip-*`, invertido no tema escuro, alto contraste e "reduzir
    movimento".
- **table:** os botões de ação mostram o nome numa dica; sem `label`/`ariaLabel`
  o nome padrão agora é em português (Editar, Excluir...), não o `kind`.
- **table:** `disabledReason`: ação desabilitada usa `aria-disabled` (continua
  focável, ignora o clique e não emite `action`) e a dica explica o motivo, ex.:
  "Excluir (correntistas só podem ser removidos pela agência)".

### Bug Fixes
- **table:** `visible()` das ações declarativas era ignorado e a ação aparecia
  sempre.
- **table:** o cabeçalho da coluna de ações não tinha nome para leitor de tela;
  novo input `actionsLabel` (padrão "Ações").

### Demo
- Nova seção Tooltip (barra de botões só com ícone, as quatro posições, ajuda ao
  lado de um texto, ação indisponível com `aria-disabled`) e a ação Excluir na
  tabela, indisponível para correntistas com o motivo na dica.

### Build
- Aviso de tamanho de estilo por componente de 4 kB para 5 kB (o erro continua em
  8 kB): a Tabela, o maior componente por causa do modo cards no celular, passou
  um pouco do limite.

## [2.6.0](https://github.com/AysllaGomes/angular-components/compare/v2.5.0...v2.6.0) (2026-11-19)
### Features
- **tabs:** novos `app-tabs` / `app-tab`: abas no padrão WAI-ARIA
  (tablist/tab/tabpanel):
  - teclado: Tab entra na aba aberta e vai para o painel; as setas trocam de aba
    (pulando as desabilitadas, com volta), Home/End;
  - `activation="manual"`: as setas só movem o foco, Enter/Espaço abrem a aba
    (para conteúdo custoso);
  - `[(selected)]` por chave, contador `badge` (lido como "Pedidos (3)"),
    rótulo próprio com ícone (`appTabLabel`), abas desabilitadas;
  - o conteúdo direto fica escondido (o estado é mantido); `<ng-template
    appTabContent>` só é criado ao abrir, e `keepAlive` o mantém depois da
    primeira visita;
  - muitas abas: a lista rola na horizontal sem rolar a página e mantém a aba
    aberta à vista (também depois de a fonte carregar ou o celular girar);
    tokens `--tabs-*`.
- **tree-select:** `loadChildren`: nós com `leaf: false` buscam os filhos ao
  serem abertos (Promise ou Observable); anel girando com `aria-busy` e anúncio
  para leitor de tela enquanto carrega; no erro, a mensagem aparece na linha e
  abrir de novo tenta outra vez; dá para marcar um grupo antes de carregá-lo.
- **tree-select:** `valueMode="summary"`: no checkbox, grupo com todas as folhas
  marcadas vira a key do grupo (em qualquer nível), com um chip por grupo; key de
  grupo vinda de fora marca o grupo inteiro.

### Bug Fixes
- **theme:** mensagens e bordas de erro (Select, TreeSelect, form-field, Checkbox,
  Radio) tinham contraste de 3,8:1 no tema claro; agora 6,5:1 (WCAG AA).

### Demo
- Nova seção Tabs (contador, ícone, aba desabilitada, ativação manual com conteúdo
  sob demanda, 12 meses rolando) e dois exemplos novos no TreeSelect: carregando
  de uma API simulada (a Bahia falha na primeira vez) e valor resumido.

## [2.5.0](https://github.com/AysllaGomes/angular-components/compare/v2.4.0...v2.5.0) (2026-11-19)
### Features
- **forms:** validação centralizada para formulários reativos, documentada em
  `src/app/shared/forms/forms.md`:
  - `AppValidators.cpf()`, `cnpj()` e `cpfOrCnpj()`: aceitam o valor com ou sem
    máscara e ignoram vazio (combine com `Validators.required`); o CNPJ aceita o
    formato **alfanumérico** (IN RFB 2.229/2024), ex.: `12.ABC.345/01DE-35`.
  - `FormErrorsService` + pipe `fieldError`: uma mensagem traduzida por tipo de
    erro (`required` primeiro), exibida depois que o campo é tocado; mensagens
    trocadas ou acrescentadas num lugar só com `provideFormErrorMessages()`
    (texto, chave do i18n ou função).
  - diretiva `appFormValidation`: no envio inválido mostra todos os erros e leva
    o foco ao primeiro campo inválido na ordem da tela, inclusive dentro dos
    componentes (Select, Radio...); no envio válido emite `validSubmit` com
    `getRawValue()`. Sem toast: toast fica para erros do back-end.
- **forms:** diretiva de máscara `appMask`: `cpf`, `cnpj`, `cpfCnpj` (vira CNPJ
  sozinha), `phone`, `cep`, `date` ou padrão próprio (`0` dígito, `A` letra, `*`
  alfanumérico); o formulário recebe o valor sem máscara, o cursor fica no lugar
  ao editar no meio e o celular abre o teclado numérico.
- **form-field:** novo `app-form-field`: rótulo, dica, erro e "requerido" em volta
  de um `<input>`/`<textarea>`/`<select>` nativo, ligados por `for`/`id`,
  `aria-describedby`, `aria-invalid` e `aria-required`; mesmo visual do Select.
- **select:** `required`, `disabled`, `filterable` e `clearable` aceitam o
  atributo sem valor (`<app-select required>`).

### Bug Fixes
- **theme:** o texto de placeholder (inputs, Select, TreeSelect) tinha contraste
  de 3:1 no tema claro; agora 5,5:1 (WCAG AA).

### Demo
- Nova seção "Validação de formulário": cadastro completo (nome, CPF/CNPJ,
  telefone, CEP, Select, Radio, Checkbox) com máscaras, placeholders de formato e
  o payload que o back-end recebe.

## [2.4.0](https://github.com/AysllaGomes/angular-components/compare/v2.3.0...v2.4.0) (2026-11-19)
### Features
- **radio:** novo `app-radio-group`: escolha única sobre `<fieldset>`/`<legend>` e
  radios nativos (Tab entra/sai do grupo, setas trocam a opção, pulando as
  desabilitadas); `description` por opção, `orientation` vertical/horizontal,
  obrigatório/dica/erro (`aria-invalid`), `formControl`/`ngModel`.
- **switch:** novo `app-switch`: checkbox nativo com `role="switch"` (anunciado
  como ligado/desligado); layout `labelFirst` para listas de configurações, dica,
  formulários; respeita "reduzir movimento".
- **stepper:** inputs `ariaLabel` (nome da navegação) e `doneLabel` (texto para
  leitor de tela nas etapas concluídas).
- **pagination:** input `ariaLabel`; o nome padrão agora vem do i18n
  ("Paginação"/"Pagination").

### Bug Fixes (acessibilidade)
Encontrados pela nova checagem automática (axe-core):
- **stepper:** fingia ser abas (`tablist`/`tab`, `aria-selected`), com papéis em
  lugares errados e `aria-valuenow` num `<nav>`. Agora é uma navegação nomeada com
  lista ordenada; a etapa atual tem `aria-current="step"`.
- **table:** cabeçalhos ordenáveis eram `<th role="button">` com `aria-sort`
  (inválido). O `<th>` continua cabeçalho de coluna com `aria-sort` e um
  `<button>` de verdade dentro dele ordena.
- **select:** a lista de opções não tinha nome acessível e o rótulo não era lido
  com o campo ("Banana, botão" → "Comida, Banana").
- **pagination:** removido o `role="list"` envolvendo botões; o nome era fixo em
  inglês e igual em todas as paginações da página.

### Tests
- Checagem automática de acessibilidade com axe-core em todos os componentes, nos
  estados que importam (aberto, com erro, desabilitado...), rodando no
  `npm run test:ci` e no CI.

### Demo
- Menu do cabeçalho agrupado por categoria (Formulário, Dados, Sobreposições,
  Navegação e ações) no padrão WAI-ARIA de "disclosure navigation"; menu compacto
  (☰) abaixo de 1024px, sem a rolagem lateral que ele causava.
- Novas seções Radio group e Switch; link da demo no README corrigido (apontava
  para um site antigo) e seção de Qualidade.
- Os runs do CI ganharam títulos legíveis ("Deploy do site · …", "Release v…",
  "CI · branch").

## [2.3.0](https://github.com/AysllaGomes/angular-components/compare/v2.2.0...v2.3.0) (2026-11-19)
### Features
- **checkbox:** novo `app-checkbox`: checkbox acessível com estado **parcial**
  (indeterminado), feito sobre um `<input type="checkbox">` nativo (teclado,
  clique no rótulo e anúncio de "parcialmente marcado" de graça).
  `[(checked)]`/`[(indeterminate)]`, `formControl`/`ngModel` (use
  `Validators.requiredTrue`), `hint`/`error` com `aria-describedby`/`aria-invalid`;
  tokens `--cb-*` para tema claro/escuro.
- **checkbox:** novo `app-checkbox-mark`: só a caixa visual
  (desmarcado/marcado/parcial), decorativa (`aria-hidden`), para desenhar
  checkboxes dentro de outros componentes.
- **tree-select:** novo `app-tree-select`: select cujas opções formam uma árvore.
  - Modo `single`: valor = key do nó; o campo mostra o caminho ("Brasil › São
    Paulo › Campinas"); qualquer nó pode ser escolhido, ou só folhas com `leafOnly`.
  - Modo `checkbox`: valor = keys das **folhas** marcadas, na ordem da árvore;
    marcar um grupo marca as folhas habilitadas, grupo parcial mostra "−"
    (`aria-checked="mixed"`) e clicar nele completa o grupo; com busca ativa, só as
    folhas visíveis são afetadas; chips com "+N" no campo.
  - Busca sem acento/caixa, teclado no padrão WAI-ARIA de árvore (setas,
    Home/End, Enter/Espaço, letras, Esc, Tab), `expandedKeys`, limpar,
    obrigatório/erro/dica, *sheet* no mobile, formulários.

### Bug Fixes
- **select:** abrir o painel agora foca a busca ou a lista de opções. Antes o foco
  caía no `<body>`: era preciso clicar no filtro, e sem filtro o teclado não
  navegava pela lista (`↓`/`Enter` só funcionavam com o mouse).
- **demo:** os links do cabeçalho não recarregam mais a página no GitHub Pages: com
  `<base href>`, `#secao` apontava para outra página; agora rolam na própria
  página, atualizam o # e movem o foco. "Pular para o conteúdo" e a marca passaram
  a ter alvo.

### Demo
- Novas seções Checkbox e TreeSelect (PT/EN); links do cabeçalho mais compactos e
  menu compacto (☰) abaixo de 1120px, para os links caberem numa linha.

## [2.2.0](https://github.com/AysllaGomes/angular-components/compare/v2.1.0...v2.2.0) (2026-11-19)
### Features
- **dialog:** **foco devolvido**: ao fechar (botão, `Esc`, backdrop ou
  `opened=false`), o foco volta ao elemento que estava focado antes de abrir,
  normalmente o botão que abriu.
- **dialog:** **fundo inerte**: enquanto aberto, o resto da página recebe `inert`
  (sem foco, clique ou leitor de tela); ao fechar, só o que o dialog marcou é
  liberado.
- **actionbar:** o mesmo comportamento modal do Dialog: foco devolvido, fundo
  inerte e, novidade no ActionBar, rolagem da página travada enquanto aberto.
- **toast:** o `app-toast-container` vem com `data-dialog-keep-active`, então os
  avisos continuam sendo anunciados e podem ser fechados com um Dialog/ActionBar
  aberto. Qualquer elemento pode ficar fora do fundo inerte com esse atributo.
- **pagination:** input `showFirstLast` com os botões « Primeira / Última »,
  desabilitados nas pontas.
- **pagination:** atalhos de teclado: `←`/`→` página anterior/próxima,
  `Home`/`End` primeira/última. O foco acompanha o botão da página atual (no modo
  compacto, a seta habilitada mais próxima), sem se perder quando a janela de
  números desliza ou uma seta desabilita.

### Changed
- Dialog e ActionBar compartilham a lógica modal em
  `src/app/shared/a11y/modal-session.ts`.

### Documentation
- Documentação do Dialog, ActionBar e Paginação descreve os novos
  comportamentos; itens do roadmap marcados. Corrigidos: limite do tamanho `auto`
  do ActionBar (436px) e a nota da Paginação em inglês que dizia que ela só
  aparece com mais de uma página.

## [2.1.0](https://github.com/AysllaGomes/angular-components/compare/v2.0.0...v2.1.0) (2026-11-19)
### Features
- **dialog:** novo input `describedBy`, ligado ao `aria-describedby` (um id ou
  vários separados por espaço); leitores de tela leem esse texto junto com o
  título ao abrir. Vazio/`null` não gera o atributo.
- **select:** **typeahead**: com o campo focado e fechado, digitar escolhe a
  opção sem abrir o painel (como no `<select>` nativo); com o painel aberto, move
  o destaque. Repetir a letra alterna entre as opções com essa inicial; ignora
  acentos e maiúsculas, pula opções desabilitadas e recomeça após 500 ms.
- **select:** **grupos de opções**: campo opcional `group` em `SelectOption`;
  opções do mesmo grupo aparecem juntas sob um título (`role="group"`), na ordem
  em que o grupo aparece primeiro. Opções desabilitadas agora têm `aria-disabled`.
- **pagination:** **modo compacto**: o input `compact` mostra "Página X de Y"
  entre as setas no lugar dos números; `compact="auto"` faz isso só em telas de
  até 420px (só CSS, funciona com SSR). O texto usa `aria-live="polite"`.
- **stepper:** variáveis CSS `--stepper-label-size`, `--stepper-caption-size` e
  `--stepper-color-label-active` para tema local.
- **theme:** token `--accent-text` (destaque usado como texto/borda, mais claro
  no tema escuro) e `color-scheme` por tema, para checkboxes e barras de rolagem
  nativas acompanharem.

### Bug Fixes
- **stepper:** sem barra de rolagem dentro do componente; os conectores ligam o
  centro dos círculos; rótulos longos quebram linha em vez de vazar; em telas de
  até 560px aparecem só os círculos e o rótulo da etapa ativa (os demais
  continuam disponíveis para leitores de tela); as legendas somem de fato até 720px.
- **theme:** contraste no tema escuro: Button (fantasma/contornado/link), rótulos
  do Stepper, linhas/chips/skeleton/ações da Tabela e Paginação não usam mais
  cores claras fixas.
- **table:** o ícone padrão da ação `edit` (caixa com caneta) segue a cor de
  destaque (`currentColor`), sem precisar de SVG externo.
- **table:** nos cards do mobile, rótulo e valor ficam sempre alinhados à
  esquerda, independentemente do alinhamento da coluna.
- **dialog, actionbar:** o elemento não ocupa espaço no layout quando fechado.
- **select:** o botão de limpar (×) não reserva espaço quando está oculto.

### Demo
- Layout responsivo que cabe em telas de 390px, cards e espaçamentos iguais em
  todas as seções, fonte **Inter** carregada de fato e controles de formulário
  herdando a fonte da página.
- Novos exemplos: Select com grupos e typeahead, Paginação compacta; exemplo
  "Compacto" do Stepper e botão "Avançar" corrigidos.
- Textos e rótulos corrigidos, ícones coerentes com as ações, rodapé, botões do
  Toast no tema escuro e linha da Paginação no mobile.

### Documentation
- Roadmaps do Dialog e da Tabela alinhados ao código (itens marcados como feitos
  que não existiam foram desmarcados); padrão do `size` do Dialog documentado
  como `'md'`, incluindo `'xl'`.

## [2.0.0](https://github.com/AysllaGomes/angular-components/compare/v1.8.0...v2.0.0) (2026-11-18)
### ⚠ Breaking Changes
- **Angular 22 passa a ser obrigatório** (antes Angular 20). Os componentes usam
  APIs e a semântica de templates da v22.
- **Node 24 é o runtime suportado** (`.nvmrc`); o Node 20 está fora de suporte.

### Changed
- Angular atualizado 20.2 → 20.3 → 21 → 22.3, com TypeScript 6.
- Migrações da v22: componentes da demo e dos testes declaram
  `ChangeDetectionStrategy.Eager` (os da biblioteca já eram `OnPush`); a
  hidratação mantém `withNoIncrementalHydration()`.
- Testes unitários rodam no **Vitest** (jsdom) em vez de Karma/Jasmine: mais
  rápidos e o CI não precisa mais de navegador.
- Ferramenta de release: `standard-version` (descontinuado) substituído por
  `commit-and-tag-version`, com os mesmos comandos.

### Security
- **SSR:** validação de host ativada (`security.allowedHosts`: `localhost`,
  `127.0.0.1`); requisições com cabeçalho `Host` desconhecido recebem `400`
  (proteção contra SSRF do Angular 22).
- **SSR:** cabeçalhos `X-Forwarded-*` não são confiáveis (sem `trustProxyHeaders`);
  veja o comentário em `src/server.ts` antes de publicar atrás de um proxy.
- `path-to-regexp` (alta, usado pelo Express) corrigido; a remoção do Karma e do
  `standard-version` eliminou os alertas restantes: `npm audit` com
  **0 vulnerabilidades**.

### Migration Notes
- Atualize sua aplicação para o Angular 22 (`ng update @angular/core@22 @angular/cli@22`,
  uma versão principal por vez) antes de usar a 2.0.0.
- As APIs dos componentes não mudaram desde a 1.8.0: inputs, outputs e two-way
  bindings funcionam igual.
- Para rodar o servidor SSR num host público: adicione-o em `security.allowedHosts`
  no `angular.json` ou defina `NG_ALLOWED_HOSTS`.
- Testes: `npm test` / `npm run test:ci` agora usam o Vitest; matchers exclusivos do
  Jasmine (`toBeTrue`, `jasmine.createSpy`, …) não existem mais.

## [1.8.0](https://github.com/AysllaGomes/angular-components/compare/v1.7.0...v1.8.0) (2026-11-18)
### Added
- **Select** integrado ao Angular Forms via `ControlValueAccessor`: funciona com
  `formControl`, `formControlName` e `[(ngModel)]` (valor, `dirty`, `touched`,
  `disable()`/`enable()`); nova demo com Reactive Forms e seção nos docs.
- `<html lang>` acompanha o idioma atual.

### Changed
- Todos os componentes usam as APIs de signals: `input()`, `model()`, `output()`,
  `viewChild()`/`contentChild()`; `linkedSignal` para estados que seguem um input
  mas mudam internamente (valor do Select, seleção/ordenação da Tabela).
- Templates migrados para o control flow nativo (`@if`/`@for`/`@switch`) com
  chaves de `track` explícitas (linhas da Tabela usam o `rowKey`).
- `size="auto"` do Dialog/ActionBar agora é um `effect` que desliga o
  `ResizeObserver` automaticamente.
- `index.html`: título, `lang="pt-BR"` e meta description.
- CI e deploy rodam no Node 24 (lido do `.nvmrc`) com cache do npm.

### Fixed
- Tema: sem “piscada” do tema claro ao carregar com SSR; tema, cor de destaque e
  idioma salvos são aplicados antes da primeira pintura.
- Select: `[error]` passa a atualizar após a primeira renderização; fechar o
  painel pelo botão marca o campo como tocado e valida.
- Select: estilos de volta abaixo do limite de 4 kB (build sem avisos).
- Tabela: skeleton sem chaves de `track` duplicadas; botões de ação não são mais
  recriados a cada detecção de mudanças.

### Migration Notes
- Templates não precisam de mudanças: `[(opened)]`, `[(value)]`, `(selectedChange)`,
  `(sortChange)` etc. continuam funcionando.
- Código que acessava a instância dos componentes (via `#ref` ou `viewChild`) pode
  precisar de ajuste: `open` do Dialog/ActionBar agora é `opened` (um `model()`),
  o `variant` do `appButton` virou signal (`variant()`) e as referências internas
  de elementos ficaram privadas.
- `valueChange` do Select é tipado como `T | null` (limpar já emitia `null`).

## [1.7.0](https://github.com/AysllaGomes/angular-components/compare/v1.6.0...v1.7.0) (2026-11-18)
### Added
- **Dialog**: modal acessível com título, conteúdo e ações primária/secundária;
  tamanhos `sm`/`md`/`lg`/`xl`/`auto`, focus trap, fechamento por ESC/backdrop,
  slot `[dialog-actions]`; docs PT/EN.
- `appButton` (ButtonDirective) com variantes `solid|outline|ghost|link`,
  tons `accent|neutral|danger` e tamanhos `xs|sm|md|lg`.
- Tokens globais de botão: `--neutral`, `--danger`.
- Paginação: prev/next com `variant="ghost"`.
- ActionBar: controle do tamanho `auto`.
- **Tabela**: seleção por chave estável via `rowKey`; a seleção sobrevive a
  ordenação, paginação e filtros, e “selecionar tudo” age só nas linhas visíveis.
- Testes unitários de Dialog, ActionBar, Select, Pagination, Tabela e preferências
  (29 specs) e script `npm run test:ci`.

### Changed
- Dialog, Stepper, ActionBar, Pagination, Toast e Header passaram a usar `appButton`
  onde fazia sentido (consistência visual e acessibilidade).
- `styles.sass` agora usa `@use './app/shared/components/button/button' as *`.
- Tabela e header com layout empilhado no mobile.
- Dialog e ActionBar só emitem `openedChange` quando o estado muda de fato
  (não emitem mais na inicialização).
- CI: o deploy roda os testes antes de publicar; o workflow `ci` passou a rodar
  só em PRs e branches que não sejam a `main`.

### Fixed
- Dialog/ActionBar: `size="auto"` agora mede o conteúdo sempre que abre (antes
  nunca rodava, porque o conteúdo é renderizado com `*ngIf`); mudanças em `size`
  após a criação são aplicadas.
- Dialog: só restaura o `overflow` do body se a própria instância o travou
  (antes zerava o valor na inicialização).
- Select: a lista de opções atualiza quando `options` muda após a primeira renderização.
- Paginação: `pageSize` inválido (0, negativo, NaN) não gera mais `Infinity`;
  `pageIndex` é limitado ao intervalo válido.
- Tema/idioma: valores lidos do `localStorage` são validados.
- Deploy: o script de redirect da raiz gerava JavaScript inválido.
- Header mobile ocupa 100% da largura útil com **safe-area** em iOS.
- Pequenos ajustes de foco/aria e responsividade.

### Migration Notes
- Onde havia `.btn`/`.pill` “ad hoc”, prefira o `appButton`:
  `<button appButton variant="outline" tone="neutral" size="sm">…</button>`.

## [1.6.0](https://github.com/AysllaGomes/angular-components/compare/v1.5.0...v1.6.0) (2025-09-07)
### Added
- **Responsive table** 
  - **Horizontal wrap** com `.tbl-wrap` + “sombrinhas” nas laterais. 
  - **Mobile stack (≤640px)**: cada linha vira “card” com rótulos via `data-label`; coluna de seleção renderizada no topo e ações no rodapé. 
- **Largura do selecionável**: token --tbl-select-w (ex.: 48px) e suporte a ajuste local.

### Changed
- Cabeçalho ordenável: foco visível e `aria-sort` mantidos; suporte a **Enter/Espaço** no `<th>`.

### Fixed
- Removido reset global de `button` que afetava outros componentes; estilos agora escopados em `.icon-btn`.

## [1.5.0](https://github.com/AysllaGomes/angular-components/compare/v1.4.0...v1.5.0) (06/09/2025)
### Recursos
* **barra de ações:** adiciona planilha do lado direito com sm/md/lg/auto, interface com reconhecimento de acentos e a11y ([d20e461](https://github.com/AysllaGomes/angular-components/commit/d20e46172b9830f0b036816de7d12c01fd4a2ce5))
* **selecionar:** folha inferior removível (×), polimento e documentos do a11y ([a288e57](https://github.com/AysllaGomes/angular-components/commit/a288e57ecc663011f8dbb99e9b2ea5c61bf9ca9d))

## [1.4.0](https://github.com/AysllaGomes/angular-components/compare/v1.3.0...v1.4.0) (05/09/2025)
### Recursos
* **select:** seleção acessível com filtro opcional + tematizável via variáveis ​​CSS ([843203e](https://github.com/AysllaGomes/angular-components/commit/843203e4a48f438ce5eea58630c7767ba9290636))
* **tema:** adicionar Predefinição de acento 'rosa' ([9ba5b70](https://github.com/AysllaGomes/angular-components/commit/9ba5b70f4572968ad908bf0d4c8f6afa2cf59330)), fecha [#e11d48](https://github.com/AysllaGomes/angular-components/issues/e11d48)

## [1.3.0] - 2025-09-05
### Adicionado
* **tema:** adicionar predefinição de acento 'azul' ([11fd39e](https://github.com/AysllaGomes/angular-components/commit/11fd39eeec0e0c65e9afcc0de7314cead771007f)), fecha [#2563](https://github.com/AysllaGomes/angular-components/issues/2563)

### Docs
- Docs: accent picker supports 4 colors (teal, orange, violet, blue).
- Seletor de acentos suporta quatro cores (azul-petróleo, laranja, violeta, azul).

## [1.2.0] - 2025-09-05
### Adicionado
- **Presets de accent** em tempo de execução (`teal` | `orange` | `violet`) via CSS vars.
- Sinal de **accent** no `ThemeService` + persistência segura para SSR.
- **Picker** de accent no Header com a11y/tooltips.
- Tokens de **tema escuro** para paginação.

### Alterado
- **Tokens globais** agora mapeiam `--accent` para Stepper, Tabela (cabeçalho), Paginação e Toast.
- Cabeçalho da **Tabela** passa a derivar do accent.
- Rótulo **ativo do Stepper** usa o accent.
- Paginação: bolhas neutras no tema claro; hover/ativo usando accent.
- Demo da paginação: select “Itens por página” mais agradável (pill, foco).

### Notas de migração
- Troque hexcodes fixos de “destaque” por `var(--accent)` (ou variantes weak/strong se usar).
- Remova o bloco `:host` de tokens do `pagination.component.sass` para herdar os globais.
- Garanta que o app defina `data-accent="teal|orange|violet"` em `<html>` (ThemeService já faz).


## [0.1.0] - 2025-09-04
### Adicionado
- **Stepper**: estados (ativo/feito/desabilitado), clique opcional, theming por CSS vars, modo compacto.
- **Table**: colunas declarativas, seleção por checkbox, ações (slot `appActions` e/ou `[actions]`), *chips*, células custom, vazio+loading (skeleton), **ordenação** por cabeçalho.
- **Pagination**: componente standalone (bolhas numéricas + setas), controlado por `total`, `pageSize`, `pageIndex`.
- **Toast**: serviço + container, variantes (success/info/warn/error), ação opcional, duração configurável.
- **Demo**: header com troca de tema (light/dark) e idioma (PT/EN), seções `#stepper`, `#table`, `#pagination`, `#toast`.
- **Docs**: README PT/EN; docs por componente (PT/EN).
- **Deploy**: GitHub Pages (roteamento SPA com fallback `404.html`), redirect para `/demo`.

### Alterado
- Ajustes de estilo global (tokens para header, table, etc.).

### Corrigido
- Base href e 404 de SPA para deep links em GitHub Pages.
