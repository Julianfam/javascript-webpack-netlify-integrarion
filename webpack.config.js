
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { type } = require('os');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname,'dist'),
        filename:'[name].[contenthash].js',
        assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    
    resolve:{
        extensions: ['.js'],
        alias: {
            '@utils': path.resolve(__dirname,'src/utils/'),
            '@templates': path.resolve(__dirname,'src/templates/'),
            '@styles': path.resolve(__dirname,'src/styles/'),
            '@images': path.resolve(__dirname,'src/assets/images/')
        }
    },
    module:  {
        rules: [
        {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        },
        {
            test: /\.css|.styl$/i, // esta logica sirve para que reconozca los archivos css, y luego agregamos los de stylus,
            use: [MiniCssExtractPlugin.loader,
            'css-loader',
            'stylus-loader'],
        },
        {
            test: /\.png/, //estos son los archivos que se van a utilizar.    
            type: 'asset/resource'
        },
        {
            test: /\.(woff|woff2)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: "application/font-woff",
                    name: "[name].[contenthash].[ext]",
                    outputPath: "./assets/fonts/",
                    publicPath:"../assets/fonts/",
                    esModule: false,
                }
            }
        }
    ]
    },
     plugins: [
        new HtmlWebpackPlugin({
           inject: true, //para que haga la insercion de los elementos 
            template:'./public/index.html', //usaremos el template que tenemos 
            filename:'./index.html'
        }),
        new MiniCssExtractPlugin({
            filename:'assets/[name].[contenthash].css'
        }),
        
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"),// acá se especifica que se desea traer lo que esta en esa dirección. 
                    to:"assets/images" //destino donde se desean los archivos 
                }
            ]
        }),
        new Dotenv(),
        new CleanWebpackPlugin(),
     ] ,
     optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
        ]
     }
}