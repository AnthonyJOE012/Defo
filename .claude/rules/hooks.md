# Hooks 规范

> 本文件定义了项目的自动化 Hooks 系统，用于在工具执行前后自动执行格式化、安全检查等操作。

## 概述

Hooks 系统基于 Claude Code 的 PreToolUse 和 PostToolUse 事件，提供自动化代码质量保障。

## PreToolUse Hooks

PreToolUse Hooks 在工具执行前触发，用于验证和预处理。

### 1. 格式化 Hook

**触发时机**: 任何文件写入操作前 (Write, Edit)

**功能**:
- 自动格式化代码文件
- 确保统一的代码风格
- 验证文件路径有效性

**实现**:

```javascript
// hooks/format-on-write.js
module.exports = {
  pattern: /^(write|edit)$/,
  handler: async (tool, args, context) => {
    const filePath = args.file_path || args[0];

    // 根据文件类型应用格式化
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      await runPrettier(filePath);
    } else if (filePath.endsWith('.py')) {
      await runBlack(filePath);
    }

    return { continue: true };
  }
};
```

### 2. 安全检查 Hook

**触发时机**: 所有文件操作前

**功能**:
- 扫描硬编码的敏感信息
- 检查潜在的安全漏洞
- 验证依赖项安全性

**实现**:

```javascript
// hooks/security-check.js
module.exports = {
  pattern: /^(write|edit|bash)$/,
  handler: async (tool, args, context) => {
    // 检查敏感信息模式
    const sensitivePatterns = [
      /api[_-]?key/i,
      /password/i,
      /secret/i,
      /token/i,
      /aws[_-]?access[_-]?key/i,
      /private[_-]?key/i
    ];

    const content = args.content || args.old_string || '';

    for (const pattern of sensitivePatterns) {
      if (pattern.test(content)) {
        return {
          continue: false,
          error: `Security: Potential sensitive data detected (${pattern}). Use environment variables instead.`
        };
      }
    }

    return { continue: true };
  }
};
```

### 3. 输入验证 Hook

**触发时机**: Bash 命令执行前

**功能**:
- 验证命令参数
- 防止命令注入
- 白名单命令检查

**实现**:

```javascript
// hooks/input-validation.js
module.exports = {
  pattern: /^bash$/,
  handler: async (tool, args, context) => {
    const command = args.command;

    // 检查危险命令
    const dangerousPatterns = [
      /^rm\s+-rf\s+\/(.*)$/,
      /^dd\s+if=/,
      /^mkfs/,
      /^:(){:|:&};:/  // Fork bomb
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(command)) {
        return {
          continue: false,
          error: `Security: Dangerous command blocked: ${command.substring(0, 50)}...`
        };
      }
    }

    // 白名单检查 (可选)
    const allowedCommands = ['git', 'npm', 'npx', 'pnpm', 'yarn', 'node', 'python', 'pip'];

    return { continue: true };
  }
};
```

## PostToolUse Hooks

PostToolUse Hooks 在工具执行后触发，用于验证和后处理。

### 1. 构建检查 Hook

**触发时机**: Bash 命令执行后

**功能**:
- 检查构建输出
- 验证 TypeScript/ESLint 错误
- 确认测试结果

**实现**:

```javascript
// hooks/build-check.js
module.exports = {
  pattern: /^bash$/,
  handler: async (tool, args, result, context) => {
    const command = args.command;

    // 仅检查构建相关命令
    if (!['build', 'compile', 'tsc', 'eslint', 'prettier'].some(cmd => command.includes(cmd))) {
      return { continue: true };
    }

    const output = result.stdout + result.stderr;

    // 检查错误模式
    const errorPatterns = [
      /error TS\d+:/i,
      /error.*cannot find module/i,
      /ESLint.*error/i,
      /SyntaxError:/i
    ];

    for (const pattern of errorPatterns) {
      if (pattern.test(output)) {
        return {
          continue: true,
          warning: `Build check: Potential errors detected. Review output above.`
        };
      }
    }

    return { continue: true };
  }
};
```

### 2. 文件变更追踪 Hook

**触发时机**: Write, Edit 操作后

**功能**:
- 记录文件变更
- 更新相关依赖
- 触发必要的重新构建

**实现**:

```javascript
// hooks/file-tracker.js
module.exports = {
  pattern: /^(write|edit)$/,
  handler: async (tool, args, result, context) => {
    const filePath = args.file_path || args[0];

    // 记录到变更日志
    await appendToChangeLog(filePath, {
      tool,
      timestamp: new Date().toISOString(),
      user: context.user
    });

    // 检查是否是配置文件
    if (filePath.includes('package.json')) {
      console.log('Package.json changed. Consider running: npm install');
    }

    return { continue: true };
  }
};
```

### 3. 测试结果汇总 Hook

**触发时机**: 测试命令执行后

**功能**:
- 解析测试输出
- 生成测试报告
- 失败时提供调试建议

**实现**:

```javascript
// hooks/test-reporter.js
module.exports = {
  pattern: /^bash$/,
  handler: async (tool, args, result, context) => {
    const command = args.command;

    // 仅处理测试命令
    if (!['jest', 'vitest', 'pytest', 'test', 'mocha', 'playwright'].some(cmd => command.includes(cmd))) {
      return { continue: true };
    }

    const output = result.stdout + result.stderr;

    // 解析测试结果
    const testSummary = parseTestOutput(output);

    if (testSummary.failed > 0) {
      return {
        continue: true,
        warning: `Tests: ${testSummary.failed} failed, ${testSummary.passed} passed.`
      };
    }

    return { continue: true };
  }
};
```

## 事件触发机制

### 触发流程图

```
User Action
    │
    ▼
PreToolUse Hooks Chain
    │
    ├── Security Check
    ├── Format Check
    ├── Input Validation
    │
    ▼
Tool Execution
    │
    ▼
PostToolUse Hooks Chain
    │
    ├── Build Check
    ├── File Tracker
    ├── Test Reporter
    │
    ▼
Result Return
```

### 优先级配置

| Hook | 优先级 | 说明 |
|------|--------|------|
| Security Check | 1 (最高) | 优先执行安全检查 |
| Input Validation | 2 | 验证输入参数 |
| Format Check | 3 | 格式化代码 |
| Build Check | 4 | 检查构建结果 |
| File Tracker | 5 | 追踪文件变更 |
| Test Reporter | 6 (最低) | 汇总测试结果 |

### 配置文件结构

```javascript
// hooks.config.js
module.exports = {
  enabled: true,
  hooks: [
    {
      name: 'security-check',
      pattern: /^(write|edit|bash)$/,
      handler: require('./security-check'),
      priority: 1,
      enabled: true
    },
    {
      name: 'format-on-write',
      pattern: /^(write|edit)$/,
      handler: require('./format-on-write'),
      priority: 3,
      enabled: true
    },
    {
      name: 'input-validation',
      pattern: /^bash$/,
      handler: require('./input-validation'),
      priority: 2,
      enabled: true
    },
    {
      name: 'build-check',
      pattern: /^bash$/,
      handler: require('./build-check'),
      priority: 4,
      enabled: true
    },
    {
      name: 'file-tracker',
      pattern: /^(write|edit)$/,
      handler: require('./file-tracker'),
      priority: 5,
      enabled: true
    },
    {
      name: 'test-reporter',
      pattern: /^bash$/,
      handler: require('./test-reporter'),
      priority: 6,
      enabled: true
    }
  ]
};
```

## 安装与配置

### 1. 启用 Hooks

在 `settings.json` 中配置:

```json
{
  "hooks": {
    "enabled": true,
    "configPath": ".claude/hooks/hooks.config.js"
  }
}
```

### 2. 安装依赖

```bash
npm install -D prettier eslint
```

### 3. 初始化配置

```bash
claude hooks init
```

## 最佳实践

1. **保持 Hooks 轻量** - 避免在 Hook 中执行耗时操作
2. **错误处理** - Hook 失败时提供清晰的错误信息
3. **可配置性** - 支持通过配置启用/禁用特定 Hook
4. **日志记录** - 记录 Hook 执行情况便于调试
5. **性能监控** - 监控 Hook 执行时间，避免阻塞

## 调试

### 查看 Hook 执行日志

```bash
claude hooks debug --verbose
```

### 测试单个 Hook

```bash
claude hooks test security-check
```

### 禁用所有 Hooks

```bash
claude hooks disable
```

或临时禁用:

```bash
claude hooks disable --temp
```
