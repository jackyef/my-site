import { createContext, useContext, type RefObject } from 'react';
import { Html } from '@react-three/drei';

type HtmlProps = React.ComponentProps<typeof Html>;

/**
 * drei mounts `<Html>` into whichever element r3f takes its events from. For
 * this scene that is the slot, while the canvas deliberately overhangs it — so
 * anything mounted there lands a full bleed below the object it belongs to,
 * and inherits whatever the slot does to the accessibility tree.
 *
 * The canvas-aligned layer therefore travels in context rather than as a prop:
 * every overlay in the room picks it up, including ones added later, without
 * threading a ref down through the object tree.
 */
const HtmlPortalContext = createContext<RefObject<HTMLElement | null> | null>(
  null,
);

export const HtmlPortalProvider = HtmlPortalContext.Provider;

export function SceneHtml(props: HtmlProps) {
  const portal = useContext(HtmlPortalContext);

  return <Html {...props} portal={portal as RefObject<HTMLElement>} />;
}
