<script>
// import { GridComponent, TooltipComponent } from "echarts/components";
// import { CanvasRenderer } from "echarts/renderers";
// import { BarChart } from "echarts/charts";
// import * as echarts from "echarts/core";
// import axios from "axios";
// import { ref, onMounted } from "vue";
// import EchartsComponent from "@/components/EchartsComponent.vue";

import axios from "axios";

export default {
  props: ["data"],
  data() {
    return {
      hasTable: true,
      headArray: [],
    };
  },
  methods: {
    appendTable: function (jsonArray) {
      //todo，需要修改逻辑和语法
      this.parseHead(jsonArray[0]);
      let div = document.getElementById("table-result");
      let table = document.createElement("table");
      let thead = document.createElement("tr");
      for (let count = 0; count < this.headArray.length; count++) {
        let td = document.createElement("th");
        td.innerHTML = this.headArray[count];
        thead.appendChild(td);
      }
      table.appendChild(thead);
      for (let tableRowNo = 0; tableRowNo < jsonArray.length; tableRowNo++) {
        let tr = document.createElement("tr");
        for (
          let headCount = 0;
          headCount < this.headArray.length;
          headCount++
        ) {
          let cell = document.createElement("td");
          cell.innerHTML = jsonArray[tableRowNo][this.headArray[headCount]];
          tr.appendChild(cell);
        }
        table.appendChild(tr);
      }
      div.appendChild(table);
      this.$emit("append-table", jsonArray);
    },
    parseHead: function (oneRow) {
      for (let i in oneRow) {
        this.headArray[this.headArray.length] = i;
      }
    },
    //获取redis的查询数据
    getRedisData() {
      axios
        .get("http://localhost:4536/redis")
        .then((res) => {
          console.log(res.data);
          this.headArray = res.data.head;
          this.hasTable = true;
          this.echartsRes = res.data.data;
          this.drawEcharts();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //绘制echarts
    drawEcharts() {
      const myChart = echarts.init(document.getElementById("table-result"));
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["数量"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: this.headArray,
        },
        series: [
          {
            name: "数量",
            type: "bar",
            data: this.echartsRes,
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<template>
  <div>
    <p class="mt-5 mb-3">
      查询结果：
      <span style="font-weight: bold">
        {{ data }}
      </span>
    </p>
    <div v-show="hasTable">
      <p class="mt-5 mb-3">数据图表：</p>
      <!-- 数据展示 -->
      <div id="table-result"></div>
    </div>
  </div>
</template>

<style scoped></style>
