import { Component } from '@angular/core';

import { Geolocation } from '@capacitor/geolocation';
import { APIWeatherService } from '../common/services/api-weather.service';
import { FirestoreService } from '../common/services/firestore.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Router } from '@angular/router';
import { UtilitiesService } from '../common/services/utilities.service';



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
    public utilities: UtilitiesService,
    
  ) {
    climaService.busquedaPorGeolocalizacion().then(() => {
      climaService.climaEnCiudad(climaService.idCiudad)
      climaService.climaProximasDoceHoras(climaService.idCiudad)
      climaService.climaProximosCincoDias(climaService.idCiudad)
    })

    
     
  }

  verDetalle(){
    const URL = "/detalles/"+this.climaService.idCiudad
    this.roter.navigateByUrl(URL)
  }


}
