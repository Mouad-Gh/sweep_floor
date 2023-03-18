import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const FloorCard = ({ask, walletAddress}) => {
    const [isLoading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState(null);
    //the sweep button
    // console.log(isLoading);
    const [showConfetti, setShowConfetti ] = useState(false);
    const [buttonPosition, setButtonPosition ] = useState({
        x: 0,
        y: 0
    });
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    useEffect(() => {
        function handleResize() {
          setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
      useEffect(()=>{
        // window.onresize = () => handleWindowSize();
        showConfetti && setTimeout(() => {
          setShowConfetti(false)
        }, 8000);
      }, [showConfetti]);

    // console.log(showConfetti, buttonPosition);

    const handleSweep = async(event) => {
        try {
            
        
        setLoading(true);
        let mnemonic = import.meta.env.VITE_MNEMONIK;
        let nftContractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;


        // const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'stars' });
        // console.log("wallet", wallet);
        // const [firstAccount] = await wallet.getAccounts();
        // console.log("account",firstAccount);
        // const rpcEndpoint = 'https://rpc.stargaze-apis.com';
        // const client = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet); 
        await window.keplr.enable('stargaze-1');
        const offlineSigner = await window.keplr.getOfflineSigner('stargaze-1');
        // console.log(offlineSigner);
        let client = await SigningCosmWasmClient.connectWithSigner(
            "https://rpc.stargaze-apis.com",
            offlineSigner
        );
        // console.log("client", client);
        let instructions = [];
        if( ask.sale_type != 'auction' && ask.reserve_for == null && Date.now() < (ask.expires_at / 1000000) ) {
            

            let oneDay = 24 * 60 * 60 * 10000;
            let timestamp = (Date.now() + oneDay) * 1000000;

            instructions.push({
                contractAddress: "stars1fvhcnyddukcqfnt7nlwv3thm5we22lyxyxylr9h77cvgkcn43xfsvgv0pl",
                msg: {
                    set_bid: {
                        collection: nftContractAddress,
                        expires: timestamp.toString(),
                        token_id: ask.token_id,
                        sale_type: "fixed_price"
                    }
                },
                funds: [
                    {
                        denom: 'ustars',
                        amount: ask.price.toString()
                    }
                ]
            })
        }
         
        let fee = {
            amount: [{
                denom: 'ustars',
                amount: '0',
            }, ],
            gas: '500000',
        }
        // console.log("inst",instructions);
        let tx = await client.executeMultiple(
            walletAddress, 
            instructions,  
            fee
        );
        
        if(tx){
            console.log("*******************************************************",tx);
            //send
            const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'stars' });
            const [firstAccount] = await wallet.getAccounts();
            const rpcEndpoint = 'https://rpc.stargaze-apis.com';
            const client = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet); 
            // console.log("address", firstAccount.address,walletAddress, client  )
            

            const tx2 = await client.signAndBroadcast(
                firstAccount.address,
                [
                    {
                        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                        value: {
                            fromAddress: firstAccount.address,
                            toAddress: walletAddress,
                            amount: [
                                {
                                    denom: 'ustars',
                                    amount: parseInt(ask.price * 0.05 ).toString(),
                                }
                            ],
                        }
                    }
                ], 
                fee
            );
            console.log("tx22222222222222222 ", tx2);
            setTxHash(tx2.transactionHash);
            setLoading(false);
            //animation
            const buttonRect = event.target.getBoundingClientRect();
            setButtonPosition({ x: buttonRect.left + buttonRect.width / 2, y: buttonRect.top + buttonRect.height / 2 });
            setShowConfetti(true);
        }
        
    } catch (error) {
        setLoading(false);
        console.log(error);   
    }

        // console.log(import.meta.env.VITE_NFT_CONTRACT_ADDRESS)
    }
    //generate the image url using the object token_id var
    const imageUrl = `https://ipfs-gw.stargaze-apis.com/ipfs/bafybeie77x4maskhv3n7la54epthvf6a6ybl3dois4ezvnygo4ozetljoa/${ask.token_id}.png`
    return ( 
        <div className="text-center mt-10">
            <h3 className="">Cosmos Ape Alliance</h3>
            <div className="relative px-4 flex flex-col rounded-md border border-black mt-2 mx-5">
                <div className="flex xs:w-[350px] md:w-[490px] sm:h-[170px] md:h-[220px] ">
                    <div className="relative self-center rounded-md overflow-hidden shadow  w-[140px] h-[140px] md:w-[195px] md:h-[195px]">
                        <img src={imageUrl} className="h-full" alt="" />
                    </div>
                    <div className="flex flex-col justify-between md:justify-evenly items-stretch flex-grow pt-4 pb-4 md:pt-4 md:pb-0 pl-4 md:pl-6 gap-2">
                        <h3 className="text-base md:text-2xl font-bold">Cosmos Ape Alliance #{ask.token_id}</h3>
                        <div className="flex flex-col justify-center md:flex-row gap-0 md:gap-6 lg:mb-2">
                            <div className="flex flex-col justify-between">
                                <p className="text-xs md:text-sm text-[#707070]">Buy Price</p>
                                <div className="flex gap-2 items-center justify-center">
                                    <img src="/stargaze.png" alt="stargaze" width="14" height="14" />
                                    <p className="text-black text-sm md:text-md font-bold">{(Math.round(ask.price) / 1000000).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative select-none -translate-y-1 cursor-pointer transition ease-in-out hover:-translate-y-2 hover:scale-105 duration-300">
                            <div className="rounded-md w-full bg-gradient-to-r p-[2px] from-[#7928ca] to-[#ff0080]">
                                    {txHash ?
                                        ( <div className="flex items-center justify-center gap-x-1 sm:gap-2 h-full py-1 bg-black text-white rounded-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-[#e5e5e5] text-[10px] sm:text-xs">View transaction in explorer <a href={"https://www.mintscan.io/stargaze/txs/"+txHash}  target="_blank" rel="noopener noreferrer" className="w-4 h-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline-flex"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg></a>.</p>

                                        </div> )
                                    :
                                <div data-tip="Connect your wallet first." className={`relative flex flex-col justify-between items-center h-full bg-black text-white rounded-md ${(!walletAddress) &&  'hover:disableSpan'}`}>
                                        <button  disabled={(!walletAddress)} onClick={handleSweep} className="text-[10px] sm:text-xs wallet-adapter-button !bg-black !text-center flex justify-center items-center w-full !px-2 min-h-[1.5rem] disabled:cursor-not-allowed">
                                        {isLoading ? <>sweeping... <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="animate-spin ml-1 h-5 w-5 text-white" viewBox="0 0 24 24" >
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" ></circle>
                                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" ></path>
                                        </svg></> : <>Sweep 🧹</>}
                                        </button>
                                    
                                    
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
                {showConfetti && (<div className="fixed inset-0">
                    <Confetti 
                        width={dimensions.width}
                        height={dimensions.height}
                        numberOfPieces={100}
                        recycle={false}
                        confettiSource={{ x: buttonPosition.x, y: buttonPosition.y, w: 0, h: 0 }}
                    />
                    </div>)
                }
                <div className="pb-3 pr-1 text-[12px] w-full ">
                    <span className="block w-fit ml-auto text-[#70707080]">powred by <a href="https://apello.xyz" target="_blank" rel="noopener noreferrer" className="text-violet">Apello</a></span>
                </div>
            </div>
        </div>
     );
}
 
export default FloorCard;