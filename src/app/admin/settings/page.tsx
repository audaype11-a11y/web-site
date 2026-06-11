"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Key, User, Mail, Globe, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [savingSite, setSavingSite] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  // Site config state
  const [siteName, setSiteName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [siteKeywords, setSiteKeywords] = useState("");
  const [siteAuthor, setSiteAuthor] = useState("");
  const [footerAboutText, setFooterAboutText] = useState("");
  const [footerCopyright, setFooterCopyright] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  
  // Social links
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  
  // Profile
  const [doctorName, setDoctorName] = useState("");
  const [doctorBio, setDoctorBio] = useState("");
  const [doctorImage, setDoctorImage] = useState("");
  const [aboutPage, setAboutPage] = useState("");

  // Load current config
  useEffect(() => {
    fetch("/api/site-config")
      .then((res) => res.json())
      .then((data) => {
        setSiteName(data.siteName || "");
        setSiteDescription(data.siteDescription || "");
        setSiteKeywords(data.siteKeywords || "");
        setSiteAuthor(data.siteAuthor || "");
        setFooterAboutText(data.footerAboutText || "");
        setFooterCopyright(data.footerCopyright || "");
        setContactEmail(data.contactEmail || "");
        setTwitterUrl(data.twitterUrl || "");
        setInstagramUrl(data.instagramUrl || "");
        setYoutubeUrl(data.youtubeUrl || "");
        setTelegramUrl(data.telegramUrl || "");
        setWhatsappUrl(data.whatsappUrl || "");
        setLinkedinUrl(data.linkedinUrl || "");
        setDoctorName(data.doctorName || "");
        setDoctorBio(data.doctorBio || "");
        setDoctorImage(data.doctorImage || "");
        setAboutPage(data.aboutPage || "");
      })
      .catch(console.error);
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمة المرور الجديدة غير متطابقة",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "تم بنجاح",
          description: "تم تغيير كلمة المرور بنجاح",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast({
          title: "خطأ",
          description: data.error || "حدث خطأ أثناء تغيير كلمة المرور",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تغيير كلمة المرور",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSiteConfig = async (key: string, value: string) => {
    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving:", key, error);
    }
  };

  const handleSaveSiteConfig = async () => {
    setSavingSite(true);
    
    try {
      await Promise.all([
        saveSiteConfig("siteName", siteName),
        saveSiteConfig("siteDescription", siteDescription),
        saveSiteConfig("siteKeywords", siteKeywords),
        saveSiteConfig("siteAuthor", siteAuthor),
        saveSiteConfig("footerAboutText", footerAboutText),
        saveSiteConfig("footerCopyright", footerCopyright),
        saveSiteConfig("contactEmail", contactEmail),
        saveSiteConfig("twitterUrl", twitterUrl),
        saveSiteConfig("instagramUrl", instagramUrl),
        saveSiteConfig("youtubeUrl", youtubeUrl),
        saveSiteConfig("telegramUrl", telegramUrl),
        saveSiteConfig("whatsappUrl", whatsappUrl),
        saveSiteConfig("linkedinUrl", linkedinUrl),
        saveSiteConfig("doctorName", doctorName),
        saveSiteConfig("doctorBio", doctorBio),
        saveSiteConfig("doctorImage", doctorImage),
        saveSiteConfig("aboutPage", aboutPage),
      ]);

      toast({
        title: "تم بنجاح",
        description: "تم حفظ الإعدادات بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setSavingSite(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">إدارة إعدادات الموقع والحساب</p>
      </div>

      <Tabs defaultValue="site" className="space-y-4">
        <TabsList>
          <TabsTrigger value="site">إعدادات الموقع</TabsTrigger>
          <TabsTrigger value="profile">ملفي الشخصي</TabsTrigger>
          <TabsTrigger value="social">وسائل التواصل</TabsTrigger>
          <TabsTrigger value="account">حسابي</TabsTrigger>
        </TabsList>

        {/* Site Settings */}
        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                إعدادات الموقع
              </CardTitle>
              <CardDescription>تخصيص معلومات الموقع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">اسم الموقع</Label>
                  <Input
                    id="siteName"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="مدونة الطبيب"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteAuthor">المؤلف</Label>
                  <Input
                    id="siteAuthor"
                    value={siteAuthor}
                    onChange={(e) => setSiteAuthor(e.target.value)}
                    placeholder="مدونة الطبيب"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">وصف الموقع</Label>
                <Textarea
                  id="siteDescription"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder="مدونة شخصية لطالب طب بشري..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteKeywords">الكلمات المفتاحية (مفصولة بفواصل)</Label>
                <Input
                  id="siteKeywords"
                  value={siteKeywords}
                  onChange={(e) => setSiteKeywords(e.target.value)}
                  placeholder="طب, طب بشري, مقالات طبية"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">بريد التواصل</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerAboutText">نص关于我们 في الفوتر</Label>
                <Textarea
                  id="footerAboutText"
                  value={footerAboutText}
                  onChange={(e) => setFooterAboutText(e.target.value)}
                  placeholder="مدونة شخصية لطالب طب..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerCopyright">نص الحقوق</Label>
                <Input
                  id="footerCopyright"
                  value={footerCopyright}
                  onChange={(e) => setFooterCopyright(e.target.value)}
                  placeholder="صنع بـ ❤️ لطلاب الطب"
                />
              </div>

              <Button onClick={handleSaveSiteConfig} disabled={savingSite}>
                {savingSite && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                حفظ إعدادات الموقع
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                ملفي الشخصي
              </CardTitle>
              <CardDescription>معلوماتي الشخصية التي تظهر في صفحة عنا</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctorName">الاسم</Label>
                <Input
                  id="doctorName"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="د. أحمد محمد"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctorBio">النبذة التعريفية</Label>
                <Textarea
                  id="doctorBio"
                  value={doctorBio}
                  onChange={(e) => setDoctorBio(e.target.value)}
                  placeholder="طالب طب بشري، أهتم بتبسيط المعلومات الطبية..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorImage">الصورة الشخصية</Label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      id="doctorImage"
                      value={doctorImage}
                      onChange={(e) => setDoctorImage(e.target.value)}
                      placeholder="ارفع صورة أو الصق رابط الصورة"
                    />
                    <Input
                      id="doctorImageUpload"
                      type="file"
                      accept="image/*"
                      className="mt-2 cursor-pointer"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        const formData = new FormData();
                        formData.append("file", file);
                        
                        try {
                          const res = await fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                          });
                          const data = await res.json();
                          if (data.url) {
                            setDoctorImage(data.url);
                            toast({ title: "تم", description: "تم رفع الصورة بنجاح" });
                          } else if (data.error) {
                            toast({ title: "خطأ", description: data.error, variant: "destructive" });
                          }
                        } catch (err) {
                          toast({ title: "خطأ", description: "فشل في رفع الصورة", variant: "destructive" });
                        }
                      }}
                    />
                  </div>
                  {doctorImage && (
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                      <img src={doctorImage} alt="الصورة الشخصية" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutPage">محتوى صفحة عنا (HTML)</Label>
                <Textarea
                  id="aboutPage"
                  value={aboutPage}
                  onChange={(e) => setAboutPage(e.target.value)}
                  placeholder="<p>محتوى إضافي لصفحة عنا...</p>"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <Button onClick={handleSaveSiteConfig} disabled={savingSite}>
                {savingSite && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                حفظ ملفي الشخصي
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                وسائل التواصل
              </CardTitle>
              <CardDescription>روابط وسائل التواصل الاجتماعي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="twitter">تويتر</Label>
                  <Input
                    id="twitter"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">انستغرام</Label>
                  <Input
                    id="instagram"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">يوتيوب</Label>
                  <Input
                    id="youtube"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/@username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram">تيليجرام</Label>
                  <Input
                    id="telegram"
                    value={telegramUrl}
                    onChange={(e) => setTelegramUrl(e.target.value)}
                    placeholder="https://t.me/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">واتساب</Label>
                  <Input
                    id="whatsapp"
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    placeholder="https://wa.me/1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">لينكدإن</Label>
                  <Input
                    id="linkedin"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <Button onClick={handleSaveSiteConfig} disabled={savingSite}>
                {savingSite && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                حفظ روابط التواصل
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  تغيير كلمة المرور
                </CardTitle>
                <CardDescription>قم بتغيير كلمة مرور حسابك</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current">كلمة المرور الحالية</Label>
                    <Input
                      id="current"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new">كلمة المرور الجديدة</Label>
                    <Input
                      id="new"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">تأكيد كلمة المرور</Label>
                    <Input
                      id="confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    تغيير كلمة المرور
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  معلومات الحساب
                </CardTitle>
                <CardDescription>معلومات حسابك الحالية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                    <p className="font-medium">admin@medblog.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">الاسم</p>
                    <p className="font-medium">د. أحمد محمد</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
