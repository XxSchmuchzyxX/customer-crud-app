<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ElasticsearchService
{
    private string $baseUrl;
    private string $index;

    public function __construct()
    {
        $this->baseUrl = 'http://searcher:9200';
        $this->index = 'customers';
    }

    public function createIndex(): bool
    {
        $mapping = [
            'mappings' => [
                'properties' => [
                    'id' => ['type' => 'integer'],
                    'first_name' => [
                        'type' => 'text',
                        'analyzer' => 'standard'
                    ],
                    'last_name' => [
                        'type' => 'text', 
                        'analyzer' => 'standard'
                    ],
                    'email' => [
                        'type' => 'keyword'
                    ],
                    'contact_number' => ['type' => 'keyword'],
                    'created_at' => ['type' => 'date'],
                    'updated_at' => ['type' => 'date']
                ]
            ]
        ];

        $response = Http::put("{$this->baseUrl}/{$this->index}", $mapping);
        return $response->successful();
    }

    public function indexCustomer(array $customer): bool
    {
        $response = Http::put(
            "{$this->baseUrl}/{$this->index}/_doc/{$customer['id']}", 
            $customer
        );
        
        Log::info('Elasticsearch Index Response', ['status' => $response->status()]);
        return $response->successful();
    }

    public function deleteCustomer(int $customerId): bool
    {
        $response = Http::delete("{$this->baseUrl}/{$this->index}/_doc/{$customerId}");
        return $response->successful() || $response->status() === 404;
    }

    public function searchCustomers(string $query): array
    {
        $searchBody = [
            'query' => [
                'multi_match' => [
                    'query' => $query,
                    'fields' => ['first_name', 'last_name', 'email']
                ]
            ]
        ];

        $response = Http::post("{$this->baseUrl}/{$this->index}/_search", $searchBody);
        
        if (!$response->successful()) {
            return [];
        }

        $hits = $response->json()['hits']['hits'] ?? [];
        return array_map(fn($hit) => $hit['_source'], $hits);
    }
}