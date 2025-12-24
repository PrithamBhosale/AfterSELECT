import { cn } from '@/lib/utils';

interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
}

const ProgressBar = ({ completed, total, className }: ProgressBarProps) => {
  const percent = Math.round((completed / total) * 100);
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm font-medium">
        <span className="font-display">{completed} of {total} queries completed</span>
        <span className="text-crayon-green font-bold">{percent}%</span>
      </div>
      <div className="h-4 bg-muted rounded-full overflow-hidden border-2 border-border">
        <div 
          className="h-full bg-gradient-to-r from-crayon-green to-crayon-blue transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {percent === 100 && (
        <p className="text-center text-crayon-green font-display text-lg animate-bounce">
          🎉 Congratulations! You completed all queries!
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
