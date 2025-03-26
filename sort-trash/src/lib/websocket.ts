let socket: WebSocket | null = null;

// Add to the function signature:
export function connectWebSocket(
    url: string,
    onLeft: () => void,
    onRight: () => void,
    onRotate: () => void,
    getExpertMode: () => boolean,
    onGestureUpdate?: (gesture: string) => void,
    onStatusUpdate?: (connected: boolean) => void
) {
    if (socket) {
        socket.close();
    }

    socket = new WebSocket(url);

    socket.addEventListener("open", (event) => {
        console.log("WebSocket connection opened:", event);
        onStatusUpdate?.(true);
    });

    socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        if (message.event === "gesture_detected" && message.data?.gesture) {
            const gesture: string = message.data.gesture;
            onGestureUpdate?.(gesture);

            if (gesture === "swipe_left") {
                onLeft();
            } else if (gesture === "swipe_right") {
                onRight();
            } else if (gesture === "rotate" && getExpertMode()) {
                onRotate();
            }
        }
    });

    socket.addEventListener("error", (event) => {
        console.error("WebSocket error:", event);
    });

    socket.addEventListener("close", (event) => {
        console.log("WebSocket connection closed:", event);
        onStatusUpdate?.(false);
    });

    return socket;
}

export function disconnectWebSocket() {
    if (socket) {
        socket.close();
        socket = null;
    }
}