import svgr from 'vite-plugin-svgr'
import zlib from 'zlib';

export default {
  plugins: [svgr()],
  server: {
    port: 8085,
    proxy: {
      '/cartoapi': {
        target: 'https://gcp-us-east1.api.carto.com',
        selfHandleResponse : true,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/cartoapi/, ''),
        configure: proxy => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            proxyRes.headers['cache-control'] = 'public,max-age=100000,must-revalidate';
            // Modify response
            let body = [];
            proxyRes.on('data', function (chunk) {
              body.push(chunk);
            });
            proxyRes.on('end', function () {
              body = Buffer.concat(body);
              zlib.unzip(body, (err, buffer) => {
                if (!err) {
                  let remoteBody = buffer.toString();
                  // remoteBody = remoteBody.replace() // do some string manipulation on remoteBody
                  console.log(remoteBody);
                  res.write(remoteBody);
                  res.end();
                } else {
                  console.error(err);
                }
              });
            });
          });
        }
      },
      '/tile': {
        target: 'https://www.googleapis.com',
        changeOrigin: true,
        rewrite: path => path,
        configure: proxy => {
          proxy.on('proxyRes', proxyRes => {
            // Cache 3D tiles locally for better perf (during development)
            proxyRes.headers['cache-control'] = 'public,max-age=100000,must-revalidate';
          });
        }
      }
    }

  }
}
