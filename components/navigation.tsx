"use client"

      import { createClient } from "@/lib/supabase/client"
      import { Button } from "@/components/ui/button"
      import Link from "next/link"
      import Image from "next/image"
      import { useRouter } from "next/navigation"
      import { useEffect, useState } from "react"
      import { ShoppingCart, Menu, X, LogOut, User, Settings, LayoutGrid } from "lucide-react"

      export default function Navigation() {
        const [user, setUser] = useState<any>(null)
        const [isLoading, setIsLoading] = useState(true)
        const router = useRouter()
        const supabase = createClient()
        const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

        useEffect(() => {
          const getUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data?.user)
            setIsLoading(false)
          }
          getUser()
        }, [supabase])

        const handleLogout = async () => {
          await supabase.auth.signOut()
          setMobileMenuOpen(false)
          router.push("/")
        }

        const closeMobileMenu = () => setMobileMenuOpen(false)

        return (
          <nav className="sticky top-0 z-50 bg-background border-b border-border/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16 sm:h-20">
                {/* Left Section: Logo + Categories Button */}
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0" onClick={closeMobileMenu}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary/80 shadow-md">
                      <Image
                        src="/logo.jpg"
                        alt="Timosilo logo"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <span className="font-bold text-base sm:text-xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 hidden xs:inline truncate">
                      Timossilo
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
                    className="lg:hidden text-foreground/70 hover:text-primary hover:bg-primary/8 transition-all duration-300 flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  {!isLoading && user && (
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
                      {user ? (
                        <div className="flex items-center gap-3">
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

                {/* Mobile Actions: Cart + Menu */}
                <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
                  {!isLoading && user && (
                    <Link href="/cart" onClick={closeMobileMenu}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-foreground/70 hover:text-primary hover:bg-primary/8 transition-all duration-300 h-9 w-9 sm:h-10 sm:w-10"
                      >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="sr-only">Mon panier</span>
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-foreground hover:bg-primary/8 transition-all duration-300 h-9 w-9 sm:h-10 sm:w-10"
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                    <span className="sr-only">Menu</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-md animate-in fade-in slide-in-from-top-2 shadow-lg">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 space-y-1 sm:space-y-2">
                  {/* Mobile Navigation Links */}
                  <Link href="/products" className="block" onClick={closeMobileMenu}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/8 font-medium transition-all duration-300 h-11"
                    >
                      Produits
                    </Button>
                  </Link>
                  {!isLoading && user && (
                    <Link href="/admin" className="block" onClick={closeMobileMenu}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/8 font-medium transition-all duration-300 gap-2 h-11"
                      >
                        <Settings className="w-4 h-4" />
                        Administration
                      </Button>
                    </Link>
                  )}

                  <div className="my-2 h-px bg-border/50"></div>

                  {/* Mobile Auth Section */}
                  {!isLoading && (
                    <>
                      {user ? (
                        <div className="space-y-1 sm:space-y-2">
                          <Link href="/account" className="block" onClick={closeMobileMenu}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/8 font-medium transition-all duration-300 gap-2 h-11"
                            >
                              <User className="w-4 h-4" />
                              Mon Compte
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-foreground/70 hover:text-destructive hover:bg-destructive/8 font-medium transition-all duration-300 gap-2 h-11"
                            onClick={handleLogout}
                          >
                            <LogOut className="w-4 h-4" />
                            Déconnexion
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-2">
                          <Link href="/auth/login" className="block" onClick={closeMobileMenu}>
                            <Button
                              variant="outline"
                              className="w-full border-border/50 text-foreground font-medium hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 h-11"
                            >
                              Se connecter
                            </Button>
                          </Link>
                          <Link href="/auth/sign-up" className="block" onClick={closeMobileMenu}>
                            <Button
                              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-background font-medium shadow-md transition-all duration-300 h-11"
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