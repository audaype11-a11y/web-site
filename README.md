# مدونة الطبيب - Medical Blog

مدونة طبية مبنية بـ Next.js 16 للطلاب والأطباء

## ✨ المميزات

- واجهة عربية RTL بالكامل
- نظام إدارة محتوى متكامل
- دعم الوضع الداكن
- محرر Markdown متقدم
- SEO محسن (Sitemap, Robots.txt, Meta tags)
- تصميم متجاوب
- صفحة "عني" قابلة للتخصيص
- روابط تواصل اجتماعي من ملف .env
- عداد مشاهدات المقالات
- نظام أمان متكامل

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

# تعديل المتغيرات
# أضف روابط التواصل الاجتماعي ومعلومات الاتصال

# تثبيت التبعيات
bun install

# توليد Prisma Client
bun run db:generate

# تشغيل الهجرات
bun run db:migrate

# تشغيل التطبيق
bun run dev
\`\`\`

## 🔐 الإعداد الأولي

بعد النشر، افتح:
\`\`\`
https://your-domain.com/api/setup?secret=YOUR_SETUP_SECRET
\`\`\`

سيعمل على:
- إنشاء حساب الأدمن
- إنشاء التصنيفات الافتراضية

## 📱 روابط التواصل الاجتماعي

أضف هذه المتغيرات في `.env`:
\`\`\`
TWITTER_URL="https://twitter.com/yourusername"
INSTAGRAM_URL="https://instagram.com/yourusername"
YOUTUBE_URL="https://youtube.com/@yourusername"
TELEGRAM_URL="https://t.me/yourusername"
WHATSAPP_URL="https://wa.me/966500000000"
\`\`\`

## 🚀 النشر على Railway

### المتغيرات المطلوبة:
| المتغير | الوصف |
|---------|-------|
| `DATABASE_URL` | رابط PostgreSQL (تلقائي من Railway) |
| `DIRECT_DATABASE_URL` | نفس قيمة DATABASE_URL |
| `NEXTAUTH_SECRET` | مفتاح سري (32 حرف+) |
| `NEXTAUTH_URL` | رابط موقعك الكامل |
| `SETUP_SECRET` | مفتاح الإعداد الأولي |
| `TWITTER_URL` | رابط تويتر (اختياري) |
| `INSTAGRAM_URL` | رابط انستغرام (اختياري) |
| `YOUTUBE_URL` | رابط يوتيوب (اختياري) |
| `TELEGRAM_URL` | رابط تيليجرام (اختياري) |

## 📁 هيكل المشروع

\`\`\`
├── prisma/           # قاعدة البيانات
├── src/
│   ├── app/          # صفحات التطبيق
│   │   ├── admin/    # لوحة التحكم
│   │   ├── api/      # API Routes
│   │   └── about/    # صفحة عن المدونة
│   ├── components/   # المكونات
│   └── lib/          # المكتبات
├── public/           # الملفات الثابتة
└── Dockerfile        # ملف Docker
\`\`\`

## 🔒 الأمان

- API Upload محمي بالمصادقة
- التحقق من أنواع الملفات
- حماية صفحة الإعداد بمفتاح سري
- منع الوصول لـ /admin من محركات البحث

## 📝 الترخيص

MIT
