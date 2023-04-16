import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"

const orderSlice = createSlice({
    name:"order",
    initialState:{
        CancelOrders:[],
        FillOrders:[],
        AllOrders:[]
        
    },
    reducers:{
        setCancelOrders(state,action){
            state.CancelOrders = action.payload
        },

        setFillOrders(state,action){
            state.FillOrders = action.payload
        },

        setAllOrders(state,action){
            state.AllOrders = action.payload
        },
    }
})
export const {setCancelOrders,setFillOrders,setAllOrders} = orderSlice.actions
export default orderSlice.reducer;

export const loadCancelOrderData = createAsyncThunk(
    "order/fetchCancelOrderData",
    async (data,{dispatch}) =>{
        // console.log(data);
        const {exchange} = data
        const result = await exchange.getPastEvents("Cancel",{
            fromBlock:0,
            toBlock:"latest"
        })
        const cancelOrders = result.map(item =>item.returnValues)
        // console.log(cancelOrders,"iasjdia");
        dispatch(setCancelOrders(cancelOrders))

    }
)

export const loadAllOrderData = createAsyncThunk(
    "order/fetchAllOrderData",
    async (data,{dispatch}) =>{
        // console.log(data);
        const {exchange} = data
        const result = await exchange.getPastEvents("Order",{
            fromBlock:0,
            toBlock:"latest"
        })
        const allOrders = result.map(item =>item.returnValues)
        // console.log(allOrders,"iasjdia");
        dispatch(setAllOrders(allOrders))

    }
)

export const loadFillOrderData = createAsyncThunk(
    "order/fetchFillOrderData",
    async (data,{dispatch}) =>{
        // console.log(data);
        const {exchange} = data
        const result = await exchange.getPastEvents("Trade",{
            fromBlock:0,
            toBlock:"latest"
        })
        const fillOrders = result.map(item =>item.returnValues)
        // console.log(cancelOrders,"iasjdia");
        dispatch(setFillOrders(fillOrders))

    }
)