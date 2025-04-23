import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Globals } from '../common/globals';

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    private webSocket: any;
    private message: Subject<any> = new Subject();

    constructor(private http: HttpClient) {
        
    }
   
    connectSocket(socketId: string) {
        this.webSocket = new WebSocket('wss://localhost:7187/ws?socketId=' + socketId);
          
        this.webSocket.onopen = (event: any) => {
            console.log("connected");
        };

        this.webSocket.onmessage = (event: any) => {
            this.message.next(event.data);
        }

        this.webSocket.onclose = (event: any) => {
            console.log("closed");
        };

        this.webSocket.onerror = (error: any) => {
            console.log(error);
        };
    }

    sendMessage(message: string) {
        this.webSocket.send(message);
    }

    onMessage(){
        return this.message.asObservable();
    }

    closeConnection() {
        this.webSocket.close();
    }

    addSocketToGroup(groupId: string, socketId: string) {
        return this.http.post(Globals.apiUrl + '/WebSocket/AddSocketToGroup', {socketId: socketId, groupId: groupId});
    }

    createNewGroup(groupId: string){
        return this.http.get(Globals.apiUrl + '/WebSocket/CreateNewGroup?groupId=' + groupId);
    }
}
   