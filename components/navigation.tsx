"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ShoppingCart, Menu, X, LogOut, User, Settings, LayoutGrid } from "lucide-react"
import { isUserAdminClient } from "@/lib/actions/auth-client"

export default function Navigation() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user)
      setIsLoading(false)

      // Check if user is admin
      if (data?.user) {
        const adminStatus = await isUserAdminClient()
        setIsAdmin(adminStatus)
      }
    }
    getUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Section: Logo + Categories Button (Mobile) */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary/80 shadow-md">
                <Image
                  src="/logo.jpg"
                  alt="Timosilo logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 hidden sm:inline">
                Timossilo Polymobile
              </span>
            </Link>

            {/* Categories Button - Mobile Only */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const event = new CustomEvent('toggleMobileSidebar')
                window.dispatchEvent(event)
              }}
              className="lg:hidden text-foreground/70 hover:text-primary hover:bg-primary/8 transition-all duration-300"
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="sr-only">Catégories</span>
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/products">
              <Button
                variant="ghost"
                className="text-foreground/80 hover:text-primary hover:bg-primary/8 font-medium transition-all duration-300"
              >
                Produits
              </Button>
            </Link>
            {!isLoading && user && isAdmin && (
              <Link href="/admin">
                <Button
                  variant="ghost"
                  className="text-foreground/80 hover:text-primary hover:bg-primary/8 font-medium transition-all duration-300"
                >
                  Administration
                </Button>
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoading && (
              <>
                {/* Cart - Always visible for both guest and authenticated users */}
                <Link href="/cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground/70 hover:text-primary hover:bg-primary/8 transition-all duration-300"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="sr-only">Mon panier</span>
                  </Button>
                </Link>

                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-px h-6 bg-border/50"></div>

                    <Link href="/account">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-foreground/80 hover:text-primary hover:bg-primary/8 font-medium transition-all duration-300 gap-2"
                      >
                        <User className="w-4 h-4" />
                        Mon Compte
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-foreground/70 hover:text-destructive hover:bg-destructive/8 transition-all duration-300 gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-px h-6 bg-border/50"></div>

                    <Link href="/auth/login">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border/50 text-foreground font-medium hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
                      >
                        Se connecter
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-background font-medium shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        S'inscrire
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground hover:bg-primary/8 transition-all duration-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
            {/* Mobile Navigation Links */}
            <Link href="/products" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/8 font-medium transition-all duration-300"
              >
                Produits
              </Button>
            </Link>
            {!isLoading && user && isAdmin && (
              <Link href="/admin" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/8 font-medium transition-all duration-300"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Administration
                </Button>
              </Link>
            )}

            <div className="my-2 h-px bg-border/50"></div>

            {/* Mobile Auth Section */}
            {!isLoading && (
              <>
                {/* Cart - Always visible for both guest and authenticated users */}
                <Link href="/cart" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/8 font-medium transition-all duration-300 gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Mon Panier
                  </Button>
                </Link>

                <div className="my-2 h-px bg-border/50"></div>

                {user ? (
                  <div className="space-y-2">
                    <Link href="/account" className="block">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/8 font-medium transition-all duration-300 gap-2"
                      >
                        <User className="w-4 h-4" />
                        Mon Compte
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-foreground/70 hover:text-destructive hover:bg-destructive/8 font-medium transition-all duration-300 gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link href="/auth/login" className="block">
                      <Button
                        variant="outline"
                        className="w-full border-border/50 text-foreground font-medium hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
                      >
                        Se connecter
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up" className="block">
                      <Button
                        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-background font-medium shadow-md transition-all duration-300"
                      >
                        S'inscrire
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
