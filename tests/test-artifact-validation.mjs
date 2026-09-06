import assert from 'node:assert/strict'
import { test } from 'node:test'

import { decode, escapeHtml } from '../scripts/validate-artifacts.mjs'

test('escaping then decoding returns the original text', () => {
  for (const original of [
    '&lt;',
    '&amp;',
    '&amp;lt;',
    '<b>bold</b>',
    'a & b',
    'quote " and apostrophe \'',
    'https://example.invalid/?a=1&b=2',
    'plain text'
  ]) {
    assert.equal(decode(escapeHtml(original)), original)
  }
})

test('decoding resolves the ampersand entity last', () => {
  // Decoding "&amp;" first would re-decode its own output: the encoded form of
  // the literal "&lt;" would come back as "<" rather than "&lt;".
  assert.equal(decode('&amp;lt;'), '&lt;')
  assert.equal(decode('&amp;quot;'), '&quot;')
  assert.equal(decode('&amp;amp;'), '&amp;')
  assert.equal(decode('&lt;b&gt;'), '<b>')
})
