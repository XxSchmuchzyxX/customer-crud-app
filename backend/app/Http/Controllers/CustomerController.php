<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\ElasticsearchService;

class CustomerController extends Controller
{

    public function search(Request $request): JsonResponse
    {
    $query = $request->get('q', '');

    if (empty($query)) {
        return response()->json([]);
    }

    $es = new ElasticsearchService();
    $results = $es->searchCustomers($query);

    return response()->json($results);
    }

   public function index(): JsonResponse
    {
    $customers = Customer::select('id', 'first_name', 'last_name', 'email', 'contact_number')->get();
    return response()->json($customers);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'nullable|email|unique:customers|max:150',
            'contact_number' => 'nullable|string|max:20'
        ]);

        $customer = Customer::create($request->all());
        return response()->json($customer, 201);
    }

    public function show(Customer $customer): JsonResponse
    {
        return response()->json($customer);
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'nullable|email|unique:customers,email,'.$customer->id.'|max:150',
            'contact_number' => 'nullable|string|max:20'
        ]);

        $customer->update($request->all());
        return response()->json($customer);
    }

    public function destroy(Customer $customer): JsonResponse
    {
        $customer->delete();
        return response()->json(null, 204);
    }
}