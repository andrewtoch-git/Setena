import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';

import { IconoComponent } from '../../ui/icono.component';

/** Bienvenida tras crear la cuenta (wireframe: Bienvenida). */
@Component({
  selector: 'app-bienvenida',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonContent, RouterLink, IconoComponent],
  template: `
    <ion-content>
      <div class="pagina contenido">
        <h1>{{ saludo() }}</h1>
        <p class="texto-secundario">
          Ya formas parte de la comunidad. Puedes ver perfiles completos, guardar músicos en Favoritos y escribir a
          quien te interese.
        </p>
        <ul>
          <li><app-icono nombre="buscar" /><span>Busca por instrumento, estilo, zona o disponibilidad.</span></li>
          <li><app-icono nombre="favorito" /><span>Guarda en Favoritos a los músicos que te interesen.</span></li>
          <li><app-icono nombre="chat" /><span>Escríbeles por chat para proponerles un proyecto.</span></li>
        </ul>
        <a class="btn btn-principal btn-m" routerLink="/tabs/explorar" [replaceUrl]="true">Empezar a explorar</a>
      </div>
    </ion-content>
  `,
  styles: `
    .contenido {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 20px;
      padding-top: 48px;
    }
    h1 {
      margin: 0;
      font-size: 24px;
      line-height: 32px;
      font-weight: 400;
    }
    p {
      margin: 0;
      font-size: 14px;
      line-height: 20px;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    li {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      line-height: 20px;
    }
    li app-icono {
      color: var(--acento);
    }
  `,
})
export class BienvenidaPage {
  /** ?nombre= (withComponentInputBinding) */
  readonly nombre = input<string>();
  protected readonly saludo = computed(() =>
    this.nombre() ? `¡Tu cuenta está lista, ${this.nombre()}!` : '¡Tu cuenta está lista!',
  );
}
