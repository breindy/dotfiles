## Starting up from a freshly installed OS

#### Setting up Dotfiles in directory and Running Brewfile
> Upon starting on a new OS, we want to create our dotfiles once again so we can sync them with our dotfiles repo and use our brew to install the existing applications we had easily without the manual labor.
1. Open terminal and install xcode (preq for Git and Homebrew)
```zsh
xcode-select --install
```
2. Install Git
```zsh
brew install git
```
3. Pair or generate new SSH keys to your github account on github.com
4. Clone repo into new hidden directory.

```zsh
# Use SSH (if set up)...
git clone git@github.com:breindy/dotfiles.git ~/.dotfiles

# ...or use HTTPS and switch remotes later.
git clone https://github.com/breindy/dotfiles.git ~/.dotfiles
```
5. Create symlinks in the Home directory to the real files in the repo.

```zsh
# There are better and less manual ways to do this;
# investigate install scripts and bootstrapping tools.

ln -s ~/.dotfiles/.zshrc ~/.zshrc
ln -s ~/.dotfiles/.gitconfig ~/.gitconfig
```


6. Install Homebrew, followed by the software listed in the Brewfile.

```zsh
# These could also be in an install script.

# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then pass in the Brewfile location...
brew bundle --file ~/.dotfiles/Brewfile

# ...or move to the directory first.
cd ~/.dotfiles && brew bundle
```

#### Setting up our Terminal
> To get our terminal settings to our liking, we will use iTerm2 instead of our terminal and install oh-my-zsh with powerlevel9k theme.

**Make sure zsh is installed before doing so**
1. Install zsh
```zsh
# this will already be in our Brewfile 
# but assuming it's not there, run this command
brew install zsh 
```
2. Install [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh)
```zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```
3. Install Nerd Fonts

Nerd font is an icon font aggregator that contains multiple fonts, icons, and more for your terminal!

**Option 1: Homebrew Cask Fonts**
We can run the installation through brew like so:
```zsh
brew tap homebrew/cask-fonts
brew install --cask font-hack-nerd-font
```

**Option 2: Cloning Repository and running install.sh**
WIP
```zsh
git clone https://github.com/ryanoasis/nerd-fonts.git
./install.sh
```

In iTerm2, let's change our Font to a Nerd Font (preferably non-Mono font)
(In iTerm2, navigate to Preferences > Profiles > Text)
- have 'Use different font for non-ASCII font' checked
- select the same font for Non-ASCII Font when prompted

4. Set iTerm Color Settings
> iTerm comes with a bunch of color presets and we can use a bunch of difference color presets that are available from [iTerm Color Scheme Repo](https://github.com/mbadolato/iTerm2-Color-Schemes)

The default color scheme that I am using right now is [Whimsy](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Whimsy.itermcolors)!
(Right click and save as .itermcolor extension)
```
We want to primarily save this .itermcolor into the iterm color presets directory
```

- Navigate to **Preferences > Profiles > Colors**
- At the bottom right select the **Color Presets** background and import the .itermcolors file with your desired iterm color scheme
- Once imported, make sure to select it in the **Colors Preset** once again as it isn't selected by default once you import it!

5. Powerlevel9k
> Powerlevel9k is another theming option within oh-my-zsh to help us customize our terminal even more!

Get the homebrew tap
```zsh
brew tap sambadevi/powerlevel9k
```

Then install powerlevel9k via brew
```zsh
brew install powerlevel9k
```

Install powerlevel9k theme from git repo
```zsh
git clone https://github.com/bhilburn/powerlevel9k.git ~/.oh-my-zsh/custom/themes/powerlevel9k
```

Now we want to set/load Powerlevel9k as the zsh theme that we will be using
- insert `source /usr/local/opt/powerlevel9k/powerlevel9k.zsh-theme` into .zshrc
(**IMPORTANT** Make sure this goes before oh-my-zsh is sourced -- this will cause unintended behavior if not done)

```zsh
Alternatively you can run this command to append the line to your .zshrc

  echo "source /usr/local/opt/powerlevel9k/powerlevel9k.zsh-theme" >> ~/.zshrc
```

Since we already have Nerd fonts installed, we want it to be set for Powerlevel9k
```zsh
echo 'POWERLEVEL9K_MODE = "nerdfont-complete"' >> ~ / .zshrc
echo 'source ~ / .oh-my-zsh / custom / themes / powerlevel9k / powerlevel9k.zsh-theme' >> ~ / .zshrc
```

##### Terminal Customization
> This will vary from person to person, but you can learn more about customizing the powerlevel9k prompt [here](https://github.com/Powerlevel9k/powerlevel9k/wiki/Stylizing-Your-Prompt). Check out more general info [here](https://github.com/Powerlevel9k/powerlevel9k) as well!

```zsh
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(os_icon user breindy ssh dir dir_writable)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(command_execution_time root_indicator background_jobs vcs)
POWERLEVEL9K_PROMPT_ADD_NEWLINE=true

prompt_breindy() {
    local content='c{}de'
    $1_prompt_segment "$0" "$2" "black" "white" "$content" "#"
}
```


##### Useful Zsh Plugins
1. Zsh Auto Complete
2. Zsh Syntax Highlighting

#### Configuring our Chrome

#### More Info and Resources
[sourabhajaj - Mac Setup Zsh](https://sourabhbajaj.com/mac-setup/iTerm/zsh.html)