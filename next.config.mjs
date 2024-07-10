/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
                port: '',
                pathname: '/image/**'
            },
            {
                protocol: 'https',
                hostname: 'images.fineartamerica.com',
                port: '',
                pathname: '/images/**'
            }
        ]
    }
};

export default nextConfig;
