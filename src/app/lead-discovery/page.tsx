"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
} from "lucide-react"

interface ApiResponse {
  emails: Array<{
    body: string
    email: string
    name: string
    subject: string
  }>
  profiles: string[]
  processed_count: number
  processed_names: string[]
  errors: string[]
  message: string
}

interface EnhancedLead {
  name: string
  email: string
  company: string
  title: string
  profile: string
  score: number
  emailContent: {
    subject: string
    body: string
  }
  source: "CSV" | "AI Agent"
  linkedin?: string
  website?: string
}

interface LeadAgentParams {
  topic: string
  niche: string
  designation: string
  service: string
  no_of: number
  geospatial_area: string
}

interface LeadAgentResponse {
  companies: Array<{
    description: string
    name: string
    reason: string
    website: string
  }>
  contacts: Array<{
    company: string
    email: string
    full_name: string
    linkedin_url: string
    title: string
  }>
  emails: Array<{
    body: string
    email: string
    name: string
    subject: string
  }>
  message: string
}

interface EmailCredentials {
  sender_email: string
  sender_password: string
  smtp_host: string
  smtp_port: number
  use_ssl: boolean
}

export default function LeadDiscoveryPage() {
  const [file, setFile] = useState<File | null>(null)
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

  const [leadAgentParams, setLeadAgentParams] = useState<LeadAgentParams>({
    topic: "Technology",
    niche: "AI and Machine Learning",
    designation: "CTO",
    service: "Software Development",
    no_of: 10,
    geospatial_area: "San Francisco Bay Area",
  })
  const [leadAgentResults, setLeadAgentResults] = useState<LeadAgentResponse | null>(null)
  const [isProcessingLeadAgent, setIsProcessingLeadAgent] = useState(false)
  const [leadAgentLeads, setLeadAgentLeads] = useState<EnhancedLead[]>([])

  const [emailCredentials, setEmailCredentials] = useState<EmailCredentials>({
    sender_email: "",
    sender_password: "",
    smtp_host: "smtp.zoho.in",
    smtp_port: 465,
    use_ssl: true,
  })
  const [isSavingCredentials, setIsSavingCredentials] = useState(false)
  const [credentialsSaved, setCredentialsSaved] = useState(false)
  const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set())

  const calculateLeadScore = (profile: string, email: string): number => {
    let score = 60 // Base score

    // Email domain scoring
    const domain = email.split("@")[1]?.toLowerCase()
    if (domain?.includes("gmail") || domain?.includes("yahoo") || domain?.includes("hotmail")) {
      score -= 10 // Personal email domains
    } else {
      score += 15 // Business email domains
    }

    // Profile content scoring
    const profileLower = profile.toLowerCase()
    const seniorityKeywords = ["ceo", "cto", "vp", "director", "head", "chief", "senior", "lead", "manager"]
    const techKeywords = ["ai", "ml", "software", "tech", "data", "engineering", "development"]
    const industryKeywords = ["saas", "startup", "enterprise", "b2b", "platform", "solution"]

    seniorityKeywords.forEach((keyword) => {
      if (profileLower.includes(keyword)) score += 8
    })

    techKeywords.forEach((keyword) => {
      if (profileLower.includes(keyword)) score += 5
    })

    industryKeywords.forEach((keyword) => {
      if (profileLower.includes(keyword)) score += 3
    })

    // Profile length and quality
    if (profile.length > 100) score += 5
    if (profile.length > 200) score += 5

    return Math.min(Math.max(score, 0), 100)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setError(null)
    } else {
      setError("Please select a valid CSV file")
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a CSV file")
      return
    }

    setIsProcessing(true)
    setError(null)
    setApiResults(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("profile_prompt", profilePrompt)
    formData.append("email_prompt", emailPrompt)

    try {
      const response = await fetch("https://lead-gen-2-977121587860.asia-south1.run.app/process_csv", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to process CSV")
      }

      const result: ApiResponse = await response.json()
      setApiResults(result)

      // Transform API results into enhanced leads
      const leads: EnhancedLead[] = result.emails.map((email, index) => {
        const profile = result.profiles[index] || "No profile available"
        const score = calculateLeadScore(profile, email.email)

        return {
          name: email.name,
          email: email.email,
          company: email.name.split(" ").slice(-1)[0] + " Corp", // Simple company extraction
          title: "Decision Maker",
          profile,
          score,
          emailContent: {
            subject: email.subject,
            body: email.body,
          },
          source: "CSV" as const,
        }
      })

      setEnhancedLeads(leads)
    } catch (err) {
      console.error("Error processing CSV:", err)
      setError("Failed to process CSV file")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLeadAgentSubmit = async () => {
    setIsProcessingLeadAgent(true)
    setError(null)
    setLeadAgentResults(null)

    try {
      const response = await fetch("https://lead-agent-977121587860.asia-south1.run.app/lead-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadAgentParams),
      })

      if (!response.ok) {
        throw new Error("Failed to generate leads")
      }

      const result: LeadAgentResponse = await response.json()
      setLeadAgentResults(result)

      // Transform API results into enhanced leads
      const leads: EnhancedLead[] = result.emails.map((email, index) => {
        const contact = result.contacts.find((c) => c.email === email.email)
        const company = result.companies.find((c) => c.name === contact?.company)
        const score = calculateLeadScore(company?.description || "", email.email)

        return {
          name: email.name,
          email: email.email,
          company: contact?.company || "Unknown Company",
          title: contact?.title || "Unknown Title",
          profile: company?.description || "No profile available",
          score,
          emailContent: {
            subject: email.subject,
            body: email.body,
          },
          source: "AI Agent" as const,
          linkedin: contact?.linkedin_url,
          website: company?.website,
        }
      })

      setLeadAgentLeads(leads)
    } catch (err) {
      console.error("Error generating leads:", err)
      setError("Failed to generate leads")
    } finally {
      setIsProcessingLeadAgent(false)
    }
  }

  const handleSaveCredentials = async () => {
    setIsSavingCredentials(true)
    try {
      const response = await fetch("https://lead-agent-977121587860.asia-south1.run.app/save-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailCredentials),
      })

      if (!response.ok) {
        throw new Error("Failed to save credentials")
      }

      setCredentialsSaved(true)
      setTimeout(() => setCredentialsSaved(false), 3000)
    } catch (err) {
      console.error("Error saving credentials:", err)
      setError("Failed to save email credentials")
    } finally {
      setIsSavingCredentials(false)
    }
  }

  const handleSendEmail = async (lead: EnhancedLead) => {
    setSendingEmails((prev) => new Set(prev).add(lead.email))
    try {
      const response = await fetch("https://lead-agent-977121587860.asia-south1.run.app/send-emails", {
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
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      const result = await response.json()
      console.log("Email sent:", result)
    } catch (err) {
      console.error("Error sending email:", err)
      setError(`Failed to send email to ${lead.name}`)
    } finally {
      setSendingEmails((prev) => {
        const newSet = new Set(prev)
        newSet.delete(lead.email)
        return newSet
      })
    }
  }

  const exportToCSV = (leads: EnhancedLead[]) => {
    const headers = ["Name", "Email", "Company", "Title", "Score", "Profile", "Subject", "Email Body", "Source"]
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
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Mock data for demonstration
  const discoveredLeads: EnhancedLead[] = [
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@techcorp.com",
      company: "TechCorp Solutions",
      title: "VP of Engineering",
      profile: "Experienced engineering leader with 10+ years in SaaS development and team management.",
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
      profile: "AI/ML expert leading technical strategy for enterprise AI solutions.",
      score: 88,
      emailContent: {
        subject: "AI Development Partnership",
        body: "Hello Michael, Your work on enterprise AI caught our attention...",
      },
      source: "AI Agent",
      linkedin: "https://linkedin.com/in/michaelchen",
      website: "https://innovateai.com",
    },
  ]

  const allLeads = [...discoveredLeads, ...enhancedLeads, ...leadAgentLeads]
  const qualifiedLeads = allLeads.filter((lead) => lead.score >= 85)

  return (
    <div className="min-h-screen bg-background py-12 px-12">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Lead Discovery</h1>
          <p className="text-xl text-muted-foreground">
            Discover and qualify high-value prospects with AI-powered lead generation
          </p>
        </div>

        <Tabs defaultValue="discovery" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discovery">Lead Discovery</TabsTrigger>
            <TabsTrigger value="csv-upload">CSV Upload</TabsTrigger>
            <TabsTrigger value="email-setup">Email Setup</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="discovery" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AI Lead Agent */}
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-serif">AI Lead Agent</CardTitle>
                      <CardDescription>Generate targeted leads based on specific criteria</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic</Label>
                      <Input
                        id="topic"
                        value={leadAgentParams.topic}
                        onChange={(e) => setLeadAgentParams({ ...leadAgentParams, topic: e.target.value })}
                        placeholder="e.g., Technology"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="niche">Niche</Label>
                      <Input
                        id="niche"
                        value={leadAgentParams.niche}
                        onChange={(e) => setLeadAgentParams({ ...leadAgentParams, niche: e.target.value })}
                        placeholder="e.g., AI and Machine Learning"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Target Designation</Label>
                      <Input
                        id="designation"
                        value={leadAgentParams.designation}
                        onChange={(e) => setLeadAgentParams({ ...leadAgentParams, designation: e.target.value })}
                        placeholder="e.g., CTO"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Service</Label>
                      <Input
                        id="service"
                        value={leadAgentParams.service}
                        onChange={(e) => setLeadAgentParams({ ...leadAgentParams, service: e.target.value })}
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
                          setLeadAgentParams({ ...leadAgentParams, no_of: Number.parseInt(e.target.value) })
                        }
                        placeholder="10"
                        min="1"
                        max="50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="geospatial_area">Geographic Area</Label>
                      <Input
                        id="geospatial_area"
                        value={leadAgentParams.geospatial_area}
                        onChange={(e) => setLeadAgentParams({ ...leadAgentParams, geospatial_area: e.target.value })}
                        placeholder="e.g., San Francisco Bay Area"
                      />
                    </div>
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
                        Successfully generated {leadAgentLeads.length} leads with personalized email content!
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
                        <CardTitle className="text-sm">Total Leads</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">{allLeads.length}</div>
                      <div className="text-xs text-muted-foreground">Discovered prospects</div>
                    </CardContent>
                  </Card>
                  <Card className="border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-accent" />
                        <CardTitle className="text-sm">Qualified</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-accent">{qualifiedLeads.length}</div>
                      <div className="text-xs text-muted-foreground">Score ≥ 85</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-serif">Qualified Leads</CardTitle>
                    <CardDescription>High-scoring prospects ready for outreach</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {qualifiedLeads.slice(0, 3).map((lead, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {lead.title} at {lead.company}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="bg-accent/10 text-accent">
                              Score: {lead.score}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {lead.source}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    {qualifiedLeads.length > 3 && (
                      <div className="text-center text-sm text-muted-foreground">
                        +{qualifiedLeads.length - 3} more qualified leads
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="csv-upload" className="space-y-8">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-serif">CSV Upload</CardTitle>
                    <CardDescription>Upload a CSV file to generate personalized profiles and emails</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="csv-file">CSV File</Label>
                    <Input id="csv-file" type="file" accept=".csv" onChange={handleFileUpload} />
                    {file && (
                      <div className="text-sm text-muted-foreground">
                        Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-prompt">Profile Generation Prompt</Label>
                    <Textarea
                      id="profile-prompt"
                      value={profilePrompt}
                      onChange={(e) => setProfilePrompt(e.target.value)}
                      rows={3}
                      placeholder="Instructions for generating professional profiles..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-prompt">Email Generation Prompt</Label>
                    <Textarea
                      id="email-prompt"
                      value={emailPrompt}
                      onChange={(e) => setEmailPrompt(e.target.value)}
                      rows={3}
                      placeholder="Instructions for generating personalized emails..."
                    />
                  </div>
                </div>

                <Button onClick={handleSubmit} disabled={!file || isProcessing} className="w-full">
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
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {apiResults && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Processing Complete!</strong>
                      <br />
                      Processed: {apiResults.processed_count} records
                      <br />
                      Generated: {apiResults.emails.length} personalized emails
                      <br />
                      Profiles: {apiResults.profiles.length} professional summaries
                    </AlertDescription>
                  </Alert>
                )}

                {enhancedLeads.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Generated Leads</h3>
                      <Button size="sm" variant="outline" onClick={() => exportToCSV(enhancedLeads)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export All
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {enhancedLeads.map((lead, index) => (
                        <Card key={index} className="border-border">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <CardTitle className="text-lg">{lead.name}</CardTitle>
                                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                                    Score: {lead.score}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                  <div className="flex items-center gap-1">
                                    <Building className="h-4 w-4" />
                                    {lead.company}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {lead.title}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{lead.profile}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-semibold mb-2">Generated Email</h4>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm font-medium">Subject: </span>
                                  <span className="text-sm">{lead.emailContent.subject}</span>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Body: </span>
                                  <p className="text-sm text-muted-foreground line-clamp-3">{lead.emailContent.body}</p>
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
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email-setup" className="space-y-8">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-serif">Email Configuration</CardTitle>
                    <CardDescription>Configure your email credentials for sending personalized emails</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sender_email">Sender Email</Label>
                    <Input
                      id="sender_email"
                      type="email"
                      value={emailCredentials.sender_email}
                      onChange={(e) => setEmailCredentials({ ...emailCredentials, sender_email: e.target.value })}
                      placeholder="your-email@zoho.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender_password">App Password</Label>
                    <Input
                      id="sender_password"
                      type="password"
                      value={emailCredentials.sender_password}
                      onChange={(e) => setEmailCredentials({ ...emailCredentials, sender_password: e.target.value })}
                      placeholder="Your app-specific password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp_host">SMTP Host</Label>
                    <Input
                      id="smtp_host"
                      value={emailCredentials.smtp_host}
                      onChange={(e) => setEmailCredentials({ ...emailCredentials, smtp_host: e.target.value })}
                      placeholder="smtp.zoho.in"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp_port">SMTP Port</Label>
                    <Input
                      id="smtp_port"
                      type="number"
                      value={emailCredentials.smtp_port}
                      onChange={(e) =>
                        setEmailCredentials({ ...emailCredentials, smtp_port: Number.parseInt(e.target.value) })
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
                    onChange={(e) => setEmailCredentials({ ...emailCredentials, use_ssl: e.target.checked })}
                    className="rounded border-border"
                  />
                  <Label htmlFor="use_ssl">Use SSL</Label>
                </div>

                <Button
                  onClick={handleSaveCredentials}
                  disabled={isSavingCredentials || !emailCredentials.sender_email || !emailCredentials.sender_password}
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
                      Email credentials saved successfully! You can now send emails to your leads.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Popular SMTP Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Zoho:</strong> smtp.zoho.in, Port 465 (SSL)
                    </div>
                    <div>
                      <strong>Gmail:</strong> smtp.gmail.com, Port 587 (TLS) or 465 (SSL)
                    </div>
                    <div>
                      <strong>Outlook:</strong> smtp-mail.outlook.com, Port 587 (TLS)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">Total Leads</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{allLeads.length}</div>
                  <div className="text-xs text-muted-foreground">All discovered</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent" />
                    <CardTitle className="text-sm">Qualified</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{qualifiedLeads.length}</div>
                  <div className="text-xs text-muted-foreground">Score ≥ 85</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">Avg Score</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {allLeads.length > 0
                      ? Math.round(allLeads.reduce((sum, lead) => sum + lead.score, 0) / allLeads.length)
                      : 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Lead quality</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent" />
                    <CardTitle className="text-sm">Top Score</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    {allLeads.length > 0 ? Math.max(...allLeads.map((lead) => lead.score)) : 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Best prospect</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-serif">All Discovered Leads</CardTitle>
                    <CardDescription>Complete list of prospects with scores and contact information</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => exportToCSV(allLeads)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {allLeads.map((lead, index) => (
                    <Card key={index} className="border-border/50">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-lg">{lead.name}</CardTitle>
                              <Badge
                                variant="secondary"
                                className={lead.score >= 85 ? "bg-accent/10 text-accent" : "bg-muted"}
                              >
                                Score: {lead.score}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {lead.source}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {lead.company}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {lead.title}
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {lead.email}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{lead.profile}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSendEmail(lead)}
                              disabled={sendingEmails.has(lead.email)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              {sendingEmails.has(lead.email) ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Mail className="h-4 w-4 mr-1" />
                                  Send Email
                                </>
                              )}
                            </Button>
                            {lead.linkedin && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={lead.linkedin} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {lead.website && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={lead.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Personalized Email</h4>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium">Subject: </span>
                              <span className="text-sm">{lead.emailContent.subject}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Body: </span>
                              <p className="text-sm text-muted-foreground">{lead.emailContent.body}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {allLeads.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No leads discovered yet</h3>
                    <p className="text-muted-foreground">Use the Lead Discovery or CSV Upload tabs to generate leads</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
