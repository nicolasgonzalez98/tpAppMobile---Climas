import { Injectable } from '@angular/core';
import axios from 'axios';
import { Geolocation } from '@capacitor/geolocation';


@Injectable({
  providedIn: 'root'
})
export class APIWeatherService {

  private API_KEY = "lRWDOZ7yGU55w4mKeaFCrBxEGFkkjy4E"

  public datosCiudad={"LocalizedName":""};
  public nombrePais = {"nombrePais":""};
  public areaAdministrativa = {"areaAdministrativa": ""}
  public coordenadas = {"latitude":0, "longitude":0}
  public idCiudad:string=""
  public climaActualEnCiudad  = {isDayTime:"",temperatura:{}, descripcion:""}
  public proximasDoceHoras: any[]  = []
  public proximosCincoDias: any[]  = []
  constructor() { }

    /**
     * Obtiene la posición geográfica actual del usuario.
     * Utiliza el API de Geolocation para capturar las coordenadas de latitud y longitud
     * y las asigna al objeto `coordenadas`.
     *
     * @returns {Promise<void>} Promesa que se resuelve cuando la posición actual ha sido obtenida.
    */
  public currentPosition = async (): Promise<void> => {
    await Geolocation.getCurrentPosition()
    .then(res => {
      this.coordenadas.latitude = res.coords.latitude
      this.coordenadas.longitude = res.coords.longitude
    });
    
  };

    /**
     * Asigna íconos de clima correspondientes a cada condición de clima en el array proporcionado.
     * Utiliza un mapeo de frases descriptivas de condiciones climáticas en español a íconos de Ionic.
     * 
     * @param {any[]} climaArray - Array de objetos de clima, que puede incluir diferentes propiedades
     *        según el tipo de array (array de 12 horas o array de 5 días).
     * 
     * @returns {any[]} - Array de objetos de clima con íconos adicionales añadidos según la condición climática.
     */
  asignarIconoClima(climaArray: any[]): any[] {
    // Mapa de frases del clima en español a íconos de Ionic
    const iconMap: { [key: string]: string } = {
      'Despejado': 'sunny',             // Despejado (día)
      'Mayormente despejado': 'partly-sunny',
      'Parcialmente nublado': 'cloudy',
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
      "Soleado":"sunny",
      "Mayormente soleado":"sunny",
      "Parcialmente soleado":"sunny"
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
          iconoClima: icono
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
          iconoDia: iconoDia,      
          iconoNoche: iconoNoche   
        };
      }
  
      // Retornar el clima sin cambios si no coincide con ninguno de los casos
      return clima;
    });
  }

  /**
 * Realiza una búsqueda de ciudad usando el servicio de AccuWeather y asigna los datos
 * obtenidos a las propiedades correspondientes. Utiliza la API para recuperar información
 * sobre una ciudad específica y obtener su ID.
 * 
 * @param {string} query - El nombre de la ciudad o consulta de búsqueda.
 * @returns {Promise<void>} - Promesa que se resuelve cuando se completa la búsqueda.
 */
  async buscarPorCiudad(query:string){
    await axios.get("https://dataservice.accuweather.com/locations/v1/"+query+"?apikey="+this.API_KEY+"&language=es-ES")
    .then((res) => {
      this.datosCiudad= res.data
      this.nombrePais = res.data.Country.LocalizedName
      this.areaAdministrativa = res.data.AdministrativeArea.LocalizedName
      this.idCiudad = res.data.Key
    })
  }

    /**
     * Realiza una búsqueda de ciudad basada en la posición geográfica actual del usuario.
     * Obtiene las coordenadas mediante `currentPosition` y consulta el servicio de AccuWeather
     * para obtener la información de la ciudad correspondiente a dicha ubicación.
     * 
     * @returns {Promise<void>} - Promesa que se resuelve cuando se completa la búsqueda de ciudad.
     */
  async busquedaPorGeolocalizacion(): Promise<void>{
     await this.currentPosition()

     await axios.get("https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey="+this.API_KEY	+
      "&q="+this.coordenadas.latitude+","+this.coordenadas.longitude+"&language=es-ES")
      .then(res =>{
        this.idCiudad = res.data.Key
        this.datosCiudad= res.data 
        
      })
      
  }
  
    /**
     * Obtiene las condiciones climáticas actuales de una ciudad específica mediante su ID.
     * Realiza una solicitud a la API de AccuWeather para obtener detalles como si es de día,
     * la descripción del clima y la temperatura actual.
     * 
     * @param {string} idCiudad - ID de la ciudad para obtener sus condiciones climáticas.
     * @returns {Promise<void>} - Promesa que se resuelve cuando se completan los datos del clima actual.
     */
  async climaEnCiudad(idCiudad : string){
    try {
      const response = await axios.get(
        "https://dataservice.accuweather.com/currentconditions/v1/" + idCiudad + "?apikey=" + this.API_KEY + "&language=es-ES"
      );
  
      // Verificar si hay datos en la respuesta
      if (response.data && response.data.length > 0) {
        this.climaActualEnCiudad.isDayTime = response.data[0].IsDayTime;
        this.climaActualEnCiudad.descripcion = response.data[0].WeatherText;
        this.climaActualEnCiudad.temperatura = response.data[0].Temperature.Metric.Value;
      } else {
        throw new Error("Ciudad no encontrada");
      }
    } catch (error) {
      this.climaActualEnCiudad = { isDayTime: "", temperatura: {}, descripcion: "" }; // Restablecer datos
      throw new Error("Error al obtener el clima: "+error);
    }
  }

/**
 * Obtiene el pronóstico del clima para las próximas 12 horas en una ciudad específica.
 * Realiza una solicitud a la API de AccuWeather usando el ID de la ciudad y asigna íconos
 * de clima a cada hora según las condiciones climáticas.
 * 
 * @param {string} idCiudad - ID de la ciudad para obtener su pronóstico climático.
 * @returns {Promise<any[]>} - Promesa que resuelve con un array de objetos de clima para las próximas 12 horas.
 */
  async climaProximasDoceHoras(idCiudad : string ):Promise<any[]>{
    try {
      const response = await axios.get("https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/"+idCiudad+"?apikey="+this.API_KEY+"&language=es-ES&metric=true")
      this.proximasDoceHoras = response.data
      this.proximasDoceHoras = this.asignarIconoClima(this.proximasDoceHoras)
      
      return this.proximasDoceHoras
    } catch (error) {
      this.proximasDoceHoras = []
      return []
    }
  }

    /**
     * Obtiene el pronóstico del clima para los próximos cinco días en una ciudad específica.
     * Realiza una solicitud a la API de AccuWeather utilizando el ID de la ciudad y asigna íconos
     * de clima a cada día según las condiciones climáticas.
     * 
     * @param {string} idCiudad - ID de la ciudad para obtener su pronóstico climático.
     * @returns {Promise<any[]>} - Promesa que resuelve con un array de objetos de clima para los próximos cinco días.
     *                             Devuelve un array vacío si ocurre un error en la solicitud.
     */
  async climaProximosCincoDias(idCiudad:string): Promise<any[]>{
    try {
      const response = await axios.get("https://dataservice.accuweather.com/forecasts/v1/daily/5day/"+idCiudad+"?apikey="+this.API_KEY+"&language=es-ES&metric=true")
    
      this.proximosCincoDias = response.data.DailyForecasts
      this.proximosCincoDias = this.asignarIconoClima(this.proximosCincoDias)
      
      return this.proximosCincoDias
    } catch (error) {
      
      return []
    }
  }

  /**
   * @description Traera una lista de ciudades para capturar 4 valores a usar, key, pais, demarcacion y nombre de la ciudad.
   *              Con estos valores el usuario podra seleccionar una y se hara su respectiva busqueda de datos de esa ciudad.
   * @param nombreCiudad 
   * @returns 
   */
  async buscarCiudad(nombreCiudad: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${this.API_KEY}&q=${nombreCiudad}&language=es-Es`
      );
  
      // Mapea los datos para obtener solo los campos necesarios
      const ciudades = response.data.map((ciudad: any) => ({
        key: ciudad.Key,
        pais: ciudad.Country.LocalizedName,
        demarcacionAdministrativa: ciudad.AdministrativeArea.LocalizedName,
        nombreCiudad: ciudad.LocalizedName
      }));
      // Retorna solo el array de objetos
      return ciudades;
    } catch (error) {
      console.error('Error al buscar ciudades:', error);
      return [];
    }
  }
  

}
