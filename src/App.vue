<template>
  <div id="app" class="container">
    <div class="text-center">
      <div class="mt-5 mb-3">
        <img
          alt="Vue logo"
          src="./assets/eth-logo.svg"
          style="width: 100px; height: 100px"
        />
        <h1 class="h1">ETH问数成章</h1>
      </div>
      <input
        v-model="input"
        class="form-control mb-3"
        style="max-width: 600px; margin: auto"
      />
      <button id="submit" @click="query" class="btn btn-primary">提交</button>
      <p class="mt-5 mb-3">
        连接状态：<span id="status">{{ status }}</span>
      </p>
      <p class="mb-3">
        GPT回复：<span id="message">{{ message }}</span>
      </p>
      <p class="mt-5 mb-3">
        <echarts-component :data="echartsRes"></echarts-component>
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import EchartsComponent from "@/components/EchartsComponent.vue";

echarts.use([CanvasRenderer, BarChart, GridComponent, TooltipComponent]);
export default {
  name: "App",
  components: { EchartsComponent },
  props: {
    // todo
  },
  data() {
    return {
      input: "",
      message: "",
      status: "未连接",
      echartsRes: null,
    };
  },
  methods: {
    query() {
      let messageReceived = false;
      const data = { input: this.input };
      const url = `http://localhost:4536/chat?input=${encodeURIComponent(
        this.input
      )}`;
      const eventSource = new EventSource(url, {
        method: "GET",
        // body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      eventSource.onopen = () => {
        this.status = "已连接";
      };

      eventSource.onmessage = (event) => {
        messageReceived = true;
        const data = JSON.parse(event.data);
        this.message = data.content;
      };

      eventSource.onerror = (event) => {
        if (messageReceived) {
          console.log("Connection closed by server.");
          this.status = "连接已关闭";
          //获取redis的查询数据
          axios
            .get("http://localhost:4536/chat/result")
            .then((response) => {
              console.log(response.data[0]);
              this.echartsRes = response.data[0];
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("Error:", event);
          this.status = "连接错误";
        }
        eventSource.close();
      };
    },
  },
  created() {},
  mounted() {},
};
</script>

<style>
body {
  //background: linear-gradient(to right, #6a82fb, #fc5c7d 40%, #05dfd7);
  color: #fff;
}

.h1 {
  position: relative;
  margin: 12px 0 15px;
}
.form-control {
}

#status,
#message {
  font-weight: bold;
}

.text-center {
  color: #333333;
}

input {
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  //color: #fff;
}

button {
  background: #fff;
  color: #333;
  font-weight: bold;
}
</style>
