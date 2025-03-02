import React from 'react'

function Footer() {
  return (
    <div className='bg-gray-120 bottom-0 w-full pt-4 shadow shadow-md flex justify-between mt-5 px-8 fixed z-100 bg-white'>
      <div>
        <h5>Project by:</h5>
        <div className='flex'>
        <ul className='p-0'>
            <li>L. Goutham</li>
            <li>M. Harshavardhan</li>
            <li>G. Charmi Bai</li>
        </ul>
        <ul>
            <li>M. Akhila</li>
            <li>D. L. Sarvani</li>
        </ul>
        </div>
      </div>  
      <div>
        <h5>Project Guided by: </h5>
        <ul className='p-0'>
            <li>Dr. V. Baby, HOD [CSE, VNRVJIET]</li>
            <li>Dr. B.V. Kiranmayee, Professor [CSE, VNRVJIET]</li>
            <li>Mr. P. Sudheer Benarji, Assistant Professor [CSE, VNRVJIET]</li>
        </ul>
      </div>
    </div>
  )
}

export default Footer
