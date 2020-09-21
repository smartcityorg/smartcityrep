<!-- <template>
    <div class="hello">
        <div id="container" style="width:100%; height:500px"></div>
        <div class="info">
            <p id='info'></p>
            <p id='adcode'></p>
        </div>
    </div>
</template>

<script>
    import AMapLoader from '@amap/amap-jsapi-loader';
    import resize from './mixins/resize'


    export default {
        mixins: [resize],
        name: 'HelloWorld',
        props: {className: {
                type: String,
                default: 'chart'
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '300px'
            }},
        data() {
            return {
                map: null,
                /*heatmap:null,
                hmdata:heatmapData,*/
            }
        },
        mounted() {
            AMapLoader.load({
                "key": "723b4f6b34971da9fd6df65f0816e860",   // 申请好的Web端开发者Key，首次调用 load 时必填
                "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                "plugins": ["AMap.Geolocation"]  //插件列表
            }).then((AMap) => {
                // this.map = new AMap.Map('container');
                this.map = new AMap.Map("container", {
                    resizeEnable: true,
                    zoom: 13
                });
                var options = {
                    'showButton': true,//是否显示定位按钮
                    'buttonPosition': 'LB',//定位按钮的位置
                    /* LT LB RT RB */
                    'buttonOffset': new AMap.Pixel(10, 20),//定位按钮距离对应角落的距离
                    'showMarker': true,//是否显示定位点
                    'markerOptions': {//自定义定位点样式，同Marker的Options
                        'offset': new AMap.Pixel(-18, -36),
                        'content': '<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
                    },
                    'showCircle': true,//是否显示定位精度圈
                    'circleOptions': {//定位精度圈的样式
                        'strokeColor': '#0093FF',
                        'noSelect': true,
                        'strokeOpacity': 0.5,
                        'strokeWeight': 1,
                        'fillColor': '#02B0FF',
                        'fillOpacity': 0.25
                    }
                };
                document.getElementById('adcode').innerHTML = `当前城市adcode：${this.map.getAdcode()}<br>当前中心点：${this.map.getCenter()}`;
                this.map.plugin(["AMap.Geolocation"], function () {
                    var geolocation = new AMap.Geolocation(options);
                    this.map.addControl(geolocation);
                    geolocation.getCurrentPosition()
                });
                var citysearch = new AMap.CitySearch();
                //自动获取用户IP，返回当前城市
                citysearch.getLocalCity(function (status, result) {
                    console.log(status);
                    console.log(result);
                    if (status === 'complete' && result.info === 'OK') {
                        if (result && result.city && result.bounds) {
                            var cityinfo = result.city;
                            var citybounds = result.bounds;

                            document.getElementById('info').innerHTML = '您当前所在城市：' + cityinfo;
                            //地图显示当前城市
                            this.map.setBounds(citybounds);
                        }
                    } else {
                        document.getElementById('info').innerHTML = result.info;
                    }
                })


            }).catch(e => {
                console.log(e);
            });
            this.drawLine();
        },
        methods: {
            drawLine() {
            },
            //判断浏览区是否支持canvas
            isSupportCanvas() {
                let elem = document.createElement('canvas');
                return !!(elem.getContext && elem.getContext('2d'));
            }
        }
    }
</script>

 Add "scoped" attribute to limit CSS to this component only
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
 -->


<template>
  <div class="app-container">
    <el-autocomplete
      v-model="mapLocation.address"
      :fetch-suggestions="querySearch"
      placeholder="请输入详细地址"
      style="width: 100%"
      :trigger-on-focus="false"
      @select="handleSelect"
    />
    <div style="margin: 5px">
      <baidu-map class="bm-view" :center="mapCenter" :zoom="mapZoom" :scroll-wheel-zoom="true" ak="baidu-ak" @ready="handlerBMap" >
       </baidu-map>
    </div>
    <div id="aa"></div>
  </div>

</template>

<script>
  import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
  import resize from './mixins/resize'
  import { getDeviceLocationInfo } from "@/api/sanitation/deviceinfo";

  export default {
    mixins: [resize],
    name: 'HelloWorld',
    components: {
      BaiduMap
    },
    props: {className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      }},
    data() {
      return {
        mapZoom: 15,
        mapCenter: { lng: 0, lat: 0 },
        mapLocation: {
          address: undefined,
          coordinate: undefined
        },
        address1: undefined,
        lng: undefined,
        lat: undefined,
        imei:undefined,
        status:undefined,
        gpsTimeDes:undefined
      }
    },
    created() {
      // this.getDeviceLocationInfo();
    },
    methods: {
      handlerBMap({ BMap, map }) {
        this.BMap = BMap
        this.map = map

        getDeviceLocationInfo().then(response => {

           this.address1 = response.data.address;
           this.lng = response.data.lng;
           this.lat = response.data.lat;
           this.imei=response.data.deviceStatusInfo.imei;
           this.status=response.data.deviceStatusInfo.status;
           this.gpsTimeDes=response.data.deviceStatusInfo.gpsTimeDes;
           // alert(this.address1 +"     "+this.lng+"       "+this.lat +"      "+this.imei+"    "+this.status+"   "+response.data.deviceStatusInfo.gpsTimeDes);
          //alert(this.deviceOptions);
          //return response.data;

          //创建Map实例
          // var map = new BMap.Map("XSDFXPage");
           // 初始化地图,设置中心点坐标
           var point = new BMap.Point(this.lng,this.lat);// 创建点坐标
           map.centerAndZoom(point,15);
           //添加鼠标滚动缩放
           map.enableScrollWheelZoom();

           //添加缩略图控件
           map.addControl(new BMap.OverviewMapControl({isOpen:false,anchor:BMAP_ANCHOR_BOTTOM_RIGHT}));
           //添加缩放平移控件
           map.addControl(new BMap.NavigationControl());
           //添加比例尺控件
           map.addControl(new BMap.ScaleControl());
           //添加地图类型控件
           //map.addControl(new BMap.MapTypeControl());

           //设置标注的图标
           // var icon = new BMap.Icon("../../../../static/img/map.png",new BMap.Size(100,100));
           var icon = new BMap.Icon(require("../../assets/image/map.png"),new BMap.Size(40,40));
           //设置标注的经纬度
           var marker = new BMap.Marker(new BMap.Point(this.lng,this.lat),{icon:icon});
           //把标注添加到地图上
           map.addOverlay(marker);
           var content = "<table>";
           content = content + "<tr><td> 设备号："+this.imei+"</td></tr>";
           content = content + "<tr><td> 设备状态："+this.status+"</td></tr>";
           content = content + "<tr><td> 地点："+this.address1+"</td></tr>";
           content = content + "<tr><td> 时间："+this.gpsTimeDes+"</td></tr>";
           content += "</table>";
                      var infowindow = new BMap.InfoWindow(content);
                      marker.addEventListener("click",function(){
                          this.openInfoWindow(infowindow);
                      });

                      //点击地图，获取经纬度坐标
                     map.addEventListener("click",function(e){
                          document.getElementById("aa").innerHTML = "经度坐标："+e.point.lng+" &nbsp;纬度坐标："+e.point.lat;
                      });





        });


/*
        if (this.mapLocation.coordinate && this.mapLocation.coordinate.lng) {
          this.mapCenter.lng = this.mapLocation.coordinate.lng
          this.mapCenter.lat = this.mapLocation.coordinate.lat
          this.mapZoom = 15
          map.addOverlay(new this.BMap.Marker(this.mapLocation.coordinate))
        } else {
          // this.mapCenter.lng = 113.271429
          // this.mapCenter.lat = 23.135336
          // this.mapCenter.lng = 113.132855
          // this.mapCenter.lat = 29.37029
          this.mapCenter.lng = 113.08959877066005
          this.mapCenter.lat = 29.360573213226417
          this.mapZoom = 10
        }

*/







      },
      querySearch(queryString, cb) {
        var that = this
        var myGeo = new this.BMap.Geocoder()
        myGeo.getPoint(queryString, function(point) {
          if (point) {
            that.mapLocation.coordinate = point
            that.makerCenter(point)
          } else {
            that.mapLocation.coordinate = null
          }
        }, this.locationCity)
        var options = {
          onSearchComplete: function(results) {
            if (local.getStatus() === 0) {
              // 判断状态是否正确
              var s = []
              for (var i = 0; i < results.getCurrentNumPois(); i++) {
                var x = results.getPoi(i)
                var item = { value: x.address + x.title, point: x.point }
                s.push(item)
                cb(s)
              }
            } else {
              cb()
            }
          }
        }
        var local = new this.BMap.LocalSearch(this.map, options)
        local.search(queryString)
      },
      handleSelect(item) {
        var { point } = item
        // point.lng=113.113721
        // point.lat=29.367749
        // point.lng=113.101533
        // point.lat=29.364682
        this.mapLocation.coordinate = point
        this.makerCenter(point)

      //   alert(point.lng);
      //    alert(point.lat);
      },
      makerCenter(point) {
        if (this.map) {
          this.map.clearOverlays()
          this.map.addOverlay(new this.BMap.Marker(point))
          this.mapCenter.lng = point.lng
          this.mapCenter.lat = point.lat
          this.mapZoom = 15
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .bm-view {
    width: 100%;
    height: 500px;
  }
</style>
