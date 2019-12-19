const path = require("path");

module.exports = {
    lintOnSave: true,
    css:{
        loaderOptions: {
            // 给 sass-loader 传递选项 配置公共样式
            scss: {
                prependData: '@import "./src/styles/common.scss";'
            },
            // 配置 postcss-px2rem
            postcss: {
                plugins: [
                    require("postcss-px2rem")({
                        remUnit: 100
                    })
                ]
            }
        }
    },
    devServer: {
        hot: true, // 开启热加载
        port: 8080, // 访问端口
        /**
         * 告诉开发服务器将任何未知请求 (没有匹配到静态文件的请求) 代理到http://www.fleet.com
         * http://192.168.2.194:8080/devApi 或者 http://localhost:8080/devApi 会被代理成 http://www.fleet.com
         */
        proxy: {
            '/devApi': {
                target: "http://www.fleet.com", // API服务器的地址  http://www.fleet.com
                changeOrigin: true,
                pathRewrite: {
                    '^/devApi': ''
                },
            },
            '/resource': {
                target: "http://www.fleet.com/public", // 公共资源的地址  http://www.fleet.com/public
                changeOrigin: true,
                pathRewrite: {
                    '^/resource': ''
                },
            }
        }
    }
}