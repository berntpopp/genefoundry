import { existsSync } from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'

// Format versionable files only; generated output and local audit traces stay untouched.
const files = [
  ...new Set(
    execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
      encoding: 'utf8'
    }).split('\0')
  )
].filter((file) => file && existsSync(file))
const mode = process.argv.includes('--write') ? '--write' : '--check'
const result = spawnSync('prettier', [mode, '--ignore-unknown', ...files], {
  stdio: 'inherit',
  shell: false
})
if (result.error) throw result.error
process.exitCode = result.status ?? 1
