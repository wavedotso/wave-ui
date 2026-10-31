---
"@waveso/ui": minor
---

**Breaking:** SwipeDeck's `onSwipe(details, eventDetails)` now fires the moment a card is sent off, with `eventDetails.reason` (`"swipe"`, `"keyboard"` or `"action-press"`) and the native event, and `eventDetails.cancel()` keeps the card in front. Remove cards from your list in the new `onSwipeComplete(details)`, which fires once the card has gone; return a promise to keep the card out until it settles. `SwipeDirection` is renamed `SwipeDeckDirection`, and `SwipeDeckSwipeEventDetails` and `SwipeDeckSwipeEventReason` are exported. `fan` is now the default layout, and `fan` and `cascade` open toward the end of the line (to the left in right-to-left text).

A card moved to the end of your list in `onSwipe` slides back under the pile instead of fading. A pressed card lifts under the pointer and tilts as it's dragged, drags toward sides a card can't leave by resist, and a card leaves clear of every card in sight. `SwipeDeckEmpty` shows once the last card has come to rest. Fixes for focus when a card leaves, held keys, exits interrupted by Suspense or Activity, server rendering, and smooth dragging of heavy cards in WebKit.
