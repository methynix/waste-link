interface AlertProps {
  kind?: "error" | "ok";
  children: string;
}

export function Alert({ kind = "error", children }: AlertProps) {
  return <div className={`alert alert-${kind}`}>{children}</div>;
}
