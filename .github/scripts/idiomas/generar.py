# Genera en/index.html y pt/index.html a partir de index.html (español) con las
# traducciones de textos.py. Uso: python3 .github/scripts/idiomas/generar.py
# Con --revisar (lo corre el CI) falla si falta traducir un texto o si las
# portadas no están al día. Al cambiar un texto de la portada en español, sumar o
# corregir su traducción en textos.py y volver a generar.
import re, os, sys
exec(open(os.path.join(os.path.dirname(__file__), 'textos.py')).read())
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))
REVISAR = '--revisar' in sys.argv
base = open('index.html').read()
URL = 'https://jpproyectos.com.uy'

def alternos():
    return (f'<link rel="alternate" hreflang="es" href="{URL}/">\n'
            f'<link rel="alternate" hreflang="en" href="{URL}/en">\n'
            f'<link rel="alternate" hreflang="pt" href="{URL}/pt">\n'
            f'<link rel="alternate" hreflang="x-default" href="{URL}/">\n')

def selector(actual):
    items = [('es', '/', 'ES', 'Español'), ('en', '/en', 'EN', 'English'), ('pt', '/pt', 'PT', 'Português')]
    links = ''.join(f'<a href="{h}" lang="{c}" hreflang="{c}" title="{t}"' + (' aria-current="page"' if c == actual else '') + f'>{e}</a>' for c, h, e, t in items)
    etiqueta = {'es': 'Idioma', 'en': 'Language', 'pt': 'Idioma'}[actual]
    return f'    <div class="idiomas" role="navigation" aria-label="{etiqueta}">{links}</div>\n'

CSS = '.idiomas { display: flex; gap: 2px; font: 500 13px/1 var(--mono); }\n.idiomas a { padding: 6px 7px; border-radius: 6px; text-decoration: none; color: var(--soft); }\n.idiomas a[aria-current] { color: var(--fg); background: var(--celeste-suave); }\n'

def preparar_es(html):
    # Portada en español: alternos, selector, CSS e idioma del formulario (idempotente).
    if 'hreflang="en"' not in html:
        html = html.replace('<link rel="canonical"', alternos() + '<link rel="canonical"', 1)
    if 'class="idiomas"' not in html:
        html = html.replace('    </nav>\n', '    </nav>\n' + selector('es'), 1)
    if '.idiomas {' not in html:
        html = html.replace('footer { padding-block', CSS + 'footer { padding-block', 1)
    if 'name="idioma"' not in html:
        html = html.replace('<form class="formulario" method="post" action="/api/contacto">', '<form class="formulario" method="post" action="/api/contacto">\n          <input type="hidden" name="idioma" value="es">', 1)
    return html

def traducir(html, idx, cod):
    faltan = []
    for t in T:
        if t[0] not in html: faltan.append(t[0][:70]); continue
        html = html.replace(t[0], t[idx])
    if faltan:
        sys.exit(f'[{cod}] textos que no están en index.html:\n  ' + '\n  '.join(faltan))
    html = html.replace('<html lang="es">', f'<html lang="{cod}">', 1)
    html = html.replace(f'<link rel="canonical" href="{URL}/">', f'<link rel="canonical" href="{URL}/{cod}">', 1)
    html = html.replace(f'<meta property="og:url" content="{URL}/">', f'<meta property="og:url" content="{URL}/{cod}">', 1)
    html = re.sub(r'(href|src)="(marca|capturas|pastillero)/', r'\1="/\2/', html)
    html = html.replace(selector('es'), selector(cod), 1)
    html = html.replace('name="idioma" value="es"', f'name="idioma" value="{cod}"', 1)
    return html

es = preparar_es(base)
salidas = {'index.html': es, 'en/index.html': traducir(es, 1, 'en'), 'pt/index.html': traducir(es, 2, 'pt')}
if REVISAR:
    viejas = [f for f, h in salidas.items() if not os.path.exists(f) or open(f).read() != h]
    if viejas:
        sys.exit('Portadas desactualizadas: ' + ', '.join(viejas) + '. Correr: python3 .github/scripts/idiomas/generar.py')
    print('Portadas en español, inglés y portugués al día.')
else:
    for f, h in salidas.items():
        os.makedirs(os.path.dirname(f) or '.', exist_ok=True)
        open(f, 'w').write(h)
    print('Portadas generadas: ' + ', '.join(salidas))
