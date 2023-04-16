import React from 'react'
import {useSelector} from "react-redux"

import { Card, Col, Row, Statistic } from 'antd';

export default function Balance() {
    const  state= useSelector(state=>state.balance)

    function fromWei(data){
      if(!window.web) return
      return window.web.web3.utils.fromWei(data.toString(),"ether")
    }
  return (
    
    <div>
      <Row>
    <Col span={6}>
      <Card hoverable={true}>
        <Statistic
          title="钱包中以太币:"
          value={fromWei(state.EtherWallet)}
          precision={2}
          valueStyle={{
            color: '#3f8600',
          }}
          
          suffix="￥"
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card hoverable={true}>
        <Statistic
          title="钱包中RbToken"
          value={fromWei(state.TokenWallet)}
          precision={2}
          valueStyle={{
            color: '#3f8600',
          }}
          
          suffix="￥"
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card hoverable={true}>
        <Statistic
          title="交易所中以太币："
          value={fromWei(state.EtherExchange)}
          precision={2}
          valueStyle={{
            color: '#3f8600',
          }}
          
          suffix="￥"
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card hoverable={true}>
        <Statistic
          title="交易所中RbToken"
          value={fromWei(state.TokenExchange)}
          precision={2}
          valueStyle={{
            color: '#3f8600',
          }}
          
          suffix="￥"
        />
      </Card>
    </Col>
  </Row>
        <h3>钱包中以太币：{fromWei(state.EtherWallet)}</h3>
        <h3>钱包中RbToken:{fromWei(state.TokenWallet)}</h3>
        <h3>交易所中以太币：{fromWei(state.EtherExchange)}</h3>
        <h3>交易所中RbToken:{fromWei(state.TokenExchange)}</h3>
    </div>
  )
}
