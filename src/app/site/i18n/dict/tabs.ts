import { Dict } from '../i18n.types';

export const TABS: Dict = {
  'nav.tabs': { pt: 'Tabs', en: 'Tabs' },

  'section.tabs.title': { pt: 'Tabs', en: 'Tabs' },
  'section.tabs.lead': {
    pt: 'Abas no padrão WAI-ARIA: Tab entra na aba atual e vai para o conteúdo; as setas trocam de aba, Home/End vão para a primeira/última.',
    en: 'WAI-ARIA tabs: Tab enters the current tab and moves on to its content; arrows switch tabs, Home/End go to the first/last.'
  },

  // básico
  'tabs.demo.basic.title': { pt: 'Contador, rótulo com ícone e aba desabilitada', en: 'Badge, label with icon and a disabled tab' },
  'tabs.demo.account': { pt: 'Conta', en: 'Account' },
  'tabs.overview': { pt: 'Visão geral', en: 'Overview' },
  'tabs.overview.text': { pt: 'Resumo da conta: plano Pro, 3 projetos ativos.', en: 'Account summary: Pro plan, 3 active projects.' },
  'tabs.activity': { pt: 'Atividade', en: 'Activity' },
  'tabs.activity.1': { pt: 'Ana comentou em "Relatório anual"', en: 'Ana commented on "Annual report"' },
  'tabs.activity.2': { pt: 'Bruno enviou 2 arquivos', en: 'Bruno uploaded 2 files' },
  'tabs.activity.3': { pt: 'Carla aprovou o orçamento', en: 'Carla approved the budget' },
  'tabs.settings': { pt: 'Configurações', en: 'Settings' },
  'tabs.settings.text': {
    pt: 'O conteúdo direto continua na página ao trocar de aba: mude o switch, vá para outra aba e volte.',
    en: 'Direct content stays on the page when switching tabs: flip the switch, go to another tab and come back.'
  },
  'tabs.settings.notify': { pt: 'Notificações por e-mail', en: 'Email notifications' },
  'tabs.archived': { pt: 'Arquivadas', en: 'Archived' },
  'tabs.demo.value': { pt: 'Aba aberta: {{v}}', en: 'Open tab: {{v}}' },

  // manual + sob demanda
  'tabs.demo.lazy.title': { pt: 'Ativação manual e conteúdo sob demanda', en: 'Manual activation and on-demand content' },
  'tabs.demo.lazy.hint': {
    pt: 'As setas só movem o foco; Enter ou Espaço abrem a aba. "Relatório" e "Gráficos" só são criados quando abertos.',
    en: 'Arrows only move focus; Enter or Space open the tab. "Report" and "Charts" are only created when opened.'
  },
  'tabs.demo.reports': { pt: 'Relatórios', en: 'Reports' },
  'tabs.demo.keepAlive': { pt: 'Manter o conteúdo depois de aberto (keepAlive)', en: 'Keep content after it was opened (keepAlive)' },
  'tabs.summary': { pt: 'Resumo', en: 'Summary' },
  'tabs.summary.text': { pt: 'Conteúdo leve, criado junto com a página.', en: 'Light content, created with the page.' },
  'tabs.report': { pt: 'Relatório', en: 'Report' },
  'tabs.charts': { pt: 'Gráficos', en: 'Charts' },
  'tabs.stamp': { pt: '{{name}} criado às {{time}}', en: '{{name}} created at {{time}}' },

  // muitas abas
  'tabs.demo.many.title': { pt: 'Muitas abas (rolagem)', en: 'Many tabs (scrolling)' },
  'tabs.demo.months': { pt: 'Meses', en: 'Months' },
  'tabs.month.text': { pt: 'Fechamento de {{m}}.', en: '{{m}} closing.' },
};
