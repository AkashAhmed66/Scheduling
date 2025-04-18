<?php

namespace App\Http\Controllers;

use App\Models\AuditFile;
use App\Models\AuditFolder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use ZipArchive;

class AuditDocumentsController extends Controller
{
    public function __construct()
    {
        // Ensure the audit-docs directory exists
        if (!Storage::disk('public')->exists('audit-docs')) {
            Storage::disk('public')->makeDirectory('audit-docs');
        }
    }
    
    /**
     * Display the audit documents page
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get root folders
        $rootFolders = AuditFolder::whereNull('parent_id')
            ->with(['children', 'files'])
            ->get();
        
        return Inertia::render('AuditDocs/Index', [
            'rootFolders' => $rootFolders,
            'canManage' => $user->role === 0 || $user->role === 1, // Only roles 0 and 1 can manage
        ]);
    }
    
    /**
     * Get folder contents
     */
    public function getFolderContents(Request $request, $folderId = null)
    {
        $user = Auth::user();
        
        // If no folder ID is provided, return root folders
        if ($folderId === null || $folderId === '') {
            $folders = AuditFolder::whereNull('parent_id')->get();
                
            return response()->json([
                'folder' => null,
                'children' => $folders,
                'files' => [],
                'path' => [],
                'canManage' => $user->role === 0 || $user->role === 1,
            ]);
        }
        
        // Get the current folder
        $folder = AuditFolder::find($folderId);
            
        if (!$folder) {
            return response()->json([
                'error' => 'Folder not found',
                'folder' => null,
                'children' => [],
                'files' => [],
                'path' => [],
                'canManage' => $user->role === 0 || $user->role === 1,
            ], 404);
        }
        
        // Get child folders
        $children = AuditFolder::where('parent_id', $folder->id)->get();
            
        // Get files in the current folder
        $files = AuditFile::where('folder_id', $folder->id)->get();
        
        // Create breadcrumb path
        $path = [];
        $current = $folder;
        
        while ($current) {
            array_unshift($path, [
                'id' => $current->id,
                'name' => $current->name
            ]);
            
            if ($current->parent_id) {
                $current = AuditFolder::find($current->parent_id);
            } else {
                $current = null;
            }
        }
        
        return response()->json([
            'folder' => $folder,
            'children' => $children,
            'files' => $files,
            'path' => $path,
            'canManage' => $user->role === 0 || $user->role === 1,
        ]);
    }
    
    /**
     * Create a new folder
     */
    public function createFolder(Request $request)
    {
        $user = Auth::user();
        
        // Check if user has permission
        if (!($user->role === 0 || $user->role === 1)) {
            return response()->json(['error' => 'You do not have permission to create folders'], 403);
        }
        
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:audit_folders,id'
        ]);
        
        $folder = new AuditFolder();
        $folder->name = $request->name;
        $folder->parent_id = $request->parent_id;
        $folder->user_id = $user->id;
        $folder->save();
        
        return response()->json($folder, 201);
    }
    
    /**
     * Rename a folder
     */
    public function renameFolder(Request $request, $id)
    {
        $user = Auth::user();
        
        // Check if user has permission
        if (!($user->role === 0 || $user->role === 1)) {
            return response()->json(['error' => 'You do not have permission to rename folders'], 403);
        }
        
        $request->validate([
            'name' => 'required|string|max:255'
        ]);
        
        $folder = AuditFolder::findOrFail($id);
        $folder->name = $request->name;
        $folder->save();
        
        return response()->json($folder);
    }
    
    /**
     * Delete a folder
     */
    public function deleteFolder(Request $request, $id)
    {
        $user = Auth::user();
        
        // Check if user has permission
        if (!($user->role === 0 || $user->role === 1)) {
            return response()->json(['error' => 'You do not have permission to delete folders'], 403);
        }
        
        $folder = AuditFolder::findOrFail($id);
        
        // Delete all files in this folder and its subfolders
        $this->deleteFolderRecursive($folder);
        
        return response()->json(['success' => true]);
    }
    
    private function deleteFolderRecursive($folder)
    {
        // Delete all files in this folder
        $files = AuditFile::where('folder_id', $folder->id)->get();
        foreach ($files as $file) {
            Storage::delete($file->file_path);
            $file->delete();
        }
        
        // Delete all subfolders
        $subfolders = AuditFolder::where('parent_id', $folder->id)->get();
        foreach ($subfolders as $subfolder) {
            $this->deleteFolderRecursive($subfolder);
        }
        
        // Delete the folder itself
        $folder->delete();
    }
    
    /**
     * Upload files
     */
    public function uploadFiles(Request $request)
    {
        $user = Auth::user();
        
        // Check if user has permission
        if (!($user->role === 0 || $user->role === 1)) {
            return response()->json(['error' => 'You do not have permission to upload files'], 403);
        }
        
        $request->validate([
            'folder_id' => 'required|exists:audit_folders,id',
            'files' => 'required|array',
            'files.*' => 'file|max:102400' // 100MB max file size
        ]);
        
        $folder = AuditFolder::findOrFail($request->folder_id);
        $uploadedFiles = [];
        
        foreach ($request->file('files') as $file) {
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $fileSize = $file->getSize();
            $mimeType = $file->getMimeType();
            
            // Generate a unique filename
            $filename = Str::uuid() . '.' . $extension;
            
            // Store the file
            $path = $file->storeAs('audit-docs', $filename, 'public');
            
            // Create file record
            $fileRecord = new AuditFile();
            $fileRecord->name = $originalName;
            $fileRecord->original_name = $originalName;
            $fileRecord->file_path = $path;
            $fileRecord->mime_type = $mimeType;
            $fileRecord->size = $fileSize;
            $fileRecord->folder_id = $folder->id;
            $fileRecord->user_id = $user->id;
            $fileRecord->save();
            
            $uploadedFiles[] = $fileRecord;
        }
        
        return response()->json($uploadedFiles, 201);
    }
    
    /**
     * Rename a file
     */
    public function renameFile(Request $request, $id)
    {
        $user = Auth::user();
        
        // Check if user has permission
        if (!($user->role === 0 || $user->role === 1)) {
            return response()->json(['error' => 'You do not have permission to rename files'], 403);
        }
        
        $request->validate([
            'name' => 'required|string|max:255'
        ]);
        
        $file = AuditFile::findOrFail($id);
        $file->name = $request->name;
        $file->save();
        
        return response()->json($file);
    }
    
    /**
     * Delete files
     */
    public function deleteFiles(Request $request)
    {
        $user = Auth::user();
        
        // Check if user has permission
        if (!($user->role === 0 || $user->role === 1)) {
            return response()->json(['error' => 'You do not have permission to delete files'], 403);
        }
        
        $request->validate([
            'file_ids' => 'required|array',
            'file_ids.*' => 'exists:audit_files,id'
        ]);
        
        $fileIds = $request->file_ids;
        
        // Get all files
        $files = AuditFile::whereIn('id', $fileIds)->get();
            
        foreach ($files as $file) {
            // Delete the file from storage
            Storage::disk('public')->delete($file->file_path);
            
            // Delete the file record
            $file->delete();
        }
        
        return response()->json(['success' => true]);
    }
    
    /**
     * Download a file
     */
    public function downloadFile($id)
    {
        $file = AuditFile::findOrFail($id);
        
        // Check if the file exists in storage
        if (!Storage::disk('public')->exists($file->file_path)) {
            abort(404, 'File not found in storage');
        }
        
        return Storage::disk('public')->download($file->file_path, $file->name);
    }
    
    /**
     * Download multiple files as ZIP
     */
    public function downloadFiles(Request $request)
    {
        $request->validate([
            'file_ids' => 'required|array',
            'file_ids.*' => 'exists:audit_files,id'
        ]);
        
        $fileIds = $request->file_ids;
        
        // Get all files
        $files = AuditFile::whereIn('id', $fileIds)->get();
            
        // Prepare files for ZIP
        $validFiles = [];
        
        foreach ($files as $file) {
            if (!Storage::disk('public')->exists($file->file_path)) {
                continue;
            }
            
            $validFiles[] = [
                'path' => $file->file_path,
                'name' => $file->name
            ];
        }
        
        if (empty($validFiles)) {
            abort(404, 'No valid files found');
        }
        
        // Create a ZIP file
        $zipName = 'audit_documents_' . date('Y-m-d') . '.zip';
        $zipPath = storage_path('app/public/temp/' . $zipName);
        
        // Ensure the temp directory exists
        if (!file_exists(storage_path('app/public/temp'))) {
            mkdir(storage_path('app/public/temp'), 0755, true);
        }
        
        $zip = new ZipArchive();
        
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            abort(500, 'Could not create ZIP file');
        }
        
        // Add files to the ZIP
        foreach ($validFiles as $file) {
            $zip->addFile(storage_path('app/public/' . $file['path']), $file['name']);
        }
        
        $zip->close();
        
        // Return the ZIP file
        return response()->download($zipPath, $zipName)->deleteFileAfterSend(true);
    }
    
    /**
     * Download a folder as ZIP
     */
    public function downloadFolder($id)
    {
        $folder = AuditFolder::findOrFail($id);
        
        // Create a ZIP file
        $zipName = $folder->name . '_' . date('Y-m-d') . '.zip';
        $zipPath = storage_path('app/public/temp/' . $zipName);
        
        // Ensure the temp directory exists
        if (!file_exists(storage_path('app/public/temp'))) {
            mkdir(storage_path('app/public/temp'), 0755, true);
        }
        
        $zip = new ZipArchive();
        
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            abort(500, 'Could not create ZIP file');
        }
        
        // Add files to the ZIP, including from subfolders
        $this->addFolderToZip($zip, $folder);
        
        $zip->close();
        
        // Return the ZIP file
        return response()->download($zipPath, $zipName)->deleteFileAfterSend(true);
    }
    
    private function addFolderToZip($zip, $folder, $zipPath = '')
    {
        // Add current folder to zip
        if ($zipPath) {
            $zip->addEmptyDir($zipPath);
        }
        
        // Add all files in the current folder
        $files = AuditFile::where('folder_id', $folder->id)->get();
        foreach ($files as $file) {
            if (Storage::disk('public')->exists($file->file_path)) {
                $zip->addFile(
                    storage_path('app/public/' . $file->file_path), 
                    ($zipPath ? $zipPath . '/' : '') . $file->name
                );
            }
        }
        
        // Add all subfolders recursively
        $subfolders = AuditFolder::where('parent_id', $folder->id)->get();
        foreach ($subfolders as $subfolder) {
            $newZipPath = ($zipPath ? $zipPath . '/' : '') . $subfolder->name;
            $this->addFolderToZip($zip, $subfolder, $newZipPath);
        }
    }
} 