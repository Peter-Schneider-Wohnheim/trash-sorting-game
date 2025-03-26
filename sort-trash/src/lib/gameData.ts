import trashData from "$lib/assets/trash.json";

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
    "Restmuelltonne": "bg-gray-600",
    "Gelber Sack": "bg-yellow-400",
    "Papiertonne": "bg-blue-400",
    "Biotonne": "bg-amber-700",
    "Glascontainer": "bg-green-500",
    "Wertstoffhof": "bg-red-500"
};

/**
 * Generates a list of available categories based on the category map.
 * @returns An array of category objects.
 */
export function getCategories(): Category[] {
    return Object.keys(categoryMap).map(name => ({ name, color: categoryMap[name] }));
}

/**
 * Generates the list of trash items based on the selected game mode.
 * @param isExpertMode - Boolean flag indicating if the game is in expert mode.
 * @returns A list of trash items based on the selected game mode.
 */
export function getTrashItems(isExpertMode: boolean): TrashItem[] {
    let allTrashItems: TrashItem[] = [];

    for (const category in trashData) {
        if (isExpertMode || category !== "Sonstige") {
            trashData[category].forEach((item: string) => {
                allTrashItems.push({
                    name: item,
                    category,
                    positionX: Math.floor(Math.random() * getCategories().length),
                    positionY: 0
                });
            });
        }
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