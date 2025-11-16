import { Loader } from "lucide-react";

const Button = ({
  variant = "primary",
  size = "medium",
  isLoading = false,
  children,
  icon: Icon,
  ...props
}) => {
  const baseClasses =
    "cursor-pointer inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = {
    primary: "bg-orange-600 hover:bg-orange-500 text-white",
    secondary:
      "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200",
    ghost: "bg-transparent hover:bg-slate-200 text-slate-700 cursor-pointer",
  };
  const sizeClasses = {
    small: "px-3 py-1 h-8 text-sm",
    medium: "px-4 py-2 h-10 text-md",
    large: "px-6 py-3 h-12 text-base",
  };
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
