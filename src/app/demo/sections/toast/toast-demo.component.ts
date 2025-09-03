import { Component, inject } from '@angular/core';

import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-toast-demo',
  standalone: true,
  templateUrl: './toast-demo.component.html',
  styleUrl: './toast-demo.component.sass',
})
export class ToastDemoComponent {
  private toast = inject(ToastService);

  ok() {
    this.toast.success('Mensagem de sucesso.');
  }

  warn() {
    this.toast.warning('Mensagem de alerta.');
  }

  info() {
    this.toast.info('Mensagem de info.');
  }

  fail() {
    this.toast.error(
      'Recomece sua jornada ou entre em contato com o suporte.',
      { duration: 7000 }
    );
  }

  withAction() {
    this.toast.info('Arquivo pronto para download.', {
      actionLabel: 'Baixar',
      onAction: () => console.log('→ usuário clicou em “Baixar”')
    });
  }

  many() {
    this.toast.success('Pedido enviado!');
    this.toast.info('Processando…');
    this.toast.warning('Atenção: revise os campos.');
    this.toast.error('Falha ao salvar.');
  }

  sticky() {
    this.toast.info('Este toast só sai no X (duration: 0).', { duration: 0 });
  }
}
