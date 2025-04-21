import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../Models/login.model';
import { Globals } from '../common/globals';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  Login(data: Login){
    return this.http.post(Globals.apiUrl + '/Users/Login', data);
  }

  GetAllUsers(){
    return this.http.get(Globals.apiUrl + '/Users/GetUsers');
  }

  EditUser(User: any){
    return this.http.put(Globals.apiUrl + '/Users/UpdateUser', User);
  }

  AddUser(User: any){
    return this.http.post(Globals.apiUrl + '/Users/Register', User);
  }

  DeleteUser(id: any){
    return this.http.delete(Globals.apiUrl + '/Users/DeleteUser?id=' + id);
  }

}
