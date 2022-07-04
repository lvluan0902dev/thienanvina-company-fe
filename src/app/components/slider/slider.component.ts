import { AfterViewChecked, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { Image } from 'src/app/models/image/image.model';
import { Slider } from 'src/app/models/slider/slider.model';
import { ImageService } from 'src/app/services/image/image.service';
import { SliderService } from 'src/app/services/slider/slider.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SliderComponent implements OnInit, AfterViewChecked {
  public sliders: Slider[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public images: Image[] = [];
  public selectedImage: Image = new Image;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;

  constructor(private title: Title, private sliderService: SliderService, private toastr: ToastrService, private imageService: ImageService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('Slider - Quản trị hệ thống TAVN');
  }
  ngAfterViewChecked(): void {
    if (!this.dialog)
    {
      this.form.reset();
    }
  }

  ngOnInit(): void {
    this.getAllSlider();
    this.createdForm();
  }

  // Data Obejct Start
  public getAllSlider(): void {
    this.sliderService.getAll().subscribe(response => {
      this.sliders = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(slider: Slider): void {
    this.form = this.formBuilder.group({
      id: [slider.id],
      title: [slider.title, [Validators.required]],
      link: [slider.link, [Validators.required]],
      order: [slider.order],
      content: [slider.content, [Validators.required]],
      status: [slider.status],
    });
    this.submitted = false;
    this.dialog = true;
    this.getAllImage(slider.image_id)
      .finally(() => {
        this.selectedImage = this.images[0].id === slider.image_id ? this.images[0] : new Image;
      });
  }

  public delete(slider: Slider): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.sliderService.delete(slider.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllSlider();
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
      link: ['', [Validators.required]],
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
    this.getAllImage();
  }

  public hideDialog(): void {
    this.form.reset();
    this.selectedImage = new Image();
    this.dialog = false;
    this.submitted = false;
    this.getAllSlider();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (Object.keys(this.selectedImage).length === 0) {
      return;
    }

    let slider = {
      "id": this.form.value.id,
      "title": this.form.value.title,
      "content": this.form.value.content,
      "link": this.form.value.link,
      "image_id": this.selectedImage.id,
      "order": !this.form.value.order ? 0 : this.form.value.order,
      "status": !this.form.value.status ? 0 : 1
    };

    if (!slider.id) {
      this.sliderService.store(slider).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.selectedImage = new Image();
          this.getAllSlider();
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
      this.sliderService.update(slider).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.selectedImage = new Image();
          this.getAllSlider();
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
    return this.imageService.getAllImage({ 'folder': 'storage/image/slider', 'image_id': id }).toPromise().then(response => {
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
