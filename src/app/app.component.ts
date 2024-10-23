import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirestoreService } from './common/services/firestore.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private firestoreService:FirestoreService
  ) {
    this.checkAuthState()
  }

  checkAuthState() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if(this.router.url === "/login" || this.router.url === "/register" ){
        if(user){
          this.navCtrl.navigateForward('/tabs/tab1'); 
        }
      }else{
        if(!user){
          console.log("No estoy autenticado")
          this.navCtrl.navigateForward('/login');
        }
      }
      // if (user) {
      //   console.log("Usuario sigue autenticado:", user);
      //   if(this.router.url === "/login" || this.router.url === "/register" ){
      //     console.log("Estoy en login o register, auth")
      //     this.navCtrl.navigateForward('/tabs/tab1');
      //   }
      //   // Redirigir a una página protegida si es necesario
      //   //
      // } else {
      //   if(this.router.url !== "/login" ||   this.router.url !== "/register" ){
      //     this.navCtrl.navigateForward('/login');
      //   }
      //   console.log("No hay usuario autenticado.");
      //   // Redirigir a la página de login si es necesario
      //   // this.navCtrl.navigateRoot('/login');
      // }
    });
  }
}
