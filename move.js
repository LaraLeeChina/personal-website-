/**
 * Created by Wentao on 2016/9/20.
 */
function getStyle(obj,name){
    if(obj.currentStyle){
        return obj.currentStyle[name];
    }else{
        return getComputedStyle(obj,false)[name];
    }
}

function move(obj,json,options){
    var options=options || {};
    var duration=options.duration || 800;
    var easing=options.easing || 'ease-out';
    var n=0;
    var start={};
    var dis={};
    var count=Math.ceil(duration/30);
    //{top:0,left:0}
    for(name in json){
        start[name]=parseFloat(getStyle(obj,name));
        dis[name]=json[name]-start[name];
    }

    clearInterval(obj.timer);
    obj.timer=setInterval(function(){
        n++;
        for(name in json){
            switch (easing){
                case 'linear':
                    var a=n/count;
                    var cur=start[name]+dis[name]*a;
                    break;
                case 'ease-out':
                    var a=1-n/count;
                    var cur=start[name]+dis[name]*(1-Math.pow(a,3));
                    break;
                case 'ease-in':
                    var a=n/count;
                    var cur=start[name]+dis[name].Math.pow(a,3);
                    break;
            }
            if(name=='opacity'){
                obj.style[name]=cur;
                obj.style.filter='alpha(opacity:'+cur*100+')';
            }else{
                obj.style[name]=cur+'px';
            }
        }
        if(n==count){
            clearInterval(obj.timer);
            options.complete && options.complete();
        }
    },30);
}