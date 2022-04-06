import{_ as L}from"../../../../../chunks/preload-helper-ec9aa979.js";import{S as H,i as G,s as J,e as g,t as T,j as D,c as j,a as k,g as w,d as b,l as M,b as A,f as U,F as p,h as q,v as K,w as Q,M as B,x as W,O as X,p as Y,n as Z,A as x,L as $}from"../../../../../chunks/vendor-358d5d08.js";import{b as ee}from"../../../../../chunks/paths-28a87002.js";import{s as te}from"../../../../../chunks/settings-8f2b275b.js";import{p as R}from"../../../../../chunks/formatUtils-b852786f.js";import{P as se}from"../../../../../chunks/project_header-d5a0d11f.js";function re(a){switch(a){case"../../../../../lib/data/cedar-creek-reserve/users.csv":return L(()=>import("../../../../../chunks/users-a95b995e.js"),[]);case"../../../../../lib/data/ciencia-ciudadana-peru-bats/users.csv":return L(()=>import("../../../../../chunks/users-44c615ec.js"),[]);case"../../../../../lib/data/ciencia-ciudadana-peru-bees/users.csv":return L(()=>import("../../../../../chunks/users-280deaa4.js"),[]);case"../../../../../lib/data/clarkstown-high-school-north/users.csv":return L(()=>import("../../../../../chunks/users-fb306347.js"),[]);case"../../../../../lib/data/go-sea/users.csv":return L(()=>import("../../../../../chunks/users-59a261af.js"),[]);case"../../../../../lib/data/los-angeles-bioblitz/users.csv":return L(()=>import("../../../../../chunks/users-ee6c1fc1.js"),[]);default:return new Promise(function(e,r){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(r.bind(null,new Error("Unknown variable dynamic import: "+a)))})}}function C(a,e,r){const o=a.slice();return o[8]=e[r],o}function F(a){let e,r,o=a[8].user_login+"",l,n,i,h=R("observation",a[8].observation_count)+"",v,c;return{c(){e=g("li"),r=g("a"),l=T(o),i=T(": "),v=T(h),c=D(),this.h()},l(u){e=j(u,"LI",{});var s=k(e);r=j(s,"A",{href:!0});var E=k(r);l=w(E,o),E.forEach(b),i=w(s,": "),v=w(s,h),c=M(s),s.forEach(b),this.h()},h(){A(r,"href",n=""+(a[1]+"/users/"+a[8].user_id))},m(u,s){U(u,e,s),p(e,r),p(r,l),p(e,i),p(e,v),p(e,c)},p(u,s){s&16&&o!==(o=u[8].user_login+"")&&q(l,o),s&18&&n!==(n=""+(u[1]+"/users/"+u[8].user_id))&&A(r,"href",n),s&16&&h!==(h=R("observation",u[8].observation_count)+"")&&q(v,h)},d(u){u&&b(e)}}}function ae(a){let e,r,o,l,n,i=R("Observer",a[0].length)+"",h,v,c,u,s,E,O,V,N;e=new se({props:{org:a[2],project:a[3],activeTab:oe}});let P=a[4],_=[];for(let t=0;t<P.length;t+=1)_[t]=F(C(a,P,t));return{c(){K(e.$$.fragment),r=D(),o=g("main"),l=g("div"),n=g("h1"),h=T(i),v=D(),c=g("ol");for(let t=0;t<_.length;t+=1)_[t].c();u=D(),s=g("button"),E=T("Load More"),this.h()},l(t){Q(e.$$.fragment,t),r=M(t),o=j(t,"MAIN",{class:!0});var m=k(o);l=j(m,"DIV",{class:!0});var d=k(l);n=j(d,"H1",{});var f=k(n);h=w(f,i),f.forEach(b),v=M(d),c=j(d,"OL",{});var I=k(c);for(let y=0;y<_.length;y+=1)_[y].l(I);I.forEach(b),u=M(d),s=j(d,"BUTTON",{class:!0});var S=k(s);E=w(S,"Load More"),S.forEach(b),d.forEach(b),m.forEach(b),this.h()},h(){A(s,"class","btn"),B(s,"hidden",!a[5]),A(l,"class","prose"),A(o,"class","container mx-auto")},m(t,m){W(e,t,m),U(t,r,m),U(t,o,m),p(o,l),p(l,n),p(n,h),p(l,v),p(l,c);for(let d=0;d<_.length;d+=1)_[d].m(c,null);p(l,u),p(l,s),p(s,E),O=!0,V||(N=X(s,"click",a[6]),V=!0)},p(t,[m]){const d={};if(m&4&&(d.org=t[2]),m&8&&(d.project=t[3]),e.$set(d),(!O||m&1)&&i!==(i=R("Observer",t[0].length)+"")&&q(h,i),m&18){P=t[4];let f;for(f=0;f<P.length;f+=1){const I=C(t,P,f);_[f]?_[f].p(I,m):(_[f]=F(I),_[f].c(),_[f].m(c,null))}for(;f<_.length;f+=1)_[f].d(1);_.length=P.length}m&32&&B(s,"hidden",!t[5])},i(t){O||(Y(e.$$.fragment,t),O=!0)},o(t){Z(e.$$.fragment,t),O=!1},d(t){x(e,t),t&&b(r),t&&b(o),$(_,t),V=!1,N()}}}async function fe({params:a}){let e=te.filter(i=>i.username===a.orgs)[0],r=e.projects.filter(i=>i.slug===a.projects)[0],o=`${ee}/orgs/${e.username}/${r.slug}`,n=(await re(`../../../../../lib/data/${r.slug}/users.csv`)).default;return n=n.sort((i,h)=>h.observation_count-i.observation_count),{props:{users:n,projectPath:o,project:r,org:e}}}let z=50,oe="users";function ne(a,e,r){let o,l,{users:n}=e,{projectPath:i}=e,{org:h}=e,{project:v}=e,c=1;function u(){r(7,c=c+1),r(4,o=n.slice(0,c*z))}return a.$$set=s=>{"users"in s&&r(0,n=s.users),"projectPath"in s&&r(1,i=s.projectPath),"org"in s&&r(2,h=s.org),"project"in s&&r(3,v=s.project)},a.$$.update=()=>{a.$$.dirty&129&&r(4,o=n.slice(0,c*z)),a.$$.dirty&129&&r(5,l=c*z<n.length)},[n,i,h,v,o,l,u,c]}class de extends H{constructor(e){super();G(this,e,ne,ae,J,{users:0,projectPath:1,org:2,project:3})}}export{de as default,fe as load};