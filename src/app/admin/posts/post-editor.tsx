"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ArrowRight,
  Upload,
  Loader2,
  Save,
  Eye,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Plus,
  ImageIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface PostEditorProps {
  categories: { id: string; name: string; slug: string }[];
  userId: string;
  post?: {
    id: string;
    title: string;
    slug: string;
    content: string | null;
    excerpt: string | null;
    coverImage: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    published: boolean;
    categoryId: string | null;
  };
}

export function PostEditor({ categories, userId, post }: PostEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    post?.metaDescription || ""
  );
  const [published, setPublished] = useState(post?.published || false);
  const [categoryId, setCategoryId] = useState(post?.categoryId || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const generateSlug = (title: string) => {
    const arabicToSlug: Record<string, string> = {
      أ: "a", إ: "a", ا: "a", آ: "a",
      ب: "b", ت: "t", ث: "th", ج: "j",
      ح: "h", خ: "kh", د: "d", ذ: "dh",
      ر: "r", ز: "z", س: "s", ش: "sh",
      ص: "s", ض: "d", ط: "t", ظ: "z",
      ع: "a", غ: "gh", ف: "f", ق: "q",
      ك: "k", ل: "l", م: "m", ن: "n",
      ه: "h", و: "w", ي: "y",
    };
    return title
      .split("")
      .map((c) => arabicToSlug[c] || c)
      .join("")
      .replace(/[^a-zA-Z0-9\u0600-\u06FF-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.url);
        toast.success("تم رفع الصورة بنجاح");
      } else {
        toast.error("فشل في رفع الصورة");
      }
    } catch {
      toast.error("حدث خطأ أثناء الرفع");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (publish?: boolean) => {
    if (!title || !slug) {
      toast.error("العنوان والرابط مطلوبان");
      return;
    }

    setSaving(true);
    try {
      const body = {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        published: publish !== undefined ? publish : published,
        authorId: userId,
        categoryId: categoryId || null,
      };

      const url = isEditing ? `/api/posts/${post.id}` : "/api/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(isEditing ? "تم تحديث المقال" : "تم إنشاء المقال");
        router.push("/admin/posts");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "فشل في حفظ المقال");
      }
    } catch {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin/posts">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">
              {isEditing ? "تعديل المقال" : "مقال جديد"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 ml-1 animate-spin" />
              ) : (
                <Save className="h-4 w-4 ml-1" />
              )}
              حفظ كمسودة
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => handleSave(true)}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 ml-1 animate-spin" />
              ) : (
                <Eye className="h-4 w-4 ml-1" />
              )}
              نشر
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-1">
              <LayoutDashboard className="h-3.5 w-3.5" />
              الرئيسية
            </Button>
          </Link>
          <Link href="/admin/posts">
            <Button variant="ghost" size="sm" className="gap-1">
              <FileText className="h-3.5 w-3.5" />
              المقالات
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان المقال</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="أدخل عنوان المقال"
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">الرابط (Slug)</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="article-slug"
                    dir="ltr"
                    className="text-left"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">محتوى المقال</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اكتب محتوى المقال هنا... (يدعم Markdown)"
                  className="min-h-[400px] font-mono text-sm"
                  dir="rtl"
                />
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">مقتطف المقال</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="ملخص قصير للمقال يظهر في البطاقات..."
                  className="min-h-[100px]"
                  dir="rtl"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">صورة الغلاف</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {coverImage ? (
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={coverImage}
                      alt="صورة الغلاف"
                      className="w-full aspect-video object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 left-2 h-7 w-7"
                      onClick={() => setCoverImage("")}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-emerald-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {uploading ? "جاري الرفع..." : "اضغط لرفع صورة"}
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 ml-1" />
                  )}
                  رفع صورة
                </Button>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">التصنيف</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون تصنيف</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Published */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">حالة النشر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="published">منشور</Label>
                  <Switch
                    id="published"
                    checked={published}
                    onCheckedChange={setPublished}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">تحسين محركات البحث</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="عنوان SEO"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="وصف SEO للمقال"
                    className="min-h-[80px]"
                    dir="rtl"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
