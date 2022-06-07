# storage
// 设置密钥，值，时间（秒级）
storage('str', 'fileurl', 60000);
//获取值
var str = storage('str');
//删除值
storage('str', null);
//清空
storage(null);
//设置密钥,对象
var obj = { a: 1, b: 2 };
storage('strobj', obj);
//获取对象
storage('strobj');
//删除对象(其中一个健)
storage('strobj.a', null);
