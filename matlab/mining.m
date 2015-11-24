process = waitbar(0,'开始挖掘...');
file_list = dir(fullfile('Data/all/*.txt'));
file_length = length(file_list);
basepath = 'Data/all/'; %数据文件所在目录
ref_date = '2015-11-20'; %参考日期,用于比较股票最近数据的日期以便判断该股是否停牌,使用时设为最近一个交易日日期
suspension_stock = []; %已停牌的股票
WANTED = [];%用KDJ选出的股票
for i = drange(1:file_length)
    filename = file_list(i).name;
    filepath = strcat(basepath,filename);
    S = importdata(filepath);
    last_date = S.textdata(end,1); %最后一行数据的日期
    if strcmp(last_date,ref_date)
        s_close = S.data(:,3);
        s_low = S.data(:,4);
        s_high = S.data(:,2);
        s_kdj = KDJ(9,s_close,s_low,s_high);
        k = s_kdj(end,1);
        d = s_kdj(end,2);
        j = s_kdj(end,3);
        if (j>=k && k>=d && j<30)
            WANTED = [WANTED;filename];
        end
    else
        suspension_stock = [suspension_stock;filename];
    end
    waitbar(i/file_length,process,'正在挖掘...');
end
close(process);
    
    