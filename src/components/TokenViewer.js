import React from 'react';

const TokenViewer = ({ data }) => {

  if (!data || data.length === 0) {
    return (
      <div className="viewer-empty">
        <p>No tokens to display. Please analyze some Python code first.</p>
      </div>
    );
  }

  if (data.length === 1 && data[0].error) {
    return (
      <div className="error-message">
        <strong>Tokenization Error:</strong> {data[0].error}
      </div>
    );
  }

  return (
    <div className="token-viewer-container">
      <div className="token-viewer-card">
        <div className="card-header">
          <h3 className="card-title">🔍 Lexical Analysis</h3>
        </div>

        <div className="table-section">
          <div className="table-container">
            <table className="token-table">
              <thead>
                <tr>
                  <th className="table-header">Line</th>
                  <th className="table-header">Column</th>
                  <th className="table-header">Type</th>
                  <th className="table-header">Value</th>
                  <th className="table-header">Position</th>
                </tr>
              </thead>
              <tbody>
                {data.map((token, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td className="table-cell">{token.line}</td>
                    <td className="table-cell">{token.column}</td>
                    <td className="table-cell">
                      <span className="token-type-badge" style={{ backgroundColor: getTokenTypeColor(token.type) }}>
                        {token.type}
                      </span>
                    </td>
                    <td className="table-cell">
                      <code className="token-value">{token.value || '·'}</code>
                    </td>
                    <td className="table-cell">
                      {token.end_line}:{token.end_column}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  function getTokenTypeColor(type) {
    const colors = {
      'NAME': '#dc2626',
      'NUMBER': '#059669',
      'STRING': '#7c3aed',
      'OP': '#ea580c',
      'DELIM': '#6b7280',
      'COMMENT': '#9ca3af',
      'NL': '#9ca3af',
      'NEWLINE': '#9ca3af',
      'INDENT': '#f59e0b',
      'DEDENT': '#f59e0b',
      'ENDMARKER': '#ef4444'
    };
    return colors[type] || '#374151';
  }
};

export default TokenViewer;
