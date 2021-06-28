import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  form: FormGroup;

  constructor(private router: Router, private cookieService: CookieService, private fb: FormBuilder, private http: HttpClient ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      empId: [null, Validators.compose([Validators.required])],
    });
  }

  signin() {
    const empId = this.form.controls.empId.value;

    this.http.get('/api/employees/:empId').subscribe(res => {
        this.cookieService.set('session_user', empId, 1);
        this.router.navigate(['/']);
    });
  }

}
