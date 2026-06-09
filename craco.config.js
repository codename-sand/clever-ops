const path = require("path");

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            "@assets": path.resolve(__dirname, "src/assets"),
            '@components': path.resolve(__dirname, 'src/components'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@datas': path.resolve(__dirname, 'src/_apiDatas'),
        },
    },
    "extends": "./jsconfig.paths.json"
};



 