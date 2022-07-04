import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../services/admin/admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup = new FormGroup({});
  public submitted: boolean = false;
  public token: any;
  returnURL: string | undefined;

  constructor(private title: Title, private formBuilder: FormBuilder, private toastr: ToastrService, private adminService: AdminService, private router: Router, private route: ActivatedRoute) {
    this.title.setTitle('Đăng nhập hệ thống');
    if (localStorage.getItem('token')) {
      this.router.navigate(['/']);
    }
    this.route.queryParams.subscribe(params => {
      this.returnURL = params['return_url'];
    })
  }

  ngOnInit(): void {
    this.createdForm();
  }

  public createdForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public get f() {
    return this.form.controls;
  }

  public submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.adminService.loginAdminUser(this.form.value).subscribe(res => {
      if (res.status === 1) {
        this.token = res.data.token;
        localStorage.setItem('token', this.token);

        this.router.navigate([this.returnURL??'/']);
        this.toastr.success(JSON.stringify(res.message), 'Success', {
          timeOut: 2000,
          progressBar: true
        })
      }
      else if (res.status === 0) {
        this.toastr.error(JSON.stringify(res.message), 'Error', {
          timeOut: 2000,
          progressBar: true
        })
      }
    });
  }
}
