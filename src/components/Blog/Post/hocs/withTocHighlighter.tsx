import { type JSX } from 'react';
import { motion } from 'motion/react';

const getTargetSlug = (element: Element) => {
  const headingElement = element.querySelector(`[id]`);
  if (!headingElement) return '';
  return headingElement.getAttribute('id');
};

export function withTocHighlighter<Props extends JSX.IntrinsicAttributes>(
  Component: (props: Props) => JSX.Element,
) {
  return (props: Props) => {
    return (
      <motion.div
        viewport={{
          // Trigger when a heading enters the top ~15% of the viewport.
          margin: '-5% 0% -80% 0%',
        }}
        onViewportEnter={(entry) => {
          if (entry?.isIntersecting) {
            const slug = getTargetSlug(entry.target);
            if (slug) {
              window.dispatchEvent(
                new CustomEvent('blog:heading-active', { detail: { slug } }),
              );
            }
          }
        }}
      >
        <Component {...props} />
      </motion.div>
    );
  };
}
