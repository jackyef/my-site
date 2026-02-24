# Big Picture Mode

A Steam Big Picture–inspired full-screen overlay UI for jackyef.com, navigable with a game controller, keyboard, or mouse.

## Activation

| Method | How |
|--------|-----|
| Command Palette | `Cmd+K` → type "big picture" → select "Enter Big Picture mode" |
| Controller connected | A toast appears with an "Enter Big Picture" button |
| Keyboard | Arrow keys, Enter, Escape work as navigation |

## Button Mapping

| Button | Index | Action |
|--------|-------|--------|
| A / Cross | 0 | Select / Confirm |
| B / Circle | 1 | Back |
| Start / Menu | 9 | Toggle Big Picture off |
| D-pad Up | 12 | Navigate up |
| D-pad Down | 13 | Navigate down |
| D-pad Left | 14 | Navigate left |
| D-pad Right | 15 | Navigate right |
| Left Stick X | Axis 0 | Navigate left/right |
| Left Stick Y | Axis 1 | Navigate up/down |
| Right Stick Y | Axis 3 | Scroll content |
| LB / L1 | 4 | (reserved) |
| RB / R1 | 5 | (reserved) |

## Keyboard Fallbacks

| Key | Action |
|-----|--------|
| Arrow keys | Navigate between cards |
| Enter | Select focused card |
| Escape | Go back / exit |

## Internal Navigation Stack

Big Picture uses its own navigation stack separate from Next.js routing. No URL changes occur while browsing in Big Picture mode.

```typescript
type BPScreen =
  | { id: 'home' }
  | { id: 'blog' }
  | { id: 'post'; slug: string }
  | { id: 'about' }
  | { id: 'absurd-ui' };
```

- `push(screen)` navigates forward
- `pop()` goes back one level
- At root (`home`), `pop()` exits Big Picture mode

## Component Tree

```
BigPictureProvider (context + gamepad detection)
└── BigPictureShell (full-screen overlay)
      ├── AmbientGlow (background radial gradient)
      ├── TopBar (back + exit buttons)
      ├── [screen]
      │     HomeScreen     → SectionTile ×3
      │     BlogScreen     → PostCard grid (from /api/posts)
      │     PostReaderScreen → MDXProvider (from /api/posts/[slug])
      │     AboutScreen    → static bio + FocusCard links
      │     AbsurdUIScreen → BallisticSlider
      └── ButtonHints (bottom strip)
```

## Adding a New Section

1. Add a new variant to `BPScreen` in `types.ts`
2. Add the new screen component in `screens/`
3. Add a `case` to the `ScreenComponent` switch in `BigPictureShell.tsx`
4. Add a `SectionTile` entry in `HomeScreen.tsx`
5. (Optional) Add a glow color in `constants.ts` → `SECTION_GLOW_COLORS`

## Browser Support

The Gamepad API is well-supported in modern browsers (Chrome, Firefox, Safari 16.4+, Edge). On some browsers, a user interaction event (click, keypress) must occur before `navigator.getGamepads()` returns connected gamepads. This is handled gracefully — the polling only starts after the browser fires the `gamepadconnected` event.

## Testing Without a Controller

You can simulate a gamepad connection in browser DevTools:

```javascript
window.dispatchEvent(
  new Event('gamepadconnected')
);
```

This will trigger the toast notification.
