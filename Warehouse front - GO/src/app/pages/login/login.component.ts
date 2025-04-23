import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Login } from '../../Models/login.model';
import { AlertService } from '../../common/alert';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [UserService]
})
export class LoginComponent {
  loginObj: Login;
  
  constructor(private userService: UserService, private router: Router, 
    private alertService: AlertService, private websocketService: WebSocketService)
  {
    this.loginObj = new Login();
  }

  Login(){
    this.userService.Login(this.loginObj).subscribe({
      next: (response:any) => {
        if(!response.token){
          this.alertService.showAlert(response.errorMessage)
          return;
        }
        localStorage.setItem('UserData', JSON.stringify(response));
        
        //var socketId = response.email;
        // if(sessionStorage.getItem('socketId') == null){
        //   sessionStorage.setItem('socketId', socketId)
        // }
        
        this.router.navigateByUrl('/welcome');
      },
      error: (errorResponse) => {
        this.alertService.showAlert('Email or Password is not correct')
      }
    });
  }
}

