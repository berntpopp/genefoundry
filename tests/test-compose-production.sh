#!/usr/bin/env bash

set -euo pipefail

digest='aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
image="ghcr.io/berntpopp/genefoundry@sha256:$digest"
tmpdir="$(mktemp -d)"
rendered="$tmpdir/rendered.json"

cleanup() {
    rm -rf "$tmpdir"
}
trap cleanup EXIT

if docker compose \
    -f docker/docker-compose.yml \
    -f docker/docker-compose.npm.yml \
    config --format json > /dev/null 2>&1; then
    echo 'production compose unexpectedly rendered without GENEFOUNDRY_IMAGE_SHA256' >&2
    exit 1
fi

GENEFOUNDRY_IMAGE='alpine:latest' GENEFOUNDRY_IMAGE_SHA256="$digest" docker compose \
    -f docker/docker-compose.yml \
    -f docker/docker-compose.npm.yml \
    config --format json > "$rendered"

jq -e --arg image "$image" '
  .services.genefoundry
  | .image == $image
    and (has("build") | not)
    and ((.ports // []) | length == 0)
    and .pull_policy == "missing"
    and .user == "101:101"
    and .read_only == true
    and .cap_drop == ["ALL"]
    and (.security_opt | index("no-new-privileges:true") != null)
    and .healthcheck.test == ["CMD", "wget", "-qO-", "http://127.0.0.1:8080/health"]
' "$rendered" > /dev/null

grep -Fq 'GENEFOUNDRY_IMAGE_SHA256=' .env.docker.example
if grep -Eq '^GENEFOUNDRY_IMAGE=' .env.docker.example; then
    echo '.env.docker.example still accepts an arbitrary image name' >&2
    exit 1
fi

make_command="$(make --dry-run docker-up)"
grep -Fq 'scripts/validate-production-env.mjs .env.docker' <<< "$make_command"
grep -Fq -- '--env-file .env.docker' <<< "$make_command"
grep -Fq 'env -u GENEFOUNDRY_IMAGE_SHA256' <<< "$make_command"

printf 'GENEFOUNDRY_IMAGE_SHA256=latest\n' > "$tmpdir/invalid.env"
if node scripts/validate-production-env.mjs "$tmpdir/invalid.env" > /dev/null 2>&1; then
    echo 'production admission accepted a mutable digest' >&2
    exit 1
fi

printf 'GENEFOUNDRY_IMAGE_SHA256=%s\n' "$digest" > "$tmpdir/valid.env"
node scripts/validate-production-env.mjs "$tmpdir/valid.env"
