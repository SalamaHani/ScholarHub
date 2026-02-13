/**
 * Document utility functions for downloading and handling files
 */

/**
 * Downloads a file from a URL
 * @param url - The URL of the file to download
 * @param filename - The desired filename for the download
 */
export const downloadFile = async (url: string, filename: string) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();

        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        const objectUrl = window.URL.createObjectURL(blob);

        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
        console.error('Download failed:', error);
        throw new Error('Failed to download file');
    }
};

/**
 * Opens a file in a new tab
 * @param url - The URL of the file to open
 */
export const openFileInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Downloads a file with authorization header
 * @param url - The URL of the file to download
 * @param filename - The desired filename for the download
 * @param token - Authorization token
 */
export const downloadFileWithAuth = async (
    url: string,
    filename: string,
    token?: string
) => {
    try {
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error('Download failed');
        }

        const blob = await response.blob();

        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        const objectUrl = window.URL.createObjectURL(blob);

        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
        console.error('Download with auth failed:', error);
        throw new Error('Failed to download file');
    }
};

/**
 * Gets the file extension from a filename
 * @param filename - The filename to extract extension from
 */
export const getFileExtension = (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Formats file size from bytes to human-readable format
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Checks if a file type is an image
 * @param mimeType - The MIME type of the file
 */
export const isImageFile = (mimeType: string): boolean => {
    return mimeType.startsWith('image/');
};

/**
 * Checks if a file type is a PDF
 * @param mimeType - The MIME type of the file
 */
export const isPdfFile = (mimeType: string): boolean => {
    return mimeType === 'application/pdf';
};

/**
 * Checks if a file type is a document (Word, Excel, etc.)
 * @param mimeType - The MIME type of the file
 */
export const isDocumentFile = (mimeType: string): boolean => {
    const documentTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    return documentTypes.includes(mimeType);
};

/**
 * Validates file size against a maximum size
 * @param fileSize - Size of the file in bytes
 * @param maxSizeMB - Maximum allowed size in MB
 */
export const validateFileSize = (fileSize: number, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return fileSize <= maxSizeBytes;
};

/**
 * Validates file type against allowed types
 * @param mimeType - The MIME type of the file
 * @param allowedTypes - Array of allowed MIME types
 */
export const validateFileType = (mimeType: string, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(mimeType);
};
