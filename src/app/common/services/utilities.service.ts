import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  extraerHora(fechaOriginal: string) {
    const fecha = new Date(fechaOriginal);
  
    // Obtener la hora y los minutos
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
  
    // Formatear la hora a "hh:mm"
    const horaFormateada = `${horas}:${minutos}`;
  
    return horaFormateada;
  }

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
