import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { Banner } from 'src/app/models/banner/banner.model';
import { Image } from 'src/app/models/image/image.model';
import { BannerService } from 'src/app/services/banner/banner.service';
import { ImageService } from 'src/app/services/image/image.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  public banners: Banner[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public images: Image[] = [];
  public selectedImage: Image = new Image;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;

  constructor(private title: Title, private bannerService: BannerService, private toastr: ToastrService, private imageService: ImageService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('Banner - Quản trị hệ thống TAVN');
  }

  ngOnInit(): void {
    this.getAllBanner();
    this.createdForm();
  }

  // Data Object Start
  public getAllBanner(): void {
    this.bannerService.getAll().subscribe(response => {
      this.banners = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(banner: Banner): void {
    this.form = this.formBuilder.group({
      id: [banner.id],
      title: [banner.title, [Validators.required]],
      order: [banner.order],
      status: [banner.status],
    });
    this.submitted = false;
    this.dialog = true;
    this.getAllImage(banner.image_id)
      .finally(() => {
        this.selectedImage = this.images[0].id === banner.image_id ? this.images[0] : new Image;
      });
  }

  public delete(banner: Banner): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bannerService.delete(banner.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllBanner();
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
      title: ['', [Validators.required]],
      order: [''],
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
    this.getAllImage();
  }

  public hideDialog(): void {
    this.form.reset();
    this.selectedImage = new Image();
    this.dialog = false;
    this.submitted = false;
    this.getAllBanner();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (Object.keys(this.selectedImage).length === 0) {
      return;
    }

    let banner = {
      "id": this.form.value.id,
      "title": this.form.value.title,
      "image_id": this.selectedImage.id,
      "order": !this.form.value.order ? 0 : this.form.value.order,
      "status": !this.form.value.status ? 0 : 1
    };

    if (!banner.id) {
      this.bannerService.store(banner).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.selectedImage = new Image();
          this.getAllBanner();
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
      this.bannerService.update(banner).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.selectedImage = new Image();
          this.getAllBanner();
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

  // Image Start
  public onUpload(event: any): void {
    this.getAllImage();
    this.toastr.success('"Image uploaded successfully"', 'Success', {
      timeOut: 2000,
      progressBar: true
    })
  }

  public getAllImage(id?: number): any {
    return this.imageService.getAllImage({ 'folder': 'storage/image/banner', 'image_id': id }).toPromise().then(response => {
      this.images = response.data;
    });
  }

  public onRowSelect(event: any) {

  }

  public onRowUnselect(event: any) {
    this.selectedImage = new Image;
  }

  public deleteImage(image: Image): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.imageService.deleteSingleImage(image.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllImage();
          }
        });
      },
    });
  }
  // Image End

  public isEmptyObject(obj: any) {
    return (obj && (Object.keys(obj).length === 0));
  }
}
