import { Injectable } from '@angular/core';
import { since, until, minTime, maxTime } from '../../common/vars'
import { ApiService } from '../api/api.service';
import { methods } from '../../common/api'

@Injectable({
  providedIn: 'root'
})
export class DenitymapService {

  constructor(private apiService: ApiService) { }

  getDensitymaps(sincedate = since, untildate = until, curMinTime = minTime, curMaxTime = maxTime){
    return this.apiService.get(methods.getdensitymaps, {since: sincedate, until: untildate, mintime: curMinTime, maxtime: curMaxTime});
  }
}
