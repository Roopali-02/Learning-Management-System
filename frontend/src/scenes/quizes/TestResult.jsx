import React, { useState, useEffect } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	LabelList,
	PieChart, Pie, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import { Container, Box,Paper } from '@mui/material';
import { breadCrumb,getUserInfo } from '../../components/globalFunctions/functions';

const TestResult = () => {
	const [chartData, setChartData] = useState([]);
	const [chartWidth, setChartWidth] = useState(0);
	const [pieChartData,setPieChartData] = useState([]);
	const [questionCount,setQuestionCount] = useState([{total:0,correct:0,incorrect:0}]);
	const [user] = useState(getUserInfo());
	const categories = ['HTML', 'CSS', 'JavaScript', 'React JS'];
	const SCALE_FACTOR = 6; 

	const links = [
		{ id: 2, href: '/dashboard', title: 'Dashboard', color: '#5691c8' },
		{ id: 3, href: '/view-result', title: 'Test Result', color: '#5691c8' },
	];
	useEffect(() => {
		if (user?.id) {
			fetchAnsweredData();
		}
	}, [user]);
	
	const fetchAnsweredData = async () => {
		try {
			const token = localStorage.getItem('token'); 
			const userId = user?.id;
			const [allQuestions, answeredOptions] = await Promise.all([
				axios.get('/api/questions', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}),
				axios.get(`/api/answered-options/${userId}`, {
					headers: {
						Authorization: `Bearer ${token}` //
					}
				})
			]);
			const questions = allQuestions.data.questions;
			const ops = answeredOptions.data[0].options;
			
			const mappedArr = new Map(questions.map((data) => [data._id, data.options.find((op) => op.correct === true)]));
			const mappedCategories = questions.map((data) => data.category);

			
			const pieData = categories.map((category)=>{
				const filteredCategories = mappedCategories.filter((item) => item === category);
				return { name: category, value: filteredCategories.length };
			})
			setPieChartData(pieData);
			
			
			const barChartData = ops.map((option, index) => {
				const optionDetails = mappedArr.get(option.questionId);
				const correct = optionDetails.id === option.chosen ? 1 : 0;
				const incorrect = optionDetails.id !== option.chosen ? 1 : 0;

				// Scale the values
				return {
					name: `Q${index + 1}`,
					correct: correct * SCALE_FACTOR,
					incorrect: incorrect * SCALE_FACTOR
				};
			});
			setChartData(barChartData);
			const correctCount = barChartData.filter((each)=>each.correct !== 0);
			const inCorrectCount = ops.length - correctCount.length;
			setQuestionCount({ total: ops.length, correct: correctCount.length, incorrect: inCorrectCount})

		} catch (err) {
			setQuestionCount({ total: 0, correct: 0, incorrect: 0 })
		}
	};
	
	useEffect(() => {
		const updateChartWidth = () => {
			const chartContainer = document.getElementById('chartContainer');
			if (chartContainer) {
				setChartWidth(chartContainer.offsetWidth);
			}
		};
		updateChartWidth();
		window.addEventListener('resize', updateChartWidth);
		return () => window.removeEventListener('resize', updateChartWidth);
	}, []);

	const cardData = [
		{ title: 'Total Questions Answered', color: '#9D50BB', count: questionCount.total },
		{ title: 'Total Correct Answers', color: '#136a8a', count: questionCount.correct },
		{ title: 'Total Incorrect Answers', color: '#cb2d3e', count: questionCount.incorrect },
	]

	return (
		<Container maxWidth='lg' className='mt-16 bg-customBg pb-10'>
			<Box className='flex justify-between items-center mb-3 mt-2'>
				<Box className='font-semibold text-2xl pt-4 font-serif' sx={{ color: "#0083B0" }}>
					Test Result
				</Box>
				<Box>{breadCrumb(links)}</Box>
			</Box>
		<Box className='flex justify-around gap-x-6 mb-6'>
		{
			cardData.map((data)=>(
				<Paper className='p-3 flex flex-col items-center gap-y-3' elevation={1} key={data.title}>
					<Box className='font-medium text-xl'>{data.title}</Box>
					<Box className='font-bold text-2xl' sx={{ color: data.color }}>{data.count}</Box>
				</Paper>
			))
		}
		</Box>
			<Box className='w-full flex mt-10 mb-16' height={400}>
				<Box id="chartContainer" className='basis-3/6'>
					<Box className='text-lg font-semibold my-5 text-center'>Correct vs Incorrect Responses per Question</Box>
					{chartData.length>0&&chartWidth > 0 ?  // Ensure chartWidth is set before rendering the chart
						<BarChart
							width={chartWidth}
							height={350}
							data={chartData}
							barGap={20}
							barCategoryGap={50}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="correct" fill="#02AAB0" barSize={25}>
								<LabelList dataKey="correct" position="top" />
							</Bar>
							<Bar dataKey="incorrect" fill="#1488CC" barSize={25}>
								<LabelList dataKey="incorrect" position="top" />
							</Bar>
						</BarChart>
						:
						<Box 
							className='flex justify-center items-center w-full h-full font-semibold text-xl' 
							sx={{ color: '#654ea3', background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)' }}
							>
							NO DATA
						</Box>
					}
				</Box>
				<Box className='basis-3/6'>
					<Box className='text-lg font-semibold my-5 text-center'>Distribution of Questions by Category</Box>
				 <Box className='flex items-center gap-x-5 justify-center'>
					{
						pieChartData?.map((category)=>(
							<Box className='flex p-1' key={category.name}>
								<span className='font-semibold'>{category.name}</span>
								<span className='font-semibold ml-3' style={{ color:'#EA384D'}}>{category.value}</span>
								</Box>
						))
					}
				 </Box>
					{
						pieChartData.length === 0 &&
						<Box className='flex justify-center items-center h-full w-full font-semibold text-xl' sx={{ color: '#654ea3', background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)'}}>
							NO DATA
						</Box>
					}
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={pieChartData} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#B79891" label
							/>
						</PieChart>
					</ResponsiveContainer>
				</Box>
			
			</Box>
		</Container>
	);
};

export default TestResult;
