# Express Landing Page — Setup

## Files
- `index.html`
- `style.css`
- `script.js`

## 1. Configure Messenger
Open `script.js` and replace:

```js
const MESSENGER_USERNAME = "SEU_USUARIO_AQUI";
```

with your Facebook/Messenger username, without `@`.

Example:

```js
const MESSENGER_USERNAME = "mfxcreativee";
```

The page will automatically generate:

```text
https://m.me/mfxcreativee
```

for every Messenger button.

## 2. Configure Formspree
1. Create a free form at Formspree.
2. Copy your endpoint, such as:

```text
https://formspree.io/f/abcxyzpq
```

3. Open `index.html`.
4. Find:

```html
action="https://formspree.io/f/YOUR_FORM_ID"
```

5. Replace `YOUR_FORM_ID` with your real Formspree form ID.

No backend is required.

## 3. Configure SEO and Open Graph
In `index.html`, replace:

```html
https://YOUR-DOMAIN.com/
```

with the final domain.

Also replace:

```html
https://YOUR-DOMAIN.com/assets/og-preview.jpg
```

with the final URL of your social sharing image.

## 4. Optional guarantee
There is a commented-out guarantee block inside `index.html`.

Only remove the HTML comments if you are fully prepared to honour this statement:

```text
72h delivery or your money back on the first milestone.
```

## 5. Publish on GitHub Pages
Upload the files to the root of your GitHub repository:

```text
index.html
style.css
script.js
```

Then activate GitHub Pages under:

```text
Settings → Pages → Deploy from a branch
```

Select the main branch and root folder.


## Recent work section
- Sua Voz, Seu Poder — https://noemiahalvez.com/
- MFX Creativee — https://mfxcreativee.com.br/
- Alçar Serviços Elétricos — private project, without a public link
