import React, {
	useState,
	useEffect
} from 'react';
import logo from '../../assets/lmslogo.png';
import { Box, Button, Fade, Popover, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getUserInfo } from '../globalFunctions/functions';

const Header = () => {
	
	
	const navigate = useNavigate();
	const location = useLocation();
	const [anchorElCourses, setAnchorElCourses] = useState(null);
	const [anchorElQuizzes, setAnchorElQuizzes] = useState(null);
	const [user,setUser] = useState(getUserInfo());
	const [isStudent,setIsStudent] = useState(false);

	const selectedPaths = ['/','/login','/signup'].includes(location.pathname);

	useEffect(() => {
		const handleStorageChange = () => {
			const updatedUser = getUserInfo(); // Fetch updated user info
			setUser(updatedUser); // Update state with new user info
		};

		// Set up event listener for storage changes
		window.addEventListener('storage', handleStorageChange);

		// Cleanup listener on component unmount
		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);
	useEffect(()=>{
		if(user)setIsStudent(user?.role === 'student');
	},[user])

	const handleLogout = () => {
		localStorage.removeItem('token'); 
		localStorage.removeItem('user');
		setUser(null); 
		navigate('/login'); 
	}

	const handleClick = (event,type)=>{
		return type === 'course' ? setAnchorElCourses(event.currentTarget) : setAnchorElQuizzes(event.currentTarget);
	}
	const handleClose = (type) => {
		return type === 'course' ? setAnchorElCourses(null) : setAnchorElQuizzes(null);
	};
	const optionClickAction = (path='',type='')=>{
		navigate(path);
		return type === 'course' ? setAnchorElCourses(null) : setAnchorElQuizzes(null)
	}

	const optionStyle = { color:'#4B79A1',fontFamily:'serif',cursor:'pointer',px:'8px',py:'4px'}

	return (
		<header className="w-full h-16 bg-customBg shadow-sm flex items-center justify-between fixed top-0 z-10">
			<Box className='flex justify-start items-center pl-10 gap-x-6'>
			<Box><img src={logo} alt='logo' className='h-11 object-contain' /></Box>
			<Box className='flex items-center gap-x-4'>
					{!selectedPaths &&<Button 
					sx={{ textTransform: 'none', color: '#136a8a', fontSize: '17px', fontFamily: 'serif', fontWeight: '600' }}
					onClick={(event) => handleClick(event,'course')}
				>Courses</Button>}
				<Popover
					id="courses"
					anchorEl={anchorElCourses}
					open={Boolean(anchorElCourses)}
					TransitionComponent={Fade}
					onClose={() => handleClose('course')}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
				> 
				{
					<>
						<Typography className='hover:bg-neutral-200' onClick={() => optionClickAction(isStudent ? '/all-courses' : '/add-course', 'course')} sx={optionStyle}>{isStudent ? 'View Courses' :'Add new course'}</Typography>

						<Typography className='hover:bg-neutral-200' onClick={() => optionClickAction(isStudent ? `/enrolled-courses` : '/all-courses', 'course')} sx={optionStyle}>{isStudent ? 'Enrolled  Courses' :'View all courses'}</Typography>
					</>
				}
				</Popover>
				{
					!selectedPaths &&
					<Button
						sx={{ textTransform: 'none', fontFamily: 'serif', color: '#136a8a', fontSize: '17px', fontWeight: '600' }}
						onClick={(event) => handleClick(event, 'quiz')}
					>
					Questions
					</Button>
				}
				<Popover
					id="questions"
					anchorEl={anchorElQuizzes}
					open={Boolean(anchorElQuizzes)}
					onClose={() => handleClose('quiz')}
					TransitionComponent={Fade}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
				>
						{
							<>
								<Typography className='hover:bg-neutral-200' onClick={() => optionClickAction(isStudent ? '/take-test' : '/add-quiz', 'quiz')} sx={optionStyle}>
								{isStudent ? 'Take Test' : 'Add question'}
								</Typography>
								<Typography className='hover:bg-neutral-200' onClick={() => optionClickAction(isStudent ? '/view-result' : '/all-questions', 'quiz')} sx={optionStyle}>{isStudent ? 'Test Result' : 'View all questions'}
								</Typography>
							</>
						}
				</Popover>
			</Box>
			</Box>
			<Box className="pr-10">
				{
					!selectedPaths&&
					<Button sx={{ textTransform: 'none', fontFamily: 'serif', color: '#136a8a', fontSize: '17px', fontWeight: '600' }}
						onClick={handleLogout}
					>Logout
					</Button>
				}
				
			</Box>
		</header>
	)
}

export default Header