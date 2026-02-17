import { FileText, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const sections = [
    {
        title: "1. Acceptance of Terms",
        content: `By creating an account or using ScholarHub, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.

We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.`,
    },
    {
        title: "2. Eligibility",
        content: `ScholarHub is designed for students seeking scholarship opportunities. By using the platform, you confirm that:

• You are at least 16 years of age.
• The information you provide is accurate and truthful.
• You will use the platform in accordance with applicable laws and these terms.`,
    },
    {
        title: "3. Account Responsibilities",
        content: `You are responsible for:

• Maintaining the confidentiality of your account credentials.
• All activity that occurs under your account.
• Notifying us immediately of any unauthorized use of your account.

You may not share your account with others or create accounts on behalf of others without their consent.`,
    },
    {
        title: "4. Acceptable Use",
        content: `You agree not to:

• Submit false, misleading, or fraudulent information in applications.
• Use the platform to spam, harass, or harm other users.
• Attempt to gain unauthorized access to any part of the platform.
• Scrape, crawl, or otherwise collect data from the platform without our permission.
• Use the platform for any unlawful purpose.

Violations may result in immediate account termination.`,
    },
    {
        title: "5. Scholarship Applications",
        content: `ScholarHub facilitates the application process but does not guarantee scholarship awards. By submitting an application through our platform:

• You confirm all submitted information is accurate and complete.
• You understand that final decisions rest with the scholarship providers.
• You grant ScholarHub permission to share your application with the relevant provider.

ScholarHub is not responsible for the decisions made by scholarship providers.`,
    },
    {
        title: "6. Intellectual Property",
        content: `All content on ScholarHub — including text, logos, graphics, and software — is the property of ScholarHub and is protected by copyright law. You may not reproduce, distribute, or create derivative works without our explicit written permission.

User-submitted content (such as personal statements) remains your property. By submitting content, you grant ScholarHub a limited license to use it solely for providing the platform's services.`,
    },
    {
        title: "7. Disclaimer of Warranties",
        content: `ScholarHub is provided on an "as is" and "as available" basis. We make no warranties, express or implied, regarding the platform's availability, accuracy, or fitness for a particular purpose.

We do not guarantee that any scholarship listed on the platform is currently accepting applications or that the information is up to date. Always verify directly with the scholarship provider.`,
    },
    {
        title: "8. Limitation of Liability",
        content: `To the maximum extent permitted by law, ScholarHub shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including but not limited to loss of scholarship opportunities.`,
    },
    {
        title: "9. Termination",
        content: `We reserve the right to suspend or terminate your account at any time if you violate these terms or engage in conduct harmful to other users or the platform. You may also delete your account at any time from your profile settings.`,
    },
    {
        title: "10. Governing Law",
        content: `These Terms of Service are governed by and construed in accordance with applicable law. Any disputes shall be resolved through good-faith negotiation before pursuing other remedies.`,
    },
    {
        title: "11. Contact",
        content: `For questions about these Terms of Service, contact us:\n\nEmail: legal@scholarhub.ps\nAddress: Gaza, Palestine`,
    },
];

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-3xl">
                {/* Header */}
                <div className="mb-10 space-y-3">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                        <FileText className="h-3 w-3 mr-1" />
                        Legal
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight">Terms of Service</h1>
                    <p className="text-muted-foreground text-sm">
                        Last updated: <strong>January 1, 2026</strong>
                    </p>
                    <p className="text-muted-foreground">
                        Please read these Terms of Service carefully before using ScholarHub.
                        These terms govern your access to and use of the platform.
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
                    <a href="mailto:legal@scholarhub.ps" className="text-primary hover:underline">
                        legal@scholarhub.ps
                    </a>
                </div>
            </div>
        </div>
    );
}
