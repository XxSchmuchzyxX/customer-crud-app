import { Component } from '@angular/core';
import { CustomerListComponent } from './components/customer-list/customer-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomerListComponent],
  template: `<app-customer-list></app-customer-list>`, // Simple, clean template
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'customer-crud-frontend'; // Back to simple property since we're not using the template
}