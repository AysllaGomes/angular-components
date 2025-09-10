import { Component } from '@angular/core';

import { TPipe } from '../../../shared/i18n/t.pipe';

import { DialogComponent } from '../../../shared/components/dialog/dialog.component';

import { ButtonDirective } from '../../../shared/components/button/button.directive';

@Component({
  selector: 'app-dialog-demo',
  standalone: true,
  imports: [
    TPipe,
    DialogComponent,
    ButtonDirective,
  ],
  templateUrl: './dialog-demo.component.html',
  styleUrl: './dialog-demo.component.sass'
})
export class DialogDemoComponent {
  openDlgDefault = false;
  openDlgCustom  = false;

  confirmDelete() {
    console.log('Confirmado!');
    this.openDlgDefault = false;
  }

  saveSomething() {
    console.log('Salvo!');
    this.openDlgCustom = false;
  }
}
