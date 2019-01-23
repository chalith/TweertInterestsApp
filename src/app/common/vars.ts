import { DatePipe } from "@angular/common";
var pipe = new DatePipe('en-US')

export var since = 'Jan 1 2014'
export var until = pipe.transform(Date.now(), 'MMM d y');
export var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
"Aug", "Sep", "Oct", "Nov", "Dec"];
export var maxTime = "23:59";
export var minTime = "00:00";
export var minRIDistance = 100;
export var recommendation_parent = `Raiting : <b>$rating/5</b><br><br>Mostly visited period : <b>$popular_period</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No. of Visitors : <b>$popular_period_density visitors</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rating : <b>rating $popular_period_rating/5</b><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Highest rated aspect : <b>$popular_period_highest_rated_aspect</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rating : <b>$popular_period_highest_rated_aspect_rating/5</b><br><br>
Highest rated period : <b>$highest_rated_period</b><br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No. of Visitors : <b>$highest_rated_period_density visitors</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rating : <b>rating $highest_rated_period_rating/5</b><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Highest rated aspect : <b>$highest_rated_period_highest_rated_aspect</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rating : <b>$highest_rated_period_highest_rated_aspect_rating/5</b><br>`;
export var recommendation_child = `Mostly visited $child_location : <b>$highest_location</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No. of Visitors : <b>$popular_tweet_density visitors</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rating : <b>$popular_rating/5</b><br>`;
export var recommendation_RI = `Mostly visited area : <b>$interactions</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No. of Visitors : <b>$interction_density visitors</b>`;
export var aspect_type = { cluster:1, categorize:2 }