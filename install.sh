#!/usr/bin/env bash
#
# Bootstrap this Mac's terminal setup from the dotfiles repo.
#   1. Homebrew + terminal essentials (Brewfile.terminal)
#   2. oh-my-zsh
#   3. Optional language tools (asks yes/no for each)
#   4. Symlink dotfiles into $HOME (existing files are backed up first)
#
# Usage: ./install.sh
# Safe to re-run.

set -euo pipefail

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="$HOME/.dotfiles-backup/$(date +%Y%m%d-%H%M%S)"

info() { printf '\033[1;34m==>\033[0m %s\n' "$1"; }
warn() { printf '\033[1;33m==>\033[0m %s\n' "$1"; }

# Ask a yes/no question; defaults to "no" (and to "no" when not run interactively)
ask() {
  local reply
  [[ -t 0 ]] || return 1
  read -r -p "$1 [y/N] " reply
  [[ "$reply" =~ ^[Yy]([Ee][Ss])?$ ]]
}

# --- 1. Homebrew ------------------------------------------------------------

if ! xcode-select -p > /dev/null 2>&1; then
  info "Installing Xcode Command Line Tools (re-run this script when it finishes)"
  xcode-select --install
  exit 0
fi

if ! command -v brew > /dev/null; then
  if [[ -x /opt/homebrew/bin/brew ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [[ -x /usr/local/bin/brew ]]; then
    eval "$(/usr/local/bin/brew shellenv)"
  else
    info "Installing Homebrew"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi
fi

info "Installing terminal essentials from Brewfile.terminal"
brew bundle --file "$DOTFILES_DIR/Brewfile.terminal"

# oh-my-zsh's compaudit refuses group-writable completion dirs ("Insecure
# completion-dependent directories detected"); Homebrew creates them g+w
info "Securing Homebrew completion directories"
for dir in share share/zsh share/zsh/site-functions share/zsh-completions; do
  [[ -d "$(brew --prefix)/$dir" ]] && chmod g-w,o-w "$(brew --prefix)/$dir"
done

# --- 2. oh-my-zsh -----------------------------------------------------------

if [[ -d "$HOME/.oh-my-zsh" ]]; then
  info "oh-my-zsh already installed"
else
  info "Installing oh-my-zsh"
  RUNZSH=no CHSH=no KEEP_ZSHRC=yes sh -c \
    "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi

# --- 3. Optional language tools --------------------------------------------

info "Optional tools (.zshrc only loads the ones that are installed)"
for tool in pyenv rbenv volta pnpm uv; do
  if command -v "$tool" > /dev/null; then
    info "$tool already installed"
  elif ask "Install $tool?"; then
    brew install "$tool"
  else
    info "Skipping $tool"
  fi
done

# --- 4. Symlinks ------------------------------------------------------------

# link <path in repo> <path in $HOME>
link() {
  local src="$DOTFILES_DIR/$1" dst="$HOME/$2"

  if [[ -L "$dst" && "$(readlink "$dst")" == "$src" ]]; then
    info "$2 already linked"
    return
  fi

  if [[ -e "$dst" || -L "$dst" ]]; then
    mkdir -p "$BACKUP_DIR/$(dirname "$2")"
    mv "$dst" "$BACKUP_DIR/$2"
    warn "Backed up existing $2 -> $BACKUP_DIR/$2"
  fi

  mkdir -p "$(dirname "$dst")"
  ln -s "$src" "$dst"
  info "Linked $2"
}

link .zshenv              .zshenv
link .zprofile            .zprofile
link .zshrc               .zshrc
link .wezterm.lua         .wezterm.lua
link .config/starship.toml .config/starship.toml
link .gitconfig           .gitconfig
link .gitmessage          .gitmessage

if [[ -d "$BACKUP_DIR" ]]; then
  warn "Anything machine-specific from the backed-up files belongs in ~/.zshrc.local,"
  warn "~/.zprofile.local or ~/.gitconfig.local (none of these are tracked in the repo)."
fi

info "Git identity: $(git config --global user.name) <$(git config --global user.email)>"
info "Done. Open WezTerm (or run 'exec zsh') to load the new config."
