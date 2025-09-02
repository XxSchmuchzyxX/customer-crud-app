import { TestBed } from '@angular/core/testing';
import { CustomerService, Customer } from './customer.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [
        CustomerService,
        { provide: HttpClient, useValue: httpSpy } // <-- provide the spy
      ]
    });
    service = TestBed.inject(CustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch customers', () => {
    const mockCustomers: Customer[] = [
      { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@test.com' }
    ];

    httpSpy.get.and.returnValue(of(mockCustomers)); // mock GET

    service.getCustomers().subscribe(customers => {
      expect(customers).toEqual(mockCustomers);
    });

    expect(httpSpy.get).toHaveBeenCalledWith('http://localhost:8080/api/customers');
  });

  it('should create customer', () => {
    const newCustomer: Customer = {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@test.com'
    };

    httpSpy.post.and.returnValue(of({ ...newCustomer, id: 1 })); // mock POST

    service.createCustomer(newCustomer).subscribe(customer => {
      expect(customer.first_name).toBe('Jane');
    });

    expect(httpSpy.post).toHaveBeenCalledWith('http://localhost:8080/api/customers', newCustomer);
  });
});
