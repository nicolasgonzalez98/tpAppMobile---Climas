import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { signOut } from '@firebase/auth';

import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss'],
  standalone:true,
  imports:[IonicModule]
})
export class SignOutComponent  implements OnInit {

  constructor(
    private navCtrl: NavController
  ) { }
  

  ngOnInit() {}

  async signOutComponent(){
    const auth = getAuth()
    await signOut(auth).then(() =>{
      console.log("Sesión cerrada")
      this.navCtrl.navigateForward('/login');
    }).catch(err => console.log(err))
  }

}
