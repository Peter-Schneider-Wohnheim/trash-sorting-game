/**
 * Represents a trash category with a name and a corresponding color.
 */
export type Category = {
    name: string;
    color: string;
};

/**
 * Represents a trash item in the game with its name, assigned category, and position.
 */
export type TrashItem = {
    name: string;
    category: string;
    positionX: number;
    positionY: number;
};

/**
 * Mapping of category names to their associated colors.
 */
export const categoryMap: Record<string, string> = {
    "Black Bin": "bg-gray-600",
    "Yellow Bin": "bg-yellow-400",
    "Blue Bin": "bg-blue-400",
    "Brown Bin": "bg-amber-700",
    "Glas Container": "bg-green-500",
    "Recycling Center": "bg-red-500"
};

let trashData: Record<string, string[]> = {};
let roomNumber: string | null = null;

const maxFailures = 5;
let failedAttempts = 0;

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function updateFailureCookie() {
    const current = parseInt(getCookie("game_failures") || "0", 10);
    failedAttempts = isNaN(current) ? 0 : current + 1;
    document.cookie = `game_failures=${failedAttempts}; path=/; max-age=31536000`;
}

function generatePdf(passed: boolean, room: string | null) {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Kenntnisnachweis Müllentsorgung", 20, 30);

    doc.setFontSize(12);
    doc.text(`Der Bewohner der Einheit ${room || "?"} hat die Prüfung zur korrekten Müllentsorgung ${passed ? "bestanden" : "nicht bestanden"}.`, 20, 50);
    doc.text(`Eine Nachschulung durch den Hausmeister ist ${passed ? "nicht erforderlich" : "erforderlich"}.`, 20, 60);

    doc.text("Und in diesem Sinne: APRIL APRIL / Happy April fools day! 🤭", 20, 80);

    doc.save("muellprüfung.pdf");
}

export async function loadTrashData(language: string): Promise<void> {
    if (language === "de") {
        trashData = (await import("$lib/assets/trash_de.json")).default;
    } else {
        trashData = (await import("$lib/assets/trash_en.json")).default;
    }
}

/**
 * Generates a list of available categories based on the category map.
 * @returns An array of category objects.
 */
export function getCategories(): Category[] {
    return Object.keys(categoryMap).map(name => ({ name, color: categoryMap[name] }));
}

/**
 * Generates the list of trash items based on the selected game mode.
 * @returns A list of trash items based on the selected game mode.
 */
export function getTrashItems(): TrashItem[] {
    const allTrashItems: TrashItem[] = [];

    for (const category in trashData) {
        trashData[category].forEach((item: string) => {
            allTrashItems.push({
                name: item,
                category,
                positionX: Math.floor(Math.random() * getCategories().length),
                positionY: 0
            });
        });
    }

    return allTrashItems;
}

/**
 * Selects a random trash item from the list.
 * @param trashItems - Array of available trash items.
 * @returns A randomly selected trash item.
 */
export function getRandomTrashItem(trashItems: TrashItem[]): TrashItem {
    return { ...trashItems[Math.floor(Math.random() * trashItems.length)] };
}

function promptUserPreferences() {
    if (!browser) return;

    let language = getCookie("game_lang");
    let room = getCookie("game_room");

    failedAttempts = parseInt(getCookie("game_failures") || "0", 10);

    if (!language) {
        language = prompt("Choose your language: 'en' or 'de'")?.toLowerCase() === "de" ? "de" : "en";
        document.cookie = `game_lang=${language}; path=/; max-age=31536000`;
    }

    if (!room) {
        room = prompt("Enter your room number:");
        document.cookie = `game_room=${room}; path=/; max-age=31536000`;
    }

    return { language, room };
}