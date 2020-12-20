import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  Form,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { auth } from 'firebase';
import { Observable, from, EMPTY } from 'rxjs';
import { take, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { DexieDbOpsService } from '../services/dexie-idbs-ops.service';
import { DexieCurrentUserDbService } from '../services/dexie-idbs.service';
import { SessionsStore } from '../services/sessions-store.service';
import { SnackBarService } from '../services/snackbar.service';

import { FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CurrentUser, User } from 'src/models/user';
import { MessageType } from 'src/models/message-types';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  return = '';
  constructor(
    private readonly auth: AuthService,
    private readonly sessionsStore: SessionsStore,
    private readonly router: Router,
    private readonly snackbar: SnackBarService,
    private formBuilder: FormBuilder,
    private dexieDbOpsService: DexieDbOpsService
  ) {}

  userForm: FormGroup;
  currentUser: any;

  ngOnInit() {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngAfterViewInit() {
    this.dexieDbOpsService
      .getCurrentUserFromUserDb()
      .then((user) => {
        if (user) {
          this.userForm.setValue({ email: user.email });
        }
      })
      .catch(console.log);
  }

  onSubmit() {
    const email = this.userForm.value.email;
    const currentUser: CurrentUser = { email: email };
    this.dexieDbOpsService.currentUserTable.clear();
    this.dexieDbOpsService.addCurrentUserToUserDb(currentUser);
    this.sessionsStore.getAllSessions(email);
    this.snackbar.open(`Hi, ${currentUser.email}!`, 'Close', MessageType.INFO);
    this.router.navigate(['home']);
  }

  // login() {
  //   this.auth
  //     .loginViaGoogle()
  //     .pipe(
  //       take(1),
  //       catchError((error) => {
  //         this.sessionsStore.getAllSessions();
  //         this.snackbar.openSnackBar(`${error.message} 😢`, 'Close');
  //         return EMPTY;
  //       })
  //     )
  //     .subscribe((response) => {

  //       console.log('response from google', response);
  //       console.log('response.user from google', response.user);
  //       if (response.user) {
  //         const user = {
  //           displayName: response.user.displayName,
  //           email: response.user.email
  //         };
  //         this.dexieOpsService.clearCurrentUserDb();
  //         this.dexieOpsService.addCurrentUserToUserDb(user);
  //         this.auth.setCurrentUser(
  //           response.user.displayName,
  //           response.user.email
  //         );
  //         this.sessionsStore.getAllSessions();
  //         this.snackbar.openSnackBar(`Hi, ${response.user.displayName}`, 'Close');
  //         this.router.navigateByUrl(this.auth.getRedirectUrl());
  //       }

  //     });
  //}
}
