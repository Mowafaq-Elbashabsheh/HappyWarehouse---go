import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../shared/table/table.component';
import { MatDialogModule } from '@angular/material/dialog';
import { formatDate } from '../../common/utils'
import { AlertService } from '../../common/alert';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, TableComponent, MatDialogModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent implements OnInit {

  logs: any;
  displayedColumns: any = ['traceId','time','message','innerException']

  constructor(private adminService: AdminService, private alertService: AlertService) {
    
  }

  ngOnInit(): void {
    this.getLogs();
  }

  getLogs(){
    this.adminService.GetLogs().subscribe({
      next: (response:any) => {
        if(response.length > 0){
          this.logs = response.map((x: any) =>({
            ...x,
            time: formatDate(x.timestamp)
          }));
        }
      },
      error: (errorResponse) => {
        this.alertService.showAlert("Something went wrong!!")
      }
    });
  }
}
