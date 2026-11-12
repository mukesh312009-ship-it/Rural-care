import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 7)}`;
  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-xs font-bold text-slate-700">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${
          error ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-[11px] text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};
