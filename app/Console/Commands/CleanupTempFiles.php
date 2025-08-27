<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\FileUploadService;

class CleanupTempFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'files:cleanup-temp {--hours=24 : Files older than this many hours will be deleted}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up temporary upload files older than specified hours';

    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        parent::__construct();
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $hours = $this->option('hours');
        
        $this->info("Cleaning up temporary files older than {$hours} hours...");
        
        $deletedCount = $this->fileUploadService->cleanupTempFiles($hours);
        
        $this->info("Successfully cleaned up {$deletedCount} temporary files.");
        
        return Command::SUCCESS;
    }
}
