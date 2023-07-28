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
        v-model="inputQuery.inputValue"
        class="form-control mb-3"
        style="max-width: 600px; margin: auto"
      />
      <div class="flex-line">
        <input type="checkbox" id="checkbox1" v-model="isChatMode" />
        <label for="checkbox1" style="margin-left: 8px; margin-right: 15px"
          >聊天模式</label
        >
        <button id="submit" @click="submit" class="btn btn-primary">
          {{ isChatMode ? "聊天" : "查询" }}
        </button>
        <button id="refresh" @click="refresh" class="btn btn-primary">
          刷新
        </button>
        <button
          id="query"
          @click="query"
          v-if="isClear && isChatMode"
          class="btn btn-primary"
        >
          查询
        </button>
      </div>
      <p class="mt-5 mb-3">
        连接状态：<span id="status">{{ status }}</span>
      </p>
      <p class="mb-3" v-if="!isChatMode || querySent">
        GPT回复：<span id="message">{{ message }}</span>
      </p>
      <div v-if="isChatMode" class="chat-box">
        <div
          v-for="item in messages"
          :key="item.id"
          :class="`message ${item.role}`"
        >
          <div class="message-content">
            {{ item.content }}
          </div>
        </div>
      </div>
      <p class="mt-5 mb-3">
        <echarts-component
          ref="EchartsComponent"
          :data="echartsRes"
          @append-table="drawTable"
        ></echarts-component>
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from "vue";
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
  setup() {
    const inputQuery = reactive({
      inputValue: "",
    });

    return { inputQuery };
  },
  data() {
    return {
      // input: "",
      message: "",
      status: "未连接",
      echartsRes: null,
      isChatMode: true,
      conversation: null,
      messages: [],
      isClear: false,
      tempLength: 0,
      querySent: false,
    };
  },
  methods: {
    checkNotEmpty() {
      if (this.inputQuery.inputValue.trim() === "") {
        alert("输入不能为空！");
        return;
      }
    },
    submit() {
      if (this.isChatMode) {
        this.chat();
      } else {
        this.query();
      }
    },
    refresh() {
      window.location.reload();
      axios
        .get("http://localhost:4536/refresh")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    chat() {
      this.checkNotEmpty();
      let messageReceived = false;
      const data = { input: this.inputQuery.inputValue };
      const url = `http://localhost:4536/multi-round-chat?input=${encodeURIComponent(
        this.inputQuery.inputValue
      )}`;

      this.messages.push({
        id: this.tempLength++,
        role: "user",
        content: this.inputQuery.inputValue,
      });

      const eventSource = new EventSource(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      eventSource.onopen = () => {
        this.status = "已连接";
        this.messages.push({
          id: this.tempLength++,
          role: "assistant",
          content: "",
        });
      };

      eventSource.onmessage = (event) => {
        messageReceived = true;
        const data = JSON.parse(event.data);
        this.messages[this.tempLength - 1].content = data.content;
      };

      eventSource.onerror = (event) => {
        if (messageReceived) {
          console.log("Connection closed by server.");
          this.status = "连接已关闭";

          //获取redis的查询数据
          axios
            .get("http://localhost:4536/multi-round-chat/result")
            .then((response) => {
              this.conversation = response.data["default"];
              this.conversation.shift();
              this.isClear =
                parseInt(
                  this.conversation[this.conversation.length - 1]["isClear"]
                ) === 1;
              this.conversation.pop();
              console.log(this.conversation);

              if (this.isClear === false) {
              } else if (this.isClear === true) {
                let regex = /您的问题已经足够清楚：(.*?)。/;
                let match =
                  this.messages[this.tempLength - 1].content.match(regex);
                if (match && match[1]) {
                  this.inputQuery.inputValue = match[1];
                }
              } else {
                console.log("error");
              }
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
    query() {
      this.checkNotEmpty();
      let messageReceived = false;
      const data = { input: this.inputQuery.inputValue };
      const url = `http://localhost:4536/chat?input=${encodeURIComponent(
        this.inputQuery.inputValue
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
        this.querySent = true;
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
              console.log(response.data);
              this.echartsRes = response.data;
              this.drawTable(response.data[0]);
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
    drawTable(jsonArray) {
      console.log("drawTable");
      console.log(jsonArray);
      this.$refs.echartsComponent.appendTable(jsonArray);
    },
  },
  created() {},
  mounted() {},
};
</script>

<style>
body {
  //background: linear-gradient(to right, #6a82fb, #fc5c7d 40%, #05dfd7); color: #fff;
}

.chat-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: auto;
  overflow: auto;
  border: 1px solid #eee;
  background-color: #fafafa;
  padding: 10px;
  margin-bottom: 20px;
}

.message {
  display: inline-block;
  width: auto;
  max-width: 80%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
}

.message.user {
  margin-left: auto;
  align-self: flex-end;
  text-align: right;
  background-color: #dcf8c6;
}

.message.assistant {
  margin-right: auto;
  align-self: flex-start;
  text-align: left;
  background-color: #ece5dd;
}

.message-content {
  word-wrap: break-word;
}

.flex-line {
}

#refresh {
  margin-left: 12px;
  margin-right: 12px;
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
