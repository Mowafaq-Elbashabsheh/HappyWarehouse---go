import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globals } from '../common/globals';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private http: HttpClient) { }

  GetAllWarehouses(){
    return this.http.get(Globals.apiUrl + '/Warehouse/GetAllWarehouses');
  }

  EditWarehouse(warehouse: any){
    return this.http.post(Globals.apiUrl + '/Warehouse/EditWarehouse', warehouse);
  }

  AddWarehouse(warehouse: any){
    return this.http.post(Globals.apiUrl + '/Warehouse/AddWarehouse', warehouse);
  }

  DeleteWarehouse(id: any){
    return this.http.get(Globals.apiUrl + '/Warehouse/DeleteWarehouse?id=' + id);
  }
  
}
