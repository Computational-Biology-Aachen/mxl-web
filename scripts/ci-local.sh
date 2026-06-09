#!/usr/bin/env bash
# Emulate this site's GitHub Pages deploy build locally, in a clean container.
#
# Why this exists: when developed from the meta-repo, the design/mxlweb-core
# deps are npm *workspace* symlinks. CI has no workspace — it does a standalone
# `npm install` that pulls those as `github:` git deps. That gap is what produces
# "works locally, fails on GitHub". This script reproduces the CI path: fresh
# container, Node 25, standalone install, same build command.
#
# Requirements: Docker or podman, and an ssh-agent (SSH_AUTH_SOCK) holding a key
# with access to the private github: dependencies — forwarded into the container.
set -euo pipefail

BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
RESET='\033[0m'

dir="$(git rev-parse --show-toplevel)"
IMAGE="node:25"

# Pick a container runtime. podman (Fedora default) needs SELinux label
# disabled for the bind mounts; docker does not.
if command -v podman >/dev/null 2>&1; then
    RUNTIME=podman
    RUNTIME_OPTS=(--security-opt label=disable)
elif command -v docker >/dev/null 2>&1; then
    RUNTIME=docker
    RUNTIME_OPTS=()
else
    printf "${RED}Need docker or podman installed.${RESET}\n" >&2
    exit 1
fi

repo="$(basename -s .git "$(git -C "$dir" remote get-url origin)")"

if [[ -z "${SSH_AUTH_SOCK:-}" || ! -S "${SSH_AUTH_SOCK:-}" ]]; then
    printf "${RED}Warning: no ssh-agent (SSH_AUTH_SOCK) — git+ssh deps will fail to install.${RESET}\n"
    printf "Run: eval \"\$(ssh-agent -s)\" && ssh-add\n\n"
fi

printf "${BOLD}=== CI build: %s (BASE_PATH=/%s) ===${RESET}\n" "$repo" "$repo"

# Mirror the deploy.yml: Node 25, upgrade npm, `npm ci`,
# then `npm run build` with BASE_PATH. The source tree is copied in (minus
# node_modules/build) so the install is truly fresh and the host's node_modules
# is never touched.
"$RUNTIME" run --rm "${RUNTIME_OPTS[@]}" \
    -e "BASE_PATH=/$repo" \
    -e "SSH_AUTH_SOCK=/ssh-agent" \
    -v "${SSH_AUTH_SOCK:-/dev/null}:/ssh-agent" \
    -v "$dir:/src:ro" \
    "$IMAGE" bash -euc '
        mkdir -p ~/.ssh
        ssh-keyscan -t rsa,ed25519 github.com >> ~/.ssh/known_hosts 2>/dev/null
        mkdir /app
        tar -C /src --exclude=node_modules --exclude=.svelte-kit --exclude=build -cf - . \
            | tar -C /app -xf -
        cd /app
        npm install -g "npm@>=12.0.0-pre.0.0" >/dev/null 2>&1
        npm ci
        npm run build
    '

printf "${GREEN}${BOLD}CI build passed: %s${RESET}\n" "$repo"
