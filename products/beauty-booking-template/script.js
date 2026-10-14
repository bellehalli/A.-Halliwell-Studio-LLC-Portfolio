(() => {
  const site = window.BEAUTY_SITE || {};
  const name = site.name || "Your Beauty Studio";
  document.querySelectorAll("[data-studio-name]").forEach((node) => { node.textContent = name; });
  document.querySelectorAll("[data-booking-link]").forEach((node) => { node.href = site.bookingUrl || "#"; });
  document.querySelectorAll("[data-instagram-link]").forEach((node) => { node.href = site.instagramUrl || "#"; });
  document.querySelectorAll("[data-phone]").forEach((node) => {
    const phone = site.phone || "Add your phone number";
    node.textContent = phone;
    node.href = phone.startsWith("Add") ? "#" : `tel:${phone.replace(/[^+\d]/g, "")}`;
  });
  document.querySelectorAll("[data-email]").forEach((node) => {
    const email = site.email || "Add your email";
    node.textContent = email;
    node.href = email.startsWith("Add") ? "#" : `mailto:${email}`;
  });
  document.querySelectorAll("[data-address]").forEach((node) => { node.textContent = site.address || "Add your location"; });
  document.querySelectorAll("[data-hours]").forEach((node) => { node.textContent = site.hours || "Add your hours"; });
  document.querySelectorAll("[data-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });

  const menuButton = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-mobile-menu]");
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menu?.classList.toggle("is-open", !open);
  });
})();
