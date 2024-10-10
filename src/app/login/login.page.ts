import { Component, OnInit } from '@angular/core';
import { User } from '../common/models/users.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  users: User[] = [];

  constructor() { 
    this.loadUsers()
  }

  ngOnInit() {
  }

  loadUsers(){
    const user = {
      nombre: "Nico",
      edad: 26
    }

    const user1 = {
      nombre:"Mili",
      edad:24
    }

    this.users.push(user);
    this.users.push(user1)
  }

}
