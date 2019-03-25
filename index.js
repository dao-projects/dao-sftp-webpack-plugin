var fs = require('fs');
var path = require('path');
var client = require('scp2')
var waterfall = require('async-waterfall');
const pluginName = "daoSftpWebpackPlugin"
const defaultConfig = {
    port: '',
    host: '',
    username: '',
    password: '',
    from: '',
    to: ''
}
class daoSftpWebpackPlugin {
    constructor(config) {
        const cfg = Object.assign(defaultConfig, config || {});
        this.config = cfg;
        this.info = {
            host: cfg['host'],
            username: cfg['username'],
            password: cfg['password'],
            path: cfg['to'],
            port: cfg['port']
        }
        client.defaults(this.info);
    }
    apply(compiler) {
        // https://webpack.js.org/api/compiler-hooks
        compiler.hooks.done.tap(pluginName, (compilation) => {
            const _ = this;
            const { from, to } = _.config;
            // console.log("config=>", _.config)
            // console.log("编译完成后执行...")
            // ==============================================================================
            var queue = []
            if (from && Array.isArray(from)) {
                from.forEach(function(f) {
                    putQueue(f, to, queue, client);
                })
            } else {
                putQueue(from, to, queue, client);
            }
            queue.push(
                function(callback) {
                    client.close()
                    callback()
                }
            )
            //异步加载
            waterfall(queue, function(err, result) {
                if (err) {
                    console.info(err)
                } else {
                    if (from && Array.isArray(from)) {
                        from.forEach(function(f) {
                            console.info("Files ( " + f + " ) uploaded !")
                        })
                    } else {
                        console.info("Files ( " + from + " ) uploaded !")
                    }
                }
            })

            function putQueue(from, to, queue, client) {
                var stats = fs.statSync(from)
                if (stats.isDirectory()) {
                    console.log("当前上传类型是目录....")
                    queue.push(
                        function(callback) {
                            client.scp(from, _.info, function(err) {
                                callback()
                            })
                        })
                } else {
                    console.log("当前上传类型是文件....")
                    queue.push(
                        function(callback) {
                            var arr = from && from.split('/');
                            var pathTo = (arr && arr.length) ? (to + '/' + arr[arr.length - 1]) : to;
                            client.upload(from, pathTo, function(err) {
                                callback()
                            })
                        }
                    )
                }
            }
            // ============================================================================== end
        });
    }
}
module.exports = daoSftpWebpackPlugin;