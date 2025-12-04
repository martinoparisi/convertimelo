import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

/**
 * Service for handling user authentication using Firebase Auth.
 * Provides methods for login, registration, and logout.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Inject Firebase Auth instance
  public auth: Auth = inject(Auth);

  // Observable that emits the current user state (User object or null)
  user$: Observable<User | null> = authState(this.auth);

  constructor() {}

  /**
   * Logs in a user with email and password.
   * @param email The user's email address.
   * @param password The user's password.
   * @returns A Promise that resolves with the user credential.
   */
  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Logs in a user using Google Sign-In popup.
   * @returns A Promise that resolves with the user credential.
   */
  loginWithGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  /**
   * Registers a new user with email and password.
   * @param email The email address for the new account.
   * @param password The password for the new account.
   * @returns A Promise that resolves with the user credential.
   */
  register(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Logs out the current user.
   * @returns A Promise that resolves when sign-out is complete.
   */
  logout(): Promise<void> {
    return signOut(this.auth);
  }
}
