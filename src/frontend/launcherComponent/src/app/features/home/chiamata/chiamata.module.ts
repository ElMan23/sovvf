import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { ReactiveFormsModule } from '@angular/forms';
import { ChiamataComponent } from './chiamata.component';
import { ChiamataService } from '../../../core/service/chiamata-service/chiamata.service';
import { NgxsModule } from '@ngxs/store';
import { ClipboardState } from '../store/states/chiamata/clipboard.state';
import { ConfirmModalComponent, RichiestaDuplicataModalComponent } from '../../../shared';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { TagInputModule } from 'ngx-chips';
import { EnteModalComponent } from '../../../shared/modal/ente-modal/ente-modal.component';

@NgModule({
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        TagInputModule,
        GooglePlaceModule,
        NgbModule,
        ClipboardModule,
        ReactiveFormsModule,
        SharedModule,
        UiSwitchModule.forRoot(null),
        NgxsFormPluginModule
    ],
    declarations: [
        ChiamataComponent
    ],
    exports: [
        ChiamataComponent
    ],
    entryComponents: [ConfirmModalComponent, RichiestaDuplicataModalComponent, EnteModalComponent],
    providers: [
        ChiamataService
    ]
})
export class ChiamataModule {
}
