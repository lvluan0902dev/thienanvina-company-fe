import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { OrderStatus } from 'src/app/models/order-status/order-status.model';
import { Order } from 'src/app/models/order/order.model';
import { ShippingUnit } from 'src/app/models/shipping-unit/shipping-unit';
import { OrderStatusService } from 'src/app/services/order-status/order-status.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ShippingUnitService } from 'src/app/services/shipping-unit/shipping-unit.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, AfterViewChecked {
  public orders: Order[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;
  public orderStatuses: OrderStatus[] = [];
  public shippingUnits: ShippingUnit[] = [];

  constructor(private title: Title, private orderService: OrderService, private orderStatusService: OrderStatusService, private toastr: ToastrService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService, private shippingUnitService: ShippingUnitService) {
    this.title.setTitle('Đơn hàng - Quản trị hệ thống TAVN');
  }
  ngAfterViewChecked(): void {
    if (!this.dialog) {
      this.form.reset();
    }
    if (!this.dialog) {
      this.form.reset();
    }
  }

  ngOnInit(): void {
    this.getAllOrder();
    this.getAllOrderStatus();
    this.getAllShippingUnit();
    this.createdForm();
  }

  // Data Obejct Start
  public getAllOrder(): void {
    this.orderService.getAll().subscribe(response => {
      this.orders = response.data;
      this.loading = false;
    });
  }

  public getAllOrderStatus(): void {
    this.orderStatusService.getAll().subscribe(response => {
      this.orderStatuses = response.data;
      this.loading = false;
    });
  }

  public getAllShippingUnit(): void {
    this.shippingUnitService.getAll().subscribe(response => {
      this.shippingUnits = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(order: Order): void {
    this.form = this.formBuilder.group({
      id: [order.id],
      order_status_id: [order.order_status_id],
      bill_of_lading_no: [order.bill_of_lading_no],
      shipping_unit_id: [order.shipping_unit_id]
    });
    this.submitted = false;
    this.dialog = true;
  }
  // Table End

  // Form Start
  public createdForm(): void {
    this.form = this.formBuilder.group({
      id: [''],
      order_status_id: ['', [Validators.required]],
      bill_of_lading_no: [''],
      shipping_unit_id: [''],
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
    this.getAllOrder();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let order = {
      "id": this.form.value.id,
      "order_status_id": this.form.value.order_status_id,
      "bill_of_lading_no": this.form.value.bill_of_lading_no,
      "shipping_unit_id": this.form.value.shipping_unit_id,
    };

    if (!order.id) {
      return;
    }
    else {
      this.orderService.update(order).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllOrder();
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
