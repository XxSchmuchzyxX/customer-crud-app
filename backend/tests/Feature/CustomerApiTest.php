<?php

namespace Tests\Feature;

use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_customers(): void
    {
        // Create test customers
        Customer::factory()->create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@test.com'
        ]);

        $response = $this->getJson('/api/customers');

        $response->assertStatus(200)
                 ->assertJsonCount(1)
                 ->assertJsonFragment([
                     'first_name' => 'John',
                     'last_name' => 'Doe'
                 ]);
    }

    public function test_can_create_customer(): void
    {
        $customerData = [
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane@test.com',
            'contact_number' => '1234567890'
        ];

        $response = $this->postJson('/api/customers', $customerData);

        $response->assertStatus(201)
                 ->assertJsonFragment($customerData);

        $this->assertDatabaseHas('customers', $customerData);
    }

    public function test_validates_required_fields(): void
    {
        $response = $this->postJson('/api/customers', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['first_name', 'last_name']);
    }

    public function test_can_update_customer(): void
    {
        $customer = Customer::factory()->create([
            'first_name' => 'Original',
            'last_name' => 'Name'
        ]);

        $updateData = [
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'email' => 'updated@test.com'
        ];

        $response = $this->putJson("/api/customers/{$customer->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJsonFragment($updateData);
    }

    public function test_can_delete_customer(): void
    {
        $customer = Customer::factory()->create();

        $response = $this->deleteJson("/api/customers/{$customer->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('customers', ['id' => $customer->id]);
    }

    public function test_can_search_customers(): void
    {
        Customer::factory()->create([
            'first_name' => 'Searchable',
            'last_name' => 'User',
            'email' => 'search@test.com'
        ]);

        Customer::factory()->create([
            'first_name' => 'Different',
            'last_name' => 'Person',
            'email' => 'other@test.com'
        ]);

        $response = $this->getJson('/api/customers/search?q=Searchable');

        $response->assertStatus(200)
                 ->assertJsonCount(1)
                 ->assertJsonFragment(['first_name' => 'Searchable']);
    }
}