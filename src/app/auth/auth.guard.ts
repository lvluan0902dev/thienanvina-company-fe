import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class AuthGuard implements CanActivate {
    public token: any;

    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        this.token = localStorage.getItem('token');
        if (this.token)
        {
            return true;
        }
        else{
            const url = this.router.createUrlTree(['/', 'login'], { queryParams : {
                return_url : this.router.url
            }});

            this.router.navigateByUrl(url);
        }
    }
}