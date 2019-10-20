const global = {
  lastFocus: null,
  returnFocus: () => global.lastFocus && global.lastFocus.focus(),
  firstFocusable: element =>
    element.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  getScrollbarWidth: () => {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    if (document.body.scrollHeight > window.innerHeight) {
      return scrollbarWidth;
    }
    return 0;
  }
};

class Modal {
  constructor(modalId) {
    this.id = modalId;
    this.modal = document.querySelector(`[data-modal="${modalId}"]`);
    this.closeButton = this.modal.querySelector('[data-close-modal]');

    this.closeButton.addEventListener('click', event => {
      this.close();
    });

    this.modal.addEventListener('click', event => {
      if (event.target === this.modal) {
        this.close();
      }
    });
  }

  open(initiator) {
    this.modal.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = global.getScrollbarWidth() + 'px';
    if (initiator) {
      lastFocus = button;
    }
    const focusable = global.firstFocusable(this.modal);
    if (focusable) {
      focusable.focus();
    }
  }

  close() {
    this.modal.removeAttribute('open');
    global.returnFocus();
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = 0;
  }
}

(() => {
  const modals = new Map();

  document.querySelectorAll('[data-open-modal]').forEach(button => {
    const modalId = button.dataset.openModal;
    let modal;
    if (modals.has(modalId)) {
      modal = modals.get(modalId);
    } else {
      modal = new Modal(modalId);
      modals.set(modal.id, modal);
    }

    button.addEventListener('click', () => {
      modal.open();
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      modals.forEach(modal => {
        modal.close();
      });
    }
  });

  const form = document.forms.form;
  form.addEventListener('submit', event => {
    event.preventDefault();

    const message = `${form.elements.name.value} (${form.elements.phone.value})\n ${form.elements.comment.value}`;
    const url = 'https://dobrinya29bot.herokuapp.com/?message=' + encodeURI(message);

    const error = () => {
      modals.forEach(modal => {
        modal.close();
      });
      const errorModal = new Modal('modal-error');
      errorModal.open();
      setTimeout(() => {
        errorModal.close();
      }, 5000);
    };

    const success = () => {
      modals.forEach(modal => {
        modal.close();
      });
      const successModal = new Modal('modal-success');
      successModal.open();
      setTimeout(() => {
        successModal.close();
      }, 3000);
    };

    try {
      fetch(url)
        .then(resp => resp.json())
        .then(resp => {
          if (resp && resp.status === 'OK') {
            success();
          } else {
            error();
          }
        });
    } catch (e) {
      error();
    }
  });

  const slider = tns({
    container: '.slider',
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
