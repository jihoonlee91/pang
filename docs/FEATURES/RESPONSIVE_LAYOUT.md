# Responsive layout

Game physics always use the 960×540 logical coordinate system. CSS scales the visible canvas without changing physics, while the backing store uses a device-pixel ratio capped at 2.

The application uses `100dvh`, safe-area insets, a 16:9 canvas, hidden in-game help panels, and compact HUD rules. Portrait and landscape layouts keep controls inside the viewport without horizontal scrolling.

Target viewports: 1440×900, 1024×768, 390×844, 844×390, and 360×640.
