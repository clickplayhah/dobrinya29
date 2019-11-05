import './index.less';
import { Modal } from './lib/modals/index';
import { Bear, DataService } from './lib/dataService';
import { tns, TinySliderInstance } from '../node_modules/tiny-slider/src/tiny-slider';
require('file-loader?name=[name].[ext]!./index.html');

document.addEventListener('DOMContentLoaded', () => {
  const dataService = new DataService();
  const templates = {
    form: () => `<h2>Напишите нам</h2>
        <p>и мы свяжемся с вами в течении 15 минут</p>
        <form [formGroup]="data" (ngSubmit)="submitForm(); disableSubmitButton=true;">
          <label>
            Ваше имя *
            <input
              type="text"
              formControlName="name"
              minlength="1"
              [ngClass]="{ invalid: data.controls.name.dirty && data.controls.name.invalid }"
              autofocus
            />
          </label>
          <label>
            Телефон *
            <input
              type="tel"
              formControlName="phone"
              minlength="10"
              [ngClass]="{ invalid: data.controls.phone.dirty && data.controls.phone.invalid }"
            />
          </label>
          <label>
            Комментарий к заказу
            <textarea formControlName="comment"></textarea>
          </label>
          <button type="submit" [disabled]="data.invalid || disableSubmitButton">Отправить!</button>
        </form>`,
    success: () => `<h2>Успех!</h2>
        <p>Менеджер свяжется с вами в течении 15 минут</p>`,
    error: () => ` <h2>Что-то пошло не так</h2>
        <p>Возможно, неполадки в сети. Попробуйте связаться с нами любым другим способом:</p>
        <ul>
          <li>
            <a href="https://www.instagram.com/dobrinya29/" target="_blank">
              Instagram
            </a>
          </li>
          <li>
            <a href="https://vk.com/dobrinya29" target="_blank">
              Вконтакте
            </a>
          </li>
          <li>
            <a href="https://wa.me/79600135345" rel="noreferrer"> WhatsApp </a>
          </li>
          <li>
            <a href="tg://resolve?domain=dobrinya29" rel="noreferrer">
              Telegram
            </a>
          </li>
          <li>
            <a href="tel:+79600135345">
              +7 (960) 013-53-45
            </a>
          </li>
        </ul>`,
    select: (options: { bear: Bear }) => {
      const list = options.bear.colors.reduce((acc, color) => {
        return (
          acc +
          `<li>
            <img src="assets/images/Медведи/${options.bear.name}-${options.bear.size}/${color}.jpg" 
            alt="${options.bear.name} ${options.bear.size}" />
              <p>${color}</p>
              <button data-modal="form" data-bear="${options.bear.name +
                options.bear.size}" data-color="${color}">Выбрать</button>
          </li>`
        );
      }, '');
      return `
        <h2>${options.bear.name} ${options.bear.size}см</h2>
        <ul class="carousel">${list}</ul>`;
    },
    bear: (options: { bear: Bear }) => `
        <div class="item" >
          <h3>${options.bear.name} ${options.bear.size}см</h3>
          <button class="image" data-modal="select" data-bear="${options.bear.name + options.bear.size}">
            <img src="assets/images/Медведи/${options.bear.name}-${options.bear.size}/${options.bear.colors[0]}.jpg" 
             alt="${options.bear.name} ${options.bear.size}" />
          </button>
          <div class="label">
            <p>${options.bear.price} &#8381;</p>
            <button data-modal="select" data-bear="${options.bear.name + options.bear.size}">Выбрать</div>
          </div>
        </button>`,
  };

  const findModals = (element: HTMLElement | Document) => {
    element.querySelectorAll('[data-modal]').forEach((button: HTMLElement) => {
      const options = {
        bear: dataService.bears.find(bear => bear.name + bear.size === button.dataset.bear),
        color: button.dataset.color,
      };
      const modalTemplate = templates[button.dataset.modal](options);
      if (modalTemplate) {
        let slider: TinySliderInstance;
        const modal = new Modal(modalTemplate, {
          onOpen() {
            const sliderContainer = modal.template.querySelector('.carousel');
            if (sliderContainer) {
              slider = tns({
                container: modal.template.querySelector('.carousel'),
                items: 1,
                controls: true,
                nav: false,
                mouseDrag: true,
                // @ts-ignore
                preventScrollOnTouch: 'auto',
              });
            }
          },
          onClose() {
            if (slider) {
              slider.destroy();
            }
          },
        });
        button.addEventListener('click', () => {
          modal.open();
        });
      }
    });
  };

  findModals(document);

  dataService.getData().then(bears => {
    let html = bears.reduce((acc, bear) => {
      return acc + templates.bear({ bear });
    }, '');
    const bearsList = document.getElementById('catalog-bears');
    bearsList.innerHTML = html;

    findModals(bearsList);
  });

  const slider = tns({
    container: '.slider',
    items: 1,
    controls: true,
    nav: false,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayButtonOutput: false,
    mouseDrag: true,
    // @ts-ignore
    preventScrollOnTouch: 'auto',
    responsive: {
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1400: {
        items: 4,
      },
      1800: {
        items: 5,
      },
      2200: {
        items: 6,
      },
    },
  });
});
