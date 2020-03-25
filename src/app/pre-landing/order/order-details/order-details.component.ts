import { Component, OnInit } from '@angular/core';
import { Iorder } from 'src/app/models/order.interface';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { SideModalComponent } from 'src/app/modals/side-modal/side-modal.component';
import { CenterModalComponent } from 'src/app/modals/center-modal/center-modal.component';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  orders: Iorder[];
  content:string="addOrder";
  constructor(
    private _orderService: OrderService,
    private excelService: ExcelService,
    private router: Router,
    private modalService:NgbModal
  ) { }

  ngOnInit() {
    this.getOrders();
  }

  getOrders(){
    this._orderService.getOrdersData().subscribe(
      data=>{
        this.orders = data;
        console.log(this.orders)
      }
    )
  }
  open(content)
  {
      console.log(content);
      const modalAddRef=this.modalService.open(SideModalComponent);
      modalAddRef.componentInstance.content=content;
  }

  opencenterModal(order:Iorder)
  {
    const modalRef=this.modalService.open(CenterModalComponent);
    modalRef.componentInstance.order=order;

  }
}
