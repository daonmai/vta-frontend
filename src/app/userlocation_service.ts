/**
 * Created by x210441 on 6/10/17.
 */
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {UserLocation} from "./UserLocation";
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/';


@Injectable()
export class UserLocationService {
  private baseUrl = 'http://localhost:8080/user';
  private gMapGeoCodeAPI = 'http://localhost:8080/address';
  private gMapLocationAPI = 'http://localhost:8080/location';
  GET_URL ="";
  POST_URL="";
  constructor (private http: Http) {

  }

  get(name: String):Observable<UserLocation> {
    let user= this.http
      .get( this.baseUrl + '/' + name,{headers: this.getHeaders()})
      .map(mapUser);
    return user;
  }
  addUserLocation(userLocation:UserLocation):Observable<Response>  {
    return this.http.post(this.baseUrl,
      JSON.stringify(userLocation),
      {headers:this.getHeaders()});
  }

  private getHeaders() {
    let headers = new Headers();
    headers.append('Accept','application/json');
    headers.append('Content-type', 'application/json');
    return headers;


  }
  getFormattedAddress(lattitute:Number, longtitude:Number):Observable<String> {


    let formattedAddress= this.http
      .get(  this.gMapGeoCodeAPI + '?lat=' + lattitute + '&lgn=' + longtitude + '&key=AIzaSyB4eExFVgnAO-0lGpYLy-VZGYj2kda9OOI' , {headers: this.getHeaders()})
      .map(mapAddressResult);
    return formattedAddress;
  }

  getCoords(address: String): Observable<UserLocation> {

  let userLocation= this.http
    .get(  this.gMapLocationAPI + '?address=' + address + '&key=AIzaSyB4eExFVgnAO-0lGpYLy-VZGYj2kda9OOI' , {headers: this.getHeaders()})
    .map(mapUser);
  return userLocation;


}

}

function mapAddressResult(response: Response): String {

  let user = toUser(response.json());

  return user.location;



}

function mapUser(response: Response) : UserLocation {
  return toUser(response.json());
}

function toUser(r: any): UserLocation {
  let userLocation = <UserLocation> {
    name: r.name,
    location: r.location,
    lattitude:r.lattitude,
    longtitude:r.longtitude
  }
  return userLocation;
}



