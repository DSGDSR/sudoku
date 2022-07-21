import Button from './Button';
import './styles/NumberInputRow.css';

interface NumberInputRowProps {
  onNumberPress: (key: string | number) => void;
}

const NumberInputRow = (props: NumberInputRowProps) => {
  const { onNumberPress } = props;
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="number-inputs margin-top-large">
      <div className="number-inputs__row">
        {numbers.map((number) => (
          <Button
            key={number}
            className="number-inputs__button margin-small"
            onClick={() => onNumberPress(number)}
            text={`${number}`}
          />
        ))}
      </div>
    </div>
  );
};

export default NumberInputRow;
