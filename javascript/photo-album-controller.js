/**
 * Created by wuyanan on 2016/8/24.
 */
//  var photoTestApp = angular.module("photoTestApp",[]);
// photoTestApp.controller("photoTestController",["$scope",function($scope){

    // 设置照片数据
    var dataList = [
        {id:1,photoName:"test-001.JPG",caption:"多叫点",desc:"对方结婚卡桑德环境，速度发货收到就好，点击都是废话。"},
        {id:2,photoName:"test-002.JPG",caption:"第三课",desc:"是否是东方丽景，速度发货，uuha手机号都是废话。"},
        {id:3,photoName:"test-003.JPG",caption:"反倒是",desc:"第三方国际水电费了很久，当否是否收到了问视频。"},
        {id:4,photoName:"test-004.JPG",caption:"飞碟说",desc:"多舒服的失联飞机是的，复读机圣诞节覅；奥尔是丹佛。"},
        {id:5,photoName:"test-005.JPG",caption:"喝咖啡",desc:"vjksd爱神的箭的师范类，都是废话砀山龙卷风了 圣诞节疯狂了 觉得，是的覅及，的是覅和，非动物而赛季安抚佛的是我饿哦日哦啊，围殴按时到批发哇【为 怕死惹我房间打开。"},
        {id:6,photoName:"test-006.JPG",caption:"V型从",desc:"分公司对法搜地方uuyjkdsfug是滴啊发几篇莫得法，第三方及欧普 是【afield【，复读机圣诞节覅；奥尔是丹佛，啥地方有佛道匹配【微普法记得吗‘的书法家。"},
    ];
    // 1.控制翻转
    var turn = function (target){
        var cls = target.className;
        var n = target.id.split('_')[1];
        if(!/photo_center/.test(cls)){
            // 如果不是已经选中的照片，需要重新排序
            return rSort(n);
        }

        if(/photo-front/.test(cls)){
            cls = cls.replace(/photo-front/,'photo-back');
            g('#nav_'+n).className += ' i_back';
        }else{
            cls = cls.replace(/photo-back/,'photo-front');
            g('#nav_'+n).className = g('#nav_'+n).className.replace(/\s*i_back\s*/,' ');
        }
        return target.className = cls;
    };
     // 3.通用函数（通过ID或者className获取元素）
    function g(selector){
        var method = selector.substr(0,1) == "."?'getElementsByClassName':'getElementById';
        return document[method](selector.substr(1));
    };

    // 随机生成一个值 支持取值范围 传入一个数组range[max.min]
    function random(range){
        var max = Math.max(range[0],range[1]);
        var min = Math.min(range[0],range[1]);
        var diff = max - min;
        var number = Math.ceil(Math.random()*diff+min);
        console.info(number);
        return number;
    }

    // 4.输出所有照片
    function addAllPhotos(){
        var template = g("#wrap").innerHTML;
        // 设置后返回的html(数组)
        var html = [];
        var nav = [];
        for(var i=0;i<dataList.length;i++){
            var _currentHtml = template.replace("{{index}}",i)
                                        .replace("{{img}}",dataList[i].photoName)
                                        .replace("{{caption1}}",dataList[i].caption)
                                        .replace("{{desc1}}",dataList[i].desc);
            html.push(_currentHtml);
            // 7.输出控制按钮
            nav.push('<span id="nav_'+i+'" class="i" onclick="turn(g(\'#photo_'+i+'\'))">&nbsp;</span>');
        }
        html.push('<div class="nav">'+nav.join('')+'</div>');
        g("#wrap").innerHTML = html.join('');
        rSort(random([0,dataList.length-1]));
    };
    addAllPhotos();

    // 计算左右分区的范围
    function range(){
        var range = {left:{x:[],y:[]},right:{x:[],y:[]}};
        // 获取wrap以及每张照片photo的宽和高
        var wrap={
            w:g("#wrap").clientWidth,
            h:g("#wrap").clientHeight
        };
        var photo={
            w:g(".photo")[0].clientWidth,
            h:g(".photo")[0].clientHeight
        };
        range.wrap = wrap;
        range.photo = photo;
        // 左分区取值范围
        range.left.x = [0-photo.w, wrap.w/2-photo.w/2];
        range.left.y = [0-photo.h, wrap.h];
        // 有分区取值范围
        range.right.x = [wrap.w/2+photo.w/2, wrap.w+photo.w];
        range.right.y = range.left.y;
        return range;
    }

    // 5.排序照片
    function rSort(n){
        // 去掉所有非选中照片的photo_center样式
        // 不常用的变量用_开头
        var _photoAlls = g(".photo");  // 这里是类数组，并不真正的数组
        var photos = [];
        for(s =0;s<_photoAlls.length;s++){
            _photoAlls[s].className = _photoAlls[s].className.replace(/\s*photo_center\s*/,' ');
            // 选中的不是已经选中的照片时，需要重新排序，此时选中的新的照片存在随机生成的left、top
            // 以及旋转角度，因此需要将他们去掉。否则居中样式photo_cneter将会被覆盖，无法居中
            // 还需要去掉photo_front以及photo_back
            _photoAlls[s].className = _photoAlls[s].className.replace(/\s*photo-front\s*/,' ');
            _photoAlls[s].className = _photoAlls[s].className.replace(/\s*photo-back\s*/,' ');
            _photoAlls[s].style.left = '';
            _photoAlls[s].style.top = '';
            _photoAlls[s].style["-webkit-transform"] = 'rotate(360deg) scale(.8)';
            // 去掉后还需要初始化所有照片应该显示正面
            _photoAlls[s].className +=" photo-front";
            photos.push(_photoAlls[s]);
        }
        var photo_center = g("#photo_"+n);
        photo_center.className += " photo_center";

        // 进行左右分区
        // 获取取值范围
        var ranges = range();
        // 将photo_center样式从photo数组中删除
        photo_center = photos.splice(n,1)[0];
        var photo_left = photos.splice(0,Math.ceil(photos.length/2));
        var photo_right = photos;

        // 遍历设置左右两边照片的left以及top样式
        for(s in photo_left){
            var photo = photo_left[s];
            photo.style.left = random(ranges.left.x)+'px';
            photo.style.top = random(ranges.left.y)+'px';
            photo.style["-webkit-transform"] = "rotate("+random([-150,150])+"deg) scale(.5)";
        }
        for(s in photo_right){
            var photo = photo_right[s];
            photo.style.left = random(ranges.right.x)+'px';
            photo.style.top = random(ranges.right.y)+'px';
            photo.style["-webkit-transform"] = "rotate("+random([-150,150])+"deg) scale(.5)";
        }

        // 控制按钮处理
        // 将i_current;i_back去掉
        var navs = g('.i');
        for(s=0;s<navs.length;s++){
            navs[s].className = navs[s].className.replace(/\s*i_current\s*/,' ');
            navs[s].className = navs[s].className.replace(/\s*i_back\s*/,' ');
        }

        g('#nav_'+n).className +=" i_current";

    };

