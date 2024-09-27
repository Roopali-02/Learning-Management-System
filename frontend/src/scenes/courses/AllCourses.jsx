import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { Container, Box, Typography, Button, useMediaQuery, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress } from '@mui/material';
import {
	breadCrumb,
	getUserInfo
} from '../../components/globalFunctions/functions';

const AllCourses = () => {
	const isAboveSmallScreen = useMediaQuery('(min-width:768px)');
	const [open, setOpen] = useState(false);
	const [courses,setCourses] = useState([]);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [alert,setAlert] = useState({show:false,message:'',type:''})
	const [enrolledCourseData,setEnrolledCourseData] = useState([{studentId:'',courseId:'',enrolledDate:'',status:'Active'}]);
	const [user, setUser] = useState(getUserInfo());
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	const [loading,setLoading] = useState(false);
	const links = [{
			id: 2,
			href: '/dashboard',
			title: 'Dashboard',
			color: '#5691c8'
		},
		{
			id: 3,
			href: '/all-courses',
			title: 'View Courses',
			color: '#5691c8'
		},
	];
	
	const handleClickOpen = (course) => {
		setOpen(true);
		setSelectedCourse(course);
	};
	const handleClose = () => {
		setOpen(false);
		setSelectedCourse(null); 
	};

	useEffect(()=>{
		let timer;
		if(alert.show){
			timer=setTimeout(()=>{
				setAlert({ show: false, message: '', type: '' })
			},3000)
			return ()=>clearTimeout(timer);
		}
	},[alert])

	const fetchEnrolledCourses = async () => {
		try{
     const token = localStorage.getItem('token');
		  const userId =user?.id;
		 const response = await axios.get(`/api/enrolled-courses/${userId}`, {
		 	headers: {
		 		Authorization: `Bearer ${token}` // Include the token in the request headers
		 	}
		 });
		 	const courseIds = response.data.map((data) => data.courseId)
		 	setEnrolledCourses(courseIds);
		}catch(err){
 			console.error('Error fetching enrolled courses:', err);
		}
	}

	useEffect(() => {
		if (user?.id) {
			fetchEnrolledCourses();
		}
	}, [user]);

	useEffect(()=>{
		getAllCourses();
	},[])

	const getAllCourses = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem('token');
			  const response = await axios.get('/api/courses', {
			  	headers: {
			  		Authorization: `Bearer ${token}` // Include the token in the request headers
			  	}
			  });
			setCourses(response.data);
		} catch (err) {
			setCourses([]);
		} finally {
			setLoading(false); // This will run whether the try block succeeds or fails
		}
	}

	const handleClickDelete =async (id)=>{
    try{
      const response = await axios.delete(`/api/courses/delete-course/${id}`);
			setOpen(false);
			setAlert({show:true,message:response.data.message,type:'success'})
			getAllCourses();
		}catch(err){
			setAlert({ show: true, message: err.message, type: 'error' })
		}
	} 

	const handleClickEnroll = async (course)=>{
		let payload = { studentId: user?.id, courseId: course._id, enrolledDate: new Date(), status: 'Active' };
		setEnrolledCourseData({ studentId: user?.id, courseId: course._id, enrolledDate: new Date(), status: 'Active' })
		try{
			 const token = localStorage.getItem('token');
			const result = await axios.post('/api/enroll-course', payload, {
				headers: {
					Authorization: `Bearer ${token}` // Include the token in the headers
				}
			});
			setEnrolledCourses((prev) => [...prev, course._id]);
			setAlert({ show: true, message: `Successfully enrolled in the course: ${course.title}!`, type: 'success' })
		}catch(err){
			setAlert({ show: true, message: err.message, type: 'error' })
		}
	}


	return (
		<Container maxWidth='lg' className='mt-16 bg-customBg'>
		<Box className='flex justify-between items-center'>
			<Box className='font-semibold text-2xl pt-4 font-serif' sx={{ color: "#0083B0" }}>
			Courses
			</Box>
				<Box>{breadCrumb(links)}</Box>
			</Box>
			{
				alert.show && <Alert severity={alert.type} className='my-5'>{alert.message}</Alert>
			}
			{
				loading && <Box className='flex justify-center items-center min-h-screen w-full'><CircularProgress /></Box>
			}
			{!loading && courses.length>0&&
				<Box className={`${!isAboveSmallScreen ? 'flex-col' : 'flex-row'} flex justify-center flex-wrap gap-4 w-full`}>
					{courses.map((course) => (
						<Box
							className={`flex flex-col items-center justify-between bg-slate-100 p-4 gap-2 my-5 ${isAboveSmallScreen ? 'w-64' : 'w-full'} rounded-md `}
							key={course._id}
							sx={{
								boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
							}}
						>
							<Typography variant='body1'>{course.title}</Typography>
							<Box className='h-16 m-0 text-ellipsis overflow-hidden'
								sx={{
									display: '-webkit-box',
									WebkitBoxOrient: 'vertical',
									WebkitLineClamp: 3, // Adjust this based on your font size and line height
								}}
							>
								<Typography variant="body2" color="textSecondary" gutterBottom>
									{course.description}
								</Typography>
							</Box>
							<Chip
								variant='outlined'
								color='info'
								label={course.level}
							/>
							<Typography variant="body2" color="textSecondary">
								Instructor: {course.instructorName}
							</Typography>

							<Box className= {`flex ${user?.role === 'student' ? 'justify-between':'justify-center'} w-full my-4`}>
								<Button variant="contained" className="mt-4" sx={{ textTransform: 'none', backgroundColor: '#000' }} onClick={() => handleClickOpen(course)}>
									Learn More
								</Button>
								{
									user?.role === 'student' &&
									<Button variant="contained" className="mt-4" sx={{ textTransform: 'none', color: '#fff !important', backgroundColor: enrolledCourses.includes(course._id) ? '#928DAB !important' : '#6190E8' }} onClick={()=>handleClickEnroll(course)}
											disabled={enrolledCourses.includes(course._id)}
									>
											{enrolledCourses.includes(course._id) ? 'Enrolled' : 'Enroll'}
									</Button>
								}
							 </Box>
						
						</Box>
					))}
					<Dialog
						open={open}
						onClose={handleClose}
					>
						{selectedCourse && (
							<>
								<DialogTitle><p className="font-sans font-medium text-base">{selectedCourse.title}</p></DialogTitle>
								<DialogContent dividers><Typography variant="subtitle1">{selectedCourse.description}</Typography></DialogContent>
								<DialogActions className="my-2">
									<Button autoFocus sx={{ textTransform: 'none', background: '#4CA1AF' }} variant='contained' onClick={handleClose}>
										Show Details
									</Button>
									<Button autoFocus sx={{ textTransform: 'none', background: '#cb2d3e' }} variant='contained' onClick={() => handleClickDelete(selectedCourse._id)}>
										Delete
									</Button>
								</DialogActions>
							</>
						)}
					</Dialog>
				</Box>
			}

			{
				courses.length===0&&<Box className="flex h-full w-full text-3xl min-h-screen justify-center items-center overflow-hidden font-bold">No Courses To Display!</Box>
			}
		
		</Container>
	)
}

export default AllCourses