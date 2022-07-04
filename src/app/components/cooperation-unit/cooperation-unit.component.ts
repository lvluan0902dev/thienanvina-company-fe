import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { CooperationUnit } from 'src/app/models/cooperation-unit/cooperation-unit';
import { Image } from 'src/app/models/image/image.model';
import { CooperationUnitService } from 'src/app/services/cooperation-unit/cooperation-unit.service';
import { ImageService } from 'src/app/services/image/image.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cooperation-unit',
  templateUrl: './cooperation-unit.component.html',
  styleUrls: ['./cooperation-unit.component.css']
})
export class CooperationUnitComponent implements OnInit {
  public cooperationUnits: CooperationUnit[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public images: Image[] = [];
  public selectedImage: Image = new Image;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;

  constructor(private title: Title, private cooperationUnitService: CooperationUnitService, private toastr: ToastrService, private imageService: ImageService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('Đơn vị hợp tác - Quản trị hệ thống TAVN')
  }

  ngOnInit(): void {
    this.getAllCooperationUnit();
    this.createdForm();
  }

  // Data Object Start
  public getAllCooperationUnit(): void {
    this.cooperationUnitService.getAll().subscribe(response => {
      this.cooperationUnits = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(cooperationUnit: CooperationUnit): void {
    this.form = this.formBuilder.group({
      id: [cooperationUnit.id],
      order: [cooperationUnit.order],
      status: [cooperationUnit.status],
    });
    this.submitted = false;
    this.dialog = true;
    this.getAllImage(cooperationUnit.image_id)
      .finally(() => {
        this.selectedImage = this.images[0].id === cooperationUnit.image_id ? this.images[0] : new Image;
      });
  }

  public delete(cooperationUnit: CooperationUnit): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cooperationUnitService.delete(cooperationUnit.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllCooperationUnit();
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
    this.getAllCooperationUnit();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (Object.keys(this.selectedImage).length === 0) {
      return;
    }

    let cooperationUnit = {
      "id": this.form.value.id,
      "image_id": this.selectedImage.id,
      "order": !this.form.value.order ? 0 : this.form.value.order,
      "status": !this.form.value.status ? 0 : 1
    };

    if (!cooperationUnit.id) {
      this.cooperationUnitService.store(cooperationUnit).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.selectedImage = new Image();
          this.getAllCooperationUnit();
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
      this.cooperationUnitService.update(cooperationUnit).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.selectedImage = new Image();
          this.getAllCooperationUnit();
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
    return this.imageService.getAllImage({ 'folder': 'storage/image/cooperation_unit', 'image_id': id }).toPromise().then(response => {
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
