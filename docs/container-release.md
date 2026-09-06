# Container Release

The container release is a manual GitHub Actions workflow. It has no pushed-tag
trigger and requires no GitHub App, repository ruleset, protected environment,
or release-specific secret.

## Release

1. Merge the reviewed release pull request to `main`.
2. Wait for the `CI` and `Security` push workflows on that exact `main` commit
   to complete successfully.
3. In **Actions → Container release → Run workflow**, select `main` and enter a
   new stable tag in `vX.Y.Z` form.

The workflow fails closed unless its checked-out commit is exact current
`origin/main`, is the merge commit of a pull request with a current approval on
the final PR head, and has successful latest `CI` and `Security` push runs.

It then builds once, smoke-tests and scans that OCI candidate, records the image
manifest and Trivy version/database evidence, and only then uses the standard
workflow `github.token` to create the source tag. The same gated OCI archive is
published, attested, and attached to the GitHub release with its immutable
application release manifest.

Do not create the release tag manually. For deployment, copy only the 64-character
hexadecimal value after `sha256:` into `GENEFOUNDRY_IMAGE_SHA256` in
`.env.docker`; `make docker-up` validates and loads that file.

## What the deployment controller requires

Production is deployed by the strato controller, which re-verifies this release
before it will admit it. Three parts of the published evidence exist only to
satisfy that check. Each one refused a real release on 2026-09-06, and each
refusal cost a version, because tags are immutable and a failed release cannot
reuse one. Do not "simplify" any of them away.

- **The application release manifest states its whole closed schema.**
  `scripts/generate-release-manifest.mjs` emits `mcp: null` and
  `data_requirements.schema_compatibility: []` even though a static site has no
  MCP surface and no data. The controller recomputes the manifest's canonical
  digest from its own parsed model, so an omitted field changes that digest and
  the record cannot bind to the published bytes.
- **`trivy.json` is an envelope, not a bare scanner report.**
  `scripts/build-scanner-envelope.mjs` wraps the native report as
  `{schema_version: 2, scan, version, wrapper}` with a `genefoundry-trivy-v2`
  wrapper summarising each result and asserting zero fixable HIGH/CRITICAL
  findings. It must run **before** `scanner_evidence_sha256` is computed, because
  the manifest binds the published bytes. The controller accepts a bare report
  only for a frozen set of older workflow revisions that this repository can
  never be in, since it signs with its own commit.
- **Build provenance records `refs/heads/main`, not the tag.** This workflow is
  dispatched manually against current `main` and creates the tag inside the same
  run, so that branch is the ref the image was genuinely built from. The
  controller expects exactly that for this repository. The tag is still bound to
  the same commit, because the controller separately requires the release to be
  immutable and its tag to resolve to the manifest's source revision.
