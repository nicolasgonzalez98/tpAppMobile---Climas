import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIWeatherService } from '../common/services/api-weather.service';


@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
})
export class DetallesPage implements OnInit {

  idCiudad!: string ;
  datosCiudad:object={}
  proximosCincoDias:any[] = []
  proximasDoceHoras:any[] = []
  
  constructor(
    public datosClima:APIWeatherService,
    private route:ActivatedRoute
  ) { 
    
  } 

  async ngOnInit() {
    this.idCiudad = this.route.snapshot.paramMap.get('idUbicacion') || "";
    
    await this.datosClima.climaEnCiudad(this.idCiudad)
    
    this.proximasDoceHoras = await this.datosClima.climaProximasDoceHoras(this.idCiudad);
    this.proximosCincoDias= await this.datosClima.climaProximosCincoDias(this.idCiudad);
    console.log(this.proximasDoceHoras)
    console.log(this.datosClima)
  }

  formatearFecha(fechaOriginal:string){
    const fecha = new Date(fechaOriginal);

    // Obtener el día y mes
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaSemana = diasSemana[fecha.getDay()];

    // Formatear a "dd/mm"
    const fechaFormateada = `${diaSemana} ${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}`;

    return fechaFormateada
  }

  extraerHora(fechaOriginal: string) {
    const fecha = new Date(fechaOriginal);
  
    // Obtener la hora y los minutos
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
  
    // Formatear la hora a "hh:mm"
    const horaFormateada = `${horas}:${minutos}`;
  
    return horaFormateada;
  }

}
