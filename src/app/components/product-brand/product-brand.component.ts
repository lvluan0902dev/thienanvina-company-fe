import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ProductBrand } from 'src/app/models/product-brand/product-brand.model';
import { ProductBrandService } from 'src/app/services/product-brand/product-brand.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-brand',
  templateUrl: './product-brand.component.html',
  styleUrls: ['./product-brand.component.css']
})
export class ProductBrandComponent implements OnInit {
  public productBrands: ProductBrand[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;

  constructor(private title: Title, private productBrandService: ProductBrandService, private toastr: ToastrService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('Thương hiệu sản phẩm - Quản trị hệ thống TAVN');
  }

  ngOnInit(): void {
    this.getAllProductBrand();
    this.createdForm();
  }

    // Data Obejct Start
    public getAllProductBrand(): void {
      this.productBrandService.getAll().subscribe(response => {
        this.productBrands = response.data;
        this.loading = false;
      });
    }
    // Data Obejct End

    // Table Start
  public edit(productBrand: ProductBrand): void {
    this.form = this.formBuilder.group({
      id: [productBrand.id],
      order: [productBrand.order],
      name: [productBrand.name, [Validators.required]],
      status: [productBrand.status],
    });
    this.submitted = false;
    this.dialog = true;
  }

  public delete(productBrand: ProductBrand): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productBrandService.delete(productBrand.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllProductBrand();
          }
        });
      }
    });
  }
  // Table End

  // Form Start
  public createdForm(): void {
    this.form = this.formBuilder.group({
      id: [''],
      order: [''],
      name: ['', [Validators.required]],
      status: [false],
    });
  }

  public get f() {
    return this.form.controls;
  }
  // Form End

  // Modal Start
  public openNew(): void {
    this.submitted = false;
    this.dialog = true;
  }

  public hideDialog(): void {
    this.form.reset();
    this.dialog = false;
    this.submitted = false;
    this.getAllProductBrand();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let productBrand = {
      "id": this.form.value.id,
      "name": this.form.value.name,
      "order": !this.form.value.order ? 0 : this.form.value.order,
      "status": !this.form.value.status ? 0 : 1
    };

    if (!productBrand.id) {
      this.productBrandService.store(productBrand).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllProductBrand();
          this.hideDialog();
        } else {
          this.toastr.error(JSON.stringify(response.message), 'Error', {
            timeOut: 2000,
            progressBar: true
          });
        }
      });
    }
    else {
      this.productBrandService.update(productBrand).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllProductBrand();
          this.hideDialog();
        }
        else {
          this.toastr.error(JSON.stringify(response.message), 'Error', {
            timeOut: 2000,
            progressBar: true
          });
        }
      });
    }
  }
  // Modal End

  public isEmptyObject(obj: any) {
    return (obj && (Object.keys(obj).length === 0));
  }

}
