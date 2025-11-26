# Database Connection Fix for Vercel

## The Problem
Everything shows 0 because the database connection isn't working.

## Solution Steps

### 1. Verify Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Make sure these are set:
```
DB_HOST=k1zz.space
DB_USER=u177116765_vendask1zz
DB_PASSWORD=3dicaoCriativa
DB_NAME=u177116765_vendas3d
DB_PORT=3306
```

**Important:** 
- Click "Save" after adding them
- Redeploy your app after adding environment variables (or they won't take effect)

### 2. Enable Remote MySQL in Hostinger

1. Go to Hostinger hPanel
2. Go to **MySQL Databases**
3. Look for **Remote MySQL** or **Remote Access**
4. Enable it
5. Add these IPs (Vercel's IP ranges):
   - `76.76.19.19/32`
   - `76.223.126.88/32`
   - Or use `%` to allow all (less secure, but easier for testing)

### 3. Test the Connection

After setting environment variables and enabling Remote MySQL:

1. Redeploy in Vercel (or wait for auto-redeploy)
2. Check Vercel function logs for connection errors
3. Test API endpoint: `https://your-app.vercel.app/api/summary`

### 4. Common Issues

**Issue: "Access Denied"**
- Solution: Check Remote MySQL is enabled
- Verify username and password are correct

**Issue: "Connection Timeout"**
- Solution: Check DB_HOST is correct (k1zz.space)
- Verify your Hostinger MySQL allows remote connections

**Issue: "Database doesn't exist"**
- Solution: Verify DB_NAME matches exactly

**Issue: Environment variables not working**
- Solution: Make sure you redeployed after adding them
- Check variable names match exactly (case-sensitive)

### 5. Quick Test

Try accessing directly:
```
https://your-app.vercel.app/api/settings
```

If this returns data, database is connected. If it returns defaults or errors, check logs.

## Need Help?

Check Vercel function logs:
- Go to Vercel Dashboard → Deployments
- Click on latest deployment
- Click "Functions" tab
- Check the logs for errors


