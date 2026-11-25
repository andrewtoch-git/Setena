import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, NavController } from '@ionic/angular';

import { SesionService } from '../../core/sesion.service';
import { IconoComponent } from '../../ui/icono.component';

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Iniciar sesión (wireframe: Iniciar-sesion e Iniciar-sesion-error). */
@Component({
  selector: 'app-iniciar-sesion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonContent, RouterLink, IconoComponent],
  template: `
    <ion-header class="ion-no-border">
      <div class="barra">
        <button type="button" class="icono-boton" aria-label="Volver" (click)="volver()">
          <app-icono nombre="volver" />
        </button>
      </div>
    </ion-header>
    <ion-content>
      <form class="pagina formulario" (submit)="$event.preventDefault(); entrar()" novalidate>
        <h1>Iniciar sesión</h1>
        @if (errorServidor()) {
          <div class="aviso-error" role="alert">
            <app-icono nombre="error" />
            <span>{{ errorServidor() }}</span>
          </div>
        }
        <p class="texto-secundario">
          Entra con tu cuenta para ver los perfiles completos y contactar con otros músicos.
        </p>

        <div class="campo" [class.invalido]="errorCorreo()">
          <label for="correo">Correo electrónico</label>
          <input
            id="correo"
            type="email"
            autocomplete="email"
            inputmode="email"
            placeholder="nombre@correo.com"
            [value]="correo()"
            (input)="correo.set($any($event.target).value)"
            [attr.aria-invalid]="!!errorCorreo()"
          />
          @if (errorCorreo()) {
            <span class="mensaje-error">{{ errorCorreo() }}</span>
          }
        </div>

        <div class="campo" [class.invalido]="errorPass()">
          <label for="pass">Contraseña</label>
          <input
            id="pass"
            type="password"
            autocomplete="current-password"
            [value]="pass()"
            (input)="pass.set($any($event.target).value)"
            [attr.aria-invalid]="!!errorPass()"
          />
          @if (errorPass()) {
            <span class="mensaje-error">{{ errorPass() }}</span>
          }
        </div>

        <button type="submit" class="btn btn-principal btn-m" [disabled]="enviando()">Iniciar sesión</button>
        <div class="alternativa">
          <span class="texto-secundario">¿No tienes cuenta?</span>
          <a routerLink="/registro" class="btn btn-texto">Regístrate gratis</a>
        </div>
      </form>
    </ion-content>
  `,
  styleUrl: '../formularios.scss',
})
export class IniciarSesionPage {
  private readonly sesion = inject(SesionService);
  private readonly nav = inject(NavController);

  protected readonly correo = signal('');
  protected readonly pass = signal('');
  protected readonly enviado = signal(false);
  protected readonly enviando = signal(false);
  protected readonly errorServidor = signal<string | null>(null);

  protected readonly errorCorreo = computed(() => {
    if (!this.enviado()) return null;
    if (!this.correo().trim()) return 'Introduce tu correo electrónico';
    return CORREO.test(this.correo().trim()) ? null : 'Introduce un correo válido (nombre@correo.com)';
  });
  protected readonly errorPass = computed(() => (this.enviado() && !this.pass() ? 'Introduce tu contraseña' : null));

  protected volver(): void {
    this.nav.back();
  }

  protected async entrar(): Promise<void> {
    this.enviado.set(true);
    this.errorServidor.set(null);
    if (this.errorCorreo() || this.errorPass()) return;
    this.enviando.set(true);
    try {
      await this.sesion.login(this.correo().trim(), this.pass());
      void this.nav.navigateRoot('/tabs/explorar');
    } catch (e) {
      this.errorServidor.set(
        e instanceof HttpErrorResponse && e.status === 401
          ? 'El correo o la contraseña no son correctos. Revísalos o recupera tu contraseña.'
          : 'No se ha podido iniciar sesión. Revisa tu conexión e inténtalo de nuevo.',
      );
    } finally {
      this.enviando.set(false);
    }
  }
}
