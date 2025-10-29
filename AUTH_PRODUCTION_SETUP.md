# Production Authentication (better-auth) Kurulumu

## Sorun
- ✅ Localhost'ta auth çalışıyor
- ❌ Production (Vercel/live site) auth çalışmıyor

**Temel sebepler:**
1. NEXT_PUBLIC_APP_URL env variable'ı ayarlanmamış
2. trustHost konfigürasyonu eksik
3. BETTER_AUTH_SECRET ayarlanmamış
4. CORS/credential headers eksik

---

## Çözüm - Environment Variables

### `.env.local` (Local Development)
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blog"

# Auth Configuration
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-local-dev-secret-key-min-32-chars-long"

# Google OAuth
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

# Apple OAuth (optional)
APPLE_CLIENT_ID="YOUR_APPLE_CLIENT_ID"
APPLE_CLIENT_SECRET="YOUR_APPLE_CLIENT_SECRET"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NODE_ENV="development"
```

### Vercel Production `.env`
```bash
# Database (Production)
DATABASE_URL="postgresql://user:password@prod-db.provider.com:5432/blog"

# Auth Configuration - CRITICAL!
BETTER_AUTH_URL="https://your-domain.com"
BETTER_AUTH_SECRET="your-production-secret-key-min-32-chars-long-random"

# Google OAuth
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

# Apple OAuth (optional)
APPLE_CLIENT_ID="YOUR_APPLE_CLIENT_ID"
APPLE_CLIENT_SECRET="YOUR_APPLE_CLIENT_SECRET"

# App Configuration
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
NODE_ENV="production"
```

---

## Önemli: Google OAuth Callback URL Güncelle

### Google Cloud Console
1. Proje açın: [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials**
3. OAuth 2.0 Client ID'nizi seçin
4. **Authorized redirect URIs** kısmına ekleyin:

```
Local Development:
- http://localhost:3000/api/auth/callback/google
- http://localhost:3000/api/auth/google

Production:
- https://your-domain.com/api/auth/callback/google
- https://your-domain.com/api/auth/google
```

5. **SAVE** butonuna basın

---

## better-auth Konfigürasyonu

### `lib/auth.ts` Güncellemesi
```typescript
export const auth = betterAuth({
    database: prismaAdapter(prismadb, {
        provider: "postgresql",
    }),
    
    // ✅ CRITICAL: Production'da doğru URL
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    basePath: "/api/auth",
    trustHost: true,  // Proxy arkasındaki host'u güven
    
    // ✅ CRITICAL: Secret key
    secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "your-secret-key",
    
    emailAndPassword: { enabled: true },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
    },
});
```

### `lib/auth-client.ts` Güncellemesi
```typescript
export const authClient = createAuthClient({
    // ✅ CRITICAL: Client-side base URL
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 
             (typeof window !== 'undefined' ? window.location.origin : "http://localhost:3000"),
    basePath: "/api/auth",
    plugins: [adminClient()]
})
```

### `next.config.ts` Headers
```typescript
// ✅ CRITICAL: Auth API CORS headers
{ 
    source: '/api/auth/(.*)', 
    headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, Cookie' },
        { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
    ] 
}
```

---

## Vercel Deployment Adımları

### 1. Environment Variables Ayarla
```bash
1. Vercel Dashboard → Project Settings
2. Environment Variables kısmına git
3. Aşağıdaki değişkenleri ekle:

BETTER_AUTH_URL=https://your-domain.com
BETTER_AUTH_SECRET=your-random-secret-key-here (min 32 chars)
DATABASE_URL=production-database-url
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2. BETTER_AUTH_SECRET Oluştur
```bash
# Terminal'de çalıştır:
openssl rand -base64 32

# Veya node.js ile:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Database URL'sini Kontrol Et
```bash
# Production database'e bağlantısı var mı?
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### 4. Deploy Et
```bash
git push origin main
# Vercel otomatik deploy olacak
```

---

## Troubleshooting

### Auth Endpoints 404 Veriyorsa
```
✅ Çözüm:
1. /api/auth/[...all]/route.ts dosyası var mı kontrol et
2. BETTER_AUTH_URL env var ayarlandı mı?
3. basePath: "/api/auth" doğru mu?
```

### "Unauthorized" Hatası Alıyorsam
```
✅ Çözüm:
1. BETTER_AUTH_SECRET env var ayarlandı mı?
2. Secret key yeterince uzun mu? (min 32 chars)
3. Production ve local secret'lar farklı mı?
```

### Google OAuth Çalışmıyorsa
```
✅ Çözüm:
1. Google Console'da callback URL'ler doğru mu?
   - https://your-domain.com/api/auth/callback/google
2. GOOGLE_CLIENT_ID ve GOOGLE_CLIENT_SECRET doğru mu?
3. OAuth 2.0 Client kurulu mu?
4. Domain name'de HTTPS var mı? (Google HTTPS gerektirir)
```

### Cookies Kaydedilmiyorsa
```
✅ Çözüm:
1. Domain ayarı doğru mu?
   - Production: BETTER_AUTH_URL="https://your-domain.com"
2. HTTPS kullanılıyor mu? (cookies SameSite=Strict için HTTPS gerekli)
3. trustHost: true ayarlanmış mı?
4. API headers'da Access-Control-Allow-Credentials: true var mı?
```

---

## Test ve Kontrol

### Local Test
```bash
npm run dev
# Şu adrese git: http://localhost:3000/login
# Google ile giriş dene
```

### Production Test (Vercel)
```bash
1. https://your-domain.com/login'e git
2. Google ile giriş yap
3. Dashboard'a erişebilir misin?
4. Logout ve tekrar login yap
```

### API Endpoints Kontrol Et
```bash
# Session endpoint test
curl -X GET https://your-domain.com/api/auth/session \
  -H "Cookie: auth_token=..." \
  -w "\n%{http_code}\n"

# Beklenen: 200 ve user bilgisi
```

---

## Security Best Practices

### 1. Secret Key Management
```typescript
// ❌ ASLA production'da hardcode secret
const auth = betterAuth({
    secret: "hardcoded-secret"  // ❌ GÜVENSİZ
});

// ✅ Environment variable kullan
const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET
});
```

### 2. HTTPS Kullan
```typescript
// Production'da HTTPS zorunlu
BETTER_AUTH_URL="https://your-domain.com"

// Localhost development'ta HTTP OK
BETTER_AUTH_URL="http://localhost:3000"
```

### 3. CORS Configuration
```typescript
// API auth endpoints CORS'ı güvenli
{ 
    source: '/api/auth/(.*)', 
    headers: [
        // Credentials için izin ver
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        // Sadece gerekli methods
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
    ] 
}
```

---

## Yapılandırma Kontrol Listesi
- ✅ BETTER_AUTH_URL env var'ı ayarlandı (production domain'i)
- ✅ BETTER_AUTH_SECRET env var'ı ayarlandı (min 32 chars, random)
- ✅ NEXT_PUBLIC_APP_URL env var'ı ayarlandı
- ✅ trustHost: true lib/auth.ts'de
- ✅ basePath: "/api/auth" server ve client'da aynı
- ✅ Google OAuth callback URLs güncellendi
- ✅ API headers CORS konfigürasyonu yapıldı
- ✅ Database bağlantısı production'da test edildi
- ✅ HTTPS kullanılıyor (production)
- ✅ Cookies SameSite ayarları doğru

---

## Referanslar
- [better-auth Docs](https://www.better-auth.com/)
- [better-auth Deployment](https://www.better-auth.com/docs/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Google OAuth Callback](https://developers.google.com/identity/protocols/oauth2/web)
