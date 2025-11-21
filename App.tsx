import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import AgentPV from './pages/AgentMelos';
import Conceitos from './pages/Conceitos';
import Biblioteca from './pages/Biblioteca';

// Using HashRouter because it is the most robust solution for static hosts like Netlify
// without requiring special redirect rule configuration for client-side routing.
const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/melos" element={<AgentPV />} />
          <Route path="/conceitos" element={<Conceitos />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
