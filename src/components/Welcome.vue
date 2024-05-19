<template>
  <div class="welcome">
    <el-row :gutter="24">
      <el-col :span="12" class="col2">
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="系统介绍"
            name="first"
            style="align-content: center"
          >
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  用户管理<i class="header-icon el-icon-info"></i>
                </template>
                <div>
                  用户管理的作用是对当前用户进行添加or修改操作<br />
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";
import "echarts-liquidfill";
import AppVue from "../App.vue";

export default {
  data() {
    return {
      activeName: "first",
      outName: "first",
      infoDialog: false,
      outList: {},
      warehouse: [],
      stateOption: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "订单状态分布图",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      }
    };
  },
  watch: {
    stateOption: {
      deep: true,
      handler(newValue) {
        this.initStateEcharts();
      },
    },

  },
  methods: {
    initStateEcharts() {
      const myChart = echarts.init(document.getElementById("orderStateChart"));
      myChart.setOption(this.stateOption); // 渲染页面
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    getStateData() {
      this.$http.get("/order/queryStateData").then((res) => {
        for (var i = 0; i < res.obj.length; i++) {
          var element = res.obj[i];
          this.stateOption["series"][0]["data"].push({
            value: element.count,
            name: this.parseOrderState(element.orderState),
          });
        }
      });
    },
    getTypeData() {
      this.$http.get("/order/queryTypeData").then((res) => {
        for (var i = 0; i < res.obj.length; i++) {
          var element = res.obj[i];
          this.typeOption["xAxis"]["data"].push(
            this.parseOrderState(element.orderType)
          );
          this.typeOption["series"][0]["data"].push(element.count);
        }
      });
    },
    parseOrderState(state) {
      return this.GLOBAL.parseOrderState(state);
    },
    parseOrderType(type) {
      return this.GLOBAL.parseOrderType(type);
    },
  },
  created() {
    // this.getStateData();
    // this.getTypeData();
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}

.el-progress {
  margin-left: 10px;
  margin-top: 10px;
}

.el-col {
  margin-left: 20px;
  padding-left: 20px;
  border-radius: 10px;
  height: 350px;
}

.col1 {
  background-color: #ffffff;
  padding-left: 40px;
  height: 400px;
}

.col2 {
  padding-left: 10px;
  background-color: #ffffff;
}

.echarts-style {
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
  font-size: 25px;
}
</style>
