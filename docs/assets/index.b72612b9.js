const ut=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerpolicy&&(s.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?s.credentials="include":e.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(e){if(e.ep)return;e.ep=!0;const s=n(e);fetch(e.href,s)}};ut();const A=[255,255,255],dt=[255,0,0],pt=[0,255,0],ft=[0,0,255];function mt(t,o,n){return t*(1-n)+o*n}function B(t,o,n){return t.map((r,e)=>{const s=o[e];return mt(r,s,n)})}function Z(t,o,n){return Math.abs(t[0]*(o[1]-n[1])+o[0]*(n[1]-t[1])+n[0]*(t[1]-o[1]))/2}function V(t,o){return t.map((n,r)=>n+o[r])}function E(t,o){return t.map((n,r)=>n-o[r])}function X(t,o){return t.map(n=>n*o)}function J(t,o){return t.map((n,r)=>n*o[r])}function nt(t,o){return t.map(n=>n/o)}function ht(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2))}function Q(t){const o=ht(t);if(o===0)throw new Error("Cannot normalize vector with magnitude of 0.");return t.map(n=>n/o)}function $(t,o){return t.reduce((n,r,e)=>n+r*o[e],0)}function wt(t,o){return[t[1]*o[2]-t[2]*o[1],t[2]*o[0]-t[0]*o[2],t[0]*o[1]-t[1]*o[0]]}function H(t,o){if(t[0].length!==o.length)throw new Error("Invalid matrix multiplication.");return t.map((n,r)=>o[0].map((e,s)=>n.reduce((a,i,l)=>a+t[r][l]*o[l][s],0)))}function b(t,o){return H(t,o.map(n=>[n]))}function yt(t){return t.map((o,n)=>o.map((r,e)=>t[e][n]))}function k(t){const o=K(t[0]),n=[[1,0,0],[0,Math.cos(o),-Math.sin(o)],[0,Math.sin(o),Math.cos(o)]],r=K(t[1]),e=[[Math.cos(r),0,Math.sin(r)],[0,1,0],[-Math.sin(r),0,Math.cos(r)]],s=K(t[2]),a=[[Math.cos(s),-Math.sin(s),0],[Math.sin(s),Math.cos(s),0],[0,0,1]];return H(H(e,n),a)}function K(t){return t*(Math.PI/180)}function gt(t,o,n,r){const e=Z(o,n,r),s=Z(t,n,r),a=Z(o,t,r),i=Z(o,n,t);if(e===0)return[!1,[0,0,0]];const l=1e-6,c=Math.abs(e-(s+a+i))<=l,d=s/e,p=a/e,u=i/e;return[c,[d,p,u]]}function xt(t,o,n,r){return[j(t[0],o[0],n[0],r),j(t[1],o[1],n[1],r),j(t[2],o[2],n[2],r)]}function Mt(t,o,n,r){return[j(t[0],o[0],n[0],r),j(t[1],o[1],n[1],r)]}function j(t,o,n,r){const e=Math.min(r[0],.99999),s=Math.min(r[1],.99999),a=Math.min(r[2],.99999);return(e*t+s*o+a*n)/(e+s+a)}function R(t,o,n){return Math.max(Math.min(t,n),o)}function vt(t,o,n){return t.map(r=>R(r,o,n))}function L(t){const o=V(t[1],X(t[0],-1)),n=V(t[2],X(t[0],-1)),r=wt(o,n);return r.every(e=>e===0)?null:Q(r)}function Ct(t,o){return Math.sqrt(Tt(t,o))}function Tt(t,o){return Math.pow(o[0]-t[0],2)+Math.pow(o[1]-t[1],2)+Math.pow(o[2]-t[2],2)}function Vt(t,o,n,r){window.addEventListener("keydown",e=>{if(e.key==="ArrowUp"){e.preventDefault();const s=k(t.rotation),a=b(s,[0,0,n]).map(i=>i[0]);t.translation=V(t.translation,a)}if(e.key==="ArrowDown"){e.preventDefault();const s=k(t.rotation),a=b(s,[0,0,n]).map(i=>i[0]);t.translation=E(t.translation,a)}if(e.key==="ArrowLeft"){e.preventDefault();const s=k(t.rotation),a=b(s,[n,0,0]).map(i=>i[0]);t.translation=E(t.translation,a)}if(e.key==="ArrowRight"){e.preventDefault();const s=k(t.rotation),a=b(s,[n,0,0]).map(i=>i[0]);t.translation=V(t.translation,a)}e.key==="w"&&(e.preventDefault(),t.rotation[0]-=r),e.key==="s"&&(e.preventDefault(),t.rotation[0]+=r),e.key==="a"&&(e.preventDefault(),t.rotation[1]-=r),e.key==="d"&&(e.preventDefault(),t.rotation[1]+=r),e.key==="e"&&(e.preventDefault(),t.rotation[2]+=r),e.key==="q"&&(e.preventDefault(),t.rotation[2]-=r),e.key==="i"&&(e.preventDefault(),o.objects[0].transform.rotation[0]+=r),e.key==="j"&&(e.preventDefault(),o.objects[0].transform.rotation[1]+=r),e.key==="k"&&(e.preventDefault(),o.objects[0].transform.rotation[0]-=r),e.key==="l"&&(e.preventDefault(),o.objects[0].transform.rotation[1]-=r),e.key==="c"&&(e.preventDefault(),o.lights[0].color[0]-=10),e.key==="v"&&(e.preventDefault(),o.lights[0].color[1]-=10),e.key==="b"&&(e.preventDefault(),o.lights[0].color[2]-=10),e.key==="f"&&(e.preventDefault(),o.lights[0].color[0]+=10),e.key==="g"&&(e.preventDefault(),o.lights[0].color[1]+=10),e.key==="h"&&(e.preventDefault(),o.lights[0].color[2]+=10)})}function Nt(t,o,n,r){if(o<0||n<0||o>t.width-1||n>t.height-1)return;o=Math.round(o),n=Math.round(n);const e=o*4+(t.height-1-n)*t.width*4;t.data[e+0]=r[0],t.data[e+1]=r[1],t.data[e+2]=r[2],t.data[e+3]=255}function It(t,o,n,r,e,s,a,i,l){let[c,d]=bt([n,r,e]);c=[R(c[0],0,t.width),R(c[1],0,t.height)],d=[R(d[0],0,t.width),R(d[1],0,t.height)];for(let p=c[1];p<=d[1];p++)for(let u=c[0];u<=d[0];u++){const[f,y]=gt([u,p],n,r,e);if(!f)continue;let g=xt(s.color,a.color,i.color,y);if(l!=null&&s.textureCoord!=null&&a.textureCoord!=null&&i.textureCoord!=null){const T=Mt(s.textureCoord,a.textureCoord,i.textureCoord,y),F=Math.round(T[0]*(l.width-1)),w=Math.round(T[1]*(l.height-1));g=J(l.pixels[F][w],nt(g,255))}const m=j(s.z,a.z,i.z,y),h=1/m,C=u+p*t.width;h>o[C]&&(Nt(t,u,p,g),u>=0&&p>=0&&u<t.width&&p<t.height&&(o[C]=h))}}function bt(t){if(t.length===0)return[[0,0],[0,0]];let o=[1/0,1/0],n=[-1/0,-1/0];for(const r of t)r[0]<o[0]&&(o[0]=r[0]),r[1]<o[1]&&(o[1]=r[1]),r[0]>n[0]&&(n[0]=r[0]),r[1]>n[1]&&(n[1]=r[1]);return[[Math.floor(o[0]),Math.floor(o[1])],[Math.ceil(n[0]),Math.ceil(n[1])]]}function kt(t,o){const n=t.width/t.height,r=1,e=1,s=o[1]*e/o[2],i=o[0]*e/o[2]*t.width/n+t.width/2,l=s*t.height/r+t.height/2;return[i,l]}const N={distance:-.01,normal:[0,0,1]};function Pt(t){const o=[];return t.forEach(n=>{const r=n.verts.map(a=>$(N.normal,a)+N.distance);let e=[],s=[];if(r.forEach((a,i)=>{a<=0?s.push(i):e.push(i)}),s.length===0)o.push(n);else if(s.length===1){const[a,i]=e,[l]=s,c=n.verts[a],d=n.verts[i],p=n.verts[l],u=n.colors[a],f=n.colors[i],y=n.colors[l],{point:g,proportion:m}=D(N,[c,p]),{point:h,proportion:C}=D(N,[d,p]),T=B(u,y,m),F=B(f,y,C);let w=[];w[a]=c,w[i]=d,w[l]=g;let M=[];M[a]=u,M[i]=f,M[l]=T;let x=[];x[a]=g,x[i]=d,x[l]=h;let q=[];q[a]=T,q[i]=f,q[l]=F;const O=L(w);O!=null&&o.push({verts:w,colors:M,normals:[O,O,O]});const _=L(x);_!=null&&o.push({verts:x,colors:q,normals:[_,_,_]});return}else if(s.length===2){const[a]=e,[i,l]=s,c=n.verts[a],d=n.verts[i],p=n.verts[l],u=n.colors[a],f=n.colors[i],y=n.colors[l],{point:g,proportion:m}=D(N,[c,d]),{point:h,proportion:C}=D(N,[c,p]),T=B(u,f,m),F=B(u,y,C);let w=[];w[a]=c,w[i]=g,w[l]=h;let M=[];M[a]=u,M[i]=T,M[l]=F;const x=L(w);x!=null&&o.push({verts:w,colors:M,normals:[x,x,x]});return}else if(s.length===3)return}),o}function D(t,o){const n=(-t.distance-$(t.normal,o[0]))/$(t.normal,E(o[1],o[0]));return{point:V(o[0],X(E(o[1],o[0]),n)),proportion:n}}function jt(t,o){const n=Et(t,o.scale),r=rt(n,o.rotation);return Ft(r,o.translation)}function Et(t,o){return J(t,o)}function rt(t,o){const n=k(o);return b(n,t).map(r=>r[0])}function Ft(t,o){return V(t,o)}function Rt(t,o){const n=et(t,o);return z(t,n)}function et(t,o){return E(o,t.translation)}function z(t,o){const n=k(t.rotation),r=yt(n);return b(r,o).map(s=>s[0])}function zt(t,o){const n=t.split(/\r?\n/),r=n.filter(i=>i.startsWith("v ")).map(i=>i.trim().split(" ").slice(1)).map(i=>i.map(Number)),e=n.filter(i=>i.startsWith("vn ")).map(i=>i.trim().split(" ").slice(1)).map(i=>i.map(Number)),s=n.filter(i=>i.startsWith("vt ")).map(i=>i.trim().split(" ").slice(1)).map(i=>i.map(Number));return n.filter(i=>i.startsWith("f ")).map(i=>i.trim().split(" ").slice(1)).map(i=>i.map(l=>l.split("/"))).map(i=>i.map(l=>[l[0]!==""?Number(l[0])-1:null,l[1]!==""?Number(l[1])-1:null,l[2]!==""?Number(l[2])-1:null])).map(i=>{const l=i.map(([m])=>m),c=i.map(([m,h])=>h),d=i.map(([m,h,C])=>C),p=At(l,r),f=c.every(m=>m!=null)?Lt(c,s):void 0,g=d.every(m=>m!=null)&&!(o!=null&&o.calculateOwnNormals)?$t(d,e):qt(p);return p.map((m,h)=>({verts:p[h],textureCoords:f==null?void 0:f[h],normals:g[h]}))}).flat().map(({verts:i,textureCoords:l,normals:c})=>{let d;return d=[A,A,A],{verts:i,textureCoords:l,colors:d,normals:c}})}function At(t,o){const n=t.map(s=>{if(s==null)throw new Error(`Cannot map vert index of ${s} to vert.`);const a=o[s];if(a==null)throw new Error(`Failed to map vertex index to vert (index: ${s}).`);return a}),r=Math.max(n.length-2,0),e=[];for(let s=0;s<r;s++){const a=[n[0],n[1+s],n[2+s]];e.push(a)}return e}function Lt(t,o){const n=t.map(s=>{if(s==null)throw new Error(`Cannot map texture coordinate index of ${s} to texture coordinate.`);const a=o[s];if(a==null)throw new Error(`Failed to map texture coordinate index to texture coordinate (index: ${s}).`);return a}),r=Math.max(n.length-2,0),e=[];for(let s=0;s<r;s++){const a=[n[0],n[1+s],n[2+s]];e.push(a)}return e}function $t(t,o){const n=t.map(s=>{if(s==null)throw new Error(`Cannot map normal index of ${s} to normal.`);const a=o[s];if(a==null)throw new Error(`Failed to map normal index to normal (index: ${s}).`);return a}),r=Math.max(n.length-2,0),e=[];for(let s=0;s<r;s++){const a=[n[0],n[1+s],n[2+s]];e.push(a)}return e}function qt(t){return t.map(o=>{var n;return(n=L(o))!=null?n:[1,0,0]}).map(o=>[o,o,o])}async function Ot(t){const o=await fetch(t);if(!o.ok)throw new Error(`Failed to load file "${t}".`);return await o.text()}function _t(t,o,n){let r=[0,0,0];for(const s of n){let a=0;if(s.type==="ambient")a=s.intensity;else if(s.type==="directional"){const l=Math.max(0,-$(s.direction,o));a=s.intensity*l}else if(s.type==="point"){const l=Ct(s.position,t),c=1/Math.pow(l,2),d=s.intensity*c,p=Q(E(t,s.position)),u=Math.max(0,-$(p,o));a=d*u}const i=X(s.color,a);r=V(r,i)}return nt(r,255)}async function Bt(t){const o=new Image;return o.src=t,new Promise((n,r)=>{o.onload=()=>{const e=document.createElement("canvas");e.width=o.width,e.height=o.height;const s=e.getContext("2d");if(s==null){r(new Error("Failed to create canvas context."));return}s.drawImage(o,0,0,o.width,o.height),n(s.getImageData(0,0,o.width,o.height))},o.onerror=()=>{o.onerror=null,r(new Error(`Failed to load image "${t}".`))}})}function Zt(t,o,n){return[...new Array(t)].map(()=>[...new Array(o)].map(()=>n))}function Dt(t){const o=Zt(t.width,t.height,[0,0,0]);for(let n=0;n<t.data.length;n+=4){const r=n/4%t.width,e=(n/4-r)/t.width,s=[t.data[n],t.data[n+1],t.data[n+2]];o[r][e]=s}return{width:t.width,height:t.height,pixels:o}}const v=document.querySelector("canvas"),S=v.getContext("2d"),st=S.canvas.getBoundingClientRect();var ot;const Y=(ot=window.devicePixelRatio)!=null?ot:1,it=1/2;v.width=Math.round(st.width*Y*it);v.height=Math.round(st.height*Y*it);S.scale(Y,Y);let tt=performance.now();const Xt=new ImageData(v.width,v.height),W=new ImageData(v.width,v.height),at=new Float64Array(v.width*v.height),ct=Float64Array.from(at);let P,G;async function Yt(){const t=[{type:"ambient",intensity:.1,color:A},{type:"directional",intensity:0,direction:Q([1,0,0]),color:A},{type:"point",intensity:20,position:[0,1,5],color:dt},{type:"point",intensity:20,position:[-4.33,1,-2.5],color:pt},{type:"point",intensity:20,position:[4.33,1,-2.5],color:ft}],o=[{transform:{translation:[0,2,0],scale:[1,1,1],rotation:[0,0,0]},model:await U("./models/rat.obj",void 0,{calculateOwnNormals:!0})},{transform:{translation:[0,-2,0],scale:[1,1,1],rotation:[0,0,0]},model:await U("./models/rat.obj")}];P={lights:t,objects:o},Vt(I,P,Wt,Gt),G=await U("./models/cube.obj"),G.unlit=!0,lt()}async function U(t,o,n){return{tris:zt(await Ot(t),n),texture:o!=null?Dt(await Bt(o)):void 0}}function lt(){W.data.set(Xt.data),ct.set(at);const t=performance.now(),o=(t-tt)/1e3;Kt(o),S.putImageData(W,0,0),tt=t,requestAnimationFrame(lt)}const Wt=.2,Gt=5;let I={translation:[0,4,-10],rotation:[20,0,0],scale:[1,1,1]};function Kt(t){if(P==null)return;let o=[...P.objects];P.lights.forEach(r=>{r.type==="point"&&(r.position=z({rotation:[0,50*t,0],scale:[1,1,1],translation:[0,0,0]},r.position),o.push({model:{...G,tris:G.tris.map(e=>({...e,colors:[r.color,r.color,r.color]}))},transform:{translation:r.position,scale:[.03,.03,.03],rotation:[0,0,0]}}))});const n=P.lights.map(r=>{switch(r.type){case"ambient":return r;case"directional":const e=z(I,r.direction);return{...r,direction:e};case"point":const s=et(I,r.position),a=z(I,s);return{...r,position:a}}});o.forEach(r=>{if(r.model==null)return;const s=r.model.tris.map(c=>{const d=c.verts.map(u=>{const f=jt(u,r.transform);return Rt(I,f)}),p=c.normals.map(u=>{const f=rt(u,r.transform.rotation);return z(I,f)});return{...c,verts:d,normals:p}}).filter(c=>c!=null);Pt(s).map(c=>{if(r.model.unlit)return c;{if(L(c.verts)===null)return c;const p=c.verts.map((u,f)=>_t(u,c.normals[f],n));return{...c,colors:c.colors.map((u,f)=>vt(J(u,p[f]),0,255))}}}).map(c=>({color:c.colors,textureCoords:c.textureCoords,unprojectedVerts:c.verts,projectedVerts:c.verts.map(d=>kt(W,d))})).forEach(c=>{var d,p,u;It(W,ct,c.projectedVerts[0],c.projectedVerts[1],c.projectedVerts[2],{z:c.unprojectedVerts[0][2],color:c.color[0],textureCoord:(d=c.textureCoords)==null?void 0:d[0]},{z:c.unprojectedVerts[1][2],color:c.color[1],textureCoord:(p=c.textureCoords)==null?void 0:p[1]},{z:c.unprojectedVerts[2][2],color:c.color[2],textureCoord:(u=c.textureCoords)==null?void 0:u[2]},r.model.texture)})})}Yt();