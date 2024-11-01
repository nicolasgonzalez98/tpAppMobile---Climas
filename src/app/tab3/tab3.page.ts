import { Component } from '@angular/core';

import { APIWeatherService } from '../common/services/api-weather.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  nombreCiudad: string = '';
  ciudades: any[] = []
  fueBuscado:boolean = false; //Validacion para que no se renderize de una un error al no existir ciudades
  //Propiedades para que se pueda usar en el html y rellenarlos
  
  constructor(
    public climaService:APIWeatherService,
    private roter: Router,
  ) {

  }

  ngOnInit() {
    // Al cargar el componente, intenta recuperar el valor almacenado
    const ciudadGuardada = localStorage.getItem('nombreCiudad');
    if (ciudadGuardada) {
      this.nombreCiudad = ciudadGuardada;
    }
  }

  /**
   * @function guardarUltimaCiudadLS()
   * @description mostrara el ultimo valor puesto en el input
   */
  guardarUltimaCiudadLS() {
    // Guarda el valor actual en localStorage cada vez que cambia
    localStorage.setItem('nombreCiudad', this.nombreCiudad);
  }

  /**
   * @function verDetalle()
   * @description Redirecciona a una pagina de detalles donde se podra visualizar el clima actual,proximo por 12 horas y 5 dias
   */
  public verDetalle(idCiudad:string){
    localStorage.setItem('ultimaTab', '/tabs/tab3'); //Guarda ultima tab visitada para que en detalles pueda volver aqui.
    const URL = "/detalles/"+idCiudad
    this.roter.navigateByUrl(URL)
  }

  /**
   * @description Llama la funcion del service 
   * @param nombreCiudad 
   */
  public async buscarCiudad (nombreCiudad:string){
    this.ciudades = await this.climaService.buscarCiudad(nombreCiudad);
    console.log(this.ciudades); // Puedes usar esto para verificar la respuesta
    this.fueBuscado = true;
  }


    /**
   * @description  Método que se llama cuando se abandona la pestaña
   */
    ionViewWillLeave() {
      // Restablecer los datos
      this.ciudades = []; // Restablecer la lista de ciudades
      this.fueBuscado = false; // Restablecer el estado de búsqueda
    }
  
}
