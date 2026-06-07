# مدونة الطبيب - Medical Blog

مدونة طبية مبنية بـ Next.js 16 للطلاب والأطباء

## ✨ المميزات

- واجهة عربية RTL بالكامل
- نظام إدارة محتوى متكامل
- دعم الوضع الداكن
- محرر Markdown متقدم
- SEO محسن
- تصميم متجاوب

## 🛠️ التقنيات

- **Framework**: Next.js 16
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **UI**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript

## 📦 التثبيت

\`\`\`bash
# نسخ المتغيرات البيئية
cp .env.example .env

# تثبيت التبعيات
bun install

# توليد Prisma Client
bun run db:generate

# تشغيل الهجرات
bun run db:migrate

# تشغيل التطبيق
bun run dev
\`\`\`

## 🔐 بيانات الدخول

- **البريد**: admin@medblog.com
- **كلمة المرور**: admin123

## 🚀 النشر على Railway

### 1. إنشاء مشروع جديد
\`\`\`
railway init
\`\`\`

### 2. إضافة PostgreSQL
\`\`\`
railway add --database postgres
\`\`\`

### 3. تعيين المتغيرات البيئية
\`\`\`
railway variables set NEXTAUTH_SECRET=your-secret-key
railway variables set NEXTAUTH_URL=https://your-app.up.railway.app
\`\`\`

### 4. النشر
\`\`\`
railway up
\`\`\`

## 📁 هيكل المشروع

\`\`\`
├── prisma/           # قاعدة البيانات
├── src/
│   ├── app/          # صفحات التطبيق
│   ├── components/   # المكونات
│   ├── lib/          # المكتبات
│   └── hooks/        # React Hooks
├── public/           # الملفات الثابتة
└── Dockerfile        # ملف Docker
\`\`\`

## 📝 الترخيص

MIT
