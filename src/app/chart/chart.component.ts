import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from 'primeng/primeng';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input('data') data;
  @Input('title') title;
  options: any;
  
  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.options = {
      title: {
        display: true,
        text: this.title,
        fontSize: 12
      },
      legend: {
        display: false,
        position: 'top'
      }
    };
  }

  selectData(event) {
    this.messageService.add({severity: 'info', summary: 'Data Selected', 'detail': this.data.datasets[event.element._datasetIndex].data[event.element._index]});
  }

}
