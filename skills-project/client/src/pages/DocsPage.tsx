import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { BookOpen, Terminal, Code, FileText, GitBranch, Globe, Server, HelpCircle, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SECTION_IDS = ['overview', 'getting-started', 'web-usage', 'cli-tool', 'publish-skill', 'deployment', 'api-reference', 'best-practices', 'faq', 'appendix'] as const;

const DocsPage = () => {
  const { t } = useTranslation('docs');
  const [activeSection, setActiveSection] = React.useState<string>('overview');

  // 支持 URL 哈希，如 /docs#api-reference
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && SECTION_IDS.includes(hash as typeof SECTION_IDS[number])) {
      setActiveSection(hash);
    }
  }, []);

  const handleSectionClick = (id: string) => {
    setActiveSection(id);
    window.history.replaceState(null, '', `#${id}`);
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const sections = [
    { id: 'overview', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'getting-started', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'web-usage', icon: <Globe className="h-4 w-4" /> },
    { id: 'cli-tool', icon: <Terminal className="h-4 w-4" /> },
    { id: 'publish-skill', icon: <Code className="h-4 w-4" /> },
    { id: 'deployment', icon: <Server className="h-4 w-4" /> },
    { id: 'api-reference', icon: <FileText className="h-4 w-4" /> },
    { id: 'best-practices', icon: <GitBranch className="h-4 w-4" /> },
    { id: 'faq', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'appendix', icon: <Layers className="h-4 w-4" /> },
  ];

  const contentKey = SECTION_IDS.includes(activeSection as typeof SECTION_IDS[number]) ? activeSection : 'overview';
  const content = t(`content.${contentKey}`);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-card rounded-lg border p-4 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">{t('toc')}</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm ${
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleSectionClick(section.id)}
                  >
                    {section.icon}
                    {t(`sectionTitles.${section.id}`)}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content - Markdown 渲染 */}
          <div className="flex-1 min-w-0">
            <article className="docs-prose prose prose-gray dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-semibold prose-h1:text-3xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:leading-7 prose-p:mb-4 prose-ul:my-4 prose-li:my-1 prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border/50 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-table:text-sm prose-th:bg-muted/50 prose-th:px-4 prose-th:py-3 prose-td:px-4 prose-td:py-3 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:rounded-r">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {content}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocsPage;
