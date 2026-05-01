// 常用城市经纬度（用于真太阳时校正与占星地理坐标）
export const CITIES = [
  // 直辖市
  { name: '北京', lng: 116.41, lat: 39.90, tz: 8 },
  { name: '上海', lng: 121.47, lat: 31.23, tz: 8 },
  { name: '天津', lng: 117.20, lat: 39.13, tz: 8 },
  { name: '重庆', lng: 106.55, lat: 29.56, tz: 8 },

  // 广东
  { name: '广州', lng: 113.27, lat: 23.13, tz: 8 },
  { name: '深圳', lng: 114.05, lat: 22.55, tz: 8 },
  { name: '惠州', lng: 114.41, lat: 23.11, tz: 8 },
  { name: '东莞', lng: 113.75, lat: 23.04, tz: 8 },
  { name: '佛山', lng: 113.12, lat: 23.02, tz: 8 },
  { name: '珠海', lng: 113.58, lat: 22.27, tz: 8 },
  { name: '汕头', lng: 116.68, lat: 23.35, tz: 8 },
  { name: '中山', lng: 113.39, lat: 22.52, tz: 8 },
  { name: '湛江', lng: 110.36, lat: 21.27, tz: 8 },

  // 长三角
  { name: '杭州', lng: 120.16, lat: 30.29, tz: 8 },
  { name: '宁波', lng: 121.62, lat: 29.86, tz: 8 },
  { name: '温州', lng: 120.66, lat: 28.00, tz: 8 },
  { name: '苏州', lng: 120.62, lat: 31.32, tz: 8 },
  { name: '无锡', lng: 120.30, lat: 31.57, tz: 8 },
  { name: '南京', lng: 118.78, lat: 32.06, tz: 8 },
  { name: '合肥', lng: 117.27, lat: 31.86, tz: 8 },

  // 西南
  { name: '成都', lng: 104.07, lat: 30.65, tz: 8 },
  { name: '昆明', lng: 102.71, lat: 25.04, tz: 8 },
  { name: '贵阳', lng: 106.71, lat: 26.65, tz: 8 },

  // 西北
  { name: '西安', lng: 108.94, lat: 34.34, tz: 8 },
  { name: '兰州', lng: 103.83, lat: 36.07, tz: 8 },
  { name: '银川', lng: 106.27, lat: 38.47, tz: 8 },
  { name: '西宁', lng: 101.78, lat: 36.62, tz: 8 },
  { name: '乌鲁木齐', lng: 87.62, lat: 43.83, tz: 8 },

  // 华中
  { name: '武汉', lng: 114.30, lat: 30.59, tz: 8 },
  { name: '长沙', lng: 112.94, lat: 28.23, tz: 8 },
  { name: '郑州', lng: 113.62, lat: 34.75, tz: 8 },
  { name: '南昌', lng: 115.89, lat: 28.68, tz: 8 },

  // 华北
  { name: '太原', lng: 112.55, lat: 37.87, tz: 8 },
  { name: '石家庄', lng: 114.51, lat: 38.04, tz: 8 },
  { name: '济南', lng: 117.00, lat: 36.65, tz: 8 },
  { name: '青岛', lng: 120.38, lat: 36.07, tz: 8 },
  { name: '呼和浩特', lng: 111.65, lat: 40.83, tz: 8 },

  // 东北
  { name: '沈阳', lng: 123.43, lat: 41.80, tz: 8 },
  { name: '大连', lng: 121.62, lat: 38.92, tz: 8 },
  { name: '长春', lng: 125.32, lat: 43.82, tz: 8 },
  { name: '哈尔滨', lng: 126.53, lat: 45.80, tz: 8 },

  // 华南
  { name: '南宁', lng: 108.37, lat: 22.82, tz: 8 },
  { name: '海口', lng: 110.32, lat: 20.03, tz: 8 },
  { name: '三亚', lng: 109.51, lat: 18.25, tz: 8 },
  { name: '厦门', lng: 118.09, lat: 24.48, tz: 8 },
  { name: '福州', lng: 119.30, lat: 26.08, tz: 8 },

  // 港澳台 & 西藏
  { name: '香港', lng: 114.17, lat: 22.30, tz: 8 },
  { name: '澳门', lng: 113.55, lat: 22.20, tz: 8 },
  { name: '台北', lng: 121.50, lat: 25.03, tz: 8 },
  { name: '拉萨', lng: 91.13, lat: 29.65, tz: 8 },

  // 海外（部分）
  { name: '东京', lng: 139.69, lat: 35.69, tz: 9 },
  { name: '首尔', lng: 126.98, lat: 37.57, tz: 9 },
  { name: '新加坡', lng: 103.82, lat: 1.35, tz: 8 },
  { name: '曼谷', lng: 100.50, lat: 13.76, tz: 7 },
  { name: '伦敦', lng: -0.13, lat: 51.51, tz: 0 },
  { name: '巴黎', lng: 2.35, lat: 48.86, tz: 1 },
  { name: '柏林', lng: 13.40, lat: 52.52, tz: 1 },
  { name: '纽约', lng: -74.00, lat: 40.71, tz: -5 },
  { name: '洛杉矶', lng: -118.24, lat: 34.05, tz: -8 },
  { name: '旧金山', lng: -122.42, lat: 37.77, tz: -8 },
  { name: '悉尼', lng: 151.21, lat: -33.87, tz: 10 },
  { name: '墨尔本', lng: 144.96, lat: -37.81, tz: 10 },
];

export const findCity = (name) => CITIES.find((c) => c.name === name) || CITIES.find((c) => c.name.includes(name));
