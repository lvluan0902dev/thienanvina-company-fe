import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
// import { EditorModule } from 'primeng/editor';
import { HttpClientModule } from '@angular/common/http';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {DataViewModule} from 'primeng/dataview';
import {ImageModule} from 'primeng/image';
import { ReactiveFormsModule } from '@angular/forms';
import {EditorModule, TINYMCE_SCRIPT_SRC}   from '@tinymce/tinymce-angular';
import { RouterModule } from '@angular/router';



import { ComponentsRoutingModule } from './components-routing.module';
import { ComponentsComponent } from './components.component';
import { SharedModule } from '../shared/shared.module';
import { SliderComponent } from './slider/slider.component';
import { BannerComponent } from './banner/banner.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SocialNetworkComponent } from './social-network/social-network.component';
import { CooperationUnitComponent } from './cooperation-unit/cooperation-unit.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { SafePipe } from '../pipe/safe.pipe';
import { AddressComponent } from './address/address.component';
import { PhoneNumberComponent } from './phone-number/phone-number.component';
import { EmailComponent } from './email/email.component';
import { FaqComponent } from './faq/faq.component';
import { IntroduceComponent } from './introduce/introduce.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductBrandComponent } from './product-brand/product-brand.component';
import { ProductComponent } from './product/product.component';
import { ProductUnitComponent } from './product-unit/product-unit.component';
import { ContactStatusComponent } from './contact-status/contact-status.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { OrderComponent } from './order/order.component';
import { ShippingUnitComponent } from './shipping-unit/shipping-unit.component';
import { ContactComponent } from './contact/contact.component';
import { ChangeInformationAdminUserComponent } from './change-information-admin-user/change-information-admin-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


@NgModule({
  declarations: [
    ComponentsComponent,
    SliderComponent,
    BannerComponent,
    AboutUsComponent,
    SocialNetworkComponent,
    CooperationUnitComponent,
    GoogleMapComponent,
    SafePipe,
    AddressComponent,
    PhoneNumberComponent,
    EmailComponent,
    FaqComponent,
    IntroduceComponent,
    ProductCategoryComponent,
    ProductBrandComponent,
    ProductComponent,
    ProductUnitComponent,
    ContactStatusComponent,
    OrderStatusComponent,
    OrderComponent,
    ShippingUnitComponent,
    ContactComponent,
    ChangeInformationAdminUserComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    SharedModule,
    ButtonModule,
    TableModule,
    ToolbarModule,
    InputNumberModule,
    RadioButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    CalendarModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule,
    ProgressBarModule,
    ToolbarModule,
    RatingModule,
    ConfirmDialogModule,
    InputTextareaModule,
    FormsModule,
    EditorModule,
    FileUploadModule,
    HttpClientModule,
    SelectButtonModule,
    ToggleButtonModule,
    DataViewModule,
    ImageModule,
    ReactiveFormsModule,
    DropdownModule,
    RouterModule
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: "tinymce/tinymce.min.js" },
  ],
})
export class ComponentsModule { }
