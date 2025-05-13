import React from "react";
import SolarSystem from "./components/SolarSystem";
import SpaceBackground from "./components/SpaceBackground";
import './App.css';

const App = () => {
  return (
    <div className="app">
      <SpaceBackground />
      <header className="app-header">
        <h1>Солнечная система</h1>
        <p>Интерактивная модель солнечной системы</p>
      </header>
      <main>
        <SolarSystem />
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Solar System</p>
        <p>
          Данные предоставлены:{" "}
          <a
            href="https://api.le-systeme-solaire.net/"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Solar System OpenData
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
