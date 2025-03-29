<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import {browser} from "$app/environment";
    import MemePlayer from "./MemePlayer.svelte";
    import {type Category, getCategories, getRandomTrashItem, getTrashItems, type TrashItem} from "$lib/gameData";
    import {checkLanding, handleSonstigesItem} from "$lib/gameHelpers";
    import GameModeExplanation from "$lib/GameModeExplanation.svelte";
    import GameControls from "$lib/GameControls.svelte";

    let isExpertMode = false;
    let showExplanation = false;

    const categories: Category[] = getCategories();
    let allTrashItems: TrashItem[] = getTrashItems(isExpertMode);
    let currentItem: TrashItem = getRandomTrashItem(allTrashItems);


    const toggleMode = () => {
        isExpertMode = !isExpertMode;
        allTrashItems = getTrashItems(isExpertMode); // Reload items based on mode
        startGame(); // Restart game when mode changes
    };

    // Game state variables
    let score = 0;
    let mistakes = 0;
    let isGameOver = false;
    let isPaused = true;

    // Constants for game area dimensions
    const categoryHeightThreshold = 80;
    const categoryWidth = 100 / categories.length;

    let interval: number;

    /**
     * Moves the current item one step to the left, looping around if necessary.
     */
    const moveLeftHandler = () => {
        currentItem = {...currentItem, positionX: (currentItem.positionX - 1 + categories.length) % categories.length};
    };

    /**
     * Moves the current item one step to the right, looping around if necessary.
     */
    const moveRightHandler = () => {
        currentItem = {...currentItem, positionX: (currentItem.positionX + 1) % categories.length};
    };

    /**
     * Checks if the item landed in the correct category.
     * Updates score, mistakes, and selects a new item.
     */
    const checkLandingHandler = () => {
        const result = checkLanding(currentItem, categories, allTrashItems, score, mistakes);
        score = result.score;
        mistakes = result.mistakes;
        isGameOver = result.isGameOver;
        currentItem = result.newItem;

        if (isGameOver) clearInterval(interval);
    };

    /**
     * Handles the "rotate" gesture or "f" key, used for "Sonstige" items.
     */
    const handleSonstigesItemHandler = () => {
        const result = handleSonstigesItem(currentItem, allTrashItems, score, mistakes);
        score = result.score;
        mistakes = result.mistakes;
        isGameOver = result.isGameOver;
        currentItem = result.newItem;

        if (isGameOver) clearInterval(interval);
    };

    /**
     * Starts a new game, resetting the game state and running the game loop.
     */
    const startGame = () => {
        isPaused = false;
        isGameOver = false;
        mistakes = 0;
        score = 0;
        currentItem = {...allTrashItems[Math.floor(Math.random() * allTrashItems.length)]};
        runGameLoop();
    };

    /** Starts a new game */
    const newGame = () => {
        startGame();
    };

    /** Toggles the game between paused and running state */
    const pauseGame = () => {
        isPaused = !isPaused;
    };

    /**
     * Runs the game loop, making the trash item fall until it lands.
     */
    const runGameLoop = () => {
        if (browser) {
            clearInterval(interval);
            interval = setInterval(() => {
                if (!isPaused && !isGameOver) {
                    if (currentItem.positionY < categoryHeightThreshold) {
                        currentItem.positionY += 5;
                    } else {
                        checkLandingHandler();
                    }
                }
            }, 500);
        }
    };

    let socket: WebSocket;

    onMount(() => {
        if (browser) {
            document.addEventListener("keydown", handleKeyPress);
            runGameLoop();
        }
    });

    onDestroy(() => {
        if (browser) {
            document.removeEventListener("keydown", handleKeyPress);
            clearInterval(interval);
        }
    });

    /**
     * Handles user keyboard input.
     * - Left Arrow (`←`): Moves the item left.
     * - Right Arrow (`→`): Moves the item right.
     * - "f" key: Activates "Sonstige" discard (only in Expert Mode).
     */
    const handleKeyPress = (event: KeyboardEvent) => {
        if (isPaused || isGameOver) return;

        event.preventDefault();

        if (event.key === "ArrowLeft") moveLeftHandler();
        if (event.key === "ArrowRight") moveRightHandler();
        if (event.key === "f" && isExpertMode) {
            handleSonstigesItemHandler();
        }
    };
</script>

<div class="flex flex-col items-center justify-center h-screen bg-gray-900">
    <!-- Heading and Explainations -->
    <h1 class="text-white text-2xl font-bold mb-4">Mülltrennung-Simulator 🚯</h1>
    <p class="text-white mb-4">Use the arrow keys (or swipe left / right) to sort the item into the correct bucket.<br>
        Press f or execute the rotate gesture, in case the item does not fit any category.</p>
    <p class="text-white mb-4">Current mode: {isExpertMode ? "Expert Mode" : "Normal Mode"} | <a class="cursor-pointer"
                                                                                                 on:click={() => showExplanation = true}>❓</a>
    </p>
    <!-- End Heading and Explainations -->


    <!-- Score and Mistakes Display -->
    <p class="text-white flex space-x-4 text-lg font-semibold mb-3">
    <span
            class="transition-transform duration-300 ease-in-out transform"
            class:scale-110={score > 0}
            class:text-green-400={score >= 10}
            class:text-white={score <= 5}
            class:text-yellow-400={score > 5 && score < 10}
    >
        Score: {score}
    </span>

        <span
                class="transition-transform duration-300 ease-in-out transform"
                class:animate-shake={mistakes > 0}
                class:text-red-500={mistakes >= 3}
                class:text-white={mistakes <= 1}
                class:text-yellow-400={mistakes > 1 && mistakes < 3}
        >
        Fehler: {mistakes} / 5
    </span>
    </p>
    <!-- End Score and Mistakes Display -->


    <!-- Game Area -->
    <div class="relative w-full max-w-4xl h-96 border-4 border-gray-300 rounded-lg overflow-hidden">
        {#if !isGameOver}
            <div class="absolute bg-white rounded-lg shadow-lg flex items-center justify-center text-black font-bold text-sm text-center p-2 overflow-hidden whitespace-normal break-words"
                 style="top: {currentItem.positionY}%; width: {categoryWidth}%; left: {currentItem.positionX * categoryWidth + categoryWidth / 2}%; transform: translateX(-50%);">
                {currentItem.name}
            </div>
        {/if}
        <div class="absolute bottom-0 left-0 w-full flex">
            {#each categories as category}
                <div class={`flex-1 h-20 flex items-center justify-center text-white font-bold ${category.color}`}>{category.name}</div>
            {/each}
        </div>
    </div>
    <!-- End Game Area -->


    {#if isGameOver}
        <p class="text-red-500 text-xl mt-4">Du hast zu viele Gegenstände falsch sortiert! Bitte vereinabare einen
            Termin mit Carsten Stahl. Finale Punktzahl: {score}</p>
    {/if}

    <GameControls
            onStart={startGame}
            onPause={pauseGame}
            onNew={newGame}
            onToggleMode={toggleMode}
            {isPaused}
    />

    <MemePlayer mistakeCount={mistakes}/>
</div>

{#if showExplanation}
    <GameModeExplanation onClose={() => (showExplanation = false)} />
{/if}

<style>
    @keyframes shake {
        0%, 100% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-3px);
        }
        50% {
            transform: translateX(3px);
        }
        75% {
            transform: translateX(-3px);
        }
    }

    .animate-shake {
        animation: shake 0.3s ease-in-out;
    }
</style>