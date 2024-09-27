import React,{useState,useEffect} from 'react';
import { format } from 'date-fns';
import {
	Container,
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Alert,
	TablePagination,
	CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { breadCrumb } from '../../components/globalFunctions/functions';

const AllQuestions = () => {
	const navigate = useNavigate();
	const [questions,setQuestions] = useState([]);
	const [open, setOpen] = useState(false);
	const [selectedQuestion, setSelectedQuestion] = useState(null);
	const [alert,setAlert] = useState({show:false,message:'',type:''});
	const [paginationProps, setPaginationProps] = useState({ page: 0, rowsPerPage: 10, totalQuestions:0 })
	const [loading, setLoading] = useState(false);
	const links = [{ id: 2, href: '/dashboard', title: 'Dashboard', color: '#5691c8' }, { id: 3, href: '/all-questions', title: 'All Questions', color: '#5691c8' }];

	const handleClickOpen = (question) => {
		setSelectedQuestion(question);
		setOpen(true);
	};

	
	//Delete Question
	const handleDeleteClick = async (id)=>{
     try{
       const response = await axios.delete(`/api/questions/delete-question/${id}`)
			 fetchQuestions();
			 setAlert({ show: true, message: response.data.message, type: 'success' })
		 }catch(err){
			 setAlert({ show: true, message: `Error deleting question: ${err.message}`, type: 'error' })
		 } finally {
			 handleClose();
		 }
	}
	const handleClose = () => {
		setOpen(false);
		setSelectedQuestion(null);
	};

	const handlePageChange = (event, newPage)=>{
		setPaginationProps((props) => ({ ...props, page: newPage }));
	}

	const handleRowsPerPageChange = (event)=>{
		setPaginationProps((props) => ({ ...props, rowsPerPage: parseInt(event.target.value, 10),page:0 }));
	}

	useEffect(()=>{
		let timer;
	  if(alert.show){
			timer = setTimeout(()=>{
				setAlert({ show: false, message:'', type: '' })
			},3000)
		}
		return()=>clearTimeout(timer);
	},[alert])
  
	//Edit Question
	const handleEditClick = (question)=>{
		navigate('/add-quiz', { state: { questionToEdit: question }})
	}

	useEffect(()=>{
		fetchQuestions();
	}, [paginationProps.page, paginationProps.rowsPerPage])


	const fetchQuestions = async () => {
		try {
			setLoading(true);
			const response = await axios.get('/api/questions',
				{
					params: {
						page: paginationProps.page + 1,
						limit: paginationProps.rowsPerPage
					}
				});
			setQuestions(response.data.questions);
			setPaginationProps(prev => ({
				...prev,
				totalQuestions: response.data.totalQuestions
			}));
		} catch (err) {
			console.log(err)
		}finally{
				setLoading(false);
		}
	}

	return (
		<Container maxWidth='lg' className='mt-16 bg-customBg'>
		
			<Box className='flex justify-between items-center '>
				<Box className='font-semibold text-2xl py-4 font-serif' sx={{ color: "#757F9A" }}>Questions</Box>
				<Box className='flex justify-end'>{breadCrumb(links)}</Box>
			</Box>
			{alert.show&&<Alert severity={alert.type}>{alert.message}</Alert>}
		 <Box>
				{
					loading && <Box className='flex justify-center items-center w-full h-full'><CircularProgress></CircularProgress></Box>
				}
				<TableContainer sx={{ maxHeight: 500 }}>
					{!loading &&questions.length>0&&
						<Table stickyHeader>
							<TableHead>
								<TableRow>
									<TableCell sx={{ backgroundColor: '#283E51', fontSize: '16px', fontWeight: 500,color:'#fff' }}>Question</TableCell>
									<TableCell sx={{ backgroundColor: '#283E51', fontSize: '16px', fontWeight: 500, color: '#fff' }}>Created On</TableCell>
									<TableCell sx={{ backgroundColor: '#283E51', fontSize: '16px', fontWeight: 500,color:'#fff' }}>Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{questions.map((question) => (
									<TableRow key={question._id}>
										<TableCell sx={{fontSize: '14px', fontWeight: 500}}>{question.question.length > 50 ? question.question.slice(0, 80) + '...' : question.question}</TableCell>
										<TableCell sx={{ fontSize: '14px', fontWeight: 500}}>{format(new Date(question.createdAt),'dd/MM/yyyy')}</TableCell>
										<TableCell>
											<Button variant="contained" sx={{ textTransform: 'none', color:'#fff', background:'#A9A9A9'}} onClick={() => handleClickOpen(question)}>View Details</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					}
					{!loading&&questions.length === 0 &&
					<Box className='w-full min-h-screen flex justify-center items-center font-bold text-3xl font-mono' sx={{ color: '#355C7D' }}>NO DATA</Box>
					}
				</TableContainer>

				{/* Pagination */}

				<TablePagination
					rowsPerPageOptions={[10, 25, 50]}
					component="div"
					count={paginationProps.totalQuestions}
					rowsPerPage={paginationProps.rowsPerPage}
					page={paginationProps.page}
					onPageChange={handlePageChange}
					onRowsPerPageChange={handleRowsPerPageChange}
				>
				</TablePagination>

				{/* Detailed Popup */}
				{selectedQuestion && (
					<Dialog open={open} onClose={handleClose}>
						<DialogTitle><p className='font-serif' style={{ color:'#808080',fontSize:'17px'}}>{selectedQuestion.question}</p></DialogTitle>
						<DialogContent dividers>
							{selectedQuestion?.options.map((option, index) => (
								<p key={index} style={{ fontWeight: option.correct ? 'bold' : 'normal' }} className='mb-3 font-sans'>
									{option?.value}
								</p>
							))}
						</DialogContent>
						<DialogActions className="my-2">
							<Button sx={{ textTransform: 'none',background:'#000' }} variant='contained' onClick={handleClose}>Close</Button>
							<Button autoFocus sx={{ textTransform: 'none', background:'#4CA1AF' }} variant='contained' onClick={() => handleEditClick(selectedQuestion)}>Edit</Button>
							<Button autoFocus sx={{ textTransform: 'none', background: '#cb2d3e' }} variant='contained' onClick={() => handleDeleteClick(selectedQuestion._id)}>Delete</Button>
						</DialogActions>
					</Dialog>
				)}
		 </Box>
		</Container>
	)
}

export default AllQuestions