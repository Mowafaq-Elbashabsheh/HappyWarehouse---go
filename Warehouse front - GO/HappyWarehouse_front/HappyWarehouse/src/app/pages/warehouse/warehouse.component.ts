import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TableComponent } from '../../shared/table/table.component';
import { WarehouseService } from '../../services/warehouse.service';
import { WarehouseTable } from '../../Models/warehouseTable.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { AlertService } from '../../common/alert';


@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, TableComponent, MatDialogModule],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.css',
  template: ''
})
export class WarehouseComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [];
  dataSource: any[] = [];
  warehouses: any[] = [];

  constructor(private warehouseService: WarehouseService, private dialog: MatDialog, private alertService: AlertService) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getAllWarehouses()
  }

  getAllWarehouses(){
    this.warehouseService.GetAllWarehouses().subscribe({
      next: (response:any) => {
        if(response){
          this.warehouses = response;
          var warehouseTable = response.map((x: any) => ({ ...new WarehouseTable(x), country: x.country.name}));
          this.displayedColumns = Object.keys(warehouseTable[0]).filter(x=>x != 'countryId');
          this.dataSource = [...warehouseTable];
        }
      },
      error: (errorResponse) => {
        this.alertService.showAlert("Something went wrong!!")
      }
    })
  }

  addWarehouseDialog(){
    var dialogData = Object.assign(new WarehouseTable({}));
    dialogData.title = 'Add Warehouse';
    dialogData.mode = 'Add';
    var dialogComp = this.dialog.open(DialogComponent, {
      width: '60%',
      data: dialogData
    });

    dialogComp.afterClosed().subscribe(data => {
      this.addWarehouse(data);
    });
  }

  editWarehouseDialog(id: any) {
    var dialogData = this.dataSource.find(x => x.id == id);
    dialogData.title = 'Edit Warehouse';
    dialogData.mode = 'Edit';
    var dialogComp = this.dialog.open(DialogComponent, {
      width: '60%',
      data: dialogData
    });

    dialogComp.afterClosed().subscribe(data => {
      const {country, ...rest} = data;
      this.editWarehouse(rest);
    });
  }

  addWarehouse(data: any) {
    if(data){
      this.warehouseService.AddWarehouse(data).subscribe({
        next: (response:any) => {
          if(response){
            this.getAllWarehouses();
          }else{
            this.alertService.showAlert("Warehouse not added, Duplicate Warehouse name!")
          }
        },
        error: (errorResponse) => {
          this.alertService.showAlert("Something went wrong!!")
        }
      });
    }
  }

  editWarehouse(data: any) {
    if(data){
      var reqData = this.warehouses.find(x=>x.id == data.id);
      Object.assign(reqData, data);
      this.warehouseService.EditWarehouse(reqData).subscribe({
        next: (response:any) => {
          if(response){
            this.getAllWarehouses();
          }
        },
        error: (errorResponse) => {
          this.alertService.showAlert("Something went wrong!!")
        }
      });
    }
  }

  deleteWarehouse(id: any) {
    this.warehouseService.DeleteWarehouse(id).subscribe({
      next: (response:any) => {
        if(response){
          this.getAllWarehouses();
        }
      },
      error: (errorResponse) => {
        this.alertService.showAlert("Something went wrong!!")
      }
    });
  }
}
