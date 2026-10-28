---
"@waveso/ui": minor
---

New `SwipeDeck` (`@waveso/ui/swipe-deck`): a pile of cards people swipe away, one decision at a time, whatever the cards hold. Drag or throw the front card, press an arrow key while the deck is focused, or use a `SwipeDeckAction` button. `onSwipe` tells you which card left and which way: remove it from your list, or move it to the end to cycle it. `directions` sets the ways a card can leave (left and right by default), and `layout` sets how the cards behind sit: `fan` (the default), `stack`, `cascade` or `pile`, tuned with `spread`, `depth` and `visible`. End the deck with `SwipeDeckEmpty`: a message, an action, or both, shown as the last card leaves. It needs the optional `motion` peer, like `Masonry` and `ActionBar`.
