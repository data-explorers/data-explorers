import{S as M,i as _,s as b,M as S,ag as w,G as N,H as P,I as H,p as C,n as L,e as V,c as Y,a as K,d as I,f as Q,m as W,o as X,q as v,Y as z,E as p,v as A,w as E,x as R,A as j,a2 as J}from"./vendor-181e6373.js";import{L as m,E as $}from"./index-3e2e77ec.js";import{f as ee,g as te}from"./mapUtils-e9636914.js";function ne(l,e,a){const{getMap:n}=S(m);let{icon:t}=e,{callback:r}=e,{states:s}=e,{title:f}=e,i;w(()=>{i.remove()});function d(){return i}return l.$$set=u=>{"icon"in u&&a(0,t=u.icon),"callback"in u&&a(1,r=u.callback),"states"in u&&a(2,s=u.states),"title"in u&&a(3,f=u.title)},l.$$.update=()=>{l.$$.dirty&47&&(i||(t&&r?a(5,i=m.easyButton(t,r,f).addTo(n())):a(5,i=m.easyButton(s).addTo(n()))))},[t,r,s,f,d,i]}class Z extends M{constructor(e){super();_(this,e,ne,null,b,{icon:0,callback:1,states:2,title:3,getButton:4})}get getButton(){return this.$$.ctx[4]}}function ae(l,e,a){const{getMap:n}=S(m);let{baseLayersData:t={}}=e,{overlayLayersData:r={}}=e,s={},f={};Object.entries(t).forEach(([u,g],h)=>{let k=m.tileLayer(g.url,g.options);a(3,s[u]=k,s),h===0&&k.addTo(n())}),Object.entries(r).forEach(([u,g],h)=>{a(0,r[u]=m.tileLayer(g.url,g.options),r)});let i;w(()=>{i.remove()});function d(){return i}return l.$$set=u=>{"baseLayersData"in u&&a(1,t=u.baseLayersData),"overlayLayersData"in u&&a(0,r=u.overlayLayersData)},l.$$.update=()=>{l.$$.dirty&24&&(i||a(4,i=m.control.layers(s,f).addTo(n())))},[r,t,d,s,i]}class re extends M{constructor(e){super();_(this,e,ae,null,b,{baseLayersData:1,overlayLayersData:0,getLayerControl:2})}get getLayerControl(){return this.$$.ctx[2]}}function le(l,e,a){const{getMap:n}=S(m);let{items:t}=e,r;w(()=>{r.remove()});function s(){return r}return l.$$set=f=>{"items"in f&&a(0,t=f.items)},l.$$.update=()=>{l.$$.dirty&5&&(r&&(r.remove(),a(2,r=null)),r||a(2,r=m.markerClusterGroup({singleMarkerMode:!0}).addTo(n())),t.length>0&&t.forEach(f=>{r.addLayer(m.marker([f.latitude,f.longitude]))}))},[t,s,r]}class Me extends M{constructor(e){super();_(this,e,le,null,b,{items:0,getLayerControl:1})}get getLayerControl(){return this.$$.ctx[1]}}function U(l){let e;const a=l[17].default,n=p(a,l,l[16],null);return{c(){n&&n.c()},l(t){n&&n.l(t)},m(t,r){n&&n.m(t,r),e=!0},p(t,r){n&&n.p&&(!e||r&65536)&&N(n,a,t,t[16],e?H(a,t[16],r,null):P(t[16]),null)},i(t){e||(C(n,t),e=!0)},o(t){L(n,t),e=!1},d(t){n&&n.d(t)}}}function se(l){let e,a,n=l[0]&&U(l);return{c(){e=V("div"),n&&n.c()},l(t){e=Y(t,"DIV",{});var r=K(e);n&&n.l(r),r.forEach(I)},m(t,r){Q(t,e,r),n&&n.m(e,null),a=!0},p(t,[r]){t[0]?n?(n.p(t,r),r&1&&C(n,1)):(n=U(t),n.c(),C(n,1),n.m(e,null)):n&&(W(),L(n,1,1,()=>{n=null}),X())},i(t){a||(C(n),a=!0)},o(t){L(n),a=!1},d(t){t&&I(e),n&&n.d()}}}function ie(l,e,a){let{$$slots:n={},$$scope:t}=e;const{getMap:r}=S(m);let{latLngBounds:s}=e,{color:f="#3388ff"}=e,{weight:i=3}=e,{opacity:d=1}=e,{lineCap:u="round"}=e,{lineJoin:g="round"}=e,{dashArray:h=null}=e,{dashOffset:k=null}=e,{fill:B=!0}=e,{fillColor:c="#3388ff"}=e,{fillOpacity:x=.2}=e,{fillRule:O="evenodd"}=e,{options:T={}}=e,{events:D=[]}=e,y;v(m.Layer,{getLayer:()=>y});const q=z();let G;w(()=>{G.unregister(),y.removeFrom(r())});function F(){return y}return l.$$set=o=>{"latLngBounds"in o&&a(1,s=o.latLngBounds),"color"in o&&a(2,f=o.color),"weight"in o&&a(3,i=o.weight),"opacity"in o&&a(4,d=o.opacity),"lineCap"in o&&a(5,u=o.lineCap),"lineJoin"in o&&a(6,g=o.lineJoin),"dashArray"in o&&a(7,h=o.dashArray),"dashOffset"in o&&a(8,k=o.dashOffset),"fill"in o&&a(9,B=o.fill),"fillColor"in o&&a(10,c=o.fillColor),"fillOpacity"in o&&a(11,x=o.fillOpacity),"fillRule"in o&&a(12,O=o.fillRule),"options"in o&&a(13,T=o.options),"events"in o&&a(14,D=o.events),"$$scope"in o&&a(16,t=o.$$scope)},l.$$.update=()=>{l.$$.dirty&32767&&(y||(a(0,y=m.rectangle(s,T).addTo(r())),G=new $(y,q,D)),y.setBounds(s),y.setStyle({color:f,weight:i,opacity:d,lineCap:u,lineJoin:g,dashArray:h,dashOffset:k,fill:B,fillColor:c,fillOpacity:x,fillRule:O}))},[y,s,f,i,d,u,g,h,k,B,c,x,O,T,D,F,t,n]}class _e extends M{constructor(e){super();_(this,e,ie,se,b,{latLngBounds:1,color:2,weight:3,opacity:4,lineCap:5,lineJoin:6,dashArray:7,dashOffset:8,fill:9,fillColor:10,fillOpacity:11,fillRule:12,options:13,events:14,getRectangle:15})}get getRectangle(){return this.$$.ctx[15]}}function oe(l,e,a){const{getMap:n}=S(m);let{position:t="topright"}=e,{options:r={}}=e,s;w(()=>{s.remove()});function f(){return s}return l.$$set=i=>{"position"in i&&a(0,t=i.position),"options"in i&&a(1,r=i.options)},l.$$.update=()=>{l.$$.dirty&11&&(s||a(3,s=m.control.scale(r).addTo(n())),s.setPosition(t))},[t,r,f,s]}class be extends M{constructor(e){super();_(this,e,oe,null,b,{position:0,options:1,getScaleControl:2})}get getScaleControl(){return this.$$.ctx[2]}}function ue(l){let e,a,n={icon:'<span class="text-3xl leading-6">&sdotb;</span>',callback:l[3],title:"click to fit all observations on map"};return e=new Z({props:n}),l[4](e),{c(){A(e.$$.fragment)},l(t){E(e.$$.fragment,t)},m(t,r){R(e,t,r),a=!0},p(t,[r]){const s={};r&3&&(s.callback=t[3]),e.$set(s)},i(t){a||(C(e.$$.fragment,t),a=!0)},o(t){L(e.$$.fragment,t),a=!1},d(t){l[4](null),j(e,t)}}}function ce(l,e,a){let{coordinates:n}=e,{map:t}=e,r;const s=()=>ee(n,t);function f(i){J[i?"unshift":"push"](()=>{r=i,a(2,r)})}return l.$$set=i=>{"coordinates"in i&&a(0,n=i.coordinates),"map"in i&&a(1,t=i.map)},l.$$.update=()=>{l.$$.dirty&5&&r&&(n.length===0?r.getButton().disable():r.getButton().enable())},[n,t,r,s,f]}class Ce extends M{constructor(e){super();_(this,e,ce,ue,b,{coordinates:0,map:1})}}function fe(l){let e,a;return e=new re({props:{baseLayersData:l[0]}}),{c(){A(e.$$.fragment)},l(n){E(e.$$.fragment,n)},m(n,t){R(e,n,t),a=!0},p(n,[t]){const r={};t&1&&(r.baseLayersData=n[0]),e.$set(r)},i(n){a||(C(e.$$.fragment,n),a=!0)},o(n){L(e.$$.fragment,n),a=!1},d(n){j(e,n)}}}function ge(l,e,a){let{country:n}=e,t=te(),r={Street:t.OpenStreetMap,Minimal:t.GBIFGeyser,Terrain:t.StamenTerrain};return n==="USA"&&(r.Satellite=t.USGSImagery),l.$$set=s=>{"country"in s&&a(1,n=s.country)},[r,n]}class Le extends M{constructor(e){super();_(this,e,ge,fe,b,{country:1})}}function me(l){let e,a,n={states:l[1]};return e=new Z({props:n}),l[10](e),{c(){A(e.$$.fragment)},l(t){E(e.$$.fragment,t)},m(t,r){R(e,t,r),a=!0},p(t,[r]){const s={};e.$set(s)},i(t){a||(C(e.$$.fragment,t),a=!0)},o(t){L(e.$$.fragment,t),a=!1},d(t){l[10](null),j(e,t)}}}function de(l,e,a){let{useMarkerCluster:n}=e,{observationsOnMapCount:t}=e,{clusterLimit:r}=e,{userSelectedMarkerType:s}=e,{coordinates:f}=e,{zoomLevel:i}=e,{maxZoom:d}=e;const u=z();let g,h={states:[{stateName:"show-markers",icon:'<span class="text-4xl font-black leading-5">&Colon;</span>',title:"click to show clustered markers",onClick(c){u("changeMarkerModeOnClick",{useMarkerCluster:!0,userSelectedMarkerType:"clusters"}),c.state("show-clusters")}},{stateName:"show-clusters",icon:'<span class="text-6xl leading-6">&middot;</span>',title:"click to show individual markers",onClick(c){u("changeMarkerModeOnClick",{useMarkerCluster:!1,userSelectedMarkerType:"markers"}),c.state("show-markers")}}]};function k(){return g.getButton()}function B(c){J[c?"unshift":"push"](()=>{g=c,a(0,g)})}return l.$$set=c=>{"useMarkerCluster"in c&&a(2,n=c.useMarkerCluster),"observationsOnMapCount"in c&&a(3,t=c.observationsOnMapCount),"clusterLimit"in c&&a(4,r=c.clusterLimit),"userSelectedMarkerType"in c&&a(5,s=c.userSelectedMarkerType),"coordinates"in c&&a(6,f=c.coordinates),"zoomLevel"in c&&a(7,i=c.zoomLevel),"maxZoom"in c&&a(8,d=c.maxZoom)},l.$$.update=()=>{l.$$.dirty&421&&i&&d&&(n&&i+1>=d?(g.getButton().state("show-markers"),u("changeMarkerModeAutomatic",{useMarkerCluster:!1})):!n&&s==="clusters"&&i===d-2&&(g.getButton().state("show-clusters"),u("changeMarkerModeAutomatic",{useMarkerCluster:!0}))),l.$$.dirty&61&&t>0&&(!n&&t>=r?(g.getButton().state("show-clusters"),u("changeMarkerModeAutomatic",{useMarkerCluster:!0})):n&&s==="markers"&&t<r&&(g.getButton().state("show-markers"),u("changeMarkerModeAutomatic",{useMarkerCluster:!1}))),l.$$.dirty&89&&g&&(f.length===0||t>r?g.getButton().disable():g.getButton().enable())},[g,h,n,t,r,s,f,i,d,k,B]}class Be extends M{constructor(e){super();_(this,e,de,me,b,{useMarkerCluster:2,observationsOnMapCount:3,clusterLimit:4,userSelectedMarkerType:5,coordinates:6,zoomLevel:7,maxZoom:8,getButton:9})}get getButton(){return this.$$.ctx[9]}}export{Le as M,_e as R,be as S,Ce as a,Be as b,Me as c};