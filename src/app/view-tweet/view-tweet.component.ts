import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-view-tweet',
  templateUrl: './view-tweet.component.html',
  styleUrls: ['./view-tweet.component.css']
})
export class ViewTweetComponent implements OnInit {
  @Input('tweettext') tweettext;
  @Output() onHide = new EventEmitter();
  showDialog = true;

  constructor() { }

  ngOnInit() {
  }

  hideDialog(){
    this.onHide.emit();
  }

}
