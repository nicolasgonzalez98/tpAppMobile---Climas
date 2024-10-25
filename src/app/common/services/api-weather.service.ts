import { Injectable } from '@angular/core';
import axios from 'axios';
import { Geolocation } from '@capacitor/geolocation';


@Injectable({
  providedIn: 'root'
})
export class APIWeatherService {

  private API_KEY2 = "cz9Z7mdDo3VOYRWM3zN4FGf3u78THgAC"
  private API_KEY = "11h0AUOD4z9LBuz6r6A1upwiPIeqkUNF"

  public datosCiudad={"LocalizedName":""};
  public coordenadas = {"latitude":0, "longitude":0}
  public idCiudad:string=""
  public climaActualEnCiudad = {isDayTime:"",temperatura:{}, descripcion:""}
  public proximasDoceHoras: any[] = []
  public proximosCincoDias: any[] = []
  constructor() { }

  //Coordenandas
  public currentPosition = async () => {
    await Geolocation.getCurrentPosition()
    .then(res => {
      this.coordenadas.latitude = res.coords.latitude
      this.coordenadas.longitude = res.coords.longitude
    });
    
  };

  asignarIconoClima(climaArray: any[]): any[] {
    // Mapa de frases del clima en español a íconos de Ionic
    const iconMap: { [key: string]: string } = {
      'Despejado': 'sunny',             // Despejado (día)
      'Mayormente despejado': 'partly-sunny',
      'Parcialmente nublado': 'partly-cloudy',
      'Nublado': 'cloudy',              // Nublado
      'Lluvia': 'rainy',                // Lluvia
      'Tormentas': 'thunderstorm',      // Tormentas
      'Nieve': 'snow',                  // Nieve
      'Niebla': 'cloud',                // Niebla
      'Viento': 'cloudy',               // Viento 
      'Chubascos': "rainy",
      "Nubes y claros": "cloudy",
      "Mayormente nublado":"cloudy",
      "Tormentas eléctricas":"thunderstorm",
      "Soleado":"sunny"
    };

    return climaArray.map(clima => {
      // Para el array de 12 horas (con solo IconPhrase)
      if (clima.IconPhrase) {
        let icono = iconMap[clima.IconPhrase] || 'help';  // Ícono por defecto si no encuentra IconPhrase
  
        // Si es de noche y está despejado, mostrar la luna
        if ((clima.IconPhrase === 'Despejado' || clima.IconPhrase === 'Mayormente despejado') && !clima.IsDaylight) {
          icono = 'moon';
        } else if (clima.IconPhrase === 'Nublado' && !clima.IsDaylight) {
          icono = 'cloudy-night-outline';  // Nublado de noche
        }
  
        return {
          ...clima,
          iconoClima: icono  // Nueva propiedad con el ícono correspondiente
        };
  
      // Para el array de cinco días (con Day y Night)
      } else if (clima.Day && clima.Night) {
        let iconoDia = iconMap[clima.Day.IconPhrase] || 'help';
        let iconoNoche = iconMap[clima.Night.IconPhrase] || 'help';
  
        // Si es de noche y está despejado o nublado
        if ((clima.Night.IconPhrase === 'Despejado' || clima.Night.IconPhrase === 'Mayormente despejado')) {
          iconoNoche = 'moon';
        } else if (clima.Night.IconPhrase === 'Nublado') {
          iconoNoche = 'cloudy-night-outline';
        }
  
        return {
          ...clima,
          iconoDia: iconoDia,      // Icono para el clima durante el día
          iconoNoche: iconoNoche   // Icono para el clima durante la noche
        };
      }
  
      // Retornar el clima sin cambios si no coincide con ninguno de los casos
      return clima;
    });
  }

  //Busquedas clima
  async buscarPorCiudad(query:string){
    
    await axios.get("http://dataservice.accuweather.com/locations/v1/"+query+"?apikey="+this.API_KEY)
    .then((res) => {
      console.log(res.data)
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

  async climaEnCiudad(idCiudad : string){
    await axios.get("http://dataservice.accuweather.com/currentconditions/v1/"+idCiudad+"?apikey="+this.API_KEY+"&language=es-ES")
    .then(res => {
      
      this.climaActualEnCiudad.isDayTime = res.data[0].IsDayTime
      this.climaActualEnCiudad.descripcion = res.data[0].WeatherText
      this.climaActualEnCiudad.temperatura = res.data[0].Temperature.Metric.Value
    })
  }

  async climaProximasDoceHoras(idCiudad : string ): Promise<any[]>{
    const response = await axios.get("http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/"+idCiudad+"?apikey="+this.API_KEY+"&language=es-ES&metric=true")
    this.proximasDoceHoras = response.data
    this.proximasDoceHoras = this.asignarIconoClima(this.proximasDoceHoras)
    
    return this.proximasDoceHoras
  }

  async climaProximosCincoDias(idCiudad:string): Promise<any[]>{
    try {
      const response = await axios.get("http://dataservice.accuweather.com/forecasts/v1/daily/5day/"+idCiudad+"?apikey="+this.API_KEY+"&language=es-ES&metric=true")
    
      this.proximosCincoDias = response.data.DailyForecasts
      this.proximosCincoDias = this.asignarIconoClima(this.proximosCincoDias)
      
      return this.proximosCincoDias
    } catch (error) {
      
      return []
    }
  }



  


}
