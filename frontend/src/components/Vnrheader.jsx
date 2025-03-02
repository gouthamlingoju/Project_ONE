// import './styles.css';
import image from '../assets/image.png';

function Vnrheader(){
    return(
        <div className="shadow h-auto justify-center fixed top-0 left-0 w-full bg-white z-100 mb-5 px-5 my-3">
            <div className='flex justify-between'>
                <div className='flex'>
                <img className="w-15 h-15 mx-3" src={image} alt="" />
                <p className=" text-red-600 text-4xl p-3 mb-3">VNRVJIET</p>
                </div>
                <h3 className="mt-3 text-center">Data extraction from Certificates</h3>
            </div>
        </div>
    )
}

export default Vnrheader;