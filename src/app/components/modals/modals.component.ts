import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Bear } from 'src/app/services/data.service.service';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.less'],
})
export class ModalsComponent {
  @Input() type: 'form' | 'success' | 'error' | 'select' | null;
  @Input() data: FormGroup | Bear | any = {};
  @ViewChild('modal', { static: false }) modal;
  @Output() selectBear: EventEmitter<any> = new EventEmitter();
  @Output() sendForm: EventEmitter<any> = new EventEmitter();
  public opened = false;
  private focusedElement: HTMLElement;
  constructor() {}

  open() {
    if (this.type) {
      this.focusedElement = document.activeElement as HTMLElement;
      this.opened = true;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
      this.firstFocusable();
    }
  }

  close(event?) {
    if (!event || event.target.classList.contains('modal')) {
      this.opened = false;
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
      if (this.focusedElement) {
        this.focusedElement.focus();
      }
      this.type = null;
    }
  }

  selectBearColor(color: string) {
    this.close();
    this.selectBear.emit({ bear: this.data, color });
  }

  submitForm() {
    this.sendForm.emit(this.data);
  }

  private firstFocusable() {
    const element = this.modal.nativeElement.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (element) {
      element.focus();
    }
  }

  private getScrollbarWidth() {
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
}
