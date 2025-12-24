import { SQLModule } from '@/data/sqlCurriculum';
import { cn } from '@/lib/utils';

interface TopicCardProps {
  topic: SQLModule;
  isSelected: boolean;
  onClick: () => void;
}

const colorClasses = {
  red: 'border-crayon-red hover:bg-crayon-red/10 data-[selected=true]:bg-crayon-red/20',
  orange: 'border-crayon-orange hover:bg-crayon-orange/10 data-[selected=true]:bg-crayon-orange/20',
  yellow: 'border-crayon-yellow hover:bg-crayon-yellow/10 data-[selected=true]:bg-crayon-yellow/20',
  green: 'border-crayon-green hover:bg-crayon-green/10 data-[selected=true]:bg-crayon-green/20',
  blue: 'border-crayon-blue hover:bg-crayon-blue/10 data-[selected=true]:bg-crayon-blue/20',
  purple: 'border-crayon-purple hover:bg-crayon-purple/10 data-[selected=true]:bg-crayon-purple/20',
  pink: 'border-crayon-pink hover:bg-crayon-pink/10 data-[selected=true]:bg-crayon-pink/20',
};

const TopicCard = ({ topic, isSelected, onClick }: TopicCardProps) => {
  // Count total queries in this module
  const totalQueries = topic.lessons.reduce((acc, lesson) => acc + lesson.queries.length, 0);

  return (
    <button
      onClick={onClick}
      data-selected={isSelected}
      className={cn(
        "group relative p-3 bg-card border-3 rounded-xl transition-all duration-300",
        "hover:shadow-crayon hover:-translate-y-1 active:translate-y-0",
        "text-left w-full",
        colorClasses[topic.color]
      )}
      style={{
        borderWidth: '3px',
        borderRadius: '20px 8px 20px 8px',
      }}
    >
      <div className="flex flex-col items-center text-center gap-1">
        <span className="text-2xl group-hover:animate-wiggle">{topic.icon}</span>
        <h3 className="font-display text-sm font-semibold leading-tight">{topic.title}</h3>
        <span className="text-xs text-muted-foreground">
          {totalQueries} queries
        </span>
      </div>
      
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-crayon-green rounded-full flex items-center justify-center text-primary-foreground text-xs shadow-md">
          ✓
        </div>
      )}
    </button>
  );
};

export default TopicCard;
