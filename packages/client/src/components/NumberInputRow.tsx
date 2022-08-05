import Button from './Button';
import './styles/NumberInputRow.css';

interface NumberInputRowProps {
  completedNumbers: number[];
  onNumberPress: (key: string | number) => void;
}

const NumberInputRow = (props: NumberInputRowProps) => {
  const { onNumberPress, completedNumbers } = props;
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const countCompleted = (number: number): boolean => {
    return completedNumbers.filter((n) => n === number).length === 9;
  };

  return (
    <div className="number-inputs margin-top-large">
      <div className="number-inputs__row">
        {numbers.map((number) => (
          <Button
            key={number}
            className={`number-inputs__button margin-small ${
              countCompleted(number) ? 'btn-success' : null
            }`}
            onClick={() => onNumberPress(number)}
            text={`${number}`}
          />
        ))}
      </div>
    </div>
  );
};

export default NumberInputRow;
