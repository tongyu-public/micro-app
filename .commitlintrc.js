module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build', // 构建打包
        'ci', // CI/CD
        'docs', // 文档更新
        'feat', // 新增功能
        'fix', // 问题修复
        'perf', // 性能优化
        'enhance', // 功能增强
        'refactor', // 代码重构
        'revert', // 代码回滚
        'style', // 样式优化
        'test', // 测试相关
        'link', // 接口联调
        'chore', // 其他
      ],
    ],
  },
};
