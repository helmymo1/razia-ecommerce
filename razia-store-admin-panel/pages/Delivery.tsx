
import React from 'react';
import { Truck, MapPin, CheckCircle, Clock, ExternalLink } from 'lucide-react';

const DeliveryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Delivery API Status</h1>
          <p className="text-gray-500">Real-time shipping updates and logistics integration.</p>
        </div>
        <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-bold border border-green-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Out for Delivery</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-bold">142</h3>
            <span className="text-xs text-green-500 font-bold mb-1">+12%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Estimated Delays</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-bold">3</h3>
            <span className="text-xs text-amber-500 font-bold mb-1">Low</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Pickup Requests</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-bold">12</h3>
            <span className="text-xs text-indigo-500 font-bold mb-1">Active</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold">Live Shipments</h3>
        </div>
        <div className="p-6">
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Shipment #TRK-8821{i}</h4>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin size={14} className="mr-1" />
                      Destination: New York, NY
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400 uppercase font-bold">Status</p>
                    <p className="text-sm font-bold text-indigo-600">In Transit</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400 uppercase font-bold">Expected</p>
                    <p className="text-sm font-bold text-gray-700">Today, 6:00 PM</p>
                  </div>
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    <span className="text-sm font-semibold">Track</span>
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
