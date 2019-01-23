import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { minRIDistance } from '../common/vars';
import { } from 'node_modules/@types/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input('data') data;
  @Output() loadRIs = new EventEmitter();
  @Output() viewTweet = new EventEmitter();
  @ViewChild('gmap') gmapElement: any;
  
  constructor(private cdRef:ChangeDetectorRef) { }
  RIs = [];
  colors = [];
  Math = Math;
  minRIDistance = minRIDistance;
  options: any;
  heatmap;
  map;
  markers = [];
  circes = [];

  ngOnInit() {
    var mapItems = [];
    var bounds = new google.maps.LatLngBounds();
    this.data.forEach((point1,idx) => {
      point1['idx'] = idx;
      var point = new google.maps.LatLng(point1.latitude, point1.longitude);
      this.markers.push(new google.maps.Marker({
        position: point,
        title: point1.dataitem,
        opacity: 0.35,
        clickable: true,
      }))
      mapItems.push(point)
      bounds.extend(point);
    });
    this.initMap(mapItems, bounds);
    this.data.sort(function(a, b){return (a.latitude+a.longitude)-(b.latitude+b.longitude)});
    this.getRIs();
    this.loadRIs.emit(this.RIs);
  }

  initMap(data,bounds){
    this.map = new google.maps.Map(this.gmapElement.nativeElement);	
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: data,
      map: this.map
    });
    this.map.fitBounds(bounds); 
  } 

  toggleMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(this.markers[i].getMap()? null: this.map);
    }
  }

  toggleRoAs() {
    for (var i = 0; i < this.circes.length; i++) {
      this.circes[i].setMap(this.circes[i].getMap()? null: this.map);
    }
  }

  toggleHeatmap() {
    this.heatmap.setMap(this.heatmap.getMap() ? null : this.map);
  }

  changeGradient() {
    var gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ]
    this.heatmap.set('gradient', this.heatmap.get('gradient') ? null : gradient);
  }

  changeRadius() {
    this.heatmap.set('radius', this.heatmap.get('radius') ? null : 20);
  }

  changeOpacity() {
    this.heatmap.set('opacity', this.heatmap.get('opacity') ? null : 0.2);
  }
  
  // getRIs(){
  //   var ri;
  //   var max = 0;
  //   this.data.forEach(point1 => {
  //     var count = 0;
  //     this.data.forEach(point2=>{
  //       if(this.getGeoDistance([point1.latitude,point1.longitude],[point2.latitude,point2.longitude])<this.minRadius){
  //         count++;
  //       }
  //     });
  //     if(count>max){
  //       max=count;
  //       ri=point1;
  //     }
  //   });
  //   return ri;
  // }
  
  containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
  }
  getUnion(arr1, arr2) {
    for(var idx=0; idx<arr2.length; idx++){
      var ele = arr2[idx];
      if(!(this.containsObject(ele, arr1))){
        arr1.push(ele)
      }
    }
    return arr1;
  }

  createGroup(group, key){
    var curKey = JSON.stringify(key);
    var items = [key].concat(group[curKey]? group[curKey].group: []);
    delete group[curKey];
    for(var i=0; i<items.length; i++){
      var point = items[i];
      if(point !== key){
        items = this.getUnion(items, this.createGroup(group, point));
      }
    }
    return items;
  }

  getRIs(){
    var pointgroup = {};
    for(var idx1=0; idx1<this.data.length; idx1++){
      var point1 = this.data[idx1];
      pointgroup[JSON.stringify(point1)] = {'group':[]}
      for(var idx2=0; idx2<this.data.length; idx2++){
        var point2 = this.data[idx2];
        if(idx1!=idx2){
          var dis = this.getGeoDistance([point1.latitude,point1.longitude],[point2.latitude,point2.longitude]);
          if(dis < minRIDistance){
            pointgroup[JSON.stringify(point1)]['group'].push(point2);
          }
        }
      }
    }
    var maxCount = 0;
    var groups = [];
    for(var idx=0; idx<this.data.length; idx++){
      var point = this.data[idx];
      var key = JSON.stringify(point);
      if(key in pointgroup){
        var group = this.createGroup(pointgroup, point);
        groups.push(group);
        if(group.length > 1 && group.length > maxCount){
          maxCount = group.length;
        }
      }
    }
    for(var idx1=0; idx1<groups.length; idx1++){
      group = groups[idx1];
      if(maxCount == group.length){
        var latlnggroup = [];
        var color = this.getRandomColor();
        for(var idx2=0; idx2<group.length; idx2++){
          point = group[idx2];    
          latlnggroup.push({lat:point.latitude,lng:point.longitude});
          this.circes.push(new google.maps.Circle({
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35,
            center: new google.maps.LatLng(point.latitude, point.longitude),
            radius: minRIDistance
          }));
        }
        this.RIs.push(latlnggroup);
        this.colors.push(color);
      }
    }
  }

  getGeoDistance(point1, point2){
    var lat1 = point1[0];
    var lon1 = point1[1];
    var lat2 = point2[0];
    var lon2 = point2[1];
    var radius = 6371;
    var pi = Math.PI;
    var dlat = (lat2-lat1) * (pi/180);
    var dlon = (lon2-lon1) * (pi/180);
    lat1 = (lat1) * (pi/180);
    lat2 = (lat2) * (pi/180);
    var a = Math.sin(dlat/2) ** 2 + Math.sin(dlon/2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return radius * c * 1000;
  }

  getRandomColor(){
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  showTweet(text){
    this.viewTweet.emit(text)
  }
}
