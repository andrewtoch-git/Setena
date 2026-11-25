import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';

import { IconoComponent } from './icono.component';

/** Ventana de selección múltiple con chips («Instrumento o rol», «Géneros musicales»). */
@Component({
  selector: 'app-selector-multiple',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconoComponent],
  template: `
    <div class="contenido-ventana">
      <h2>{{ titulo() }}</h2>
      <p>Marca todas las opciones que quieras.</p>
      <div class="chips">
        @for (o of opciones(); track o) {
          <button type="button" class="chip" [attr.aria-pressed]="borrador().includes(o)" (click)="alternar(o)">
            @if (borrador().includes(o)) {
              <app-icono nombre="check" [tam]="18" />
            }
            {{ o }}
          </button>
        }
      </div>
      <button type="button" class="btn btn-principal" (click)="guardar.emit(borrador())">Guardar</button>
    </div>
  `,
  styles: `
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `,
})
export class SelectorMultipleComponent {
  readonly titulo = input.required<string>();
  readonly opciones = input.required<readonly string[]>();
  readonly seleccion = input<readonly string[]>([]);
  readonly guardar = output<string[]>();

  protected readonly borrador = signal<string[]>([]);

  constructor() {
    effect(() => this.borrador.set([...this.seleccion()]));
  }

  protected alternar(valor: string): void {
    this.borrador.update((l) => (l.includes(valor) ? l.filter((v) => v !== valor) : [...l, valor]));
  }
}
