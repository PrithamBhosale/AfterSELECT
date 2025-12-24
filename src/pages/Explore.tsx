import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { sqlCurriculum, getTotalQueryCount } from '@/data/sqlCurriculum';
import { useProgress } from '@/hooks/useProgress';
import { Check, ChevronDown, ChevronUp, Search, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';

const Explore = () => {
    const navigate = useNavigate();
    const { isCompleted, completedCount, progressPercent, getFirstIncomplete } = useProgress();
    const totalQueries = getTotalQueryCount();
    const [searchQuery, setSearchQuery] = useState('');

    // Find which module contains the first incomplete query
    const getActiveModuleId = (): string => {
        const firstIncompleteId = getFirstIncomplete();
        if (firstIncompleteId) {
            for (const module of sqlCurriculum) {
                for (const lesson of module.lessons) {
                    if (lesson.queries.some(q => q.id === firstIncompleteId)) {
                        return module.id;
                    }
                }
            }
        }
        // If all completed or none found, expand first module
        return sqlCurriculum[0]?.id || '';
    };

    const [expandedModules, setExpandedModules] = useState<Set<string>>(() => new Set([getActiveModuleId()]));

    // Flatten queries with their global index
    const allQueries = useMemo(() => {
        const queries: { query: any; moduleId: string; moduleTitle: string; moduleIcon: string; lessonTitle: string; globalIndex: number }[] = [];
        let globalIndex = 0;
        sqlCurriculum.forEach(module => {
            module.lessons.forEach(lesson => {
                lesson.queries.forEach(query => {
                    queries.push({
                        query,
                        moduleId: module.id,
                        moduleTitle: module.title,
                        moduleIcon: module.icon,
                        lessonTitle: lesson.title,
                        globalIndex: globalIndex++,
                    });
                });
            });
        });
        return queries;
    }, []);

    // Difficulty order for sorting
    const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };

    // Filter and sort queries based on search and difficulty
    const filteredModules = useMemo(() => {
        const sortByDifficulty = (queries: any[]) => {
            return [...queries].sort((a, b) =>
                difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
                difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
            );
        };

        const modules = searchQuery.trim()
            ? sqlCurriculum.map(module => ({
                ...module,
                lessons: module.lessons.map(lesson => ({
                    ...lesson,
                    queries: lesson.queries.filter(q =>
                        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.query.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                })).filter(lesson => lesson.queries.length > 0)
            })).filter(module => module.lessons.length > 0)
            : sqlCurriculum;

        // Sort queries by difficulty within each lesson
        return modules.map(module => ({
            ...module,
            lessons: module.lessons.map(lesson => ({
                ...lesson,
                queries: sortByDifficulty(lesson.queries)
            }))
        }));
    }, [searchQuery]);

    const toggleModule = (moduleId: string) => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(moduleId)) {
            newExpanded.delete(moduleId);
        } else {
            newExpanded.add(moduleId);
        }
        setExpandedModules(newExpanded);
    };

    const expandAll = () => {
        setExpandedModules(new Set(sqlCurriculum.map(m => m.id)));
    };

    const collapseAll = () => {
        setExpandedModules(new Set());
    };

    const goToQuery = (queryId: string) => {
        const index = allQueries.findIndex(q => q.query.id === queryId);
        if (index >= 0) {
            navigate(`/practice?q=${index}`);
        }
    };

    const getModuleQueryCount = (moduleId: string) => {
        const module = sqlCurriculum.find(m => m.id === moduleId);
        if (!module) return { total: 0, completed: 0 };
        let total = 0;
        let completed = 0;
        module.lessons.forEach(lesson => {
            lesson.queries.forEach(q => {
                total++;
                if (isCompleted(q.id)) completed++;
            });
        });
        return { total, completed };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-[20%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px]" />
                <div className="absolute top-40 right-[10%] w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl sticky top-0">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                            <img src="/logo.svg" alt="AfterSELECT" className="w-10 h-10 object-contain" />
                            <div className="font-display text-2xl font-bold tracking-tight">
                                <span className="text-blue-600">After</span>
                                <span className="text-orange-500">SELECT</span>
                            </div>
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                                <span className="font-semibold text-green-600">{completedCount}</span>
                                <span>/</span>
                                <span>{totalQueries}</span>
                                <span className="text-slate-400">completed</span>
                            </div>
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-orange-500 transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 relative z-10 container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back to Home</span>
                    </button>

                    <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                        All Queries
                    </h1>
                    <p className="text-slate-600">
                        Browse all {totalQueries} queries organized by topic. Click any query to start practicing.
                    </p>
                </div>

                {/* Search and Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search queries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={expandAll}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Expand All
                        </button>
                        <button
                            onClick={collapseAll}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Collapse All
                        </button>
                    </div>
                </div>

                {/* Query List */}
                <div className="space-y-4">
                    {filteredModules.map((module) => {
                        const { total, completed } = getModuleQueryCount(module.id);
                        const isExpanded = expandedModules.has(module.id);

                        return (
                            <div
                                key={module.id}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                            >
                                {/* Module Header */}
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{module.icon}</span>
                                        <div className="text-left">
                                            <h2 className="font-display font-semibold text-slate-800">{module.title}</h2>
                                            <p className="text-sm text-slate-500">{module.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <div className="text-sm font-medium text-slate-700">
                                                {completed}/{total}
                                            </div>
                                            <div className="text-xs text-slate-400">completed</div>
                                        </div>
                                        <div className={cn(
                                            "w-12 h-1.5 rounded-full overflow-hidden bg-slate-100",
                                            completed === total && total > 0 && "bg-green-100"
                                        )}>
                                            <div
                                                className={cn(
                                                    "h-full transition-all",
                                                    completed === total && total > 0 ? "bg-green-500" : "bg-blue-500"
                                                )}
                                                style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
                                            />
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className="w-5 h-5 text-slate-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                </button>

                                {/* Module Content */}
                                {isExpanded && (
                                    <div className="border-t border-slate-100">
                                        {module.lessons.map((lesson) => (
                                            <div key={lesson.id} className="border-b border-slate-50 last:border-b-0">
                                                {/* Lesson Header */}
                                                <div className="px-5 py-3 bg-slate-50/50">
                                                    <h3 className="font-medium text-slate-700 text-sm">{lesson.title}</h3>
                                                    <p className="text-xs text-slate-500">{lesson.description}</p>
                                                </div>

                                                {/* Queries Grid */}
                                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {lesson.queries.map((query) => {
                                                        const queryInfo = allQueries.find(q => q.query.id === query.id);
                                                        const completed = isCompleted(query.id);

                                                        return (
                                                            <button
                                                                key={query.id}
                                                                onClick={() => goToQuery(query.id)}
                                                                className={cn(
                                                                    "group relative flex items-start gap-3 p-3 rounded-xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5",
                                                                    completed
                                                                        ? "bg-green-50/50 border-green-200 hover:border-green-300"
                                                                        : "bg-white border-slate-200 hover:border-blue-300"
                                                                )}
                                                            >
                                                                {/* Status Icon */}
                                                                <div className={cn(
                                                                    "shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                                                                    completed
                                                                        ? "bg-green-500 text-white"
                                                                        : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                                                                )}>
                                                                    <span>{(queryInfo?.globalIndex ?? 0) + 1}</span>
                                                                </div>

                                                                {/* Query Info */}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium text-sm text-slate-800 truncate group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                                                        {query.title}
                                                                        {completed && <Check className="w-3.5 h-3.5 text-green-600" />}
                                                                    </div>
                                                                    <div
                                                                        className="text-xs text-slate-500 line-clamp-2 mt-0.5"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: query.description.replace(
                                                                                /\*\*([^*]+)\*\*/g,
                                                                                '<strong class="font-semibold text-slate-700">$1</strong>'
                                                                            )
                                                                        }}
                                                                    />
                                                                    <div className="mt-2 flex items-center gap-2">
                                                                        <span className={cn(
                                                                            "inline-block px-2 py-0.5 rounded-full text-[10px] font-medium",
                                                                            query.difficulty === 'beginner' && "bg-green-100 text-green-700",
                                                                            query.difficulty === 'intermediate' && "bg-orange-100 text-orange-700",
                                                                            query.difficulty === 'advanced' && "bg-purple-100 text-purple-700"
                                                                        )}>
                                                                            {query.difficulty}
                                                                        </span>
                                                                    </div>
                                                                </div>


                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {filteredModules.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No queries found matching "{searchQuery}"</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-2 text-blue-600 hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Explore;
