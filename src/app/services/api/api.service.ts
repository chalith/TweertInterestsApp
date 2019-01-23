import { Injectable } from '@angular/core';
import { url } from '../../common/api'
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  get(method, params, apiurl=url){
    let options = { params: params };
    return this.http.get(apiurl+method, options);
  }

  post(method, params ,data){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.post(url+method+params, data, options );
  }

  put(method, params ,data){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.put(url+method+params, data, options );
  }

}