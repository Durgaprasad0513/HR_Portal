import re

with open("client/src/App.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import_str = "import TravelListPage from './pages/travel/TravelListPage';\\nimport OfficeExpensesPage from './pages/expenses/OfficeExpensesPage';"
content = re.sub(r"import TravelListPage from '\./pages/travel/TravelListPage';", import_str, content)

route_str = "<Route path=\"travel\" element={<TravelListPage />} />\\n          <Route path=\"office-expenses\" element={<OfficeExpensesPage />} />"
content = re.sub(r"<Route path=\"travel\" element=\{<TravelListPage />\} />", route_str, content)

with open("client/src/App.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Registered OfficeExpensesPage in App.tsx")
