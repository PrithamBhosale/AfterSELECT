import { useState } from 'react';
import { Lightbulb, BookOpen, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QueryHintPanelProps {
  hint?: string;
  explanation?: string;
  conceptsCovered?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const QueryHintPanel = ({ hint, explanation, conceptsCovered, difficulty }: QueryHintPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(difficulty === 'beginner');

  // Generate default hint based on concepts if not provided
  const displayHint = hint || (conceptsCovered?.length 
    ? `This query uses: ${conceptsCovered.join(', ')}`
    : 'Try running the query to see what it does!');

  const displayExplanation = explanation || 'Run the query and observe the results to understand how it works.';

  return (
    <div className="bg-gradient-to-br from-crayon-yellow/10 to-crayon-orange/5 rounded-2xl border-2 border-crayon-yellow/30 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-crayon-yellow/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-crayon-yellow" />
          <span className="font-display font-semibold text-crayon-orange">Need Help?</span>
          {difficulty === 'beginner' && (
            <span className="text-xs bg-crayon-green/20 text-crayon-green px-2 py-0.5 rounded-full">
              Beginner Tip
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-96" : "max-h-0"
      )}>
        <div className="p-4 pt-0 space-y-4">
          {/* Hint */}
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-crayon-yellow/20 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-crayon-yellow" />
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-crayon-yellow mb-1">💡 Hint</h4>
              <p className="text-sm text-muted-foreground">{displayHint}</p>
            </div>
          </div>

          {/* Explanation */}
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-crayon-blue/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-crayon-blue" />
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-crayon-blue mb-1">📚 What This Teaches</h4>
              <p className="text-sm text-muted-foreground">{displayExplanation}</p>
            </div>
          </div>

          {/* Concepts Covered */}
          {conceptsCovered && conceptsCovered.length > 0 && (
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-crayon-purple/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-crayon-purple" />
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold text-crayon-purple mb-2">🎯 Concepts Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {conceptsCovered.map((concept, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 bg-crayon-purple/10 text-crayon-purple text-xs rounded-lg font-medium"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryHintPanel;
