import { Injectable } from '@angular/core';
import axios from 'axios';
import { Geolocation } from '@capacitor/geolocation';


@Injectable({
  providedIn: 'root'
})
export class APIWeatherService {

  private API_KEY = "cz9Z7mdDo3VOYRWM3zN4FGf3u78THgAC"

  public datosCiudad: any[] = [];
  public coordenadas = {"latitude":0, "longitude":0}
  public idCiudad:string=""
  constructor() { }

  //Coordenandas
  public currentPosition = async () => {
    await Geolocation.getCurrentPosition()
    .then(res => {
      this.coordenadas.latitude = res.coords.latitude
      this.coordenadas.longitude = res.coords.longitude
    });
    
    
    
  };

  //Busquedas clima
  async buscarPorCiudad(query:string){
    await axios.get("http://dataservice.accuweather.com/locations/v1/cities/search?apikey="+this.API_KEY+"&q="+query+"&language=es-ES")
    .then((res) => {
      this.datosCiudad= res.data
    })  
  }

  async busquedaPorGeolocalizacion(){
     await this.currentPosition()

     await axios.get("http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey="+this.API_KEY	+
      "&q="+this.coordenadas.latitude+","+this.coordenadas.longitude+"&language=es-ES")
      .then(res =>{
        console.log(res.data)
      })
  }



  


}
