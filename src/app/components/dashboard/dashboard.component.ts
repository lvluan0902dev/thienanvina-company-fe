import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order/order.model';
import { Product } from 'src/app/models/product/product.model';
import { AdminService } from 'src/app/services/admin/admin.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProductCategoryService } from 'src/app/services/product-category/product-category.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public countProductCategory: number = 0;
  public countProduct: number = 0;
  public countOrder: number = 0;
  public countUser: number = 0;
  public mostViewedProduct: Product[] = [];
  public orderLatest: Order[] = [];
  public url: string = environment.apiUrl;

  constructor(private title: Title, private adminService: AdminService, private productCategoryService: ProductCategoryService, private productService: ProductService, private orderService: OrderService, private router: Router, private userService: UserService) {
    this.title.setTitle('Dashboard - Quản trị hệ thống TAVN');
  }

  ngOnInit(): void {
    this.mostViewedProductsF();
    this.orderLatestF();
    this.countProductCategoryF();
    this.countProductF();
    this.countOrderF();
    this.countUserF();
  }

  public countProductCategoryF(): void {
    this.productCategoryService.getAll().subscribe(response => {
      if (response.status === 1) {
        this.countProductCategory = this.countElement(response.data);
      }
    });
  }

  public countProductF(): void {
    this.productService.getAll().subscribe(response => {
      if (response.status === 1) {
        this.countProduct = this.countElement(response.data);
      }
    });
  }

  public countOrderF(): void {
    this.orderService.getAll().subscribe(response => {
      if (response.status === 1) {
        this.countOrder = this.countElement(response.data);
      }
    });
  }

  public countUserF(): void {
    this.userService.getAll().subscribe(response => {
      if (response.status === 1) {
        this.countUser = this.countElement(response.data);
      }
    });
  }

  public mostViewedProductsF(): void {
    this.productService.mostViewedProducts().subscribe(response => {
      if (response.status === 1)
      {
        this.mostViewedProduct = response.data;
      }
    });
  }

  public orderLatestF(): void {
    this.orderService.latest().subscribe(response => {
      if (response.status === 1)
      {
        this.orderLatest = response.data;
      }
    });
  }

  public countElement(obj: any) {
    var count = 0;

    for (var ele in obj) {
      ++count;
    }
    return count;
  }
}
