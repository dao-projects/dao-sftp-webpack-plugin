# dao-sftp-webpack-plugin

webpack的插件，用于上传文件到指定服务器。  

Installation
------------
Install the plugin with npm:
```shell
$ npm install dao-sftp-webpack-plugin --save-dev
```

Basic Usage
-----------

add the plugin to your webpack config as follows:

```javascript
var daoSftpWebpackPlugin = require('dao-sftp-webpack-plugin')
var webpackConfig = {
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: 'index_bundle.js'
  },
  plugins: [new daoSftpWebpackPlugin({
    port: 'your port',
    host: 'your host',
    username: 'your username',
    password: 'your password',
    from: 'you neeed upload file path ',
    to: 'you want to destination'
  })]
}
```

Configuration
-------------
The plugin allowed values are as follows:

- `port`: 服务器端口。 
- `host`: 服务器地址。
- `username`: 服务器登陆用户名。
- `password`: 服务器登陆密码。
- `from`: 你需要上传的文件路径或者文件，其中对于文件，可以是文件路径的数组。
- `to`: 服务器上的目标路径。