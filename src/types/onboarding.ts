export type LocationType = 'continent' | 'country' | 'state' | 'city';

export interface LocationNode {
    id: string;
    label: string;
    type: LocationType;
    parentId: string | null;
    hasChildren: boolean;
    metadata?: {
        isoCode?: string;
        currency?: string;
        region?: string;
    };
}

export interface InterestNode {
    id: string;
    label: string;
    category: string;
    subCategory: string;
    specialization: string;
    searchSlug: string; // "Engineering Computer Science Artificial Intelligence"
}

export interface BudgetPreference {
    currencyCode: 'INR' | 'USD' | 'EUR' | 'GBP';
    min: number;
    max: number;
    label: string;
    isCustom: boolean;
}

export interface OnboardingData {
    locations: LocationNode[];
    interests: InterestNode[];
    degreeLevels: string[];
    budget: BudgetPreference;
    studyModes: string[];
    languagePreference: string;
    onboarding_completed: boolean;
}
