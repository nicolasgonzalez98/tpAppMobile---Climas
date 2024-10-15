import { Component, OnInit } from '@angular/core';
import { User } from '../common/models/users.models';
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

  async loginWithGoogle(){
    const auth = getAuth();
    const provider = new GoogleAuthProvider
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if(credential){
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          this.navCtrl.navigateForward('/tabs/tab1');
        }
        
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
      }


}
