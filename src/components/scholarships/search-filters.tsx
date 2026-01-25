"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface SearchFiltersProps {
    onSearch?: (query: string) => void;
    onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
    country: string;
    degreeLevel: string;
    fundingType: string;
    fieldOfStudy: string;
}

const countries = [
    "All Countries",
    "United States",
    "United Kingdom",
    "Germany",
    "Canada",
    "Australia",
    "Turkey",
    "Japan",
    "South Korea",
    "Netherlands",
    "Sweden",
];

const degreeLevels = [
    { label: "All Levels", value: "ALL" },
    { label: "Bachelor", value: "BACHELOR" },
    { label: "Master", value: "MASTER" },
    { label: "PhD", value: "PHD" },
    { label: "Postdoctoral", value: "POSTDOC" },
    { label: "Research", value: "RESEARCH" },
];

const fundingTypes = [
    { label: "All Types", value: "ALL" },
    { label: "Full Funding", value: "FULL" },
    { label: "Partial Funding", value: "PARTIAL" },
    { label: "Tuition Only", value: "TUITION_ONLY" },
    { label: "Living Expenses", value: "STIPEND" },
];

const fieldsOfStudy = [
    { label: "All Fields", value: "ALL" },
    { label: "Engineering", value: "ENGINEERING" },
    { label: "Medicine", value: "MEDICINE" },
    { label: "Computer Science", value: "COMPUTER_SCIENCE" },
    { label: "Business", value: "BUSINESS" },
    { label: "Arts & Humanities", value: "ARTS_HUMANITIES" },
    { label: "Natural Sciences", value: "NATURAL_SCIENCES" },
    { label: "Social Sciences", value: "SOCIAL_SCIENCES" },
];

import { useCategories, Category } from "@/hooks/useCategories";

export function SearchFilters({ onSearch, onFilterChange }: SearchFiltersProps) {
    const { list: categoriesList } = useCategories();
    const categories = Array.isArray(categoriesList.data) ? categoriesList.data : [];

    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        country: "",
        degreeLevel: "",
        fundingType: "",
        fieldOfStudy: "",
    });

    const activeFiltersCount = Object.entries(filters).filter(
        ([key, value]) => value && value !== "ALL" && value !== ""
    ).length;

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        // Map "ALL" to empty string for API
        const apiFilters = Object.fromEntries(
            Object.entries(newFilters).map(([k, v]) => [k, v === "ALL" ? "" : v])
        );
        onFilterChange?.(apiFilters as any);
    };

    const clearFilters = () => {
        const clearedFilters: FilterState = {
            country: "",
            degreeLevel: "ALL",
            fundingType: "ALL",
            fieldOfStudy: "ALL",
        };
        setFilters(clearedFilters);
        onFilterChange?.({
            country: "",
            degreeLevel: "",
            fundingType: "",
            fieldOfStudy: "",
        } as any);
    };

    const handleSearch = () => {
        onSearch?.(searchQuery);
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search scholarships by name, organization, or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-10"
                    />
                </div>
                <Button onClick={handleSearch}>Search</Button>
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                >
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                        <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                            {activeFiltersCount}
                        </Badge>
                    )}
                </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
                <div className="p-4 border rounded-lg bg-muted/30 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">Filter Scholarships</h4>
                        {activeFiltersCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-muted-foreground hover:text-foreground gap-1"
                            >
                                <X className="h-3 w-3" />
                                Clear all
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Select
                            value={filters.country}
                            onValueChange={(value) => handleFilterChange("country", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map((country) => (
                                    <SelectItem key={country} value={country}>
                                        {country}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.degreeLevel}
                            onValueChange={(value) => handleFilterChange("degreeLevel", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Degree Level" />
                            </SelectTrigger>
                            <SelectContent>
                                {degreeLevels.map((level) => (
                                    <SelectItem key={level.value} value={level.value}>
                                        {level.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.fundingType}
                            onValueChange={(value) => handleFilterChange("fundingType", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Funding Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {fundingTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.fieldOfStudy}
                            onValueChange={(value) => handleFilterChange("fieldOfStudy", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Field of Study" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Fields</SelectItem>
                                {categories.map((cat: Category) => (
                                    <SelectItem key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}
        </div>
    );
}
