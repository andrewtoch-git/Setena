import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { IonContent, IonHeader, NavController } from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import { IconoComponent } from '../../ui/icono.component';

/** Cambiar contraseña (wireframe: Ajustes-contrasena y Ajustes-contrasena-error). */
@Component({
  selector: 'app-cambiar-contrasena',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonContent, IconoComponent],
  template: `
    <ion-header class="ion-no-border">
      <div class="barra">
        <button type="button" class="icono-boton" aria-label="Volver" (click)="nav.back()">
          <app-icono nombre="volver" />
        </button>
      </div>
    </ion-header>
    <ion-content>
      <form class="pagina formulario" (submit)="$event.preventDefault(); guardar()" novalidate>
        <h1>Cambiar contraseña</h1>
        @if (hecho()) {
          <div class="estado" role="status">
            <app-icono nombre="confirmado" [tam]="32" class="ok" />
            <span class="titulo">Contraseña actualizada</span>
            <span class="texto">La próxima vez que inicies sesión usa tu contraseña nueva.</span>
          </div>
          <button type="button" class="btn btn-principal" (click)="nav.back()">Volver a Ajustes</button>
        } @else {
          @if (actualIncorrecta()) {
            <div class="aviso-error" role="alert">
              <app-icono nombre="error" />
              <span>La contraseña actual no es correcta. Revísala o recupérala desde Iniciar sesión.</span>
            </div>
          }
          @if (errorRed()) {
            <div class="aviso-error" role="alert">
              <app-icono nombre="error" /><span
                >No se ha podido completar la acción. Revisa tu conexión e inténtalo de nuevo.</span
              >
            </div>
          }
          <div class="campo" [class.invalido]="err().actual">
            <label for="cp-actual">Contraseña actual</label>
            <input
              id="cp-actual"
              type="password"
              autocomplete="current-password"
              [value]="actual()"
              (input)="actual.set($any($event.target).value); actualIncorrecta.set(false)"
            />
            @if (err().actual) {
              <span class="mensaje-error">{{ err().actual }}</span>
            }
          </div>
          <div class="campo" [class.invalido]="err().nueva">
            <label for="cp-nueva">Contraseña nueva</label>
            <input
              id="cp-nueva"
              type="password"
              autocomplete="new-password"
              [value]="nueva()"
              (input)="nueva.set($any($event.target).value)"
            />
            @if (err().nueva) {
              <span class="mensaje-error">{{ err().nueva }}</span>
            } @else {
              <span class="ayuda">Mínimo 8 caracteres.</span>
            }
          </div>
          <div class="campo" [class.invalido]="err().repite">
            <label for="cp-repite">Repite la contraseña nueva</label>
            <input
              id="cp-repite"
              type="password"
              autocomplete="new-password"
              [value]="repite()"
              (input)="repite.set($any($event.target).value)"
            />
            @if (err().repite) {
              <span class="mensaje-error">{{ err().repite }}</span>
            }
          </div>
          <button type="submit" class="btn btn-principal" [disabled]="guardando()">Guardar contraseña</button>
        }
      </form>
    </ion-content>
  `,
  styleUrls: ['../formularios.scss'],
  styles: `
    .ok {
      color: var(--acento);
    }
  `,
})
export class CambiarContrasenaPage {
  private readonly api = inject(ApiService);
  protected readonly nav = inject(NavController);

  protected readonly actual = signal('');
  protected readonly nueva = signal('');
  protected readonly repite = signal('');
  protected readonly enviado = signal(false);
  protected readonly guardando = signal(false);
  protected readonly actualIncorrecta = signal(false);
  protected readonly errorRed = signal(false);
  protected readonly hecho = signal(false);

  private readonly errores = computed(() => ({
    actual: !this.actual()
      ? 'Introduce tu contraseña actual'
      : this.actualIncorrecta()
        ? 'La contraseña actual no es correcta'
        : null,
    nueva: !this.nueva() ? 'Introduce una contraseña nueva' : this.nueva().length < 8 ? 'Mínimo 8 caracteres' : null,
    repite: !this.repite()
      ? 'Repite la contraseña nueva'
      : this.repite() !== this.nueva()
        ? 'Las contraseñas no coinciden'
        : null,
  }));
  protected readonly err = computed(() =>
    this.enviado() ? this.errores() : { actual: null, nueva: null, repite: null },
  );

  protected async guardar(): Promise<void> {
    this.enviado.set(true);
    this.errorRed.set(false);
    const e = this.errores();
    if (e.actual || e.nueva || e.repite) return;
    this.guardando.set(true);
    try {
      await this.api.cambiarPassword(this.actual(), this.nueva());
      this.hecho.set(true);
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 400) this.actualIncorrecta.set(true);
      else this.errorRed.set(true);
    } finally {
      this.guardando.set(false);
    }
  }
}
