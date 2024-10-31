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

  isloading:boolean = false

  constructor(
    public climaService:APIWeatherService,
    private firestoreService:FirestoreService,
    private roter: Router,
    public utilities: UtilitiesService,
    
  ) {
    

    
     
  }

  async ngOnInit(){
    this.isloading = true

    try {
      
      await this.climaService.busquedaPorGeolocalizacion();
      
      await Promise.all([
        this.climaService.climaEnCiudad(this.climaService.idCiudad),
        this.climaService.climaProximasDoceHoras(this.climaService.idCiudad),
        this.climaService.climaProximosCincoDias(this.climaService.idCiudad),
      ]);
    } catch (error) {
      console.error("Error al cargar los datos del clima:", error);
    } finally {
      
      this.isloading = false;
    }
  }

  /**
   * Navega a la página de detalles del clima de la ciudad actual.
   * 
   * Esta función construye una URL utilizando el ID de la ciudad almacenado en el servicio de clima
   * y redirige al usuario a la página de detalles correspondiente.
   */
  verDetalle(){
    localStorage.setItem('ultimaTab', '/tabs/tab1'); //Guarda ultima tab visitada para que en detalles pueda volver aqui.
    const URL = "/detalles/"+this.climaService.idCiudad
    this.roter.navigateByUrl(URL)
  }


}
