import React from 'react'
import { Button, Card, Col, Row, Table } from 'antd';
import {useSelector} from "react-redux"
import moment from "moment"
export default function Order() {
  const  state = useSelector(state=>state.order)
  console.log(state,"state");

  function fromWei(data){
    if(!window.web) return
    if(!data) return
    return window.web.web3.utils.fromWei(data,"ether")
  }

  function converTime(t){
    if(!t) return
    return moment(t*1000).format("YYYY/MM/DD")
  }
  function CancelItem(item){
    if(!window.web) return[];
    console.log(item);
    window.web.exchange.methods.cancelOrder(item.id).send({from:window.web.account})
  }

  function getRenderOrder(order,type){
    if(!window.web) return[];
    const { CancelOrders,FillOrders,AllOrders} = order
    let fillterIds = [...CancelOrders,...FillOrders].map(item=>item.id)
    // console.log(fillterIds,"fillterIds");

    let myorder = AllOrders.filter(item=>{
      if(!fillterIds.includes(item.id)) return true
    })
    // console.log(myorder,"myorder");
    
    const account =window.web.account
    // console.log(account);

    if(type===1){
      return myorder.filter(item=>item.user===account)
    }
    else{
      return myorder.filter(item=>item.user!==account)
    }
    
  }


 

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render:(timestamp)=>{
        return converTime(timestamp)
      }
    },
    {
      title: 'RbToken',
      dataIndex: 'amountGet',
      key: 'amountGet',
      render:(amountGet)=>{
        return fromWei(amountGet)
      }
    },
    {
      title: 'ETH',
      dataIndex: 'amountGive',
      key: 'amountGive',
      render:(amountGive)=>{
        return fromWei(amountGive)
      }
    },
  ];

  const columns1 = [
    ...columns,
    {
      title:"操作",
      render:(item)=>{
        return <Button type='primary' onClick = {()=>CancelItem(item)}>取消</Button>
      }
    }
  ]

  const columns2 = [
    ...columns,
    {
      title:"操作",
      render:(item)=>{
        return <Button type='primary' onClick = {()=>{
          window.web.exchange.methods.fillOrder(item.id).send({from:window.web.account})
        }}>买入</Button>
      }
    }
  ]
  return (
    <div>
      <Row style={{ marginTop: "10px" }}>
        <Col span={8}>
          <Card
            title="已完成交易"
            bordered={false}
            style={{
              margin: 10,
            }}
          >
            <Table dataSource={state.FillOrders} columns={columns} rowKey = {item=>item.id} />;
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title="交易中-我创建的订单"
            bordered={false}
            style={{
              margin: 10,
            }}
          >
            <Table dataSource={getRenderOrder(state,1)} columns={columns1} rowKey = {item=>item.id}/>;
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title="交易中-其他人的订单"
            bordered={false}
            style={{
              margin: 10,
            }}
          >
            <Table dataSource={getRenderOrder(state,2)} columns={columns2} rowKey = {item=>item.id}/>;
          </Card>
        </Col>
      </Row>
    </div>
  )
}
