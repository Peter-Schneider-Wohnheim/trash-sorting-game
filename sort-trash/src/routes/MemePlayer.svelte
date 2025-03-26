<script lang="ts">
    export let mistakeCount: number;

    let showMeme = false;
    let memeSrc = "";
    let videoElement: HTMLVideoElement | null = null; // Reference to video element

    $: if (mistakeCount > 0 && mistakeCount <= 5) {
        memeSrc = `/memes/${mistakeCount}.webm`;
        showMeme = true;
    }

    const handleVideoLoaded = () => {
        if (videoElement) {
            const duration = videoElement.duration * 1000; // Convert seconds to milliseconds
            setTimeout(() => {
                showMeme = false;
            }, duration);
        }
    };
</script>

{#if showMeme}
    <video
            bind:this={videoElement}
            class="absolute bottom-10 right-10 w-64 h-64 rounded-lg shadow-lg"
            autoplay
            on:loadedmetadata={handleVideoLoaded}
            on:ended={() => showMeme = false}
    >
        <source src={memeSrc} type="video/webm" />
    </video>
{/if}