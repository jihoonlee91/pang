/// <reference types="node" />

import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { STAGE_COUNT } from './constants'

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
})
