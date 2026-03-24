// Add parsing utilities for salary strings (e.g., "$120k - $150k" -> [120000, 150000])
export const parseSalary = (salaryStr) => {
    if (!salaryStr) return null;

    // Remove all non-numeric characters except hyphens and k/m
    const cleanStr = salaryStr.toLowerCase().replace(/[^0-9-km.]/g, '');

    // Split by hyphen for ranges
    const parts = cleanStr.split('-');

    const parseValue = (val) => {
        let multiplier = 1;
        if (val.includes('k')) multiplier = 1000;
        if (val.includes('m')) multiplier = 1000000;
        const num = parseFloat(val.replace(/[km]/g, ''));
        return isNaN(num) ? null : num * multiplier;
    };

    if (parts.length === 2) {
        const min = parseValue(parts[0]);
        const max = parseValue(parts[1]);
        if (min && max) return { min, max, avg: (min + max) / 2 };
        if (min) return { min, max: min, avg: min };
        if (max) return { min: max, max, avg: max };
    } else if (parts.length === 1) {
        const val = parseValue(parts[0]);
        if (val) return { min: val, max: val, avg: val };
    }

    return null;
};

// Format currency
export const formatCurrency = (num) => {
    if (!num) return '$0';
    if (num >= 1000) {
        return `$${(num / 1000).toFixed(0)}k`;
    }
    return `$${num}`;
};
