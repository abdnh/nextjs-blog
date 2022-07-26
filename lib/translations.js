
export function getTranslation(tag) {
    const translations = {
        "books": "كتب",
        "translation": "ترجمة",
        "memory": "ذاكرة",
        "anki": "Anki",
        "computer": "حاسوب",
        "algorithms": "خوارزميات",
        "languages": "لغات",
        "english": "لغة إنجليزية",
        "reviews": "مراجعات"
    };
    return translations[tag] ? translations[tag] : tag;
}
