/** Social preview uses the original mark and the same self-hosted typefaces as the site. */
import sharp from 'sharp'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const publicDir = new URL('../public/', import.meta.url)
const logo = await readFile(new URL('genefoundry_logo.svg', publicDir))
const logoUrl = 'data:image/svg+xml;base64,' + logo.toString('base64')
const fonts = {
  body: { family: 'Source Sans 3', file: 'fonts/source-sans-3-latin-400-600.woff2' },
  display: { family: 'Archivo', file: 'fonts/archivo-latin-600.woff2' }
}
const labels = [
  { text: 'GeneFoundry', font: 'body', size: 34, weight: 600, color: '#A23570', x: 120, y: 108 },
  {
    text: 'Biomedical data.',
    font: 'display',
    size: 68,
    weight: 600,
    color: '#182325',
    x: 120,
    y: 246
  },
  {
    text: 'One MCP connection.',
    font: 'display',
    size: 68,
    weight: 600,
    color: '#182325',
    x: 120,
    y: 334
  },
  {
    text: 'Source catalog · Client setup guides · Research workflows',
    font: 'body',
    size: 25,
    weight: 400,
    color: '#52616B',
    x: 120,
    y: 478
  }
]
const background = `<rect width="1200" height="630" fill="#F6F5F1"/>
  <rect x="72" y="80" width="8" height="470" fill="#A23570"/>
  <image href="${logoUrl}" x="930" y="76" width="190" height="190"/>`
const fontRules = await Promise.all(
  Object.values(fonts).map(async (font) => {
    const bytes = await readFile(new URL(font.file, publicDir))
    return `@font-face{font-family:'${font.family}';font-weight:400 600;src:url(data:font/woff2;base64,${bytes.toString('base64')}) format('woff2')}`
  })
)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <style>${fontRules.join('\n')}</style>${background}
  ${labels.map((label) => `<text x="${label.x}" y="${label.y + label.size * 0.8}" font-family="${fonts[label.font].family}" font-size="${label.size}" font-weight="${label.weight}" fill="${label.color}">${label.text}</text>`).join('\n')}
</svg>\n`
await writeFile(new URL('og-image.svg', publicDir), svg)
// Pango loads the actual local fonts; librsvg alone may ignore embedded @font-face.
const layers = await Promise.all(
  labels.map(async (label) => ({
    input: await sharp({
      text: {
        text: `<span foreground="${label.color}" weight="${label.weight}">${label.text}</span>`,
        font: `${fonts[label.font].family} ${label.size}`,
        fontfile: fileURLToPath(new URL(fonts[label.font].file, publicDir)),
        rgba: true
      }
    })
      .png()
      .toBuffer(),
    left: label.x,
    top: label.y
  }))
)
await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">${background}</svg>`
  )
)
  .composite(layers)
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(new URL('og-image.png', publicDir)))
const metadata = await sharp(fileURLToPath(new URL('og-image.png', publicDir))).metadata()
if (metadata.width !== 1200 || metadata.height !== 630)
  throw new Error('Invalid social preview dimensions')
console.log('Generated 1200×630 social preview from the original mark, Archivo and Source Sans 3.')
