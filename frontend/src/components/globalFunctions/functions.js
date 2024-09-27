import { Stack, Breadcrumbs, Link,Box } from '@mui/material';


const initialValue = [{id:1,href:'/',title:'Home',color:'inherit'}]
export const breadCrumb = (linkArr = [])=>{
  return <Stack spacing={2}>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                  {initialValue.concat(linkArr).map((item)=>(
                    <Link  underline="hover" href={item.href} key={item.id} sx={{color:`${item.color} !important`,fontSize:'14px'}}>{item.title}</Link>
                  ))}
              </Breadcrumbs>
        </Stack>
}

export const getUserInfo = () => {
  try {
      let userInfo = JSON.parse(localStorage.getItem('user'));
      return userInfo;
  } catch (err) {
    return {};
  }
}

export const commonContainer = (page)=>{
  const isLogin = page ==='login';
  return <Box className={`font-semibold text-4xl flex justify-center items-center ${isLogin?'h-60':'h-48'} text-white py-2 mb-3 mt-2`}
    sx={
      {
        background: 'linear-gradient(134deg, rgba(110, 49, 41, 0.5) 0%, rgba(110, 49, 41, 0.5) 14.286%,rgba(134, 48, 65, 0.5) 14.286%, rgba(134, 48, 65, 0.5) 28.572%,rgba(157, 46, 89, 0.5) 28.572%, rgba(157, 46, 89, 0.5) 42.858%,rgba(181, 45, 113, 0.5) 42.858%, rgba(181, 45, 113, 0.5) 57.144%,rgba(204, 43, 136, 0.5) 57.144%, rgba(204, 43, 136, 0.5) 71.43%,rgba(228, 42, 160, 0.5) 71.43%, rgba(228, 42, 160, 0.5) 85.716%,rgba(251, 40, 184, 0.5) 85.716%, rgba(251, 40, 184, 0.5) 100.002%),linear-gradient(122deg, rgb(223, 89, 139) 0%, rgb(223, 89, 139) 14.286%,rgb(195, 88, 127) 14.286%, rgb(195, 88, 127) 28.572%,rgb(167, 87, 116) 28.572%, rgb(167, 87, 116) 42.858%,rgb(140, 87, 104) 42.858%, rgb(140, 87, 104) 57.144%,rgb(112, 86, 92) 57.144%, rgb(112, 86, 92) 71.43%,rgb(84, 85, 81) 71.43%, rgb(84, 85, 81) 85.716%,rgb(56, 84, 69) 85.716%, rgb(56, 84, 69) 100.002%)'
      }
    }
  >
    {page === 'login' ?'Login':'Signup'}
  </Box>
}

