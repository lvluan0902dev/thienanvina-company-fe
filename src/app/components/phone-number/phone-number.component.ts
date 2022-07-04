import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { PhoneNumber } from 'src/app/models/phone-number/phone-number.model';
import { PhoneNumberService } from 'src/app/services/phone-number/phone-number.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.css']
})
export class PhoneNumberComponent implements OnInit {
  public phoneNumbers: PhoneNumber[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;

  constructor(private title: Title, private phoneNumberService: PhoneNumberService, private toastr: ToastrService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('Số điện thoại - Quản trị hệ thống TAVN');
  }

  ngOnInit(): void {
    this.getAllPhoneNumber();
    this.createdForm();
  }

  // Data Obejct Start
  public getAllPhoneNumber(): void {
    this.phoneNumberService.getAll().subscribe(response => {
      this.phoneNumbers = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(phoneNumber: PhoneNumber): void {
    this.form = this.formBuilder.group({
      id: [phoneNumber.id],
      order: [phoneNumber.order],
      content: [phoneNumber.content, [Validators.required]],
      note: [phoneNumber.note, [Validators.required]],
      status: [phoneNumber.status],
    });
    this.submitted = false;
    this.dialog = true;
  }

  public delete(phoneNumber: PhoneNumber): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.phoneNumberService.delete(phoneNumber.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllPhoneNumber();
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
      content: ['', [Validators.required]],
      note: ['', [Validators.required]],
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
    this.getAllPhoneNumber();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let phoneNumber = {
      "id": this.form.value.id,
      "content": this.form.value.content,
      "note": this.form.value.note,
      "order": !this.form.value.order ? 0 : this.form.value.order,
      "status": !this.form.value.status ? 0 : 1
    };

    if (!phoneNumber.id) {
      this.phoneNumberService.store(phoneNumber).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllPhoneNumber();
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
      this.phoneNumberService.update(phoneNumber).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllPhoneNumber();
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