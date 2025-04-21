import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../services/websocket.service';
import { AlertService } from '../../common/alert';

@Component({
  selector: 'app-chatgroups',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './chatgroups.component.html',
  styleUrl: './chatgroups.component.css'
})
export class ChatgroupsComponent {

  groupId: string;

  constructor(private webSocketService: WebSocketService, private alertService: AlertService) {
    this.groupId = ''
  }

  createNewGroup(){
    this.webSocketService.createNewGroup(this.groupId).subscribe({
      next: (response:any) => {
        if(response){
          var socketId = sessionStorage.getItem('socketId');
          if(socketId != null){
            this.webSocketService.connectSocket(socketId);
            this.webSocketService.addSocketToGroup(this.groupId, socketId).subscribe();
          }
        }
      },
      error: (errorResponse) => {
        this.alertService.showAlert("Something went wrong!!")
      }
    });
  }

  joinGroup(){
    var socketId = sessionStorage.getItem('socketId');
    if(socketId != null){
      this.webSocketService.addSocketToGroup(this.groupId, socketId).subscribe({
        next: (response:any) => {
          if(response){
            var socketId = sessionStorage.getItem('socketId');
            if(socketId != null){
              this.webSocketService.connectSocket(socketId);
              this.webSocketService.addSocketToGroup(this.groupId, socketId)
            }
          }
        },
        error: (errorResponse) => {
          this.alertService.showAlert("Something went wrong!!")
        }
      });
    }
  }
}
