import React from 'react';
import { BookOpen, Download, Terminal, Code, FileText, GitBranch } from 'lucide-react';
import Header from '@/components/Header';

const DocsPage = () => {
  const [activeSection, setActiveSection] = React.useState('getting-started');

  const sections = [
    { id: 'getting-started', title: '开始使用', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'installation', title: '安装', icon: <Download className="h-4 w-4" /> },
    { id: 'cli-tool', title: 'CLI 工具', icon: <Terminal className="h-4 w-4" /> },
    { id: 'publish-skill', title: '发布技能', icon: <Code className="h-4 w-4" /> },
    { id: 'api-reference', title: 'API 参考', icon: <FileText className="h-4 w-4" /> },
    { id: 'best-practices', title: '最佳实践', icon: <GitBranch className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-card rounded-lg border p-4 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">文档目录</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm ${
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.icon}
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="prose prose-gray max-w-none">
              {activeSection === 'getting-started' && (
                <div>
                  <h1 className="text-3xl font-bold font-heading mb-6">开始使用</h1>
                  <p className="text-lg text-muted-foreground mb-6">
                    欢迎使用 SkillHub！这是一个为开发者提供的智能技能分享平台。
                  </p>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">什么是 SkillHub？</h2>
                  <p>
                    SkillHub 是一个开放的技能市场，让开发者能够轻松发现、分享和集成各种智能技能到他们的应用中。
                    无论是数据处理、AI模型、API集成还是其他功能模块，都可以在这里找到合适的解决方案。
                  </p>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">核心概念</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>技能 (Skill)</strong>: 可重用的功能模块，提供特定的能力</li>
                    <li><strong>版本 (Version)</strong>: 技能的不同版本，支持向后兼容性</li>
                    <li><strong>发布者 (Publisher)</strong>: 技能的创建者和维护者</li>
                    <li><strong>使用者 (Consumer)</strong>: 使用技能的开发者</li>
                  </ul>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">快速入门</h2>
                  <ol className="list-decimal pl-6 space-y-4">
                    <li>注册并登录 SkillHub 账户</li>
                    <li>安装 CLI 工具</li>
                    <li>浏览或搜索所需技能</li>
                    <li>使用技能或发布自己的技能</li>
                  </ol>
                </div>
              )}

              {activeSection === 'installation' && (
                <div>
                  <h1 className="text-3xl font-bold font-heading mb-6">安装</h1>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">CLI 工具安装</h2>
                  <p>推荐使用 npm 安装 CLI 工具：</p>
                  <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code>npm install -g @skillhub/cli</code>
                  </pre>
                  
                  <p className="mt-4">或者使用 yarn：</p>
                  <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code>yarn global add @skillhub/cli</code>
                  </pre>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">验证安装</h2>
                  <p>安装完成后，验证 CLI 是否正确安装：</p>
                  <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code>skillhub --version</code>
                  </pre>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">依赖要求</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Node.js v14 或更高版本</li>
                    <li>npm v6 或更高版本</li>
                    <li>Git (用于某些操作)</li>
                  </ul>
                </div>
              )}

              {activeSection === 'cli-tool' && (
                <div>
                  <h1 className="text-3xl font-bold font-heading mb-6">CLI 工具</h1>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">命令概览</h2>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">命令</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">描述</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap"><code>skillhub login</code></td>
                        <td className="px-6 py-4">登录到 SkillHub 账户</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap"><code>skillhub search [query]</code></td>
                        <td className="px-6 py-4">搜索技能</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap"><code>skillhub get [skill-name]</code></td>
                        <td className="px-6 py-4">获取指定技能</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap"><code>skillhub publish</code></td>
                        <td className="px-6 py-4">发布新技能</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap"><code>skillhub info [skill-name]</code></td>
                        <td className="px-6 py-4">查看技能详细信息</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">常用示例</h2>
                  <p>搜索 PDF 相关技能：</p>
                  <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code>skillhub search pdf</code>
                  </pre>
                  
                  <p className="mt-4">获取名为 "pdf-parser" 的技能：</p>
                  <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code>skillhub get pdf-parser</code>
                  </pre>
                </div>
              )}

              {activeSection === 'publish-skill' && (
                <div>
                  <h1 className="text-3xl font-bold font-heading mb-6">发布技能</h1>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">准备工作</h2>
                  <p>在发布技能之前，请确保：</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>您已经注册并登录了 SkillHub 账户</li>
                    <li>您的技能代码已经准备好并经过测试</li>
                    <li>您已经编写了详细的文档和示例</li>
                    <li>您的技能符合我们的质量标准</li>
                  </ul>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">创建技能项目</h2>
                  <p>使用 CLI 创建新的技能项目：</p>
                  <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code>skillhub init my-skill</code>
                  </pre>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">项目结构</h2>
                  <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code>
{`my-skill/
├── skill.json          # 技能元数据
├── index.js           # 主入口文件
├── README.md          # 说明文档
├── package.json       # 依赖配置
├── examples/          # 示例代码
│   └── basic.js
└── test/              # 测试文件
    └── index.test.js`}
                    </code>
                  </pre>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">发布技能</h2>
                  <p>在项目根目录运行发布命令：</p>
                  <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code>skillhub publish</code>
                  </pre>
                </div>
              )}

              {activeSection === 'api-reference' && (
                <div>
                  <h1 className="text-3xl font-bold font-heading mb-6">API 参考</h1>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">公共 API</h2>
                  <p>所有 API 请求都需要使用以下基础 URL：</p>
                  <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code>https://api.skillhub.com/v1</code>
                  </pre>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">搜索技能</h3>
                  <p><code>GET /skills/search?q={'{query}'}&page={'{page}'}&limit={'{limit}'}</code></p>
                  <p>参数：</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li><code>q</code>: 搜索关键词</li>
                    <li><code>page</code>: 页码 (默认: 1)</li>
                    <li><code>limit</code>: 每页数量 (默认: 10, 最大: 100)</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">获取技能详情</h3>
                  <p><code>GET /skills/{'{skillName}'}/{'{version}'}</code></p>
                  <p>参数：</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li><code>skillName</code>: 技能名称</li>
                    <li><code>version</code>: 版本号 (默认: latest)</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">获取技能下载链接</h3>
                  <p><code>GET /skills/{'{skillName}'}/{'{version}'}/download</code></p>
                </div>
              )}

              {activeSection === 'best-practices' && (
                <div>
                  <h1 className="text-3xl font-bold font-heading mb-6">最佳实践</h1>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">技能开发指南</h2>
                  <ul className="list-disc pl-6 space-y-4">
                    <li><strong>清晰的接口设计</strong>: 提供简单、一致的 API 接口</li>
                    <li><strong>充分的错误处理</strong>: 对可能的错误情况进行适当的处理</li>
                    <li><strong>良好的文档</strong>: 提供详细的使用说明和示例代码</li>
                    <li><strong>单元测试</strong>: 包含充分的测试用例确保功能正确性</li>
                    <li><strong>向后兼容</strong>: 在更新时保持向后兼容性</li>
                    <li><strong>性能优化</strong>: 优化性能，减少资源消耗</li>
                  </ul>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">安全性考虑</h2>
                  <ul className="list-disc pl-6 space-y-4">
                    <li>对用户输入进行适当的验证和清理</li>
                    <li>避免执行任意代码或脚本</li>
                    <li>使用安全的数据传输协议</li>
                    <li>保护敏感信息不被泄露</li>
                  </ul>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">发布建议</h2>
                  <ul className="list-disc pl-6 space-y-4">
                    <li>使用语义化版本号 (SemVer)</li>
                    <li>提供变更日志 (changelog)</li>
                    <li>定期更新和维护</li>
                    <li>积极响应用户反馈</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocsPage;