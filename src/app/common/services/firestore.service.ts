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
  favourites: { idCiudad: string; nombreCiudad: string }[] = [];
  
  constructor(
    private navCtrl: NavController,
    private firestoreD: AngularFirestore, // Inyecta Firestore
    private toastController: ToastController,
    private router: Router,
    private auth:Auth
  ) { 
    
  }

  /**
   * Obtiene el ID del usuario actualmente autenticado.
   * Utiliza el método `onAuthStateChanged` de Firebase para verificar si un usuario
   * ha iniciado sesión, y resuelve con su UID. Si no hay un usuario autenticado, la
   * promesa se rechaza con un mensaje de error.
   * 
   * @returns {Promise<string>} - Promesa que resuelve con el UID del usuario autenticado o
   *                              se rechaza si no hay usuario autenticado.
   */
  async idUserActual(): Promise<string> {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.idUsuarioLogueado = user.uid;
          resolve(user.uid);
        } else {
          reject("Usuario no autenticado");
        }
      });
    });
}

  /**
   * Verifica el estado de autenticación del usuario y redirige según la ruta actual.
   * Si el usuario está en la página de inicio de sesión o registro y ya está autenticado,
   * lo redirige a la página principal. Si el usuario no está autenticado en otras rutas,
   * lo redirige a la página de inicio de sesión.
   */
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
      duration: 2000, 
      position: 'bottom' // Posición en la pantalla (puede ser 'top', 'middle' o 'bottom')
    });
    toast.present();
  }

  /**
   * Inicia sesión en la aplicación utilizando Google como proveedor de autenticación.
   * Si el usuario no tiene un documento en Firestore, se crea uno con su UID y correo electrónico.
   * Al finalizar, redirige al usuario a la página principal de la aplicación.
   */
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
      } else {
        console.log("");
      }
  
      // Navega a la página principal de la aplicación
      this.navCtrl.navigateForward('/tabs/tab1');
    } catch (error: any) {
      // Manejo de errores
      console.error("Error en la autenticación con Google: ", error);
      this.showToast(error.message);
    }
  }

  /**
   * Agrega una ciudad a la lista de favoritos del usuario en Firestore.
   * 
   * @param {string} userId - ID del usuario al que se le agregará la ciudad a favoritos.
   * @param {{ nombreCiudad: string, idCiudad: string }} ciudad - Objeto que contiene el nombre y ID de la ciudad a agregar.
   */
  async addFavourite(userId: string, ciudad: { nombreCiudad: string, idCiudad: string }) {
    const userDocRef = doc(this.firestore, `Usuarios/${userId}`);
    try {
        await updateDoc(userDocRef, {
            favoritos: arrayUnion(ciudad) // Guardar objeto en vez del id solo
        });
        this.showToast("Ubicación agregada a favoritos");
    } catch (error) {
      this.showToast("Error al agregar a favoritos: "+error);
    }
}

/**
 * Elimina una ciudad de la lista de favoritos del usuario en Firestore.
 * 
 * @param {string} userId - ID del usuario del que se eliminará la ciudad de favoritos.
 * @param {{ nombreCiudad: string, idCiudad: string }} ciudad - Objeto que contiene el nombre y ID de la ciudad a eliminar.
 */
async deleteFavourite(userId: string, ciudad: { nombreCiudad: string, idCiudad: string }) {
    const userDocRef = doc(this.firestore, `Usuarios/${userId}`);
    try {
        await updateDoc(userDocRef, {
            favoritos: arrayRemove(ciudad) // Eliminar el objeto específico
        });
        this.showToast("Ubicación eliminada de favoritos");
    } catch (error) {
      this.showToast("Error al eliminar de favoritos: "+error);
    }
}

  /**
   * Verifica si una ciudad está en la lista de favoritos del usuario.
   * 
   * @param {string} userId - ID del usuario para verificar sus favoritos.
   * @param {string} idCiudad - ID de la ciudad que se desea verificar.
   * @returns {Promise<boolean>} - Promesa que resuelve con true si la ciudad está en favoritos, de lo contrario false.
   */
  async isFavourite(userId: string, idCiudad: string): Promise<boolean> {
    let user: User | null;

    try {
        if (!userId) {
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
            // Buscar el idCiudad en el array de objetos
            const isFavorite = favoritos.some((item: { idCiudad: string }) => item.idCiudad === idCiudad);

            return isFavorite;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error al verificar favoritos:", error);
        return false;
    }
  }

  /**
   * Obtiene la lista de ciudades favoritas de un usuario desde Firestore.
   * 
   * @param {string} userId - ID del usuario del que se quieren obtener los favoritos.
   * @returns {Promise<Array>} - Promesa que resuelve con un array de objetos de favoritos o un array vacío si no hay favoritos.
   */
  async getFavourites(userId: string){
    const userDocRef = doc(this.firestore, `Usuarios/${userId}`);
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.favourites = userData['favoritos'] || []
        return userData['favoritos'] || []; // Devuelve el array de favoritos o uno vacío si no existe
      } else {
        this.favourites = []
        return [];
      }
    } catch (error) {
      console.error("Error al obtener favoritos: ", error);
      this.favourites = []
      return [];
    }
    }
}





 


  

