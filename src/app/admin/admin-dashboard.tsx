"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Eye,
  FileEdit,
  FolderOpen,
  Plus,
  LogOut,
  LayoutDashboard,
  ArrowLeft,
  Settings,
} from "lucide-react";

interface AdminDashboardProps {
  stats: {
    postsCount: number;
    publishedCount: number;
    draftCount: number;
    categoriesCount: number;
  };
  recentPosts: {
    id: string;
    title: string;
    published: boolean;
    createdAt: string;
    category: { name: string; color: string } | null;
  }[];
  userName: string;
}

export function AdminDashboard({ stats, recentPosts, userName }: AdminDashboardProps) {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">لوحة التحكم</h1>
            <p className="text-muted-foreground text-sm">مرحباً، {userName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowLeft className="h-3.5 w-3.5" />
                الموقع
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-red-600 hover:text-red-700"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              <LogOut className="h-3.5 w-3.5" />
              خروج
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="gap-1">
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
          <Link href="/admin/posts/new">
            <Button variant="ghost" size="sm" className="gap-1">
              <Plus className="h-3.5 w-3.5" />
              مقال جديد
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="ghost" size="sm" className="gap-1">
              <FolderOpen className="h-3.5 w-3.5" />
              التصنيفات
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="ghost" size="sm" className="gap-1">
              <Settings className="h-3.5 w-3.5" />
              الإعدادات
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.postsCount}</p>
                  <p className="text-xs text-muted-foreground">إجمالي المقالات</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.publishedCount}</p>
                  <p className="text-xs text-muted-foreground">منشورة</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <FileEdit className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.draftCount}</p>
                  <p className="text-xs text-muted-foreground">مسودات</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <FolderOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.categoriesCount}</p>
                  <p className="text-xs text-muted-foreground">تصنيفات</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">آخر المقالات</CardTitle>
              <Link href="/admin/posts">
                <Button variant="outline" size="sm">
                  عرض الكل
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                لا توجد مقات بعد
              </p>
            ) : (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{post.title}</p>
                      <div className="flex items-center gap-2 mt-1">
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
                        <Badge variant={post.published ? "default" : "secondary"} className="text-xs">
                          {post.published ? "منشور" : "مسودة"}
                        </Badge>
                      </div>
                    </div>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        تعديل
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
