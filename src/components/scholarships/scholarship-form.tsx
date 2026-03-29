"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  scholarshipSchema,
  ScholarshipInput,
} from "@/lib/validations/scholarship";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2, Save, BookOpen, AlertCircle } from "lucide-react";
import { useScholarships, Scholarship } from "@/hooks/useScholarships";
import { useCategories, Category } from "@/hooks/useCategories";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Info,
  FileText,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  Upload,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ScholarshipFormProps {
  initialData?: Partial<Scholarship>;
  onSuccess: () => void;
  onCancel: () => void;
}

const degreeLevels = [
  { label: "Bachelor", value: "BACHELOR" },
  { label: "Master", value: "MASTER" },
  { label: "PhD", value: "PHD" },
  { label: "Postdoctoral", value: "POSTDOC" },
  { label: "Research", value: "RESEARCH" },
];

const fundingTypes = [
  { label: "Full Funding", value: "FULL" },
  { label: "Partial Funding", value: "PARTIAL" },
  { label: "Tuition Only", value: "TUITION_ONLY" },
  { label: "Stipend", value: "STIPEND" },
];

export function ScholarshipForm({
  initialData,
  onSuccess,
  onCancel,
}: ScholarshipFormProps) {
  const { create, update } = useScholarships();
  const { list } = useCategories();
  const categories = list.data || [];
  const [activeTab, setActiveTab] = useState("basic");

  const steps = [
    { id: "basic", label: "General Information", icon: Info },
    { id: "detailed", label: "Scholarship Details", icon: FileText },
    { id: "questions", label: "Application Logic", icon: HelpCircle },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === activeTab);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleStepChange = async (targetTab: string) => {
    const targetIndex = steps.findIndex((s) => s.id === targetTab);

    // If moving forward, validate current step
    if (targetIndex > currentStepIndex) {
      let fieldsToValidate: any[] = [];
      if (activeTab === "basic") {
        fieldsToValidate = [
          "title",
          "organization",
          "country",
          "deadline",
          "degreeLevel",
          "fieldOfStudy",
        ];
      } else if (activeTab === "detailed") {
        fieldsToValidate = ["description"];
      }

      const isStepValid = await trigger(fieldsToValidate);
      if (!isStepValid) {
        toast({
          title: "Action Required",
          description:
            "Please complete all required fields correctly before moving to the next step.",
          variant: "destructive",
        });
        return;
      }
    }
    setActiveTab(targetTab);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValidating, isSubmitting: isFormSubmitting },
    control,
    trigger,
  } = useForm<ScholarshipInput>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      title: initialData?.title || "",
      organization: initialData?.organization || "",
      country: initialData?.country || "",
      deadline:
        initialData?.deadline &&
        !isNaN(new Date(initialData.deadline).getTime())
          ? new Date(initialData.deadline).toISOString().split("T")[0]
          : "",
      fundingType: (initialData?.fundingType as any) || "FULL",
      applicationLink: initialData?.applicationLink || "",
      description: initialData?.description || "",
      requirements: initialData?.requirements || "",
      eligibility: initialData?.eligibility || "",
      benefits: initialData?.benefits || "",
      documents: initialData?.documents || "",
      isFeatured: initialData?.isFeatured || false,
      degreeLevel: initialData?.degreeLevel
        ? Array.isArray(initialData.degreeLevel)
          ? initialData.degreeLevel
          : String(initialData.degreeLevel)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
        : [],
      fieldOfStudy: initialData?.fieldOfStudy
        ? Array.isArray(initialData.fieldOfStudy)
          ? initialData.fieldOfStudy
          : String(initialData.fieldOfStudy)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
        : [],
      questions: initialData?.questions || [],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const selectedDegreeLevels = watch("degreeLevel");
  const selectedFields = watch("fieldOfStudy");

  const onSubmit = async (data: ScholarshipInput) => {
    try {
      if (initialData?.id) {
        await update.mutateAsync({
          id: initialData.id,
          data,
        });
      } else {
        await create.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const toggleDegreeLevel = (value: string) => {
    const current = selectedDegreeLevels || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue("degreeLevel", next, { shouldValidate: true });
  };

  const toggleField = (value: string) => {
    const current = selectedFields || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue("fieldOfStudy", next, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Professional Stepper */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeTab === step.id;
            const isCompleted =
              steps.findIndex((s) => s.id === activeTab) > idx;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-2 cursor-pointer transition-all"
                onClick={() => handleStepChange(step.id)}
              >
                <div
                  className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110"
                      : isCompleted
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-primary" : "text-muted-foreground"}`}
                >
                  {step.id}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-primary to-emerald-500"
          />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleStepChange}
        className="w-full"
      >
        <TabsList className="hidden">
          {/* Hidden but kept for architectural consistency */}
          <TabsTrigger value="basic" />
          <TabsTrigger value="detailed" />
          <TabsTrigger value="questions" />
        </TabsList>

        <TabsContent value="basic" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-bold">
                  Scholarship Title
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="e.g. Fulbright Foreign Student Program"
                  className={errors.title ? "border-red-500 bg-red-50/30" : ""}
                />
                {errors.title && (
                  <p className="text-[10px] font-bold text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization" className="text-sm font-bold">
                  Organization / University
                </Label>
                <Input
                  id="organization"
                  {...register("organization")}
                  placeholder="e.g. U.S. Department of State"
                  className={
                    errors.organization ? "border-red-500 bg-red-50/30" : ""
                  }
                />
                {errors.organization && (
                  <p className="text-[10px] font-bold text-red-500">
                    {errors.organization.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-bold">
                    Country
                  </Label>
                  <Input
                    id="country"
                    {...register("country")}
                    placeholder="e.g. United States"
                    className={
                      errors.country ? "border-red-500 bg-red-50/30" : ""
                    }
                  />
                  {errors.country && (
                    <p className="text-[10px] font-bold text-red-500">
                      {errors.country.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-sm font-bold">
                    Deadline
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    {...register("deadline")}
                    className={
                      errors.deadline ? "border-red-500 bg-red-50/30" : ""
                    }
                  />
                  {errors.deadline && (
                    <p className="text-[10px] font-bold text-red-500">
                      {errors.deadline.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold">Degree Levels</Label>
                <div className="flex flex-wrap gap-2">
                  {degreeLevels.map((level) => (
                    <Badge
                      key={level.value}
                      variant={
                        selectedDegreeLevels?.includes(level.value)
                          ? "default"
                          : "outline"
                      }
                      className={`cursor-pointer px-3 py-1 transition-all ${selectedDegreeLevels?.includes(level.value) ? "bg-primary shadow-md" : "hover:bg-primary/5"}`}
                      onClick={() => toggleDegreeLevel(level.value)}
                    >
                      {level.label}
                    </Badge>
                  ))}
                </div>
                {errors.degreeLevel && (
                  <p className="text-[10px] font-bold text-red-500">
                    {errors.degreeLevel.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Fields of Study
                </Label>

                <div className="flex gap-2">
                  <Select
                    onValueChange={(v) => {
                      if (v && !selectedFields?.includes(v)) {
                        toggleField(v);
                      }
                    }}
                  >
                    <SelectTrigger className="rounded-xl border-primary/10 h-11 focus:ring-primary bg-zinc-50/50">
                      <SelectValue placeholder="Add a major or field of study..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: Category) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.name}
                          disabled={selectedFields?.includes(cat.name)}
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                      {categories.length === 0 && (
                        <div className="p-2 text-xs text-muted-foreground italic text-center">
                          No categories found
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-xl bg-primary/5 border border-dashed border-primary/20">
                  {(selectedFields || []).length > 0 ? (
                    selectedFields.map((field) => (
                      <Badge
                        key={field}
                        variant="secondary"
                        className="px-3 py-1 flex items-center gap-1.5 bg-white text-primary border-primary/10 hover:bg-primary/5 transition-colors group shadow-sm"
                      >
                        <span className="text-xs font-semibold">{field}</span>
                        <X
                          className="h-3 w-3 cursor-pointer text-muted-foreground group-hover:text-destructive transition-colors"
                          onClick={() => toggleField(field)}
                        />
                      </Badge>
                    ))
                  ) : (
                    <p className="text-[10px] text-muted-foreground italic flex items-center justify-center w-full">
                      Select fields from the dropdown above...
                    </p>
                  )}
                </div>
                {errors.fieldOfStudy && (
                  <p className="text-[10px] font-bold text-red-500">
                    {errors.fieldOfStudy.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundingType" className="text-sm font-bold">
                  Funding Type
                </Label>
                <Select
                  value={watch("fundingType")}
                  onValueChange={(v: any) =>
                    setValue("fundingType", v, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="fundingType" className="bg-zinc-50/50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fundingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fundingType && (
                  <p className="text-[10px] font-bold text-red-500">
                    {errors.fundingType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationLink" className="text-sm font-bold">
                  Original Application Link
                </Label>
                <Input
                  id="applicationLink"
                  {...register("applicationLink")}
                  placeholder="https://..."
                  className={
                    errors.applicationLink ? "border-red-500 bg-red-50/30" : ""
                  }
                />
                {errors.applicationLink && (
                  <p className="text-[10px] font-bold text-red-500">
                    {errors.applicationLink.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleStepChange("detailed")}
              className="rounded-2xl gap-2 h-11 px-6 border-primary/20 hover:bg-primary/5 text-primary font-bold shadow-sm"
            >
              Next Step: Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-bold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Brief overview of the scholarship..."
                  className={`min-h-[100px] bg-zinc-50/50 ${errors.description ? "border-red-500" : ""}`}
                />
                {errors.description && (
                  <p className="text-[10px] font-bold text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-sm font-bold">
                  Requirements
                </Label>
                <Textarea
                  id="requirements"
                  {...register("requirements")}
                  placeholder="Academic records, Language scores, etc."
                  className="min-h-[80px] bg-zinc-50/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eligibility" className="text-sm font-bold">
                  Eligibility
                </Label>
                <Textarea
                  id="eligibility"
                  {...register("eligibility")}
                  placeholder="Who can apply?"
                  className="min-h-[80px] bg-zinc-50/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits" className="text-sm font-bold">
                  Benefits & Coverage
                </Label>
                <Textarea
                  id="benefits"
                  {...register("benefits")}
                  placeholder="Tuition, Stipend, Insurance, etc."
                  className="min-h-[80px] bg-zinc-50/50"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleStepChange("questions")}
              className="rounded-2xl gap-2 h-11 px-6 border-primary/20 hover:bg-primary/5 text-primary font-bold shadow-sm"
            >
              Final Step: Questions
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6 outline-none">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                  <Plus className="h-5 w-5" />
                  Candidate Questions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Define what information you need from students.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendQuestion({
                    id: Date.now().toString(),
                    question: "",
                    type: "TEXT",
                  })
                }
                className="gap-2 rounded-xl"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </Button>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {questionFields.map((field, index) => {
                  const type = watch(`questions.${index}.type` as const);
                  return (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative overflow-hidden rounded-[2rem] border border-primary/10 bg-white p-7 shadow-sm transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                    >
                      {/* Accent Gradient */}
                      <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary to-blue-600" />

                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-800 tracking-tighter">
                              Question Configuration
                            </h4>
                            <p className="text-[10px] font-bold text-slate-400 tracking-widest">
                              Configure how students respond
                            </p>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
                          onClick={() => removeQuestion(index)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-7 space-y-2">
                          <Label className="text-[10px] font-black tracking-[0.2em] text-primary/60 ml-1">
                            Question Text
                          </Label>
                          <Input
                            {...register(
                              `questions.${index}.question` as const,
                            )}
                            placeholder="e.g. Describe your most significant academic achievement..."
                            className="h-14 rounded-2xl border-primary/5 bg-slate-50/50 px-5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                          {errors.questions?.[index]?.question && (
                            <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.questions[index]?.question?.message}
                            </p>
                          )}
                        </div>

                        <div className="lg:col-span-5 space-y-2">
                          <Label className="text-[10px] font-black tracking-[0.2em] text-primary/60 ml-1">
                            Response Type
                          </Label>
                          <Select
                            value={type}
                            onValueChange={(
                              val: "TEXT" | "MULTIPLE_CHOICE" | "DOCUMENT",
                            ) => {
                              setValue(`questions.${index}.type` as const, val);
                              if (val === "MULTIPLE_CHOICE") {
                                setValue(
                                  `questions.${index}.options` as const,
                                  ["", ""],
                                );
                              } else {
                                setValue(
                                  `questions.${index}.options` as const,
                                  undefined,
                                );
                              }
                            }}
                          >
                            <SelectTrigger className="h-14 rounded-2xl border-primary/5 bg-slate-50/50 px-5 transition-all">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-primary/10 shadow-2xl p-2">
                              <SelectItem
                                value="TEXT"
                                className="rounded-xl h-12"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                    <FileText className="h-4 w-4" />
                                  </div>
                                  <span className="font-bold">
                                    Text Response
                                  </span>
                                </div>
                              </SelectItem>
                              <SelectItem
                                value="MULTIPLE_CHOICE"
                                className="rounded-xl h-12"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                    <CheckCircle className="h-4 w-4" />
                                  </div>
                                  <span className="font-bold">
                                    Multiple Choice
                                  </span>
                                </div>
                              </SelectItem>
                              <SelectItem
                                value="DOCUMENT"
                                className="rounded-xl h-12"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                                    <Upload className="h-4 w-4" />
                                  </div>
                                  <span className="font-bold">
                                    Document Upload
                                  </span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {type === "MULTIPLE_CHOICE" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-6 pt-6 border-t border-slate-100 space-y-4"
                        >
                          <div className="flex items-center justify-between px-1">
                            <Label className="text-[10px] font-black tracking-[0.2em] text-primary/60">
                              Options Selection
                            </Label>
                            <span className="text-[10px] font-bold text-slate-400">
                              Add at least two options
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {watch(`questions.${index}.options` as const)?.map(
                              (_, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="group/opt relative flex items-center gap-2"
                                >
                                  <div className="absolute left-4 z-10 text-[10px] font-black text-slate-300 group-focus-within/opt:text-primary transition-colors">
                                    {String.fromCharCode(65 + optIndex)}
                                  </div>
                                  <Input
                                    {...register(
                                      `questions.${index}.options.${optIndex}` as const,
                                    )}
                                    placeholder={`Option ${optIndex + 1}`}
                                    className="h-12 rounded-xl border-primary/5 bg-slate-50/30 pl-10 pr-10 text-xs font-semibold focus:bg-white transition-all"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 h-8 w-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover/opt:opacity-100"
                                    onClick={() => {
                                      const opts =
                                        watch(
                                          `questions.${index}.options` as const,
                                        ) || [];
                                      if (opts.length > 2) {
                                        setValue(
                                          `questions.${index}.options` as const,
                                          opts.filter((_, i) => i !== optIndex),
                                        );
                                      } else {
                                        toast({
                                          title: "Operation Denied",
                                          description:
                                            "Choice questions require at least 2 options.",
                                          variant: "destructive",
                                        });
                                      }
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ),
                            )}

                            <Button
                              type="button"
                              variant="outline"
                              className="h-12 rounded-xl border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs gap-2 transition-all"
                              onClick={() => {
                                const opts =
                                  watch(
                                    `questions.${index}.options` as const,
                                  ) || [];
                                setValue(
                                  `questions.${index}.options` as const,
                                  [...opts, ""],
                                );
                              }}
                            >
                              <Plus className="h-4 w-4" />
                              Add More Choice
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {questionFields.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 rounded-[3rem] border-2 border-dashed border-primary/10 bg-gradient-to-b from-primary/5 to-transparent text-center"
                >
                  <div className="h-20 w-20 rounded-[2.5rem] bg-white shadow-xl shadow-primary/10 flex items-center justify-center mb-6 border border-primary/10">
                    <HelpCircle className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                  <h4 className="text-xl font-black text-primary tracking-tight mb-2">
                    Build Your Questionnaire
                  </h4>
                  <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">
                    Design custom questions to filter applicants better. Leave
                    empty if you only need their academic profile.
                  </p>
                  <Button
                    type="button"
                    onClick={() =>
                      appendQuestion({
                        id: Date.now().toString(),
                        question: "",
                        type: "TEXT",
                      })
                    }
                    className="mt-8 rounded-2xl bg-primary text-white font-bold h-12 px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                  >
                    Create First Question
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isFormSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="gradient"
          className="min-w-[140px]"
          disabled={isFormSubmitting}
        >
          {isFormSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {initialData ? "Update Scholarship" : "Post Scholarship"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
