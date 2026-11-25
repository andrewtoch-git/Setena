import json, random, sys, os

OUT = sys.argv[1]
random.seed(20261125)

ROLES = ['Cantante', 'Corista', 'Piano', 'Teclado', 'Guitarra', 'Bajo', 'Batería', 'Percusión', 'Saxofón', 'Trompeta', 'Trombón', 'Flauta', 'Clarinete', 'Violín', 'Violonchelo', 'Contrabajo', 'Acordeón', 'Arpa', 'DJ', 'Productor/a musical', 'Beatmaker', 'Compositor/a', 'Arreglista', 'Otros']
GENEROS = ['Pop', 'Rock', 'Indie', 'Alternativo', 'Metal', 'Punk', 'Reggae', 'Ska', 'Dub', 'Dancehall', 'Soul', 'R&B', 'Funk', 'Jazz', 'Blues', 'Hip-Hop', 'Rap', 'Electrónica', 'House', 'Techno', 'Drum & Bass', 'Disco', 'Clásica', 'Flamenco', 'Salsa', 'Merengue', 'Bachata', 'Reguetón', 'Latin Pop', 'Cumbia', 'Tango', 'Folk', 'Country', 'Gospel', 'Música experimental', 'Otros']
DISP = ['Inmediata', 'El próximo fin de semana', 'Esta semana', 'La próxima semana', 'Este mes']
ZONAS = ['Barcelona ciudad', 'Alrededores']
TIPOS = ['Proyectos remunerados', 'Colaboraciones gratuitas']
MOTIVOS = ['Perfil falso o suplantación', 'Contenido inapropiado', 'Spam o publicidad', 'Otro motivo']
SERVICIOS = [
    {'clave': 'bolo', 'nombre': 'Bolo / Directo', 'descripcion': 'Conciertos y eventos', 'unidad': 'por actuación'},
    {'clave': 'grabacion', 'nombre': 'Grabación', 'descripcion': 'Instrumentos y voces', 'unidad': 'por hora'},
    {'clave': 'composicion', 'nombre': 'Composición', 'descripcion': 'Canciones y melodías', 'unidad': 'por proyecto'},
    {'clave': 'otros', 'nombre': 'Otros', 'descripcion': 'Servicios adicionales', 'unidad': None},
]
# Listas cerradas del wireframe (Registro / Editar perfil: const LUG)
BARRIOS = ['Ciutat Vella', 'Eixample', 'Sants-Montjuïc', 'Les Corts', 'Sarrià-Sant Gervasi', 'Gràcia', 'Horta-Guinardó', 'Nou Barris', 'Sant Andreu', 'Sant Martí']
ALREDEDORES = ["L'Hospitalet de Llobregat", 'Badalona', 'Santa Coloma de Gramenet', 'Sant Adrià de Besòs', 'Esplugues de Llobregat', 'Cornellà de Llobregat', 'El Prat de Llobregat', 'Sant Just Desvern', 'Montcada i Reixac', 'Sant Cugat del Vallès']


def tarifas(bolo, grab, comp, otros):
    def t(clave, v):
        s = next(x for x in SERVICIOS if x['clave'] == clave)
        if v is None:
            return None
        if isinstance(v, str):
            return {'servicio': clave, 'precio': None, 'unidad': s['unidad'], 'texto': v}
        return {'servicio': clave, 'precio': v, 'unidad': s['unidad'], 'texto': None}
    out = [t('bolo', bolo), t('grabacion', grab), t('composicion', comp)]
    if otros:
        out.append({'servicio': 'otros', 'precio': None, 'unidad': None, 'texto': otros})
    return [x for x in out if x]


def redes(**kw):
    # Enlaces ficticios en example.com: no apuntar nunca a cuentas reales de terceros.
    out = {}
    for k in ['instagram', 'youtube', 'spotify', 'tiktok', 'soundcloud']:
        v = kw.get(k)
        out[k] = ('https://example.com/' + k + '/' + v.rstrip('/').split('/')[-1].lstrip('@')) if v else None
    return out


# --- 7 perfiles del wireframe (contenido literal de las pantallas) ---
WF = [
    dict(clave='alex', nombre='Alex Martín', email='alex.martin@example.com', demo=True,
         roles=['Piano'], generos=['Jazz', 'Soul'], zona='Barcelona ciudad', lugar='Eixample',
         disponibilidad=['Esta semana', 'El próximo fin de semana'], remunerados=True, colaboraciones=True,
         sobreMi='Pianista de jazz y soul. Toco en directo y doy clases. Busco banda para proyectos remunerados.',
         tarifas=tarifas(150, 35, 300, 'Clases de piano: 25 € la hora'),
         redes=redes(instagram='instagram.com/alexmartin.piano', youtube='youtube.com/@alexmartinpiano', spotify='open.spotify.com/artist/alexmartin', tiktok='tiktok.com/@alexmartin.piano', soundcloud='soundcloud.com/alexmartin'),
         media=[{'tipo': 'video', 'titulo': 'Directo con trío de jazz', 'miniatura': 'alex-martin-trio-card.jpg', 'principal': True},
                {'tipo': 'video', 'titulo': 'Jam session', 'miniatura': 'alex-martin-card.jpg', 'principal': False}],
         avatar='alex-martin-avatar.jpg', ultimaActividadMin=0),
    dict(clave='laia', nombre='Laia Serra', email='laia.serra@example.com',
         roles=['Cantante'], generos=['Pop', 'Soul'], zona='Barcelona ciudad', lugar='Sant Martí',
         disponibilidad=['Esta semana', 'El próximo fin de semana'], remunerados=True, colaboraciones=True,
         sobreMi='Cantante de pop y soul. Hago directos con banda y colaboro en grabaciones de estudio.',
         tarifas=tarifas(150, 35, 300, 'Coros para grabaciones: 40 € por canción'),
         redes=redes(instagram='instagram.com/laiaserra', youtube='youtube.com/@laiaserra', spotify='open.spotify.com/artist/laiaserra', tiktok='tiktok.com/@laiaserra'),
         media=[{'tipo': 'video', 'titulo': 'Directo con banda', 'miniatura': 'laia-serra-card.jpg', 'principal': True},
                {'tipo': 'video', 'titulo': 'Versión acústica', 'miniatura': None, 'principal': False},
                {'tipo': 'foto', 'titulo': 'Foto en el escenario', 'miniatura': None, 'principal': False}],
         avatar='laia-serra-avatar.jpg', ultimaActividadMin=60),
    dict(clave='marc', nombre='Marc Soler', email='marc.soler@example.com',
         roles=['Piano'], generos=['Jazz', 'Clásica'], zona='Alrededores', lugar="L'Hospitalet de Llobregat",
         disponibilidad=['La próxima semana', 'Este mes'], remunerados=True, colaboraciones=True,
         sobreMi='Pianista de formación clásica. Toco jazz en trío y acompaño a cantantes en directo.',
         tarifas=tarifas(180, 40, 350, 'Acompañamiento en bodas: a consultar'),
         redes=redes(youtube='youtube.com/@marcsoler', soundcloud='soundcloud.com/marcsoler'),
         media=[{'tipo': 'video', 'titulo': 'Trío de jazz en directo', 'miniatura': 'marc-soler-card.jpg', 'principal': True},
                {'tipo': 'video', 'titulo': 'Pieza clásica', 'miniatura': None, 'principal': False},
                {'tipo': 'foto', 'titulo': 'Foto en el estudio', 'miniatura': None, 'principal': False}],
         avatar='marc-soler-avatar.jpg', ultimaActividadMin=1440),
    dict(clave='marta', nombre='Marta Ruiz', email='marta.ruiz@example.com',
         roles=['Guitarra'], generos=['Rock', 'Indie'], zona='Barcelona ciudad', lugar='Gràcia',
         disponibilidad=['El próximo fin de semana', 'Este mes'], remunerados=True, colaboraciones=True,
         sobreMi='Guitarrista con diez años tocando en bandas de rock e indie. Disponible para directos y grabaciones.',
         tarifas=tarifas(120, 30, 250, 'Clases de guitarra: 20 € la hora'),
         redes=redes(instagram='instagram.com/martaruiz.guitar', youtube='youtube.com/@martaruiz', spotify='open.spotify.com/artist/martaruiz'),
         media=[{'tipo': 'video', 'titulo': 'Directo con banda', 'miniatura': 'marta-ruiz-card.jpg', 'principal': True},
                {'tipo': 'video', 'titulo': 'Ensayo en el local', 'miniatura': None, 'principal': False},
                {'tipo': 'foto', 'titulo': 'Foto con su guitarra', 'miniatura': None, 'principal': False}],
         avatar='marta-ruiz-avatar.jpg', ultimaActividadMin=120),
    dict(clave='jordi', nombre='Jordi Puig', email='jordi.puig@example.com',
         roles=['Batería'], generos=['Rock', 'Funk'], zona='Barcelona ciudad', lugar='Sants-Montjuïc',
         disponibilidad=['Inmediata', 'Esta semana'], remunerados=True, colaboraciones=False,
         sobreMi='Batería de rock y funk. Toco con dos bandas y hago sustituciones de última hora.',
         tarifas=tarifas(130, 30, 'A convenir', 'Ensayos con banda: 15 € la hora'),
         redes=redes(instagram='instagram.com/jordipuig.drums', youtube='youtube.com/@jordipuig'),
         media=[{'tipo': 'video', 'titulo': 'Solo de batería', 'miniatura': 'jordi-puig-card.jpg', 'principal': True},
                {'tipo': 'video', 'titulo': 'Directo con banda de funk', 'miniatura': None, 'principal': False},
                {'tipo': 'foto', 'titulo': 'Foto en el local de ensayo', 'miniatura': None, 'principal': False}],
         avatar='jordi-puig-avatar.jpg', ultimaActividadMin=10),
    dict(clave='nuria', nombre='Núria Font', email='nuria.font@example.com',
         roles=['DJ'], generos=['Electrónica', 'House'], zona='Alrededores', lugar='Cornellà de Llobregat',
         disponibilidad=['Inmediata', 'Este mes'], remunerados=True, colaboraciones=True,
         sobreMi='DJ de electrónica y house. Pincho en fiestas y eventos privados y produzco mis propios temas.',
         tarifas=tarifas(200, 40, 300, 'Remezclas: a consultar'),
         redes=redes(instagram='instagram.com/nuriafont.dj', soundcloud='soundcloud.com/nuriafont', tiktok='tiktok.com/@nuriafont'),
         media=[{'tipo': 'video', 'titulo': 'Sesión en directo', 'miniatura': 'nuria-font-card.jpg', 'principal': True},
                {'tipo': 'video', 'titulo': 'Mezcla en el estudio', 'miniatura': None, 'principal': False},
                {'tipo': 'foto', 'titulo': 'Foto pinchando en una fiesta', 'miniatura': None, 'principal': False}],
         avatar='nuria-font-avatar.jpg', ultimaActividadMin=180),
    dict(clave='pau', nombre='Pau Vidal', email='pau.vidal@example.com',
         roles=['Teclado'], generos=['Pop', 'Electrónica'], zona='Alrededores', lugar='Badalona',
         disponibilidad=[], remunerados=False, colaboraciones=True,
         sobreMi=None, tarifas=[], redes=redes(),
         media=[{'tipo': 'video', 'titulo': 'Vídeo de presentación', 'miniatura': 'pau-vidal-card.jpg', 'principal': True}],
         avatar='pau-vidal-avatar.jpg', ultimaActividadMin=7200,
         nota='Perfil mínimo del wireframe (Perfil-musico-incompleto): sin «Sobre mí», disponibilidad, redes ni tarifas.'),
]
for p in WF:
    p['origen'] = 'wireframe'

# --- perfiles adicionales: ficticios, generados para probar búsqueda y filtros ---
NOMBRES = ['Clara Bosch', 'Pol Ferrer', 'Aina Roca', 'Biel Costa', 'Júlia Mas', 'Oriol Vila', 'Carla Pons', 'Arnau Soler', 'Mireia Camps',
           'Sergi Riera', 'Ona Puig', 'Dani Torres', 'Lucía Romero', 'Iván Navarro', 'Irene Molina', 'Hugo Ortega', 'Elena Castro',
           'Álvaro Gil', 'Noa Sanz', 'Rubén Marín', 'Paula Ibáñez', 'Martí Valls', 'Bruna Sala', 'Gerard Font', 'Sofía Herrera']
PLAN = [  # (roles, géneros): cubren los 7 chips rápidos con ≥3 perfiles y parte del resto de la lista
    (['Guitarra'], ['Blues', 'Rock']), (['Guitarra', 'Compositor/a'], ['Flamenco']), (['Bajo'], ['Funk', 'Soul']),
    (['Bajo'], ['Jazz']), (['Bajo', 'Contrabajo'], ['Jazz', 'Blues']), (['Batería'], ['Metal', 'Punk']),
    (['Batería', 'Percusión'], ['Salsa', 'Cumbia']), (['Cantante'], ['R&B', 'Soul']), (['Cantante', 'Corista'], ['Gospel', 'Pop']),
    (['Teclado'], ['Funk', 'Disco']), (['Teclado', 'Arreglista'], ['Pop', 'Latin Pop']), (['DJ'], ['Techno']),
    (['DJ', 'Productor/a musical'], ['Drum & Bass', 'Electrónica']), (['Piano'], ['Clásica']), (['Saxofón'], ['Jazz', 'Funk']),
    (['Trompeta'], ['Ska', 'Reggae']), (['Violín'], ['Folk', 'Clásica']), (['Violonchelo'], ['Clásica', 'Música experimental']),
    (['Beatmaker'], ['Hip-Hop', 'Rap']), (['Flauta', 'Clarinete'], ['Folk', 'Jazz']), (['Acordeón'], ['Tango', 'Folk']),
    (['Productor/a musical'], ['Reguetón', 'Dancehall']), (['Cantante'], ['Flamenco', 'Bachata']), (['Trombón'], ['Salsa', 'Ska']),
    (['Guitarra'], ['Indie', 'Alternativo']),
]
FRASE = {
    'Guitarra': 'Guitarrista', 'Bajo': 'Bajista', 'Batería': 'Batería', 'Cantante': 'Cantante', 'Teclado': 'Teclista', 'DJ': 'DJ',
    'Piano': 'Pianista', 'Saxofón': 'Saxofonista', 'Trompeta': 'Trompetista', 'Violín': 'Violinista', 'Violonchelo': 'Violonchelista',
    'Beatmaker': 'Beatmaker', 'Flauta': 'Flautista', 'Acordeón': 'Acordeonista', 'Productor/a musical': 'Productor/a', 'Trombón': 'Trombonista',
}
VIDEO_T = ['Directo en sala', 'Sesión de estudio', 'Ensayo con banda', 'Versión acústica', 'Grabación en casa', 'Concierto al aire libre']

extra = []
for i, (nombre, (roles, gens)) in enumerate(zip(NOMBRES, PLAN)):
    zona = ZONAS[0] if random.random() < 0.6 else ZONAS[1]
    lugar = random.choice(BARRIOS if zona == ZONAS[0] else ALREDEDORES)
    disp = sorted(random.sample(DISP, random.choice([1, 2, 2, 3])), key=DISP.index)
    rem = random.random() < 0.8
    col = (not rem) or random.random() < 0.6
    base = random.choice([90, 100, 120, 140, 160, 180, 220])
    t = tarifas(base, random.choice([20, 25, 30, 35, 40, 45]),
                random.choice([200, 250, 300, 400, 'A convenir']) if random.random() < 0.7 else None,
                None) if rem else []
    clave = nombre.split()[0].lower().translate(str.maketrans('áéíóúàèòïüç', 'aeiouaeoiuc')) + str(i + 1)
    sobre = f"{FRASE.get(roles[0], roles[0])} de {' y '.join(g.lower() if g not in ('R&B', 'Hip-Hop') else g for g in gens)}. " + random.choice([
        'Busco proyectos estables en Barcelona.', 'Hago directos y grabaciones.', 'Disponible para sustituciones.',
        'Me interesa colaborar con bandas nuevas.', 'Toco en bodas, fiestas y eventos.'])
    extra.append(dict(
        clave=clave, nombre=nombre, email=f"{clave}@example.com", roles=roles, generos=gens, zona=zona, lugar=lugar,
        disponibilidad=disp, remunerados=rem, colaboraciones=col, sobreMi=sobre, tarifas=t,
        redes=redes(instagram=f"instagram.com/{clave}") if random.random() < 0.7 else redes(),
        media=[{'tipo': 'video', 'titulo': random.choice(VIDEO_T), 'miniatura': None, 'principal': True}],
        avatar=None, ultimaActividadMin=random.choice([5, 30, 90, 240, 600, 1440, 2880, 10080]), origen='generado'))

perfiles = WF + extra
for p in perfiles:
    p['ficticio'] = True
    assert p['lugar'] in (BARRIOS if p['zona'] == ZONAS[0] else ALREDEDORES), p['lugar']
    assert all(r in ROLES for r in p['roles']) and all(g in GENEROS for g in p['generos']) and all(d in DISP for d in p['disponibilidad'])

usuarios = [{'clave': p['clave'], 'email': p['email'], 'nombre': p['nombre'], 'proveedor': 'email', 'demo': bool(p.get('demo')),
             'ajustes': {'notifMensajes': True, 'notifNovedades': False}} for p in perfiles]
for p in perfiles:
    p.pop('email', None); p.pop('demo', None)

favoritos = [{'usuario': 'alex', 'perfil': k} for k in ['laia', 'marc', 'marta']]

conversaciones = [
    {'participantes': ['alex', 'jordi'], 'mensajes': [
        {'de': 'jordi', 'texto': 'Hola, he visto tu perfil. ¿Te interesa tocar en un concierto el viernes?', 'haceMin': 50, 'leido': True},
        {'de': 'alex', 'texto': '¡Hola! Sí, cuéntame más.', 'haceMin': 45, 'leido': True},
        {'de': 'jordi', 'texto': 'Es en la sala Apolo, repertorio de rock. Es un proyecto remunerado.', 'haceMin': 40, 'leido': True},
        {'de': 'alex', 'texto': 'Perfecto. ¿Tienes disponibilidad el sábado para ensayar?', 'haceMin': 36, 'leido': True}]},
    {'participantes': ['alex', 'nuria'], 'mensajes': [
        {'de': 'nuria', 'texto': '¿Cuánto cobras por bolo?', 'haceMin': 20, 'leido': False}]},
    {'participantes': ['alex', 'laia'], 'mensajes': [
        {'de': 'laia', 'texto': 'Te paso las partituras esta tarde', 'haceMin': 300, 'leido': True}]},
    {'participantes': ['alex', 'marc'], 'mensajes': [
        {'de': 'marc', 'texto': 'Nos vemos en el ensayo', 'haceMin': 1500, 'leido': True}]},
    {'participantes': ['alex', 'pau'], 'mensajes': [
        {'de': 'pau', 'texto': 'Gracias, te escribo cuando tenga la fecha del ensayo', 'haceMin': 4320, 'leido': True}]},
]

catalogos = {'roles': ROLES, 'generos': GENEROS, 'disponibilidad': DISP, 'zonas': ZONAS, 'lugares': {ZONAS[0]: BARRIOS, ZONAS[1]: ALREDEDORES}, 'tiposProyecto': TIPOS,
             'servicios': SERVICIOS, 'motivosDenuncia': MOTIVOS, 'chipsRapidos': ['Guitarra', 'Piano', 'Teclado', 'Cantante', 'Bajo', 'Batería', 'DJ'],
             'redes': ['instagram', 'youtube', 'spotify', 'tiktok', 'soundcloud']}

for name, data in [('catalogos', catalogos), ('usuarios', usuarios), ('perfiles', perfiles), ('favoritos', favoritos), ('conversaciones', conversaciones)]:
    with open(os.path.join(OUT, name + '.json'), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
from collections import Counter
print(len(perfiles), Counter(r for p in perfiles for r in p['roles'] if r in catalogos['chipsRapidos']))
