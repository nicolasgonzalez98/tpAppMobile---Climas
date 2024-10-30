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
  proximosCincoDias:any[]= []
  proximasDoceHoras:any[] = []
  isFav:boolean = false
  isFavLoading:boolean = false
  isloading:boolean = false
  error:boolean = false
  
  
  constructor(
    public datosClima:APIWeatherService,
    private route:ActivatedRoute,
    public utilities: UtilitiesService,
    private firestoreService:FirestoreService
  ) { 
    addIcons({ logoIonic })
  } 

  async ngOnInit() {
    
    this.isloading = true
    this.idCiudad = this.route.snapshot.paramMap.get('idUbicacion') || "";
    
    try {
      await Promise.all([
        this.datosClima.climaEnCiudad(this.idCiudad),
        this.datosClima.buscarPorCiudad(this.idCiudad).then(() => {
          this.datosCiudad = this.datosClima.datosCiudad;
        }),
        this.datosClima.climaProximasDoceHoras(this.idCiudad).then(res => {
          this.proximasDoceHoras = res;
        }),
        this.datosClima.climaProximosCincoDias(this.idCiudad).then(res => {
          this.proximosCincoDias = res;
        }),
        this.firestoreService.idUserActual().then(() => {
          this.isFavourite();
        })
      ]);

      
    } catch (error) {
      
      this.error = true; 
      this.datosCiudad = {};
      this.datosClima.datosCiudad = {"LocalizedName":""}
    } finally {
      this.isloading = false;
    }
    
  }

  /**
 * Agrega la ciudad actual a la lista de favoritos del usuario.
 * 
 * @returns {Promise<void>} - Una promesa que se resuelve cuando se completa la operación.
 */
  async addFavourite(){
    this.isFavLoading = true
    const id = this.firestoreService.idUsuarioLogueado
    const nombreCiudad = this.datosClima.datosCiudad.LocalizedName;
    this.isFav = true
    
    await this.firestoreService.addFavourite(id, { nombreCiudad, idCiudad: this.idCiudad }).then(() => {
      this.isFavourite();
  }).then(() => {
      this.isFavLoading = false;
  });
    
  }

  /**
 * Elimina la ciudad actual de la lista de favoritos del usuario.
 * 
 * @returns {Promise<void>} - Una promesa que se resuelve cuando se completa la operación.
 */
  async deleteFavourite(){
    this.isFavLoading = true
    const id = this.firestoreService.idUsuarioLogueado;
    const nombreCiudad = this.datosClima.datosCiudad.LocalizedName;
    this.isFav = false
    
    await this.firestoreService.deleteFavourite(id, { nombreCiudad, idCiudad: this.idCiudad }).then(() =>{
      this.isFavourite()
    }).then(() => {
      this.isFavLoading = false
    })
    
    
  }

  /**
 * Verifica si la ciudad actual está en la lista de favoritos del usuario.
 * 
 * @returns {Promise<void>} - Una promesa que se resuelve cuando se completa la verificación.
 */
  async isFavourite(){
    const id = this.firestoreService.idUsuarioLogueado
    this.isFav= await this.firestoreService.isFavourite(id, this.idCiudad)
  }
}
