import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../services/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css'
})
export class CustomerFormComponent implements OnInit {
  @Input() customer: Customer | null = null;
  @Input() isEditing: boolean = false;
  @Output() save = new EventEmitter<Customer>();
  @Output() cancel = new EventEmitter<void>();

  formData: Customer = {
    first_name: '',
    last_name: '',
    email: '',
    contact_number: ''
  };

  errors: any = {};

  ngOnInit(): void {
    if (this.customer) {
      this.formData = { ...this.customer };
    }
  }

  onSubmit(): void {
    this.errors = {};
    
    // Basic validation
    if (!this.formData.first_name?.trim()) {
      this.errors.first_name = 'First name is required';
    }
    
    if (!this.formData.last_name?.trim()) {
      this.errors.last_name = 'Last name is required';
    }
    
    if (this.formData.email && !this.isValidEmail(this.formData.email)) {
      this.errors.email = 'Please enter a valid email';
    }
    
    // If no errors, emit the save event
    if (Object.keys(this.errors).length === 0) {
      this.save.emit(this.formData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}