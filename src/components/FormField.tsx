import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export default function FormField({ label, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1 font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}