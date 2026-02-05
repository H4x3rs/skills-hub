import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

const PolicyModal = ({ isOpen, onClose, type }: PolicyModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const isTerms = type === 'terms';
  const title = isTerms 
    ? t('terms.title', '服务条款')
    : t('privacy.title', '隐私政策');

  // 获取内容 - 这里可以复用现有页面的内容
  const getContent = () => {
    if (isTerms) {
      return `
## 1. 接受条款

通过访问和使用 BotSkill 平台（"服务"），您同意遵守并受本服务条款的约束。如果您不同意这些条款，请不要使用我们的服务。

## 2. 服务描述

BotSkill 是一个技能分享平台，允许用户发现、下载和发布技能。我们保留随时修改、暂停或终止服务的权利，恕不另行通知。

## 3. 用户账户

使用某些功能需要创建账户。您同意：
- 提供准确、完整和最新的信息
- 维护账户信息的安全性和保密性
- 对账户下的所有活动负责
- 立即通知我们任何未经授权的使用

## 4. 用户内容

您保留对您上传到平台的所有内容的权利。通过上传内容，您授予我们在全球范围内使用、复制、分发和展示内容的许可。

## 5. 禁止行为

您同意不上传非法、有害、威胁、辱骂、骚扰、诽谤、粗俗或其他令人反感的内容，不侵犯任何第三方的知识产权。

## 6. 知识产权

平台及其所有内容均为 BotSkill 或其内容提供商的财产，受版权、商标和其他知识产权法保护。

## 7. 免责声明

服务按"现状"和"可用"基础提供。我们不保证服务将无中断、及时、安全或无错误。

## 8. 终止

我们保留随时终止或暂停您的账户和访问服务的权利，无需事先通知。

## 9. 条款变更

我们保留随时修改本服务条款的权利。重大变更将通过电子邮件或网站公告通知您。

## 10. 联系我们

如果您对本服务条款有任何问题，请通过以下方式联系我们：
邮箱：admin@botskill.ai
      `;
    } else {
      return `
## 1. 介绍

BotSkill（"我们"、"我们的"或"本平台"）致力于保护您的隐私。本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。

## 2. 信息收集

我们可能收集以下类型的信息：
- 账户信息：用户名、邮箱地址、密码（加密存储）
- 个人资料：姓名、头像、个人简介等可选信息
- 使用数据：访问记录、下载记录、搜索历史等
- 技术信息：IP地址、浏览器类型、设备信息等

## 3. 信息使用

我们使用收集的信息用于以下目的：
- 提供、维护和改进我们的服务
- 处理您的请求和交易
- 发送重要通知和更新
- 分析使用情况以改善用户体验
- 检测和防止欺诈、滥用和安全问题

## 4. 信息共享

我们不会出售、交易或出租您的个人信息给第三方。我们可能在获得您的明确同意、法律要求或保护我们的权利时共享信息。

## 5. 数据安全

我们采用行业标准的安全措施来保护您的个人信息，包括加密传输、安全存储和访问控制。

## 6. 您的权利

您有权访问、更新或删除您的个人信息，撤回对数据处理的同意，请求数据导出，提出投诉或问题。

## 7. Cookie 和跟踪技术

我们使用 Cookie 和类似技术来改善用户体验、分析使用情况并提供个性化内容。

## 8. 政策变更

我们可能会不时更新本隐私政策。重大变更将通过电子邮件或网站公告通知您。

## 9. 联系我们

如果您对本隐私政策有任何问题或疑虑，请通过以下方式联系我们：
邮箱：admin@botskill.ai
      `;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-background rounded-lg border shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold font-heading">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {getContent()}
            </ReactMarkdown>
          </div>
        </div>
        <div className="p-6 border-t flex justify-end">
          <Button onClick={onClose}>
            {t('common.close', '关闭')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
