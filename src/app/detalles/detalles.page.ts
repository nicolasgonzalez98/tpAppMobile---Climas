import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIWeatherService } from '../common/services/api-weather.service';
import { addIcons } from 'ionicons';
import { logoIonic } from 'ionicons/icons';
import { UtilitiesService } from '../common/services/utilities.service';
import { FirestoreService } from '../common/services/firestore.service';


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
  isFav:boolean = false
  isFavLoading:boolean = false
  
  
  constructor(
    public datosClima:APIWeatherService,
    private route:ActivatedRoute,
    public utilities: UtilitiesService,
    private firestoreService:FirestoreService
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
    
    await this.firestoreService.idUserActual().then(() =>{
      this.isFavourite()
    })
    
  }

  async addFavourite(){
    this.isFavLoading = true
    const id = this.firestoreService.idUsuarioLogueado
    
    await this.firestoreService.addFavourite(id, this.idCiudad).then(() =>{
      this.isFavourite()
    }).then(() => {
      this.isFavLoading = false
    })
    
  }

  async deleteFavourite(){
    this.isFavLoading = true
    const id = this.firestoreService.idUsuarioLogueado
    
    await this.firestoreService.deleteFavourite(id, this.idCiudad).then(() =>{
      this.isFavourite()
    }).then(() => {
      this.isFavLoading = false
    })
    
    
  }

  async isFavourite(){
    const id = this.firestoreService.idUsuarioLogueado
    this.isFav= await this.firestoreService.isFavourite(id, this.idCiudad)
  }

  
}
