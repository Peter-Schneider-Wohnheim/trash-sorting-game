<script lang="ts">
    export let onStart: () => void;
    export let onPause: () => void;
    export let onNew: () => void;
    export let isPaused: boolean;
</script>

<div class="mt-4 flex flex-col items-center space-y-4">
    <div class="flex space-x-4">
        <button class="px-4 py-2 bg-green-500 text-white rounded" on:click={onStart}>Start</button>
        <button class="px-4 py-2 bg-yellow-500 text-white rounded" on:click={onPause}>
            {isPaused ? 'Spiel fortsetzen' : 'Spiel pausieren'}
        </button>
        <button class="px-4 py-2 bg-blue-500 text-white rounded" on:click={onNew}>Neues Spiel</button>
    </div>
</div>