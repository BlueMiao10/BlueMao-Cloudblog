export function friendlyDate(dateStr) {
  let dateObj = typeof dateStr === 'object' ? dateStr : new Date(dateStr)
  let time = dateObj.getTime()
  let now = Date.now()
  let timeSpace = now - time
  let str

  switch (true) {
    case timeSpace < 1000 * 60:
      str = '刚刚'
      break
    case timeSpace < 1000 * 3600:
      str = Math.floor(timeSpace / 60000) + '分钟前'
      break
    case timeSpace < 1000 * 3600 * 24:
      str = Math.floor(timeSpace / (1000 * 3600)) + '小时前'
      break
    default:
      str = Math.floor(timeSpace / (1000 * 3600 * 24)) + '天前'
  }
  return str
}
