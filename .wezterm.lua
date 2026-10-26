-- Pull in the wezterm API
local wezterm = require("wezterm")

-- This will hold the configuration
local config = wezterm.config_builder()

config.automatically_reload_config = true
config.hide_tab_bar_if_only_one_tab = true
config.window_decorations = "RESIZE"
config.font = wezterm.font("CaskaydiaMono Nerd Font", { weight = "Bold" })
config.font_size = 16.0
config.default_cursor_style = "BlinkingBar"

config.window_padding = {
    left = 10,
    right = 10,
    top = 0,
    bottom = 0,
}

config.keys = {
    -- Default QuickSelect keybind (CTRL-SHIFT-SPACE) gets captured by something else on my system
    {
        key = 'A',
        mods = 'CTRL|SHIFT',
        action = wezterm.action.QuickSelect,
    },
    -- Shift+Enter sends ESC+CR (newline without submit in CLIs like Claude Code)
    {
        key = "Enter",
        mods = "SHIFT",
        action = wezterm.action.SendString("\x1b\r"),
    },
}

return config
