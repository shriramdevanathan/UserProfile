import { Inject } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DisplayMessage } from '../shared/models/display-message';
import { Subscription } from 'rxjs/Subscription';
import {
  UserService,
  AuthService
} from '../service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  title = 'Sign up';
  githubLink = 'https://github.com/bfwg/angular-spring-starter';
  form: FormGroup;

  submitted = false;
  success = false;
  failure  = false;



  notification: DisplayMessage;

  returnUrl: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit() {
    this.route.params
    .takeUntil(this.ngUnsubscribe)
    .subscribe((params: DisplayMessage) => {
      this.notification = params;
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.form = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])],
      firstname:[''],
      lastname: ['']
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  repository() {
    window.location.href = this.githubLink;
  }

  onSubmit() {

    this.notification = undefined;
    this.submitted = true;
    this.success = false;
    this.failure  = false;

    this.authService.signup(this.form.value)
    // show me the animation
    .delay(1000)
    .subscribe(data => {
      console.log(data);
      this.submitted = false;
      this.success = true;
      // this.authService.login(this.form.value).subscribe(data =>{
      //   this.userService.getMyInfo().subscribe();
      // })
      // this.router.navigate([this.returnUrl]);
    },
    error => {
      this.submitted = false;
      this.failure = true;
      console.log("Sign up error" + JSON.stringify(error));
      this.notification = { msgType: 'error', msgBody: error['error'].message };
    });

  }


}
