import{A as c,B as f,E as n,a as r,b as p,c as i,k as m,z as a}from"./chunk-VHWFIQIJ.js";import"./chunk-5FZOKLP6.js";var M=[{path:"maps",loadChildren:()=>import("./chunk-L4TXIWL6.js").then(o=>o.MapsModule)},{path:"**",redirectTo:"maps"}],u=(()=>{let t=class t{};t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=i({type:t}),t.\u0275inj=r({imports:[n.forRoot(M,{useHash:!0}),n]});let o=t;return o})();var d=(()=>{let t=class t{constructor(){this.title="maps-app"}};t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=p({type:t,selectors:[["app-root"]],decls:1,vars:0,template:function(e,g){e&1&&m(0,"router-outlet")},dependencies:[f]});let o=t;return o})();var h=(()=>{let t=class t{};t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=i({type:t,bootstrap:[d]}),t.\u0275inj=r({imports:[c,u]});let o=t;return o})();a().bootstrapModule(h).catch(o=>console.error(o));
