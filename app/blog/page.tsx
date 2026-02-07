'use client';

import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import Navigation from "@/components/navigation";
import {ArrowRight, Zap, Shield} from 'lucide-react';

export default function ComparisonPage() {
    const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'performance'>('specs');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const specifications = [
        {category: 'Display', s25: '6.8" Dynamic AMOLED, 120Hz', iphone: '6.9" Super Retina XDR, 120Hz'},
        {category: 'Processor', s25: 'Snapdragon 8 Elite', iphone: 'A19 Pro'},
        {category: 'RAM', s25: '12GB', iphone: '8GB'},
        {category: 'Storage', s25: '256GB/512GB', iphone: '256GB/512GB/1TB'},
        {category: 'Battery', s25: '4,000mAh', iphone: '4,582mAh'},
        {category: 'Charging', s25: '45W Fast Charging', iphone: '45W MagSafe'},
        {category: 'Cameras', s25: '200MP Main + 50MP Tele + 10MP Ultra', iphone: '48MP Main + 12MP Tele + 12MP Ultra'},
        {category: 'Weight', s25: '218g', iphone: '221g'},
    ];

    const features = [
        {name: 'AI Features', s25: '✓ Galaxy AI Suite', iphone: '✓ Apple Intelligence'},
        {name: 'Water Resistance', s25: 'IP68', iphone: 'IP69'},
        {name: 'Wireless Charging', s25: '✓ Yes', iphone: '✓ Yes'},
        {name: 'Price', s25: 'Starting $999', iphone: 'Starting $1,099'},
    ];

    return (
        <>
            <Head>
                <title>Samsung S25 Ultra vs iPhone 17 Pro Max | Complete Comparison 2025</title>
                <meta name="description"
                      content="Detailed comparison between Samsung Galaxy S25 Ultra and iPhone 17 Pro Max. Specs, features, performance, and pricing analysis."/>
                <meta name="keywords" content="S25 Ultra vs iPhone 17 Pro Max, comparison, specs, features, price"/>
                <meta property="og:title" content="S25 Ultra vs iPhone 17 Pro Max Comparison"/>
                <meta property="og:description" content="Comprehensive guide comparing two flagship smartphones"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>

            <main className="min-h-screen bg-background">
                <Navigation/>

                {/* Animated background elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"/>
                    <div
                        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"/>
                </div>

                {/* Hero Section */}
                <section
                    className={`relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="max-w-7xl mx-auto text-center">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full w-fit hover:bg-primary/15 transition-colors mb-8">
                            <Zap className="w-4 h-4 text-primary"/>
                            <span className="text-sm font-semibold text-primary">Comparison Tech</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                            S25 Ultra vs <br/>
                            <span
                                className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                iPhone 17 Pro Max
              </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                            The ultimate flagship smartphone showdown. Compare specs, features, and performance of two
                            industry-leading devices.
                        </p>


                    </div>
                </section>

                {/* Tabs Navigation */}
                <section className="relative px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex gap-2 border-b border-border/30 mb-8 overflow-x-auto">
                            {(['specs', 'features', 'performance'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 font-semibold capitalize transition whitespace-nowrap ${
                                        activeTab === tab
                                            ? 'text-primary border-b-2 border-primary'
                                            : 'text-foreground hover:text-primary'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Specs Tab */}
                        {activeTab === 'specs' && (
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-1 text-center">
                                    <h3 className="text-2xl font-bold text-foreground mb-4">Samsung S25 Ultra</h3>
                                    <div className="relative group">
                                        <div
                                            className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/10 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"/>
                                        <div
                                            className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 h-64 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                                            <img
                                                src="https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra-sm-s938.jpg"
                                                alt="Samsung S25 Ultra"
                                                className="w-full h-full object-contain rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-1">
                                    <h3 className="text-2xl font-bold text-foreground text-center mb-6">Specifications</h3>
                                    <div className="space-y-4">
                                        {specifications.map((spec, idx) => (
                                            <div key={idx}
                                                 className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-primary/10 hover:border-primary/30 transition-colors">
                                                <p className="text-foreground font-semibold text-sm mb-3 capitalize">{spec.category}</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-primary font-semibold text-sm">{spec.s25}</div>
                                                    <div
                                                        className="text-primary font-semibold text-sm">{spec.iphone}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-1 text-center">
                                    <h3 className="text-2xl font-bold text-foreground mb-4">iPhone 17 Pro Max</h3>
                                    <div className="relative group">
                                        <div
                                            className="absolute -inset-1 bg-gradient-to-r from-accent/30 via-primary/20 to-accent/10 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"/>
                                        <div
                                            className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 h-64 flex items-center justify-center border border-accent/20 group-hover:border-accent/40 transition-colors overflow-hidden">
                                            <img
                                                src="https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-pro-max.jpg"
                                                alt="iPhone 17 Pro Max"
                                                className="w-full h-full object-contain rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Features Tab */}
                        {activeTab === 'features' && (
                            <div className="grid md:grid-cols-2 gap-8">
                                {features.map((feature, idx) => (
                                    <div key={idx}
                                         className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-primary/10 hover:border-primary/30 transition-colors">
                                        <h4 className="text-lg font-bold text-foreground mb-4">{feature.name}</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                                                <p className="text-primary font-semibold text-sm mb-2">S25 Ultra</p>
                                                <p className="text-foreground">{feature.s25}</p>
                                            </div>
                                            <div className="bg-background/90 rounded-lg p-4 border border-accent/10">
                                                <p className="text-primary font-semibold text-sm mb-2">iPhone 17</p>
                                                <p className="text-foreground">{feature.iphone}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Performance Tab */}
                        {activeTab === 'performance' && (
                            <div className="space-y-6">
                                <div className="relative group">
                                    <div
                                        className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"/>
                                    <div
                                        className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 group-hover:border-primary/30 transition-colors">
                                        <h3 className="text-2xl font-bold text-foreground mb-6">Performance
                                            Analysis</h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="text-lg font-semibold text-primary mb-4">S25 Ultra
                                                    Strengths</h4>
                                                <ul className="space-y-3 text-foreground">
                                                    <li className="flex items-start gap-3">
                                                        <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"/>
                                                        <span>Higher RAM (12GB) for multitasking</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"/>
                                                        <span>Superior zoom with 200MP main camera</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"/>
                                                        <span>Advanced Galaxy AI features</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-accent mb-4">iPhone 17
                                                    Strengths</h4>
                                                <ul className="space-y-3 text-foreground">
                                                    <li className="flex items-start gap-3">
                                                        <Shield className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"/>
                                                        <span>A19 Pro chip efficiency</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <Shield className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"/>
                                                        <span>Larger battery capacity</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <Shield className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"/>
                                                        <span>Enhanced durability (IP69)</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Verdict Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl font-bold text-foreground mb-8 text-center">Final Verdict</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="relative group">
                                <div
                                    className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"/>
                                <div
                                    className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-primary/20 group-hover:border-primary/40 transition-colors">
                                    <h3 className="text-2xl font-bold text-primary mb-4">Choose S25 Ultra If:</h3>
                                    <ul className="space-y-3 text-foreground">
                                        <li className="flex items-start gap-3">
                                            <span className="text-primary">•</span>
                                            <span>You want maximum camera zoom and clarity</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-primary">•</span>
                                            <span>You prefer Android customization</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-primary">•</span>
                                            <span>You need cutting-edge AI features</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="relative group">
                                <div
                                    className="absolute -inset-1 bg-gradient-to-br from-accent/30 to-accent/10 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"/>
                                <div
                                    className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-accent/20 group-hover:border-accent/40 transition-colors">
                                    <h3 className="text-2xl font-bold text-primary mb-4">Choose iPhone 17 If:</h3>
                                    <ul className="space-y-3 text-foreground">
                                        <li className="flex items-start gap-3">
                                            <span className="text-accent">•</span>
                                            <span>You value ecosystem integration</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-accent">•</span>
                                            <span>You want long-term software support</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-accent">•</span>
                                            <span>You prefer iOS security and privacy</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="relative group">
                            <div
                                className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"/>
                            <div
                                className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-12 border border-primary/20 group-hover:border-primary/40 transition-colors">
                                <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Choose?</h2>
                                <p className="text-foreground mb-8">Compare prices and find the best deals for your next
                                    flagship smartphone.</p>
                                <a
                                    href="/products"
                                    className="group px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 inline-flex items-center justify-center gap-2 hover:scale-105"
                                >
                                    View Current Prices
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}