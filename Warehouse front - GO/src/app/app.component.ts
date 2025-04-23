import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

export const broadcastChannel = new BroadcastChannel('socket');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'HappyWarehouse';
  socket: any;
  constructor() {
    broadcastChannel.onmessage = (evt) => {
      
    }
  }

}
