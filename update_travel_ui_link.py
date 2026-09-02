import re

with open("client/src/pages/travel/TravelListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add to handleSubmit
content = content.replace(
    "advanceRequested: Number(formData.get('advanceRequested')) || 0",
    "advanceRequested: Number(formData.get('advanceRequested')) || 0,\n      billUpload: formData.get('billUpload')"
)

# Add to the modal form
modal_html = """            <Input name="advanceRequested" label="Advance Required (₹)" type="number" step="0.01" />
          </div>"""
new_modal_html = """            <Input name="advanceRequested" label="Advance Required (₹)" type="number" step="0.01" />
          </div>
          <Input name="billUpload" label="Attachment Link (Optional)" placeholder="https://drive.google.com/..." />"""
content = content.replace(modal_html, new_modal_html)

with open("client/src/pages/travel/TravelListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated TravelListPage with billUpload field")
