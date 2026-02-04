import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Star, Loader2, Tag, BookOpen, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useTranslation } from 'react-i18next';
import { skillAPI } from '@/lib/api';

interface SkillVersion {
  version: string;
  description: string;
  content?: string;
  tags?: string[];
  createdAt?: string;
}

interface Skill {
  _id: string;
  name: string;
  description: string;
  version?: string;
  author?: { fullName?: string; username?: string };
  category?: string;
  tags?: string[];
  downloads?: number;
  rating?: { average?: number };
  versions?: SkillVersion[];
  repositoryUrl?: string;
  documentationUrl?: string;
  demoUrl?: string;
}

const SkillDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<SkillVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const versionParam = searchParams.get('version');

  useEffect(() => {
    if (!id) return;

    const fetchSkill = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await skillAPI.getById(id, true);
        const data = res.data?.skill ?? res.data;
        if (!data) throw new Error('Skill not found');
        setSkill(data);

        const versions = data.versions || [];
        if (versions.length === 0 && data.version) {
          versions.push({
            version: data.version,
            description: data.description || '',
            content: '',
            tags: data.tags || [],
            createdAt: data.createdAt,
          });
        }

        let targetVersion: SkillVersion | null = null;
        if (versionParam && versions.length > 0) {
          targetVersion = versions.find((v: SkillVersion) => v.version === versionParam) || null;
          if (!targetVersion) {
            const verRes = await skillAPI.getVersion(id, versionParam);
            const verData = verRes.data?.version ?? verRes.data;
            if (verData) {
              targetVersion = verData;
            }
          }
        }
        if (!targetVersion && versions.length > 0) {
          targetVersion = versions[0];
        }
        setSelectedVersion(targetVersion);
      } catch (err: unknown) {
        const msg = err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
        setError(msg || (err instanceof Error ? err.message : 'Failed to load skill'));
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id, versionParam]);

  const handleVersionChange = (ver: SkillVersion) => {
    setSelectedVersion(ver);
    setSearchParams(ver.version ? { version: ver.version } : {});
  };

  const getAuthorName = () => {
    if (!skill?.author) return '—';
    const a = skill.author;
    return a.fullName || a.username || '—';
  };

  const getRating = () => skill?.rating?.average ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container py-8 px-4 md:px-6">
          <p className="text-destructive mb-4">{error || t('skills.fetchError')}</p>
          <Link to="/skills">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('skills.backToList', '返回技能库')}
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  const versions = skill.versions || [];
  if (versions.length === 0 && skill.version) {
    versions.push({
      version: skill.version,
      description: skill.description || '',
      content: '',
      tags: skill.tags || [],
      createdAt: (skill as { createdAt?: string }).createdAt,
    });
  }

  const displayDesc = selectedVersion?.description ?? skill.description ?? '';
  const displayTags = (selectedVersion?.tags && selectedVersion.tags.length > 0) ? selectedVersion.tags : (skill.tags || []);

  const handleDownload = () => {
    const url = skillAPI.getDownloadUrl(skill._id, selectedVersion?.version);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
        <Link
          to="/skills"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('skills.backToList', '返回技能库')}
        </Link>

        {/* 头部信息卡片 */}
        <div className="bg-card rounded-xl border p-6 md:p-8 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold font-heading mb-2 break-words">
                {skill.name}
              </h1>
              <div className="prose prose-sm dark:prose-invert max-w-none mb-4 prose-p:my-0 prose-p:text-foreground/80">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayDesc}</ReactMarkdown>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 items-center text-sm text-muted-foreground">
                <span>{t('skills.author')}: {getAuthorName()}</span>
                {skill.category && (
                  <span>• {t(`skills.category.${skill.category}`)}</span>
                )}
                <span>• {(skill.downloads ?? 0).toLocaleString()} {t('skills.downloads')}</span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  {getRating().toFixed(1)}
                </span>
              </div>
              {(versions.length > 0) && (
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  <span className="text-xs text-muted-foreground mr-0.5">
                    {versions.length > 1 ? t('skills.selectVersion', '版本') : t('skills.version', '版本')}:
                  </span>
                  {versions.length === 1 ? (
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                      {versions[0].version === 'latest' ? 'latest' : `v${versions[0].version}`}
                    </span>
                  ) : versions.length <= 6 ? (
                    versions.map((v: SkillVersion) => (
                      <button
                        key={v.version}
                        type="button"
                        onClick={() => handleVersionChange(v)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                          selectedVersion?.version === v.version
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {v.version === 'latest' ? 'latest' : `v${v.version}`}
                      </button>
                    ))
                  ) : (
                    <select
                      value={selectedVersion?.version || ''}
                      onChange={(e) => {
                        const v = versions.find((x: SkillVersion) => x.version === e.target.value);
                        if (v) handleVersionChange(v);
                      }}
                      className="border rounded-md px-2.5 py-1 bg-background text-xs"
                    >
                      {versions.map((v: SkillVersion) => (
                        <option key={v.version} value={v.version}>
                          {v.version === 'latest' ? 'latest' : `v${v.version}`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
              {displayTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {displayTags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-md"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0 items-start sm:items-center">
              {(skill.repositoryUrl || skill.documentationUrl || skill.demoUrl) && (
                <div className="flex flex-wrap gap-2">
                  {skill.repositoryUrl && (
                    <a
                      href={skill.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {skill.repositoryUrl.includes('github.com') ? (
                        <Github className="h-4 w-4" />
                      ) : (
                        <ExternalLink className="h-3.5 w-3.5" />
                      )}
                      {skill.repositoryUrl.includes('github.com')
                        ? t('skills.viewOnGitHub', 'GitHub')
                        : t('skills.repository', '仓库')}
                    </a>
                  )}
                  {skill.documentationUrl && (
                    <a
                      href={skill.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <BookOpen className="h-4 w-4" />
                      {t('skills.documentation', '文档')}
                    </a>
                  )}
                  {skill.demoUrl && (
                    <a
                      href={skill.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {t('skills.demo', '演示')}
                    </a>
                  )}
                </div>
              )}
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                {t('common.download')}
              </Button>
            </div>
          </div>
        </div>

        {/* 文档内容区 */}
        <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
          <div className="border-b bg-muted/30 px-6 py-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t('skills.documentation', '文档')}
              {selectedVersion && (
                <span className="text-muted-foreground font-normal">{selectedVersion.version === 'latest' ? 'latest' : `v${selectedVersion.version}`}</span>
              )}
            </h2>
          </div>
          <div className="p-6 md:p-8">
            <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-table:text-sm prose-th:bg-muted/50 prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2">
              {selectedVersion?.content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {selectedVersion.content}
                </ReactMarkdown>
              ) : (
                <p className="text-muted-foreground py-8 text-center">
                  {t('skills.noDocumentation', '暂无文档内容')}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SkillDetailPage;
