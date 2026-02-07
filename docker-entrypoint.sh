#!/bin/sh
set -eu

# Read secrets as root (files mounted with 600). Export env vars if files exist.
if [ -f /run/secrets/supabase_url ]; then
  export SUPABASE_URL="$(cat /run/secrets/supabase_url)"
fi

if [ -f /run/secrets/supabase_publishable_key ]; then
  export SUPABASE_PUBLISHABLE_KEY="$(cat /run/secrets/supabase_publishable_key)"
fi

# Respect already-set environment variables
: "${SUPABASE_URL:=${SUPABASE_URL:-}}"
: "${SUPABASE_PUBLISHABLE_KEY:=${SUPABASE_PUBLISHABLE_KEY:-}}"

# Drop privileges and exec as appuser using su-exec
if command -v su-exec >/dev/null 2>&1; then
  exec su-exec appuser "$@"
else
  exec "$@"
fi
