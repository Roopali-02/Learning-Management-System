/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBg: '#F9F9F9',
        blueBg: '#ecf5ff',
        lightText:'#717B9E'
      },
      flexBasis: {
        '10': '10%', 
        '90': '90%',
      },
      fontSize: {
        'md': '13px',
        'seventeen': '17px', // Custom small size
      },
      maxHeight: {
        '120': '600px', // Custom class for max-h-96
      },
    },
  },
  plugins: [],
}
