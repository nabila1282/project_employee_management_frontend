import './App.css'
import MainLayout from './layouts/MainLayout'
import './App.css';
import React, { useState, useEffect } from "react";
// import LoadingSpinner from './components/ui/LoadingSpinner';
function App() {
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay for demonstration purposes
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Replace with actual loading logic
  }, []);
  return (
    <>
      {/* {isLoading ? (
        <LoadingSpinner /> // Display the loading spinner when isLoading is true
      ) : ( */}
        <MainLayout />
      {/* )} */}
    </>
  )
}

export default App
