import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

import { ChatSocketService } from './core/chat-socket.service';

/** setena://perfil/<id> → /perfil/<id> (botón «Ver perfil en setena» de la página pública /p/:id). */
export function rutaDeEnlace(url: string): string | null {
  const m = /^setena:\/\/perfil\/([a-f0-9]{24})\/?$/i.exec(url.trim());
  return m ? `/perfil/${m[1]}` : null;
}

@Component({
  selector: 'app-root',
  template: `<ion-app><ion-router-outlet /></ion-app>`,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  // Arranca el chat en tiempo real: se conecta solo cuando hay sesión.
  private readonly chat = inject(ChatSocketService);

  constructor() {
    const router = inject(Router);
    // En Android/iOS abre los enlaces setena://; en el navegador no hace nada.
    void App.addListener('appUrlOpen', ({ url }) => {
      const ruta = rutaDeEnlace(url);
      if (ruta) void router.navigateByUrl(ruta);
    }).catch(() => undefined);
  }
}
