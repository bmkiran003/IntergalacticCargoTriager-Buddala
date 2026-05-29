import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cargoList, setCargoList] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDest, setFilterDest] = useState('All');
  
  // Real-time tracking states
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [syncDisplayText, setSyncDisplayText] = useState('Just now');

  // Fetch data from API
  const fetchCargo = async () => {
    try {
      const response = await fetch('/api/cargo');
      const data = await response.json();
      setCargoList(data);
      
      // Reset the real-time clock whenever new data is fetched
      setLastSyncTime(new Date());
      setSyncDisplayText('Just now');
    } catch (error) {
      console.error("Failed to fetch cargo:", error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCargo();
  }, []);

  // Background Timer: Calculates minutes passed since lastSyncTime
  useEffect(() => {
    const interval = setInterval(() => {
      const minutesPassed = Math.floor((new Date() - lastSyncTime) / 60000);
      
      if (minutesPassed === 0) {
        setSyncDisplayText('Just now');
      } else if (minutesPassed === 1) {
        setSyncDisplayText('1 min ago');
      } else {
        setSyncDisplayText(`${minutesPassed} mins ago`);
      }
    }, 60000); // Check every 60 seconds

    // Cleanup function to prevent memory leaks
    return () => clearInterval(interval);
  }, [lastSyncTime]);

  // UX Rule: Sync Button Logic
  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      fetchCargo();
    }, 2500); // 2.5 seconds exactly
  };

  // KPI Calculations
  const totalWeight = cargoList.reduce((sum, item) => sum + item.WEIGHT_IN_KG, 0);
  const uniqueDestinations = new Set(cargoList.map(item => item.DESTINATION)).size;
  const heavyCargoCount = cargoList.filter(item => item.WEIGHT_IN_KG > 500).length;

  // Business Rule 4: Sorting Logic + Creative Filtering
  const processedCargo = [...cargoList]
    .sort((a, b) => {
      // Exception: Earth is always at the absolute bottom
      if (a.DESTINATION === 'Earth' && b.DESTINATION !== 'Earth') return 1;
      if (b.DESTINATION === 'Earth' && a.DESTINATION !== 'Earth') return -1;
      // Default: Sort by weight (Heaviest to Lightest)
      return b.WEIGHT_IN_KG - a.WEIGHT_IN_KG;
    })
    .filter(item => {
      const matchesSearch = item.CARGO_ID.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.DESTINATION.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterDest === 'All' || item.DESTINATION === filterDest;
      return matchesSearch && matchesFilter;
    });

  // Unique destinations for dropdown
  const destinationsOptions = ['All', ...new Set(cargoList.map(item => item.DESTINATION))];

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header>
        <div className="header-left">
          <span className="menu-icon">≡</span>
          <h1>Intergalactic Cargo Triager</h1>
        </div>
        <div className="header-right">
          <span className="last-sync">Last Sync: {syncDisplayText}</span>
          <button 
            className={`sync-btn ${isSyncing ? 'syncing' : ''}`}
            onClick={handleSyncClick} 
            disabled={isSyncing}
          >
            {isSyncing ? "Aligning quantum drives..." : "Sync Data"}
          </button>
        </div>
      </header>

      {/* KPI Metrics Section */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon blue-bg">📦</div>
          <div className="kpi-data">
            <span className="kpi-label">Total Cargo</span>
            <span className="kpi-value">{cargoList.length}</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon purple-bg">⚖️</div>
          <div className="kpi-data">
            <span className="kpi-label">Total Weight</span>
            <span className="kpi-value">{totalWeight.toLocaleString()} kg</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon light-blue-bg">🪐</div>
          <div className="kpi-data">
            <span className="kpi-label">Destinations</span>
            <span className="kpi-value">{uniqueDestinations}</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon red-bg">⚠️</div>
          <div className="kpi-data">
            <span className="kpi-label">Heavy Cargo (&gt;500kg)</span>
            <span className="kpi-value">{heavyCargoCount}</span>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search cargo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="filter-dropdown"
          value={filterDest}
          onChange={(e) => setFilterDest(e.target.value)}
        >
          {destinationsOptions.map(dest => (
            <option key={dest} value={dest}>{dest === 'All' ? 'All Destinations' : dest}</option>
          ))}
        </select>
      </div>

      {/* Main Cargo Grid */}
      <div className="cargo-grid">
        {processedCargo.map((cargo) => (
          <div key={cargo.CARGO_ID} className={`cargo-card ${cargo.DESTINATION === 'Earth' ? 'earth-card' : ''}`}>
            <div className="card-header">
              <span className="cargo-id">🚀 {cargo.CARGO_ID}</span>
            </div>
            <p className="destination-name">{cargo.DESTINATION}</p>
            <p className="cargo-date">{cargo.DATE}</p>
            <p className={`cargo-weight ${cargo.WEIGHT_IN_KG > 500 ? 'weight-heavy' : 'weight-normal'}`}>
              {cargo.WEIGHT_IN_KG} kg
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;