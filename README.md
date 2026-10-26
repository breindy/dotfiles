## Bootstrapping a New Mac

1. Install Apple's Command Line Tools, which are prerequisites for Git and Homebrew.

```zsh
xcode-select --install
```


2. Clone repo into new hidden directory.

```zsh
# Use SSH (if set up)...
git clone git@github.com:breindy/dotfiles.git ~/.dotfiles

# ...or use HTTPS and switch remotes later.
git clone https://github.com/breindy/dotfiles.git ~/.dotfiles
```


3. Run the install script. It is safe to re-run.

```zsh
cd ~/.dotfiles && ./install.sh
```

It will:
- install Homebrew (if missing) and the terminal essentials in `Brewfile.terminal`
  (starship, eza, zsh plugins, gh, WezTerm, CaskaydiaMono Nerd Font)
- install oh-my-zsh
- ask yes/no for each optional tool: pyenv, rbenv, volta, pnpm, uv
- back up any existing files to `~/.dotfiles-backup/<timestamp>/` and symlink
  `.zshenv`, `.zprofile`, `.zshrc`, `.wezterm.lua`, `.config/starship.toml`,
  `.gitconfig`, `.gitmessage` into `$HOME`

Machine-specific settings go in untracked `~/.zshrc.local`, `~/.zprofile.local`
and `~/.gitconfig.local`. Git commits use the GitHub noreply address from
`.gitconfig`; override it per machine in `~/.gitconfig.local` if needed.


4. (Optional) Install the full app list.

```zsh
brew bundle --file ~/.dotfiles/Brewfile
```

## TODO List
- Learn how to use [`defaults`](https://macos-defaults.com/#%F0%9F%99%8B-what-s-a-defaults-command) to record and restore System Preferences and other macOS configurations.
- [macos-defaults](https://macos-defaults.com/)
- Organize these growing steps into multiple script files.
- Automate symlinking and run script files with a bootstrapping tool like [Dotbot](https://github.com/anishathalye/dotbot).
- Revisit the list in [`.zshrc`](.zshrc) to customize the shell.
- Make a checklist of steps to decommission your computer before wiping your hard drive.
- Create a [bootable USB installer for macOS](https://support.apple.com/en-us/HT201372).
- Integrate other cloud services into your Dotfiles process (Dropbox, Google Drive, etc.).
- Find inspiration and examples in other Doffiles repositories at [dotfiles.github.io](https://dotfiles.github.io/).

### Creating Symlinks from Dotfiles to Directory
You must copy the original .dotfile into your repository and your computer stores the symlink to it.

```zsh
In ~ run: 
    ln -s ~/.dotfiles/.configFileName ~/.configFileName
```

Make sure to double check if that symlink is created!

### Files
1. **.gitconfig**
- git configuration file
- WIP: To add github aliases/shortcuts
2. **.zshrc**
- oh-my-zsh configuration file with customization on terminal and PATH
- WIP: To separate aliases, paths, environment variables...
3. **Brewfile**
- Includes the applications installed using brew, brew cask
- WIP: To beautify the file
4. **.npm-global**
- Global npm packages installed in my system, in order to export your own to a file run:
`npm list --global --parseable --depth=0 | sed '1d' | awk '{gsub(/\/.*\//,"",$1); print}' > ~/.dotfiles/.npm-global`

- To install packages locally from file:
`xargs npm install --global < ~/.dotfiles/.npm-global`

### Checklist
0. SymLink Automation
1. Scripts to setup folders, directories
2. Fresh install script file
3. Clone install script file to install essential github repos
4. Look into Mackup