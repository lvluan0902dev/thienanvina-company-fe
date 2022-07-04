import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AdminUser } from 'src/app/models/admin-user/admin-user.model';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { AdminUserService } from 'src/app/services/admin-user/admin-user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-information-admin-user',
  templateUrl: './change-information-admin-user.component.html',
  styleUrls: ['./change-information-admin-user.component.css']
})
export class ChangeInformationAdminUserComponent implements OnInit {
  public adminUser: AdminUser = new AdminUser;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;
  public token: any;

  constructor(private title: Title, private formBuilder: FormBuilder, private adminUserService: AdminUserService, private toastr: ToastrService, private router: Router) {
    this.title.setTitle('Đổi thông tin - Quản trị hệ thống TAVN');
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
      name: [this.adminUser.name],
      mobile: [this.adminUser.mobile],
      address: [this.adminUser.address],
    });
  }

  public get f() {
    return this.form.controls;
  }

  public save(): void {
    let adminUser = {
      "email": this.form.value.email,
      "name": this.form.value.name,
      "mobile": this.form.value.mobile,
      "address": this.form.value.address,
    };

    this.adminUserService.update(adminUser).subscribe(response => {
      if (response.status === 1)
      {
        this.toastr.success(JSON.stringify(response.message), 'Success', {
          timeOut: 2000,
          progressBar: true
        });
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
