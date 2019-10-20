"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tiny_slider_1 = require("./node_modules/tiny-slider/src/tiny-slider");
var global = {
    lastFocus: null,
    returnFocus: function () {
        if (this.lastFocus) {
            this.lastFocus.focus();
        }
    },
    firstFocusable: function (element) {
        return element.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    },
    getScrollbarWidth: function () {
        var outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        document.body.appendChild(outer);
        var inner = document.createElement('div');
        outer.appendChild(inner);
        var scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
        if (outer.parentNode) {
            outer.parentNode.removeChild(outer);
        }
        if (document.body.scrollHeight > window.innerHeight) {
            return scrollbarWidth;
        }
        return 0;
    }
};
var Modal = /** @class */ (function () {
    function Modal(modalId) {
        var _this = this;
        this.id = modalId;
        this.modal = document.querySelector("[data-modal=\"" + modalId + "\"]");
        if (!this.modal) {
            throw new Error('Modal element is not found');
        }
        this.modal.addEventListener('click', function (event) {
            if (event.target === _this.modal) {
                _this.close();
            }
        });
        this.closeButton = this.modal.querySelector('[data-close-modal]');
        if (this.closeButton) {
            this.closeButton.addEventListener('click', function () {
                _this.close();
            });
        }
    }
    Modal.prototype.open = function (initiator) {
        this.modal.setAttribute('open', '');
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = global.getScrollbarWidth() + 'px';
        if (initiator) {
            global.lastFocus = initiator;
        }
        var focusable = global.firstFocusable(this.modal);
        if (focusable) {
            focusable.focus();
        }
    };
    Modal.prototype.close = function () {
        this.modal.removeAttribute('open');
        global.returnFocus();
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
    };
    return Modal;
}());
(function () {
    var modals = new Map();
    document.querySelectorAll('[data-open-modal]').forEach(function (button) {
        var modalId = button.dataset.openModal;
        var modal;
        if (modals.has(modalId)) {
            modal = modals.get(modalId);
        }
        else {
            modal = new Modal(modalId);
            modals.set(modal.id, modal);
        }
        button.addEventListener('click', function () {
            modal.open();
        });
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            modals.forEach(function (modal) {
                modal.close();
            });
        }
    });
    var form = document.forms[0];
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var name = form.elements.namedItem('name');
        var phone = form.elements.namedItem('phone');
        var comment = form.elements.namedItem('comment');
        var message = name.value + " (" + phone.value + ")\n " + comment.value;
        var url = 'https://dobrinya29bot.herokuapp.com/?message=' + encodeURI(message);
        var error = function () {
            modals.forEach(function (modal) {
                modal.close();
            });
            var errorModal = new Modal('modal-error');
            errorModal.open();
            setTimeout(function () {
                errorModal.close();
            }, 5000);
        };
        var success = function () {
            modals.forEach(function (modal) {
                modal.close();
            });
            var successModal = new Modal('modal-success');
            successModal.open();
            setTimeout(function () {
                successModal.close();
            }, 3000);
        };
        try {
            fetch(url)
                .then(function (resp) { return resp.json(); })
                .then(function (resp) {
                if (resp && resp.status === 'OK') {
                    success();
                }
                else {
                    error();
                }
            });
        }
        catch (e) {
            error();
        }
    });
    var slider = tiny_slider_1.tns({
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
