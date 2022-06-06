require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/TileLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/GeoJSONLayer",
    "esri/Graphic",

    "dojo/dom",
    "dojo/on",
    "dojo/domReady!",

    "esri/config",
    "esri/Basemap",
    "esri/core/watchUtils",
    "esri/PopupTemplate",
], function (Map, mapview, TileLayer, FL, GeoJSONLayer, Graphic, dom, on, domReady, esriConfig, Basemap, watchUtils, PopupTemplate) {
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
    url1_ = "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer";
    url2_ = "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer";
    url3_ = "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer";
    var Layer1 = new TileLayer({ url: url1_ });
    var Layer2 = new TileLayer({ url: url2_ });
    var Layer3 = new TileLayer({ url: url3_ });
    on(dom.byId("DeLorme_World"), "click", btn1);
    on(dom.byId("StreetPurplishBlue"), "click", btn2);
    on(dom.byId("ChinaOnlineStreetWarm"), "click", btn3);
    function btn1() { map.add(Layer1) }
    function btn2() { map.add(Layer2) }
    function btn3() { map.add(Layer3) }


    //---------------要求二：能够动态加载专题图层。可以显示图层的数量，控制图层的显示与关闭。能够删除图层。--------------
    //添加动物的图层
    const template = {
        // autocasts as new PopupTemplate()
        title: "name",
        content: [
            {
                // It is also possible to set the fieldInfos outside of the content
                // directly in the popupTemplate. If no fieldInfos is specifically set
                // in the content, it defaults to whatever may be set within the popupTemplate.
                type: "fields",
                fieldInfos: [
                    {
                        fieldName: "stateProvi",
                        label: "所在省份"
                    },
                    {
                        fieldName: "longitude",
                        label: "经度",
                        format: {
                            digitSeparator: true,
                            places: 0
                        }
                    },
                    {
                        fieldName: "latitude",
                        label: "纬度",
                        format: {
                            digitSeparator: true,
                            places: 0
                        }
                    },
                    {
                        fieldName: "kingdom",
                        label: "界",
                        format: {
                            digitSeparator: true,
                            places: 0
                        }
                    },
                    {
                        fieldName: "phylum",
                        label: "门",
                        format: {
                            digitSeparator: true,
                            places: 0
                        }
                    },
                    {
                        fieldName: "class",
                        label: "肛"
                    },
                    {
                        fieldName: "order",
                        label: "目",
                        format: {
                            digitSeparator: true,
                            places: 0
                        }
                    },
                    {
                        fieldName: "family",
                        label: "科",
                        format: {
                            digitSeparator: true,
                            places: 0
                        }
                    },
                    {
                        fieldName: "genus",
                        label: "属",
                        format: {
                            digitSeparator: true,
                            places: 0
                        }
                    },
                    {
                        fieldName: "species",
                        label: "种",
                        format: {
                            digitSeparator: true,
                            places: 0
                        }
                    },

                ]
            }
        ]
    };
    const url1 = "https://wffgithub666.github.io/json/%E7%A7%8B%E6%B2%99%E9%B8%AD.geojson";
    const url2 = "https://wffgithub666.github.io/json/baitouhe.geojson";
    const url3 = "https://wffgithub666.github.io/json/bigpanda.geojson";
    const url4 = "https://wffgithub666.github.io/json/chuanshanjia.geojson";
    const url5 = "https://wffgithub666.github.io/json/dongyafeihuang.geojson";
    const url6 = "https://wffgithub666.github.io/json/niuwa.geojson";
    const url7 = "https://wffgithub666.github.io/json/zhonghuaxun.geojson";
    const url8 = "https://wffgithub666.github.io/json/xiangyu.geojson";
    const renderer1 = {
        type: "simple",
        symbol: {
            type: "picture-marker",
            url: "https://wffgithub666.github.io/image/qiushaya.png",
            width: "40px",
            height: "40px"
        }
    };
    const renderer2 = {
        type: "simple",
        symbol: {
            type: "picture-marker",
            url: "https://wffgithub666.github.io/image/baitouhe.png",
            width: "40px",
            height: "40px"
        }
    };
    const renderer3 = {
        type: "simple",
        symbol: {
            type: "picture-marker",
            url: "https://wffgithub666.github.io/image/bigpanda.png",
            width: "40px",
            height: "40px"
        }
    };
    const renderer4 = {
        type: "simple",
        symbol: {
            type: "picture-marker",
            url: "https://wffgithub666.github.io/image/chuanshanjia.png",
            width: "40px",
            height: "30px"
        }
    };
    const renderer5 = {
        type: "simple",
        symbol: {
            type: "picture-marker",
            url: "https://wffgithub666.github.io/image/dongyafeihuang.png",
            width: "50px",
            height: "50px"
        }
    };
    const renderer6 = {
        type: "simple",
        symbol: {
            type: "picture-marker",
            url: "https://wffgithub666.github.io/image/niuwa.png",
            width: "40px",
            height: "40px"
        }
    };
    const renderer7 = {
        type: "simple",
        symbol: {
            type: "picture-marker",
            url: "https://wffgithub666.github.io/image/zhonghuaxun.png",
            width: "60px",
            height: "20px"
        }
    };
    const renderer8 = {
        type: "simple",
        symbol: {
            type: "picture-marker",
            url: "https://wffgithub666.github.io/image/xiangyu.png",
            width: "50px",
            height: "20px"
        }
    };
    const qiushaya_geojsonLayer = new GeoJSONLayer({
        url: url1,
        copyright: "USGS Earthquakes",
        popupTemplate: template,
        renderer: renderer1,
        // orderBy: {
        //   field: "mag"
        // }
    });
    const baitouhe_geojsonLayer = new GeoJSONLayer({
        url: url2,
        renderer: renderer2,
        popupTemplate: template
    });
    const bigpanda_geojsonLayer = new GeoJSONLayer({
        url: url3,
        renderer: renderer3,
        popupTemplate: template
    });
    const chuanshanjia_geojsonLayer = new GeoJSONLayer({
        url: url4,
        renderer: renderer4,
        popupTemplate: template
    });
    const dongyafeihuang_geojsonLayer = new GeoJSONLayer({
        url: url5,
        renderer: renderer5,
        popupTemplate: template
    });
    const niuwa_geojsonLayer = new GeoJSONLayer({
        url: url6,
        renderer: renderer6,
        popupTemplate: template
    });
    const zhonghuaxun_geojsonLayer = new GeoJSONLayer({
        url: url7,
        renderer: renderer7,
        popupTemplate: template
    });
    const xiangyu_geojsonLayer = new GeoJSONLayer({
        url: url8,
        renderer: renderer8,
        popupTemplate: template
    });
    //秋沙鸭图层标签
    var qiushayaToggle = document.getElementById("qiushaya_geojsonLayer");
    qiushayaToggle.addEventListener("change", function () {
        qiushaya_geojsonLayer.visible = qiushayaToggle.checked;
        console.log(qiushaya_geojsonLayer.visible);
        if (qiushayaToggle.checked == true) {
            view.map.add(qiushaya_geojsonLayer);
            alert("中华秋沙鸭（学名：Mergus squamatus）为鸭科秋沙鸭属的鸟类，俗名鳞胁秋沙鸭，是中国的特有物种。嘴形侧扁，前端尖出，与鸭科其它种类具有平扁的喙形不同。嘴和腿脚红色。雄鸭头部和上背黑色下背、腰部和尾上覆羽白色；翅上有白色翼镜；头顶的长羽后伸成双冠状。胁羽上有黑色鱼鳞状斑纹。出没于林区内的湍急河流，有时在开阔湖泊。成对或以家庭为群。潜水捕食鱼类。分布于西伯利亚以及中国大陆的福建、黑龙江、吉林、河北、长江以南等地，主要栖息于阔叶林或针阔混交林的溪流、河谷、草甸、水塘以及草地。该物种的模式产地在中国。");
        } else {
            view.map.remove(qiushaya_geojsonLayer);
        }
    });
    //白头鹤图层标签
    var baitouheToggle = document.getElementById("baitouhe_geojsonLayer");
    baitouheToggle.addEventListener("change", function () {
        baitouhe_geojsonLayer.visible = baitouheToggle.checked;
        console.log(baitouhe_geojsonLayer.visible);
        if (baitouheToggle.checked == true) {
            view.map.add(baitouhe_geojsonLayer);
            alert("白头鹤（学名：Grus monacha）是大型涉禽。颈长，喙长，腿长，胫下部裸露，蹼不发达，后趾细小，着生位较高；翼圆短；尾短，无真正的嗉囊；鸣管由气管与部分支气管构成；能在胸骨和胸肌间构成复杂的卷曲，有利于发声共鸣。性情温雅，机警胆小。它除了额和两眼前方有较密集的黑色刚毛，从头到颈是雪白的柔毛外，其余部分体羽都是石板灰色。早成鸟。栖息于河流、湖泊的岸边泥滩、沼泽和芦苇沼泽及湿草地中，主要以甲壳类、小鱼、软体动物、多足类以及直翅目、鳞翅目、蜻蜓目等昆虫和幼虫为食，也吃苔草、苗蓼、眼子菜等植物嫩叶、块根，小麦、稻谷等植物性食物和农作物。繁殖期为5-7月。营巢于生长有稀疏落叶松和灌木的沼泽地上，巢主要由枯草和苔藓所构成。每窝产卵2枚，卵的颜色为绿红色，其上被有大的暗色斑点。分布于欧亚大陆。")
        } else {
            view.map.remove(baitouhe_geojsonLayer);
        }
    });
    //大熊猫图层标签
    var bigpandaToggle = document.getElementById("bigpanda_geojsonLayer");
    bigpandaToggle.addEventListener("change", function () {
        bigpanda_geojsonLayer.visible = bigpandaToggle.checked;
        console.log(bigpanda_geojsonLayer.visible);
        if (bigpandaToggle.checked == true) {
            view.map.add(bigpanda_geojsonLayer);
            alert("大熊猫（学名：Ailuropoda melanoleuca）：属于食肉目、熊科、大熊猫亚科、大熊猫属唯一的哺乳动物。仅有二个亚种。雄性个体稍大于雌性。体型肥硕似熊、丰腴富态，头圆尾短，头躯长1.2-1.8米，尾长10-12厘米。体重80-120千克，最重可达180千克，体色为黑白两色，脸颊圆，有很大的黑眼圈，标志性的内八字的行走方式，也有解剖刀般锋利的爪子。大熊猫皮肤厚，最厚处可达10毫米。黑白相间的外表，有利于隐蔽在密林的树上和积雪的地面而不易被天敌发现。生活在海拔2600-3500米的茂密竹林里，那里常年空气稀薄，云雾缭绕，气温低于20℃。有充足的竹子，地形和水源的分布利于该物种建巢藏身和哺育幼仔。大熊猫善于爬树，也爱嬉戏。爬树的行为一般是临近求婚期，或逃避危险，或彼此相遇时弱者借以回避强者的一种方式。大熊猫每天除去一半进食的时间，剩下的一半时间多数便是在睡梦中度过。在野外，大熊猫在每两次进食的中间睡2-4个小时。大熊猫99%的食物都是竹子，可供大熊猫食用的竹类植物共有12属、60多种。野外大熊猫的寿命为18-20岁，圈养状态下可以超过30岁。大熊猫已在地球上生存了至少800万年，被誉为“活化石”和“中国国宝”即国兽，世界自然基金会的形象大使，是世界生物多样性保护的旗舰物种。截至2021年1月，中国大熊猫野生种群增至1864只。 [1] 大熊猫是中国特有种，主要栖息地是中国四川、陕西和甘肃的山区。")
        } else {
            view.map.remove(bigpanda_geojsonLayer);
        }
    });
    //穿山甲图层标签
    var chuanshanjiaToggle = document.getElementById("chuanshanjia_geojsonLayer");
    chuanshanjiaToggle.addEventListener("change", function () {
        chuanshanjia_geojsonLayer.visible = chuanshanjiaToggle.checked;
        console.log(chuanshanjia_geojsonLayer.visible);
        if (chuanshanjiaToggle.checked == true) {
            view.map.add(chuanshanjia_geojsonLayer);
            alert("中华穿山甲（学名：Manis pentadactyla）：是鳞甲目、穿山甲科的哺乳动物。头体长42-92厘米，尾长28-35厘米，体重2-7千克；鳞片与体轴平行，共15-18列。尾巴上另有纵向鳞片9-10片。鳞片棕褐色，老年兽的鳞片边缘橙褐或灰褐色，幼兽尚未角化的鳞片呈黄色。吻细长。脑颅大，呈圆锥形。具有一双小眼睛，形体狭长，全身有鳞甲，四肢粗短，尾扁平而长，背面略隆起。不同个体体重和身长差异极大。舌长，无齿。耳不发达。足具5趾，并有强爪；前足爪长，尤以中间第3爪特长，后足爪较短小。全身鳞甲如瓦状。栖息于丘陵、山麓、平原的树林潮湿地带。喜炎热，能爬树。能在泥土中挖深2-4米、直径20-30厘米的洞。末端的巢径约2米。以长舌舐食白蚁、蚁、蜜蜂或其他昆虫。分布于不丹、中国、印度、老挝、缅甸、尼泊尔、泰国和越南。2020年6月5日，为进一步加大对穿山甲的保护力度，中国将穿山甲属所有种由国家二级保护野生动物提升至一级。2020年版《中国药典》（一部）中，穿山甲未被继续收载。")
        } else {
            view.map.remove(chuanshanjia_geojsonLayer);
        }
    });
    //东亚飞蝗图层标签
    var dongyafeihuangToggle = document.getElementById("dongyafeihuang_geojsonLayer");
    dongyafeihuangToggle.addEventListener("change", function () {
        dongyafeihuang_geojsonLayer.visible = dongyafeihuangToggle.checked;
        console.log(dongyafeihuang_geojsonLayer.visible);
        if (dongyafeihuangToggle.checked == true) {
            view.map.add(dongyafeihuang_geojsonLayer);
            alert("东亚飞蝗（学名：Locusta migratoria manilensis）是飞蝗科、飞蝗属昆虫飞蝗下的一个亚种。体大型，绿色或黄褐色，匀称。头大而短，头顶宽短，顶端钝圆，侧缘隆起明显，颜面微向后倾斜，复眼长卵形，触角丝状，细长。前胸背板前缘中部略向前突出，后缘钝角形突出，中隆线较高隆起，两侧具暗色纵纹，有时不明显。前翅发达，褐色，具许多暗色斑点，超过后足胫节中部，后翅略短于前翅，无色透明。后足胫节上侧外缘具刺10-11个。 [1] 东亚飞蝗主要分布在中国东部，黄淮海平原是主要发生和危害区域。东亚飞蝗喜欢栖息在地势低洼、易涝易旱或水位不稳定的海滩、湖滩、河滩、荒地或耕作粗放的农田中，这些地方滋生大量芦苇、盐蒿、稗草、荻草、莎草等蝗虫嗜食植物。")
        } else {
            view.map.remove(dongyafeihuang_geojsonLayer);
        }
    });
    //牛蛙图层标签
    var niuwaToggle = document.getElementById("niuwa_geojsonLayer");
    niuwaToggle.addEventListener("change", function () {
        niuwa_geojsonLayer.visible = niuwaToggle.checked;
        console.log(niuwa_geojsonLayer.visible);
        if (niuwaToggle.checked == true) {
            view.map.add(niuwa_geojsonLayer);
            alert("牛蛙(Rana catesbeiana Shaw) [12]  属于两栖纲（Amphibia）、无尾目(Anura)、蛙科(Ranidae)，是一种大型食用蛙，其肉质细嫩，味道鲜美，营养丰富，具有一定的药用价值。牛蛙，俗名美国水蛙，个体硕大、生长快、产量高。原产于北美洲地区，已遍及世界各大洲，是各地食用蛙中的主要养殖种类。 [1] 牛蛙 原产于北美，因其鸣叫声宏亮酷似牛叫而得名。1959年牛蛙从古巴引入我国，九十年代左右开始在我国被大范围推广养殖。近年来，牛蛙已成为我国水产养殖重要的名特水产品之一。 [2] 但同时牛蛙也是我国外来入侵物种名单中的一员。")
        } else {
            view.map.remove(niuwa_geojsonLayer);
        }
    });
    //中华鲟图层标签
    var zhonghuaxunToggle = document.getElementById("zhonghuaxun_geojsonLayer");
    zhonghuaxunToggle.addEventListener("change", function () {
        zhonghuaxun_geojsonLayer.visible = zhonghuaxunToggle.checked;
        console.log(zhonghuaxun_geojsonLayer.visible);
        if (zhonghuaxunToggle.checked == true) {
            view.map.add(zhonghuaxun_geojsonLayer);
            alert("中华鲟（学名：Acipenser sinensis；英文名：Chinese Sturgeon）：是硬骨鱼纲、鲟科的鱼类。常见个体体长0.4-1.3米，体重50-300千克；最大个体体长5米，体重可达600千克。是中国长江中最大的鱼，故有“长江鱼王”之称。体呈纺锤形，头尖吻长，口前有4条吻须，口位在腹面，有伸缩性，并能伸成筒状，体被覆五行大而硬的骨鳞，背面一行，体侧和腹侧各两行。尾鳍为歪尾型，偶鳍具宽阔基部，背鳍与臀鳍相对。腹鳍位于背鳍前方，鳍及尾鳍的基部具棘状鳞，肠内具螺旋瓣，肛门和泄殖孔位于腹鳍基部附近，输卵管的开口与卵巢远离。中华鲟是底栖鱼类，食性非常狭窄，属肉食性鱼类，主要以一些小型的或行动迟缓的底栖动物为食，在海洋主要以鱼类为食，甲壳类次之，软体动物较少。中华鲟幼鱼主食底栖鱼类蛇鲲属和蛹属及鳞虾和蚬类等，产卵期一般停食。夏秋两季，生活在长江口外浅海域的中华鲟回游到长江，历经3000多公里的溯流博击，才回到金沙江一带产卵繁殖。产后待幼鱼长大到15厘米左右，又携带它们旅居外海。它们就这样世世代代在江河上游出生，在大海里生长。中华鲟生命周期较长，最长寿命可达40龄。是中国一级重点保护野生动物，也是活化石，有“水中大熊猫”之称。分布于中国、日本、韩国、老挝人民民主共和国和朝鲜。主要分布于中国长江干流金沙江以下至入海河口，其他水系如赣江、湘江、闽江、钱塘江和珠江水系均偶有出现。")
        } else {
            view.map.remove(zhonghuaxun_geojsonLayer);
        }
    });
    //香鱼图层标签
    var xiangyuToggle = document.getElementById("xiangyu_geojsonLayer");
    xiangyuToggle.addEventListener("change", function () {
        xiangyu_geojsonLayer.visible = xiangyuToggle.checked;
        console.log(xiangyu_geojsonLayer.visible);
        if (xiangyuToggle.checked == true) {
            view.map.add(xiangyu_geojsonLayer);
            alert("香鱼（学名：Plecoglossus altivelis）是香鱼科、香鱼属鱼类。香鱼体狭长而侧扁，成体香鱼一般体长15～20厘米，大者30多厘米。头小，吻尖，前端向下弯成钩形突起。口大，下颌两侧前端各有一突起，突起之间呈凹形，口关闭时，吻钩与此凹陷正相吻合。上下颌生有宽扁的细齿，前上颌骨、上颌骨和舌上均有齿，口底有囊形粘膜皱褶。除头部外，全身密被极细小网鳞。背鳍后方有一个小脂鳍，与臀鳍后端相对。身体背部青黑色，体侧面由上半部至下半部逐渐带黄色，腹部银白，各鳍皆为淡黄色，脂鳍周围微红色，朐鳍上方有一群黄色的斑点。 [1] 香鱼是一种溯河产卵的洞游性鱼类，每年秋季在江河中产卵，当年孵山的幼鱼入海越冬。冬天在平静的沿岸越冬。香鱼的幼鱼以浮游动物为食，可用毛钩钓取。进入淡水后，以刮食岩石上的硅藻、篮藻等植物性为主，同时也摄食昆虫类和浮游动物，故渔民常以拟饵钩捕获。分布于中国辽宁到台湾、广东、香港及广西北仑河等河流下游。朝鲜西侧到日本北海道东侧亦产。")
        } else {
            view.map.remove(xiangyu_geojsonLayer);
        }
    });

    //显示图层数量
    view.map.allLayers.on("change", function (event) {
        var num = event.target.length - 1;
        document.getElementById("layerNum").textContent = "图层数量： " + num;
    });

    //查询
    view.on("click", function (evt) {
        if (evt.button != 2) return;
        var query = qiushaya_geojsonLayer.createQuery();
        query.geometry = view.toMap(evt);
        query.distance = 200;
        query.units = "miles";
        query.spatialRelationship = "intersects"; // this is the default
        query.returnGeometry = true;
        query.outFields = ["gbifID"];

        qiushaya_geojsonLayer.queryFeatureCount(query).then(function (obj) {
            alert("ʹ该图层要素数量为" + obj);
        });

        view.graphics.removeAll();

        qiushaya_geojsonLayer.queryFeatures(query).then(function (fset) {

            fset.features.forEach(function (item) {
                //view.graphics.add(item);
                var g = new Graphic({
                    geometry: item.geometry,
                    attributes: item.attributes,
                    symbol: {
                        type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                        style: "square",
                        color: [128, 128, 128, 0.5],
                        size: 10,  // pixels
                    }
                });
                //aret
                view.graphics.add(g);

            });

        });

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

})

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