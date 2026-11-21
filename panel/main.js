(()=>{var b="openchamber.sdk",C=1;var kt=`
:root {
  /* Quiet at rest like the app's own thumbs; hover gives a clear grab target. */
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 18%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 36%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [data-oc-scrolling] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [data-oc-scrolling] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [data-oc-scrolling]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [data-oc-scrolling] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;function pt(o){let _=o.documentElement;if(_.hasAttribute("data-oc-scrollbar-activity"))return;_.setAttribute("data-oc-scrollbar-activity","");let c=new WeakMap;o.addEventListener("scroll",(E)=>{let T=E.target===o?_:E.target;if(!(T instanceof Element))return;if(!T.hasAttribute("data-oc-scrolling"))T.setAttribute("data-oc-scrolling","");let S=c.get(T);if(S!==void 0)clearTimeout(S);c.set(T,setTimeout(()=>{c.delete(T),T.removeAttribute("data-oc-scrolling")},1000))},{capture:!0,passive:!0})}var ac=`(${pt.toString()})(document);`;var It=128,Rt=65536;var yo=128;var Fo=65536;var Ut=8000,xt=192000,at=120000;var b_=(o)=>{let _=[],c=0,E=0;return{push:(T)=>{_.push(T),E+=T.length;while(E-c>o&&_.length>1){let S=_.shift();E-=S?.length??0,c=0}},pull:(T)=>{let S=0;while(S<T.length&&_.length>0){let A=_[0],O=Math.min(T.length-S,A.length-c);if(T.set(A.subarray(c,c+O),S),S+=O,c+=O,c>=A.length)_.shift(),E-=A.length,c=0}T.fill(0,S)},clear:()=>{_.length=0,c=0,E=0},get size(){return E-c}}};var N_=/^[a-z][a-z0-9-]{0,39}$/;var C_=(o)=>Object(o)===o&&!Array.isArray(o),Mt=(o,_)=>Object.keys(o).every((c)=>_.includes(c)),$_=(o)=>String(o)===o&&o.length>=1&&o.length<=60,h_=(o)=>String(o)===o&&o.length>=1&&o.length<=80,G_=(o)=>{if(!Array.isArray(o)||o.length>4)return!1;let _=new Set;for(let c of o){if(!C_(c)||!N_.test(c.id)||!$_(c.label))return!1;if(c.disabled!==void 0&&c.disabled!==!0&&c.disabled!==!1)return!1;if(_.has(c.id))return!1;if(_.add(c.id),c.kind==="button"){if(!Mt(c,["kind","id","label","disabled"]))return!1;continue}if(c.kind!=="select"||!Mt(c,["kind","id","label","value","options","disabled"]))return!1;if(!h_(c.value)||!Array.isArray(c.options)||c.options.length<1||c.options.length>16)return!1;let E=new Set;for(let T of c.options){if(!C_(T)||!Mt(T,["value","label"])||!h_(T.value)||!$_(T.label)||E.has(T.value))return!1;E.add(T.value)}if(!E.has(c.value))return!1}return!0};var l_=["{id}","{segment}","{segments+}"];var Er=new Set(l_);var g_=["turn-finished","turn-failed","permission-asked","question-asked","turn-started","session-created","session-archived","session-deleted"];var nr=new Set(g_);var Bo=20000000,Ho=256;var st=(o)=>("bytes"in o)?o.bytes.byteLength:o.content.length,L_=(o,_)=>{if(o.path!==_.path||o.readOnly!==_.readOnly)return!1;if(o.encoding==="text"||_.encoding==="text")return o.encoding==="text"&&_.encoding==="text"&&o.content===_.content;if(o.bytes.byteLength!==_.bytes.byteLength)return!1;for(let c=0;c<o.bytes.byteLength;c+=1)if(o.bytes[c]!==_.bytes[c])return!1;return!0};var V_=/^[A-Za-z0-9_-]{1,80}$/;var X_=["left","right","top","bottom"];var P_=(o,_=0,c={remaining:16000})=>{if(--c.remaining<0||_>=32)return!1;if(o===null)return!0;let E=Array.isArray(o)?o:Object(o)===o?Object.values(o):[];for(let T of E)if(!P_(T,_+1,c))return!1;return!0},bt=(o)=>{if(o===null||o===!0||o===!1)return!0;if(Array.isArray(o))return Object.keys(o).every((_)=>/^(0|[1-9]\d*)$/.test(_)&&Number(_)<o.length)&&o.every(bt);if(Object(o)===o){let _=Object.getPrototypeOf(o);return(_===null||_===Object.prototype)&&Object.values(o).every(bt)}return String(o)===o||Number.isFinite(o)},Ct=(o)=>{try{if(String(o.id)!==o.id||!V_.test(o.id)||!Number.isFinite(o.anchor.x)||Math.abs(o.anchor.x)>1e5||!Number.isFinite(o.anchor.y)||Math.abs(o.anchor.y)>1e5||!Number.isFinite(o.anchor.width)||!Number.isFinite(o.anchor.height)||o.anchor.width<=0||o.anchor.height<=0||o.anchor.width>1e5||o.anchor.height>1e5||!Number.isInteger(o.width)||o.width<160||o.width>640||!Number.isInteger(o.height)||o.height<48||o.height>480||o.side!==void 0&&!X_.includes(o.side)||o.focus!==void 0&&o.focus!==!0&&o.focus!==!1||!P_(o.data)||!bt(o.data))return!1;return JSON.stringify(o.data).length<=16000}catch{return!1}};var ht=2000;var D_=["file","directory","other","missing"],Nt=(o)=>Boolean(o&&"sessionId"in o),Gt=(o)=>Boolean(o&&"sent"in o&&!("sessionId"in o));var u_=/^[0-9a-f]{7,64}$/i,lt=(o)=>u_.test(o),Qo=500,Yo=32000,W_=16000,w_=128,z_=200,K_=2000,y_=16000,F_=80,B_=200,H_=16000;var Q_=2000;var gt=20000,jo=1024,Zo=2000000;var Jo=64000,eo=8000,Lt=4000;var Vt=960000;var Y_=999,j_=1e4,Po=500,Z_=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],J_=["stopped","starting","ready","failed"],sc=new Set(Z_),e_=(o)=>sc.has(o),q_=(o)=>o&&e_(o)?o:"HOST_REJECTED",ao=(o)=>{if(o===void 0)return!1;if(o===null||o===!0||o===!1)return!0;if(String(o)===o)return!0;if(Number(o)===o)return Number.isFinite(o);if(Array.isArray(o))return o.every(ao);if(Object(o)===o)return Object.values(o).every(ao);return!1},v_=(o)=>ao(o)&&JSON.stringify(o).length<=H_,m_=(o)=>o?.trim().slice(0,B_)??"",Mo=(o)=>{let _=o.id.trim().slice(0,w_),c=o.title.trim().slice(0,z_),E=o.url.trim().slice(0,K_),T=o.text?.trim().slice(0,y_),S=o.author?.trim().slice(0,F_),A=o.kind==="pull"?"pull":"issue",O={providerId:o.providerId.trim(),id:_,title:c||_,url:E,kind:A};if(T)O.text=T;if(S)O.author=S;if(A==="pull"){let d=m_(o.branches?.head),x=m_(o.branches?.base);if(d&&x)O.branches={head:d,base:x}}if(v_(o.data))O.data=o.data;return O},Xt=(o)=>{let _=Mo(o);if(o.projectId)_.projectId=o.projectId;if(o.navigation)_.navigation=o.navigation;if(o.worktree)_.worktree=o.worktree;return _},Pt=(o)=>{let _={text:o.text.trim().slice(0,W_)};if(o.send)_.send=!0;return _},mt=(o)=>{if(o===null||!Number.isFinite(o))return null;return Math.min(Y_,Math.max(0,Math.round(o)))},Dt=(o)=>{if(!Number.isFinite(o))return 0;return Math.min(j_,Math.max(0,Math.ceil(o)))};var so=(o)=>o.length>0&&o.length<=jo&&!o.includes("\x00")&&!o.includes("\\");var qo=(o)=>{if(!o.startsWith("/")||o.includes("\x00")||o.includes("\\")||o.includes("://"))return!1;if(o.length>Q_)return!1;return!o.split("/").some((c)=>c==="."||c==="..")},bc=new Set(J_),ut=(o)=>Boolean(o&&"status"in o&&bc.has(String(o.status))&&!("body"in o)),vo=(o)=>Boolean(o&&"status"in o&&"body"in o&&Number.isInteger(o.status)),Wt=(o)=>Boolean(o&&"content"in o&&String(o.content)===o.content),wt=(o)=>Boolean(o&&"written"in o&&o.written===!0),zt=(o)=>Boolean(o&&"entries"in o&&Array.isArray(o.entries)),Cc=new Set(D_),Kt=(o)=>Boolean(o&&"kind"in o&&"size"in o&&Cc.has(String(o.kind))&&Number.isFinite(o.size)),yt=(o)=>Boolean(o&&"text"in o&&String(o.text)===o.text&&!("status"in o)),$c=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","service-event","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late","microphone-audio","microphone-ended"]),hc=(o)=>Object(o)===o?o:null,$t=(o)=>String(o)===o&&o.length>0,Nc=(o)=>{if(!$t(o.id))return null;if(o.ok===!0){let _={channel:b,v:C,type:"result",id:o.id,ok:!0};if(Object(o.payload)===o.payload)_.payload=o.payload;return _}if(o.ok===!1&&$t(o.error))return{channel:b,v:C,type:"result",id:o.id,ok:!1,error:o.error,code:q_($t(o.code)?o.code:void 0)};return null},Ft=(o)=>{let _=hc(o);if(!_||_.channel!==b||_.v!==C)return null;if(_.type==="result")return Nc(_);if(!$c.has(String(_.type))||Object(_.payload)!==_.payload)return null;return _};var oc=(o)=>("key"in o)&&("metaKey"in o)&&("ctrlKey"in o),Gc=(o)=>(o.metaKey||o.ctrlKey)&&!o.altKey&&!o.shiftKey&&o.key.toLowerCase()==="s";class p extends Error{code;constructor(o,_){super(_);this.name="HostRequestError",this.code=o}}var tc=()=>Promise.reject(new p("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),ot=()=>Promise.reject(new p("BAD_PATH",`File path must be 1 to ${jo} characters without NUL or backslash.`)),tt=(o)=>{if(o===void 0)return;if(Object(o)!==o||Array.isArray(o)||o.scope!==void 0&&o.scope!=="instance"&&o.scope!=="device")throw new p("HOST_REJECTED",'Storage scope must be "instance" or "device".');return o.scope==="device"?"device":void 0},U=(o)=>{return o.value+=1,`oc-${o.value}`},Bt=(o={})=>{let _=o.target??("window"in globalThis?window:null);if(!_)throw new p("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let c=o.acceptSource??((t)=>t===_.parent),E=o.requestTimeoutMs??gt,T=new Set,S=new Set,A=new Set,O=new Set,d=new Set,x=new Set,a=new Set,s=new Set,y=new Set,F=new Set,P=new Set,B=new Set,l=[],g=null,G=null,Q=new Set,v=new Set,co=null,po=null,Lo=!1,ro=new Map,fo=new Map,Ao=new Map,J=!1,R={value:0},I=null,To=null,Vo=!1,Xo=!1,A_=null,e=null,O_=(t)=>{if(!t)return null;return{sessionId:t.id,phase:t.busy?"started":"completed"}},Y=(t)=>{_.parent.postMessage(t,"*")},i_=()=>{if(J||_.parent===_||B.size===0||I?.features?.lateGenerateResults!==!0)return;Y({channel:b,v:C,type:"generate-late-listen"})},L=(t,r)=>{for(let k of t)try{k(r)}catch(i){console.error(i)}},k_=(t)=>{if(!(t instanceof MessageEvent))return;if(!c(t.source))return;let r=Ft(t.data);if(!r)return;if(r.type==="workspace"){let i=fo.get(r.payload.subscriptionId);if(i)L([i],r.payload.snapshot);return}if(r.type==="shells"){let i=Ao.get(r.payload.subscriptionId);if(i)L([i],r.payload.snapshot);return}if(r.type==="microphone-audio"){e?.queue.push(r.payload.samples);return}if(r.type==="microphone-ended"){let i=e;if(!i)return;e=null,i.release(),L(i.endedListeners,r.payload.reason);return}if(r.type==="ready"){if(I=r.payload,To=O_(r.payload.session),L(T,r.payload),L(S,r.payload.directory),L(A,r.payload.session),To)L(O,To);if(L(d,r.payload.connection),L(x,r.payload.settings),L(a,r.payload.item),r.payload.block)L(s,r.payload.block);i_();return}if(r.type==="service-event"){L(y,r.payload);return}if(r.type==="generate-late"){if(B.size===0)l.push(r.payload);else L(B,r.payload);return}if(r.type==="directory"){if(I)I={...I,directory:r.payload.directory};L(S,r.payload.directory);return}if(r.type==="session"){if(I)I={...I,session:r.payload.session};if(!r.payload.session)To=null;else if(To?.sessionId!==r.payload.session.id)To=O_(r.payload.session);L(A,r.payload.session);return}if(r.type==="session-lifecycle"){To=r.payload,L(O,r.payload);return}if(r.type==="connection"){if(I)I={...I,connection:r.payload.connection};L(d,r.payload.connection);return}if(r.type==="settings"){if(I)I={...I,settings:r.payload.settings};L(x,r.payload.settings);return}if(r.type==="item"){if(I)I={...I,item:r.payload.item};L(a,r.payload.item);return}if(r.type==="status-control-event"){L(F,r.payload);return}if(r.type==="popover-closed"){L(P,r.payload);return}if(r.type==="action"){let i=(N)=>{if(!J)Y({channel:b,v:C,type:"action-result",id:r.id,payload:N})},h=G;if(!h){i({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>h(r.payload)).then(()=>i({ok:!0}),(N)=>{let V=(N instanceof Error?N.message:String(N)).trim();i({ok:!1,error:(V||"Action failed.").slice(0,Po)})});return}if(r.type==="file-open"){let i=r.payload;if(po&&L_(po,i))return;po=i,L(Q,r.payload);return}if(r.type==="file-saved"){L(v,r.payload.version);return}if(r.type==="file-snapshot"){let i=(V)=>{if(!J)Y({channel:b,v:C,type:"file-snapshot-result",id:r.id,payload:V})},h=(V)=>i({error:(V.trim()||"Could not read the edited file.").slice(0,Po)}),N=co;if(!N){h("This extension does not edit files.");return}Promise.resolve().then(()=>N(r.payload.purpose)).then((V)=>{if(st(V)>Bo){h(`The file is over ${Bo} ${"bytes"in V?"bytes":"characters"}.`);return}if(V.version.length>Ho){h(`The snapshot version is over ${Ho} characters.`);return}i({snapshot:"bytes"in V?{bytes:V.bytes,version:V.version}:{content:V.content,version:V.version}})},(V)=>h(V instanceof Error?V.message:String(V)));return}if(r.type==="resolve"){let i=(N)=>{Y({channel:b,v:C,type:"resolve-result",id:r.id,payload:N})},h=g;if(!h){i({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>h(r.payload)).then((N)=>i({item:N?Mo(N):null}),(N)=>{let V=(N instanceof Error?N.message:String(N)).trim();i({error:(V||"Command failed.").slice(0,Po)})});return}let k=ro.get(r.id);if(!k)return;if(clearTimeout(k.timer),ro.delete(r.id),r.ok){k.resolve(r.payload);return}k.reject(new p(r.code,r.error))};_.addEventListener("message",k_),Y({channel:b,v:C,type:"hello"});let H=(t,r=E)=>{if(J||_.parent===_)return Promise.reject(new p("HOST_UNAVAILABLE","No host frame. This page is not in an iframe."));return new Promise((k,i)=>{let h=setTimeout(()=>{ro.delete(t.id),i(new p("HOST_TIMEOUT","Host did not answer in time."))},r);ro.set(t.id,{resolve:k,reject:i,timer:h}),Y(t)})},z=(t)=>H(t).then(()=>{return}),u={channel:b,v:C},ft=(t)=>{if(!J&&_.parent!==_)Y(t)},p_=()=>ft({...u,type:"file-save"}),At=()=>{if(!J&&_.parent!==_)Y({...u,type:"microphone-close",id:U(R)})},Uc=async()=>{if(e)throw new p("HOST_REJECTED","The microphone is already open in this frame.");if(I?.features?.microphone!==!0)throw new p("UNSUPPORTED","This OpenChamber cannot share the microphone with extensions.");let t=globalThis.AudioContext;if(typeof t!=="function")throw new p("UNSUPPORTED","This frame has no Web Audio.");let r=new t;if(r.sampleRate<Ut||r.sampleRate>xt)throw r.close().catch(()=>{return}),new p("UNSUPPORTED",`Audio at ${r.sampleRate} Hz is not supported.`);let k=r.state==="suspended"?r.resume().catch(()=>{return}):void 0,i=b_(Math.round(r.sampleRate/4)),h=r.createScriptProcessor(1024,1,1);h.onaudioprocess=(oo)=>i.pull(oo.outputBuffer.getChannelData(0));let N=r.createMediaStreamDestination();h.connect(N);let V=new Set,xo={queue:i,endedListeners:V,release:()=>{h.onaudioprocess=null,h.disconnect(),i.clear();for(let oo of N.stream.getTracks())oo.stop();r.close().catch(()=>{return})}};e=xo;try{let oo=await H({...u,type:"microphone-open",id:U(R),payload:{sampleRate:r.sampleRate}},at);if(!oo||!("opened"in oo)||oo.opened!==!0)throw new p("HOST_REJECTED","Host did not open the microphone.");if(await k,e!==xo)throw new p("DISCONNECTED","The microphone closed while it was opening.")}catch(oo){if(e===xo)e=null;throw xo.release(),At(),oo}return{stream:N.stream,close:()=>{if(e!==xo)return;e=null,xo.release(),At()},onEnded:(oo)=>{return V.add(oo),()=>{V.delete(oo)}}}},I_=(t)=>{if(!oc(t)||!Gc(t))return;t.preventDefault(),p_()},R_=(t)=>{if(!oc(t)||t.key!=="Escape"||I?.surface!=="popover"||!I.popover)return;t.preventDefault(),M_(I.popover.id,"escape").catch(()=>{return})},wo=()=>{let t=I?.surface==="popover"?I.popover:void 0;if(!t)return;let r=Vo||Xo;if(A_===r)return;A_=r,s_(t.id,r).catch(()=>{return})},zo=()=>{if(I?.surface!=="popover"||Vo)return;Vo=!0,wo()},U_=(t)=>{if(I?.surface!=="popover"||t.relatedTarget!==null||!Vo)return;Vo=!1,wo()},x_=()=>{if(I?.surface!=="popover"||Xo)return;Xo=!0,wo()},a_=()=>{if(I?.surface!=="popover"||!Xo)return;Xo=!1,wo()},to=(t,r=1024)=>{if(!t.trim()||t.length>r)throw new p("HOST_REJECTED",`Identity must contain 1 to ${r} characters.`)},Ot=async(t)=>{if(t.kind!=="projects")to(t.projectId);let r=await H({...u,type:"workspace-read",id:U(R),payload:t});if(!r||!("kind"in r)||!("state"in r)||r.kind!==t.kind)throw new p("HOST_REJECTED","Host did not return workspace data.");return r},it=async(t,r)=>{if(t.kind!=="projects")to(t.projectId);let k=U(R);fo.set(k,r);try{await z({...u,type:"workspace-subscribe",id:U(R),payload:{subscriptionId:k,query:t}})}catch(i){if(fo.delete(k),!J)Y({...u,type:"workspace-unsubscribe",id:U(R),payload:{subscriptionId:k}});throw i}return()=>{if(!fo.delete(k)||J)return;Y({...u,type:"workspace-unsubscribe",id:U(R),payload:{subscriptionId:k}})}},xc=async(t,r)=>{if(t.kind==="session")to(t.sessionId);if(t.kind==="project")to(t.projectId);let k=U(R);Ao.set(k,r);try{await z({...u,type:"shells-subscribe",id:U(R),payload:{subscriptionId:k,scope:t}})}catch(i){if(Ao.delete(k),!J)Y({...u,type:"shells-unsubscribe",id:U(R),payload:{subscriptionId:k}});throw i}return()=>{if(!Ao.delete(k)||J)return;Y({...u,type:"shells-unsubscribe",id:U(R),payload:{subscriptionId:k}})}},Ko=async(t)=>{if("key"in t&&(t.key.length===0||t.key.length>It))throw new p("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(t.op==="set"&&!ao(t.value))throw new p("HOST_REJECTED","Storage values must be JSON.");if(t.op==="set"&&new TextEncoder().encode(JSON.stringify(t.value)).length>Rt)throw new p("HOST_REJECTED","Storage value exceeds 64 KiB.");if(t.scope==="device"&&I?.features?.deviceStorage!==!0)throw new p("UNSUPPORTED","This host does not support device storage.");let r=await H({...u,type:"storage",id:U(R),payload:t});if(!r||!("storage"in r)||r.op!==t.op)throw new p("HOST_REJECTED","Host did not return storage data.");return r},M_=(t,r)=>I?.features?.popovers!==!0&&!(I?.surface==="popover"&&I.popover?.id===t)?Promise.reject(new p("UNSUPPORTED","This host does not support popovers.")):z({...u,type:"popover-close",id:U(R),payload:r?{id:t,reason:r}:{id:t}}),s_=(t,r)=>I?.features?.popovers!==!0&&!(I?.surface==="popover"&&I.popover?.id===t)?Promise.reject(new p("UNSUPPORTED","This host does not support popovers.")):z({...u,type:"popover-anchor",id:U(R),payload:{id:t,active:r}});return _.addEventListener("keydown",R_,!0),_.addEventListener("pointerover",zo),_.addEventListener("pointermove",zo),_.addEventListener("pointerout",U_),_.addEventListener("focus",x_),_.addEventListener("blur",a_),{onAction:(t)=>{return G=t,()=>{if(G===t)G=null}},listProjects:async()=>{let t=await Ot({kind:"projects"});if(t.kind!=="projects")throw new p("HOST_REJECTED","Expected projects.");return t},listWorktrees:async(t)=>{let r=await Ot({kind:"worktrees",projectId:t});if(r.kind!=="worktrees")throw new p("HOST_REJECTED","Expected worktrees.");return r},listSessions:async(t)=>{let r=await Ot({kind:"sessions",projectId:t});if(r.kind!=="sessions")throw new p("HOST_REJECTED","Expected sessions.");return r},onProjects:(t)=>it({kind:"projects"},(r)=>{if(r.kind==="projects")t(r)}),onWorktrees:(t,r)=>it({kind:"worktrees",projectId:t},(k)=>{if(k.kind==="worktrees")r(k)}),onSessions:(t,r)=>it({kind:"sessions",projectId:t},(k)=>{if(k.kind==="sessions")r(k)}),onRunningShells:(t,r)=>xc(t,r),readShellOutput:async(t,r)=>{to(t,yo);let k=r?.cursor;if(k!==void 0&&(!Number.isInteger(k)||k<0))throw new p("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let i=r?.tailBytes;if(i!==void 0&&(!Number.isInteger(i)||i<1||i>Fo))throw new p("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${Fo}.`);let N=await H({...u,type:"shell-output",id:U(R),payload:{shellId:t,cursor:k,tailBytes:i}});if(!N||typeof N.output!=="string"||!Number.isFinite(N.cursor))throw new p("HOST_REJECTED","Host did not return shell output.");return N},stopShell:async(t)=>{if(to(t,yo),(await H({...u,type:"shell-stop",id:U(R),payload:{shellId:t}}))?.stopped!==!0)throw new p("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async(t)=>{to(t),await z({...u,type:"open-session",id:U(R),payload:{sessionId:t}})},storage:{get:async(t,r)=>{let k=tt(r),i={op:"get",key:t};if(k)i.scope=k;let h=await Ko(i);return h.op==="get"&&h.found?h.value:void 0},set:async(t,r,k)=>{let i=tt(k),h={op:"set",key:t,value:r};if(i)h.scope=i;await Ko(h)},delete:async(t,r)=>{let k=tt(r),i={op:"delete",key:t};if(k)i.scope=k;await Ko(i)},keys:async(t)=>{let r=tt(t),k={op:"keys"};if(r)k.scope=r;let i=await Ko(k);if(i.op!=="keys")throw new p("HOST_REJECTED","Expected storage keys.");return i.keys}},onReady:(t)=>{if(T.add(t),I)t(I);return()=>{T.delete(t)}},onDirectory:(t)=>{if(S.add(t),I)t(I.directory);return()=>{S.delete(t)}},onSession:(t)=>{if(A.add(t),I)t(I.session);return()=>{A.delete(t)}},onSessionLifecycle:(t)=>{if(O.add(t),To)t(To);return()=>{O.delete(t)}},onConnection:(t)=>{if(d.add(t),I)t(I.connection);return()=>{d.delete(t)}},onSettings:(t)=>{if(x.add(t),I)t(I.settings);return()=>{x.delete(t)}},onItem:(t)=>{if(a.add(t),I)t(I.item);return()=>{a.delete(t)}},onBlock:(t)=>{if(s.add(t),I?.block)t(I.block);return()=>{s.delete(t)}},onServiceEvent:(t)=>{return y.add(t),()=>{y.delete(t)}},onStatusControl:(t)=>{return F.add(t),()=>{F.delete(t)}},onPopoverClosed:(t)=>{return P.add(t),()=>{P.delete(t)}},setStatusControls:(t)=>{if(I?.features?.statusControls!==!0)return Promise.reject(new p("UNSUPPORTED","This host does not support status controls."));if(!G_(t))return Promise.reject(new p("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options."));return z({...u,type:"status-controls",id:U(R),payload:{controls:t}})},openPopover:(t)=>{if(I?.features?.popovers!==!0)return Promise.reject(new p("UNSUPPORTED","This host does not support popovers."));if(!Ct(t))return Promise.reject(new p("HOST_REJECTED","Popover requests need bounded geometry and JSON data."));return z({...u,type:"popover-open",id:U(R),payload:t})},closePopover:M_,setPopoverAnchorActive:s_,onResolve:(t)=>{return g=t,()=>{if(g===t)g=null}},toast:(t)=>{let r=t.message.trim();if(!r||r.length>Qo)return Promise.reject(new p("HOST_REJECTED",`Toast message must contain 1 to ${Qo} characters.`));if(t.copy&&t.copy!==!0&&(!t.copy.text.length||t.copy.text.length>Yo))return Promise.reject(new p("HOST_REJECTED",`Toast copy text must contain 1 to ${Yo} characters.`));return z({channel:b,v:C,type:"toast",id:U(R),payload:{...t,message:r}})},openUrl:(t)=>z({channel:b,v:C,type:"open-url",id:U(R),payload:{url:t}}),openCommit:(t)=>lt(t)?z({channel:b,v:C,type:"open-commit",id:U(R),payload:{sha:t}}):Promise.reject(new p("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),answerBlock:(t)=>z({channel:b,v:C,type:"block-answer",id:U(R),payload:{text:t.trim().slice(0,ht)}}),openSurface:(t)=>z({channel:b,v:C,type:"open-surface",id:U(R),payload:{surfaceId:t}}),writeClipboard:(t)=>z({channel:b,v:C,type:"clipboard-write",id:U(R),payload:{text:t}}),compose:(t)=>z({channel:b,v:C,type:"compose",id:U(R),payload:t}),attach:(t)=>z({channel:b,v:C,type:"attach",id:U(R),payload:Mo(t)}),startSession:async(t)=>{if(t.projectId!==void 0)to(t.projectId);let r=t.worktree;if(r&&r!==!0)if(r.kind==="existing")to(r.directory);else{if(r.name!==void 0)to(r.name,200);if(r.baseBranch!==void 0)to(r.baseBranch,200)}let k=await H({channel:b,v:C,type:"start-session",id:U(R),payload:Xt(t)},o.requestTimeoutMs??180000);if(!Nt(k))throw new p("HOST_REJECTED","Host did not return a session.");return k},prompt:(t)=>H({channel:b,v:C,type:"prompt",id:U(R),payload:Pt(t)}).then((r)=>{if(!Gt(r))throw new p("HOST_REJECTED","Host did not return a prompt result.");return r}),sessionLink:(t)=>z({channel:b,v:C,type:"session-link",id:U(R),payload:Mo(t)}),close:()=>z({channel:b,v:C,type:"close",id:U(R)}),oauthStart:()=>z({channel:b,v:C,type:"oauth-start",id:U(R)}),oauthDisconnect:()=>z({channel:b,v:C,type:"oauth-disconnect",id:U(R)}),request:(t)=>(qo(t.path)?H({channel:b,v:C,type:"request",id:U(R),payload:t}):tc()).then((r)=>{if(!vo(r))throw new p("HOST_REJECTED","Host request result was empty.");return r}),serviceRequest:(t)=>(qo(t.path)?H({channel:b,v:C,type:"service-request",id:U(R),payload:t}):tc()).then((r)=>{if(!vo(r))throw new p("HOST_REJECTED","Host service request result was empty.");return r}),serviceStatus:()=>H({channel:b,v:C,type:"service-status",id:U(R)}).then((t)=>{if(!ut(t))throw new p("HOST_REJECTED","Host did not return service status.");return t}),readFile:(t)=>(so(t)?H({channel:b,v:C,type:"file-read",id:U(R),payload:{path:t}}):ot()).then((r)=>{if(!Wt(r))throw new p("HOST_REJECTED","Host did not return file content.");return r}),writeFile:(t,r)=>{if(!so(t))return ot();if(r.length>Zo)return Promise.reject(new p("FILE_TOO_LARGE",`Content is over ${Zo} characters.`));return H({channel:b,v:C,type:"file-write",id:U(R),payload:{path:t,content:r}}).then((k)=>{if(!wt(k))throw new p("HOST_REJECTED","Host did not confirm the write.");return k})},listDir:(t)=>(so(t)?H({channel:b,v:C,type:"file-list",id:U(R),payload:{path:t}}):ot()).then((r)=>{if(!zt(r))throw new p("HOST_REJECTED","Host did not return directory entries.");return r}),stat:(t)=>(so(t)?H({channel:b,v:C,type:"file-stat",id:U(R),payload:{path:t}}):ot()).then((r)=>{if(!Kt(r))throw new p("HOST_REJECTED","Host did not return file status.");return r}),generate:(t)=>{let r=t.prompt.trim(),k=t.system?.trim();if(r.length===0||r.length>Jo)return Promise.reject(new p("HOST_REJECTED",`Prompt must be 1 to ${Jo} characters.`));if(k!==void 0&&(k.length===0||k.length>eo))return Promise.reject(new p("HOST_REJECTED",`System prompt must be 1 to ${eo} characters.`));let i=t.maxOutputTokens===void 0?void 0:Math.min(Lt,Math.max(1,Math.floor(t.maxOutputTokens)));if(i!==void 0&&!Number.isFinite(i))return Promise.reject(new p("HOST_REJECTED","maxOutputTokens must be a number."));let h={prompt:r};if(k!==void 0)h.system=k;if(i!==void 0)h.maxOutputTokens=i;return H({channel:b,v:C,type:"generate",id:U(R),payload:h},o.requestTimeoutMs??Vt).then((N)=>{if(!yt(N))throw new p("HOST_REJECTED","Host did not return generated text.");return N})},onLateGenerateResult:(t)=>{B.add(t);for(let r of l.splice(0))L([t],r);return i_(),()=>{B.delete(t)}},openMicrophone:Uc,setBadge:(t)=>z({channel:b,v:C,type:"badge",id:U(R),payload:{count:mt(t)}}),setHeight:(t)=>z({channel:b,v:C,type:"resize",id:U(R),payload:{height:Dt(t)}}),onFileOpen:(t)=>{if(Q.add(t),!Lo)Lo=!0,_.addEventListener("keydown",I_,!0);if(po)t(po);return()=>{Q.delete(t)}},onFileSnapshot:(t)=>{return co=t,()=>{if(co===t)co=null}},onFileSaved:(t)=>{return v.add(t),()=>{v.delete(t)}},reportFileChange:(t)=>ft({...u,type:"file-change",payload:{dirty:t.dirty,edited:t.edited}}),requestFileSave:p_,reportFileUnsupported:()=>ft({...u,type:"file-unsupported"}),dispose:()=>{for(let t of fo.keys())Y({...u,type:"workspace-unsubscribe",id:U(R),payload:{subscriptionId:t}});fo.clear();for(let t of Ao.keys())Y({...u,type:"shells-unsubscribe",id:U(R),payload:{subscriptionId:t}});if(Ao.clear(),e)At(),e.release(),e=null;if(J=!0,g=null,G=null,co=null,Q.clear(),v.clear(),Lo)_.removeEventListener("keydown",I_,!0);_.removeEventListener("message",k_),_.removeEventListener("keydown",R_,!0),_.removeEventListener("pointerover",zo),_.removeEventListener("pointermove",zo),_.removeEventListener("pointerout",U_),_.removeEventListener("focus",x_),_.removeEventListener("blur",a_);for(let t of ro.values())clearTimeout(t.timer),t.reject(new p("HOST_UNAVAILABLE","Host client was disposed."));ro.clear(),T.clear(),S.clear(),A.clear(),O.clear(),d.clear(),x.clear(),a.clear(),s.clear(),y.clear(),F.clear(),P.clear(),B.clear(),l.length=0}}};var _c=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var Cr=new Set(_c);var cc=["none","agent","user"];var hr=new Set(cc);var lc=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],gc=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],rc=(o,_)=>{_.style.colorScheme=o.mode;for(let[c,E]of lc)_.style.setProperty(c,o.tokens[E]);for(let[c,E,T]of gc){let S=o.tokens[T]??"";_.style.setProperty(c,S),_.style.setProperty(E,S)}_.style.setProperty("font-family",o.tokens.font),_.style.setProperty("font-size",o.tokens.fontSize??"0.875rem"),_.style.setProperty("line-height","1.45"),_.style.setProperty("color",o.tokens.foreground)},Ht=(o,_)=>{if(rc(o.theme,_),_.dataset)_.dataset.ocSurface=o.surface,_.dataset.ocTheme=o.theme.mode};var Lc={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},X=(o,_)=>`var(--${o}, var(--oc-${Lc[o]}, ${_}))`,So=X("surface-background","transparent"),ct=X("surface-elevated","transparent"),bo=X("surface-elevated-foreground","inherit"),q=X("surface-foreground","inherit"),W=X("surface-muted-foreground","gray"),Vc=X("surface-muted","transparent"),Io=X("interactive-border","currentColor"),j=X("interactive-hover","transparent"),Ro=X("interactive-active","transparent"),Qt=X("interactive-selection","transparent"),Yt=X("interactive-selection-foreground","inherit"),no=X("primary","currentColor"),jt=X("primary-text","inherit"),Zt=X("error-text","inherit"),Xc=X("font-sans","inherit"),Jt=X("font-mono","monospace"),Sc=X("radius","9px"),et=`calc(${Sc} - 2px)`,Ec=`calc(${Sc} - 4px)`,w=(o,_,c="transparent")=>`color-mix(in srgb, ${o} ${_}%, ${c})`,Tc=`background-image: linear-gradient(${j}, ${j});`,qt=(o,_="0.5px")=>`box-shadow: inset 0 0 0 ${_} ${o}, var(--oc-sdk-field-lift);`,vt="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",nc="box-shadow: var(--oc-sdk-lit);",o_=`inset 0 0.5px 0 0 ${w(q,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,Pc=`
:root {
  --oc-sdk-edge: ${w(q,16)};
  --oc-sdk-field-bg: ${ct};
  --oc-sdk-raised-bg: ${So};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${w(q,14)};
  --oc-sdk-field-bg: ${w(So,50,ct)};
  --oc-sdk-raised-bg: ${ct};
  --oc-sdk-field-lift: ${o_};
  --oc-sdk-raised-lift: ${o_};
  --oc-sdk-lit: ${o_};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,_t=(o)=>{let _=X(`status-${o}`,"currentColor");return`
.oc-sdk[data-tone="${o}"], .oc-sdk [data-tone="${o}"] { --oc-sdk-tone: ${_}; --oc-sdk-tone-text: ${X(`${o}-text`,"inherit")}; }`},n=(o)=>`calc(${o}rem / 14)`,mc=`
.oc-sdk { box-sizing: border-box; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: ${n(8)}; height: ${n(32)}; padding: 0 ${n(12)}; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; }
.oc-sdk-btn[data-size="sm"] { gap: ${n(6)}; height: ${n(28)}; padding: 0 ${n(10)}; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { gap: ${n(4)}; height: ${n(24)}; padding: 0 ${n(8)}; font-size: 0.75rem; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: ${n(14)}; height: ${n(14)}; }

.oc-sdk-field { display: flex; flex-direction: column; gap: ${n(4)}; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: ${n(32)}; padding: 0 ${n(10)}; border: 0; font-size: 0.875rem; line-height: 1.45; appearance: none; }
textarea.oc-sdk-input { height: auto; padding: ${n(8)} ${n(10)}; resize: vertical; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: ${n(34)}; padding-right: ${n(34)}; }
.oc-sdk-search-icon { position: absolute; left: ${n(11)}; top: 50%; transform: translateY(-50%); pointer-events: none; }
.oc-sdk-search-clear { position: absolute; right: ${n(6)}; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: ${n(24)}; height: ${n(24)}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: ${n(4)}; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: ${n(6)}; align-self: flex-start; width: auto; max-width: 100%; min-width: 0; height: ${n(28)}; padding: 0 ${n(10)}; border: 1px solid transparent; font-size: 0.8125rem; text-align: left; }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; }
.oc-sdk-popup { position: fixed; z-index: 50; display: flex; flex-direction: column; gap: ${n(2)}; min-width: ${n(160)}; max-width: calc(100vw - ${n(16)}); max-height: min(${n(320)}, calc(100vh - ${n(16)})); overflow: auto; padding: ${n(4)}; border: 1px solid transparent; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: ${n(2)} ${n(2)} ${n(4)}; }
.oc-sdk-popup-search .oc-sdk-input { height: ${n(28)}; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: ${n(8)}; width: 100%; padding: ${n(6)} ${n(8)}; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; }
.oc-sdk-option-check { flex: 0 0 auto; display: inline-flex; width: ${n(14)}; visibility: hidden; }
.oc-sdk-option[aria-selected="true"] > .oc-sdk-option-check { visibility: visible; }
.oc-sdk-popup-empty { padding: ${n(8)}; font-size: 0.8125rem; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: ${n(8)}; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: ${n(14)}; height: ${n(14)}; margin-top: ${n(3)}; border: 1px solid transparent; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: ${n(36)}; height: ${n(20)}; --oc-sdk-thumb-travel: ${n(16)}; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: ${n(2)}; left: ${n(2)}; width: ${n(16)}; height: ${n(16)}; }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; }

.oc-sdk-tabs { display: inline-flex; gap: ${n(2)}; padding: ${n(2)}; max-width: 100%; overflow: auto; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: ${n(6)}; height: ${n(28)}; padding: 0 ${n(10)}; border: 1px solid transparent; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: ${n(1)} ${n(6)}; font-size: ${n(11)}; font-weight: 500; line-height: ${n(16)}; white-space: nowrap; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: ${n(8)}; width: 100%; padding: ${n(6)} ${n(8)}; text-align: left; }
.oc-sdk-row-lead { flex: 0 0 auto; width: ${n(64)}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-list-empty { padding: ${n(16)} ${n(8)}; text-align: center; font-size: 0.8125rem; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${n(4)}; padding: ${n(40)} ${n(16)}; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; }
.oc-sdk-empty-action { margin-top: ${n(12)}; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: ${n(8)}; font-size: 0.8125rem; }
.oc-sdk-spinner-ring { width: ${n(16)}; height: ${n(16)}; border: 2px solid transparent; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: ${n(12)}; height: ${n(12)}; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: ${n(12)}; padding: ${n(8)} ${n(12)}; border: 1px solid transparent; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: ${n(2)}; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-banner-body { font-size: 0.8125rem; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: ${n(8)}; width: 100%; margin: ${n(8)} 0; font-size: 0.75rem; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: ${n(4)} 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: ${n(4)}; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: ${n(6)}; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; transform-origin: left; transition: transform 200ms ease-out; }
.oc-sdk-progress-value { display: inline-flex; align-items: center; gap: ${n(2)}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { font-weight: 600; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text img { display: block; max-width: 100%; margin: ${n(8)} 0; }

/* Under a finger the controls reach the app's touch sizes: rows and options 44px like its sheets, every other
   control at least 36px. Inputs keep 16px text, below which iOS zooms the page on focus. */
@media (pointer: coarse) {
  .oc-sdk-btn, .oc-sdk-input { height: ${n(40)}; }
  .oc-sdk-btn[data-size="sm"], .oc-sdk-btn[data-size="xs"], .oc-sdk-trigger, .oc-sdk-tab, .oc-sdk-popup-search .oc-sdk-input { height: ${n(36)}; }
  .oc-sdk-input, .oc-sdk-popup-search .oc-sdk-input { font-size: max(16px, 0.875rem); }
  .oc-sdk-search-clear { width: ${n(36)}; height: ${n(36)}; right: 0; }
  .oc-sdk-row, .oc-sdk-option { min-height: ${n(44)}; }
  .oc-sdk-check { min-height: ${n(36)}; padding: ${n(8)} 0; }
}
`,dc=`${Pc}
.oc-sdk { color: ${q}; font-family: ${Xc}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${Tc} }
.oc-sdk-mono { font-family: ${Jt}; }
.oc-sdk-muted { color: ${W}; }
${_t("success")}${_t("warning")}${_t("error")}${_t("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${no}; --oc-sdk-tone-text: ${jt}; }

.oc-sdk-btn { border-radius: ${et}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${Ec}; }
.oc-sdk-btn[data-variant="default"] { color: ${jt}; background: ${w(no,10,So)}; border-color: ${w(no,12)}; ${nc} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${w(no,16,So)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${w(no,22,So)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${Vc}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${j}, ${j}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${Ro}, ${Ro}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${bo}; ${vt} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${j}, ${j}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${Ro}, ${Ro}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${j}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${Ro}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${X("status-error","red")}; color: ${Zt}; background: ${w("var(--oc-sdk-tone)",7,So)}; border-color: ${w("var(--oc-sdk-tone)",12)}; ${nc} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${w("var(--oc-sdk-tone)",9,So)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${w("var(--oc-sdk-tone)",11,So)}; box-shadow: none; }

.oc-sdk-field-note { color: ${W}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${Zt}; }
.oc-sdk-input { border-radius: ${et}; background: var(--oc-sdk-field-bg); color: ${bo}; ${qt("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${W}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${j}, ${j}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${qt(w(q,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${qt(X("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${Jt}; }

.oc-sdk-search-icon { color: ${W}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${no}; }
.oc-sdk-search-clear { border-radius: ${Ec}; color: ${W}; }
.oc-sdk-search-clear:hover { background: ${j}; color: ${q}; }

.oc-sdk-trigger { border-radius: ${et}; background: var(--oc-sdk-raised-bg); color: ${bo}; ${vt} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${j}, ${j}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${Ro}, ${Ro}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${W}; }
.oc-sdk-trigger-chevron { color: ${W}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${bo}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${ct}; background-clip: padding-box; color: ${bo}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${j}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${Qt}; color: ${Yt}; }
.oc-sdk-option-check { color: ${q}; }
.oc-sdk-option[data-destructive="true"] { color: ${Zt}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${w(X("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${W}; }
.oc-sdk-popup-empty { color: ${W}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${Io}; border-radius: 4px; color: ${q}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${w(q,60,Io)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${Io}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${So}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${no}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(var(--oc-sdk-thumb-travel, 16px)); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${Tc} }
.oc-sdk-check-desc { color: ${W}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${w(q,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${W}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${q}; }
.oc-sdk-tab[aria-selected="true"] { color: ${Yt}; background: ${Qt}; border-color: ${Io}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${bo}; background: var(--oc-sdk-raised-bg); ${vt} }
.oc-sdk-tab-count { color: ${W}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${w(q,6)}; color: ${W}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${w("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${j}; }
.oc-sdk-row[aria-selected="true"] { background: ${Qt}; color: ${Yt}; }
.oc-sdk-row-lead { font-family: ${Jt}; color: ${W}; }
.oc-sdk-row-sub { color: ${W}; }
.oc-sdk-row-meta { color: ${W}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${W}; }

.oc-sdk-empty-body { color: ${W}; }

.oc-sdk-spinner { color: ${W}; }
.oc-sdk-spinner-ring { border-color: ${Io}; border-top-color: ${no}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${w("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${W}; }

.oc-sdk-separator { color: ${W}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${w(Io,40)}; }

.oc-sdk-progress-label { color: ${W}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${w(q,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${no}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${X("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${X("success-text","inherit")}; }

.oc-sdk-text a { color: ${jt}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${w(Io,60)}; }
`,m=`
${kt}
${mc}
${dc}`;var fc="oc-sdk-ui-style",Co=(o)=>{while(o.firstChild)o.removeChild(o.firstChild)},D=(o)=>{let _=document.getElementById(fc);if(_ instanceof HTMLStyleElement){if(_.textContent!==o)_.textContent=o;return}pt(document);let c=document.createElement("style");c.id=fc,c.textContent=o,document.head.appendChild(c)},M=(o,_)=>{let c=document.createElement(o);if(_)c.className=_;return c},Eo=(o)=>{let _=M("button",o);return _.type="button",_},K=(o,_)=>{let c=_??"";if(o.textContent!==c)o.textContent=c},Oo=(o,_,c)=>{if(c===void 0||c===null||c==="")o.removeAttribute(_);else if(o.getAttribute(_)!==c)o.setAttribute(_,c)};var Dc=()=>{let o=document.createElement("span");return o.className="oc-sdk-spinner-ring",o.setAttribute("aria-hidden","true"),o},_o=(o,_)=>{D(m);let c=_,E=Eo("oc-sdk oc-sdk-btn"),T=Dc(),S=document.createElement("span");E.append(S),o.append(E);let A=()=>{if(E.dataset.variant=c.variant??"default",E.dataset.size=c.size??"default",E.disabled=Boolean(c.disabled)||Boolean(c.loading),E.dataset.loading=c.loading?"true":"false",E.setAttribute("aria-busy",c.loading?"true":"false"),c.loading&&T.parentNode!==E)E.prepend(T);else if(!c.loading&&T.parentNode===E)T.remove();K(S,c.label)},O=()=>{if(c.disabled||c.loading)return;c.onClick()};return E.addEventListener("click",O),A(),{update:(d)=>{c={...c,...d},A()},dispose:()=>{E.removeEventListener("click",O),E.remove()}}};var rt=(o,_)=>{D(m);let c=_,E=M("label","oc-sdk oc-sdk-field"),T=M("span","oc-sdk-field-label"),S=c.multiline?M("textarea","oc-sdk-input"):M("input","oc-sdk-input"),A=M("span","oc-sdk-field-note");E.append(T,S,A),o.append(E);let O=()=>{if(K(T,c.label),T.hidden=!c.label,S instanceof HTMLInputElement)S.type=c.password?"password":"text";else S.rows=c.rows??3;if(S.value!==c.value)S.value=c.value;S.disabled=Boolean(c.disabled),Oo(S,"placeholder",c.placeholder),S.dataset.mono=c.mono?"true":"false";let x=Boolean(c.error);E.dataset.invalid=x?"true":"false",S.setAttribute("aria-invalid",x?"true":"false");let a=c.error??c.helper??"";K(A,a),A.hidden=a===""},d=()=>{c.onChange(S.value)};return S.addEventListener("input",d),O(),{update:(x)=>{c={...c,...x},O()},dispose:()=>{S.removeEventListener("input",d),E.remove()}}};var Ac="http://www.w3.org/2000/svg",uc={search:"M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z",chevron:"M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z",check:"M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z",close:"M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"},$o=(o,_,c)=>{let E=document.createElementNS(Ac,"svg");if(E.setAttribute("viewBox","0 0 24 24"),E.setAttribute("width",String(_)),E.setAttribute("height",String(_)),E.style.width=n(_),E.style.height=n(_),E.setAttribute("aria-hidden","true"),E.setAttribute("fill","currentColor"),c)E.setAttribute("class",c);let T=document.createElementNS(Ac,"path");return T.setAttribute("d",uc[o]),E.append(T),E};var ho=(o,_="vertical")=>{let[c,E]=_==="vertical"?["ArrowDown","ArrowUp"]:["ArrowRight","ArrowLeft"];if(o.key===c||o.ctrlKey&&o.key.toLowerCase()==="n")return"next";if(o.key===E||o.ctrlKey&&o.key.toLowerCase()==="p")return"previous";if(o.key==="Home")return"first";if(o.key==="End")return"last";return null},No=(o,_,c)=>{let E=o.filter((d)=>!d.disabled);if(E.length===0)return null;let T=E[0],S=E[E.length-1];if(c==="first"||!T||!S)return T?.id??null;if(c==="last")return S.id;let A=E.findIndex((d)=>d.id===_);if(A===-1)return c==="next"?T.id:S.id;return E[Math.min(E.length-1,Math.max(0,A+(c==="next"?1:-1)))]?.id??null};var Kc=(o,_,c)=>{D(m);let E=_,T=Eo("oc-sdk oc-sdk-check");T.setAttribute("role",c);let S=M("span",c==="switch"?"oc-sdk-check-thumb":"oc-sdk-check-box");if(c==="checkbox")S.append($o("check",12));let A=M("span","oc-sdk-check-text"),O=M("span","oc-sdk-check-label"),d=M("span","oc-sdk-check-desc");A.append(O,d),T.append(S,A),o.append(T);let x=()=>{T.setAttribute("aria-checked",E.checked?"true":"false"),T.disabled=Boolean(E.disabled),K(O,E.label),K(d,E.description),d.hidden=!E.description},a=()=>{if(!E.disabled)E.onChange(!E.checked)};return T.addEventListener("click",a),x(),{update:(s)=>{E={...E,...s},x()},dispose:()=>{T.removeEventListener("click",a),T.remove()}}};var t_=(o,_)=>Kc(o,_,"switch");var __=(o,_)=>{D(m);let c=_,E=M("div","oc-sdk oc-sdk-tabs");E.setAttribute("role","tablist"),o.append(E);let T=()=>{Co(E),E.dataset.track=c.trackBackground?"true":"false";for(let A of c.items){let O=Eo("oc-sdk-tab");O.setAttribute("role","tab");let d=A.id===c.activeId;O.setAttribute("aria-selected",d?"true":"false"),O.tabIndex=d?0:-1,O.dataset.id=A.id;let x=M("span");if(x.textContent=A.label,O.append(x),A.count!==void 0){let a=M("span","oc-sdk-tab-count");a.textContent=String(A.count),O.append(a)}O.addEventListener("click",()=>{if(A.id!==c.activeId)c.onChange(A.id)}),E.append(O)}},S=(A)=>{let O=ho(A,"horizontal");if(!O)return;let d=No(c.items,c.activeId,O);if(d&&d!==c.activeId){A.preventDefault(),c.onChange(d);let x=E.querySelector(`[data-id="${CSS.escape(d)}"]`);if(x instanceof HTMLElement)x.focus()}};return E.addEventListener("keydown",S),T(),{update:(A)=>{c={...c,...A},T()},dispose:()=>{E.removeEventListener("keydown",S),E.remove()}}};var c_=(o,_)=>{Oo(o,"data-tone",_&&_!=="neutral"?_:null)},Et=(o,_)=>{D(m);let c=_,E=M("span","oc-sdk oc-sdk-badge");o.append(E);let T=()=>{K(E,c.label),c_(E,c.tone)};return T(),{update:(S)=>{c={...c,...S},T()},dispose:()=>{E.remove()}}};var r_=(o,_)=>{D(m);let c=_,E=M("div","oc-sdk oc-sdk-empty"),T=M("h2","oc-sdk-empty-title"),S=M("p","oc-sdk-empty-body"),A=M("div","oc-sdk-empty-action");E.append(T,S,A),o.append(E);let O=null,d=()=>{if(K(T,c.title),K(S,c.body),S.hidden=!c.body,A.hidden=!c.action,!c.action){O?.dispose(),O=null;return}let x={label:c.action.label,onClick:c.action.onClick};if(O)O.update(x);else O=_o(A,{...x,variant:"outline",size:"sm"})};return d(),{update:(x)=>{c={...c,...x},d()},dispose:()=>{O?.dispose(),O=null,E.remove()}}};var E_=(o,_={})=>{D(m);let c=_,E=M("span","oc-sdk oc-sdk-spinner");E.setAttribute("role","status");let T=M("span","oc-sdk-spinner-ring");T.setAttribute("aria-hidden","true");let S=M("span");E.append(T,S),o.append(E);let A=()=>{E.dataset.size=c.size??"default",K(S,c.label),S.hidden=!c.label,E.setAttribute("aria-label",c.label??"Loading")};return A(),{update:(O)=>{c={...c,...O},A()},dispose:()=>{E.remove()}}};var Tt=(o,_)=>{D(m);let c=_,E=M("div","oc-sdk oc-sdk-banner"),T=M("div","oc-sdk-banner-text"),S=M("div","oc-sdk-banner-title"),A=M("div","oc-sdk-banner-body"),O=M("div","oc-sdk-banner-action");T.append(S,A),E.append(T,O),o.append(E);let d=null,x=()=>{if(E.dataset.tone=c.tone,E.setAttribute("role",c.tone==="error"||c.tone==="warning"?"alert":"status"),K(S,c.title),K(A,c.body),A.hidden=!c.body,O.hidden=!c.action,!c.action){d?.dispose(),d=null;return}let a={label:c.action.label,onClick:c.action.onClick};if(d)d.update(a);else d=_o(O,{...a,variant:"outline",size:"xs"})};return x(),{update:(a)=>{c={...c,...a},x()},dispose:()=>{d?.dispose(),d=null,E.remove()}}};var Go=(o)=>{if(!Number.isFinite(o))return 0;return Math.max(0,Math.min(100,o))};var nt=(o)=>{let _=Go(o);if(Math.abs(_-Math.round(_))<0.05)return`${Math.round(_)}%`;return`${_.toFixed(1)}%`},St=(o)=>{if(!Number.isFinite(o)||o<0)return"$0";if(o>=100)return`$${Math.round(o)}`;if(o>=10)return`$${o.toFixed(1)}`;return`$${o.toFixed(2)}`},Oc=(o)=>{if(!Number.isFinite(o)||o<=0)return"0";if(o>=1e9)return`${(o/1e9).toFixed(2)}B`;if(o>=1e6){let _=o/1e6;return _>=100?`${Math.round(_)}M`:`${_.toFixed(1)}M`}if(o>=1000)return`${Math.round(o/1000)}K`;return String(Math.round(o))},T_=(o,_=Date.now())=>{if(!o||!Number.isFinite(o)||o<=_)return"即将重置";let c=Math.max(0,Math.floor((o-_)/1000)),E=Math.floor(c/86400),T=Math.floor(c%86400/3600),S=Math.floor(c%3600/60);if(E>0)return`${E}d ${T}h`;if(T>0)return`${T}h ${S}m`;return`${Math.max(1,S)}m`},n_=(o)=>{let _=Go(o);if(_<=20)return"error";if(_<=50)return"warning";return"success"};var ic=(o)=>{let _=o.limit_requests>0?o.effective_remaining_requests/o.limit_requests*100:100;return(o.limit_tokens>0?o.effective_remaining_tokens/o.limit_tokens*100:100)<_-0.5};var kc=["gemini_5h","gemini_weekly","claude_5h","claude_weekly"],yc=()=>{if(document.getElementById("pq-styles"))return;let o=document.createElement("style");o.id="pq-styles",o.textContent=`
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: transparent;
      color: var(--foreground, #e5e7eb);
      font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
      font-size: var(--oc-font-size, 13px);
      line-height: 1.45;
    }
    .pq-wrap {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      max-width: 100%;
    }
    .pq-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .pq-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .pq-title {
      font-size: 1.05em;
      font-weight: 600;
      margin: 0;
      white-space: nowrap;
    }
    .pq-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .pq-card {
      background: var(--card, rgba(127, 127, 127, 0.08));
      border: 1px solid var(--border, rgba(127, 127, 127, 0.22));
      border-radius: var(--radius, 8px);
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .pq-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .pq-card-title {
      font-weight: 600;
      font-size: 0.95em;
      margin: 0;
    }
    .pq-muted {
      color: var(--muted-foreground, rgba(160, 160, 170, 0.9));
      font-size: 0.85em;
    }
    .pq-mono {
      font-family: var(--font-mono, ui-monospace, SFMono-Regular, monospace);
      font-variant-numeric: tabular-nums;
    }
    .pq-win-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .pq-win {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .pq-win-top {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
    }
    .pq-win-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pq-win-val {
      font-family: var(--font-mono, ui-monospace, monospace);
      font-variant-numeric: tabular-nums;
      font-size: 0.9em;
      white-space: nowrap;
    }
    .pq-bar-track {
      width: 100%;
      height: 6px;
      border-radius: 999px;
      background: var(--muted, rgba(127, 127, 127, 0.2));
      overflow: hidden;
    }
    .pq-bar-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.2s ease;
    }
    .pq-tone-success { background: var(--success, #22c55e); }
    .pq-tone-warning { background: var(--warning, #f59e0b); }
    .pq-tone-error { background: var(--destructive, #ef4444); }
    .pq-text-success { color: var(--success-text, var(--success, #22c55e)); }
    .pq-text-warning { color: var(--warning-text, var(--warning, #f59e0b)); }
    .pq-text-error { color: var(--error-text, var(--destructive, #ef4444)); }
    .pq-win-sub {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 0.8em;
      color: var(--muted-foreground, rgba(160, 160, 170, 0.9));
      flex-wrap: wrap;
    }
    .pq-chart-box {
      border-top: 1px solid var(--border, rgba(127, 127, 127, 0.16));
      padding-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .pq-chart-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .pq-chart-svg {
      width: 100%;
      height: 84px;
      display: block;
    }
    .pq-legend {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.8em;
      color: var(--muted-foreground, rgba(160, 160, 170, 0.9));
      flex-wrap: wrap;
    }
    .pq-legend-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 4px;
      vertical-align: middle;
    }
    .pq-model-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .pq-model-row {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 6px 8px;
      border-radius: 6px;
      background: var(--muted, rgba(127, 127, 127, 0.08));
    }
    .pq-model-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
    }
    .pq-model-name {
      font-weight: 500;
      font-size: 0.9em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pq-pill {
      display: inline-flex;
      align-items: center;
      padding: 1px 6px;
      border-radius: 999px;
      font-size: 0.75em;
      background: var(--border, rgba(127, 127, 127, 0.2));
      color: var(--muted-foreground, inherit);
      white-space: nowrap;
    }
    .pq-settings-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
      background: transparent;
      border: 0;
      padding: 0;
      width: 100%;
      color: inherit;
      font: inherit;
      text-align: left;
    }
    .pq-settings-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 6px;
      border-top: 1px solid var(--border, rgba(127, 127, 127, 0.16));
    }
    .pq-settings-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .pq-footer-note {
      font-size: 0.78em;
      color: var(--muted-foreground, rgba(160, 160, 170, 0.85));
    }
  `,document.head.appendChild(o)},f=(o,_,c)=>{let E=document.createElement(o);if(_)E.className=_;if(c!==void 0)E.textContent=c;return E},Fc=(o)=>{let _=f("div"),c=(o.series??[]).filter((l)=>Array.isArray(l.points)&&l.points.length>=2);if(c.length===0)return _.appendChild(f("div","pq-muted","暂无历史采样曲线")),_;let E=320,T=84,S=6,A=8,O=E-S*2,d=T-A*2,x=Number.POSITIVE_INFINITY,a=Number.NEGATIVE_INFINITY;for(let l of c)for(let g of l.points){if(g[0]<x)x=g[0];if(g[0]>a)a=g[0]}let s=Math.max(1,a-x),y={gemini_5h:"var(--primary, #3b82f6)",gemini_weekly:"var(--primary, #3b82f6)",claude_5h:"var(--success, #22c55e)",claude_weekly:"var(--success, #22c55e)"},F="http://www.w3.org/2000/svg",P=document.createElementNS(F,"svg");P.setAttribute("viewBox",`0 0 ${E} ${T}`),P.setAttribute("class","pq-chart-svg");for(let l of[100,50,20]){let g=A+d*(1-l/100),G=document.createElementNS(F,"line");G.setAttribute("x1",String(S)),G.setAttribute("x2",String(E-S)),G.setAttribute("y1",g.toFixed(1)),G.setAttribute("y2",g.toFixed(1)),G.setAttribute("stroke",l===20?"var(--destructive, #ef4444)":"var(--border, rgba(127,127,127,0.3))"),G.setAttribute("stroke-opacity",l===20?"0.4":"0.6"),G.setAttribute("stroke-dasharray","3 3"),G.setAttribute("stroke-width","1"),P.appendChild(G)}for(let l of c){let g=y[l.key]??"var(--info, #06b6d4)",G="",Q=null;for(let co=0;co<l.points.length;co+=1){let[po,Lo]=l.points[co],ro=Go(Lo),fo=S+(po-x)/s*O,Ao=A+d*(1-ro/100),J=Q!==null&&ro-Q>12;G+=`${co===0||J?"M":"L"}${fo.toFixed(1)},${Ao.toFixed(1)} `,Q=ro}let v=document.createElementNS(F,"path");v.setAttribute("d",G.trim()),v.setAttribute("fill","none"),v.setAttribute("stroke",g),v.setAttribute("stroke-width","2"),v.setAttribute("stroke-linecap","round"),v.setAttribute("stroke-linejoin","round"),P.appendChild(v)}_.appendChild(P);let B=f("div","pq-legend");for(let l of c){let g=f("span"),G=f("span","pq-legend-dot");G.style.background=y[l.key]??"var(--info, #06b6d4)",g.appendChild(G),g.appendChild(document.createTextNode(`${l.label} ${nt(l.remaining)}`)),B.appendChild(g)}return _.appendChild(B),_},io=Bt(),pc=document.querySelector("#root"),Ic=!1,Do=!1,lo=!1,$=null,dt="5h",mo=!1,go="http://127.0.0.1:18380",uo="",d_=!1,Uo=null,S_=[],Bc=()=>{for(let o of S_)try{o()}catch{}S_=[]},Z=(o)=>{return S_.push(()=>o.dispose()),o},f_=async(o,_,c={})=>{let E=await io.serviceRequest({method:o,path:_,...c.query?{query:c.query}:{},...c.body?{body:JSON.stringify(c.body)}:{}}),T=null;try{T=E.body?JSON.parse(E.body):null}catch{T=null}if(E.status<200||E.status>=300){let S=T&&typeof T==="object"&&"error"in T&&typeof T.error==="string"?T.error:`服务返回 HTTP ${E.status}`;throw Error(S)}return T},Wo=async(o=!1)=>{Do=!0,ko();try{let _=await f_("GET","/panel/state",{query:{force:o?"1":"0",window:dt,range:dt==="7d"?"7d":"24h"}});if($=_,!d_)go=_.config.url;if(_.errorCode==="unauthorized"||_.errorCode==="unreachable")mo=!0}catch(_){let c=_ instanceof p&&_.code==="NO_SERVICE"?"请先在 Settings → Extensions 中批准本扩展的本地服务权限。":_ instanceof Error?_.message:String(_);$={config:$?.config??{url:go,hasPasscode:!1,showAis:!0},snapshot:$?.snapshot??null,history:$?.history??null,error:c,errorCode:"unreachable",fetchedAtMs:Date.now()}}finally{Do=!1,ko()}},Hc=async(o)=>{if($)$={...$,config:{...$.config,showAis:o}},ko();try{$=await f_("POST","/panel/config",{body:{showAis:o}}),io.toast({kind:"success",message:o?"已开启 AIStudio 号池显示（Usage 页点击刷新后同步）":"已隐藏 AIStudio 号池（Usage 页点击刷新后同步）"})}catch(_){io.toast({kind:"error",message:_ instanceof Error?_.message:"切换失败"})}finally{ko()}},Rc=async(o=!1)=>{lo=!0,Uo={tone:"info",text:"正在测试连接..."},ko();try{let _=await f_("POST","/panel/test",{body:{url:go.trim()||"http://127.0.0.1:18380",...uo?{passcode:uo}:{},...o?{clearPasscode:!0}:{},showAis:$?.config.showAis??!0,save:!0}});if(!_.ok){Uo={tone:"error",text:_.message||"连接测试失败"},io.toast({kind:"error",message:_.message||"连接测试失败"});return}uo="",d_=!1,Uo={tone:"success",text:_.summary||"连接成功并已保存"},io.toast({kind:"success",message:_.summary||"配置已保存"}),await Wo(!0)}catch(_){let c=_ instanceof Error?_.message:String(_);Uo={tone:"error",text:c},io.toast({kind:"error",message:c})}finally{lo=!1,ko()}},Qc=(o)=>{let _=f("div","pq-card"),c=o.antigravity,E=f("div","pq-card-head");E.appendChild(f("h4","pq-card-title","Antigravity 号池"));let T=f("div");Z(Et(T,{label:c.online?`${c.summary?.active_accounts??c.accounts.length} 号在线`:"离线",tone:c.online?"success":"error"})),E.appendChild(T),_.appendChild(E);let S=c.accounts[0];if(!c.online||!S)return _.appendChild(f("div","pq-muted",c.status_message||"暂无活跃 Antigravity 账号数据")),_;let A=f("div","pq-win-list"),O=[...S.windows??[]].sort((s,y)=>{let F=kc.indexOf(s.key),P=kc.indexOf(y.key);return(F===-1?99:F)-(P===-1?99:P)});for(let s of O){let y=Go(s.remaining_percent),F=n_(y),P=f("div","pq-win"),B=f("div","pq-win-top");B.appendChild(f("span","pq-win-name",s.label||s.key)),B.appendChild(f("span",`pq-win-val pq-text-${F}`,`剩 ${nt(y)}`)),P.appendChild(B);let l=f("div","pq-bar-track"),g=f("div",`pq-bar-fill pq-tone-${F}`);g.style.width=`${y}%`,l.appendChild(g),P.appendChild(l);let G=f("div","pq-win-sub"),Q=s.has_current_usage&&s.current_cost>0?s.has_forecast&&s.forecast_cost>0?`已用 ${St(s.current_cost)} · 满额预测 ${St(s.forecast_cost)}`:`已用 ${St(s.current_cost)}`:"本轮暂无消耗";if(G.appendChild(f("span","pq-mono",Q)),s.reset_at_ms>0)G.appendChild(f("span","pq-mono",`重置 ${T_(s.reset_at_ms)}`));P.appendChild(G),A.appendChild(P)}_.appendChild(A);let d=f("div","pq-chart-box"),x=f("div","pq-chart-head");x.appendChild(f("span","pq-muted","周期剩余趋势"));let a=f("div");if(Z(__(a,{items:[{id:"5h",label:"5h / 24h"},{id:"7d",label:"7d 周期"}],activeId:dt,onChange:(s)=>{if(s!=="5h"&&s!=="7d")return;dt=s,Wo(!1)}})),x.appendChild(a),d.appendChild(x),$?.history)d.appendChild(Fc($.history));else d.appendChild(f("div","pq-muted","暂无历史趋势数据"));return _.appendChild(d),_},Yc=(o)=>{let _=f("div","pq-card"),c=o.aistudio,E=f("div","pq-card-head");E.appendChild(f("h4","pq-card-title","AIStudio2API 号池"));let T=f("div"),S=c.account_counts?.ready??0,A=c.account_counts?.enabled??0;if(Z(Et(T,{label:c.online?`${S}/${A} 号就绪`:"离线",tone:c.online?S===A?"success":"warning":"error"})),E.appendChild(T),_.appendChild(E),!c.online)return _.appendChild(f("div","pq-muted",c.status_message||"AIStudio2API 当前离线")),_;let O=f("div","pq-win-sub"),d=c.playground,x=c.build;if(O.appendChild(f("span","pq-mono",`PG ${d?.requests??0}次 · Build ${x?.requests??0}次`)),c.next_reset_ms>0)O.appendChild(f("span","pq-mono",`16:00 重置 · ${T_(c.next_reset_ms)}`));_.appendChild(O);let a=f("div","pq-model-list");for(let s of c.models??[]){let y=Go(s.effective_percent),F=s.available_accounts===0?"error":n_(y),P=f("div","pq-model-row"),B=f("div","pq-model-top");B.appendChild(f("span","pq-model-name",s.label||s.id));let l=f("div","pq-actions");if(s.eligible_accounts>0&&y<99.5)l.appendChild(f("span","pq-pill",ic(s)?"Token瓶颈":"次数瓶颈"));l.appendChild(f("span",`pq-win-val pq-text-${F}`,`${nt(y)}`)),B.appendChild(l),P.appendChild(B);let g=f("div","pq-bar-track"),G=f("div",`pq-bar-fill pq-tone-${F}`);G.style.width=`${y}%`,g.appendChild(G),P.appendChild(g);let Q=f("div","pq-win-sub");Q.appendChild(f("span","pq-mono",`可用 ${s.available_accounts}/${s.eligible_accounts} 号`)),Q.appendChild(f("span","pq-mono",`剩 ${s.effective_remaining_requests}次 / ${Oc(s.effective_remaining_tokens)}`)),P.appendChild(Q),a.appendChild(P)}return _.appendChild(a),_},jc=()=>{let o=f("div","pq-card"),_=$?.config.hasPasscode===!0,c=f("button","pq-settings-toggle");if(c.type="button",c.appendChild(f("span","pq-card-title","连接设置（看板地址与口令）")),c.appendChild(f("span","pq-muted",mo?"收起 ▲":"展开 ▼")),c.addEventListener("click",()=>{mo=!mo,ko()}),o.appendChild(c),!mo)return o.appendChild(f("div","pq-muted pq-mono",`${$?.config.url??go} · ${_?"已保存口令":"无口令"}`)),o;let E=f("div","pq-settings-body"),T=f("div"),S=Z(rt(T,{label:"看板地址 URL",value:go,placeholder:"http://127.0.0.1:18380 或 https://your-board.example.com",mono:!0,onChange:(a)=>{go=a,d_=!0,S.update({value:a})}}));E.appendChild(T);let A=f("div"),O=Z(rt(A,{label:"访问口令 (X-View-Passcode)",value:uo,password:!0,placeholder:_?"已保存口令（留空保存将保持原口令不变）":"若看板未设口令可留空",helper:"仅写入本机 0600 配置文件，不会回显给前端或暴露给对话上下文。",onChange:(a)=>{uo=a,O.update({value:a})}}));if(E.appendChild(A),Uo){let a=f("div");Z(Tt(a,{tone:Uo.tone,title:Uo.text})),E.appendChild(a)}let d=f("div","pq-settings-actions"),x=f("div");if(Z(_o(x,{label:lo?"测试中...":"测试并保存",size:"sm",loading:lo,disabled:lo,onClick:()=>void Rc(!1)})),d.appendChild(x),_){let a=f("div");Z(_o(a,{label:"清空口令",variant:"outline",size:"sm",disabled:lo,onClick:()=>void Rc(!0)})),d.appendChild(a)}return E.appendChild(d),o.appendChild(E),o},ko=()=>{Bc(),pc.innerHTML="";let o=f("div","pq-wrap"),_=f("div","pq-header"),c=f("div","pq-title-row");if(c.appendChild(f("h3","pq-title","Pool Quota")),Do&&!$){let d=f("div");Z(E_(d,{size:"sm"})),c.appendChild(d)}_.appendChild(c);let E=f("div","pq-actions"),T=f("div");if(Z(_o(T,{label:"刷新",variant:"outline",size:"xs",loading:Do,onClick:()=>void Wo(!0)})),E.appendChild(T),$?.config.url){let d=f("div");Z(_o(d,{label:"打开看板",variant:"ghost",size:"xs",onClick:()=>{if($?.config.url)io.openUrl($.config.url)}})),E.appendChild(d)}_.appendChild(E),o.appendChild(_);let S=f("div","pq-card"),A=f("div"),O=$?.config.showAis??!0;if(Z(t_(A,{label:"显示 AIStudio 号池",description:"同时控制顶栏/Usage 总卡、Work Status 与本面板是否展示 AIS 模型余量",checked:O,onChange:(d)=>void Hc(d)})),S.appendChild(A),o.appendChild(S),$?.error){let d=f("div");Z(Tt(d,{tone:$.errorCode==="unauthorized"?"warning":"error",title:$.errorCode==="unauthorized"?"需要访问口令":"看板连接异常",body:$.error})),o.appendChild(d)}if($?.snapshot){if(o.appendChild(Qc($.snapshot)),O)o.appendChild(Yc($.snapshot))}else if(!Do&&!$?.error){let d=f("div");Z(r_(d,{title:"尚未读取到号池数据",body:"请在下方连接设置中填写看板地址与访问口令后点击测试并保存。",action:{label:"重试",onClick:()=>void Wo(!0)}})),o.appendChild(d)}if(o.appendChild(jc()),$?.fetchedAtMs){let d=new Date($.fetchedAtMs).toLocaleTimeString();o.appendChild(f("div","pq-footer-note pq-mono",`上次更新：${d} · 原生总卡在 Settings → Usage 中可勾选置顶到顶栏`))}pc.appendChild(o)};yc();io.onReady((o)=>{if(Ht(o,document.documentElement),Ic)return;Ic=!0,ko(),Wo(!1)});})();
