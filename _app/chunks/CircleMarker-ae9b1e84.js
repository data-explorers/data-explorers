import{S as j,i as q,s as B,G as I,H as F,I as G,p as u,n as E,e as H,c as T,a as V,d as J,f as Y,m as z,o as K,M as N,q as P,Y as Q,ag as U,E as W}from"./vendor-181e6373.js";import{L as R,E as X}from"./index-3e2e77ec.js";function b(a){let t;const n=a[18].default,e=W(n,a,a[17],null);return{c(){e&&e.c()},l(i){e&&e.l(i)},m(i,f){e&&e.m(i,f),t=!0},p(i,f){e&&e.p&&(!t||f&131072)&&I(e,n,i,i[17],t?G(n,i[17],f,null):F(i[17]),null)},i(i){t||(u(e,i),t=!0)},o(i){E(e,i),t=!1},d(i){e&&e.d(i)}}}function Z(a){let t,n,e=a[0]&&b(a);return{c(){t=H("div"),e&&e.c()},l(i){t=T(i,"DIV",{});var f=V(t);e&&e.l(f),f.forEach(J)},m(i,f){Y(i,t,f),e&&e.m(t,null),n=!0},p(i,[f]){i[0]?e?(e.p(i,f),f&1&&u(e,1)):(e=b(i),e.c(),u(e,1),e.m(t,null)):e&&(z(),E(e,1,1,()=>{e=null}),K())},i(i){n||(u(e),n=!0)},o(i){E(e),n=!1},d(i){i&&J(t),e&&e.d()}}}function v(a,t,n){let{$$slots:e={},$$scope:i}=t;const{getMap:f}=N(R);let{latLng:r}=t,{radius:s=10}=t,{color:o="#3388ff"}=t,{weight:d=3}=t,{opacity:g=1}=t,{lineCap:_="round"}=t,{lineJoin:h="round"}=t,{dashArray:m=null}=t,{dashOffset:y=null}=t,{fill:C=!0}=t,{fillColor:k="#3388ff"}=t,{fillOpacity:L=.2}=t,{fillRule:M="evenodd"}=t,{options:O={}}=t,{events:w=[]}=t,c;P(R.Layer,{getLayer:()=>c});const D=Q();let A;U(()=>{A.unregister(),c.removeFrom(f())});function S(){return c}return a.$$set=l=>{"latLng"in l&&n(1,r=l.latLng),"radius"in l&&n(2,s=l.radius),"color"in l&&n(3,o=l.color),"weight"in l&&n(4,d=l.weight),"opacity"in l&&n(5,g=l.opacity),"lineCap"in l&&n(6,_=l.lineCap),"lineJoin"in l&&n(7,h=l.lineJoin),"dashArray"in l&&n(8,m=l.dashArray),"dashOffset"in l&&n(9,y=l.dashOffset),"fill"in l&&n(10,C=l.fill),"fillColor"in l&&n(11,k=l.fillColor),"fillOpacity"in l&&n(12,L=l.fillOpacity),"fillRule"in l&&n(13,M=l.fillRule),"options"in l&&n(14,O=l.options),"events"in l&&n(15,w=l.events),"$$scope"in l&&n(17,i=l.$$scope)},a.$$.update=()=>{a.$$.dirty&65535&&(c||(n(0,c=R.circleMarker(r,O).addTo(f())),A=new X(c,D,w)),c.setLatLng(r),c.setRadius(s),c.setStyle({color:o,weight:d,opacity:g,lineCap:_,lineJoin:h,dashArray:m,dashOffset:y,fill:C,fillColor:k,fillOpacity:L,fillRule:M}))},[c,r,s,o,d,g,_,h,m,y,C,k,L,M,O,w,S,i,e]}class $ extends j{constructor(t){super();q(this,t,v,Z,B,{latLng:1,radius:2,color:3,weight:4,opacity:5,lineCap:6,lineJoin:7,dashArray:8,dashOffset:9,fill:10,fillColor:11,fillOpacity:12,fillRule:13,options:14,events:15,getCircleMarker:16})}get getCircleMarker(){return this.$$.ctx[16]}}export{$ as C};