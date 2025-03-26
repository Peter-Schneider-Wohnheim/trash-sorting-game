# Mülltrennungs-Simulator 🚯
Der Spielspaß für die ganze Alman-Familie!

## Overview
Mülltrennungs-Simulator is a fun and interactive browser game that teaches players how to properly sort trash. Inspired by Tetris, trash items fall from the center of the screen, and players must move them into the correct waste category. With visual feedback, gesture support, and two game modes, Mülltrennungs-Simulator makes learning about recycling playful and engaging.

## How to Play
- Use the arrow keys or swipe left/right to move the falling trash item.
- In Expert Mode, press `f` or perform a rotate gesture to discard an item that doesn’t belong to any category.
- Correct placements increase your score.
- Wrong placements increase your mistake count.
- The game ends after 5 mistakes.
- Items wrap around the left/right edges.

## Game Modes
### Normal Mode (default):
- Only the 6 main trash categories are included.
- The rotate gesture / `f` key is disabled.
- Items that don’t belong to any known category are not shown.

### Expert Mode:
- Includes a 7th category: “Sonstige” (miscellaneous).
- Use the rotate gesture or press `f` to discard such items.
- More challenging for eco-experts 💪

You can toggle the game mode anytime using the "Toggle mode" button.


## Categories of Waste
The game includes the following waste categories:
- Restmülltonne
- Gelber Sack
- Papiertonne
- Biotonne
- Glascontainer
- Wertstoffhof
- Sonstige (Expert Mode only)

## UI Features
- ✅ WebSocket connection status indicator (top of the screen)
- ✋ Live gesture feedback (displays the last gesture received)
- 🎮 MemePlayer reacts to mistakes
- 📋 Game mode explanation popup available anytime via ❓ icon

## Game Logic
### Initial Setup
1. **Load Trash Data**: The game loads predefined trash items from a JSON file, associating each with a correct waste category. We got this data from the Abfall-ABC of the city of Würzburg (see `trash_dataset`).
2. **Randomized Start**: A random item is selected as the current falling trash item.
3. **Initialize State**: Variables such as `score`, `mistakes`, `isGameOver`, and `isPaused` are initialized.

### Game Mechanics
1. **Item Movement**:
    - The player can move the falling item left or right using arrow keys or swipe gestures.
    - Movement wraps around, meaning if the item moves right at the last category, it appears on the leftmost category (and vice versa).

2. **Game Loop**:
    - A timer updates the falling item's position every 500ms.
    - If the item reaches the bottom, the category is checked:
        - If correct, the **score increases**.
        - If incorrect, the **mistake count increases**.
        - If mistakes reach 5, the **game ends**.
    - A new item is selected for the next round.

3. **Gesture & Keyboard Control**:
    - **Left Arrow / Swipe Left** → Move left
    - **Right Arrow / Swipe Right** → Move right
    - **"f" Key / Rotate Gesture** → Discard item (for items that don’t fit any category)

### WebSocket Integration (Gesture Control)
- The game integrates WebSocket communication to support gesture-based controls.
- When a gesture (e.g., `swipe_left`, `swipe_right`, `rotate`) is detected, the corresponding move is executed.
- The WebSocket server sends messages when gestures are recognized, allowing real-time control.

This game makes learning about waste sorting engaging and interactive. Have fun playing and sorting responsibly! ♻️

