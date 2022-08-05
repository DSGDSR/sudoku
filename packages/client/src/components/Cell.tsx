import './styles/Cell.css';

interface CellProps {
  x: number;
  y: number;
  number: number;
  error: boolean;
  highlight: boolean;
  selected: boolean;
  onSelect: (x: number, y: number) => void;
}

const Cell = (props: CellProps) => {
  const { x, y, number, error, highlight, selected, onSelect } = props;

  return (
    <>
      <div
        tabIndex={0}
        className={`cell ${highlight ? 'highlight' : ''} ${
          error ? 'error' : ''
        } ${selected ? 'selected' : ''}`}
        attr-x={x}
        attr-y={y}
        onClick={() => onSelect(x, y)}
        onFocus={() => onSelect(x, y)}
      >
        {number >= 0 ? number + 1 : ''}
      </div>
    </>
  );
};

export default Cell;
