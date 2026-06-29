# Security Guide

## Overview
This document outlines the security measures implemented in the application and provides guidelines for maintaining a secure deployment.

## Implemented Security Measures

### 1. API Security
- **Rate Limiting**: 10 requests per minute per IP address on `/api/scrape-product`
- **Input Validation**: All user inputs are sanitized and validated
- **SSRF Protection**: Blocks requests to localhost, private IPs, and internal networks
- **Request Timeout**: 10-second timeout on external fetch requests
- **Error Handling**: Generic error messages to prevent information leakage

### 2. Security Headers
The following HTTP security headers are configured:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-XSS-Protection: 1; mode=block` - Enables XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts access to sensitive APIs

### 3. Environment Variable Validation
- Validates Supabase URLs to ensure they're from official domains
- Warns about partial or invalid configurations
- Prevents misconfiguration attacks

### 4. Supabase Security
- `detectSessionInUrl: false` - Prevents URL-based session hijacking
- Session persistence with automatic token refresh
- Anon key only (no service keys exposed to client)

## Required Supabase RLS Policies

### Enable RLS
```sql
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;
```

### User Isolation Policy
```sql
-- Users can only see their own items
CREATE POLICY "Users can view own clothing items"
ON clothing_items FOR SELECT
USING (auth.uid()::text = user_id);

-- Users can only insert their own items
CREATE POLICY "Users can insert own clothing items"
ON clothing_items FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Users can only update their own items
CREATE POLICY "Users can update own clothing items"
ON clothing_items FOR UPDATE
USING (auth.uid()::text = user_id);

-- Users can only delete their own items
CREATE POLICY "Users can delete own clothing items"
ON clothing_items FOR DELETE
USING (auth.uid()::text = user_id);
```

### Storage Policies (if using Supabase Storage)
```sql
-- Users can only upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'clothing-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can only view their own images
CREATE POLICY "Users can view own images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'clothing-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Environment Variables

### Required for Production
```env
VITE_SUPABASE_URL=your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Security Best Practices
1. Never commit `.env` files to version control
2. Use Supabase anon key (never service key) in client-side code
3. Rotate keys regularly
4. Monitor Supabase logs for suspicious activity
5. Enable 2FA on Supabase account

## Deployment Checklist

### Before Deploying to Production
- [ ] Enable RLS policies in Supabase
- [ ] Set up environment variables in Vercel
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and alerts
- [ ] Test rate limiting
- [ ] Test input validation
- [ ] Review error logs

### Vercel Configuration
- Security headers are configured in `vercel.json`
- Node.js version locked to 20.x
- Build output directory: `dist`

## Ongoing Security Maintenance

### Regular Tasks
1. Update dependencies monthly: `npm audit fix`
2. Review and rotate API keys quarterly
3. Monitor Vercel and Supabase logs
4. Test security controls after major updates
5. Review and update this document

### Incident Response
If a security incident is suspected:
1. Rotate all API keys immediately
2. Review logs for unauthorized access
3. Notify affected users if data was exposed
4. Document the incident and response
5. Implement additional safeguards

## Additional Recommendations

1. **Add Authentication**: Implement user authentication with Supabase Auth
2. **Add Logging**: Set up structured logging for security events
3. **Add Monitoring**: Use tools like Sentry for error tracking
4. **Add Testing**: Implement security testing in CI/CD
5. **Add Backup**: Regular database backups

## Contact
For security concerns or vulnerabilities, please contact the project maintainers.
