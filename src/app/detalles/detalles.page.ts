import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIWeatherService } from '../common/services/api-weather.service';
import { addIcons } from 'ionicons';
import { logoIonic } from 'ionicons/icons';
import { UtilitiesService } from '../common/services/utilities.service';


@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss']
})

export class DetallesPage implements OnInit {

  idCiudad!: string ;
  datosCiudad:object={}
  proximosCincoDias:any[] = []
  proximasDoceHoras:any[] = []
  
  
  constructor(
    public datosClima:APIWeatherService,
    private route:ActivatedRoute,
    public utilities: UtilitiesService
  ) { 
    addIcons({ logoIonic })
  } 

  async ngOnInit() {
    this.idCiudad = this.route.snapshot.paramMap.get('idUbicacion') || "";
    
    await this.datosClima.climaEnCiudad(this.idCiudad)
    await this.datosClima.buscarPorCiudad(this.idCiudad).then(() => {
      this.datosCiudad = this.datosClima.datosCiudad
    })
    
    this.proximasDoceHoras = await this.datosClima.climaProximasDoceHoras(this.idCiudad);
    this.proximosCincoDias= await this.datosClima.climaProximosCincoDias(this.idCiudad);
    
    
  }
}
