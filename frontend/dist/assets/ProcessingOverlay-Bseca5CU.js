import{c as s,r as k,j as e,y as n}from"./index-B85rJyAq.js";import{A as v}from"./index-Cr2qRHvt.js";import{m as o}from"./proxy-B4lrioCf.js";/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=s("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]),m=({isVisible:x,steps:p=[],onComplete:t})=>{const[r,y]=k.useState(0);return k.useEffect(()=>{if(!x){y(0);return}if(r<p.length){const i=setTimeout(()=>{y(a=>a+1)},2e3);return()=>clearTimeout(i)}else t&&t()},[x,r,p.length,t]),e.jsx(v,{children:x&&e.jsxs(o.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAFAF7] dark:bg-[#0D0B09] p-8",children:[e.jsx(d,{children:e.jsxs("div",{className:"typewriter",children:[e.jsx("div",{className:"slide",children:e.jsx("i",{})}),e.jsx("div",{className:"paper"}),e.jsx("div",{className:"keyboard"})]})}),e.jsxs("div",{className:"mt-16 text-center max-w-md",children:[e.jsx(v,{mode:"wait",children:e.jsxs(o.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},className:"space-y-4",children:[e.jsx("h2",{className:"text-xl font-[900] text-slate-900 dark:text-white uppercase tracking-[0.2em] font-heading",children:p[r]||"Finalizing Results"}),e.jsx("div",{className:"flex justify-center gap-1",children:[...Array(p.length)].map((i,a)=>e.jsx("div",{className:`h-1.5 rounded-full transition-all duration-500 ${a===r?"w-8 bg-brand-600":a<r?"w-3 bg-emerald-500":"w-3 bg-slate-200 dark:bg-slate-800"}`},a))})]},r)}),e.jsx("p",{className:"mt-8 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] animate-pulse",children:"AI ENGINE IS PROCESSING YOUR REQUEST"})]})]})})},d=n.div`
  .typewriter {
    --blue: #fb7c0e;
    --blue-dark: #d66400;
    --key: #fff;
    --paper: #FAFAF7;
    --text: #6B6258;
    --tool: #fb7c0e;
    --duration: 3s;
    position: relative;
    animation: bounce05 var(--duration) linear infinite;
  }

  .dark .typewriter {
     --paper: #161310;
     --text: #A09890;
  }

  .typewriter .slide {
    width: 92px;
    height: 20px;
    border-radius: 3px;
    margin-left: 14px;
    transform: translateX(14px);
    background: linear-gradient(var(--blue), var(--blue-dark));
    animation: slide05 var(--duration) ease infinite;
  }

  .typewriter .slide:before, .typewriter .slide:after,
  .typewriter .slide i:before {
    content: "";
    position: absolute;
    background: var(--tool);
  }

  .typewriter .slide:before {
    width: 2px;
    height: 8px;
    top: 6px;
    left: 100%;
  }

  .typewriter .slide:after {
    left: 94px;
    top: 3px;
    height: 14px;
    width: 6px;
    border-radius: 3px;
  }

  .typewriter .slide i {
    display: block;
    position: absolute;
    right: 100%;
    width: 6px;
    height: 4px;
    top: 4px;
    background: var(--tool);
  }

  .typewriter .slide i:before {
    right: 100%;
    top: -2px;
    width: 4px;
    border-radius: 2px;
    height: 14px;
  }

  .typewriter .paper {
    position: absolute;
    left: 24px;
    top: -26px;
    width: 40px;
    height: 46px;
    border-radius: 5px;
    background: var(--paper);
    transform: translateY(46px);
    animation: paper05 var(--duration) linear infinite;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  }

  .typewriter .paper:before {
    content: "";
    position: absolute;
    left: 6px;
    right: 6px;
    top: 7px;
    border-radius: 2px;
    height: 4px;
    transform: scaleY(0.8);
    background: var(--text);
    box-shadow: 0 12px 0 var(--text), 0 24px 0 var(--text), 0 36px 0 var(--text);
  }

  .typewriter .keyboard {
    width: 120px;
    height: 56px;
    margin-top: -10px;
    z-index: 1;
    position: relative;
  }

  .typewriter .keyboard:before, .typewriter .keyboard:after {
    content: "";
    position: absolute;
  }

  .typewriter .keyboard:before {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 7px;
    background: linear-gradient(135deg, var(--blue), var(--blue-dark));
    transform: perspective(10px) rotateX(2deg);
    transform-origin: 50% 100%;
  }

  .typewriter .keyboard:after {
    left: 2px;
    top: 25px;
    width: 11px;
    height: 4px;
    border-radius: 2px;
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
    animation: keyboard05 var(--duration) linear infinite;
  }

  @keyframes bounce05 {
    85%, 92%, 100% { transform: translateY(0); }
    89% { transform: translateY(-4px); }
    95% { transform: translateY(2px); }
  }

  @keyframes slide05 {
    5% { transform: translateX(14px); }
    15%, 30% { transform: translateX(6px); }
    40%, 55% { transform: translateX(0); }
    65%, 70% { transform: translateX(-4px); }
    80%, 89% { transform: translateX(-12px); }
    100% { transform: translateX(14px); }
  }

  @keyframes paper05 {
    5% { transform: translateY(46px); }
    20%, 30% { transform: translateY(34px); }
    40%, 55% { transform: translateY(22px); }
    65%, 70% { transform: translateY(10px); }
    80%, 85% { transform: translateY(0); }
    92%, 100% { transform: translateY(46px); }
  }

  @keyframes keyboard05 {
    5%, 12%, 21%, 30%, 39%, 48%, 57%, 66%, 75%, 84% {
      box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
    }
    9% {
      box-shadow: 15px 2px 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
    }
    18% {
      box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 2px 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
    }
    27% {
      box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 12px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
    }
    36% {
      box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 12px 0 var(--key), 60px 12px 0 var(--key), 68px 12px 0 var(--key), 83px 10px 0 var(--key);
    }
    45% {
      box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 2px 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
    }
    54% {
      box-shadow: 15px 0 0 var(--key), 30px 2px 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
    }
    63% {
      box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 12px 0 var(--key);
    }
    72% {
      box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 2px 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
    }
    81% {
      box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 12px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
    }
  }
`;export{m as P,b as U};
