/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  {
    key: 'Access-Control-Allow-Methods',
    value: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  },
  // {
  //   key: 'Content-Security-Policy',
  //   value: `default-src 'self' 'unsafe-inline' 'unsafe-eval' http://103.174.56.65:3008 http://localhost:4000 http://103.174.56.65:4000 http://103.174.56.169:8091 http://117.254.87.83:8091 https://registration.ap.gov.in; child-src http://103.174.56.65:3008 http://localhost:3008 http://localhost:4000 http://103.174.56.169:8091 http://103.174.56.65:4000 http://117.254.87.83:8091 https://registration.ap.gov.in; style-src 'self' 'unsafe-inline' http://103.174.56.65:3008 http://103.174.56.169:8091 http://117.254.87.83:8091 http://103.174.56.65:4000 https://registration.ap.gov.in https://fonts.googleapis.com https://www.gstatic.com; font-src 'self' 'unsafe-inline' https://fonts.gstatic.com; img-src * 'self' data: https:; frame-src 'self' blob:;`
  // },
  // {
  //   key: 'X-XSS-Protection',
  //   value: '1; mode=block'
  // },
  {
    key:'Cache-Control',
    value:`private, must-revalidate, max-age=0, no-store, no-cache, must-revalidate, post-check=0, pre-check=0`
  }
];

const nextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  env: {
    PAYMENT_REDIRECT_URL: process.env.PAYMENT_REDIRECT_URL,
    BASE_URL: process.env.BASE_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    AADHAR_URL: process.env.AADHAR_URL,
    SECRET_KEY: process.env.SECRET_KEY,
    IGRS_SECRET_KEY: process.env.IGRS_SECRET_KEY,
    PAYMENT_VERIFY_URL:process.env.PAYMENT_VERIFY_URL,
    BACKEND_STATIC_FILES:process.env.BACKEND_STATIC_FILES
  },
  basePath:"/firmsHome"
};

module.exports = nextConfig;
