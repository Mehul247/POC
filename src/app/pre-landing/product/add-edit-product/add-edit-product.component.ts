import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from 'src/app/models/product.interface';
import { ProductService } from 'src/app/services/product.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})
export class AddEditProductComponent implements OnInit {

  @Input() public editProduct: IProduct;
  productLength: number;
  suppliers: IProduct;
  categories: IProduct;
  data: IProduct;
  productId: number;
  showDiscount: boolean = true;
  id: number;

  constructor(private _ProductService: ProductService,
    private fb: FormBuilder,
    private angularFireDatabase: AngularFireDatabase,
    private activeModal: NgbActiveModal
  ) { }

  productForm = this.fb.group({
    name: ["", Validators.required],
    supplier: ["", Validators.required],
    price: [, [Validators.required, Validators.min(1)]],
    category: ["", Validators.required],
    discounted: ["", Validators.required],
    discount: [, [Validators.required,Validators.min(0)]]
  })

  ngOnInit() {
    this.getProducts();

    if (this.editProduct) {
      this.productForm.patchValue({
        id: this.editProduct.id,
        name: this.editProduct.name,
        supplier: this.editProduct.supplier,
        category: this.editProduct.category,
        price: this.editProduct.price,
        discounted: this.editProduct.discounted,
        discount: this.editProduct.discount
      })
      if (this.editProduct.discounted == 'No') {
        this.showDiscount = false
      }
    }
    else {
      this.showDiscount = false;
    }
  }

  getProducts() {
    this._ProductService.getAllData().subscribe(data => {
      this.productLength = data.length
      this.suppliers = this._ProductService.getSuppliersOrCategories(data.map(data => data['supplier']));
      this.categories = this._ProductService.getSuppliersOrCategories(data.map(data => data['category']))
    })
  }

  isShowDiscount(event) {
    if (event.target.value == 'Yes') {
      this.showDiscount = true
    }
    else {
      this.showDiscount = false
      this.productForm.patchValue({
        name: this.productForm.controls['name'].value,
        supplier: this.productForm.controls['supplier'].value,
        category: this.productForm.controls['category'].value,
        price: this.productForm.controls['price'].value,
        discount: 0,
        discounted: this.productForm.controls['discounted'].value,
      })
    }
  }

  onSubmit() {

    if (this.editProduct) {
      console.log('update')
      let data = {
        id: this.editProduct.id,
        name: this.productForm.controls['name'].value,
        supplier: this.productForm.controls['supplier'].value,
        category: this.productForm.controls['category'].value,
        price: this.productForm.controls['price'].value,
        discount: this.productForm.controls['discount'].value,
        discounted: this.productForm.controls['discounted'].value,
      }
      this._ProductService.updateProduct(data);
      this.activeModal.close();
    }
    else {
      console.log('add');
      let sub = this.angularFireDatabase.list('/products').valueChanges().subscribe(prodcuts => {
        this.data = {
          id: prodcuts.length + 1,
          name: this.productForm.controls['name'].value,
          supplier: this.productForm.controls['supplier'].value,
          category: this.productForm.controls['category'].value,
          discounted: this.productForm.controls['discounted'].value,
          price: this.productForm.controls['price'].value,
          discount: this.productForm.controls['discount'].value,
        }

        this._ProductService.addProduct(this.data);
        sub.unsubscribe();
        this.activeModal.close();
      })
    }
  }

}
