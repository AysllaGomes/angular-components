# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

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
