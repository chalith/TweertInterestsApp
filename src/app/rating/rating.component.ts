import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Input('polarities') polarities;
  data: TreeNode[] = [];
  dataLoaded = false;

  constructor() { }

  ngOnInit() {
    var categories = Object.keys(this.polarities);
    categories.forEach((category,idx)=>{
      if(category == 'hashtags'){
        var node: TreeNode = {data:{},leaf:true};
        node.data = {
          aspect:category,
          score:this.polarities[category]
        };
        this.data.push(node)
      }
      else{
        var object = this.polarities[category];
        var aspects = Object.keys(object);
        var children: TreeNode[] = [];
        var score = 0.0;
        aspects.forEach(aspect=>{
          var childnode: TreeNode = {data:{},leaf:true};
          childnode.data = {
            aspect:aspect,
            score:object[aspect]
          };
          children.push(childnode);
          score += object[aspect]
        });
        var node: TreeNode = {data:{},children:children,leaf:false};
        node.data = {
          aspect:category,
          score:aspects.length>0?score/aspects.length:0.0
        };
        this.data.push(node);
      }
      if(idx==categories.length-1){
        this.dataLoaded = true;
      }
    });
  }
}
