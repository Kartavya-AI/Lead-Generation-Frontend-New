"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Menu, X } from "lucide-react";
import { SignInButton } from '@clerk/nextjs'
import {
    Target,
    Zap,
    Users,
    BarChart3,
    CheckCircle,
    ArrowRight,
    Star,
    TrendingUp,
    Shield,
    Clock,
    Globe,
    Sparkles,
    Brain,
    Rocket,
    Play,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import VantaFog from '@/components/VantaFog';

export const features = [
  {
    icon: Brain,
    title: "AI-Powered Discovery",
    description:
      "Advanced machine learning algorithms identify your ideal prospects from millions of data points.",
    gradient: "bg-gradient-to-br from-purple-100 to-purple-200",
  },
  {
    icon: Zap,
    title: "Smart Qualification",
    description:
      "Intelligent scoring system ranks leads by conversion probability using 50+ data signals.",
    gradient: "bg-gradient-to-br from-yellow-100 to-yellow-200",
  },
  {
    icon: Sparkles,
    title: "Hyper-Personalization",
    description:
      "AI crafts unique messages for each prospect based on their industry, role, and recent activity.",
    gradient: "bg-gradient-to-br from-pink-100 to-pink-200",
  },
  {
    icon: Rocket,
    title: "Automated Sequences",
    description:
      "Multi-touch campaigns that adapt timing and messaging based on recipient engagement patterns.",
    gradient: "bg-gradient-to-br from-blue-100 to-blue-200",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description:
      "Real-time insights and forecasting to optimize your outreach strategy and maximize ROI.",
    gradient: "bg-gradient-to-br from-green-100 to-green-200",
  },
  {
    icon: Users,
    title: "Seamless Integration",
    description:
      "Native CRM sync with Salesforce, HubSpot, and Pipedrive for unified lead management.",
    gradient: "bg-gradient-to-br from-indigo-100 to-indigo-200",
  },
];

const benefits = [
    "Generate 10x more qualified leads in half the time",
    "Achieve 85% higher response rates with AI personalization",
    "Eliminate 20+ hours of manual prospecting weekly",
    "Scale outreach to thousands while maintaining quality",
    "Get predictive insights for continuous optimization",
];

const useCases = [
    {
        title: "Enterprise Sales",
        description: "Fortune 500 companies scaling B2B outreach",
        icon: Globe,
        stats: "500K+ leads generated",
    },
    {
        title: "Growth Agencies",
        description: "Marketing agencies prospecting at scale",
        icon: Shield,
        stats: "300% client growth",
    },
    {
        title: "Tech Startups",
        description: "SaaS companies building customer pipelines",
        icon: Clock,
        stats: "90% faster growth",
    },
];

const testimonials = [
    {
        name: "Sarah Chen",
        role: "VP of Sales, TechFlow",
        content:
            "LeadGen Pro transformed our pipeline. We went from 50 to 500 qualified leads monthly with 3x higher conversion rates.",
        rating: 5,
        avatar: "/professional-woman-diverse.png",
        company: "TechFlow",
    },
    {
        name: "Marcus Rodriguez",
        role: "Founder, GrowthLab",
        content:
            "The AI personalization is incredible. Our email response rates jumped from 2% to 18% in just 30 days.",
        rating: 5,
        avatar: "/professional-man.png",
        company: "GrowthLab",
    },
    {
        name: "Emily Watson",
        role: "Head of Marketing, ScaleUp",
        content:
            "We eliminated 25 hours of manual work weekly while generating 400% more qualified opportunities.",
        rating: 5,
        avatar: "/professional-woman-marketing.png",
        company: "ScaleUp",
    },
];

const stats = [
    { value: "500K+", label: "Leads Generated", icon: Target },
    { value: "85%", label: "Higher Response Rates", icon: TrendingUp },
    { value: "25hrs", label: "Saved Per Week", icon: Clock },
    { value: "300%", label: "Pipeline Growth", icon: Rocket },
];

const benefitGradients = [
  "from-violet-100 to-violet-200",
  "from-rose-100 to-pink-200",
  "from-emerald-100 to-green-200",
  "from-yellow-100 to-amber-200",
  "from-sky-100 to-cyan-200",
  "from-orange-100 to-orange-200",
];

const testimonialGradients = [
  "from-pink-100 to-pink-200",
  "from-blue-100 to-blue-200",
  "from-green-100 to-green-200",
];

const Logo = () => (
    <Link
        href="https://www.kartavyatech.com/"
        className="flex items-center font-bold"
    >
        <Image
            src="/kartavya-logo.png"
            alt="Kartavya Logo"
            width={56}
            height={56}
            className="h-14 w-14 animate-spin-slow"
        />
        <span className="text-3xl text-foreground">Kartavya</span>
    </Link>
);

export default function LandingPage() {
    const [open, setOpen] = useState(false);
    return (
        // <div className="min-h-screen bg-background">
         <main className="relative min-h-screen overflow-hidden">
          <VantaFog />
                <div className="relative min-h-screen bg-background overflow-hidden">
                {/* VantaFog canvas */}
                
                {/* Header */}
                <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="container mx-auto px-3 md:px-8 py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <Logo />
                            </div>

                            {/* Desktop Nav */}
                            <nav className="hidden md:flex items-center gap-8">
                                <a
                                    href="#features"
                                    className="text-foreground hover:text-primary transition-colors font-medium"
                                >
                                    Features
                                </a>
                                <a
                                    href="#benefits"
                                    className="text-foreground hover:text-primary transition-colors font-medium"
                                >
                                    Benefits
                                </a>
                                <a
                                    href="#testimonials"
                                    className="text-foreground hover:text-primary transition-colors font-medium"
                                >
                                    Reviews
                                </a>
                                <Link
                                    href="/lead-discovery"
                                    className="text-foreground hover:text-primary transition-colors font-medium"
                                >
                                    Platform
                                </Link>
                            </nav>

                            {/* Buttons + Mobile Menu Toggle */}
                           <div className="flex items-center gap-3">
                            <SignInButton>
                                <Link href="/lead-discovery" className="relative inline-block px-8 py-3 rounded-full bg-primary text-white font-semibold overflow-hidden group">
                                <span className="relative z-10">Sign In</span>
                                <span
                                    className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-400 opacity-80 blur-md animate-shimmer"
                                    style={{ filter: 'blur(8px)' }}
                                />
                                </Link>
                            </SignInButton>
                            
                            <Link href="/lead-discovery" className="relative inline-block px-8 py-3 rounded-full bg-primary text-white font-semibold overflow-hidden group">
                                <span className="relative z-10">Get Started Free</span>
                                <span
                                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-400 opacity-80 blur-md animate-shimmer"
                                style={{ filter: 'blur(8px)' }}
                                />
                            </Link>
                            </div>
                        </div>

                        {/* Mobile Nav */}
                        {open && (
                            <div className="md:hidden mt-4 flex flex-col gap-4">
                                <a
                                    href="#features"
                                    className="text-foreground hover:text-primary transition-colors font-medium"
                                >
                                    Features
                                </a>
                                <a
                                    href="#benefits"
                                    className="text-foreground hover:text-primary transition-colors font-medium"
                                >
                                    Benefits
                                </a>
                                <a
                                    href="#testimonials"
                                    className="text-foreground hover:text-primary transition-colors font-medium"
                                >
                                    Reviews
                                </a>
                                <Link
                                    href="/lead-discovery"
                                    className="text-foreground hover:text-primary transition-colors font-medium"
                                >
                                    Platform
                                </Link>
                                <SignInButton>
                                <button className="relative inline-block px-8 py-3 rounded-full bg-primary text-white font-semibold overflow-hidden group">
                                    <span className="relative z-10"><Link href="/lead-discovery">
                                       Sign In
                                    </Link></span>
                                    <span
                                        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-400 opacity-80 blur-md animate-shimmer"
                                        style={{ filter: 'blur(8px)' }}
                                    />
                                </button>
                                </SignInButton>
                                <button className="relative inline-block px-8 py-3 rounded-full bg-primary text-white font-semibold overflow-hidden group">
                                    <span className="relative z-10"><Link href="/lead-discovery">
                                        Get Started Free
                                    </Link></span>
                                    <span
                                        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-400 opacity-80 blur-md animate-shimmer"
                                        style={{ filter: 'blur(8px)' }}
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Hero Section */}
                    <section className="relative isolate bg-gradient-to-br from-primary/10 via-white to-accent/10 py-32 px-6 md:px-10 text-foreground overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-20 blur-3xl" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #3B82F6 0%, transparent 40%), radial-gradient(circle at 70% 70%, #346feeff 0%, transparent 40%)' }} />
                    
                    <div className="container mx-auto text-center relative z-10">
                        <Badge className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20 text-sm px-6 py-2">
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI-Powered Lead Generation Platform
                        </Badge>
                        {/* <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-8 leading-tight text-center">
                            Generate <span className="text-primary">Qualified</span> Leads
                            <br />
                            <span className="text-primary">Automatically</span>
                        </h1> */}
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-8 leading-tight text-center">
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-md">
                                Generate
                            </span>{" "}
                            <span className="bg-gradient-to-r from-sky-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                                Qualified Leads
                            </span>
                            <br />
                            <span className="inline-block px-6 py-2 mt-4 text-xl md:text-2xl rounded-full bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 text-indigo-700 shadow-lg transition-transform duration-300 hover:scale-105">
                                Automatically
                            </span>
                            </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                        Transform your sales pipeline with AI-driven lead
                        discovery and personalized outreach. Generate 10x more
                        qualified prospects while eliminating manual prospecting
                        forever.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        {/* <Button style={{ backgroundColor: "#6366f1", color: "#fff",padding:"25px" ,fontSize:"20px"}}>
                          Start Free Trial
                        </Button> */}
                         <button className="relative inline-block px-8 py-3 rounded-full bg-primary text-white font-semibold overflow-hidden group">
                            <span className="relative z-10">Start Free Trial</span>
                            <span
                                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-400 opacity-80 blur-md animate-shimmer"
                                style={{ filter: 'blur(8px)' }}
                            />
                        </button>
                        <button className="relative inline-block px-8 py-3 rounded-full bg-primary text-white font-semibold overflow-hidden group">
                            <span className="relative z-10">Watch Demo</span>
                            <span
                                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-400 opacity-80 blur-md animate-shimmer"
                                style={{ filter: 'blur(8px)' }}
                            />
                        </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4 group-hover:scale-110 transition-transform">
                                <stat.icon className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                {stat.value}
                            </div>
                            <div className="text-muted-foreground font-medium">
                                {stat.label}
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    </section>

                {/* Features Section */}
                    <section className="py-16 px-4 md:px-8 bg-white">
                        <h2 className="text-4xl font-extrabold text-center text-primary mb-12">
                            Key Features
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                <div
                                    key={index}
                                    className={`rounded-xl p-6 shadow-md ${feature.gradient} transition-transform hover:scale-105 duration-300`}
                                >
                                    <Icon className="h-8 w-8 text-primary mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-700">{feature.description}</p>
                                </div>
                                );
                            })}
                            </div>
                    </section>
                {/* Benefits Section */}
                <section id="benefits" className="py-24 px-6 bg-gradient-to-tr from-gray-50 via-white to-gray-100 text-gray-900">
                    <div className="container mx-auto max-w-7xl text-center">
                        <h2 className="text-5xl font-extrabold mb-14 tracking-tight">
                        Why Teams <span className="text-primary">Choose Us</span>
                        </h2>

                        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className={`bg-gradient-to-br ${benefitGradients[index % benefitGradients.length]} text-gray-900 rounded-3xl p-8 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300`}
                                >
                                <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-full bg-white/80 text-primary text-2xl shadow">
                                    <CheckCircle className="w-7 h-7" />
                                </div>
                                <h3 className="uppercase text-sm font-semibold tracking-widest text-primary mb-3">
                                    Benefit
                                </h3>
                                <p className="text-base font-medium leading-relaxed">
                                    {benefit.split(' ').map((word, i) => {
                                    const isHighlight = /(\d+%?|\d+x)/.test(word);
                                    return (
                                        <span
                                        key={i}
                                        className={isHighlight ? 'text-accent font-semibold' : ''}
                                        >
                                        {word + ' '}
                                        </span>
                                    );
                                    })}
                                </p>
                                </div>
                        ))}
                        </div>

                        <div className="mt-16">
                        <Link
                            href="/lead-discovery"
                            className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50 transition relative overflow-hidden group"
                        >
                            Start Generating Leads
                            <ArrowRight className="ml-4 w-6 h-6" aria-hidden="true" />
                            <span className="absolute bottom-0 left-0 w-0 h-1 bg-accent transition-all group-hover:w-full"></span>
                        </Link>
                        </div>
                    </div>
                    </section>

                {/* Testimonials Section */}
            <section id="testimonials" className="py-24 px-6 bg-gradient-to-br from-pink-50 via-white to-rose-100">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-20">
                    <Badge className="mb-6 bg-accent/10 text-accent border border-accent/20">
                        Customer Success
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                        Trusted by Industry Leaders
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        See how companies are transforming their sales with LeadGen Pro
                    </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card
                        key={index}
                        className={`bg-gradient-to-br ${testimonialGradients[index % testimonialGradients.length]} text-gray-900 rounded-2xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300`}>
                        <CardHeader className="pb-4">
                            <div className="flex gap-1 mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                key={i}
                                className="h-5 w-5 text-accent fill-accent/80 group-hover:scale-110 transition-transform"
                                />
                            ))}
                            </div>
                            <CardDescription className="text-base text-gray-700 leading-relaxed font-medium">
                            “{testimonial.content}”
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-4">
                            <div className="flex items-center gap-4">
                            <Image
                                src={testimonial.avatar || "/placeholder.svg"}
                                alt={testimonial.name}
                                className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
                                width={48}
                                height={48}
                            />
                            <div>
                                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                <div className="text-sm text-gray-500">{testimonial.role}</div>
                                <Badge variant="outline" className="mt-1 text-xs border-accent/20 text-accent bg-accent/10">
                                {testimonial.company}
                                </Badge>
                            </div>
                            </div>
                        </CardContent>
                        </Card>
                    ))}
                    </div>
                </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-8 relative overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#caf0f8] via-white to-[#ade8f4]" />
                    <div className="container mx-auto text-center relative z-10">
                        <Card className="border border-gray-200 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl max-w-5xl mx-auto">
                        <CardHeader className="pb-8">
                            <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20 mx-auto">
                            Ready to Transform Your Sales?
                            </Badge>

                            <CardTitle className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                           
                            <span className="bg-gradient-to-r from-sky-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-semibold">  Start Generating Qualified Leads in 24 Hours</span>
                            </CardTitle>

                            <CardDescription className="text-xl leading-relaxed max-w-3xl mx-auto text-gray-700">
                            Join thousands of businesses already using LeadGen Pro to scale their
                            sales pipeline. Get started with our free trial and see immediate
                            results.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pb-12">
                            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-6">
                            <button className="relative inline-block px-8 py-3 rounded-full bg-primary text-white font-semibold overflow-hidden group">
                            <span className="relative z-10">
                                 Start Free Trial
                            </span>
                            <span
                                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-400 opacity-80 blur-md animate-shimmer"
                                style={{ filter: 'blur(8px)' }}
                            />
                        </button>                            
                            <button className="relative inline-block px-8 py-3 rounded-full bg-primary text-white font-semibold overflow-hidden group">
                            <span className="relative z-10">Schedule Demo</span>
                            <span
                                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-400 opacity-80 blur-md animate-shimmer"
                                style={{ filter: 'blur(8px)' }}
                            />
                        </button>
                            </div>

                            <p className="text-sm text-muted-foreground mt-2">
                            ✓ No credit card required • ✓ 14-day free trial • ✓ Cancel anytime
                            </p>
                        </CardContent>
                        </Card>
                    </div>
                    </section>

                {/* Footer */}
                <footer className="border-t border-border bg-muted/30 py-12 px-8">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <Target className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-serif font-bold text-foreground text-lg">
                                    LeadGen Pro
                                </span>
                            </div>
                            <div className="flex items-center gap-8">
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Privacy
                                </a>
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Terms
                                </a>
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Support
                                </a>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                © 2024 LeadGen Pro. All rights reserved.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
         </main>
    );
}
