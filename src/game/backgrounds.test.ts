/// <reference types="node" />

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { STAGE_COUNT } from './constants'
import { getStageChapters, STAGE_NAMES } from './backgrounds'

const BACKGROUND_DIR = resolve('src/assets/backgrounds/stages')

function readWebpDimensions(filePath: string) {
  const data = readFileSync(filePath)
  const chunkType = data.toString('ascii', 12, 16)

  if (chunkType === 'VP8X') {
    return {
      width: data.readUIntLE(24, 3) + 1,
      height: data.readUIntLE(27, 3) + 1,
    }
  }

  if (chunkType === 'VP8 ') {
    for (let offset = 20; offset < data.length - 10; offset += 1) {
      if (
        data[offset] === 0x9d &&
        data[offset + 1] === 0x01 &&
        data[offset + 2] === 0x2a
      ) {
        return {
          width: data.readUInt16LE(offset + 3) & 0x3fff,
          height: data.readUInt16LE(offset + 5) & 0x3fff,
        }
      }
    }
  }

  if (chunkType === 'VP8L') {
    const sizeBits = data.readUInt32LE(21)
    return {
      width: (sizeBits & 0x3fff) + 1,
      height: ((sizeBits >> 14) & 0x3fff) + 1,
    }
  }

  throw new Error(`Unsupported WebP header: ${filePath}`)
}

describe('stage background assets', () => {
  const expectedFiles = Array.from(
    { length: STAGE_COUNT },
    (_, index) => `stage${String(index + 1).padStart(3, '0')}.webp`,
  )

  it('contains one sequential WebP file for every stage', () => {
    const actualFiles = readdirSync(BACKGROUND_DIR)
      .filter((fileName) => fileName.endsWith('.webp'))
      .sort()

    expect(actualFiles).toEqual(expectedFiles)
  })

  it('keeps every stage background at the Canvas resolution', () => {
    for (const fileName of expectedFiles) {
      expect(readWebpDimensions(resolve(BACKGROUND_DIR, fileName))).toEqual({
        width: 960,
        height: 540,
      })
    }
  })

  it('uses full illustrated plates for the world-tour stages', () => {
    for (const fileName of expectedFiles.slice(0, 20)) {
      expect(statSync(resolve(BACKGROUND_DIR, fileName)).size).toBeGreaterThan(
        80_000,
      )
    }
  })
})

describe('getStageChapters', () => {
  const chapters = getStageChapters()

  it('starts with a 20-stage World Tour chapter', () => {
    expect(chapters[0]).toEqual({ name: 'World Tour', start: 0, end: 19 })
  })

  it('groups stages 21-30 as one World Tour II chapter, not one per country', () => {
    // Each of these stages has its own per-stage country in parens (e.g.
    // "Great Wall of China (China)"), same as stages 1-20 — naively
    // suffix-grouping them would split this into 10 one-stage chapters.
    expect(chapters[1]).toEqual({
      name: 'World Tour II',
      start: 20,
      end: 29,
    })
  })

  it('covers every stage with no gaps or overlaps', () => {
    let expectedStart = 0
    for (const chapter of chapters) {
      expect(chapter.start).toBe(expectedStart)
      expect(chapter.end).toBeGreaterThanOrEqual(chapter.start)
      expectedStart = chapter.end + 1
    }
    expect(expectedStart).toBe(STAGE_NAMES.length)
  })

  it('groups stages 31+ by their shared "(Chapter Name)" suffix', () => {
    const dimensionX = chapters.find((c) => c.name === 'Dimension X')
    expect(dimensionX).toEqual({ name: 'Dimension X', start: 30, end: 39 })
  })

  it('ends with the single-stage Hidden Finale chapter', () => {
    const last = chapters[chapters.length - 1]
    expect(last.name).toBe('Hidden Finale')
    expect(last.start).toBe(last.end)
    expect(last.start).toBe(STAGE_NAMES.length - 1)
  })
})
