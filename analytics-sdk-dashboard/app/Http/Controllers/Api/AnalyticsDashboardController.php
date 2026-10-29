<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsDashboardController extends Controller
{
    public function summary(Request $request)
    {
        // Parse date range parameter (default to 7 days)
        $range = $request->query('range', '7d');
        $startDate = $this->parseRangeToStartDate($range);

        // 1. Total Page Views & Events
        $totalEvents = Event::where('timestamp', '>=', $startDate)
            ->count();

        $pageViews = Event::where('event_name', 'page_view')
            ->where('timestamp', '>=', $startDate)
            ->count();

        // 2. Unique Visitors (count distinct distinct_id)
        $uniqueVisitors = Event::where('timestamp', '>=', $startDate)
            ->distinct('distinct_id')
            ->count('distinct_id');

        // 3. Total Orders Created
        $totalOrders = Event::where('event_name', 'order_created')
            ->where('timestamp', '>=', $startDate)
            ->count();

        return response()->json([
            'range' => $range,
            'total_events' => $totalEvents,
            'page_views' => $pageViews,
            'unique_visitors' => $uniqueVisitors,
            'total_orders' => $totalOrders,
        ]);
    }

    public function trends(Request $request)
    {
        $range = $request->query('range', '7d');
        $startDate = $this->parseRangeToStartDate($range);

        // Group events by date for time-series charts
        $trends = Event::select(
                DB::raw('DATE(timestamp) as date'),
                'event_name',
                DB::raw('COUNT(*) as count')
            )
            ->where('timestamp', '>=', $startDate)
            ->groupBy(DB::raw('DATE(timestamp)'), 'event_name')
            ->orderBy('date', 'ASC')
            ->get();

        return response()->json($trends);
    }

    public function popularPages(Request $request)
    {
        $range = $request->query('range', '7d');
        $startDate = $this->parseRangeToStartDate($range);

        // Extract page URL from context JSON column
        $pages = Event::select(
                DB::raw("JSON_UNQUOTE(JSON_EXTRACT(context, '$.page_url')) as page_url"),
                DB::raw('COUNT(*) as views')
            )
            ->where('event_name', 'page_view')
            ->where('timestamp', '>=', $startDate)
            ->groupBy('page_url')
            ->orderBy('views', 'DESC')
            ->limit(5)
            ->get();

        return response()->json($pages);
    }

    private function parseRangeToStartDate(string $range): Carbon
    {
        return match ($range) {
            '24h' => now()->subDay(),
            '30d' => now()->subDays(30),
            '90d' => now()->days(90),
            default => now()->subDays(7),
        };
    }
}
