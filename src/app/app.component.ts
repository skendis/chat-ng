import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SocketService} from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'ng-chat';
  text: string;
  messages: {}[] = [];
  connectedUsersCount: number;
  currentUserId:string = this.socketService.makeId(4);
  currentUserName:string;
  constructor(private socketService: SocketService) {
  }

  handleMsgSubmit(event) {
    event.preventDefault();

    console.log(this.text);
    if (this.text && this.text.length >= 1) {
      const msgObj = {
        userId:this.currentUserId,
        user:this.currentUserName,
        msg: this.text,
        date: Date.now()
      };
      this.messages.push(msgObj);
      this.socketService.emit('chat-message', msgObj);
      this.text = null;
    }
  }

  ngOnInit() {
    this.socketService.listen('chat-message').subscribe((data) => {
      this.messages.push(data);
    });
    this.socketService.listen('connected-users').subscribe((data: number) => {
      this.connectedUsersCount = data;
    });
    const historySub = this.socketService.listen('chat-history').subscribe((data:any[])=>{
      this.messages = data;
      historySub.unsubscribe();
    })
  }
}
