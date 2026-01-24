import { LocationNode, InterestNode } from '../types/onboarding';

export const generateInterests = (count: number = 2000): InterestNode[] => {
    const categories = ['Engineering', 'Medicine', 'Business', 'Arts', 'Social Sciences', 'Science', 'Law', 'Tech'];
    const subCats: Record<string, string[]> = {
        'Engineering': ['Civil', 'Mechanical', 'Electrical', 'Chemical', 'Aerospace', 'Biomedical'],
        'Medicine': ['Clinical', 'Research', 'Nursing', 'Pharmacy', 'Public Health'],
        'Business': ['Finance', 'Accounting', 'Marketing', 'Entrepreneurship', 'SCM'],
        'Tech': ['Computer Science', 'Data Science', 'AI', 'Cybersecurity', 'Software Engineering'],
        'Arts': ['Fine Arts', 'Music', 'Design', 'Architecture', 'Literature'],
        'Social Sciences': ['Psychology', 'Sociology', 'Political Science', 'Economics'],
        'Science': ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Astronomy'],
        'Law': ['Corporate', 'Criminal', 'International', 'Human Rights']
    };

    const interests: InterestNode[] = [];
    for (let i = 0; i < count; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const subCategory = subCats[category][Math.floor(Math.random() * subCats[category].length)];
        const specialization = `${subCategory} Specialization ${i + 1}`;
        interests.push({
            id: `int-${i}`,
            label: specialization,
            category,
            subCategory,
            specialization,
            searchSlug: `${category} ${subCategory} ${specialization}`.toLowerCase()
        });
    }
    return interests;
};

export const generateLocations = (): LocationNode[] => {
    // We'll provide a high-quality set of continents and countries, 
    // and then generate thousands of cities for testing lazy loading.
    const continents = ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];
    const base: LocationNode[] = continents.map(c => ({
        id: c.toLowerCase(),
        label: c,
        type: 'continent',
        parentId: null,
        hasChildren: true
    }));

    // Countries for Asia
    const asiaCountries = ['India', 'China', 'Japan', 'Singapore', 'South Korea'];
    base.push(...asiaCountries.map(c => ({
        id: c.toLowerCase().replace(/\s/g, '-'),
        label: c,
        type: 'country' as const,
        parentId: 'asia',
        hasChildren: true
    })));

    // States for India
    const indiaStates = ['Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Telangana'];
    base.push(...indiaStates.map(s => ({
        id: `in-${s.toLowerCase().replace(/\s/g, '-')}`,
        label: s,
        type: 'state' as const,
        parentId: 'india',
        hasChildren: true
    })));

    return base;
};
