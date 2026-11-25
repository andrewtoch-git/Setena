import { haceCuanto, plural, precio, ubicacion } from './formato';

describe('formato', () => {
  const ahora = new Date('2026-11-25T12:00:00Z').getTime();
  const hace = (min: number) => new Date(ahora - min * 60_000).toISOString();

  it('haceCuanto usa el formato del wireframe', () => {
    expect(haceCuanto(hace(0), ahora)).toBe('ahora');
    expect(haceCuanto(hace(10), ahora)).toBe('hace 10 min');
    expect(haceCuanto(hace(120), ahora)).toBe('hace 2 h');
    expect(haceCuanto(hace(60 * 24), ahora)).toBe('hace 1 día');
    expect(haceCuanto(hace(60 * 24 * 5), ahora)).toBe('hace 5 días');
    expect(haceCuanto(null, ahora)).toBe('');
  });

  it('ubicacion añade «, Barcelona» solo en la ciudad', () => {
    expect(ubicacion('Barcelona ciudad', 'Gràcia')).toBe('Gràcia, Barcelona');
    expect(ubicacion('Alrededores', 'Badalona')).toBe('Badalona');
  });

  it('plural y precio', () => {
    expect(plural(1, 'músico', 'músicos')).toBe('1 músico');
    expect(plural(32, 'músico', 'músicos')).toBe('32 músicos');
    expect(precio({ precio: 150, texto: null })).toBe('150 €');
    expect(precio({ precio: null, texto: 'A convenir' })).toBe('A convenir');
  });
});
