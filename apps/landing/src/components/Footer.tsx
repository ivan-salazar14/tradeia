import { Github, Twitter, Linkedin, Mail, MessageCircle, Code, Zap, Shield, BarChart2, Users, LifeBuoy } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', icon: <Zap size={16} className="mr-2" />, path: '/features' },
        { name: 'Pricing', icon: <BarChart2 size={16} className="mr-2" />, path: '/pricing' },
        { name: 'Documentation', icon: <Code size={16} className="mr-2" />, path: '/docs' },
        { name: 'Changelog', icon: <MessageCircle size={16} className="mr-2" />, path: '/changelog' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', icon: <Code size={16} className="mr-2" />, path: '/docs' },
        { name: 'API Reference', icon: <Code size={16} className="mr-2" />, path: '/api' },
        { name: 'Guides', icon: <LifeBuoy size={16} className="mr-2" />, path: '/guides' },
        { name: 'Community', icon: <Users size={16} className="mr-2" />, path: '/community' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', icon: <Users size={16} className="mr-2" />, path: '/about' },
        { name: 'Blog', icon: <MessageCircle size={16} className="mr-2" />, path: '/blog' },
        { name: 'Careers', icon: <Users size={16} className="mr-2" />, path: '/careers' },
        { name: 'Contact', icon: <Mail size={16} className="mr-2" />, path: '/contact' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', icon: <Shield size={16} className="mr-2" />, path: '/privacy' },
        { name: 'Terms of Service', icon: <Shield size={16} className="mr-2" />, path: '/terms' },
        { name: 'Cookie Policy', icon: <Shield size={16} className="mr-2" />, path: '/cookies' },
        { name: 'Security', icon: <Shield size={16} className="mr-2" />, path: '/security' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: <Github size={20} />, url: 'https://github.com' },
    { name: 'Twitter', icon: <Twitter size={20} />, url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, url: 'https://linkedin.com' },
    { name: 'Email', icon: <Mail size={20} />, url: 'mailto:contact@tradingpro.com' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">TP</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                TradeIA
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Plataforma avanzada de trading cuantitativo que automatiza tus estrategias 
              y maximiza tus ganancias en los mercados financieros.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.path} 
                      className="flex items-center text-gray-400 hover:text-primary-400 transition-colors duration-200"
                    >
                      {link.icon}
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              {currentYear} TradeIA. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Términos de Servicio
              </a>
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidad
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Política de Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;