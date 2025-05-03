# Trash Sorting Game 🚯
> We deployed this as an April fools joke: tenants were told they need to do this game as an online test, since waste disposal does not work properly. In the end, they can download a certificate, which needed to be submitted to the caretaker, indicating whether they passed or need to do an extra course + test with the caretaker (at least they were told so ;).

## Overview
Trash Sorting Game is a fun and interactive browser game that teaches players how to properly sort trash. Inspired by Tetris, trash items fall from the center of the screen, and players must move them into the correct waste category. Trash Sorting Game makes learning about recycling playful and engaging.

## How to Play
- Use the arrow keys to move the falling trash item.
- Correct placements increase your score.
- Wrong placements increase your mistake count.
- The game ends after 5 mistakes.
- Items wrap around the left/right edges.

## Categories of Waste
The game includes the following waste categories:
- Restmülltonne
- Gelber Sack
- Papiertonne
- Biotonne
- Glascontainer
- Wertstoffhof

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
    - **Left Arrow** → Move left
    - **Right Arrow** → Move right

This game makes learning about waste sorting engaging and interactive. Have fun playing and sorting responsibly! ♻️

