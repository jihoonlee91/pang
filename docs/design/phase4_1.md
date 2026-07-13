# Phase 4-1. Scoring System

> This is a draft. Details will be finalized after discussion.

## Goal

- Enhance the scoring system with combos, bonuses, etc.

## Design

- Removing a ball (including via splitting) awards a base score by size: level 0 (small) 300 points, level 1 150 points, level 2 (large) 100 points
- Hitting balls consecutively within 1.5 seconds increases the combo; final score = base score x (1 + combo x 0.1)
