import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TableComponent } from '../../shared/table/table.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { ItemTable } from '../../Models/itemTable.model';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AlertService } from '../../common/alert';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, TableComponent, MatDialogModule, RouterModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit,AfterViewInit{
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  items: any[] = [];
  warehouseId: any;

  constructor(private itemService: ItemService, private dialog: MatDialog, private route: ActivatedRoute, private alertService: AlertService) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.warehouseId = params.get('id');
    });
  }

  ngAfterViewInit(): void {
    this.getAllItems()
  }

  getAllItems(){
    this.itemService.GetItemsByWarehouseId(this.warehouseId).subscribe({
      next: (response:any) => {
        if(response){
          this.items = response;
          var itemTable = response.map((x: any) => ({ ...new ItemTable(x), warehouse: x.warehouse.name }));
          this.displayedColumns = Object.keys(itemTable[0]);
          this.dataSource = [...itemTable];
        }
      },
      error: (errorResponse) => {
        this.alertService.showAlert("Something went wrong!!")
      }
    })
  }

  addItemDialog(){
    var dialogData = Object.assign(new ItemTable({}));
    dialogData.title = 'Add Item';
    dialogData.mode = 'Add';
    delete dialogData.warehouse;
    var dialogComp = this.dialog.open(DialogComponent, {
      width: '60%',
      data: dialogData
    });

    dialogComp.afterClosed().subscribe(data => {
      data.warehouseId = Number(this.warehouseId);
      data.quantity = Number(data.quantity)
      data.costPrice = Number(data.costPrice)
      data.msrpPrice = Number(data.msrpPrice)
      this.addItem(data);
    });
  }

  editItemDialog(id: any) {
    var dialogData = this.dataSource.find(x => x.id == id);
    dialogData.title = 'Edit Item';
    dialogData.mode = 'Edit';
    var dialogComp = this.dialog.open(DialogComponent, {
      width: '60%',
      data: dialogData
    });

    dialogComp.afterClosed().subscribe(data => {
      data.quantity = Number(data.quantity)
      data.costPrice = Number(data.costPrice)
      data.msrpPrice = Number(data.msrpPrice)
      const {warehouse, ...rest} = data;
      this.editItem(rest);
    });
  }

  addItem(data: any) {
    if(data){
      this.itemService.AddItem(data).subscribe({
        next: (response:any) => {
          if(response){
            this.getAllItems();
          }else{
            this.alertService.showAlert("Item not added, Duplicate item name!")
          }
        },
        error: (errorResponse) => {
          this.alertService.showAlert("Something went wrong!!")
        }
      });
    }
  }

  editItem(data: any) {
    if(data){
      var reqData = this.items.find(x=>x.id == data.id);
      Object.assign(reqData, data);
      this.itemService.EditItem(reqData).subscribe({
        next: (response:any) => {
          if(response){
            this.getAllItems();
          }
        },
        error: (errorResponse) => {
          this.alertService.showAlert("Something went wrong!!")
        }
      });
    }
  }

  deleteItem(id: any) {
    this.itemService.DeleteItem(id).subscribe({
      next: (response:any) => {
        if(response){
          this.getAllItems();
        }
      },
      error: (errorResponse) => {
        this.alertService.showAlert("Something went wrong!!")
      }
    });
  }

}
