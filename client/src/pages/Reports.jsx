import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const Reports = () => {
  return (
    <PageTransition>
      <div className="glass-card">
                <h3>System Reports</h3>
                <p>Download your monthly performance report.</p>
                <button className="btn btn-ghost">Download PDF</button>
            </div>
        
    </PageTransition>
  );
};

export default Reports;