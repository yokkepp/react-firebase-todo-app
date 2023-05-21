/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			animation: {
				"fade-in": "fade-in 0.15s ease",
			},
			keyframes: {
				"fade-in": {
					"0%": {
						opacity: "0",
					},
					to: {
						opacity: "1",
					},
				},
			},
		},
	},
	plugins: [],
};
