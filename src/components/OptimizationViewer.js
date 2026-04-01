import React, { useState } from 'react';

const OptimizationViewer = ({ data }) => {
  const [showOriginalAST, setShowOriginalAST] = useState(false);
  const [showOptimizedAST, setShowOptimizedAST] = useState(false);

  if (!data) {
    return (
      <div className="viewer-empty">
        <p>No optimization data to display. Please analyze some Python code first.</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="error-message">
        <strong>Optimization Error:</strong> {data.error}
        {data.line && <span> at line {data.line}</span>}
      </div>
    );
  }

  const { optimized_code, optimizations_applied, original_tree, optimized_tree } = data;

  return (
    <div className="optimization-viewer">
      <div className="viewer-header">
        <h3>Optimization Phase</h3>
        <p className="viewer-description">
          Code optimization improves performance by applying transformations like constant folding and dead code elimination.
        </p>
      </div>

      {/* Optimization Summary */}
      <div className="optimization-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Optimizations Applied:</span>
            <span className="stat-value">{optimizations_applied ? optimizations_applied.length : 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Code Size Change:</span>
            <span className="stat-value">
              {optimized_code && optimized_code.length > 0 ? 
                `${optimized_code.length} characters` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Optimizations Applied */}
      {optimizations_applied && optimizations_applied.length > 0 && (
        <div className="optimizations-section">
          <h4>Optimizations Applied</h4>
          <div className="optimizations-list">
            {optimizations_applied.map((optimization, index) => (
              <div key={index} className="optimization-item">
                <div className="optimization-header">
                  <span className="optimization-type">{optimization.type}</span>
                  {optimization.line && (
                    <span className="optimization-line">Line {optimization.line}</span>
                  )}
                </div>
                <div className="optimization-description">
                  {optimization.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Comparison */}
      <div className="code-comparison">
        <h4>Code Comparison</h4>
        <div className="comparison-grid">
          <div className="code-panel">
            <div className="panel-header">
              <h5>Original Code</h5>
            </div>
            <div className="code-block">
              <pre>{data.optimized_code || 'No optimized code available'}</pre>
            </div>
          </div>
          <div className="code-panel">
            <div className="panel-header">
              <h5>Optimized Code</h5>
            </div>
            <div className="code-block optimized">
              <pre>{optimized_code || 'No optimized code available'}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* AST Comparison */}
      {(original_tree || optimized_tree) && (
        <div className="ast-comparison">
          <h4>AST Comparison</h4>
          <div className="ast-controls">
            <button 
              className="btn btn-outline"
              onClick={() => setShowOriginalAST(!showOriginalAST)}
            >
              {showOriginalAST ? 'Hide' : 'Show'} Original AST
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => setShowOptimizedAST(!showOptimizedAST)}
            >
              {showOptimizedAST ? 'Hide' : 'Show'} Optimized AST
            </button>
          </div>
          
          <div className="ast-grid">
            {showOriginalAST && original_tree && (
              <div className="ast-panel">
                <div className="panel-header">
                  <h5>Original AST</h5>
                </div>
                <div className="ast-display">
                  <pre className="ast-json">
                    {JSON.stringify(original_tree, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {showOptimizedAST && optimized_tree && (
              <div className="ast-panel">
                <div className="panel-header">
                  <h5>Optimized AST</h5>
                </div>
                <div className="ast-display">
                  <pre className="ast-json">
                    {JSON.stringify(optimized_tree, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Optimization Types Explanation */}
      <div className="optimization-types">
        <h4>Optimization Techniques</h4>
        <div className="types-grid">
          <div className="type-card">
            <h5>Constant Folding</h5>
            <p>
              Evaluates constant expressions at compile time. For example, <code>2 + 3</code> becomes <code>5</code>.
            </p>
          </div>
          <div className="type-card">
            <h5>Dead Code Elimination</h5>
            <p>
              Removes code that will never be executed, such as unreachable statements in if blocks with constant conditions.
            </p>
          </div>
          <div className="type-card">
            <h5>Algebraic Simplification</h5>
            <p>
              Simplifies algebraic expressions like <code>x * 1</code> to <code>x</code> or <code>x + 0</code> to <code>x</code>.
            </p>
          </div>
          <div className="type-card">
            <h5>Strength Reduction</h5>
            <p>
              Replaces expensive operations with cheaper ones, like multiplication with addition when possible.
            </p>
          </div>
        </div>
      </div>

      {/* Performance Impact */}
      <div className="performance-impact">
        <h4>Performance Impact</h4>
        <div className="impact-grid">
          <div className="impact-item">
            <span className="impact-label">Execution Speed:</span>
            <span className="impact-value positive">Improved</span>
          </div>
          <div className="impact-item">
            <span className="impact-label">Memory Usage:</span>
            <span className="impact-value neutral">Variable</span>
          </div>
          <div className="impact-item">
            <span className="impact-label">Code Size:</span>
            <span className="impact-value positive">Reduced</span>
          </div>
          <div className="impact-item">
            <span className="impact-label">Readability:</span>
            <span className="impact-value neutral">Maintained</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizationViewer;
