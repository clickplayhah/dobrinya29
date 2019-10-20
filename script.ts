const global: {
  lastFocus: HTMLElement | null;
  returnFocus: () => void;
  firstFocusable: (element: HTMLElement) => HTMLElement | null;
  getScrollbarWidth: () => number;
} = {
  lastFocus: null,
  returnFocus() {
    if (this.lastFocus) {
      this.lastFocus.focus();
    }
  },
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
    if (outer.parentNode) {
      outer.parentNode.removeChild(outer);
    }
    if (document.body.scrollHeight > window.innerHeight) {
      return scrollbarWidth;
    }
    return 0;
  }
};

class Modal {
  public id: string;
  private modal: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(modalId: string) {
    this.id = modalId;
    this.modal = document.querySelector(`[data-modal="${modalId}"]`) as HTMLElement;
    if (!this.modal) {
      throw new Error('Modal element is not found');
    }

    this.modal.addEventListener('click', event => {
      if (event.target === this.modal) {
        this.close();
      }
    });

    this.closeButton = this.modal.querySelector('[data-close-modal]') as HTMLButtonElement;
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        this.close();
      });
    }
  }

  open(initiator?: HTMLButtonElement) {
    this.modal.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = global.getScrollbarWidth() + 'px';
    if (initiator) {
      global.lastFocus = initiator;
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
    document.body.style.paddingRight = '0';
  }
}

(() => {
  const modals = new Map();

  document.querySelectorAll('[data-open-modal]').forEach((button: Element) => {
    const modalId: string = (button as HTMLElement).dataset.openModal as string;
    let modal: Modal;
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

  const form: HTMLFormElement = document.forms[0];

  form.addEventListener('submit', event => {
    event.preventDefault();

    const name: HTMLInputElement = form.elements.namedItem('name') as HTMLInputElement;
    const phone: HTMLInputElement = form.elements.namedItem('phone') as HTMLInputElement;
    const comment: HTMLTextAreaElement = form.elements.namedItem('comment') as HTMLTextAreaElement;

    const message = `${name.value} (${phone.value})\n ${comment.value}`;
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

  // @ts-ignore
  const slider = tns({
    container: '.slider',
    items: 1,
    controls: false,
    // @ts-ignore
    navPosition: 'bottom',
    autoplay: true,
    autoplayHoverPause: true,
    autoplayButtonOutput: false,
    mouseDrag: true,
    responsive: {
      600: {
        items: 2
      },
      1000: {
        items: 3
      },
      1400: {
        items: 4
      },
      1800: {
        items: 5
      },
      2200: {
        items: 6
      }
    }
  });
  slider.play();
})();
