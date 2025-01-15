# **Handling File Uploads with Multer in Express.js**

In many web applications, file uploads are an essential feature, whether it's for profile pictures, documents, or any other kind of file. In Express.js, `multer` is a popular middleware for handling `multipart/form-data`, which is the type of data used for uploading files.

### **Overview of Multer**

Multer is a middleware for handling `multipart/form-data`, which is used for uploading files. It processes the incoming request and saves the uploaded files either to disk or memory, and attaches information about the uploaded files to `req.file` or `req.files`.

---

## **💡 1. Installation and Setup**

First, you need to install `multer` using either `npm` or `yarn`.

### **Installation**

Using `npm`:

```bash
npm install multer
```

Using `yarn`:

```bash
yarn add multer
```

Once installed, you can require it in your application.

```javascript
const multer = require('multer');
```

---

## **💡 2. Basic Usage of Multer**

Multer requires you to specify the storage engine (where to store the files) and configure options like file size limits and accepted file types.

### **Step 1: Setup the Storage Configuration**

You can choose between two types of storage:
- **Disk storage**: Saves files directly to the server’s filesystem.
- **Memory storage**: Saves files to memory (useful for temporary files).

### **Example: Disk Storage**

```javascript
const multer = require('multer');

// Set up storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Rename file to avoid conflicts
  }
});

// Create multer instance with storage config
const upload = multer({ storage: storage });
```

### **Example: Memory Storage**

```javascript
const multer = require('multer');

// Set up storage options for memory
const storage = multer.memoryStorage();

// Create multer instance with storage config
const upload = multer({ storage: storage });
```

In the above examples:
- `destination` specifies where the uploaded files will be stored.
- `filename` allows customization of the filename.

---

## **💡 3. Handling Single File Uploads**

For handling the upload of a single file, use `upload.single()` middleware.

### **Example: Uploading a Single File**

```javascript
app.post('/upload', upload.single('file'), (req, res) => {
  // The uploaded file will be available in req.file
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File uploaded successfully: ${req.file.filename}`);
});
```

In the above example:
- `upload.single('file')`: Handles a single file upload from a form field named `file`.
- `req.file`: Contains information about the uploaded file, such as its path, original name, etc.

---

## **💡 4. Handling Multiple File Uploads**

To handle multiple files, use `upload.array()` middleware for form fields that upload multiple files, or `upload.fields()` for handling multiple file inputs with different names.

### **Example: Uploading Multiple Files**

```javascript
app.post('/upload', upload.array('files', 3), (req, res) => {
  // The uploaded files will be available in req.files
  if (!req.files) {
    return res.status(400).send('No files uploaded.');
  }
  res.send(`Files uploaded successfully: ${req.files.length} files.`);
});
```

In this example:
- `upload.array('files', 3)`: Handles up to 3 files uploaded via a form field named `files`.
- `req.files`: Contains an array of the uploaded files.

### **Example: Uploading Multiple Files with Different Fields**

```javascript
app.post('/upload', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'docs', maxCount: 3 }
]), (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files uploaded.');
  }
  res.send(`Files uploaded successfully!`);
});
```

In this example:
- `upload.fields([{ name: 'image', maxCount: 1 }, { name: 'docs', maxCount: 3 }])`: Handles files uploaded from fields with different names (`image` and `docs`).
- `req.files`: Will be an object where keys are field names (`image` and `docs`), and values are arrays of uploaded files.

---

## **💡 5. File Validation**

You can validate uploaded files based on file type, size, etc., using options in `multer`.

### **File Type Validation**

To restrict the file types that can be uploaded, use the `fileFilter` option in the `multer` configuration.

```javascript
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, or GIF files are allowed.'));
    }
    cb(null, true);
  }
});
```

In this example:
- `fileFilter` checks the file type (`file.mimetype`).
- If the file type is not allowed, an error is passed to `cb(new Error(...))`.

### **File Size Validation**

To limit the size of the uploaded file, use the `limits` option.

```javascript
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit to 10MB
  }
});
```

This will restrict the file size to 10MB. If the file exceeds the limit, Multer will automatically throw a `LIMIT_FILE_SIZE` error.

---

## **💡 6. Error Handling in Multer**

To handle errors that might occur during file uploads, you can use a try-catch block or middleware error handling.

### **Example: Handling Multer Errors**

```javascript
app.post('/upload', upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded.');
    }
    res.send(`File uploaded successfully: ${req.file.filename}`);
  } catch (error) {
    next(error);  // Pass error to error handler
  }
});
```

In this example:
- If an error occurs during file upload (e.g., file size exceeds limit), the error will be caught and passed to the error handler.

---

## **💡 7. Full Example of File Uploads with Multer**

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with a unique name
  }
});

// Create multer instance with storage config
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      return cb(new Error('Only JPEG and PNG files are allowed.'));
    }
    cb(null, true);
  }
});

// Endpoint to upload a single file
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File uploaded successfully: ${req.file.filename}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(500).send(err.message);
  }
  res.status(500).send(err.message); // Handle generic errors
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

---

## **📚 Summary**

1. **Multer** is a middleware for handling file uploads in Express.
2. **Configuration**: You can configure Multer to use either disk storage or memory storage, and set up options like file size limits and file type validation.
3. **Handling Files**: Use `upload.single()` for a single file and `upload.array()` for multiple files.
4. **Validation**: You can filter files based on type and size using the `fileFilter` and `limits` options.
5. **Error Handling**: Multer provides built-in error handling for file upload issues like exceeding file size or invalid file types.

Multer is a robust solution for file uploads in Express.js applications, enabling you to easily manage file handling and processing.