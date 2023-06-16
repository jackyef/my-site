/**
 * check if element is partially or fully in viewport
 */
export function isInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();

  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}
