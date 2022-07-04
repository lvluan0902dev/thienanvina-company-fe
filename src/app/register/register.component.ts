import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MustMatch } from '../validator/mustMatch.validator';
import { AdminService } from '../services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public form: FormGroup = new FormGroup({});
  public submitted: boolean = false;

  constructor(private title: Title, private formBuilder: FormBuilder, private toastr: ToastrService, private adminService: AdminService) {
    title.setTitle('Đăng ký tài khoản hệ thống')
  }

  ngOnInit(): void {
    this.createForm();
  }

  public createForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]],
    }, {
      validator: MustMatch('password', 'confirm_password')
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

    this.adminService.registerAdminUser(this.form.value).subscribe(res => {
      if (res.status === 1) {
        this.toastr.success(JSON.stringify(res.message), 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        this.submitted = false;
        this.form.reset();
      } else {
        this.toastr.error(JSON.stringify(res.message), 'Error', {
          timeOut: 2000,
          progressBar: true
        });
      }
    });
  }
}
