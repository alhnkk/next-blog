import { Card } from "@/components/ui/card"

export function AdPlaceholder() {
  return (
    <Card className="w-full max-w-2xl mx-auto my-12">
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 min-h-[200px] bg-muted/30">
        {/* Reklam ikonu */}
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
          <svg
            className="w-6 h-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
        </div>

        {/* Reklam metni */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-muted-foreground">Reklam Alanı</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Bu alan reklam içeriği için ayrılmıştır. Sponsorlu içerikler burada görüntülenecektir.
          </p>
        </div>

        {/* Boyut göstergesi */}
        <div className="text-xs text-muted-foreground/70 font-mono">728 × 200</div>
      </div>
    </Card>
  )
}
