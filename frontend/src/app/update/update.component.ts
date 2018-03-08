import {EventEmitter, Inject, Input, Output} from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DisplayMessage } from '../shared/models/display-message';
import { Subscription } from 'rxjs/Subscription';
import {
  UserService,
  AuthService
} from '../service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {startWith} from "rxjs/operator/startWith";
import {map} from 'rxjs/operators/map';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit, OnDestroy {
  title = 'Update users';
  @Output() apiClick: EventEmitter<any> = new EventEmitter();
  githubLink = '';
  filteredUsers: Observable<any[]>;
  users =  [];
  form: FormGroup;
  selectedUser = {};
  @Input() responseObj: any;

  submitted = false;
  success = false;
  failure  = false;
  userAccess = false;



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

    this.userService.getAll()
      .subscribe(res => {
        this.users = res;
        this.selectedUser = this.users[0];
        this.userService.getByUserName((this.selectedUser as any).id)
          .subscribe(res1 => {
            this.form = this.formBuilder.group({
              username: [res1.username, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
              password: [''],
              firstname:[res1.firstName],
              lastname: [res1.lastName]
            });
          }, err => {});
      }, err => {
        this.userAccess = true;
      });



  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  repository() {
    window.location.href = this.githubLink;
  }
  changeValue(event){

    this.userService.getByUserName((this.selectedUser as any).id)
      .subscribe(res1 => {
        this.form = this.formBuilder.group({
          username: [res1.username, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
          password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])],
          firstname:[res1.firstName],
          lastname: [res1.lastName]
        });
      }, err => {});
  }

  onDeleteClick(){
    this.notification = undefined;
    this.submitted = true;
    this.success = false;
    this.failure  = false;


    this.userService.deleteUser((this.selectedUser as any).id)
    // show me the animation
      .delay(1000)
      .subscribe(data => {
          console.log(data);
          this.submitted = false;
          this.success = true;
          //quick fix
          location.reload();

        },
        error => {
          this.submitted = false;
          this.failure = true;
          //quick fix
          location.reload();
          console.log("Update error" + JSON.stringify(error));
          this.notification = { msgType: 'error', msgBody: error['error'].message };
        });
  }
  onSubmit() {

    this.notification = undefined;
    this.submitted = true;
    this.success = false;
    this.failure  = false;

    this.form.value['id'] = (this.selectedUser as any).id;
    this.userService.updatetUser(this.form.value)
    // show me the animation
    .delay(1000)
    .subscribe(data => {
      console.log(data);
      this.submitted = false;
      this.success = true;
    },
    error => {
      this.submitted = false;
      this.failure = true;
      console.log("Update error" + JSON.stringify(error));
      this.notification = { msgType: 'error', msgBody: error['error'].message };
    });

  }



}
