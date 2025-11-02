import { useEffect, useState } from 'react';
import { getRobotStatus } from '../utils/api';
import { FaRobot } from 'react-icons/fa';

const RobotStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      const data = await getRobotStatus();
      setStatus(data);
    } catch (error) {
      console.error('Error loading robot status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !status) {
    return (
      <div className="card">
        <p className="text-gray-500 text-center py-8">Loading robot status...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <FaRobot className="mr-2 text-2xl text-blue-600" /> Robot Status
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-gray-500 text-sm mb-2 font-medium">Status</p>
          <p className="text-gray-900 font-bold text-lg capitalize">{status.status}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-gray-500 text-sm mb-2 font-medium">Battery Level</p>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  status.battery_level > 50 ? 'bg-green-500' : status.battery_level > 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${status.battery_level}%` }}
              ></div>
            </div>
            <span className="text-gray-900 font-bold text-lg">{status.battery_level}%</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-gray-900 font-semibold mb-4">Bin Status</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {status.bins.map((bin) => (
            <div
              key={bin.id}
              className={`p-3 rounded-lg border ${
                bin.status === 'retrieving' 
                  ? 'bg-amber-50 border-amber-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <p className="text-gray-500 text-xs mb-1 font-medium">Bin {bin.id}</p>
              <p className="text-gray-900 font-bold text-sm">{bin.location}</p>
              <p className="text-gray-500 text-xs mt-1">{bin.books_count} books</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RobotStatus;

