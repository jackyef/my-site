import { motion } from 'framer-motion';

const getTargetSlug = (element: Element) => {
  // Find the heading with an `id` attribute
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
          // Narrow down the top margin by 25% of viewport and bottom by 60%.
          // This means that an element will trigger an intersection when they
          // are at the 5%-20% range of the viewport vertically.
          // This is not exact science, but trial-and-error showed that
          // this number works pretty well for this blog.
          margin: '-5% 0% -80% 0%',
        }}
        onViewportEnter={(entry) => {
          if (entry?.isIntersecting) {
            const slug = getTargetSlug(entry.target);

            if (!slug) return;

            const currentlyActiveTocItem = document.querySelector(
              `a.active[data-tocitem]`,
            );

            if (currentlyActiveTocItem) {
              currentlyActiveTocItem.classList.remove('active');
            }

            requestAnimationFrame(() => {
              // Find matching <a> tag in the page and append a class to it
              const matchingTocItem = document.querySelector(
                `a[data-tocitem][href="#${slug}"]`,
              );

              if (matchingTocItem) {
                matchingTocItem.classList.add('active');
                console.log('activating', matchingTocItem.getAttribute('href'));
              }
            });
          }
        }}
      >
        <Component {...props} />
      </motion.div>
    );
  };
}
