import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const BASE =
  "ff-press inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 text-lg font-bold select-none min-h-13 " +
  "aria-disabled:cursor-not-allowed";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary shadow-[0_3px_0_var(--app-primary-shadow)] active:shadow-none " +
    "aria-disabled:bg-surface-2 aria-disabled:text-muted aria-disabled:shadow-none",
  secondary:
    "border-2 border-line bg-surface text-ink hover:border-primary aria-disabled:opacity-60",
  ghost: "text-primary underline-offset-4 hover:underline min-h-11 w-auto px-2",
};

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  variant?: Variant;
  /** Bouton inactif mais focusable (aria-disabled) : la raison doit être affichée à côté. */
  inactive?: boolean;
  icon?: ReactNode;
  iconEnd?: ReactNode;
}

export function Button({ variant = "primary", inactive, icon, iconEnd, className = "", children, onClick, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      aria-disabled={inactive || undefined}
      // Un bouton inactif reste cliquable : le parent affiche alors la raison et déplace le focus.
      onClick={onClick}
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
    >
      {icon}
      <span>{children}</span>
      {iconEnd}
    </button>
  );
}
