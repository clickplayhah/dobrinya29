import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DataService, Bear } from './services/data.service.service';
import { ModalsComponent } from './components/modals/modals.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public title = 'Dobrinya29';
  public bears: Bear[] = [];
  public reviewsCount = 1;
  @ViewChild('modal', { static: false }) modalComponent: ModalsComponent;

  private form: FormGroup;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    console.log(this);
    this.dataService.getData();
    this.bears = this.dataService.bears;
    this.getCountOfReviews();
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['+7', [Validators.required, Validators.minLength(10)]],
      comment: [''],
    });
  }

  select(bear: Bear) {
    this.modalComponent.data = bear;
    this.modalComponent.type = 'select';
    this.modalComponent.open();
  }

  selectBear(event?: { bear: Bear; color: string }) {
    this.modalComponent.type = 'form';
    let text = '';
    if (event) {
      text += 'Интересует медведь ';
      if (event.bear.name) {
        text += event.bear.name;
        if (event.bear.size) {
          text += ' ' + event.bear.size + 'см';
        }
      }
      if (event.color) {
        text += '\nЦвет: ' + event.color;
      }
      this.form.controls.comment.setValue(text);
    }
    this.modalComponent.data = this.form;
    this.modalComponent.open();
  }

  getCountOfReviews() {
    this.reviewsCount = Math.floor(window.innerWidth / 300);
  }

  submitForm(form: FormGroup) {
    if (form.valid) {
      const formValue: { name: string; phone: string; comment: string } = form.value;
      this.dataService.sendForm(formValue.name, formValue.phone, formValue.comment).subscribe(resp => {
        if (resp && resp.status === 'OK') {
          this.modalComponent.type = 'success';
          this.modalComponent.data = {};
          this.modalComponent.open();
        } else {
          this.modalComponent.type = 'error';
          this.modalComponent.data = {};
          this.modalComponent.open();
        }
      });
    } else {
      form.controls.name.markAsDirty();
      form.controls.phone.markAsDirty();
    }
  }
}
