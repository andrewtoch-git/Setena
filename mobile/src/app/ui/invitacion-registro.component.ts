import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';

/**
 * «Ventana de registro» del wireframe: se muestra en Favoritos, Chats y Mi perfil sin sesión,
 * y al pulsar Chat o Favorito en un perfil. Textos copiados de Favoritos-sin-registro.
 */
@Component({
  selector: 'app-invitacion-registro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>¡La música se disfruta más en comunidad!</h2>
    <p>
      Regístrate, conecta con otros músicos y descubre nuevas personas con las que compartir tu pasión por la música.
    </p>
    <button class="btn btn-principal" type="button" (click)="ir('/registro')">Regístrate gratis</button>
    <button class="btn btn-contorno" type="button" (click)="ir('/iniciar-sesion')">Iniciar sesión</button>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-align: center;
      padding: 24px;
    }
    h2 {
      margin: 0;
      font-size: 24px;
      line-height: 32px;
      font-weight: 400;
    }
    p {
      margin: 0 0 8px;
      font-size: 14px;
      line-height: 20px;
      color: var(--on-surface-variant);
    }
  `,
})
export class InvitacionRegistroComponent {
  private readonly router = inject(Router);
  /** Avisa al contenedor (p. ej. para cerrar una ventana modal) antes de navegar. */
  readonly navegar = output<void>();

  protected ir(ruta: string): void {
    this.navegar.emit();
    void this.router.navigateByUrl(ruta);
  }
}
