import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-background py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="text-center md:text-left">
            <h3 className="font-heading font-bold text-lg mb-4">SkillHub</h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">{t('footer.product.title')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/skills" className="hover:text-primary">{t('navigation.skills')}</Link></li>
              <li><Link to="/docs" className="hover:text-primary">{t('navigation.docs')}</Link></li>
              <li><Link to="/cli" className="hover:text-primary">{t('footer.product.cli')}</Link></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">{t('footer.company.title')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">{t('navigation.about')}</Link></li>
              <li><Link to="/blog" className="hover:text-primary">{t('navigation.blog')}</Link></li>
              <li><Link to="/contact" className="hover:text-primary">{t('footer.company.contact')}</Link></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">{t('footer.legal.title')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-primary">{t('footer.legal.privacy')}</Link></li>
              <li><Link to="/terms" className="hover:text-primary">{t('footer.legal.terms')}</Link></li>
              <li><Link to="/license" className="hover:text-primary">{t('footer.legal.license')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground max-w-6xl mx-auto">
          © 2026 SkillHub. {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;