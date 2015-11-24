#stock-data
nodejs写的获取沪深股票数据的程序。附含一个配套的对获取数据进行KDJ低位金叉搜索的matlab程序^_^

#说明
1. 执行npm install安装依赖，国内网络可使用淘宝镜像[npm install --registry=https://registry.npm.taobao.org]
2. 获取的所有数据将以txt文件格式存入Data目录下
3. matlab目录下的两个.m文件用于在所有获取到的股票中选出KDJ低位金叉的股票。使用时将这两个文件放在同一个目录下，然后运行mining即可