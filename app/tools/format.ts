/**
 * 格式化更新时间显示
 * @param updateTime 更新时间戳
 * @returns 格式化后的时间字符串
 */
export function formatUpdateTime(updateTime: number | undefined): string {
  if (!updateTime) {
    return '暂无更新时间';
  }

  const now = Date.now();
  const diff = now - updateTime;

  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚更新';
  }

  // 小于1小时，显示分钟
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}分钟前`;
  }

  // 小于24小时，显示小时
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}小时前`;
  }

  // 大于24小时，显示日期
  const date = new Date(updateTime);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}
