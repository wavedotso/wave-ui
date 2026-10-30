---
"@waveso/ui": patch
---

Avatars in an `AvatarGroup`, and an `AvatarBadge` on its avatar, are now separated by a 2px gap cut through the avatar underneath, so whatever is behind shows through it. Before, they used a ring in the page colour, which showed as a dark or light ring when the group sat on a card or any other surface. An avatar's size now comes from `--avatar-size`. To resize one, set that variable (for example `[--avatar-size:3rem]`) rather than a `size-*` class, so the gaps follow.
