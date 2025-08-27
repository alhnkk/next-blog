import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Heart, MessageCircle, Share2, Film, PenTool } from "lucide-react"
import Image from "next/image"

export default function BlogPost() {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="space-y-8">
          {/* Post Header */}
          <header className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                <Film className="h-3 w-3" />
                Sinema
              </Badge>
              <Badge variant="outline">Analiz</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
              Tarkovsky&aposnin Zaman Felsefesi: Sinematik Şiirin Derinliklerinde
            </h1>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/author-writing.png" alt="Yazar" />
                  <AvatarFallback>AY</AvatarFallback>
                </Avatar>
                <span className="text-sm">Ahmet Yılmaz</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">15 Aralık 2024</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">8 dk okuma</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src="/placeholder.jpeg"
              alt="Tarkovsky film sahnesi"
              className="w-full h-[400px] object-cover"
              width={900}
              height={600}
            />
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed">
              Andrei Tarkovsky, sinema tarihinin en etkileyici yönetmenlerinden biri olarak, zamanın sinematik temsilini
              yeniden tanımladı. Onun filmleri, sadece hikaye anlatmakla kalmaz, aynı zamanda zamanın kendisini
              hissettiren birer deneyim sunar.
            </p>

            <p className="leading-relaxed">
              Tarkovsky&aposnin sinema anlayışında zaman, montajdan çok daha önemli bir unsurdur. O, zamanı sinematik şiir
              olarak tanımlar ve her karenin içinde yaşayan, nefes alan bir zaman kavramı yaratır. Bu yaklaşım,
              Hollywood&aposun hızlı kurgu tekniklerinin tam tersidir.
            </p>

            <Card className="my-8 border-l-4 border-l-primary">
              <CardContent className="p-6">
                <blockquote className="text-lg italic text-card-foreground">
                  Sinema, zamanı kaydetme sanatıdır. Zaman, sinematik imgenin temel malzemesidir
                </blockquote>
                <cite className="text-sm text-muted-foreground mt-2 block">— Andrei Tarkovsky</cite>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-bold mt-8 mb-4">Zamanın Ritmi</h2>

            <p className="leading-relaxed">
              Tarkovsky&aposnin filmlerinde zaman, doğal akışında ilerler. Uzun çekimler, sessizlikler ve doğanın sesleri,
              izleyiciyi contemplatif bir duruma sokar. Bu teknik, özellikle Stalker ve Andrei Rublev filmlerinde
              mükemmel bir şekilde uygulanır.
            </p>

            <p className="leading-relaxed">
              Yönetmenin bu yaklaşımı, sinema dilinin sınırlarını zorlar ve izleyiciden aktif bir katılım bekler. Her
              sahne, derin bir meditasyon gibi yaşanır ve zamanın geçişi fiziksel olarak hissedilir.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Modern Sinemaya Etkisi</h2>

            <p className="leading-relaxed">
              Günümüz yönetmenleri arasında Béla Tarr, Tsai Ming-liang ve Apichatpong Weerasethakul gibi isimler,
              Tarkovsky&aposnin zaman felsefesinden derinden etkilenmiştir. Bu etki, yavaş sinema akımının doğmasına da
              katkıda bulunmuştur.
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-6 border-t">
            <span className="text-sm text-muted-foreground">Etiketler:</span>
            <Badge variant="outline" className="text-xs">
              Tarkovsky
            </Badge>
            <Badge variant="outline" className="text-xs">
              Sinema Teorisi
            </Badge>
            <Badge variant="outline" className="text-xs">
              Zaman
            </Badge>
            <Badge variant="outline" className="text-xs">
              Sanat Filmi
            </Badge>
          </div>

          {/* Engagement Section */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Heart className="h-4 w-4" />
                    42 Beğeni
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <MessageCircle className="h-4 w-4" />8 Yorum
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Share2 className="h-4 w-4" />
                    Paylaş
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Author Bio */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/author-portrait.png" alt="Ahmet Yılmaz" />
                  <AvatarFallback className="text-lg">AY</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Ahmet Yılmaz</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Sinema ve edebiyat üzerine yazan, İstanbul Üniversitesi Sinema bölümü mezunu. Özellikle Avrupa
                    sineması ve modern edebiyat üzerine çalışmalar yapıyor.
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <PenTool className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">127 yazı</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <section className="mt-12 space-y-6">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-2xl font-bold">Yorumlar (8)</h2>
            </div>

            {/* Comment Form */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Yorum Yaz</h3>
                  <Textarea placeholder="Düşüncelerinizi paylaşın..." className="min-h-[100px] resize-none" />
                  <div className="flex justify-end">
                    <Button>Yorum Gönder</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-4">
              {/* Comment 1 */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>MK</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Mehmet Kaya</span>
                        <span className="text-xs text-muted-foreground">2 gün önce</span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        Tarkovsky&aposnin zaman anlayışı gerçekten de sinema tarihinde eşsiz. Özellikle Stalker filmindeki
                        uzun çekimler, zamanın nasıl hissedildiğini gösteriyor. Harika bir analiz olmuş.
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                          <Heart className="h-3 w-3 mr-1" />5
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                          Yanıtla
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comment 2 */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>EY</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Elif Yıldız</span>
                        <span className="text-xs text-muted-foreground">1 gün önce</span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        Bu yazıyı okuduktan sonra Andrei Rublev&aposi tekrar izleme isteği duydum. Tarkovsky&aposnin zamanla
                        kurduğu ilişki gerçekten de meditatif bir deneyim sunuyor.
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                          <Heart className="h-3 w-3 mr-1" />3
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                          Yanıtla
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comment 3 */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Ali Şahin</span>
                        <span className="text-xs text-muted-foreground">18 saat önce</span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        Modern yavaş sinema akımına değinmeniz çok yerinde olmuş. Béla Tarr&aposın filmlerinde de benzer bir
                        zaman algısı var. Bu konuda daha detaylı bir yazı bekliyorum.
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                          <Heart className="h-3 w-3 mr-1" />7
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                          Yanıtla
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Load More Comments */}
            <div className="text-center pt-4">
              <Button variant="outline">Daha Fazla Yorum Yükle</Button>
            </div>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">© 2024 Edebiyat & Sinema. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
