import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Ventana de confirmación del wireframe: título, texto y dos botones apilados
 * (acción y «Cancelar»). Las acciones destructivas van en rojo.
 */
@Component({
  selector: 'app-dialogo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="contenido-ventana centrado" role="alertdialog" aria-modal="true" [attr.aria-label]="titulo()">
      <h2>{{ titulo() }}</h2>
      @if (texto()) {
        <p>{{ texto() }}</p>
      }
      <button
        type="button"
        class="btn"
        [class.btn-destructivo]="destructiva()"
        [class.btn-principal]="!destructiva()"
        (click)="confirmar.emit()"
      >
        {{ accion() }}
      </button>
      @if (cancelar()) {
        <button type="button" class="btn btn-contorno" (click)="cerrar.emit()">{{ cancelar() }}</button>
      }
    </div>
  `,
  styles: `
    .centrado {
      text-align: center;
      padding-bottom: 24px;
    }
  `,
})
export class DialogoComponent {
  readonly titulo = input.required<string>();
  readonly texto = input<string>('');
  readonly accion = input.required<string>();
  readonly destructiva = input(false);
  /** Texto del segundo botón; vacío = sin segundo botón. */
  readonly cancelar = input('Cancelar');
  readonly confirmar = output<void>();
  readonly cerrar = output<void>();
}
