<template>
  <div class="hello">
    <div>拖拽选择时间组件</div>
    <cus-datepick class="pick" @dateChange="curDate" :curDateList="dateList"></cus-datepick>
  </div>
</template>

<script>
import CusDatepick from "./CusDatepick";
export default {
  name: 'HelloWorld',
  data () {
    return {
      dateList: [
        {
          xSummarylist:"03:00-06:00",
          xlist:[
            {
              sid: 'seaty7x7',
              x: "03:00 - 03:30"
            },
            {
              sid: 'seaty7x8',
              x: "03:30 - 04:00"
            },
            {
              sid: 'seaty7x9',
              x: "04:00 - 04:30"
            },
            {
              sid: 'seaty7x10',
              x: "04:30 - 05:00"
            },
            {
              sid: 'seaty7x11',
              x: "05:00 - 05:30"
            },
            {
              sid: 'seaty7x12',
              x: "06:30 - 06:00"
            }
          ],
          y: '星期日',
          yvalue:6
        },
        {
          xSummarylist:"03:00-06:00",
          xlist:[
            {
              sid: 'seaty6x7',
              x: "03:00 - 03:30"
            },
            {
              sid: 'seaty6x8',
              x: "03:30 - 04:00"
            },
            {
              sid: 'seaty6x9',
              x: "04:00 - 04:30"
            },
            {
              sid: 'seaty6x10',
              x: "04:30 - 05:00"
            },
            {
              sid: 'seaty6x11',
              x: "05:00 - 05:30"
            },
            {
              sid: 'seaty6x12',
              x: "06:30 - 06:00"
            }
          ],
          y: '星期六',
          yvalue:5
        }
      ]
    }
  },
  methods:{
    //当前选中日期
    curDate(val) {
      console.log('curDate',val)
    },
  },
  components:{
    CusDatepick
  }
}
</script>
<style lang="less">
  .hello {
    text-align: center;
    .pick {
      margin: auto;
      margin-top: 40px;
    }
  }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->

