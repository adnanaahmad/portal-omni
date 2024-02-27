function getYearsRange(months) {
    if (months < 12) return "Under 1 year";
    if (months <= 24) return "1 - 2 years";
    if (months <= 60) return "2 - 5 years";
    return "More than 5 years";
}
module.exports = getYearsRange;