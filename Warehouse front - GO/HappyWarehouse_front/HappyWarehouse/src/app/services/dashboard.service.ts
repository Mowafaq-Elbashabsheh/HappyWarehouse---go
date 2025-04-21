import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../common/globals';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  GetTopItems(){
    return this.http.get(Globals.apiUrl + '/Dashboard/GetTopItems');
  }

  GetWarehouseStatus(){
    return this.http.get(Globals.apiUrl + '/Dashboard/GetWarehouseStatus');
  }

}
