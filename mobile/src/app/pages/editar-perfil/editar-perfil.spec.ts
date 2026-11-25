import { rutaDeEnlace } from '../../app.component';

import { leerPrecio, normalizarUrl } from './editar-perfil.page';

describe('Editar perfil: lectura de campos', () => {
  it('leerPrecio acepta números con o sin € y guarda el resto como texto', () => {
    expect(leerPrecio('150')).toEqual({ precio: 150, texto: null });
    expect(leerPrecio(' 35 € ')).toEqual({ precio: 35, texto: null });
    expect(leerPrecio('12,5')).toEqual({ precio: 12.5, texto: null });
    expect(leerPrecio('A convenir')).toEqual({ precio: null, texto: 'A convenir' });
    expect(leerPrecio('   ')).toBeNull();
    expect(leerPrecio('-5')).toEqual({ precio: null, texto: '-5' });
  });

  it('normalizarUrl añade https:// si falta', () => {
    expect(normalizarUrl('instagram.com/laia')).toBe('https://instagram.com/laia');
    expect(normalizarUrl('https://youtube.com/@x')).toBe('https://youtube.com/@x');
    expect(normalizarUrl('')).toBeNull();
  });
});

describe('enlaces setena://', () => {
  it('abre solo perfiles con un id válido', () => {
    expect(rutaDeEnlace('setena://perfil/6b06bfc12a0d450b87e2910b')).toBe('/perfil/6b06bfc12a0d450b87e2910b');
    expect(rutaDeEnlace('setena://perfil/../ajustes')).toBeNull();
    expect(rutaDeEnlace('https://otra.web/perfil/6b06bfc12a0d450b87e2910b')).toBeNull();
  });
});
