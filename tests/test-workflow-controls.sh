#!/usr/bin/env bash

set -euo pipefail

release='.github/workflows/container-release.yml'
dockerfile='docker/Dockerfile'

test -f "$release"
test -f "$dockerfile"

node_base='node:24-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf'
nginx_base='fholzer/nginx-brotli:v1.28.0@sha256:c19ed9117e2ece6c45777e6361829a3135bf2969ea401db5c31c078c93751a02'
frontend='# syntax=docker/dockerfile:1.11@sha256:10c699f1b6c8bdc8f6b4ce8974855dd8542f1768c26eb240237b8f1c9c6c9976'

grep -Fqx "$frontend" "$dockerfile"
test "$(grep -Ec "^FROM ${node_base} AS (deps|builder)$" "$dockerfile")" -eq 2
grep -Fqx "FROM ${nginx_base} AS runtime" "$dockerfile"

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
grep -Fq 'aquasecurity/setup-trivy@' "$release"
grep -Fq 'docker/setup-buildx-action@37fe631027851001ddb9b187196cc803df7f5f0e # v4.3.0' "$release"
grep -Fq 'anchore/sbom-action@e22c389904149dbc22b58101806040fa8d37a610 # v0.24.0' "$release"
grep -Fq 'actions/attest-sbom@c604332985a26aa8cf1bdc465b92731239ec6b9e # v4.1.0' "$release"
grep -Fq 'TRIVY_CACHE_DIR: ${{ github.workspace }}/.cache/trivy' "$release"
grep -Fq 'CONTAINERS_REGISTRIES_CONF="$RUNNER_TEMP/registries.conf"' "$release"
grep -Fq 'unqualified-search-registries = ["docker.io"]' "$release"
grep -Fq 'gh release create' "$release"
grep -Fq 'gh release create "$TAG" --repo "$GITHUB_REPOSITORY"' "$release"
if grep -Fq 'gh release create "$TAG" --verify-tag' "$release"; then
    echo 'artifact-only publish job must not require a local Git checkout' >&2
    exit 1
fi
grep -Fq 'workflow_dispatch:' "$release"
grep -Fq '[[ "$tag" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]' "$release"
grep -Fq 'scripts/validate-release-source.mjs' "$release"
grep -Fq 'refs/remotes/origin/main' "$release"
grep -Fq 'Create source tag' "$release"
grep -Fq 'GH_TOKEN: ${{ github.token }}' "$release"
grep -Fq '  build-gate:' "$release"
grep -Fq '  publish:' "$release"
test "$(grep -Fc 'docker/build-push-action@' "$release")" -eq 1
test "$(grep -Fc 'Build linux/amd64 OCI image exactly once' "$release")" -eq 1

sbom_step="$(sed -n '/- name: Generate SPDX JSON SBOM/,/- name: Record scanner and database identity/p' "$release")"
grep -Fq 'image: release-gate:${{ steps.source.outputs.revision }}' <<< "$sbom_step"
grep -Fq 'format: spdx-json' <<< "$sbom_step"
grep -Fq 'output-file: ${{ steps.paths.outputs.root }}/sbom.spdx.json' <<< "$sbom_step"
grep -Fq 'upload-artifact: false' <<< "$sbom_step"

grep -Fq -- '--sbom-sha256 "$SBOM_SHA256"' "$release"

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
import_line="$(grep -n 'Import exact OCI image for local gates' "$release" | cut -d: -f1)"
sbom_line="$(grep -n 'Generate SPDX JSON SBOM' "$release" | cut -d: -f1)"
scan_line="$(grep -n 'Scan exact release image' "$release" | cut -d: -f1)"
setup_trivy_line="$(grep -n 'Install pinned Trivy CLI for evidence' "$release" | cut -d: -f1)"
version_line="$(grep -n 'Record scanner and database identity' "$release" | cut -d: -f1)"
publish_line="$(grep -n 'Publish the exact gated OCI manifest' "$release" | cut -d: -f1)"
revalidate_line="$(grep -n 'Revalidate candidate coordinates' "$release" | cut -d: -f1)"
publisher_install_line="$(grep -n 'Install pinned OCI publisher' "$release" | cut -d: -f1)"
docker_login_line="$(grep -n 'Authenticate Docker for build provenance' "$release" | cut -d: -f1)"
attest_line="$(grep -n 'Upload GitHub build provenance' "$release" | cut -d: -f1)"
attest_sbom_line="$(grep -n 'Upload GitHub SPDX SBOM attestation' "$release" | cut -d: -f1)"
test "$import_line" -lt "$sbom_line"
test "$scan_line" -lt "$tag_line"
test "$setup_trivy_line" -lt "$version_line"
test "$revalidate_line" -lt "$publisher_install_line"
test "$tag_line" -lt "$publish_line"
test "$publish_line" -lt "$docker_login_line"
test "$docker_login_line" -lt "$attest_line"
test "$attest_line" -lt "$attest_sbom_line"

revalidate_step="$(sed -n '/- name: Revalidate candidate coordinates/,/- name: Install pinned OCI publisher/p' "$release")"
grep -Fq 'sha256sum release-build/sbom.spdx.json' <<< "$revalidate_step"
grep -Fq '.release_assets["sbom.spdx.json"]' <<< "$revalidate_step"
grep -Fq '.security_evidence.sbom_sha256' <<< "$revalidate_step"

provenance_step="$(sed -n '/- name: Upload GitHub build provenance/,/- name: Upload GitHub SPDX SBOM attestation/p' "$release")"
attest_sbom_step="$(sed -n '/- name: Upload GitHub SPDX SBOM attestation/,/- name: Create immutable-coordinate GitHub release/p' "$release")"
for coordinate in \
    'subject-name: ghcr.io/berntpopp/genefoundry' \
    'subject-digest: ${{ needs.build-gate.outputs.digest }}'; do
    grep -Fq "$coordinate" <<< "$provenance_step"
    grep -Fq "$coordinate" <<< "$attest_sbom_step"
done
grep -Fq 'sbom-path: release-build/sbom.spdx.json' <<< "$attest_sbom_step"
grep -Fq 'push-to-registry: true' <<< "$attest_sbom_step"

release_step="$(sed -n '/- name: Create immutable-coordinate GitHub release/,$p' "$release")"
grep -Fq 'release-build/trivy-version.json' <<< "$release_step"
grep -Fq 'release-build/sbom.spdx.json' <<< "$release_step"
