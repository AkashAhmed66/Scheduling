<?php

namespace App\Http\Controllers;

use App\Models\AssessmentInfo;
use App\Http\Requests\StoreAssessmentInfoRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class AssessmentInfoController extends Controller
{
    /**
     * Store or update assessment information.
     */
    public function store(StoreAssessmentInfoRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            
            // Handle file upload
            if ($request->hasFile('facility_image')) {
                $imagePath = $request->file('facility_image')->store('assessment_images', 'public');
                $data['facility_image_path'] = $imagePath;
            }
            
            // Remove the file from data as we've processed it
            unset($data['facility_image']);
            
            // Create or update assessment info
            $assessmentInfo = AssessmentInfo::updateOrCreate(
                ['assessment_id' => $data['assessment_id']],
                $data
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Assessment information saved successfully.',
                'data' => $assessmentInfo
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save assessment information.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get assessment information by assessment ID.
     */
    public function show($assessmentId): JsonResponse
    {
        try {
            $assessmentInfo = AssessmentInfo::where('assessment_id', $assessmentId)->first();
            
            if (!$assessmentInfo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Assessment information not found.',
                    'data' => null
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Assessment information retrieved successfully.',
                'data' => $assessmentInfo
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve assessment information.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update assessment information.
     */
    public function update(StoreAssessmentInfoRequest $request, $assessmentId): JsonResponse
    {
        try {
            $assessmentInfo = AssessmentInfo::where('assessment_id', $assessmentId)->first();
            
            if (!$assessmentInfo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Assessment information not found.'
                ], 404);
            }
            
            $data = $request->validated();
            
            // Handle file upload
            if ($request->hasFile('facility_image')) {
                // Delete old image if exists
                if ($assessmentInfo->facility_image_path) {
                    Storage::disk('public')->delete($assessmentInfo->facility_image_path);
                }
                
                $imagePath = $request->file('facility_image')->store('assessment_images', 'public');
                $data['facility_image_path'] = $imagePath;
            }
            
            // Remove the file from data as we've processed it
            unset($data['facility_image']);
            
            $assessmentInfo->update($data);
            
            return response()->json([
                'success' => true,
                'message' => 'Assessment information updated successfully.',
                'data' => $assessmentInfo->fresh()
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update assessment information.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Delete assessment information.
     */
    public function destroy($assessmentId): JsonResponse
    {
        try {
            $assessmentInfo = AssessmentInfo::where('assessment_id', $assessmentId)->first();
            
            if (!$assessmentInfo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Assessment information not found.'
                ], 404);
            }
            
            // Delete associated image
            if ($assessmentInfo->facility_image_path) {
                Storage::disk('public')->delete($assessmentInfo->facility_image_path);
            }
            
            $assessmentInfo->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Assessment information deleted successfully.'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete assessment information.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
