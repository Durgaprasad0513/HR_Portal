import re

with open("client/src/api/assets.ts", "r", encoding="utf-8") as f:
    content = f.read()

if "uploadPhoto:" not in content:
    old_code = """  returnAsset: async (id: string, payload: any) => {
    const { data } = await apiClient.put<ApiResponse<any>>(/assets//return, payload);
    return data;
  }"""
    
    new_code = """  returnAsset: async (id: string, payload: any) => {
    const { data } = await apiClient.put<ApiResponse<any>>(/assets//return, payload);
    return data;
  },
  uploadPhoto: async (formData: FormData) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/assets/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }"""
    content = content.replace(old_code, new_code)
    with open("client/src/api/assets.ts", "w", encoding="utf-8") as f:
        f.write(content)
print("Updated assetsApi with uploadPhoto")
