import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  Database,
  Link,
  Layers,
  FileText,
  Calculator,
  Calendar,
  GitBranch,
  Sigma,
  Network
} from 'lucide-react';
import { sqlCurriculum } from '@/data/sqlCurriculum';
import Footer from '@/components/Footer';

const Landing = () => {
  const navigate = useNavigate();

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'select': return <Search className="w-5 h-5" />;
      case 'filtering': return <Search className="w-5 h-5" />;
      case 'aggregates': return <Sigma className="w-5 h-5" />;
      case 'joins': return <Link className="w-5 h-5" />;
      case 'window-basics': return <Layers className="w-5 h-5" />;
      case 'subqueries': return <Network className="w-5 h-5" />;
      case 'cte': return <GitBranch className="w-5 h-5" />;
      case 'ddl': return <Database className="w-5 h-5" />;
      case 'dml': return <FileText className="w-5 h-5" />;
      case 'strings': return <FileText className="w-5 h-5" />;
      case 'numbers': return <Calculator className="w-5 h-5" />;
      case 'datetime': return <Calendar className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  const getModuleColor = (id: string) => {
    switch (id) {
      case 'select': return 'bg-blue-50 text-blue-600';
      case 'aggregates': return 'bg-purple-50 text-purple-600';
      case 'joins': return 'bg-orange-50 text-orange-600';
      case 'window-basics': return 'bg-emerald-50 text-emerald-600';
      case 'subqueries': return 'bg-red-50 text-red-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };



  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 selection:bg-orange-100 selection:text-orange-900">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.svg" alt="AfterSELECT" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl tracking-tight">
              <span className="text-blue-600">After</span><span className="text-orange-500">SELECT</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/explore')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
            >
              Start Practicing
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-16 md:pt-28 pb-20 md:pb-28 overflow-visible">

          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

              {/* Left Content */}
              <div className="flex-1 max-w-2xl text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold border border-slate-200 mb-8 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span>Now with Window Functions</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
                  Practice SQL. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500">One Query at a Time.</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 max-w-lg mb-10 leading-relaxed">
                  Build fluency with <span className="font-bold text-slate-900">200+ interactive challenges</span>.
                  Progress naturally from basic <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-700 border border-slate-200">SELECT *</code> to complex <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-700 border border-slate-200">WITH RECURSIVE</code> in a real database environment.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate('/explore')}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1"
                  >
                    Start Writing SQL <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate('/explore')}
                    className="flex items-center justify-center gap-2 bg-white text-slate-700 hover:text-slate-900 px-8 py-4 rounded-xl text-lg font-semibold border border-slate-200 shadow-sm hover:border-slate-300 transition-all hover:-translate-y-1"
                  >
                    Explore Topics
                  </button>
                </div>
              </div>

              {/* Right Content - 3 Column Modules Marquee */}
              <div className="flex-1 w-full max-w-[700px] relative h-[600px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]">
                <div className="flex gap-4 h-full">
                  {/* Column 1 - Scrolls Up */}
                  <div className="flex-1 overflow-hidden">
                    <div className="animate-marquee-vertical flex flex-col gap-4 pb-4" style={{ animationDuration: '80s' }}>
                      {[...sqlCurriculum.slice(0, 9), ...sqlCurriculum.slice(0, 9)].map((module, index) => {
                        const queryCount = module.lessons.reduce((acc, l) => acc + l.queries.length, 0);
                        return (
                          <div
                            key={`col1-${module.id}-${index}`}
                            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-blue-200 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className={`p-2 rounded-lg ${getModuleColor(module.id)}`}>
                                {getModuleIcon(module.id)}
                              </div>
                              <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                {queryCount} Queries
                              </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm leading-tight">{module.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                              {module.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 2 - Scrolls Down (Reverse) */}
                  <div className="flex-1 overflow-hidden">
                    <div className="animate-marquee-vertical-reverse flex flex-col gap-4 pb-4">
                      {[...sqlCurriculum.slice(9, 17), ...sqlCurriculum.slice(9, 17)].map((module, index) => {
                        const queryCount = module.lessons.reduce((acc, l) => acc + l.queries.length, 0);
                        return (
                          <div
                            key={`col2-${module.id}-${index}`}
                            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-purple-200 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className={`p-2 rounded-lg ${getModuleColor(module.id)}`}>
                                {getModuleIcon(module.id)}
                              </div>
                              <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                {queryCount} Queries
                              </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm leading-tight">{module.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                              {module.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 3 - Scrolls Up */}
                  <div className="flex-1 overflow-hidden">
                    <div className="animate-marquee-vertical flex flex-col gap-4 pb-4" style={{ animationDuration: '90s' }}>
                      {[...sqlCurriculum.slice(17, 25), ...sqlCurriculum.slice(17, 25)].map((module, index) => {
                        const queryCount = module.lessons.reduce((acc, l) => acc + l.queries.length, 0);
                        return (
                          <div
                            key={`col3-${module.id}-${index}`}
                            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-orange-200 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className={`p-2 rounded-lg ${getModuleColor(module.id)}`}>
                                {getModuleIcon(module.id)}
                              </div>
                              <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                {queryCount} Queries
                              </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm leading-tight">{module.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                              {module.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
};

export default Landing;