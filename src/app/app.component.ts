import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styles: [`src/theme.scss`]
})
export class AppComponent {

  title = 'nodebucket';
}
