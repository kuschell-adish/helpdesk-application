<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Priority extends Model
{
    use HasFactory;

    public static function getCachedList() {
        return Cache::remember('priorities_list', 3600, function () {
            return self::select('id', 'category')->orderBy('category')->get();
        });
    }
}
