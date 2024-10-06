import { Component } from '@angular/core';
import { APIWeatherService } from '../services/api-weather.service';
import { Geolocation } from '@capacitor/geolocation';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    public climaService:APIWeatherService
  ) {
    climaService.busquedaPorGeolocalizacion()
  }

}
