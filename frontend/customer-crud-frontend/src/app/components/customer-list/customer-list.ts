import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer, CustomerService } from '../../services/customer.service';
import { CustomerFormComponent } from '../customer-form/customer-form';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerFormComponent],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  searchQuery: string = '';
  loading: boolean = false;
  error: string = '';
  success: string = '';

  // Modal states
  showModal: boolean = false;
  isEditing: boolean = false;
  currentCustomer: Customer | null = null;

  // Delete confirmation
  showDeleteConfirm: boolean = false;
  customerToDelete: Customer | null = null;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.error = '';
    
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load customers';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.loadCustomers();
      return;
    }

    this.loading = true;
    this.error = '';
    
    this.customerService.searchCustomers(this.searchQuery).subscribe({
      next: (customers) => {
        this.customers = customers;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Search failed';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.loadCustomers();
  }

  // Modal methods
  openAddModal(): void {
    this.isEditing = false;
    this.currentCustomer = null;
    this.showModal = true;
    this.clearMessages();
  }

  openEditModal(customer: Customer): void {
    this.isEditing = true;
    this.currentCustomer = customer;
    this.showModal = true;
    this.clearMessages();
  }

  closeModal(): void {
    this.showModal = false;
    this.currentCustomer = null;
  }

  onSaveCustomer(customerData: Customer): void {
    if (this.isEditing && this.currentCustomer?.id) {
      // Update existing customer
      this.customerService.updateCustomer(this.currentCustomer.id, customerData).subscribe({
        next: (updatedCustomer) => {
          const index = this.customers.findIndex(c => c.id === updatedCustomer.id);
          if (index !== -1) {
            this.customers[index] = updatedCustomer;
          }
          this.closeModal();
          this.showSuccess('Customer updated successfully!');
        },
        error: (error) => {
          this.error = error.message || 'Failed to update customer';
        }
      });
    } else {
      // Create new customer
      this.customerService.createCustomer(customerData).subscribe({
        next: (newCustomer) => {
          this.customers.push(newCustomer);
          this.closeModal();
          this.showSuccess('Customer created successfully!');
        },
        error: (error) => {
          this.error = error.message || 'Failed to create customer';
        }
      });
    }
  }

  // Delete methods
  confirmDelete(customer: Customer): void {
    this.customerToDelete = customer;
    this.showDeleteConfirm = true;
    this.clearMessages();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.customerToDelete = null;
  }

  deleteCustomer(): void {
    if (this.customerToDelete?.id) {
      this.customerService.deleteCustomer(this.customerToDelete.id).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.id !== this.customerToDelete?.id);
          this.showDeleteConfirm = false;
          this.customerToDelete = null;
          this.showSuccess('Customer deleted successfully!');
        },
        error: (error) => {
          this.error = error.message || 'Failed to delete customer';
          this.showDeleteConfirm = false;
        }
      });
    }
  }

  private showSuccess(message: string): void {
    this.success = message;
    setTimeout(() => this.success = '', 3000);
  }

  private clearMessages(): void {
    this.error = '';
    this.success = '';
  }
}