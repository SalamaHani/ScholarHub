/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['images.unsplash.com', 'lh3.googleusercontent.com'],
    },
};

export default nextConfig;
