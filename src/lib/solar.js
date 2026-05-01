// 真太阳时校正 + 时间工具

/**
 * 真太阳时校正：按出生地经度修正北京时间
 * @param {number} year @param {number} month @param {number} day
 * @param {number} hour @param {number} minute
 * @param {number} longitude 经度（°E 为正，°W 为负）
 * @param {number} timezone 时区偏移（默认 +8 北京时间）
 */
export function getTrueSolarTime(year, month, day, hour, minute, longitude, timezone = 8) {
  // 时区基准经度
  const tzMeridian = timezone * 15;
  const offsetMin = (longitude - tzMeridian) * 4;
  const date = new Date(year, month - 1, day, hour, minute);
  const corrected = new Date(date.getTime() + offsetMin * 60000);
  return {
    year: corrected.getFullYear(),
    month: corrected.getMonth() + 1,
    day: corrected.getDate(),
    hour: corrected.getHours(),
    minute: corrected.getMinutes(),
    offsetMin,
    raw: corrected,
  };
}

/**
 * 把出生时刻转换为 UTC Date 对象
 */
export function toUTCDate(year, month, day, hour, minute, timezone = 8) {
  const utc = Date.UTC(year, month - 1, day, hour - timezone, minute);
  return new Date(utc);
}

/**
 * 计算两个日期之间的年数
 */
export function yearsBetween(d1, d2) {
  const ms = d2.getTime() - d1.getTime();
  return ms / (1000 * 60 * 60 * 24 * 365.2422);
}
