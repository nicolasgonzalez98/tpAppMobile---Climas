import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  /**
 * Extrae la hora y los minutos de una fecha en formato de cadena.
 * 
 * @param {string} fechaOriginal - Fecha en formato de cadena que se va a procesar.
 * @returns {string} - Hora formateada en formato "hh:mm".
 */
  extraerHora(fechaOriginal: string) {
    const fecha = new Date(fechaOriginal);
  
    // Obtener la hora y los minutos
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
  
    // Formatear la hora a "hh:mm"
    const horaFormateada = `${horas}:${minutos}`;
  
    return horaFormateada;
  }

  /**
 * Formatea una fecha en formato de cadena a una representación más legible.
 * 
 * @param {string} fechaOriginal - Fecha en formato de cadena que se va a procesar.
 * @returns {string} - Fecha formateada en formato "Día dd/mm".
 */
  formatearFecha(fechaOriginal:string){
    const fecha = new Date(fechaOriginal);

    // Obtener el día y mes
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; 
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaSemana = diasSemana[fecha.getDay()];

    // Formatear a "dd/mm"
    const fechaFormateada = `${diaSemana} ${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}`;

    return fechaFormateada
  }
}
