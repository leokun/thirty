#!/bin/bash
# Claude Code PreToolUse hook: validate gitmoji commit message format
# Expected format: <gitmoji> [<domain>] <imperative summary>
#
# Exit 0 = allow, Exit 2 = block with reason

INPUT=$(cat)

# Only check Bash tool calls
TOOL=$(echo "$INPUT" | jq -r '.tool_name // ""')
[ "$TOOL" = "Bash" ] || exit 0

# Extract the command
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

# Only check git commit commands
echo "$COMMAND" | grep -q 'git commit' || exit 0

# Skip if it's a --amend without a new message
echo "$COMMAND" | grep -q '\-\-amend' && ! echo "$COMMAND" | grep -q '\-m' && exit 0

# Extract commit message: get first non-empty content line from heredoc or -m
MSG=""
if echo "$COMMAND" | grep -q "cat <<"; then
  # Heredoc style: extract lines between <<'EOF' and EOF, take first non-empty
  MSG=$(echo "$COMMAND" | sed -n "/cat <<['\"\`]*EOF/,/^[[:space:]]*EOF/p" | sed '1d;/^[[:space:]]*EOF/d' | sed '/^[[:space:]]*$/d' | head -1 | sed 's/^[[:space:]]*//')
else
  # Simple -m "message" or -m 'message' style
  MSG=$(echo "$COMMAND" | sed -n 's/.*-m[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)
  [ -z "$MSG" ] && MSG=$(echo "$COMMAND" | sed -n "s/.*-m[[:space:]]*'\([^']*\)'.*/\1/p" | head -1)
fi

# If we couldn't extract a message, let it through
[ -z "$MSG" ] && exit 0

# Trim leading whitespace
MSG=$(echo "$MSG" | sed 's/^[[:space:]]*//')

# Known gitmoji list (the actual emoji characters used in the project)
GITMOJI="✨|🐛|♻️|✅|📝|🔧|⬆️|🗃️|🏗️|🎨|🔥|🚀|💄|🔒|🩹|🎉"

# Check if message starts with a known gitmoji
STARTS_WITH_EMOJI=false
for emoji in ✨ 🐛 ♻️ ✅ 📝 🔧 ⬆️ 🗃️ 🏗️ 🎨 🔥 🚀 💄 🔒 🩹 🎉; do
  case "$MSG" in
    "$emoji"*) STARTS_WITH_EMOJI=true; break ;;
  esac
done

if [ "$STARTS_WITH_EMOJI" = true ]; then
  # Check for [domain] scope
  if echo "$MSG" | grep -qE '\[.+\]'; then
    exit 0
  else
    echo "BLOCKED: Commit message missing [domain] scope." >&2
    echo "Expected format: <gitmoji> [<domain>] <imperative summary>" >&2
    echo "Domains: scoring, journal, diversity, suggestion, shared, food-db, auth, infra, docs, ui" >&2
    echo "Example: ✨ [diversity] Add rolling window plant counter" >&2
    exit 2
  fi
fi

echo "BLOCKED: Commit message must start with a gitmoji." >&2
echo "Expected format: <gitmoji> [<domain>] <imperative summary>" >&2
echo "Domains: scoring, journal, diversity, suggestion, shared, food-db, auth, infra, docs, ui" >&2
echo "Example: ✨ [diversity] Add rolling window plant counter" >&2
exit 2
