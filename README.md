# Sound Simulations Site

This repository hosts the static site for the Sound simulations homepage (`index.html`) and the two interactive labs (`instruments.html` and `ear.html`). You can preview changes locally by opening the HTML files in your browser.

## How to update what appears on GitHub
If you're not seeing the new background or card animations on your published site, you'll need to push the latest files from this repository to GitHub and let GitHub Pages serve them.

1. **Commit and push**
   ```bash
   git add .
   git commit -m "Update site styling"
   git push origin main   # or whichever branch your site is published from
   ```
2. **Check GitHub Pages settings**
   - In your GitHub repo, open **Settings → Pages**.
   - Make sure the source is set to the branch that contains `index.html` (often `main`) and, if applicable, the root folder.
3. **Wait for the deploy**
   - GitHub Pages usually updates within a minute or two. Refresh the live site after the build completes.
4. **Hard-refresh your browser**
   - To clear cached CSS, use Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (macOS) on the published page.

If you prefer, you can download the updated `index.html` from this branch and upload it directly to your hosting provider—the site is fully static.
