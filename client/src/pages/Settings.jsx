import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const Settings = () => {
  return (
    <PageTransition>
      <div className="glass-card">
                <h3>Appearance</h3>
                <p>Theme: Dark (Default)</p>
                <button className="btn btn-ghost">Toggle Light Mode</button>

                <h3 style={{"marginTop": "20px"}}>Account</h3>
                <p>Change Password, Privacy Settings</p>
            </div>
        
    </PageTransition>
  );
};

export default Settings;