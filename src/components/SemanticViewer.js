import React from 'react';

const SemanticViewer = ({ data }) => {
  if (!data || !data.symbol_table) {
    return (
      <div className="viewer-empty">
        <p>No semantic analysis data to display. Please analyze some Python code first.</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="error-message">
        <strong>Semantic Analysis Error:</strong> {data.error}
        {data.line && <span> at line {data.line}</span>}
      </div>
    );
  }

  const { symbol_table, undefined_variables, scopes, errors, warnings, variable_usage } = data;

  return (
    <div className="semantic-viewer">
      <div className="viewer-header">
        <h3>Semantic Analysis - Symbol Table & Variable Analysis</h3>
        <p className="viewer-description">
          Semantic analysis checks for variable usage, scope, and other semantic properties of the code.
        </p>
      </div>

      {/* Symbol Table */}
      <div className="analysis-section">
        <h4>Symbol Table</h4>
        <p className="section-description">
          All symbols (variables, functions, classes) found in the code with their types and locations.
        </p>
        
        <div className="symbol-table-container">
          {Object.entries(symbol_table).map(([name, symbols]) => (
            <div key={name} className="symbol-entry">
              <div className="symbol-name">
                <code>{name}</code>
                <span className="symbol-count">({symbols.length} declaration{symbols.length > 1 ? 's' : ''})</span>
              </div>
              <div className="symbol-details">
                {symbols.map((symbol, index) => (
                  <div key={index} className="symbol-detail">
                    <span className={`symbol-type ${symbol.type.toLowerCase()}`}>
                      {symbol.type}
                    </span>
                    <span className="symbol-location">
                      Line {symbol.line} in {symbol.scope} scope
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Variable Usage Summary */}
      {variable_usage && (
        <div className="analysis-section">
          <h4>Variable Usage Summary</h4>
          <div className="usage-grid">
            {variable_usage.variables && variable_usage.variables.length > 0 && (
              <div className="usage-category">
                <h5>Variables ({variable_usage.variables.length})</h5>
                <div className="usage-list">
                  {variable_usage.variables.map((variable, index) => (
                    <div key={index} className="usage-item">
                      <code>{variable.name}</code>
                      <span className="usage-location">Line {variable.line}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {variable_usage.functions && variable_usage.functions.length > 0 && (
              <div className="usage-category">
                <h5>Functions ({variable_usage.functions.length})</h5>
                <div className="usage-list">
                  {variable_usage.functions.map((func, index) => (
                    <div key={index} className="usage-item">
                      <code>{func.name}</code>
                      <span className="usage-location">Line {func.line}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {variable_usage.classes && variable_usage.classes.length > 0 && (
              <div className="usage-category">
                <h5>Classes ({variable_usage.classes.length})</h5>
                <div className="usage-list">
                  {variable_usage.classes.map((cls, index) => (
                    <div key={index} className="usage-item">
                      <code>{cls.name}</code>
                      <span className="usage-location">Line {cls.line}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {variable_usage.parameters && variable_usage.parameters.length > 0 && (
              <div className="usage-category">
                <h5>Parameters ({variable_usage.parameters.length})</h5>
                <div className="usage-list">
                  {variable_usage.parameters.map((param, index) => (
                    <div key={index} className="usage-item">
                      <code>{param.name}</code>
                      <span className="usage-location">Line {param.line}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scope Information */}
      {scopes && scopes.length > 0 && (
        <div className="analysis-section">
          <h4>Scope Hierarchy</h4>
          <div className="scope-tree">
            <div className="scope-item global-scope">
              <span className="scope-name">global</span>
              <span className="scope-level">Level 0</span>
            </div>
            {scopes.map((scope, index) => (
              <div key={index} className="scope-item" style={{ marginLeft: `${scope.level * 20}px` }}>
                <span className="scope-name">{scope.name}</span>
                <span className="scope-level">Level {scope.level}</span>
                <span className="scope-parent">Parent: {scope.parent}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Undefined Variables */}
      {undefined_variables && undefined_variables.length > 0 && (
        <div className="analysis-section">
          <h4>Undefined Variables</h4>
          <div className="warning-message">
            <strong>Warning:</strong> The following variables are used but not defined:
          </div>
          <div className="undefined-list">
            {undefined_variables.map((variable, index) => (
              <div key={index} className="undefined-item">
                <code>{variable.name}</code>
                <span className="undefined-location">
                  Line {variable.line} in {variable.scope} scope
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Errors and Warnings */}
      {(errors && errors.length > 0) && (
        <div className="analysis-section">
          <h4>Semantic Errors</h4>
          <div className="errors-list">
            {errors.map((error, index) => (
              <div key={index} className="error-item">
                <span className="error-type">{error.type}</span>
                <span className="error-message">{error.message}</span>
                <span className="error-location">Line {error.line}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {warnings && warnings.length > 0 && (
        <div className="analysis-section">
          <h4>Semantic Warnings</h4>
          <div className="warnings-list">
            {warnings.map((warning, index) => (
              <div key={index} className="warning-item">
                <span className="warning-type">{warning.type}</span>
                <span className="warning-message">{warning.message}</span>
                <span className="warning-location">Line {warning.line}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="analysis-section">
        <h4>Analysis Statistics</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Symbols:</span>
            <span className="stat-value">{Object.keys(symbol_table).length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Scopes:</span>
            <span className="stat-value">{scopes ? scopes.length + 1 : 1}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Undefined Variables:</span>
            <span className="stat-value">{undefined_variables ? undefined_variables.length : 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Warnings:</span>
            <span className="stat-value">{warnings ? warnings.length : 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemanticViewer;
