import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globals } from '../common/globals';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  GetItemsByWarehouseId(warehouseId: any){
    return this.http.get(Globals.apiUrl + '/Items/GetItemsByWarehouseId?warehouseId=' + warehouseId);
  }

  EditItem(Item: any){
    return this.http.post(Globals.apiUrl + '/Items/EditItem', Item);
  }

  AddItem(Item: any){
    return this.http.post(Globals.apiUrl + '/Items/AddItem', Item);
  }

  DeleteItem(id: any){
    return this.http.get(Globals.apiUrl + '/Items/DeleteItem?id=' + id);
  }
  
}
