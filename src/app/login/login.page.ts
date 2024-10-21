import { Component, inject, OnInit } from '@angular/core';
import { User } from '../common/models/user.model';
import { FirestoreService } from '../common/services/firestore.service';
import { signOut } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { browserLocalPersistence, getAuth, GoogleAuthProvider, setPersistence, signInWithPopup, signInWithEmailAndPassword, browserSessionPersistence } from "firebase/auth";





@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  
  users: User[] = [];
  loginForm: FormGroup;
  isToastOpen:boolean = false;
  

  constructor(
    public firestoreService: FirestoreService,
    private fb: FormBuilder,
    private navCtrl: NavController
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
  }

  ngOnInit() {
    
  }

  loadUsers(){
    this.firestoreService.getCollectionChanges<User>("/Usuarios").subscribe(data => {
      if(data){
        this.users = data
      }
    })
  }

  async login() {
    const { email, password } = this.loginForm.value;
    
    const auth = getAuth();
    try {
      await setPersistence(auth, browserLocalPersistence)
      .then(() => signInWithEmailAndPassword(auth, email, password))
      // Redirigir al usuario a la página principal o donde quieras
      this.navCtrl.navigateForward('/tabs/tab1');
    } catch (error) {
      this.setOpen(true)
    }
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  


}
