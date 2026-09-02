import re

path = "server/src/app.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add a middleware that generates a correlationId for every request
correlation_mw = """
// Generate Correlation ID
app.use((req, res, next) => {
  req.headers['x-correlation-id'] = req.headers['x-correlation-id'] || uuidv4();
  next();
});

// Middleware"""
content = content.replace("// Middleware", correlation_mw)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

path = "server/src/middleware/error.middleware.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Modify error handler to include correlationId
new_error_handler = """import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const correlationId = req.headers['x-correlation-id'];
  console.error(`[${correlationId}] Error:`, err);

  res.status(500).json({
    status: 'ERROR',
    message: 'Internal server error',
    correlationId,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};"""
content = new_error_handler

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# Update the response.ts to include correlationId if we want, but usually error handler is enough.
# Let's also update sendError in utils/response.ts to include correlationId
path = "server/src/utils/response.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

response_replace = """export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors: any = null
): void => {
  const correlationId = res.req?.headers['x-correlation-id'];
  if (statusCode >= 500) {
    console.error(`[${correlationId}] ${message}`, errors);
  }
  res.status(statusCode).json({
    status: 'error',
    message,
    errors,
    correlationId,
  });
};"""

content = re.sub(r"export const sendError = \([\s\S]*?\}\);\n\};", response_replace, content)
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
