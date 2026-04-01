import React, { useState } from 'react';

const BytecodeViewer = ({ data }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [filterType, setFilterType] = useState('all');

  if (!data || data.length === 0) {
    return (
      <div className="viewer-empty">
        <p>No bytecode to display. Please analyze some Python code first.</p>
      </div>
    );
  }

  if (data.length === 1 && data[0].error) {
    return (
      <div className="error-message">
        <strong>Bytecode Generation Error:</strong> {data[0].error}
        {data[0].line && <span> at line {data[0].line}</span>}
      </div>
    );
  }

  const getOpcodeColor = (opcode) => {
    // Color code based on opcode categories
    if (opcode >= 0 && opcode <= 9) return '#10b981'; // Stack manipulation
    if (opcode >= 10 && opcode <= 29) return '#3b82f6'; // Binary operations
    if (opcode >= 30 && opcode <= 49) return '#8b5cf6'; // In-place operations
    if (opcode >= 50 && opcode <= 69) return '#f59e0b'; // Unary operations
    if (opcode >= 70 && opcode <= 89) return '#ef4444'; // Function calls
    if (opcode >= 90 && opcode <= 109) return '#06b6d4'; // Control flow
    if (opcode >= 110 && opcode <= 129) return '#ec4899'; // Loading operations
    return '#6b7280'; // Default
  };

  const filterInstructions = (instructions) => {
    if (filterType === 'all') return instructions;
    return instructions.filter(instr => {
      switch (filterType) {
        case 'stack':
          return instr.opcode >= 0 && instr.opcode <= 9;
        case 'binary':
          return instr.opcode >= 10 && instr.opcode <= 29;
        case 'unary':
          return instr.opcode >= 50 && instr.opcode <= 69;
        case 'call':
          return instr.opcode >= 70 && instr.opcode <= 89;
        case 'control':
          return instr.opcode >= 90 && instr.opcode <= 109;
        case 'load':
          return instr.opcode >= 110 && instr.opcode <= 129;
        default:
          return true;
      }
    });
  };

  const filteredData = filterInstructions(data);

  const getOpcodeCategory = (opcode) => {
    if (opcode >= 0 && opcode <= 9) return 'Stack Manipulation';
    if (opcode >= 10 && opcode <= 29) return 'Binary Operations';
    if (opcode >= 30 && opcode <= 49) return 'In-place Operations';
    if (opcode >= 50 && opcode <= 69) return 'Unary Operations';
    if (opcode >= 70 && opcode <= 89) return 'Function Calls';
    if (opcode >= 90 && opcode <= 109) return 'Control Flow';
    if (opcode >= 110 && opcode <= 129) return 'Loading Operations';
    return 'Other';
  };

  return (
    <div className="bytecode-viewer">
      <div className="viewer-header">
        <h3>Code Generation - Python Bytecode</h3>
        <p className="viewer-description">
          Python bytecode is the low-level representation executed by the Python Virtual Machine (PVM).
        </p>
      </div>

      {/* Bytecode Statistics */}
      <div className="bytecode-stats">
        <div className="stat-item">
          <span className="stat-label">Total Instructions:</span>
          <span className="stat-value">{data.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Unique Opcodes:</span>
          <span className="stat-value">{[...new Set(data.map(i => i.opcode))].length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Jump Targets:</span>
          <span className="stat-value">{data.filter(i => i.is_jump_target).length}</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bytecode-controls">
        <div className="control-group">
          <label>Filter by Category:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Instructions</option>
            <option value="stack">Stack Manipulation</option>
            <option value="binary">Binary Operations</option>
            <option value="unary">Unary Operations</option>
            <option value="call">Function Calls</option>
            <option value="control">Control Flow</option>
            <option value="load">Loading Operations</option>
          </select>
        </div>
        
        <button 
          className="btn btn-outline"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {/* Bytecode Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Offset</th>
              <th>Opcode</th>
              <th>Name</th>
              <th>Arg</th>
              <th>Argument Value</th>
              {showDetails && <th>Line</th>}
              {showDetails && <th>Jump Target</th>}
              {showDetails && <th>Category</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((instruction, index) => (
              <tr 
                key={index} 
                className={`instruction-row ${instruction.is_jump_target ? 'jump-target' : ''}`}
              >
                <td className="offset">{instruction.offset}</td>
                <td className="opcode">
                  <span 
                    className="opcode-badge"
                    style={{ backgroundColor: getOpcodeColor(instruction.opcode) }}
                  >
                    {instruction.opcode}
                  </span>
                </td>
                <td className="opname">
                  <code>{instruction.opname}</code>
                </td>
                <td className="arg">{instruction.arg}</td>
                <td className="argval">
                  <code className="text-sm">
                    {instruction.argrepr || instruction.argval || '-'}
                  </code>
                </td>
                {showDetails && (
                  <td className="line">{instruction.line || '-'}</td>
                )}
                {showDetails && (
                  <td className="jump-target">
                    {instruction.is_jump_target ? '✓' : '-'}
                  </td>
                )}
                {showDetails && (
                  <td className="category">
                    <span className="category-badge">
                      {getOpcodeCategory(instruction.opcode)}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Opcode Categories Legend */}
      <div className="opcode-legend">
        <h4>Opcode Categories</h4>
        <div className="legend-grid">
          {[
            { range: '0-9', name: 'Stack Manipulation', description: 'PUSH, POP, DUP operations' },
            { range: '10-29', name: 'Binary Operations', description: 'ADD, SUB, MUL, DIV operations' },
            { range: '30-49', name: 'In-place Operations', description: 'In-place modifications' },
            { range: '50-69', name: 'Unary Operations', description: 'UNARY_POSITIVE, UNARY_NEGATIVE' },
            { range: '70-89', name: 'Function Calls', description: 'CALL_FUNCTION, RETURN_VALUE' },
            { range: '90-109', name: 'Control Flow', description: 'JUMP, IF, FOR loops' },
            { range: '110-129', name: 'Loading Operations', description: 'LOAD_CONST, LOAD_NAME' }
          ].map((category, index) => (
            <div key={index} className="legend-item">
              <span className="legend-range">{category.range}</span>
              <span className="legend-name">{category.name}</span>
              <span className="legend-description">{category.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bytecode Explanation */}
      <div className="bytecode-explanation">
        <h4>About Python Bytecode</h4>
        <div className="explanation-content">
          <p>
            Python bytecode is a set of instructions that the Python Virtual Machine (PVM) executes.
            Each instruction represents a specific operation that manipulates the Python stack.
          </p>
          
          <h5>Key Concepts:</h5>
          <ul>
            <li><strong>Stack-based:</strong> Python uses a stack-based virtual machine where most operations push and pop values from a stack.</li>
            <li><strong>Offset:</strong> Each instruction has a byte offset indicating its position in the bytecode.</li>
            <li><strong>Opcode:</strong> Numeric identifier for the operation (e.g., 100 for LOAD_CONST).</li>
            <li><strong>Argument:</strong> Optional operand for the instruction (e.g., index into constants array).</li>
            <li><strong>Jump Targets:</strong> Instructions that can be jumped to from control flow instructions.</li>
          </ul>

          <h5>Common Instructions:</h5>
          <div className="common-instructions">
            <div className="instruction-example">
              <code>LOAD_CONST</code>
              <span>Push a constant onto the stack</span>
            </div>
            <div className="instruction-example">
              <code>STORE_NAME</code>
              <span>Store value in variable</span>
            </div>
            <div className="instruction-example">
              <code>BINARY_ADD</code>
              <span>Add top two stack values</span>
            </div>
            <div className="instruction-example">
              <code>CALL_FUNCTION</code>
              <span>Call a function</span>
            </div>
            <div className="instruction-example">
              <code>RETURN_VALUE</code>
              <span>Return from function</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BytecodeViewer;
