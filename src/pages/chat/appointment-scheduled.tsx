import confetti from 'canvas-confetti';
import { useEffect } from 'react';

const AppointmentScheduledPage = () => {
  useEffect(() => {
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
