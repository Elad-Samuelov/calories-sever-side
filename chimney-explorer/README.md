# Chimney Explorer

An interactive chimney and fireplace guide for showing clients, on a phone or tablet, how each part works and what you repair.

- **3 fireplace types:** Masonry Chimney, Wood-Burning Fireplace, Fireplace Insert
- **2 visual versions:** *Realistic* (shaded render) and *Illustrated* (clean diagram). Switch with the toggle in the top bar. Both versions have the same parts, text and galleries.
- **Part panels:** what the part is, common problems, what we do, and a Before/After gallery (side by side or slider)
- **Owner mode** (lock icon): edit every text, upload, label, caption, reorder and delete photos and videos, drag hotspots, use your own photo as the background, set a phone number and an optional PIN, and back up or restore everything
- Everything is saved in the browser's IndexedDB on the device. No server and no account needed.

## Run it

**Quickest:** open `dist/chimney-explorer.html` in Chrome, Edge or Firefox. It is a single self-contained file.

**Recommended for phones and tablets:** host the folder on any static host so it has a real web address and works offline:

```bash
# local test
cd chimney-explorer
python3 -m http.server 8080      # or: npx serve .
# then open http://localhost:8080
```

For use on site, drag the `chimney-explorer` folder onto [Netlify Drop](https://app.netlify.com/drop) (free), or use GitHub Pages. Open the address on the iPad or phone, then use **Share → Add to Home Screen**. After the first visit it works without a signal.

## Owner mode

1. Tap the lock icon (top right).
2. Open any part. Use **Edit text**, **Add Before** and **Add After**. Before and After items pair up in order.
3. In the diagram view: **Move hotspots** lets you drag the dots. **Use my own image** replaces the drawing with your own photo for that type and style. Then drag the dots onto the right spots.
4. **Settings** has the business name, phone number ("Call" button on every part), home text, owner PIN, and **Download backup** / **Restore from backup**.
5. Tap **Done** to return to the clean client view.

Uploads are stored on the device you upload them on. Use the backup file to copy everything to another device, and keep a copy safe.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | App shell |
| `css/app.css` | Styles |
| `js/content.js` | Default text for every part (owner edits override it) |
| `js/scenes.js` | Realistic and illustrated drawings, hit areas |
| `js/app.js` | App logic, storage, galleries, owner mode |
| `sw.js`, `manifest.webmanifest`, `icon-*.png` | Offline support and home-screen icon |
| `build.js` | `node build.js` bundles everything into `dist/chimney-explorer.html` |
