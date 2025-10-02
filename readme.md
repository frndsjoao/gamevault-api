1. Create a .env file with your Neon database URL:
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
2. Push schema to database:
npm run db:push
3. Run locally:
npm run dev
4. Deploy to AWS:
npm run deploy

