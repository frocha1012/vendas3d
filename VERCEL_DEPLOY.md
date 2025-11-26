# Deploy to Vercel

## Step 1: Build the React App

```bash
npm run build
```

## Step 2: Push to GitHub

1. Initialize git (if not already):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a GitHub repo and push:
```bash
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build` (or leave empty if already built)
   - **Output Directory**: `client/dist`

## Step 4: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
DB_HOST=k1zz.space
DB_USER=u177116765_vendask1zz
DB_PASSWORD=3dicaoCriativa
DB_NAME=u177116765_vendas3d
DB_PORT=3306
```

**Important:** Use your Hostinger MySQL hostname (k1zz.space) not localhost!

## Step 5: Deploy

Click "Deploy" and wait for it to finish.

## Step 6: Update Database Access

Since you're connecting from Vercel (external), you need to:

1. Go to Hostinger hPanel → MySQL Databases
2. Enable "Remote MySQL" access
3. Add Vercel's IP addresses (or use % for all - less secure)
4. Or contact Hostinger support to whitelist Vercel

## Step 7: Test

Visit your Vercel URL and test the app!

## Troubleshooting

### Database Connection Errors
- Verify Remote MySQL is enabled in Hostinger
- Check environment variables are set correctly
- Verify database credentials

### Build Errors
- Make sure `npm run build` works locally first
- Check Vercel build logs

### API Routes Not Working
- Verify `vercel.json` is correct
- Check that `api/index.js` exists

