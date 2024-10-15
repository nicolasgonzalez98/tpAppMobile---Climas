import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonButton, IonicModule } from '@ionic/angular';

import { SignOutComponent } from './sign-out.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('SignOutComponent', () => {
  let component: SignOutComponent;
  let fixture: ComponentFixture<SignOutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SignOutComponent ],
      imports: [IonicModule.forRoot(), CommonModule,IonButton,
        FormsModule,
        IonicModule,]
    }).compileComponents();

    fixture = TestBed.createComponent(SignOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
