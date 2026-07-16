# Mobile controls

PANG uses a shared `InputController` for keyboard, AI, canvas pointer, and touch-button input. Left/right and fire can be held at the same time, and separate pointer IDs allow multi-touch play.

- Touch buttons use Pointer Events and pointer capture.
- `pointerup`, `pointercancel`, and lost capture release their input source.
- `blur`, `pagehide`, pause, and hidden-page transitions clear all held input.
- Buttons are at least 56 CSS px and respect the saved size/opacity settings.

Verification: test simultaneous move/fire, cancelled touches, and both screen orientations on iOS Safari and Chrome Android.
