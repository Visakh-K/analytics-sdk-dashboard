<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'event_id',
        'event_name',
        'distinct_id',
        'user_id',
        'session_id',
        'source',
        'properties',
        'context',
        'timestamp',
    ];

    
    protected function casts()
    {
        return [
            'properties' => 'array',
            'context' => 'array',
            'timestamp' => 'datetime:Y-m-d H:i:s.v',
        ];
    }
}
