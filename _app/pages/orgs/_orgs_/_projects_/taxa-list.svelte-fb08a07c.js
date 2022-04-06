import{_ as x}from"../../../../chunks/preload-helper-ec9aa979.js";import{S as z,i as N,s as S,e as k,t as E,j as w,c as T,a as L,d as g,g as I,l as A,b as D,f as O,F as h,h as M,v as C,w as F,x as B,p as G,n as J,A as K,L as Q}from"../../../../chunks/vendor-358d5d08.js";import{s as W}from"../../../../chunks/settings-8f2b275b.js";import{p as R,f as q}from"../../../../chunks/formatUtils-b852786f.js";import{b as H}from"../../../../chunks/paths-28a87002.js";import{P as X}from"../../../../chunks/project_header-d5a0d11f.js";function Y(r){switch(r){case"../../../../lib/data/cedar-creek-reserve/taxa.csv":return x(()=>import("../../../../chunks/taxa-f4c5fea7.js"),[]);case"../../../../lib/data/ciencia-ciudadana-peru-bats/taxa.csv":return x(()=>import("../../../../chunks/taxa-9108f66a.js"),[]);case"../../../../lib/data/ciencia-ciudadana-peru-bees/taxa.csv":return x(()=>import("../../../../chunks/taxa-104f431f.js"),[]);case"../../../../lib/data/clarkstown-high-school-north/taxa.csv":return x(()=>import("../../../../chunks/taxa-029efbae.js"),[]);case"../../../../lib/data/go-sea/taxa.csv":return x(()=>import("../../../../chunks/taxa-7a9c7f1b.js"),[]);case"../../../../lib/data/los-angeles-bioblitz/taxa.csv":return x(()=>import("../../../../chunks/taxa-99749418.js"),[]);default:return new Promise(function(e,a){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(a.bind(null,new Error("Unknown variable dynamic import: "+r)))})}}function U(r,e,a){const o=r.slice();return o[3]=e[a],o}function y(r){let e,a,o=q(r[3],!0)+"",s,l,i=R("observation",r[3].taxa_count)+"",b,v,d=r[3].rank+"",j,p;return{c(){e=k("li"),a=k("a"),l=E(", "),b=E(i),v=E(", "),j=E(d),p=w(),this.h()},l(c){e=T(c,"LI",{});var n=L(e);a=T(n,"A",{href:!0});var u=L(a);u.forEach(g),l=I(n,", "),b=I(n,i),v=I(n,", "),j=I(n,d),p=A(n),n.forEach(g),this.h()},h(){D(a,"href",s=""+(H+"/orgs/"+r[2].username+"/"+r[0].slug+"/taxa/"+r[3].taxon_id))},m(c,n){O(c,e,n),h(e,a),a.innerHTML=o,h(e,l),h(e,b),h(e,v),h(e,j),h(e,p)},p(c,n){n&2&&o!==(o=q(c[3],!0)+"")&&(a.innerHTML=o),n&7&&s!==(s=""+(H+"/orgs/"+c[2].username+"/"+c[0].slug+"/taxa/"+c[3].taxon_id))&&D(a,"href",s),n&2&&i!==(i=R("observation",c[3].taxa_count)+"")&&M(b,i),n&2&&d!==(d=c[3].rank+"")&&M(j,d)},d(c){c&&g(e)}}}function Z(r){let e,a,o,s,l,i,b,v=R("taxon",r[1].length)+"",d,j,p,c;e=new X({props:{org:r[2],project:r[0],activeTab:$}});let n=r[1],u=[];for(let t=0;t<n.length;t+=1)u[t]=y(U(r,n,t));return{c(){C(e.$$.fragment),a=w(),o=k("main"),s=k("div"),l=k("h1"),i=E("Taxa List"),b=w(),d=E(v),j=w(),p=k("ul");for(let t=0;t<u.length;t+=1)u[t].c();this.h()},l(t){F(e.$$.fragment,t),a=A(t),o=T(t,"MAIN",{class:!0});var m=L(o);s=T(m,"DIV",{class:!0});var f=L(s);l=T(f,"H1",{});var _=L(l);i=I(_,"Taxa List"),_.forEach(g),b=A(f),d=I(f,v),j=A(f),p=T(f,"UL",{});var P=L(p);for(let V=0;V<u.length;V+=1)u[V].l(P);P.forEach(g),f.forEach(g),m.forEach(g),this.h()},h(){D(s,"class","prose"),D(o,"class","container mx-auto")},m(t,m){B(e,t,m),O(t,a,m),O(t,o,m),h(o,s),h(s,l),h(l,i),h(s,b),h(s,d),h(s,j),h(s,p);for(let f=0;f<u.length;f+=1)u[f].m(p,null);c=!0},p(t,[m]){const f={};if(m&4&&(f.org=t[2]),m&1&&(f.project=t[0]),e.$set(f),(!c||m&2)&&v!==(v=R("taxon",t[1].length)+"")&&M(d,v),m&7){n=t[1];let _;for(_=0;_<n.length;_+=1){const P=U(t,n,_);u[_]?u[_].p(P,m):(u[_]=y(P),u[_].c(),u[_].m(p,null))}for(;_<u.length;_+=1)u[_].d(1);u.length=n.length}},i(t){c||(G(e.$$.fragment,t),c=!0)},o(t){J(e.$$.fragment,t),c=!1},d(t){K(e,t),t&&g(a),t&&g(o),Q(u,t)}}}async function le({params:r}){let e=W.filter(l=>l.username===r.orgs)[0],a=e.projects.filter(l=>l.slug===r.projects)[0],s=(await Y(`../../../../lib/data/${a.slug}/taxa.csv`)).default;return s=s.sort((l,i)=>i.taxa_count-l.taxa_count),{props:{project:a,taxa:s,org:e}}}let $="taxa";function ee(r,e,a){let{project:o}=e,{taxa:s}=e,{org:l}=e;return r.$$set=i=>{"project"in i&&a(0,o=i.project),"taxa"in i&&a(1,s=i.taxa),"org"in i&&a(2,l=i.org)},[o,s,l]}class ie extends z{constructor(e){super();N(this,e,ee,Z,S,{project:0,taxa:1,org:2})}}export{ie as default,le as load};