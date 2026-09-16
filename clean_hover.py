import os
import re

directory = "client/src"
target_pattern = r' hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out'
target_pattern_2 = r'hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out'

count = 0

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".tsx"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            if "hover:-translate-y-1" in content:
                # Replace with empty string
                new_content = re.sub(target_pattern, '', content)
                new_content = re.sub(target_pattern_2, '', new_content)
                
                # Some might just have hover:-translate-y-1 without the exact string
                new_content = re.sub(r'\s*hover:-translate-y-1', '', new_content)
                new_content = re.sub(r'\s*hover:shadow-lg', '', new_content)
                new_content = re.sub(r'\s*transition-all duration-300 ease-out', '', new_content)
                
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                count += 1
                print(f"Cleaned {filepath}")

print(f"Total files cleaned: {count}")
