import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../common/services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  favorites: any[] = [];
  isLoading: boolean = false
  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.isLoading = true
    await this.firestoreService.idUserActual()
    const userId = this.firestoreService.idUsuarioLogueado;
    this.favorites = await this.firestoreService.getFavourites(userId);

    
    this.isLoading = false
  }

  irADetalle(idCiudad:string){
    const URL = "/detalles/"+idCiudad
    this.router.navigateByUrl(URL)
  }

}
