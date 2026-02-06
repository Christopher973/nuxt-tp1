#!/bin/sh
set -eu

if [ -z "${SUPABASE_URL:-}" ] && [ -f /run/secrets/supabase_url ]; then
  export SUPABASE_URL="$(cat /run/secrets/supabase_url)"
fi

if [ -z "${SUPABASE_PUBLISHABLE_KEY:-}" ] && [ -f /run/secrets/supabase_publishable_key ]; then
  export SUPABASE_PUBLISHABLE_KEY="$(cat /run/secrets/supabase_publishable_key)"
fi

exec "$@"
