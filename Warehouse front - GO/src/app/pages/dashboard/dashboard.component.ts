import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService } from '../../services/dashboard.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../common/alert';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule, MatTableModule, MatPaginatorModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: []
})
export class DashboardComponent implements OnInit, AfterViewInit {

  minItems: any;
  maxItems: any;
  warehousesStatus: any;

  minMaxColumns: any = ['name','quantity'];
  warehouseColumns: any = ['warehouseName','itemsCount']

  minDataSource: any;
  maxDataSource: any;
  statusDataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dashboardService: DashboardService, private alertService: AlertService) {
    
  }

  ngOnInit(): void {
    this.getTopItems();
    this.GetWarehouseStatus();
  }

  ngAfterViewInit(): void {
    this.minDataSource = new MatTableDataSource(this.minItems);
    this.minDataSource.paginator = this.paginator;

    this.maxDataSource = new MatTableDataSource(this.maxItems);
    this.maxDataSource.paginator = this.paginator;
    
    this.statusDataSource = new MatTableDataSource(this.warehousesStatus);
    this.statusDataSource.paginator = this.paginator;
  }

  getTopItems(){
    this.dashboardService.GetTopItems().subscribe({
      next: (response:any) => {
        this.minItems = response.minItems;
        this.maxItems = response.maxItems;
      },
      error: (errorResponse) => {
        this.alertService.showAlert("Something went wrong!!")
      }
    });
  }

  GetWarehouseStatus(){
    this.dashboardService.GetWarehouseStatus().subscribe({
      next: (response:any) => {
        this.warehousesStatus = response;
      },
      error: (errorResponse) => {
        this.alertService.showAlert("Something went wrong!!")
      }
    });
  }
  
}
