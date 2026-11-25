import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, QueryFilter, Types } from 'mongoose';
import { LUGARES, SERVICIOS } from '../common/catalogos';
import { Block, Favorite, Profile, ProfileDoc } from '../schemas';
import { ActualizarPerfilDto, BuscarPerfilesQuery, CrearPerfilDto, PerfilEditableDto } from './dto';
import { interpretarTexto, regexSinTildes } from './busqueda';

const oid = (id: string | Types.ObjectId) => new Types.ObjectId(id);

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private readonly perfiles: Model<Profile>,
    @InjectModel(Block.name) private readonly bloqueos: Model<Block>,
    @InjectModel(Favorite.name) private readonly favoritos: Model<Favorite>,
  ) {}

  // ---------- validación ----------
  private validar(datos: Partial<PerfilEditableDto>) {
    const errores: string[] = [];
    if (datos.zona !== undefined || datos.lugar !== undefined) {
      const lugares = datos.zona ? LUGARES[datos.zona as keyof typeof LUGARES] : undefined;
      if (!lugares || !datos.lugar || !lugares.includes(datos.lugar)) {
        errores.push('lugar: elige un distrito o municipio de la zona');
      }
    }
    if (datos.remunerados === false && datos.colaboraciones === false) {
      errores.push('tipo: elige al menos un tipo de proyecto');
    }
    if (datos.tarifas) {
      const claves = datos.tarifas.map((t) => t.servicio);
      if (new Set(claves).size !== claves.length) errores.push('tarifas: cada servicio solo puede aparecer una vez');
    }
    if (errores.length) throw new BadRequestException(errores);
  }

  private normalizarTarifas(tarifas: PerfilEditableDto['tarifas']) {
    return (tarifas ?? []).map((t) => ({
      servicio: t.servicio,
      precio: t.precio ?? null,
      texto: t.texto || null,
      unidad: SERVICIOS.find((s) => s.clave === t.servicio)?.unidad ?? null,
    }));
  }

  // ---------- escritura ----------
  async crear(userId: string, dto: CrearPerfilDto): Promise<ProfileDoc> {
    this.validar(dto);
    if (await this.perfiles.exists({ userId: oid(userId) })) {
      throw new ConflictException('Ya tienes un perfil');
    }
    return this.perfiles.create({ ...dto, userId: oid(userId), tarifas: this.normalizarTarifas(dto.tarifas) });
  }

  async actualizar(userId: string, dto: ActualizarPerfilDto): Promise<ProfileDoc> {
    const perfil = await this.perfiles.findOne({ userId: oid(userId) });
    if (!perfil) throw new NotFoundException('Todavía no has creado tu perfil');
    const combinado = {
      zona: dto.zona ?? perfil.zona,
      lugar: dto.lugar ?? (dto.zona && dto.zona !== perfil.zona ? undefined : perfil.lugar),
      remunerados: dto.remunerados ?? perfil.remunerados,
      colaboraciones: dto.colaboraciones ?? perfil.colaboraciones,
      tarifas: dto.tarifas,
    };
    this.validar(combinado);
    const { tarifas, redes, ...resto } = dto;
    perfil.set(resto);
    if (tarifas) perfil.tarifas = this.normalizarTarifas(tarifas) as Profile['tarifas'];
    if (redes) perfil.set('redes', { ...perfil.toObject().redes, ...redes });
    perfil.ultimaActividadAt = new Date();
    return perfil.save();
  }

  async tocarActividad(userId: string) {
    await this.perfiles.updateOne({ userId: oid(userId) }, { ultimaActividadAt: new Date() });
  }

  // ---------- lectura ----------
  async porUsuario(userId: string) {
    return this.perfiles.findOne({ userId: oid(userId) });
  }

  async porId(perfilId: string) {
    if (!isValidObjectId(perfilId)) return null;
    return this.perfiles.findById(perfilId);
  }

  /** userIds con los que no debe haber contacto: a quien he bloqueado y quien me ha bloqueado. */
  async usuariosOcultos(viewerId?: string): Promise<Types.ObjectId[]> {
    if (!viewerId) return [];
    const yo = oid(viewerId);
    const filas = await this.bloqueos.find({ $or: [{ userId: yo }, { bloqueadoId: yo }] }).lean();
    return filas.map((b) => (b.userId.equals(yo) ? b.bloqueadoId : b.userId));
  }

  async hayBloqueo(a: string | Types.ObjectId, b: string | Types.ObjectId) {
    return !!(await this.bloqueos.exists({
      $or: [{ userId: oid(a), bloqueadoId: oid(b) }, { userId: oid(b), bloqueadoId: oid(a) }],
    }));
  }

  async buscar(q: BuscarPerfilesQuery, viewerId?: string) {
    const texto = interpretarTexto(q.q);
    const roles = [...new Set([...(q.roles ?? []), ...texto.roles])];
    const generos = [...new Set([...(q.generos ?? []), ...texto.generos])];
    const zonas = [...new Set([...(q.zonas ?? []), ...texto.zonas])];
    const disponibilidad = [...new Set([...(q.disponibilidad ?? []), ...texto.disponibilidad])];
    const tipos = q.tipos ?? [];

    const ocultos = await this.usuariosOcultos(viewerId);
    if (viewerId) ocultos.push(oid(viewerId)); // tu propio perfil no sale en Explorar

    const filtro: QueryFilter<Profile> = {};
    const y: QueryFilter<Profile>[] = [];
    if (ocultos.length) filtro.userId = { $nin: ocultos };
    if (roles.length) filtro.roles = { $in: roles };
    if (generos.length) filtro.generos = { $in: generos };
    if (zonas.length) filtro.zona = { $in: zonas };
    if (disponibilidad.length) filtro.disponibilidad = { $in: disponibilidad };
    if (tipos.length) y.push({ $or: tipos.map((t) => ({ [t]: true })) });
    for (const palabra of texto.palabras) {
      const re = regexSinTildes(palabra);
      y.push({ $or: [{ nombre: re }, { lugar: re }, { sobreMi: re }, { roles: re }, { generos: re }] });
    }
    if (y.length) filtro.$and = y;

    const [total, docs] = await Promise.all([
      this.perfiles.countDocuments(filtro),
      this.perfiles
        .find(filtro)
        .sort({ ultimaActividadAt: -1, _id: 1 })
        .skip((q.pagina - 1) * q.porPagina)
        .limit(q.porPagina),
    ]);
    const favs = await this.idsFavoritos(viewerId, docs.map((d) => d._id));
    return {
      total,
      pagina: q.pagina,
      porPagina: q.porPagina,
      filtrosAplicados: { roles, generos, zonas, disponibilidad, tipos, texto: texto.palabras },
      resultados: docs.map((d) => this.tarjeta(d, favs.has(d.id))),
    };
  }

  async detalle(perfilId: string, viewerId?: string) {
    const perfil = await this.porId(perfilId);
    if (!perfil) throw new NotFoundException('Este perfil no está disponible');
    const esPropio = !!viewerId && perfil.userId.equals(viewerId);
    let bloqueadoPorMi = false;
    if (viewerId && !esPropio) {
      const [yoBloqueo, meBloquea] = await Promise.all([
        this.bloqueos.exists({ userId: oid(viewerId), bloqueadoId: perfil.userId }),
        this.bloqueos.exists({ userId: perfil.userId, bloqueadoId: oid(viewerId) }),
      ]);
      if (meBloquea) throw new NotFoundException('Este perfil no está disponible');
      bloqueadoPorMi = !!yoBloqueo;
    }
    const favs = await this.idsFavoritos(viewerId, [perfil._id]);
    return { ...this.ficha(perfil), esFavorito: favs.has(perfil.id), esPropio, bloqueadoPorMi };
  }

  async idsFavoritos(viewerId: string | undefined, perfilIds: Types.ObjectId[]): Promise<Set<string>> {
    if (!viewerId || !perfilIds.length) return new Set();
    const filas = await this.favoritos.find({ userId: oid(viewerId), profileId: { $in: perfilIds } }).lean();
    return new Set(filas.map((f) => f.profileId.toString()));
  }

  // ---------- serialización ----------
  tarjeta(p: ProfileDoc, esFavorito = false) {
    const principal = p.media.find((m) => m.principal) ?? p.media[0];
    return {
      id: p.id as string,
      nombre: p.nombre,
      roles: p.roles,
      generos: p.generos,
      zona: p.zona,
      lugar: p.lugar,
      disponibilidad: p.disponibilidad,
      remunerados: p.remunerados,
      colaboraciones: p.colaboraciones,
      ultimaActividadAt: p.ultimaActividadAt,
      avatarId: p.avatarId,
      principal: principal ? { tipo: principal.tipo, titulo: principal.titulo, miniaturaId: principal.miniaturaId } : null,
      esFavorito,
    };
  }

  ficha(p: ProfileDoc) {
    const { esFavorito: _omitir, ...base } = this.tarjeta(p);
    return {
      ...base,
      userId: p.userId.toString(),
      sobreMi: p.sobreMi,
      tarifas: p.tarifas.map((t) => {
        const s = SERVICIOS.find((x) => x.clave === t.servicio);
        return { servicio: t.servicio, nombre: s?.nombre, descripcion: s?.descripcion, unidad: t.unidad, precio: t.precio, texto: t.texto };
      }),
      redes: p.redes,
      media: p.media.map((m) => ({ tipo: m.tipo, titulo: m.titulo, archivoId: m.archivoId, miniaturaId: m.miniaturaId, principal: m.principal })),
    };
  }
}
