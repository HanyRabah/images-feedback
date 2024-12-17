# Deployment

This project is configured for deployment on Vercel.

## Prerequisites

1. A Vercel account
2. A PostgreSQL database (e.g., from Vercel Storage)
3. Vercel Blob storage for file uploads

## Environment Variables

Set these in your Vercel project settings:

- `DATABASE_URL`: Your PostgreSQL connection string
- `DIRECT_URL`: Direct URL to PostgreSQL (if using Prisma Data Proxy)
- `NEXTAUTH_URL`: Your deployment URL
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob token

## Deploy

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy!