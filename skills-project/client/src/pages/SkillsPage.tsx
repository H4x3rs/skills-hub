import { useState, useEffect } from 'react';
import { Search, Download, Star, Filter, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { useTranslation } from 'react-i18next';

const SkillsPage = () => {
  const { t } = useTranslation();
  const [filteredSkills, setFilteredSkills] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [skillsPerPage] = useState(12);
  
  // Mock data for skills
  const mockSkills = [
    { id: 1, name: 'PDF解析器', description: '高效解析PDF文档内容', downloads: 1245, rating: 4.8, author: '张三', tags: ['文档处理', 'AI'] },
    { id: 2, name: 'Excel处理器', description: '处理Excel数据的专业工具', downloads: 987, rating: 4.7, author: '李四', tags: ['数据处理', '表格'] },
    { id: 3, name: '图像识别器', description: 'AI驱动的图像识别功能', downloads: 756, rating: 4.9, author: '王五', tags: ['AI', '计算机视觉'] },
    { id: 4, name: '文本翻译器', description: '多语言文本翻译服务', downloads: 632, rating: 4.6, author: '赵六', tags: ['AI', '自然语言处理'] },
    { id: 5, name: '数据清洗器', description: '快速清理和预处理数据', downloads: 2456, rating: 4.9, author: '陈七', tags: ['数据处理', 'ETL'] },
    { id: 6, name: 'API客户端', description: '通用API调用客户端', downloads: 1890, rating: 4.8, author: '周八', tags: ['网络', 'HTTP'] },
    { id: 7, name: '代码生成器', description: '自动化代码生成工具', downloads: 1543, rating: 4.7, author: '吴九', tags: ['开发工具', 'AI'] },
    { id: 8, name: '图表生成器', description: '数据可视化图表工具', downloads: 1321, rating: 4.8, author: '郑十', tags: ['可视化', '图表'] },
    { id: 9, name: '邮件发送器', description: '批量邮件发送服务', downloads: 1102, rating: 4.5, author: '钱一', tags: ['通信', '邮件'] },
    { id: 10, name: '日志分析器', description: '实时日志分析工具', downloads: 956, rating: 4.6, author: '孙二', tags: ['监控', '日志'] },
    { id: 11, name: '缓存管理器', description: '分布式缓存管理工具', downloads: 876, rating: 4.7, author: '李三', tags: ['性能', '缓存'] },
    { id: 12, name: '任务调度器', description: '定时任务调度系统', downloads: 1234, rating: 4.8, author: '周四', tags: ['任务', '调度'] },
    { id: 13, name: '消息队列', description: '高性能消息队列系统', downloads: 1567, rating: 4.9, author: '周五', tags: ['消息', '异步'] },
    { id: 14, name: '安全扫描器', description: '漏洞扫描和安全检测', downloads: 789, rating: 4.5, author: '吴六', tags: ['安全', '扫描'] },
    { id: 15, name: '性能监控', description: '应用性能监控工具', downloads: 1023, rating: 4.7, author: '郑七', tags: ['监控', '性能'] },
    { id: 16, name: '配置管理', description: '动态配置管理系统', downloads: 934, rating: 4.6, author: '王八', tags: ['配置', '管理'] },
  ];
  
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'ai', name: 'AI/ML' },
    { id: 'data', name: '数据处理' },
    { id: 'web', name: 'Web开发' },
    { id: 'devops', name: 'DevOps' },
    { id: 'security', name: '安全' },
    { id: 'tools', name: '开发工具' },
  ];

  // Filter skills based on search term and category
  useEffect(() => {
    let result = mockSkills;
    
    if (searchTerm) {
      result = result.filter(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(skill => 
        skill.tags.some((tag: string) => 
          tag.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );
    }
    
    setFilteredSkills(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory]);

  // Pagination
  const indexOfLastSkill = currentPage * skillsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - skillsPerPage;
  const currentSkills = filteredSkills.slice(indexOfFirstSkill, indexOfLastSkill);
  const totalPages = Math.ceil(filteredSkills.length / skillsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">{t('skills.title')}</h1>
          <p className="text-muted-foreground">
            {t('skills.discover', { count: mockSkills.length })}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('skills.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-md px-3 py-2 bg-background"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{t(`skills.category.${category.id}`)}</option>
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

        {/* Skills Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {t('skills.foundSkills', { count: filteredSkills.length })}
          </p>
          <div className="text-sm text-muted-foreground">
            {t('pagination.pageInfo', { currentPage, totalPages })}
          </div>
        </div>

        {/* Skills Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentSkills.map((skill) => (
              <div key={skill.id} className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2">{skill.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{skill.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {skill.tags.slice(0, 3).map((tag: string, idx: number) => (
                    <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{skill.downloads.toLocaleString()} {t('skills.downloads')}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{skill.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{t('skills.author')}: {skill.author}</p>
                
                <Button className="w-full mt-4" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  {t('common.download')}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {currentSkills.map((skill) => (
              <div key={skill.id} className="bg-card rounded-lg border p-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{skill.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {skill.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">作者: {skill.author}</p>
                </div>
                
                <div className="flex flex-col justify-between items-end">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <span>{skill.downloads.toLocaleString()} 下载</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{skill.rating}</span>
                    </div>
                  </div>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    下载
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {t('pagination.prev')}
              </Button>
              
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => paginate(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return (
                    <span key={i} className="px-2">...</span>
                  );
                }
                return null;
              })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                {t('pagination.next')}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SkillsPage;