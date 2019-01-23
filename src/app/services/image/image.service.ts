import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { methods, imageUrl, pixibayKey } from '../../common/api'

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private apiService: ApiService) { }

  getImage(query){
    return this.apiService.get(methods.getImage, {key: pixibayKey, q: query+" city"}, imageUrl);
  }
}
