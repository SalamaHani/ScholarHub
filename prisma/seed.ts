import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // Clear existing data
    await prisma.categoryOnScholarship.deleteMany();
    await prisma.savedScholarship.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.contactMessage.deleteMany();
    await prisma.scholarship.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Create categories
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: "STEM",
                slug: "stem",
                description: "Science, Technology, Engineering, and Mathematics",
                icon: "Cpu",
                color: "#3B82F6",
            },
        }),
        prisma.category.create({
            data: {
                name: "Arts & Humanities",
                slug: "arts-humanities",
                description: "Art, Music, Literature, History, Philosophy",
                icon: "Palette",
                color: "#EC4899",
            },
        }),
        prisma.category.create({
            data: {
                name: "Business & Economics",
                slug: "business-economics",
                description: "Business Administration, Finance, Economics",
                icon: "TrendingUp",
                color: "#10B981",
            },
        }),
        prisma.category.create({
            data: {
                name: "Medicine & Health",
                slug: "medicine-health",
                description: "Medicine, Nursing, Public Health",
                icon: "Heart",
                color: "#EF4444",
            },
        }),
        prisma.category.create({
            data: {
                name: "Social Sciences",
                slug: "social-sciences",
                description: "Psychology, Sociology, Political Science",
                icon: "Users",
                color: "#8B5CF6",
            },
        }),
        prisma.category.create({
            data: {
                name: "Law",
                slug: "law",
                description: "Legal Studies and Jurisprudence",
                icon: "Scale",
                color: "#F59E0B",
            },
        }),
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Create scholarships (using comma-separated strings for fieldOfStudy and degreeLevel)
    const scholarships = await Promise.all([
        prisma.scholarship.create({
            data: {
                title: "Fulbright Foreign Student Program",
                description:
                    "The Fulbright Foreign Student Program enables graduate students, young professionals and artists from abroad to study and conduct research in the United States.",
                organization: "U.S. Department of State",
                country: "United States",
                region: "North America",
                fieldOfStudy: "All Fields",
                degreeLevel: "Master,PhD",
                fundingType: "Full Funding",
                deadline: new Date("2026-05-15"),
                applicationLink: "https://foreign.fulbrightonline.org/",
                requirements:
                    "Bachelor's degree, Strong academic record, English proficiency, Leadership potential",
                eligibility:
                    "Citizens of eligible countries, Completed undergraduate studies, No previous Fulbright grant",
                benefits:
                    "Full tuition, Monthly stipend, Health insurance, Round-trip airfare, Pre-academic orientation",
                documents:
                    "Completed application, Personal statement, Study objectives essay, Transcripts, 3 recommendation letters",
                isActive: true,
                isFeatured: true,
            },
        }),
        prisma.scholarship.create({
            data: {
                title: "Chevening Scholarships",
                description:
                    "Chevening Scholarships are the UK government's global scholarship programme for emerging leaders to pursue one-year master's degrees in the UK.",
                organization: "UK Government",
                country: "United Kingdom",
                region: "Europe",
                fieldOfStudy: "All Fields",
                degreeLevel: "Master",
                fundingType: "Full Funding",
                deadline: new Date("2026-11-01"),
                applicationLink: "https://www.chevening.org/",
                requirements:
                    "Bachelor's degree, 2 years work experience, Return to home country requirement, English proficiency",
                eligibility:
                    "Citizen of Chevening-eligible country, Undergraduate degree, 2+ years work experience",
                benefits:
                    "Tuition fees, Living allowance, Airfare, Additional grants",
                documents:
                    "Online application, 4 essays, 2 references, Transcripts, English score, Passport",
                isActive: true,
                isFeatured: true,
            },
        }),
        prisma.scholarship.create({
            data: {
                title: "DAAD Scholarships",
                description:
                    "The German Academic Exchange Service offers scholarships for international students to study at top German universities.",
                organization: "German Academic Exchange Service",
                country: "Germany",
                region: "Europe",
                fieldOfStudy: "Engineering,Natural Sciences,Social Sciences",
                degreeLevel: "Master,PhD",
                fundingType: "Full Funding",
                deadline: new Date("2026-10-15"),
                applicationLink: "https://www.daad.de/",
                requirements:
                    "Completed degree, Above average academic record, German or English proficiency",
                eligibility:
                    "Graduates from all disciplines, Degree not older than 6 years, Professional experience",
                benefits:
                    "Monthly payment (850-1200 EUR), Travel allowance, Health insurance, Language course",
                documents:
                    "DAAD form, CV, Motivation letter, References, Degree copies, Language proof",
                isActive: true,
                isFeatured: true,
            },
        }),
        prisma.scholarship.create({
            data: {
                title: "Turkish Scholarships (Türkiye Burslari)",
                description:
                    "Comprehensive scholarship program by the Republic of Turkey covering all levels of higher education.",
                organization: "Republic of Turkey",
                country: "Turkey",
                region: "Middle East",
                fieldOfStudy: "All Fields",
                degreeLevel: "Bachelor,Master,PhD",
                fundingType: "Full Funding",
                deadline: new Date("2026-02-20"),
                applicationLink: "https://turkiyeburslari.gov.tr/",
                requirements:
                    "Age requirements by level, Academic excellence, Good health",
                eligibility:
                    "Non-Turkish citizens, Meet age requirements, No Turkish degree",
                benefits:
                    "Tuition, Accommodation, Monthly stipend, Turkish language course, Health insurance, Flight ticket",
                documents:
                    "Online application, Transcripts, Diploma, Passport, Photo, Recommendation letters",
                isActive: true,
                isFeatured: false,
            },
        }),
        prisma.scholarship.create({
            data: {
                title: "MEXT Scholarship (Japan)",
                description:
                    "Japanese government scholarship for international students to study at Japanese universities.",
                organization: "Japanese Government",
                country: "Japan",
                region: "Asia",
                fieldOfStudy: "All Fields",
                degreeLevel: "Bachelor,Master,PhD",
                fundingType: "Full Funding",
                deadline: new Date("2026-04-15"),
                applicationLink: "https://www.studyinjapan.go.jp/",
                requirements:
                    "Nationality requirements, Age requirements, Academic qualifications",
                eligibility:
                    "Non-Japanese nationality, Meet academic and age requirements, Willing to learn Japanese",
                benefits:
                    "Tuition, Monthly allowance, Round-trip airfare, Japanese language training",
                documents:
                    "Application form, Transcripts, Diploma, Recommendation letters, Research plan (for graduate)",
                isActive: true,
                isFeatured: false,
            },
        }),
        prisma.scholarship.create({
            data: {
                title: "Korean Government Scholarship (KGSP)",
                description:
                    "Full scholarship for international students to study in South Korea including language training.",
                organization: "National Institute for International Education",
                country: "South Korea",
                region: "Asia",
                fieldOfStudy: "All Fields",
                degreeLevel: "Bachelor,Master,PhD",
                fundingType: "Full Funding",
                deadline: new Date("2026-03-15"),
                applicationLink: "https://www.studyinkorea.go.kr/",
                requirements:
                    "GPA 80%+, Age under 25 (Bachelor) or 40 (Graduate), Good health",
                eligibility:
                    "Citizens of invited countries, No Korean ancestry, Meet age and GPA requirements",
                benefits:
                    "Korean language training, Tuition, Living expenses, Medical insurance, Airfare",
                documents:
                    "Application, Personal statement, Study plan, Transcripts, Recommendation letters, Health certificate",
                isActive: true,
                isFeatured: false,
            },
        }),
        prisma.scholarship.create({
            data: {
                title: "Erasmus Mundus Joint Masters",
                description:
                    "High-level integrated master's courses delivered by consortia of European universities.",
                organization: "European Union",
                country: "Europe",
                region: "Europe",
                fieldOfStudy: "Various specialized programs",
                degreeLevel: "Master",
                fundingType: "Full Funding",
                deadline: new Date("2026-01-30"),
                applicationLink: "https://erasmus-plus.ec.europa.eu/",
                requirements:
                    "Bachelor's degree, Strong academic record, English proficiency",
                eligibility:
                    "No previous Erasmus Mundus scholarship, Bachelor's degree holders",
                benefits:
                    "Tuition, Living costs, Travel, Installation costs, Insurance",
                documents:
                    "Varies by program - typically CV, motivation letter, transcripts, language certificates",
                isActive: true,
                isFeatured: false,
            },
        }),
        prisma.scholarship.create({
            data: {
                title: "Australia Awards Scholarships",
                description:
                    "Long-term awards for study or research at participating Australian universities.",
                organization: "Australian Government",
                country: "Australia",
                region: "Oceania",
                fieldOfStudy: "All Fields",
                degreeLevel: "Master,PhD",
                fundingType: "Full Funding",
                deadline: new Date("2026-04-30"),
                applicationLink: "https://www.australiaawards.gov.au/",
                requirements:
                    "Bachelor's degree, Work experience, English proficiency, Leadership potential",
                eligibility:
                    "Citizens of participating countries, Not Australian citizens, Meet minimum age",
                benefits:
                    "Tuition, Living allowance, Airfare, Health insurance, Pre-course English training",
                documents:
                    "Application form, Academic transcripts, Proof of citizenship, English test scores, Reference letters",
                isActive: true,
                isFeatured: false,
            },
        }),
        prisma.scholarship.create({
            data: {
                title: "Swedish Institute Scholarships",
                description:
                    "Scholarships for master's studies in Sweden for global professionals.",
                organization: "Swedish Institute",
                country: "Sweden",
                region: "Europe",
                fieldOfStudy: "All Fields",
                degreeLevel: "Master",
                fundingType: "Full Funding",
                deadline: new Date("2026-02-10"),
                applicationLink: "https://si.se/en/",
                requirements:
                    "Bachelor's degree, Work experience, English proficiency, Leadership qualities",
                eligibility:
                    "Citizens of eligible countries, Relevant work experience, No previous Swedish degree",
                benefits:
                    "Tuition, Living expenses (SEK 10,000/month), Travel grant, Insurance, Networking",
                documents:
                    "CV, Motivation letter, References, Proof of work experience, English proficiency",
                isActive: true,
                isFeatured: false,
            },
        }),
        prisma.scholarship.create({
            data: {
                title: "Holland Scholarship",
                description:
                    "Scholarship for non-EEA international students to study in the Netherlands.",
                organization: "Dutch Ministry of Education",
                country: "Netherlands",
                region: "Europe",
                fieldOfStudy: "All Fields",
                degreeLevel: "Bachelor,Master",
                fundingType: "Partial Funding",
                amount: "5000",
                currency: "EUR",
                deadline: new Date("2026-05-01"),
                applicationLink: "https://www.studyinholland.nl/",
                requirements:
                    "Non-EEA nationality, First time studying in Netherlands, Admission to Dutch university",
                eligibility:
                    "Non-EEA citizens, No previous Dutch degree, Enrolled in participating institution",
                benefits: "One-time €5,000 scholarship",
                documents:
                    "Application through university, Proof of admission, ID documents",
                isActive: true,
                isFeatured: false,
            },
        }),
    ]);

    console.log(`✅ Created ${scholarships.length} scholarships`);

    // Link scholarships to categories
    const categoryLinks = await Promise.all([
        prisma.categoryOnScholarship.create({
            data: {
                scholarshipId: scholarships[0].id,
                categoryId: categories[0].id, // STEM
            },
        }),
        prisma.categoryOnScholarship.create({
            data: {
                scholarshipId: scholarships[0].id,
                categoryId: categories[1].id, // Arts
            },
        }),
        prisma.categoryOnScholarship.create({
            data: {
                scholarshipId: scholarships[2].id,
                categoryId: categories[0].id, // STEM
            },
        }),
        prisma.categoryOnScholarship.create({
            data: {
                scholarshipId: scholarships[2].id,
                categoryId: categories[2].id, // Business
            },
        }),
    ]);

    console.log(`✅ Created ${categoryLinks.length} category links`);

    console.log("🎉 Seed completed successfully!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Seed error:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
