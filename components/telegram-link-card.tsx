"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function TelegramLinkCard() {
  const [chatId, setChatId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleLinkTelegram = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("Vous devez être connecté")
      }

      // Update user profile with Telegram chat ID
      const { error } = await supabase
        .from("user_profiles")
        .upsert(
          {
            id: user.id,
            telegram_chat_id: chatId,
          },
          { onConflict: "id" }
        )

      if (error) {
        throw new Error("Erreur lors de la liaison du compte Telegram")
      }

      setMessage({ type: "success", text: "Compte Telegram lié avec succès!" })
      setChatId("")
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Une erreur est survenue",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
          Lier votre compte Telegram
        </CardTitle>
        <CardDescription>
          Recevez des notifications de confirmation de commande directement sur Telegram
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLinkTelegram} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chatId">Telegram Chat ID</Label>
            <Input
              id="chatId"
              type="text"
              placeholder="Votre Telegram Chat ID"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Pour obtenir votre Chat ID:
            </p>
            <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
              <li>Recherchez <strong>@userinfobot</strong> sur Telegram</li>
              <li>Démarrez une conversation et envoyez-lui /start</li>
              <li>Le bot vous répondra avec votre Chat ID</li>
              <li>Copiez le numéro et collez-le ci-dessus</li>
            </ol>
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Liaison en cours..." : "Lier mon compte Telegram"}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Pourquoi lier Telegram?</strong>
            <br />
            Une fois lié, vous recevrez des messages de confirmation pour vos commandes directement
            sur Telegram. Vous pourrez confirmer ou annuler vos commandes en un clic!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

