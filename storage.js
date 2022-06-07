function storage(key, value, expires) {
    //清空
    if (key === null) {
        return localStorage.clear();
    }
    //多级判断
    let sub_key = '';
    if (key.indexOf('.')) {
        let keys = key.split('.');
        key = keys[0];
        sub_key = keys[1];
    }
    //值
    let value_type = typeof value;
    if (value_type !== 'undefined') {
        //删除-设置子项为NULL时防删除
        if (value === null && !sub_key) {
            localStorage.removeItem(key);
        } else {
            //设置值
            //有效期，只支持单级
            if (expires) {
                // 记录何时将值存入缓存，秒级
                let data = {
                    value: value,
                    expires: new Date().getTime() + expires * 1000,
                };
                localStorage.setItem(key, JSON.stringify(data));
            } else {
                let data = storage(key);
                let data_type = typeof data;

                //多级value=object
                if (sub_key && value !== null) {
                    let temp_value = {};
                    temp_value[sub_key] = value;
                    value = temp_value;
                    value_type = 'object';
                }
                if (data) {
                    if (data_type === 'object') {
                        //删除子键
                        if (value === null) {
                            delete data[sub_key];
                        } else if (value_type === 'object') {
                            Object.assign(data, value);
                        }
                        value = data;
                    }
                }
                let set_value = JSON.stringify(value);
                localStorage.setItem(key, set_value);
            }
        }
    } else {
        let read_item = localStorage.getItem(key);
        let item;
        // 先将拿到的试着进行json转为对象的形式
        try {
            item = JSON.parse(read_item);
        } catch (error) {
            item = read_item;
        }
        // 如果有expires的值，说明设置了失效时间
        if (item && item.expires) {
            let date = new Date().getTime();
            // 如果大于就是过期了，如果小于或等于就还没过期
            if (date > item.expires) {
                localStorage.removeItem(key);
                return false;
            } else {
                return item.value;
            }
        } else {
            if (sub_key && typeof item === 'object') {
                item = item[sub_key];
                if (typeof item === 'undefined') {
                    item = null;
                }
            }
            return item;
        }
    }
}
