import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ContactStatus } from 'src/app/models/contact-status/contact-status.model';
import { Contact } from 'src/app/models/contact/contact.model';
import { ContactStatusService } from 'src/app/services/contact-status/contact-status.service';
import { ContactService } from 'src/app/services/contact/contact.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  public contacts: Contact[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;
  public contactStatuses: ContactStatus[] = [];

  constructor(private title: Title, private contactService: ContactService, private contactStatusesService: ContactStatusService, private toastr: ToastrService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('Thư liên hệ - Quản trị hệ thống TAVN');
  }

  ngOnInit(): void {
    this.getAllContact();
    this.getAllContactStatus();
    this.createdForm();
  }

  // Data Obejct Start
  public getAllContact(): void {
    this.contactService.getAll().subscribe(response => {
      this.contacts = response.data;
      this.loading = false;
    });
  }

  public getAllContactStatus(): void {
    this.contactStatusesService.getAll().subscribe(response => {
      this.contactStatuses = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(contact: Contact): void {
    this.form = this.formBuilder.group({
      id: [contact.id],
      contact_status_id: [contact.contact_status_id],
    });
    this.submitted = false;
    this.dialog = true;
  }
  // Table End

  // Form Start
  public createdForm(): void {
    this.form = this.formBuilder.group({
      id: [''],
      contact_status_id: [''],
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
    this.getAllContact();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let contact = {
      "id": this.form.value.id,
      "contact_status_id": this.form.value.contact_status_id,
    };

    if (!contact.id) {
      
    }
    else {
      this.contactService.update(contact).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllContact();
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
