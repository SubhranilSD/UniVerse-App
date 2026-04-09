import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const Requests = () => {
  return (
    <PageTransition>
      <div className="glass-card">
                <h3>New Request</h3>
                <button className="btn btn-primary">Create Request</button>
            </div>
        
    </PageTransition>
  );
};

export default Requests;