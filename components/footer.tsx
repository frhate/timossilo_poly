import Link from "next/link"
import {Facebook, Instagram, Music, Mail, Phone, MapPin} from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto px-4 py-12 lg:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-4">
                        <h2 className="text-xl font-bold mb-4">Timossilo Polymobile</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                            Votre destination de confiance pour les smartphones, ordinateurs et accessoires
                            électroniques en Constantine.
                        </p>
                        <div className="flex gap-3">
                            <Link
                                href="https://www.facebook.com/timosilo.timosilo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-4 h-4"/>
                            </Link>
                            <Link
                                href="https://www.instagram.com/timossilo_polymobile"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-4 h-4"/>
                            </Link>
                            <Link
                                href="https://www.tiktok.com/@timossilo.polymob"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
                                aria-label="TikTok"
                            >
                                <Music className="w-4 h-4"/>
                            </Link>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-semibold mb-4">Catégories</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/products"
                                      className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Téléphones
                                </Link>
                            </li>
                            <li>
                                <Link href="/products"
                                      className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Ordinateurs
                                </Link>
                            </li>
                            <li>
                                <Link href="/products"
                                      className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Accessoires
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-semibold mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/"
                                      className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Contactez-nous
                                </Link>
                            </li>
                            <li>
                                <Link href="/"
                                      className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Politique de Confidentialité
                                </Link>
                            </li>
                            <li>
                                <Link href="/"
                                      className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Conditions d'Utilisation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                                <span>info@timosilo.com</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                                <span>+213  0542304569</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                                <span>Constantine</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t mt-12 pt-8">
                    <p className="text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Timosilo. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    )
}