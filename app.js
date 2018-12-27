var xlsx =require('node-xlsx') ;
const path = require('path');
const fs = require('fs');

const config = {
    entry:'./src',
    output:'01.xlsx'
}
var filePath = path.resolve(config.entry);

fileDisplay(filePath);
const data = [];

function fileDisplay(filePath){
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            files.forEach(function(filename){
                var filedir = path.join(filePath, filename);
                fs.stat(filedir,function(eror, stats){
                    if(eror){
                        console.warn('获取文件失败');
                    }else{
                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹

                        if(isFile){
                            let content = fs.readFileSync(filedir, 'utf-8');
                            var zhReg = /[\u4e00-\u9fa5]+/;
                            var dotReg1 = /((?<=')([^']*)(?='))|((?<=")([^"]*)(?="))/g;
                            var dotReg = /('([^']*)')|("([^"]*)")/g;
                            let mes = content.match(dotReg);
                            mes.forEach(item=>{
                                if(zhReg.test(item)){
                                    let zh = item.match(dotReg1);
                                    data.push([zh])
                                }
                            });
                            var buffer = xlsx.build([{name: "mySheetName", data: data}]); // Returns a buffer
                            fs.writeFile(config.output, buffer ,function(err){
                                if(err) console.log('写文件操作失败');
                                else console.log('写文件操作成功');
                            });

                        }
                        if(isDir){
                            fileDisplay(filedir);
                        }
                    }
                })
            });
        }
    });
}





