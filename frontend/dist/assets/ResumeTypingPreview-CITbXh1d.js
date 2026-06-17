import{c as d,j as e,R as u,y as g,r as i}from"./index-B85rJyAq.js";import{m as n}from"./proxy-B4lrioCf.js";import{M as v}from"./mail-CsgMrDlU.js";import{F as j}from"./file-text-BgLnWOTD.js";/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=d("Calendar",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=d("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]),P=({value:o,onChange:l,name:r="star-radio"})=>e.jsx(N,{children:e.jsx("div",{className:"rating",children:[5,4,3,2,1].map(s=>e.jsxs(u.Fragment,{children:[e.jsx("input",{type:"radio",id:`star-${s}`,name:r,value:s,checked:o===s,onChange:()=>l&&l(s)}),e.jsx("label",{htmlFor:`star-${s}`,children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:e.jsx("path",{pathLength:360,d:"M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"})})})]},s))})}),N=g.div`
  .rating {
    display: flex;
    flex-direction: row-reverse;
    gap: 0.3rem;
    --stroke: #666;
    --fill: #ffc73a;
  }

  .rating input {
    appearance: unset;
    display: none;
  }

  .rating label {
    cursor: pointer;
  }

  .rating svg {
    width: 2rem;
    height: 2rem;
    overflow: visible;
    fill: transparent;
    stroke: var(--stroke);
    stroke-linejoin: bevel;
    stroke-dasharray: 12;
    animation: idle 4s linear infinite;
    transition: stroke 0.2s, fill 0.5s;
  }

  @keyframes idle {
    from {
      stroke-dashoffset: 24;
    }
  }

  .rating label:hover svg,
  .rating label:hover ~ label svg {
    stroke: var(--fill);
  }

  .rating input:checked ~ label svg {
    transition: 0s;
    animation: idle 4s linear infinite, yippee 0.75s backwards;
    fill: var(--fill);
    stroke: var(--fill);
    stroke-opacity: 0;
    stroke-dasharray: 0;
    stroke-linejoin: miter;
    stroke-width: 8px;
  }

  @keyframes yippee {
    0% {
      transform: scale(1);
      fill: var(--fill);
      fill-opacity: 0;
      stroke-opacity: 1;
      stroke: var(--stroke);
      stroke-dasharray: 10;
      stroke-width: 1px;
      stroke-linejoin: bevel;
    }

    30% {
      transform: scale(0);
      fill: var(--fill);
      fill-opacity: 0;
      stroke-opacity: 1;
      stroke: var(--stroke);
      stroke-dasharray: 10;
      stroke-width: 1px;
      stroke-linejoin: bevel;
    }

    30.1% {
      stroke: var(--fill);
      stroke-dasharray: 0;
      stroke-linejoin: miter;
      stroke-width: 8px;
    }

    60% {
      transform: scale(1.2);
      fill: var(--fill);
    }
  }
`,I=({name:o="John Doe",role:l="Software Engineer"})=>{const r="Software engineer with 5+ years of experience building scalable cloud solutions and microservices architecture for modern enterprises. Passionate about clean code and performance optimization.",s=["Python","SQL","React","AWS","Docker","K8s","Redis","GraphQL","TypeScript","Node.js","CI/CD","Terraform"],c={title:"Senior Developer @ Tech Solutions",date:"2021 — Present",bullets:["Architected microservices that handled 1M+ req/day","Reduced API latency by 40% through Redis caching","Led a team of 5 engineers for the core product launch"]},[x,p]=i.useState(""),[m,h]=i.useState([]),[f,k]=i.useState(!1);return i.useEffect(()=>{let a=0;const t=setInterval(()=>{p(r.slice(0,a)),a++,a>r.length&&(clearInterval(t),setTimeout(()=>k(!0),500))},15);return()=>clearInterval(t)},[]),i.useEffect(()=>{const a=s.map((t,b)=>setTimeout(()=>{h(y=>[...y,t])},r.length*15+b*300));return()=>a.forEach(t=>clearTimeout(t))},[]),e.jsxs(n.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white rounded-[32px] p-6 shadow-2xl w-full max-w-[420px] font-sans text-left overflow-hidden relative",children:[e.jsxs("div",{className:"border-b-2 border-slate-100 dark:border-slate-800 pb-4 mb-4",children:[e.jsx("h2",{className:"text-xl font-black text-slate-900 dark:text-white font-heading tracking-tight",children:o}),e.jsx("p",{className:"text-brand-600 font-black text-[10px] uppercase tracking-widest mt-1",children:l}),e.jsxs("div",{className:"flex flex-wrap gap-3 mt-3 text-[9px] font-bold text-slate-400 uppercase tracking-tighter",children:[e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx(v,{size:10})," john@ai.com"]}),e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx(w,{size:10})," New York, USA"]})]})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("h3",{className:"text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2",children:"Professional Summary"}),e.jsxs("p",{className:"text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed min-h-[50px]",children:[x,e.jsx(n.span,{animate:{opacity:[0,1,0]},transition:{repeat:1/0,duration:.8},className:"inline-block w-1 h-3 bg-brand-600 ml-0.5"})]})]}),f&&e.jsxs(n.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},className:"mb-4",children:[e.jsx("h3",{className:"text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2",children:"Experience"}),e.jsxs("div",{className:"bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsx("p",{className:"text-[10px] font-black text-slate-900 dark:text-white",children:c.title}),e.jsx("span",{className:"text-[8px] font-bold text-slate-400",children:c.date})]}),e.jsx("ul",{className:"space-y-1",children:c.bullets.map((a,t)=>e.jsxs("li",{className:"text-[9px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5",children:[e.jsx("span",{className:"text-brand-600 mt-1",children:"•"})," ",a]},t))})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2",children:"Key Competencies"}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:m.map((a,t)=>e.jsx(n.span,{initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},className:"px-2 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[8px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest",children:a},t))})]}),e.jsx("div",{className:"absolute -bottom-4 -right-4 opacity-5 rotate-12 pointer-events-none",children:e.jsx(j,{size:120})})]})};export{E as C,I as R,P as a};
