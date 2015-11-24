function f = KDJ(n,C,L,H) %n,nk,nj为KDJ的三个参数，C,L,H分别为需要计算的股票的收盘价、最低价、最高价序列
%初始化KDJ
K = ones(n-1,1)*50;
D = ones(n-1,1)*50;
J = ones(n-1,1)*50;
RSV = ones(n-1,1)*50;
%按数据最小长度计算%
len = min([length(C);length(L);length(H)]);
for i = drange(n:len)
    Ln = min(L(i-n+1:i)); %n日内的最低价
    Hn = max(H(i-n+1:i)); %n日内的最高价
    RSV = [RSV;(C(i)-Ln)/(Hn-Ln)*100];%当日RSV
    K = [K;2/3*K(i-1)+1/3*RSV(i)];
    D = [D;2/3*D(i-1)+1/3*K(i)];
    J = [J;3*K(i)-2*D(i)];
end
% subplot(2,1,1);
% plot(C);
% subplot(2,1,2);
% plot(K,'y');
% hold on;
% plot(D,'m');
% plot(J,'g');
% hold off;
f = [K D J RSV];

