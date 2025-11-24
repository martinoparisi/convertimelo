import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState, User, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public auth: Auth = inject(Auth);
    user$: Observable<User | null> = authState(this.auth);

    constructor() { }

    login(email: string, password: string): Promise<any> {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    loginWithGoogle(): Promise<any> {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider);
    }

    register(email: string, password: string): Promise<any> {
        return createUserWithEmailAndPassword(this.auth, email, password);
    }

    logout(): Promise<void> {
        return signOut(this.auth);
    }
}
