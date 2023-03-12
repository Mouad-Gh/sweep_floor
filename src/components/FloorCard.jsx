import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';

const FloorCard = ({ask, walletAddress}) => {
    //the sweep button
    const handleSweep = async() => {
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
        
        console.log(tx);
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
                        <div className="relative -translate-y-1 cursor-pointer transition ease-in-out hover:-translate-y-2 hover:scale-105 duration-300">
                            <div className="rounded-md w-full bg-gradient-to-r p-[2px] from-[#7928ca] to-[#ff0080]">
                                <div data-tip="Connect your wallet first." className={`relative flex flex-col justify-between items-center h-full bg-black text-white rounded-md ${(!walletAddress) &&  'hover:disableSpan'}`}>
                                    <button  disabled={(!walletAddress)} onClick={handleSweep} className="text-xl wallet-adapter-button !bg-black !text-center flex justify-center items-center w-full !px-2 !h-8 md:!h-10 disabled:cursor-not-allowed">Sweep 🧹</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pb-3 pr-1 text-[12px] w-full ">
                    <span className="block w-fit ml-auto text-[#70707080]">powred by <a href="https://apello.xyz" target="_blank" rel="noopener noreferrer" className="text-violet">Apello</a></span>
                </div>
            </div>
        </div>
     );
}
 
export default FloorCard;