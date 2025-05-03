<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import {browser} from "$app/environment";
    import MemePlayer from "./MemePlayer.svelte";
    import {type Category, getCategories, getRandomTrashItem, getTrashItems, type TrashItem, loadTrashData} from "$lib/gameData";
    import {checkLanding} from "$lib/gameHelpers";
    import GameControls from "$lib/GameControls.svelte";
    import jsPDF from "jspdf";
    const showMemePlayer = false;

    let allTrashItems: TrashItem[] = [];
    let currentItem: TrashItem = getRandomTrashItem(allTrashItems);
    let correctCategory: string | null = null;
    let roomNumber: string | null = null;

    // Game state variables
    let score = 0;
    let mistakes = 0;
    let isGameOver = false;
    let isPaused = true;
    const winningScore = 15;

    // Constants for game area dimensions
    const categoryHeightThreshold = 80;
    const categoryWidth = 100 / getCategories().length;

    let interval: number;

    /**
     * Moves the current item one step to the left, looping around if necessary.
     */
    const moveLeftHandler = () => {
        currentItem = {...currentItem, positionX: (currentItem.positionX - 1 + getCategories().length) % getCategories().length};
    };

    /**
     * Moves the current item one step to the right, looping around if necessary.
     */
    const moveRightHandler = () => {
        currentItem = {...currentItem, positionX: (currentItem.positionX + 1) % getCategories().length};
    };

    /**
     * Checks if the item landed in the correct category.
     * Updates score, mistakes, and selects a new item.
     */
    const checkLandingHandler = () => {
        const categories = getCategories();
        const landedCategory = categories[currentItem.positionX]?.name;

        const wasCorrect = landedCategory === currentItem.category;
        correctCategory = wasCorrect ? null : currentItem.category;

        const result = checkLanding(currentItem, categories, allTrashItems, score, mistakes);
        score = result.score;
        mistakes = result.mistakes;
        isGameOver = result.isGameOver;
        currentItem = result.newItem;

        if (isGameOver) clearInterval(interval);

        if (score >= winningScore) {
            isGameOver = true;
        }
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

    function getCookie(name: string): string | null {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function promptUserPreferences() {
        if (!browser) return;

        let language = getCookie("game_lang");
        let room = getCookie("game_room");

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

    onMount(async () => {
        if (browser) {
            const prefs = promptUserPreferences();
            roomNumber = prefs.room;

            await loadTrashData(prefs.language);
            allTrashItems = getTrashItems();
            currentItem = getRandomTrashItem(allTrashItems);

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
     */
    const handleKeyPress = (event: KeyboardEvent) => {
        if (isPaused || isGameOver) return;

        event.preventDefault();

        if (event.key === "ArrowLeft") moveLeftHandler();
        if (event.key === "ArrowRight") moveRightHandler();
    };

    function generatePdf(passed: boolean, room: string | null) {
        const doc = new jsPDF();

        const logo = new Image();
        logo.src = "/logo/logo.jpg";

        logo.onload = () => {
            doc.addImage(logo, "PNG", 150, 10, 40, 40);

            doc.setFontSize(16);
            doc.text("Kenntnisnachweis Müllentsorgung", 20, 30);

            doc.setFontSize(12);
            doc.text(`Der Bewohner der Einheit ${room || "?"} hat die Prüfung zur korrekten Müllentsorgung`, 20, 80);
            doc.setFont(undefined, "bold");
            doc.text(passed ? "bestanden." : "nicht bestanden.", 20, 88);
            doc.setFont(undefined, "normal");

            doc.text("Eine Nachschulung durch den Hausmeister ist", 20, 100);
            doc.setFont(undefined, "bold");
            doc.text(passed ? "nicht erforderlich." : "erforderlich.", 20, 108);
            doc.setFont(undefined, "normal");

            doc.setFontSize(16);
            doc.text("And with that: Happy April fools day! :P", 20, 130);
            doc.setFontSize(12);
            doc.text("* So just to be completely clear: this was all just a joke ^^", 20, 140);

            doc.save("kenntnisnachweis_muellentsorgung.pdf");
        };
    }
</script>

<div class="flex flex-col items-center justify-center h-screen bg-gray-900">
    <!-- Heading and Explainations -->
    <h1 class="text-white text-2xl font-bold mb-4">Mülltrennung-Simulator 🚯</h1>

    <p class="text-white mb-2">Room: {roomNumber}</p>
    <p class="text-white mb-4">Sort the item into the correct bin using the arrow keys.</p>
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
        Score: {score} / {winningScore}
    </span>

        <span
                class="transition-transform duration-300 ease-in-out transform"
                class:animate-shake={mistakes > 0}
                class:text-red-500={mistakes >= 3}
                class:text-white={mistakes <= 1}
                class:text-yellow-400={mistakes > 1 && mistakes < 3}
        >
        Mistakes: {mistakes} / 5
    </span>
    </p>
    <!-- End Score and Mistakes Display -->
    {#if correctCategory}
        <p class="text-yellow-300 mt-2">Correct category: {correctCategory}</p>
    {/if}


    <!-- Game Area -->
    <div class="relative w-full max-w-4xl h-96 border-4 border-gray-300 rounded-lg overflow-hidden">
        {#if !isGameOver}
            <div class="absolute bg-white rounded-lg shadow-lg flex items-center justify-center text-black font-bold text-sm text-center p-2 overflow-hidden whitespace-normal break-words"
                 style="top: {currentItem.positionY}%; width: {categoryWidth}%; left: {currentItem.positionX * categoryWidth + categoryWidth / 2}%; transform: translateX(-50%);">
                {currentItem.name}
            </div>
        {/if}
        <div class="absolute bottom-0 left-0 w-full flex">
            {#each getCategories() as category}
                <div class={`flex-1 h-20 flex items-center justify-center text-white font-bold ${category.color}`}>{category.name}</div>
            {/each}
        </div>
    </div>
    <!-- End Game Area -->


    {#if isGameOver}
        {#if score >= winningScore}
            <p class="text-green-400 text-xl mt-4">🎉 Congrats! Please download your cerificate and submit it to the caretaker.</p>
        {:else}
            <p class="text-red-500 text-xl mt-4">You sorted too many items wrong. Please download your certificate and submit it to the caretaker.</p>
        {/if}
        <button
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            on:click={() => generatePdf(score >= winningScore, roomNumber)}
        >
            📄 Download certificate
        </button>
    {/if}

    <GameControls
            onStart={startGame}
            onPause={pauseGame}
            onNew={newGame}
            {isPaused}
    />

    {#if showMemePlayer}
        <MemePlayer mistakeCount={mistakes}/>
    {/if}
</div>

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