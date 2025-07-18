import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, Loader2, ExternalLink, Menu, X, ChevronRight, AlertCircle, Sparkles, Zap, Eye, Play, Pause } from 'lucide-react';

type ViewType = 'story' | 'dashboard';

interface TableauView {
  id: ViewType;
  title: string;
  description: string;
  url: string;
  embedUrl: string;
  icon: React.ReactNode;
  gradient: string;
  stats: { label: string; value: string; trend: string }[];
}

const tableauViews: TableauView[] = [
  {
    id: 'story',
    title: 'Data Story',
    description: 'Comprehensive narrative of data insights and trends with interactive storytelling',
    url: 'https://public.tableau.com/views/story1_17510783247050/Story1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
    embedUrl: 'https://public.tableau.com/views/story1_17510783247050/Story1?:showVizHome=no&:embed=true&:display_count=no&:showTabs=y',
    icon: <BarChart3 className="w-6 h-6" />,
    gradient: 'from-blue-600 via-purple-600 to-indigo-700',
    stats: [
      { label: 'Data Points', value: '2.4M+', trend: '+12%' },
      { label: 'Insights', value: '47', trend: '+8%' },
      { label: 'Accuracy', value: '98.7%', trend: '+2.1%' }
    ]
  },
  {
    id: 'dashboard',
    title: 'Analytics Dashboard',
    description: 'Interactive dashboard with key performance metrics and real-time insights',
    url: 'https://public.tableau.com/views/Book1_17510781887520/Dashboard2?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
    embedUrl: 'https://public.tableau.com/views/Book1_17510781887520/Dashboard2?:showVizHome=no&:embed=true&:display_count=no&:showTabs=y',
    icon: <TrendingUp className="w-6 h-6" />,
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    stats: [
      { label: 'Metrics', value: '156', trend: '+24%' },
      { label: 'Real-time', value: '99.9%', trend: '+0.2%' },
      { label: 'Performance', value: '4.8/5', trend: '+0.3' }
    ]
  }
];

const FloatingParticle = ({ delay = 0 }: { delay?: number }) => (
  <div 
    className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 animate-pulse"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${3 + Math.random() * 2}s`
    }}
  />
);

const AnimatedCounter = ({ value, duration = 2000 }: { value: string; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const currentValue = numericValue * progress;
      const suffix = value.replace(/[\d.]/g, '');
      setDisplayValue(currentValue.toFixed(1) + suffix);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return <span ref={ref}>{displayValue}</span>;
};

function App() {
  const [activeView, setActiveView] = useState<ViewType>('story');
  const [isLoading, setIsLoading] = useState(true);
  const [embedError, setEmbedError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(true);

  const currentView = tableauViews.find(view => view.id === activeView);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleViewChange = (viewId: ViewType) => {
    if (viewId !== activeView) {
      setIsLoading(true);
      setEmbedError(false);
      setActiveView(viewId);
      setMobileMenuOpen(false);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setEmbedError(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} />
        ))}

        {/* Mouse Follower */}
        <div 
          className="absolute w-6 h-6 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-sm transition-all duration-300 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - 12,
            top: mousePosition.y - 12,
            transform: 'translate3d(0, 0, 0)'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative bg-black/20 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500 group-hover:rotate-12">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Analytics Hub
                </h1>
                <p className="text-sm text-gray-400 flex items-center space-x-2">
                  <span>Advanced Data Visualization Platform</span>
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {tableauViews.map((view, index) => (
                <button
                  key={view.id}
                  onClick={() => handleViewChange(view.id)}
                  className={`
                    group relative flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-500 transform hover:scale-105
                    ${activeView === view.id
                      ? `bg-gradient-to-r ${view.gradient} text-white shadow-lg shadow-blue-500/25`
                      : 'text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                    }
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    {view.icon}
                    {activeView === view.id && (
                      <div className="absolute -inset-1 bg-white/20 rounded-full animate-ping"></div>
                    )}
                  </div>
                  <span>{view.title}</span>
                  {activeView === view.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  )}
                </button>
              ))}
              <a
                href={currentView?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-105"
              >
                <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span>Open in Tableau</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
            >
              <div className="relative">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10 z-50 transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            <div className="px-4 py-6 space-y-4">
              {tableauViews.map((view, index) => (
                <button
                  key={view.id}
                  onClick={() => handleViewChange(view.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-500 hover:scale-105
                    ${activeView === view.id
                      ? `bg-gradient-to-r ${view.gradient} text-white`
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {view.icon}
                  <span>{view.title}</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="relative inline-block">
                <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight animate-pulse">
                  {currentView?.title}
                </h2>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl rounded-full opacity-50"></div>
              </div>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {currentView?.description}
              </p>
            </div>
            
            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {currentView?.stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-500 hover:scale-110 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-white">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                    <div className="text-xs text-green-400 font-medium">{stat.trend}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-gray-300 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Data</span>
              </div>
              <div className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-gray-300 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered Insights</span>
              </div>
              <div className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-gray-300 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Real-time Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Visualization */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative">
          {/* Visualization Container */}
          <div className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 hover:scale-[1.02]">
            <div className="relative">
              {/* Loading State */}
              {isLoading && !embedError && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-3xl">
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                      <div className="absolute inset-0 w-20 h-20 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                      <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-500/30 border-l-emerald-500 rounded-full animate-spin mx-auto" style={{ animationDuration: '2s' }}></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white font-semibold text-lg">Loading Visualization</p>
                      <p className="text-gray-400">Preparing your data insights...</p>
                      <div className="flex justify-center space-x-1 mt-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div 
                            key={i}
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {embedError && (
                <div className="flex items-center justify-center p-20 min-h-[600px]">
                  <div className="text-center space-y-6 max-w-2xl">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <AlertCircle className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl"></div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white">Visualization Preview Unavailable</h3>
                      <p className="text-gray-300 leading-relaxed">
                        Due to Tableau Public's security restrictions, the visualization cannot be embedded directly. 
                        However, you can view the full interactive experience by clicking the button below.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href={currentView?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r ${currentView?.gradient} text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                      >
                        <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span>View Full {currentView?.title}</span>
                      </a>
                      <button
                        onClick={() => {
                          setEmbedError(false);
                          setIsLoading(true);
                        }}
                        className="group inline-flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105"
                      >
                        <Loader2 className="w-5 h-5 group-hover:animate-spin" />
                        <span>Try Again</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tableau Embed */}
              {!embedError && (
                <div className="w-full" style={{ height: 'calc(100vh - 200px)', minHeight: '700px' }}>
                  <iframe
                    src={currentView?.embedUrl}
                    className="w-full h-full border-0 rounded-3xl"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    title={`Tableau ${currentView?.title}`}
                    allow="fullscreen"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                  />
                </div>
              )}
            </div>

            {/* Enhanced Footer Info */}
            <div className="px-8 py-6 bg-black/20 backdrop-blur-sm border-t border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className={`relative w-12 h-12 bg-gradient-to-r ${currentView?.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {currentView?.icon}
                    <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <p className="text-white font-semibold flex items-center space-x-2">
                      <span>Interactive {currentView?.title}</span>
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
                      >
                        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </button>
                    </p>
                    <p className="text-gray-400 text-sm">Powered by Tableau Public</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2 hover:text-white transition-colors duration-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Live Data</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:text-white transition-colors duration-200">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Real-time Updates</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:text-white transition-colors duration-200">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Interactive</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:text-white transition-colors duration-200">
                    <Eye className="w-3 h-3" />
                    <span>1.2k views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {tableauViews.map((view, index) => (
              <div
                key={view.id}
                className={`group relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl border transition-all duration-700 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden ${
                  activeView === view.id 
                    ? `border-white/30 bg-white/10 shadow-lg` 
                    : 'border-white/10 hover:bg-white/10'
                }`}
                onClick={() => handleViewChange(view.id)}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${view.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`relative w-16 h-16 bg-gradient-to-r ${view.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6`}>
                      {view.icon}
                      <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                        {view.title}
                      </h3>
                      {activeView === view.id && (
                        <div className="flex items-center space-x-2 mt-2 animate-fade-in">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-green-400 font-medium">Currently Active</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {view.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {view.stats.map((stat, statIndex) => (
                      <div 
                        key={stat.label}
                        className="text-center p-3 bg-white/5 rounded-lg group-hover:bg-white/10 transition-all duration-300"
                        style={{ animationDelay: `${statIndex * 0.1}s` }}
                      >
                        <div className="text-lg font-bold text-white">
                          <AnimatedCounter value={stat.value} />
                        </div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <a
                      href={view.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4 group-hover/link:rotate-12 transition-transform duration-300" />
                      <span>Open in Tableau</span>
                    </a>
                    {activeView !== view.id && (
                      <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-105 flex items-center space-x-1">
                        <span>Switch to this view</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-all duration-500"></div>
              </div>
            ))}
          </div>

          {/* Enhanced Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <div className="group relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 hover:shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                    <BarChart3 className="w-8 h-8 text-white" />
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                    Interactive Features
                  </h3>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  Explore comprehensive data insights with advanced interactive capabilities, dynamic filtering, and intuitive drill-down functionality.
                </p>
                <ul className="space-y-3 text-gray-400">
                  {[
                    { icon: 'blue', text: 'Dynamic zoom and pan controls' },
                    { icon: 'purple', text: 'Advanced filtering and sorting' },
                    { icon: 'teal', text: 'Rich tooltips and data details' }
                  ].map((item, index) => (
                    <li 
                      key={index}
                      className="flex items-center space-x-3 group-hover:text-gray-300 transition-all duration-300 hover:translate-x-2"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`w-2 h-2 bg-${item.icon}-400 rounded-full animate-pulse`}></div>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="group relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 hover:shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                    <TrendingUp className="w-8 h-8 text-white" />
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-emerald-400 group-hover:to-teal-400 transition-all duration-300">
                    Advanced Analytics
                  </h3>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  Discover actionable insights through sophisticated data analysis, trend identification, and predictive modeling capabilities.
                </p>
                <ul className="space-y-3 text-gray-400">
                  {[
                    { icon: 'emerald', text: 'Real-time data synchronization' },
                    { icon: 'teal', text: 'Professional-grade analytics' },
                    { icon: 'cyan', text: 'Export and sharing capabilities' }
                  ].map((item, index) => (
                    <li 
                      key={index}
                      className="flex items-center space-x-3 group-hover:text-gray-300 transition-all duration-300 hover:translate-x-2"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`w-2 h-2 bg-${item.icon}-400 rounded-full animate-pulse`}></div>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative bg-black/20 backdrop-blur-xl border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-4 mb-6 group">
              <div className="relative w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                <BarChart3 className="w-7 h-7 text-white" />
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Analytics Hub
              </h3>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Empowering data-driven decisions through advanced visualization and analytics. 
              Built with cutting-edge technology for seamless insights delivery.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">Privacy</span>
              <span className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">Terms</span>
              <span className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">Support</span>
            </div>
            <div className="pt-6 border-t border-white/10">
              <p className="text-gray-500 text-sm">
                &copy; 2025 Analytics Hub. Visualizations powered by Tableau Public.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;