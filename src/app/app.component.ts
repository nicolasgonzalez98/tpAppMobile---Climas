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
    this.firestoreService.checkAuthState()
  }

}
