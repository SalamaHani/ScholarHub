"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileInput } from "@/lib/validations/profile";
import { useAuth } from "@/hooks/use-auth";
import {
    User,
    Mail,
    BookOpen,
    GraduationCap,
    Settings,
    ShieldCheck,
    ShieldAlert,
    Camera,
    Loader2,
    Phone,
    MapPin,
    Globe,
    Calendar,
    Briefcase,
    FileText,
    Layout,
    PencilLine,
    PlusCircle,
    ChevronRight,
    TrendingUp,
    Award,
    Building2,
    Quote,
    X,
    ExternalLink,
    Github,
    Twitter,
    Linkedin,
    Trash2,
    Download,
    UserCheck,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import { getProfileStatus, getStatusColor, getStatusStroke, getProgressMessage, getStatusIndicatorColor } from "@/lib/profileStatus";
import { ProfileHeaderSkeleton, ProfileFormSkeleton } from "@/components/skeletons";
import { useTranslation } from "@/hooks/useTranslation";

const DEGREE_LEVELS = [
    { value: "BACHELOR", label: "Bachelor's Degree" },
    { value: "MASTER", label: "Master's Degree" },
    { value: "PHD", label: "PhD / Doctorate" },
    { value: "HIGHSCHOOL", label: "High School" },
    { value: "DIPLOMA", label: "Diploma / Vocational" },
    { value: "OTHER", label: "Other" },
];

// Non-form fields are handled separately or directly from the user object

export default function ProfilePage() {
    const { t } = useTranslation();
    const { user, isLoading, editProfile, updateAvatar: updateAvatarAction, refresh } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingAcademic, setIsEditingAcademic] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [isEditingSkills, setIsEditingSkills] = useState(false);
    const [isEditingLanguages, setIsEditingLanguages] = useState(false);
    const [isEditingDocs, setIsEditingDocs] = useState(false);
    const [isEditingExperience, setIsEditingExperience] = useState(false);
    const [isEditingCertifications, setIsEditingCertifications] = useState(false);
    const [isUploadingDoc, setIsUploadingDoc] = useState(false);
    const { toast } = useToast();
    const [skillTags, setSkillTags] = useState<string[]>([]);
    const [skillInputValue, setSkillInputValue] = useState("");
    const [languageProficiencies, setLanguageProficiencies] = useState<{ name: string, proficiency: number, level?: string }[]>([]);
    const [experienceItems, setExperienceItems] = useState<{ title: string, organization: string, startDate: string, endDate: string, location: string, description: string }[]>([]);
    const [certificationItems, setCertificationItems] = useState<{ title: string, organization: string, issueDate: string, expiryDate?: string, credentialId?: string, credentialUrl?: string }[]>([]);

    // Set mounted state
    useEffect(() => {
        setMounted(true);
    }, []);

    // Initialize tags when dialog opens or user loads
    useEffect(() => {
        if (user?.skills) {
            setSkillTags(user.skills);
        }
        if (user?.languages) {
            setLanguageProficiencies(user.languages as any);
        }
        if (user?.experience) {
            setExperienceItems(user.experience);
        }
        if (user?.certifications) {
            setCertificationItems(user.certifications);
        }
    }, [user?.skills, user?.languages, user?.experience, user?.certifications, isEditingSkills, isEditingLanguages, isEditingExperience, isEditingCertifications]);

    const handleAddLanguage = () => {
        setLanguageProficiencies([...languageProficiencies, { name: "", proficiency: 50 }]);
    };

    const handleRemoveLanguage = (index: number) => {
        setLanguageProficiencies(languageProficiencies.filter((_, i) => i !== index));
    };

    const handleUpdateLanguage = (index: number, field: string, value: any) => {
        const updated = [...languageProficiencies];
        updated[index] = { ...updated[index], [field]: value };
        setLanguageProficiencies(updated);
    };

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && skillInputValue.trim()) {
            e.preventDefault();
            const newSkill = skillInputValue.trim();
            if (!skillTags.includes(newSkill)) {
                setSkillTags([...skillTags, newSkill]);
            }
            setSkillInputValue("");
        }
    };

    const handleRemoveSkill = (skill: string) => {
        setSkillTags(skillTags.filter(s => s !== skill));
    };

    const handleAddExperience = () => {
        setExperienceItems([...experienceItems, { title: "", organization: "", startDate: "", endDate: "", location: "", description: "" }]);
    };

    const handleRemoveExperience = (index: number) => {
        setExperienceItems(experienceItems.filter((_, i) => i !== index));
    };

    const handleUpdateExperience = (index: number, field: string, value: string) => {
        const updated = [...experienceItems];
        (updated[index] as any)[field] = value;
        setExperienceItems(updated);
    };

    const handleAddCertification = () => {
        setCertificationItems([...certificationItems, { title: "", organization: "", issueDate: "", expiryDate: "", credentialId: "", credentialUrl: "" }]);
    };

    const handleRemoveCertification = (index: number) => {
        setCertificationItems(certificationItems.filter((_, i) => i !== index));
    };

    const handleUpdateCertification = (index: number, field: string, value: string) => {
        const updated = [...certificationItems];
        (updated[index] as any)[field] = value;
        setCertificationItems(updated);
    };

    const { register, handleSubmit, watch, setValue, reset, formState: { isSubmitting, errors } } = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            avatar: user?.avatar || "",
            university: user?.university || "",
            fieldOfStudy: user?.fieldOfStudy || "",
            degreeLevel: user?.degreeLevel || "BACHELOR",
            currentDegree: user?.currentDegree || "BACHELOR",
            gpa: user?.gpa ?? 0,
            graduationYear: user?.graduationYear ?? new Date().getFullYear(),
            country: user?.country || "",
            city: user?.city || "",
            zipCode: user?.zipCode || "",
            bio: user?.bio || "",
            age: user?.age ?? 0,
            gender: user?.gender || "",
            phoneNumber: user?.phoneNumber || "",
            institution: user?.institution || "",
            department: user?.department || "",
            position: user?.position || "",
            specialization: user?.specialization || "",
            website: user?.website || "",
            experience: user?.experience || [],
            certifications: user?.certifications || [],
            skills: user?.skills || [],
            languages: user?.languages || [],
            officeLocation: user?.officeLocation || "",
            email: user?.email || "",
        }
    });

    // Reset form when user data is fetched or updated
    useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
                avatar: user.avatar || "",
                university: user.university || "",
                fieldOfStudy: user.fieldOfStudy || "",
                degreeLevel: user.degreeLevel || "BACHELOR",
                currentDegree: user.currentDegree || "BACHELOR",
                gpa: user.gpa ?? 0,
                graduationYear: user.graduationYear ?? new Date().getFullYear(),
                country: user.country || "",
                city: user.city || "",
                zipCode: user.zipCode || "",
                bio: user.bio || "",
                age: user.age ?? 0,
                gender: user.gender || "",
                phoneNumber: user.phoneNumber || "",
                institution: user.institution || "",
                department: user.department || "",
                position: user.position || "",
                specialization: user.specialization || "",
                website: user.website || "",
                experience: user.experience || [],
                certifications: user.certifications || [],
                skills: user.skills || [],
                languages: user.languages || [],
                officeLocation: user.officeLocation || "",
                email: user.email || "",
            });
        }
    }, [user, reset]);

    const watchDegreeLevel = watch("degreeLevel");
    const watchAvatar = watch("avatar");

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue("avatar", reader.result as string);
                onUpdateAvatar({ avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const onUpdateProfile = async (data: any) => {
        try {
            // Filter out empty language entries
            const validLanguages = languageProficiencies.filter(lang => lang.name.trim() !== "");

            // Consolidate data: Always use current skill/language state to prevent data loss 
            // during partial updates (Identity, Bio, etc.)
            const processedData = {
                ...data,
                skills: skillTags,
                languages: validLanguages,
                experience: experienceItems,
                certifications: certificationItems
            };

            await editProfile.mutate(processedData);

            // Close all active dialogs
            setIsEditing(false);
            setIsEditingAcademic(false);
            setIsEditingBio(false);
            setIsEditingSkills(false);
            setIsEditingLanguages(false);
            setIsEditingExperience(false);
            setIsEditingCertifications(false);

            // Re-sync to ensure any server-side completeness calculations are captured
            refresh();
        } catch (error) {
            console.error("Profile update failed:", error);
            toast({
                title: t.profile.toastUpdateFailed,
                description: t.profile.toastUpdateFailedDesc,
                variant: "destructive",
            });
        }
    };

    const onUpdateAvatar = async (data: { avatar: string }) => {
        try {
            await updateAvatarAction.mutate({ avatar: data.avatar });
            setIsEditingAvatar(false);
        } catch (error) {
            console.error("Avatar update failed:", error);
        }
    };

    const onDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Validation: Size (Max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: t.profile.toastFileTooLarge,
                description: t.profile.toastFileTooLargeDesc,
                variant: "destructive",
            });
            return;
        }

        // 2. Validation: Type (Academic Standard)
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png'
        ];
        if (!allowedTypes.includes(file.type)) {
            toast({
                title: t.profile.toastInvalidFormat,
                description: t.profile.toastInvalidFormatDesc,
                variant: "destructive",
            });
            return;
        }

        setIsUploadingDoc(true);
        const formData = new FormData();
        formData.append("document", file);

        try {
            // Updated to the dedicated document vault endpoint
            const response = await api.post("/users/profile/documents", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data) {
                toast({
                    title: t.profile.toastUploadSuccessful,
                    description: `${file.name} ${t.profile.toastUploadSuccessfulDesc}`,
                    variant: "default",
                });
                setIsEditingDocs(false);
                refresh(); // Update local state with new doc list
            }
        } catch (error: any) {
            toast({
                title: t.profile.toastUploadFailed,
                description: error.response?.data?.message || t.profile.toastUpdateFailedDesc,
                variant: "destructive",
            });
        } finally {
            setIsUploadingDoc(false);
            e.target.value = ""; // Clear input for future uploads
        }
    };

    const onDocumentDelete = async (documentPath: string) => {
        try {
            // Delete request hitting the consolidated student/professor vault endpoint
            const response = await api.delete("/users/profile/documents", {
                data: { documentPath }
            });

            if (response.data) {
                toast({
                    title: t.profile.toastVaultUpdated,
                    description: t.profile.toastVaultUpdatedDesc,
                    variant: "default",
                });
                refresh(); // Re-sync user data
            }
        } catch (error: any) {
            toast({
                title: t.profile.toastActionFailed,
                description: error.response?.data?.message || t.profile.toastActionFailedDesc,
                variant: "destructive",
            });
        }
    };

    if (isLoading && !user) {
        return (
            <div className="min-h-screen bg-slate-50 py-8">
                <div className="container max-w-6xl space-y-6">
                    <ProfileHeaderSkeleton />
                    <div className="grid gap-6 lg:grid-cols-2">
                        <ProfileFormSkeleton />
                        <ProfileFormSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    // Unified Progress & Completeness Intelligence (Standardized)
    // Comprehensive calculation including ALL profile data fields
    const completeness = user.profileCompleteness || 0;

    // Standardized Status System: POOR (≤50%), GOOD (51-79%), EXCELLENT (≥80%)
    const progressStatus = getProfileStatus(completeness);
    const progressMessage = getProgressMessage(completeness);
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Context Header Banner */}


            <div className="container max-w-7xl py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar: Profile Summary & Stats */}
                    <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <Card className={cn(
                                "border-none shadow-xl overflow-hidden relative",
                                progressStatus === "EXCELLENT" ? "bg-gradient-to-br from-emerald-50 to-green-50 shadow-emerald-200/50" :
                                    progressStatus === "GOOD" ? "bg-gradient-to-br from-yellow-50 to-amber-50 shadow-yellow-200/50" :
                                        "bg-gradient-to-br from-red-50 to-rose-50 shadow-red-200/50"
                            )}>
                                <div className={cn(
                                    "h-1.5 w-full",
                                    progressStatus === "EXCELLENT" ? "bg-gradient-to-r from-emerald-500 to-green-500" :
                                        progressStatus === "GOOD" ? "bg-gradient-to-r from-yellow-500 to-amber-500" :
                                            "bg-gradient-to-r from-red-500 to-rose-500"
                                )} />
                                <CardHeader className="pb-2 text-center border-b border-white/50">
                                    <CardTitle className={cn("text-[10px] font-bold tracking-widest uppercase", getStatusColor(progressStatus))}>
                                        {progressStatus}{t.profile.statusSuffix}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center pt-6 pb-8">
                                    <div className="relative h-36 w-36 mb-6">
                                        <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                                            <circle
                                                className="text-white/50"
                                                strokeWidth="8"
                                                stroke="currentColor"
                                                fill="transparent"
                                                r="42"
                                                cx="50"
                                                cy="50"
                                            />
                                            <circle
                                                className={cn("transition-all duration-1000 ease-out")}
                                                strokeWidth="8"
                                                strokeDasharray={264}
                                                strokeDashoffset={264 - (264 * completeness) / 100}
                                                strokeLinecap="round"
                                                stroke={progressStatus === "EXCELLENT" ? "#10b981" : progressStatus === "GOOD" ? "#eab308" : "#ef4444"}
                                                fill="transparent"
                                                r="42"
                                                cx="50"
                                                cy="50"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className={cn("text-4xl font-bold tracking-tighter", getStatusColor(progressStatus))}>{completeness}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full space-y-4 px-2 mb-6">
                                        <CompletenessStep label={t.profile.steps.bioIdentity} completed={!!(user.name && user.bio && user.avatar)} />
                                        <CompletenessStep label={t.profile.steps.contactInfo} completed={!!(user.phoneNumber && user.country)} />
                                        <CompletenessStep label={t.profile.steps.locationDetails} completed={!!(user.city && user.zipCode)} />
                                        <CompletenessStep label={t.profile.steps.personalInfo} completed={!!(user.age && user.gender)} />
                                        {mounted && user.role === 'STUDENT' ? (
                                            <>
                                                <CompletenessStep label={t.profile.steps.academicProfile} completed={!!(user.university && user.fieldOfStudy && user.gpa)} />
                                                <CompletenessStep label={t.profile.steps.degreeInfo} completed={!!(user.degreeLevel && user.graduationYear)} />
                                            </>
                                        ) : mounted ? (
                                            <>
                                                <CompletenessStep label={t.profile.steps.institutionalProfile} completed={!!(user.institution && user.department)} />
                                                <CompletenessStep label={t.profile.steps.academicPosition} completed={!!(user.position && user.specialization)} />
                                            </>
                                        ) : null}
                                        <CompletenessStep label={t.profile.steps.skillsMastery} completed={(user.skills?.length ?? 0) > 0} />
                                        <CompletenessStep label={t.profile.steps.languageProficiency} completed={(user.languages?.length ?? 0) > 0} />
                                        <CompletenessStep label={t.profile.steps.experience} completed={(user.experience?.length ?? 0) > 0} />
                                        <CompletenessStep label={t.profile.steps.certifications} completed={(user.certifications?.length ?? 0) > 0} />
                                        <CompletenessStep label={t.profile.steps.documentVault} completed={(user.documents?.length ?? 0) > 0} />
                                    </div>
                                    <p className={cn(
                                        "text-[10px] font-bold px-4 py-2 rounded-xl italic text-center w-full mb-4",
                                        progressStatus === "EXCELLENT" ? "text-emerald-700 bg-emerald-100/50" :
                                            progressStatus === "GOOD" ? "text-yellow-700 bg-yellow-100/50" :
                                                "text-red-700 bg-red-100/50"
                                    )}>
                                        {progressMessage}
                                    </p>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full rounded-xl font-bold text-xs h-10 transition-all",
                                            progressStatus === "EXCELLENT" ? "border-emerald-500/30 text-emerald-600 hover:bg-emerald-500 hover:text-white" :
                                                progressStatus === "GOOD" ? "border-yellow-500/30 text-yellow-600 hover:bg-yellow-500 hover:text-white" :
                                                    "border-red-500/30 text-red-600 hover:bg-red-500 hover:text-white"
                                        )}
                                        onClick={() => setIsEditing(true)}
                                    >
                                        {progressStatus === "EXCELLENT" ? t.profile.optimizeProfile : t.profile.improveNow}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="bg-gradient-to-br from-primary via-blue-600 to-purple-600 border-none shadow-2xl text-white overflow-hidden relative group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <GraduationCap className="h-20 w-20" />
                                </div>
                                <CardContent className="p-8 relative z-10">
                                    <h3 className="font-bold text-xl mb-3">{t.profile.scholarshipMatch}</h3>
                                    <p className="text-xs text-white/80 leading-relaxed mb-6 font-medium">
                                        {t.profile.scholarshipMatchDesc} <span className="text-white font-bold">{user.gpa || t.profile.yourMajor}</span> {t.profile.scholarshipMatchDesc2} <span className="text-white font-bold">{user.fieldOfStudy || t.profile.yourMajor}</span>, {t.profile.scholarshipMatchDesc3}
                                    </p>
                                    <Button variant="gradient" className="w-full font-bold h-11 rounded-xl shadow-xl shadow-black/20 bg-white text-primary hover:bg-white/90">{t.profile.findFunds}</Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Main Scrollable Content */}
                    <div className="lg:col-span-3 space-y-8 order-1 lg:order-2">
                        {/* 1. Header Card with Banner */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                                <CardContent className="p-0">
                                    <div className="h-32 bg-white relative overflow-hidden border-b border-slate-50">
                                        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                                    </div>
                                    <div className="px-10 pb-10 -mt-16 flex flex-col md:flex-row items-end gap-8 relative z-10 text-center md:text-left">
                                        <div className="relative group mx-auto md:mx-0">
                                            <div className="h-40 w-40 rounded-[2.5rem] border-8 border-white shadow-2xl overflow-hidden cursor-pointer relative bg-slate-50 ring-1 ring-slate-100 transition-transform active:scale-95" onClick={() => setIsEditingAvatar(true)}>
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-5xl font-bold text-primary/40">
                                                        {user.name?.charAt(0) || user.email?.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera className="h-8 w-8 text-white mb-2" />
                                                    <span className="text-[10px] font-bold text-white tracking-wider">{t.profile.updatePhoto}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-3 mb-2 w-full">
                                            <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                                                <div className="space-y-1 text-center md:text-left">
                                                    <h1 className="text-4xl font-bold tracking-tight text-slate-800">{user.name || t.profile.scholarUser}</h1>
                                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                                        <Badge className="bg-primary/10 text-primary border-primary/20 rounded-lg font-bold text-[10px] tracking-wide px-3 py-1">{user.role}</Badge>
                                                        {mounted && user.role === 'PROFESSOR' ? user.isVerified ? (
                                                            <Badge variant="outline" className="w-fit text-emerald-600">
                                                                <UserCheck className="h-3 w-3 mr-1" />
                                                                {t.profile.verified}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="w-fit text-amber-600 bg-amber-50">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                {t.profile.pending}
                                                            </Badge>
                                                        ) : null}


                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-2 text-xs font-bold text-slate-400 tracking-wide">
                                                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {user.country || t.profile.globalScholar}</span>
                                                <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {user.email}</span>
                                                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {t.profile.joined} {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* 2. Role-Specific Primary Data Card */}
                        {mounted && user.role === "PROFESSOR" ? (
                            <ProfileSection title={t.profile.sectionInstitutional} icon={Building2} onEdit={() => setIsEditingAcademic(true)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <InfoItem label={t.profile.primaryInstitution} value={user.institution} icon={Building2} />
                                    <InfoItem label={t.profile.facultyDept} value={user.department} icon={BookOpen} />
                                    <InfoItem label={t.profile.academicPosition} value={user.position} icon={Award} />
                                    <InfoItem label={t.profile.researchSpec} value={user.specialization} icon={TrendingUp} />
                                    <InfoItem label={t.profile.totalExperience} value={user.experience && user.experience.length > 0 ? `${user.experience.length} ${t.profile.professionalPositions}` : undefined} icon={Briefcase} />
                                    <InfoItem label={t.profile.steps.certifications} value={certificationItems.length > 0 ? `${certificationItems.length} ${t.profile.verifiedCredentials}` : undefined} icon={Award} />
                                </div>
                            </ProfileSection>
                        ) : mounted ? (
                            <ProfileSection title={t.profile.sectionAcademic} icon={GraduationCap} onEdit={() => setIsEditingAcademic(true)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <InfoItem label={t.profile.hostUniversity} value={user.university} icon={Building2} />
                                    <InfoItem label={t.profile.fieldOfStudy} value={user.fieldOfStudy} icon={BookOpen} />
                                    <InfoItem label={t.profile.currentGPA} value={user.gpa ? `${user.gpa} / 4.0` : undefined} icon={TrendingUp} highlight />
                                    <InfoItem label={t.profile.expectedGrad} value={user.graduationYear ? String(user.graduationYear) : undefined} icon={Calendar} />
                                    <InfoItem label={t.profile.targetDegree} value={user.degreeLevel} icon={Award} />
                                    <InfoItem label={t.profile.currentLevel} value={user.currentDegree} icon={ShieldCheck} />
                                    <InfoItem label={t.profile.workExperience} value={user.experience && user.experience.length > 0 ? `${user.experience.length} ${t.profile.positions}` : undefined} icon={Briefcase} />
                                    <InfoItem label={t.profile.steps.certifications} value={certificationItems.length > 0 ? `${certificationItems.length} ${t.profile.credentials}` : undefined} icon={Award} highlight />
                                </div>
                            </ProfileSection>
                        ) : null}

                        {/* 3. Personal Info Section */}
                        <ProfileSection title={t.profile.sectionPersonal} icon={User} onEdit={() => setIsEditing(true)}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8">
                                <InfoItem label={t.profile.fullName} value={user.name} icon={User} />
                                <InfoItem label={t.profile.accountEmail} value={user.email} icon={Mail} />
                                <InfoItem label={t.profile.phoneNumber} value={user.phoneNumber} icon={Phone} />
                                <InfoItem label={t.profile.nationality} value={user.country} icon={Globe} />
                                <InfoItem label={t.profile.city} value={user.city} icon={MapPin} />
                                <InfoItem label={t.profile.zipCode} value={user.zipCode} icon={MapPin} />
                                <InfoItem label={t.profile.age} value={user.age ? `${user.age} ${t.profile.years}` : undefined} icon={Calendar} />
                                <InfoItem label={t.profile.gender} value={user.gender} icon={User} />
                                {mounted && user.role === "PROFESSOR" && (
                                    <InfoItem label={t.profile.website} value={user.website} icon={Globe} link />
                                )}
                                <InfoItem label={t.profile.roleStatus} value={user.role} icon={ShieldCheck} highlight />
                            </div>
                        </ProfileSection>

                        {/* 4. Professional Summary Section */}
                        <ProfileSection title={t.profile.sectionBio} icon={Layout} onEdit={() => setIsEditingBio(true)}>
                            <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 relative group overflow-hidden">
                                <Quote className="h-12 w-12 text-primary/5 absolute -top-2 -left-2 rotate-12 group-hover:scale-110 transition-transform" />
                                <p className="text-slate-600 leading-relaxed font-medium italic text-lg text-center md:text-left">
                                    {user.bio || (mounted && user.role === "PROFESSOR"
                                        ? t.profile.profDefaultBio + " " + (user.institution || t.profile.defaultInstitution) + "."
                                        : t.profile.studentDefaultBio)}
                                </p>
                            </div>
                        </ProfileSection>

                        {/* 5. Documents Section */}
                        <ProfileSection title={t.profile.sectionDocuments} icon={FileText}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {user.documents && user.documents.length > 0 ? (
                                    user.documents.map((doc, idx) => {
                                        const fileName = doc.split('/').pop() || "Document";
                                        const extension = fileName.split('.').pop()?.toUpperCase() || "FILE";
                                        const isImage = ["JPG", "JPEG", "PNG", "WEBP"].includes(extension);

                                        return (
                                            <DocCard
                                                key={idx}
                                                name={fileName}
                                                url={doc}
                                                type={isImage ? "Image" : extension}
                                                size="Secure"
                                                date="Verified"
                                                onDelete={() => onDocumentDelete(doc)}
                                            />
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full py-8 px-6 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200 text-center">
                                        <p className="text-xs font-bold text-slate-400 italic">{t.profile.noDocuments}</p>
                                    </div>
                                )}
                                <div
                                    className="border-2 border-dashed border-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group"
                                    onClick={() => setIsEditingDocs(true)}
                                >
                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <PlusCircle className="h-6 w-6 text-primary/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 tracking-wide">{t.profile.uploadProof}</span>
                                </div>
                            </div>
                        </ProfileSection>

                        {/* 5. Experience Timeline */}
                        <ProfileSection title={t.profile.sectionExperience} icon={Briefcase} onAdd={() => setIsEditingExperience(true)}>
                            <div className="space-y-4">
                                {experienceItems.length > 0 ? (
                                    experienceItems.map((exp, idx) => (
                                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:text-red-500 hover:bg-red-50"
                                                onClick={() => handleRemoveExperience(idx)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Briefcase className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-slate-800">{exp.title || t.profile.position}</h4>
                                                    <p className="text-sm text-slate-600">{exp.organization || t.profile.expOrganization}</p>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                        <span>{exp.startDate || t.profile.start} - {exp.endDate || t.profile.present}</span>
                                                        {exp.location && <span>• {exp.location}</span>}
                                                    </div>
                                                    {exp.description && <p className="text-sm text-slate-500 mt-2">{exp.description}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                        <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-sm text-slate-500">{t.profile.noExperience}</p>
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    className="w-full h-10 rounded-xl border-dashed border-2 font-medium"
                                    onClick={() => {
                                        handleAddExperience();
                                        setIsEditingExperience(true);
                                    }}
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    {t.profile.addExperience}
                                </Button>
                            </div>
                        </ProfileSection>
                        {/* 6. Training & Certifications */}
                        <ProfileSection title={t.profile.sectionTraining} icon={Award} onAdd={() => setIsEditingCertifications(true)}>
                            <div className="space-y-4">
                                {certificationItems.length > 0 ? (
                                    certificationItems.map((cert, idx) => (
                                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:text-red-500 hover:bg-red-50"
                                                onClick={() => handleRemoveCertification(idx)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Award className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-slate-800">{cert.title || t.profile.certificationLabel}</h4>
                                                    <p className="text-sm text-slate-600">{cert.organization || t.profile.issuingOrg}</p>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                        <span>{t.profile.issuedLabel} {cert.issueDate || "-"}</span>
                                                        {cert.expiryDate && <span>• {t.profile.expiresLabel} {cert.expiryDate}</span>}
                                                    </div>
                                                    {cert.credentialId && <p className="text-xs text-slate-400 mt-1">{t.profile.idLabel} {cert.credentialId}</p>}
                                                    {cert.credentialUrl && (
                                                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold mt-2 hover:underline">
                                                            {t.profile.viewCredential} <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                        <Award className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-sm text-slate-500">{t.profile.noCertifications}</p>
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    className="w-full h-10 rounded-xl border-dashed border-2 font-medium"
                                    onClick={() => {
                                        handleAddCertification();
                                        setIsEditingCertifications(true);
                                    }}
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    {t.profile.addCertification}
                                </Button>
                            </div>
                        </ProfileSection>



                        {/* 7. Skills & Languages in Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ProfileSection title={t.profile.sectionSkills} icon={Settings} onEdit={() => setIsEditingSkills(true)}>
                                <div className="flex flex-wrap gap-2">
                                    {(user.skills && user.skills.length > 0) ? user.skills.map(skill => (
                                        <Badge key={skill} variant="secondary" className="px-5 py-2.5 rounded-2xl font-bold text-[10px] tracking-wide bg-slate-50 text-slate-600 border-none hover:bg-primary hover:text-white transition-all cursor-default text-xs">
                                            {skill}
                                        </Badge>
                                    )) : (
                                        <div className="w-full py-4 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                            <p className="text-[10px] font-bold text-slate-400 italic">{t.profile.noSkills}</p>
                                        </div>
                                    )}
                                    <Button variant="outline" size="sm" className="rounded-2xl border-dashed border-2 h-10 px-6 font-bold text-primary hover:bg-primary/5 transition-colors" onClick={() => setIsEditingSkills(true)}>
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        {t.profile.addSkill}
                                    </Button>
                                </div>
                            </ProfileSection>

                            <ProfileSection title={t.profile.sectionLanguages} icon={Globe} onEdit={() => setIsEditingLanguages(true)}>
                                <div className="space-y-6">
                                    {(user.languages && user.languages.length > 0) ? user.languages.map((lang: any) => (
                                        <LanguageItem key={lang.name} label={lang.name} proficiency={lang.proficiency} />
                                    )) : (
                                        <div className="w-full py-6 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                            <p className="text-[10px] font-bold text-slate-400 italic text-center">{t.profile.noLanguages}</p>
                                        </div>
                                    )}
                                    <Button variant="outline" className="w-full mt-4 rounded-xl border-dashed border-2 font-bold text-xs h-10 border-primary/20 text-primary hover:bg-primary/5" onClick={() => setIsEditingLanguages(true)}>
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        {t.profile.addLanguage}
                                    </Button>
                                </div>
                            </ProfileSection>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Photo Update Dialog */}
            <Dialog open={isEditingAvatar} onOpenChange={setIsEditingAvatar}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border border-slate-200 shadow-xl rounded-lg">
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                        <h2 className="text-xl font-semibold text-slate-900">{t.profile.dialogUpdatePhoto}</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100" onClick={() => setIsEditingAvatar(false)}>
                            <X className="h-4 w-4 text-slate-500" />
                        </Button>
                    </div>
                    <div className="p-6 flex flex-col items-center gap-6">
                        <div className="h-40 w-40 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 relative">
                            {watchAvatar ? (
                                <img src={watchAvatar} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                    <Camera className="h-10 w-10 text-slate-300" />
                                </div>
                            )}
                        </div>
                        <div className="w-full space-y-3">
                            <Button
                                className="w-full h-11 rounded-md font-medium"
                                variant="outline"
                                onClick={() => document.getElementById('avatar-upload-dialog')?.click()}
                            >
                                <Camera className="h-4 w-4 mr-2" />
                                {t.profile.selectNewImage}
                            </Button>
                            <input type="file" id="avatar-upload-dialog" className="hidden" accept="image/*" onChange={onImageChange} />
                            <div className="flex gap-3">
                                <Button variant="outline" className="h-11 flex-1 rounded-md font-medium" onClick={() => setIsEditingAvatar(false)}>{t.profile.cancel}</Button>
                                <Button className="h-11 flex-[2] rounded-md font-medium bg-primary hover:bg-primary/90 text-white" onClick={() => setIsEditingAvatar(false)}>{t.profile.save}</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 1. Personal Identity Dialog */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white border border-slate-200 shadow-xl rounded-lg">
                    <form onSubmit={handleSubmit(onUpdateProfile)} className="flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-semibold text-slate-900">{t.profile.dialogPersonalIdentity}</h2>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100" onClick={() => setIsEditing(false)}>
                                <X className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <User className="h-4 w-4 text-primary" /> {t.profile.fieldFullName}
                                    </Label>
                                    <Input {...register("name")} className={`h-11 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 transition-all ${errors.name ? 'border-red-500 bg-red-50/10' : ''}`} placeholder="e.g. John Doe" />
                                    {errors.name && <p className="text-[10px] font-bold text-red-500 pl-1">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-primary" /> {t.profile.fieldPhoneNumber}
                                    </Label>
                                    <Input {...register("phoneNumber")} className={`h-11 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 transition-all ${errors.phoneNumber ? 'border-red-500 bg-red-50/10' : ''}`} placeholder="+1..." />
                                    {errors.phoneNumber && <p className="text-[10px] font-bold text-red-500 pl-1">{errors.phoneNumber.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-primary" /> {t.profile.fieldCountry}
                                    </Label>
                                    <Input {...register("country")} className="h-11 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 transition-all" placeholder="e.g. United States" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" /> {t.profile.fieldCity}
                                    </Label>
                                    <Input {...register("city")} className="h-11 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" /> {t.profile.fieldZipCode}
                                    </Label>
                                    <Input {...register("zipCode")} className="h-11 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 transition-all" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">{t.profile.fieldAge}</Label>
                                    <Input type="number" {...register("age", { valueAsNumber: true })} className={`h-10 rounded-md border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${errors.age ? 'border-red-500' : ''}`} />
                                    {errors.age && <p className="text-[10px] font-bold text-red-500">{errors.age.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">{t.profile.fieldGender}</Label>
                                    <Select value={watch("gender")} onValueChange={(v) => setValue("gender", v)}>
                                        <SelectTrigger className="h-10 rounded-md border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MALE">{t.profile.genderMale}</SelectItem>
                                            <SelectItem value="FEMALE">{t.profile.genderFemale}</SelectItem>
                                            <SelectItem value="OTHER">{t.profile.genderOther}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {user.role === "PROFESSOR" && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">{t.profile.fieldPortfolio}</Label>
                                    <Input {...register("website")} className={`h-10 rounded-md border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${errors.website ? 'border-red-500' : ''}`} placeholder="https://..." />
                                    {errors.website && <p className="text-[10px] font-bold text-red-500">{errors.website.message}</p>}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button type="button" variant="outline" className="h-10 flex-1 rounded-md font-medium" onClick={() => setIsEditing(false)}>{t.profile.cancel}</Button>
                            <Button type="submit" className="h-10 flex-[2] rounded-md font-medium bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                {t.profile.save}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 2. Academic / Institutional Credentials Dialog */}
            <Dialog open={isEditingAcademic} onOpenChange={setIsEditingAcademic}>
                <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white border border-slate-200 shadow-xl rounded-lg">
                    <form onSubmit={handleSubmit(onUpdateProfile)} className="flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-semibold text-slate-900">{t.profile.dialogAcademicCredentials}</h2>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100" onClick={() => setIsEditingAcademic(false)}>
                                <X className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {mounted && user.role === "PROFESSOR" ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-primary" /> {t.profile.fieldCurrentInstitution}
                                            </Label>
                                            <Input {...register("institution")} className="h-11 rounded-xl border-slate-200" placeholder="e.g. Stanford University" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-primary" /> {t.profile.fieldFacultyDept}
                                            </Label>
                                            <Input {...register("department")} className="h-11 rounded-xl border-slate-200" placeholder="e.g. Computer Science" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <Award className="h-4 w-4 text-primary" /> {t.profile.fieldAcademicPosition}
                                            </Label>
                                            <Input {...register("position")} className="h-11 rounded-xl border-slate-200" placeholder="e.g. Associate Professor" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4 text-primary" /> {t.profile.fieldResearchSpec}
                                            </Label>
                                            <Input {...register("specialization")} className="h-11 rounded-xl border-slate-200" placeholder="e.g. Machine Learning" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-primary" /> {t.profile.fieldOfficeLocation}
                                        </Label>
                                        <Input {...register("officeLocation")} className="h-11 rounded-xl border-slate-200" placeholder="e.g. Building A, Room 305" />
                                    </div>
                                </>
                            ) : mounted ? (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-primary" /> {t.profile.fieldHostUniversity}
                                        </Label>
                                        <Input {...register("university")} className="h-11 rounded-xl border-slate-200" placeholder="e.g. University of Tokyo" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <GraduationCap className="h-4 w-4 text-primary" /> {t.profile.fieldCurrentDegree}
                                            </Label>
                                            <Input {...register("currentDegree")} className="h-11 rounded-xl border-slate-200" placeholder="e.g. B.Sc. Candidate" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <Award className="h-4 w-4 text-primary" /> {t.profile.fieldTargetDegree}
                                            </Label>
                                            <Select value={watchDegreeLevel} onValueChange={(v) => setValue("degreeLevel", v)}>
                                                <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                                                <SelectContent>{DEGREE_LEVELS.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-2 col-span-1">
                                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4 text-primary" /> {t.profile.fieldGPA}
                                            </Label>
                                            <Input type="number" step="0.01" {...register("gpa", { valueAsNumber: true })} className={`h-11 rounded-xl border-slate-200 ${errors.gpa ? 'border-red-500 bg-red-50/10' : ''}`} placeholder="3.8" />
                                            {errors.gpa && <p className="text-[10px] font-bold text-red-500 pl-1">{errors.gpa.message}</p>}
                                        </div>
                                        <div className="space-y-2 col-span-1">
                                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-primary" /> {t.profile.fieldGradYear}
                                            </Label>
                                            <Input type="number" {...register("graduationYear", { valueAsNumber: true })} className="h-11 rounded-xl border-slate-200" placeholder="2025" />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-primary" /> {t.profile.fieldMajor}
                                            </Label>
                                            <Input {...register("fieldOfStudy")} className="h-11 rounded-xl border-slate-200" placeholder="e.g. AI & Robotics" />
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button type="button" variant="outline" className="h-10 flex-1 rounded-md font-medium" onClick={() => setIsEditingAcademic(false)}>{t.profile.cancel}</Button>
                            <Button type="submit" className="h-10 flex-[2] rounded-md font-medium bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                {t.profile.save}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 3. Story & Biography Dialog */}
            <Dialog open={isEditingBio} onOpenChange={setIsEditingBio}>
                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-white border border-slate-200 shadow-xl rounded-lg">
                    <form onSubmit={handleSubmit(onUpdateProfile)} className="flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-semibold text-slate-900">{t.profile.dialogAcademicBiography}</h2>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100" onClick={() => setIsEditingBio(false)}>
                                <X className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">{t.profile.fieldPersonalBio}</Label>
                                <Textarea
                                    {...register("bio")}
                                    className={`rounded-md border-slate-200 min-h-[180px] focus:border-blue-500 focus:ring-blue-500 ${errors.bio ? 'border-red-500' : ''}`}
                                    placeholder={t.profile.bioPlaceholder}
                                />
                                {errors.bio && <p className="text-[10px] font-bold text-red-500 pl-1">{errors.bio.message}</p>}
                                <p className="text-xs text-slate-500">{t.profile.bioHelper}</p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button type="button" variant="outline" className="h-10 flex-1 rounded-md font-medium" onClick={() => setIsEditingBio(false)}>{t.profile.cancel}</Button>
                            <Button type="submit" className="h-10 flex-[2] rounded-md font-medium bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                {t.profile.save}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Specialized Skills & Expertise Dialog */}
            <Dialog open={isEditingSkills} onOpenChange={setIsEditingSkills}>
                <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-white border border-slate-200 shadow-xl rounded-lg">
                    <form onSubmit={handleSubmit(onUpdateProfile)} className="flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-semibold text-slate-900">{t.profile.dialogExpertiseProfile}</h2>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100" onClick={() => setIsEditingSkills(false)}>
                                <X className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">{t.profile.currentSkills}</Label>
                                <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-slate-50 rounded-md border border-slate-200">
                                    <AnimatePresence>
                                        {skillTags.length > 0 ? skillTags.map(skill => (
                                            <motion.div key={skill} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                                                <Badge variant="secondary" className="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all cursor-default">
                                                    <span className="text-sm">{skill}</span>
                                                    <Button type="button" variant="ghost" size="icon" className="h-4 w-4 rounded hover:bg-transparent" onClick={() => handleRemoveSkill(skill)}>
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </Badge>
                                            </motion.div>
                                        )) : (
                                            <p className="text-sm text-slate-400 py-2">{t.profile.noSkillsYet}</p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">{t.profile.addNewSkill}</Label>
                                <Input
                                    value={skillInputValue}
                                    onChange={(e) => setSkillInputValue(e.target.value)}
                                    onKeyDown={handleAddSkill}
                                    className="h-10 rounded-md border-slate-200"
                                    placeholder={t.profile.skillPlaceholder}
                                />
                                <p className="text-xs text-slate-500">{t.profile.skillHint}</p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button type="button" variant="outline" className="h-10 flex-1 rounded-md font-medium" onClick={() => setIsEditingSkills(false)}>{t.profile.cancel}</Button>
                            <Button type="submit" className="h-10 flex-[2] rounded-md font-medium bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                {t.profile.save}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Specialized Language Mastery Dialog */}
            <Dialog open={isEditingLanguages} onOpenChange={setIsEditingLanguages}>
                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-white border border-slate-200 shadow-xl rounded-lg">
                    <form onSubmit={handleSubmit(onUpdateProfile)} className="flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-semibold text-slate-900">{t.profile.dialogLanguages}</h2>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100" onClick={() => setIsEditingLanguages(false)}>
                                <X className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {languageProficiencies.length > 0 ? (
                                languageProficiencies.map((lang, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 rounded-md border border-slate-200 relative">
                                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 absolute top-3 right-3 rounded hover:text-red-500 hover:bg-red-50" onClick={() => handleRemoveLanguage(idx)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700">{t.profile.languageName}</Label>
                                                <Input value={lang.name} onChange={(e) => handleUpdateLanguage(idx, "name", e.target.value)} className="h-10 rounded-md border-slate-200" placeholder="e.g. Spanish" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700">{t.profile.proficiencyLevel}</Label>
                                                <Select value={lang.level} onValueChange={(v) => handleUpdateLanguage(idx, "level", v)}>
                                                    <SelectTrigger className="h-10 rounded-md border-slate-200"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {[t.profile.levels.beginner, t.profile.levels.intermediate, t.profile.levels.advanced, t.profile.levels.professional, t.profile.levels.native].map(l => (
                                                            <SelectItem key={l} value={l}>{l}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-sm font-medium text-slate-700">{t.profile.proficiency}</Label>
                                                <span className="text-sm font-medium text-slate-700">{lang.proficiency}%</span>
                                            </div>
                                            <input type="range" min="0" max="100" value={lang.proficiency} onChange={(e) => handleUpdateLanguage(idx, "proficiency", parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-slate-50 rounded-md border border-dashed border-slate-200">
                                    <Globe className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">{t.profile.noLanguagesYet}</p>
                                </div>
                            )}

                            <Button type="button" variant="outline" className="w-full h-10 rounded-md border-dashed border-2" onClick={handleAddLanguage}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                {t.profile.addLanguage}
                            </Button>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button type="button" variant="outline" className="h-10 flex-1 rounded-md font-medium" onClick={() => setIsEditingLanguages(false)}>{t.profile.cancel}</Button>
                            <Button type="submit" className="h-10 flex-[2] rounded-md font-medium bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                {t.profile.save}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Experience Timeline Dialog */}
            <Dialog open={isEditingExperience} onOpenChange={setIsEditingExperience}>
                <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white border border-slate-200 shadow-xl rounded-lg">
                    <form onSubmit={handleSubmit(onUpdateProfile)} className="flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-semibold text-slate-900">{t.profile.dialogExperienceTimeline}</h2>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100" onClick={() => setIsEditingExperience(false)}>
                                <X className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {experienceItems.length > 0 ? (
                                experienceItems.map((exp, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 rounded-md border border-slate-200 relative space-y-4">
                                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 absolute top-3 right-3 rounded hover:text-red-500 hover:bg-red-50" onClick={() => handleRemoveExperience(idx)}>
                                            <X className="h-4 w-4" />
                                        </Button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700">{t.profile.jobTitle}</Label>
                                                <Input value={exp.title} onChange={(e) => handleUpdateExperience(idx, "title", e.target.value)} className="h-10 rounded-md border-slate-200" placeholder="e.g. Senior Researcher" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700">{t.profile.expOrganization}</Label>
                                                <Input value={exp.organization} onChange={(e) => handleUpdateExperience(idx, "organization", e.target.value)} className="h-10 rounded-md border-slate-200" placeholder="e.g. MIT" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700">{t.profile.startDate}</Label>
                                                <Input value={exp.startDate} onChange={(e) => handleUpdateExperience(idx, "startDate", e.target.value)} className="h-10 rounded-md border-slate-200" placeholder="Jan 2020" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700">{t.profile.endDate}</Label>
                                                <Input value={exp.endDate} onChange={(e) => handleUpdateExperience(idx, "endDate", e.target.value)} className="h-10 rounded-md border-slate-200" placeholder="Present" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700">{t.profile.location}</Label>
                                                <Input value={exp.location} onChange={(e) => handleUpdateExperience(idx, "location", e.target.value)} className="h-10 rounded-md border-slate-200" placeholder="Cambridge, MA" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-slate-700">{t.profile.description}</Label>
                                            <Textarea value={exp.description} onChange={(e) => handleUpdateExperience(idx, "description", e.target.value)} className="rounded-md border-slate-200 min-h-[80px]" placeholder="Briefly describe your role and achievements..." />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-slate-50 rounded-md border border-dashed border-slate-200">
                                    <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">{t.profile.noExperienceYet}</p>
                                </div>
                            )}

                            <Button type="button" variant="outline" className="w-full h-10 rounded-md border-dashed border-2" onClick={handleAddExperience}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                {t.profile.addPosition}
                            </Button>
                        </div>

                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button type="button" variant="outline" className="h-10 flex-1 rounded-md font-medium" onClick={() => setIsEditingExperience(false)}>{t.profile.cancel}</Button>
                            <Button type="submit" className="h-10 flex-[2] rounded-md font-medium bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                {t.profile.save}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Certifications Dialog */}
            <Dialog open={isEditingCertifications} onOpenChange={setIsEditingCertifications}>
                <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white border border-slate-200 shadow-xl rounded-lg">
                    <form onSubmit={handleSubmit(onUpdateProfile)} className="flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-semibold text-slate-900">{t.profile.dialogTrainingCerts}</h2>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100" onClick={() => setIsEditingCertifications(false)}>
                                <X className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {certificationItems.length > 0 ? (
                                certificationItems.map((cert, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 rounded-md border border-slate-200 relative space-y-4">
                                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 absolute top-3 right-3 rounded hover:text-red-500 hover:bg-red-50" onClick={() => handleRemoveCertification(idx)}>
                                            <X className="h-4 w-4" />
                                        </Button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700">{t.profile.certTitle}</Label>
                                                <Input value={cert.title} onChange={(e) => handleUpdateCertification(idx, "title", e.target.value)} className="h-10 rounded-md border-slate-200" placeholder="e.g. AWS Certified Solutions Architect" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700">{t.profile.issuingOrganization}</Label>
                                                <Input value={cert.organization} onChange={(e) => handleUpdateCertification(idx, "organization", e.target.value)} className="h-10 rounded-md border-slate-200" placeholder="e.g. Amazon Web Services" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700">{t.profile.issueDate}</Label>
                                                <Input value={cert.issueDate} onChange={(e) => handleUpdateCertification(idx, "issueDate", e.target.value)} className="h-10 rounded-md border-slate-200" placeholder="e.g. Jan 2023" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700">{t.profile.expiryDate}</Label>
                                                <Input value={cert.expiryDate} onChange={(e) => handleUpdateCertification(idx, "expiryDate", e.target.value)} className="h-10 rounded-md border-slate-200" placeholder="e.g. Jan 2026" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700">{t.profile.credentialId}</Label>
                                                <Input value={cert.credentialId} onChange={(e) => handleUpdateCertification(idx, "credentialId", e.target.value)} className="h-10 rounded-md border-slate-200" placeholder="e.g. ABC-123-XYZ" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700">{t.profile.credentialUrl}</Label>
                                                <Input value={cert.credentialUrl} onChange={(e) => handleUpdateCertification(idx, "credentialUrl", e.target.value)} className="h-10 rounded-md border-slate-200" placeholder="https://..." />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-slate-50 rounded-md border border-dashed border-slate-200">
                                    <Award className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">{t.profile.noCertsYet}</p>
                                </div>
                            )}

                            <Button type="button" variant="outline" className="w-full h-10 rounded-md border-dashed border-2" onClick={handleAddCertification}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                {t.profile.addCertification}
                            </Button>
                        </div>

                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button type="button" variant="outline" className="h-10 flex-1 rounded-md font-medium" onClick={() => setIsEditingCertifications(false)}>{t.profile.cancel}</Button>
                            <Button type="submit" className="h-10 flex-[2] rounded-md font-medium bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                {t.profile.save}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Academic Document Vault Dialog */}
            <Dialog open={isEditingDocs} onOpenChange={setIsEditingDocs}>
                <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-white border border-slate-200 shadow-xl rounded-lg flex flex-col max-h-[90vh]">
                    <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                        <h2 className="text-xl font-semibold text-slate-900">{t.profile.dialogDocumentVault}</h2>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100" onClick={() => setIsEditingDocs(false)}>
                            <X className="h-4 w-4 text-slate-500" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center gap-3 transition-all cursor-pointer",
                                isUploadingDoc ? "bg-slate-50 border-slate-300" : "bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                            )}
                            onClick={() => !isUploadingDoc && document.getElementById('vault-upload')?.click()}
                        >
                            {isUploadingDoc ? (
                                <>
                                    <Loader2 className="h-8 w-8 text-slate-600 animate-spin" />
                                    <p className="text-sm font-medium text-slate-600">{t.profile.uploading}</p>
                                </>
                            ) : (
                                <>
                                    <div className="h-12 w-12 rounded-md bg-white border border-slate-200 flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{t.profile.dropFile}</p>
                                        <p className="text-xs text-slate-500 mt-1">{t.profile.docFormats}</p>
                                    </div>
                                </>
                            )}
                            <input type="file" id="vault-upload" className="hidden" onChange={onDocumentUpload} disabled={isUploadingDoc} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-emerald-50 rounded-md border border-emerald-200 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                <span className="text-xs font-medium text-emerald-700">{t.profile.encrypted}</span>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-md border border-blue-200 flex items-center gap-2">
                                <Globe className="h-4 w-4 text-blue-600" />
                                <span className="text-xs font-medium text-blue-700">{t.profile.private}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 shrink-0">
                        <Button type="button" variant="outline" className="w-full h-10 rounded-md font-medium" onClick={() => setIsEditingDocs(false)} disabled={isUploadingDoc}>{t.profile.close}</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// --- Specialized Internal Components ---

function ProfileSection({ title, icon: Icon, children, onEdit, onAdd }: { title: string; icon: any; children: React.ReactNode; onEdit?: () => void; onAdd?: () => void; }) {
    return (
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white group">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 py-8 px-10">
                    <CardTitle className="text-xl flex items-center gap-4 font-bold text-slate-800 tracking-tight italic">
                        <div className="p-3 rounded-2xl bg-primary/10 ring-4 ring-primary/5 group-hover:scale-110 transition-transform">
                            <Icon className="h-6 w-6 text-primary" />
                        </div>
                        {title}
                    </CardTitle>
                    <div className="flex gap-3">
                        {onAdd && <Button variant="ghost" size="icon" onClick={onAdd} className="h-10 w-10 rounded-xl text-primary hover:bg-primary/5 active:scale-90 transition-all"><PlusCircle className="h-6 w-6" /></Button>}
                        {onEdit && <Button variant="ghost" size="icon" onClick={onEdit} className="h-10 w-10 rounded-xl text-slate-300 hover:text-primary active:scale-90 transition-all"><PencilLine className="h-5 w-5" /></Button>}
                    </div>
                </CardHeader>
                <CardContent className="p-10">{children}</CardContent>
            </Card>
        </motion.div>
    );
}

function InfoItem({ label, value, icon: Icon, link, highlight }: { label: string, value?: string | number, icon?: any, link?: boolean, highlight?: boolean }) {
    const { t } = useTranslation();
    return (
        <div className="space-y-2 group">
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors" />}
                <span className="text-[10px] font-bold text-slate-400 tracking-wide">{label}</span>
            </div>
            {link && value ? (
                <a href={String(value).startsWith('http') ? String(value) : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary hover:underline flex items-center gap-1.5 transition-all">
                    {value} <ExternalLink className="h-3 w-3" />
                </a>
            ) : (
                <p className={cn("text-md font-bold text-slate-700", highlight && "text-primary italic")}>
                    {value || <span className="text-slate-200 italic font-medium">{t.profile.notProvided}</span>}
                </p>
            )}
        </div>
    );
}

function ExperienceItem({ title, org, date, location, detail, edu }: { title: string, org: string, date: string, location: string, detail?: string, edu?: boolean }) {
    return (
        <div className="flex gap-8 group relative">
            <div className="flex flex-col items-center">
                <div className={cn("h-14 w-14 rounded-2xl shadow-xl flex items-center justify-center relative z-10 p-3 ring-4 ring-white transition-all group-hover:scale-110", edu ? "bg-primary text-white" : "bg-white text-primary border border-slate-100")}>
                    {edu ? <GraduationCap className="h-full w-full" /> : <Briefcase className="h-full w-full" />}
                </div>
                <div className="flex-1 w-0.5 bg-slate-100 my-4 group-last:hidden" />
            </div>
            <div className="flex-1 pb-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <h4 className="font-bold text-slate-800 text-xl tracking-tight">{title}</h4>
                    <span className="text-[10px] font-bold tracking-wide text-primary bg-primary/5 px-4 py-1.5 rounded-2xl border border-primary/20 shadow-sm">{date}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-400 tracking-wide mb-4">
                    <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-default"><Building2 className="h-4 w-4" /> {org}</span>
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {location}</span>
                </div>
                {detail && <p className="text-slate-500 leading-relaxed font-bold bg-slate-50/50 p-5 rounded-3xl border border-slate-100 text-sm italic">{detail}</p>}
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-200 hover:text-primary"><PencilLine className="h-5 w-5" /></Button>
                </div>
            </div>
        </div>
    );
}

function LanguageItem({ label, proficiency }: { label: string, proficiency: number }) {
    const { t } = useTranslation();
    const getLevel = (p: number) => {
        if (p >= 90) return t.profile.levels.native;
        if (p >= 75) return t.profile.levels.professional;
        if (p >= 50) return t.profile.levels.advanced;
        if (p >= 25) return t.profile.levels.intermediate;
        return t.profile.levels.beginner;
    };

    return (
        <div className="space-y-3 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-slate-800 text-lg tracking-tight italic">{label}</p>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wide mt-1">{getLevel(proficiency)}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-xs font-bold text-primary border border-slate-50">
                    {proficiency}%
                </div>
            </div>
            <Progress value={proficiency} className="h-2 bg-slate-200" />
        </div>
    );
}

function DocCard({ name, type, size, date, url, onDelete }: { name: string, type: string, size: string, date: string, url?: string, onDelete?: () => void }) {
    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!url) return;
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed:", error);
            window.open(url, '_blank');
        }
    };

    const isImage = type === "Image" || ["JPG", "PNG", "JPEG"].includes(type.toUpperCase());
    const isPDF = type === "PDF";

    return (
        <div
            className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-6 hover:border-primary/20 transition-all group relative cursor-default"
        >
            <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {isImage ? (
                        <Camera className="h-8 w-8 text-primary" />
                    ) : isPDF ? (
                        <FileText className="h-8 w-8 text-primary" />
                    ) : (
                        <BookOpen className="h-8 w-8 text-primary" />
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-slate-200 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                        onClick={handleDownload}
                    >
                        <Download className="h-5 w-5" />
                    </Button>
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                        >
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>
            <div>
                <p className="text-lg font-bold text-slate-800 tracking-tight truncate pr-2">{name}</p>
                <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] font-bold text-primary tracking-wide bg-primary/5 px-3 py-1 rounded-full">{type}</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wide">{size} • {date}</span>
                </div>
            </div>
        </div>
    );
}

function CompletenessStep({ label, completed }: { label: string, completed: boolean }) {
    return (
        <div className="flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-3">
                <div className={cn("h-2.5 w-2.5 rounded-full transition-all duration-700", completed ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" : "bg-slate-200")} />
                <span className={cn("text-[11px] font-bold tracking-wide transition-colors", completed ? "text-slate-700" : "text-slate-300")}>{label}</span>
            </div>
            {completed ? <ShieldCheck className="h-4 w-4 text-emerald-500" /> : <PlusCircle className="h-4 w-4 text-slate-200 group-hover:text-primary transition-colors" />}
        </div>
    );
}

function SectionHeader({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[10px] font-bold text-slate-300 tracking-wide">{label}</span>
            <div className="h-px flex-1 bg-slate-100" />
        </div>
    );
}
