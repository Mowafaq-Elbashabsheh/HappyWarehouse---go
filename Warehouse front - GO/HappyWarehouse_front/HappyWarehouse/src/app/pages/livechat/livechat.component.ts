import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../services/websocket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-livechat',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './livechat.component.html',
  styleUrl: './livechat.component.css'
})
export class LivechatComponent implements OnInit, OnDestroy {
  message: string;
  listMessages: string[];
  
  constructor(private webSocketService: WebSocketService) {
    this.webSocketService.onMessage().subscribe((data: string) => {
      this.handleMessage(data);
    });
    this.message = '';
    this.listMessages = [];
  }

  ngOnInit(): void {
    // var socketId = sessionStorage.getItem('socketId');
    // if(socketId != null){
    //   this.webSocketService.connectSocket(socketId);
    // }
  }

  ngOnDestroy(): void {
    this.webSocketService.closeConnection();
  }

  sendMessage(){
    this.webSocketService.sendMessage(this.message);
  }

  handleMessage(message: string){
    this.listMessages.push(message);
  }

}
