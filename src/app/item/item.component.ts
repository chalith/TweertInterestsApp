import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageService } from '../services/image/image.service';
import { ItemType } from '../common/enums';
import { months, recommendation_parent, recommendation_child, recommendation_RI } from '../common/vars';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input('object') object;
  @Input('viewtype') viewtype;
  @Input('clickable') clickable;
  @Output() itemClicked = new EventEmitter();
  imageUrl;
  itemType;
  ItemType;
  posrating;
  negrating;
  mapItems = [];
  mapLoaded = false;
  chartLoaded = false;
  tweetcountChartItems;
  polarityChartItems;
  dayTweetCount = {};
  seasonalPolarity = {};
  private index = 0;
  private aspectobj = {};
  mostPopularLocation = {name: '', displayName: '', density: 0, rating: 0};
  mostPopularPeriod = {period: '', density: 0, rating: 0.0, highestRatedAspect: '', highestRatedAspectrating: 0.0};
  highestRatedPeriod = {period: '', density: 0, rating: 0.0, highestRatedAspect: '', highestRatedAspectrating: 0.0};
  recommendation;
  RIs;
  tweettext;
  showtweet = false;
  
  constructor(private imageService: ImageService) { }

  ngOnInit() {
    this.ItemType = ItemType;
    var rating = parseFloat(this.object.rating);
    if(rating>=0){
      this.posrating = Math.ceil(rating*5);
    }else{
      this.negrating = Math.ceil(rating*5*-1);
    }
    this.tweetcountChartItems ={
        labels: [],
        datasets: [
            {
              label: "tweets count",
              data: [],
              backgroundColor: '#0080ff14',
              borderColor: '#0022ff',
              borderWidth: 0.8
            }
        ]
      }
    this.polarityChartItems ={
        labels: [],
        datasets: []
      }
    this.getItemImage();
    if(this.object['cities']){
      this.itemType = ItemType.country;
    }
    else if(this.object['census']){
      this.itemType = ItemType.city;
    }
    else{
      this.itemType = ItemType.census;
    }
    this.loadMapItems();
  }

  loadRIs(RIs){
    this.RIs = RIs;
    this.generateRecommendation();
  }

  itemClick(item){
    if (this.clickable){
      this.itemClicked.emit(item);
    }
  }
  
  stopPropagation(event){
    event.stopPropagation();
  }

  genarateDayTweetCount(day){
    day = new Date(day);
    var season = months[day.getMonth()]+"-"+day.getFullYear();
    if(!(season in this.dayTweetCount)){
      this.dayTweetCount[season] = 1;
    }
    else{
      this.dayTweetCount[season] += 1;
    }
  }

  generateRecommendation(){
    var interactions = [];
    var count = 0;
    this.RIs.forEach(RI => {
      count = RI.length;
      var text = '[ latitude '+RI[0].lat+' and longitude '+RI[0].lng+' ]';
      interactions.push(text);
    });
    var rp = recommendation_parent.replace('$location', this.object.displayName)
    .replace('$rating', (this.object.rating>0? Math.ceil(this.object.rating*5): Math.floor(this.object.rating*5)).toString())
    .replace('$popular_period', this.mostPopularPeriod.period)
    .replace('$popular_period_density', this.mostPopularPeriod.density.toString())
    .replace('$popular_period_rating', (this.mostPopularPeriod.rating>0? Math.ceil(this.mostPopularPeriod.rating*5): Math.floor(this.mostPopularPeriod.rating*5)).toString())
    .replace('$popular_period_highest_rated_aspect', this.mostPopularPeriod.highestRatedAspect)
    .replace('$popular_period_highest_rated_aspect_rating', (this.mostPopularPeriod.highestRatedAspectrating>0? Math.ceil(this.mostPopularPeriod.highestRatedAspectrating*5): Math.floor(this.mostPopularPeriod.highestRatedAspectrating*5)).toString())
    .replace('$highest_rated_period', this.highestRatedPeriod.period)
    .replace('$highest_rated_period_density', this.highestRatedPeriod.density.toString())
    .replace('$highest_rated_period_rating', (this.highestRatedPeriod.rating>0? Math.ceil(this.highestRatedPeriod.rating*5): Math.floor(this.highestRatedPeriod.rating*5)).toString())
    .replace('$highest_rated_period_highest_rated_aspect', this.highestRatedPeriod.highestRatedAspect)
    .replace('$highest_rated_period_highest_rated_aspect_rating', (this.highestRatedPeriod.highestRatedAspectrating>0? Math.ceil(this.highestRatedPeriod.highestRatedAspectrating*5): Math.floor(this.highestRatedPeriod.highestRatedAspectrating*5)).toString())

    var rc = recommendation_child.replace('$child_location', this.itemType == ItemType.country? 'city': this.itemType == ItemType.city? 'census tract': 'area')
    .replace('$highest_location', this.mostPopularLocation.displayName)
    .replace('$popular_tweet_density', this.mostPopularLocation.density.toString())
    .replace('$popular_rating', (this.mostPopularLocation.rating>0? Math.ceil(this.mostPopularLocation.rating*5): Math.floor(this.mostPopularLocation.rating*5)).toString());
    var rRI = recommendation_RI.replace('$interactions', interactions.join(' & '))
    .replace('$interction_density', count.toString());
    this.recommendation = rp + ((this.itemType != ItemType.census)? ("<br>" + rc): '') + ((count > 0) ? ("<br>" + rRI): ''); 
  }

  generateChartArray(){
    var keys = Object.keys(this.dayTweetCount);
    keys.sort(function(a, b){return new Date(a).getTime()-new Date(b).getTime()});
    var start = new Date(keys[0]).getFullYear();
    var end = new Date(keys[keys.length-1]).getFullYear();
    for(var year = start; year<=end; year++){
      months.forEach(month => {
        this.tweetcountChartItems.labels.push(month+"-"+year);
        this.polarityChartItems.labels.push(month+"-"+year);
      });  
    }
    this.tweetcountChartItems.labels.forEach((key,idx) => {
      var density = 0;
      if(this.dayTweetCount[key]){
        density = this.dayTweetCount[key];
        this.tweetcountChartItems.datasets[0].data.push(density);
      }
      else{
        this.tweetcountChartItems.datasets[0].data.push(0);
      }
      var aspects = Object.keys(this.aspectobj);
      if(this.seasonalPolarity[key]){
        var periodrating = 0.0;
        var highestratedaspect = {aspect: '', rating: 0.0}
        aspects.forEach((aspect)=>{
          var currating;
          if(this.seasonalPolarity[key][aspect]){
            if (aspect == 'hashtags'){
              var curaspect = this.seasonalPolarity[key][aspect];
              currating = curaspect['count']>0? curaspect['score']/curaspect['count']: 0.0;
            }
            else{
              var object = this.seasonalPolarity[key][aspect];
              var rating = 0.0;
              var count = 0
              var keys2 = Object.keys(object);
              keys2.forEach(key2 => {
                rating += object[key2]['score']/object[key2]['count'];
                count += 1;
              });
              currating = count>0? rating/count: 0.0;
            }
          }
          else{
            currating = 0.0;
          }
          periodrating += currating
          this.polarityChartItems.datasets[this.aspectobj[aspect]].data.push(currating);
          if(currating>highestratedaspect.rating){
            highestratedaspect.aspect = aspect;
            highestratedaspect.rating = currating
          }
        });
        periodrating = aspects.length>0? periodrating/aspects.length: 0.0;
        if(density>this.mostPopularPeriod.density){
          this.mostPopularPeriod.period = key;
          this.mostPopularPeriod.density = density;
          this.mostPopularPeriod.rating = periodrating;
          this.mostPopularPeriod.highestRatedAspect = highestratedaspect.aspect;
          this.mostPopularPeriod.highestRatedAspectrating = highestratedaspect.rating;
        }
        if (periodrating > this.highestRatedPeriod.rating){
          this.highestRatedPeriod.period = key;
          this.highestRatedPeriod.density = density;
          this.highestRatedPeriod.rating = periodrating;
          this.highestRatedPeriod.highestRatedAspect = highestratedaspect.aspect;
          this.highestRatedPeriod.highestRatedAspectrating = highestratedaspect.rating;
        }
      }else{
        aspects.forEach((aspect)=>{
          this.polarityChartItems.datasets[this.aspectobj[aspect]].data.push(0.0);
        });
      }
      if(idx==keys.length-1){
        this.chartLoaded = true;
      }
    });
  }

  getRandomColor(){
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  generateDayTweetPolarity(polarities){
    var dates = Object.keys(polarities);
    dates.forEach((date, idx)=>{
      var day = new Date(date);
      var season = months[day.getMonth()]+"-"+day.getFullYear();
      if(!(season in this.seasonalPolarity)){
        this.seasonalPolarity[season] = {};
      }
      var keys = Object.keys(polarities[date]);
      keys.forEach(key => {
        if(!(key in this.aspectobj)){
          var color = this.getRandomColor();
          this.aspectobj[key] = this.index;
          this.polarityChartItems.datasets.push({
            label: key,
            data: [],
            backgroundColor: color+'14',
            borderColor: color,
            borderWidth: 0.8
          });
          this.index++;
        }
        if (key == 'hashtags'){
          if(!(key in this.seasonalPolarity[season])){
            this.seasonalPolarity[season][key] = {score:0.0, count:0};
          }
          this.seasonalPolarity[season][key]['score'] += parseFloat(polarities[date][key]);
          this.seasonalPolarity[season][key]['count'] += 1;
        }
        else{
          var object = polarities[date][key]
          if(!(key in this.seasonalPolarity[season])){
            this.seasonalPolarity[season][key] = {};
          }
          var keys2 = Object.keys(object);
          keys2.forEach(key2 => {
            if(!(key2 in this.seasonalPolarity[season][key])){
              this.seasonalPolarity[season][key][key2] = {score:0.0, count:0};;
            }
            this.seasonalPolarity[season][key][key2]['score'] += parseFloat(object[key2]);
            this.seasonalPolarity[season][key][key2]['count'] += 1;
          });
        }
      });
    });
  }

  loadMapItems(){
    if(this.itemType == ItemType.country){
      this.object['cities'].forEach((city,idx) => {
        var citytweetcount = 0;
        city['census'].forEach(cens => {
          this.generateDayTweetPolarity(cens['polaritiesbyday']);
          cens['tweets'].sort(function(a, b){return new Date(a.datetime).getTime()-new Date(b.datetime).getTime()});
          cens['tweets'].forEach(tweet => {
            this.genarateDayTweetCount(tweet.datetime)
            this.mapItems.push(tweet);  
          });
          citytweetcount += cens['tweetcount']
        });
        if(this.mostPopularLocation.density < citytweetcount){
          this.mostPopularLocation.density = citytweetcount;
          this.mostPopularLocation.name = city['name'];
          this.mostPopularLocation.displayName = city['displayName'];
          this.mostPopularLocation.rating = city['rating'];
        }
        if(idx==this.object['cities'].length-1){
          this.generateChartArray()
          this.mapLoaded = true;
        }
      }); 
    }
    else if(this.itemType == ItemType.city){
      this.object['census'].forEach((cens,idx) => {
        this.generateDayTweetPolarity(cens['polaritiesbyday']);       
        cens['tweets'].sort(function(a, b){return new Date(a.datetime).getTime()-new Date(b.datetime).getTime()});
        cens['tweets'].forEach(tweet => {
          this.genarateDayTweetCount(tweet.datetime)
          this.mapItems.push(tweet);         
        });
        if(this.mostPopularLocation.density < cens['tweetcount']){
          this.mostPopularLocation.density = cens['tweetcount'];
          this.mostPopularLocation.name = cens['name'];
          this.mostPopularLocation.displayName = cens['displayName'];
          this.mostPopularLocation.rating = cens['rating'];
        }
        if(idx==this.object['census'].length-1){
          this.generateChartArray()
          this.mapLoaded = true;
        }
      });
    }
    else if(this.itemType == ItemType.census){
      this.generateDayTweetPolarity(this.object['polaritiesbyday']);       
      this.object['tweets'].sort(function(a, b){return new Date(a.datetime).getTime()-new Date(b.datetime).getTime()});
      this.object['tweets'].forEach((tweet,idx) => {
        this.genarateDayTweetCount(tweet.datetime)
        this.mapItems.push(tweet);
        if(idx==this.object['tweets'].length-1){
          this.generateChartArray()
          this.mapLoaded = true;
        }
      });
    }
  }

  getItemImage(){
    this.imageService.getImage(this.object.name).subscribe(data=>{
      if (data['hits'].length>0)
        this.imageUrl = data['hits'][0].largeImageURL;
    })
  }

  viewTweet(text){
    this.tweettext = text;
    this.showtweet = true;
  }

  hideDialog(){
    this.showtweet = false;
  }
}