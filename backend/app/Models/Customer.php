<?php

namespace App\Models;

use App\Services\ElasticsearchService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name', 
        'email',
        'contact_number'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::created(function ($customer) {
            $es = new ElasticsearchService();
            $es->indexCustomer($customer->toArray());
        });

        static::updated(function ($customer) {
            $es = new ElasticsearchService();
            $es->indexCustomer($customer->toArray());
        });

        static::deleted(function ($customer) {
            $es = new ElasticsearchService();
            $es->deleteCustomer($customer->id);
        });
    }
}