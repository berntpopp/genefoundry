#!/usr/bin/env bash

set -euo pipefail

image='genefoundry-health:test'
container=''
tmpdir="$(mktemp -d)"
headers="$tmpdir/headers"
body="$tmpdir/body"

cleanup() {
    if [ -n "$container" ]; then
        docker rm -f "$container" >/dev/null 2>&1 || true
    fi
    rm -rf "$tmpdir"
}
trap cleanup EXIT

docker build --tag "$image" --file docker/Dockerfile .
container="$(docker run --detach --publish 127.0.0.1::8080 "$image")"
port="$(docker port "$container" 8080/tcp | awk -F: 'NR == 1 { print $NF }')"

docker exec "$container" nginx -t

for _ in $(seq 1 30); do
    if curl --fail --silent --show-error --dump-header "$headers" --output "$body" \
        "http://127.0.0.1:$port/health"; then
        break
    fi
    sleep 1
done

test -s "$headers"
test -s "$body"
test "$(tr -d '\r' < "$body")" = "OK"
test "$(grep -ic '^content-type:' "$headers")" -eq 1
grep -Eiq '^content-type:[[:space:]]*text/plain([;[:space:]]|$)' "$headers"
