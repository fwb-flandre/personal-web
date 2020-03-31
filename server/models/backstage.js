var mysql = require('mysql');
var database = require('./backstage.config');  //引入数据库配置模块中的数据

//向外暴露方法
module.exports = {
    // sql 为 mysql 语句，params 为 mysql 数据，若没有用 [] 表示
    // callback 填 function(result,fields){ 操作的命令 }
    query : function(sql,params,callback){
        //创建链接
        var connection = mysql.createConnection(database);        
        connection.connect(function(err){
            if(err){
                console.log('数据库链接失败');
                throw err;
            }
            //开始数据操作
            connection.query( sql, params, function(err,results,fields ){
            if(err){
                    console.log('数据操作失败');
                    throw err;
                }
                //如果 callback 存在，则回调
                callback && callback(results, fields);
                //results作为数据操作后的结果，fields作为数据库连接的一些字段
                //停止链接数据库
                connection.end(function(err){
                    if(err){
                        console.log('关闭数据库连接失败！');
                        throw err;
                    }
                });
            });
        });
    }
};