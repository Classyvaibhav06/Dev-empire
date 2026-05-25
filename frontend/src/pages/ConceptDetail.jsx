import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Code2,
  GitBranch,
  Layers,
  Lightbulb,
  Sparkles,
  Target,
  Terminal,
  X,
  Loader2,
  Send,
  MessageSquare
} from 'lucide-react';
import { Badge, Card } from '../components/ui/Shared';
import { getConceptDetail } from '../utils/topicContent';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

function RoadmapNode({ children, active = false, muted = false, tone = 'default', targetId, details, onShowDetails }) {
  const toneClasses = {
    default: 'border-surfaceBorder bg-surface text-textMain hover:border-surfaceBorderHover shadow-sm hover:shadow',
    primary: 'border-primary bg-primary text-white hover:bg-primary-hover shadow-md',
    success: 'border-success/30 bg-surface text-success hover:border-success shadow-sm hover:shadow',
    warning: 'border-warning/30 bg-surface text-warning hover:border-warning shadow-sm hover:shadow',
    danger: 'border-danger/30 bg-surface text-danger hover:border-danger shadow-sm hover:shadow',
    accent: 'border-accent/30 bg-surface text-accent hover:border-accent shadow-sm hover:shadow'
  };

  const handleClick = () => {
    if (onShowDetails && details) {
      onShowDetails(details);
    }
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`w-full rounded-md border-2 px-4 py-3 text-center text-sm font-semibold leading-snug min-h-14 flex items-center justify-center transition-all duration-200 ${
        active ? toneClasses.primary : toneClasses[tone]
      } ${muted ? 'opacity-75' : ''} cursor-pointer`}
    >
      {children}
    </button>
  );
}

function Connector({ vertical = false }) {
  return vertical ? (
    <div className="mx-auto h-8 w-px bg-surfaceBorder" />
  ) : (
    <div className="hidden md:block h-px w-full bg-surfaceBorder" />
  );
}

function RoadmapStyleDiagram({ concept, onShowDetails }) {
  let steps = concept.diagram.steps || concept.diagram.nodes || concept.diagram.lanes || [];
  if (concept.diagram.type === 'tree' && steps.length === 0) {
    steps = [];
    if (concept.diagram.root) steps.push(concept.diagram.root);
    if (concept.diagram.children) {
      concept.diagram.children.forEach((child) => {
        steps.push(typeof child === 'string' ? child : child.label);
      });
    }
  } else if (concept.diagram.type === 'box' && steps.length === 0 && concept.diagram.layers) {
    steps = concept.diagram.layers.map((layer) => layer.label);
  }
  const readableSteps = Array.isArray(steps[0]) ? steps.map((step) => step[1]) : steps;
  const primarySteps = readableSteps.slice(0, 4);
  const supportNodes = concept.anatomy.slice(0, 4);
  const ruleNodes = concept.rules.slice(0, 3);

  const getMiddleColumnTitle = () => {
    if (concept.diagram.type === 'tree') return 'Hierarchy';
    if (concept.diagram.type === 'box') return 'Layers';
    return 'Flow';
  };

  return (
    <div className="rounded-xl border border-surfaceBorder bg-surfaceLight p-5 md:p-8 overflow-x-auto">
      <div className="min-w-[760px]">
        <div className="flex items-center justify-center mb-2">
          <RoadmapNode 
            tone="accent" 
            targetId="why-it-matters"
            onShowDetails={onShowDetails}
            details={{
              title: concept.topic.title,
              category: "Learning Module",
              content: `You are studying the "${concept.topic.title}" module. This curriculum path covers critical skills required to build complete, production-grade applications. Master each individual concept and concept check to track your score.`
            }}
          >
            {concept.topic.title}
          </RoadmapNode>
        </div>
        <Connector vertical />

        <div className="grid grid-cols-[1fr_48px_1fr_48px_1fr] items-center">
          <RoadmapNode 
            tone="success" 
            targetId="why-it-matters"
            onShowDetails={onShowDetails}
            details={{
              title: "Prerequisites & Core Importance",
              category: "Pre-Learning Context",
              content: `Before working with ${concept.title}, it is crucial to understand the problems it solves and the value it adds. Establishing this baseline context early prevents engineering mistakes down the line.\n\nHere are the primary reasons why this concept is a vital part of your toolkit:`,
              list: concept.whyItMatters
            }}
          >
            Prerequisite idea
          </RoadmapNode>
          <Connector />
          <RoadmapNode 
            active 
            targetId="why-it-matters"
            onShowDetails={onShowDetails}
            details={{
              title: concept.title,
              category: "Core Concept Detail",
              content: `${concept.summary}\n\n${concept.explanation.join('\n\n')}`
            }}
          >
            {concept.title}
          </RoadmapNode>
          <Connector />
          <RoadmapNode 
            tone="warning" 
            targetId="practice-section"
            onShowDetails={onShowDetails}
            details={{
              title: `Hands-On Practice: ${concept.title}`,
              category: "Practical Application",
              content: `Theory alone is not enough. To truly master ${concept.title}, you need to write code. Open your editor and implement this concept by completing these specific tasks in your workspace:`,
              list: concept.practiceTasks
            }}
          >
            Use in project
          </RoadmapNode>
        </div>

        <div className="grid grid-cols-3 gap-10 mt-8">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-textDim text-center mb-3">Anatomy</div>
            <div className="space-y-3">
              {supportNodes.map((node) => {
                const detailedPart = concept.anatomy.find(p => p.label === node.label) || node;
                return (
                  <RoadmapNode 
                    key={node.label} 
                    targetId="anatomy-section"
                    onShowDetails={onShowDetails}
                    details={{
                      title: node.label,
                      category: "Component Anatomy",
                      content: `Structure Breakdown:\n\n${detailedPart.detail}\n\nUnderstanding the individual components of a structure is key to debugging layout or server faults. Each element acts as a building block for the larger concept.`
                    }}
                  >
                    {node.label}
                  </RoadmapNode>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-textDim text-center mb-3">{getMiddleColumnTitle()}</div>
            <div className="space-y-0">
              {primarySteps.map((step, index) => (
                <React.Fragment key={step}>
                  <RoadmapNode 
                    tone={index === 0 ? 'accent' : 'default'} 
                    targetId="walkthrough-section"
                    onShowDetails={onShowDetails}
                    details={{
                      title: `Step ${index + 1}: ${step}`,
                      category: "Learning Flow Step",
                      content: `To implement this stage of the learning path, focus on the following guidelines:\n\n${concept.walkthrough[index] || "Apply this walkthrough step in your sandbox build."}\n\nVerify that the output matches the expected behavior before proceeding to the next node.`
                    }}
                  >
                    {step}
                  </RoadmapNode>
                  {index < primarySteps.length - 1 && <Connector vertical />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-textDim text-center mb-3">Rules</div>
            <div className="space-y-3">
              {ruleNodes.map((rule, index) => (
                <RoadmapNode 
                  key={rule} 
                  tone={index === 0 ? 'danger' : 'default'} 
                  targetId="rules-section"
                  onShowDetails={onShowDetails}
                  details={{
                    title: `Rule Guideline ${index + 1}`,
                    category: "Core Best Practice",
                    content: `Guideline Specification:\n\n"${rule}"\n\nAdhering to code boundaries keeps projects scaleable. Ensure your design avoids the following common developer mistakes:\n\n${concept.mistakes.map(m => `• Avoid: "${m.title}" | Solution: ${m.fix}`).join('\n')}`
                  }}
                >
                  {rule.length > 54 ? `${rule.slice(0, 54)}...` : rule}
                </RoadmapNode>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-[1fr_48px_1fr_48px_1fr] items-center">
          <RoadmapNode 
            tone="success" 
            targetId="walkthrough-section"
            onShowDetails={onShowDetails}
            details={{
              title: "Study Material & Guides",
              category: "Self-Guided Reading",
              content: `To build a strong theoretical foundation, review the documentation, mental models, and step-by-step guides listed on this page.\n\nKey Concepts Covered:\n${concept.walkthrough.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}`
            }}
          >
            Read docs
          </RoadmapNode>
          <Connector />
          <RoadmapNode 
            tone="accent" 
            targetId="example-section"
            onShowDetails={onShowDetails}
            details={{
              title: "Sandbox Prototype Code",
              category: "Code Reference",
              content: "Study and modify the implementation example below. Running isolated prototypes in a sandbox environments is the fastest way to gain muscle memory:",
              code: concept.example
            }}
          >
            Build mini example
          </RoadmapNode>
          <Connector />
          <RoadmapNode 
            tone="warning" 
            targetId="mastery-section"
            onShowDetails={onShowDetails}
            details={{
              title: "Mastery Self-Assessment",
              category: "Skill Checklist",
              content: "Verify your learning. Make sure you can confidently demonstrate, write, or explain each of the checkpoints below without looking at the reference guide:",
              list: concept.checkpoints
            }}
          >
            Explain without notes
          </RoadmapNode>
        </div>
      </div>
    </div>
  );
}

function ConceptDiagram({ concept, onShowDetails }) {
  return (
    <div className="surface rounded-xl p-6 border border-surfaceBorder">
      <div className="flex items-center gap-2 mb-6">
        <GitBranch className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-black">Roadmap View</h2>
      </div>
      <RoadmapStyleDiagram concept={concept} onShowDetails={onShowDetails} />
    </div>
  );
}

export default function ConceptDetail() {
  const { id, conceptIndex } = useParams();
  const { token, updateUserStats } = React.useContext(AuthContext);
  const concept = getConceptDetail(id, conceptIndex);
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);
  const [activeNodeDetail, setActiveNodeDetail] = React.useState(null);
  const [toastMessage, setToastMessage] = React.useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShowNodeDetails = (details) => {
    setActiveNodeDetail(details);
  };

  const handleSelectAnswer = async (index) => {
    if (selectedAnswer !== null) return; // Prevent multiple submissions
    setSelectedAnswer(index);
    try {
      const savedScores = localStorage.getItem('concept_scores') ? JSON.parse(localStorage.getItem('concept_scores')) : {};
      const key = `${id}_concept_${conceptIndex}`;
      const isCorrect = index === concept.test.answer;
      savedScores[key] = {
        score: isCorrect ? 1 : 0,
        selected: index,
        conceptTitle: concept.title,
        topicId: id,
        topicTitle: concept.topic.title,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('concept_scores', JSON.stringify(savedScores));
      showToast(isCorrect ? "🎉 Concept Check Passed!" : "❌ Concept Check Failed. Review and retry.");

      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/user/concept-score`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              conceptKey: key,
              score: isCorrect ? 1 : 0,
              selectedOption: index,
              conceptTitle: concept.title,
              topicId: id,
              topicTitle: concept.topic.title
            })
          });
          if (res.ok) {
            const result = await res.json();
            if (result.xpAdded > 0) {
              updateUserStats(result.newXp, result.newLevel);
              showToast(`🎉 Concept Check Passed! +${result.xpAdded} XP Earned!`);
            }
          }
        } catch (e) {
          console.error('Failed to sync concept score to DB:', e);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    setSelectedAnswer(null);
  }, [id, conceptIndex]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full animate-fade-in relative z-10">
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm py-4 flex items-center justify-between mb-8 border-b border-surfaceBorder -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-textMuted">
          <Link to="/roadmap" className="hover:text-primary transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Roadmaps
          </Link>
          <span className="text-surfaceBorder">/</span>
          <Link to={`/topic/${id}`} className="hover:text-primary transition-colors">{concept.topic.title}</Link>
          <span className="text-surfaceBorder">/</span>
          <span className="text-textMain truncate max-w-[150px] sm:max-w-none">{concept.title}</span>
        </div>
        <Badge variant="accent" className="shrink-0">Concept {concept.index + 1}</Badge>
      </div>

      <section className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Badge variant="primary">{concept.topic.title}</Badge>
          <Badge variant="success">Deep Dive</Badge>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-5 text-textMain">{concept.title}</h1>
        <p className="text-lg text-textMuted leading-relaxed max-w-3xl">{concept.summary}</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <main className="lg:col-span-3 space-y-10">
          <Card hover={false} className="!bg-primary/5 border-primary/20">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-black mb-4">Detailed Explanation</h2>
                <div className="space-y-4">
                  {concept.explanation.map((paragraph) => (
                    <p key={paragraph} className="text-sm text-textMuted leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <ConceptDiagram concept={concept} onShowDetails={handleShowNodeDetails} />

          <section id="why-it-matters">
            <h2 className="text-xl font-black mb-5 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Why This Concept Matters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {concept.whyItMatters.map((item) => (
                <div key={item} className="surface rounded-xl p-5 flex gap-4 border border-surfaceBorder">
                  <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-textMuted leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="anatomy-section">
            <h2 className="text-xl font-black mb-5 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Anatomy of the Concept
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {concept.anatomy.map((part) => (
                <div key={part.label} className="surface rounded-xl p-5 border border-surfaceBorder">
                  <p className="text-sm font-black mb-2 text-textMain">{part.label}</p>
                  <p className="text-sm text-textMuted leading-relaxed">{part.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="rules-section">
            <h2 className="text-xl font-black mb-5 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Rules You Should Remember
            </h2>
            <div className="space-y-3">
              {concept.rules.map((rule) => (
                <div key={rule} className="surface border border-surfaceBorder rounded-xl p-4 flex gap-4">
                  <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-textMuted leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="walkthrough-section">
            <h2 className="text-xl font-black mb-5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Step-by-Step Learning Path
            </h2>
            <div className="space-y-4">
              {concept.walkthrough.map((step, index) => (
                <Card key={step} hover={false} className="!p-5">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold mb-1">Step {index + 1}</h3>
                      <p className="text-sm text-textMuted leading-relaxed">{step}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section id="example-section">
            <h2 className="text-xl font-black mb-5 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-accent" />
              Example You Can Study
            </h2>
            <pre className="overflow-x-auto rounded-xl bg-surfaceLight border border-surfaceBorder p-6 text-xs text-accent font-mono leading-relaxed">
              <code>{concept.example}</code>
            </pre>
          </section>

          {concept.test && (
            <section className="animate-fade-in">
              <h2 className="text-xl font-black mb-5 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-warning" />
                Concept Check
              </h2>
              <Card hover={false} className="!p-6 border-warning/20 bg-warning/5">
                <h3 className="text-base font-bold mb-6 text-textMain">{concept.test.question}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {concept.test.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === concept.test.answer;

                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectAnswer(index)}
                        className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? isCorrect
                              ? 'bg-success/10 border-success text-success'
                              : 'bg-danger/10 border-danger text-danger'
                            : 'surface border-surfaceBorder hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-semibold text-sm">{option}</span>
                          {isSelected && (isCorrect ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />)}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedAnswer !== null && (
                  <div className="mt-6 p-4 rounded-xl bg-surface border border-surfaceBorder text-sm text-textMuted leading-relaxed animate-slide-up">
                    <span className="font-bold text-textMain">{selectedAnswer === concept.test.answer ? '🎉 Correct!' : '❌ Review and try again.'}</span>{' '}
                    {concept.test.explanation}
                  </div>
                )}
              </Card>
            </section>
          )}
        </main>

        <aside className="space-y-8">
          <Card hover={false} className="!p-6" id="practice-section">
            <div className="flex items-center gap-3 mb-5">
              <Sparkles className="w-5 h-5 text-warning" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-textDim">Practice</h2>
            </div>
            <div className="space-y-4">
              {concept.practiceTasks.map((task) => (
                <div key={task} className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <p className="text-xs text-textMuted leading-relaxed">{task}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card hover={false} className="!p-6 !bg-danger/5 border-danger/20">
            <div className="flex items-center gap-3 mb-5">
              <AlertCircle className="w-5 h-5 text-danger" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-danger">Avoid These</h2>
            </div>
            <div className="space-y-5">
              {concept.mistakes.map((mistake) => (
                <div key={mistake.title}>
                  <p className="text-sm font-bold mb-1">{mistake.title}</p>
                  <p className="text-xs text-textMuted leading-relaxed">{mistake.fix}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card hover={false} className="!p-6" id="mastery-section">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-5 h-5 text-primary" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-textDim">Mastery Check</h2>
            </div>
            <div className="space-y-3">
              {concept.checkpoints.map((checkpoint) => (
                <div key={checkpoint} className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-textMuted leading-relaxed">{checkpoint}</p>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>

      {/* ── NODE DETAILS SIDEBAR DRAWER (roadmap.sh style) ── */}
      {activeNodeDetail && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-textMain/40 transition-opacity duration-300 opacity-100 animate-fade-in"
            onClick={() => setActiveNodeDetail(null)}
          />
          <ConceptDrawerContent 
            activeNodeDetail={activeNodeDetail}
            setActiveNodeDetail={setActiveNodeDetail}
            concept={concept}
          />
        </>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[200] bg-surface border border-surfaceBorder shadow-xl rounded-md px-6 py-4 flex items-center gap-3 animate-slide-up">
          <span className="text-sm font-bold text-textMain">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

function formatMessageContent(text) {
  if (!text) return null;

  // First, split by code blocks: ```language ... ```
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, partIndex) => {
    // 1. If it's a code block
    if (part.startsWith('```')) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : '';
      const code = match ? match[2] : part.slice(3, -3);

      return (
        <pre key={partIndex} className="bg-background border border-surfaceBorder rounded-xl p-4 font-mono text-xs my-3 overflow-x-auto text-accent animate-scale-in">
          {language && <div className="text-[9px] uppercase tracking-widest text-textDim font-bold mb-2">{language}</div>}
          <code>{code.trim()}</code>
        </pre>
      );
    }

    // 2. Process regular text line-by-line, grouping consecutive list items
    const lines = part.split('\n');
    const elements = [];
    let currentList = null; // { type: 'ul' | 'ol', items: [] }

    const flushList = (key) => {
      if (currentList) {
        if (currentList.type === 'ul') {
          elements.push(
            <ul key={`ul-${key}`} className="list-disc pl-5 my-2 text-sm text-textMuted leading-relaxed space-y-1">
              {currentList.items.map((item, idx) => (
                <li key={idx}>{renderInlineFormatting(item)}</li>
              ))}
            </ul>
          );
        } else if (currentList.type === 'ol') {
          elements.push(
            <ol key={`ol-${key}`} className="list-decimal pl-5 my-2 text-sm text-textMuted leading-relaxed space-y-1">
              {currentList.items.map((item, idx) => (
                <li key={idx} value={item.num}>{renderInlineFormatting(item.content)}</li>
              ))}
            </ol>
          );
        }
        currentList = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        flushList(i);
        if (elements.length > 0 && i < lines.length - 1 && lines[i+1].trim()) {
          elements.push(<div key={`space-${i}`} className="h-2" />);
        }
        continue;
      }

      // Headings
      if (trimmed.startsWith('### ')) {
        flushList(i);
        elements.push(
          <h4 key={`h4-${i}`} className="text-sm font-black text-textMain mt-4 mb-1">
            {renderInlineFormatting(trimmed.slice(4))}
          </h4>
        );
        continue;
      }
      if (trimmed.startsWith('## ')) {
        flushList(i);
        elements.push(
          <h3 key={`h3-${i}`} className="text-base font-black text-textMain mt-5 mb-1.5">
            {renderInlineFormatting(trimmed.slice(3))}
          </h3>
        );
        continue;
      }
      if (trimmed.startsWith('# ')) {
        flushList(i);
        elements.push(
          <h2 key={`h2-${i}`} className="text-lg font-black text-textMain mt-6 mb-2">
            {renderInlineFormatting(trimmed.slice(2))}
          </h2>
        );
        continue;
      }

      // Bullet lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const itemContent = trimmed.slice(2);
        if (currentList && currentList.type === 'ul') {
          currentList.items.push(itemContent);
        } else {
          flushList(i);
          currentList = { type: 'ul', items: [itemContent] };
        }
        continue;
      }

      // Numbered lists
      const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        const num = parseInt(numMatch[1], 10);
        const itemContent = numMatch[2];
        if (currentList && currentList.type === 'ol') {
          currentList.items.push({ num, content: itemContent });
        } else {
          flushList(i);
          currentList = { type: 'ol', items: [{ num, content: itemContent }] };
        }
        continue;
      }

      // Default paragraph
      flushList(i);
      elements.push(
        <p key={`p-${i}`} className="text-sm leading-relaxed text-textMuted mb-2">
          {renderInlineFormatting(trimmed)}
        </p>
      );
    }

    flushList(lines.length);
    return <div key={partIndex}>{elements}</div>;
  });
}

function renderInlineFormatting(text) {
  // Split by inline code: `code`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((codePart, codeIndex) => {
    if (codePart.startsWith('`') && codePart.endsWith('`')) {
      return (
        <code key={codeIndex} className="bg-background border border-surfaceBorder px-1.5 py-0.5 rounded text-accent font-mono text-[11px] mx-0.5">
          {codePart.slice(1, -1)}
        </code>
      );
    }

    // Split by bold: **bold**
    const boldParts = codePart.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((boldPart, boldIndex) => {
      if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
        return (
          <strong key={boldIndex} className="font-extrabold text-textMain">
            {boldPart.slice(2, -2)}
          </strong>
        );
      }
      return boldPart;
    });
  });
}

function ConceptDrawerContent({ activeNodeDetail, setActiveNodeDetail, concept }) {
  const [drawerTab, setDrawerTab] = React.useState('resources');
  const [chatHistory, setChatHistory] = React.useState([]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const getSystemPrompt = () => {
    return `You are the Dev Empire AI Study Mentor, an expert programming assistant specializing in "${concept.topic.title}".
Your goal is to help students master the concept "${concept.title}" and specifically understand this sub-component: "${activeNodeDetail.title}".

Context of this sub-component:
- Concept Name: ${concept.title}
- Sub-component Title: ${activeNodeDetail.title}
- Sub-component Category: ${activeNodeDetail.category}
- Context/Details: ${activeNodeDetail.content || ''}

Guide the student step-by-step. Keep explanations clear, engaging, and in line with this context. Respond using markdown formatting.`;
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isGenerating) return;

    const userMsgText = inputMessage;
    setInputMessage('');
    setIsGenerating(true);

    const newUserMsg = { role: 'user', content: userMsgText };
    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);

    const newAssistantMsg = { role: 'assistant', content: '' };
    setChatHistory((prev) => [...prev, newAssistantMsg]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [
            { role: 'system', content: getSystemPrompt() },
            ...updatedHistory
          ],
          mode: 'fast'
        })
      });

      if (!response.ok) throw new Error('Failed to connect to AI');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              setChatHistory((prev) => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'assistant') {
                  return [
                    ...prev.slice(0, -1),
                    { ...last, content: last.content + (data.content || '') }
                  ];
                }
                return prev;
              });
            } catch (err) {
              console.error(err);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            { ...last, content: 'Sorry, I encountered an error. Please try again.' }
          ];
        }
        return prev;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 z-[100] w-full max-w-lg bg-surface border-l border-surfaceBorder shadow-2xl flex flex-col transition-transform duration-300 translate-x-0 animate-slide-up">
      {/* Tabbed Header */}
      <div className="p-4 border-b border-surfaceBorder flex items-center justify-between bg-surfaceLight shrink-0">
        <div className="flex bg-background border border-surfaceBorder rounded-lg p-0.5 select-none">
          <button
            onClick={() => setDrawerTab('resources')}
            className={`px-4 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              drawerTab === 'resources'
                ? 'bg-surfaceLight text-textMain border border-surfaceBorder shadow-sm'
                : 'text-textDim hover:text-textMuted'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Resources
          </button>
          <button
            onClick={() => setDrawerTab('tutor')}
            className={`px-4 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              drawerTab === 'tutor'
                ? 'bg-surfaceLight text-textMain border border-surfaceBorder shadow-sm'
                : 'text-textDim hover:text-textMuted'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            AI Tutor
          </button>
        </div>

        <button 
          onClick={() => {
            setActiveNodeDetail(null);
            setDrawerTab('resources');
          }}
          className="p-2 rounded-full hover:bg-surfaceHover text-textMuted hover:text-textMain transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/25">
        {drawerTab === 'resources' ? (
          <>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-primary mb-2 block">
                {activeNodeDetail.category}
              </span>
              <h1 className="text-3xl font-black tracking-tight text-textMain">{activeNodeDetail.title}</h1>
              {activeNodeDetail.content && (
                <div className="space-y-4 text-sm text-textMuted leading-relaxed mt-4">
                  {formatMessageContent(activeNodeDetail.content)}
                </div>
              )}
            </div>

            {/* List items if any */}
            {activeNodeDetail.list && activeNodeDetail.list.length > 0 && (
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-textDim mb-3">Key Details</h4>
                <div className="space-y-3">
                  {activeNodeDetail.list.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start text-sm text-textMuted bg-surface border border-surfaceBorder p-4 rounded-xl">
                      <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Code example if any */}
            {activeNodeDetail.code && (
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-textDim mb-3">Code Snippet</h4>
                <pre className="overflow-x-auto rounded-xl bg-surface border border-surfaceBorder p-5 text-xs text-accent font-mono leading-relaxed max-h-[300px]">
                  <code>{activeNodeDetail.code}</code>
                </pre>
              </section>
            )}

            {/* Resources list */}
            {concept.resources && concept.resources.length > 0 && (
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-textDim mb-3">Recommended Resources</h4>
                <div className="grid grid-cols-1 gap-2">
                  {concept.resources.map((res, index) => (
                    <a 
                      key={index}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 bg-surface border border-surfaceBorder rounded-xl hover:border-primary group transition-all text-xs"
                    >
                      <span className="font-semibold text-textMuted group-hover:text-primary transition-colors flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-textMuted" />
                        {res.name}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-textDim font-bold bg-surfaceHover px-2 py-0.5 rounded border border-surfaceBorder">
                        {res.type || 'Article'}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          /* AI Tutor Chat */
          <div className="h-full flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[300px]">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none opacity-80 py-16">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm mb-1 text-textMain">Concept Study Mentor</h4>
                  <p className="text-xs text-textMuted max-w-xs leading-relaxed">
                    Ask any questions about "{activeNodeDetail.title}". I'll guide you step-by-step through this component.
                  </p>
                </div>
              ) : (
                chatHistory.map((msg, index) => (
                  <div 
                    key={index}
                    className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
                  >
                    <span className={`text-[9px] font-black uppercase tracking-wider text-textDim mb-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.role === 'user' ? 'Student' : 'Mentor'}
                    </span>
                    <div 
                      className={`p-3.5 border rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-primary/5 border-primary/20 text-textMain rounded-tr-sm'
                          : 'bg-surface border-surfaceBorder text-textMain rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {msg.role === 'assistant' && !msg.content ? (
                        <div className="flex items-center gap-1 text-textDim py-1 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-textDim animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-textDim animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-textDim animate-bounce"></div>
                        </div>
                      ) : (
                        msg.role === 'user' ? <p className="text-xs whitespace-pre-wrap">{msg.content}</p> : formatMessageContent(msg.content)
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSendChat} className="flex gap-2 border-t border-surfaceBorder pt-4 mt-4 shrink-0 bg-surface/40 p-2 rounded-xl">
              <input 
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isGenerating}
                placeholder="Ask about this component..."
                className="flex-1 px-4 py-2.5 bg-background border border-surfaceBorder rounded-full text-xs text-textMain placeholder-textDim focus:outline-none focus:border-primary transition-all disabled:opacity-60"
              />
              <button 
                type="submit"
                disabled={!inputMessage.trim() || isGenerating}
                className="p-2.5 bg-primary text-white rounded-full hover:bg-primary-hover transition-all flex items-center justify-center shrink-0 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer Close */}
      <div className="p-4 border-t border-surfaceBorder bg-surfaceLight shrink-0 flex justify-end">
        <button 
          onClick={() => setActiveNodeDetail(null)}
          className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-primary-hover transition-all cursor-pointer"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
}
