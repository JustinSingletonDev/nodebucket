import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<NewComponent>, private fb: FormBuilder) { }

  ngOnInit() {
    this.form=this.fb.group({
      text: [null, Validators.compose([Validators.required])]
    });
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }

}
