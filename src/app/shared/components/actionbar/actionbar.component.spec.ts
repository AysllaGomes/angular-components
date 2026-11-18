import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbSize } from '../../model/type/ab-size.type';

import { ActionBarComponent } from './actionbar.component';

@Component({
  imports: [ActionBarComponent],
  template: `
    <app-actionbar title="Teste" [size]="size()" [opened]="opened()">
      <div [style.width.px]="contentWidth()" style="height: 10px"></div>
    </app-actionbar>
  `
})
class HostComponent {
  size = signal<AbSize>('auto');
  opened = signal(false);
  contentWidth = signal(800);
}

/** Espera o ResizeObserver disparar e o Angular renderizar. */
async function settle(fixture: ComponentFixture<unknown>) {
  await new Promise(r => requestAnimationFrame(() => setTimeout(r)));
  await fixture.whenStable();
}

function sheetEl(fixture: ComponentFixture<unknown>): HTMLElement | null {
  return (fixture.nativeElement as HTMLElement).querySelector('.ab__sheet');
}

describe('ActionBarComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('size="auto" measures content after opening (content only exists while open)', async () => {
    host.opened.set(true);
    await settle(fixture);

    // 800px de conteúdo → lg (>= 720)
    expect(sheetEl(fixture)?.classList).toContain('ab--lg');
  });

  it('applies a fixed size and reacts to size changes', async () => {
    host.size.set('sm');
    host.opened.set(true);
    await settle(fixture);
    expect(sheetEl(fixture)?.classList).toContain('ab--sm');

    host.size.set('md');
    await settle(fixture);
    expect(sheetEl(fixture)?.classList).toContain('ab--md');
  });
});
