const FloorCard = ({item, title, image, price}) => {
    //generate the image url using the object token_id var
    const imageUrl = `https://ipfs-gw.stargaze-apis.com/ipfs/bafybeie77x4maskhv3n7la54epthvf6a6ybl3dois4ezvnygo4ozetljoa/${item.token_id}.png`
    return ( 
        <div className="text-center mt-10">
            <h3 className="">Cosmos Ape Alliance</h3>
            <div className="relative px-4 flex flex-col rounded-md border border-black mt-2 mx-5">
                <div className="flex xs:w-[350px] md:w-[490px] sm:h-[170px] md:h-[220px] ">
                    <div className="relative self-center rounded-md overflow-hidden shadow  w-[140px] h-[140px] md:w-[195px] md:h-[195px]">
                        <img src={imageUrl} className="h-full" alt="" />
                    </div>
                    <div className="flex flex-col justify-between md:justify-evenly items-stretch flex-grow pt-4 pb-4 md:pt-4 md:pb-0 pl-4 md:pl-6 gap-2">
                        <h3 className="text-base md:text-2xl font-bold">Cosmos Ape Alliance #{item.token_id}</h3>
                        <div className="flex flex-col justify-center md:flex-row gap-0 md:gap-6 lg:mb-2">
                            <div className="flex flex-col justify-between">
                                <p className="text-xs md:text-sm text-[#707070]">Buy Price</p>
                                <div className="flex gap-2 items-center justify-center">
                                    <img src="/src/assets/stargaze.png" alt="stargaze" width="14" height="14" />
                                    <p className="text-black text-sm md:text-md font-bold">{(Math.round(item.price) / 1000000).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative -translate-y-1 cursor-pointer transition ease-in-out hover:-translate-y-2 hover:scale-105 duration-300">
                            <div className="rounded-md w-full bg-gradient-to-r p-[2px] from-[#7928ca] to-[#ff0080]">
                                <div className="relative flex flex-col justify-between items-center h-full bg-black text-white rounded-md">
                                    <button className="text-xl wallet-adapter-button !bg-black !text-center flex justify-center items-center w-full !px-2 !h-8 md:!h-10">Sweep 🧹</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pb-3 pr-1 text-[12px] w-full ">
                    <span className="block w-fit ml-auto text-[#70707080]">powred by apello</span>
                </div>
            </div>
        </div>
     );
}
 
export default FloorCard;