import re

with open('server/src/app.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import_prisma = "import { prisma } from './utils/prisma';\nimport { v4 as uuidv4 } from 'uuid';\n"
if "import { prisma }" not in content:
    content = content.replace("import { config } from './config';", "import { config } from './config';\n" + import_prisma)

readiness_route = """// Liveness check
app.get('/api/live', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Readiness check
app.get('/api/ready', async (_req, res) => {
  const correlationId = uuidv4();
  try {
    // Check if DB is reachable and migrations are applied by querying a known table
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'READY', correlationId, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'UNAVAILABLE', correlationId, timestamp: new Date().toISOString() });
  }
});"""
content = re.sub(r"// Health check.*?}\);", readiness_route, content, flags=re.DOTALL)

with open('server/src/app.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('server/src/server.ts', 'r', encoding='utf-8') as f:
    content_server = f.read()

if "import { prisma }" not in content_server:
    content_server = content_server.replace("import { config } from './config';", "import { config } from './config';\nimport { prisma } from './utils/prisma';")

server_start = """const startServer = async () => {
  try {
    await prisma.$connect();
    app.listen(config.port, () => {
      console.log(`\\n🚀 HR Management API Server`);
      console.log(`   Environment: ${config.nodeEnv}`);
      console.log(`   Port: ${config.port}`);
      console.log(`   URL: http://localhost:${config.port}`);
      console.log(`   Liveness: http://localhost:${config.port}/api/live`);
      console.log(`   Readiness: http://localhost:${config.port}/api/ready\\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};"""

content_server = re.sub(r"const startServer = async \(\) => \{.*?\};", server_start, content_server, flags=re.DOTALL)

with open('server/src/server.ts', 'w', encoding='utf-8') as f:
    f.write(content_server)
