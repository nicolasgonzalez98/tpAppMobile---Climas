import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, collectionData, Firestore, doc, updateDoc, arrayUnion, arrayRemove , getDoc } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { Auth, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore)
  idUsuarioLogueado:string = ""
  
  constructor(
    private navCtrl: NavController,
    private firestoreD: AngularFirestore, // Inyecta Firestore
    private toastController: ToastController,
    private router: Router,
    private auth:Auth
  ) { 
    
  }

  async idUserActual(){
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if(user){
        this.idUsuarioLogueado = user?.uid
      }
    })
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

  async addFavourite(userId: string, ubicacionId: string){
    const userDocRef = doc(this.firestore, `Usuarios/${userId}`);
    try {
      await updateDoc(userDocRef, {
        favoritos: arrayUnion(ubicacionId)
      });
      console.log("Elemento agregado a favoritos");
    } catch (error) {
      console.error("Error al agregar a favoritos: ", error);
    }
  }

  async deleteFavourite(userId:string, ubicacionId:string){
    const userDocRef = doc(this.firestore, `Usuarios/${userId}`);

    try {
      await updateDoc(userDocRef, {
        favoritos: arrayRemove(ubicacionId)
      });
      console.log("Elemento eliminado de favoritos");
    } catch (error) {
      console.error("Error al eliminar de favoritos: ", error);
    }
  }

  async isFavourite(userId:string, idCiudad:string){
    let user: User | null

    try {

      if(!userId){
        user = this.auth.currentUser;

        if (user) {
          userId = user.uid;
        }
      }

      const userDocRef = doc(this.firestore, `Usuarios/${userId || this.idUsuarioLogueado}`);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favoritos = userData['favoritos'] || [];
        const isFavorite = favoritos.includes(idCiudad);
        
        return isFavorite;
      } else {
        
        return false;
      }
      
    } catch (error) {
      console.error("Error al verificar favoritos:", error);
      return false;
    }
  }
  }

  

