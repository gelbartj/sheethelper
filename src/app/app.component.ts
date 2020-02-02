import { Component }  from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],
  providers: [
  ]
})
export class AppComponent {
  title = 'Spreadsheet Combinator';
}
