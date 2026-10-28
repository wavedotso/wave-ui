---
"@waveso/ui": minor
---

New `SwipeDeck` (`@waveso/ui/swipe-deck`): a pile of cards people swipe away, one decision at a time, whatever the cards hold. Each card is a `SwipeDeckItem` with a `value` (the same id as its `key`), rendered as the deck's direct children in your list's order. Drag or throw the front card, press an arrow key while the deck is focused, or use a `SwipeDeckAction` button; a pressed card lifts under the pointer and tilts as it's dragged.

`onSwipe(details, eventDetails)` comes the moment a card is sent off, with `eventDetails.reason` (`"swipe"`, `"keyboard"` or `"action-press"`) and the native event: count it there, or call `eventDetails.cancel()` to keep the card in front. `onSwipeComplete(details)` comes once the card has gone: remove it from your list then. A card your list keeps comes back, and returning a promise keeps the card out until it settles. To cycle the deck, move the card to the end of your list in `onSwipe`, and it slides back under the pile. To undo, put a card back at the start of your list.

`directions` sets the ways a card can leave (left and right by default), and `layout` sets how the cards behind sit: `fan` (the default), `stack`, `cascade` or `pile`, tuned with `spread`, `depth` and `visible`. `fan` and `cascade` open toward the end of the line, so to the left in right-to-left text. End the deck with `SwipeDeckEmpty`: a message, an action, or both, drawn under the last card once it has come to rest and usable as that card leaves. It needs the optional `motion` peer, like `Masonry` and `ActionBar`.
