"use client";

import type React from "react";

import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Menu, X } from "lucide-react";
import { SignInButton } from '@clerk/nextjs'

import {
    Upload,
    Search,
    Users,
    Target,
    TrendingUp,
    Mail,
    Building,
    User,
    Star,
    ExternalLink,
    Download,
    Loader2,
    CheckCircle,
    AlertCircle,
    Brain,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
interface ApiResponse {
    emails: Array<{
        body: string;
        email: string;
        name: string;
        subject: string;
    }>;
    profiles: string[];
    processed_count: number;
    processed_names: string[];
    errors: string[];
    message: string;
}

interface EnhancedLead {
    name: string;
    email: string;
    company: string;
    title: string;
    profile: string;
    score: number;
    emailContent: {
        subject: string;
        body: string;
    };
    source: "CSV" | "AI Agent";
    linkedin?: string;
    website?: string;
}

interface LeadAgentParams {
    niche: string;
    service: string;
    location: string;
    designation: string;
    no_of: string;
    size: string;
    date_range: string;
}

interface LeadAgentResponse {
    companies: Array<{
        description: string;
        name: string;
        reason: string;
        website: string;
    }>;
    contacts: Array<{
        company: string;
        email: string;
        full_name: string;
        linkedin_url: string;
        title: string;
    }>;
    emails: Array<{
        body: string;
        email: string;
        name: string;
        subject: string;
    }>;
    message: string;
}

interface EmailCredentials {
    sender_email: string;
    sender_password: string;
    smtp_host: string;
    smtp_port: number;
    use_ssl: boolean;
}

const Logo = () => (
    <Link
        href="https://www.kartavyatech.com/"
        className="flex items-center font-bold"
    >
        <Image
            src='/kartavya-logo.png'
            alt="Kartavya Logo"
            width={56}
            height={56}
            className={`h-14 w-14 animate-spin-slow`}
        />
        <span className="text-3xl text-zinc-500">Kartavya</span>
    </Link>
);

export default function LeadDiscoveryPage() {
    const [file, setFile] = useState<File | null>(null);
    const [profilePrompt, setProfilePrompt] = useState(
        "Write a professional with keywords type sentences no bluff at all even consider including only relevant stuff in summary for the person"
    );
    const [emailPrompt, setEmailPrompt] = useState(
        "make a more generous and little funny plus a formal and my details are like this varun rao a person who is responsible for ai ml team at Kartavya"
    );
    const [isProcessing, setIsProcessing] = useState(false);
    const [apiResults, setApiResults] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [enhancedLeads, setEnhancedLeads] = useState<EnhancedLead[]>([]);

    const [leadAgentParams, setLeadAgentParams] = useState<LeadAgentParams>({
    niche: "healthcare",
    service: "Telemedicine Platforms",
    location: "Mumbai",
    designation: "cto",
    no_of: "1",
    size: "mid",
    date_range: "30 days",
});

    const [leadAgentResults, setLeadAgentResults] =
        useState<LeadAgentResponse | null>(null);
    const [isProcessingLeadAgent, setIsProcessingLeadAgent] = useState(false);
    const [leadAgentLeads, setLeadAgentLeads] = useState<EnhancedLead[]>([]);

  // ✅ Automatically add new AI leads to allLeads
    const [emailCredentials, setEmailCredentials] = useState<EmailCredentials>({
        sender_email: "",
        sender_password: "",
        smtp_host: "smtp.zoho.in",
        smtp_port: 465,
        use_ssl: true,
    });
    const [isSavingCredentials, setIsSavingCredentials] = useState(false);
    const [credentialsSaved, setCredentialsSaved] = useState(false);
    const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set());

    const calculateLeadScore = (profile: string, email: string): number => {
    let score = 60; // Base score

    // Defensive fallback for email
    if (typeof email !== "string" || !email.includes("@")) {
        email = ""; // or you can skip email scoring here
    }

    // Email domain scoring
    const domain = email.split("@")[1]?.toLowerCase();
    if (
        domain?.includes("gmail") ||
        domain?.includes("yahoo") ||
        domain?.includes("hotmail")
    ) {
        score -= 10; // Personal email domains
    } else if (domain) {
        score += 15; // Business email domains
    }

    // Profile content scoring
    const profileLower = profile.toLowerCase();
    const seniorityKeywords = [
        "ceo",
        "cto",
        "vp",
        "director",
        "head",
        "chief",
        "senior",
        "lead",
        "manager",
    ];
    const techKeywords = [
        "ai",
        "ml",
        "software",
        "tech",
        "data",
        "engineering",
        "development",
    ];
    const industryKeywords = [
        "saas",
        "startup",
        "enterprise",
        "b2b",
        "platform",
        "solution",
    ];

    seniorityKeywords.forEach((keyword) => {
        if (profileLower.includes(keyword)) score += 8;
    });

    techKeywords.forEach((keyword) => {
        if (profileLower.includes(keyword)) score += 5;
    });

    industryKeywords.forEach((keyword) => {
        if (profileLower.includes(keyword)) score += 3;
    });

    // Profile length and quality
    if (profile.length > 100) score += 5;
    if (profile.length > 200) score += 5;

    return Math.min(Math.max(score, 0), 100);
};

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === "text/csv") {
            setFile(selectedFile);
            setError(null);
        } else {
            setError("Please select a valid CSV file");
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError("Please select a CSV file");
            return;
        }

        setIsProcessing(true);
        setError(null);
        setApiResults(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("profile_prompt", profilePrompt);
        formData.append("email_prompt", emailPrompt);

        try {
            const response = await fetch(
                `${API_BASE_URL}/`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to process CSV");
            }

            const result: ApiResponse = await response.json();
            setApiResults(result);

            // Transform API results into enhanced leads
            const leads: EnhancedLead[] = result.emails.map((email, index) => {
                const profile =
                    result.profiles[index] || "No profile available";
                const score = calculateLeadScore(profile, email.email);

                return {
                    name: email.name,
                    email: email.email,
                    company: email.name.split(" ").slice(-1)[0] + " Corp", 
                    title: "Decision Maker",
                    profile,
                    score,
                    emailContent: {
                        subject: email.subject,
                        body: email.body,
                    },
                    source: "CSV" as const,
                };
            });
            setEnhancedLeads(leads);
            } catch (err) {
                console.error("Error processing CSV:", err);
                setError("Failed to process CSV file");
            } finally {
                setIsProcessing(false);
            }
        };

        const handleLeadAgentSubmit = async () => {
    setIsProcessingLeadAgent(true);
    setError(null);
    setLeadAgentResults(null);

    try {
        console.log("Sending leadAgentParams:", leadAgentParams);

        const response = await fetch(
        `${API_BASE_URL}/generate_leads`, 
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(leadAgentParams),
        }
        );
        const extractCompanyFromProfile = (text: string): string | null => {
        const match = text.match(/(?:at|from|by)\s+([A-Z][a-zA-Z0-9&\-. ]{2,})/);
        return match ? match[1].trim() : null;
        };

        const result = await response.json();
        console.log("Lead agent API response:", result);

        if (!response.ok) {
        const errorMsg = result?.error || result?.detail || "Failed to generate leads";
        if (typeof errorMsg === "string" && errorMsg.includes("RESOURCE_EXHAUSTED")) {
            throw new Error("The AI service is currently overloaded. Please try again later.");
        }
        throw new Error(errorMsg);
        }

        const posts = result.tasks_output?.[0];

        if (!Array.isArray(posts)) {
        throw new Error("Expected posts array in tasks_output[0]");
        }

        const leads: EnhancedLead[] = posts.map((post: any) => ({
        name: post.poster_name || "Unnamed Contact",
        email: undefined,
        company: extractCompanyFromProfile(post.post_excerpt || "") || "Unknown Company",
        title: post.poster_title || "Unknown Title",
        profile: post.why_this_is_a_lead || post.post_excerpt || "No profile available",
        score: calculateLeadScore(post.why_this_is_a_lead || "", post.poster_name),
        emailContent: {
            subject: "No subject",
            body: "No email body",
        },
        source: "AI Agent" as const,
        linkedin: post.linkedin_post_url || undefined,
        website: undefined,
        }));

        console.log(" Final AI leads being set:", leads);
        setLeadAgentLeads(leads);
    } catch (err: any) {
        console.error("Error generating leads:", err);
        setError(err.message || "Failed to generate leads");
    } finally {
        setIsProcessingLeadAgent(false);
    }
    };

    const handleSaveCredentials = async () => {
        setIsSavingCredentials(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/save-credentials`, 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(emailCredentials),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save credentials");
            }

            setCredentialsSaved(true);
            setTimeout(() => setCredentialsSaved(false), 3000);
        } catch (err) {
            console.error("Error saving credentials:", err);
            setError("Failed to save email credentials");
        } finally {
            setIsSavingCredentials(false);
        }
    };

    const handleSendEmail = async (lead: EnhancedLead) => {
        setSendingEmails((prev) => new Set(prev).add(lead.email));
        try {
            const response = await fetch(
                `${API_BASE_URL}/send-emails`, 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        emails: [
                            {
                                email: lead.email,
                                subject: lead.emailContent.subject,
                                body: lead.emailContent.body,
                                is_html: false,
                            },
                        ],
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to send email");
            }

            const result = await response.json();
            console.log("Email sent:", result);
        } catch (err) {
            console.error("Error sending email:", err);
            setError(`Failed to send email to ${lead.name}`);
        } finally {
            setSendingEmails((prev) => {
                const newSet = new Set(prev);
                newSet.delete(lead.email);
                return newSet;
            });
        }
    };

    const exportToCSV = (leads: EnhancedLead[]) => {
        const headers = [
            "Name",
            "Email",
            "Company",
            "Title",
            "Score",
            "Profile",
            "Subject",
            "Email Body",
            "Source",
        ];
        const csvContent = [
            headers.join(","),
            ...leads.map((lead) =>
                [
                    `"${lead.name}"`,
                    `"${lead.email}"`,
                    `"${lead.company}"`,
                    `"${lead.title}"`,
                    lead.score,
                    `"${lead.profile.replace(/"/g, '""')}"`,
                    `"${lead.emailContent.subject.replace(/"/g, '""')}"`,
                    `"${lead.emailContent.body.replace(/"/g, '""')}"`,
                    `"${lead.source}"`,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

   
    const discoveredLeads: EnhancedLead[] = [
        {
            name: "Sarah Johnson",
            email: "sarah.johnson@techcorp.com",
            company: "TechCorp Solutions",
            title: "VP of Engineering",
            profile:
                "Experienced engineering leader with 10+ years in SaaS development and team management.",
            score: 92,
            emailContent: {
                subject: "Partnership Opportunity for TechCorp Solutions",
                body: "Hi Sarah, I noticed TechCorp's recent expansion into AI solutions...",
            },
            source: "AI Agent",
            linkedin: "https://linkedin.com/in/sarahjohnson",
            website: "https://techcorp.com",
        },
        {
            name: "Michael Chen",
            email: "m.chen@innovateai.com",
            company: "InnovateAI",
            title: "CTO",
            profile:
                "AI/ML expert leading technical strategy for enterprise AI solutions.",
            score: 88,
            emailContent: {
                subject: "AI Development Partnership",
                body: "Hello Michael, Your work on enterprise AI caught our attention...",
            },
            source: "AI Agent",
            linkedin: "https://linkedin.com/in/michaelchen",
            website: "https://innovateai.com",
        },
    ];

    const allLeads = [...discoveredLeads, ...enhancedLeads, ...leadAgentLeads];
    const qualifiedLeads = allLeads.filter((lead) => lead.score >= 85);

     const [open, setOpen] = useState(false);

    return (
      <div>
         <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-3 md:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <Logo />
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link
                                href="/"
                                className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                href="#features"
                                className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                                Features
                            </Link>
                            <Link
                                href="#benefits"
                                className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                                Benefits
                            </Link>
                            <Link
                                href="#testimonials"
                                className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                                Reviews
                            </Link>
                            <Link
                                href="/lead-discovery"
                                className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                                Platform
                            </Link>
                        </nav>

                        {/* Buttons + Mobile Menu Toggle */}
                        <div className="flex items-center gap-3">
                            <SignInButton mode="modal">
                                <Button
                                variant="ghost"
                                className="hidden sm:inline-flex"
                                >
                                Sign In
                                </Button>
                            </SignInButton>
                            <button
                                className="md:hidden"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Nav */}
                    {open && (
                        <div className="md:hidden mt-4 flex flex-col gap-4">
                           <Link
                                href="/"
                                className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                href="#features"
                                className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                                Features
                            </Link>
                            <Link
                                href="#benefits"
                                className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                                Benefits
                            </Link>
                            <Link
                                href="#testimonials"
                                className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                                Reviews
                            </Link >
                            <Link
                                href="/lead-discovery"
                                className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                                Platform
                            </Link>
                            <Link
                                href="/lead-discovery"
                                className="text-foreground font-bold hover:text-primary transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </header>
        <div className="min-h-screen bg-background py-12 px-3 md:px-12">
          
            <div className="container mx-auto max-w-7xl">
                <div className="mb-12">
                    <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
                        Lead Discovery
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Discover and qualify high-value prospects with
                        AI-powered lead generation
                    </p>
                </div>

                <Tabs defaultValue="discovery" className="space-y-3 ">
                    <TabsList className="grid w-full grid-cols-4 ">
                        <TabsTrigger
                            value="discovery"
                            className="text-xs sm:text-sm md:text-lg"
                        >
                            Lead Discovery
                        </TabsTrigger>
                        <TabsTrigger
                            value="csv-upload"
                            className="text-xs sm:text-sm md:text-lg"
                        >
                            CSV Upload
                        </TabsTrigger>
                        {/* <TabsTrigger
                            value="email-setup"
                            className="text-xs sm:text-sm md:text-lg"
                        >
                            Email Setup
                        </TabsTrigger> */}
                        <TabsTrigger
                            value="results"
                            className="text-xs sm:text-sm md:text-lg"
                        >
                            Results
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="discovery" className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                            {/* AI Lead Agent */}
                            <Card className="border-border">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                                            <Brain className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-serif">
                                                AI Lead Agent
                                            </CardTitle>
                                            <CardDescription>
                                                Generate targeted leads based on
                                                specific criteria
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="niche">Niche</Label>
                                            <Input
                                                id="niche"
                                                value={leadAgentParams.niche}
                                                onChange={(e) =>
                                                    setLeadAgentParams({
                                                        ...leadAgentParams,
                                                        niche: e.target.value,
                                                    })
                                                }
                                                placeholder="e.g., AI and Machine Learning"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="designation">
                                                Target Designation
                                            </Label>
                                            <Input
                                                id="designation"
                                                value={
                                                    leadAgentParams.designation
                                                }
                                                onChange={(e) =>
                                                    setLeadAgentParams({
                                                        ...leadAgentParams,
                                                        designation:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="e.g., CTO"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="service">
                                                Service
                                            </Label>
                                            <Input
                                                id="service"
                                                value={leadAgentParams.service}
                                                onChange={(e) =>
                                                    setLeadAgentParams({
                                                        ...leadAgentParams,
                                                        service: e.target.value,
                                                    })
                                                }
                                                placeholder="e.g., Software Development"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                        <Label htmlFor="no_of">Number of Leads</Label>
                                        <Input
                                            id="no_of"
                                            type="number"
                                            value={leadAgentParams.no_of}
                                            onChange={(e) =>
                                                setLeadAgentParams({
                                                    ...leadAgentParams,
                                                    no_of: e.target.value, 
                                                })
                                            }
                                            placeholder="10"
                                            min="1"
                                            max="50"
                                        />
                                        </div>
                                        <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={leadAgentParams.location}
                                            onChange={(e) =>
                                                setLeadAgentParams({
                                                    ...leadAgentParams,
                                                    location: e.target.value,
                                                })
                                            }
                                            placeholder="e.g., Mumbai"
                                        />
                                    </div>
                                <div className="space-y-2">
                                    <Label htmlFor="size">Company Size</Label>
                                    <Input
                                        id="size"
                                        value={leadAgentParams.size}
                                        onChange={(e) =>
                                            setLeadAgentParams({
                                                ...leadAgentParams,
                                                size: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., mid"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date_range">Date Range</Label>
                                    <Input
                                        id="date_range"
                                        value={leadAgentParams.date_range}
                                        onChange={(e) =>
                                            setLeadAgentParams({
                                                ...leadAgentParams,
                                                date_range: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., 30 days"
                                    />
                                </div>


                                    <Button
                                        onClick={handleLeadAgentSubmit}
                                        disabled={isProcessingLeadAgent}
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        {isProcessingLeadAgent ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Discovering Leads...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="mr-2 h-4 w-4" />
                                                Discover Leads
                                            </>
                                        )}
                                    </Button>

                                    {leadAgentResults && (
                                        <Alert>
                                            <CheckCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                Successfully generated{" "}
                                                {leadAgentLeads.length} leads
                                                with personalized email content!
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <Card className="border-border">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-primary" />
                                                <CardTitle className="text-sm">
                                                    Total Leads
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-primary">
                                                {allLeads.length}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Discovered prospects
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-border">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-2">
                                                <Target className="h-4 w-4 text-accent" />
                                                <CardTitle className="text-sm">
                                                    Qualified
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-accent">
                                                {qualifiedLeads.length}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Score ≥ 85
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card className="border-border">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-serif">
                                            Qualified Leads
                                        </CardTitle>
                                        <CardDescription>
                                            High-scoring prospects ready for
                                            outreach
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {qualifiedLeads
                                            .slice(0, 3)
                                            .map((lead, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                                                >
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-foreground">
                                                            {lead.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {lead.title} at{" "}
                                                            {lead.company}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-accent/10 text-accent"
                                                            >
                                                                Score:{" "}
                                                                {lead.score}
                                                            </Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {lead.source}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        {qualifiedLeads.length > 3 && (
                                            <div className="text-center text-sm text-muted-foreground">
                                                +{qualifiedLeads.length - 3}{" "}
                                                more qualified leads
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="csv-upload" className="space-y-8 mt-10">
                        <Card className="border-border">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                                        <Upload className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-serif">
                                            CSV Upload
                                        </CardTitle>
                                        <CardDescription>
                                            Upload a CSV file to generate
                                            personalized profiles and emails
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="csv-file">
                                            CSV File
                                        </Label>
                                        <Input
                                            id="csv-file"
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileUpload}
                                        />
                                        {file && (
                                            <div className="text-sm text-muted-foreground">
                                                Selected: {file.name} (
                                                {(file.size / 1024).toFixed(1)}{" "}
                                                KB)
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="profile-prompt">
                                            Profile Generation Prompt
                                        </Label>
                                        <Textarea
                                            id="profile-prompt"
                                            value={profilePrompt}
                                            onChange={(e) =>
                                                setProfilePrompt(e.target.value)
                                            }
                                            rows={3}
                                            placeholder="Instructions for generating professional profiles..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email-prompt">
                                            Email Generation Prompt
                                        </Label>
                                        <Textarea
                                            id="email-prompt"
                                            value={emailPrompt}
                                            onChange={(e) =>
                                                setEmailPrompt(e.target.value)
                                            }
                                            rows={3}
                                            placeholder="Instructions for generating personalized emails..."
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={!file || isProcessing}
                                    className="w-full"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing CSV...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Process CSV
                                        </>
                                    )}
                                </Button>

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            {error}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {apiResults && (
                                    <Alert>
                                        <CheckCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            <strong>
                                                Processing Complete!
                                            </strong>
                                            <br />
                                            Processed:{" "}
                                            {apiResults.processed_count} records
                                            <br />
                                            Generated:{" "}
                                            {apiResults.emails.length}{" "}
                                            personalized emails
                                            <br />
                                            Profiles:{" "}
                                            {apiResults.profiles.length}{" "}
                                            professional summaries
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {enhancedLeads.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">
                                                Generated Leads
                                            </h3>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    exportToCSV(enhancedLeads)
                                                }
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Export All
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6">
                                            {enhancedLeads.map(
                                                (lead, index) => (
                                                    <Card
                                                        key={index}
                                                        className="border-border"
                                                    >
                                                        <CardHeader className="pb-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <CardTitle className="text-lg">
                                                                            {
                                                                                lead.name
                                                                            }
                                                                        </CardTitle>
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className="bg-accent/10 text-accent"
                                                                        >
                                                                            Score:{" "}
                                                                            {
                                                                                lead.score
                                                                            }
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                                                        <div className="flex items-center gap-1">
                                                                            <Building className="h-4 w-4" />
                                                                            {
                                                                                lead.company
                                                                            }
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <User className="h-4 w-4" />
                                                                            {
                                                                                lead.title
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                                        {
                                                                            lead.profile
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="space-y-4">
                                                            <div className="bg-muted/50 rounded-lg p-4">
                                                                <h4 className="font-semibold mb-2">
                                                                    Generated
                                                                    Email
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    <div>
                                                                        <span className="text-sm font-medium">
                                                                            Subject:{" "}
                                                                        </span>
                                                                        <span className="text-sm">
                                                                            {
                                                                                lead
                                                                                    .emailContent
                                                                                    .subject
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-sm font-medium">
                                                                            Body:{" "}
                                                                        </span>
                                                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                                                            {
                                                                                lead
                                                                                    .emailContent
                                                                                    .body
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                                    <Mail className="h-4 w-4" />
                                                                    {lead.email}
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* <TabsContent value="email-setup" className="space-y-8 mt-10">
                        <Card className="border-border">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-serif">
                                            Email Configuration
                                        </CardTitle>
                                        <CardDescription>
                                            Configure your email credentials for
                                            sending personalized emails
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sender_email">
                                            Sender Email
                                        </Label>
                                        <Input
                                            id="sender_email"
                                            type="email"
                                            value={
                                                emailCredentials.sender_email
                                            }
                                            onChange={(e) =>
                                                setEmailCredentials({
                                                    ...emailCredentials,
                                                    sender_email:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="your-email@zoho.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sender_password">
                                            App Password
                                        </Label>
                                        <Input
                                            id="sender_password"
                                            type="password"
                                            value={
                                                emailCredentials.sender_password
                                            }
                                            onChange={(e) =>
                                                setEmailCredentials({
                                                    ...emailCredentials,
                                                    sender_password:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="Your app-specific password"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="smtp_host">
                                            SMTP Host
                                        </Label>
                                        <Input
                                            id="smtp_host"
                                            value={emailCredentials.smtp_host}
                                            onChange={(e) =>
                                                setEmailCredentials({
                                                    ...emailCredentials,
                                                    smtp_host: e.target.value,
                                                })
                                            }
                                            placeholder="smtp.zoho.in"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="smtp_port">
                                            SMTP Port
                                        </Label>
                                        <Input
                                            id="smtp_port"
                                            type="number"
                                            value={emailCredentials.smtp_port}
                                            onChange={(e) =>
                                                setEmailCredentials({
                                                    ...emailCredentials,
                                                    smtp_port: Number.parseInt(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            placeholder="465"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="use_ssl"
                                        checked={emailCredentials.use_ssl}
                                        onChange={(e) =>
                                            setEmailCredentials({
                                                ...emailCredentials,
                                                use_ssl: e.target.checked,
                                            })
                                        }
                                        className="rounded border-border"
                                    />
                                    <Label htmlFor="use_ssl">Use SSL</Label>
                                </div>

                                <Button
                                    onClick={handleSaveCredentials}
                                    disabled={
                                        isSavingCredentials ||
                                        !emailCredentials.sender_email ||
                                        !emailCredentials.sender_password
                                    }
                                    className="w-full"
                                >
                                    {isSavingCredentials ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving Credentials...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Save Email Credentials
                                        </>
                                    )}
                                </Button>

                                {credentialsSaved && (
                                    <Alert>
                                        <CheckCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Email credentials saved
                                            successfully! You can now send
                                            emails to your leads.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="bg-muted/50 rounded-lg p-4">
                                    <h4 className="font-semibold mb-2">
                                        Popular SMTP Settings
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <strong>Zoho:</strong> smtp.zoho.in,
                                            Port 465 (SSL)
                                        </div>
                                        <div>
                                            <strong>Gmail:</strong>{" "}
                                            smtp.gmail.com, Port 587 (TLS) or
                                            465 (SSL)
                                        </div>
                                        <div>
                                            <strong>Outlook:</strong>{" "}
                                            smtp-mail.outlook.com, Port 587
                                            (TLS)
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent> */}

                    <TabsContent value="results" className="space-y-8">
                        <div className="my-8 space-y-4">
                            <h2 className="text-2xl font-semibold mb-4">Discovered Leads</h2>

                            {allLeads.length === 0 ? (
                            <p className="text-gray-500">No leads found yet. Upload CSV or generate leads.</p>
                            ) : (
                            <>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {allLeads.map((lead) => (
                                    <Card key={`${lead.email}-${lead.name}`} className="border border-gray-300 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                        <span>{lead.name}</span>
                                        <Badge className={lead.score >= 85 ? "bg-green-100 text-green-700" : "bg-muted"}>
                                            Score: {lead.score}
                                        </Badge>
                                        </CardTitle>
                                        <CardDescription className="text-sm text-gray-600">
                                        {lead.title} @ {lead.company}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="mb-2 text-gray-700">{lead.profile}</p>
                                            {lead.email && (
                                                <div className="mb-3">
                                                <strong>Email:</strong>{" "}
                                                <a href={`mailto:${lead.email}`} className="text-blue-600 underline">
                                                    {lead.email}
                                                </a>
                                                </div>
                                            )}

                                            <div className="flex space-x-3 mb-4">
                                                {lead.linkedin && (
                                                <a
                                                    href={lead.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                    title="LinkedIn Profile"
                                                >
                                                    LinkedIn
                                                </a>
                                                )}

                                                {lead.website && (
                                                <a
                                                    href={lead.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                    title="Company Website"
                                                >
                                                    Website
                                                </a>
                                                )}
                                            </div>
                                            {lead.emailContent.subject !== "No subject" && (
                                    <div className="mb-4">
                                        <strong>Email Subject:</strong>
                                        <p className="italic text-gray-600">{lead.emailContent.subject}</p>
                                    </div>
                                    )}

                                    {lead.emailContent.body !== "No email body" && (
                                    <div className="mb-4">
                                        <strong>Email Body:</strong>
                                        <p className="whitespace-pre-wrap text-gray-600">{lead.emailContent.body}</p>
                                    </div>
                                    )}

                                    {lead.email ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSendEmail(lead)}
                                        disabled={sendingEmails.has(lead.email)}
                                    >
                                        {sendingEmails.has(lead.email) ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                        ) : (
                                        "Send Email"
                                        )}
                                    </Button>
                                    ) : (
                                    <p className="text-sm text-gray-400 italic">No email available to send</p>
                                    )}
                                    </CardContent>
                                    </Card>
                                ))}
                                </div>

                                <div className="mt-6">
                                <Button onClick={() => exportToCSV(allLeads)}>Export Leads as CSV</Button>
                                </div>
                            </>
                            )}
                        </div>
                        </TabsContent>
                </Tabs>
            </div>
        </div>
      </div>
    );
}