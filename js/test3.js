require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/TileLayer",
    "esri/layers/FeatureLayer",

    "dojo/dom",
    "dojo/on",
    "dojo/domReady!",

    "esri/config",
    "esri/Basemap",
    "esri/core/watchUtils"
], function (Map, mapview, TileLayer, FL, dom, on, domReady, esriConfig, Basemap, watchUtils) {
    esriConfig.apiKey = "AAPKd8b9057a61a24b738ad21d4ec6401ee6q9_Kkpwk5p-vCs85zsCvv1dLorKqBenU7xKvppuC2E8aZRjR74FJOYG6nOGFmxxZ";

    //左侧view视图初始的底图
    const map = new Map({
        basemap: "streets-vector"
    });
    var view = new mapview({
        container: "viewDiv",
        map: map,
        zoom: 3,
        center: [114, 31]
    });
    //右侧view2视图初始的底图
    const map2 = new Map({
        basemap: "arcgis-colored-pencil"
    });
    var view2 = new mapview({
        id: 'view2',
        container: 'view2Div',
        map: map2,
        zoom: 3,
        center: [114, 31],
        constraints: {
            // Disable zoom snapping to get the best synchonization
            snapToZoom: false
        }
    });

    //-----------------------------要求一：切换底图，可视化的形式。（可供切换的Basemaps）-----------------------------
    url1 = "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer";
    url2 = "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer";
    url3 = "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer";
    var Layer1 = new TileLayer({ url: url1 });
    var Layer2 = new TileLayer({ url: url2 });
    var Layer3 = new TileLayer({ url: url3 });
    on(dom.byId("DeLorme_World"), "click", btn1);
    on(dom.byId("StreetPurplishBlue"), "click", btn2);
    on(dom.byId("ChinaOnlineStreetWarm"), "click", btn3);
    function btn1() { map.add(Layer1) }
    function btn2() { map.add(Layer2) }
    function btn3() { map.add(Layer3) }


    //---------------要求二：能够动态加载专题图层。可以显示图层的数量，控制图层的显示与关闭。能够删除图层。--------------
    // 添加两个Tilelayer:
    //路网图层
    var transportationLayer = new TileLayer({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer",
        // This property can be used to uniquely identify the layer
        id: "streets",
        visible: false
    });
    //地震点图层
    var earthquakesLayer = new FL({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/FeatureServer",
        id: "ny-housing",
        opacity: 0.7,
        visible: false
    });
    //路网图层标签
    var streetsLayerToggle = document.getElementById("streetsLayer");
    streetsLayerToggle.addEventListener("change", function () {
        transportationLayer.visible = streetsLayerToggle.checked;
        console.log(transportationLayer.visible);
        if (streetsLayerToggle.checked == true) {
            view.map.add(transportationLayer);
        } else {
            view.map.remove(transportationLayer);
        }
    });
    //房屋图层标签
    var earthquakesLayerToggle = document.getElementById("earthquakesLayer");
    earthquakesLayerToggle.addEventListener("change", function () {
        earthquakesLayer.visible = earthquakesLayerToggle.checked;
        //console.log(earthquakesLayerToggle.checked)
        if (earthquakesLayerToggle.checked == true) {
            view.map.add(earthquakesLayer);
        } else {
            view.map.remove(earthquakesLayer);
        }
    });
    //显示图层数量
    view.map.allLayers.on("change", function (event) {
        var num = event.target.length - 1;
        document.getElementById("layerNum").textContent = "图层数量： " + num;
    });


    //--------------------------------要求三：显示比例尺、鼠标对应的地理坐标--------------------------------
    view.watch(["stationary"], function () {
        showInfo(view.center);
    });
    view.on(["pointer-move"], function (evt) {
        showInfo(view.toMap({
            x: evt.x,
            y: evt.y
        }));
    });
    function showInfo(pt) {
        document.getElementById("scaleDisplay").textContent = "比例尺：1 : " + Math.round(view.scale * 1) / 1;
        document.getElementById("coordinateDisplay").textContent = "经纬度：" + pt.latitude.toFixed(2) + "°，" + pt.longitude.toFixed(2) + "°";
    }


    //-------------------------------------要求四：地图联动功能-------------------------------------
    var synchronizeView = function (view, others) {

        others = Array.isArray(others) ? others : [others];
        var viewpointWatchHandle;//视点观察
        var viewStationaryHandle;//静止
        var otherInteractHandlers;//其他交互式操作
        var scheduleId;

        //清除Handles
        var clear = function () {
            if (otherInteractHandlers) {
                otherInteractHandlers.forEach(function (handle) {
                    handle.remove();
                });
            }
            viewpointWatchHandle && viewpointWatchHandle.remove();
            viewStationaryHandle && viewStationaryHandle.remove();
            scheduleId && clearTimeout(scheduleId);
            otherInteractHandlers = viewpointWatchHandle =
                viewStationaryHandle = scheduleId = null;
        };

        var interactWatcher = view.watch('interacting,animation',
            function (newValue) {
                if (!newValue) {
                    return;
                }
                if (viewpointWatchHandle || scheduleId) {
                    return;
                }
                // 在下一帧开始更新其他视图
                scheduleId = setTimeout(function () {
                    scheduleId = null;
                    viewpointWatchHandle = view.watch('viewpoint',
                        function (newValue) {
                            others.forEach(function (otherView) {
                                otherView.viewpoint = newValue;
                            });
                        });
                }, 0);
                // 一旦另一个视图开始交互，就会停止（就像用户开始平移一样）
                otherInteractHandlers = others.map(function (otherView) {
                    return watchUtils.watch(otherView,
                        'interacting,animation',
                        function (
                            value) {
                            if (value) {
                                clear();
                            }
                        });
                });
                // 当视图再次静止时停止
                viewStationaryHandle = watchUtils.whenTrue(view,
                    'stationary', clear);
            });
        return {
            remove: function () {
                this.remove = function () { };
                clear();
                interactWatcher.remove();
            }
        }
    };
    
    // 同步多个视图的视点
    var synchronizeViews = function (views) {
        var handles = views.map(function (view, idx, views) {
            var others = views.concat();
            others.splice(idx, 1);
            return synchronizeView(view, others);
        });
        return {
            remove: function () {
                this.remove = function () { };
                handles.forEach(function (h) {
                    h.remove();
                });
                handles = null;
            }
        }
    }
    // 绑定视图
    synchronizeViews([view, view2]);

    //---------------------------------要求五：底层实现swipe卷帘功能--------------------------------------
    //status=1是垂直卷帘，2是水平卷帘，3是都有
    var status = 0;
    var verticalToggle = document.getElementById("vertical");
    verticalToggle.addEventListener("change", function (event) {
        if (verticalToggle.checked == true) {
            styleChange();
            status += 1;
        } else {
            status -= 1;
            if (status == 0) {
                location.reload([false]);
            }
        }
    });
    var levelToggle = document.getElementById("level");
    levelToggle.addEventListener("change", function (event) {
        if (levelToggle.checked == true) {
            styleChange();
            status += 2;
        } else {
            status -= 2;
            if (status == 0) {
                location.reload([false]);
            }
        }
    });
    view.on('pointer-move', function (e) {
        if (status == 1) {
            verticalSwipt();
        }
        if (status == 2) {
            levelSwipe();
        }
        if (status == 3) {
            bothSwipe();
        }
    });
    view2.on('pointer-move', function (e) {
        if (status == 1) {
            verticalSwipt();
        }
        if (status == 2) {
            levelSwipe();
        }
        if (status == 3) {
            bothSwipe();
        }
    });
    function styleChange() {
        document.getElementById("viewDiv").style.width = "100%";
        document.getElementById("view2Div").style.width = "100%";
        document.getElementById("view2Div").style.left = "0";
    }
    function verticalSwipt() {
        var x = event.screenX;
        document.getElementById("view2Div").style.clip = 'rect(-1000px,2000px,1000px,' + x + 'px)';
    }
    function levelSwipe() {
        var y = event.screenY - 105;
        document.getElementById("view2Div").style.clip = 'rect(-10000px,10000px,' + y + 'px,-10000px)';
    }
    function bothSwipe() {
        var x = event.screenX;
        var y = event.screenY - 105;
        document.getElementById("view2Div").style.clip = 'rect(-10000px,10000px,' + y + 'px,' + x + 'px)';
    }

});

//-------------------------------动态加载图层————下拉菜单包含checkbox的外观设计------------------------------
var nextState = 1;
function change(obj) {
    var liArray = document.getElementsByTagName("LI");
    var i = 1;
    var length = liArray.length;
    switch (nextState) {
        case 1:
            for (; i < length; i++) {
                liArray[i].className = "liShow";
            }
            nextState = 0;
            break;
        case 0:
            for (; i < length; i++) {
                liArray[i].className = "liHide";
            }
            nextState = 1;
    }
}