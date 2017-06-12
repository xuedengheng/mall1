/**
 * Created by Ben on 2017/3/11.
 */
export const api = {
    
    //平台运费处理
    handleFreightFree(price) {
        let freightFree = parseFloat(price);
        if (parseFloat(price) > 0) {
            return freightFree.toFixed(2);
        }
        return 0
    },
    //切割字符串
    splitString(str) {
        let strs = [];
        strs = str.split(",");
        return strs
    },
    clearData(data) {
        data.splice(0, data.length)
    },
    routerRun(target, id, router) {
        switch (target) {
            case "template":
                router.push({
                    pathname: '/home/template/' + id
                });
                break;
            case "product_detail":
                router.push({
                    pathname: '/product/' + id
                });
                break;
            case "URL":
                window.location.href = id;
                break;
            default:
                break;
        }
    },

}

export const isObjectEqual = (obj1, obj2) => {
    if (obj1 === obj2) {
        return true;
    }    // 它们包含的键名是否一致？
    const item1Keys = Object.keys(obj1).sort();
    const item2Keys = Object.keys(obj2).sort();
    if (!isArrayEqual(item1Keys, item2Keys)) {
        return false;
    }    // 属性所对应的每一个对象是否具有相同的引用？
    return item2Keys.every(key => {
        const value = obj1[key];
        const nextValue = obj2[key];
        if (value === nextValue) {
            return true;
        }        // 数组例外，再检查一个层级的深度
        return Array.isArray(value) &&
            Array.isArray(nextValue) &&
            isArrayEqual(value, nextValue);
    });
};
const isArrayEqual = (array1 = [], array2 = []) => {
    if (array1 === array2) {
        return true;
    }    // 检查一个层级深度
    return array1.length === array2.length &&
        array1.every((item, index) => item === array2[index]);
};