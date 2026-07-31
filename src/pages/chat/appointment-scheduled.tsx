import confetti from 'canvas-confetti';
import { useEffect } from 'react';

const AppointmentScheduledPage = () => {
  useEffect(() => {
    // Purely decorative motion, and canvas-confetti paints to its own canvas
    // where no CSS media query can reach it. Decorative movement is the one
    // category the reduced-motion guidance says to drop outright rather than
    // soften, so someone who asked for less motion just gets the message.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    confetti();
  }, []);

  return (
    <div className="text-center py-24">
      <h1 className="text-3xl md:text-6xl">
        We are all set!
        <br />
        See you soon 👋
      </h1>
    </div>
  );
};

export default AppointmentScheduledPage;
