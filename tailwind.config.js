/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ['./app/**/*.{js,jsx,ts,tsx}', './App.tsx', './components/**/*.{js,jsx,ts,tsx}'],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                // TODO: Create Figma design.
                primary: '#030014',
                secondary: '#151312',
                light: {
                    100: '#D6C6FF',
                    200: '#A8B5DB',
                    300: '#9CA4AB',
                },
                dark: {
                    100: '#221F3D',
                    200: '#0F0D23',
                },
                accent: '#AB8BFF',
                text: {
                    base: '#2c3e50',
                    secondary: '#7f8c8d',
                    link: '#3498db',
                },
                border: {
                    'form-input': '#DDD',
                },
            },
            backgroundColor: {
                base: '#f4f6f9',
                'form-input': '#f9f9f9',
                'button-base': '#1b263b',
            },
        },
    },
    plugins: [],
};
