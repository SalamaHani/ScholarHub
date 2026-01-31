/**
 * Profile Completeness Status Utility
 * Standardized progress status system for student profiles across ScholarHub
 */

export type ProfileStatus = "POOR" | "GOOD" | "EXCELLENT";

export interface ProfileStatusConfig {
    status: ProfileStatus;
    color: string;
    textColor: string;
    strokeColor: string;
    bgColor: string;
    indicatorColor: string;
}

/**
 * Get profile status based on completeness percentage
 * @param completeness - Profile completeness percentage (0-100)
 * @returns ProfileStatus - POOR (<=50%), GOOD (51-79%), EXCELLENT (>=80%)
 */
export function getProfileStatus(completeness: number): ProfileStatus {
    if (completeness >= 80) return "EXCELLENT";
    if (completeness >= 51) return "GOOD";
    return "POOR";
}

/**
 * Get status configuration including colors and styling
 * @param status - Profile status
 * @returns ProfileStatusConfig - Configuration object with colors
 */
export function getStatusConfig(status: ProfileStatus): ProfileStatusConfig {
    switch (status) {
        case "EXCELLENT":
            return {
                status: "EXCELLENT",
                color: "emerald",
                textColor: "text-emerald-600",
                strokeColor: "stroke-emerald-600",
                bgColor: "bg-emerald-50",
                indicatorColor: "bg-gradient-to-r from-emerald-500 to-green-500",
            };
        case "GOOD":
            return {
                status: "GOOD",
                color: "yellow",
                textColor: "text-yellow-600",
                strokeColor: "stroke-yellow-600",
                bgColor: "bg-yellow-50",
                indicatorColor: "bg-gradient-to-r from-yellow-500 to-amber-500",
            };
        case "POOR":
            return {
                status: "POOR",
                color: "red",
                textColor: "text-red-600",
                strokeColor: "stroke-red-600",
                bgColor: "bg-red-50",
                indicatorColor: "bg-gradient-to-r from-red-500 to-rose-500",
            };
    }
}

/**
 * Get status color class for text
 * @param status - Profile status
 * @returns Tailwind text color class
 */
export function getStatusColor(status: ProfileStatus): string {
    return getStatusConfig(status).textColor;
}

/**
 * Get status color class for strokes
 * @param status - Profile status
 * @returns Tailwind stroke color class
 */
export function getStatusStroke(status: ProfileStatus): string {
    return getStatusConfig(status).strokeColor;
}

/**
 * Get status background color class
 * @param status - Profile status
 * @returns Tailwind background color class
 */
export function getStatusBgColor(status: ProfileStatus): string {
    return getStatusConfig(status).bgColor;
}

/**
 * Get progress indicator gradient class
 * @param status - Profile status
 * @returns Tailwind gradient class for progress indicators
 */
export function getStatusIndicatorColor(status: ProfileStatus): string {
    return getStatusConfig(status).indicatorColor;
}

/**
 * Get progress message based on completeness
 * @param completeness - Profile completeness percentage
 * @returns Motivational message
 */
export function getProgressMessage(completeness: number): string {
    if (completeness >= 80) {
        return "Outstanding Profile! Ready for applications.";
    }
    if (completeness >= 51) {
        return "Good progress! Complete more to unlock opportunities.";
    }
    return "Profile needs attention. Complete it to apply.";
}
