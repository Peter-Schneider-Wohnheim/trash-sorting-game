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

    if (mistakes >= 5) {
        updateFailureCookie();
    }

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

function updateFailureCookie() {
    const current = parseInt(getCookie("game_failures") || "0", 10);
    failedAttempts = isNaN(current) ? 0 : current + 1;
    document.cookie = `game_failures=${failedAttempts}; path=/; max-age=31536000`;
}

const maxFailures = 5;
let failedAttempts = 0;