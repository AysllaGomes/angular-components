import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.sass'
})
export class App {
  title = 'angular-components';

  constructor() {
    // Links com fragmento (/demo#table): a rolagem do roteador ignora o scroll-margin
    // das seções; desconta o cabeçalho fixo para o título não ficar escondido atrás dele.
    inject(ViewportScroller).setOffset(() => {
      const header = typeof document === 'undefined' ? null : document.querySelector<HTMLElement>('.demo-header');
      return [0, header ? header.offsetHeight + 4 : 0];
    });
  }
}
