<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Department extends Model
{
    use HasFactory;

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public static function getCachedList() {
        return Cache::remember('departments_list', 3600, function () {
            return self::select('id', 'category')->orderBy('category')->get();
        });
    }
}
