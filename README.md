# Vision Production — Page Services

Page "Services" statique (HTML/CSS/JS, sans framework) qui reprend fidèlement
le design system du site en ligne (https://vision-production-seven.vercel.app) :
fond sombre `#0b0b0c`, accent rouge `#df062a`, typographie Manrope/DM Mono,
nav en `mix-blend-mode: difference`, hover des liens en split-text, reveal au
scroll, et boutons à balayage lumineux — tous les tokens ont été extraits
directement du site déployé.

## Structure

```
src/
  index.html    page complète (nav, hero, index des 4 services, sections
                détaillées, processus, CTA, footer)
  styles.css    design tokens + composants + animations
  script.js     reveal au scroll (IntersectionObserver), menu mobile,
                spotlight curseur, parallax léger, compteurs animés
assets/
  images/       photos réutilisées du projet vision-hero (tunnel-web)
  logo-vision-production.svg
serve.py        petit serveur statique de secours (évite os.getcwd(),
                cassé dans certains environnements sandboxés)
```

## Tester en local

```bash
cd vision-services
python3 serve.py
```

Puis ouvrir `http://localhost:8643/src/index.html`.

(Alternative si `serve.py` n'est pas nécessaire chez toi :
`python3 -m http.server 8643` depuis la racine `vision-services/`.)

## Contenu

Les 4 services repris et détaillés à partir de la page d'accueil :

1. **Production vidéo** — délai 2–4 semaines
2. **Photographie professionnelle** — délai 1–2 semaines
3. **Conception de site web** (SEO & GEO) — délai 2–4 semaines
4. **Campagnes publicitaires** (Meta/TikTok/Google) — délai 1–3 semaines

Chaque service a : une ligne dans l'index rapide (avec aperçu photo au survol),
puis une section détaillée pleine page (image + liste de livrables + délai +
CTA "Demander une soumission").

## Animations dynamiques

- **Reveal au scroll** : fade + translateY, staggered via `--reveal-delay`,
  identique au `.site-reveal` du site en ligne.
- **Nav hover "split text"** : les liens du menu ont un hover qui fait glisser
  le texte vers le haut (deux `<span>` empilés).
- **Boutons à balayage** : un reflet lumineux traverse le bouton au survol,
  léger lift + ombre.
- **Marquee infini** sous le hero (liste des 4 expertises en boucle).
- **Spotlight curseur** : lueur rouge qui suit la souris dans le hero et le CTA.
- **Parallax léger** sur les photos des sections détaillées.
- **Compteurs animés** (+100 clients, +15M vues) au moment où ils entrent
  dans le viewport.
- Tout est désactivé proprement si `prefers-reduced-motion: reduce`.

## Intégration dans Vercel

Le projet en ligne est probablement en Next.js (routes `/portfolio`, `/#ancre`
observées). Deux options pour l'ajouter :

1. **Comme route statique** : copier `src/index.html` (renommé `services.html`
   ou converti en page) + `styles.css`/`script.js`/`assets/` dans `public/`
   ou dans le dossier de routes du projet Next.js existant, en adaptant les
   liens `/`, `/#contact`, `/portfolio` (déjà écrits en chemins absolus pour
   coller à la nav réelle du site).
2. **Comme composant Next.js** : reprendre les sections HTML de `src/index.html`
   et les convertir en JSX dans une nouvelle page `app/services/page.tsx` (ou
   `pages/services.tsx`), en réutilisant le `Header`/`Footer` déjà existants
   dans le projet plutôt que ceux de ce prototype, et en import
   ant `styles.css` comme module ou en portant les classes vers le système
   de style du projet (Tailwind, CSS modules, etc. selon le cas).

Dans les deux cas, remplacer `mailto:info@visionproduction.ca` par la vraie
adresse et brancher le lien "PLANIFIER UN PREMIER APPEL" sur le vrai composant
de prise de rendez-vous du site (visible sur la page d'accueil, section contact).

