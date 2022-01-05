var ce=Object.defineProperty,_e=Object.defineProperties;var me=Object.getOwnPropertyDescriptors;var K=Object.getOwnPropertySymbols;var he=Object.prototype.hasOwnProperty,be=Object.prototype.propertyIsEnumerable;var W=(a,e,i)=>e in a?ce(a,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):a[e]=i,C=(a,e)=>{for(var i in e||(e={}))he.call(e,i)&&W(a,i,e[i]);if(K)for(var i of K(e))be.call(e,i)&&W(a,i,e[i]);return a},R=(a,e)=>_e(a,me(e));import{S as X,i as V,s as x,e as h,c as b,a as v,d as f,b as S,f as p,I as z,t as N,g as M,E as u,h as F,k as B,n as P,P as $,l as j,M as U,a4 as ve}from"./vendor-83798d90.js";import{f as Y}from"./formatUtils-77b182ad.js";import"./mapUtils-8c5a7127.js";import{s as Z}from"./constants-3d7024b8.js";function je(a){return a.map(e=>R(C({},e),{id:Number(e.id),latitude:Number(e.latitude),longitude:Number(e.longitude),taxon_id:Number(e.taxon_id),coordinates_obscured:e.coordinates_obscured==="True"}))}function Ie(a){return a.map(e=>R(C({},e),{id:Number(e.id),observations_count:Number(e.observations_count),parent_id:Number(e.parent_id),taxa_count:Number(e.taxa_count),taxon_id:Number(e.taxon_id)}))}function ee(a,e){let i=new Map;return a.forEach(n=>{i.get(n[e])?i.get(n[e]).push(n):i.set(n[e],[n])}),i}function qe(a,e){return(a%e+e)%e}function pe(a,e){return e?Array.from({length:e-a+1},(i,n)=>a+n):Array.from({length:a+1},(i,n)=>n)}function Ce(a,e){function i(t){var l=parseInt(t,16);return l=parseInt(l*(100+e)/100),l=l<255?l:255,l.toString(16).length==1?"0"+l.toString(16):l.toString(16)}a=a.replace("#","");var n=i(a.substring(0,2)),r=i(a.substring(2,4)),s=i(a.substring(4,6));return n+r+s}function we(a){let e;return{c(){e=h("div"),this.h()},l(i){e=b(i,"DIV",{class:!0}),v(e).forEach(f),this.h()},h(){S(e,"class","loader svelte-6yw1ai")},m(i,n){p(i,e,n)},p:z,i:z,o:z,d(i){i&&f(e)}}}class Re extends X{constructor(e){super();V(this,e,null,we,x,{})}}const ze=(a,e)=>new Promise((i,n)=>{e=e.toLowerCase();let r=[],s=[];a.forEach(t=>{t.common_name&&new RegExp("\\b"+e).test(t.common_name.toLowerCase())&&!s.includes(t.taxon_id)&&(r.push({taxon_id:Number(t.taxon_id),common_name:t.common_name,scientific_name:t.scientific_name,taxa_count:t.taxa_count,image_url:t.image_url,rank:t.rank}),s.push(t.taxon_id))}),a.forEach(t=>{t.scientific_name&&new RegExp("\\b"+e).test(t.scientific_name.toLowerCase())&&!s.includes(t.taxon_id)&&(r.push({taxon_id:Number(t.taxon_id),common_name:t.common_name,scientific_name:t.scientific_name,taxa_count:t.taxa_count,image_url:t.image_url}),s.push(t.taxon_id))}),r.sort((t,l)=>l.observations_count-t.observations_count||l.taxa_count-t.taxa_count),r=r.map(t=>R(C({},t),{label:Y(t)})),i(r)}),Fe=(a,e,i)=>a.filter(r=>r.taxon_ids).filter(r=>r.taxon_ids.split("|").includes(""+e)).map(r=>{let s=r.time_observed_at&&new Date(r.time_observed_at),t=r.time_observed_at?s.getMonth():"unknown",l=r.time_observed_at?s.getFullYear():"unknown";return R(C({},r),{month:t,year:l,color:i,fillColor:i})});function ge(a,e){return new Date(e.time_observed_at)-new Date(a.time_observed_at)}function De(a,e){return new Date(a.time_observed_at)-new Date(e.time_observed_at)}function ke(a,e){return new Date(e.time_observed_at).getMonth()-new Date(a.time_observed_at).getMonth()||new Date(e.time_observed_at)-new Date(a.time_observed_at)}function Ee(a,e){return new Date(a.time_observed_at).getMonth()-new Date(e.time_observed_at).getMonth()||new Date(a.time_observed_at)-new Date(e.time_observed_at)}function Be(a,e,i){let n,r=[],s=[];return a.forEach(t=>{t.time_observed_at?r.push(t):s.push(t)}),e==="oldest"?i==="month"?n=r.sort(Ee):n=r.sort(De):i==="month"?n=r.sort(ke):n=r.sort(ge),s.length>0&&(n=n.concat(s)),n}function Pe(a,e){let i=new Map,n=[],r=[];if(a.forEach(s=>{s.time_observed_at?n.push(s):r.push(s)}),e==="month")i=ee(n.map(s=>R(C({},s),{month:new Date(s.time_observed_at).getMonth()})),"month");else if(e==="year")i=ee(n.map(s=>R(C({},s),{year:new Date(s.time_observed_at).getFullYear()})),"year");else return a;return r.length>0&&i.set("unknown",r),i}function Ye(a,e,i,n,r,s){if(i.length===0)return{};let t={},l=[];function o(_,L){return{count:1,color:_.color,taxon_name:_.taxon_name,opacity:_.active&&n[L]?1:r}}return i.forEach(_=>{e.filter(L=>_.observations.includes(L.id)).forEach(L=>{let m=Number(_.taxon_id),A=L[a]=="unknown"?"unknown":Number(L[a]);t[A]?t[A][m]?t[A][m].count+=1:t[A][m]=o(_,A):t[A]={[m]:o(_,A)}})}),ye(a,t,l,i,s),t}function ye(a,e,i,n,r){if(a==="month"){let t=Object.keys(e).map(o=>Number(o));i=r.observed_months.filter(o=>!t.includes(o))}else if(a==="year"){let t=Object.keys(e).map(o=>Number(o));i=pe(r.observed_years[0],r.observed_years[1]).filter(o=>!t.includes(o))}let s=n[0];i.forEach(t=>{e[t]={},e[t][s.taxon_id]={count:0,opacity:0,taxon_name:s.taxon_name}})}function Ze(a,e="id"){if(Array.isArray(a))return new Set(a.map(i=>i[e])).size;{let i=new Set;return a.forEach((n,r)=>{n.forEach(s=>i.add(s[e]))}),i.size}}function Ge(a){if(Array.isArray(a))return new Set(a.filter(e=>Z.includes(e.rank)).map(e=>e.taxon_id)).size;{let e=new Set;return a.forEach((i,n)=>{i.filter(r=>Z.includes(r.rank)).forEach(r=>e.add(r.taxon_id))}),e.size}}function Qe(a){if(Array.isArray(a)){let e={};return a.filter(i=>Z.includes(i.rank)).forEach(i=>{e[i.taxon_id]={taxon_id:i.taxon_id,name:Y(i,!0)}}),Object.values(e)}else{let e={};return a.forEach((i,n)=>{i.filter(r=>Z.includes(r.rank)).forEach(r=>{e[r.taxon_id]={taxon_id:r.taxon_id,name:Y(r,!0)}})}),Object.values(e)}}function Ue(a,e){let i;return Object.keys(e).length===0?i=[...a]:(i=new Map,a.forEach((n,r)=>{e[r]&&i.set(r,n)})),i}function He(a,e){return a.filter(i=>Z.includes(i.rank)).filter(i=>i.observations_count>0).filter(i=>i.taxon_ids.split("|").includes(""+e.taxon_id))}function te(a){let e,i,n,r=a[0].user_login+"",s;return{c(){e=h("dt"),i=N("Observer"),n=h("dd"),s=N(r),this.h()},l(t){e=b(t,"DT",{class:!0});var l=v(e);i=M(l,"Observer"),l.forEach(f),n=b(t,"DD",{});var o=v(n);s=M(o,r),o.forEach(f),this.h()},h(){S(e,"class","svelte-1dwpy3w")},m(t,l){p(t,e,l),u(e,i),p(t,n,l),u(n,s)},p(t,l){l&1&&r!==(r=t[0].user_login+"")&&F(s,r)},d(t){t&&f(e),t&&f(n)}}}function ie(a){let e,i,n,r=new Date(a[0].time_observed_at).toLocaleDateString()+"",s;return{c(){e=h("dt"),i=N("Date"),n=h("dd"),s=N(r),this.h()},l(t){e=b(t,"DT",{class:!0});var l=v(e);i=M(l,"Date"),l.forEach(f),n=b(t,"DD",{});var o=v(n);s=M(o,r),o.forEach(f),this.h()},h(){S(e,"class","svelte-1dwpy3w")},m(t,l){p(t,e,l),u(e,i),p(t,n,l),u(n,s)},p(t,l){l&1&&r!==(r=new Date(t[0].time_observed_at).toLocaleDateString()+"")&&F(s,r)},d(t){t&&f(e),t&&f(n)}}}function ae(a){let e,i,n,r=a[0].quality_grade+"",s;return{c(){e=h("dt"),i=N("Quality grade"),n=h("dd"),s=N(r),this.h()},l(t){e=b(t,"DT",{class:!0});var l=v(e);i=M(l,"Quality grade"),l.forEach(f),n=b(t,"DD",{});var o=v(n);s=M(o,r),o.forEach(f),this.h()},h(){S(e,"class","svelte-1dwpy3w")},m(t,l){p(t,e,l),u(e,i),p(t,n,l),u(n,s)},p(t,l){l&1&&r!==(r=t[0].quality_grade+"")&&F(s,r)},d(t){t&&f(e),t&&f(n)}}}function ne(a){let e,i,n,r=a[0].license+"",s;return{c(){e=h("dt"),i=N("License"),n=h("dd"),s=N(r),this.h()},l(t){e=b(t,"DT",{class:!0});var l=v(e);i=M(l,"License"),l.forEach(f),n=b(t,"DD",{});var o=v(n);s=M(o,r),o.forEach(f),this.h()},h(){S(e,"class","svelte-1dwpy3w")},m(t,l){p(t,e,l),u(e,i),p(t,n,l),u(n,s)},p(t,l){l&1&&r!==(r=t[0].license+"")&&F(s,r)},d(t){t&&f(e),t&&f(n)}}}function se(a){let e,i,n,r=a[0].description+"",s;return{c(){e=h("dt"),i=N("Description"),n=h("dd"),s=N(r),this.h()},l(t){e=b(t,"DT",{class:!0});var l=v(e);i=M(l,"Description"),l.forEach(f),n=b(t,"DD",{});var o=v(n);s=M(o,r),o.forEach(f),this.h()},h(){S(e,"class","svelte-1dwpy3w")},m(t,l){p(t,e,l),u(e,i),p(t,n,l),u(n,s)},p(t,l){l&1&&r!==(r=t[0].description+"")&&F(s,r)},d(t){t&&f(e),t&&f(n)}}}function re(a){let e,i,n,r,s=a[0].geoprivacy==="obscured"&&le(),t=a[0].taxon_geoprivacy==="obscured"&&oe();return{c(){e=h("dt"),i=N("Coordinates are obscured"),n=h("dd"),s&&s.c(),r=B(),t&&t.c(),this.h()},l(l){e=b(l,"DT",{class:!0});var o=v(e);i=M(o,"Coordinates are obscured"),o.forEach(f),n=b(l,"DD",{});var _=v(n);s&&s.l(_),r=P(_),t&&t.l(_),_.forEach(f),this.h()},h(){S(e,"class","svelte-1dwpy3w")},m(l,o){p(l,e,o),u(e,i),p(l,n,o),s&&s.m(n,null),u(n,r),t&&t.m(n,null)},p(l,o){l[0].geoprivacy==="obscured"?s||(s=le(),s.c(),s.m(n,r)):s&&(s.d(1),s=null),l[0].taxon_geoprivacy==="obscured"?t||(t=oe(),t.c(),t.m(n,null)):t&&(t.d(1),t=null)},d(l){l&&f(e),l&&f(n),s&&s.d(),t&&t.d()}}}function le(a){let e;return{c(){e=N("Observer has choosen to obscure the coordinates.")},l(i){e=M(i,"Observer has choosen to obscure the coordinates.")},m(i,n){p(i,e,n)},d(i){i&&f(e)}}}function oe(a){let e;return{c(){e=N("Taxon is threatened or rare so the coordinates are obscured.")},l(i){e=M(i,"Taxon is threatened or rare so the coordinates are obscured.")},m(i,n){p(i,e,n)},d(i){i&&f(e)}}}function fe(a){let e,i,n,r;return{c(){e=h("span"),i=N("Show on map"),this.h()},l(s){e=b(s,"SPAN",{class:!0});var t=v(e);i=M(t,"Show on map"),t.forEach(f),this.h()},h(){S(e,"class","link-color mr-4 svelte-1dwpy3w")},m(s,t){p(s,e,t),u(e,i),n||(r=$(e,"click",a[6]),n=!0)},p:z,d(s){s&&f(e),n=!1,r()}}}function de(a){let e,i,n,r,s;return{c(){e=h("a"),i=N("Species page"),this.h()},l(t){e=b(t,"A",{class:!0,href:!0});var l=v(e);i=M(l,"Species page"),l.forEach(f),this.h()},h(){S(e,"class","mr-4"),S(e,"href",n=""+(a[1]+"/taxa/"+a[0].taxon_id))},m(t,l){p(t,e,l),u(e,i),r||(s=$(e,"click",a[7]),r=!0)},p(t,l){l&3&&n!==(n=""+(t[1]+"/taxa/"+t[0].taxon_id))&&S(e,"href",n)},d(t){t&&f(e),r=!1,s()}}}function Oe(a){let e,i,n=Y(a[0],!0)+"",r,s,t,l,o,_,L,m,A,G,I,H,Q,w=a[0].user_login&&te(a),g=a[0].time_observed_at&&ie(a),D=a[0].quality_grade&&ae(a),k=a[0].license&&ne(a),E=a[0].description&&se(a),y=a[0].coordinates_obscured&&re(a),O=a[3]&&fe(a),T=a[0].taxon_id!==a[4].taxon_id&&de(a);return{c(){e=h("div"),i=h("h3"),r=B(),s=h("dl"),w&&w.c(),t=j(),g&&g.c(),l=j(),D&&D.c(),o=j(),k&&k.c(),_=j(),E&&E.c(),L=j(),y&&y.c(),m=B(),O&&O.c(),A=B(),T&&T.c(),G=B(),I=h("a"),H=N("iNaturalist observation"),this.h()},l(d){e=b(d,"DIV",{});var c=v(e);i=b(c,"H3",{class:!0});var ue=v(i);ue.forEach(f),r=P(c),s=b(c,"DL",{class:!0});var q=v(s);w&&w.l(q),t=j(),g&&g.l(q),l=j(),D&&D.l(q),o=j(),k&&k.l(q),_=j(),E&&E.l(q),L=j(),y&&y.l(q),q.forEach(f),m=P(c),O&&O.l(c),A=P(c),T&&T.l(c),G=P(c),I=b(c,"A",{href:!0});var J=v(I);H=M(J,"iNaturalist observation"),J.forEach(f),c.forEach(f),this.h()},h(){S(i,"class","svelte-1dwpy3w"),S(s,"class","svelte-1dwpy3w"),S(I,"href",Q="https://www.inaturalist.org/observations/"+a[0].id),U(e,"prose",a[2]===!1),U(e,"p-4",!a[2])},m(d,c){p(d,e,c),u(e,i),i.innerHTML=n,u(e,r),u(e,s),w&&w.m(s,null),u(s,t),g&&g.m(s,null),u(s,l),D&&D.m(s,null),u(s,o),k&&k.m(s,null),u(s,_),E&&E.m(s,null),u(s,L),y&&y.m(s,null),u(e,m),O&&O.m(e,null),u(e,A),T&&T.m(e,null),u(e,G),u(e,I),u(I,H)},p(d,[c]){c&1&&n!==(n=Y(d[0],!0)+"")&&(i.innerHTML=n),d[0].user_login?w?w.p(d,c):(w=te(d),w.c(),w.m(s,t)):w&&(w.d(1),w=null),d[0].time_observed_at?g?g.p(d,c):(g=ie(d),g.c(),g.m(s,l)):g&&(g.d(1),g=null),d[0].quality_grade?D?D.p(d,c):(D=ae(d),D.c(),D.m(s,o)):D&&(D.d(1),D=null),d[0].license?k?k.p(d,c):(k=ne(d),k.c(),k.m(s,_)):k&&(k.d(1),k=null),d[0].description?E?E.p(d,c):(E=se(d),E.c(),E.m(s,L)):E&&(E.d(1),E=null),d[0].coordinates_obscured?y?y.p(d,c):(y=re(d),y.c(),y.m(s,null)):y&&(y.d(1),y=null),d[3]?O?O.p(d,c):(O=fe(d),O.c(),O.m(e,A)):O&&(O.d(1),O=null),d[0].taxon_id!==d[4].taxon_id?T?T.p(d,c):(T=de(d),T.c(),T.m(e,G)):T&&(T.d(1),T=null),c&1&&Q!==(Q="https://www.inaturalist.org/observations/"+d[0].id)&&S(I,"href",Q),c&4&&U(e,"prose",d[2]===!1),c&4&&U(e,"p-4",!d[2])},i:z,o:z,d(d){d&&f(e),w&&w.d(),g&&g.d(),D&&D.d(),k&&k.d(),E&&E.d(),y&&y.d(),O&&O.d(),T&&T.d()}}}function Te(a,e,i){let{observation:n={}}=e,{projectPath:r}=e,{compactLayout:s=!1}=e,{enableZoomToObservation:t=!0}=e,{taxon:l={}}=e;const o=ve();function _(){o("zoomToObservation",{observation_id:n.id,latitude:n.latitude,longitude:n.longitude})}const L=()=>o("changeTaxon",{taxon_id:n.taxon_id});return a.$$set=m=>{"observation"in m&&i(0,n=m.observation),"projectPath"in m&&i(1,r=m.projectPath),"compactLayout"in m&&i(2,s=m.compactLayout),"enableZoomToObservation"in m&&i(3,t=m.enableZoomToObservation),"taxon"in m&&i(4,l=m.taxon)},[n,r,s,t,l,o,_,L]}class Je extends X{constructor(e){super();V(this,e,Te,Oe,x,{observation:0,projectPath:1,compactLayout:2,enableZoomToObservation:3,taxon:4})}}export{Re as L,Je as O,je as a,Ye as b,ze as c,Fe as d,Pe as e,Ie as f,He as g,Ue as h,Ze as i,Ge as j,Qe as k,Ce as l,qe as m,pe as r,Be as s};