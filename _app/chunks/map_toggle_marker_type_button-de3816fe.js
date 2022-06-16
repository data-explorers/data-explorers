var N=Object.defineProperty,z=Object.defineProperties;var G=Object.getOwnPropertyDescriptors;var w=Object.getOwnPropertySymbols;var Z=Object.prototype.hasOwnProperty,F=Object.prototype.propertyIsEnumerable;var D=(r,t,e)=>t in r?N(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,O=(r,t)=>{for(var e in t||(t={}))Z.call(t,e)&&D(r,e,t[e]);if(w)for(var e of w(t))F.call(t,e)&&D(r,e,t[e]);return r},j=(r,t)=>z(r,G(t));import{S as d,i as k,s as h,ag as b,ah as C,v as _,w as p,x as B,p as S,n as x,A as T,a0 as E,W as I}from"./vendor-358d5d08.js";import{a as m}from"./index-f3ef0f46.js";import{f as P,g as U}from"./mapUtils-e9636914.js";function J(r,t,e){const{getMap:a}=b(m);let{icon:n}=t,{callback:s}=t,{states:i}=t,{title:u}=t,o;C(()=>{o.remove()});function g(){return o}return r.$$set=l=>{"icon"in l&&e(0,n=l.icon),"callback"in l&&e(1,s=l.callback),"states"in l&&e(2,i=l.states),"title"in l&&e(3,u=l.title)},r.$$.update=()=>{r.$$.dirty&47&&(o||(n&&s?e(5,o=m.easyButton(n,s,u).addTo(a())):e(5,o=m.easyButton(i).addTo(a()))))},[n,s,i,u,g,o]}class A extends d{constructor(t){super();k(this,t,J,null,h,{icon:0,callback:1,states:2,title:3,getButton:4})}get getButton(){return this.$$.ctx[4]}}function q(r,t,e){if(r.properties){let a="";e.popup_fields?(a+=`<table class="popup-table not-prose">
`,e.popup_fields.forEach(n=>{a+=`<tr>
`,a+="<th>"+n.name+"</th>",a+="<td>"+r.properties[n.original_name]+"</td>",a+=`</tr>
`}),a+="</table>"):a=JSON.stringify(r.properties),t.bindPopup(a)}}function W(r,t,e){const{getMap:a}=b(m);let{baseLayersData:n={}}=t,{overlayLayersData:s=[]}=t,i={},u={};Object.entries(n).forEach(([l,f],M)=>{let y=m.tileLayer(f.url,f.options);e(3,i[l]=y,i),M===0&&y.addTo(a())}),s.forEach(l=>{let f,M=j(O({},l.options),{onEachFeature:(y,L)=>q(y,L,l),style(y){return{color:y.properties.color,opacity:l.opacity||1,fillOpacity:l.fillOpacity||.2}}});l.type==="geojson"&&(f=m.geoJSON(l.data,M),e(4,u[l.name]=f,u))});let o;C(()=>{o.remove()});function g(){return o}return r.$$set=l=>{"baseLayersData"in l&&e(0,n=l.baseLayersData),"overlayLayersData"in l&&e(1,s=l.overlayLayersData)},r.$$.update=()=>{r.$$.dirty&56&&(o||e(5,o=m.control.layers(i,u).addTo(a())))},[n,s,g,i,u,o]}class H extends d{constructor(t){super();k(this,t,W,null,h,{baseLayersData:0,overlayLayersData:1,getLayerControl:2})}get getLayerControl(){return this.$$.ctx[2]}}function K(r,t,e){const{getMap:a}=b(m);let{items:n}=t,s;C(()=>{s.remove()});function i(){return s}return r.$$set=u=>{"items"in u&&e(0,n=u.items)},r.$$.update=()=>{r.$$.dirty&5&&(s&&(s.remove(),e(2,s=null)),s||e(2,s=m.markerClusterGroup({singleMarkerMode:!0}).addTo(a())),n.length>0&&n.forEach(u=>{s.addLayer(m.marker([u.latitude,u.longitude]))}))},[n,i,s]}class at extends d{constructor(t){super();k(this,t,K,null,h,{items:0,getLayerControl:1})}get getLayerControl(){return this.$$.ctx[1]}}function Q(r,t,e){const{getMap:a}=b(m);let{position:n="topright"}=t,{options:s={}}=t,i;C(()=>{i.remove()});function u(){return i}return r.$$set=o=>{"position"in o&&e(0,n=o.position),"options"in o&&e(1,s=o.options)},r.$$.update=()=>{r.$$.dirty&11&&(i||e(3,i=m.control.scale(s).addTo(a())),i.setPosition(n))},[n,s,u,i]}class st extends d{constructor(t){super();k(this,t,Q,null,h,{position:0,options:1,getScaleControl:2})}get getScaleControl(){return this.$$.ctx[2]}}function R(r){let t,e,a={icon:'<span class="text-3xl leading-6">&sdotb;</span>',callback:r[3],title:"click to fit all observations on map"};return t=new A({props:a}),r[4](t),{c(){_(t.$$.fragment)},l(n){p(t.$$.fragment,n)},m(n,s){B(t,n,s),e=!0},p(n,[s]){const i={};s&3&&(i.callback=n[3]),t.$set(i)},i(n){e||(S(t.$$.fragment,n),e=!0)},o(n){x(t.$$.fragment,n),e=!1},d(n){r[4](null),T(t,n)}}}function V(r,t,e){let{coordinates:a}=t,{map:n}=t,s;const i=()=>P(a,n);function u(o){E[o?"unshift":"push"](()=>{s=o,e(2,s)})}return r.$$set=o=>{"coordinates"in o&&e(0,a=o.coordinates),"map"in o&&e(1,n=o.map)},r.$$.update=()=>{r.$$.dirty&5&&s&&(a.length===0?s.getButton().disable():s.getButton().enable())},[a,n,s,i,u]}class ot extends d{constructor(t){super();k(this,t,V,R,h,{coordinates:0,map:1})}}function X(r){let t,e;return t=new H({props:{baseLayersData:r[1],overlayLayersData:r[0]}}),{c(){_(t.$$.fragment)},l(a){p(t.$$.fragment,a)},m(a,n){B(t,a,n),e=!0},p(a,[n]){const s={};n&2&&(s.baseLayersData=a[1]),n&1&&(s.overlayLayersData=a[0]),t.$set(s)},i(a){e||(S(t.$$.fragment,a),e=!0)},o(a){x(t.$$.fragment,a),e=!1},d(a){T(t,a)}}}function Y(r,t,e){let{country:a}=t,{project:n}=t,s=U(),i=[];n&&n.map_layers&&(i=n.map_layers);let u={Street:s.OpenStreetMap,Minimal:s.GBIFGeyser,Terrain:s.StamenTerrain};return a==="USA"&&(u.Satellite=s.USGSImagery),u.None={url:"",options:{}},r.$$set=o=>{"country"in o&&e(2,a=o.country),"project"in o&&e(3,n=o.project)},[i,u,a,n]}class it extends d{constructor(t){super();k(this,t,Y,X,h,{country:2,project:3})}}function v(r){let t,e,a={states:r[1]};return t=new A({props:a}),r[10](t),{c(){_(t.$$.fragment)},l(n){p(t.$$.fragment,n)},m(n,s){B(t,n,s),e=!0},p(n,[s]){const i={};t.$set(i)},i(n){e||(S(t.$$.fragment,n),e=!0)},o(n){x(t.$$.fragment,n),e=!1},d(n){r[10](null),T(t,n)}}}function $(r,t,e){let{useMarkerCluster:a}=t,{observationsOnMapCount:n}=t,{clusterLimit:s}=t,{userSelectedMarkerType:i}=t,{coordinates:u}=t,{zoomLevel:o}=t,{maxZoom:g}=t;const l=I();let f,M={states:[{stateName:"show-markers",icon:'<span class="text-4xl font-black leading-5">&Colon;</span>',title:"click to show clustered markers",onClick(c){l("changeMarkerModeOnClick",{useMarkerCluster:!0,userSelectedMarkerType:"clusters"}),c.state("show-clusters")}},{stateName:"show-clusters",icon:'<span class="text-6xl leading-6">&middot;</span>',title:"click to show individual markers",onClick(c){l("changeMarkerModeOnClick",{useMarkerCluster:!1,userSelectedMarkerType:"markers"}),c.state("show-markers")}}]};function y(){return f.getButton()}function L(c){E[c?"unshift":"push"](()=>{f=c,e(0,f)})}return r.$$set=c=>{"useMarkerCluster"in c&&e(2,a=c.useMarkerCluster),"observationsOnMapCount"in c&&e(3,n=c.observationsOnMapCount),"clusterLimit"in c&&e(4,s=c.clusterLimit),"userSelectedMarkerType"in c&&e(5,i=c.userSelectedMarkerType),"coordinates"in c&&e(6,u=c.coordinates),"zoomLevel"in c&&e(7,o=c.zoomLevel),"maxZoom"in c&&e(8,g=c.maxZoom)},r.$$.update=()=>{r.$$.dirty&421&&o&&g&&(a&&o+1>=g?(f.getButton().state("show-markers"),l("changeMarkerModeAutomatic",{useMarkerCluster:!1})):!a&&i==="clusters"&&o===g-2&&(f.getButton().state("show-clusters"),l("changeMarkerModeAutomatic",{useMarkerCluster:!0}))),r.$$.dirty&61&&n>0&&(!a&&n>=s?(f.getButton().state("show-clusters"),l("changeMarkerModeAutomatic",{useMarkerCluster:!0})):a&&i==="markers"&&n<s&&(f.getButton().state("show-markers"),l("changeMarkerModeAutomatic",{useMarkerCluster:!1}))),r.$$.dirty&89&&f&&(u.length===0||n>s?f.getButton().disable():f.getButton().enable())},[f,M,a,n,s,i,u,o,g,y,L]}class lt extends d{constructor(t){super();k(this,t,$,v,h,{useMarkerCluster:2,observationsOnMapCount:3,clusterLimit:4,userSelectedMarkerType:5,coordinates:6,zoomLevel:7,maxZoom:8,getButton:9})}get getButton(){return this.$$.ctx[9]}}export{it as M,st as S,ot as a,lt as b,at as c};