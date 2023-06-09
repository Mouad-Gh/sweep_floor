import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import FloorCard from './components/FloorCard'
import useFetch from './hooks/useFetch'
import ReactDOM from 'react-dom';

function App() {
  const { loading, error, data } = useFetch();
  //
  const [ walletAddress, setWalletAddress ] = useState(null);
  // console.log(data);
  //to navigate to the buy floor section
  const myDiv = useRef(null);
  function handleClick() {
    const node = ReactDOM.findDOMNode(myDiv.current);
    node.scrollIntoView({ behavior: "smooth" });
  }

  
  //
  // function handleWindowSize(){
  //   setWindowSize({
  //     width: window.innerWidth,
  //     height: window.innerHeight
  //   });
  // }
  //stop the confetti animation
  
  return (
    <div className="pb-8">
      <Navbar walletAddress={walletAddress} setWalletAddress={setWalletAddress} />
      
      <section className="container p-8 mx-auto xl:px-0 relative">
        <div className="w-full max-h-[70vh] py-0 md:py-[6%] flex flex-col md:flex-row md:justify-evenly gap-2 md:gap-0 ">
          <div className="text-left md:py-[5%] selection:bg-black selection:text-white">
            <h2 className="text-[40px] md:text-[60px] ">Cosmos Ape Alliance.</h2>
            <p className="text-xl">Join the Ape revolution with our NFTs on Stargaze and rule the digital jungle! </p>
            <button onClick={handleClick} className="text-[25px] px-10 border-black mt-10 border p-2 rounded-md">Buy the floor</button>
          </div>
          <div className="">
            <img src="https://gateway.pinata.cloud/ipfs/QmdfvV54W7JyupLfw8HojV34tXs8eZ2N74wmWygff9dghS" className="max-h-[400px] md:h-full mx-auto" alt="logo"   />
          </div>
        </div>
      </section>
      <section className="w-full relative min-h-screen flex flex-col items-center justify-center" ref={myDiv}>
        
        <h2 className="mt-20 lg:mt-10 text-center text-3xl">Buy the floor</h2>
        <p className="py-4 text-base mt-2 max-w-[460px] text-center text-[#707070]">Take a look at the charming scene of apes relaxing on the ground in stargaze.zone - sweep to see magic.
</p>
        <div className="flex flex-col flex-wrap justify-center md:flex-row">
          {data && data.map((item)=><FloorCard key={item.token_id} walletAddress={walletAddress} ask={item} />)}
          
        </div>
      </section>
    </div>
  )
}

export default App
