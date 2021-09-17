export function targetDateFilter(targetList) {
    let tmp=[]
    for (let item of targetList) {
      let ymd= item.create_time.split("T")[0];
      let time= item.create_time.split("T")[1].slice(0,8);
      item.create_time=ymd+" "+time
      let ymd2= item.update_time.split("T")[0];
      let time2= item.update_time.split("T")[1].slice(0,8);
      item.update_time=ymd2+" "+time2
      tmp.push(item)
    }
    return tmp;
}
export function singleDateFilter(dateString) {
    let ymd= dateString.split("T")[0];
    let time= (dateString.split("T")[1]+" ").slice(0,8);
    return ymd+" "+time
}
export function planStateFilter(state) {
  switch (state) {
    case 0: return '执行中'
    case 1: return '已归档'
    default:  return '无'
  }
}
export function taskStateFilter(state) {
  switch (state) {
    case 0: return '未执行'
    case 1: return '执行中'
    case 2: return '已完成'
    default:  return '无'
  }
}
