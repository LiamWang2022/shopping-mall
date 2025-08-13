import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`rounded-xl bg-gray-900 text-white px-4 py-2 shadow-md
                  hover:bg-gray-800 hover:shadow-lg hover:scale-[1.02]
                  transition-all duration-200 disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}