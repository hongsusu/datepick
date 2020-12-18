<template>
  <div style="position: relative" class="cusdatepick">
    <!--头部-->
    <div class="cusdate-header">
      <div class="w80 cusdate-one">星期/时间</div>
      <div class="disflex">
        <div class="cusdate-header-timeone">
          <div class="cusdate-total">00:00-12:00</div>
          <div  class="disflex cusdate-num">
            <div v-for="item in timeArrOne" class="cusdate-num-item">{{item.name}}</div>
          </div>
        </div>
        <div class="cusdate-header-time">
          <div class="cusdate-total">12:00-24:00</div>
          <div  class="disflex cusdate-num">
            <div v-for="item in timeArrTwo" class="cusdate-num-item">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="cusdate-body">
      <div class="w80 cusdate-body-left">
        <div v-for="item in dayArr" class="cusdate-body-item">{{item.name}}</div>
      </div>
      <div>
        <div class="seats" :style="{width:seatWidth*rows+'px',height:seatHeight*columns+'px'}">
          <canvas class="mask" ref="mask"  @mouseout="hideTitle" @mousemove="showTitle"  :style="{width:seatWidth*rows+'px',height:seatHeight*columns+'px'}" id="canvas" ></canvas>
          <div v-for="seat in seats"  :id="seat.sid" class="seat">
            <!--title-->
            <transition name="plus-title">
              <div v-show="seat.sid === hoverid&& hovertit" class="title">
                <div class="downIcon el-icon-caret-bottom
  "></div>
                <div>{{hovertit}}</div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <!-- 已选择区域 -->
    <div class="cusdate-select" v-if="selectedSeats.length>0">
      <div class="cusdate-select-header">
        <div class="title">已选择时间段</div>
        <div class="del" @click="delSelect">
          <img class="img" src="../assets/cusdatepick/delet.png" alt="">
          清空
        </div>
      </div>
      <div v-for="item in finalShowArr" class="select-item">
        <div class="select-item-title">{{item.y}}</div>
        <div class="disflex select-item-right">
          <div class="select-item-time" v-for="(son,sonIndex) in item.xSummarylist"> <span v-if="sonIndex!=0">、</span>{{son}}</div>
        </div>
      </div>
    </div>
    <div class="cusdate-select" v-else>
      <div class="cusdate-selectbox">
        <img src="../assets/cusdatepick/drag_icon.png" alt="" class="no-select-img">
        <span class="no-select">可拖动鼠标选择时间段</span>
      </div>
    </div>
  </div>
</template>
<script>
  import WeRegion from 'we-region';
  // import seatFn from './seatCanvas';
  export default {
    name: "CusDatepick",
    props: {
      curDateList:{
        default: []
      },
    },
    data() {
      return {
        parentDateList: [],//父组件传递过来的用于回显数组
        seats:[],//初始化总格子数
        curSelectSeats:[],//当前选中
        selectedSeats: [], //最终选中所有的集合
        weRegion: null,
        rows: 48, //列显示数量
        seatWidth: 19, //单元格宽
        seatHeight: 49, //单元格高
        padding: 0, //单元格间距
        columns: 7, //行显示数量
        hoverid: '',
        hovertit: '',
        timeArr:[],
        timeArrOne:[],
        timeArrTwo:[],
        dayArr:[
          {
            name:'星期一'
          },
          {
            name:'星期二'
          },
          {
            name:'星期三'
          },
          {
            name:'星期四'
          },
          {
            name:'星期五'
          },
          {
            name:'星期六'
          },
          {
            name:'星期日'
          }
        ],
        //只是用来显示已选数组.和日历选中无关
        finalShowArr:[]
      };
    },
    methods:{
      //清空数据
      delSelect() {
        //修改样式
          this.selectedSeats.map(seat=>{
            const $ = el => document.querySelector(el);
            $(`#${seat}`).classList.remove('seat--hover')
          })
          this.selectedSeats=[]
      },
      //隐藏title
      hideTitle() {
        const $ = el => document.querySelector(el);
        this.hovertit = ''
        this.seats.map(item=>{
          $(`#${item.sid}`).classList.remove('seat--curhover')
        })
      },
      //title文案
      seatTitle(id) {
        const $ = el => document.querySelector(el);
        const tltles = this.seats.find(val => val.sid === id);
        this.seats.map(item=>{
          if(item.sid==id){
            $(`#${item.sid}`).classList.add('seat--curhover')
          }
          else {
            $(`#${item.sid}`).classList.remove('seat--curhover')
          }
        })
        let tit = '';
        if (tltles) {
          tit = `${this.dayArr[tltles.Y-1].name} ${this.timeArr[tltles.X-1]}`;
        }
        return tit;
      },
      //鼠标滑过显示title
      showTitle(ev) {
        const x = ev.offsetX || ev.layerX;
        const y = ev.offsetY || ev.layerY;
        const hoverid = `seaty${Math.ceil(y / 49)}x${Math.ceil(x / 19)}`;
        if (this.hoverid !== hoverid) {
          this.hoverid = '';
          this.hoverid = hoverid;
          this.hovertit = this.seatTitle(hoverid);
        }
      },
      //选中结束
      end({ startX, startY, width, height }) {
        this.curSelectSeats=[];
        const $ = el => document.querySelector(el);
        if(startX || startY || width || height){
          this.weRegion.clear();
          setTimeout( ()=> {//处理边界选取不清除问题
            this.weRegion.clear();
          },200)
        }
        const selectedSeats = this.seats
          .filter(seat => {
            return this.weRegion.isRectCross({
              x:(seat.X-1) * this.seatWidth ,
              y: (seat.Y-1) * this.seatHeight,
              width: this.seatWidth,
              height: this.seatHeight,
            })
          })
          .map(seat => seat.sid)
        this.curSelectSeats=JSON.parse(JSON.stringify(selectedSeats));
        //起始位置this.curSelectSeats[0]没有就添加否则删除（this.curSelectSeats[0]之前如果已经被选中，再次选中时清除当前拉选框数据）
        if(this.selectedSeats.indexOf(this.curSelectSeats[0])==-1){
          this.curSelectSeats.forEach(item=>{
            //这里需要去重否则 就导致了重复数据所以this.uniqueSelect(val)需要去重复
            let hasUni=false;
            this.selectedSeats.forEach(selItem=>{
              if (selItem==item) {
                hasUni=true
              }
            })
            if(!hasUni) {
              this.selectedSeats.push(item)
            }
          })
            this.selectedSeats.map(seat=>{
              $(`#${seat}`).classList.add('seat--hover')
            })
        } else {
          for(var i=this.selectedSeats.length-1;i>=0;i--){
            this.curSelectSeats.forEach(item=>{
              if (item==this.selectedSeats[i]){
                this.selectedSeats.splice(i,1)
              }
            })
          }
          //this.selectedSeats数组删除已选项this.curSelectSeats
            this.curSelectSeats.map(seat=>{
              $(`#${seat}`).classList.remove('seat--hover')
            })
        }
      },
      // move({ startX, startY, width, height }) {
      //   const $ = el => document.querySelector(el);
      //   this.seats.forEach(seat => {
      //     const isCross = this.weRegion.isRectCross({
      //       x:(seat.X-1) * this.seatHeight ,
      //       y: (seat.Y-1) * this.seatWidth,
      //       width: this.seatWidth,
      //       height: this.seatHeight,
      //     })
      //     if (isCross) {
      //       $(`#${seat.sid}`).classList.add('seat--hover')
      //       this.selectedSeats.push(seat)
      //
      //     } else {
      //       $(`#${seat.sid}`).classList.remove('seat--hover')
      //     }
      //   })
      // },
      // getX (seat)  {
      //   return  seat.pc * (this.seatWidth + this.padding) + (window.innerWidth - (this.seatWidth + this.padding) * this.columns) / 2
      // },
      // getY(seat) {
      //   return seat.pr * (this.seatHeight + this.padding) + 200
      // },
      //初始化canvas，和格子数
      seatInfo() {
          //初始化格子数
          this.seats = this.setDom(this.rows, this.columns);
          this.weRegion = new WeRegion(this.$refs.mask, {
            borderColor: 'rgba(250,117,22,0.6)',
            bodyColor:'rgba(250,117,22,0.6)',
            end: this.end,
            zIndex:10000
            // move:this.move
          });
      },
      //初始化格子数
      setDom(rows,columns,) { //根据数量创建带行列的数组
        const seatL = Number(rows || 0);
        // const seatL = Number(rows || 0) >=Number(columns || 0) ? rows : columns;
        const  lengths = rows*columns;
        return Array.from({length: lengths}, (a, i) => ({
          sid: `seaty${(Math.floor(i / seatL))+1}x${(i % seatL)+1}`,
          Y: (Math.floor(i / seatL))+1,//行
          X: (i % seatL)+1,//列
          // pr: ~~(i / columns),
          // pc: i % columns,
        }));
      },
      //模拟反向赋值
      setData() {
        //修改最终数组
        this.selectedSeats=[]
        this.parentDateList.forEach(item=>{
          item.xlist.forEach(sonItem=>{
            this.selectedSeats.push(sonItem.sid)
          })
        })
        //demo示例
        /*var  demoArr= [
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
        ]*/
        // this.selectedSeats=demoArr
        //修改样式
        setTimeout(()=>{
          this.selectedSeats.map(seat=>{
            const $ = el => document.querySelector(el);
            $(`#${seat}`).classList.add('seat--hover')
          })
        },500)
      },
      //初始化头部时间00:12:00,12:00-24:00
      initTimeArr() {
        for(let i=0;i<24;i++){
          let m1=i<10?`0${i}:00 - 0${i}:30`:`${i}:00 - ${i}:30`;
          let m2=i+1<10?`0${i}:30 - 0${i+1}:00`:i+1==10?`0${i}:30 - ${i+1}:00`:`${i}:30 - ${i+1}:00`;
          this.timeArr.push(m1)
          this.timeArr.push(m2)
          if(i<12){
            this.timeArrOne.push({name:i})
          }else {
            this.timeArrTwo.push({name:i})
          }
        }
      },
      //循环合并所有可能合并的时间段
      initJoinTime(xTimeArr) {
        let finalxTimeArr=xTimeArr.slice(0)
        let m =[]
        while (finalxTimeArr.length>1) {
          m = this.joinTime(finalxTimeArr)
          var pre=m.slice(0)
          if (JSON.stringify(pre)==JSON.stringify(finalxTimeArr)) {
            break
          } else {
            finalxTimeArr=m.slice(0)
          }
          if (finalxTimeArr.length==1) break
        }
       return finalxTimeArr
      },
      //合并时间段
      joinTime (data) {
        var result = []
        let tempArr = data.slice(0)
        while (tempArr.length) {
          let current = tempArr.shift()
          if (!tempArr.length){
            result.push(current)
            break
          }
          let joinItem = tempArr.find(time => current.slice(-5) === time.slice(0, 5))
          if (joinItem) {
            result.push(`${current.slice(0, 5)} - ${joinItem.slice(-5)}`)
            tempArr.shift()
          } else {
            result.push(current)
          }
        }
        return result
      },
      //排序Y值
      sortY(newArr) {
        for (let i=0;i<newArr.length;i++){
          for(var j=i; j<newArr.length;j++) {
            if ( newArr[i].yvalue> newArr[j].yvalue) {
              var min;
              //如果newArr[i]大就把此时的值赋值给最大值变量min
              min = newArr[j];
              newArr[j] = newArr[i];
              newArr[i] = min;
            }
          }
        }
        return newArr
      },
      //排序X值
      sortX(xTimeArr) {
        for (let i=0;i<xTimeArr.length;i++){
          for(var j=i; j<xTimeArr.length;j++) {
            let pre = xTimeArr[i].slice(0, 5)
            let next =xTimeArr[j].slice(0, 5)
            if ( pre> next) {
              var min;
              //如果xTimeArr[i]大就把此时的值赋值给最大值变量min
              min = xTimeArr[j];
              xTimeArr[j] = xTimeArr[i];
              xTimeArr[i] = min;
            }
          }
        }
        return xTimeArr
      },
      //选中区域去重
      // uniqueSelect(valArr){
      //   var hashVal =[];
      //   for(var i=0,len=valArr.length;i<len;i++){
      //     var obj = valArr[i];
      //     if(hashVal.indexOf(obj)===-1) hashVal.push(obj);
      //   }
      //   return hashVal;
      // }
    },
    watch:{
      //观察选中和点击的数据并进行处理
      selectedSeats: {
        handler(val){
          //清空最终保存数组
          this.finalShowArr=[];

          //val格式为["seaty7x7", "seaty7x8"]

          //重叠选择区域时会有重复的id，所以用hashVal去重复
         // let hashVal= this.uniqueSelect(val)

          /*
          final 将 val 格式转化成
          [
           {
             sid:"seaty7x7",
             x: "03:00 - 03:30"
             y: "星期日"
             yvalue: 6
           },
           {
             sid:"seaty7x8",
             x: "03:30 - 04:00"
             y: "星期日"
             yvalue: 6
           }
         ]
         * */
          let final=[]
          val.forEach(item=>{
            let first=item.split('y');
            let sec=first[1].split('x')
            let y=sec[0];
            let x=sec[1];
            final.push({y:this.dayArr[y-1].name,yvalue:(y-1),x:this.timeArr[x-1],sid:item})
          })

          //hashArr是用于排除Y重是否重复，newArr临时存储的最终数组
          //newArr整合第一步
          /*
           newArr 将 final 格式化为 y值合并,x值合并到xlist 的数据
            [
              {
                y: "星期日"
                yvalue: 6,
                xlist: [
                 {
                  sid: 'seaty7x7',
                   x: "03:00 - 03:30"
                 },
                 {
                  sid: 'seaty7x8',
                   x: "03:30 - 04:00"
                 }
                ]
              }
            ]
          * */
          let hashArr = [], newArr = []
          for (let i = 0; i < final.length; i++) {
            //y值不重复
            if (hashArr.indexOf(final[i].y) === -1) {
              newArr.push({
                y: final[i].y,
                yvalue:final[i].yvalue,
                xlist: [{x:final[i].x,sid:final[i].sid}]
              })
              hashArr.push(final[i].y);
            } else {   //y值重复
              for (let j = 0; j < newArr.length; j++) {
                if (newArr[j].y == final[i].y) {
                  //先去重复再合并(不存在重复),将newArr[j].xlist中是否存在重复
                    newArr[j].xlist.push({x:final[i].x,sid:final[i].sid})
                }
              }
            }
          }

          //newArr整合第二步
          /*
            将 newArr 数据格式化
            [
              {
                y: "星期日"
                yvalue: 6,
                xlist: [
                 {
                  sid: 'seaty7x7',
                   x: "03:00 - 03:30"
                 },
                 {
                  sid: 'seaty7x8',
                   x: "03:30 - 04:00"
                 }
                ],
                xSummarylist: ["03:00 - 04:00"]
              }
            ]
          * */
          newArr.forEach(item=>{
            //用于显示的X数据，只是有时间段的数组如["03:00-06:00", "07:00-11:00"]
            let xTimeArr=[];
            item.xlist.forEach(sonItem=>{
              xTimeArr.push(sonItem.x)
            })
            //排序X值,便于合并相同或相邻时间段
            xTimeArr=this.sortX(xTimeArr)
            //合并时间段
            //xSummarylist用于在已选择中显示的合并后的数组
            item.xSummarylist= this.initJoinTime(xTimeArr)
          })

          //排序Y值用于再已选择中从星期一开始-星期日
          newArr=this.sortY(newArr)

          //this.finalShowArr最终保存数据，显示数据
          this.finalShowArr=JSON.parse(JSON.stringify(newArr))

          //通知父组件值有变化
          this.$emit('dateChange',this.finalShowArr)
        },
        deep:true //true 深度监听
      },
    },
    mounted() {
      //根据父组件传递数组进行回显
      this.parentDateList=this.curDateList;
      //初始化时间
      this.initTimeArr();
      //初始化画布
      this.$nextTick(()=>{
        this.seatInfo();
        //模拟方向赋值
      })
      this.setData()
    }
  };
</script>
<style lang="less">
  .cusdatepick {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    color: #303133;
    width: 992px;
    /*title动画start*/
    .plus-title-enter-active {
      transition: opacity .5s;
    }
    .plus-title-enter{
      opacity: 0;
    }
    .plus-title-leave-active{
      transition: opacity .2s;
    }
    .plus-title-leave-to{
      opacity: 0;
    }
    /*title动画end*/
    .w80 {
      width: 80px;
    }
    .cusdate-select {
      border: 1px solid #dce1e6;
      border-top: 0 none;
      box-sizing: border-box;
      padding: 16px 24px;
      .cusdate-selectbox {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .no-select {
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: #717378;
      }
      .no-select-img {
        width: 16px;
        height: 16px;
        margin-right: 10px;
      }
      .cusdate-select-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        .title {
          font-size: 16px;
          font-weight: 500;
        }
        .del {
          font-size: 12px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .img {
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }
      }
      .select-item {
        display: flex;
        justify-items: center;
        margin-top: 8px;
        flex-wrap: wrap;
        word-break: break-all;
        line-height: 1.3;
        .select-item-title {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #303133;
          margin-right: 32px;
        }
        .select-item-right {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          line-height: 1.2;
        }
        .select-item-time {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #717378;
        }
      }
    }
    .disflex {
      display: flex;
      align-items: center;
    }
    .cusdate-header {
      display: flex;
      align-items: center;
      height: 96px;;
      border: 1px solid #dce1e6;
    }
    .cusdate-one {
      height: 96px;
      line-height: 96px;
      border-right:1px solid #dce1e6;
    }
    .cusdate-body {
      display: flex;
      align-items: center;
      .cusdate-body-left {
        width: 81px;
      }
      .cusdate-body-item {
        height: 48px;
        line-height: 48px;
        text-align: center;
        border-left:1px solid #dce1e6;
        border-bottom:1px solid #dce1e6;
      }
    }
    .cusdate-header-time {
      display: flex;
      flex-direction: column;
      width: 455px;
    }
    .cusdate-header-timeone {
      display: flex;
      flex-direction: column;
      width: 456px;
    }
    .cusdate-num {
      height: 48px;
      line-height: 48px;
      text-align: center;
    }
    .cusdate-num-item {
      width: 37px;
      border-right: 1px solid #dce1e6;
    }
    .cusdate-total {
      height: 48px;
      line-height: 48px;
      border-bottom: 1px solid #dce1e6;
      border-right: 1px solid #dce1e6;
    }
    .cusdate-header-time:last-child {
      .cusdate-total {
        border-right: 0 none;
      }
      .cusdate-num-item:last-child {
        border-right: 0 none;
      }
    }
    .seats {
      list-style-type: none;
      display: flex;
      position: relative;
      flex-wrap: wrap;
      width: 100%;
      height: 100%;
    }
    .seat {
      align-items: center;
      background: #fff;
      display: flex;
      width: 20px;
      height: 50px;
      margin-left: -1px;
      margin-top: -1px;
      text-align: center;
      border: 1px solid  #dce1e6;
      box-sizing: border-box;
      position: relative;
      transition: all 500ms ease-in;
      .title {
        position: absolute;
        z-index: 999;
        left: 50%;
        transform: translateX(-50%);
        top: -40px;
        padding: 6px;
        box-sizing: border-box;
        min-width: 130px;
        text-align: center;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0px 4px 25px 0px rgba(179,179,179,0.5);
        font-size: 12px !important;
        font-weight: 400 !important;
        color: #717378 !important;
        .downIcon {
          font-size: 18px;
          position: absolute;
          bottom: -10px;
          color: #fff;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }

    .seat--curhover {
      background: #f0f0f0;
    }

    .seat--hover {
      background: #fa7516;
    }
  }

</style>
