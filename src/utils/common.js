/**
 * @desc 函数节流
 * @param fn 函数
 * @param delay 延迟执行毫秒数
 */
export function Throttle(fn, delay) {
    let last = 0,
    timer = null;
    return function() {
        let context = this,
        args = arguments,
        now = +new Date();
        if (now - last < delay) {
            clearTimeout(timer)
            timer = setTimeout(function() {
            last = now;
            fn.apply(context, args);
            }, delay)
        } else {
            last = now;
        fn.apply(context, args);
        }
    }
};
/**
 * @desc 格式化日期
 * @param fmt 日期格式:"YYYY-mm-dd HH:MM:SS"
 * @param date date对象
 */
export function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
};

export function getToken() {
    let urlStr1 = location.search; //获取url中"?"符后的字串
    let theRequest = new Object();
    if (urlStr1.indexOf("?") != -1) {
        let urlStr2 = urlStr1.substr(1);
        if (urlStr2.indexOf("&") != -1) {
            let urlArr1 = urlStr2.split("&");
            for (let i = 0; i < urlArr1.length; i++) {
                theRequest[urlArr1[i].split("=")[0]] = urlArr1[i].split("=")[1];
            }
        } else {
            theRequest[urlStr2.split('=')[0]] = urlStr2.split('=')[1];
        }
        if (theRequest.token) {
            window.localStorage.setItem('token','Bearer '+theRequest.token);
        }
    }
};

// 关闭页面
var closePayment = function () {
    console.log('返回上一页面')
    // ios浏览器
    if (browser != undefined && browser.versions.ios && window.webkit != undefined) {
        this.closePayment = function () {
            window.webkit.messageHandlers.jiayuan.postMessage({"body":"jiayuanBack"});
        }
    }
    // android浏览器
    else if (browser.versions.android && window.ghwapp != undefined) {
        this.closePayment = function () {
            window.ghwapp.back();
        }
    }
};

export const closePaymentFun = closePayment;