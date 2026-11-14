// Shared behavior for every page: the Menu dropdown and the one-time volunteers pop-up.
(() => {
  // Menu dropdown (home page only)
  const button = document.getElementById("menu-button");
  const panel = document.getElementById("menu-panel");
  if (button && panel) {
    const setOpen = (open) => {
      panel.hidden = !open;
      button.setAttribute("aria-expanded", String(open));
    };
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(panel.hidden);
    });
    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !panel.hidden) {
        setOpen(false);
        button.focus();
      }
    });
  }

  // One-time pop-up. Bump the key to show a new announcement to everyone again.
  const SEEN_KEY = "esa-popup-volunteers-2026";
  const seen = () => {
    try {
      return localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      return true; // storage blocked: don't nag on every page
    }
  };
  const markSeen = () => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {}
  };

  if (seen() || typeof HTMLDialogElement !== "function" || /bot|crawl|spider|lighthouse/i.test(navigator.userAgent)) return;

  const dialog = document.createElement("dialog");
  dialog.className = "popup";
  dialog.setAttribute("aria-labelledby", "popup-title");
  dialog.setAttribute("data-nosnippet", "");
  dialog.innerHTML = `<div class="popup-body">
    <h2 id="popup-title">Volunteers needed for server recreation!</h2>
    <p>Hey everyone! My name is Jadon, founder of MC Live Event Recreations (MCLER). MCLER's goal is to revive event servers for everyone to play, <strong>but it needs a lot of help.</strong></p>
    <p>MCLER is currently seeking volunteers for the following positions:</p>
    <ul>
      <li>Scripting API development</li>
      <li>Behavior pack development</li>
      <li>Website development</li>
    </ul>
    <p>If you have any interest in contributing in any capacity (no matter how big or small), please DM me and join our Discord server.</p>
    <p>Our website can be viewed at <a href="https://mceventrecreations.net" target="_blank" rel="noopener">mceventrecreations.net</a>.</p>
    <p>Thank you!</p>
    <div class="popup-buttons">
      <a href="https://discord.gg/w4uFWffMkB" class="discord-button" target="_blank" rel="noopener">Join the MCLER Discord</a>
      <button type="button" class="menu-button" data-close>Close</button>
    </div>
  </div>`;
  document.body.appendChild(dialog);

  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  dialog.querySelector(".discord-button").addEventListener("click", () => dialog.close());
  // Clicking the dimmed backdrop closes it too.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  markSeen(); // shown once, even if the visitor navigates away without closing it
  dialog.showModal();
})();
