import React from 'react';

const IRViewer = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="viewer-empty">
        <p>No intermediate representation to display. Please analyze some Python code first.</p>
      </div>
    );
  }

  if (data.length === 1 && data[0].error) {
    return (
      <div className="error-message">
        <strong>IR Generation Error:</strong> {data[0].error}
        {data[0].line && <span> at line {data[0].line}</span>}
      </div>
    );
  }

  const getInstructionColor = (type) => {
    const colors = {
      'assign': '#10b981',
      'binary': '#3b82f6',
      'unary': '#8b5cf6',
      'compare': '#f59e0b',
      'call': '#ef4444',
      'return': '#06b6d4',
      'if_false': '#ec4899',
      'goto': '#a855f7',
      'label': '#6b7280'
    };
    return colors[type] || '#374151';
  };

  const formatInstruction = (instruction) => {
    const { type, args } = instruction;
    
    switch (type) {
      case 'assign':
        return `${args[1]} = ${args[0]}`;
      case 'binary':
        return `${args[2]} = ${args[0]} ${args[3] || '+'} ${args[1]}`;
      case 'unary':
        return `${args[1]} = ${args[2] || '+'}${args[0]}`;
      case 'compare':
        return `${args[2]} = ${args[0]} ${args[3] || '=='} ${args[1]}`;
      case 'call':
        return `${args[2]} = ${args[0]}(${args[1] ? args[1].join(', ') : ''})`;
      case 'return':
        return `return ${args[0]}`;
      case 'if_false':
        return `if_false ${args[0]} goto ${args[1]}`;
      case 'goto':
        return `goto ${args[0]}`;
      case 'label':
        return `${args[0]}:`;
      default:
        return `${type} ${args.join(' ')}`;
    }
  };

  const getInstructionDescription = (type) => {
    const descriptions = {
      'assign': 'Assignment operation',
      'binary': 'Binary arithmetic operation',
      'unary': 'Unary operation',
      'compare': 'Comparison operation',
      'call': 'Function call',
      'return': 'Return statement',
      'if_false': 'Conditional jump',
      'goto': 'Unconditional jump',
      'label': 'Label for jump targets'
    };
    return descriptions[type] || 'Unknown instruction';
  };

  return (
    <div className="ir-viewer">
      <div className="viewer-header">
        <h3>Intermediate Representation - Three Address Code (TAC)</h3>
        <p className="viewer-description">
          Three Address Code is an intermediate representation where each instruction has at most three operands.
        </p>
      </div>

      <div className="ir-stats">
        <div className="stat-item">
          <span className="stat-label">Total Instructions:</span>
          <span className="stat-value">{data.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Unique Types:</span>
          <span className="stat-value">{[...new Set(data.map(i => i.type))].length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Temporaries Used:</span>
          <span className="stat-value">
            {[...new Set(data.flatMap(i => i.args.filter(arg => arg && arg.startsWith('t'))))].length}
          </span>
        </div>
      </div>

      <div className="ir-controls">
        <div className="control-group">
          <label>Instruction Types:</label>
          <div className="type-legend">
            {[...new Set(data.map(i => i.type))].map(type => (
              <div key={type} className="legend-item">
                <span 
                  className="legend-color"
                  style={{ backgroundColor: getInstructionColor(type) }}
                ></span>
                <span className="legend-label">{type}</span>
                <span className="legend-description">{getInstructionDescription(type)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Line</th>
              <th>Type</th>
              <th>Instruction</th>
              <th>Arguments</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((instruction, index) => (
              <tr key={index} className="instruction-row">
                <td className="line-number">{instruction.line}</td>
                <td className="instruction-type">
                  <span 
                    className="type-badge"
                    style={{ backgroundColor: getInstructionColor(instruction.type) }}
                  >
                    {instruction.type}
                  </span>
                </td>
                <td className="instruction-text">
                  <code>{formatInstruction(instruction)}</code>
                </td>
                <td className="instruction-args">
                  <code className="text-sm">[{instruction.args.join(', ')}]</code>
                </td>
                <td className="instruction-description">
                  {getInstructionDescription(instruction.type)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ir-explanation">
        <h4>About Three Address Code</h4>
        <div className="explanation-content">
          <p>
            Three Address Code (TAC) is an intermediate representation used by compilers to simplify code optimization and code generation.
            Each instruction in TAC follows the general form:
          </p>
          <div className="code-block">
            <pre>
{`result = operand1 operator operand2
result = operand1
if condition goto label
goto label
label:`}
            </pre>
          </div>
          <h5>Key Features:</h5>
          <ul>
            <li><strong>At most three operands:</strong> Each instruction references at most three values</li>
            <li><strong>Temporary variables:</strong> Generated temporaries (t1, t2, etc.) store intermediate results</li>
            <li><strong>Simple operations:</strong> Complex expressions are broken down into simple steps</li>
            <li><strong>Control flow:</strong> Explicit goto and conditional jump instructions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IRViewer;
