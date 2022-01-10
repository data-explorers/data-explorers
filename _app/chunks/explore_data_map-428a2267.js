import{S as re,i as se,s as ie,E as je,e as $,c as x,a as ee,d as y,O as te,f as w,F as Be,G as Ne,H as ze,I as Ae,p as m,n as g,M as He,Y as ae,ag as ve,a2 as le,v as D,w as E,x as T,Q as Pe,A as j,u as Re,j as V,k as v,l as W,m as P,o as R,L as J,t as Ze,g as Ue}from"./vendor-181e6373.js";import{L as fe,E as Ge,a as Ve}from"./index-3e2e77ec.js";import{s as We,i as ne}from"./mapUtils-e9636914.js";import{e as qe,h as ue,i as Fe,j as Qe}from"./observation_data-5a0f0216.js";import{M as Ye,a as Je,b as Ke,S as Xe,R as $e,c as xe}from"./map_toggle_marker_type_button-05cd7001.js";import{T as ce}from"./TileLayer-4665cb09.js";import{C as me}from"./CircleMarker-ae9b1e84.js";import"./formatUtils-77b182ad.js";import"./constants-3d7024b8.js";function et(s){let t,n,o;const e=s[5].default,a=je(e,s,s[4],null);return{c(){t=$("div"),n=$("div"),a&&a.c(),this.h()},l(l){t=x(l,"DIV",{style:!0});var r=ee(t);n=x(r,"DIV",{});var f=ee(n);a&&a.l(f),f.forEach(y),r.forEach(y),this.h()},h(){te(t,"display","none")},m(l,r){w(l,t,r),Be(t,n),a&&a.m(n,null),s[6](n),o=!0},p(l,[r]){a&&a.p&&(!o||r&16)&&Ne(a,e,l,l[4],o?Ae(e,l[4],r,null):ze(l[4]),null)},i(l){o||(m(a,l),o=!0)},o(l){g(a,l),o=!1},d(l){l&&y(t),a&&a.d(l),s[6](null)}}}function tt(s,t,n){let{$$slots:o={},$$scope:e}=t;const{getLayer:a}=He(fe.Layer);let{events:l=[]}=t,r,f;const _=ae();let I;ve(()=>{I.unregister()});function d(){return r}function S(b){le[b?"unshift":"push"](()=>{f=b,n(0,f)})}return s.$$set=b=>{"events"in b&&n(1,l=b.events),"$$scope"in b&&n(4,e=b.$$scope)},s.$$.update=()=>{s.$$.dirty&11&&(r||(n(3,r=fe.popup()),I=new Ge(r,_,l),a().bindPopup(r)),r.setContent(f))},[f,l,d,r,e,o,S]}class lt extends re{constructor(t){super();se(this,t,tt,et,ie,{events:1,getPopup:2})}get getPopup(){return this.$$.ctx[2]}}function _e(s,t,n){const o=s.slice();return o[38]=t[n][0],o[39]=t[n][1],o}function pe(s,t,n){const o=s.slice();return o[35]=t[n],o}function ge(s,t,n){const o=s.slice();return o[35]=t[n],o}function he(s,t,n){const o=s.slice();return o[44]=t[n],o}function ke(s){let t,n;return t=new ce({props:{zIndex:201,url:s[44].InatTaxonRangeUrl}}),{c(){D(t.$$.fragment)},l(o){E(t.$$.fragment,o)},m(o,e){T(t,o,e),n=!0},p(o,e){const a={};e[0]&4&&(a.url=o[44].InatTaxonRangeUrl),t.$set(a)},i(o){n||(m(t.$$.fragment,o),n=!0)},o(o){g(t.$$.fragment,o),n=!1},d(o){j(t,o)}}}function be(s){let t,n;return t=new ce({props:{zIndex:201,url:s[44].InatGridUrl}}),{c(){D(t.$$.fragment)},l(o){E(t.$$.fragment,o)},m(o,e){T(t,o,e),n=!0},p(o,e){const a={};e[0]&4&&(a.url=o[44].InatGridUrl),t.$set(a)},i(o){n||(m(t.$$.fragment,o),n=!0)},o(o){g(t.$$.fragment,o),n=!1},d(o){j(t,o)}}}function de(s){let t,n,o,e=s[44].showInatTaxonRange&&ke(s),a=s[44].showInatGrid&&be(s);return{c(){e&&e.c(),t=V(),a&&a.c(),n=v()},l(l){e&&e.l(l),t=W(l),a&&a.l(l),n=v()},m(l,r){e&&e.m(l,r),w(l,t,r),a&&a.m(l,r),w(l,n,r),o=!0},p(l,r){l[44].showInatTaxonRange?e?(e.p(l,r),r[0]&4&&m(e,1)):(e=ke(l),e.c(),m(e,1),e.m(t.parentNode,t)):e&&(P(),g(e,1,1,()=>{e=null}),R()),l[44].showInatGrid?a?(a.p(l,r),r[0]&4&&m(a,1)):(a=be(l),a.c(),m(a,1),a.m(n.parentNode,n)):a&&(P(),g(a,1,1,()=>{a=null}),R())},i(l){o||(m(e),m(a),o=!0)},o(l){g(e),g(a),o=!1},d(l){e&&e.d(l),l&&y(t),a&&a.d(l),l&&y(n)}}}function nt(s){let t,n,o=[...s[6]],e=[];for(let l=0;l<o.length;l+=1)e[l]=ye(_e(s,o,l));const a=l=>g(e[l],1,1,()=>{e[l]=null});return{c(){for(let l=0;l<e.length;l+=1)e[l].c();t=v()},l(l){for(let r=0;r<e.length;r+=1)e[r].l(l);t=v()},m(l,r){for(let f=0;f<e.length;f+=1)e[f].m(l,r);w(l,t,r),n=!0},p(l,r){if(r[0]&262208){o=[...l[6]];let f;for(f=0;f<o.length;f+=1){const _=_e(l,o,f);e[f]?(e[f].p(_,r),m(e[f],1)):(e[f]=ye(_),e[f].c(),m(e[f],1),e[f].m(t.parentNode,t))}for(P(),f=o.length;f<e.length;f+=1)a(f);R()}},i(l){if(!n){for(let r=0;r<o.length;r+=1)m(e[r]);n=!0}},o(l){e=e.filter(Boolean);for(let r=0;r<e.length;r+=1)g(e[r]);n=!1},d(l){J(e,l),l&&y(t)}}}function ot(s){let t,n,o=s[6],e=[];for(let l=0;l<o.length;l+=1)e[l]=Ce(ge(s,o,l));const a=l=>g(e[l],1,1,()=>{e[l]=null});return{c(){for(let l=0;l<e.length;l+=1)e[l].c();t=v()},l(l){for(let r=0;r<e.length;r+=1)e[r].l(l);t=v()},m(l,r){for(let f=0;f<e.length;f+=1)e[f].m(l,r);w(l,t,r),n=!0},p(l,r){if(r[0]&262208){o=l[6];let f;for(f=0;f<o.length;f+=1){const _=ge(l,o,f);e[f]?(e[f].p(_,r),m(e[f],1)):(e[f]=Ce(_),e[f].c(),m(e[f],1),e[f].m(t.parentNode,t))}for(P(),f=o.length;f<e.length;f+=1)a(f);R()}},i(l){if(!n){for(let r=0;r<o.length;r+=1)m(e[r]);n=!0}},o(l){e=e.filter(Boolean);for(let r=0;r<e.length;r+=1)g(e[r]);n=!1},d(l){J(e,l),l&&y(t)}}}function rt(s){let t,n;return t=new xe({props:{items:s[6]}}),{c(){D(t.$$.fragment)},l(o){E(t.$$.fragment,o)},m(o,e){T(t,o,e),n=!0},p(o,e){const a={};e[0]&64&&(a.items=o[6]),t.$set(a)},i(o){n||(m(t.$$.fragment,o),n=!0)},o(o){g(t.$$.fragment,o),n=!1},d(o){j(t,o)}}}function Me(s){let t,n;function o(...e){return s[30](s[35],...e)}return t=new me({props:{events:["click"],latLng:[s[35].latitude,s[35].longitude],radius:Le,color:s[35].color,fillColor:s[35].fillColor}}),t.$on("click",o),{c(){D(t.$$.fragment)},l(e){E(t.$$.fragment,e)},m(e,a){T(t,e,a),n=!0},p(e,a){s=e;const l={};a[0]&64&&(l.latLng=[s[35].latitude,s[35].longitude]),a[0]&64&&(l.color=s[35].color),a[0]&64&&(l.fillColor=s[35].fillColor),t.$set(l)},i(e){n||(m(t.$$.fragment,e),n=!0)},o(e){g(t.$$.fragment,e),n=!1},d(e){j(t,e)}}}function ye(s){let t,n,o=s[39],e=[];for(let l=0;l<o.length;l+=1)e[l]=Me(pe(s,o,l));const a=l=>g(e[l],1,1,()=>{e[l]=null});return{c(){for(let l=0;l<e.length;l+=1)e[l].c();t=v()},l(l){for(let r=0;r<e.length;r+=1)e[r].l(l);t=v()},m(l,r){for(let f=0;f<e.length;f+=1)e[f].m(l,r);w(l,t,r),n=!0},p(l,r){if(r[0]&262208){o=l[39];let f;for(f=0;f<o.length;f+=1){const _=pe(l,o,f);e[f]?(e[f].p(_,r),m(e[f],1)):(e[f]=Me(_),e[f].c(),m(e[f],1),e[f].m(t.parentNode,t))}for(P(),f=o.length;f<e.length;f+=1)a(f);R()}},i(l){if(!n){for(let r=0;r<o.length;r+=1)m(e[r]);n=!0}},o(l){e=e.filter(Boolean);for(let r=0;r<e.length;r+=1)g(e[r]);n=!1},d(l){J(e,l),l&&y(t)}}}function Ce(s){let t,n;function o(...e){return s[29](s[35],...e)}return t=new me({props:{events:["click"],latLng:[s[35].latitude,s[35].longitude],radius:Le,color:s[35].color,fillColor:s[35].fillColor}}),t.$on("click",o),{c(){D(t.$$.fragment)},l(e){E(t.$$.fragment,e)},m(e,a){T(t,e,a),n=!0},p(e,a){s=e;const l={};a[0]&64&&(l.latLng=[s[35].latitude,s[35].longitude]),a[0]&64&&(l.color=s[35].color),a[0]&64&&(l.fillColor=s[35].fillColor),t.$set(l)},i(e){n||(m(t.$$.fragment,e),n=!0)},o(e){g(t.$$.fragment,e),n=!1},d(e){j(t,e)}}}function we(s){let t,n;return t=new $e({props:{latLngBounds:s[9],color:"#777",fillColor:"#777",$$slots:{default:[it]},$$scope:{ctx:s}}}),{c(){D(t.$$.fragment)},l(o){E(t.$$.fragment,o)},m(o,e){T(t,o,e),n=!0},p(o,e){const a={};e[0]&512&&(a.latLngBounds=o[9]),e[1]&65536&&(a.$$scope={dirty:e,ctx:o}),t.$set(a)},i(o){n||(m(t.$$.fragment,o),n=!0)},o(o){g(t.$$.fragment,o),n=!1},d(o){j(t,o)}}}function st(s){let t;return{c(){t=Ze("Demo map layer")},l(n){t=Ue(n,"Demo map layer")},m(n,o){w(n,t,o)},d(n){n&&y(t)}}}function it(s){let t,n;return t=new lt({props:{$$slots:{default:[st]},$$scope:{ctx:s}}}),{c(){D(t.$$.fragment)},l(o){E(t.$$.fragment,o)},m(o,e){T(t,o,e),n=!0},p(o,e){const a={};e[1]&65536&&(a.$$scope={dirty:e,ctx:o}),t.$set(a)},i(o){n||(m(t.$$.fragment,o),n=!0)},o(o){g(t.$$.fragment,o),n=!1},d(o){j(t,o)}}}function at(s){let t,n,o,e,a,l,r,f,_,I,d,S,b,O;t=new Ye({props:{country:s[3]}});let k=s[2],p=[];for(let i=0;i<k.length;i+=1)p[i]=de(he(s,k,i));const Q=i=>g(p[i],1,1,()=>{p[i]=null}),Z=[rt,ot,nt],B=[];function q(i,c){return c[0]&64&&(e=null),i[10]?0:(e==null&&(e=!!Array.isArray(i[6])),e?1:2)}a=q(s,[-1,-1]),l=B[a]=Z[a](s);let h=s[1]&&we(s);_=new Je({props:{map:s[5],coordinates:s[8]}});let U={coordinates:s[8],useMarkerCluster:s[10],observationsOnMapCount:s[7],clusterLimit:ut,userSelectedMarkerType:s[11],zoomLevel:s[12],maxZoom:s[14]};return d=new Ke({props:U}),s[31](d),d.$on("changeMarkerModeOnClick",s[15]),d.$on("changeMarkerModeAutomatic",s[16]),b=new Xe({props:{position:"bottomleft",options:We}}),{c(){D(t.$$.fragment),n=V();for(let i=0;i<p.length;i+=1)p[i].c();o=V(),l.c(),r=V(),h&&h.c(),f=V(),D(_.$$.fragment),I=V(),D(d.$$.fragment),S=V(),D(b.$$.fragment)},l(i){E(t.$$.fragment,i),n=W(i);for(let c=0;c<p.length;c+=1)p[c].l(i);o=W(i),l.l(i),r=W(i),h&&h.l(i),f=W(i),E(_.$$.fragment,i),I=W(i),E(d.$$.fragment,i),S=W(i),E(b.$$.fragment,i)},m(i,c){T(t,i,c),w(i,n,c);for(let N=0;N<p.length;N+=1)p[N].m(i,c);w(i,o,c),B[a].m(i,c),w(i,r,c),h&&h.m(i,c),w(i,f,c),T(_,i,c),w(i,I,c),T(d,i,c),w(i,S,c),T(b,i,c),O=!0},p(i,c){const N={};if(c[0]&8&&(N.country=i[3]),t.$set(N),c[0]&4){k=i[2];let M;for(M=0;M<k.length;M+=1){const Y=he(i,k,M);p[M]?(p[M].p(Y,c),m(p[M],1)):(p[M]=de(Y),p[M].c(),m(p[M],1),p[M].m(o.parentNode,o))}for(P(),M=k.length;M<p.length;M+=1)Q(M);R()}let H=a;a=q(i,c),a===H?B[a].p(i,c):(P(),g(B[H],1,1,()=>{B[H]=null}),R(),l=B[a],l?l.p(i,c):(l=B[a]=Z[a](i),l.c()),m(l,1),l.m(r.parentNode,r)),i[1]?h?(h.p(i,c),c[0]&2&&m(h,1)):(h=we(i),h.c(),m(h,1),h.m(f.parentNode,f)):h&&(P(),g(h,1,1,()=>{h=null}),R());const G={};c[0]&32&&(G.map=i[5]),c[0]&256&&(G.coordinates=i[8]),_.$set(G);const z={};c[0]&256&&(z.coordinates=i[8]),c[0]&1024&&(z.useMarkerCluster=i[10]),c[0]&128&&(z.observationsOnMapCount=i[7]),c[0]&2048&&(z.userSelectedMarkerType=i[11]),c[0]&4096&&(z.zoomLevel=i[12]),c[0]&16384&&(z.maxZoom=i[14]),d.$set(z)},i(i){if(!O){m(t.$$.fragment,i);for(let c=0;c<k.length;c+=1)m(p[c]);m(l),m(h),m(_.$$.fragment,i),m(d.$$.fragment,i),m(b.$$.fragment,i),O=!0}},o(i){g(t.$$.fragment,i),p=p.filter(Boolean);for(let c=0;c<p.length;c+=1)g(p[c]);g(l),g(h),g(_.$$.fragment,i),g(d.$$.fragment,i),g(b.$$.fragment,i),O=!1},d(i){j(t,i),i&&y(n),J(p,i),i&&y(o),B[a].d(i),i&&y(r),h&&h.d(i),i&&y(f),j(_,i),i&&y(I),s[31](null),j(d,i),i&&y(S),j(b,i)}}}function ft(s){let t,n,o,e,a,l={options:s[0],$$slots:{default:[at]},$$scope:{ctx:s}};return n=new Ve({props:l}),s[32](n),{c(){t=$("div"),D(n.$$.fragment),this.h()},l(r){t=x(r,"DIV",{style:!0});var f=ee(t);E(n.$$.fragment,f),f.forEach(y),this.h()},h(){te(t,"width","100%"),te(t,"height","70vh")},m(r,f){w(r,t,f),T(n,t,null),o=!0,e||(a=Pe(window,"resize",s[17]),e=!0)},p(r,f){const _={};f[0]&1&&(_.options=r[0]),f[0]&32750|f[1]&65536&&(_.$$scope={dirty:f,ctx:r}),n.$set(_)},i(r){o||(m(n.$$.fragment,r),o=!0)},o(r){g(n.$$.fragment,r),o=!1},d(r){r&&y(t),s[32](null),j(n),e=!1,a()}}}let Le=7,ut=1e3;function ct(s){let t=s.getBounds(),n=t.getEast(),o=t.getWest(),e=t.getNorth(),a=t.getSouth();var l=t.getEast()-t.getWest(),r=t.getNorth()-t.getSouth();return[[e-r*.3,n-l*.3],[a+r*.3,o+l*.3]]}function mt(s,t,n){let{mapOptions:o}=t,{groupedObservations:e}=t,{timeSpanHistory:a}=t,{showDemoMapLayer:l}=t,{taxaHistory:r}=t,{country:f}=t,{mapCenter:_}=t,{speciesCount:I}=t,{speciesDisplayCount:d}=t,{speciesList:S}=t,{showSpeciesListIcon:b}=t,O,k,p=[],Q=[[0,0],[0,0]],Z=!1,B="markers",q,h,U=[],i=[],c=0,N=0,H=!1,G=0;const z=ae();function M(u){n(10,Z=u.detail.useMarkerCluster),n(11,B=u.detail.userSelectedMarkerType),n(6,i=K(i))}function Y(u){n(10,Z=u.detail.useMarkerCluster),n(6,i=K(i))}function K(u){let C;if(Array.isArray(u))C=u.filter(A=>ne(A,k,L));else if(Z){let A=[];u.forEach((F,oe)=>{F=F.filter(Te=>ne(Te,k,L)),A=A.concat(F)}),C=A}else C=new Map,u.forEach((A,F)=>{A=A.filter(oe=>ne(oe,k,L)),C.set(F,A)});return C}function Se(){k&&k.invalidateSize()}function X(u,C){z("markerClick",{observation_id:C.id,latlng:u.detail.latlng})}Re(()=>{n(5,k=O.getMap()),n(9,Q=ct(k)),n(14,G=k.getMaxZoom()),k.on("zoomend",function(){n(12,q=k.getZoom()),n(28,H=!0)}),k.on("moveend",function(){n(28,H=!0)}),k.on("baselayerchange",function(u){n(14,G=k.getMaxZoom())})});const Oe=(u,C)=>X(C,u),Ie=(u,C)=>X(C,u);function De(u){le[u?"unshift":"push"](()=>{h=u,n(13,h)})}function Ee(u){le[u?"unshift":"push"](()=>{O=u,n(4,O)})}return s.$$set=u=>{"mapOptions"in u&&n(0,o=u.mapOptions),"groupedObservations"in u&&n(24,e=u.groupedObservations),"timeSpanHistory"in u&&n(25,a=u.timeSpanHistory),"showDemoMapLayer"in u&&n(1,l=u.showDemoMapLayer),"taxaHistory"in u&&n(2,r=u.taxaHistory),"country"in u&&n(3,f=u.country),"mapCenter"in u&&n(19,_=u.mapCenter),"speciesCount"in u&&n(20,I=u.speciesCount),"speciesDisplayCount"in u&&n(21,d=u.speciesDisplayCount),"speciesList"in u&&n(22,S=u.speciesList),"showSpeciesListIcon"in u&&n(23,b=u.showSpeciesListIcon)},s.$$.update=()=>{if(s.$$.dirty[0]&535822544&&O&&(n(26,U=qe(e,a)),n(27,N=ue(U)),n(6,i=K(U)),n(7,c=ue(i)),n(20,I=Fe(U)),n(22,S=Qe(i)),n(21,d=S.length),n(23,b=S.length>0),z("updateStats",{observationsSelectedCount:N,observationsOnMapCount:c,speciesCount:I,speciesDisplayCount:d,speciesList:S,showSpeciesListIcon:b,observationsOnMap:i}),n(28,H=!1)),s.$$.dirty[0]&16777236&&O)if(r.length>0)if(Array.isArray(e))n(8,p=e.map(u=>[u.latitude,u.longitude]));else{let u=[];n(8,p=e.forEach((C,A)=>{u=u.concat(C)})),n(8,p=u.map(C=>[C.latitude,C.longitude]))}else n(8,p=[]);if(s.$$.dirty[0]&524304&&O&&_&&_.longitude){let u=O.getMap();u.flyTo([_.latitude,_.longitude],u.getMaxZoom()-1),n(19,_={})}},[o,l,r,f,O,k,i,c,p,Q,Z,B,q,h,G,M,Y,Se,X,_,I,d,S,b,e,a,U,N,H,Oe,Ie,De,Ee]}class Ct extends re{constructor(t){super();se(this,t,mt,ft,ie,{mapOptions:0,groupedObservations:24,timeSpanHistory:25,showDemoMapLayer:1,taxaHistory:2,country:3,mapCenter:19,speciesCount:20,speciesDisplayCount:21,speciesList:22,showSpeciesListIcon:23},null,[-1,-1])}}export{Ct as default};