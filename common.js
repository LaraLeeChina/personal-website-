/**
 * Created by lara on 2016/9/19.
 */

//判断滚动条的上下
function addWheel(obj,fn){  //
    function show(ev){
        var oEvent=ev || event;
        var bDown=true;
        //纠正方向
        if(oEvent.detail){
            if(oEvent.detail>0){
                bDown=true;
            }else{
                bDown=false;
            }
        }else{
            if(oEvent.wheelDelta>0){
                bDown=false;
            }else{
                bDown=true;
            }
        }
        fn(bDown);// 关键一步，fn就是下面调用时的函数体 ，show函数执行的是下面传进来的fn定义的函数,判断bDown是true还是false
    }
    //对obj的鼠标滚轮事件对象浏览器进行判断，其中有个show函数，滚动时触发show函数，
    if (navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
        document.addEventListener('DOMMouseScroll', show, false)
    } else {
        document.onmousewheel =show;   //兼容IE，chrome,不兼容火狐(DOMMouseScroll ,必须要事件绑定)
    }
}

//选项卡的封装，布局要一样 id是整个父级，sEv是事件，onclick或onmouseover
function tab(id,sEv) {//id:ID名字,sEv:事件
    var oBox = document.getElementById(id);
    var aBtn = oBox.getElementsByTagName('input');
    var aDiv = oBox.getElementsByTagName('div');

    for (var i = 0; i < aBtn.length; i++) {
        aBtn[i].index = i;
        aBtn[i][sEv] = function () {
            for (var i = 0; i < aBtn.length; i++) {
                aBtn[i].className = '';
                aDiv[i].style.display = 'none';
            }
            this.className = 'active';
            aDiv[this.index].style.display = 'block';
        }
    }
}

//获取行间样式
function getStyle(obj, name){
    //alert(oBox.currentStyle);//undefined;
    if(obj.currentStyle){
      return   obj.currentStyle[name];
    }else{
        return  getComputedStyle(obj,false)[name];
    }

    //return(obj.currentStyle[name] || getComputedStyle(obj,false))[name]
}

//找重复，n为要比较的东西，arr为要找的数组
function arrInarr(n,arr){
    for(var i=0;i<arr.length; i++){
        if(n==arr[i]){
            return true;
        }
    }
    return false;
}

//随机数
function rnd(n,m){
    return parseInt(Math.random()*(m-n)+n)
}

//单数改为双数；
function toDouble(n){
    if(n<10){
        return '0'+n
    }else{
        return ''+n
    }
}

//改变对象的样式
function setStyle(){//包含两种写法()
    var obj=arguments[0];
    if( arguments.length==3){
        var name=arguments[1];
        var value=arguments[2];
        obj.style[name]=value;
    }else{
        var json=arguments[1];
        for( var name in json){
            obj.style[name]=json[name];
        }
    }
}

//在父级oparent中找到所有class名为 sclass的标签；要与去重函数findInArr一起用；
function getByClass(oParent,sClass){
    if( oParent.getElementsByTagName){
        return oParent.getElementsByTagName(sClass);
    }else{
        var aEle=oParent.getElementsByTagName('*');
        var arr=[];
        for( var i=0; i<aEli.length; i++){
            var tmp=aEle[i].className.split(' ');

            if( findInArr线性查找(sClass,tmp)){
                arr.push(aEle[i]);
            }
        }
        return arr;
    }
}

//获取定位父级的top left值
function getPos(obj){
    var l = 0;//左边
    var t = 0;//上边
    while(obj){
        l+=obj.offsetLeft;
        t+=obj.offsetTop;
        obj = obj.offsetParent;
        //console.log(obj);
    }
    return {top: t, left: l};
}


//九宫格拖拽变大小
function drag(obj,oParent){
    obj.onmousedown=function(ev){
        var oEvent=ev||event;
        var oldX=oEvent.clientX;
        var oldY=oEvent.clientY;
        var oldW=oParent.offsetWidth;
        var oldH=oParent.offsetHeight;
        var oldT=oParent.offsetTop;
        var oldL=oParent.offsetLeft;
        document.onmousemove=function(ev){
            var oEvent=ev||event;
            if(obj.id.indexOf('l')!=-1){
                var dis=oldX-oEvent.clientX;
                oParent.style.width=oldW+dis+'px';
                oParent.style.left=oldL-dis+'px';
            }
            if(obj.id.indexOf('t')!=-1){
                var dis=oldY-oEvent.clientY;
                oParent.style.height=oldH+dis+'px';
                oParent.style.top=oldT-dis+'px';
            }
            if(obj.id.indexOf('r')!=-1){
                var dis=oEvent.clientX-oldX;
                oParent.style.width=oldW+dis+'px';
            }
            if(obj.id.indexOf('b')!=-1){
                var dis=oEvent.clientY-oldY;
                oParent.style.height=oldH+dis+'px';
            }
        };
        document.onmouseup=function(){
            document.onmousemove=null;
            document.onmouseup=null;
        };
        return false;
    };
}

//事件绑定兼容的封装
function addEvent(obj,sName,fn){
    if(obj.addEventListener){
        obj.addEventListener(sName,fn,false);
    }else{
        obj.attachEvent('on'+sName,fn);
    }
}
function removeEvent(obj,sName,fn){
    if(obj.removeEventListener){
        obj.removeEventListener(sName,fn,false);
    }else{
        obj.detachEvent('on'+sName,fn);
    }
}

//加载dom后加载js
function domReady(fn){
    if(document.addEventListener){
        document.addEventListener('DOMContentLoaded',fn,false);
    }else{
        document.onreadystatechange=function(){
            if(document.readyState=='complete'){
                fn();
            }
        }
    }
}


//运动，obj对象，在time时间内，样式name改变到end,样子。与getStyle
function move(obj,json,options){
    var options=options || {};
    var easing=options.easing || 'linear';
    var time=options.duration || 1000;
    var start={};
    var dis={};
    for(var name in json) {
        start[name] = parseFloat(getStyle(obj, name));
        dis[name] = json[name] - start[name];

    }
    var count =Math.ceil(time/30);
    var n=0;
    clearInterval(obj.timer);
    obj.timer=setInterval(function(){
        n++;
        for(var name in json){

            switch (easing){
                case 'linear':
                    var a=n/count;
                    var cur=start[name]+dis[name]*a;
                    break;
                case 'ease-out':
                    var a=1-n/count;
                    var cur=start[name]+dis[name]*(1-a*a*a);
                    break;
                case 'ease-in':
                    var a=n/count;
                    var cur=start[name]+dis[name]*a*a*a;
                    break;
            }

            if(name=='opacity'){
                obj.style.opacity=cur;
            }else{
                obj.style[name]=cur+'px';
            }
        }
        if(n==count){
            clearInterval(obj.timer);
            options.complete && options.complete();
        }
    },30)
}