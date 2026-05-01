# NATAL.OS · Genesis Protocol

> 多体系命理交叉解码协议 — 用现代极简电影感包装的传统命理工具。

把出生那一刻的"宇宙参数"，从 5 个独立体系交叉解码：

- 🪵 **生辰八字**：四柱、五行、十神、神煞、调候用神、大运时间线
- 🌌 **西方占星本命盘**：太阳/月亮/上升、十大行星、12 宫位、相位网络（Swiss Ephemeris 级精度）
- 🔢 **数字命理**：生命路径数、表达数、灵魂数、大师数识别（毕达哥拉斯）
- 📛 **姓名学**：康熙笔画、五格三才、81 数理吉凶
- 🌅 **玛雅 Kin**：卓尔金历 260 天循环
- 🎴 **多体系交叉综述**：把所有信号叠加，看你这个人本质上在玩什么牌

---

## 设计哲学

**算命是民间话术，命理是认知工具。**

这个项目把所有体系当作"概率分布"而非"命定剧本"——
- 计算层是硬的（公式化，可重复验证）
- 解读层是软的（叙事，作为参考）
- 永远把决策权还给当事人

视觉与叙事语言致敬 [SHULIN.OS](https://github.com/yimeic895/shulin)（树成林）的暗黑电影感学术档案风。

---

## 技术栈

| 类目 | 选择 |
|---|---|
| Framework | React 19 + Vite 7 |
| 样式 | TailwindCSS 3 |
| 八字计算 | `lunar-javascript`（含真太阳时校正） |
| 占星天文 | `astronomy-engine`（NASA-grade 星历） |
| 图标 | `lucide-react` |
| 占星圆盘 | 纯 SVG 自绘 |
| 部署 | 纯前端，零后端依赖 |

---

## 本地运行

```bash
npm install
npm run dev      # 开发，默认 http://localhost:5180/
npm run build    # 出包到 dist/
npm run preview  # 预览生产构建
```

---

## 项目结构

```
src/
├── App.jsx                       # 主路由 + 状态机
├── main.jsx
├── index.css                     # 全局样式 + 字体 + 动画
├── lib/                          # 计算层（纯函数）
│   ├── constants.js              # 五行/天干/十神/星座/神煞 常量
│   ├── cities.js                 # 57 城市经纬度（含港澳台 + 海外）
│   ├── solar.js                  # 真太阳时校正
│   ├── bazi.js                   # 八字（含调候+神煞+地支关系）
│   ├── astrology.js              # 西方占星（Swiss Ephemeris 级）
│   ├── numerology.js             # 数字命理 + 玛雅 Kin
│   ├── naming.js                 # 姓名学五格三才
│   └── synthesis.js              # 跨体系综述
└── components/                   # 视觉层
    ├── shared.jsx
    ├── HeroPage.jsx
    ├── InputForm.jsx
    ├── TransitionScreen.jsx
    ├── Result.jsx
    └── result/
        ├── BaziSection.jsx
        ├── AstrologySection.jsx
        ├── NumerologySection.jsx
        ├── NamingSection.jsx
        └── SynthesisSection.jsx
```

---

## 路线图

- [x] V2.0 八字 / 占星 / 数字命理 / 姓名学 / 综合
- [ ] V2.1 塔罗牌阵（互动洗牌）
- [ ] V2.2 人类图（Type / Strategy / Authority / Profile）
- [ ] V2.3 紫微斗数
- [ ] V2.4 流年盘 / 合盘 / PDF 导出
- [ ] V3.0 接入 Claude API 做个性化解读

---

## 免责声明

> 命理只是文化心理工具，不是预测引擎。
> 盘是底牌，怎么打始终是你自己的事。
