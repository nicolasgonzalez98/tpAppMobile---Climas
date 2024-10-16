import { Component } from '@angular/core';

import { Geolocation } from '@capacitor/geolocation';
import { APIWeatherService } from '../common/services/api-weather.service';
import { FirestoreService } from '../common/services/firestore.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Router } from '@angular/router';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    public climaService:APIWeatherService,
    private firestoreService:FirestoreService,
    private roter: Router,
    
  ) {
    climaService.busquedaPorGeolocalizacion().then(() => {
      climaService.climaEnCiudad(climaService.idCiudad)
    })
    .then(() => {
      console.log(climaService.climaActualEnCiudad)
    }) 
  }

  verDetalle(){
    const URL = "/detalles/"+this.climaService.idCiudad
    this.roter.navigateByUrl(URL)
  }


}
