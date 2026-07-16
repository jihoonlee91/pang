# Pause and page lifecycle

Pause is available from the HUD, Escape, or P. The game also pauses when the page becomes hidden, the window blurs, or `pagehide` fires. Returning to the page never resumes automatically.

While paused, physics, player input, particles, combo timing, buffs, invulnerability, and BGM are frozen. Resume shifts time-based deadlines by the paused duration. Restart Stage restores the stage-start score and recreates transient game objects.
