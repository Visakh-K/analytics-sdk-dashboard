<?php

// tests/Feature/EventIngestionTest.php
use App\Jobs\StoreEventsJob;
use Illuminate\Support\Facades\Queue;

test('it validates incoming event payload and returns 422 if required fields are missing', function () {
    $response = $this->postJson('/api/v1/events', [
        'events' => [
            [
                // Missing event_id and distinct_id
                'event_name' => 'page_view',
                'timestamp' => now()->toIso8601String(),
            ]
        ]
    ]);

    $response->assertStatus(422)
             ->assertJsonStructure([
                 'message',
                 'errors' => ['events.0.event_id', 'events.0.distinct_id']
             ]);
});

test('it accepts valid event batches and dispatches store events job', function () {
    Queue::fake();

    $payload = [
        'events' => [
            [
                'event_id' => '01J8M2K9Q5W4E3R2T1Y6U8I9O0',
                'event_name' => 'menu_item_clicked',
                'distinct_id' => 'anon_test_user_123',
                'timestamp' => now()->toIso8601String(),
                'source' => 'browser',
                'properties' => ['item_name' => 'Margherita Pizza'],
                'context' => ['page_url' => 'http://localhost:5173/']
            ]
        ]
    ];

    $response = $this->postJson('/api/v1/events', $payload);

    $response->assertStatus(202)
             ->assertJson([
                 'status' => 'accepted',
                 'count' => 1
             ]);

    Queue::assertPushed(StoreEventsJob::class, function ($job) {
        return count($job->events) === 1 && $job->events[0]['event_name'] === 'menu_item_clicked';
    });
});