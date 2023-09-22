import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function QueryComponent(inputProp: string) {
  const [status, setStatus] = useState('未连接');
  const [querySent, setQuerySent] = useState(false);
  const [messageReceived, setMessageReceived] = useState(false);
  const [echartsRes, setEchartsRes] = useState('回复生成中，请等待...');
  const [message, setMessage] = useState('');

  const echartsComponentRef = useRef(null);

  const url = `http://localhost:4536/chat?input=${encodeURIComponent(inputProp)}`;
  const eventSource = new EventSource(url);

  const checkNotEmpty = () => {
    if (inputProp.trim() === "") {
      alert("输入不能为空！");
    }
  };

  const query = () => {
    checkNotEmpty();

    eventSource.onopen = () => {
      setStatus('已连接');
      setQuerySent(true);
      setEchartsRes('回复生成中，请等待...');
    };

    eventSource.onmessage = (event) => {
      setMessageReceived(true);
      const data = JSON.parse(event.data);
      setMessage(data.content);
    };

    eventSource.onerror = (event) => {
      if (messageReceived) {
        setStatus('连接已关闭');

        axios
          .get('http://localhost:4536/chat/result')
          .then((response) => {
            setEchartsRes(response.data);
            if (echartsComponentRef.current) {
              // TODO, echartsComponentRef.current.drawCharts(message, response.data);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setEchartsRes('生成失败，请重试');
        setStatus('连接错误');
      }
      eventSource.close();
    };
  };

  // 对应的渲染部分 (JSX)
  return (
    <div>
      <div>Status: {status}</div>
      <div>Echarts Response: {echartsRes}</div>
      {/* <EchartsComponent ref={echartsComponentRef} /> */}
    </div>
  );
}

// // 示例 Echarts 组件
// const EchartsComponent = React.forwardRef((props, ref) => {
//   useImperativeHandle(ref, () => ({
//     drawCharts: (message, echartsRes) => {
//       // 在这里实现 drawCharts 的逻辑
//     },
//   }));




