import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Star, Filter, Grid, List, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useSkills } from '@/hooks/useSkills';

const SkillsPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const {
    skills: currentSkills,
    loading,
    error,
    pagination,
    refetch,
  } = useSkills(searchTerm, selectedCategory, currentPage);

  const categories = [
    { id: 'all', name: 'all' },
    { id: 'ai', name: 'ai' },
    { id: 'data', name: 'data' },
    { id: 'web', name: 'web' },
    { id: 'devops', name: 'devops' },
    { id: 'security', name: 'security' },
    { id: 'tools', name: 'tools' },
  ];

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const getAuthorName = (author?: { fullName?: string; username?: string }) => {
    if (!author) return '-';
    return author.fullName || author.username || '-';
  };

  const getRating = (skill: { rating?: { average?: number } }) => {
    return skill.rating?.average ?? 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">{t('skills.title')}</h1>
          <p className="text-muted-foreground">
            {t('skills.discover', { count: pagination.totalSkills })}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('skills.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="border rounded-md px-3 py-2 bg-background"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {t(`skills.category.${category.id}`)}
                </option>
              ))}
            </select>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              {t('skills.filter')}
            </Button>

            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
                {t('skills.grid')}
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
                {t('skills.list')}
              </Button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={refetch}>
              {t('common.retry', '重试')}
            </Button>
          </div>
        )}

        {/* Skills Grid/List */}
        {!loading && !error && (
          <>
            {/* Skills Count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {t('skills.foundSkills', { count: pagination.totalSkills })}
              </p>
              <div className="text-sm text-muted-foreground">
                {t('pagination.pageInfo', {
                  currentPage: pagination.currentPage,
                  totalPages: pagination.totalPages || 1,
                })}
              </div>
            </div>

            {/* Empty State */}
            {currentSkills.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p>{t('skills.empty', '暂无技能')}</p>
              </div>
            )}

            {/* Skills Display */}
            {currentSkills.length > 0 &&
              (viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentSkills.map((skill) => (
                    <div
                      key={skill._id}
                      className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow"
                    >
                      <Link to={`/skills/${skill._id}`} className="hover:underline">
                        <h3 className="font-semibold text-lg mb-2">{skill.name}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {skill.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {(skill.tags || []).slice(0, 3).map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          {(skill.downloads ?? 0).toLocaleString()} {t('skills.downloads')}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{getRating(skill).toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {t('skills.author')}: {getAuthorName(skill.author)}
                      </p>

                      <Link to={`/skills/${skill._id}`} className="w-full mt-4">
                        <Button className="w-full" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          {t('common.download')}
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {currentSkills.map((skill) => (
                    <div
                      key={skill._id}
                      className="bg-card rounded-lg border p-6 flex flex-col sm:flex-row gap-4"
                    >
                      <div className="flex-1">
                        <Link to={`/skills/${skill._id}`} className="hover:underline">
                          <h3 className="font-semibold text-lg mb-1">{skill.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">
                          {skill.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {(skill.tags || []).map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {t('skills.author')}: {getAuthorName(skill.author)}
                        </p>
                      </div>

                      <div className="flex flex-col justify-between items-end">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                          <span>
                            {(skill.downloads ?? 0).toLocaleString()} {t('skills.downloads')}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{getRating(skill).toFixed(1)}</span>
                          </div>
                        </div>
                        <Link to={`/skills/${skill._id}`}>
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            {t('common.download')}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    {t('pagination.prev')}
                  </Button>

                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={i}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span key={i} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                  >
                    {t('pagination.next')}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SkillsPage;
