import { useState } from 'react'
import './Settings.css'

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [autoAnalysis, setAutoAnalysis] = useState(true)
  const [fraudThreshold, setFraudThreshold] = useState(70)
  const [theme, setTheme] = useState('light')
  
  return (
    <div className="settings-container">
      <h3>System Settings</h3>
      
      <div className="settings-grid">
        <div className="settings-card">
          <h4>Notifications</h4>
          <div className="setting-group">
            <div className="setting-item">
              <div className="setting-info">
                <h5>Enable Notifications</h5>
                <p>Receive system notifications for fraud alerts</p>
              </div>
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={notificationsEnabled} 
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h5>Email Alerts</h5>
                <p>Receive email alerts for high-risk fraud cases</p>
              </div>
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={emailAlerts} 
                  onChange={() => setEmailAlerts(!emailAlerts)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="settings-card">
          <h4>Analysis Settings</h4>
          <div className="setting-group">
            <div className="setting-item">
              <div className="setting-info">
                <h5>Automatic Analysis</h5>
                <p>Automatically analyze new datasets upon upload</p>
              </div>
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={autoAnalysis} 
                  onChange={() => setAutoAnalysis(!autoAnalysis)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h5>Fraud Detection Threshold</h5>
                <p>Set the sensitivity level for fraud detection</p>
              </div>
              <div className="range-slider-container">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={fraudThreshold} 
                  onChange={(e) => setFraudThreshold(parseInt(e.target.value))}
                  className="range-slider"
                />
                <span className="range-value">{fraudThreshold}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-card">
          <h4>Appearance</h4>
          <div className="setting-group">
            <div className="setting-item">
              <div className="setting-info">
                <h5>Theme</h5>
                <p>Choose the application theme</p>
              </div>
              <div className="theme-selector">
                <label className={`theme-option ${theme === 'light' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="light" 
                    checked={theme === 'light'} 
                    onChange={() => setTheme('light')}
                  />
                  <span className="theme-name">Light</span>
                </label>
                <label className={`theme-option ${theme === 'dark' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="dark" 
                    checked={theme === 'dark'} 
                    onChange={() => setTheme('dark')}
                  />
                  <span className="theme-name">Dark</span>
                </label>
                <label className={`theme-option ${theme === 'system' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="system" 
                    checked={theme === 'system'} 
                    onChange={() => setTheme('system')}
                  />
                  <span className="theme-name">System</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-card">
          <h4>User Profile</h4>
          <div className="user-profile-settings">
            <div className="profile-info">
              <div className="profile-avatar">A</div>
              <div>
                <h5>Admin User</h5>
                <p>admin@mercadolivre.com</p>
              </div>
            </div>
            
            <div className="profile-actions">
              <button className="btn btn-outline">Edit Profile</button>
              <button className="btn btn-outline">Change Password</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-actions">
        <button className="btn btn-primary">Save Changes</button>
        <button className="btn btn-outline">Reset to Defaults</button>
      </div>
    </div>
  )
}

export default Settings