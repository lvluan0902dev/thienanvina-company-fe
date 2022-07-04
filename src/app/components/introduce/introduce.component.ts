import { AfterViewChecked, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { Introduce } from 'src/app/models/introduce/introduce.model';
import { IntroduceService } from 'src/app/services/introduce/introduce.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-introduce',
  templateUrl: './introduce.component.html',
  styleUrls: ['./introduce.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IntroduceComponent implements OnInit, AfterViewChecked {
  public introduces: Introduce[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;


  constructor(private title: Title, private introduceService: IntroduceService, private toastr: ToastrService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('Giới thiệu - Quản trị hệ thống TAVN');
  }
  ngAfterViewChecked(): void {
    if (!this.dialog)
    {
      this.form.reset();
    }
  }

  ngOnInit(): void {
    this.getAllIntroduce();
    this.createdForm();
  }

  // Data Obejct Start
  public getAllIntroduce(): void {
    this.introduceService.getAll().subscribe(response => {
      this.introduces = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(introduce: Introduce): void {
    this.form = this.formBuilder.group({
      id: [introduce.id],
      order: [introduce.order],
      content: [introduce.content, [Validators.required]],
      status: [introduce.status],
    });
    this.submitted = false;
    this.dialog = true;
  }

  public delete(introduce: Introduce): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.introduceService.delete(introduce.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllIntroduce();
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
    this.getAllIntroduce();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let introduce = {
      "id": this.form.value.id,
      "content": this.form.value.content,
      "order": !this.form.value.order ? 0 : this.form.value.order,
      "status": !this.form.value.status ? 0 : 1
    };

    if (!introduce.id) {
      this.introduceService.store(introduce).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllIntroduce();
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
      this.introduceService.update(introduce).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllIntroduce();
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
