import{S as U,i as z,s as B,e as h,j as x,t as A,c as d,a as u,d as i,l as y,g as q,K as O,b as m,f as J,F as l,J as F,L as Q}from"../chunks/vendor-181e6373.js";import{s as D}from"../chunks/settings-ef690396.js";import{b as G}from"../chunks/paths-28a87002.js";function K(o,t,a){const n=o.slice();return n[0]=t[a],n}function L(o){let t,a,n,f,j,_,v,r,s,c,e,g=o[0].card_title+"",k,p,I,H=o[0].card_summary+"",P,N,V;return{c(){t=h("div"),a=h("a"),n=h("figure"),f=h("img"),r=x(),s=h("div"),c=h("a"),e=h("h2"),k=A(g),p=x(),I=h("p"),P=A(H),V=x(),this.h()},l($){t=d($,"DIV",{class:!0});var E=u(t);a=d(E,"A",{href:!0});var M=u(a);n=d(M,"FIGURE",{});var R=u(n);f=d(R,"IMG",{src:!0,alt:!0}),R.forEach(i),M.forEach(i),r=y(E),s=d(E,"DIV",{class:!0});var S=u(s);c=d(S,"A",{href:!0});var b=u(c);e=d(b,"H2",{});var w=u(e);k=q(w,g),w.forEach(i),p=y(b),I=d(b,"P",{});var C=u(I);P=q(C,H),C.forEach(i),b.forEach(i),S.forEach(i),V=y(E),E.forEach(i),this.h()},h(){O(f.src,j=""+(G+"/images/"+o[0].username+"/user.jpg"))||m(f,"src",j),m(f,"alt",_="Photo for "+o[0].card_title),m(a,"href",v=o[0].card_link),m(c,"href",N=o[0].card_link),m(s,"class","image-card-body"),m(t,"class","image-card")},m($,E){J($,t,E),l(t,a),l(a,n),l(n,f),l(t,r),l(t,s),l(s,c),l(c,e),l(e,k),l(c,p),l(c,I),l(I,P),l(t,V)},p:F,d($){$&&i(t)}}}function T(o){let t,a,n,f,j,_,v=D,r=[];for(let s=0;s<v.length;s+=1)r[s]=L(K(o,v,s));return{c(){t=h("main"),a=h("div"),n=h("h1"),f=A("Projects"),j=x(),_=h("div");for(let s=0;s<r.length;s+=1)r[s].c();this.h()},l(s){t=d(s,"MAIN",{class:!0});var c=u(t);a=d(c,"DIV",{class:!0});var e=u(a);n=d(e,"H1",{});var g=u(n);f=q(g,"Projects"),g.forEach(i),j=y(e),_=d(e,"DIV",{class:!0});var k=u(_);for(let p=0;p<r.length;p+=1)r[p].l(k);k.forEach(i),e.forEach(i),c.forEach(i),this.h()},h(){m(_,"class","grid lg:grid-cols-3 md:grid-cols-2 justify-center gap-3"),m(a,"class","prose max-w-none"),m(t,"class","container mx-auto")},m(s,c){J(s,t,c),l(t,a),l(a,n),l(n,f),l(a,j),l(a,_);for(let e=0;e<r.length;e+=1)r[e].m(_,null)},p(s,[c]){if(c&0){v=D;let e;for(e=0;e<v.length;e+=1){const g=K(s,v,e);r[e]?r[e].p(g,c):(r[e]=L(g),r[e].c(),r[e].m(_,null))}for(;e<r.length;e+=1)r[e].d(1);r.length=v.length}},i:F,o:F,d(s){s&&i(t),Q(r,s)}}}function W(o){for(let t=0;t<D.length;t++){const a=D[t];a.projects.length===1?a.card_link=`${G}/users/${a.username}/${a.projects[0].slug}`:a.card_link=`${G}/users/${a.username}`}return[]}class ee extends U{constructor(t){super();z(this,t,W,T,B,{})}}export{ee as default};