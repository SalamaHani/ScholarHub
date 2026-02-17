import { Shield, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const sections = [
    {
        title: "1. Information We Collect",
        content: `When you create an account on ScholarHub, we collect the following information:

• Account information: name, email address, password (stored encrypted), and profile picture.
• Academic information: university, degree level, field of study, and certifications you add to your profile.
• Application data: scholarship applications you submit through our platform, including answers and uploaded documents.
• Usage data: pages visited, search queries, and features used, collected to improve the platform.
• Technical data: IP address, browser type, and device information for security purposes.`,
    },
    {
        title: "2. How We Use Your Information",
        content: `We use your information to:

• Provide and operate the ScholarHub platform.
• Match you with relevant scholarship opportunities.
• Send notifications about scholarships and application status updates.
• Improve platform features and user experience.
• Respond to your inquiries and support requests.
• Comply with legal obligations.

We do not sell your personal data to third parties.`,
    },
    {
        title: "3. Information Sharing",
        content: `We share your information only in the following circumstances:

• With scholarship providers when you submit an application through our platform.
• With service providers who assist in operating the platform (e.g., hosting, analytics) under strict confidentiality agreements.
• When required by law or to protect the rights and safety of our users.

Scholarship providers who receive your application data are responsible for their own privacy practices.`,
    },
    {
        title: "4. Data Security",
        content: `We take the security of your personal data seriously. We implement industry-standard measures including:

• Encrypted data transmission (HTTPS/TLS).
• Encrypted storage of passwords.
• Access controls limiting who can view your data.
• Regular security audits and updates.

Despite these measures, no internet transmission is 100% secure. We encourage you to use a strong, unique password for your account.`,
    },
    {
        title: "5. Cookies",
        content: `ScholarHub uses cookies to:

• Keep you logged in across sessions (authentication cookies, valid for 7 days).
• Remember your preferences.
• Analyze platform usage to improve our services.

You can control cookie behavior through your browser settings. Disabling cookies may affect platform functionality.`,
    },
    {
        title: "6. Your Rights",
        content: `You have the following rights regarding your personal data:

• Access: Request a copy of the personal data we hold about you.
• Correction: Request correction of inaccurate or incomplete data.
• Deletion: Request deletion of your account and associated data.
• Portability: Request your data in a portable format.

To exercise any of these rights, contact us at privacy@scholarhub.ps.`,
    },
    {
        title: "7. Data Retention",
        content: `We retain your personal data for as long as your account is active or as needed to provide services. If you delete your account, we will delete or anonymize your data within 30 days, except where retention is required by law.`,
    },
    {
        title: "8. Changes to This Policy",
        content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on the platform. Your continued use of ScholarHub after changes take effect constitutes acceptance of the updated policy.`,
    },
    {
        title: "9. Contact Us",
        content: `If you have questions or concerns about this Privacy Policy, please contact us:\n\nEmail: privacy@scholarhub.ps\nAddress: Gaza, Palestine`,
    },
];

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-3xl">
                {/* Header */}
                <div className="mb-10 space-y-3">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                        <Shield className="h-3 w-3 mr-1" />
                        Legal
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
                    <p className="text-muted-foreground text-sm">
                        Last updated: <strong>January 1, 2026</strong>
                    </p>
                    <p className="text-muted-foreground">
                        This Privacy Policy explains how ScholarHub collects, uses, and protects
                        your personal information when you use our platform.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-8 bg-card rounded-2xl border p-8">
                    {sections.map((section, i) => (
                        <div key={i}>
                            {i > 0 && <Separator className="mb-8" />}
                            <h2 className="text-base font-bold mb-3">{section.title}</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Questions?{" "}
                    <a href="mailto:privacy@scholarhub.ps" className="text-primary hover:underline">
                        privacy@scholarhub.ps
                    </a>
                </div>
            </div>
        </div>
    );
}
