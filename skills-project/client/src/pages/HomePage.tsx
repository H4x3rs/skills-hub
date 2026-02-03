import { Link } from 'react-router-dom';
import { Search, Star, Download, Upload, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  
  // Mock data for skills
  const latestSkills = [
    { id: 1, name: 'PDF解析器', description: '高效解析PDF文档内容', downloads: 1245, rating: 4.8, author: '张三' },
    { id: 2, name: 'Excel处理器', description: '处理Excel数据的专业工具', downloads: 987, rating: 4.7, author: '李四' },
    { id: 3, name: '图像识别器', description: 'AI驱动的图像识别功能', downloads: 756, rating: 4.9, author: '王五' },
    { id: 4, name: '文本翻译器', description: '多语言文本翻译服务', downloads: 632, rating: 4.6, author: '赵六' },
  ];
  
  const popularSkills = [
    { id: 1, name: '数据清洗器', description: '快速清理和预处理数据', downloads: 2456, rating: 4.9, author: '陈七' },
    { id: 2, name: 'API客户端', description: '通用API调用客户端', downloads: 1890, rating: 4.8, author: '周八' },
    { id: 3, name: '代码生成器', description: '自动化代码生成工具', downloads: 1543, rating: 4.7, author: '吴九' },
    { id: 4, name: '图表生成器', description: '数据可视化图表工具', downloads: 1321, rating: 4.8, author: '郑十' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
              {t('home.title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/skills">
                <Button size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  {t('home.browseSkills')}
                </Button>
              </Link>
              <Link to="/skills">
                <Button variant="outline" size="lg">
                  <Upload className="h-4 w-4 mr-2" />
                  {t('home.publishSkill')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold font-heading text-center mb-12">{t('home.features.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-card p-6 rounded-lg border shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('home.features.search.title')}</h3>
                <p className="text-muted-foreground">
                  {t('home.features.search.desc')}
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('home.features.quality.title')}</h3>
                <p className="text-muted-foreground">
                  {t('home.features.quality.desc')}
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('home.features.docs.title')}</h3>
                <p className="text-muted-foreground">
                  {t('home.features.docs.desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Skills */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <h2 className="text-3xl font-bold font-heading mb-4 md:mb-0">{t('home.latestSkills')}</h2>
              <Link to="/skills" className="text-primary hover:underline">{t('home.viewMore')}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestSkills.map((skill) => (
                <div key={skill.id} className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow flex flex-col h-full">
                  <h3 className="font-semibold text-lg mb-2">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{skill.description}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
                    <span>{skill.downloads.toLocaleString()} {t('skills.downloads')}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{skill.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{t('skills.author')}: {skill.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Skills */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <h2 className="text-3xl font-bold font-heading mb-4 md:mb-0">{t('home.popularSkills')}</h2>
              <Link to="/skills" className="text-primary hover:underline">{t('home.viewMore')}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularSkills.map((skill) => (
                <div key={skill.id} className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow flex flex-col h-full">
                  <h3 className="font-semibold text-lg mb-2">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{skill.description}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
                    <span>{skill.downloads.toLocaleString()} {t('skills.downloads')}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{skill.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{t('skills.author')}: {skill.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;