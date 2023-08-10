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
      <div
        v-show="showChart"
        id="table-result"
        style="width: 600px; height: 400px"
      ></div>
    </div>
  </div>
</template>

<script>
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import * as echarts from "echarts/core";
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  props: ["data"],
  data() {
    return {
      hasTable: true,
      headArray: [],
      option: {
        title: {
          text: "数据图表",
        },
        tooltip: {},
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [],
            type: "line",
          },
        ],
      },
      showChart: true,
    };
  },
  methods: {
    appendTable(jsonArray) {
      //todo，需要修改逻辑和语法
    },
    drawCharts(sql, sqlResult) {
      console.log(sql);
      console.log(JSON.parse(JSON.stringify(sqlResult)));
      axios
        .post("http://localhost:4536/drawCharts", {
          sql: sql,
          sqlResult: JSON.parse(JSON.stringify(sqlResult)),
        })
        .then((res) => {
          console.log(res.data);
          this.options.xAxis.data = res.data.data.xAxisData;
          this.options.xAxis.type = res.data.data.xAxisType;
          this.options.series[0].data = res.data.data.chartData;
          this.options.series[0].type = res.data.data.chartType;
          console.log(this.options);
        })
        .catch((err) => {
          console.log(err);
        });
      this.generateCharts();
    },
    generateCharts() {
      let myChart = echarts.init(document.getElementById("table-result"));
      myChart.setOption(this.options);
    },
    parseHead: function (oneRow) {
      for (let i in oneRow) {
        this.headArray[this.headArray.length] = i;
      }
    },
  },
};
</script>

<style scoped></style>
