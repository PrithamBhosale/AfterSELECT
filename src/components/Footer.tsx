import { Linkedin, Github } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Footer = () => {
  const XIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/prithambhosale/',
      icon: <Linkedin className="w-5 h-5" />,
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/PrithamBhosale',
      icon: <XIcon />,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/PrithamBhosale',
      icon: <Github className="w-5 h-5" />,
    },
  ];

  return (
    <footer className="py-6 mt-auto border-t border-slate-200 bg-white/70 backdrop-blur-xl relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="afterSELECT" className="w-8 h-8 object-contain" />
            <div className="font-display text-lg font-bold tracking-tight">
              <span className="text-blue-600">After</span>
              <span className="text-orange-500">SELECT</span>
            </div>
          </div>

          {/* Built by link */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-slate-400 hover:text-slate-600 transition-colors text-sm cursor-pointer">
                System Architect
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">
                  <span className="text-slate-500 font-normal text-sm block mb-1">This project is built by</span>
                  <span className="font-display text-2xl text-slate-800">Pritham Bhosale</span>
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 mt-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all group"
                  >
                    <div className="text-slate-500 group-hover:text-blue-600 transition-colors">
                      {link.icon}
                    </div>
                    <span className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{link.name}</span>
                  </a>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </footer>
  );
};

export default Footer;