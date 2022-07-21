import { SyntheticEvent } from 'react';
import InputMask from 'react-input-mask';

interface TimeInputProps {
  value: number;
  onChange: (value: SyntheticEvent) => void;
}

const TimeInput = ({ value, onChange }: TimeInputProps) => {
  let mask = '12:34 minutes';
  let formatChars = {
    '1': '[0-9]',
    '2': '[0-9]',
    '3': '[0-9]',
    '4': '[0-9]',
  };

  return (
    <InputMask
      mask={mask}
      alwaysShowMask={true}
      onChange={onChange}
      formatChars={formatChars}
      value={value}
    ></InputMask>
  );
};

export default TimeInput;
