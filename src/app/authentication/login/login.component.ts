import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Iuser } from 'src/app/models/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user:Iuser={email:"",password:""}
  constructor(private _AuthenticationService: AuthenticationService ) { }

  ngOnInit() {}

  //login
  login()
  {
    // console.log(this.user.email, this.user.password)
    this._AuthenticationService.login(this.user.email, this.user.password);
    
  }
}
