import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ESLint } from 'eslint'

const eslint = new ESLint()

test('TypeScript recommended rules reject explicit any', async () => {
  const [result] = await eslint.lintText('const value: any = 1; console.log(value)', {
    filePath: 'src/security-probe.ts'
  })
  assert.ok(
    result.messages.some((message) => message.ruleId === '@typescript-eslint/no-explicit-any')
  )
})

test('Vue scripts retain TypeScript recommended rules', async () => {
  const [result] = await eslint.lintText(
    '<script setup lang="ts">const value: any = 1; console.log(value)</script><template><div /></template>',
    { filePath: 'src/SecurityProbe.vue' }
  )
  assert.ok(
    result.messages.some((message) => message.ruleId === '@typescript-eslint/no-explicit-any')
  )
  assert.equal(
    result.messages.some((message) => message.fatal),
    false
  )
})

test('Vue scripts require the TypeScript language', async () => {
  const [result] = await eslint.lintText(
    '<script setup>const value = 1; console.log(value)</script><template><div /></template>',
    { filePath: 'src/SecurityProbe.vue' }
  )
  assert.ok(result.messages.some((message) => message.ruleId === 'vue/block-lang'))
})

test('Node build scripts reject undefined names and accept Node globals', async () => {
  const [result] = await eslint.lintText('console.log(process.cwd(), unknownSecurityProbe)', {
    filePath: 'scripts/security-probe.mjs'
  })
  const undefinedNames = result.messages.filter((message) => message.ruleId === 'no-undef')
  assert.equal(undefinedNames.length, 1)
  assert.match(undefinedNames[0].message, /unknownSecurityProbe/)
})
