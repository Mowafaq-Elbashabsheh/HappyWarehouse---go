import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserTable } from '../../Models/userTable.model';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { TableComponent } from '../../shared/table/table.component';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../common/alert';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ CommonModule, TableComponent, MatDialogModule ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [];
  dataSource: any[] = [];
  users: any[] = [];

  constructor(private userService: UserService, private dialog: MatDialog, private alertService: AlertService) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getAllUsers()
  }

  getAllUsers(){
    this.userService.GetAllUsers().subscribe({
      next: (response:any) => {
        if(response){
          this.users = response;
          var userTable = response.map((x: any) => ({ ...new UserTable(x), role: x.role.name }));
          this.displayedColumns = Object.keys(userTable[0]).filter(x=>x != 'roleId' && x != 'password');
          this.dataSource = [...userTable];
        }
      },
      error: (errorResponse) => {
        this.alertService.showAlert("Something went wrong!!")
      }
    })
  }

  addUserDialog(){
    var dialogData = Object.assign(new UserTable({}));
    dialogData.title = 'Add User';
    dialogData.mode = 'Add';
    var dialogComp = this.dialog.open(DialogComponent, {
      width: '60%',
      data: dialogData
    });

    dialogComp.afterClosed().subscribe(data => {
      this.addUser(data);
    });
  }

  editUserDialog(id: any) {
    var dialogData = this.dataSource.find(x => x.id == id);
    dialogData.title = 'Edit User';
    dialogData.mode = 'Edit';
    delete dialogData.password;
    var dialogComp = this.dialog.open(DialogComponent, {
      width: '60%',
      data: dialogData
    });

    dialogComp.afterClosed().subscribe(data => {
      const {role, ...rest} = data;
      this.editUser(rest);
    });
  }

  changePasswordDialog(id: any){
    var dialogData = { id: id, password: '', confirmPassword: '', title: 'Change Password', mode: 'Edit' };
    var dialogComp = this.dialog.open(DialogComponent, {
      width: '60%',
      data: dialogData
    });

    dialogComp.afterClosed().subscribe(data => {
      const {role, ...rest} = data;
      this.editUser(rest);
    });
  }

  addUser(data: any) {
    if(data){
      this.userService.AddUser(data).subscribe({
        next: (response:any) => {
          if(response){
            this.getAllUsers();
          }else{
            this.alertService.showAlert("User not added, Duplicate User Email!");
          }
        },
        error: (errorResponse) => {
          this.alertService.showAlert("Something went wrong!!")
        }
      });
    }
  }

  editUser(data: any) {
    if(data){
      var reqData = this.users.find(x=>x.id == data.id);
      Object.assign(reqData, data);
      this.userService.EditUser(reqData).subscribe({
        next: (response:any) => {
          if(response){
            this.getAllUsers();
          }
        },
        error: (errorResponse) => {
          this.alertService.showAlert("Something went wrong!!")
        }
      });
    }
  }

  deleteUser(id: any) {
    this.userService.DeleteUser(id).subscribe({
      next: (response:any) => {
        if(response){
          this.getAllUsers();
        }
      },
      error: (errorResponse) => {
        this.alertService.showAlert("Something went wrong!!")
      }
    });
  }
}
