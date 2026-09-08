# TODO: Analyze local tmux UI config and make revamp look like own config

- User request (deferred until keybinding testing done): "analyze my local tmux ui config and make it look like this currently it has tmux at bottom i want it to look like my own config does"
- Current: revamp tmux status bar at bottom (green bg, yellow [sameh], windows 0:zsh* 1:htop 2:nvim, right: samehkhamis.com, Bay Area, clock) — cloned from samehkhamis.com
- Desired: Match user's own local tmux config (not yet inspected). Likely involves changes to status bar position/style, maybe top vs bottom, colors, window list format, maybe powerline, etc.
- Action when resumed: 
  1. Locate user's local tmux config: ~/.tmux.conf, ~/.config/tmux/tmux.conf, or repo tmux config
  2. Read and document its status bar, pane border, theme, prefix, etc.
  3. Apply to revamp: update tmux status bar component in IframeExact / iframe's status bar injection
  4. Verify via screenshot comparison
- Status: Documented, deferred per user instruction. Do not implement until keybinding testing is done.
