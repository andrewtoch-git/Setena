// Listas cerradas del wireframe de fidelidad media (25/11).
// Fuente: mock-data/catalogos.json. El test catalogos.spec.ts comprueba que coinciden.

export const ROLES = [
  'Cantante',
  'Corista',
  'Piano',
  'Teclado',
  'Guitarra',
  'Bajo',
  'Batería',
  'Percusión',
  'Saxofón',
  'Trompeta',
  'Trombón',
  'Flauta',
  'Clarinete',
  'Violín',
  'Violonchelo',
  'Contrabajo',
  'Acordeón',
  'Arpa',
  'DJ',
  'Productor/a musical',
  'Beatmaker',
  'Compositor/a',
  'Arreglista',
  'Otros',
] as const;

export const GENEROS = [
  'Pop',
  'Rock',
  'Indie',
  'Alternativo',
  'Metal',
  'Punk',
  'Reggae',
  'Ska',
  'Dub',
  'Dancehall',
  'Soul',
  'R&B',
  'Funk',
  'Jazz',
  'Blues',
  'Hip-Hop',
  'Rap',
  'Electrónica',
  'House',
  'Techno',
  'Drum & Bass',
  'Disco',
  'Clásica',
  'Flamenco',
  'Salsa',
  'Merengue',
  'Bachata',
  'Reguetón',
  'Latin Pop',
  'Cumbia',
  'Tango',
  'Folk',
  'Country',
  'Gospel',
  'Música experimental',
  'Otros',
] as const;

export const DISPONIBILIDAD = [
  'Inmediata',
  'El próximo fin de semana',
  'Esta semana',
  'La próxima semana',
  'Este mes',
] as const;

export const ZONAS = ['Barcelona ciudad', 'Alrededores'] as const;

export const LUGARES: Record<(typeof ZONAS)[number], readonly string[]> = {
  'Barcelona ciudad': [
    'Ciutat Vella',
    'Eixample',
    'Sants-Montjuïc',
    'Les Corts',
    'Sarrià-Sant Gervasi',
    'Gràcia',
    'Horta-Guinardó',
    'Nou Barris',
    'Sant Andreu',
    'Sant Martí',
  ],
  Alrededores: [
    "L'Hospitalet de Llobregat",
    'Badalona',
    'Santa Coloma de Gramenet',
    'Sant Adrià de Besòs',
    'Esplugues de Llobregat',
    'Cornellà de Llobregat',
    'El Prat de Llobregat',
    'Sant Just Desvern',
    'Montcada i Reixac',
    'Sant Cugat del Vallès',
  ],
};

export const TIPOS_PROYECTO = [
  'Proyectos remunerados',
  'Colaboraciones gratuitas',
] as const;

export const SERVICIOS = [
  {
    clave: 'bolo',
    nombre: 'Bolo / Directo',
    descripcion: 'Conciertos y eventos',
    unidad: 'por actuación',
  },
  {
    clave: 'grabacion',
    nombre: 'Grabación',
    descripcion: 'Instrumentos y voces',
    unidad: 'por hora',
  },
  {
    clave: 'composicion',
    nombre: 'Composición',
    descripcion: 'Canciones y melodías',
    unidad: 'por proyecto',
  },
  {
    clave: 'otros',
    nombre: 'Otros',
    descripcion: 'Servicios adicionales',
    unidad: null,
  },
] as const;
export const CLAVES_SERVICIO = SERVICIOS.map((s) => s.clave);

export const MOTIVOS_DENUNCIA = [
  'Perfil falso o suplantación',
  'Contenido inapropiado',
  'Spam o publicidad',
  'Otro motivo',
] as const;

export const CHIPS_RAPIDOS = [
  'Guitarra',
  'Piano',
  'Teclado',
  'Cantante',
  'Bajo',
  'Batería',
  'DJ',
] as const;

export const REDES = [
  'instagram',
  'youtube',
  'spotify',
  'tiktok',
  'soundcloud',
] as const;

export const CATALOGOS = {
  roles: ROLES,
  generos: GENEROS,
  disponibilidad: DISPONIBILIDAD,
  zonas: ZONAS,
  lugares: LUGARES,
  tiposProyecto: TIPOS_PROYECTO,
  servicios: SERVICIOS,
  motivosDenuncia: MOTIVOS_DENUNCIA,
  chipsRapidos: CHIPS_RAPIDOS,
  redes: REDES,
};
