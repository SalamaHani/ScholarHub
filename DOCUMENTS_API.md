# Documents API Documentation

This document describes the backend API endpoints required for the document management system.

## Base URL
All endpoints are relative to: `http://localhost:8080/api`

## Authentication
All endpoints except public document listing require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### 1. List Documents
**GET** `/documents`

Get a list of documents with optional filtering.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `search` (optional): Search query for title/description
- `category` (optional): Filter by category
- `isPublic` (optional): Filter by public/private status (true/false)

**Response:**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "uuid",
        "title": "Document Title",
        "description": "Document description",
        "fileName": "file.pdf",
        "fileUrl": "https://storage.example.com/file.pdf",
        "fileSize": 1024000,
        "fileType": "application/pdf",
        "category": "General",
        "isPublic": true,
        "uploadedById": "user-uuid",
        "uploadedBy": {
          "id": "user-uuid",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "downloads": 42,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

### 2. Get Single Document
**GET** `/documents/:id`

Get details of a specific document.

**Response:**
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "uuid",
      "title": "Document Title",
      "description": "Document description",
      "fileName": "file.pdf",
      "fileUrl": "https://storage.example.com/file.pdf",
      "fileSize": 1024000,
      "fileType": "application/pdf",
      "category": "General",
      "isPublic": true,
      "uploadedById": "user-uuid",
      "uploadedBy": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "downloads": 42,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 3. Create Document
**POST** `/documents`

Create a new document entry (Admin only).

**Request Body:**
```json
{
  "title": "Document Title",
  "description": "Document description",
  "fileName": "file.pdf",
  "fileUrl": "https://storage.example.com/file.pdf",
  "fileSize": 1024000,
  "fileType": "application/pdf",
  "category": "General",
  "isPublic": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "uuid",
      "title": "Document Title",
      // ... full document object
    }
  }
}
```

### 4. Update Document
**PUT** `/documents/:id`

Update an existing document (Admin only).

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "Guidelines",
  "isPublic": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "uuid",
      "title": "Updated Title",
      // ... full document object
    }
  }
}
```

### 5. Delete Document
**DELETE** `/documents/:id`

Delete a document (Admin only).

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

### 6. Download Document
**POST** `/documents/:id/download`

Increment the download counter and return the file URL.

**Response:**
```json
{
  "success": true,
  "data": {
    "fileUrl": "https://storage.example.com/file.pdf",
    "fileName": "file.pdf",
    "fileType": "application/pdf"
  }
}
```

### 7. Upload File
**POST** `/documents/upload`

Upload a file to storage (Admin only).

**Request:**
- Content-Type: `multipart/form-data`
- Body: FormData with `file` field

**Response:**
```json
{
  "success": true,
  "data": {
    "fileUrl": "https://storage.example.com/uploads/unique-filename.pdf",
    "fileName": "unique-filename.pdf",
    "fileSize": 1024000,
    "fileType": "application/pdf"
  }
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Database Schema

### Documents Table

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  is_public BOOLEAN DEFAULT true,
  uploaded_by_id UUID NOT NULL REFERENCES users(id),
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_is_public ON documents(is_public);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by_id);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);
```

## File Storage

The backend should implement file storage using one of the following:
1. **Local Storage**: Store files in a local directory (development only)
2. **Cloud Storage**: AWS S3, Google Cloud Storage, Azure Blob Storage
3. **CDN**: Serve files through a CDN for better performance

### File Upload Best Practices:
1. Generate unique filenames (UUID + original extension)
2. Validate file types and sizes
3. Scan for malware (optional but recommended)
4. Store files in organized directory structure (e.g., by year/month)
5. Return publicly accessible URLs

### Recommended File Size Limits:
- Maximum file size: 50MB
- Allowed file types: PDF, DOCX, XLSX, PPTX, images (jpg, png), zip

## Authorization Rules

### Admin Users:
- Can create, update, and delete documents
- Can upload files
- Can see all documents (public and private)

### Regular Users:
- Can view and download public documents only
- Cannot create, update, or delete documents

### Professors:
- Same permissions as regular users (unless you want to give them admin-like permissions)

## Integration Example

Here's how the frontend is already set up to call these endpoints:

```typescript
// Get all documents
const documents = await api.get('/documents', { params: { isPublic: true } });

// Get single document
const document = await api.get('/documents/:id');

// Create document (admin only)
const newDoc = await api.post('/documents', documentData);

// Update document (admin only)
const updated = await api.put('/documents/:id', updateData);

// Delete document (admin only)
await api.delete('/documents/:id');

// Download document
const downloadUrl = await api.post('/documents/:id/download');

// Upload file (admin only)
const formData = new FormData();
formData.append('file', file);
const uploaded = await api.post('/documents/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

## Testing Checklist

- [ ] Admin can upload files
- [ ] Admin can create document entries
- [ ] Admin can edit document details
- [ ] Admin can delete documents
- [ ] Users can view public documents
- [ ] Users can download documents
- [ ] Download counter increments correctly
- [ ] Private documents are hidden from non-admin users
- [ ] File upload validates file types and sizes
- [ ] Search and filtering work correctly
- [ ] Pagination works correctly

## Notes

- The frontend uses axios and interceptors for automatic token management
- All API calls go through the axios instance at `src/lib/axios.ts`
- The base URL is configured via `NEXT_PUBLIC_API_URL` environment variable
- Default base URL: `http://localhost:8080/api`
