<script lang="ts">
    export let onClose: () => void;
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
        <h2 class="text-xl font-bold mb-2">Game Modes</h2>
        <p class="mb-4">
            🔹 <strong>Normal Mode:</strong> Only the six main trash categories are available.
            Items that don’t fit these categories won’t appear, and the rotate gesture (or "f" key) is disabled.
        </p>
        <p class="mb-4">
            🔸 <strong>Expert Mode:</strong> Includes an additional "Sonstiges" category for items that don’t belong
            in any other bin. Use the rotate gesture or press "f" to discard these correctly.
        </p>
        <button class="px-4 py-2 bg-red-500 text-white rounded" on:click={onClose}>
            Close
        </button>
    </div>
</div>