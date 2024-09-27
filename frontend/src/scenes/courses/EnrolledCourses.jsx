import React,{useState,useEffect} from 'react'
import axios from 'axios';
import {
  Box,
  Chip,
  Typography,Container,
  Button
} from '@mui/material';
import {format} from 'date-fns';
import { breadCrumb,getUserInfo } from '../../components/globalFunctions/functions';

const EnrolledCourses = () => {
 const [enrolledCourses,setEnrolledCourses] = useState([]);
 const [user, setUser] = useState(getUserInfo());

 const modifiedDataArr = (enrolledCourses, allCourses) => {
   // Create a map for allCourses with courseId as the key
   const coursesMap = new Map(allCourses.map(course => [course._id, course]));

   // Iterate over enrolledCourses and merge the data if courseId matches
   return enrolledCourses.map(enrolledCourse => {
     const courseDetails = coursesMap.get(enrolledCourse.courseId);
     return courseDetails ? {
         ...enrolledCourse,
         title: courseDetails.title,
         instructor: courseDetails.instructorName
       } :
       enrolledCourse; // In case no match, return the original enrolledCourse
   });
 };

 useEffect(()=>{
if (user?.id) {
 fetchCourses();
}
 },[user])

   const fetchCourses = async()=>{
     try {
       const token = localStorage.getItem('token');
       const userId = user?.id;
       const [allCoursesResponse, enrolledCoursesResponse] = await Promise.all([
         axios.get('/api/courses', {
           headers: {
             Authorization: `Bearer ${token}` // Include the token in the request headers
           }
         }),
         axios.get(`/api/enrolled-courses/${userId}`, {
           headers: {
             Authorization: `Bearer ${token}` // Include the token in the request headers
           }
         })
       ]);
       const allCourses = allCoursesResponse.data;
       const enrolledCoursesData = enrolledCoursesResponse.data;
      
       const modifiedData = modifiedDataArr(enrolledCoursesData, allCourses);
       setEnrolledCourses(modifiedData);
     } catch (err) {
       console.log(err);
     }
   }
  const links = [
    { id: 2, href: '/dashboard', title: 'Dashboard', color: '#5691c8' },
    { id: 3, href: '/enrolled-courses', title: 'Enrolled Courses', color: '#5691c8' },
  ];
  return (
    <Container maxWidth='lg' className='mt-16 bg-customBg'>
    	<Box className='flex justify-between items-center'>
			<Box className='font-semibold text-2xl pt-4 font-serif' sx={{ color: "#0083B0" }}>
			Enrolled Courses
			</Box>
				<Box>{breadCrumb(links)}</Box>
			</Box>
      <Box className="w-full p-6">
        {enrolledCourses.length > 0 ? (
          <Box className="space-y-6">
            {enrolledCourses.map((course, index) => (
              <Box
                key={course.courseId}
                className={`p-4 flex justify-between shadow-inner rounded-lg ${index % 2 === 0 ? 'bg-slate-100' : 'bg-white'
                  }`}
              >
              <Box>
                  <Box className='mb-2'><Typography variant="body" sx={{ fontFamily: 'serif' }} className="text-lg font-semibold text-gray-800">
                    {course.title}
                  </Typography>
                  </Box> 
                  <Box className='mb-3'>
                    <span className="text-base font-serif font-semibold" style={{ color: '#44A08D' }}> Instructor: : </span><span style={{ color: '#808080' }} className="font-medium font-sans text-base">{course.instructor}</span>
                  </Box>
                  <Button variant='contained' sx={{ textTransform: 'none', backgroundColor:'#9BB0C1'}}>Access Resource</Button>
              </Box>
               <Box>
                  <span className="text-sm font-serif font-medium" style={{ color: '#0083B0' }}>Enrolled On : </span><span style={{ color:'#808080'}} className="font-medium font-sans text-sm">{format(course.enrolledDate,'dd/MM/yyyy')}</span>
                  <Box className='mt-1'><Chip label={course.status} variant="filled" size="small" sx={{ backgroundColor:'#95D2B3',padding:'13px',color:'#fff',fontWeight:'bold'}}/></Box> 
               </Box>
              </Box>
            ))}
          </Box>
        ) : (
            <Box className='p-32 text-2xl w-full flex justify-center items-center font-semibold'>You have not enrolled in any course yet.</Box>
        )}
      </Box>
    </Container>
  )
}

export default EnrolledCourses