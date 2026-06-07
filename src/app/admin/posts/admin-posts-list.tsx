"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Trash2,
  Edit,
  Eye,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface AdminPostsListProps {
  posts: {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt: string;
    coverImage: string | null;
    category: { name: string; slug: string; color: string } | null;
    author: { name: string };
  }[];
  userId: string;
}

export function AdminPostsList({ posts, userId }: AdminPostsListProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تم حذف المقال بنجاح");
        router.refresh();
      } else {
        toast.error("فشل في حذف المقال");
      }
    } catch {
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setDeleting(null);
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      if (res.ok) {
        toast.success(published ? "تم إلغاء النشر" : "تم النشر بنجاح");
        router.refresh();
      }
    } catch {
      toast.error("حدث خطأ");
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">إدارة المقالات</h1>
          <Link href="/admin/posts/new">
            <Button className="gap-1 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              مقال جديد
            </Button>
          </Link>
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
            <Button variant="secondary" size="sm" className="gap-1">
              <FileText className="h-3.5 w-3.5" />
              المقالات
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="ghost" size="sm" className="gap-1">
              <FolderOpen className="h-3.5 w-3.5" />
              التصنيفات
            </Button>
          </Link>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">لا توجد مقات</h3>
              <p className="text-sm text-muted-foreground mb-4">
                ابدأ بإنشاء أول مقال لك
              </p>
              <Link href="/admin/posts/new">
                <Button className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4" />
                  مقال جديد
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="hidden sm:block w-20 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-sky-900 dark:to-emerald-900 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{post.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {post.category && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: post.category.color + "20",
                              color: post.category.color,
                            }}
                          >
                            {post.category.name}
                          </Badge>
                        )}
                        <Badge
                          variant={post.published ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {post.published ? "منشور" : "مسودة"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString("ar-SA")}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => togglePublish(post.id, post.published)}
                        title={post.published ? "إلغاء النشر" : "نشر"}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {post.published && (
                        <Link href={`/articles/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="عرض">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="تعديل">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            disabled={deleting === post.id}
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف المقال</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من حذف &quot;{post.title}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
