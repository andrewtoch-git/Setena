import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';

import { ApiService } from '../core/api.service';

import { IconoComponent } from './icono.component';

/**
 * «Más opciones» de un perfil o chat: Denunciar perfil y Bloquear / Desbloquear,
 * con sus confirmaciones (wireframe: Perfil-musico-opciones, -denunciar, -bloquear).
 */
@Component({
  selector: 'app-opciones-perfil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconoComponent],
  template: `
    <div class="contenido-ventana">
      @switch (paso()) {
        @case ('menu') {
          <h2>Más opciones</h2>
          <button type="button" class="opcion" (click)="paso.set('denunciar')">
            <app-icono nombre="error" />Denunciar perfil
          </button>
          @if (bloqueado()) {
            <button type="button" class="opcion" (click)="desbloquear()">Desbloquear a {{ nombre() }}</button>
          } @else {
            <button type="button" class="opcion destructiva" (click)="paso.set('bloquear')">
              Bloquear a {{ nombre() }}
            </button>
          }
          <button type="button" class="btn btn-contorno" (click)="cerrar.emit()">Cancelar</button>
        }
        @case ('denunciar') {
          <h2>Denunciar perfil</h2>
          <p>¿Por qué quieres denunciar a {{ nombre() }}? No le diremos quién ha enviado la denuncia.</p>
          <div role="radiogroup" class="motivos">
            @for (m of motivos; track m) {
              <label class="opcion">
                <input type="radio" name="motivo" [checked]="motivo() === m" (change)="motivo.set(m)" />
                {{ m }}
              </label>
            }
          </div>
          <button type="button" class="btn btn-destructivo" [disabled]="!motivo() || ocupado()" (click)="denunciar()">
            Enviar denuncia
          </button>
          <button type="button" class="btn btn-contorno" (click)="cerrar.emit()">Cancelar</button>
        }
        @case ('denunciado') {
          <h2>Gracias por avisarnos</h2>
          <p>Revisaremos el perfil de {{ nombre() }}. Si incumple las normas de la comunidad, tomaremos medidas.</p>
          <button type="button" class="btn btn-principal" (click)="cerrar.emit()">Aceptar</button>
        }
        @case ('bloquear') {
          <h2>¿Bloquear a {{ nombre() }}?</h2>
          <p>No podrá enviarte mensajes ni ver tu perfil. No le avisaremos de que le has bloqueado.</p>
          <button type="button" class="btn btn-destructivo" [disabled]="ocupado()" (click)="bloquear()">
            Bloquear
          </button>
          <button type="button" class="btn btn-contorno" (click)="cerrar.emit()">Cancelar</button>
        }
        @case ('bloqueado') {
          <h2>Has bloqueado a {{ nombre() }}</h2>
          <p>Ya no podrá escribirte ni ver tu perfil.</p>
          <button type="button" class="btn btn-principal" (click)="cerrar.emit()">Aceptar</button>
        }
      }
      @if (error()) {
        <p role="alert" class="error">No se ha podido completar la acción. Revisa tu conexión e inténtalo de nuevo.</p>
      }
    </div>
  `,
  styles: `
    .motivos {
      display: flex;
      flex-direction: column;
    }
    label.opcion input {
      width: 20px;
      height: 20px;
      margin: 0;
      accent-color: var(--acento);
    }
    .error {
      color: var(--error) !important;
    }
  `,
})
export class OpcionesPerfilComponent {
  private readonly api = inject(ApiService);

  readonly perfilId = input.required<string>();
  readonly nombre = input.required<string>();
  readonly bloqueado = input(false);
  readonly cerrar = output<void>();
  /** Avisa de que ha cambiado el bloqueo (true = ahora bloqueado). */
  readonly bloqueoCambiado = output<boolean>();

  protected readonly motivos = [
    'Perfil falso o suplantación',
    'Contenido inapropiado',
    'Spam o publicidad',
    'Otro motivo',
  ];
  protected readonly paso = signal<'menu' | 'denunciar' | 'denunciado' | 'bloquear' | 'bloqueado'>('menu');
  protected readonly motivo = signal<string | null>(null);
  protected readonly ocupado = signal(false);
  protected readonly error = signal(false);

  private async hacer(accion: () => Promise<unknown>, siguiente?: 'denunciado' | 'bloqueado'): Promise<boolean> {
    this.ocupado.set(true);
    this.error.set(false);
    try {
      await accion();
      if (siguiente) this.paso.set(siguiente);
      return true;
    } catch {
      this.error.set(true);
      return false;
    } finally {
      this.ocupado.set(false);
    }
  }

  protected async denunciar(): Promise<void> {
    const motivo = this.motivo();
    if (motivo) await this.hacer(() => this.api.denunciar(this.perfilId(), motivo), 'denunciado');
  }

  protected async bloquear(): Promise<void> {
    if (await this.hacer(() => this.api.bloquear(this.perfilId()), 'bloqueado')) this.bloqueoCambiado.emit(true);
  }

  protected async desbloquear(): Promise<void> {
    if (await this.hacer(() => this.api.desbloquear(this.perfilId()))) {
      this.bloqueoCambiado.emit(false);
      this.cerrar.emit();
    }
  }
}
