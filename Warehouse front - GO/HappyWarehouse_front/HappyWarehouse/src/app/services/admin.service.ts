import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../common/globals';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  GetLogs(){
    return this.http.get(Globals.apiUrl + '/Admin/GetLogs');
  }

}
