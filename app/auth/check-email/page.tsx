import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm text-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Vérifiez votre Email</h1>
          <p className="text-muted-foreground">
            Nous vous avons envoyé un lien de confirmation par email. Veuillez vérifier votre boîte de réception pour activer votre compte.
          </p>
          <Link href="/">
            <Button className="w-full">Retour à l'Accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
