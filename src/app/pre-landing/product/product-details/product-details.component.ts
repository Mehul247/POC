import { Component, OnInit, HostListener } from '@angular/core';
import { IProduct } from 'src/app/models/product.interface';
import { ProductService } from 'src/app/services/product.service';
import { ExcelService } from 'src/app/services/excel.service';
import { SearchProductPipe } from 'src/app/core/pipes/search-product.pipe';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SideModalComponent } from 'src/app/modals/side-modal/side-modal.component';
import { CenterModalComponent } from 'src/app/modals/center-modal/center-modal.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  products: IProduct[];
  search: string = '';
  discount: string = "Yes";
  page = 1;
  pageSize = 10;
  suppliers = [];
  categories = [];
  collectionSize: number = 100;
  content: string = "addProduct";
  searchItem: string = "";
  filteredProducts = [];
  selectedSupplier: string;
  selectedCategory: string;
  isShowSpinner: boolean = true;
  order: string = 'decending';
  arrow = {
    id: 'down',
    title: 'down',
    price: 'down',
    stock: 'down'
  }

  constructor(
    public _ProductService: ProductService,
    private _ExcelService: ExcelService,
    public searchProductFilter: SearchProductPipe,
    private router: Router,
    private angularFireDatabase: AngularFireDatabase,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getProducts();
    this._ProductService.getAllData().subscribe(data => {
      this.suppliers = this._ProductService.getSuppliersOrCategories(data.map(data => data['supplier']));
      this.categories = this._ProductService.getSuppliersOrCategories(data.map(data => data['category']))
    })
  }

  getProducts() {
    this._ProductService.getAllData().subscribe(data => {
      this.products = data
      this.filteredProducts = data;
      this.collectionSize = this.products.length;
      this.isShowSpinner = false;
    })
  }

  filterProduct(event, property?) {
    if (property == 'supplier') {
      this.selectedSupplier = event.target.value
      if (this.selectedSupplier == 'Supplier') {
        this.selectedSupplier = '';
      }

    }
    if (property == 'category') {
      this.selectedCategory = event.target.value
      if (this.selectedCategory == 'Category') {
        this.selectedCategory = '';
      }
    }
    this.products = this.searchProductFilter.transform(this.filteredProducts, this.searchItem, this.selectedSupplier, this.selectedCategory);
    this.collectionSize = this.products.length
    console.log(this.products)
  }

  openSideModal(content) {
    const modalAddRef = this.modalService.open(SideModalComponent);
    modalAddRef.componentInstance.content = content;
  }

  openCenterModal(product: IProduct) {
    const modalRef = this.modalService.open(CenterModalComponent);
    modalRef.componentInstance.product = product;
  }

  exportToExcel() {
    let fileName = 'products.csv';
    let columnNames = ["Id", "Name", "Supplier", "Category", "Price", "Discounted", "Discount"];
    this._ExcelService.exportToExcel(fileName, columnNames, this.products.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize))
  }

  chnageDiscount(event, obj) {
    this._ProductService.updateProduct(obj);
  }

  sort(key) {
    console.log(key)

    if (this.order == 'decending' && this.arrow[key] == 'down') {
      this._ProductService.sortBy(key).subscribe(data => {
        this.products = data
      })
      this.order = "ascending";
      this.arrow[key] = 'up';
    }
    else {
      this._ProductService.sortBy(key).subscribe(data => {
        this.products = data.reverse()
      })
      this.order = 'decending';
      this.arrow[key] = 'down';
    }
  }
}
