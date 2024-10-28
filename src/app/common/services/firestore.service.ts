import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore)
  
  constructor(
    private navCtrl: NavController,
    private firestoreD: AngularFirestore, // Inyecta Firestore
    private toastController: ToastController,
    private router: Router
  ) { }

  // getCollectionChanges<tipo>(path: string){
  //   const itemCollection = collection(this.firestore,path)
  //   return collectionData(itemCollection) as Observable<tipo[]>
  // }

  checkAuthState() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if(this.router.url === "/login" || this.router.url === "/register" ){
        if(user){
          console.log(user)
          this.navCtrl.navigateForward('/tabs/tab1'); 
        }
      }else{
        if(!user){
          console.log("No estoy autenticado")
          this.navCtrl.navigateForward('/login');
        }
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración del mensaje en milisegundos
      position: 'bottom' // Posición en la pantalla (puede ser 'top', 'middle' o 'bottom')
    });
    toast.present();
  }


  async loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
  
    try {
      // Inicia sesión con Google
      const result = await signInWithPopup(auth, provider);
  
      // Obtiene el usuario autenticado y su UID
      const user = result.user;
      const uid = user.uid;
  
      // Verifica si el documento del usuario ya existe en Firestore
      const userDoc = await this.firestoreD.collection('Usuarios').doc(uid).get().toPromise();
  
      // Si el documento no existe, lo crea
      if (!userDoc?.exists) {
        await this.firestoreD.collection('Usuarios').doc(uid).set({
          id: uid,
          email: user.email,
          favoritos: [] // Array vacío
        });
        console.log("Documento de usuario creado en Firestore");
      } else {
        console.log("El documento del usuario ya existe en Firestore");
      }
  
      // Navega a la página principal de la aplicación
      this.navCtrl.navigateForward('/tabs/tab1');
    } catch (error: any) {
      // Manejo de errores
      console.error("Error en la autenticación con Google: ", error);
      this.showToast(error.message);
    }
  }

  
}
