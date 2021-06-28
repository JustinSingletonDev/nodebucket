import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NewComponent } from '../new/new.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sessionUser: string;
  tasks: any;
  todo: any;
  done: any;

  constructor(private http: HttpClient, private cookieService: CookieService, private dialog: MatDialog) {
    this.sessionUser = this.cookieService.get('session_user');

    this.http.get('/api/employees/' + this.sessionUser + '/tasks').subscribe(res => {
      this.tasks = res;
      this.todo = this.tasks.todo;
      this.done = this.tasks.done;
      console.log(this.tasks);
      console.log(this.todo);
      console.log(this.done);
    }, err => {
      console.log(err);
    });
  }

  ngOnInit() {
  }

  // Opens Create Task Dialog
  openCreateTaskDialog() {
    const dialogRef = this.dialog.open(NewComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        console.log(data);
        this.http.post('/api/employees/' + this.sessionUser + '/tasks', {
          text: data.text
        }).subscribe(res => {
          this.tasks = res;
          this.todo = this.tasks.todo;
          this.done = this.tasks.done;
        }, err => {
          console.log(err);
        });
      }
    });
  }

  // Deletes selected Task
  deleteTask(taskId) {
    if(taskId) {
      console.log(`Task Item: $(taskId) is being removed.`);
      this.http.delete('/api/employees/' + this.sessionUser + '/tasks/' + taskId).subscribe(res => {
        this.tasks = res;
        this.todo = this.tasks.todo;
        this.done = this.tasks.done;
      }, err => {
        console.log(err);
      });
    }
  }

  // Drag and Drop
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateTasks(this.todo, this.done).subscribe(res => {
        this.tasks = res;
        this.todo = this.tasks.todo;
        this.done = this.tasks.done;
      }, err => {
        console.log('Error saving update tasks');
        console.log(err);
      });
      console.log('Moved task in existing column');
      console.log(this.todo);
      console.log(this.done);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.updateTasks(this.todo, this.done).subscribe(res => {
        this.tasks = res;
        this.todo = this.tasks.todo;
        this.done = this.tasks.done;
      }, err => {
        console.log('Error saving update tasks');
        console.log(err);
      });
      console.log('Moved tasks to a new column');
      console.log(this.todo);
      console.log(this.done);
    }
  }

  // Update Tasks function
  updateTasks(todo, done) {
    return this.http.put('/api/employees/' + this.sessionUser + '/tasks', {
      todo,
      done
    });
  }
}
