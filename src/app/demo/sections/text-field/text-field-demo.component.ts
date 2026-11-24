import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { TPipe } from '../../../site/i18n/t.pipe';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { AutosizeDirective } from '../../../shared/components/form-field/autosize.directive';

@Component({
  selector: 'app-text-field-demo',
  standalone: true,
  imports: [TPipe, ReactiveFormsModule, FormFieldComponent, AutosizeDirective],
  templateUrl: './text-field-demo.component.html',
  styleUrl: './text-field-demo.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextFieldDemoComponent {
  readonly name = new FormControl('', { nonNullable: true });
  readonly email = new FormControl('ana@', { nonNullable: true });
  readonly amount = new FormControl('', { nonNullable: true });
  readonly weight = new FormControl('', { nonNullable: true });
  readonly search = new FormControl('', { nonNullable: true });
  readonly password = new FormControl('', { nonNullable: true });
  readonly notes = new FormControl('', { nonNullable: true });
}
