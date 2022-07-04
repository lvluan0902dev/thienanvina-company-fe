import { AfterViewChecked, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { Faq } from 'src/app/models/faq/faq.model';
import { FaqService } from 'src/app/services/faq/faq.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FaqComponent implements OnInit, AfterViewChecked {
  public faqs: Faq[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;

  constructor(private title: Title, private faqService: FaqService, private toastr: ToastrService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('FAQ - Quản trị hệ thống TAVN');
  }
  ngAfterViewChecked(): void {
    if (!this.dialog)
    {
      this.form.reset();
    }
  }

  ngOnInit(): void {
    this.getAllFaq();
    this.createdForm();
  }

  // Data Obejct Start
  public getAllFaq(): void {
    this.faqService.getAll().subscribe(response => {
      this.faqs = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(faq: Faq): void {
    this.form = this.formBuilder.group({
      id: [faq.id],
      order: [faq.order],
      title: [faq.title, [Validators.required]],
      content: [faq.content, [Validators.required]],
      status: [faq.status],
    });
    this.submitted = false;
    this.dialog = true;
  }

  public delete(faq: Faq): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.faqService.delete(faq.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllFaq();
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
      title: ['', [Validators.required]],
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
    this.getAllFaq();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let faq = {
      "id": this.form.value.id,
      "title": this.form.value.title,
      "content": this.form.value.content,
      "order": !this.form.value.order ? 0 : this.form.value.order,
      "status": !this.form.value.status ? 0 : 1
    };

    if (!faq.id) {
      this.faqService.store(faq).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllFaq();
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
      this.faqService.update(faq).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllFaq();
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
