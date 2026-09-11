with open("client/src/pages/dashboard/DashboardPage.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
for i, line in enumerate(lines[90:130]):
    print(f"{i+91}: {line}", end="")
