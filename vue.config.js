let proxyObj = {};

// proxyObj['/ws'] = {
//     ws: true,
//     target: "ws://localhost:8181"
// };

proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8181',
    secure: false,
    changeOrigin: true,
}
module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 3000,
        open: true,
        proxy: proxyObj
    }
}