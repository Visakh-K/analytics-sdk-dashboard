<?php
// tests/Feature/AnalyticsDashboardTest.php
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Seed test events into the database
    DB::table('events')->insert([
        [
            'event_id' => '01J8M2K9Q5W4E3R2T1Y6U8I9O1',
            'event_name' => 'page_view',
            'distinct_id' => 'user_alpha',
            'source' => 'browser',
            'properties' => json_encode(['path' => '/']),
            'context' => json_encode(['page_url' => 'http://localhost:5173/']),
            'timestamp' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'event_id' => '01J8M2K9Q5W4E3R2T1Y6U8I9O2',
            'event_name' => 'order_created',
            'distinct_id' => 'user_alpha',
            'source' => 'server',
            'properties' => json_encode(['order_id' => 'ORD-100']),
            'context' => json_encode(['page_url' => 'http://localhost:5173/checkout']),
            'timestamp' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]
    ]);
});

test('it returns correct summary analytics metrics', function () {
    $response = $this->getJson('/api/v1/analytics/summary?range=7d');

    $response->assertStatus(200)
        ->assertJson([
            'range' => '7d',
            'total_events' => 2,
            'page_views' => 1,
            'unique_visitors' => 1,
            'total_orders' => 1,
        ]);
});

test('it returns traffic trends grouped by date and event name', function () {
    $response = $this->getJson('/api/v1/analytics/trends?range=7d');

    $response->assertStatus(200)
        ->assertJsonStructure([
            '*' => ['date', 'event_name', 'count']
        ]);
});
