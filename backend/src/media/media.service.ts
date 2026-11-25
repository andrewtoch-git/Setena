import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, isValidObjectId, mongo, Types } from 'mongoose';
import { Readable } from 'stream';

// Driver de MongoDB que trae Mongoose (evita mezclar dos versiones del paquete mongodb).
const { GridFSBucket, ObjectId } = mongo;
type GridFSBucket = InstanceType<typeof GridFSBucket>;

export const TIPOS_IMAGEN = ['image/jpeg', 'image/png'] as const;
export const MAX_IMAGEN = 10 * 1024 * 1024; // «JPG o PNG, hasta 10 MB» (wireframe)

export interface MetadatosArchivo {
  userId?: string;
  ficticio?: boolean;
}

/** Fotos guardadas en MongoDB (GridFS, colección media.files / media.chunks). */
@Injectable()
export class MediaService implements OnModuleInit {
  private bucket!: GridFSBucket;

  constructor(@InjectConnection() private readonly conexion: Connection) {}

  onModuleInit() {
    this.bucket = new GridFSBucket(this.conexion.db!, { bucketName: 'media' });
  }

  async guardar(
    datos: Buffer,
    nombre: string,
    tipo: string,
    metadatos: MetadatosArchivo = {},
  ): Promise<Types.ObjectId> {
    const subida = this.bucket.openUploadStream(nombre, {
      metadata: { ...metadatos, contentType: tipo },
    });
    await new Promise<void>((resolve, reject) => {
      Readable.from(datos)
        .pipe(subida)
        .on('finish', resolve)
        .on('error', reject);
    });
    return new Types.ObjectId(subida.id.toString());
  }

  async leer(id: string) {
    if (!isValidObjectId(id))
      throw new NotFoundException('Archivo no encontrado');
    const _id = new ObjectId(id);
    const [archivo] = await this.bucket.find({ _id }).toArray();
    if (!archivo) throw new NotFoundException('Archivo no encontrado');
    const meta = archivo.metadata as { contentType?: string } | undefined;
    return {
      tipo: meta?.contentType ?? 'application/octet-stream',
      tamano: archivo.length,
      flujo: this.bucket.openDownloadStream(_id),
    };
  }

  async borrar(id: Types.ObjectId | null | undefined) {
    if (!id) return;
    try {
      await this.bucket.delete(new ObjectId(id.toString()));
    } catch {
      // ya no existía
    }
  }

  /** Borra todos los archivos cuyo metadato coincide (p. ej. los del seed o los de un usuario). */
  async borrarDonde(filtro: Record<string, unknown>) {
    const archivos = await this.bucket.find(filtro).toArray();
    await Promise.all(archivos.map((a) => this.bucket.delete(a._id)));
    return archivos.length;
  }
}
