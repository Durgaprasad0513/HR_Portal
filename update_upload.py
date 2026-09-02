import re

with open("server/src/modules/upload/upload.routes.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Change upload.single to upload.array
content = content.replace("upload.single('file')", "upload.array('files', 10)")

# Change req.file to req.files
req_file_logic = """  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = /api/uploads/;
  res.json({ success: true, url: fileUrl });"""

req_files_logic = """  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  const files = req.files as Express.Multer.File[];
  const urls = files.map(f => /api/uploads/);
  res.json({ success: true, urls });"""

content = content.replace(req_file_logic, req_files_logic)

with open("server/src/modules/upload/upload.routes.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated upload.routes.ts for multiple files")
