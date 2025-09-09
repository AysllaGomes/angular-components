import { Component } from '@angular/core';

import { DialogComponent } from '../../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-dialog-demo',
  standalone: true,
  imports: [
    DialogComponent
  ],
  templateUrl: './dialog-demo.component.html',
  styleUrl: './dialog-demo.component.sass'
})
export class DialogDemoComponent {
  openDlg = false;
  confirmDelete(){ /* ... */ }
}
