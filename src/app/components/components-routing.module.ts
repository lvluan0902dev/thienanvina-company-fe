import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { AddressComponent } from './address/address.component';
import { BannerComponent } from './banner/banner.component';
import { ChangeInformationAdminUserComponent } from './change-information-admin-user/change-information-admin-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ComponentsComponent } from './components.component';
import { ContactStatusComponent } from './contact-status/contact-status.component';
import { ContactComponent } from './contact/contact.component';
import { CooperationUnitComponent } from './cooperation-unit/cooperation-unit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmailComponent } from './email/email.component';
import { FaqComponent } from './faq/faq.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { IntroduceComponent } from './introduce/introduce.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { OrderComponent } from './order/order.component';
import { PhoneNumberComponent } from './phone-number/phone-number.component';
import { ProductBrandComponent } from './product-brand/product-brand.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductUnitComponent } from './product-unit/product-unit.component';
import { ProductComponent } from './product/product.component';
import { ShippingUnitComponent } from './shipping-unit/shipping-unit.component';
import { SliderComponent } from './slider/slider.component';
import { SocialNetworkComponent } from './social-network/social-network.component';

const routes: Routes = [
  {path:'' , component: ComponentsComponent, children:[
    {path: '', component: DashboardComponent},
    {path: 'slider', component: SliderComponent},
    {path: 'banner', component: BannerComponent},
    {path: 'about-us', component: AboutUsComponent},
    {path: 'social-network', component: SocialNetworkComponent},
    {path: 'cooperation-unit', component: CooperationUnitComponent},
    {path: 'google-map', component: GoogleMapComponent},
    {path: 'address', component: AddressComponent},
    {path: 'phone-number', component: PhoneNumberComponent},
    {path: 'email', component: EmailComponent},
    {path: 'faq', component: FaqComponent},
    {path: 'introduce', component: IntroduceComponent},
    {path: 'product-category', component: ProductCategoryComponent},
    {path: 'product-brand', component: ProductBrandComponent},
    {path: 'product', component: ProductComponent},
    {path: 'product-unit', component: ProductUnitComponent},
    {path: 'contact-status', component: ContactStatusComponent},
    {path: 'order-status', component: OrderStatusComponent},
    {path: 'order', component: OrderComponent},
    {path: 'shipping-unit', component: ShippingUnitComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'change-information-admin-user', component: ChangeInformationAdminUserComponent},
    {path: 'change-password', component: ChangePasswordComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
