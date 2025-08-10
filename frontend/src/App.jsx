import './style.css';
import Header from './Components/Header/header';
import HomePage from './Components/HomePage/home';
import Works from './Components/Works/work';
import {Routes, Route} from 'react-router-dom';


const App = () => {
    return(
        <>
         <Header />
        <Routes>
            <Route path='/' element={<HomePage />}></Route>
            <Route path='/works' element={<Works />}></Route>
        </Routes>
       
        
        </>
    )
}

export default App;