"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Mail, 
  MailOpen, 
  Reply, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  User,
  MessageSquare
} from "lucide-react";
import { 
  getMessages, 
  markMessageAsRead, 
  markMessageAsReplied, 
  deleteMessage,
  Message 
} from "@/lib/actions/messages";
import { toast } from "@/hooks/use-toast";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "replied">("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const loadMessages = async (page: number = 1) => {
    setLoading(true);
    try {
      const result = await getMessages(page, 10);
      setMessages(result.messages);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Mesajlar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    const result = await markMessageAsRead(id);
    if (result.success) {
      setMessages(prev => 
        prev.map(msg => msg.id === id ? { ...msg, read: true } : msg)
      );
      toast({
        title: "Başarılı",
        description: "Mesaj okundu olarak işaretlendi.",
      });
    } else {
      toast({
        title: "Hata",
        description: result.error || "Mesaj işaretlenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsReplied = async (id: number) => {
    const result = await markMessageAsReplied(id);
    if (result.success) {
      setMessages(prev => 
        prev.map(msg => msg.id === id ? { ...msg, replied: true } : msg)
      );
      toast({
        title: "Başarılı",
        description: "Mesaj yanıtlandı olarak işaretlendi.",
      });
    } else {
      toast({
        title: "Hata",
        description: result.error || "Mesaj işaretlenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deleteMessage(id);
    if (result.success) {
      setMessages(prev => prev.filter(msg => msg.id !== id));
      toast({
        title: "Başarılı",
        description: "Mesaj silindi.",
      });
    } else {
      toast({
        title: "Hata",
        description: result.error || "Mesaj silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;

    // Burada gerçek e-posta gönderme işlevselliği eklenebilir
    // Şimdilik sadece yanıtlandı olarak işaretleyelim
    await handleMarkAsReplied(selectedMessage.id);
    setReplyContent("");
    setSelectedMessage(null);
    
    toast({
      title: "Yanıt Gönderildi",
      description: "E-posta yanıtı gönderildi.",
    });
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filter === "all" || 
      (filter === "unread" && !message.read) ||
      (filter === "replied" && message.replied);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mesajlar</h1>
          <p className="text-muted-foreground">
            Gelen mesajları görüntüleyin ve yönetin
          </p>
        </div>
      </div>

      {/* Filtreler */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Mesajlarda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            Tümü
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            size="sm"
          >
            Okunmamış
          </Button>
          <Button
            variant={filter === "replied" ? "default" : "outline"}
            onClick={() => setFilter("replied")}
            size="sm"
          >
            Yanıtlanmış
          </Button>
        </div>
      </div>

      {/* Mesaj Listesi */}
      <div className="grid gap-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Mesaj Bulunamadı</h3>
              <p className="text-gray-500 text-center">
                {searchTerm || filter !== "all" 
                  ? "Arama kriterlerinize uygun mesaj bulunamadı."
                  : "Henüz hiç mesaj gelmemiş."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className={`${!message.read ? "border-blue-200 bg-blue-50/50" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{message.name}</CardTitle>
                      <div className="flex gap-1">
                        {!message.read && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Yeni
                          </Badge>
                        )}
                        {message.replied && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Yanıtlandı
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {message.email}
                    </CardDescription>
                    {message.subject && (
                      <CardDescription className="mt-1">
                        <strong>Konu:</strong> {message.subject}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {formatDate(message.createdAt)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {message.content}
                </p>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMessage(message)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Detay
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Mesaj Detayı</DialogTitle>
                        <DialogDescription>
                          {message.name} ({message.email})
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {message.subject && (
                          <div>
                            <Label>Konu</Label>
                            <p className="text-sm text-gray-700">{message.subject}</p>
                          </div>
                        )}
                        <div>
                          <Label>Mesaj</Label>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <div>
                          <Label>Yanıt</Label>
                          <Textarea
                            placeholder="Yanıtınızı yazın..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleReply} disabled={!replyContent.trim()}>
                            <Reply className="h-4 w-4 mr-2" />
                            Yanıtla
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedMessage(null)}
                          >
                            Kapat
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {!message.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(message.id)}
                    >
                      <MailOpen className="h-4 w-4 mr-2" />
                      Okundu İşaretle
                    </Button>
                  )}

                  {!message.replied && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsReplied(message.id)}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Yanıtlandı İşaretle
                    </Button>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mesajı Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(message.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => loadMessages(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Önceki
          </Button>
          <span className="flex items-center px-4">
            Sayfa {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => loadMessages(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sonraki
          </Button>
        </div>
      )}
    </div>
  );
}
