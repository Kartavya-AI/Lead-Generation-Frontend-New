import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Discovery",
    description: "Advanced machine learning algorithms identify your ideal prospects from millions of data points.",
    gradient: "from-primary/20 to-accent/20",
  },
  {
    icon: Zap,
    title: "Smart Qualification",
    description: "Intelligent scoring system ranks leads by conversion probability using 50+ data signals.",
    gradient: "from-accent/20 to-primary/20",
  },
  {
    icon: Sparkles,
    title: "Hyper-Personalization",
    description: "AI crafts unique messages for each prospect based on their industry, role, and recent activity.",
    gradient: "from-primary/20 to-accent/20",
  },
  {
    icon: Rocket,
    title: "Automated Sequences",
    description: "Multi-touch campaigns that adapt timing and messaging based on recipient engagement patterns.",
    gradient: "from-accent/20 to-primary/20",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "Real-time insights and forecasting to optimize your outreach strategy and maximize ROI.",
    gradient: "from-primary/20 to-accent/20",
  },
  {
    icon: Users,
    title: "Seamless Integration",
    description: "Native CRM sync with Salesforce, HubSpot, and Pipedrive for unified lead management.",
    gradient: "from-accent/20 to-primary/20",
  },
]

const benefits = [
  "Generate 10x more qualified leads in half the time",
  "Achieve 85% higher response rates with AI personalization",
  "Eliminate 20+ hours of manual prospecting weekly",
  "Scale outreach to thousands while maintaining quality",
  "Get predictive insights for continuous optimization",
]

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
]

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
    content: "The AI personalization is incredible. Our email response rates jumped from 2% to 18% in just 30 days.",
    rating: 5,
    avatar: "/professional-man.png",
    company: "GrowthLab",
  },
  {
    name: "Emily Watson",
    role: "Head of Marketing, ScaleUp",
    content: "We eliminated 25 hours of manual work weekly while generating 400% more qualified opportunities.",
    rating: 5,
    avatar: "/professional-woman-marketing.png",
    company: "ScaleUp",
  },
]

const stats = [
  { value: "500K+", label: "Leads Generated", icon: Target },
  { value: "85%", label: "Higher Response Rates", icon: TrendingUp },
  { value: "25hrs", label: "Saved Per Week", icon: Clock },
  { value: "300%", label: "Pipeline Growth", icon: Rocket },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LeadGen Pro
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-foreground hover:text-primary transition-colors font-medium">
                Features
              </a>
              <a href="#benefits" className="text-foreground hover:text-primary transition-colors font-medium">
                Benefits
              </a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors font-medium">
                Reviews
              </a>
              <Link href="/lead-discovery" className="text-foreground hover:text-primary transition-colors font-medium">
                Platform
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Sign In
              </Button>
              <Button className="bg-primary hover:bg-primary/90 shadow-lg">Get Started Free</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20 text-base px-6 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Lead Generation Platform
          </Badge>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-8 leading-tight">
            Generate Qualified Leads
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Automatically
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your sales pipeline with AI-driven lead discovery and personalized outreach. Generate 10x more
            qualified prospects while eliminating manual prospecting forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-10 py-4 shadow-xl">
              Start Free Trial
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 py-4 border-2 hover:bg-muted bg-transparent">
              <Play className="mr-3 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">Powerful Features</Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">AI That Actually Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced machine learning and automation tools designed to transform how you discover, qualify, and engage
              with prospects at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 bg-background/50 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-serif font-bold group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">Transform Your Pipeline</Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8">
                Stop Wasting Time on
                <span className="text-primary"> Cold Prospects</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Our AI identifies and engages only the highest-quality prospects who are ready to buy. No more
                spray-and-pray tactics or endless manual research.
              </p>

              <div className="space-y-6 mb-10">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-foreground text-lg font-medium leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link href="/lead-discovery">
                <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-xl">
                  Start Generating Leads
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {useCases.map((useCase, index) => (
                <Card
                  key={index}
                  className="border-border hover:shadow-lg transition-all duration-300 group hover:border-primary/20"
                >
                  <CardHeader>
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <useCase.icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">
                          {useCase.title}
                        </CardTitle>
                        <CardDescription className="text-base mb-2">{useCase.description}</CardDescription>
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          {useCase.stats}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">Customer Success</Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how companies are transforming their sales with LeadGen Pro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-border hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 bg-background/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex gap-2 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed text-foreground font-medium">
                    &quot;{testimonial.content}&quot;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <Badge variant="outline" className="mt-1 text-xs">
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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
        <div className="container mx-auto text-center relative z-10">
          <Card className="border-primary/20 bg-background/80 backdrop-blur-sm max-w-5xl mx-auto shadow-2xl">
            <CardHeader className="pb-8">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 mx-auto">
                Ready to Transform Your Sales?
              </Badge>
              <CardTitle className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                Start Generating Qualified Leads in
                <span className="text-primary"> 24 Hours</span>
              </CardTitle>
              <CardDescription className="text-xl leading-relaxed max-w-3xl mx-auto">
                Join thousands of businesses already using LeadGen Pro to scale their sales pipeline. Get started with
                our free trial and see immediate results.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12">
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-12 py-4 shadow-xl">
                  Start Free Trial
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-12 py-4 border-2 hover:bg-muted bg-transparent"
                >
                  Schedule Demo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                ✓ No credit card required • ✓ 14-day free trial • ✓ Cancel anytime • ✓ Setup in 5 minutes
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
              <span className="font-serif font-bold text-foreground text-lg">LeadGen Pro</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Support
              </a>
            </div>
            <div className="text-sm text-muted-foreground">© 2024 LeadGen Pro. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
