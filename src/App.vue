<template>
  <div id="app">
    <p>连接状态：<span id="status">{{ status }}</span></p>
    <p>GPT回复：<span id="message">{{ message }}</span></p>
    <p><input v-model="input"></p>
    <button id="submit" @click="query">提交</button>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue'
import axios from 'axios'
import * as echarts from 'echarts/core'
import {CanvasRenderer} from 'echarts/renderers'
import {BarChart} from 'echarts/charts'
import {GridComponent, TooltipComponent} from 'echarts/components'

echarts.use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])
export default {
  name: 'App',
  components: {},
  data() {
    return {
      input: '',
      message: '',
      status: '未连接',

    }
  },
  methods: {
    query() {
      let messageReceived = false;
      const data = { input: this.input };
      const url = `http://localhost:4536/chat?input=${encodeURIComponent(this.input)}`;
      const eventSource = new EventSource(url, {
        method: 'GET',
        // body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      eventSource.onopen = () => {
        this.status = '已连接';
      };

      eventSource.onmessage = (event) => {
        messageReceived = true;
        const data = JSON.parse(event.data);
        this.message = data.content;
      };

      eventSource.onerror = (event) => {
        if (messageReceived) {
          console.log('Connection closed by server.');
          this.status = '连接已关闭';
        } else {
          console.log('Error:', event);
          this.status = '连接错误';
        }
        eventSource.close();
      };

    },
  },
  created() {

  },
  mounted() {

  },

}
</script>

<style>

</style>

