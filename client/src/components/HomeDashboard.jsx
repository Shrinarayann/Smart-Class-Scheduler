// components/HomeDashboard.jsx
import { CheckSquare, Clock, BookOpen } from 'lucide-react';
import '../styles/home-dashboard.css';

export default function HomeDashboard({ studentInfo, enrolledCourses }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Program Status</h3>
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckSquare size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold">{studentInfo.year}rd Year</div>
              <div className="text-sm text-gray-600">{studentInfo.credits} credits enrolled</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Upcoming Classes</h3>
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-xl font-medium">CS301: Data Structures</div>
              <div className="text-sm text-gray-600">Today at 10:00 AM</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Courses</h3>
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
              <BookOpen size={24} className="text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
              <div className="text-sm text-gray-600">Enrolled courses</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Current Schedule</h3>
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-6 bg-gray-100 p-3 text-sm font-medium text-gray-700">
            <div className="text-center">Time</div>
            <div className="text-center">Monday</div>
            <div className="text-center">Tuesday</div>
            <div className="text-center">Wednesday</div>
            <div className="text-center">Thursday</div>
            <div className="text-center">Friday</div>
          </div>
          
          <div className="grid grid-cols-6 border-t p-3">
            <div className="text-center text-sm font-medium text-gray-700">9:00 - 12:00</div>
            <div className="text-center"></div>
            <div className="text-center"></div>
            <div className="text-center"></div>
            <div className="text-center"></div>
            <div className="text-center bg-green-100 rounded p-1 text-xs">ENG210</div>
          </div>
          
          <div className="grid grid-cols-6 border-t p-3">
            <div className="text-center text-sm font-medium text-gray-700">10:00 - 11:30</div>
            <div className="text-center bg-blue-100 rounded p-1 text-xs">CS301</div>
            <div className="text-center bg-purple-100 rounded p-1 text-xs">CS380</div>
            <div className="text-center bg-blue-100 rounded p-1 text-xs">CS301</div>
            <div className="text-center bg-purple-100 rounded p-1 text-xs">CS380</div>
            <div className="text-center"></div>
          </div>
        </div>
      </div>
    </div>
  );
}