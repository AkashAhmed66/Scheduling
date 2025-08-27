<?php

/*
 * PHP Configuration adjustments for robust file uploads
 * Add these settings to your .htaccess file or server configuration
 */

return [
    'php_ini_settings' => [
        // File Upload Settings
        'file_uploads' => 'On',
        'upload_max_filesize' => '50M',
        'post_max_size' => '55M', // Should be larger than upload_max_filesize
        'max_file_uploads' => '20',
        
        // Memory and Execution Settings
        'memory_limit' => '256M',
        'max_execution_time' => '300', // 5 minutes
        'max_input_time' => '300',
        
        // Temporary Directory Settings
        'upload_tmp_dir' => env('UPLOAD_TMP_DIR', sys_get_temp_dir()),
        
        // Error Reporting
        'log_errors' => 'On',
        'error_log' => storage_path('logs/php_errors.log'),
    ],
    
    'htaccess_rules' => [
        // Add these to your .htaccess file
        'php_value upload_max_filesize 50M',
        'php_value post_max_size 55M',
        'php_value max_file_uploads 20',
        'php_value memory_limit 256M',
        'php_value max_execution_time 300',
        'php_value max_input_time 300',
    ],
    
    'nginx_rules' => [
        // Add these to your nginx configuration
        'client_max_body_size 55M;',
        'client_body_timeout 300s;',
        'client_header_timeout 300s;',
        'fastcgi_read_timeout 300s;',
        'proxy_read_timeout 300s;',
    ],
];
