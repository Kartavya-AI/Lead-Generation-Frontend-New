"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Target,
  Search,
  Brain,
  Filter,
  Users,
  Building,
  MapPin,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Star,
  Upload,
  FileText,
  Mail,
  Loader2,
  Download,
  Send,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

const discoveredLeads = [
  {
    name: "Sarah Johnson",
    title: "VP of Marketing",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    employees: "500-1000",
    industry: "Technology",
    score: 92,
    email: "sarah.j@techcorp.com",
    phone: "+1 (555) 123-4567",
    linkedin: "linkedin.com/in/sarahjohnson",
  },
  {
    name: "Michael Chen",
    title: "Director of Sales",
    company: "Growth Dynamics",
    location: "New York, NY",
    employees: "200-500",
    industry: "Consulting",
    score: 88,
    email: "m.chen@growthdynamics.com",
    phone: "+1 (555) 987-6543",
    linkedin: "linkedin.com/in/michaelchen",
  },
  {
    name: "Emily Rodriguez",
    title: "Chief Marketing Officer",
    company: "InnovateLab",
    location: "Austin, TX",
    employees: "100-200",
    industry: "Software",
    score: 95,
    email: "emily@innovatelab.io",
    phone: "+1 (555) 456-7890",
    linkedin: "linkedin.com/in/emilyrodriguez",
  },
]

interface ApiResponse {
  emails: Array<{
    body: string
    email: string
    name: string
    subject: string
  }>
  profiles: Array<{
    name: string
    summary: string
  }>
  errors: string[]
  message: string
  processed_count: number
  processed_names: string[]
}

interface EnhancedLead {
  name: string
  email: string
  profile: string
  emailContent: {
    subject: string
    body: string
  }
  score: number
  company?: string
  title?: string
  industry?: string
}

export default function LeadDiscoveryPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [profilePrompt, setProfilePrompt] = useState(
    "Write a professional with keywords type sentences no bluff at all even consider including only relevant stuff in summary for the person",
  )
  const [emailPrompt, setEmailPrompt] = useState(
    "make a more generous and little funny plus a formal and my details are like this varun rao a person who is responsible for ai ml team at Kartavya",
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [apiResults, setApiResults] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [enhancedLeads, setEnhancedLeads] = useState<EnhancedLead[]>([])
  const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set())

  const calculateLeadScore = (profile: string, email: string): number => {
    let score = 60 // Base score

    // Score based on profile completeness and quality
    if (profile.length > 100) score += 10
    if (profile.includes("experience") || profile.includes("years")) score += 5
    if (profile.includes("manager") || profile.includes("director") || profile.includes("VP")) score += 10
    if (profile.includes("technology") || profile.includes("software") || profile.includes("digital")) score += 5

    // Score based on email domain quality
    const domain = email.split("@")[1]?.toLowerCase()
    if (domain && !["gmail.com", "yahoo.com", "hotmail.com"].includes(domain)) score += 10

    return Math.min(score, 100)
  }

  const handleSendEmail = async (lead: EnhancedLead) => {
    setSendingEmails((prev) => new Set(prev).add(lead.email))

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: lead.email,
          subject: lead.emailContent.subject,
          body: lead.emailContent.body,
          leadName: lead.name,
          campaignId: "csv-upload-" + Date.now(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      // Save to database
      await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...lead,
          status: "email_sent",
          sentAt: new Date().toISOString(),
        }),
      })

      console.log(`[v0] Email sent successfully to ${lead.email}`)
    } catch (err) {
      console.error(`[v0] Failed to send email to ${lead.email}:`, err)
      setError(`Failed to send email to ${lead.name}`)
    } finally {
      setSendingEmails((prev) => {
        const newSet = new Set(prev)
        newSet.delete(lead.email)
        return newSet
      })
    }
  }

  const handleSubmitCsv = async () => {
    if (!csvFile) {
      setError("Please select a CSV file")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", csvFile)
      formData.append("profile_prompt", profilePrompt)
      formData.append("email_prompt", emailPrompt)

      const response = await fetch("https://lead-gen-2-977121587860.asia-south1.run.app/process_csv", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      setApiResults(data)

      const enhanced: EnhancedLead[] = data.emails.map((email) => {
        const profile = data.profiles.find((p) => p.name === email.name)
        const score = calculateLeadScore(profile?.summary || "", email.email)

        return {
          name: email.name,
          email: email.email,
          profile: profile?.summary || "",
          emailContent: {
            subject: email.subject,
            body: email.body,
          },
          score,
        }
      })

      setEnhancedLeads(enhanced)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while processing the CSV")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCsvFile(file)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-serif font-bold text-foreground">LeadGen Pro</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <span className="text-primary font-medium">Lead Discovery</span>
              <Link href="/email-outreach" className="text-muted-foreground hover:text-primary transition-colors">
                Email Outreach
              </Link>
            </nav>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              View All Leads
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-12 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">AI-Powered Lead Discovery</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Define your ideal customer profile and let our AI discover, qualify, and score prospects that match your
            exact requirements.
          </p>
        </div>

        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="discover">Discover Leads</TabsTrigger>
            <TabsTrigger value="csv-upload">CSV Upload</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="qualified">Qualified</TabsTrigger>
          </TabsList>

          {/* Lead Discovery Tab */}
          <TabsContent value="discover" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Search Criteria */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Search Criteria
                  </CardTitle>
                  <CardDescription>Define your ideal customer profile to discover relevant prospects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-size">Company Size</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-1000">201-1000 employees</SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., San Francisco, CA or United States" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job-titles">Target Job Titles</Label>
                    <Textarea
                      id="job-titles"
                      placeholder="e.g., VP Marketing, Director of Sales, CMO, Marketing Manager"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords & Technologies</Label>
                    <Textarea
                      id="keywords"
                      placeholder="e.g., SaaS, CRM, marketing automation, lead generation"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Additional Filters</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="funding" />
                        <Label htmlFor="funding" className="text-sm">
                          Recently funded companies
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="hiring" />
                        <Label htmlFor="hiring" className="text-sm">
                          Currently hiring
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="growth" />
                        <Label htmlFor="growth" className="text-sm">
                          High growth companies
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Brain className="h-4 w-4 mr-2" />
                    Start AI Discovery
                  </Button>
                </CardContent>
              </Card>

              {/* AI Qualification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-accent" />
                    AI Qualification Settings
                  </CardTitle>
                  <CardDescription>Configure how AI scores and qualifies your discovered leads</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Scoring Criteria</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="company-fit" className="text-sm">
                            Company Fit
                          </Label>
                          <Badge variant="secondary">High Priority</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="role-relevance" className="text-sm">
                            Role Relevance
                          </Label>
                          <Badge variant="secondary">High Priority</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="engagement-potential" className="text-sm">
                            Engagement Potential
                          </Label>
                          <Badge variant="outline">Medium Priority</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="timing-signals" className="text-sm">
                            Timing Signals
                          </Label>
                          <Badge variant="outline">Medium Priority</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="min-score">Minimum Qualification Score</Label>
                      <Select defaultValue="75">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="60">60 - Low threshold</SelectItem>
                          <SelectItem value="75">75 - Medium threshold</SelectItem>
                          <SelectItem value="85">85 - High threshold</SelectItem>
                          <SelectItem value="90">90 - Very high threshold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-leads">Maximum Leads to Discover</Label>
                      <Select defaultValue="100">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50">50 leads</SelectItem>
                          <SelectItem value="100">100 leads</SelectItem>
                          <SelectItem value="250">250 leads</SelectItem>
                          <SelectItem value="500">500 leads</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      AI Enhancement Features
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-accent" />
                        <span>Real-time data enrichment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-accent" />
                        <span>Social media activity analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-accent" />
                        <span>Company growth signals</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-accent" />
                        <span>Intent data integration</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="csv-upload" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-2">CSV Lead Generation</h2>
                <p className="text-muted-foreground">
                  Upload a CSV file with lead data and let our AI generate personalized profiles and email outreach.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-primary" />
                      Upload & Configure
                    </CardTitle>
                    <CardDescription>Upload your CSV file and configure AI prompts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="csv-file">CSV File</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Input id="csv-file" type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
                        <Label htmlFor="csv-file" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {csvFile ? csvFile.name : "Click to upload CSV file"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Supports CSV files with lead contact information
                            </span>
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile-prompt">Profile Generation Prompt</Label>
                      <Textarea
                        id="profile-prompt"
                        value={profilePrompt}
                        onChange={(e) => setProfilePrompt(e.target.value)}
                        rows={4}
                        placeholder="Instructions for generating professional profiles..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-prompt">Email Generation Prompt</Label>
                      <Textarea
                        id="email-prompt"
                        value={emailPrompt}
                        onChange={(e) => setEmailPrompt(e.target.value)}
                        rows={4}
                        placeholder="Instructions for generating personalized emails..."
                      />
                    </div>

                    <Button
                      onClick={handleSubmitCsv}
                      disabled={!csvFile || isProcessing}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing CSV...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Generate Leads
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-accent" />
                      CSV Format Guide
                    </CardTitle>
                    <CardDescription>Required format for your CSV file</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Required Columns:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>
                          • <strong>name</strong> - Full name of the lead
                        </li>
                        <li>
                          • <strong>email</strong> - Email address
                        </li>
                        <li>
                          • <strong>company</strong> - Company name
                        </li>
                        <li>
                          • <strong>title</strong> - Job title/position
                        </li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Optional Columns:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>
                          • <strong>industry</strong> - Company industry
                        </li>
                        <li>
                          • <strong>location</strong> - Geographic location
                        </li>
                        <li>
                          • <strong>linkedin</strong> - LinkedIn profile URL
                        </li>
                        <li>
                          • <strong>phone</strong> - Phone number
                        </li>
                      </ul>
                    </div>

                    <div className="bg-accent/10 p-4 rounded-lg">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-accent" />
                        AI Processing Features
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Professional profile generation</li>
                        <li>• Personalized email creation</li>
                        <li>• Context-aware messaging</li>
                        <li>• Industry-specific customization</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {enhancedLeads.length > 0 && (
                <Card className="mt-8">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-accent" />
                          Enhanced Lead Results
                        </CardTitle>
                        <CardDescription>
                          Processed {enhancedLeads.length} leads with AI scoring and personalized content
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export All
                        </Button>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => enhancedLeads.forEach((lead) => handleSendEmail(lead))}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send All Emails
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      {enhancedLeads.map((lead, index) => (
                        <Card key={index} className="border-l-4 border-l-primary">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Users className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-lg text-foreground">{lead.name}</h4>
                                  <p className="text-muted-foreground">{lead.email}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                      className={`${
                                        lead.score >= 90
                                          ? "bg-accent text-accent-foreground"
                                          : lead.score >= 80
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground"
                                      }`}
                                    >
                                      <Star className="h-3 w-3 mr-1" />
                                      Score: {lead.score}
                                    </Badge>
                                    <Badge variant="outline">
                                      {lead.score >= 85
                                        ? "High Quality"
                                        : lead.score >= 70
                                          ? "Good Quality"
                                          : "Standard"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleSendEmail(lead)}
                                disabled={sendingEmails.has(lead.email)}
                                className="bg-accent hover:bg-accent/90"
                              >
                                {sendingEmails.has(lead.email) ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Email
                                  </>
                                )}
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h5 className="font-medium text-sm text-muted-foreground mb-2">AI-Generated Profile</h5>
                                <div className="bg-muted p-3 rounded text-sm leading-relaxed">{lead.profile}</div>
                              </div>

                              <div>
                                <h5 className="font-medium text-sm text-muted-foreground mb-2">Personalized Email</h5>
                                <div className="bg-accent/10 p-4 rounded space-y-2">
                                  <div>
                                    <span className="font-medium text-sm">Subject: </span>
                                    <span className="text-sm">{lead.emailContent.subject}</span>
                                  </div>
                                  <div className="text-sm leading-relaxed whitespace-pre-wrap border-t pt-2">
                                    {lead.emailContent.body}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Basic Results Display for backward compatibility */}
              {apiResults && enhancedLeads.length === 0 && (
                <Card className="mt-8">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-accent" />
                          Processing Results
                        </CardTitle>
                        <CardDescription>Successfully processed {apiResults.processed_count} leads</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Results
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profiles Section */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Generated Profiles ({apiResults.profiles.length})
                      </h3>
                      <div className="space-y-4">
                        {apiResults.profiles.map((profile, index) => (
                          <Card key={index} className="border-l-4 border-l-primary">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-foreground mb-2">{profile.name}</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">{profile.summary}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Emails Section */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Mail className="h-5 w-5 text-accent" />
                        Generated Emails ({apiResults.emails.length})
                      </h3>
                      <div className="space-y-4">
                        {apiResults.emails.map((email, index) => (
                          <Card key={index} className="border-l-4 border-l-accent">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-foreground">{email.name}</h4>
                                <Badge variant="outline">{email.email}</Badge>
                              </div>
                              <p className="font-medium text-sm text-muted-foreground mb-3">{email.subject}</p>
                              <div className="bg-muted p-3 rounded text-sm leading-relaxed whitespace-pre-wrap">
                                {email.body}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {apiResults.errors.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-lg mb-4 text-destructive">Errors</h3>
                        <div className="space-y-2">
                          {apiResults.errors.map((error, index) => (
                            <Alert key={index} variant="destructive">
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">Discovery Results</h2>
                <p className="text-muted-foreground">
                  AI discovered {discoveredLeads.length + enhancedLeads.length} potential leads matching your criteria
                  {enhancedLeads.length > 0 && ` (${enhancedLeads.length} from CSV upload)`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Export Results
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {enhancedLeads.map((lead, index) => (
                <Card key={`csv-${index}`} className="hover:shadow-md transition-shadow border-l-4 border-l-accent">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-accent" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground text-lg">{lead.name}</h3>
                          <p className="text-muted-foreground">{lead.title || "Position not specified"}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {lead.email}
                            </div>
                            {lead.company && (
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {lead.company}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">CSV Generated</Badge>
                            <Badge
                              className={`${
                                lead.score >= 90
                                  ? "bg-accent text-accent-foreground"
                                  : lead.score >= 80
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              <Star className="h-3 w-3 mr-1" />
                              Score: {lead.score}
                            </Badge>
                            {lead.industry && <Badge variant="outline">{lead.industry}</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSendEmail(lead)}
                          disabled={sendingEmails.has(lead.email)}
                          className="bg-accent hover:bg-accent/90"
                        >
                          {sendingEmails.has(lead.email) ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Email
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {discoveredLeads.map((lead, index) => (
                <Card key={`discovered-${index}`} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground text-lg">{lead.name}</h3>
                          <p className="text-muted-foreground">{lead.title}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {lead.company}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {lead.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {lead.employees}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{lead.industry}</Badge>
                            <Badge
                              className={`${
                                lead.score >= 90
                                  ? "bg-accent text-accent-foreground"
                                  : lead.score >= 80
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              <Star className="h-3 w-3 mr-1" />
                              Score: {lead.score}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Add to Campaign
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {(discoveredLeads.length > 0 || enhancedLeads.length > 0) && (
              <div className="text-center">
                <Button variant="outline" size="lg">
                  Load More Results
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Qualified Leads Tab */}
          <TabsContent value="qualified" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">Qualified Leads</h2>
                <p className="text-muted-foreground">High-scoring leads ready for outreach (Score ≥ 85)</p>
              </div>
              <Link href="/email-outreach">
                <Button className="bg-primary hover:bg-primary/90">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Start Email Campaign
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                ...enhancedLeads.filter((lead) => lead.score >= 85),
                ...discoveredLeads.filter((lead) => lead.score >= 85),
              ].map((lead, index) => (
                <Card key={index} className="border-primary/20 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-accent text-accent-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Score: {lead.score}
                      </Badge>
                      <Badge variant="outline">Qualified</Badge>
                    </div>
                    <CardTitle className="text-lg">{lead.name}</CardTitle>
                    <CardDescription>
                      {lead.title || "Position not specified"} {lead.company && `at ${lead.company}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      {"location" in lead && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{lead.location}</span>
                        </div>
                      )}
                      {"employees" in lead && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span>{lead.employees} employees</span>
                        </div>
                      )}
                      {"email" in lead && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{lead.email}</span>
                        </div>
                      )}
                      {lead.industry && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>{lead.industry}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        View Details
                      </Button>
                      {"emailContent" in lead ? (
                        <Button
                          size="sm"
                          className="flex-1 bg-accent hover:bg-accent/90"
                          onClick={() => handleSendEmail(lead as EnhancedLead)}
                          disabled={sendingEmails.has(lead.email)}
                        >
                          {sendingEmails.has(lead.email) ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Email
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                          Add to Campaign
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
