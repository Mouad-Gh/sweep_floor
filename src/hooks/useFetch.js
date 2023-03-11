import { useEffect, useState} from "react";
import axios from "axios";
import {Buffer} from 'buffer';

function useFetch() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  let requrest_data = {
        'asks_sorted_by_price': {
            'collection': 'stars19y092mzr4szme4jfd5psnkkkvfayh25a6q5t2y0xshcpay9x6hhsgpqqca',
            'include_inactive': false,
            'limit': 2
        }
    };

    let requrest_base64 = Buffer.from(JSON.stringify(requrest_data)).toString('base64');

    let request_url = 'https://rest.stargaze-apis.com/cosmwasm/wasm/v1/contract/stars1fvhcnyddukcqfnt7nlwv3thm5we22lyxyxylr9h77cvgkcn43xfsvgv0pl/smart/' + requrest_base64;

  

  const getItems = async()=> {
    try {
        setLoading(true);
        setError(false);
        
        const res = await axios.get(request_url);
        const { data } = res;
        setData(data.data.asks);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
  }

  useEffect(()=>{
    getItems()
  },[]);
  

  return { loading, error, data , getItems };
}

export default useFetch;