const theme = window.matchMedia('(prefers-color-scheme: dark)');
const updateTheme = () => document.documentElement.setAttribute('data-bs-theme', theme.matches ? 'dark' : 'light');
updateTheme();
theme.addEventListener('change', updateTheme);
