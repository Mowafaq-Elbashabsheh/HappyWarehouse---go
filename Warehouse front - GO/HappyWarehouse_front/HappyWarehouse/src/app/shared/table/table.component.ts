import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource} from '@angular/material/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, RouterModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  template: ''
})
export class TableComponent implements AfterViewInit, OnInit, OnChanges {

  @Input() data!: any;
  @Input() columns!: string[];
  @Input() parent!: string;
  @Output() EditEmitter = new EventEmitter<void>();
  @Output() ChangePasswordEmitter = new EventEmitter<void>();
  @Output() DeleteEmitter = new EventEmitter<void>();

  displayedColumns: any;
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.displayedColumns = this.columns;
    if(this.parent != 'logs'){
      this.displayedColumns.push('actions');
    }
    this.dataSource = new MatTableDataSource(this.data);
  }

  edit(id: any, mode = 'edit') {
    if(mode == 'changePassword'){
      this.ChangePasswordEmitter.emit(id);
    }else{
      this.EditEmitter.emit(id)
    }
  }

  delete(id: any) {
    this.DeleteEmitter.emit(id)
  }
}
