import { interpretarTexto, regexSinTildes } from './busqueda';

describe('interpretarTexto', () => {
  it('convierte palabras del catálogo en filtros', () => {
    const f = interpretarTexto('Guitarra rock Barcelona ciudad esta semana');
    expect(f.roles).toEqual(['Guitarra']);
    expect(f.generos).toEqual(['Rock']);
    expect(f.zonas).toEqual(['Barcelona ciudad']);
    expect(f.disponibilidad).toEqual(['Esta semana']);
    expect(f.palabras).toEqual([]);
  });

  it('ignora tildes y mayúsculas y reconoce sinónimos de rol', () => {
    const f = interpretarTexto('PIANISTA electronica');
    expect(f.roles).toEqual(['Piano']);
    expect(f.generos).toEqual(['Electrónica']);
  });

  it('prefiere la frase más larga y deja el resto como texto', () => {
    const f = interpretarTexto('drum & bass gracia');
    expect(f.generos).toEqual(['Drum & Bass']);
    expect(f.palabras).toEqual(['gracia']);
  });

  it('no confunde palabras parciales', () => {
    expect(interpretarTexto('popular').generos).toEqual([]);
  });
});

describe('regexSinTildes', () => {
  it('encuentra el texto con o sin tildes', () => {
    expect(regexSinTildes('gracia').test('Gràcia')).toBe(true);
    expect(regexSinTildes('nuria').test('Núria Font')).toBe(true);
  });
});
