import React from 'react';

const divStyle = {
  backgroundImage: 'url("/src/assets/bg-5.jpg")',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  height: '100vh', // Adjust the height as needed
  display: 'flex',
  width:'100%',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function Home() {
  return (
    <div style={divStyle}>
      <h1 className='text-center'>Welcome to Employee Management</h1>
    </div>
  );
}

