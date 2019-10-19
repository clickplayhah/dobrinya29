(() => {
  let lastFocus;
  const returnFocus = () => lastFocus && lastFocus.focus();

  const firstFocusable = element =>
    element.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

  const closeModal = modal => {
    modal.removeAttribute("open");
    returnFocus();
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = 0;
  };

  const getScrollbarWidth = () => {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    document.body.appendChild(outer);
    const inner = document.createElement("div");
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    if (document.body.scrollHeight > window.innerHeight) {
      return scrollbarWidth;
    }
    return 0;
  };

  document.querySelectorAll("[data-open-modal]").forEach(button => {
    const modalId = button.dataset.openModal;
    const modal = document.querySelector(`[data-modal="${modalId}"]`);
    const close = modal.querySelector("[data-close-modal]");

    button.addEventListener("click", () => {
      modal.setAttribute("open", "");
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = getScrollbarWidth() + "px";
      lastFocus = button;
      const focusable = firstFocusable(modal);
      if (focusable) {
        focusable.focus();
      }
    });

    close.addEventListener("click", () => {
      closeModal(modal);
    });

    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      const modal = document.querySelector("[data-modal][open]");
      if (modal) {
        closeModal(modal);
      }
    }
  });

  const slider = tns({
    container: ".slider",
    items: 1,
    controls: false,
    navPosition: 'bottom',
    responsive: {
      640: {
        edgePadding: 20,
        gutter: 20,
        items: 2
      },
      700: {
        gutter: 30
      },
      900: {
        items: 3
      }
    }
  });
  slider.play();
})();
