// // components/HomeDashboard.jsx
// import { CheckSquare, Clock, BookOpen } from 'lucide-react';
// import '../styles/home-dashboard.css';

// export default function HomeDashboard({ studentInfo, enrolledCourses }) {
//   return (
//     <div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-medium text-gray-700 mb-2">Program Status</h3>
//           <div className="flex items-center">
//             <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
//               <CheckSquare size={24} className="text-green-600" />
//             </div>
//             <div className="ml-4">
//               <div className="text-2xl font-bold">{studentInfo.year}rd Year</div>
//               <div className="text-sm text-gray-600">{studentInfo.credits} credits enrolled</div>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-medium text-gray-700 mb-2">Upcoming Classes</h3>
//           <div className="flex items-center">
//             <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
//               <Clock size={24} className="text-blue-600" />
//             </div>
//             <div className="ml-4">
//               <div className="text-xl font-medium">CS301: Data Structures</div>
//               <div className="text-sm text-gray-600">Today at 10:00 AM</div>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-medium text-gray-700 mb-2">Courses</h3>
//           <div className="flex items-center">
//             <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
//               <BookOpen size={24} className="text-purple-600" />
//             </div>
//             <div className="ml-4">
//               <div className="text-2xl font-bold">{enrolledCourses.length}</div>
//               <div className="text-sm text-gray-600">Enrolled courses</div>
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }

import { CheckSquare, Clock, BookOpen } from 'lucide-react';
import '../styles/home-dashboard.css';

export default function HomeDashboard({ studentInfo, enrolledCourses }) {
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
              <div className="SD-text-2xl SD-font-bold">{studentInfo.year}rd Year</div>
              <div className="SD-text-sm SD-text-gray-600">{studentInfo.credits} credits enrolled</div>
            </div>
          </div>
        </div>
        
        <div className="SD-bg-white SD-rounded-lg SD-shadow SD-p-6">
          <h3 className="SD-text-lg SD-font-medium SD-text-gray-700 SD-mb-2">Upcoming Classes</h3>
          <div className="SD-flex SD-items-center">
            <div className="SD-h-16 SD-w-16 SD-rounded-full SD-bg-blue-100 SD-flex SD-items-center SD-justify-center">
              <Clock size={24} className="SD-text-blue-600" />
            </div>
            <div className="SD-ml-4">
              <div className="SD-text-xl SD-font-medium">CS301: Data Structures</div>
              <div className="SD-text-sm SD-text-gray-600">Today at 10:00 AM</div>
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
              <div className="SD-text-2xl SD-font-bold">{enrolledCourses.length}</div>
              <div className="SD-text-sm SD-text-gray-600">Enrolled courses</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
