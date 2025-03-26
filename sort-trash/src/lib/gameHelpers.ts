import type { TrashItem, Category } from "$lib/gameData";

/**
 * Handles the logic when a trash item lands in a category.
 * @returns updated state: { score, mistakes, isGameOver, newItem }
 */
export function checkLanding(currentItem: TrashItem, categories: Category[], allTrashItems: TrashItem[], score: number, mistakes: number) {
    const landedCategory = categories[currentItem.positionX]?.name;

    if (currentItem.category === "Sonstige") {
        mistakes++;
    } else if (landedCategory === currentItem.category) {
        score++;
    } else {
        mistakes++;
    }

    const isGameOver = mistakes >= 5;

    return {
        score,
        mistakes,
        isGameOver,
        newItem: getRandomItem(allTrashItems)
    };
}

/**
 * Handles the "rotate" gesture or "f" key for Sonstige items.
 */
export function handleSonstigesItem(currentItem: TrashItem, allTrashItems: TrashItem[], score: number, mistakes: number) {
    if (currentItem.category === "Sonstige") {
        score++;
    } else {
        mistakes++;
    }

    const isGameOver = mistakes >= 5;

    return {
        score,
        mistakes,
        isGameOver,
        newItem: getRandomItem(allTrashItems)
    };
}

/**
 * Selects a random trash item from the list.
 */
function getRandomItem(items: TrashItem[]): TrashItem {
    return { ...items[Math.floor(Math.random() * items.length)] };
}