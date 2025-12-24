import { Database, Sparkles, Trophy } from 'lucide-react';
import { getTotalQueryCount, sqlCurriculum } from '@/data/sqlCurriculum';

const Hero = () => {
  const totalQueries = getTotalQueryCount();
  const totalModules = sqlCurriculum.length;

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Decorative crayon scribbles */}
      <div className="absolute top-10 left-10 w-24 h-24 border-4 border-crayon-yellow rounded-full opacity-30 transform rotate-12" />
      <div className="absolute top-20 right-20 w-16 h-16 border-4 border-crayon-pink opacity-30 transform -rotate-6" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }} />
      <div className="absolute bottom-10 left-1/4 w-20 h-20 border-4 border-crayon-green opacity-20 transform rotate-45" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full mb-4 sketch-border">
          <Sparkles className="w-4 h-4 text-crayon-orange" />
          <span className="text-sm font-medium">Learn SQL the fun way!</span>
        </div>
        
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mb-4 leading-tight">
          <span className="text-crayon-blue">after</span>
          <span className="relative inline-block">
            <span className="text-crayon-orange">SELECT</span>
            <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" preserveAspectRatio="none">
              <path d="M0,8 Q50,2 100,8 T200,8" stroke="hsl(var(--crayon-orange))" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 font-body">
          Master SQL queries through hands-on practice. 
          <span className="text-crayon-purple font-semibold"> No database needed</span> — 
          just pick a topic and start writing!
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg shadow-sketch">
            <Database className="w-4 h-4 text-crayon-blue" />
            <span className="font-medium text-sm">{totalModules} Modules</span>
          </div>
          <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg shadow-sketch">
            <span className="text-lg">✨</span>
            <span className="font-medium text-sm">{totalQueries} Queries</span>
          </div>
          <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg shadow-sketch">
            <Trophy className="w-4 h-4 text-crayon-yellow" />
            <span className="font-medium text-sm">Track Progress</span>
          </div>
        </div>

        {/* Animated pencil decoration */}
        <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2">
          <svg width="120" height="40" viewBox="0 0 120 40" className="float">
            <rect x="20" y="10" width="80" height="20" rx="2" fill="hsl(var(--crayon-yellow))" />
            <polygon points="100,10 120,20 100,30" fill="hsl(var(--foreground) / 0.8)" />
            <rect x="0" y="8" width="20" height="24" rx="2" fill="hsl(var(--crayon-pink))" />
            <rect x="15" y="10" width="5" height="20" fill="hsl(var(--foreground) / 0.2)" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
