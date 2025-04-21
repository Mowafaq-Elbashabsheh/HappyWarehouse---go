import { CanActivateFn } from "@angular/router";
import { Router } from "@angular/router";
import { inject } from "@angular/core";

export const  authGuard: CanActivateFn = (route, state) => {
    
    const router = inject(Router);

    const userData = localStorage.getItem('UserData');
    
    const userDataObj = JSON.parse(userData? userData : '{}');

    if(userDataObj.role) {
        return true;
    }
    
    router.navigateByUrl('/login')
    return false;
};