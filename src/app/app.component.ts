import {UserLocation} from "./UserLocation";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {UserLocationService} from "./userlocation_service";
import { Component, OnInit } from '@angular/core';
import { MapsAPILoader } from 'angular2-google-maps/core';

import { AgmCoreModule } from 'angular2-google-maps/core';

declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[UserLocationService],


})
export class AppComponent implements  OnInit {



  userLocation: UserLocation;
  searchedUser: UserLocation;

  searchOption = false;
  enterOption = true;

  geoLocationSupported = false;

  userLocations: UserLocation[];
  markers: marker[];
  bounds:any;
  isSubmitted = false;

  constructor(private userLocationService: UserLocationService, private mapsAPILoader: MapsAPILoader) {

  }






  ngOnInit() {;
    this.userLocation = new UserLocation();
    this.searchedUser = new UserLocation();
    this.userLocations = [];
    this.markers=[];

    this.getCurrentPosition();


  }


  getCurrentPosition() {

    if (navigator.geolocation) {
      this.geoLocationSupported = true;
      navigator.geolocation.getCurrentPosition(position => {

        this.userLocation.lattitude = position.coords.latitude;
        this.userLocation.longtitude = position.coords.longitude;
        this.userLocationService
          .getFormattedAddress(position.coords.latitude, position.coords.longitude)
          .subscribe(address => {
              this.userLocation.location = address;
              console.log(address);
            this.addMarker(this.userLocation);
            }
          );
      });



    } else {

    }
  }




  onSubmit() {
    this.isSubmitted = true;

    this.addMarker(this.userLocation);

    this.userLocationService
      .addUserLocation(this.userLocation)
      .subscribe();

  }
  clear() {
    this.userLocation.name = "";
    this.userLocation.longtitude = "";
    this.userLocation.lattitude = "";

  }

  /**
   * Reset coodinations when the location is changed.
   */
  resetCoords() {
    this.userLocation.lattitude = "";
    this.userLocation.longtitude = "";

    this.userLocationService
      .getCoords(this.userLocation.location)
      .subscribe(user => {
          this.userLocation.lattitude = user.lattitude;
          this.userLocation.longtitude = user.longtitude;


        }
      );

  }

  mapClicked($event: any) {
    this.userLocation.lattitude = $event.coords.lat;
    this.userLocation.longtitude = $event.coords.lng;
    this.userLocationService
      .getFormattedAddress($event.coords.lat, $event.coords.lng)
      .subscribe(address => {
          this.userLocation.location = address;

        }
      );
  }

  /**
   * search for user's location
   */
  search() {
    let name = this.searchedUser.name;
    this.userLocationService
      .get(name)
      .subscribe(u => {
        this.searchedUser = u;
        this.addMarker(u);
      });


  }

  addMarker(userLocation:UserLocation) {

    if ( this.isValidLat(userLocation.lattitude ) && this.isValidLng(userLocation.longtitude)) {

      var newMarker: marker = {
        name: userLocation.name,
        lat: parseFloat(userLocation.lattitude),
        lng: parseFloat(userLocation.longtitude),
        draggable: false

      };

      this.markers.push(newMarker);
      this.bounds = this.fitBounds(this.markers);
    }

  }


  fitBounds(markers) {

    this.mapsAPILoader.load().then(() => {
      this.bounds = new window['google'].maps.LatLngBounds();
      this.markers.forEach((location) => {
        this.bounds.extend(new window['google'].maps.LatLng(location.lat, location.lng));
      })
    });

  }

  isValidLat(val) {

    return this.isNumeric(val) && (val >= -90.0) && (val <= 90.0);
  }

  isValidLng (val) {
  return ( this.isNumeric(val) && (val >= -180.0) && (val <= 180.0));
  }


  isNumeric(n) {
     return !isNaN(parseFloat(n)) ;
  }





}

interface marker {
  name: string;
  lat: number;
  lng: number;
  draggable: boolean;

}
