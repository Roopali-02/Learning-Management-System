import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { Container, Box, Typography, Button, Paper, Avatar, Chip, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { breadCrumb } from '../components/globalFunctions/functions';
import CarousalImage from '../assets/modified.png';
import newImage from '../assets/newestLM.png';
import { AssignmentInd, Email, AdminPanelSettings } from '@mui/icons-material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Dashboard = () => {
	const [userData, setUserData] = useState(null);
	const links = [{ id: 2, href: '/dashboard', title: 'Dashboard', color: '#5691c8' }];
  

	 useEffect(()=>{
		const fetchData = async ()=>{
			const token = localStorage.getItem('token');
			try{
						const response = await axios.get('/api/dashboard', {
							headers: {
								Authorization: `Bearer ${token}`,
							}
						})
						setUserData(response.data);
					}catch(err){
					 setUserData(null);
					}
		}
		fetchData();
	 },[])

	const carouselSettings = {
		dots: false,
		infinite: true,
		speed: 7000,
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true, // Enable autoplay
		autoplaySpeed: 0, // No delay between transitions
		cssEase: 'linear', // Continuous smooth transition
	};

	const profilePerformanceParams =[
		{ title:'Courses Completed',value:0},
		{ title: 'Quizzes Taken', value: 0 },
		{ title: 'Total Learning Hours', value: 0 },
		{ title: '	Current Learning Streak', value: 0 },
	]

	const classNames = 'flex gap-x-3 my-2 font-medium text-seventeen font-sans';
	return (
		<Container maxWidth="lg" className="bg-customBg p-4 mt-16 z-0">
			<Box className='flex justify-end'>{breadCrumb(links)}</Box>
			<Box className='text-3xl font-semibold mb-4'>
				<span className=''>Welcome Back,</span>
				<span className='capitalize text-rose-600 ml-3'>{userData?.user?.name || 'Guest'}</span>
		</Box>
			<Grid container >
				<Grid size={{ xs: 12,sm:4, md: 4,lg:5 }}>
					<Paper className='p-2 flex justify-center flex-col items-center'>
						<Box className='my-2'><Typography variant="h6" className='text-center'>Profile Overview</Typography></Box>
						<Box className='flex justify-center items-center'>
							<Avatar sx={{ width: 90, height: 90, background: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)', color: '#434343', fontSize: '25px' }} />
						</Box>
						<Box className="w-40 mx-auto mt-3">
							<Box className={`${classNames} capitalize`}><AssignmentInd/>{userData?.user?.name || 'N/A'}</Box>
							<Box className={`${classNames}`}><Email />{userData?.user?.email || 'N/A'}</Box>
							<Box className={`${classNames} capitalize`}><AdminPanelSettings className='' />{userData?.user?.role || 'N/A'}
							</Box>
						</Box>
						<Box className="flex gap-x-2 mb-6 mt-2">
							<Chip label="Top Performer" sx={{ background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)'}} />
							<Chip label="Certified Developer" sx={{ background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)' }} />
						</Box>
						{userData?.user?.role === 'student'&&
							<Box className="p-3 bg-blueBg rounded-lg">
							<Box className='font-semibold' sx={{ color:'#4e54c8'}}>Profile performance</Box>
							 <Box className='flex mb-3 mt-4'>
							 {
									profilePerformanceParams.map((param,index)=>(
										<div key={param.title} className='flex'>
										<Box>
											<Box className='text-xs ml-1.5 font-serif font-semibold'>{param.title}</Box>
											<Box className='ml-1.5  mt-1 text-sm text-blue-600 font-semibold'>{param.value}</Box>
										</Box>
											{index !== profilePerformanceParams.length-1 &&<Divider orientation='vertical' flexItem />}
										</div>
									))
							 }
							 </Box>
						</Box>
						}
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, sm:8, md: 8,lg: 7}}>
					<Paper className='w-full h-full flex flex-col gap-y-5 p-5 justify-center' sx={{ background: 'linear-gradient(60deg, #fdfbfb 0%, #ebedee 100%)'}}>
						<Box className='text-2xl font-semibold' sx={{ color:'#136a8a'}}>Unlock Your Potential</Box>
						<Box className='text-5xl font-extrabold'>Shape Your Future in Technology</Box>
						<Box className=''>An exclusive, hands-on training experience to master cutting-edge skills and land your dream job in 4 months.</Box>
						<Button variant='contained' sx={{ textTransform: 'none', width: '30%', background:'#136a8a'}}>Get Started</Button>
					</Paper>
				</Grid>
			</Grid>

			{/* Carosoul code */}
			<Box className='mt-10 mb-2'>
				<Box className='text-4xl font-semibold mb-2'>Our Motto</Box>
				<Slider {...carouselSettings}>
						<div><img src={CarousalImage} alt="logo 1" className='w-full h-full object-contain' /></div>
						<div><img src={newImage} alt="Logo 2" className='w-full h-full object-contain' /></div>
						<div><img src={CarousalImage} alt="Logo 3" className='w-full h-full object-contain' /></div>
						<div><img src={newImage} alt="Logo 4" className='w-full h-full object-contain' /></div>
						<div><img src={CarousalImage} alt="Logo 5" className='w-full h-full object-contain'/></div>
						<div><img src={newImage} alt="Logo 6" className='w-full h-full object-contain' /></div>
				</Slider>
			</Box>
		</Container>
	)
}

export default Dashboard