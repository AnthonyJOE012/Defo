# TDD 快捷命令

> Defo 项目 TDD 开发常用命令参考

---

## 快速开始

### 1. 运行单个测试文件

```bash
# 前端 - Vitest
npm run test -- src/services/__tests__/articles.test.ts

# 前端 - 监听模式 (开发时)
npm run test -- --watch src/services/__tests__/articles.test.ts

# Python - pytest
pytest tests/test_parser.py -v

# Python - 运行特定测试
pytest tests/test_parser.py::TestParser::test_parse_article_html -v
```

### 2. 运行测试覆盖率

```bash
# 前端 - 生成覆盖率报告
npm run test:coverage

# 前端 - 查看 HTML 报告
open frontend/coverage/index.html

# Python - 生成覆盖率报告
pytest --cov=crawlers --cov-report=html --cov-report=term

# Python - 查看 HTML 报告
open htmlcov/index.html

# Python - 只显示未覆盖的行
pytest --cov=crawlers --cov-report=term-missing
```

### 3. 运行特定类型的测试

```bash
# 前端 - 单元测试 (默认)
npm run test

# 前端 - 集成测试
npm run test -- --grep "integration"

# 前端 - E2E 测试
npm run test:e2e

# Python - 单元测试
pytest tests/ -v

# Python - 集成测试 (需要数据库)
pytest tests/ -v -m integration

# Python - 跳过慢速测试
pytest tests/ -v -m "not slow"
```

---

## 测试开发流程

### RED - 编写失败测试

```bash
# 1. 创建测试文件
touch frontend/src/services/__tests__/articles.test.ts
# 或
touch crawlers/tests/test_new_feature.py

# 2. 编写测试后，运行确认失败
npm run test -- src/services/__tests__/articles.test.ts --run
# 或
pytest tests/test_new_feature.py -v

# 预期: 测试应该 FAIL
```

### GREEN - 编写最小实现

```bash
# 3. 实现代码后，运行确认通过
npm run test -- src/services/__tests__/articles.test.ts --run
# 或
pytest tests/test_new_feature.py -v

# 预期: 测试应该 PASS
```

### REFACTOR - 重构并验证

```bash
# 4. 重构后运行完整测试
npm run test -- --run
# 或
pytest tests/ -v

# 5. 检查覆盖率
npm run test:coverage
# 或
pytest --cov=crawlers --cov-report=term

# 覆盖率必须 >= 80%
```

---

## 调试命令

### 前端调试

```bash
# 详细输出模式
npm run test -- --reporter=verbose

# 在第一个失败时停止
npm run test -- --bail

# 查看测试执行时间
npm run test -- --measure-time

# 运行最近失败的测试
npm run test -- --related src/services/__tests__/articles.test.ts
```

### Python 调试

```bash
# 详细输出
pytest -v

# 在第一个失败时停止
pytest -x

# 显示局部变量
pytest -l

# 显示测试执行时间
pytest --durations=10

# 禁用截断输出
pytest --no-header -vv
```

---

## 测试文件生成

### 前端 - 快速创建测试模板

```bash
# 创建组件测试
cat > frontend/src/components/__tests__/MyComponent.test.tsx << 'EOF'
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  const mockProps = {
    title: 'Test Title',
    onClick: vi.fn(),
  };

  it('should render title', () => {
    render(<MyComponent {...mockProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    render(<MyComponent {...mockProps} />);
    screen.getByText('Test Title').click();
    expect(mockProps.onClick).toHaveBeenCalled();
  });
});
EOF
```

### Python - 快速创建测试模板

```bash
# 创建测试文件
cat > crawlers/tests/test_new_feature.py << 'EOF'
import pytest
from crawlers.new_feature import my_function

class TestNewFeature:
    """新功能测试套件"""

    @pytest.fixture
    def sample_input(self):
        return "test data"

    def test_my_function_basic(self, sample_input):
        """基本功能测试"""
        result = my_function(sample_input)
        assert result is not None

    def test_my_function_empty_input(self):
        """空输入测试"""
        result = my_function("")
        assert result == ""

    def test_my_function_invalid_input(self):
        """无效输入测试"""
        with pytest.raises(ValueError):
            my_function(None)
EOF
```

---

## 常用测试命令别名

### 前端完整测试套件

```bash
# 运行所有测试
alias tdd-test='npm run test -- --run'

# 运行测试并查看覆盖率
alias tdd-cover='npm run test:coverage && open frontend/coverage/index.html'

# 运行特定文件的测试
alias tdd-file='npm run test -- --run'

# 运行 E2E 测试
alias tdd-e2e='npm run test:e2e'
```

### Python 完整测试套件

```bash
# 运行所有测试
alias tdd-test='pytest tests/ -v'

# 运行测试并查看覆盖率
alias tdd-cover='pytest --cov=crawlers --cov-report=html --cov-report=term && open htmlcov/index.html'

# 运行特定测试文件
alias tdd-file='pytest tests/test_'

# 显示慢速测试
alias tdd-slow='pytest --durations=10'
```

---

## MSW (Mock Service Worker) 命令

### 前端 API Mock

```bash
# 启动 MSW 服务 (开发)
npm run msw:start

# 生成 MSW handlers
npm run msw:generate

# 更新 mock 数据
open frontend/src/mocks/handlers.ts
```

---

## Supabase 本地测试

```bash
# 启动本地 Supabase
supabase start

# 推送测试数据库
npx supabase db push

# 运行数据库测试
npm run test -- --grep "database"

# 清理测试数据
npx supabase db reset
```

---

## 常见测试命令速查

| 操作 | 前端 | Python |
|------|------|--------|
| 运行所有测试 | `npm run test -- --run` | `pytest tests/ -v` |
| 运行单个文件 | `npm run test -- file.test.ts` | `pytest tests/test_file.py` |
| 监听模式 | `npm run test` | `pytest tests/ -v --pdb` |
| 生成覆盖率 | `npm run test:coverage` | `pytest --cov --cov-report=html` |
| 查看 HTML 报告 | `open coverage/index.html` | `open htmlcov/index.html` |
| 停在首个失败 | `--bail` | `-x` |
| 只跑最近修改 | `--last` | `--lf` |
| 并行执行 | `--parallel` | `-n auto` |
| E2E 测试 | `npm run test:e2e` | N/A |

---

## 测试覆盖率阈值

```
必须达到:
- 行覆盖率 (lines): 80%
- 函数覆盖率 (functions): 80%
- 分支覆盖率 (branches): 80%
- 语句覆盖率 (statements): 80%
```

如果覆盖率低于阈值:
```bash
# 前端 - 会报错退出
npm run test:coverage

# Python - 会报错退出
pytest --cov=crawlers --cov-fail-under=80
```

---

## 文件命名规范

### 测试文件位置

```
# 前端 (Vitest)
frontend/src/
├── components/__tests__/Button.test.tsx
├── hooks/__tests__/useArticles.test.ts
├── services/__tests__/articles.test.ts
└── utils/__tests__/format.test.ts

# Python (pytest)
crawlers/
├── tests/
│   ├── __init__.py
│   ├── test_parser.py
│   ├── test_crawler.py
│   └── conftest.py
└── news/
    └── tests/
        └── test_designboom.py
```

### 命名模式

| 测试类型 | 前端命名 | Python 命名 |
|---------|---------|-------------|
| 单元测试 | `[Name].test.ts[x]` | `test_[name].py` |
| 集成测试 | `[Name].integration.test.ts[x]` | `test_[name]_integration.py` |
| E2E 测试 | `[feature].spec.ts` | N/A |
| Mock 文件 | `[name].mock.ts` | `[name]_mock.py` |
| Fixtures | `conftest.ts` | `conftest.py` |

---

## 相关命令

- `dev.md` - 开发环境命令
- `deploy.md` - 部署命令
