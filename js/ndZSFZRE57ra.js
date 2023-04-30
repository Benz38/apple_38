/*! For license information please see echo.min.js.LICENSE.txt */
var Echo;(()=>{"use strict";(()=>{const e="echo_session_start_timestamp",n="unsent",t={BUNDLE_META_EVENT:"bundle_meta",CUMULATIVE_LAYOUT_SHIFT:"cumulative_layout_shift",CUSTOM_EVENT_FOR_DATABASE:"custom_event",CUSTOM_EVENT_FOR_CLIENT:"echoCustomEvent",ECHO_FEATURE:"echoFeatureEvent",ERROR:"error",FIRST_INPUT_DELAY:"first_input_delay",LARGEST_CONTENTFUL_PAINT:"largest_contentful_paint",NETWORK_ERROR:"network_error",PAGE_VIEW:"pageview",PAINT:"paint",PARTIAL_PAGEVIEW:"partial_pageview",PERFORMANCE_MEASURE:"performance_measure",RESOURCE:"resource",UNLOAD:"unload",VISIBILITY_CHANGE:"visibility_change"};let r=[];function o(){r=[]}function i(){return r}function a(e=[]){r=[...r,...Array.isArray(e)?e:[e]]}function s(){const e=[],n=n=>e.find((e=>e.fn===n||e.key===n));return{add:n=>e.push({...n,active:!1!==n.active,set:function(e,n){this[e]=n}}),set:(e,t,r)=>{const o=n(e);o&&o.set(t,r)},mergeConfig:e=>{Object.keys(e).forEach((t=>{const r=n(t);r&&(!r.data&&e[t]&&r.set("active",!0),r.set("data",e[t]))}))},serialize:()=>e.filter((e=>e.active)).map((e=>[e.fn,e.data])),dump:()=>e}}function c(e){if(!e)return null;const n=new URL(e);return n.search="query",n.href}const u=e=>({...e,...e.pageUrl&&{pageUrl:c(e.pageUrl)},...e.referer&&{referer:c(e.referer)},...e.errorUrl&&{errorUrl:c(e.errorUrl)}}),f=({eventType:e,eventData:n},t)=>({app:t.app,eventType:e,postTime:Date.now(),...t.eventDataDefaults,...n,...t.pageViewId&&{pageViewId:t.pageViewId}});function d({config:e,eventType:n,eventData:t}){const r=s();!function(e,n){const t=n.transforms||[];"function"==typeof n.sanitizeEventData&&t.push(n.sanitizeEventData),t.forEach((t=>e.add({fn:t,data:n})))}(r,e),r.add({fn:u}),r.add({fn:f,data:e});const o=r.serialize();return(i=o,function(e){let n=e;for(let e=i.length-1;e>=0;e--){const[t,r]=i[e];if(n=t(n,r),!1===n)return!1}return n})({eventType:n,eventData:t});var i}function l({storage:e=sessionStorage,pct:n=0}={}){return e&&Number(e.getItem("echo:nonEssentialEventSampleRatePct"))||n}function g(e,n){try{return e()}catch(e){return n&&a(d({config:n,eventType:t.ERROR,eventData:{errorMsg:e.message}})),null}}function p(e,n,t){if(t[e]>0&&t[n]>0){const r=t[n]-t[e];return r>0?r:0}return 0}function m(e){if(!e)return{};const n=new URL(e);return n.protocol.startsWith("http")||(n.pathname="pathname"),n}const E=[!0,"true",1,"1"],w={url:null,sendErrors:!1,sendPageViewData:!1,delaySendingPageViewDataMS:500,logRequests:g((()=>E.includes(sessionStorage.getItem("echo:logRequests")))),performanceMeasurePollingIntervalMS:1e3,sendResourceData:!1,resourceDisallowedResourceList:[],resourcePollingIntervalMS:2e3,nonEssentialEventSampleRatePct:0,transforms:[e=>e]},h=m(window.location),y={host:h.host,pageHostname:h.hostname,pagePathname:h.pathname,pageUrl:h.href,pageViewId:`${window.crypto&&window.crypto.getRandomValues?([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,(e=>(e^window.crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16))):"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){const n=16*Math.random()|0;return`${("x"==e?n:3&n|8).toString(16)}-legacy`}))}`,sessionStartTS:function(){const n=g((()=>sessionStorage.getItem(e)));return null!==n?parseInt(n,10):function(){const n=Date.now();return g((()=>sessionStorage.setItem(e,`${n}`))),n}()}()},v={pageViewDataState:n};let T=null;const S=({crypto:e={}})=>({exists:!!e.subtle}),_=({navigator:e={},NetworkInformation:n})=>({exists:!("function"!=typeof n||"object"!=typeof e.connection)}),R=(e,n)=>n&&(n.supportedEntryTypes||[]).includes(e),b=e=>{const n={exists:!1};if(!e.performance)return n;n.exists=!0,n.timeline=0;const t=e.PerformanceObserver;return t&&(n.timeline=1.5,"function"==typeof new t((()=>{})).takeRecords&&(n.timeline=2)),n.hasMeasures="function"==typeof e.performance.getEntriesByType&&"function"==typeof e.performance.clearMeasures&&R("measure",t),n.navigationTiming=0,R("navigation",t)?n.navigationTiming=2:e.performance.timing&&(n.navigationTiming=1),n.resourceTiming=0,R("resource",t)&&(n.resourceTiming=2),n.hasResourceTimingBuffer="function"==typeof e.performance.clearResourceTimings,n};function A(e=window){return T||(T={crypto:S(e),networkInfo:_(e),perf:b(e)}),T}function N({config:e}){const n=function({config:e}){if(!A().perf.hasMeasures)return[];const n=window.performance.getEntriesByType("measure").filter((e=>e.name.startsWith("echo-")));return n.forEach((({name:e})=>window.performance.clearMeasures(e))),n.map((n=>d({config:e,eventType:t.PERFORMANCE_MEASURE,eventData:n.toJSON()})))}({config:e});return n.length>0&&a(n)}function O({config:e}){function n(){return N({config:e})}return{start:()=>{A().perf.hasMeasures&&window.setInterval((()=>N({config:e})),e.performanceMeasurePollingIntervalMS),A().perf.hasResourceTimingBuffer&&window.addEventListener("resourcetimingbufferfull",n)}}}const x={};function L({config:e}){return a(function({config:e}){const n=[];if(!A().perf.hasMeasures)return n;const r=window.performance.getEntriesByType("resource");for(const o of r){const r=d({config:e,eventType:t.RESOURCE,eventData:U(o)});D({event:r,config:e})&&n.push(r)}return n}({config:e}))}function U(e){const n=e.toJSON();!function(e){const n=p("redirectStart","redirectEnd",e),t=p("fetchStart","domainLookupStart",e),r=p("domainLookupStart","domainLookupEnd",e),o=function(e){return p("secureConnectionStart","connectionStart",e)}(e),i=function(e){return p("secureConnectionStart","connectEnd",e)}(e),a=function(e){return p("requestStart","responseStart",e)}(e),s=function(e){return p("responseStart","responseEnd",e)}(e),c=e.duration-(n+t+r+o+i+a+s);e.redirect=n,e.appcache=t,e.dns=r,e.connect=o,e.tls=i,e.ttfb=a,e.download=s,e.queued=c}(n);for(const[e,t]of Object.entries(n))isNaN(t)?n[e]=t:t>0&&(n[e]=Number.parseFloat(t.toFixed(3)));return n.serverTiming&&delete n.serverTiming,n.entryType&&delete n.entryType,n}function D({event:e,config:n}){if(e.name===n.url)return!1;if((n.resourceDisallowedResourceList||[]).filter((e=>Boolean(e))).filter((n=>e.name.match(n))).length>0)return!1;const t=e.name+e.startTime;return!0!==x[t]&&(x[t]=!0,!0)}function C({config:e}){function n(){return L({config:e})}return{start:()=>{A().perf.resourceTiming>=2&&window.setInterval((()=>L({config:e})),e.resourcePollingIntervalMS),A().perf.hasResourceTimingBuffer&&window.addEventListener("resourcetimingbufferfull",n)}}}const I=new Set(["connectEnd","connectStart","domainLookupEnd","domainLookupStart","domComplete","domContentLoadedEventEnd","domContentLoadedEventStart","domInteractive","domLoading","fetchStart","loadEventEnd","loadEventStart","requestStart","responseEnd","responseStart"]),P=new Set(["redirectEnd","redirectStart","secureConnectionStart","unloadEventEnd","unloadEventStart",...I]);function M(e=A(),n=window){const t=e.perf;let r={};if(!t.exists)return r;if(2===t.navigationTiming){const e=n.performance.getEntriesByType("navigation");e.length>0&&"function"==typeof e[0].toJSON&&(r={...e[0].toJSON(),NavigationTimingLevel:2})}else if(1===t.navigationTiming){const e=n.performance.timing;r={...Object.keys(e).filter((e=>P.has(e))).reduce(((n,t)=>I.has(t)?{...n,[t]:e[t]-e.navigationStart}:{...n,[t]:e[t]}),{}),NavigationTimingLevel:1}}return e.networkInfo.exists&&(r.networkDownlink=n.navigator.connection.downlink||null,r.networkEffectiveType=n.navigator.connection.effectiveType||null,r.networkRtt=n.navigator.connection.rtt||null),r.imageCountOnLoad=document.images.length,r.support={subtleCrypto:e.crypto.exists},r}function k({config:e,triggeredBy:n="load",eventType:r=t.PAGE_VIEW}){const o={triggeredBy:n,...M()},i=m(document.referrer);return o.referer=i.href,d({config:e,eventType:r,eventData:o})}function B({config:e,bundle:n}){const t=new Request(e.url,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});return fetch(t)}function F({bundle:e}){const n=JSON.stringify(e);return void 0!==window.TextEncoder?(new TextEncoder).encode(n).length:function(e){let n=e.length;for(let t=e.length-1;t>=0;t--){const r=e.charCodeAt(t);r>127&&r<=2047?n+=1:r>2047&&r<=65535&&(n+=2),r>=56320&&r<=57343&&(t-=1)}return n}(n)}let V=0;function q({config:e,batch:n,method:r}){const i=(({events:e=[]}={})=>({deliveryVersion:"1.0",postTime:Date.now(),events:e.sort(((e,n)=>e.eventType.localeCompare(n.eventType)))}))({events:n});return function({config:e,bundle:n}){const r=d({config:e,eventType:t.BUNDLE_META_EVENT,eventData:{bundleSize:F({bundle:n})}});n.events.push(r)}({config:e,bundle:i}),o(),function({config:e,bundle:n,method:t}){!0===e.logRequests&&(console.info("%c/** ------------ Echo bundle begin ------------","color: skyblue"),console.info(`sent via ${t} to ${e.url}`),console.info(`sent at ${new Date(n.postTime)}`),n.events.forEach((e=>{console.info({[e.eventType]:e})})),console.info("%c------------ Echo bundle end ------------ **/","color: skyblue"))}({config:e,bundle:i,method:r}),i}function j({config:e}){const n=()=>{window.setTimeout((()=>(function({config:e}){const n=k({config:e});e.flags.pageViewDataState="complete",a(n)}({config:e}),function({config:e}){if(V>=3)return!1;const n=i();if(n.length>0){const r=q({config:e,batch:n,method:"fetch"});return B({config:e,bundle:r}).then((()=>{V=0})).catch((r=>(V+=1,a([...i(),...n]),a(d({config:e,eventType:t.NETWORK_ERROR,eventData:{errorMsg:r.message,tries:`${V} of 3`}})))))}return!1}({config:e}))),e.delaySendingPageViewDataMS)};return{start:()=>{"complete"==document.readyState?n():window.addEventListener("load",n)}}}const J=({config:e})=>{let n=0;const r={};function o(o){const i=m(o.filename),s=function({event:e}){return{errorMsg:e.message,errorCol:e.colno,errorLine:e.lineno,message:e.message,colno:e.colno,lineno:e.lineno,stack:e.error&&e.error.stack}}({event:o});s.errorUrl=i.href,s.filename=i.href,n+=1;const c=`${s.message} @ ${s.filename}:${s.lineno}:${s.colno}`,u=r[c]||0;if(r[c]=u+1,u>0)return window.console&&window.console.log(`Repeated error (${u} times): ${c}`);const f=d({config:e,eventType:t.ERROR,eventData:s});return window.console&&window.console.error("Error:",f),a(f)}return{start:()=>window.addEventListener("error",o)}};function Y({config:e}){function n(n){const r=d({config:e,eventType:t.CUSTOM_EVENT_FOR_DATABASE,eventData:n.detail});return e.sendNonEssentialEvents&&a(r)}const r=t.CUSTOM_EVENT_FOR_CLIENT;return{start:()=>window.addEventListener(r,n),stop:()=>window.removeEventListener(r,n)}}function W({config:e,triggeredBy:r}){let o=[];if(e.flags.pageViewDataState==n){let n="partial";const i=k({config:e,eventType:t.PARTIAL_PAGEVIEW,triggeredBy:r});e.flags.pageViewDataState=n,o=o.concat(i)}return o=[...o,...i()],o.length>0&&function({config:e,bundle:n}){return navigator.sendBeacon?function({config:e,bundle:n}){return navigator.sendBeacon(e.url,new Blob([JSON.stringify(n)],{type:"application/json; charset=UTF-8"}))}({config:e,bundle:n}):B({config:e,bundle:n})}({config:e,bundle:q({config:e,batch:o,method:navigator.sendBeacon?"sendBeacon/json":"fetch"})})}const z=({config:e})=>{let n="hidden"===document.visibilityState?0:1/0;const r=()=>n,o=e=>{n=Math.min(n,e.timeStamp)};let i=()=>!1;const s=function({config:e,getFirstHiddenTime:n}){if(A().perf.timeline<2)return()=>!1;const r=[];let o,i;function s(e){(e.renderTime||e.loadTime)<n()&&(i=function(e){const n={};return n.time=e.renderTime||e.loadTime,n.id=e.element&&e.element.id,n.tagName=e.element&&e.element.tagName,n.xPath=e.element&&((t=e.element)&&t.id?`//*[@id="${t.id}"]`:function(e){let n=[];for(;e&&e.nodeType==Node.ELEMENT_NODE;e=e.parentNode){let t=0,r=!1;for(let n=e.previousSibling;n;n=n.previousSibling)n.nodeType!=Node.DOCUMENT_TYPE_NODE&&n.nodeName==e.nodeName&&++t;for(let n=e.nextSibling;n&&!r;n=n.nextSibling)n.nodeName==e.nodeName&&(r=!0);let o=(e.prefix?e.prefix+":":"")+e.localName,i=t||r?"["+(t+1)+"]":"";n.splice(0,0,o+i)}return n.length?"/"+n.join("/"):null}(t)),n.area=e.size,e.url&&(n.url=e.url),n;var t}(e),r.unshift(i),r.length>3&&r.pop())}const c=new PerformanceObserver((e=>{e.getEntries().forEach(s)}));return c.observe({type:"largest-contentful-paint",buffered:!0}),function(){if(c.takeRecords().forEach(s),i!==o)return o=i,a(d({config:e,eventType:t.LARGEST_CONTENTFUL_PAINT,eventData:{lcp:i,lcpHistory:r,...i}}))}}({config:e,getFirstHiddenTime:r});function c(){if("hidden"===document.visibilityState)return i(),s(),W({config:e,triggeredBy:t.VISIBILITY_CHANGE})}return e.sendNonEssentialEvents&&(function({config:e,getFirstHiddenTime:n}){if(A().perf.timeline<=1)return!1;function r({name:r,entryType:o,startTime:i,duration:s,processingStart:c,processingEnd:u,cancelable:f}){if(i<n())return a(d({config:e,eventType:t.FIRST_INPUT_DELAY,eventData:{name:r,fid:c-i,entryType:o,startTime:i,duration:s,processingStart:c,processingEnd:u,cancelable:f}}))}new PerformanceObserver((e=>{e.getEntries().forEach(r)})).observe({type:"first-input",buffered:!0})}({config:e,getFirstHiddenTime:r}),function({config:e,getFirstHiddenTime:n}){if(A().perf.timeline<=1)return!1;function r(r){if(r.startTime<n())return a(d({config:e,eventType:t.PAINT,eventData:{name:r.name,entryType:r.entryType,startTime:r.startTime,duration:r.duration}}))}new PerformanceObserver((e=>{e.getEntries().forEach(r)})).observe({type:"paint",buffered:!0})}({config:e,getFirstHiddenTime:r}),i=function({config:e}){if(A().perf.timeline<2)return()=>!1;let n,r=0;function o(e){e.hadRecentInput||(r+=e.value)}const i=new PerformanceObserver((e=>{e.getEntries().forEach(o)}));return i.observe({type:"layout-shift",buffered:!0}),function(){return r!==n&&(n=r,i.takeRecords().forEach(o),a(d({config:e,eventType:t.CUMULATIVE_LAYOUT_SHIFT,eventData:{cls:r}})))}}({config:e})),{start:()=>{document.addEventListener("visibilitychange",c,!0),document.addEventListener("visibilitychange",o,{once:!0})}}},H=({config:e})=>{function n(){return W({config:e,triggeredBy:t.UNLOAD})}return{start:()=>window.addEventListener("unload",n)}};let G;function Q({config:e={}}){if(!e.url||!e.app)throw new Error("Missing config.url or config.app");const n=g((()=>JSON.parse(sessionStorage.getItem("echo_config"))))||{},t={...w,...e,...n,eventDataDefaults:y,flags:v};return t.sendNonEssentialEvents=function({suppliedRand:e,rate:n=100}){const t=100*Math.random();return(e||t)<=n}({rate:l({pct:t.nonEssentialEventSampleRatePct})}),t.sendNonEssentialEvents&&(G.set(Y,"active",!0),G.set(O,"active",!0),e.sendResourceData&&G.set(C,"active",!0)),G.mergeConfig(t),G.serialize().forEach((([e,n])=>{const r=e({config:t});void 0!==n&&!0!==n||r.start()})),{version:"3.10.0"}}Q.version="3.10.0",Q.listen=e=>(Array.isArray(e)?e.forEach((e=>G.add(e))):G.add(e),Q),(Q.setupListeners=()=>{G=s(),Q.listen([{fn:z},{fn:H},{fn:J,key:"sendErrors",data:!1},{fn:j,key:"sendPageViewData",data:!1},{fn:C,active:!1},{fn:Y,active:!1},{fn:O,active:!1}])})();const Z=Q,K={kty:"RSA",e:"AQAB",alg:"RSA-OAEP-256",ext:!0,n:"qfmYlIcQaNUEjDU1r7DiPA4Jd_ldpf5b9hrw5JPY9X88_xgU1-ztkhElD9oej-m4qh66fIoYTFo0TzMtdmpWssOZoWTqDzqy5WEzPnYRtPrpoK3UcUigwFH1fsBSQQeTWi3ALlo3CrmOCPTDg9ZK2wPUXsykCaViBdeZZCn3rkuJ2mNjYt-T83fb4TxVLLZLjJfq_RYlileHDvugnb-44SBFZUBxj14GCYS4mwbT1vCgxnr777C3Qv9GKyfDmLAQsISAGMw2sp_Wcy9hxcO41ME1ngS6GnQT5ZJZWTCtMb2GmGt7ZPzYLSfNasM3R0UU_CaJU61gxAqnR4MmjCTWQQ",d:"HMiRmAVPOBFqlbuk_b18ciMGY3Ss8SEjvYdOZ8bJpLkJQUF4th__Ew8oMYkER-aSSOyvM8vG1Zco6IiIGFdlmxwYdgY6xJ1yEfnlzZv836Ll0Tnekdh0sFywr-gthamcwFajBrZsP7qwXL_mI_sz7ea2Hd-Vn7SL5uVdqmKY-MC3Tqo0dUWeDlNjYxcRh3hqO6kYCjkFNa4WB9pXwk_LKU7L_tQa4KgSqH1gsI-zI1M6OgEs5EfiPI1sxqiVxEypalsHQkGBYW-xnZLS47wfaW-SBkKw4Yr-UlEcAPHl9c5bpU0tOL8spQZiSDXq0E2el5nXVJpCh7Cgi5nAx2Qj4Q",p:"0kK96xalugusjH5zafNaMMP8_aY7w4YZ530JT0EOfoxB3FDLK8JeuUlRouB7OnkEvTk-4Ecn0m0yFI0-bTmQz1jyhuIJt3sp0wxiEcs0N5Rf2tFbDuyE6ZFr6gkhNSrHl9DtFe5aL2qNiOoOFJnEfAfhA3c3Su8OESEdeDyZ39U",q:"zvNfdUPT6Nq0bx2Gyz2PLqpy46qzdWB6zeP3CFDwNqlXh4mLhCgu4VY6WM9ALRyh_emEeOiY-52SS65NzvJTw0eBU-5D0fXJcju_mYzgKuXjU-3owRaANxPl4qXHzRsdNK5JDYhvJB56iwdSwNJOwGrH7GhlfzRGEsD8n8CBPr0",dp:"NgfSl_u84J8pWv0PmXVggtGKTIAQMYFfXL4jy0rzd4-BSSU14GvVPZXatZkr8W2xyxJP1wBR-l_3E5LsLNMzJCU-RW0GhDDRIZu4A8yNAY9ORoOv-5jJ2t90tLJd5zS0D44vrogOgsrFzh4fOin9dMXti59yBP6DReGVmhUwkXU",dq:"tfQq6LpTFbc8zzlBq24bdqcsTllmYXwLXPzi1K_9E8I-EA_x16dQ2JRsxmqp_T_geZOYAopW_1siJmJBTQOoe9hhr_6cKH0WudYodoPzECSBg-h4LVRwNHzNMUIa8o21Vv0pg7mCJlqZ2aT9sET4Mptv3b5IBthaB-Ef_AFQYW0",qi:"J8wPdRkByjtA96D8SKjqsUuO9SRfDiJ5dJr6W2X6hjd5W-KKoMknppUFpGoPH66zTADys9biKQ5FLab8BtVWhuFyb-QLs7pWz-fHrpuCgGL3pWA0cH_BUvQIMA4JSlnV9Mb4Vtfd49FrCSPE4jxXUdQqrgcgs0jFwY-o8Nbs7Vo"},X={kty:"RSA",e:"AQAB",alg:"RSA-OAEP-256",ext:!0,n:"qfmYlIcQaNUEjDU1r7DiPA4Jd_ldpf5b9hrw5JPY9X88_xgU1-ztkhElD9oej-m4qh66fIoYTFo0TzMtdmpWssOZoWTqDzqy5WEzPnYRtPrpoK3UcUigwFH1fsBSQQeTWi3ALlo3CrmOCPTDg9ZK2wPUXsykCaViBdeZZCn3rkuJ2mNjYt-T83fb4TxVLLZLjJfq_RYlileHDvugnb-44SBFZUBxj14GCYS4mwbT1vCgxnr777C3Qv9GKyfDmLAQsISAGMw2sp_Wcy9hxcO41ME1ngS6GnQT5ZJZWTCtMb2GmGt7ZPzYLSfNasM3R0UU_CaJU61gxAqnR4MmjCTWQQ"};const $=e=>n=>{console.log(n);const r=new CustomEvent(t.CUSTOM_EVENT_FOR_CLIENT,{detail:{message:n.message,id:e,type:"error"}});window.dispatchEvent(r)},ee=e=>performance.getEntriesByName(e).pop().duration,ne=(e="")=>{let n=null;const t=(document.cookie||"").split(";");for(let r=0;r<t.length;r++){const o=(t[r]||"").trim();if(o.substring(0,e.length+1)===e+"="){n=decodeURIComponent(o.substring(e.length+1));break}}if(n)try{n=JSON.parse(n)}catch(e){}return n},te=e=>(["pageUrl","referer"].forEach((n=>{e[n]&&(e[n]=(e=>{const n=`(.*/order/(?:${["guest","detail","incidentfee","tradeinshippinginstructions","tradeininstructions","cancel","ship","edit"].join("|")})/)(?:[^?]*)`;return new URL(e).search&&(e=e.replace(/(.*\?)(?:.*)/,"$1<query>")),(e=e.replace(new RegExp(n),"$1<wo>")).replace(/\/([^/])+@([^/])+\/?/g,"/<email>@<domain>/")})(e[n]))})),e),re=e=>Object.keys(e).reduce(((n,t)=>[...n,...oe(e[t],t)]),[]).reduce(((e,[n,t])=>({...e,[t]:n})),{}),oe=(e,n)=>Array.isArray(e)?e.reduce(((e,t,r)=>[...e,...oe(t,`${n}_${r}`)]),[]):e&&"object"==typeof e?Object.keys(e).reduce(((t,r)=>[...t,...oe(e[r],`${n}_${r}`)]),[]):[[e,n]],ie=e=>[...document.querySelectorAll(e)],ae=()=>{const e={};return ie("script").forEach((n=>{const t=(n.src||"").match(/(^|\/)(rs(-\w+)?)\//);t&&(e[t[2]]=!0)})),Object.keys(e)},se=/https?:\/\/(?:www|epp|store|store-int|storeint|secure+.*).apple.com.*?\//;Z.listen({fn:({config:e})=>({start:()=>{window.addEventListener(t.ECHO_FEATURE,(n=>{a(d({config:e,eventType:t.CUSTOM_EVENT_FOR_DATABASE,eventData:n.detail}))}))}})}),window.ECHO_CONFIG&&function({config:e,metadata:n}){const r={transforms:[re,te,e=>((e,{metadata:n}={})=>e.eventType===t.PAGE_VIEW?{...e,asDc:ne("as_dc"),audit:[["echo",()=>Z.version],["recon",e=>e.document.querySelector("[data-recon-global]")?"undef":void 0],["jquery",e=>e.jQuery?e.jQuery.fn&&e.jQuery.fn.jquery||"undef":void 0],["can",e=>e.can?e.can.VERSION||"undef":void 0],["coherent",e=>e.coherent&&e.coherent.version],["react",e=>e.React&&e.React.version]].filter((([,e])=>e(window))).reduce(((e,[n,t])=>({...e,[n]:{version:[t(window)]}})),{}),cookies:document.cookie.split("; ").map((e=>e.substr(0,e.indexOf("=")))),pageId:window.s&&window.s.pageName||"",pageShopPath:window.location.href.split("/shop")[1]||window.location.href.split("/search")[1]||"/",pixelRatio:Math.round(100*window.devicePixelRatio)/100||0,pluginCount:window.navigator.plugins?window.navigator.plugins.length:0,pxro:ne("pxro")||"null",rsNames:ae(),screenHeight:window.screen.height||0,screenWidth:window.screen.width||0,scripts:ie("script[src]").length,styles:ie("link[rel=stylesheet]").length,validPageUrl:se.test(window.location.href),windowInnerHeight:window.innerHeight||0,windowInnerWidth:window.innerWidth||0,windowOrientation:window.screen.orientation?window.screen.orientation.angle:"orientation"in window&&window.orientation||0,windowOuterHeight:window.outerHeight||0,windowOuterWidth:window.outerWidth||0,...n}:e)(e,{metadata:n})]};Z({config:{...e,...r}}),(e=>!!g((()=>sessionStorage.getItem("crypto_reported")),e))(e)||(function(){const{ECHO_FEATURE:e}=t;(function(e,n,t){if(!crypto||!crypto.subtle)return Promise.resolve({exists:!1,passed:!1});const r="1234567891234567",{encrypt:o,decrypt:i}=function(e,n,t){const r=(n,t)=>crypto.subtle.importKey("jwk",n,e,!1,[t]).catch($("crypto.subtle.importKey"));return{decrypt:n=>r(t,"decrypt").then((t=>crypto.subtle.decrypt(e,t,n))).then((e=>function(e){const n=[];for(let t=0;t<e.byteLength;t++)n.push(String.fromCharCode(e[t]));return n.join("")}(new Uint8Array(e)))).catch($("crypto.subtle.decrypt")),encrypt:t=>r(n,"encrypt").then((n=>crypto.subtle.encrypt(e,n,function(e){const n=new Uint8Array(e.length);for(let t=0;t<e.length;t++)n[t]=e.charCodeAt(t);return n}(t)))).then((e=>new Uint8Array(e))).catch($("crypto.subtle.encrypt"))}}(e,n,t);return performance.mark("encrypt_start"),o(r).then((e=>(performance.measure("encrypt","encrypt_start"),performance.mark("decrypt_start"),i(e)))).then((n=>(performance.measure("decrypt","decrypt_start"),Promise.resolve({exists:!0,passed:r===n,algorithm:e.name,encryptTime:ee("encrypt"),decryptTime:ee("decrypt")}))))})({name:"RSA-OAEP",modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:{name:"SHA-256"}},X,K).then((n=>{window.dispatchEvent(new CustomEvent(e,{detail:n}))}))}(),(e=>{g((()=>sessionStorage.setItem("crypto_reported","1")),e)})(e))}(window.ECHO_CONFIG)})(),Echo={}.default})();