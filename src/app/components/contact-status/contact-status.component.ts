import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ContactStatus } from 'src/app/models/contact-status/contact-status.model';
import { ContactStatusService } from 'src/app/services/contact-status/contact-status.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-status',
  templateUrl: './contact-status.component.html',
  styleUrls: ['./contact-status.component.css']
})
export class ContactStatusComponent implements OnInit {
  public contactStatuses: ContactStatus[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;

  constructor(private title: Title, private contactStatusService: ContactStatusService, private toastr: ToastrService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('Trạng thái Thư liên hệ - Quản trị hệ thống TAVN');
  }

  ngOnInit(): void {
    this.getAllContactStatus();
    this.createdForm();
  }

  // Data Obejct Start
  public getAllContactStatus(): void {
    this.contactStatusService.getAll().subscribe(response => {
      this.contactStatuses = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(contactStatus: ContactStatus): void {
    this.form = this.formBuilder.group({
      id: [contactStatus.id],
      order: [contactStatus.order],
      content: [contactStatus.content, [Validators.required]],
      status: [contactStatus.status],
    });
    this.submitted = false;
    this.dialog = true;
  }

  public delete(contactStatus: ContactStatus): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.contactStatusService.delete(contactStatus.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllContactStatus();
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
    this.getAllContactStatus();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let contactStatus = {
      "id": this.form.value.id,
      "content": this.form.value.content,
      "order": !this.form.value.order ? 0 : this.form.value.order,
      "status": !this.form.value.status ? 0 : 1
    };

    if (!contactStatus.id) {
      this.contactStatusService.store(contactStatus).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllContactStatus();
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
      this.contactStatusService.update(contactStatus).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllContactStatus();
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
