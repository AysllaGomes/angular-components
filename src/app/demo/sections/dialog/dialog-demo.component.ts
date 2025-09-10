import { Component } from '@angular/core';

import { TPipe } from '../../../shared/i18n/t.pipe';

import { DialogComponent } from '../../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-dialog-demo',
  standalone: true,
  imports: [
    DialogComponent,
    TPipe
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
