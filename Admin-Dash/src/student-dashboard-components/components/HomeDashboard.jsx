import { useState, useEffect } from 'react';
import { CheckSquare, Clock, BookOpen } from 'lucide-react';
import '../styles/home-dashboard.css';

export default function HomeDashboard({ studentInfo }) {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        const response = await fetch('http://localhost:8080/api/v1/student/me/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch enrolled courses');
        }
        const data = await response.json();
        setEnrolledCourses(data.enrolled_courses || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);
  
  return (
    <div>
      <div className="SD-grid SD-grid-cols-1 md:SD-grid-cols-3 SD-gap-6 SD-mb-6">
        <div className="SD-bg-white SD-rounded-lg SD-shadow SD-p-6">
          <h3 className="SD-text-lg SD-font-medium SD-text-gray-700 SD-mb-2">Program Status</h3>
          <div className="SD-flex SD-items-center">
            <div className="SD-h-16 SD-w-16 SD-rounded-full SD-bg-green-100 SD-flex SD-items-center SD-justify-center">
              <CheckSquare size={24} className="SD-text-green-600" />
            </div>
            <div className="SD-ml-4">
              <div className="SD-text-2xl SD-font-bold">{studentInfo?.year || 'N/A'}rd Year</div>
              <div className="SD-text-sm SD-text-gray-600">{studentInfo?.credits || 0} credits enrolled</div>
            </div>
          </div>
        </div>
        
        <div className="SD-bg-white SD-rounded-lg SD-shadow SD-p-6">
          <h3 className="SD-text-lg SD-font-medium SD-text-gray-700 SD-mb-2">Courses</h3>
          <div className="SD-flex SD-items-center">
            <div className="SD-h-16 SD-w-16 SD-rounded-full SD-bg-purple-100 SD-flex SD-items-center SD-justify-center">
              <BookOpen size={24} className="SD-text-purple-600" />
            </div>
            <div className="SD-ml-4">
              {loading ? (
                <div className="SD-text-lg">Loading...</div>
              ) : error ? (
                <div className="SD-text-lg SD-text-red-500">Error</div>
              ) : (
                <>
                  <div className="SD-text-2xl SD-font-bold">{enrolledCourses.length}</div>
                  <div className="SD-text-sm SD-text-gray-600">Enrolled courses</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Course List Section */}
      <div className="SD-bg-white SD-rounded-lg SD-shadow SD-p-6 SD-mt-6">
        <h3 className="SD-text-lg SD-font-medium SD-text-gray-700 SD-mb-4">My Courses</h3>
        {loading ? (
          <div className="SD-p-4 SD-text-center">Loading courses...</div>
        ) : error ? (
          <div className="SD-p-4 SD-text-center SD-text-red-500">Error loading courses: {error}</div>
        ) : enrolledCourses.length === 0 ? (
          <div className="SD-p-4 SD-text-center SD-text-gray-500">No courses enrolled</div>
        ) : (
          <ul className="SD-divide-y SD-divide-gray-200">
            {enrolledCourses.map((course, index) => (
              <li key={index} className="SD-py-3 SD-flex SD-items-center">
                <div className="SD-h-8 SD-w-8 SD-rounded-full SD-bg-blue-100 SD-flex SD-items-center SD-justify-center SD-mr-3">
                  <BookOpen size={16} className="SD-text-blue-600" />
                </div>
                <span className="SD-font-medium">{course}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}