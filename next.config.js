/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'upload.wikimedia.org',
          port: '',
          pathname: '/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/800px-Eq_it-na_pizza-margherita_sep2005_sml.jpg',
        },
        {
          protocol: 'https',
          hostname: 'www.recipetineats.com',
          port: '',
          pathname: '/wp-content/uploads/2020/05/Pepperoni-Pizza_5-SQjpg.jpg',
        },
        {
          protocol: 'https',
          hostname: 'asset.kompas.com',
          port: '',
          pathname: '/crops/teG8bxBeC9NzNi6opEf38UDC74Q=/0x0:1000x667/750x500/data/photo/2020/09/22/5f69e601777db.jpg',
        },
        {
          protocol: 'https',
          hostname: 'awsimages.detik.net.id',
          port: '',
          pathname: '/community/media/visual/2021/07/06/perbedaan-pizza-italia-dan-pizza-amerika-2.jpeg',
        },
        {
          protocol: 'https',
          hostname: 'www.kingarthurbaking.com',
          port: '',
          pathname: '/sites/default/files/styles/featured_image/public/2022-03/Easiest-Pizza_22-2_11.jpg',
        },
      ]
    }
  }
  
  module.exports = nextConfig