<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\AttemptAutoSubmitService;

class SubmitExpiredAttempts extends Command
{
    protected $signature = 'attempts:auto-submit';
    protected $description = 'Auto submit all expired attempts (including old ones)';

    protected $service;

    public function __construct(AttemptAutoSubmitService $service)
    {
        parent::__construct();
        $this->service = $service;
    }

    public function handle()
    {
        $count = $this->service->handle();

        $this->info("Submitted {$count} attempts.");
        \Log::info("CRON: Submitted {$count} attempts at " . now());
    }
}
