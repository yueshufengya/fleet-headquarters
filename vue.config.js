const path = require("path");

module.exports = {
    lintOnSave: true,
    css:{
        loaderOptions: {
            // 给 sass-loader 传递选项
            scss: {
                prependData: '@import "./src/styles/common.scss";'
            },
            postcss: {
                plugins: [
                    require("postcss-px2rem")({
                        remUnit: 100
                    })
                ]
            }
        }
    }
}