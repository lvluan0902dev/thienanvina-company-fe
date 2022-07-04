import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ProductUnit } from 'src/app/models/product-unit/product-unit.model';
import { ProductUnitService } from 'src/app/services/product-unit/product-unit.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-unit',
  templateUrl: './product-unit.component.html',
  styleUrls: ['./product-unit.component.css']
})
export class ProductUnitComponent implements OnInit {
  public productUnits: ProductUnit[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;

  constructor(private title: Title, private productUnitService: ProductUnitService, private toastr: ToastrService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('Đơn vị tính - Quản trị hệ thống TAVN');
  }

  ngOnInit(): void {
    this.getAllProductUnit();
    this.createdForm();
  }

  // Data Obejct Start
  public getAllProductUnit(): void {
    this.productUnitService.getAll().subscribe(response => {
      this.productUnits = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(productUnit: ProductUnit): void {
    this.form = this.formBuilder.group({
      id: [productUnit.id],
      order: [productUnit.order],
      name: [productUnit.name, [Validators.required]],
      status: [productUnit.status],
    });
    this.submitted = false;
    this.dialog = true;
  }

  public delete(productUnit: ProductUnit): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productUnitService.delete(productUnit.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllProductUnit();
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
    this.getAllProductUnit();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let productUnit = {
      "id": this.form.value.id,
      "name": this.form.value.name,
      "order": !this.form.value.order ? 0 : this.form.value.order,
      "status": !this.form.value.status ? 0 : 1
    };

    if (!productUnit.id) {
      this.productUnitService.store(productUnit).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllProductUnit();
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
      this.productUnitService.update(productUnit).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllProductUnit();
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
