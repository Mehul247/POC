import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(): boolean {
    if (localStorage.getItem("uid")) {
      return true;
    } else {
      this.router.navigate(['/auth/login'])
      return false;
    }
  }

}
