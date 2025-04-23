import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  userRole: any;
  
  constructor(private router: Router) {
    
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('UserData');
    
    const userDataObj = JSON.parse(userData? userData : '{}');
    this.userRole = userDataObj.role;
  }

  Logout(){
    localStorage.setItem('UserData', '{}');
    //sessionStorage.setItem('socketId', '');
    this.router.navigateByUrl('/login');
  }
}
