import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';

import { ApiService } from '../core/api.service';
import type { ResumenChat } from '../core/modelos';
import { SesionService } from '../core/sesion.service';

import { IconoComponent } from './icono.component';

/**
 * Ventana «Compartir perfil» (wireframe: Perfil-musico-compartir y Mi-perfil-compartir).
 * EN TUS CHATS: envía una tarjeta «Perfil compartido». FUERA DE LA APP: enlace público /p/:id.
 * Instagram no se ofrece: no admite compartir enlaces desde la web (decisión delegada).
 */
@Component({
  selector: 'app-compartir-perfil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconoComponent],
  template: `
    <div class="contenido-ventana">
      @switch (paso()) {
        @case ('opciones') {
          <h2>Compartir perfil</h2>
          <p>
            {{
              propio()
                ? '¿Dónde quieres compartir tu perfil?'
                : '¿Dónde quieres compartir el perfil de ' + nombre() + '?'
            }}
          </p>
          @if (sesion.iniciada()) {
            <span class="seccion">EN TUS CHATS</span>
            <button type="button" class="opcion" (click)="abrirChats()">
              <app-icono nombre="chat" />Enviar a un chat de la app
            </button>
          }
          <span class="seccion">FUERA DE LA APP</span>
          <button type="button" class="opcion" (click)="copiar()"><app-icono nombre="enlace" />Copiar enlace</button>
          <div class="redes">
            <a [href]="whatsapp()" target="_blank" rel="noopener"><span class="red">W</span>WhatsApp</a>
            <a [href]="facebook()" target="_blank" rel="noopener"><span class="red">F</span>Facebook</a>
            <button type="button" (click)="mas()"><span class="red">•••</span>Más</button>
          </div>
          @if (aviso()) {
            <p role="status" class="aviso">{{ aviso() }}</p>
          }
          <button type="button" class="btn btn-contorno" (click)="cerrar.emit()">Cancelar</button>
        }
        @case ('chats') {
          <h2>Enviar a un chat</h2>
          <p>
            {{
              propio()
                ? 'Elige con quién quieres compartir tu perfil.'
                : 'Elige con quién quieres compartir el perfil de ' + nombre() + '.'
            }}
          </p>
          @for (c of chats(); track c.id) {
            <label class="opcion">
              <input type="checkbox" [checked]="elegidos().includes(c.id)" (change)="alternar(c.id)" />
              {{ c.con?.nombre }}
            </label>
          } @empty {
            <p>¡Tu bandeja está vacía!</p>
          }
          <button
            type="button"
            class="btn btn-principal"
            [disabled]="!elegidos().length || enviando()"
            (click)="enviar()"
          >
            Enviar
          </button>
          <button type="button" class="btn btn-contorno" (click)="paso.set('opciones')">Cancelar</button>
        }
        @case ('enviado') {
          <div class="centrado">
            <app-icono nombre="confirmado" [tam]="32" class="ok" />
            <h2>¡Perfil enviado!</h2>
            <p>
              {{
                propio()
                  ? 'Has compartido tu perfil en ' + destino() + '.'
                  : 'Has compartido el perfil de ' + nombre() + ' en ' + destino() + '.'
              }}
            </p>
          </div>
          <button type="button" class="btn btn-principal" (click)="cerrar.emit()">Aceptar</button>
        }
      }
    </div>
  `,
  styles: `
    .redes {
      display: flex;
      gap: 20px;
      padding: 8px 0;
    }
    .redes a,
    .redes button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font: 400 12px var(--font-brand);
      color: var(--on-surface);
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
    }
    .red {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid var(--outline);
      background: var(--surface-container-high);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
    }
    label.opcion input {
      width: 20px;
      height: 20px;
      margin: 0;
      accent-color: var(--acento);
    }
    .centrado {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      text-align: center;
    }
    .ok {
      color: var(--acento);
    }
    .aviso {
      color: var(--on-surface) !important;
    }
  `,
})
export class CompartirPerfilComponent {
  private readonly api = inject(ApiService);
  protected readonly sesion = inject(SesionService);

  readonly perfilId = input.required<string>();
  readonly nombre = input.required<string>();
  readonly propio = input(false);
  readonly cerrar = output<void>();

  protected readonly paso = signal<'opciones' | 'chats' | 'enviado'>('opciones');
  protected readonly chats = signal<ResumenChat[]>([]);
  protected readonly elegidos = signal<string[]>([]);
  protected readonly enviando = signal(false);
  protected readonly aviso = signal<string | null>(null);

  protected readonly enlace = computed(() => this.api.enlacePerfil(this.perfilId()));
  private readonly textoCompartir = computed(() =>
    this.propio() ? 'Mira mi perfil en setena' : `Mira el perfil de ${this.nombre()} en setena`,
  );
  protected readonly whatsapp = computed(
    () => `https://wa.me/?text=${encodeURIComponent(`${this.textoCompartir()}: ${this.enlace()}`)}`,
  );
  protected readonly facebook = computed(
    () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.enlace())}`,
  );
  /** «el chat con Laia Serra» o «3 chats» (como el wireframe). */
  protected readonly destino = computed(() => {
    const ids = this.elegidos();
    if (ids.length === 1) return `el chat con ${this.chats().find((c) => c.id === ids[0])?.con?.nombre ?? ''}`;
    return `${ids.length} chats`;
  });

  protected async abrirChats(): Promise<void> {
    this.paso.set('chats');
    this.elegidos.set([]);
    try {
      this.chats.set(await this.api.chats());
    } catch {
      this.chats.set([]);
    }
  }

  protected alternar(id: string): void {
    this.elegidos.update((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  }

  protected async enviar(): Promise<void> {
    this.enviando.set(true);
    try {
      await Promise.all(this.elegidos().map((id) => this.api.compartirEnChat(id, this.perfilId())));
      this.paso.set('enviado');
    } finally {
      this.enviando.set(false);
    }
  }

  protected async copiar(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.enlace());
      this.aviso.set('Enlace copiado');
    } catch {
      this.aviso.set(this.enlace());
    }
  }

  /** Menú de compartir del sistema (Android/iOS); si no existe, copia el enlace. */
  protected async mas(): Promise<void> {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'setena', text: this.textoCompartir(), url: this.enlace() });
      } catch {
        // cancelado por la persona
      }
    } else {
      await this.copiar();
    }
  }
}
