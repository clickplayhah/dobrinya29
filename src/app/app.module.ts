import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ModalsComponent } from './components/modals/modals.component';
import { BearsListComponent } from './components/bears-list/bears-list.component';
import { ModalCarouselComponent } from './components/modal-carousel/modal-carousel.component';

@NgModule({
  declarations: [AppComponent, ModalsComponent, BearsListComponent, ModalCarouselComponent],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
