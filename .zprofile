# Homebrew (Apple Silicon: /opt/homebrew, Intel: /usr/local)
if [[ -x /opt/homebrew/bin/brew ]]; then
  eval "$(/opt/homebrew/bin/brew shellenv zsh)"
elif [[ -x /usr/local/bin/brew ]]; then
  eval "$(/usr/local/bin/brew shellenv zsh)"
fi

# Machine-specific overrides (not tracked in the repo)
[[ -f "$HOME/.zprofile.local" ]] && source "$HOME/.zprofile.local"
