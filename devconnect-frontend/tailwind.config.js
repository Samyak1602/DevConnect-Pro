/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#4f46e5", // indigo-600
          "primary-focus": "#4338ca", // indigo-700
          "primary-content": "#ffffff",
          secondary: "#f1f5f9", // slate-100
          accent: "#6366f1", // indigo-500
          neutral: "#1e293b", // slate-800
          "base-100": "#ffffff",
          info: "#3b82f6", // blue-500
          success: "#10b981", // emerald-500
          warning: "#f59e0b", // amber-500
          error: "#ef4444", // red-500
        },
      },
    ],
  },
}
