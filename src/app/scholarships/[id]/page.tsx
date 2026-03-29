"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  MapPin,
  GraduationCap,
  DollarSign,
  Building2,
  Clock,
  CheckCircle,
  FileText,
  Bookmark,
  Share2,
  Check,
  AlertCircle,
  Loader2,
  HelpCircle,
  Globe,
  Award,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, getDeadlineStatus, formatDeadline } from "@/lib/utils";
import { ApplicationModal } from "@/components/scholarships/application-modal";
import { useScholarship } from "@/hooks/useScholarships";
import {
  useSavedScholarships,
  useCheckSaved,
} from "@/hooks/useSavedScholarships";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { ScholarshipDetailSkeleton } from "@/components/skeletons";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export default function ScholarshipDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { t } = useTranslation();
  const { id } = params;
  const { data: scholarship, isLoading, error } = useScholarship(id);
  const { save, remove } = useSavedScholarships();
  const { isAuthenticated, user } = useAuth();
  const { data: isSaved, isLoading: isCheckingSaved } = useCheckSaved(id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isPendingSave = save.isPending || remove.isPending;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    toast({
      title: t.scholarships.linkCopied,
      description: t.scholarships.linkCopiedDesc,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <ScholarshipDetailSkeleton />;

  if (error || !scholarship) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 container max-w-md text-center">
        <div className="p-4 bg-destructive/10 rounded-full">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{t.scholarships.notFound}</h1>
          <p className="text-muted-foreground">{t.scholarships.notFoundDesc}</p>
        </div>
        <Button asChild>
          <Link href="/scholarships">{t.scholarships.backTo}</Link>
        </Button>
      </div>
    );
  }

  const deadlineStatus = getDeadlineStatus(scholarship.deadline);
  const deadlineText = formatDeadline(scholarship.deadline);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: t.scholarships.authRequired,
        description: t.scholarships.authRequiredDesc,
        variant: "destructive",
      });
      return;
    }
    try {
      if (isSaved) {
        await remove.mutateAsync(scholarship.id);
      } else {
        await save.mutateAsync(scholarship.id);
      }
    } catch {
      // Error managed by hook
    }
  };

  const getStatusBadge = () => {
    switch (deadlineStatus) {
      case "urgent":
        return (
          <Badge variant="destructive" className="gap-1 animate-pulse">
            <AlertCircle className="h-3 w-3" />
            {deadlineText}
          </Badge>
        );
      case "soon":
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="h-3 w-3" />
            {deadlineText}
          </Badge>
        );
      case "expired":
        return <Badge variant="destructive">{deadlineText}</Badge>;
      default:
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            {deadlineText}
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen container bg-muted/20">
      {/* ── Hero Header ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-primary/8 via-background to-blue-50/30 border-b">
        <div className="container max-w-6xl py-6 md:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5 flex-wrap">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-1.5 h-7 px-2 text-xs text-muted-foreground hover:text-primary"
            >
              <Link href="/scholarships">
                <ArrowLeft className="h-3.5 w-3.5" />
                {t.scholarships.backTo}
              </Link>
            </Button>
            <ChevronRight className="h-3.5 w-3.5 opacity-40" />
            <span className="line-clamp-1 max-w-xs">{scholarship.title}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start gap-5">
            {/* Org logo placeholder */}
            <div className="h-16 w-16 rounded-2xl bg-primary/10 border-2 border-primary/15 flex items-center justify-center shrink-0 shadow-sm">
              <Building2 className="h-8 w-8 text-primary" />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {scholarship.isFeatured && (
                  <Badge
                    variant="default"
                    className="bg-amber-500 text-white text-[10px] gap-1"
                  >
                    <Award className="h-3 w-3" />
                    {t.scholarships.featuredScholarship}
                  </Badge>
                )}
                {getStatusBadge()}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                {scholarship.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                  {scholarship.organization}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  {scholarship.country}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  {t.scholarships.deadline}: {formatDate(scholarship.deadline)}
                </span>
              </div>
            </div>

            {/* Quick save/share — desktop only */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 border",
                  isSaved ? "bg-primary/5 text-primary border-primary/20" : "",
                )}
                disabled={isPendingSave || isCheckingSaved}
                onClick={handleSaveToggle}
              >
                {isPendingSave ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bookmark
                    className={cn("h-4 w-4", isSaved && "fill-current")}
                  />
                )}
                {isSaved ? t.scholarships.saved : t.scholarships.save}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 border",
                  copied
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "",
                )}
                onClick={handleShare}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {copied ? t.scholarships.copied : t.scholarships.share}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div className="container max-w-6xl py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  {t.scholarships.aboutTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 bg-white/50">
                <p className="text-muted-foreground leading-relaxed text-base">
                  {scholarship.description}
                </p>
              </CardContent>
            </Card>

            {/* Eligibility + Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                title={t.scholarships.eligibility}
                icon={CheckCircle}
                content={scholarship.eligibility}
              />
              <InfoCard
                title={t.scholarships.requirements}
                icon={FileText}
                content={scholarship.requirements}
              />
              {scholarship.benefits && (
                <InfoCard
                  title={t.scholarships.benefits}
                  icon={DollarSign}
                  content={scholarship.benefits}
                />
              )}
              
            </div>

            {/* Application Questions */}
            {scholarship.questions && scholarship.questions.length > 0 && (
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <HelpCircle className="h-4 w-4 text-primary" />
                    </div>
                    {t.scholarships.appQuestions}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 bg-white/50 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {t.scholarships.appQuestionsDesc}
                  </p>
                  <div className="space-y-2">
                    {scholarship.questions.map((q: any, idx: number) => (
                      <div
                        key={q.id}
                        className="flex gap-3 p-4 rounded-xl bg-white border border-slate-100"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {idx + 1}
                        </span>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-800">
                            {q.question}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-[10px] tracking-widest opacity-60"
                          >
                            {q.type === "MULTIPLE_CHOICE"
                              ? t.scholarships.multipleChoice
                              : t.scholarships.textAnswer}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: sticky action card */}
          <div className="space-y-4">
            <Card className="sticky top-24 shadow-xl border-primary/5 glass overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-primary to-blue-500" />
              <CardContent className="p-6 space-y-6">
                {/* Deadline */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    {t.scholarships.deadline}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-primary/10 rounded-xl shrink-0">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-bold">
                        {formatDate(scholarship.deadline)}
                      </span>
                    </div>
                    {getStatusBadge()}
                  </div>
                </div>

                <Separator />

                {/* Details */}
                <div className="space-y-4">
                  <DetailItem
                    label={t.scholarships.fundingType}
                    value={scholarship.fundingType}
                    isBadge
                  />
                  <DetailItem
                    label={t.scholarships.location}
                    value={scholarship.country}
                  />
                  <DetailItem
                    label={t.scholarships.degreeLevel}
                    value={scholarship.degreeLevel}
                    isTag
                  />
                  <DetailItem
                    label={t.scholarships.fieldOfStudy}
                    value={scholarship.fieldOfStudy}
                    isTag
                  />
                </div>

                <Separator />

                {/* Action buttons */}
                <div className="space-y-3">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full h-12 font-bold shadow-lg shadow-primary/20 group"
                    onClick={() => {
                      if (!isAuthenticated)
                        return toast({
                          title: t.scholarships.authRequired,
                          description: t.scholarships.signInToApply,
                        });
                      const completeness = user?.profileCompleteness ?? 0;
                      if (completeness >= 80) {
                        toast({
                          title: t.scholarships.profileVerified,
                          description: t.scholarships.profileVerifiedDesc,
                        });
                      }
                      setIsModalOpen(true);
                    }}
                  >
                    {t.scholarships.applyOnScholarHub}
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {scholarship.applicationLink && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full h-10 gap-2 text-muted-foreground font-semibold"
                    >
                      <a
                        href={scholarship.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t.scholarships.officialWebsite}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}

                  {/* Save + Share (mobile only — desktop is in hero) */}
                  <div className="flex gap-2 md:hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex-1 gap-2 border text-xs",
                        isSaved
                          ? "bg-primary/5 text-primary border-primary/20"
                          : "",
                      )}
                      disabled={isPendingSave || isCheckingSaved}
                      onClick={handleSaveToggle}
                    >
                      {isPendingSave ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Bookmark
                          className={cn(
                            "h-3.5 w-3.5",
                            isSaved && "fill-current",
                          )}
                        />
                      )}
                      {isSaved ? t.scholarships.saved : t.scholarships.save}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex-1 gap-2 border text-xs",
                        copied
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "",
                      )}
                      onClick={handleShare}
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Share2 className="h-3.5 w-3.5" />
                      )}
                      {copied ? t.scholarships.copied : t.scholarships.share}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scholarshipTitle={scholarship.title}
        scholarshipId={scholarship.id}
        questions={scholarship.questions}
      />
    </div>
  );
}

function InfoCard({ title, icon: Icon, content }: any) {
  return (
    <Card className="border-none shadow-sm h-full hover:shadow-md transition-all">
      <CardHeader className="pb-3 border-b bg-muted/5">
        <CardTitle className="text-base flex items-center gap-2">
          <div className="p-1.5 bg-white rounded-lg border shadow-sm">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="whitespace-pre-line text-muted-foreground text-sm leading-relaxed">
          {content}
        </div>
      </CardContent>
    </Card>
  );
}

function DetailItem({ label, value, isBadge, isTag }: any) {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value
          .split(",")
          .map((v: string) => v.trim())
          .filter(Boolean)
      : [];

  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {values.length > 0 ? (
          values.map((v: string) => (
            <Badge
              key={v}
              variant={isTag ? "secondary" : "outline"}
              className="text-[10px] px-2 py-0"
            >
              {v}
            </Badge>
          ))
        ) : isBadge ? (
          <Badge variant="success" className="text-[10px] px-2 py-0">
            {value}
          </Badge>
        ) : (
          <span className="font-semibold text-sm">{value}</span>
        )}
      </div>
    </div>
  );
}
