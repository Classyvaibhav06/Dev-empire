import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Circle, PlayCircle, FolderOpen, Loader2, Lightbulb, Target, BookOpen, AlertCircle } from 'lucide-react';

export default function TopicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [prevTopic, setPrevTopic] = useState(null);
  const [nextTopic, setNextTopic] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/roadmap')
      .then(res => res.json())
      .then(data => {
        let foundTopic = null;
        let pTopic = null;
        let nTopic = null;
        
        // Flatten topics for easier prev/next navigation
        const allTopics = [];
        data.sections.forEach(section => {
          section.topics.forEach(t => allTopics.push(t));
        });

        const currentIndex = allTopics.findIndex(t => t.id === id);
        
        if (currentIndex !== -1) {
          foundTopic = allTopics[currentIndex];
          if (currentIndex > 0) pTopic = allTopics[currentIndex - 1];
          if (currentIndex < allTopics.length - 1) nTopic = allTopics[currentIndex + 1];
        }
        
        if (foundTopic) {
          setTopic(foundTopic);
          setPrevTopic(pTopic);
          setNextTopic(nTopic);
          const saved = localStorage.getItem('codepath_completed');
          if (saved) {
            const completedTopics = JSON.parse(saved);
            setIsCompleted(completedTopics.includes(id));
          }
        } else {
          navigate('/roadmap');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, navigate]);

  const toggleComplete = () => {
    const saved = localStorage.getItem('codepath_completed');
    let completedTopics = saved ? JSON.parse(saved) : [];
    
    if (isCompleted) {
      completedTopics = completedTopics.filter(tId => tId !== id);
    } else {
      completedTopics.push(id);
    }
    
    localStorage.setItem('codepath_completed', JSON.stringify(completedTopics));
    setIsCompleted(!isCompleted);
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!topic) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-in fade-in duration-500">
      {/* Back Button */}
      <Link to="/roadmap" className="inline-flex items-center gap-2 text-textMuted hover:text-textMain transition-colors mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 font-medium text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to Roadmap
      </Link>

      {/* Header Section */}
      <div className="bg-white border border-gray-100 shadow-md p-8 sm:p-10 rounded-3xl mb-10 flex flex-col md:flex-row md:items-start justify-between gap-8 transform transition-all relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
            <BookOpen className="w-4 h-4" />
            Learning Module
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-textMain tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {topic.title}
          </h1>
          <p className="text-lg text-textMuted max-w-2xl leading-relaxed">{topic.description}</p>
        </div>
        
        <button 
          onClick={toggleComplete}
          className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold transition-all shadow-sm hover:shadow-md text-sm relative z-10 w-full md:w-auto ${
            isCompleted 
              ? 'bg-green-50 text-success border-2 border-green-200 hover:bg-green-100' 
              : 'bg-textMain text-white hover:bg-gray-800 border-2 border-transparent'
          }`}
        >
          {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
          {isCompleted ? 'Module Completed' : 'Mark as Complete'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Key Concepts (If available) */}
          {topic.keyConcepts && topic.keyConcepts.length > 0 && (
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-50 p-2 rounded-xl">
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-textMain tracking-tight">Key Concepts</h2>
              </div>
              <ul className="space-y-3 pl-2">
                {topic.keyConcepts.map((concept, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-textMain text-sm leading-relaxed">{concept}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Videos Section */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-blue-50 p-2 rounded-xl">
                <PlayCircle className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-textMain tracking-tight">Video Tutorials</h2>
            </div>
            
            <div className="space-y-6">
              {topic.videos.map((video, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video relative">
                    <iframe
                      width="100%"
                      height="100%"
                      src={video}
                      title={`${topic.title} video ${idx + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full absolute inset-0"
                    ></iframe>
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-textMain">Tutorial {idx + 1}</span>
                    <span className="text-xs font-medium text-textMuted bg-white px-2 py-1 rounded border border-gray-200">YouTube</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Project Section */}
          {topic.project && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-purple-50 p-2 rounded-xl">
                  <FolderOpen className="w-5 h-5 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold text-textMain tracking-tight">Practice Project</h2>
              </div>
              
              <div className="bg-gradient-to-br from-white to-purple-50/30 border border-gray-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-400"></div>
                <div className="pl-3">
                  <h3 className="text-xl font-bold mb-3 text-textMain">{topic.project.title}</h3>
                  <p className="text-textMuted leading-relaxed text-sm">{topic.project.description}</p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pro Tips */}
          {topic.tips && (
            <div className="bg-yellow-50/50 border border-yellow-100 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold text-textMain">Pro Tip</h3>
              </div>
              <p className="text-sm text-textMuted leading-relaxed">{topic.tips}</p>
            </div>
          )}

          {/* Common Mistakes */}
          {topic.mistakes && (
            <div className="bg-red-50/50 border border-red-100 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-textMain">Common Mistakes</h3>
              </div>
              <p className="text-sm text-textMuted leading-relaxed">{topic.mistakes}</p>
            </div>
          )}
          
          {/* Status Box */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-textMain mb-4 text-sm uppercase tracking-wider">Your Progress</h3>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-success' : 'bg-gray-300'}`}></div>
              <span className="text-sm font-medium text-textMuted">
                {isCompleted ? 'You have completed this module.' : 'Not completed yet.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevTopic ? (
          <Link to={`/topic/${prevTopic.id}`} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white px-6 py-3.5 rounded-full border border-gray-200 text-textMain hover:bg-gray-50 transition-all font-semibold shadow-sm text-sm">
            <ArrowLeft className="w-4 h-4" />
            Previous Module
          </Link>
        ) : (
          <div></div> // Spacer
        )}

        {nextTopic ? (
          <Link to={`/topic/${nextTopic.id}`} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary px-6 py-3.5 rounded-full text-white hover:bg-primary-hover transition-all font-semibold shadow-sm text-sm">
            Next Module
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link to="/roadmap" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-success text-white px-6 py-3.5 rounded-full hover:bg-success/90 transition-all font-semibold shadow-sm text-sm">
            Finish Course
            <CheckCircle className="w-4 h-4" />
          </Link>
        )}
      </div>

    </div>
  );
}
