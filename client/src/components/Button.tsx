export enum ButtonSizes {
  Small = 'btn-small',
  Medium = '',
  Large = 'btn-large',
}

interface ButtonProps {
  text: string;
  size?: ButtonSizes;
  className?: string;
  style?: React.CSSProperties;
  onClick: () => void;
}

const Button = (props: ButtonProps) => {
  const { text, size, onClick, className, style } = props;

  return (
    <button
      style={style ?? undefined}
      className={`${size ?? ''} ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
