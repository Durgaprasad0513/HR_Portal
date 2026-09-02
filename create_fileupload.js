const code = import React, { useState } from 'react';
import apiClient from '@/api/client';
import { UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  name: string;
  label: string;
  required?: boolean;
}

export function FileUpload({ name, label, required }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFileUrl(res.data.url);
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Hidden input to pass the URL to the form submission */}
      <input type="hidden" name={name} value={fileUrl} />

      <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center cursor-pointer">
        <input 
          type="file" 
          onChange={handleUpload} 
          disabled={uploading}
          required={required && !fileUrl}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*,.pdf"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center text-indigo-500">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            <span className="text-sm">Uploading...</span>
          </div>
        ) : fileUrl ? (
          <div className="flex flex-col items-center text-green-500">
            <CheckCircle2 className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Uploaded Successfully</span>
            <a href={'http://localhost:5000' + fileUrl} target="_blank" className="text-xs text-indigo-500 underline mt-1 z-10 relative pointer-events-auto" onClick={e => e.stopPropagation()}>View File</a>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <UploadCloud className="w-6 h-6 mb-2" />
            <span className="text-sm">Click to upload image/pdf</span>
          </div>
        )}
      </div>
    </div>
  );
}
;
require('fs').writeFileSync('client/src/components/ui/FileUpload.tsx', code);
console.log("Created FileUpload.tsx");
