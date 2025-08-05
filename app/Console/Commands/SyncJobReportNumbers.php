<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\AuditJob;
use App\Models\Assessment;
use App\Models\AssessmentInfo;

class SyncJobReportNumbers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:job-report-numbers';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync job report numbers with their corresponding assessment report numbers';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting synchronization of job report numbers with assessment report numbers...');
        
        $syncedCount = 0;
        $skippedCount = 0;
        
        // Get all jobs that have an associated assessment
        $jobs = AuditJob::whereNotNull('assesment')->with('assesmentts.assessmentInfo')->get();
        
        foreach ($jobs as $job) {
            $assessment = $job->assesmentts;
            
            if (!$assessment) {
                $this->warn("Job ID {$job->id} has assesment field set but no assessment found");
                $skippedCount++;
                continue;
            }
            
            // Check if assessment info exists, create if it doesn't
            $assessmentInfo = $assessment->assessmentInfo;
            
            if (!$assessmentInfo) {
                // Create assessment info with job's report number
                $assessmentInfo = new AssessmentInfo();
                $assessmentInfo->assessment_id = $assessment->id;
                $assessmentInfo->report_no = $job->reportNo;
                $assessmentInfo->save();
                
                $this->info("Created assessment info for Assessment ID {$assessment->id} with report number: {$job->reportNo}");
                $syncedCount++;
            } else {
                // Update assessment info if report numbers don't match
                if ($assessmentInfo->report_no !== $job->reportNo) {
                    $oldReportNo = $assessmentInfo->report_no;
                    $assessmentInfo->report_no = $job->reportNo;
                    $assessmentInfo->save();
                    
                    $this->info("Updated assessment report number from '{$oldReportNo}' to '{$job->reportNo}' for Assessment ID {$assessment->id}");
                    $syncedCount++;
                } else {
                    $this->line("Assessment ID {$assessment->id} already has matching report number: {$job->reportNo}");
                    $skippedCount++;
                }
            }
        }
        
        $this->newLine();
        $this->info("Synchronization completed!");
        $this->info("Records synced: {$syncedCount}");
        $this->info("Records skipped (already in sync): {$skippedCount}");
        
        return Command::SUCCESS;
    }
}
