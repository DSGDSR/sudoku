import { useEffect, useState } from 'react';
import clock from '../../assets/icons/clock.svg';

interface StopwatchProps {
  startTime: number;
  limit?: string;
  running?: boolean;
  countdown?: boolean;
  setBoardTime: (time: number) => void;
  onTimeFinish?: () => void;
}

const Stopwatch = (props: StopwatchProps) => {
  const { limit, startTime, running, countdown, setBoardTime, onTimeFinish } = props;
  const [time, setTime] = useState(startTime ?? 0);

  useEffect(() => {
    let interval: number;
    if (running) {
      if (countdown && time === 0 && onTimeFinish) {
        onTimeFinish();
      } else {
        interval = setInterval(() => {
          setTime((prevTime) => (countdown ? prevTime - 1 : prevTime + 1));
          setBoardTime(time);
        }, 1000);
      }
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running, time]);

  return (
    <>
      <img src={clock} />
      <div className="stopwatch__numbers">
        <span>{('0' + Math.floor(time / 60)).slice(-2)}:</span>
        <span>{('0' + (~~time % 60)).slice(-2)}</span>
      </div>
    </>
  );
};

export default Stopwatch;
