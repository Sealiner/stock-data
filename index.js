var cheerio = require('cheerio');
var superagent = require('superagent');
var fs = require('fs');
var async = require('async');

var baseUrl = 'http://biz.finance.sina.com.cn';//新浪财经接口域名
var tasks = {};

codes = [[600000,602000],[603000,604000],[0,1000],[2000,3000],[300000,300500]];//股票代码范围
for (var c = 0; c < codes.length; c++) {
  for (var i = codes[c][0]; i < codes[c][1]; i++) {
    (function (k) {
      //对股票代码做处理，使其满足新浪财经接口的字段参数格式
      var k_str = k.toString();
      if (k_str.length < 6) {
        var zeros = "";
        for (var m = 0; m < 6 - k_str.length; m++) {
          zeros += "0";
        }
        k_str = zeros + k_str;
      }

      var market = "sh";
      if (k_str.substring(0,1) == "6") {
        market = "sh";
      } else {
        market = "sz";
      }
      //将要并发执行的任务
      tasks[market+k_str] = function (callback) {
        fetch(market+k_str, callback);
      }
    })(i);
  }
}

//任务函数
function fetch (symbol, callback) {
    var targetUrl = baseUrl + '/stock/flash_hq/kline_data.php?symbol='+symbol+'&begin_date=20130101';//获取股票数据的url

    superagent.get(targetUrl)
    .end(function (err, sres) {
      if (sres) {
      var $ = cheerio.load(sres.text);
      var contents = $('control').find('content');

      if (contents.length > 0) {
        var space = ' ';
        var changeLine = '\r\n';
        var chunks = [];
        var length = 0;

        var title = 'Date Open High Close Low Volume\r\n';
        var buffer_title = new Buffer(title);
        chunks.push(buffer_title);
        length+=buffer_title.length;
        //
        for(var i=0; i<contents.length; i++){
          var dataUnit = {
            data: contents.eq(i).attr('d'),
            open: contents.eq(i).attr('o'),
            high: contents.eq(i).attr('h'),
            close: contents.eq(i).attr('c'),
            low: contents.eq(i).attr('l'),
            volume: contents.eq(i).attr('v')
          }
          var value=dataUnit.data+space+dataUnit.open+space+dataUnit.high+space+dataUnit.close+space+dataUnit.low+space+dataUnit.volume+changeLine;  
          var buffer=new Buffer(value);  
          chunks.push(buffer);  
          length+=buffer.length; 
        }
        //
        var resultBuffer=new Buffer(length);  
        for(var i=0,size=chunks.length,pos=0;i<size;i++){  
          chunks[i].copy(resultBuffer,pos);  
          pos+=chunks[i].length;  
        }
        //将数据写入文件，放入当前目录下的Data文件夹中
        var filePath = 'Data/'+symbol+'.txt';
        fs.writeFile(filePath,resultBuffer,function(err){  
          if(err) throw err;  
          console.log(symbol + ' write Success');  
          callback(null,null);
        }); 
      } else { //该代码对应的股票不存在，数据为空
        console.log(symbol + ' no Data');
        callback(null,null);
      }
    } else {//对没有返回正确格式的文档做容错处理
      console.log(symbol + ' no sres...');
      callback(null,null);
    }

    });
}

//并发抓取数据，控制下并发数，这里设为10
async.parallelLimit(tasks, 10, function(err, result){
  if(err){
    cosnole.log(err);
  }
  console.log("All files are writen~");
});