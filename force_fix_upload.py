import re

with open("server/src/modules/upload/upload.routes.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the handler
old_handler = r"router\.post\('/', upload\.array\('files', 10\), \(req, res\) => \{[\s\S]*?\}\);"
new_handler = """router.post('/', upload.array('files', 10), (req, res) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  const files = req.files as Express.Multer.File[];
  const urls = files.map(f => /api/uploads/);
  res.json({ success: true, urls });
});"""

content = re.sub(old_handler, new_handler, content)

with open("server/src/modules/upload/upload.routes.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed upload.routes.ts logic")
