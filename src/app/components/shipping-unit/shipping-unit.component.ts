import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ShippingUnit } from 'src/app/models/shipping-unit/shipping-unit';
import { ShippingUnitService } from 'src/app/services/shipping-unit/shipping-unit.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shipping-unit',
  templateUrl: './shipping-unit.component.html',
  styleUrls: ['./shipping-unit.component.css']
})
export class ShippingUnitComponent implements OnInit {
  public shippingUnits: ShippingUnit[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;

  constructor(private title: Title, private shippingUnitService: ShippingUnitService, private toastr: ToastrService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('Đơn vị vận chuyển - Quản trị hệ thống TAVN');
  }

  ngOnInit(): void {
    this.getAllShippingUnit();
    this.createdForm();
  }

  // Data Obejct Start
  public getAllShippingUnit(): void {
    this.shippingUnitService.getAll().subscribe(response => {
      this.shippingUnits = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(shippingUnit: ShippingUnit): void {
    this.form = this.formBuilder.group({
      id: [shippingUnit.id],
      order: [shippingUnit.order],
      name: [shippingUnit.name, [Validators.required]],
      status: [shippingUnit.status],
    });
    this.submitted = false;
    this.dialog = true;
  }

  public delete(shippingUnit: ShippingUnit): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.shippingUnitService.delete(shippingUnit.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllShippingUnit();
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
    this.getAllShippingUnit();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let shippingUnit = {
      "id": this.form.value.id,
      "name": this.form.value.name,
      "order": !this.form.value.order ? 0 : this.form.value.order,
      "status": !this.form.value.status ? 0 : 1
    };

    if (!shippingUnit.id) {
      this.shippingUnitService.store(shippingUnit).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllShippingUnit();
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
      this.shippingUnitService.update(shippingUnit).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllShippingUnit();
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
