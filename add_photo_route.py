import re

with open("server/src/modules/assets/asset.routes.ts", "r", encoding="utf-8") as f:
    content = f.read()

if "import multer from 'multer';" not in content:
    content = content.replace("import { createAssetSchema", "import multer from 'multer';\nimport { createAssetSchema")

if "const upload =" not in content:
    content = content.replace("const router = Router();", "const upload = multer({ dest: 'uploads/' });\n\nconst router = Router();")

upload_route = """router.post('/upload-photo', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  return res.json({ success: true, data: { photoUrl: /uploads/ } });
});

router.post('/',"""
content = content.replace("router.post('/',", upload_route)

with open("server/src/modules/assets/asset.routes.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Added upload-photo route to asset.routes.ts")
