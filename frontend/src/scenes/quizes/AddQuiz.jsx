import React, { useState, useEffect } from 'react';
import {
	Box, Tabs, Tab, Container, Typography, TextField, FormControl, RadioGroup, Button, Radio, Alert, FormLabel
} from '@mui/material';
import axios from 'axios';
import Grid from '@mui/material/Grid2';
import {useLocation,useNavigate} from 'react-router-dom';
import { breadCrumb } from '../../components/globalFunctions/functions';

const AddQuiz = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const categories = ['HTML', 'CSS', 'JavaScript', 'React JS'];
	const questionToEdit = location.state?.questionToEdit || null;
	const [tabValue, setTabValue] = useState(0); 
	const [selectedOption, setSelectedOption] = useState(null);
	const [alert,setAlert] = useState({show:false,message:'',type:''});
	const [formData, setFormData] = useState({ 
		question: '', 
		options: [
			{ id: 1, value: '', correct: false },
			{ id: 2, value: '', correct: false },
			{ id: 3, value: '', correct: false },
			{ id: 4, value: '', correct: false }
		],
		category: 'HTML', })

	const links = [{ id: 2, href: '/dashboard', title: 'Dashboard', color: '#5691c8' }, { id: 3, href: '/add-quiz', title: 'Add Question', color: '#5691c8' }];
   
		useEffect(() => {
			if (questionToEdit) {
				setFormData(questionToEdit); 
				const correctOption = questionToEdit.options.find(option => option.correct === true);
				setSelectedOption(correctOption ? correctOption.id : null);
				const tabIndex = categories.findIndex((each) => each === questionToEdit.category);
				setTabValue(tabIndex);
			}
		}, [questionToEdit]);

	useEffect(()=>{
		let timer;
	 if (alert.show) {
	 	timer = setTimeout(() => {
	 		setAlert({
	 			show: false,
	 			message: '',
	 			type: ''
	 		});
	 	}, 3000);
	 }
	 return () => clearTimeout(timer);
	},[alert])
	const handleOptionChange = (id,text)=>{
		setFormData((prev) => ({ ...prev, options: prev.options.map(option => option.id === id ? { ...option, value: text } : option)}))
	}

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
		setFormData({
			question: '',
			options: [
				{ id: 1, value: '', correct: false },
				{ id: 2, value: '', correct: false },
				{ id: 3, value: '', correct: false },
				{ id: 4, value: '', correct: false }
			],
			category: categories[newValue],
		});
		setSelectedOption(null); // Reset selected option
	};
	
	const handleCorrectOptionChange = (event)=>{
		const {value} = event.target;
		setSelectedOption(parseInt(value));
		setFormData((prev) => ({ ...prev, options: prev.options.map(option => option.id === parseInt(value) ? { ...option, correct: true } : { ...option, correct: false })}))
	}

	const saveFormValues = async(e)=>{
		 e.preventDefault();
		const payload = formData;
		if (selectedOption === null){
			setAlert({
				show: true,
				message: `Please select at least one option.`,
				type: 'error'
			});
			return false;
		}
		try{
			if(questionToEdit){
	       await axios.put(`/api/questions/update-question/${questionToEdit._id}`, payload);
				 setAlert({
				 	show: true,
				 	message: 'Question Edited Successfully!',
				 	type: 'success'
				 });
				  setTimeout(() => {
				  	navigate('/all-questions');
				  }, 3000); 
			}else{
					await axios.post('/api/add-question', payload);
					setAlert({
						show: true,
						message: 'Question Added Successfully!',
						type: 'success'
					});
			}
		}catch(err){
			setAlert({
				show: true,
				message: `${err.message}`,
				type: 'error'
			});
		}finally{
			setFormData({
				question: '',
				options: [{
						id: 1,
						value: '',
						correct: false
					},
					{
						id: 2,
						value: '',
						correct: false
					},
					{
						id: 3,
						value: '',
						correct: false
					},
					{
						id: 4,
						value: '',
						correct: false
					}
				],
				category: 'HTML',
			})
			setSelectedOption(null)
		}	
	}
	
	return (
		<Container maxWidth = 'lg' className = "mt-16 bg-customBg" >
			
			<Box className='flex justify-between items-center '>
				<Typography variant="h5" className="py-4">Add New Question</Typography>
				<Box className='flex justify-end'>{breadCrumb(links)}</Box>
			</Box>

		
			<Box className='flex'>
			<Tabs
			 orientation = "vertical"
			 variant = "scrollable"
			 value={tabValue}
			onChange={handleTabChange}
			className='bg-blueBg'
			>

				<Tab label="HTML" />
				<Tab label="CSS" />
				<Tab label="JavaScript" />
				<Tab label="React JS" />
			</Tabs>
				<Box className='px-4 py-4 grow'>
					<Box className='my-3'><Typography variant="h6">
						Add <span style={{ color:'#FF416C'}} className='mx-2 font-medium'>{formData.category}</span> Question
					</Typography></Box>
					{alert.show && <Alert severity={alert.type}>{alert.message}</Alert>}
					<form onSubmit={saveFormValues}>
						<TextField
							size='small'
							label="Question"
							value={formData.question}
							onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
							fullWidth
							margin="normal"
							required
							>
						</TextField>
						<FormControl component="fieldset" fullWidth margin="normal">
							<FormLabel className='font-bold' sx={{ color:'#4B79A1',fontSize:'17px',fontWeight:'600'}}>Options</FormLabel>
							<RadioGroup value={selectedOption} onChange={handleCorrectOptionChange} className='mt-3'>

								{
									formData.options.map((option) => (
										<Grid container key={option.id} sx={{marginBottom:'12px'}} className='flex items-center'>
											<Grid>
												<Box className=''><Radio value={option.id} className='text-white'></Radio></Box>
											</Grid>
											<Grid className='grow'>
												<TextField
													size='small'
													value={option.value}
													label={`Option ${option.id}`}
													onChange={(e) => handleOptionChange(option.id, e.target.value)}
													fullWidth
													required
												>
												</TextField>
											</Grid>
										</Grid>
									)
									)
								}
							</RadioGroup>
						</FormControl>
						<Box className="my-3"><Button variant='contained' type='submit' sx={{textTransform:'none',backgroundColor:'#000'}}
						>Save</Button></Box>
					</form>
				</Box>
			</Box>
		</Container>
	)
}

export default AddQuiz