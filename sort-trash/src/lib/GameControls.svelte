<script lang="ts">
    export let onStart: () => void;
    export let onPause: () => void;
    export let onNew: () => void;
    export let isPaused: boolean;

    import { browser } from "$app/environment";

    function promptUserPreferences() {
        if (!browser) return;

        const language = prompt("Choose your language: 'en' or 'de'")?.toLowerCase() === "de" ? "de" : "en";
        const room = prompt("Enter your room number:");

        document.cookie = `game_lang=${language}; path=/; max-age=31536000`;
        document.cookie = `game_room=${room}; path=/; max-age=31536000`;

        return { language, room };
    }
</script>

<div class="mt-4 flex flex-col items-center space-y-4">
    <div class="flex space-x-4">
        <button class="px-4 py-2 bg-green-500 text-white rounded" on:click={onStart}>Start</button>
        <button class="px-4 py-2 bg-yellow-500 text-white rounded" on:click={onPause}>
            {isPaused ? 'Continue' : 'Pause'}
        </button>
        <button class="px-4 py-2 bg-blue-500 text-white rounded" on:click={onNew}>New Game</button>
    </div>
</div>