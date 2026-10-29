<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EventStoreRequest;
use App\Jobs\StoreEventsJob;
use Illuminate\Http\Request;

class EventIngestionController extends Controller
{
    public function store(EventStoreRequest $request)
    {
        $payloads = $request->all();
        
        // Dispatch background job to process database inserts asynchronously
        StoreEventsJob::dispatch($request->input('events', []));

        return response()->json([
            'status' => 'accepted',
            'count' => count($payloads),
        ], 202);
    }
}
