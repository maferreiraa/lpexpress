# Express Landing Page — Apps Script Ready

## Messenger
Configured with:

https://m.me/430269683495305

## Contact form
The form no longer uses Formspree.

It now submits directly to this Google Apps Script Web App:

https://script.google.com/macros/s/AKfycby0CtCbZ_OGbamPHuMJfHPKe-csI0iljmB3uh23kIhPGxhpsHPda6q2YKtw9hefUrIgeQ/exec

The current form fields are:

- name
- email
- business
- message

Your Apps Script `doPost(e)` should read these values from `e.parameter`.

## Noemiah project image
The portfolio image is constrained by a fixed-height container and cropped using:

```css
object-fit: cover;
object-position: top center;
overflow: hidden;
```

This prevents the vertical screenshot from expanding the project card.

## Formspree
Removed from the active HTML and JavaScript integration.


## Meta Pixel

Pixel ID: `335141833824895`

Configured events:

- `PageView`: fired when the landing page loads.
- `Contact`: fired when a visitor clicks any Messenger CTA.
- `Lead`: fired after the contact form submission request is sent.

The Pixel base code is installed in `index.html`.
The `Contact` and `Lead` event logic is in `script.js`.
