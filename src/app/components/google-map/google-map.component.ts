import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { GoogleMap } from 'src/app/models/google-map/google-map.models';
import { GoogleMapService } from 'src/app/services/google-map/google-map.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
  public googleMaps: GoogleMap[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;

  constructor(private title: Title, private googleMapService: GoogleMapService, private toastr: ToastrService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('Google Map - Quản trị hệ thống TAVN');
  }

  ngOnInit(): void {
    this.getAllGoogleMap();
    this.createdForm();
  }

  // Data Obejct Start
  public getAllGoogleMap(): void {
    this.googleMapService.getAll().subscribe(response => {
      this.googleMaps = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(googleMap: GoogleMap): void {
    this.form = this.formBuilder.group({
      id: [googleMap.id],
      order: [googleMap.order],
      content: [googleMap.content, [Validators.required]],
      status: [googleMap.status],
    });
    this.submitted = false;
    this.dialog = true;
  }

  public delete(googleMap: GoogleMap): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.googleMapService.delete(googleMap.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllGoogleMap();
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
    this.getAllGoogleMap();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let googleMap = {
      "id": this.form.value.id,
      "content": this.form.value.content,
      "order": !this.form.value.order ? 0 : this.form.value.order,
      "status": !this.form.value.status ? 0 : 1
    };

    if (!googleMap.id) {
      this.googleMapService.store(googleMap).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllGoogleMap();
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
      this.googleMapService.update(googleMap).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllGoogleMap();
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
