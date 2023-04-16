import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"

const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

const balanceSlice = createSlice({
    name:"balance",
    initialState:{
        TokenWallet:"0",
        TokenExchange:"0",
        EtherWallet:"0",
        EtherExchange:"0",
    },
    reducers:{
        setTokenWallet(state,action){
            state.TokenWallet = action.payload
        },

        setTokenExchange(state,action){
            state.TokenExchange = action.payload
        },

        setEtherWallet(state,action){
            state.EtherWallet = action.payload
        },

        setEtherExchange(state,action){
            state.EtherExchange = action.payload
        },
    }
})
export const {setTokenWallet,setTokenExchange,setEtherWallet,setEtherExchange} = balanceSlice.actions
export default balanceSlice.reducer;

export const loadBalanceData = createAsyncThunk(
    "balance/fetchBalanceData",
    async (data,{dispatch}) =>{
        console.log(data);
        const { web3, account,token,exchange} = data

        //获取账户token余额
        const TokenWallet = await token.methods.balanceOf(account).call()
        // console.log(web3.utils.fromWei(TokenWallet.toString(),"ether") );
        dispatch(setTokenWallet(TokenWallet))

        //获取交易所token
        const TokenExchange = await exchange.methods.balanceOf(token.options.address,account).call()
        console.log(web3.utils.fromWei(TokenExchange.toString(),"ether") );
        dispatch(setTokenExchange(TokenExchange))

        //获取钱包ether
        const EtherWallet = await web3.eth.getBalance(account)
        console.log(web3.utils.fromWei(EtherWallet.toString(),"ether") );
        dispatch(setEtherWallet(EtherWallet))

        //获取交易所ether
        const EtherExchange = await exchange.methods.balanceOf(ETHER_ADDRESS,account).call()
        console.log(web3.utils.fromWei(EtherExchange.toString(),"ether") );
        dispatch(setEtherExchange(EtherExchange))
    }
)