"use client";

import { IKUpload } from "imagekitio-react";
import { useState } from "react";

export type IKUploadResponse = {
    filePath: string;
    url: string;
    fileId: string;
    name: string;
};

export default function FileUpload({onSuccess}: {onSuccess: (response: IKUploadResponse) => void}) {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onError = (err: {message: string}) => {
        setError(err.message);
        setUploading(false);
    }

    const handleSuccess = (response: IKUploadResponse) => {
        setUploading(false);
        setError(null);
        onSuccess(response);
    }

    const handleStartUpload = () => {
        setUploading(true);
        setError(null);
    }

    return (
        <div className="space-y-2">
            <IKUpload
                fileName="product-image.jpg"
                onError={onError}
                onSuccess={handleSuccess}
                onUploadStart={handleStartUpload}
                validateFile={(file: File) => {
                    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"]; 

                    if(!validTypes.includes(file.type)) {
                        setError("Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.");
                        return false;
                    }

                    if(file.size > 5 * 1024 * 1024) { // 5MB limit
                        setError("File size exceeds 5MB. Please upload a smaller image.");
                        return false;
                    }
                    return true;
                }}
            />

            {uploading && (
                <p className='text-sm text-gray-500'>Uploading...</p>
            )}

            {error && (
                <p className='text-sm text-red-500'>{error}</p>
            )}
        </div>
    );
}
