import { Injectable } from '@angular/core';
import { since, until, minTime, maxTime, aspect_type } from '../../common/vars'
import { ApiService } from '../api/api.service';
import { methods } from '../../common/api'

@Injectable({
  providedIn: 'root'
})
export class CensusOpinionService {

  constructor(private apiService: ApiService) { }

  getCensustractData(sincedate = since, untildate = until, curMinTime = minTime, curMaxTime = maxTime, aspectType = aspect_type.cluster){
    return this.apiService.get(methods.getcensusdata, {since: sincedate, until: untildate, mintime: curMinTime, maxtime: curMaxTime, aspecttype: aspectType});
  }
}
