import ImageToExcelConverter from './components/ImageToExcelConverter'
import Vnrheader from './components/Vnrheader'
import Footer from './components/Footer'
import React, {useEffect} from 'react'


function App() {
//   useEffect(()=>{
//     const refreshSession = async()=>{
//       try{
//         const response = await axios.post('http://localhost:8000/create-session', {}, {withCredentials: true});
//         console.log("Session refreshed:",response.data);
//       }catch(err){
//         console.log("Session refresh failed:",err);
//     }
//   };
//   refreshSession();
//   },[]
// )
  return (
    <div>
      <Vnrheader></Vnrheader>
      <ImageToExcelConverter/>
      <Footer/>
    </div>
  )
}

export default App