# New Mac Terminal Setup — Session Notes (2026-10-26)

Reference for setting up the zsh / WezTerm / starship config from this repo on a
fresh Mac, plus every problem hit along the way and how it was fixed.
Work landed on PR #1 (`add/zshrc`): commits `48bc68aa` and `81d9a58b`.

## TL;DR — setting up a new machine

```zsh
xcode-select --install                       # if not already installed
git clone git@github.com:breindy/dotfiles.git ~/.dotfiles
cd ~/.dotfiles && ./install.sh               # run in a real terminal (it asks y/N questions)
exec zsh                                     # or open WezTerm
```

`install.sh` is safe to re-run.

## What `install.sh` does

1. Installs Homebrew if missing, then `Brewfile.terminal`:
   starship, eza, zsh-autosuggestions, zsh-syntax-highlighting, zsh-completions,
   git, gh, WezTerm, **CaskaydiaMono Nerd Font**.
2. Removes group/other write permission from Homebrew's completion dirs
   (see Issue 6 below).
3. Installs oh-my-zsh unattended (`KEEP_ZSHRC=yes`, so it never overwrites `.zshrc`).
4. Asks **yes/no for each** optional tool: pyenv, rbenv, volta, pnpm, uv
   (default No). `.zshrc` only initialises the ones that are installed.
5. Backs up existing files to `~/.dotfiles-backup/<timestamp>/` and symlinks:

   | Repo file               | Linked to                 |
   |-------------------------|---------------------------|
   | `.zshenv`               | `~/.zshenv`               |
   | `.zprofile`             | `~/.zprofile`             |
   | `.zshrc`                | `~/.zshrc`                |
   | `.wezterm.lua`          | `~/.wezterm.lua`          |
   | `.config/starship.toml` | `~/.config/starship.toml` |
   | `.gitconfig`            | `~/.gitconfig`            |
   | `.gitmessage`           | `~/.gitmessage`           |

6. Prints the git identity in use.

## Look & feel (what "configured the same" means)

- **Terminal:** WezTerm, CaskaydiaMono Nerd Font **Bold, 16pt**, blinking bar
  cursor, `RESIZE` window decorations, tab bar hidden with one tab, 10px side padding.
- **Keys:** `Ctrl+Shift+A` → QuickSelect; `Shift+Enter` → sends `ESC+CR`
  (newline without submit in CLIs like Claude Code).
- **Prompt:** starship gruvbox-rainbow powerline (OS icon → user → dir → git →
  language versions → docker → time), two-line with `` character.
  Needs a Nerd Font or the icons render as boxes.
- **Shell:** oh-my-zsh (`robbyrussell` theme, overridden by starship),
  `git` plugin, syntax highlighting (path underline disabled), autosuggestions.
- **ls:** `eza --icons` aliases: `l ls ll la lt lt1-3 lta lta1-3`.

## Machine-specific overrides (untracked)

Keep anything that only applies to one machine out of the repo:

| File                 | Loaded by    | Use for                                 |
|----------------------|--------------|-----------------------------------------|
| `~/.zshrc.local`     | `.zshrc`     | work aliases, extra PATHs, secrets      |
| `~/.zprofile.local`  | `.zprofile`  | login-shell env                         |
| `~/.gitconfig.local` | `.gitconfig` | e.g. a work email (wins over repo value)|

## Git identity

`.gitconfig` uses the GitHub noreply address so personal email never appears in
commits:

```
name  = breindy
email = 16421165+breindy@users.noreply.github.com
```

Override per machine in `~/.gitconfig.local` if needed.

## Issues encountered & fixes

### 1. Hardcoded `/Users/breindy` paths
The PR's `.zshrc` / `.zshenv` hardcoded the old username (pnpm, Antigravity,
opencode, uv). On a machine with a different username those paths don't exist.
**Fix:** use `$HOME` everywhere.

### 2. Shell errors when a tool isn't installed
`$(pyenv root)`, `$(brew --prefix)`, `starship init`, `. ~/.vite-plus/env` and
`source $ZSH/oh-my-zsh.sh` all error on every new shell if the tool is missing.
**Fix:** guard each one, e.g.

```zsh
command -v pyenv > /dev/null && eval "$(pyenv init - zsh)"
[[ -f "$HOME/.vite-plus/env" ]] && . "$HOME/.vite-plus/env"
[[ -f "$ZSH/oh-my-zsh.sh" ]] && source "$ZSH/oh-my-zsh.sh"
```

Tested by loading the config with an isolated `ZDOTDIR` before installing
anything: `ZDOTDIR=/some/tmp/dir zsh -l -i -c 'echo ok'`.

### 3. Stray `ß` at the end of `.zshrc`
Would print `command not found: ß` on every shell. **Fix:** deleted.

### 4. Stale / obsolete lines
- `.zprofile` added the Python 2.7 framework to PATH (gone on modern macOS).
  **Fix:** replaced with Homebrew `shellenv` (Apple Silicon `/opt/homebrew`,
  falls back to Intel `/usr/local`).
- MySQL PATH, `DYLD_LIBRARY_PATH`, Python 3.8 `C_INCLUDE_PATH` — removed.

### 5. `.wezterm.lua` silently dropped settings
```lua
local config = wezterm.config_builder()
config = { ... keys = { Ctrl+Shift+A } }   -- replaces the builder object
config.keys = { Shift+Enter }              -- wipes out Ctrl+Shift+A
```
**Fix:** set fields on the builder (`config.font = ...`) and put both key
bindings in one `config.keys` table.

### 6. oh-my-zsh "Insecure completion-dependent directories detected"
After `install.sh`, `exec zsh` printed:

```
[oh-my-zsh] Insecure completion-dependent directories detected:
drwxrwxr-x@ 20 michelleuy  admin  640 ... /opt/homebrew/share
```

**Cause:** Homebrew created `/opt/homebrew/share` group-writable (`admin`);
oh-my-zsh's `compaudit` refuses to load completions from dirs others could write to.
**Fix:** remove group/other write (keeps the security check on, unlike
`ZSH_DISABLE_COMPFIX=true`):

```zsh
compaudit                                # list the flagged dirs
chmod g-w,o-w /opt/homebrew/share        # or: compaudit | xargs chmod g-w,o-w
```

`install.sh` now does this automatically. If a future `brew` update makes the
dir group-writable again and the warning returns, re-run the `chmod` or
`./install.sh`.

### 7. Outdated Brewfile taps
`homebrew/bundle`, `homebrew/cask`, `homebrew/cask-fonts`, `homebrew/core` are
deprecated and make `brew bundle` fail. **Fix:** removed. Fonts are now plain
casks (`cask "font-caskaydia-mono-nerd-font"`). The terminal essentials live in
`Brewfile.terminal` so the full app list in `Brewfile` isn't forced onto every
machine (e.g. a work laptop).

## Gotchas to remember

- **Docker Desktop edits `~/.zshrc`.** Since `~/.zshrc` is a symlink, its
  additions land in the repo file. `.zshrc` already handles Docker
  (completions on `fpath` before oh-my-zsh, `~/.docker/bin` on PATH), so discard
  unexpected Docker diffs in `git status`.
- **Run `install.sh` in a real terminal.** The yes/no prompts need a TTY; when
  run non-interactively every optional tool defaults to No.
- **zsh load order:** `.zshenv` (every shell) → `.zprofile` (login) →
  `.zshrc` (interactive). WezTerm on macOS starts a login shell, so all three run.

## Verification checklist

```zsh
zsh -i -c exit                     # no output = no errors
time zsh -i -c exit                # startup was ~0.14s
zsh -i -c 'compaudit && echo ok'   # completion dirs secure
git config --global user.email     # noreply address
ls -l ~/.zshrc ~/.wezterm.lua ~/.config/starship.toml   # symlinks into the repo
```

In WezTerm: Nerd Font icons in the prompt and `ls`, gruvbox powerline segments,
syntax highlighting, grey autosuggestions, `Ctrl+Shift+A` / `Shift+Enter` work.
