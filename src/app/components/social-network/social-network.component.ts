import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { SocialNetwork } from 'src/app/models/social-network/social-network.model';
import { SocialNetworkService } from 'src/app/services/social-network/social-network.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-social-network',
  templateUrl: './social-network.component.html',
  styleUrls: ['./social-network.component.css']
})
export class SocialNetworkComponent implements OnInit {
  public socialNetworks: SocialNetwork[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;

  constructor(private title: Title, private socialNetworkService: SocialNetworkService, private toastr: ToastrService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('Mạng xã hội - Quản trị hệ thống TAVN');
  }

  ngOnInit(): void {
    this.getAllSocialNetwork();
    this.createdForm();
  }

  // Data Obejct Start
  public getAllSocialNetwork(): void {
    this.socialNetworkService.getAll().subscribe(response => {
      this.socialNetworks = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(socialNetwork: SocialNetwork): void {
    this.form = this.formBuilder.group({
      id: [socialNetwork.id],
      order: [socialNetwork.order],
      icon: [socialNetwork.icon, [Validators.required]],
      link: [socialNetwork.link, [Validators.required]],
      status: [socialNetwork.status],
    });
    this.submitted = false;
    this.dialog = true;
  }

  public delete(socialNetwork: SocialNetwork): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.socialNetworkService.delete(socialNetwork.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllSocialNetwork();
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
      icon: ['', [Validators.required]],
      link: ['', [Validators.required]],
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
    this.getAllSocialNetwork();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let socialNetwork = {
      "id": this.form.value.id,
      "icon": this.form.value.icon,
      "link": this.form.value.link,
      "order": !this.form.value.order ? 0 : this.form.value.order,
      "status": !this.form.value.status ? 0 : 1
    };

    if (!socialNetwork.id) {
      this.socialNetworkService.store(socialNetwork).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllSocialNetwork();
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
      this.socialNetworkService.update(socialNetwork).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllSocialNetwork();
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
