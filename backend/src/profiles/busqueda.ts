import { DISPONIBILIDAD, GENEROS, ROLES, ZONAS } from '../common/catalogos';

/** Quita tildes y pasa a minúsculas. */
export const normalizar = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

/**
 * PROPUESTA: sinónimos de rol para la búsqueda libre ("pianista" → Piano).
 * Los roles se nombran por instrumento (decisión del equipo), pero la gente escribe así.
 */
const SINONIMOS_ROL: Record<string, string> = {
  pianista: 'Piano',
  teclista: 'Teclado',
  guitarrista: 'Guitarra',
  bajista: 'Bajo',
  baterista: 'Batería',
  percusionista: 'Percusión',
  saxofonista: 'Saxofón',
  saxo: 'Saxofón',
  trompetista: 'Trompeta',
  trombonista: 'Trombón',
  flautista: 'Flauta',
  clarinetista: 'Clarinete',
  violinista: 'Violín',
  violonchelista: 'Violonchelo',
  chelo: 'Violonchelo',
  contrabajista: 'Contrabajo',
  acordeonista: 'Acordeón',
  arpista: 'Arpa',
  productor: 'Productor/a musical',
  productora: 'Productor/a musical',
  compositor: 'Compositor/a',
  compositora: 'Compositor/a',
  arreglista: 'Arreglista',
  cantautor: 'Cantante',
  cantautora: 'Cantante',
  vocalista: 'Cantante',
};

export interface FiltrosTexto {
  roles: string[];
  generos: string[];
  zonas: string[];
  disponibilidad: string[];
  /** Palabras que no coinciden con ningún catálogo: se buscan como texto. */
  palabras: string[];
}

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Extrae filtros de la búsqueda libre: «guitarra rock gràcia» → rol Guitarra + género Rock + texto «gracia». */
export function interpretarTexto(q: string | undefined): FiltrosTexto {
  const out: FiltrosTexto = {
    roles: [],
    generos: [],
    zonas: [],
    disponibilidad: [],
    palabras: [],
  };
  if (!q) return out;
  let resto = ` ${normalizar(q).replace(/[,;]+/g, ' ')} `;

  const candidatos: Array<
    [string, keyof Omit<FiltrosTexto, 'palabras'>, string]
  > = [
    ...ROLES.filter((r) => r !== 'Otros').map(
      (v) => [normalizar(v), 'roles', v] as [string, 'roles', string],
    ),
    ...GENEROS.filter((g) => g !== 'Otros').map(
      (v) => [normalizar(v), 'generos', v] as [string, 'generos', string],
    ),
    ...ZONAS.map(
      (v) => [normalizar(v), 'zonas', v] as [string, 'zonas', string],
    ),
    ...DISPONIBILIDAD.map(
      (v) =>
        [normalizar(v), 'disponibilidad', v] as [
          string,
          'disponibilidad',
          string,
        ],
    ),
    ...Object.entries(SINONIMOS_ROL).map(
      ([k, v]) => [k, 'roles', v] as [string, 'roles', string],
    ),
  ];
  // Las frases más largas primero («drum & bass» antes que «bass»).
  candidatos.sort((a, b) => b[0].length - a[0].length);
  for (const [frase, campo, valor] of candidatos) {
    const re = new RegExp(`(^|\\s)${escapar(frase)}(?=\\s)`, 'g');
    if (re.test(resto)) {
      if (!out[campo].includes(valor)) out[campo].push(valor);
      resto = resto.replace(re, ' ');
    }
  }
  out.palabras = resto.split(/\s+/).filter((p) => p.length >= 2);
  return out;
}

/** Expresión regular que ignora tildes para una palabra ya normalizada. */
export function regexSinTildes(palabra: string): RegExp {
  const mapa: Record<string, string> = {
    a: '[aáàä]',
    e: '[eéèë]',
    i: '[iíìï]',
    o: '[oóòö]',
    u: '[uúùü]',
    n: '[nñ]',
    c: '[cç]',
  };
  const patron = [...escapar(palabra)].map((ch) => mapa[ch] ?? ch).join('');
  return new RegExp(patron, 'i');
}
