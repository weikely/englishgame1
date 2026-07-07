export interface VersionInfo {
  version: string;
  date: string;
  changes: string[];
}

export const currentVersion = '1.3.0';

export const versionHistory: VersionInfo[] = [
  {
    version: '1.3.0',
    date: '2026-07-07',
    changes: [
      '修复连连看点击正确但匹配不上的问题',
      '英文单词卡片不再显示中文',
      '优化朗读速度和顺序',
      '配置 GitHub Pages 自动部署',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-07-07',
    changes: [
      '登录只需要用户名，无需密码',
      '排行榜改为所有用户可见',
      '修复连连看语句弹窗跳动问题',
      '连连看图片配上中文显示',
      '增大英文字体方便阅读',
      '连续两次选择错误显示中文意思',
      '取消答题时的倒计时',
      '每次版本更新用户数据自动保留',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-07-07',
    changes: [
      '修复高分奖杯进度始终显示为0的问题',
      '删除未使用的空组件Home.tsx',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-07-07',
    changes: ['初始版本发布', '单词连连看游戏', '成就系统', '积分商城', '排行榜'],
  },
];