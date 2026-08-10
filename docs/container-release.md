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
