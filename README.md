# Zendacom

Static marketing site — home, about, contact — hosted on GitHub Pages at
**[zendacom.com](https://zendacom.com)**.

No build step, no dependencies. Open `index.html` in a browser to preview locally; what you
see is exactly what ships.

## Files

```
index.html      Home — hero, Follow Our Journey, contact section
about.html      About
contact.html    Contact
404.html        Not-found page (GitHub Pages serves this automatically)
css/style.css   All styling. Design tokens are at the top in :root
js/script.js    Contact form handler
CNAME           Custom domain. Deleting this reverts to the github.io URL
.nojekyll       Stops GitHub running the files through Jekyll
```

## Editing

**Text** lives directly in the HTML — edit it there.

**Colours and type** are CSS custom properties at the top of `css/style.css`:

| Token | Default | Used for |
| --- | --- | --- |
| `--navy` | `#2a3756` | Home hero and contact band, SEND button on light pages |
| `--bone` | `#e3e3de` | About and Contact backgrounds, Follow Our Journey band |
| `--ink` | `#111111` | Text on bone |
| `--font-display` | Outfit | Headings and the wordmark |
| `--font-body` | Nunito Sans | Everything else |

Changing a font means editing the `--font-*` token **and** the Google Fonts `<link>` in the
`<head>` of each page.

## Swapping the photos

Images are currently hotlinked from Unsplash (free to use, no attribution required). To use
your own, drop files into an `images/` folder and replace the `src`:

```html
<!-- from -->
<img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1400&q=80&fm=jpg&fit=crop" alt="…">
<!-- to -->
<img src="images/hero-boardroom.jpg" alt="…">
```

| Where | Suggested filename | Subject |
| --- | --- | --- |
| `index.html` hero | `hero-boardroom.jpg` | Boardroom / office interior |
| `index.html` journey ×4 | `journey-1…4.jpg` | Portrait crops — 2nd and 4th render as ovals |
| `about.html` | `about-team.jpg` | Team, greenery |
| `contact.html` | `contact-exterior.jpg` | Building exterior, garden |

Keep the hero and about/contact images wide (~1400px) and the journey images portrait
(~500×700). Always update the `alt` text to describe the new photo.

## The contact form

GitHub Pages can't send mail, so the form composes a message and opens the visitor's own email
client, addressed to `zendacom.inc@outlook.com`.

Change the address in the `data-mailto` attribute on the `<form>` in **both** `index.html` and
`contact.html`. Nothing in `js/script.js` needs editing.

Worth knowing: this depends on the visitor having a mail client configured, and some clients
truncate long messages (the script caps the body at 1800 characters). If enquiries start
mattering, move to a form service — sign up with [Formspree](https://formspree.io), then on
both forms:

1. Add `action="https://formspree.io/f/YOUR_ID" method="POST"`
2. Remove `novalidate` and the `data-mailto` attribute
3. Delete the `<script src="js/script.js"></script>` tag

The field names (`firstName`, `lastName`, `email`, `message`) are already the conventional ones.

## Deploying

Pushing to `main` publishes. GitHub takes about a minute.

```bash
git add -A && git commit -m "Update site" && git push
```

### First-time setup

**1. Enable Pages** — Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`.

**2. Point DNS** at your registrar:

```
A      @      185.199.108.153
A      @      185.199.109.153
A      @      185.199.110.153
A      @      185.199.111.153
CNAME  www    beastonabun-dev.github.io
```

**3. Tick "Enforce HTTPS"** in Settings → Pages once GitHub has issued the certificate. This
can take up to 24 hours after DNS resolves, and the checkbox stays greyed out until it's ready.

> While DNS is still propagating, the `github.io` URL redirects to `zendacom.com` and both
> will look broken. That's expected and clears on its own. Open `index.html` locally to
> preview in the meantime.
