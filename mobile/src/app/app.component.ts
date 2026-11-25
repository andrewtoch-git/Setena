import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

import { ChatSocketService } from './core/chat-socket.service';

@Component({
  selector: 'app-root',
  template: `<ion-app><ion-router-outlet /></ion-app>`,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  // Arranca el chat en tiempo real: se conecta solo cuando hay sesión.
  private readonly chat = inject(ChatSocketService);
}
