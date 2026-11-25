import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';

import { IconoComponent } from '../../ui/icono.component';

const CLAVE_VISTA = 'setena.inicio-visto';

/**
 * Inicio (wireframe: Inicio). Animación de entrada de ~1 s copiada del lienzo: aparecen los puntos,
 * el par lima se une, «setena» aparece y se desvanece, el logo sube y entra la foto.
 * Se ve una vez por sesión; con «reducir movimiento» se muestra directamente el estado final.
 */
@Component({
  selector: 'app-inicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonContent, RouterLink, IconoComponent],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.scss',
})
export class InicioPage {
  /** true = saltar la animación (ya vista en esta sesión). */
  protected readonly fin: boolean;

  constructor() {
    let vista = false;
    try {
      vista = sessionStorage.getItem(CLAVE_VISTA) === '1';
      sessionStorage.setItem(CLAVE_VISTA, '1');
    } catch {
      // sin almacenamiento: se muestra la animación
    }
    this.fin = vista;
  }
}
