import React,{useState,useEffect} from 'react';
import { Container, Box, RadioGroup, Radio, Button, Alert } from '@mui/material';
import axios from 'axios';
import Confetti from 'react-confetti';
import { breadCrumb } from '../../components/globalFunctions/functions';

const TakeTest = () => {
  const [questions,setAllQuestions] = useState([]);
  const [currentQuestionIndex,setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); 
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const currentQuestion = questions[currentQuestionIndex];
  const [showConfetti, setShowConfetti] = useState(false);
  const [user, setUser] = useState({});
  const [answeredData, setAnsweredData] = useState({options:[]});
  const links = [
    { id: 2, href: '/dashboard', title: 'Dashboard', color: '#5691c8' },
    { id: 3, href: '/take-test', title: 'Take Test', color: '#5691c8' },
  ];

  useEffect(()=>{
   let timer;
    if (showConfetti){
      timer = setTimeout(()=>{
        setShowConfetti(false);
      },5000)
    }
    return ()=>clearTimeout(timer);
  }, [showConfetti])

  useEffect(()=>{
    const getAllQuestions = async()=>{
      try{
        const result = await axios.get('/api/questions');
        setAllQuestions(result.data.questions);
      }catch(err){
        console.log(err);
      }
    }
    getAllQuestions();
    getUserInfo();
  },[])
  const getUserInfo = () => {
    try {
      let userInfo = JSON.parse(localStorage.getItem('user'));
      if (userInfo) {
        setUser(userInfo.user);
      } else {
        setUser({});
      }
    } catch (err) {
      setUser({});
    }
  }

  useEffect(()=>{
    let timer;
    if(alert.show){
      timer = setTimeout(()=>{
        setAlert({ show: false, message: '', type: '' })
      },5000)
    }
    return ()=>clearTimeout(timer);
  },[alert])

  const handleSaveClick =async ()=>{
    if (answeredData.options.length === questions.length) {
      const payload ={
        studentId: user?.id,
        options: answeredData.options,
      }
      try{
        const token = localStorage.getItem('token');
        await axios.post('api/answered-options', payload, {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the request headers
          }
        });
        if (!showConfetti) {
          setShowConfetti(true);
        }
        setAlert({ show: true, message: 'Congrats! Test Completed.', type: 'success' });
        setSelectedAnswer(null);
        setAnsweredData([]);
        setCurrentQuestionIndex(0);
      
      }catch(err){
         console.log(err);
      }

    } else {
      setShowConfetti(false);
    }
  }
 
  
  const handleChangeOption = (e)=>{
    const questionId = currentQuestion._id;
    const selectedOption = Number(e.target.value);
    setSelectedAnswer(selectedOption);
    setAnsweredData((prev)=>{
      const existingRecordIndex = prev.options?.findIndex((data)=>data.questionId === questionId);
       if(existingRecordIndex>-1){
         const updatedOptions = [...prev.options];
         updatedOptions[existingRecordIndex] = { questionId: questionId, chosen: selectedOption };
         return { ...prev, options: updatedOptions};
      }else{
         return {...prev, options: [...prev.options, { questionId: questionId, chosen: selectedOption }] }
      }
    })
  }

  const handlePreviousClick = ()=>{
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => {
        const newIndex = prevIndex - 1;
        const previousAnswer = answeredData.options.find((data) => data.questionId === questions[newIndex]._id)?.chosen;
        setSelectedAnswer(previousAnswer || null);
        return newIndex;
      });
    }
  }
 
  const handleNextClick = ()=>{
    if (!selectedAnswer) {
      setAlert({ show: true, message: 'Please choose at least one option.', type: 'error' })
      return;
    }
    if (currentQuestionIndex < questions.length-1){
      setCurrentQuestionIndex((prev) => prev + 1)
    }
    setSelectedAnswer(null)
  }

  return (
   <Container maxWidth='lg' className='mt-16 bg-customBg'>
      {showConfetti && <Confetti />}
      <Box className='flex justify-between items-center mb-3'>
        <Box className='font-semibold text-2xl pt-4 font-serif' sx={{ color: "#0083B0" }}>
          Take Test
        </Box>
        <Box>{breadCrumb(links)}</Box>
      </Box>
      <Box className='pt-2 px-4 pb-20' sx={{ background: 'linear-gradient(to top, #dfe9f3 0%, white 100%)'}}>
        <Box className="font-sans font-medium text-lg mt-2 mb-2">
          {currentQuestionIndex + 1}.  {currentQuestion?.question}
        </Box>
        {
          alert.show&&<Alert className='my-2' severity={alert.type}>{alert.message}</Alert>
        }
        <RadioGroup value={selectedAnswer} onChange={handleChangeOption}>
           {
            currentQuestion?.options.map((option)=>(
              <Box className='flex items-center mb-3' key={option.id}>
                <Box><Radio value={option?.id}></Radio></Box>
                <Box>{option?.value}</Box>
              </Box>
            ))
           }
        </RadioGroup>
        <Box className='flex justify-between gap-x-6'>
          <Box className='flex items-center gap-x-6'>
            <Button variant='contained' sx={{ textTransform: 'none' }} onClick={handleSaveClick}>Save</Button>
            <Button variant='contained' onClick={handlePreviousClick} disabled={currentQuestionIndex === 0} sx={{ textTransform: 'none', background: '#000' }}>Previous</Button>
            <Button variant='contained' onClick={handleNextClick} disabled={currentQuestionIndex === questions.length - 1} sx={{ textTransform: 'none', background: '#000' }}>Next</Button>
          </Box>
          <Box>
            <span className="mb-4 text-lg font-sans font-semibold">
            Question 
              <span className="text-rose-600 ml-2">{currentQuestionIndex + 1}<span className="text-black"> of </span>{questions.length}</span>
            </span>
          </Box>
        </Box>
      </Box>
   </Container>
  
  )
}

export default TakeTest