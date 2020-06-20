$(function() {
    var iNow=0;
    run(0,'${dailyTransactionList}');
    //上个月
    $(".a1").click(function(){
        //新建考勤时dailyTransactionList为前页暂存每日详情list
        //修改考勤时dailyTransactionList为本考勤对应每日详情list
        //暂存本页数据
           $.ajax({
            type: 'post',
            data :$("#attendanceAddOrUpdateForm").serialize()+"&lastPageDailyTransactionsList="+baseDailyTranctionList,
              url: "${ctx}/manage/attendance/saveCurrentPageDailyTransaction",
              dataType:"json",
            success:function (data) {
                //非空白数据更新baselist
                if(data!=''){
                    baseDailyTranctionList = JSON.stringify(data);
                }
             iNow--;
         run(iNow,baseDailyTranctionList);
        },
            error: function (data) {
            layer.msg("暂存本页数据出错");
        }
            })
    });
    //下个月
    $(".a2").click(function(){
        //新建考勤时dailyTransactionList为前页暂存每日详情list
        //修改考勤时dailyTransactionList为本考勤对应每日详情list
        //暂存本页数据
           $.ajax({
            type: 'post',
               async:false,
            data :$("#attendanceAddOrUpdateForm").serialize()+"&lastPageDailyTransactionsList="+baseDailyTranctionList,
              url: "${ctx}/manage/attendance/saveCurrentPageDailyTransaction",
              dataType:"json",
            success:function (data) {
                //非空白数据更新baselist
                if(data!=''){
                    baseDailyTranctionList = JSON.stringify(data);
                }
                iNow++;
            run(iNow,baseDailyTranctionList);
        },
            error: function (data) {
            layer.msg("暂存本页数据出错");
        }
            })
    })
});

/*-----------------------------------------------日历--------------------------------------------------------  */
    //获取月份差
      function getIntervalMonth(startDate,endDate){
        var startMonth = startDate.getMonth();
        var endMonth = endDate.getMonth();
        var intervalMonth = (startDate.getFullYear()*12+startMonth) - (endDate.getFullYear()*12+endMonth);
        return intervalMonth;
    }
    //获取月份日期前缀方法
    function getMonthDatePrefix(month,year){
        var monthDatePrefix;
        if(month<9){
             monthDatePrefix = year+"0"+(month+1);
        }else{
            monthDatePrefix = year+""+(month+1);
        }
        return monthDatePrefix;
    }
        //日历绘制方法
          function run(n,data) {
            //将baselist带给保存方法
            $('#saveAttendanceInput').val(data);
            var oDate = new Date(); //定义时间
            oDate.setMonth(oDate.getMonth()+n);//设置月份
              //本月上月下月年月信息
            var year = oDate.getFullYear(); //年
            var month = oDate.getMonth(); //月(月份从0开始)
            var today = oDate.getDate(); //日
            oDate.setMonth(oDate.getMonth()-1);
            //本月上月下月日期年月前缀
            var datePrefix = getDatePrefix(month,year);
            var monthDatePrefix = getMonthDatePrefix(month,year);
            //计算本月有多少天
          var allDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
            //计算上月有多少天
            var lastMonthAllDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][lastMonth];
            //计算下月有多少天
            var nextMonthAllDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][lastMonth];
            //判断闰年
            if(month == 1) {
                if(year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
                    allDay = 29;
              }
            }
            
            //判断本月第一天是星期几
            oDate.setMonth(oDate.getMonth()-1);
            oDate.setDate(1); //时间调整到本月第一天
            var week = oDate.getDay(); //读取本月第一天是星期几 返回值是 0（周日） 到 6（周六） 之间的一个整数
            //默认周日在最左侧，为显示方便，将周六周日移动到最右侧
            if(week==0){
                week=6;
            }else{
                week=week-1;
            }
 
            //console.log(week);
          $(".dateList").empty();//每次清空
          //插入日历详情
          $(".calendarBookDetail").append("<input type='hidden' name='calendarBook.calendarDate' value='"+monthDatePrefix+"'>");
            //插入上个月日期
            for(var i = 0; i < week; i++) {
                if('${rulesType}' !="1"&&'${rulesType}' !="2"){
                     $(".dateList").append("<li><input type='hidden' name='dailyTransactionList["+i+"].day' value='"+getDateByIndex(lastMonthAllDay-week+i+1,lastDatePrefix)+"'><input type='hidden' name='dailyTransactionList["+i+"].dayOfWeek' value='"+getWeekByIndex((lastMonthAllDay-week+1+i),lastDatePrefix)+"'><input type='hidden' name='dailyTransactionList["+i+"].transationType' value='"+1+"'><input type='hidden' name='dailyTransactionList["+i+"].attendanceType' value='${attendanceRulesVo.attendanceRules.rulesType}'>"  + (lastMonthAllDay-week+1+i) + "</li>");
                }else{
                     $(".dateList").append("<li><input type='hidden' name='dailyTransactionList["+i+"].day' value='"+getDateByIndex(lastMonthAllDay-week+i+1,lastDatePrefix)+"'><input type='hidden' name='dailyTransactionList["+i+"].dayOfWeek' value='"+getWeekByIndex((lastMonthAllDay-week+1+i),lastDatePrefix)+"'><input type='hidden' name='dailyTransactionList["+i+"].transationType' value='"+1+"'><input type='hidden' name='dailyTransactionList["+i+"].attendanceType' value='${rulesType}'>" + (lastMonthAllDay-week+1+i) + "</li>");
                }
            }
            //插入本月日期
            for(var i = 1; i <= allDay; i++) {
                //添加当月每天的li
                 if('${rulesType}' !="1"&&'${rulesType}' !="2"){
                     $(".dateList").append("<li><input type='hidden' name='dailyTransactionList["+(week+i-1)+"].day' value='"+getDateByIndex(i,datePrefix)+"'><input type='hidden' name='dailyTransactionList["+(week+i-1)+"].dayOfWeek' value='"+getWeekByIndex(i,datePrefix)+"'><input type='hidden' name='dailyTransactionList["+(week+i-1)+"].transationType' value='"+1+"'><input type='hidden' name='dailyTransactionList["+(week+i-1)+"].attendanceType' value='${attendanceRulesVo.attendanceRules.rulesType}'>" + i + "</li>");
                 }else{
                     $(".dateList").append("<li><input type='hidden' name='dailyTransactionList["+(week+i-1)+"].day' value='"+getDateByIndex(i,datePrefix)+"'><input type='hidden' name='dailyTransactionList["+(week+i-1)+"].dayOfWeek' value='"+getWeekByIndex(i,datePrefix)+"'><input type='hidden' name='dailyTransactionList["+(week+i-1)+"].transationType' value='"+1+"'><input type='hidden' name='dailyTransactionList["+(week+i-1)+"].attendanceType' value='${rulesType}'>" + i + "</li>");
                 }
            }
              //插入下个月日期
               var left = (allDay+week)%7;
              if(left!=0){
                  left = 7-left;
              }
            for(var i = 1; i <= left; i++) {
                if('${rulesType}' !="1"&&'${rulesType}' !="2"){
                    $(".dateList").append("<li><input type='hidden' name='dailyTransactionList["+(allDay+week+i-1)+"].day' value='"+getDateByIndex(i,nextDatePrefix)+"'><input type='hidden' name='dailyTransactionList["+(allDay+week+i-1)+"].dayOfWeek' value='"+getWeekByIndex(i,nextDatePrefix)+"'><input type='hidden' name='dailyTransactionList["+(allDay+week+i-1)+"].transationType' value='"+1+"'><input type='hidden' name='dailyTransactionList["+(allDay+week+i-1)+"].attendanceType' value='${attendanceRulesVo.attendanceRules.rulesType}'>" + i + "</li>");
                }else {
                    $(".dateList").append("<li><input type='hidden' name='dailyTransactionList["+(allDay+week+i-1)+"].day' value='"+getDateByIndex(i,nextDatePrefix)+"'><input type='hidden' name='dailyTransactionList["+(allDay+week+i-1)+"].dayOfWeek' value='"+getWeekByIndex(i,nextDatePrefix)+"'><input type='hidden' name='dailyTransactionList["+(allDay+week+i-1)+"].transationType' value='"+1+"'><input type='hidden' name='dailyTransactionList["+(allDay+week+i-1)+"].attendanceType' value='${rulesType}'>" + i + "</li>");
                }
                
            } 
            
            //标记颜色=====================
            $(".dateList li").each(function(i, elm){
                //console.log(index,elm);
                var curentDate = $(this).children().eq(0).val();
                var monthCount = curentDate.split("-")[1];
               /*  if (n==0) {
                    //非本月且非节假日
                    if((monthCount-month-1)!=0&&i%7!=5&&i%7!=6){
                    $(this).addClass('ccc')
                }else if(i%7==5  ||  i%7==6   ){
                    $(this).addClass('sun')
                }
                }else if(n<0){
                    $(this).addClass('ccc')
                }else if(i%7==5  ||  i%7==6   ){
                    $(this).addClass('sun')
                } */
                 
                //非本月背景色灰色
                if((monthCount-month-1)!=0&&i%7!=5&&i%7!=6){
                $(this).addClass('ccc');
                //节假日背景色灰色字体红色
                }else if((monthCount-month-1)!=0&&i%7==5){
                    $(this).addClass('sunccc');
                }else if((monthCount-month-1)!=0&&i%7==6){
                    $(this).addClass('sunccc');
                }else if(i%7==5  ||  i%7==6   ){
                $(this).addClass('sun')
                }
            
            });
            //定义标题日期
            $("#calendar h4").text(year + "年" + (month + 1) + "月");
            
            //为每天添加点击事件
             var dayList=$(".dateList li");
             for(i=0;i<dayList.length;i++) {
                 dayList[i].onclick = function () {
                     if($(this).children().eq(2).val()==1){
                         //点击变色
                         this.style="background-color:#FF8000";
                           //设置类型为工作日
                         $(this).children().eq(2).val(2);
                     }else{
                         //变色
                         $(this).removeAttr("style");
                           //设置类型为工作日
                         $(this).children().eq(2).val(1);
                     }
                 }
             } 
            //将传入的每日详情赋值
            for(i=0;i<dayList.length;i++) {
                var currentDate = dayList[i].children[0].value;
                /* //获得数据库中所有每日详情
                var dailyTransactionList = '${dailyTransactionList}'; 
                var arrayDate = new Array();  
                <c:forEach items="${dailyTransactionList}" var="list">
                    arrayDate.push('${list.day}'); 
                </c:forEach>  
                var arrayType = new Array();  
                <c:forEach items="${dailyTransactionList}" var="list">
                    arrayType.push('${list.transationType}'); 
                </c:forEach>  */
                
                if(data!=''){
                    //将data字符串转为数组data2
                    var data2 = eval(data);
                    for(var j in data2){
                        if(new Date(data2[j].day).toLocaleDateString()==new Date(currentDate).toLocaleDateString()){
                            dayList[i].children[2].value=data2[j].transationType;
                            if(data2[j].transationType==2){
                                dayList[i].setAttribute("style","background-color:#FF8000");
                            }
                        }
                    }
                } 
            }
        };
————————————————
版权声明：本文为CSDN博主「宣午刚001」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/xuanwugang/java/article/details/80012538