/** «Última actividad: hace 2 h» (formato del wireframe). */
export function haceCuanto(fechaIso: string | null | undefined, ahora = Date.now()): string {
  if (!fechaIso) return '';
  const min = Math.max(0, Math.round((ahora - new Date(fechaIso).getTime()) / 60_000));
  if (min < 1) return 'ahora';
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'hace 1 día';
  if (d < 30) return `hace ${d} días`;
  const m = Math.floor(d / 30);
  return m === 1 ? 'hace 1 mes' : `hace ${m} meses`;
}

/** «Sant Martí, Barcelona» en la ciudad; el municipio tal cual en los alrededores (como el wireframe). */
export function ubicacion(zona: string, lugar: string): string {
  return zona === 'Barcelona ciudad' ? `${lugar}, Barcelona` : lugar;
}

export function plural(n: number, singular: string, pluralTxt: string): string {
  return `${n} ${n === 1 ? singular : pluralTxt}`;
}

/** «150 €», o el texto libre («A convenir»). */
export function precio(t: { precio: number | null; texto: string | null }): string {
  if (t.precio !== null && t.precio !== undefined) return `${t.precio} €`;
  return t.texto ?? '';
}
