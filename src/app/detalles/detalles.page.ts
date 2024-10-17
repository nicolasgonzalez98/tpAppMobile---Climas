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
    
    this.proximosCincoDias= await this.datosClima.climaProximosCincoDias(this.idCiudad)
    console.log(this.proximosCincoDias)
    console.log(this.datosClima)
  }

}
