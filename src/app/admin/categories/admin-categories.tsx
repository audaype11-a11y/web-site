"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Trash2,
  Edit,
  FolderOpen,
  FileText,
  LayoutDashboard,
  Loader2,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  _count: { posts: number };
}

interface AdminCategoriesProps {
  categories: Category[];
}

const colorOptions = [
  "#0ea5e9", // sky
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#84cc16", // lime
];

export function AdminCategories({ categories }: AdminCategoriesProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#0ea5e9");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setColor("#0ea5e9");
    setEditCategory(null);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setColor(cat.color);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!name || !slug) {
      toast.error("الاسم والرابط مطلوبان");
      return;
    }

    setSaving(true);
    try {
      const url = editCategory
        ? `/api/categories/${editCategory.id}`
        : "/api/categories";
      const method = editCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description, color }),
      });

      if (res.ok) {
        toast.success(editCategory ? "تم تحديث التصنيف" : "تم إنشاء التصنيف");
        setOpen(false);
        resetForm();
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "فشل في حفظ التصنيف");
      }
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تم حذف التصنيف");
        router.refresh();
      } else {
        toast.error("فشل في حذف التصنيف");
      }
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">إدارة التصنيفات</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={openCreate}
              >
                <Plus className="h-4 w-4" />
                تصنيف جديد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editCategory ? "تعديل التصنيف" : "تصنيف جديد"}
                </DialogTitle>
                <DialogDescription>
                  {editCategory
                    ? "عدّل بيانات التصنيف"
                    : "أنشئ تصنيفاً جديداً للمقالات"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="cat-name">اسم التصنيف</Label>
                  <Input
                    id="cat-name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editCategory) {
                        setSlug(
                          e.target.value
                            .replace(/\s+/g, "-")
                            .toLowerCase()
                        );
                      }
                    }}
                    placeholder="مثال: طب عام"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-slug">الرابط (Slug)</Label>
                  <Input
                    id="cat-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="general-medicine"
                    dir="ltr"
                    className="text-left"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-desc">الوصف</Label>
                  <Input
                    id="cat-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="وصف مختصر للتصنيف"
                  />
                </div>
                <div className="space-y-2">
                  <Label>اللون</Label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((c) => (
                      <button
                        key={c}
                        className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c,
                          borderColor: color === c ? "#000" : "transparent",
                        }}
                        onClick={() => setColor(c)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  إلغاء
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                  ) : null}
                  {editCategory ? "تحديث" : "إنشاء"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
          <Link href="/admin/categories">
            <Button variant="secondary" size="sm" className="gap-1">
              <FolderOpen className="h-3.5 w-3.5" />
              التصنيفات
            </Button>
          </Link>
        </div>

        {/* Categories List */}
        {categories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">لا توجد تصنيفات</h3>
              <p className="text-sm text-muted-foreground mb-4">
                أنشئ أول تصنيف لترتيب مقالاتك
              </p>
              <Button
                className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={openCreate}
              >
                <Plus className="h-4 w-4" />
                تصنيف جديد
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Card key={cat.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: cat.color + "20",
                          color: cat.color,
                        }}
                      >
                        <Palette className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{cat.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {cat._count.posts} مقال
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(cat)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600"
                            disabled={deleting === cat.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف التصنيف</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من حذف &quot;{cat.name}&quot;؟ لن يتم حذف المقالات المرتبطة بهذا التصنيف.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(cat.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {cat.description && (
                    <p className="text-sm text-muted-foreground mt-3">
                      {cat.description}
                    </p>
                  )}
                  <div className="mt-3">
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: cat.color + "15",
                        color: cat.color,
                      }}
                    >
                      /{cat.slug}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
