import { ThrowStmt } from '@angular/compiler';
import { AfterViewChecked, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { Image } from 'src/app/models/image/image.model';
import { ProductAttribute } from 'src/app/models/product-attribute/product-attribute.model';
import { ProductBrand } from 'src/app/models/product-brand/product-brand.model';
import { ProductCategory } from 'src/app/models/product-category/product-category.model';
import { ProductImage } from 'src/app/models/product-image/product-image.model';
import { ProductUnit } from 'src/app/models/product-unit/product-unit.model';
import { Product } from 'src/app/models/product/product.model';
import { ImageService } from 'src/app/services/image/image.service';
import { ProductAttributeService } from 'src/app/services/product-attribute/product-attribute.service';
import { ProductBrandService } from 'src/app/services/product-brand/product-brand.service';
import { ProductCategoryService } from 'src/app/services/product-category/product-category.service';
import { ProductImageService } from 'src/app/services/product-image/product-image.service';
import { ProductUnitService } from 'src/app/services/product-unit/product-unit.service';
import { ProductService } from 'src/app/services/product/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductComponent implements OnInit, AfterViewChecked {
  public products: Product[] = [];
  public images: Image[] = [];
  public productUnits: ProductUnit[] = [];
  public loading: boolean = true;
  public submitted: boolean = false;
  public dialog: boolean = false;
  public selectedImage: Image = new Image;
  public form: FormGroup = new FormGroup({});
  public url: string = environment.apiUrl;
  public productCategories: ProductCategory[] = [];
  public productBrands: ProductBrand[] = [];
  // ----------------- Product Attribute Form -----------------
  public productAttributes: ProductAttribute[] = [];
  public submittedProductAttribute: boolean = false;
  public dialogProductAttribute: boolean = false;
  public formProductAttribute: FormGroup = new FormGroup({});
  public product_id: number = 0;
  // ----------------- Product Attribute Form -----------------
  public productImages: ProductImage[] = [];
  public submittedProductImage: boolean = false;
  public dialogProductImage: boolean = false;
  public formProductImage: FormGroup = new FormGroup({});
  public selectedProductImage: Image = new Image;
  public imageOfProductImages: Image[] = [];

  constructor(private title: Title, private productService: ProductService, private productUnitService: ProductUnitService, private productAttributeService: ProductAttributeService, private productImageService: ProductImageService, private productCategoryService: ProductCategoryService, private productBrandService: ProductBrandService, private imageService: ImageService, private toastr: ToastrService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    this.title.setTitle('Sản phẩm - Quản trị hệ thống TAVN');
  }

  ngAfterViewChecked(): void {
    if (!this.dialog) {
      this.form.reset();
    }
    if (!this.dialogProductAttribute) {
      this.formProductAttribute.reset();
    }
  }

  ngOnInit(): void {
    this.getAllProduct();
    this.createdForm();
    this.getAllProductCategory();
    this.getAllProductBrand();
    this.getAllProductUnit();
  }

  // Data Obejct Start
  public getAllProductCategory(): void {
    this.productCategoryService.getAll().subscribe(response => {
      this.productCategories = response.data;
      this.loading = false;
    });
  }

  public getAllProductBrand(): void {
    this.productBrandService.getAll().subscribe(response => {
      this.productBrands = response.data;
      this.loading = false;
    });
  }

  public getAllProduct(): void {
    this.productService.getAll().subscribe(response => {
      this.products = response.data;
      this.loading = false;
    });
  }

  public getAllProductUnit(): void {
    this.productUnitService.getAll().subscribe(response => {
      this.productUnits = response.data;
      this.loading = false;
    });
  }
  // Data Obejct End

  // Table Start
  public edit(product: Product): void {
    this.form = this.formBuilder.group({
      id: [product.id],
      product_category_id: [product.product_category_id, [Validators.required]],
      product_brand_id: [product.product_brand_id, [Validators.required]],
      product_unit_id: [product.product_unit_id, [Validators.required]],
      name: [product.name, [Validators.required]],
      short_description: [product.short_description],
      description: [product.description],
      specification: [product.specification],
      order: [product.order],
      status: [product.status],
    });
    this.submitted = false;
    this.dialog = true;
    this.getAllImage(product.image_id)
      .finally(() => {
        this.selectedImage = this.images[0].id === product.image_id ? this.images[0] : new Image;
      });
  }

  public delete(product: Product): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.delete(product.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllProduct();
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
      product_category_id: ['', [Validators.required]],
      product_brand_id: ['', [Validators.required]],
      product_unit_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      short_description: [''],
      description: [''],
      specification: [''],
      order: [''],
      status: [''],
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
    this.dialog = false;
    this.submitted = false;
    this.getAllProduct();
  }

  public save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.isEmptyObject(this.selectedImage))
    {
      return;
    }

    let product = {
      "id": this.form.value.id,
      "name": this.form.value.name,
      "product_category_id": this.form.value.product_category_id,
      "product_brand_id": this.form.value.product_brand_id,
      "product_unit_id": this.form.value.product_unit_id,
      "short_description": this.form.value.short_description,
      "description": this.form.value.description,
      "specification": this.form.value.specification,
      "image_id": this.selectedImage.id,
      "order": !this.form.value.order ? 0 : this.form.value.order,
      "status": !this.form.value.status ? 0 : 1
    };

    if (!product.id) {
      this.productService.store(product).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllProduct();
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
      this.productService.update(product).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.submitted = false;
          this.form.reset();
          this.getAllProduct();
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
    return this.imageService.getAllImage({ 'folder': 'storage/image/product', 'image_id': id }).toPromise().then(response => {
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

  // ----------------- Product Attribute -----------------
  public getAllProductAttribute(): void {
    this.productAttributeService.getAll(this.product_id).subscribe(response => {
      this.productAttributes = response.data;
    });
  }

  public openProductAttribute(product_id: number): void {
    this.submittedProductAttribute = false;
    this.dialogProductAttribute = true;
    this.product_id = product_id
    this.getAllProductAttribute();
    this.createdFormProductAttribute();
  }

  public saveProductAttribute() {
    this.submittedProductAttribute = true;
    if (this.formProductAttribute.invalid) {
      return;
    }

    let productAttribute = {
      "id": this.formProductAttribute.value.id,
      "product_id": this.product_id,
      "code": this.formProductAttribute.value.code,
      "size": this.formProductAttribute.value.size,
      "price": this.formProductAttribute.value.price,
      "stock": this.formProductAttribute.value.stock,
      "order": !this.formProductAttribute.value.order ? 0 : this.formProductAttribute.value.order,
      "status": !this.formProductAttribute.value.status ? 0 : 1
    };

    if (!productAttribute.id) {
      this.productAttributeService.store(productAttribute).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.resetFormProductAttribute();
          this.getAllProductAttribute();
        } else {
          this.toastr.error(JSON.stringify(response.message), 'Error', {
            timeOut: 2000,
            progressBar: true
          });
        }
      });
    }
    else {
      this.productAttributeService.update(productAttribute).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.resetFormProductAttribute();
          this.getAllProductAttribute();
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

  public editProductAttribute(productAttribute: ProductAttribute): void {
    this.formProductAttribute = this.formBuilder.group({
      id: productAttribute.id,
      product_id: this.product_id,
      code: productAttribute.code,
      size: productAttribute.size,
      price: productAttribute.price,
      stock: productAttribute.stock,
      order: !productAttribute.order ? 0 : productAttribute.order,
      status: !productAttribute.status ? 0 : 1
    });
    this.submittedProductAttribute = false;
    this.dialogProductAttribute = true;
  }

  public deleteProductAttribute(productAttribute: ProductAttribute) {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productAttributeService.delete(productAttribute.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllProductAttribute();
          }
        });
      }
    });
  }

  // Form Start
  public createdFormProductAttribute(): void {
    this.formProductAttribute = this.formBuilder.group({
      id: [''],
      product_id: [this.product_id],
      code: ['', [Validators.required]],
      size: ['', [Validators.required]],
      price: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      order: [''],
      status: [''],
    });
  }

  public get fProductAttribute() {
    return this.formProductAttribute.controls;
  }
  // Form End

  // Modal Start
  public hideDialogProductAttribute(): void {
    this.formProductAttribute.reset();
    this.dialogProductAttribute = false;
    this.submittedProductAttribute = false;
    this.product_id = 0;
  }

  public resetFormProductAttribute(): void {
    this.submittedProductAttribute = false;
    this.dialogProductAttribute = true;
    this.formProductAttribute.reset();
    this.formProductAttribute.value.product_id = this.product_id;
  }
  // Model End

  // ----------------- Product Image -----------------
  public getAllProductImage(): void {
    this.productImageService.getAll(this.product_id).subscribe(response => {
      this.productImages = response.data;
    });
  }

  public openProductImage(product_id: number): void {
    this.submittedProductImage = false;
    this.dialogProductImage = true;
    this.product_id = product_id
    this.getAllProductImage();
    this.getAllImageOfProductImage();
    this.createdFormProductImage();
  }

  public saveProductImage(): void {
    this.submittedProductImage = true;
    if (this.formProductImage.invalid || this.isEmptyObject(this.selectedProductImage)) {
      return;
    }

    let productImage = {
      "id": this.formProductImage.value.id,
      "product_id": this.product_id,
      "image_id": this.selectedProductImage.id,
      "order": !this.formProductImage.value.order ? 0 : this.formProductImage.value.order,
      "status": !this.formProductImage.value.status ? 0 : 1
    };

    if (!productImage.id) {
      this.productImageService.store(productImage).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.resetFormProductImage();
          this.getAllProductImage();
        } else {
          this.toastr.error(JSON.stringify(response.message), 'Error', {
            timeOut: 2000,
            progressBar: true
          });
        }
      });
    }
    else {
      this.productImageService.update(productImage).subscribe(response => {
        if (response.status === 1) {
          this.toastr.success(JSON.stringify(response.message), 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.resetFormProductImage();
          this.getAllProductImage();
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

  public editProductImage(productImage: ProductImage): void {
    this.formProductImage = this.formBuilder.group({
      id: productImage.id,
      product_id: this.product_id,
      order: !productImage.order ? 0 : productImage.order,
      status: !productImage.status ? 0 : 1
    });
    this.submittedProductImage = false;
    this.dialogProductImage = true;
    this.getAllImageOfProductImage(productImage.image_id)
      .finally(() => {
        this.selectedProductImage = this.imageOfProductImages[0].id === productImage.image_id ? this.imageOfProductImages[0] : new Image;
      });
  }
  public deleteProductImage(productImage: ProductImage): void {
    this.confirmationService.confirm({
      message: 'Bạn có thực sự muốn xoá?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productImageService.delete(productImage.id).subscribe(response => {
          if (response.status === 1) {
            this.toastr.success(JSON.stringify(response.message), 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAllProductImage();
          }
        });
      }
    });
  }

  // Form Start
  public createdFormProductImage(): void {
    this.formProductImage = this.formBuilder.group({
      id: [''],
      product_id: [this.product_id],
      order: [''],
      status: [''],
    });
  }

  public get fProductImage() {
    return this.formProductImage.controls;
  }
  // Form End

  // Modal Start
  public resetFormProductImage(): void {
    this.submittedProductImage = false;
    this.dialogProductImage = true;
    this.selectedProductImage = new Image;
    this.formProductImage.reset();
    this.formProductImage.value.product_id = this.product_id;
  }

  public hideDialogProductImage(): void {
    this.formProductImage.reset();
    this.dialogProductImage = false;
    this.submittedProductImage = false;
    this.product_id = 0;
    this.selectedProductImage = new Image;
  }
  // Model End

  // Image start
  public getAllImageOfProductImage(id?: number): any {
    return this.imageService.getAllImage({ 'folder': 'storage/image/product_image', 'image_id': id }).toPromise().then(response => {
      this.imageOfProductImages = response.data;
    });
  }

  public deleteImageOfProductImage(image: Image): void {
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
            this.getAllImageOfProductImage();
          }
        });
      },
    });
  }

  public onUploadProductImage(event: any): void {
    this.getAllImageOfProductImage();
    this.toastr.success('"Image uploaded successfully"', 'Success', {
      timeOut: 2000,
      progressBar: true
    })
  }

  public onRowSelectProductImage(event: any): void {

  }

  public onRowUnselectProductImage(event: any): void {
    this.selectedProductImage = new Image;
  }
  // Image end
}
