import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Mail,
  Send,
  Users,
  BarChart3,
  Target,
  TrendingUp,
  Eye,
  MousePointer,
  Reply,
  Play,
  Pause,
  Edit,
  Copy,
} from "lucide-react"
import Link from "next/link"

const campaigns = [
  {
    name: "Q1 SaaS Outreach",
    status: "Active",
    leads: 156,
    sent: 89,
    opened: 67,
    replied: 23,
    openRate: 75.3,
    replyRate: 25.8,
    created: "2024-01-15",
  },
  {
    name: "Enterprise Prospects",
    status: "Paused",
    leads: 203,
    sent: 203,
    opened: 142,
    replied: 38,
    openRate: 69.9,
    replyRate: 18.7,
    created: "2024-01-10",
  },
  {
    name: "Startup Founders",
    status: "Draft",
    leads: 78,
    sent: 0,
    opened: 0,
    replied: 0,
    openRate: 0,
    replyRate: 0,
    created: "2024-01-20",
  },
]

const emailTemplates = [
  {
    name: "Cold Outreach - SaaS",
    subject: "Quick question about {{company}} growth",
    preview: "Hi {{firstName}}, I noticed {{company}} recently...",
    category: "Cold Outreach",
    performance: { openRate: 78, replyRate: 24 },
  },
  {
    name: "Follow-up - No Response",
    subject: "Following up on my previous email",
    preview: "Hi {{firstName}}, I wanted to follow up on...",
    category: "Follow-up",
    performance: { openRate: 65, replyRate: 18 },
  },
  {
    name: "Value Proposition",
    subject: "How {{company}} can save 20+ hours/week",
    preview: "Hi {{firstName}}, Companies like {{company}}...",
    category: "Value-based",
    performance: { openRate: 82, replyRate: 31 },
  },
]

const recentActivity = [
  {
    type: "opened",
    contact: "Sarah Johnson",
    campaign: "Q1 SaaS Outreach",
    time: "2 minutes ago",
    icon: Eye,
  },
  {
    type: "replied",
    contact: "Michael Chen",
    campaign: "Enterprise Prospects",
    time: "15 minutes ago",
    icon: Reply,
  },
  {
    type: "clicked",
    contact: "Emily Rodriguez",
    campaign: "Q1 SaaS Outreach",
    time: "1 hour ago",
    icon: MousePointer,
  },
  {
    type: "sent",
    contact: "David Kim",
    campaign: "Startup Founders",
    time: "2 hours ago",
    icon: Send,
  },
]

const firstName = "John" // Declare firstName variable
const company = "TechCorp" // Declare company variable
const title = "CEO" // Declare title variable

export default function EmailOutreachPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-12 py-4">
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
              <Link href="/lead-discovery" className="text-muted-foreground hover:text-primary transition-colors">
                Lead Discovery
              </Link>
              <span className="text-primary font-medium">Email Outreach</span>
            </nav>
            <Button className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-12 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Email Outreach Campaigns</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Create personalized, AI-driven email campaigns that adapt to each prospect&apos;s behavior and preferences for
            maximum engagement.
          </p>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Campaigns Overview */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">3</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-accent">+1</span> from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                  <Send className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">1,247</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-accent">+18%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">74.2%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-accent">+5.1%</span> above average
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reply Rate</CardTitle>
                  <Reply className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">22.8%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-accent">+3.2%</span> above average
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Campaign List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Campaigns</CardTitle>
                    <CardDescription>Manage your ongoing email outreach campaigns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {campaigns.map((campaign, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                              <Badge
                                variant={
                                  campaign.status === "Active"
                                    ? "default"
                                    : campaign.status === "Paused"
                                      ? "secondary"
                                      : "outline"
                                }
                                className={campaign.status === "Active" ? "bg-accent text-accent-foreground" : ""}
                              >
                                {campaign.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{campaign.leads} leads</span>
                              <span>{campaign.sent} sent</span>
                              <span>{campaign.openRate}% open rate</span>
                              <span>{campaign.replyRate}% reply rate</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {campaign.status === "Active" ? (
                              <Button size="sm" variant="outline">
                                <Pause className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline">
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest engagement from your campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            activity.type === "replied"
                              ? "bg-accent/10"
                              : activity.type === "opened"
                                ? "bg-primary/10"
                                : activity.type === "clicked"
                                  ? "bg-secondary/10"
                                  : "bg-muted"
                          }`}
                        >
                          <activity.icon
                            className={`h-4 w-4 ${
                              activity.type === "replied"
                                ? "text-accent"
                                : activity.type === "opened"
                                  ? "text-primary"
                                  : activity.type === "clicked"
                                    ? "text-secondary"
                                    : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium text-foreground">
                            {activity.contact} {activity.type} your email
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.campaign} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Create Campaign */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Settings</CardTitle>
                  <CardDescription>Configure your email outreach campaign</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input id="campaign-name" placeholder="e.g., Q1 Enterprise Outreach" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="from-name">From Name</Label>
                    <Input id="from-name" placeholder="Your Name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="from-email">From Email</Label>
                    <Input id="from-email" type="email" placeholder="you@company.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Email Subject</Label>
                    <Input id="subject" placeholder={`Quick question about ${company} growth`} />
                    <p className="text-xs text-muted-foreground">
                      Use variables like {firstName}, {company}, {title}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-body">Email Body</Label>
                    <Textarea
                      id="email-body"
                      rows={8}
                      placeholder={`Hi ${firstName},

I noticed ${company} has been growing rapidly in the tech space. 

I wanted to reach out because we've helped similar companies like yours increase their lead generation by 300% using AI-powered automation.

Would you be interested in a quick 15-minute call to discuss how this could work for ${company}?

Best regards,
${firstName}`}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>AI Personalization Settings</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="company-research" className="text-sm">
                          Company Research
                        </Label>
                        <Switch id="company-research" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="social-insights" className="text-sm">
                          Social Media Insights
                        </Label>
                        <Switch id="social-insights" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="industry-trends" className="text-sm">
                          Industry Trends
                        </Label>
                        <Switch id="industry-trends" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="timing-optimization" className="text-sm">
                          Send Time Optimization
                        </Label>
                        <Switch id="timing-optimization" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Campaign Schedule</CardTitle>
                  <CardDescription>Set up follow-up sequences and timing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="send-schedule">Send Schedule</Label>
                    <Select defaultValue="business-hours">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Send Immediately</SelectItem>
                        <SelectItem value="business-hours">Business Hours Only</SelectItem>
                        <SelectItem value="optimal">AI-Optimized Timing</SelectItem>
                        <SelectItem value="custom">Custom Schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="daily-limit">Daily Send Limit</Label>
                    <Select defaultValue="50">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25 emails/day</SelectItem>
                        <SelectItem value="50">50 emails/day</SelectItem>
                        <SelectItem value="100">100 emails/day</SelectItem>
                        <SelectItem value="200">200 emails/day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Follow-up Sequence</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Follow-up 1</p>
                          <p className="text-xs text-muted-foreground">3 days after initial email</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Follow-up 2</p>
                          <p className="text-xs text-muted-foreground">7 days after follow-up 1</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Follow-up 3</p>
                          <p className="text-xs text-muted-foreground">14 days after follow-up 2</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Campaign Preview</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Total leads:</span>
                        <span>156</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated duration:</span>
                        <span>3-4 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected responses:</span>
                        <span className="text-accent">35-40</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Send className="h-4 w-4 mr-2" />
                    Launch Campaign
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Email Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">Email Templates</h2>
                <p className="text-muted-foreground">Pre-built, high-performing email templates</p>
              </div>
              <Button variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emailTemplates.map((template, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{template.category}</Badge>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {template.performance.openRate}% open
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {template.performance.replyRate}% reply
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="font-medium">{template.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{template.preview}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground">Campaign Analytics</h2>
              <p className="text-muted-foreground">Detailed performance insights and optimization recommendations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                  <Send className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">2,847</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-accent">+12%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">98.2%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-accent">+0.5%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">1.8%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-destructive">-0.3%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unsubscribe Rate</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">0.4%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-accent">-0.1%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>AI-powered recommendations to improve your campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Optimize Send Times</h4>
                      <p className="text-sm text-muted-foreground">
                        Your emails perform 23% better when sent between 10-11 AM on Tuesdays and Wednesdays.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Subject Line Improvement</h4>
                      <p className="text-sm text-muted-foreground">
                        Subject lines with questions have 31% higher open rates in your campaigns.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                    <Users className="h-5 w-5 text-secondary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Audience Segmentation</h4>
                      <p className="text-sm text-muted-foreground">
                        Consider creating separate campaigns for different company sizes to improve relevance.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
