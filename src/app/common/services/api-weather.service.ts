import { Injectable } from '@angular/core';
import axios from 'axios';
import { Geolocation } from '@capacitor/geolocation';


@Injectable({
  providedIn: 'root'
})
export class APIWeatherService {

  private API_KEY = "cz9Z7mdDo3VOYRWM3zN4FGf3u78THgAC"

  public datosCiudad = {"LocalizedName":""};
  public coordenadas = {"latitude":0, "longitude":0}
  public idCiudad:string=""
  public climaActualEnCiudad = {isDayTime:"",temperatura:{}, descripcion:""}
  public proximasDoceHoras = []
  public proximasCincoHoras = []
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
      this.idCiudad = res.data.Key
    })  
  }

  async busquedaPorGeolocalizacion(){
     await this.currentPosition()

     await axios.get("http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey="+this.API_KEY	+
      "&q="+this.coordenadas.latitude+","+this.coordenadas.longitude+"&language=es-ES")
      .then(res =>{
        this.idCiudad = res.data.Key
        this.datosCiudad= res.data
      })
      
  }

  async climaEnCiudad(idCiudad : string = "1228466"){
    await axios.get("http://dataservice.accuweather.com/currentconditions/v1/"+idCiudad+"?apikey="+this.API_KEY+"&language=es-ES")
    .then(res => {
      this.climaActualEnCiudad.isDayTime = res.data[0].IsDayTime
      this.climaActualEnCiudad.descripcion = res.data[0].WeatherText
      this.climaActualEnCiudad.temperatura = res.data[0].Temperature.Metric.Value
    })
  }

  async climaProximasDoceHoras(idCiudad : string = "1228466"){
    await axios.get("http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/"+idCiudad+"?apikey="+this.API_KEY+"&language=es-ES&metric=true").
    then(res => {
      this.proximasDoceHoras = res.data
    })
  }

  async climaProximosCincoDias(idCiudad : string = "1228466"){
    await axios.get("http://dataservice.accuweather.com/forecasts/v1/daily/5day/"+idCiudad+"?apikey="+this.API_KEY+"&language=es-ES&metric=true")
    .then(res => {
      this.proximasCincoHoras = res.data.DailyForecasts
    })
  }



  


}
