import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | ScholarHub",
    description: "ScholarHub Admin Control Panel - Manage users, scholarships, applications, and more.",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
