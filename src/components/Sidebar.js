import React from 'react';
import lexicalIcon from '../icons/lexical.png';
import astIcon from '../icons/ast.png';
import semanticIcon from '../icons/semantic.png';
import irIcon from '../icons/ir.png';
import optimizationIcon from '../icons/code-optimisation.png';
import bytecodeIcon from '../icons/bytecode.png';
import pythonLogo from '../icons/python.png';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'tokens', label: 'Lexical', icon: lexicalIcon },
    { id: 'ast', label: 'AST', icon: astIcon },
    { id: 'semantic', label: 'Semantic', icon: semanticIcon },
    { id: 'ir', label: 'IR', icon: irIcon },
    { id: 'optimization', label: 'Optimization', icon: optimizationIcon },
    { id: 'bytecode', label: 'Bytecode', icon: bytecodeIcon },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <img src={pythonLogo} alt="Python" className="logo-image" />
          <div className="logo-text-container">
            <span className="logo-text">Compiler</span>
            <span className="logo-subtext">Simulator</span>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="section-title">Analysis</div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <img src={item.icon} alt={item.label} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
