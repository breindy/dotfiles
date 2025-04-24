-- Pull in the wezterm API
local wezterm = require("wezterm")

-- This will hold the configuration
local config = wezterm.config_builder()

config = {
    automatically_reload_config = true,
    hide_tab_bar_if_only_one_tab = true,
    window_decorations = "RESIZE",
    font = wezterm.font("CaskaydiaMono Nerd Font", { weight = "Bold" }),
    font_size = 16.0,
    default_cursor_style = "BlinkingBar",

    window_padding = {
        left = 10,
        right = 10,
        top = 0,
        bottom = 0,
    },
    keys = {
        -- Default QuickSelect keybind (CTRL-SHIFT-SPACE) gets captured by something else on my system
        {
            key = 'A',
            mods = 'CTRL|SHIFT',
            action = wezterm.action.QuickSelect,
        },
    },
    
}

return config