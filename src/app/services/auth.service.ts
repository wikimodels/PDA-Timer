import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubj = new BehaviorSubject<User>(null);
  userSubj$ = this.userSubj.asObservable();
  redirectUrl = new BehaviorSubject('home');

  constructor(private afAuth: AngularFireAuth) { }

  loginViaGoogle(): Observable<auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()));
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  setRedirectUrl(url: string) {
    this.redirectUrl.next(url);
  }

  getRedirectUrl() {
    return this.redirectUrl.getValue();
  }

  setCurrentUser(
    displayName = '',
    email = '',
    date = Date.now().toString(),
    sessionDuration = 0
  ) {
    const user: User = {
      email: email
    };

    console.log('user to save', user);
    this.userSubj.next(user);
  }

  getCurrentUser(): User {
    return this.userSubj.getValue();
  }
}
