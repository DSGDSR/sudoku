import { useEffect, useState } from 'react';

const ProgressBar = ({ percentages }: { percentages: [number, number] }) => {
  const [percentage, setPercentage] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    setPercentage(percentages);
  }, [percentages]);

  return (
    <>
      <div
        className="progress-bar__title row flex-edges margin-bottom-small"
        style={{ width: '100%' }}
      >
        <span>Your score</span>
        <span>Opponent</span>
      </div>
      <div
        className="progress-bar__bars margin-bottom-large row flex-edges"
        style={{ width: '100%' }}
      >
        <div className="progress" style={{ width: '45%' }}>
          <div className={`bar success w-${percentage[0]}`}></div>
        </div>
        <div className="progress" style={{ width: '45%' }}>
          <div className={`bar danger w-${percentage[1]}`}></div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
