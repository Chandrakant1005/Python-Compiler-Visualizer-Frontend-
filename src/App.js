import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import TokenViewer from './components/TokenViewer';
import ASTViewer from './components/ASTViewer';
import SemanticViewer from './components/SemanticViewer';
import IRViewer from './components/IRViewer';
import OptimizationViewer from './components/OptimizationViewer';
import BytecodeViewer from './components/BytecodeViewer';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [code, setCode] = useState(`# Welcome to Python Compiler Visualizer!
# Try editing this code or write your own

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

result = fibonacci(10)
print(f"Fibonacci of 10 is: {result}")`);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tokens');

  const tabs = [
    { id: 'tokens', label: 'Lexical Analysis', component: TokenViewer },
    { id: 'ast', label: 'Syntax Analysis', component: ASTViewer },
    { id: 'semantic', label: 'Semantic Analysis', component: SemanticViewer },
    { id: 'ir', label: 'Intermediate Representation', component: IRViewer },
    { id: 'optimization', label: 'Optimization', component: OptimizationViewer },
    { id: 'bytecode', label: 'Code Generation', component: BytecodeViewer },
  ];

  const analyzeCode = async () => {
    if (!code.trim()) {
      setError('Please enter some Python code to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(`Failed to analyze code: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadExample = async (exampleCode) => {
    setCode(exampleCode);
    setError(null);
    
    // Auto-analyze after loading example
    setTimeout(() => {
      const analyzeButton = document.getElementById('analyze-button');
      if (analyzeButton) {
        analyzeButton.click();
      }
    }, 100);
  };

  const loadExamples = async () => {
    try {
      const response = await fetch('/examples');
      const examples = await response.json();
      return examples;
    } catch (err) {
      console.error('Failed to load examples:', err);
      return {};
    }
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-content">
        <div className="content-area">
          <div className="editor-section">
            <div className="editor-header">
              <h2>Source Code</h2>
              <div className="editor-controls">
                <button
                  id="analyze-button"
                  className="btn btn-primary"
                  onClick={analyzeCode}
                  disabled={loading}
                >
                  {loading ? <span className="spinner"></span> : 'Run Analysis'}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={async () => {
                    const examples = await loadExamples();
                    if (examples.simple_assignment) {
                      loadExample(examples.simple_assignment.code);
                    }
                  }}
                >
                  Load Example
                </button>
              </div>
            </div>
            
            <div className="editor-container">
              <CodeEditor
                value={code}
                onChange={setCode}
                placeholder="Enter your Python code here..."
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {loading && (
              <div className="loading-message">
                <span className="spinner"></span>
                Analyzing code...
              </div>
            )}
          </div>

          {analysis && (
            <div className="results-section">
              <div className="tab-content">
                {ActiveComponent && (
                  <ActiveComponent data={analysis[activeTab === 'tokens' ? 'tokens' : 
                                                  activeTab === 'ast' ? 'ast' : 
                                                  activeTab === 'semantic' ? 'symbols' : 
                                                  activeTab === 'ir' ? 'ir' : 
                                                  activeTab === 'optimization' ? 'optimization' : 
                                                  'bytecode']} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
