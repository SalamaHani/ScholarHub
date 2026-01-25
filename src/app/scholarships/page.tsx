import { Metadata } from "next";
import ScholarshipsClient from "./ScholarshipsClient";

export const metadata: Metadata = {
    title: "Browse Scholarships | ScholarHub",
    description: "Discover scholarship opportunities from around the world. Filter by country, degree level, and funding type.",
};

export default function ScholarshipsPage() {
    return <ScholarshipsClient />;
}
