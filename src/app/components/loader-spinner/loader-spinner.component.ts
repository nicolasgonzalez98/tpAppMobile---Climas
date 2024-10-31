import { Component, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-loader-spinner',
  templateUrl: './loader-spinner.component.html',
  styleUrls: ['./loader-spinner.component.scss'],
  standalone:true,
  imports:[IonicModule]
})
export class LoaderSpinnerComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
