<?php

use App\Http\Controllers\Api\AnalyticsDashboardController;
use App\Http\Controllers\Api\EventIngestionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/events', [EventIngestionController::class, 'store']);

// Dashboard analytics endpoints
Route::prefix('analytics')->group(function () {
    Route::get('/summary', [AnalyticsDashboardController::class, 'summary']);
    Route::get('/trends', [AnalyticsDashboardController::class, 'trends']);
    Route::get('/popular-pages', [AnalyticsDashboardController::class, 'popularPages']);
});
