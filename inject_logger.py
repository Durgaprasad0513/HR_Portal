import re

with open("client/index.html", "r", encoding="utf-8") as f:
    content = f.read()

script = """
    <script>
      window.addEventListener('error', function(e) {
        fetch('/api/log-error', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ message: e.message, stack: e.error ? e.error.stack : '' }) });
      });
      window.addEventListener('unhandledrejection', function(e) {
        fetch('/api/log-error', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ message: e.reason.message, stack: e.reason.stack }) });
      });
    </script>
  </head>
"""

content = content.replace("</head>", script)

with open("client/index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Injected error logger into index.html")
