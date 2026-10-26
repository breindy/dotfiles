# uv / pipx / user-installed binaries
export PATH="$HOME/.local/bin:$PATH"

# Vite+ bin (https://viteplus.dev)
[[ -f "$HOME/.vite-plus/env" ]] && . "$HOME/.vite-plus/env"
