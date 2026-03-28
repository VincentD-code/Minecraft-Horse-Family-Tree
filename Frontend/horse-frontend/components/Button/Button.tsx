import * as styles from "./Button.css";

interface ButtonProps {
  onClick?: () => void;
  text: string;
  className?: string; 
}

export default function Button({ onClick, text, className }: ButtonProps) {
  return (
    <button className={`${styles.Button} ${className || ""}`} onClick={onClick}>
      {text}
    </button>
  );
}
