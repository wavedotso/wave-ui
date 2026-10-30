---
"@waveso/ui": patch
---

Focus now shows in Windows high contrast mode. That mode drops the focus ring, and every component had an outline switched on in it all the time, so every menu item, option and button was boxed and the focused one looked like the rest. Now only the element with focus, or the highlighted option in a Select, Combobox, Autocomplete or Menu, is outlined there. Nothing changes outside high contrast mode.
