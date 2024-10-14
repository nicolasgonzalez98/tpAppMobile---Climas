import { Component } from '@angular/core';

import { Geolocation } from '@capacitor/geolocation';
import { APIWeatherService } from '../common/services/api-weather.service';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    public climaService:APIWeatherService
  ) {
    climaService.busquedaPorGeolocalizacion().then(() => {
      climaService.climaEnCiudad(climaService.idCiudad)
    })
    .then(() => {
      console.log(climaService.climaActualEnCiudad)
    })
    
     
  }

}
