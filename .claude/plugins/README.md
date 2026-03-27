# Plugins 配置

> 本目录包含 Claude Code 的插件配置，用于扩展自动化能力。

## 目录结构

```
plugins/
├── README.md           # 本文件
├── cli-anything/       # CLI 增强插件
├── custom-commands/    # 自定义命令
└── integrations/       # 第三方集成
```

## CLI-Anything 插件

CLI-Anything 是 Claude Code 的核心插件之一，允许通过自然语言执行任意命令行操作。

### 功能特性

- 自然语言转 Shell 命令
- 命令历史学习和适应
- 参数自动补全
- 命令解释和验证

### 安装

```bash
npm install -g @anthropic/cli-anything
```

### 配置

```json
{
  "plugins": {
    "cli-anything": {
      "enabled": true,
      "autoConfirm": false,
      "learnFromHistory": true,
      "maxHistorySize": 1000,
      "safetyLevel": "medium"
    }
  }
}
```

### 使用示例

| 描述 | 自然语言命令 |
|------|-------------|
| 查找文件 | "找到所有大于 100MB 的日志文件" |
| 批量重命名 | "把所有 .txt 文件重命名为 .md" |
| 代码搜索 | "搜索所有包含 'TODO' 的文件" |
| Git 操作 | "查看最近一周的提交统计" |

### 安全级别

| 级别 | 说明 | 行为 |
|------|------|------|
| high | 最严格 | 所有命令需确认 |
| medium | 中等 | 危险命令需确认 |
| low | 宽松 | 仅高风险命令需确认 |
| none | 无限制 | 不推荐 |

### 危险命令拦截

CLI-Anything 内置以下危险命令拦截:

- `rm -rf /` - 根目录删除
- `dd` - 直接磁盘写入
- `mkfs` - 格式化操作
- Fork bombs - 无限循环fork

## 自定义命令插件

提供项目特定的自定义命令集合。

### 目录结构

```
custom-commands/
├── commands.json       # 命令定义
└── scripts/            # 命令脚本
```

### commands.json 示例

```json
{
  "commands": [
    {
      "name": "deploy-staging",
      "description": "部署到预发环境",
      "command": "npm run deploy -- --env staging",
      "confirm": true
    },
    {
      "name": "db-migrate",
      "description": "运行数据库迁移",
      "command": "npm run db:migrate",
      "confirm": true
    },
    {
      "name": "test-all",
      "description": "运行所有测试",
      "command": "npm run test:all",
      "confirm": false
    }
  ]
}
```

### 使用方法

```bash
# 执行自定义命令
/claude run deploy-staging

# 查看可用命令
/claude commands list
```

## 第三方集成

### GitHub Integration

```json
{
  "plugins": {
    "github": {
      "enabled": true,
      "repo": "owner/repo",
      "autoCreatePR": true,
      "autoMerge": false,
      "labels": ["claude", "automated"]
    }
  }
}
```

### Slack Integration

```json
{
  "plugins": {
    "slack": {
      "enabled": false,
      "webhookUrl": "${SLACK_WEBHOOK_URL}",
      "notifyOn": ["deploy", "test-fail", "build-fail"],
      "channel": "#devops"
    }
  }
}
```

### Jira Integration

```json
{
  "plugins": {
    "jira": {
      "enabled": false,
      "site": "your-company.atlassian.net",
      "project": "PROJECT",
      "autoTransition": true
    }
  }
}
```

## 插件开发

### 创建自定义插件

```javascript
// plugins/my-plugin/index.js
module.exports = {
  name: 'my-plugin',
  version: '1.0.0',

  // PreToolUse Hook
  preToolUse: async (tool, args, context) => {
    // 工具执行前的逻辑
    return { continue: true };
  },

  // PostToolUse Hook
  postToolUse: async (tool, args, result, context) => {
    // 工具执行后的逻辑
    return { continue: true };
  },

  // 自定义命令
  commands: {
    'my-command': {
      description: '我的自定义命令',
      handler: async (args, context) => {
        // 命令逻辑
        return { success: true };
      }
    }
  }
};
```

### 插件配置

```json
{
  "plugins": {
    "my-plugin": {
      "enabled": true,
      "config": {
        "option1": "value1",
        "option2": "value2"
      }
    }
  }
}
```

## 配置文件

插件配置位于 `.claude/settings.json`:

```json
{
  "plugins": {
    "enabled": true,
    "cli-anything": {
      "enabled": true,
      "autoConfirm": false
    },
    "custom-commands": {
      "enabled": true,
      "path": ".claude/plugins/custom-commands"
    },
    "github": {
      "enabled": true
    }
  }
}
```

## 环境变量

插件可能需要以下环境变量:

| 变量 | 说明 | 必需 |
|------|------|------|
| `SLACK_WEBHOOK_URL` | Slack Webhook URL | Slack 插件 |
| `GITHUB_TOKEN` | GitHub Personal Access Token | GitHub 插件 |
| `JIRA_API_TOKEN` | Jira API Token | Jira 插件 |

## 故障排除

### 插件不生效

1. 确认 `settings.json` 中插件已启用
2. 检查插件是否正确安装
3. 查看日志: `claude logs --plugin <plugin-name>`

### 命令执行失败

1. 检查命令定义语法
2. 确认脚本路径正确
3. 验证环境变量已设置

### 调试模式

```bash
# 启用插件调试
claude plugins debug --verbose

# 测试单个插件
claude plugins test <plugin-name>
```

## 更新插件

```bash
# 更新所有插件
claude plugins update

# 更新单个插件
claude plugins update cli-anything
```

## 最佳实践

1. **安全优先** - 生产环境使用高安全级别
2. **权限最小化** - 仅授予必要的权限
3. **日志审计** - 记录所有敏感操作
4. **定期更新** - 保持插件版本最新
5. **测试验证** - 重大变更前在测试环境验证
