<?php

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Route;
use App\Models\Job;


Route::get('/', function () {
    return view('home');
});

Route::get('/jobs', function ()  {
    return view('jobs', [
        'jobs' => Job::all()
    ]);
});

Route::get('/jobs/{id}', function ($id) {
    $job = Arr::first(Job::all(), fn($job) => $job['id'] == $id);
    return view('job',['job' => $job]);
});


Route::get('/contact', function () {
    return view('contact');
});
