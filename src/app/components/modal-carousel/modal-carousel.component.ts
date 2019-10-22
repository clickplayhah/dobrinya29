import { Component, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-modal-carousel',
  templateUrl: './modal-carousel.component.html',
  styleUrls: ['./modal-carousel.component.less'],
})
export class ModalCarouselComponent {
  public count = 1;
  @Input() slides = 1;
  @ViewChild('container', { static: false }) container: ElementRef;
  constructor() {
    console.log(this);
  }

  prev() {
    this.slide(false);
  }
  next() {
    this.slide(true);
  }

  private slide(next = true) {
    const container: HTMLElement = this.container.nativeElement;
    const width = container.offsetWidth;
    const maxWidth = container.scrollWidth - width;
    const currentPosition = container.scrollLeft;
    if (next) {
      container.scrollLeft = currentPosition + width;
      // container.scrollLeft = currentPosition + width > maxWidth ? 0 : currentPosition + width;
    } else {
      container.scrollLeft = currentPosition - width;
      // container.scrollLeft = currentPosition === 0 ? maxWidth : currentPosition - width;
    }
  }
}
