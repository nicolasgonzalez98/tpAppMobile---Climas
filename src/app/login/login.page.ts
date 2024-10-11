import { Component, inject, OnInit } from '@angular/core';
import { User } from '../common/models/users.models';
import { FirestoreService } from '../common/services/firestore.service';
import { Auth, getAuth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  
  users: User[] = [];
  loginForm: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
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
    try {
      const auth = getAuth();
      const user = await signInWithEmailAndPassword(auth,email,password).then((user) =>{
        console.log('Login exitoso!', user.user);
      });
      
      // Redirigir al usuario a la página principal o donde quieras
      this.navCtrl.navigateForward('/tabs/tab1');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }


}
