export default {
  /* eslint-disable */
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
  // setClass(datas,type,del) {
  //   // del=> 清除所有class
  //   //type =>数组，class名称
  //   const $ = el => document.querySelector(el);
  //     datas.forEach(item => {
  //       const $seat = $(`#${item}`);
  //       if(arguments.length>2){
  //         type.forEach(item => {
  //           $seat.classList.remove(item);
  //         });
  //       }else {
  //         type.forEach(item => {
  //           $seat.classList.add(item);
  //         });
  //       }
  //     })
  // }
}
