<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class StoreEventsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public array $events;

    /**
     * Create a new job instance.
     */
    public function __construct(array $events)
    {
        $this->events = $events;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $now = now();

        $rows = collect($this->events)
            ->filter(fn($e) => isset($e['event_id'], $e['event_name'], $e['distinct_id'], $e['timestamp']))
            ->map(fn($e) => [
                'event_id'    => $e['event_id'],
                'event_name'  => $e['event_name'],
                'distinct_id' => $e['distinct_id'],
                'user_id'     => $e['user_id'] ?? null,
                'session_id'  => $e['session_id'] ?? null,
                'source'      => $e['source'] ?? 'browser',
                'properties'  => isset($e['properties']) ? json_encode($e['properties']) : null,
                'context'     => isset($e['context']) ? json_encode($e['context']) : null,
                'timestamp'   => \Carbon\Carbon::parse($e['timestamp'])->toDateTimeString(),
                'created_at'  => $now,
                'updated_at'  => $now,
            ])
            ->values()
            ->all();

        if (! empty($rows)) {
            DB::table('events')->insertOrIgnore($rows);
        }
    }
}
