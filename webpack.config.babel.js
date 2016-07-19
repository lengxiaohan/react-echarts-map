const webpack = require("webpack"),
    path = require("path"),
    fs = require("fs");
//ExtractTextPlugin = require("extract-text-webpack-plugin");// 独立css

// 读取入口文件
const jsDir = fs.readdirSync('./public/js'), entryFiles = {};
jsDir.forEach((file) => {
    const fileList = file.split('.');
    entryFiles[fileList[0]] = __dirname + '/js/static/' + file;
});

module.exports = {
    // devtool: "source-map", // 便于调试
    entry: "public/js/static/chinaRealDataList", //countyRealtimeOne  chinaRealDataList
    output: {
        publicPath: "public/build/",
        path: path.join(__dirname, "build"),
        filename: "chinaRealDataList.js"
    },
    module: {
        preLoaders: [

        ],
        loaders: [
            //{
            //    test: /\.less$/,
            //    loader: ExtractTextPlugin.extract('style-loader',  "css-loader!less-loader")
            //},
            // {test: /\.less$/,loader: "style-loader!css-loader!autoprefixer-loader!less-loader?sourceMap"},
            // {test: /\.css$/,loader: "style-loader!css-loader!autoprefixer-loader"},
            // {test: /\.(eot|woff|svg|ttf|woff2|gif)(\?|$)/, loader: 'file-loader?name=[hash].[ext]'},
            // {test: /\.(png|jpg)$/, loader: 'url?limit=8192&name=[hash].[ext]'},
            {test: /\.js?$/,exclude: /node_modules/, loader: "babel?presets[]=react,presets[]=es2015"}
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
           compress: {
               warnings: false
           }
        }), // 压缩
        // new webpack.optimize.CommonsChunkPlugin('common.js'),//提取多个页面之间的公共模块
        new webpack.BannerPlugin('项目打包，2016-07-19 zhouxinjian'),// 头部注释
        //new ExtractTextPlugin("[name].css"),
        
        //全局引入，避免每个页面重复书写
        new webpack.ProvidePlugin({
            $: 'jquery'
        })

    ],
    resolve: {
        //查找module路径
        root: path.resolve(__dirname),
        //后缀名自动补全，即require模块可以省略不写后缀名
        extensions: ['', '.js', '.jsx', '.less'],
        // 模块别名定义，方便后续直接引用别名
        alias: {
            'jquery': "public/js/plus/jquery-2.0.3.js",
            'echarts-all': "public/js/dist/echarts-all.js",
            'common': "public/js/static/common.js",
            'echarts-line': "public/js/static/echarts.line.exports.js",
            'echarts-map': "public/js/static/echarts.map.exports.js",
            'ajax-plus': "public/js/static/getViewData.js"
        }
    }
};
