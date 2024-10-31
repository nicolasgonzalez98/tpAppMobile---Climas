import { Component, OnInit } from '@angular/core';
import { User } from '../common/models/user.model';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user : User = {} as User;
  confirmarContrasena: string = '';

  constructor(
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth, 
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

/**
 * @description encargado de hacer el registro de usuario detro del auth en firebase mediante su funcion navita createUserWithEmailAndPassword()
 * @param user 
 */
async register(user: User) {
  if (this.formValidation()) {
    let loader = await this.loadingCtrl.create({
      message: "Espere por favor..."
    });
    await loader.present();

    try {
      console.log("entro try")
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(user.email, user.password)

      await this.firestore.collection('Usuarios').doc(userCredential.user?.uid).set({
        id: userCredential.user?.uid,
        email: user.email,
        favoritos: [] // Array vacío
      });

      console.log("Usuario registrado y añadido a Firestore");
      this.navCtrl.navigateForward('/login');
    } catch (e: any) {
      // Detecta si el error es debido a un email ya registrado
      if (e.code === 'auth/email-already-in-use') {
        this.showToast("El email ingresado ya existe");
      } else {
        this.showToast(e.message || "Ha ocurrido un error");
      }
    }

    await loader.dismiss();
  }
}

/**
 * @function formValidation()
 * @description Encargado de validar el formulario
 */
formValidation() {
  if (!this.user.email) {
    this.showToast("Ingrese un email");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.user.email)) {
    this.showToast("Ingrese un email válido");
    return false;
  }

  // Validación de contraseña segura: debe tener al menos una mayúscula, una minúscula, un carácter especial y más de 8 caracteres
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;

  if (!this.user.password) {
    this.showToast("Ingrese una clave");
    return false;
  } else if (!passwordRegex.test(this.user.password)) {
    this.showToast("La clave debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y un carácter especial");
    return false;
  }

  // Validación de coincidencia de contraseñas
  if (this.user.password !== this.confirmarContrasena) {
    this.showToast("Las contraseñas no coinciden");
    return false;
  }

  return true;
}
  
/**
 * @function showToast()
 * @description Encargado de mostrar mensaje error
 */
  showToast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 3000,
    }).then (toastData => toastData.present())
  }


    /**
   * @function vueltaAtras()
   * @description permitira volver a la ultima pagina visitada del historial
   */
    vueltaAtras(){
      this.navCtrl.navigateBack('/login')
  }

}
