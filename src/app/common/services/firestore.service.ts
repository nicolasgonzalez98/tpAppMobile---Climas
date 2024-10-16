import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore)

  constructor(
    private navCtrl: NavController
  ) { }

  getCollectionChanges<tipo>(path: string){
    const itemCollection = collection(this.firestore,path)
    return collectionData(itemCollection) as Observable<tipo[]>
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
