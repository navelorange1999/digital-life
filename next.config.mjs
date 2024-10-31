/** @type {import('next').NextConfig} */
const nextConfig = {
	distDir: 'dist',
	output: 'export',
	images: {unoptimized: true},
	assetPrefix: './',
};

export default nextConfig;
