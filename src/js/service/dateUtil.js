/**
 * Created by Ben on 2017/2/7.
 */
export const dateUtil = {
  turnToZH(date) {
    let result;
    if (date) {
      let dateTemp = new Date(date.replace(/-/g, '/')).getTime();
      let dateHour = new Date(date.replace(/-/g, '/')).getHours();
      let dateMin = new Date(date.replace(/-/g, '/')).getMinutes();
      let dateDay = new Date(date.replace(/-/g, '/')).getDay();
      let dateMonth = new Date(date.replace(/-/g, '/')).getMonth();
      let now = new Date().getTime();
      let day = 24 * 60 * 60 * 1000;
      let diffValue = now - dateTemp;
      let dayC = diffValue / day;
      if (dayC >= 0 && dayC <= 1) {
        result = '今天 ' + (dateHour < 10 ? '0' + dateHour : dateHour) + ':' + (dateMin < 10 ? '0' + dateMin : dateMin);
      } else if (dayC >= 1 && dayC <= 2) {
        result = '昨天 ' + (dateHour < 10 ? '0' + dateHour : dateHour) + ':' + (dateMin < 10 ? '0' + dateMin : dateMin);
      } else if (dayC >= 2 && dayC <= 3) {
        result = '前天 ' + (dateHour < 10 ? '0' + dateHour : dateHour) + ':' + (dateMin < 10 ? '0' + dateMin : dateMin);
      } else {
        result = (dateMonth < 10 ? '0' + dateMonth : dateMonth) + '-' + (dateDay < 10 ? '0' + dateDay : dateDay) + ' ' + (dateHour < 10 ? '0' + dateHour : dateHour) + ':' + (dateMin < 10 ? '0' + dateMin : dateMin);
      }
      return result;
    } else {
      return date;
    }
  },
  turnToYMD(date) {
    let result;
    if (date) {
      let dateTemp = date.split('-');
      result = dateTemp[0] + '年' + dateTemp[1] + '月' + dateTemp[2] + '日';
      return result;
    } else {
      return date;
    }
  },
  getDate(data) {
    let date;
    if (data) {
      date = data.split(' ')[0];
      return date
    } else {
      return data
    }
  },
  getTime(date) {
    let time;
    if (date) {
      time = date.split(' ')[1];
      return time;
    } else {
      return date;
    }
  },
  changePayTime(date){
    let time;
    if (date) {
      time = date.toString().split(' ');
      let year = time[0].substring(0, 4);
      let month = time[0].substring(4, 6);
      let day = time[0].substring(6, 8);
      let hour = time[1].substring(0, 2);
      let min = time[1].substring(2, 4);
      let second = time[1].substring(4, 6);
      return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + second;
    }
  },

  getActivityTime(date, now) {
    let result;
    if (date && now) {
      let dateString = new Date(new Date(date.replace(/-/g, '/')).toDateString()).getTime();
      let nowString = new Date(new Date(now.replace(/-/g, '/')).toDateString()).getTime();
      let dateMin = new Date(date.replace(/-/g, '/')).getMinutes();
      let dateHour = new Date(date.replace(/-/g, '/')).getHours();
      let dateDay = new Date(date.replace(/-/g, '/')).getDate();
      let dateMonth = new Date(date.replace(/-/g, '/')).getMonth() + 1;
      let day = 24 * 60 * 60 * 1000;
      let diffDate = (dateString - nowString) / day;
      if (diffDate === -1) {
        result = `昨日${checkoutTime(dateHour)}:${checkoutTime(dateMin)}`
      } else if (diffDate === 0) {
        result = checkoutTime(dateHour) + ':' + checkoutTime(dateMin)
      } else if (diffDate === 1) {
        result = `明日${checkoutTime(dateHour)}:${checkoutTime(dateMin)}`
      } else if (diffDate > 1) {
        result = `${checkoutTime(dateMonth)}月${checkoutTime(dateDay)}日`
      }
      // else if (dayC < -1) {
      //   result = `${Math.abs(Math.ceil(dayC))}天前`
      // } else if (dayC > 2) {
      //   result = `${Math.abs(Math.ceil(dayC))}天后`
      // }
      return result
    } else {
      return date
    }
  },

  turnToCoupon(date){
    let result;
    if (date) {
      let dateTemp = date.split('-');
      result = dateTemp[0] + '.' + dateTemp[1] + '.' + dateTemp[2];
      return result;
    } else {
      return date;
    }
  },

}

export const checkoutTime = (time) => {
  if (time < 10) {
    return '0' + time
  }
  return time
}