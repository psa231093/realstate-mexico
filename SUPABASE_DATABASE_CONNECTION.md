# How to Check Supabase Database Connection

## Quick Steps to Verify Your Database Connection

### 1. Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (project reference: `cwlhpnwuagfumwhxlphx`)

### 2. Get Your Database Connection String

#### Option A: Direct Connection String (for Prisma)

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string** section
3. Select **URI** tab
4. Copy the connection string - it should look like:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   OR
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

#### Option B: Connection Pooling (Recommended for Production)

1. In **Settings** → **Database** → **Connection string**
2. Select **Session mode** or **Transaction mode** (for connection pooling)
3. Use the **pooler** connection string (port 6543) for better performance

### 3. Verify Connection Details

Your connection string should match this format:
```
postgresql://postgres:[YOUR-PASSWORD]@db.cwlhpnwuagfumwhxlphx.supabase.co:5432/postgres
```

**Key components:**
- **Host:** `db.cwlhpnwuagfumwhxlphx.supabase.co`
- **Port:** `5432` (direct) or `6543` (pooler)
- **Database:** `postgres`
- **User:** `postgres`
- **Password:** Your database password (found in Settings → Database → Database password)

### 4. Check Database Status

1. Go to **Settings** → **Database**
2. Check **Database status** - should show "Active"
3. Verify **Database version** is displayed
4. Check **Connection info** shows the correct host and port

### 5. Test Connection Locally

#### Using Prisma Studio:
```bash
npx prisma studio
```

#### Using Prisma Migrate:
```bash
npx prisma migrate dev
```

#### Test connection directly:
```bash
npx prisma db pull
```

### 6. Common Issues & Solutions

#### Issue: "Database server is not running"
**Solution:**
- Verify your project is not paused in Supabase dashboard
- Check if you're using the correct project reference
- Ensure your `.env` file has the correct `DATABASE_URL`

#### Issue: "Connection refused"
**Possible causes:**
- Wrong port (should be 5432 for direct, 6543 for pooler)
- Incorrect hostname
- IP restrictions (check Settings → Database → Connection pooling → Allowed IPs)

#### Issue: "Authentication failed"
**Solution:**
- Reset your database password in Settings → Database
- Update `DATABASE_URL` in your `.env` file with the new password
- Make sure password is URL-encoded if it contains special characters

### 7. Update Your `.env` File

Make sure your `.env` file contains:

```env
# Direct connection (port 5432)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.cwlhpnwuagfumwhxlphx.supabase.co:5432/postgres"

# OR Connection pooling (port 6543) - Recommended
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Important:** Replace `[YOUR-PASSWORD]` with your actual database password.

### 8. Verify Connection String Format

The connection string format is:
```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

For your specific case:
- **USER:** `postgres`
- **PASSWORD:** Your database password
- **HOST:** `db.cwlhpnwuagfumwhxlphx.supabase.co`
- **PORT:** `5432` (direct) or `6543` (pooler)
- **DATABASE:** `postgres`

### 9. Check Project Status

1. Go to your project dashboard
2. Check if the project shows as **Active** (not paused)
3. If paused, click **Resume** to reactivate

### 10. Network & Security

1. Go to **Settings** → **Database** → **Connection pooling**
2. Check **Allowed IPs** - make sure your IP is allowed (or set to allow all)
3. For local development, you may need to allow your IP address

## Quick Verification Checklist

- [ ] Project is active in Supabase dashboard
- [ ] Database password is correct
- [ ] Connection string format is correct
- [ ] `.env` file has `DATABASE_URL` set
- [ ] Host matches: `db.cwlhpnwuagfumwhxlphx.supabase.co`
- [ ] Port is correct: `5432` (direct) or `6543` (pooler)
- [ ] No IP restrictions blocking your connection
- [ ] Password is URL-encoded if it contains special characters

## Testing the Connection

After updating your `.env` file, test the connection:

```bash
# Generate Prisma Client
npx prisma generate

# Test connection
npx prisma db pull

# Or open Prisma Studio
npx prisma studio
```

If these commands work, your connection is properly configured!
