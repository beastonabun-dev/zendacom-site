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
thanks.html     Confirmation page for the no-JavaScript submit path
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

Submissions go through [Web3Forms](https://web3forms.com), which emails each one to the address
registered against your access key. No server or backend code to run. Their free tier covers
250 submissions/month with no credit card.

### Setting the access key

The forms currently ship with a placeholder and **will not send until you replace it**.

1. Go to [web3forms.com](https://web3forms.com) and enter the address you want enquiries sent
   to. You will need to **verify that address by email** before the key is issued, and signing
   up agrees to their terms and to marketing contact — so this step has to be done by whoever
   owns the mailbox.
2. Replace `REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY` with the key (a UUID) in **both**
   `index.html` and `contact.html`.
3. Commit and push.

Until then, clicking Send shows an inline message saying the form isn't connected yet, rather
than failing silently.

The key is not a secret in the usual sense — it ships in public HTML by design, and only
authorises sending mail to the address it was registered against. Rotate it from the Web3Forms
dashboard if it ever attracts spam.

### How it works

Each form is an ordinary HTML `POST`, so it still works with JavaScript disabled — the browser
posts, Web3Forms emails it on, and the visitor lands on `thanks.html`. `js/script.js` is a
progressive enhancement that submits the same data with `fetch` so the visitor stays on the page
and sees an inline confirmation instead.

To change where mail goes, register a new key against the new address — nothing in the JS needs
editing. The `data-fallback-email` attribute on each form is only used in the error message shown
if a submission fails.

A hidden `botcheck` honeypot field catches the simplest spam bots. Leave it in place.

### Switching to a different service

The field names (`firstName`, `lastName`, `email`, `message`) are conventional, so moving to
Formspree or similar means changing the `action` URL and swapping the `access_key` hidden input
for whatever that service uses. The `fetch` handler keys off `form[action*="web3forms"]`, so
update that selector too, or drop `js/script.js` entirely and let the plain POST do the work.

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
