import React, { useEffect } from 'react'
import Web3 from 'web3'
import tokenjson from '../build/RbToken.json'
import exchangejson from '../build/Exchange.json'
import Balance from './Balance'
import Order from './Order'
import { loadBalanceData } from '../redux/slices/balanceSlice'
import { useDispatch } from 'react-redux'
import { loadCancelOrderData ,loadAllOrderData,loadFillOrderData} from '../redux/slices/orderSlice'
export default function Content() {
    const dispatch = useDispatch()

    useEffect(() => {
        async function start() {
            const web = await initweb()
            // console.log(web);
            window.web = web;
            
            //获取余额信息
            dispatch(loadBalanceData(web))

            //获取订单数据
            dispatch(loadCancelOrderData(web))
            dispatch(loadAllOrderData(web))
            dispatch(loadFillOrderData(web))

            //监听
            web.exchange.events.Order({},(error,event)=>{
                dispatch(loadAllOrderData(web))
            })
            web.exchange.events.Cancel({},(error,event)=>{
                dispatch(loadCancelOrderData(web))
            })
            web.exchange.events.Trade({},(error,event)=>{
                dispatch(loadFillOrderData(web))
                dispatch(loadBalanceData(web))
            })
        }
        start()
    }, [dispatch])

    async function initweb() {
        var web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

        const accounts = await web3.eth.requestAccounts()
        // console.log(accounts[0]);
        // console.log(tokenjson);
        const networkId =await web3.eth.net.getId()
        // console.log(networkId);
        const token = await new web3.eth.Contract(tokenjson.abi,tokenjson.networks[networkId].address)
        // console.log(networkId);
        const exchange = await new web3.eth.Contract(exchangejson.abi,exchangejson.networks[networkId].address)
        // console.log(token);
        // console.log(exchange);
        return {
            web3,
            account:accounts[0],
            token,
            exchange
        }
    }

    return (
        <div style={{padding:"10px"}}>
            <Balance></Balance>
            <Order></Order>
        </div>
    )
}
