document.addEventListener("DOMContentLoaded", () => {
  console.log("SSV nav script loaded");

  const menuButton = document.querySelector(".menu-button-4");
  const navMenu = document.querySelector(".nav-menu-wrapper-three-2");
  const overlay = document.querySelector(".w-nav-overlay");
  const links = document.querySelectorAll(".nav-link-2");

  if (!menuButton || !navMenu || !overlay) {
    console.error("Nav script: required elements not found", { menuButton, navMenu, overlay });
    return;
  }

  // Put nav into a guaranteed "closed" initial state on mobile
  function setInitialState() {
    if (window.innerWidth <= 767) {
      navMenu.style.transition = navMenu.style.transition || "transform 0.4s ease";
      navMenu.style.transform = "translateY(-100%)"; // overrides inline transform
      overlay.style.transition = overlay.style.transition || "opacity 0.3s ease";
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
      overlay.style.display = "none";
      menuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
      navMenu.classList.remove("open");
    } else {
      // on desktop remove inline transforms so original desktop layout applies
      navMenu.style.transform = "";
      navMenu.style.transition = "";
      overlay.style.display = "none";
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
      menuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
      navMenu.classList.remove("open");
    }
  }

  setInitialState();

  function openMenu() {
    navMenu.style.transition = "transform 0.4s ease";
    navMenu.style.transform = "translateY(0)";       // force visible despite inline styles
    overlay.style.display = "block";                // make overlay present
    // allow a frame for display to apply, then fade overlay in
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      overlay.style.visibility = "visible";
    });
    menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    navMenu.classList.add("open");
  }

  function closeMenu() {
    navMenu.style.transform = "translateY(-100%)";
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    navMenu.classList.remove("open");
    // hide overlay after transition completes
    setTimeout(() => {
      if (overlay.style.opacity === "0") overlay.style.display = "none";
    }, 350);
  }

  menuButton.addEventListener("click", (e) => {
    if (navMenu.classList.contains("open") || navMenu.style.transform === "translateY(0)") {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener("click", closeMenu);

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      // smooth-scroll anchors and close menu
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const target = document.getElementById(href.slice(1));
        if (target) {
          e.preventDefault();
          closeMenu();
          // wait for close animation, then scroll
          setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 300);
          return;
        }
      }
      // if it's an external link or button, just close menu
      closeMenu();
    });
  });

  // keep states consistent on resize
  window.addEventListener("resize", setInitialState);
});
