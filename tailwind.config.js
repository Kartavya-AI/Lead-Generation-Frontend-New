// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './src/**/*.{js,jsx,ts,tsx}',
//     './public/index.html',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: '#3B82F6',
//         accent: '#2563EB',
//         'accent-foreground': '#ffffff',
//         background: '#F9FAFB',
//         foreground: '#1F2937',
//         muted: '#6B7280',
//         'muted-foreground': '#9CA3AF',
//         border: '#E5E7EB',
//         amber: {
//           600: '#d97706',
//         },
//       },
//       boxShadow: {
//         'xl-custom': '0 10px 15px -3px rgba(59, 130, 246, 0.4), 0 4px 6px -2px rgba(37, 99, 235, 0.3)',
//       },
//       fontFamily: {
//         serif: ['Georgia', 'serif'],
//       },
//       transitionProperty: {
//         transform: 'transform',
//         colors: 'color',
//         shadow: 'box-shadow',
//       },
//       transitionDuration: {
//         DEFAULT: '300ms',
//       },

      
//       keyframes: {
//         'fade-in': {
//           '0%': { opacity: '0', transform: 'translateY(20px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//       },
//       animation: {
//         'fade-in': 'fade-in 0.6s ease-out forwards',
//       },
//     },
//   },
//   plugins: [],
// };
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx}",
//     "./components/**/*.{js,ts,jsx,tsx}",
//     "./lib/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: "#6366f1",
//         accent: "#f472b6", 
//       },
//     },
//   },
//   plugins: [],
// };
// tailwind.config.js

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",   // Indigo-500
        accent: "#f472b6",    // Pink-400
      },
      backgroundSize: {
        '200': '200% 200%',
      },
      animation: {
        gradient: 'gradient 5s ease infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
