import { Component, OnInit, ViewChild } from '@angular/core';
import { CensusOpinionService } from '../services/census-opinion/census-opinion.service';
import { DenitymapService } from '../services/densitymap/denitymap.service';
import { SelectItem } from 'primeng/components/common/selectitem';
import { DatePipe } from "@angular/common";
import { since, until, maxTime, minTime, aspect_type } from '../common/vars'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('dv') dv;
  items = [];
  sortOptions: SelectItem[];
  maxItems: SelectItem[];
  sortKey: string;
  maxKey: string;
  sortField: string;
  sortOrder: number;
  startdate;
  enddate;
  nameFilter: string;
  dataLoaded = false;
  max = 5;
  trace = [];
  breadcrumb = [];
  clickable = true;
  pipe = new DatePipe('en-US');
  tweetList;
  maxi;
  mini;
  rangeValues;
  curMaxTime = maxTime;
  curMinTime = minTime;
  maxT;
  minT;
  aspect_type = aspect_type;
  aspectType = aspect_type.cluster;

  constructor(private censustractopinionService: CensusOpinionService,
    private densitymapService: DenitymapService) { }

  ngOnInit() {
    this.startdate = new Date(since);
    this.enddate = new Date(until);
    this.maxT = new Date('2000-01-01T' + maxTime + ':00');
    this.minT = new Date('2000-01-01T' + minTime + ':00');
    this.maxi = (this.maxT.getTime()-this.minT.getTime())/60000;
    this.mini = 0;
    this.rangeValues = [this.mini,this.maxi];
    this.densitymapService.getDensitymaps().subscribe(data=>{
      this.tweetList = data;
      this.censustractopinionService.getCensustractData().subscribe(data=>{
        this.generateArray(data);
      });
    });
    this.sortOptions = [
      {label: 'Highest Rating', value: '!rating'},
      {label: 'Lowest Rating', value: 'rating'},
      {label: 'Highest Tweets', value: '!tweetcount'},
      {label: 'Lowest Tweets', value: 'tweetcount'}
    ];
    this.maxItems = [
      {label: '5', value: 5},
      {label: '10', value: 10},
      {label: '20', value: 20}
    ];
  }

  createArray(countries){
    var couns = Object.keys(countries);
    couns.forEach((coun, index)=>{
      var country = {name: coun, displayName: coun.charAt(0).toUpperCase() + coun.substr(1), cities: []};
      var cits = Object.keys(countries[coun])
      var citpolarity = 0;
      cits.forEach((cit)=>{
        var city = {name: cit, displayName: cit.charAt(0).toUpperCase() + cit.substr(1), census: []};
        var cens = Object.keys(countries[coun][cit]);
        var cenpolarity = 0;
        cens.forEach((cen)=>{
          var census = {
            name: cen, 
            displayName: cen,
            polaritiesbyday: countries[coun][cit][cen]['polarities'],
            polarities: this.getPolarities(countries[coun][cit][cen]['polarities']), 
          };
          census['rating'] = this.getRating(census.polarities);
          city['census'].push(census);
          cenpolarity += census['rating'];
        
        });
        country['cities'].push(city);
        city['rating'] = cenpolarity/cens.length;
        citpolarity += city['rating'];
      });
      country['rating'] = citpolarity/cits.length;
      this.items.push(country);
      if (index == couns.length-1){
        this.items.forEach((country,idx) => {
          var citytweetcount = 0;
          country["cities"].forEach(city => {
            var centweetcount = 0;
            city["census"].forEach(cens => {
              cens['tweets'] = this.getTweets(this.tweetList[cens.name+"_"+city.name+"_"+country.name]['map']);
              cens['tweetcount'] = cens['tweets'].length;
              centweetcount += cens['tweetcount'];
            });
            city['tweetcount'] = centweetcount;
            citytweetcount += city['tweetcount'];
          });
          country['tweetcount'] = citytweetcount;
          if (idx == this.items.length-1){
            //this.removeLow(100);
            this.dataLoaded = true;
          }
        });
      }
    });
  }

  generateArray(data){
    var countries = {};
    var keys = Object.keys(data)
    if(keys.length == 0){
      this.dataLoaded = true;
    }
    keys.forEach((key, index) => {
      var country = data[key]['censusinfo']['country'];
      if (!countries[country]){
        countries[country] = {}
      }
      var city = data[key]['censusinfo']['city']
      if (!countries[country][city]){
        countries[country][city] = []
      }
      var tract = data[key]['censusinfo']['tract']
      countries[country][city][tract] = data[key]
      if (index == keys.length-1){
        this.createArray(countries);
      }
    });
  }

  getTweets(maps){
    var tweets = [];
    var dates = Object.keys(maps);
    dates.forEach(date=>{
      maps[date].forEach(tweet=>{
        tweets.push(tweet);
      });
    });
    return tweets;
  }

  removeLow(count){
    for (var i = this.items.length - 1; i >= 0; i--){
      var tweetCount = 0;
      var curcountry = this.items[i];
      curcountry["cities"].forEach(city => {
        city["census"].forEach(cens => {
          cens['tweets'] = this.getTweets(this.tweetList[cens.name+"_"+city.name+"_"+curcountry.name]['map']);
          tweetCount += cens['tweets'].length;
        });              
      });
      if (tweetCount<count){
        this.items.splice(i,1);
      }
      if (i == this.items.length-1){
        this.dataLoaded = true;
      }
    }
  }

  getPolarities(polarities){
    var aspects = {};
    var dates = Object.keys(polarities);
    dates.forEach(date=>{
      var keys = Object.keys(polarities[date]);
      keys.forEach(key => {
        if (key == 'hashtags'){
          if(!(key in aspects)){
            aspects[key] = {score:0.0, count:0};
          }
          aspects[key]['score'] += parseFloat(polarities[date][key]);
          aspects[key]['count'] += 1;
        }
        else{
          var object = polarities[date][key]
          if(!(key in aspects)){
            aspects[key] = {};
          }
          var keys2 = Object.keys(object);
          keys2.forEach(key2 => {
            if(!(key2 in aspects[key])){
              aspects[key][key2] = {score:0.0, count:0};;
            }
            aspects[key][key2]['score'] += parseFloat(object[key2]);
            aspects[key][key2]['count'] += 1;
          });
        }
      });
    });
    var keys = Object.keys(aspects);
    var aspectscores = {};
    keys.forEach(key => {
      if (key == 'hashtags'){
        aspectscores[key] = aspects[key]['score']/aspects[key]['count'];
      }
      else{
        aspectscores[key] = {};
        var object = aspects[key]
        var keys2 = Object.keys(object);
        keys2.forEach(key2 => {
          aspectscores[key][key2] = aspects[key][key2]['score']/aspects[key][key2]['count'];
        });
      }
    });    
    return aspectscores;
  }

  getRating(polarities){
    var rating = 0.0;
    var keys = Object.keys(polarities);
    keys.forEach(key => {
      if (key == 'hashtags'){
        rating += parseFloat(polarities[key]);
      }
      else{
        var scores = 0.0;
        var object = polarities[key]
        var keys2 = Object.keys(object);
        keys2.forEach(key2 => {
          scores += parseFloat(polarities[key][key2]);
        });
        rating += keys2.length>0? scores/keys2.length: 0.0;
      }
    });
    return keys.length>0? rating/keys.length: 0.0;
  }

  itemClicked(item){
    this.clickable = false;
    this.dataLoaded = false;
    this.trace.push(this.items);
    if (item["cities"]){
      this.items = item["cities"]
      this.clickable = true;
    }
    else if (item["census"]){
      this.items = item["census"];
    }
    setTimeout(()=>{
      this.dataLoaded = true;
    });
    this.breadcrumb.push(item.displayName);
    this.clearFilter();
  }

  changePath(idx){
    this.clickable = true;
    this.items = this.trace[idx];
    var length = this.trace.length;
    for(var i=idx; i<length; i++){
      this.trace.pop();
      this.breadcrumb.pop();
    }
    this.clearFilter();
  }
  
  filterByDate(){
    this.dataLoaded = false;
    this.densitymapService.getDensitymaps(this.pipe.transform(this.startdate, 'MMM d y'), this.pipe.transform(this.enddate, 'MMM d y'), this.curMinTime, this.curMaxTime).subscribe(data=>{
      this.tweetList = data;
      this.censustractopinionService.getCensustractData(this.pipe.transform(this.startdate, 'MMM d y'), this.pipe.transform(this.enddate, 'MMM d y'), this.curMinTime, this.curMaxTime, this.aspectType).subscribe(data=>{
        this.trace = [];
        this.breadcrumb = [];
        this.clickable = true;
        this.items = [];
        this.generateArray(data);
      });
    });
    this.clearFilter();
  }

  clearFilter(){
    this.sortKey=undefined;
    this.nameFilter = undefined;
    this.filterByName('');
  }

  filterByName(value){
    this.dv.filter(value)
  }

  onMaxChange(event) {
    this.max = event.value
  }

  slideChange(event){
    if(event.values.length>1){
      var date = new Date(this.minT.getTime() + event.values[1]*60000);
      var h = date.getHours();
      var m = date.getMinutes();
      this.curMaxTime = (h<10?'0':'')+h+":"+(m<10?'0':'')+m;
    }
    date = new Date(this.minT.getTime() + event.values[0]*60000);
    var h = date.getHours();
    var m = date.getMinutes();
    this.curMinTime = (h<10?'0':'')+h+":"+(m<10?'0':'')+m;
  }

  onSortChange(event) {
      let value = event.value;

      if (value.indexOf('!') === 0) {
          this.sortOrder = -1;
          this.sortField = value.substring(1, value.length);
      }
      else {
          this.sortOrder = 1;
          this.sortField = value;
      }
  }
}
