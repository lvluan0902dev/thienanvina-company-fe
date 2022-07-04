import { AfterViewChecked, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { AboutUs } from 'src/app/models/about-us/about-us.model';
import { AboutUsService } from 'src/app/services/about-us/about-us.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AboutUsComponent implements OnInit, AfterViewChecked {
  public listAboutUs: AboutUs[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;

  constructor(private title: Title, private aboutUsService: AboutUsService, private toastr: ToastrService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('Về chúng tôi - Quản trị hệ thống TAVN');
  }

  ngAfterViewChecked(): void {
    if (!this.dialog)
    {
      this.form.reset();
    }
  }

  ngOnInit(): void {
    this.getAllAboutUs();
    this.createdForm();
  }

  // Data Obejct Start
  public getAllAboutUs(): void {
    this.aboutUsService.getAll().subscribe(response => {
      this.listAboutUs = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(aboutUs: AboutUs): void {
    this.form = this.formBuilder.group({
      id: [aboutUs.id],
      order: [aboutUs.order],
      content: [aboutUs.content, [Validators.required]],
      status: [aboutUs.status],
    });
    this.submitted = false;
    this.dialog = true;
  }

  public delete(aboutUs: AboutUs): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.aboutUsService.delete(aboutUs.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllAboutUs();
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
    this.getAllAboutUs();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let aboutUs = {
      "id": this.form.value.id,
      "content": this.form.value.content,
      "order": !this.form.value.order ? 0 : this.form.value.order,
      "status": !this.form.value.status ? 0 : 1
    };

    if (!aboutUs.id) {
      this.aboutUsService.store(aboutUs).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllAboutUs();
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
      this.aboutUsService.update(aboutUs).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllAboutUs();
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