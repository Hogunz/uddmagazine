import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface ImageUploadProps {
    value?: File | string | null;
    onChange: (file: File | null) => void;
    label?: string;
    error?: string;
    className?: string;
}

interface MultiImageUploadProps {
    values?: (File | string)[];
    onChange: (files: (File | string)[]) => void;
    label?: string;
    error?: string;
    className?: string;
}

export function ImageUpload({ value, onChange, label = "Image", error, className = "" }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (typeof value === 'string') {
            console.log('ImageUpload Preview (string):', value);
            setPreview(value);
        } else if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            console.log('ImageUpload Preview (blob):', objectUrl);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            console.log('ImageUpload Preview (null)');
            setPreview(null);
        }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
        }
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="flex items-start gap-4">
                {preview ? (
                    <div className="relative aspect-video w-40 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="h-24 w-40 rounded-lg border-2 border-dashed border-gray-300 dark:border-zinc-700 flex flex-col items-center justify-center text-muted-foreground bg-gray-50 dark:bg-zinc-900/50">
                        <ImageIcon className="w-8 h-8 opacity-50 mb-1" />
                        <span className="text-xs">No image</span>
                    </div>
                )}

                <div className="flex-1">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                    />
                    <label
                        htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Select Image
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">
                        Supported formats: JPG, PNG, WEBP. Max size: 2MB.
                    </p>
                    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                </div>
            </div>
        </div>
    );
}

export function MultiImageUpload({ values = [], onChange, label = "Gallery Images", error, className = "", uploadUrl }: MultiImageUploadProps & { uploadUrl?: string }) {
    const [uploadingFiles, setUploadingFiles] = useState<{ id: string; file: File; progress: number }[]>([]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            if (uploadUrl) {
                // Async upload mode
                const newUploadingFiles = selectedFiles.map(file => ({
                    id: Math.random().toString(36).substr(2, 9),
                    file,
                    progress: 0
                }));

                setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

                // Clear input
                e.target.value = '';

                // Parallel upload approach


                const uploadPromises = newUploadingFiles.map(async (item) => {
                    const formData = new FormData();
                    formData.append('file', item.file);

                    try {
                        const xsrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];
                        const response = await fetch(uploadUrl, {
                            method: 'POST',
                            headers: {
                                'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
                                'Accept': 'application/json',
                            },
                            body: formData
                        });
                        if (response.ok) {
                            const data = await response.json();
                            // Update progress
                            setUploadingFiles(prev => prev.filter(p => p.id !== item.id));
                            return data.url;
                        }
                    } catch (e) {
                        console.error(e);
                    }
                    setUploadingFiles(prev => prev.filter(p => p.id !== item.id)); // Remove on fail too
                    return null;
                });

                const results = await Promise.all(uploadPromises);
                const successfulUrls = results.filter(url => url !== null) as string[];

                onChange([...values, ...successfulUrls]);

            } else {
                // Legacy local behavior
                const newFiles = Array.from(e.target.files);
                onChange([...values, ...newFiles]);
                e.target.value = '';
            }
        }
    };

    const removeFile = (index: number) => {
        const newValues = [...values];
        newValues.splice(index, 1);
        onChange(newValues);
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium mb-1">{label}</label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {values.map((item, index) => {
                    let previewUrl = '';
                    if (typeof item === 'string') {
                        previewUrl = item;
                    } else if (item instanceof File) {
                        previewUrl = URL.createObjectURL(item);
                    }

                    return (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 group">
                            <img src={previewUrl} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    );
                })}

                {/* Uploading Files Placeholders */}
                {uploadingFiles.map((item) => (
                    <div key={item.id} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 bg-gray-50 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="text-xs text-muted-foreground">Uploading...</span>
                        </div>
                    </div>
                ))}

                <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-zinc-700 flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Add images"
                    />
                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Add Images</span>
                </div>
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
}
