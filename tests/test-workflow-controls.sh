#!/usr/bin/env bash

set -euo pipefail

release='.github/workflows/container-release.yml'

test -f "$release"

while IFS= read -r use; do
    if [[ ! "$use" =~ @[0-9a-f]{40}$ ]]; then
        echo "workflow action is not pinned by commit: $use" >&2
        exit 1
    fi
done < <(sed -nE 's/^[[:space:]]*uses:[[:space:]]*([^#[:space:]]+).*/\1/p' .github/workflows/*.yml)

grep -Fq 'outputs: type=oci,' "$release"
grep -Fq 'image-ref: release-gate:' "$release"
grep -Fq 'actions/attest-build-provenance@' "$release"
grep -Fq 'actions/download-artifact@' "$release"
grep -Fq 'application-release-manifest.json' "$release"
grep -Fq 'trivy-version.json' "$release"
grep -Fq 'gh release create' "$release"
grep -Fq 'workflow_dispatch:' "$release"
grep -Fq '[[ "$tag" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]' "$release"
grep -Fq 'scripts/validate-release-source.mjs' "$release"
grep -Fq 'refs/remotes/origin/main' "$release"
grep -Fq 'Create source tag' "$release"
grep -Fq 'GH_TOKEN: ${{ github.token }}' "$release"
grep -Fq '  build-gate:' "$release"
grep -Fq '  publish:' "$release"

trigger="$(sed -n '/^on:/,/^concurrency:/p' "$release")"
grep -Fq 'required: true' <<< "$trigger"
if grep -Eq 'push:|tags:|repository_dispatch:' <<< "$trigger"; then
    echo 'release workflow has a non-manual trigger' >&2
    exit 1
fi

if grep -Eq 'create-github-app-token|RELEASE_TAGGER|RELEASE_RULESET|environment:' "$release"; then
    echo 'release workflow still depends on App, ruleset, or environment machinery' >&2
    exit 1
fi

tag_line="$(grep -n 'Create source tag' "$release" | cut -d: -f1)"
scan_line="$(grep -n 'Scan exact release image' "$release" | cut -d: -f1)"
publish_line="$(grep -n 'Publish the exact gated OCI manifest' "$release" | cut -d: -f1)"
test "$scan_line" -lt "$tag_line"
test "$tag_line" -lt "$publish_line"

release_step="$(sed -n '/- name: Create immutable-coordinate GitHub release/,$p' "$release")"
grep -Fq 'release-build/trivy-version.json' <<< "$release_step"
