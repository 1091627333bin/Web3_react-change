import {configureStore} from "@reduxjs/toolkit"
import balanceSlice from "./slices/balanceSlice.js";
import orderSlice from "./slices/orderSlice.js";
const store = configureStore({
   reducer:{
    balance:balanceSlice,
    order:orderSlice
   },
   middleware:getDefaultMiddleware=>getDefaultMiddleware({
      serializableCheck:false
   })

})

export default store;