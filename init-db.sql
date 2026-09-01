-- Initialize pgvector extension and schemas automatically on container startup
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS "Documents" (
    "Id" SERIAL PRIMARY KEY,
    "FileName" VARCHAR(255) NOT NULL,
    "UploadedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "DocumentChunks" (
    "Id" SERIAL PRIMARY KEY,
    "DocumentId" INT REFERENCES "Documents"("Id") ON DELETE CASCADE,
    "TextContent" TEXT NOT NULL,
    "Embedding" vector(1536)
);
