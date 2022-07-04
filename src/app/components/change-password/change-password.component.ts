import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import jwt_decode from 'jwt-decode';
import { AdminUser } from 'src/app/models/admin-user/admin-user.model';
import { AdminUserService } from 'src/app/services/admin-user/admin-user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  public adminUser: AdminUser = new AdminUser;
  public form: FormGroup = new FormGroup({});
  public submitted: boolean = false;
  public url: string = environment.apiUrl;
  public token: any;

  constructor(private title: Title, private formBuilder: FormBuilder, private adminUserService: AdminUserService, private toastr: ToastrService, private router: Router) {
    this.title.setTitle('Đổi mật khẩu - Quản trị hệ thống TAVN');
  }

  ngOnInit(): void {
    this.createdForm();
  }

  public getInfo(): void {
    this.token = localStorage.getItem('token');
    this.adminUser = jwt_decode(this.token);
  }

  public createdForm(): void {
    this.getInfo();
    this.form = this.formBuilder.group({
      email: [this.adminUser.email],
      old_password: ['', [Validators.required, Validators.minLength(6)]],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public get f() {
    return this.form.controls;
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let adminUser = {
      "email": this.form.value.email,
      "old_password": this.form.value.old_password,
      "new_password": this.form.value.new_password,
      "confirm_password": this.form.value.confirm_password,
    };

    this.adminUserService.updatePassword(adminUser).subscribe(response => {
      if (response.status === 1)
      {
        this.toastr.success(JSON.stringify(response.message), 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        this.submitted = false;
        this.logout();
      }
      else
      {
        this.toastr.error(JSON.stringify(response.message), 'Error', {
          timeOut: 2000,
          progressBar: true
        });
      }
    })
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

}
