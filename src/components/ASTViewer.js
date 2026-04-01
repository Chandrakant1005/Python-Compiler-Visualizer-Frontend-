import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ASTViewer = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.type) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.parentElement.clientWidth;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Convert the AST data to D3 hierarchy format
    const root = d3.hierarchy(data);
    
    // Create tree layout
    const treeLayout = d3.tree()
      .size([width - 100, height - 100]);

    // Generate tree data
    treeLayout(root);

    // Create group for the tree
    const g = svg.append("g")
      .attr("transform", "translate(50, 50)");

    // Create links
    g.selectAll(".link")
      .data(root.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y))
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2);

    // Create nodes
    const nodes = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    // Add circles for nodes
    nodes.append("circle")
      .attr("r", 8)
      .attr("fill", d => getNodeColor(d.data.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add text labels
    nodes.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -12 : 12)
      .style("text-anchor", d => d.children ? "end" : "start")
      .style("font-size", "12px")
      .style("font-family", "monospace")
      .text(d => {
        let label = d.data.type;
        if (d.data.attributes && d.data.attributes.id) {
          label += `: ${d.data.attributes.id}`;
        } else if (d.data.attributes && d.data.attributes.value !== undefined) {
          label += `: ${JSON.stringify(d.data.attributes.value)}`;
        }
        return label;
      });

    // Add tooltips
    nodes.append("title")
      .text(d => {
        const info = [`Type: ${d.data.type}`];
        if (d.data.line) info.push(`Line: ${d.data.line}`);
        if (d.data.column) info.push(`Column: ${d.data.column}`);
        return info.join('\n');
      });

  }, [data]);

  const getNodeColor = (nodeType) => {
    const colors = {
      'Module': '#3b82f6',
      'FunctionDef': '#10b981',
      'ClassDef': '#f59e0b',
      'Assign': '#8b5cf6',
      'BinOp': '#ef4444',
      'UnaryOp': '#ec4899',
      'Compare': '#14b8a6',
      'Call': '#f97316',
      'Name': '#6366f1',
      'Constant': '#059669',
      'Return': '#84cc16',
      'If': '#06b6d4',
      'For': '#a855f7',
      'While': '#a855f7',
      'Expr': '#64748b'
    };
    return colors[nodeType] || '#6b7280';
  };

  if (!data || !data.type) {
    return (
      <div className="viewer-empty">
        <p>No AST to display. Please analyze some Python code first.</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="error-message">
        <strong>Parse Error:</strong> {data.error}
        {data.line && <span> at line {data.line}</span>}
      </div>
    );
  }

  return (
    <div className="ast-viewer">
      <div className="viewer-header">
        <h3>Syntax Analysis - Abstract Syntax Tree (AST)</h3>
        <p className="viewer-description">
          The AST represents the hierarchical structure of the code, showing how statements and expressions are organized.
        </p>
      </div>

      <div className="ast-controls">
        <div className="control-group">
          <label>Node Colors:</label>
          <div className="color-legend">
            {Object.entries({
              'Module': '#3b82f6',
              'FunctionDef': '#10b981',
              'ClassDef': '#f59e0b',
              'Assign': '#8b5cf6',
              'BinOp': '#ef4444',
              'Name': '#6366f1',
              'Constant': '#059669'
            }).map(([type, color]) => (
              <div key={type} className="legend-item">
                <span 
                  className="legend-color-circle"
                  style={{ backgroundColor: color }}
                ></span>
                <span className="legend-label">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tree-container">
        <svg ref={svgRef}></svg>
      </div>

      <div className="ast-info">
        <h4>AST Information</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Root Node:</span>
            <span className="info-value">{data.type}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Total Nodes:</span>
            <span className="info-value">{countNodes(data)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Tree Depth:</span>
            <span className="info-value">{getTreeDepth(data)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to count nodes in the AST
const countNodes = (node) => {
  if (!node || typeof node !== 'object') return 0;
  
  let count = 1; // Count current node
  
  // Count children in attributes
  if (node.attributes) {
    Object.values(node.attributes).forEach(value => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          if (item && typeof item === 'object' && item.type) {
            count += countNodes(item);
          }
        });
      } else if (value && typeof value === 'object' && value.type) {
        count += countNodes(value);
      }
    });
  }
  
  return count;
};

// Helper function to get tree depth
const getTreeDepth = (node, currentDepth = 0) => {
  if (!node || typeof node !== 'object') return currentDepth;
  
  let maxDepth = currentDepth;
  
  if (node.attributes) {
    Object.values(node.attributes).forEach(value => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          if (item && typeof item === 'object' && item.type) {
            const depth = getTreeDepth(item, currentDepth + 1);
            maxDepth = Math.max(maxDepth, depth);
          }
        });
      } else if (value && typeof value === 'object' && value.type) {
        const depth = getTreeDepth(value, currentDepth + 1);
        maxDepth = Math.max(maxDepth, depth);
      }
    });
  }
  
  return maxDepth;
};

export default ASTViewer;
