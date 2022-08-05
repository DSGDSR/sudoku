import { useState } from 'react';
import usePadMenu from '../hooks/usePadMenu';

import './styles/NumberPad.css';

interface NumberPadProps {
  onInputNumber: (num: number) => void;
  completedNumbers: number[];
}

const NumberPad = ({ onInputNumber, completedNumbers }: NumberPadProps) => {
  const [_selected, setSelected] = useState<number | null>(null);
  const { anchorPoint, show } = usePadMenu(() => {
    setSelected((previous) => {
      if (previous) {
        console.log(previous);
        onInputNumber(previous);
      }
      return null;
    });
  });

  const updateNumber = (number: number) => {
    setSelected(number);
  };

  const cleanNumber = () => {
    setSelected(null);
  };

  const countCompleted = (number: number): boolean => {
    return completedNumbers.filter((n) => n === number).length === 9;
  };

  return show ? (
    <>
      <div
        className="number-pad"
        style={{
          left: `${anchorPoint.x - 65}px`,
          top: `${anchorPoint.y - 65}px`,
        }}
      >
        {/*<span className="number-pad__close">x</span>*/}
        <div className="number-pad__numbers">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <span
              key={number}
              onMouseEnter={() => updateNumber(number)}
              onMouseLeave={cleanNumber}
              className={`number-pad__cell ${
                countCompleted(number) ? 'number-pad__cell--completed' : null
              }`}
            >
              {number}
            </span>
          ))}
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default NumberPad;
