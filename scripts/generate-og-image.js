/**
 * Generate OG Image PNG from SVG
 *
 * This script converts the og-image.svg to og-image.png for social media sharing.
 * Social platforms require raster images (PNG/JPEG) for Open Graph tags.
 *
 * Usage: node scripts/generate-og-image.js
 */

import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

async function generateOgImage() {
  console.log('Generating OG image...')

  const svgPath = join(publicDir, 'og-image.svg')
  const pngPath = join(publicDir, 'og-image.png')

  try {
    const svgBuffer = readFileSync(svgPath)

    await sharp(svgBuffer)
      .resize(1200, 630)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(pngPath)

    console.log(`OG image generated: ${pngPath}`)
    console.log('Dimensions: 1200x630px')
  } catch (error) {
    console.error('Error generating OG image:', error.message)
    console.log('Creating fallback OG image...')

    const fallbackSvg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#1e293b"/>
        <text x="600" y="280" font-family="system-ui, sans-serif" font-size="72" font-weight="700" fill="#ffffff" text-anchor="middle">
          Gene<tspan fill="#BE3E82">Foundry</tspan>
        </text>
        <text x="600" y="360" font-family="system-ui, sans-serif" font-size="32" fill="#94a3b8" text-anchor="middle">
          Forging Trust in Genomic AI
        </text>
      </svg>
    `

    await sharp(Buffer.from(fallbackSvg))
      .resize(1200, 630)
      .png({ quality: 90 })
      .toFile(pngPath)

    console.log(`Fallback OG image generated: ${pngPath}`)
  }
}

generateOgImage()
