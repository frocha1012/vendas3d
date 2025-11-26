# Vercel 404 Fix

The 404 error means Vercel can't find your routes. Here's what to check:

## 1. Verify Build Settings in Vercel

In Vercel project settings:

- **Framework Preset**: Other (or leave empty)
- **Build Command**: `cd client && npm run build`
- **Output Directory**: `client/dist`
- **Root Directory**: Leave empty (or `./`)

## 2. Make Sure React App is Built

The `client/dist` folder needs to exist. If it's not in your repo, Vercel needs to build it.

## 3. Update vercel.json

The current `vercel.json` should now handle:
- API routes → `/api/index.js`
- Static files → from `client/dist`
- Fallback → React app

## 4. Redeploy

After making changes:
1. Commit and push to GitHub
2. Vercel will auto-deploy
3. Check deployment logs

## 5. Common Issues

### If API routes work but frontend doesn't:
- Check that `client/dist/index.html` exists
- Verify build completed successfully

### If nothing works:
- Check Vercel deployment logs
- Verify environment variables are set
- Make sure database connection works

## Quick Test

After redeploy, test:
- `https://your-app.vercel.app/api/summary` - Should return JSON
- `https://your-app.vercel.app/` - Should show React app


