import re

with open("client/src/api/assets.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r",\s*uploadPhoto:\s*async\s*\(formData:\s*FormData\)\s*=>\s*\{\s*const\s*\{\s*data\s*\}\s*=\s*await\s*apiClient\.post<ApiResponse<any>>\('/assets/upload-photo',\s*formData,\s*\{\s*headers:\s*\{\s*'Content-Type':\s*'multipart/form-data'\s*\}\s*\}\);\s*return\s*data;\s*\}", "", content)

with open("client/src/api/assets.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Removed uploadPhoto from assets.ts")
