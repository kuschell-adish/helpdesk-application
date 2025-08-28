<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ImageUploadService
{
    /**
     * upload a file to supabase storage and generate a public url.
     *
     * @param UploadedFile $file
     * @param string $folder
     * @param string $prefix 
     * @return string
     */
    public function upload(UploadedFile $file, string $folder = 'misc_photos/', string $prefix = 'file_'): string
    {
        $filename = uniqid($prefix, true) . '.' . $file->getClientOriginalExtension();
        $filePath = $folder . $filename;

        Storage::disk('supabase')->put($filePath, file_get_contents($file));

        return 'https://dmbeikhtauozgutzeycd.supabase.co/storage/v1/object/public/uploads/' . $filePath;
    }

    public function delete(string $publicUrl): bool
    {
        $parsedUrlPath = parse_url($publicUrl, PHP_URL_PATH);
        $filePath = ltrim(str_replace('/storage/v1/object/public/uploads/', '', $parsedUrlPath), '/');

        if ($filePath) {
            if (Storage::disk('supabase')->delete($filePath)) {
                return true;
            } 
            else 
            {
                return false;
            }
        }
        
        return false;
    }


    

}
