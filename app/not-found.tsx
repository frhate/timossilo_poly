import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">Page Non Trouvée</p>
        <p className="text-muted-foreground">Désolé, nous n'avons pas pu trouver la page que vous recherchez.</p>
        <Link href="/">
          <Button>Retour à l'Accueil</Button>
        </Link>
      </div>
    </div>
  )
}
