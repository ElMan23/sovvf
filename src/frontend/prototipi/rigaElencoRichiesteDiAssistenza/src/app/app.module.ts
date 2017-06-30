import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppComponent } from './app.component';
import { SintesiRichiestaComponent } from './sintesi-richiesta/sintesi-richiesta.component';
import { ListaRichiesteComponent } from './lista-richieste/lista-richieste.component';
import { FriendlyDatePipe } from "app/shared/pipes/friendly-date.pipe";
import { FriendlyHourPipe } from "app/shared/pipes/friendly-hour.pipe";
import { TruncatePipe } from "app/shared/pipes/truncate.pipe";

@NgModule({
  declarations: [
    AppComponent,
    SintesiRichiestaComponent,
    ListaRichiesteComponent,
    FriendlyDatePipe,
    FriendlyHourPipe,
    TruncatePipe,
  ],
  imports: [
    BrowserModule,
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
