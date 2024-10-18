import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirestoreService } from './common/services/firestore.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private navCtrl: NavController,
    private firestoreService:FirestoreService
  ) {
    this.checkAuthState()
  }

  checkAuthState() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Usuario sigue autenticado:", user);
        // Redirigir a una página protegida si es necesario
        this.navCtrl.navigateForward('/tabs/tab1');
      } else {
        console.log("No hay usuario autenticado.");
        // Redirigir a la página de login si es necesario
        this.navCtrl.navigateRoot('/login');
      }
    });
  }
}
