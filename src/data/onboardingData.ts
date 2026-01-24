export const CONTINENTS = ["North America", "Europe", "Asia", "Oceania", "South America", "Middle East"];

export const LOCATIONS_HIERARCHY: Record<string, Record<string, string[]>> = {
    "North America": {
        "United States": ["California", "New York", "Texas", "Massachusetts", "Illinois", "Washington", "Florida", "Pennsylvania"],
        "Canada": ["Ontario", "British Columbia", "Quebec", "Alberta", "Manitoba"]
    },
    "Europe": {
        "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
        "Germany": ["Bavaria", "Berlin", "Hesse", "Baden-Württemberg", "Saxony"],
        "France": ["Île-de-France", "Auvergne-Rhône-Alpes", "Provence-Alpes-Côte d'Azur"],
        "Netherlands": ["North Holland", "South Holland", "Utrecht"],
        "Ireland": ["Dublin", "Cork", "Galway"]
    },
    "Asia": {
        "India": ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Telangana"],
        "Singapore": ["Central Region", "West Region", "East Region"],
        "Japan": ["Tokyo", "Osaka", "Kyoto", "Fukuoka"],
        "South Korea": ["Seoul", "Busan", "Incheon"]
    },
    "Oceania": {
        "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia"],
        "New Zealand": ["Auckland", "Wellington", "Canterbury"]
    },
    "Middle East": {
        "UAE": ["Dubai", "Abu Dhabi", "Sharjah"],
        "Qatar": ["Doha", "Al Rayyan"]
    }
};

export const ACADEMIC_INTERESTS = {
    "STEM": [
        "Computer Science", "Artificial Intelligence", "Data Science", "Machine Learning",
        "Cybersecurity", "Software Engineering", "Mechanical Engineering", "Civil Engineering",
        "Electrical Engineering", "Chemical Engineering", "Aerospace Engineering",
        "Biomedical Engineering", "Physics", "Mathematics", "Bioinformatics", "Robotics",
        "Natural Sciences", "Environmental Science", "Astronomy", "Statistics"
    ],
    "Medicine & Health": [
        "General Medicine", "Nursing", "Pharmacy", "Dentistry", "Public Health",
        "Biomedicine", "Physiotherapy", "Psychology", "Nutrition", "Veterinary Medicine",
        "Health Administration", "Epidemiology", "Sports Science"
    ],
    "Business & Law": [
        "MBA", "Finance", "Accounting", "Marketing", "International Business",
        "Entrepreneurship", "Human Resources", "Supply Chain Management", "Economics",
        "International Relations", "Corporate Law", "Criminal Justice", "Public Policy"
    ],
    "Arts & Humanities": [
        "Fine Arts", "Graphic Design", "History", "Literature", "Philosophy",
        "Music", "Film Studies", "Linguistics", "Architecture", "Interior Design",
        "Archaeology", "Theology"
    ],
    "Social Sciences": [
        "Sociology", "Education", "Political Science", "Media & Communication",
        "Anthropology", "Social Work", "Geography", "Criminology"
    ]
};

export const DEGREE_LEVELS = ["Bachelor's", "Master's", "PhD", "Doctorate", "Diploma", "Certificate", "Associate Degree"];

export const BUDGET_RANGES = [
    { label: "Under $10k", value: "0-10000" },
    { label: "$10k - $25k", value: "10000-25000" },
    { label: "$25k - $50k", value: "25000-50000" },
    { label: "$50k - $75k", value: "50000-75000" },
    { label: "$75k+", value: "75000+" }
];

export const STUDY_MODES = [
    { label: "On-campus (Full-time)", value: "on-campus" },
    { label: "Online (Full-time)", value: "online" },
    { label: "Hybrid", value: "hybrid" },
    { label: "Part-time", value: "part-time" },
    { label: "Distance Learning", value: "distance" }
];
