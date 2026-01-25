import { Metadata } from "next";
import {
    Mail,
    MapPin,
    Phone,
    Send,
    MessageSquare,
    Clock,
    Facebook,
    Twitter,
    Linkedin,
    Instagram
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
    title: "Contact Us | ScholarHub",
    description: "Get in touch with ScholarHub. We're here to help you with your scholarship search.",
};

const contactInfo = [
    {
        icon: Mail,
        title: "Email",
        value: "info@scholarhub.ps",
        href: "mailto:info@scholarhub.ps",
    },
    {
        icon: MapPin,
        title: "Location",
        value: "Gaza, Palestine",
        href: null,
    },
    {
        icon: Clock,
        title: "Response Time",
        value: "Within 24-48 hours",
        href: null,
    },
];

const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
];

const faqItems = [
    {
        question: "How do I apply for scholarships?",
        answer: "Browse our scholarship listings, find opportunities that match your profile, and click the 'Apply' button to be redirected to the official application page.",
    },
    {
        question: "Are the scholarships listed verified?",
        answer: "Yes, we verify all scholarships before listing them on our platform. We only include opportunities from reputable institutions and organizations.",
    },
    {
        question: "Can I save scholarships for later?",
        answer: "Yes! You can save scholarships to your favorites and access them anytime from the 'Saved' section.",
    },
    {
        question: "How often are new scholarships added?",
        answer: "We update our database regularly, adding new scholarships as they become available. Check back frequently for new opportunities.",
    },
];

export default function ContactPage() {
    return (
        <div className="py-8 md:py-12">
            <div className="container">
                {/* Header */}
                <div className="max-w-2xl mx-auto text-center space-y-4 mb-12">
                    <Badge variant="secondary" className="gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Contact
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Have questions or suggestions? We&apos;d love to hear from you.
                        Send us a message and we&apos;ll respond as soon as possible.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Send className="h-5 w-5 text-primary" />
                                Send us a Message
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Your name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        placeholder="What is this about?"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us how we can help..."
                                        rows={5}
                                        required
                                    />
                                </div>

                                <Button type="submit" variant="gradient" size="lg" className="w-full gap-2">
                                    <Send className="h-4 w-4" />
                                    Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Info & FAQ */}
                    <div className="space-y-8">
                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {contactInfo.map((info) => (
                                    <div key={info.title} className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <info.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">{info.title}</div>
                                            {info.href ? (
                                                <a
                                                    href={info.href}
                                                    className="font-medium hover:text-primary transition-colors"
                                                >
                                                    {info.value}
                                                </a>
                                            ) : (
                                                <div className="font-medium">{info.value}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Social Links */}
                                <div className="pt-4 border-t">
                                    <div className="text-sm text-muted-foreground mb-3">Follow Us</div>
                                    <div className="flex gap-3">
                                        {socialLinks.map((social) => (
                                            <a
                                                key={social.label}
                                                href={social.href}
                                                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-all duration-300"
                                                aria-label={social.label}
                                            >
                                                <social.icon className="h-5 w-5" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* FAQ */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Frequently Asked Questions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {faqItems.map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <h4 className="font-medium">{item.question}</h4>
                                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
