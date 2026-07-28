type Reason = 'hover' | 'drag' | 'locked';

const active = new Set<Reason>();
let canvas: HTMLElement | null = null;

/**
 * The room is dragged to look around, so the canvas wears a grab cursor
 * by default. Both that and the pointer cursor over clickable objects
 * have to come from the same place: `cursor` is inherited, so a cursor
 * set on the canvas would otherwise always beat one set on the body.
 */
const apply = () => {
  if (!canvas) return;
  const hovering = active.has('hover');
  // Orbiting is off while a section is open, so promising a drag there
  // would be a lie — the room is only click-to-dismiss
  if (active.has('locked')) {
    canvas.style.cursor = hovering ? 'pointer' : 'default';
    return;
  }
  canvas.style.cursor = active.has('drag')
    ? 'grabbing'
    : hovering
      ? 'pointer'
      : 'grab';
};

export const bindSceneCursor = (element: HTMLElement | null) => {
  canvas = element;
  // Unbinding is a teardown; binding must not stomp on state the scene
  // has already set, since the canvas is created after the first effects
  if (!element) active.clear();
  else apply();
};

export const setSceneCursor = (reason: Reason, on: boolean) => {
  if (on) active.add(reason);
  else active.delete(reason);
  apply();
};
