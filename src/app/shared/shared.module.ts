import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    FooterComponent,
    LayoutComponent,
    HeaderComponent,
    LeftSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports : [
    LayoutComponent
  ]
})
export class SharedModule { }
