(()=>{var h="openchamber.sdk",z=1;var mE=`
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
`;function yE(_){let T=_.documentElement;if(T.hasAttribute("data-oc-scrollbar-activity"))return;T.setAttribute("data-oc-scrollbar-activity","");let E=new WeakMap;_.addEventListener("scroll",(S)=>{let A=S.target===_?T:S.target;if(!(A instanceof Element))return;if(!A.hasAttribute("data-oc-scrolling"))A.setAttribute("data-oc-scrolling","");let f=E.get(A);if(f!==void 0)clearTimeout(f);E.set(A,setTimeout(()=>{E.delete(A),A.removeAttribute("data-oc-scrolling")},1000))},{capture:!0,passive:!0})}var cS=`(${yE.toString()})(document);`;var wE=128,uE=65536;var rE=128;var CE=65536;var qE=8000,aE=192000,sE=120000;var wT=(_)=>{let T=[],E=0,S=0;return{push:(A)=>{T.push(A),S+=A.length;while(S-E>_&&T.length>1){let f=T.shift();S-=f?.length??0,E=0}},pull:(A)=>{let f=0;while(f<A.length&&T.length>0){let k=T[0],I=Math.min(A.length-f,k.length-E);if(A.set(k.subarray(E,E+I),f),f+=I,E+=I,E>=k.length)T.shift(),S-=k.length,E=0}A.fill(0,f)},clear:()=>{T.length=0,E=0,S=0},get size(){return S-E}}};var sT=/^[a-z][a-z0-9-]{0,39}$/;var uT=(_)=>Object(_)===_&&!Array.isArray(_),lE=(_,T)=>Object.keys(_).every((E)=>T.includes(E)),qT=(_)=>String(_)===_&&_.length>=1&&_.length<=60,aT=(_)=>String(_)===_&&_.length>=1&&_.length<=80,lT=(_)=>{if(!Array.isArray(_)||_.length>4)return!1;let T=new Set;for(let E of _){if(!uT(E)||!sT.test(E.id)||!qT(E.label))return!1;if(E.disabled!==void 0&&E.disabled!==!0&&E.disabled!==!1)return!1;if(T.has(E.id))return!1;if(T.add(E.id),E.kind==="button"){if(!lE(E,["kind","id","label","disabled"]))return!1;continue}if(E.kind!=="select"||!lE(E,["kind","id","label","value","options","disabled"]))return!1;if(!aT(E.value)||!Array.isArray(E.options)||E.options.length<1||E.options.length>16)return!1;let S=new Set;for(let A of E.options){if(!uT(A)||!lE(A,["value","label"])||!aT(A.value)||!qT(A.label)||S.has(A.value))return!1;S.add(A.value)}if(!S.has(E.value))return!1}return!0};var vT=["{id}","{segment}","{segments+}"];var IO=new Set(vT);var eT=["turn-finished","turn-failed","permission-asked","question-asked","turn-started","session-created","session-archived","session-deleted"];var MO=new Set(eT);var $E=20000000,bE=256;var vE=(_)=>("bytes"in _)?_.bytes.byteLength:_.content.length,_o=(_,T)=>{if(_.path!==T.path||_.readOnly!==T.readOnly)return!1;if(_.encoding==="text"||T.encoding==="text")return _.encoding==="text"&&T.encoding==="text"&&_.content===T.content;if(_.bytes.byteLength!==T.bytes.byteLength)return!1;for(let E=0;E<_.bytes.byteLength;E+=1)if(_.bytes[E]!==T.bytes[E])return!1;return!0};var Eo=/^[A-Za-z0-9_-]{1,80}$/;var To=["left","right","top","bottom"];var oo=(_,T=0,E={remaining:16000})=>{if(--E.remaining<0||T>=32)return!1;if(_===null)return!0;let S=Array.isArray(_)?_:Object(_)===_?Object.values(_):[];for(let A of S)if(!oo(A,T+1,E))return!1;return!0},eE=(_)=>{if(_===null||_===!0||_===!1)return!0;if(Array.isArray(_))return Object.keys(_).every((T)=>/^(0|[1-9]\d*)$/.test(T)&&Number(T)<_.length)&&_.every(eE);if(Object(_)===_){let T=Object.getPrototypeOf(_);return(T===null||T===Object.prototype)&&Object.values(_).every(eE)}return String(_)===_||Number.isFinite(_)},_T=(_)=>{try{if(String(_.id)!==_.id||!Eo.test(_.id)||!Number.isFinite(_.anchor.x)||Math.abs(_.anchor.x)>1e5||!Number.isFinite(_.anchor.y)||Math.abs(_.anchor.y)>1e5||!Number.isFinite(_.anchor.width)||!Number.isFinite(_.anchor.height)||_.anchor.width<=0||_.anchor.height<=0||_.anchor.width>1e5||_.anchor.height>1e5||!Number.isInteger(_.width)||_.width<160||_.width>640||!Number.isInteger(_.height)||_.height<48||_.height>480||_.side!==void 0&&!To.includes(_.side)||_.focus!==void 0&&_.focus!==!0&&_.focus!==!1||!oo(_.data)||!eE(_.data))return!1;return JSON.stringify(_.data).length<=16000}catch{return!1}};var So=/^[0-9a-f]{7,64}$/i,Oo=(_)=>So.test(_),ET=255,Ao=(_,T,E)=>({openCommit:(S)=>Oo(S)?_({channel:h,v:z,type:"open-commit",id:T(),payload:{sha:S}}):E("Commit id must be 7 to 64 hex characters."),openWalkthrough:({base:S})=>{let A=S.trim();if(!A||A.length>ET)return E(`Base must contain 1 to ${ET} characters.`);return _({channel:h,v:z,type:"open-walkthrough",id:T(),payload:{base:A}})}});var oT=2000;var fo=["file","directory","other","missing"],ST=(_)=>Boolean(_&&"sessionId"in _),OT=(_)=>Boolean(_&&"sent"in _&&!("sessionId"in _));var pE=500,NE=32000,ko=16000,Uo=128,Io=200,Ro=2000,Mo=16000,no=80,xo=200,ro=16000;var Co=2000;var AT=20000,GE=1024,tE=2000000;var XE=64000,dE=8000,cT=4000;var fT=960000;var $o=999,bo=1e4,cE=500,po=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],No=["stopped","starting","ready","failed"],kS=new Set(po),Go=(_)=>kS.has(_),to=(_)=>_&&Go(_)?_:"HOST_REJECTED",u_=(_)=>{if(_===void 0)return!1;if(_===null||_===!0||_===!1)return!0;if(String(_)===_)return!0;if(Number(_)===_)return Number.isFinite(_);if(Array.isArray(_))return _.every(u_);if(Object(_)===_)return Object.values(_).every(u_);return!1},Xo=(_)=>u_(_)&&JSON.stringify(_).length<=ro,co=(_)=>_?.trim().slice(0,xo)??"",q_=(_)=>{let T=_.id.trim().slice(0,Uo),E=_.title.trim().slice(0,Io),S=_.url.trim().slice(0,Ro),A=_.text?.trim().slice(0,Mo),f=_.author?.trim().slice(0,no),k=_.kind==="pull"?"pull":"issue",I={providerId:_.providerId.trim(),id:T,title:E||T,url:S,kind:k};if(A)I.text=A;if(f)I.author=f;if(k==="pull"){let R=co(_.branches?.head),n=co(_.branches?.base);if(R&&n)I.branches={head:R,base:n}}if(Xo(_.data))I.data=_.data;return I},kT=(_)=>{let T=q_(_);if(_.projectId)T.projectId=_.projectId;if(_.navigation)T.navigation=_.navigation;if(_.worktree)T.worktree=_.worktree;return T},UT=(_)=>{let T={text:_.text.trim().slice(0,ko)};if(_.send)T.send=!0;return T},IT=(_)=>{if(_===null||!Number.isFinite(_))return null;return Math.min($o,Math.max(0,Math.round(_)))},RT=(_)=>{if(!Number.isFinite(_))return 0;return Math.min(bo,Math.max(0,Math.ceil(_)))};var a_=(_)=>_.length>0&&_.length<=GE&&!_.includes("\x00")&&!_.includes("\\");var VE=(_)=>{if(!_.startsWith("/")||_.includes("\x00")||_.includes("\\")||_.includes("://"))return!1;if(_.length>Co)return!1;return!_.split("/").some((E)=>E==="."||E==="..")},US=new Set(No),MT=(_)=>Boolean(_&&"status"in _&&US.has(String(_.status))&&!("body"in _)),LE=(_)=>Boolean(_&&"status"in _&&"body"in _&&Number.isInteger(_.status)),nT=(_)=>Boolean(_&&"content"in _&&String(_.content)===_.content),xT=(_)=>Boolean(_&&"written"in _&&_.written===!0),rT=(_)=>Boolean(_&&"entries"in _&&Array.isArray(_.entries)),IS=new Set(fo),CT=(_)=>Boolean(_&&"kind"in _&&"size"in _&&IS.has(String(_.kind))&&Number.isFinite(_.size)),$T=(_)=>Boolean(_&&"text"in _&&String(_.text)===_.text&&!("status"in _)),RS=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","service-event","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late","microphone-audio","microphone-ended"]),MS=(_)=>Object(_)===_?_:null,TT=(_)=>String(_)===_&&_.length>0,nS=(_)=>{if(!TT(_.id))return null;if(_.ok===!0){let T={channel:h,v:z,type:"result",id:_.id,ok:!0};if(Object(_.payload)===_.payload)T.payload=_.payload;return T}if(_.ok===!1&&TT(_.error))return{channel:h,v:z,type:"result",id:_.id,ok:!1,error:_.error,code:to(TT(_.code)?_.code:void 0)};return null},bT=(_)=>{let T=MS(_);if(!T||T.channel!==h||T.v!==z)return null;if(T.type==="result")return nS(T);if(!RS.has(String(T.type))||Object(T.payload)!==T.payload)return null;return T};var Vo=(_)=>("key"in _)&&("metaKey"in _)&&("ctrlKey"in _),xS=(_)=>(_.metaKey||_.ctrlKey)&&!_.altKey&&!_.shiftKey&&_.key.toLowerCase()==="s";class p extends Error{code;constructor(_,T){super(T);this.name="HostRequestError",this.code=_}}var Lo=()=>Promise.reject(new p("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),PE=()=>Promise.reject(new p("BAD_PATH",`File path must be 1 to ${GE} characters without NUL or backslash.`)),DE=(_)=>{if(_===void 0)return;if(Object(_)!==_||Array.isArray(_)||_.scope!==void 0&&_.scope!=="instance"&&_.scope!=="device")throw new p("HOST_REJECTED",'Storage scope must be "instance" or "device".');return _.scope==="device"?"device":void 0},P=(_)=>{return _.value+=1,`oc-${_.value}`},pT=(_={})=>{let T=_.target??("window"in globalThis?window:null);if(!T)throw new p("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let E=_.acceptSource??((o)=>o===T.parent),S=_.requestTimeoutMs??AT,A=new Set,f=new Set,k=new Set,I=new Set,R=new Set,n=new Set,N=new Set,r=new Set,L=new Set,Y=new Set,t=new Set,V=new Set,j=[],Q=null,K=null,a=new Set,W=new Set,B=null,v=null,A_=!1,R_=new Map,E_=new Map,J=new Map,c_=!1,d={value:0},b=null,N_=null,Y_=!1,r_=!1,y_=null,f_=null,Q_=(o)=>{if(!o)return null;return{sessionId:o.id,phase:o.busy?"started":"completed"}},T_=(o)=>{T.parent.postMessage(o,"*")},j_=()=>{if(c_||T.parent===T||V.size===0||b?.features?.lateGenerateResults!==!0)return;T_({channel:h,v:z,type:"generate-late-listen"})},g=(o,O)=>{for(let $ of o)try{$(O)}catch(C){console.error(C)}},AE=(o)=>{if(!(o instanceof MessageEvent))return;if(!E(o.source))return;let O=bT(o.data);if(!O)return;if(O.type==="workspace"){let C=E_.get(O.payload.subscriptionId);if(C)g([C],O.payload.snapshot);return}if(O.type==="shells"){let C=J.get(O.payload.subscriptionId);if(C)g([C],O.payload.snapshot);return}if(O.type==="microphone-audio"){f_?.queue.push(O.payload.samples);return}if(O.type==="microphone-ended"){let C=f_;if(!C)return;f_=null,C.release(),g(C.endedListeners,O.payload.reason);return}if(O.type==="ready"){if(b=O.payload,N_=Q_(O.payload.session),g(A,O.payload),g(f,O.payload.directory),g(k,O.payload.session),N_)g(I,N_);if(g(R,O.payload.connection),g(n,O.payload.settings),g(N,O.payload.item),O.payload.block)g(r,O.payload.block);j_();return}if(O.type==="service-event"){g(L,O.payload);return}if(O.type==="generate-late"){if(V.size===0)j.push(O.payload);else g(V,O.payload);return}if(O.type==="directory"){if(b)b={...b,directory:O.payload.directory};g(f,O.payload.directory);return}if(O.type==="session"){if(b)b={...b,session:O.payload.session};if(!O.payload.session)N_=null;else if(N_?.sessionId!==O.payload.session.id)N_=Q_(O.payload.session);g(k,O.payload.session);return}if(O.type==="session-lifecycle"){N_=O.payload,g(I,O.payload);return}if(O.type==="connection"){if(b)b={...b,connection:O.payload.connection};g(R,O.payload.connection);return}if(O.type==="settings"){if(b)b={...b,settings:O.payload.settings};g(n,O.payload.settings);return}if(O.type==="item"){if(b)b={...b,item:O.payload.item};g(N,O.payload.item);return}if(O.type==="status-control-event"){g(Y,O.payload);return}if(O.type==="popover-closed"){g(t,O.payload);return}if(O.type==="action"){let C=(Z)=>{if(!c_)T_({channel:h,v:z,type:"action-result",id:O.id,payload:Z})},F=K;if(!F){C({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>F(O.payload)).then(()=>C({ok:!0}),(Z)=>{let m=(Z instanceof Error?Z.message:String(Z)).trim();C({ok:!1,error:(m||"Action failed.").slice(0,cE)})});return}if(O.type==="file-open"){let C=O.payload;if(v&&_o(v,C))return;v=C,g(a,O.payload);return}if(O.type==="file-saved"){g(W,O.payload.version);return}if(O.type==="file-snapshot"){let C=(m)=>{if(!c_)T_({channel:h,v:z,type:"file-snapshot-result",id:O.id,payload:m})},F=(m)=>C({error:(m.trim()||"Could not read the edited file.").slice(0,cE)}),Z=B;if(!Z){F("This extension does not edit files.");return}Promise.resolve().then(()=>Z(O.payload.purpose)).then((m)=>{if(vE(m)>$E){F(`The file is over ${$E} ${"bytes"in m?"bytes":"characters"}.`);return}if(m.version.length>bE){F(`The snapshot version is over ${bE} characters.`);return}C({snapshot:"bytes"in m?{bytes:m.bytes,version:m.version}:{content:m.content,version:m.version}})},(m)=>F(m instanceof Error?m.message:String(m)));return}if(O.type==="resolve"){let C=(Z)=>{T_({channel:h,v:z,type:"resolve-result",id:O.id,payload:Z})},F=Q;if(!F){C({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>F(O.payload)).then((Z)=>C({item:Z?q_(Z):null}),(Z)=>{let m=(Z instanceof Error?Z.message:String(Z)).trim();C({error:(m||"Command failed.").slice(0,cE)})});return}let $=R_.get(O.id);if(!$)return;if(clearTimeout($.timer),R_.delete(O.id),O.ok){$.resolve(O.payload);return}$.reject(new p(O.code,O.error))};T.addEventListener("message",AE),T_({channel:h,v:z,type:"hello"});let M=(o,O=S)=>{if(c_||T.parent===T)return Promise.reject(new p("HOST_UNAVAILABLE","No host frame. This page is not in an iframe."));return new Promise(($,C)=>{let F=setTimeout(()=>{R_.delete(o.id),C(new p("HOST_TIMEOUT","Host did not answer in time."))},O);R_.set(o.id,{resolve:$,reject:C,timer:F}),T_(o)})},x=(o)=>M(o).then(()=>{return}),X={channel:h,v:z},H=(o)=>{if(!c_&&T.parent!==T)T_(o)},e=()=>H({...X,type:"file-save"}),w=()=>{if(!c_&&T.parent!==T)T_({...X,type:"microphone-close",id:P(d)})},M_=async()=>{if(f_)throw new p("HOST_REJECTED","The microphone is already open in this frame.");if(b?.features?.microphone!==!0)throw new p("UNSUPPORTED","This OpenChamber cannot share the microphone with extensions.");let o=globalThis.AudioContext;if(typeof o!=="function")throw new p("UNSUPPORTED","This frame has no Web Audio.");let O=new o;if(O.sampleRate<qE||O.sampleRate>aE)throw O.close().catch(()=>{return}),new p("UNSUPPORTED",`Audio at ${O.sampleRate} Hz is not supported.`);let $=O.state==="suspended"?O.resume().catch(()=>{return}):void 0,C=wT(Math.round(O.sampleRate/4)),F=O.createScriptProcessor(1024,1,1);F.onaudioprocess=(C_)=>C.pull(C_.outputBuffer.getChannelData(0));let Z=O.createMediaStreamDestination();F.connect(Z);let m=new Set,w_={queue:C,endedListeners:m,release:()=>{F.onaudioprocess=null,F.disconnect(),C.clear();for(let C_ of Z.stream.getTracks())C_.stop();O.close().catch(()=>{return})}};f_=w_;try{let C_=await M({...X,type:"microphone-open",id:P(d),payload:{sampleRate:O.sampleRate}},sE);if(!C_||!("opened"in C_)||C_.opened!==!0)throw new p("HOST_REJECTED","Host did not open the microphone.");if(await $,f_!==w_)throw new p("DISCONNECTED","The microphone closed while it was opening.")}catch(C_){if(f_===w_)f_=null;throw w_.release(),w(),C_}return{stream:Z.stream,close:()=>{if(f_!==w_)return;f_=null,w_.release(),w()},onEnded:(C_)=>{return m.add(C_),()=>{m.delete(C_)}}}},o_=(o)=>{if(!Vo(o)||!xS(o))return;o.preventDefault(),e()},k_=(o)=>{if(!Vo(o)||o.key!=="Escape"||b?.surface!=="popover"||!b.popover)return;o.preventDefault(),mT(b.popover.id,"escape").catch(()=>{return})},i=()=>{let o=b?.surface==="popover"?b.popover:void 0;if(!o)return;let O=Y_||r_;if(y_===O)return;y_=O,yT(o.id,O).catch(()=>{return})},U_=()=>{if(b?.surface!=="popover"||Y_)return;Y_=!0,i()},G_=(o)=>{if(b?.surface!=="popover"||o.relatedTarget!==null||!Y_)return;Y_=!1,i()},S_=()=>{if(b?.surface!=="popover"||r_)return;r_=!0,i()},H_=()=>{if(b?.surface!=="popover"||!r_)return;r_=!1,i()},t_=(o,O=1024)=>{if(!o.trim()||o.length>O)throw new p("HOST_REJECTED",`Identity must contain 1 to ${O} characters.`)},iE=async(o)=>{if(o.kind!=="projects")t_(o.projectId);let O=await M({...X,type:"workspace-read",id:P(d),payload:o});if(!O||!("kind"in O)||!("state"in O)||O.kind!==o.kind)throw new p("HOST_REJECTED","Host did not return workspace data.");return O},BE=async(o,O)=>{if(o.kind!=="projects")t_(o.projectId);let $=P(d);E_.set($,O);try{await x({...X,type:"workspace-subscribe",id:P(d),payload:{subscriptionId:$,query:o}})}catch(C){if(E_.delete($),!c_)T_({...X,type:"workspace-unsubscribe",id:P(d),payload:{subscriptionId:$}});throw C}return()=>{if(!E_.delete($)||c_)return;T_({...X,type:"workspace-unsubscribe",id:P(d),payload:{subscriptionId:$}})}},AS=async(o,O)=>{if(o.kind==="session")t_(o.sessionId);if(o.kind==="project")t_(o.projectId);let $=P(d);J.set($,O);try{await x({...X,type:"shells-subscribe",id:P(d),payload:{subscriptionId:$,scope:o}})}catch(C){if(J.delete($),!c_)T_({...X,type:"shells-unsubscribe",id:P(d),payload:{subscriptionId:$}});throw C}return()=>{if(!J.delete($)||c_)return;T_({...X,type:"shells-unsubscribe",id:P(d),payload:{subscriptionId:$}})}},xE=async(o)=>{if("key"in o&&(o.key.length===0||o.key.length>wE))throw new p("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(o.op==="set"&&!u_(o.value))throw new p("HOST_REJECTED","Storage values must be JSON.");if(o.op==="set"&&new TextEncoder().encode(JSON.stringify(o.value)).length>uE)throw new p("HOST_REJECTED","Storage value exceeds 64 KiB.");if(o.scope==="device"&&b?.features?.deviceStorage!==!0)throw new p("UNSUPPORTED","This host does not support device storage.");let O=await M({...X,type:"storage",id:P(d),payload:o});if(!O||!("storage"in O)||O.op!==o.op)throw new p("HOST_REJECTED","Host did not return storage data.");return O},mT=(o,O)=>b?.features?.popovers!==!0&&!(b?.surface==="popover"&&b.popover?.id===o)?Promise.reject(new p("UNSUPPORTED","This host does not support popovers.")):x({...X,type:"popover-close",id:P(d),payload:O?{id:o,reason:O}:{id:o}}),yT=(o,O)=>b?.features?.popovers!==!0&&!(b?.surface==="popover"&&b.popover?.id===o)?Promise.reject(new p("UNSUPPORTED","This host does not support popovers.")):x({...X,type:"popover-anchor",id:P(d),payload:{id:o,active:O}});return T.addEventListener("keydown",k_,!0),T.addEventListener("pointerover",U_),T.addEventListener("pointermove",U_),T.addEventListener("pointerout",G_),T.addEventListener("focus",S_),T.addEventListener("blur",H_),{onAction:(o)=>{return K=o,()=>{if(K===o)K=null}},listProjects:async()=>{let o=await iE({kind:"projects"});if(o.kind!=="projects")throw new p("HOST_REJECTED","Expected projects.");return o},listWorktrees:async(o)=>{let O=await iE({kind:"worktrees",projectId:o});if(O.kind!=="worktrees")throw new p("HOST_REJECTED","Expected worktrees.");return O},listSessions:async(o)=>{let O=await iE({kind:"sessions",projectId:o});if(O.kind!=="sessions")throw new p("HOST_REJECTED","Expected sessions.");return O},onProjects:(o)=>BE({kind:"projects"},(O)=>{if(O.kind==="projects")o(O)}),onWorktrees:(o,O)=>BE({kind:"worktrees",projectId:o},($)=>{if($.kind==="worktrees")O($)}),onSessions:(o,O)=>BE({kind:"sessions",projectId:o},($)=>{if($.kind==="sessions")O($)}),onRunningShells:(o,O)=>AS(o,O),readShellOutput:async(o,O)=>{t_(o,rE);let $=O?.cursor;if($!==void 0&&(!Number.isInteger($)||$<0))throw new p("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let C=O?.tailBytes;if(C!==void 0&&(!Number.isInteger(C)||C<1||C>CE))throw new p("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${CE}.`);let Z=await M({...X,type:"shell-output",id:P(d),payload:{shellId:o,cursor:$,tailBytes:C}});if(!Z||typeof Z.output!=="string"||!Number.isFinite(Z.cursor))throw new p("HOST_REJECTED","Host did not return shell output.");return Z},stopShell:async(o)=>{if(t_(o,rE),(await M({...X,type:"shell-stop",id:P(d),payload:{shellId:o}}))?.stopped!==!0)throw new p("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async(o)=>{t_(o),await x({...X,type:"open-session",id:P(d),payload:{sessionId:o}})},storage:{get:async(o,O)=>{let $=DE(O),C={op:"get",key:o};if($)C.scope=$;let F=await xE(C);return F.op==="get"&&F.found?F.value:void 0},set:async(o,O,$)=>{let C=DE($),F={op:"set",key:o,value:O};if(C)F.scope=C;await xE(F)},delete:async(o,O)=>{let $=DE(O),C={op:"delete",key:o};if($)C.scope=$;await xE(C)},keys:async(o)=>{let O=DE(o),$={op:"keys"};if(O)$.scope=O;let C=await xE($);if(C.op!=="keys")throw new p("HOST_REJECTED","Expected storage keys.");return C.keys}},onReady:(o)=>{if(A.add(o),b)o(b);return()=>{A.delete(o)}},onDirectory:(o)=>{if(f.add(o),b)o(b.directory);return()=>{f.delete(o)}},onSession:(o)=>{if(k.add(o),b)o(b.session);return()=>{k.delete(o)}},onSessionLifecycle:(o)=>{if(I.add(o),N_)o(N_);return()=>{I.delete(o)}},onConnection:(o)=>{if(R.add(o),b)o(b.connection);return()=>{R.delete(o)}},onSettings:(o)=>{if(n.add(o),b)o(b.settings);return()=>{n.delete(o)}},onItem:(o)=>{if(N.add(o),b)o(b.item);return()=>{N.delete(o)}},onBlock:(o)=>{if(r.add(o),b?.block)o(b.block);return()=>{r.delete(o)}},onServiceEvent:(o)=>{return L.add(o),()=>{L.delete(o)}},onStatusControl:(o)=>{return Y.add(o),()=>{Y.delete(o)}},onPopoverClosed:(o)=>{return t.add(o),()=>{t.delete(o)}},setStatusControls:(o)=>{if(b?.features?.statusControls!==!0)return Promise.reject(new p("UNSUPPORTED","This host does not support status controls."));if(!lT(o))return Promise.reject(new p("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options."));return x({...X,type:"status-controls",id:P(d),payload:{controls:o}})},openPopover:(o)=>{if(b?.features?.popovers!==!0)return Promise.reject(new p("UNSUPPORTED","This host does not support popovers."));if(!_T(o))return Promise.reject(new p("HOST_REJECTED","Popover requests need bounded geometry and JSON data."));return x({...X,type:"popover-open",id:P(d),payload:o})},closePopover:mT,setPopoverAnchorActive:yT,onResolve:(o)=>{return Q=o,()=>{if(Q===o)Q=null}},toast:(o)=>{let O=o.message.trim();if(!O||O.length>pE)return Promise.reject(new p("HOST_REJECTED",`Toast message must contain 1 to ${pE} characters.`));if(o.copy&&o.copy!==!0&&(!o.copy.text.length||o.copy.text.length>NE))return Promise.reject(new p("HOST_REJECTED",`Toast copy text must contain 1 to ${NE} characters.`));return x({channel:h,v:z,type:"toast",id:P(d),payload:{...o,message:O}})},openUrl:(o)=>x({channel:h,v:z,type:"open-url",id:P(d),payload:{url:o}}),...Ao(x,()=>P(d),(o)=>Promise.reject(new p("HOST_REJECTED",o))),answerBlock:(o)=>x({channel:h,v:z,type:"block-answer",id:P(d),payload:{text:o.trim().slice(0,oT)}}),openSurface:(o)=>x({channel:h,v:z,type:"open-surface",id:P(d),payload:{surfaceId:o}}),writeClipboard:(o)=>x({channel:h,v:z,type:"clipboard-write",id:P(d),payload:{text:o}}),compose:(o)=>x({channel:h,v:z,type:"compose",id:P(d),payload:o}),attach:(o)=>x({channel:h,v:z,type:"attach",id:P(d),payload:q_(o)}),startSession:async(o)=>{if(o.projectId!==void 0)t_(o.projectId);let O=o.worktree;if(O&&O!==!0)if(O.kind==="existing")t_(O.directory);else{if(O.name!==void 0)t_(O.name,200);if(O.baseBranch!==void 0)t_(O.baseBranch,200)}let $=await M({channel:h,v:z,type:"start-session",id:P(d),payload:kT(o)},_.requestTimeoutMs??180000);if(!ST($))throw new p("HOST_REJECTED","Host did not return a session.");return $},prompt:(o)=>M({channel:h,v:z,type:"prompt",id:P(d),payload:UT(o)}).then((O)=>{if(!OT(O))throw new p("HOST_REJECTED","Host did not return a prompt result.");return O}),sessionLink:(o)=>x({channel:h,v:z,type:"session-link",id:P(d),payload:q_(o)}),close:()=>x({channel:h,v:z,type:"close",id:P(d)}),oauthStart:()=>x({channel:h,v:z,type:"oauth-start",id:P(d)}),oauthDisconnect:()=>x({channel:h,v:z,type:"oauth-disconnect",id:P(d)}),request:(o)=>(VE(o.path)?M({channel:h,v:z,type:"request",id:P(d),payload:o}):Lo()).then((O)=>{if(!LE(O))throw new p("HOST_REJECTED","Host request result was empty.");return O}),serviceRequest:(o)=>(VE(o.path)?M({channel:h,v:z,type:"service-request",id:P(d),payload:o}):Lo()).then((O)=>{if(!LE(O))throw new p("HOST_REJECTED","Host service request result was empty.");return O}),serviceStatus:()=>M({channel:h,v:z,type:"service-status",id:P(d)}).then((o)=>{if(!MT(o))throw new p("HOST_REJECTED","Host did not return service status.");return o}),readFile:(o)=>(a_(o)?M({channel:h,v:z,type:"file-read",id:P(d),payload:{path:o}}):PE()).then((O)=>{if(!nT(O))throw new p("HOST_REJECTED","Host did not return file content.");return O}),writeFile:(o,O)=>{if(!a_(o))return PE();if(O.length>tE)return Promise.reject(new p("FILE_TOO_LARGE",`Content is over ${tE} characters.`));return M({channel:h,v:z,type:"file-write",id:P(d),payload:{path:o,content:O}}).then(($)=>{if(!xT($))throw new p("HOST_REJECTED","Host did not confirm the write.");return $})},listDir:(o)=>(a_(o)?M({channel:h,v:z,type:"file-list",id:P(d),payload:{path:o}}):PE()).then((O)=>{if(!rT(O))throw new p("HOST_REJECTED","Host did not return directory entries.");return O}),stat:(o)=>(a_(o)?M({channel:h,v:z,type:"file-stat",id:P(d),payload:{path:o}}):PE()).then((O)=>{if(!CT(O))throw new p("HOST_REJECTED","Host did not return file status.");return O}),generate:(o)=>{let O=o.prompt.trim(),$=o.system?.trim();if(O.length===0||O.length>XE)return Promise.reject(new p("HOST_REJECTED",`Prompt must be 1 to ${XE} characters.`));if($!==void 0&&($.length===0||$.length>dE))return Promise.reject(new p("HOST_REJECTED",`System prompt must be 1 to ${dE} characters.`));let C=o.maxOutputTokens===void 0?void 0:Math.min(cT,Math.max(1,Math.floor(o.maxOutputTokens)));if(C!==void 0&&!Number.isFinite(C))return Promise.reject(new p("HOST_REJECTED","maxOutputTokens must be a number."));let F={prompt:O};if($!==void 0)F.system=$;if(C!==void 0)F.maxOutputTokens=C;return M({channel:h,v:z,type:"generate",id:P(d),payload:F},_.requestTimeoutMs??fT).then((Z)=>{if(!$T(Z))throw new p("HOST_REJECTED","Host did not return generated text.");return Z})},onLateGenerateResult:(o)=>{V.add(o);for(let O of j.splice(0))g([o],O);return j_(),()=>{V.delete(o)}},openMicrophone:M_,setBadge:(o)=>x({channel:h,v:z,type:"badge",id:P(d),payload:{count:IT(o)}}),setHeight:(o)=>x({channel:h,v:z,type:"resize",id:P(d),payload:{height:RT(o)}}),onFileOpen:(o)=>{if(a.add(o),!A_)A_=!0,T.addEventListener("keydown",o_,!0);if(v)o(v);return()=>{a.delete(o)}},onFileSnapshot:(o)=>{return B=o,()=>{if(B===o)B=null}},onFileSaved:(o)=>{return W.add(o),()=>{W.delete(o)}},reportFileChange:(o)=>H({...X,type:"file-change",payload:{dirty:o.dirty,edited:o.edited}}),requestFileSave:e,reportFileUnsupported:()=>H({...X,type:"file-unsupported"}),dispose:()=>{for(let o of E_.keys())T_({...X,type:"workspace-unsubscribe",id:P(d),payload:{subscriptionId:o}});E_.clear();for(let o of J.keys())T_({...X,type:"shells-unsubscribe",id:P(d),payload:{subscriptionId:o}});if(J.clear(),f_)w(),f_.release(),f_=null;if(c_=!0,Q=null,K=null,B=null,a.clear(),W.clear(),A_)T.removeEventListener("keydown",o_,!0);T.removeEventListener("message",AE),T.removeEventListener("keydown",k_,!0),T.removeEventListener("pointerover",U_),T.removeEventListener("pointermove",U_),T.removeEventListener("pointerout",G_),T.removeEventListener("focus",S_),T.removeEventListener("blur",H_);for(let o of R_.values())clearTimeout(o.timer),o.reject(new p("HOST_UNAVAILABLE","Host client was disposed."));R_.clear(),A.clear(),f.clear(),k.clear(),I.clear(),R.clear(),n.clear(),N.clear(),r.clear(),L.clear(),Y.clear(),t.clear(),V.clear(),j.length=0}}};var Po=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var KO=new Set(Po);var Do=["none","agent","user"];var QO=new Set(Do);var rS=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],CS=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],ho=(_,T)=>{T.style.colorScheme=_.mode;for(let[E,S]of rS)T.style.setProperty(E,_.tokens[S]);for(let[E,S,A]of CS){let f=_.tokens[A]??"";T.style.setProperty(E,f),T.style.setProperty(S,f)}T.style.setProperty("font-family",_.tokens.font),T.style.setProperty("font-size",_.tokens.fontSize??"0.875rem"),T.style.setProperty("line-height","1.45"),T.style.setProperty("color",_.tokens.foreground)},NT=(_,T)=>{if(ho(_.theme,T),T.dataset)T.dataset.ocSurface=_.surface,T.dataset.ocTheme=_.theme.mode};var $S={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},y=(_,T)=>`var(--${_}, var(--oc-${$S[_]}, ${T}))`,L_=y("surface-background","transparent"),zE=y("surface-elevated","transparent"),s_=y("surface-elevated-foreground","inherit"),n_=y("surface-foreground","inherit"),s=y("surface-muted-foreground","gray"),bS=y("surface-muted","transparent"),F_=y("interactive-border","currentColor"),I_=y("interactive-hover","transparent"),Z_=y("interactive-active","transparent"),GT=y("interactive-selection","transparent"),tT=y("interactive-selection-foreground","inherit"),V_=y("primary","currentColor"),XT=y("primary-text","inherit"),dT=y("error-text","inherit"),pS=y("font-sans","inherit"),VT=y("font-mono","monospace"),Yo=y("radius","9px"),LT=`calc(${Yo} - 2px)`,zo=`calc(${Yo} - 4px)`,l=(_,T,E="transparent")=>`color-mix(in srgb, ${_} ${T}%, ${E})`,Wo=`background-image: linear-gradient(${I_}, ${I_});`,PT=(_,T="0.5px")=>`box-shadow: inset 0 0 0 ${T} ${_}, var(--oc-sdk-field-lift);`,DT="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",Ko="box-shadow: var(--oc-sdk-lit);",hT=`inset 0 0.5px 0 0 ${l(n_,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,NS=`
:root {
  --oc-sdk-edge: ${l(n_,16)};
  --oc-sdk-field-bg: ${zE};
  --oc-sdk-raised-bg: ${L_};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${l(n_,14)};
  --oc-sdk-field-bg: ${l(L_,50,zE)};
  --oc-sdk-raised-bg: ${zE};
  --oc-sdk-field-lift: ${hT};
  --oc-sdk-raised-lift: ${hT};
  --oc-sdk-lit: ${hT};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,hE=(_)=>{let T=y(`status-${_}`,"currentColor");return`
.oc-sdk[data-tone="${_}"], .oc-sdk [data-tone="${_}"] { --oc-sdk-tone: ${T}; --oc-sdk-tone-text: ${y(`${_}-text`,"inherit")}; }`},U=(_)=>`calc(${_}rem / 14)`,GS=`
.oc-sdk { box-sizing: border-box; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: ${U(8)}; height: ${U(32)}; padding: 0 ${U(12)}; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; }
.oc-sdk-btn[data-size="sm"] { gap: ${U(6)}; height: ${U(28)}; padding: 0 ${U(10)}; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { gap: ${U(4)}; height: ${U(24)}; padding: 0 ${U(8)}; font-size: 0.75rem; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: ${U(14)}; height: ${U(14)}; }

.oc-sdk-field { display: flex; flex-direction: column; gap: ${U(4)}; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: ${U(32)}; padding: 0 ${U(10)}; border: 0; font-size: 0.875rem; line-height: 1.45; appearance: none; }
textarea.oc-sdk-input { height: auto; padding: ${U(8)} ${U(10)}; resize: vertical; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: ${U(34)}; padding-right: ${U(34)}; }
.oc-sdk-search-icon { position: absolute; left: ${U(11)}; top: 50%; transform: translateY(-50%); pointer-events: none; }
.oc-sdk-search-clear { position: absolute; right: ${U(6)}; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: ${U(24)}; height: ${U(24)}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: ${U(4)}; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: ${U(6)}; align-self: flex-start; width: auto; max-width: 100%; min-width: 0; height: ${U(28)}; padding: 0 ${U(10)}; border: 1px solid transparent; font-size: 0.8125rem; text-align: left; }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; }
.oc-sdk-popup { position: fixed; z-index: 50; display: flex; flex-direction: column; gap: ${U(2)}; min-width: ${U(160)}; max-width: calc(100vw - ${U(16)}); max-height: min(${U(320)}, calc(100vh - ${U(16)})); overflow: auto; padding: ${U(4)}; border: 1px solid transparent; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: ${U(2)} ${U(2)} ${U(4)}; }
.oc-sdk-popup-search .oc-sdk-input { height: ${U(28)}; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: ${U(8)}; width: 100%; padding: ${U(6)} ${U(8)}; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; }
.oc-sdk-option-check { flex: 0 0 auto; display: inline-flex; width: ${U(14)}; visibility: hidden; }
.oc-sdk-option[aria-selected="true"] > .oc-sdk-option-check { visibility: visible; }
.oc-sdk-popup-empty { padding: ${U(8)}; font-size: 0.8125rem; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: ${U(8)}; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: ${U(14)}; height: ${U(14)}; margin-top: ${U(3)}; border: 1px solid transparent; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: ${U(36)}; height: ${U(20)}; --oc-sdk-thumb-travel: ${U(16)}; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: ${U(2)}; left: ${U(2)}; width: ${U(16)}; height: ${U(16)}; }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; }

.oc-sdk-tabs { display: inline-flex; gap: ${U(2)}; padding: ${U(2)}; max-width: 100%; overflow: auto; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: ${U(6)}; height: ${U(28)}; padding: 0 ${U(10)}; border: 1px solid transparent; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: ${U(1)} ${U(6)}; font-size: ${U(11)}; font-weight: 500; line-height: ${U(16)}; white-space: nowrap; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: ${U(8)}; width: 100%; padding: ${U(6)} ${U(8)}; text-align: left; }
.oc-sdk-row-lead { flex: 0 0 auto; width: ${U(64)}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-list-empty { padding: ${U(16)} ${U(8)}; text-align: center; font-size: 0.8125rem; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${U(4)}; padding: ${U(40)} ${U(16)}; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; }
.oc-sdk-empty-action { margin-top: ${U(12)}; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: ${U(8)}; font-size: 0.8125rem; }
.oc-sdk-spinner-ring { width: ${U(16)}; height: ${U(16)}; border: 2px solid transparent; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: ${U(12)}; height: ${U(12)}; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: ${U(12)}; padding: ${U(8)} ${U(12)}; border: 1px solid transparent; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: ${U(2)}; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-banner-body { font-size: 0.8125rem; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: ${U(8)}; width: 100%; margin: ${U(8)} 0; font-size: 0.75rem; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: ${U(4)} 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: ${U(4)}; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: ${U(6)}; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; transform-origin: left; transition: transform 200ms ease-out; }
.oc-sdk-progress-value { display: inline-flex; align-items: center; gap: ${U(2)}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { font-weight: 600; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text img { display: block; max-width: 100%; margin: ${U(8)} 0; }

/* Under a finger the controls reach the app's touch sizes: rows and options 44px like its sheets, every other
   control at least 36px. Inputs keep 16px text, below which iOS zooms the page on focus. */
@media (pointer: coarse) {
  .oc-sdk-btn, .oc-sdk-input { height: ${U(40)}; }
  .oc-sdk-btn[data-size="sm"], .oc-sdk-btn[data-size="xs"], .oc-sdk-trigger, .oc-sdk-tab, .oc-sdk-popup-search .oc-sdk-input { height: ${U(36)}; }
  .oc-sdk-input, .oc-sdk-popup-search .oc-sdk-input { font-size: max(16px, 0.875rem); }
  .oc-sdk-search-clear { width: ${U(36)}; height: ${U(36)}; right: 0; }
  .oc-sdk-row, .oc-sdk-option { min-height: ${U(44)}; }
  .oc-sdk-check { min-height: ${U(36)}; padding: ${U(8)} 0; }
}
`,Qo=`${NS}
.oc-sdk { color: ${n_}; font-family: ${pS}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${Wo} }
.oc-sdk-mono { font-family: ${VT}; }
.oc-sdk-muted { color: ${s}; }
${hE("success")}${hE("warning")}${hE("error")}${hE("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${V_}; --oc-sdk-tone-text: ${XT}; }

.oc-sdk-btn { border-radius: ${LT}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${zo}; }
.oc-sdk-btn[data-variant="default"] { color: ${XT}; background: ${l(V_,10,L_)}; border-color: ${l(V_,12)}; ${Ko} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${l(V_,16,L_)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${l(V_,22,L_)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${bS}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${I_}, ${I_}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${Z_}, ${Z_}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${s_}; ${DT} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${I_}, ${I_}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${Z_}, ${Z_}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${I_}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${Z_}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${y("status-error","red")}; color: ${dT}; background: ${l("var(--oc-sdk-tone)",7,L_)}; border-color: ${l("var(--oc-sdk-tone)",12)}; ${Ko} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${l("var(--oc-sdk-tone)",9,L_)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${l("var(--oc-sdk-tone)",11,L_)}; box-shadow: none; }

.oc-sdk-field-note { color: ${s}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${dT}; }
.oc-sdk-input { border-radius: ${LT}; background: var(--oc-sdk-field-bg); color: ${s_}; ${PT("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${s}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${I_}, ${I_}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${PT(l(n_,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${PT(y("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${VT}; }

.oc-sdk-search-icon { color: ${s}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${V_}; }
.oc-sdk-search-clear { border-radius: ${zo}; color: ${s}; }
.oc-sdk-search-clear:hover { background: ${I_}; color: ${n_}; }

.oc-sdk-trigger { border-radius: ${LT}; background: var(--oc-sdk-raised-bg); color: ${s_}; ${DT} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${I_}, ${I_}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${Z_}, ${Z_}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${s}; }
.oc-sdk-trigger-chevron { color: ${s}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${s_}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${zE}; background-clip: padding-box; color: ${s_}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${I_}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${GT}; color: ${tT}; }
.oc-sdk-option-check { color: ${n_}; }
.oc-sdk-option[data-destructive="true"] { color: ${dT}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${l(y("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${s}; }
.oc-sdk-popup-empty { color: ${s}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${F_}; border-radius: 4px; color: ${n_}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${l(n_,60,F_)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${F_}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${L_}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${V_}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(var(--oc-sdk-thumb-travel, 16px)); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${Wo} }
.oc-sdk-check-desc { color: ${s}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${l(n_,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${s}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${n_}; }
.oc-sdk-tab[aria-selected="true"] { color: ${tT}; background: ${GT}; border-color: ${F_}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${s_}; background: var(--oc-sdk-raised-bg); ${DT} }
.oc-sdk-tab-count { color: ${s}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${l(n_,6)}; color: ${s}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${l("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${I_}; }
.oc-sdk-row[aria-selected="true"] { background: ${GT}; color: ${tT}; }
.oc-sdk-row-lead { font-family: ${VT}; color: ${s}; }
.oc-sdk-row-sub { color: ${s}; }
.oc-sdk-row-meta { color: ${s}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${s}; }

.oc-sdk-empty-body { color: ${s}; }

.oc-sdk-spinner { color: ${s}; }
.oc-sdk-spinner-ring { border-color: ${F_}; border-top-color: ${V_}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${l("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${s}; }

.oc-sdk-separator { color: ${s}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${l(F_,40)}; }

.oc-sdk-progress-label { color: ${s}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${l(n_,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${V_}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${y("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${y("success-text","inherit")}; }

.oc-sdk-text a { color: ${XT}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${l(F_,60)}; }
`,u=`
${mE}
${GS}
${Qo}`;var jo="oc-sdk-ui-style",l_=(_)=>{while(_.firstChild)_.removeChild(_.firstChild)},q=(_)=>{let T=document.getElementById(jo);if(T instanceof HTMLStyleElement){if(T.textContent!==_)T.textContent=_;return}yE(document);let E=document.createElement("style");E.id=jo,E.textContent=_,document.head.appendChild(E)},D=(_,T)=>{let E=document.createElement(_);if(T)E.className=T;return E},d_=(_)=>{let T=D("button",_);return T.type="button",T},__=(_,T)=>{let E=T??"";if(_.textContent!==E)_.textContent=E},h_=(_,T,E)=>{if(E===void 0||E===null||E==="")_.removeAttribute(T);else if(_.getAttribute(T)!==E)_.setAttribute(T,E)};var tS=()=>{let _=document.createElement("span");return _.className="oc-sdk-spinner-ring",_.setAttribute("aria-hidden","true"),_},X_=(_,T)=>{q(u);let E=T,S=d_("oc-sdk oc-sdk-btn"),A=tS(),f=document.createElement("span");S.append(f),_.append(S);let k=()=>{if(S.dataset.variant=E.variant??"default",S.dataset.size=E.size??"default",S.disabled=Boolean(E.disabled)||Boolean(E.loading),S.dataset.loading=E.loading?"true":"false",S.setAttribute("aria-busy",E.loading?"true":"false"),E.loading&&A.parentNode!==S)S.prepend(A);else if(!E.loading&&A.parentNode===S)A.remove();__(f,E.label)},I=()=>{if(E.disabled||E.loading)return;E.onClick()};return S.addEventListener("click",I),k(),{update:(R)=>{E={...E,...R},k()},dispose:()=>{S.removeEventListener("click",I),S.remove()}}};var WE=(_,T)=>{q(u);let E=T,S=D("label","oc-sdk oc-sdk-field"),A=D("span","oc-sdk-field-label"),f=E.multiline?D("textarea","oc-sdk-input"):D("input","oc-sdk-input"),k=D("span","oc-sdk-field-note");S.append(A,f,k),_.append(S);let I=()=>{if(__(A,E.label),A.hidden=!E.label,f instanceof HTMLInputElement)f.type=E.password?"password":"text";else f.rows=E.rows??3;if(f.value!==E.value)f.value=E.value;f.disabled=Boolean(E.disabled),h_(f,"placeholder",E.placeholder),f.dataset.mono=E.mono?"true":"false";let n=Boolean(E.error);S.dataset.invalid=n?"true":"false",f.setAttribute("aria-invalid",n?"true":"false");let N=E.error??E.helper??"";__(k,N),k.hidden=N===""},R=()=>{E.onChange(f.value)};return f.addEventListener("input",R),I(),{update:(n)=>{E={...E,...n},I()},dispose:()=>{f.removeEventListener("input",R),S.remove()}}};var Ho="http://www.w3.org/2000/svg",XS={search:"M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z",chevron:"M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z",check:"M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z",close:"M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"},v_=(_,T,E)=>{let S=document.createElementNS(Ho,"svg");if(S.setAttribute("viewBox","0 0 24 24"),S.setAttribute("width",String(T)),S.setAttribute("height",String(T)),S.style.width=U(T),S.style.height=U(T),S.setAttribute("aria-hidden","true"),S.setAttribute("fill","currentColor"),E)S.setAttribute("class",E);let A=document.createElementNS(Ho,"path");return A.setAttribute("d",XS[_]),S.append(A),S};var e_=(_,T="vertical")=>{let[E,S]=T==="vertical"?["ArrowDown","ArrowUp"]:["ArrowRight","ArrowLeft"];if(_.key===E||_.ctrlKey&&_.key.toLowerCase()==="n")return"next";if(_.key===S||_.ctrlKey&&_.key.toLowerCase()==="p")return"previous";if(_.key==="Home")return"first";if(_.key==="End")return"last";return null},_E=(_,T,E)=>{let S=_.filter((R)=>!R.disabled);if(S.length===0)return null;let A=S[0],f=S[S.length-1];if(E==="first"||!A||!f)return A?.id??null;if(E==="last")return f.id;let k=S.findIndex((R)=>R.id===T);if(k===-1)return E==="next"?A.id:f.id;return S[Math.min(S.length-1,Math.max(0,k+(E==="next"?1:-1)))]?.id??null};var PS=(_,T,E)=>{q(u);let S=T,A=d_("oc-sdk oc-sdk-check");A.setAttribute("role",E);let f=D("span",E==="switch"?"oc-sdk-check-thumb":"oc-sdk-check-box");if(E==="checkbox")f.append(v_("check",12));let k=D("span","oc-sdk-check-text"),I=D("span","oc-sdk-check-label"),R=D("span","oc-sdk-check-desc");k.append(I,R),A.append(f,k),_.append(A);let n=()=>{A.setAttribute("aria-checked",S.checked?"true":"false"),A.disabled=Boolean(S.disabled),__(I,S.label),__(R,S.description),R.hidden=!S.description},N=()=>{if(!S.disabled)S.onChange(!S.checked)};return A.addEventListener("click",N),n(),{update:(r)=>{S={...S,...r},n()},dispose:()=>{A.removeEventListener("click",N),A.remove()}}};var KE=(_,T)=>PS(_,T,"switch");var zT=(_,T)=>{q(u);let E=T,S=D("div","oc-sdk oc-sdk-tabs");S.setAttribute("role","tablist"),_.append(S);let A=()=>{l_(S),S.dataset.track=E.trackBackground?"true":"false";for(let k of E.items){let I=d_("oc-sdk-tab");I.setAttribute("role","tab");let R=k.id===E.activeId;I.setAttribute("aria-selected",R?"true":"false"),I.tabIndex=R?0:-1,I.dataset.id=k.id;let n=D("span");if(n.textContent=k.label,I.append(n),k.count!==void 0){let N=D("span","oc-sdk-tab-count");N.textContent=String(k.count),I.append(N)}I.addEventListener("click",()=>{if(k.id!==E.activeId)E.onChange(k.id)}),S.append(I)}},f=(k)=>{let I=e_(k,"horizontal");if(!I)return;let R=_E(E.items,E.activeId,I);if(R&&R!==E.activeId){k.preventDefault(),E.onChange(R);let n=S.querySelector(`[data-id="${CSS.escape(R)}"]`);if(n instanceof HTMLElement)n.focus()}};return S.addEventListener("keydown",f),A(),{update:(k)=>{E={...E,...k},A()},dispose:()=>{S.removeEventListener("keydown",f),S.remove()}}};var WT=(_,T)=>{h_(_,"data-tone",T&&T!=="neutral"?T:null)},YE=(_,T)=>{q(u);let E=T,S=D("span","oc-sdk oc-sdk-badge");_.append(S);let A=()=>{__(S,E.label),WT(S,E.tone)};return A(),{update:(f)=>{E={...E,...f},A()},dispose:()=>{S.remove()}}};var KT=(_,T)=>{q(u);let E=T,S=D("div","oc-sdk oc-sdk-empty"),A=D("h2","oc-sdk-empty-title"),f=D("p","oc-sdk-empty-body"),k=D("div","oc-sdk-empty-action");S.append(A,f,k),_.append(S);let I=null,R=()=>{if(__(A,E.title),__(f,E.body),f.hidden=!E.body,k.hidden=!E.action,!E.action){I?.dispose(),I=null;return}let n={label:E.action.label,onClick:E.action.onClick};if(I)I.update(n);else I=X_(k,{...n,variant:"outline",size:"sm"})};return R(),{update:(n)=>{E={...E,...n},R()},dispose:()=>{I?.dispose(),I=null,S.remove()}}};var YT=(_,T={})=>{q(u);let E=T,S=D("span","oc-sdk oc-sdk-spinner");S.setAttribute("role","status");let A=D("span","oc-sdk-spinner-ring");A.setAttribute("aria-hidden","true");let f=D("span");S.append(A,f),_.append(S);let k=()=>{S.dataset.size=E.size??"default",__(f,E.label),f.hidden=!E.label,S.setAttribute("aria-label",E.label??"Loading")};return k(),{update:(I)=>{E={...E,...I},k()},dispose:()=>{S.remove()}}};var QE=(_,T)=>{q(u);let E=T,S=D("div","oc-sdk oc-sdk-banner"),A=D("div","oc-sdk-banner-text"),f=D("div","oc-sdk-banner-title"),k=D("div","oc-sdk-banner-body"),I=D("div","oc-sdk-banner-action");A.append(f,k),S.append(A,I),_.append(S);let R=null,n=()=>{if(S.dataset.tone=E.tone,S.setAttribute("role",E.tone==="error"||E.tone==="warning"?"alert":"status"),__(f,E.title),__(k,E.body),k.hidden=!E.body,I.hidden=!E.action,!E.action){R?.dispose(),R=null;return}let N={label:E.action.label,onClick:E.action.onClick};if(R)R.update(N);else R=X_(I,{...N,variant:"outline",size:"xs"})};return n(),{update:(N)=>{E={...E,...N},n()},dispose:()=>{R?.dispose(),R=null,S.remove()}}};var $_=(_)=>{if(!Number.isFinite(_))return 0;return Math.max(0,Math.min(100,_))};var P_=(_)=>{let T=$_(_);if(Math.abs(T-Math.round(T))<0.05)return`${Math.round(T)}%`;return`${T.toFixed(1)}%`},QT=(_)=>{if(!Number.isFinite(_)||_<0)return"$0";if(_>=100)return`$${Math.round(_)}`;if(_>=10)return`$${_.toFixed(1)}`;return`$${_.toFixed(2)}`},jT=(_)=>{if(!Number.isFinite(_)||_<=0)return"0";if(_>=1e9)return`${(_/1e9).toFixed(2)}B`;if(_>=1e6){let T=_/1e6;return T>=100?`${Math.round(T)}M`:`${T.toFixed(1)}M`}if(_>=1000)return`${Math.round(_/1000)}K`;return String(Math.round(_))},jE=(_,T=Date.now())=>{if(!_||!Number.isFinite(_)||_<=T)return"即将重置";let E=Math.max(0,Math.floor((_-T)/1000)),S=Math.floor(E/86400),A=Math.floor(E%86400/3600),f=Math.floor(E%3600/60);if(S>0)return`${S}d ${A}h`;if(A>0)return`${A}h ${f}m`;return`${Math.max(1,f)}m`};var Fo=(_)=>{let T=_.limit_requests>0?_.effective_remaining_requests/_.limit_requests*100:100;return(_.limit_tokens>0?_.effective_remaining_tokens/_.limit_tokens*100:100)<T-0.5};var DS="http://www.w3.org/2000/svg",Zo=["gemini_5h","gemini_weekly","claude_5h","claude_weekly","argon_weekly"],Jo=["claude_weekly","claude_5h","argon_weekly","gemini_weekly","gemini_5h"],go=["gemini_5h","gemini_weekly","claude_5h","claude_weekly","argon_weekly"],vo="pq:panel-ui-prefs:v1",hS=30000,eo=30000,io=[{r:239,g:68,b:68},{r:245,g:158,b:11},{r:16,g:185,b:129}],zS=0,JE=(_,T=!1)=>{let E=$_(_);if(T||E<=0.05)return"empty";if(E>=99.95)return"full";if(E>60)return"healthy";if(E>=25)return"moderate";return"low"},_S=(_,T)=>{let E=_.toLowerCase(),S=(T??"").toLowerCase();return E==="argon_weekly"||S==="argon"||E.includes("argon")},ES=(_)=>{return String(_||"").trim().toLowerCase()==="pro"},WS=(_)=>{let T=ES(_.tier);return(_.windows??[]).filter((E)=>T||!_S(E.key,E.group))},Bo=(_)=>{if($_(_.remaining_percent)<99.95)return!0;return Boolean(_.has_current_usage&&(_.current_cost>0||_.current_tokens>0||_.current_requests>0))},KS=(_)=>{if($_(_.effective_percent)<99.95)return!0;if(_.eligible_accounts>0&&_.available_accounts<_.eligible_accounts)return!0;return _.used_requests>0||_.used_tokens>0},J_=(_,T)=>{let E=_.toLowerCase(),S=(T??"").toLowerCase();if(E==="gemini_5h")return"var(--pq-series-gemini)";if(E==="gemini_weekly"||S==="gemini")return"var(--pq-series-gemini-2)";if(E==="claude_5h")return"var(--pq-series-claude)";if(E==="claude_weekly"||S==="claude")return"var(--pq-series-claude-2)";if(E.includes("argon")||S==="argon")return"var(--pq-series-argon)";return"var(--pq-full)"},mo=(_)=>{switch(_.key){case"gemini_5h":return"Gemini 5h";case"gemini_weekly":return"Gemini 周";case"claude_5h":return"Claude 5h";case"claude_weekly":return"Claude 周";case"argon_weekly":return"Argon 周";default:return _.label||_.key}},TS=(_)=>{let T=String(_||"").trim().toLowerCase();if(T==="ultra")return"pq-tier-ultra";if(T==="pro")return"pq-tier-pro";return"pq-tier-free"},YS=(_)=>{switch(String(_||"").toLowerCase()){case"available":case"ready":return"pq-st-ok";case"limited":case"cooldown":return"pq-st-warn";case"exhausted":case"unavailable":case"auth_required":return"pq-st-err";default:return"pq-st-muted"}},QS=(_)=>{let T=Math.max(0,Math.min(1,_)),E=T<0.5?0:1,S=E===0?T*2:(T-0.5)*2,A=io[E],f=io[E+1],k=Math.round(A.r+(f.r-A.r)*S),I=Math.round(A.g+(f.g-A.g)*S),R=Math.round(A.b+(f.b-A.b)*S);return`rgb(${k}, ${I}, ${R})`},yo=(_)=>_>1000000000000?_:_*1000,z_=(_)=>String(_).padStart(2,"0"),FT=(_,T)=>{let E=new Date(_);if(T==="md")return`${z_(E.getMonth()+1)}/${z_(E.getDate())}`;return`${z_(E.getHours())}:${z_(E.getMinutes())}`},jS=(_)=>{let T=new Date(_);return`${z_(T.getMonth()+1)}/${z_(T.getDate())} ${z_(T.getHours())}:${z_(T.getMinutes())}`},HS=(_)=>{try{return new URL(_).host}catch{return _}},FS=()=>{if(document.getElementById("pq-styles"))return;let _=document.createElement("style");_.id="pq-styles",_.textContent=`
    :root {
      --pq-bg: var(--oc-bg, var(--surface-background, transparent));
      --pq-surface: var(--oc-elevated, var(--surface-elevated, rgba(127, 127, 127, 0.05)));
      --pq-surface-2: var(--oc-muted-surface, var(--surface-muted, rgba(127, 127, 127, 0.08)));
      --pq-fg: var(--oc-fg, var(--surface-foreground, #0f172a));
      --pq-muted: var(--oc-muted, var(--surface-muted-foreground, #64748b));
      --pq-border: var(--oc-border, var(--interactive-border, rgba(127, 127, 127, 0.22)));
      --pq-hover: var(--oc-hover, var(--interactive-hover, rgba(127, 127, 127, 0.1)));
      --pq-primary: var(--oc-primary, var(--primary, #0284c7));
      --pq-radius: var(--oc-radius, var(--radius, 10px));

      /* 5-level health palette (Light theme) */
      --pq-full: #0284c7;
      --pq-full-bar: #0ea5e9;
      --pq-full-bg: rgba(2, 132, 199, 0.11);

      --pq-healthy: #059669;
      --pq-healthy-bar: #10b981;
      --pq-healthy-bg: rgba(5, 150, 105, 0.11);

      --pq-moderate: #d97706;
      --pq-moderate-bar: #f59e0b;
      --pq-moderate-bg: rgba(217, 119, 6, 0.13);

      --pq-low: #dc2626;
      --pq-low-bar: #ef4444;
      --pq-low-bg: rgba(220, 38, 38, 0.12);

      --pq-empty: #991b1b;
      --pq-empty-bar: #991b1b;
      --pq-empty-bg: rgba(153, 27, 27, 0.16);
      --pq-empty-track: repeating-linear-gradient(
        -45deg,
        rgba(153, 27, 27, 0.18),
        rgba(153, 27, 27, 0.18) 4px,
        rgba(153, 27, 27, 0.06) 4px,
        rgba(153, 27, 27, 0.06) 8px
      );

      /* Tier badges (Light): Ultra 金紫, Pro 蓝, Free 灰 */
      --pq-tier-ultra-bg: linear-gradient(135deg, rgba(139, 92, 246, 0.16), rgba(217, 119, 6, 0.17));
      --pq-tier-ultra-fg: #6d28d9;
      --pq-tier-ultra-bd: rgba(139, 92, 246, 0.34);

      --pq-tier-pro-bg: rgba(37, 99, 235, 0.11);
      --pq-tier-pro-fg: #1d4ed8;
      --pq-tier-pro-bd: rgba(37, 99, 235, 0.25);

      --pq-tier-free-bg: rgba(100, 116, 139, 0.12);
      --pq-tier-free-fg: #475569;
      --pq-tier-free-bd: rgba(100, 116, 139, 0.22);

      /* Model family chart palette (Light) */
      --pq-series-gemini: #0284c7;
      --pq-series-gemini-2: #06b6d4;
      --pq-series-claude: #9333ea;
      --pq-series-claude-2: #ec4899;
      --pq-series-argon: #d97706;
    }

    :root[data-oc-theme="dark"] {
      --pq-fg: var(--oc-fg, var(--surface-foreground, #f1f5f9));
      --pq-muted: var(--oc-muted, var(--surface-muted-foreground, #94a3b8));

      /* 5-level health palette (Dark theme) */
      --pq-full: #38bdf8;
      --pq-full-bar: #38bdf8;
      --pq-full-bg: rgba(56, 189, 248, 0.16);

      --pq-healthy: #34d399;
      --pq-healthy-bar: #34d399;
      --pq-healthy-bg: rgba(52, 211, 153, 0.15);

      --pq-moderate: #fbbf24;
      --pq-moderate-bar: #fbbf24;
      --pq-moderate-bg: rgba(251, 191, 36, 0.16);

      --pq-low: #f87171;
      --pq-low-bar: #f87171;
      --pq-low-bg: rgba(248, 113, 113, 0.17);

      --pq-empty: #fda4af;
      --pq-empty-bar: #dc2626;
      --pq-empty-bg: rgba(220, 38, 38, 0.28);
      --pq-empty-track: repeating-linear-gradient(
        -45deg,
        rgba(220, 38, 38, 0.34),
        rgba(220, 38, 38, 0.34) 4px,
        rgba(220, 38, 38, 0.12) 4px,
        rgba(220, 38, 38, 0.12) 8px
      );

      /* Tier badges (Dark): Ultra 金紫, Pro 蓝, Free 灰 */
      --pq-tier-ultra-bg: linear-gradient(135deg, rgba(167, 139, 250, 0.24), rgba(251, 191, 36, 0.2));
      --pq-tier-ultra-fg: #f3e8ff;
      --pq-tier-ultra-bd: rgba(216, 180, 254, 0.36);

      --pq-tier-pro-bg: rgba(59, 130, 246, 0.2);
      --pq-tier-pro-fg: #93c5fd;
      --pq-tier-pro-bd: rgba(96, 165, 250, 0.34);

      --pq-tier-free-bg: rgba(148, 163, 184, 0.16);
      --pq-tier-free-fg: #cbd5e1;
      --pq-tier-free-bd: rgba(148, 163, 184, 0.24);

      /* Model family chart palette (Dark) */
      --pq-series-gemini: #38bdf8;
      --pq-series-gemini-2: #22d3ee;
      --pq-series-claude: #c084fc;
      --pq-series-claude-2: #f472b6;
      --pq-series-argon: #fbbf24;
    }

    @media (prefers-color-scheme: dark) {
      :root:not([data-oc-theme="light"]) {
        --pq-full: #38bdf8;
        --pq-full-bar: #38bdf8;
        --pq-full-bg: rgba(56, 189, 248, 0.16);
        --pq-healthy: #34d399;
        --pq-healthy-bar: #34d399;
        --pq-healthy-bg: rgba(52, 211, 153, 0.15);
        --pq-moderate: #fbbf24;
        --pq-moderate-bar: #fbbf24;
        --pq-moderate-bg: rgba(251, 191, 36, 0.16);
        --pq-low: #f87171;
        --pq-low-bar: #f87171;
        --pq-low-bg: rgba(248, 113, 113, 0.17);
        --pq-empty: #fda4af;
        --pq-empty-bar: #dc2626;
        --pq-empty-bg: rgba(220, 38, 38, 0.28);
        --pq-series-gemini: #38bdf8;
        --pq-series-gemini-2: #22d3ee;
        --pq-series-claude: #c084fc;
        --pq-series-claude-2: #f472b6;
        --pq-series-argon: #fbbf24;
      }
    }

    *, *::before, *::after { box-sizing: border-box; }

    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      overflow-x: hidden;
      background: transparent;
      color: var(--pq-fg);
      font-family: var(--oc-font, var(--font-sans, system-ui, -apple-system, sans-serif));
      font-size: var(--oc-font-size, 13px);
      line-height: 1.45;
      -webkit-font-smoothing: antialiased;
    }

    .pq-wrap {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 10px 10px 16px;
      width: 100%;
      max-width: 100%;
      min-width: 0;
    }

    .pq-num {
      font-variant-numeric: tabular-nums;
    }

    .pq-mono {
      font-family: var(--oc-mono, var(--font-mono, ui-monospace, SFMono-Regular, monospace));
      font-variant-numeric: tabular-nums;
    }

    .pq-muted {
      color: var(--pq-muted);
      font-size: 0.84em;
    }

    /* Compact Header */
    .pq-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      flex-wrap: wrap;
      min-width: 0;
      padding: 2px 1px;
    }

    .pq-brand {
      display: flex;
      align-items: center;
      gap: 7px;
      min-width: 0;
      flex: 1 1 auto;
    }

    .pq-title {
      font-size: 1.02em;
      font-weight: 700;
      letter-spacing: -0.01em;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pq-pool-dots {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      flex-shrink: 0;
    }

    .pq-dot-chip {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 1px 6px;
      border-radius: 999px;
      font-size: 0.72em;
      font-weight: 600;
      border: 1px solid var(--pq-border);
      background: var(--pq-surface);
      color: var(--pq-muted);
      white-space: nowrap;
    }

    .pq-dot-chip .pq-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
    }

    .pq-dot-chip.is-ok { color: var(--pq-healthy); border-color: color-mix(in srgb, var(--pq-healthy) 30%, transparent); background: var(--pq-healthy-bg); }
    .pq-dot-chip.is-warn { color: var(--pq-moderate); border-color: color-mix(in srgb, var(--pq-moderate) 32%, transparent); background: var(--pq-moderate-bg); }
    .pq-dot-chip.is-err { color: var(--pq-low); border-color: color-mix(in srgb, var(--pq-low) 32%, transparent); background: var(--pq-low-bg); }

    .pq-actions {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .pq-icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 24px;
      padding: 0;
      border-radius: calc(var(--pq-radius) - 3px);
      border: 1px solid var(--pq-border);
      background: transparent;
      color: var(--pq-muted);
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
      flex-shrink: 0;
    }

    .pq-icon-btn:hover {
      background: var(--pq-hover);
      color: var(--pq-fg);
    }

    .pq-icon-btn[aria-expanded="true"] {
      color: var(--pq-full);
      border-color: color-mix(in srgb, var(--pq-full) 40%, var(--pq-border));
      background: var(--pq-full-bg);
    }

    /* Cards */
    .pq-card {
      background: var(--pq-surface);
      border: 1px solid var(--pq-border);
      border-radius: var(--pq-radius);
      padding: 11px 11px;
      display: flex;
      flex-direction: column;
      gap: 9px;
      min-width: 0;
      transition: border-color 0.18s ease;
    }

    .pq-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      min-width: 0;
    }

    .pq-card-head-left {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      flex-wrap: wrap;
    }

    .pq-card-title {
      font-weight: 700;
      font-size: 0.94em;
      letter-spacing: -0.01em;
      margin: 0;
      white-space: nowrap;
    }

    /* Badges & Pills */
    .pq-pill {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 1px 6px;
      border-radius: 999px;
      font-size: 0.72em;
      font-weight: 600;
      line-height: 1.45;
      white-space: nowrap;
      border: 1px solid transparent;
      flex-shrink: 0;
    }

    .pq-tier-ultra {
      background: var(--pq-tier-ultra-bg);
      color: var(--pq-tier-ultra-fg);
      border-color: var(--pq-tier-ultra-bd);
    }

    .pq-tier-pro {
      background: var(--pq-tier-pro-bg);
      color: var(--pq-tier-pro-fg);
      border-color: var(--pq-tier-pro-bd);
    }

    .pq-tier-free {
      background: var(--pq-tier-free-bg);
      color: var(--pq-tier-free-fg);
      border-color: var(--pq-tier-free-bd);
    }

    .pq-st-ok { background: var(--pq-healthy-bg); color: var(--pq-healthy); }
    .pq-st-warn { background: var(--pq-moderate-bg); color: var(--pq-moderate); }
    .pq-st-err { background: var(--pq-low-bg); color: var(--pq-low); }
    .pq-st-muted { background: var(--pq-surface-2); color: var(--pq-muted); }

    .pq-bottleneck-tok {
      background: var(--pq-moderate-bg);
      color: var(--pq-moderate);
      border-color: color-mix(in srgb, var(--pq-moderate) 28%, transparent);
    }

    .pq-bottleneck-req {
      background: var(--pq-full-bg);
      color: var(--pq-full);
      border-color: color-mix(in srgb, var(--pq-full) 28%, transparent);
    }

    .pq-pill-empty {
      background: var(--pq-empty-bg);
      color: var(--pq-empty);
      border-color: color-mix(in srgb, var(--pq-empty-bar) 40%, transparent);
    }

    /* 5-Level Health Colors */
    .pq-lv-full { color: var(--pq-full); }
    .pq-lv-healthy { color: var(--pq-healthy); }
    .pq-lv-moderate { color: var(--pq-moderate); }
    .pq-lv-low { color: var(--pq-low); }
    .pq-lv-empty { color: var(--pq-empty); font-weight: 700; }

    .pq-bar-track {
      width: 100%;
      height: 6px;
      border-radius: 999px;
      background: var(--pq-surface-2);
      overflow: hidden;
      position: relative;
    }

    .pq-bar-track.is-thin { height: 3.5px; }
    .pq-bar-track.is-empty { background: var(--pq-empty-track); }

    .pq-bar-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.25s ease;
    }

    .pq-bar-full { background: var(--pq-full-bar); }
    .pq-bar-healthy { background: var(--pq-healthy-bar); }
    .pq-bar-moderate { background: var(--pq-moderate-bar); }
    .pq-bar-low { background: var(--pq-low-bar); }
    .pq-bar-empty { background: var(--pq-empty-bar); }

    /* Antigravity Account Blocks */
    .pq-acct-list {
      display: flex;
      flex-direction: column;
      gap: 11px;
      min-width: 0;
    }

    .pq-acct-block {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }

    .pq-acct-block + .pq-acct-block {
      padding-top: 11px;
      border-top: 1px solid var(--pq-border);
    }

    .pq-acct-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      min-width: 0;
    }

    .pq-acct-id {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      flex: 1 1 auto;
    }

    .pq-acct-name {
      font-weight: 700;
      font-size: 0.9em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }

    /* Recent 200m Micro-Capsule Bar */
    .pq-recent-strip {
      background: var(--pq-surface-2);
      border: 1px solid color-mix(in srgb, var(--pq-border) 75%, transparent);
      border-radius: calc(var(--pq-radius) - 3px);
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-width: 0;
    }

    .pq-recent-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      font-size: 0.76em;
      min-width: 0;
    }

    .pq-recent-label {
      color: var(--pq-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }

    .pq-recent-meta {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .pq-recent-ok { color: var(--pq-healthy); font-weight: 600; }
    .pq-recent-fail { color: var(--pq-low); font-weight: 600; }

    .pq-rate-capsule {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
      height: 17px;
      border-radius: 999px;
      font-size: 0.92em;
      font-weight: 700;
      background: color-mix(in srgb, var(--pq-border) 55%, transparent);
      color: var(--pq-muted);
      white-space: nowrap;
    }

    .pq-rate-capsule.is-high { background: var(--pq-healthy-bg); color: var(--pq-healthy); }
    .pq-rate-capsule.is-med { background: var(--pq-moderate-bg); color: var(--pq-moderate); }
    .pq-rate-capsule.is-low { background: var(--pq-low-bg); color: var(--pq-low); }

    .pq-buckets {
      display: flex;
      align-items: center;
      gap: 2px;
      width: 100%;
      min-width: 0;
      height: 10px;
    }

    .pq-bucket {
      flex: 1 1 0;
      min-width: 2px;
      height: 5px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--pq-border) 70%, transparent);
      opacity: 0.55;
      cursor: pointer;
      transition: transform 0.12s ease, opacity 0.12s ease;
    }

    .pq-bucket.is-active { opacity: 0.92; }
    .pq-bucket:hover,
    .pq-bucket.is-focus {
      transform: scaleY(1.75);
      opacity: 1;
    }

    /* Active Quota Windows */
    .pq-win-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
      min-width: 0;
    }

    .pq-win-active {
      background: var(--pq-surface-2);
      border: 1px solid color-mix(in srgb, var(--pq-border) 75%, transparent);
      border-radius: calc(var(--pq-radius) - 3px);
      padding: 8px 9px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-width: 0;
      transition: border-color 0.15s ease;
    }

    .pq-win-active.is-empty {
      border-color: color-mix(in srgb, var(--pq-empty-bar) 45%, var(--pq-border));
    }

    .pq-win-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;
    }

    .pq-win-name-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      flex: 1 1 auto;
    }

    .pq-fam-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .pq-win-name {
      font-weight: 600;
      font-size: 0.89em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }

    .pq-win-val-wrap {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      flex-shrink: 0;
    }

    .pq-win-val {
      font-family: var(--oc-mono, var(--font-mono, ui-monospace, monospace));
      font-variant-numeric: tabular-nums;
      font-size: 0.9em;
      font-weight: 700;
      white-space: nowrap;
    }

    .pq-win-sub {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px 8px;
      font-size: 0.77em;
      color: var(--pq-muted);
      flex-wrap: wrap;
      min-width: 0;
    }

    .pq-win-usage {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
      min-width: 0;
    }

    .pq-win-reset {
      white-space: nowrap;
      margin-left: auto;
    }

    /* Compact Idle 100% Windows */
    .pq-win-idle-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px;
      min-width: 0;
    }

    .pq-win-idle-grid.is-single {
      grid-template-columns: minmax(0, 1fr);
    }

    .pq-win-idle-tile {
      background: color-mix(in srgb, var(--pq-full-bg) 48%, var(--pq-surface-2));
      border: 1px solid color-mix(in srgb, var(--pq-full) 20%, var(--pq-border));
      border-radius: calc(var(--pq-radius) - 3px);
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .pq-win-idle-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      min-width: 0;
    }

    .pq-win-idle-name {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.8em;
      font-weight: 600;
      min-width: 0;
      overflow: hidden;
    }

    .pq-win-idle-name span:last-child {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pq-win-idle-pct {
      font-size: 0.8em;
      font-weight: 700;
      color: var(--pq-full);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .pq-win-idle-sub {
      font-size: 0.72em;
      color: var(--pq-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Trend Chart */
    .pq-chart-box {
      border-top: 1px solid color-mix(in srgb, var(--pq-border) 70%, transparent);
      padding-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .pq-chart-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      min-width: 0;
    }

    .pq-chart-title {
      font-size: 0.8em;
      font-weight: 600;
      color: var(--pq-muted);
      white-space: nowrap;
    }

    .pq-chart-tabs .oc-sdk-tabs {
      padding: 1px;
    }

    .pq-chart-tabs .oc-sdk-tab {
      height: 22px;
      padding: 0 8px;
      font-size: 0.76em;
    }

    .pq-chart-body {
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-height: 132px;
      min-width: 0;
    }

    .pq-chart-loading,
    .pq-chart-empty {
      min-height: 126px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border-radius: calc(var(--pq-radius) - 3px);
      background: var(--pq-surface-2);
      border: 1px dashed color-mix(in srgb, var(--pq-border) 80%, transparent);
      color: var(--pq-muted);
      font-size: 0.8em;
      padding: 10px;
      text-align: center;
    }

    .pq-chart-readout {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px 8px;
      flex-wrap: wrap;
      min-height: 24px;
      padding: 3px 7px;
      border-radius: calc(var(--pq-radius) - 4px);
      background: var(--pq-surface-2);
      border: 1px solid color-mix(in srgb, var(--pq-border) 70%, transparent);
      font-size: 0.75em;
      transition: border-color 0.14s ease, background-color 0.14s ease;
    }

    .pq-chart-readout.is-scrubbing {
      border-color: color-mix(in srgb, var(--pq-full) 55%, var(--pq-border));
      background: color-mix(in srgb, var(--pq-full-bg) 55%, var(--pq-surface-2));
    }

    .pq-readout-items {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px 8px;
      min-width: 0;
    }

    .pq-readout-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    }

    .pq-readout-time {
      font-weight: 700;
      color: var(--pq-fg);
      white-space: nowrap;
    }

    .pq-readout-hint {
      color: var(--pq-muted);
      font-size: 0.92em;
      margin-left: auto;
      white-space: nowrap;
    }

    .pq-readout-clear {
      border: 1px solid var(--pq-border);
      background: var(--pq-surface);
      color: var(--pq-muted);
      border-radius: 999px;
      padding: 0 6px;
      height: 17px;
      font-size: 0.9em;
      line-height: 1;
      cursor: pointer;
      margin-left: auto;
    }

    .pq-chart-svg-wrap {
      width: 100%;
      min-width: 0;
      user-select: none;
      -webkit-user-select: none;
    }

    .pq-chart-svg {
      width: 100%;
      height: auto;
      display: block;
      overflow: visible;
      touch-action: pan-y;
    }

    .pq-svg-axis {
      fill: var(--pq-muted);
      font-family: var(--oc-mono, var(--font-mono, ui-monospace, monospace));
      font-size: 9px;
      font-variant-numeric: tabular-nums;
      pointer-events: none;
    }

    /* AIStudio Model List & Full-Health Fold Group */
    .pq-ais-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      flex-wrap: wrap;
      font-size: 0.78em;
      color: var(--pq-muted);
    }

    .pq-model-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .pq-model-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 7px 9px;
      border-radius: calc(var(--pq-radius) - 3px);
      background: var(--pq-surface-2);
      border: 1px solid color-mix(in srgb, var(--pq-border) 72%, transparent);
      min-width: 0;
      transition: border-color 0.15s ease;
    }

    .pq-model-row.is-empty {
      border-color: color-mix(in srgb, var(--pq-empty-bar) 45%, var(--pq-border));
    }

    .pq-model-row.is-full-compact {
      padding: 6px 8px;
      gap: 3px;
      background: color-mix(in srgb, var(--pq-full-bg) 36%, var(--pq-surface-2));
      border-color: color-mix(in srgb, var(--pq-full) 18%, var(--pq-border));
    }

    .pq-model-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      min-width: 0;
    }

    .pq-model-name {
      font-weight: 600;
      font-size: 0.88em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
      flex: 1 1 auto;
    }

    .pq-model-right {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      flex-shrink: 0;
    }

    .pq-full-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .pq-full-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 7px 9px;
      border-radius: calc(var(--pq-radius) - 3px);
      border: 1px dashed color-mix(in srgb, var(--pq-full) 38%, var(--pq-border));
      background: color-mix(in srgb, var(--pq-full-bg) 42%, transparent);
      color: var(--pq-fg);
      font: inherit;
      font-size: 0.81em;
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }

    .pq-full-toggle:hover {
      background: color-mix(in srgb, var(--pq-full-bg) 72%, transparent);
      border-color: color-mix(in srgb, var(--pq-full) 55%, var(--pq-border));
    }

    .pq-full-toggle-left {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      overflow: hidden;
    }

    .pq-full-toggle-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pq-chevron {
      display: inline-block;
      font-size: 0.88em;
      color: var(--pq-muted);
      transition: transform 0.16s ease;
      flex-shrink: 0;
    }

    .pq-chevron.is-open {
      transform: rotate(180deg);
    }

    .pq-full-list {
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-width: 0;
    }

    .pq-full-list[hidden] {
      display: none;
    }

    /* Bottom Collapsible Settings Card */
    .pq-settings-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
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

    .pq-settings-summary {
      font-size: 0.77em;
      color: var(--pq-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pq-settings-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-top: 9px;
      border-top: 1px solid var(--pq-border);
      min-width: 0;
    }

    .pq-settings-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }

    .pq-settings-group + .pq-settings-group {
      padding-top: 9px;
      border-top: 1px solid color-mix(in srgb, var(--pq-border) 65%, transparent);
    }

    .pq-settings-section-label {
      font-size: 0.76em;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--pq-muted);
      text-transform: uppercase;
    }

    .pq-settings-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .pq-footer-note {
      font-size: 0.75em;
      color: var(--pq-muted);
      padding: 0 2px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      flex-wrap: wrap;
    }

    @media (max-width: 260px) {
      .pq-win-idle-grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `,document.head.appendChild(_)},c=(_,T,E)=>{let S=document.createElement(_);if(T)S.className=T;if(E!==void 0)S.textContent=E;return S},O_=(_,T={})=>{let E=document.createElementNS(DS,_);for(let[S,A]of Object.entries(T))E.setAttribute(S,String(A));return E},ZS=()=>{let _=O_("svg",{width:14,height:14,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"});return _.appendChild(O_("circle",{cx:12,cy:12,r:3})),_.appendChild(O_("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})),_},p_=pT(),oE=document.querySelector("#root"),wo=!1,B_=!1,g_=!1,HE=!1,FE=!1,G=null,b_=!1,x_=!1,EE="http://127.0.0.1:18380",kE="",gE=!1,i_=null,UE=0,oS=new Map,iT=new Map,TE=new Set,HT=new WeakMap,uo=[],D_=[],m_=new Set,ZT=null,JT=null,W_=null,ZE=null,IE=null,qo=null,SE=(_)=>oS.get(_)??"5h",BT=(_,T)=>`${_}|${T}`,SS=(_)=>{for(let T of _)try{T()}catch{}},JS=()=>{for(let _ of m_)try{_()}catch{}};document.addEventListener("pointerdown",(_)=>{if(!_.target?.closest(".pq-chart-box"))JS()});var gS=async()=>{try{let _=await p_.storage.get(vo);if(_&&typeof _==="object"&&!Array.isArray(_)){let T=_;if(typeof T.aisFullExpanded==="boolean"&&T.aisFullExpanded!==x_){if(x_=T.aisFullExpanded,G?.snapshot)K_()}}}catch{}},iS=()=>{p_.storage.set(vo,{aisFullExpanded:x_}).catch(()=>{})},BS=()=>({winX:window.scrollX||0,winY:window.scrollY||0,docTop:document.documentElement?.scrollTop||0,bodyTop:document.body?.scrollTop||0,rootTop:oE.scrollTop||0,prevHeight:oE.getBoundingClientRect().height}),mS=(_)=>{let T=()=>{if(_.rootTop>0)oE.scrollTop=_.rootTop;if(_.docTop>0&&document.documentElement)document.documentElement.scrollTop=_.docTop;if(_.bodyTop>0&&document.body)document.body.scrollTop=_.bodyTop;let E=_.winY||_.docTop||_.bodyTop;if(E>0||_.winX>0)window.scrollTo({left:_.winX,top:E,behavior:"instant"})};T(),requestAnimationFrame(()=>{T(),oE.style.minHeight=""})},OE=async(_,T,E={})=>{let S=await p_.serviceRequest({method:_,path:T,...E.query?{query:E.query}:{},...E.body?{body:JSON.stringify(E.body)}:{}}),A=null;try{A=S.body?JSON.parse(S.body):null}catch{A=null}if(S.status<200||S.status>=300){let f=A&&typeof A==="object"&&"error"in A&&typeof A.error==="string"?A.error:`服务返回 HTTP ${S.status}`;throw Error(f)}return A},nE=(_)=>{if(!_||!_.account_id)return;let T=_.window==="7d"?"7d":"5h";iT.set(BT(_.account_id,T),{data:_,fetchedAtMs:Date.now()})},gT=(_,T,E,S)=>{let A=c("div"),f=ES(E.tier),k=(_.series??[]).filter((M)=>{if(!f&&_S(M.key,M.group))return!1;return Array.isArray(M.points)&&M.points.length>=2});if(k.length===0)return A.appendChild(c("div","pq-chart-empty",`暂无 ${T==="7d"?"7d":"5h"} 历史采样曲线`)),A;let I=[...k].sort((M,x)=>{let X=Jo.indexOf(M.key),H=Jo.indexOf(x.key);return(X===-1?0:X)-(H===-1?0:H)}),R=[...k].sort((M,x)=>{let X=go.indexOf(M.key),H=go.indexOf(x.key);return(X===-1?99:X)-(H===-1?99:H)}),n=320,N=112,r=30,L=8,Y=10,t=18,V=n-r-L,j=N-Y-t,Q=Y+j,K=Number.POSITIVE_INFINITY,a=Number.NEGATIVE_INFINITY;for(let M of k)for(let x of M.points){let X=yo(x[0]);if(X<K)K=X;if(X>a)a=X}let W=Math.max(1,a-K),B=(M)=>r+(M-K)/W*V,v=(M)=>Y+j*(1-$_(M)/100),A_=c("div","pq-chart-readout"),R_=()=>{A_.classList.remove("is-scrubbing"),A_.replaceChildren();let M=c("div","pq-readout-items");for(let x of R){let X=$_(x.points[x.points.length-1]?.[1]??x.remaining),H=JE(X),e=c("span","pq-readout-item"),w=c("span","pq-fam-dot");w.style.background=J_(x.key,x.group),e.appendChild(w),e.appendChild(c("span","pq-muted",mo(x))),e.appendChild(c("strong",`pq-mono pq-lv-${H}`,P_(X))),M.appendChild(e)}A_.appendChild(M),A_.appendChild(c("span","pq-readout-hint","悬停/滑动"))};R_(),A.appendChild(A_);let E_=c("div","pq-chart-svg-wrap"),J=O_("svg",{viewBox:`0 0 ${n} ${N}`,class:"pq-chart-svg",role:"img","aria-label":`${T} 周期剩余趋势`}),c_=O_("defs"),d=new Map;for(let M of I){let x=`pq-grad-${++zS}`;d.set(M.key,x);let X=J_(M.key,M.group),H=O_("linearGradient",{id:x,x1:"0",y1:"0",x2:"0",y2:"1"});H.appendChild(O_("stop",{offset:"0%","stop-color":X,"stop-opacity":"0.26"})),H.appendChild(O_("stop",{offset:"100%","stop-color":X,"stop-opacity":"0.01"})),c_.appendChild(H)}J.appendChild(c_);for(let M of[100,50,25,0]){let x=v(M),X=M===25,H=M===0;if(J.appendChild(O_("line",{x1:r,x2:n-L,y1:x.toFixed(1),y2:x.toFixed(1),stroke:X?"var(--pq-low)":"var(--pq-border)","stroke-opacity":X?"0.26":H?"0.75":"0.45","stroke-dasharray":H?"":"2.5 3","stroke-width":"1"})),M===100||M===50||M===0){let e=O_("text",{x:r-4,y:(x+3).toFixed(1),"text-anchor":"end",class:"pq-svg-axis"});e.textContent=`${M}%`,J.appendChild(e)}}let b=new Map;for(let M of I){let x=J_(M.key,M.group),X=d.get(M.key),H=M.points.map((o_)=>{let k_=yo(o_[0]),i=$_(o_[1]);return{t:k_,r:i,x:B(k_),y:v(i)}});b.set(M.key,H);let e=[],w=[];for(let o_=0;o_<H.length;o_+=1){let k_=H[o_],i=w[w.length-1];if(i&&k_.r-i.r>12){if(w.length>0)e.push(w);w=[k_]}else w.push(k_)}if(w.length>0)e.push(w);for(let o_ of e)if(o_.length>=2){let k_=o_.map((S_,H_)=>`${H_===0?"M":"L"}${S_.x.toFixed(1)},${S_.y.toFixed(1)}`).join(" "),i=o_[0],U_=o_[o_.length-1],G_=`M${i.x.toFixed(1)},${Q.toFixed(1)} ${o_.map((S_)=>`L${S_.x.toFixed(1)},${S_.y.toFixed(1)}`).join(" ")} L${U_.x.toFixed(1)},${Q.toFixed(1)} Z`;J.appendChild(O_("path",{d:G_,fill:`url(#${X})`,stroke:"none"})),J.appendChild(O_("path",{d:k_,fill:"none",stroke:x,"stroke-width":"1.9","stroke-linecap":"round","stroke-linejoin":"round"}))}let M_=H[H.length-1];if(M_)J.appendChild(O_("circle",{cx:M_.x.toFixed(1),cy:M_.y.toFixed(1),r:"4.6",fill:x,"fill-opacity":"0.24"})),J.appendChild(O_("circle",{cx:M_.x.toFixed(1),cy:M_.y.toFixed(1),r:"2.5",fill:x,stroke:"var(--pq-surface)","stroke-width":"1.2"}))}let N_=T==="7d"||W>=129600000?"md":"hm",Y_=[{x:r,t:K,anchor:"start"},{x:r+V/2,t:K+W/2,anchor:"middle"},{x:n-L,t:a,anchor:"end"}];for(let M of Y_){let x=O_("text",{x:M.x.toFixed(1),y:String(N-3),"text-anchor":M.anchor,class:"pq-svg-axis"});x.textContent=FT(M.t,N_),J.appendChild(x)}let r_=O_("line",{x1:r,x2:r,y1:Y,y2:Q,stroke:"var(--pq-fg)","stroke-opacity":"0.42","stroke-width":"1","stroke-dasharray":"2.5 2.5","pointer-events":"none"});r_.style.display="none",J.appendChild(r_);let y_=new Map;for(let M of I){let x=O_("circle",{cx:r,cy:Y,r:"3.6",fill:"var(--pq-surface)",stroke:J_(M.key,M.group),"stroke-width":"2","pointer-events":"none"});x.style.display="none",J.appendChild(x),y_.set(M.key,x)}let f_=O_("rect",{x:r,y:Y,width:V,height:j,fill:"transparent"});f_.style.cursor="crosshair",J.appendChild(f_);let Q_=!1,T_=!1,j_=()=>{if(!Q_)return;Q_=!1,T_=!1,UE=Math.max(0,UE-1),r_.style.display="none";for(let M of y_.values())M.style.display="none";R_()},g=(M,x)=>{let X=M[0],H=Math.abs(X.t-x);for(let e=1;e<M.length;e+=1){let w=M[e],M_=Math.abs(w.t-x);if(M_<=H)X=w,H=M_;else if(w.t>x)break}return X},AE=(M,x)=>{let X=J.getBoundingClientRect();if(!X.width)return;let H=Math.max(r,Math.min(n-L,(M-X.left)/X.width*n)),e=K+(H-r)/V*W;if(!Q_)Q_=!0,UE+=1;let w=e,M_=[];for(let i of R){let U_=b.get(i.key);if(!U_||U_.length===0)continue;let G_=g(U_,e);w=G_.t,M_.push({s:i,r:G_.r});let S_=y_.get(i.key);if(S_)S_.setAttribute("cx",G_.x.toFixed(1)),S_.setAttribute("cy",G_.y.toFixed(1)),S_.style.display=""}let o_=B(w);r_.setAttribute("x1",o_.toFixed(1)),r_.setAttribute("x2",o_.toFixed(1)),r_.style.display="",A_.classList.add("is-scrubbing"),A_.replaceChildren();let k_=c("div","pq-readout-items");k_.appendChild(c("span","pq-readout-time pq-mono",jS(w)));for(let{s:i,r:U_}of M_){let G_=JE(U_),S_=c("span","pq-readout-item"),H_=c("span","pq-fam-dot");H_.style.background=J_(i.key,i.group),S_.appendChild(H_),S_.appendChild(c("span","pq-muted",mo(i))),S_.appendChild(c("strong",`pq-mono pq-lv-${G_}`,P_(U_))),k_.appendChild(S_)}if(A_.appendChild(k_),x){let i=c("button","pq-readout-clear","×");i.type="button",i.title="关闭读数",i.addEventListener("click",(U_)=>{U_.stopPropagation(),j_()}),A_.appendChild(i)}};return J.addEventListener("pointerdown",(M)=>{let x=M.pointerType!=="mouse";if(x)T_=!0;AE(M.clientX,x)}),J.addEventListener("pointermove",(M)=>{let x=M.pointerType!=="mouse";if(!x||T_)AE(M.clientX,x)}),J.addEventListener("pointerup",()=>{T_=!1}),J.addEventListener("pointercancel",()=>{T_=!1}),J.addEventListener("pointerleave",(M)=>{if(M.pointerType==="mouse")j_()}),S.add(j_),A.__pqClearScrub=j_,E_.appendChild(J),A.appendChild(E_),A},fE=(_,T)=>{let E=HT.get(_);if(E){try{E()}catch{}m_.delete(E),HT.delete(_)}let S=T.__pqClearScrub;if(S)HT.set(_,S);_.replaceChildren(T)},ao=(_,T,E,S=!1)=>{let A=BT(T.id,E),f=iT.get(A),k=Date.now();if(f){if(fE(_,gT(f.data,E,T,m_)),!S&&k-f.fetchedAtMs<eo)return}else{let I=c("div","pq-chart-loading");I.textContent=`加载 ${E==="7d"?"7d":"5h"} 燃烧趋势…`,fE(_,I)}if(TE.has(A))return;TE.add(A),OE("GET","/panel/history",{query:{account:T.id,window:E,range:E==="7d"?"7d":"24h",...S?{force:"1"}:{}}}).then((I)=>{if(nE(I),!_.isConnected)return;if(SE(T.id)!==E)return;fE(_,gT(I,E,T,m_))}).catch(()=>{if(!_.isConnected)return;if(SE(T.id)!==E)return;if(!f)fE(_,c("div","pq-chart-empty","历史趋势暂不可用"))}).finally(()=>{TE.delete(A)})},yS=(_,T)=>{if(!_)return null;if(_.has_recent_buckets&&Array.isArray(_.recent_buckets)&&_.recent_buckets.length>0){let E=_.recent_buckets,S=_.recent_window_success||0,A=_.recent_window_failure||0,f=S+A>0,k=_.recent_window_rate,R=`近 ${_.recent_window_minutes||200}m 成功率`,n=c("div","pq-recent-strip"),N=c("div","pq-recent-top"),r=c("span","pq-recent-label pq-num",R);N.appendChild(r);let L=c("div","pq-recent-meta pq-mono");if(f){if(L.appendChild(c("span","pq-recent-ok",`✓${S}`)),A>0)L.appendChild(c("span","pq-recent-fail",`✕${A}`))}let Y=!f||k==null?"":k>=95?"is-high":k>=80?"is-med":"is-low",t=f&&k!=null?P_(k):"空闲";L.appendChild(c("span",`pq-rate-capsule ${Y}`,t)),N.appendChild(L),n.appendChild(N);let V=c("div","pq-buckets"),j=600000,Q=(T||Date.now())-E.length*j,K=null;return E.forEach((a,W)=>{let B=a.success||0,v=a.failed||0,A_=B+v,R_=A_===0,E_=c("div",`pq-bucket${R_?"":" is-active"}`);if(!R_)E_.style.background=QS(B/A_);let J=a.time||`${FT(Q+W*j,"hm")}-${FT(Q+(W+1)*j,"hm")}`,c_=R_?`${J} · 无请求`:`${J} · ✓${B}${v>0?` ✕${v}`:""} (${P_(B/A_*100)})`;E_.title=c_;let d=()=>{if(K&&K!==E_)K.classList.remove("is-focus");K=E_,E_.classList.add("is-focus"),r.textContent=c_};E_.addEventListener("pointerenter",(b)=>{if(b.pointerType==="mouse")d()}),E_.addEventListener("click",(b)=>{if(b.stopPropagation(),K===E_)E_.classList.remove("is-focus"),K=null,r.textContent=R;else d()}),V.appendChild(E_)}),V.addEventListener("pointerleave",(a)=>{if(a.pointerType==="mouse"){if(K)K.classList.remove("is-focus");K=null,r.textContent=R}}),n.appendChild(V),n}if(Array.isArray(_.recent_bars)&&_.recent_bars.length>0){let{recent_bars:E,recent_success_rate:S}=_,A=c("div","pq-recent-strip"),f=c("div","pq-recent-top");f.appendChild(c("span","pq-recent-label pq-num",`近 ${E.length} 次请求`));let k=S==null?"":S>=95?"is-high":S>=80?"is-med":"is-low";f.appendChild(c("span",`pq-rate-capsule pq-mono ${k}`,S!=null?P_(S):"--")),A.appendChild(f);let I=c("div","pq-buckets");for(let R of E){let n=c("div","pq-bucket is-active");n.style.background=R.ok?"var(--pq-healthy-bar)":"var(--pq-low-bar)",I.appendChild(n)}return A.appendChild(I),A}if(_.available&&_.success_rate!=null){let E=c("div","pq-recent-strip"),S=c("div","pq-recent-top");S.appendChild(c("span","pq-recent-label","历史成功率"));let A=_.success_rate,f=A>=95?"is-high":A>=80?"is-med":"is-low";return S.appendChild(c("span",`pq-rate-capsule pq-mono ${f}`,P_(A))),E.appendChild(S),E}return null},wS=(_)=>{let T=$_(_.remaining_percent),E=JE(T),S=c("div",`pq-win-active${E==="empty"?" is-empty":""}`),A=c("div","pq-win-top"),f=c("div","pq-win-name-wrap"),k=c("span","pq-fam-dot");k.style.background=J_(_.key,_.group),f.appendChild(k),f.appendChild(c("span","pq-win-name",_.label||_.key)),A.appendChild(f);let I=c("div","pq-win-val-wrap");if(E==="empty")I.appendChild(c("span","pq-pill pq-pill-empty","已耗尽"));I.appendChild(c("span",`pq-win-val pq-lv-${E}`,`剩 ${P_(T)}`)),A.appendChild(I),S.appendChild(A);let R=c("div",`pq-bar-track${E==="empty"?" is-empty":""}`),n=c("div",`pq-bar-fill pq-bar-${E}`);n.style.width=`${T}%`,R.appendChild(n),S.appendChild(R);let N=c("div","pq-win-sub"),r=c("div","pq-win-usage pq-mono");if(_.has_current_usage&&(_.current_cost>0||_.current_tokens>0)){let L=[`已用 ${QT(_.current_cost)}`];if(_.current_tokens>0)L.push(jT(_.current_tokens));if(r.appendChild(c("span","",L.join(" / "))),_.has_forecast&&_.forecast_cost>0){let Y=_.forecast_basis==="previous"?"参考":"预测";r.appendChild(c("span","",`· ${Y} ${QT(_.forecast_cost)}`))}}else r.appendChild(c("span","","本窗暂无费用记录"));if(N.appendChild(r),_.stale)N.appendChild(c("span","pq-win-reset pq-mono","待采样"));else if(_.reset_at_ms>0)N.appendChild(c("span","pq-win-reset pq-mono",`重置 ${jE(_.reset_at_ms)}`));return S.appendChild(N),S},uS=(_)=>{let T=c("div","pq-win-idle-tile"),E=c("div","pq-win-idle-top"),S=c("span","pq-win-idle-name"),A=c("span","pq-fam-dot");A.style.background=J_(_.key,_.group),S.appendChild(A),S.appendChild(c("span","",_.label||_.key)),E.appendChild(S),E.appendChild(c("span","pq-win-idle-pct pq-mono","100%")),T.appendChild(E);let f=c("div","pq-bar-track is-thin"),k=c("div","pq-bar-fill pq-bar-full");k.style.width="100%",f.appendChild(k),T.appendChild(f);let I=!_.stale&&_.reset_at_ms>0?`满血 · ${jE(_.reset_at_ms)}`:"满血未动用";return T.appendChild(c("div","pq-win-idle-sub pq-mono",I)),T},qS=(_,T,E)=>{let S=c("div","pq-acct-block"),A=c("div","pq-acct-head"),f=c("div","pq-acct-id");if(f.appendChild(c("span","pq-acct-name",_.code_name||_.id)),_.tier)f.appendChild(c("span",`pq-pill ${TS(_.tier)}`,_.tier));A.appendChild(f);let k=_.status_label||(_.status==="available"?"可用":_.status||"未知");A.appendChild(c("span",`pq-pill ${YS(_.status)}`,k)),S.appendChild(A);let I=yS(_.history,T);if(I)S.appendChild(I);let R=WS(_).sort((r,L)=>{let Y=Zo.indexOf(r.key),t=Zo.indexOf(L.key);return(Y===-1?99:Y)-(t===-1?99:t)}),n=R.filter(Bo),N=R.filter((r)=>!Bo(r));if(n.length>0){let r=c("div","pq-win-list");for(let L of n)r.appendChild(wS(L));S.appendChild(r)}if(N.length>0){let r=c("div",`pq-win-idle-grid${N.length===1?" is-single":""}`);for(let L of N)r.appendChild(uS(L));S.appendChild(r)}if(R.length===0)S.appendChild(c("div","pq-muted","暂无配额窗口采样"));if(_.has_history){let r=c("div","pq-chart-box"),L=c("div","pq-chart-head");L.appendChild(c("span","pq-chart-title","周期燃烧趋势"));let Y=c("div","pq-chart-tabs"),t=c("div","pq-chart-body");t.dataset.pqChartBody=_.id;let V=SE(_.id),j=null;j=zT(Y,{items:[{id:"5h",label:"5h"},{id:"7d",label:"7d"}],activeId:V,trackBackground:!0,onChange:(Q)=>{if(Q!=="5h"&&Q!=="7d")return;oS.set(_.id,Q),j?.update({activeId:Q}),ao(t,_,Q,!1)}}),E.push(()=>j?.dispose()),L.appendChild(Y),r.appendChild(L),r.appendChild(t),S.appendChild(r),ao(t,_,V,!1)}return S},aS=(_,T)=>{let E=c("div","pq-card"),S=_.antigravity,A=c("div","pq-card-head"),f=c("div","pq-card-head-left");if(f.appendChild(c("h4","pq-card-title","Antigravity 号池")),S.online&&S.accounts.length>1&&S.summary?.tier_counts)for(let N of["Ultra","Pro","Free"]){let r=S.summary.tier_counts[N]??0;if(r>0)f.appendChild(c("span",`pq-pill pq-num ${TS(N)}`,`${N}×${r}`))}A.appendChild(f);let k=c("div"),I=S.summary?.active_accounts??S.accounts.length,R=YE(k,{label:S.online?`${I} 号在线`:"离线",tone:S.online?S.status==="degraded"?"warning":"success":"error"});if(T.push(()=>R.dispose()),A.appendChild(k),E.appendChild(A),!S.online||!Array.isArray(S.accounts)||S.accounts.length===0)return E.appendChild(c("div","pq-muted",S.status_message||"暂无活跃 Antigravity 账号数据")),E;let n=c("div","pq-acct-list");for(let N of S.accounts)n.appendChild(qS(N,_.generated_at_ms,T));return E.appendChild(n),E},so=(_,T=!1)=>{let E=$_(_.effective_percent),S=_.eligible_accounts>0&&_.available_accounts===0,A=JE(E,S),f=c("div",`pq-model-row${A==="empty"?" is-empty":""}${T?" is-full-compact":""}`),k=c("div","pq-model-top");k.appendChild(c("span","pq-model-name",_.label||_.id));let I=c("div","pq-model-right");if(S)I.appendChild(c("span","pq-pill pq-pill-empty","已耗尽"));else if(!T&&_.eligible_accounts>0&&(E<99.5||_.used_requests>0||_.used_tokens>0)){let L=Fo(_);I.appendChild(c("span",`pq-pill ${L?"pq-bottleneck-tok":"pq-bottleneck-req"}`,L?"Token 短板":"次数短板"))}I.appendChild(c("span",`pq-win-val pq-lv-${A}`,P_(E))),k.appendChild(I),f.appendChild(k);let R=c("div",`pq-bar-track${T?" is-thin":""}${A==="empty"?" is-empty":""}`),n=c("div",`pq-bar-fill pq-bar-${A}`);n.style.width=`${E}%`,R.appendChild(n),f.appendChild(R);let N=c("div","pq-win-sub"),r=_.cooling_accounts>0?`可用 ${_.available_accounts}/${_.eligible_accounts} 号 · ${_.cooling_accounts} 冷却`:`可用 ${_.available_accounts}/${_.eligible_accounts} 号`;return N.appendChild(c("span","pq-mono",r)),N.appendChild(c("span","pq-mono",`剩 ${_.effective_remaining_requests}次 / ${jT(_.effective_remaining_tokens)}`)),f.appendChild(N),f},sS=(_,T)=>{let E=c("div","pq-card"),S=_.aistudio,A=c("div","pq-card-head");A.appendChild(c("h4","pq-card-title","AIStudio2API 号池"));let f=c("div"),k=S.account_counts?.ready??0,I=S.account_counts?.enabled??0,R=YE(f,{label:S.online?`${k}/${I} 号就绪`:"离线",tone:S.online?k===I?"success":"warning":"error"});if(T.push(()=>R.dispose()),A.appendChild(f),E.appendChild(A),!S.online)return E.appendChild(c("div","pq-muted",S.status_message||"AIStudio2API 当前离线")),E;let n=c("div","pq-ais-meta pq-mono"),N=S.playground;if(n.appendChild(c("span","",`Playground ${N?.requests??0}次`)),S.next_reset_ms>0)n.appendChild(c("span","",`16:00 重置 · ${jE(S.next_reset_ms)}`));E.appendChild(n);let r=Array.isArray(S.models)?S.models:[];if(r.length===0)return E.appendChild(c("div","pq-muted","暂无模型配额数据")),E;let L=[],Y=[];for(let t of r)if(KS(t))L.push(t);else Y.push(t);if(L.sort((t,V)=>{let j=t.eligible_accounts>0&&t.available_accounts===0?0:1,Q=V.eligible_accounts>0&&V.available_accounts===0?0:1;if(j!==Q)return j-Q;return $_(t.effective_percent)-$_(V.effective_percent)}),L.length>0){let t=c("div","pq-model-list");for(let V of L)t.appendChild(so(V,!1));E.appendChild(t)}if(Y.length>0){let t=c("div","pq-full-group"),V=c("button","pq-full-toggle");V.type="button";let j=c("span","pq-full-toggle-left"),Q=c("span","pq-fam-dot");Q.style.background="var(--pq-full-bar)",j.appendChild(Q);let K=c("span","pq-full-toggle-text"),a=(v)=>L.length>0?`其余 ${Y.length} 个模型 100% 满血 · ${v?"点击收起":"点击展开"}`:`全部 ${Y.length} 个模型 100% 满血 · ${v?"点击收起":"点击展开"}`;K.textContent=a(x_),j.appendChild(K);let W=c("span",`pq-chevron${x_?" is-open":""}`,"▾");V.appendChild(j),V.appendChild(W),V.setAttribute("aria-expanded",String(x_));let B=c("div","pq-full-list");B.hidden=!x_;for(let v of Y)B.appendChild(so(v,!0));V.addEventListener("click",()=>{x_=!x_,iS(),B.hidden=!x_,K.textContent=a(x_),W.classList.toggle("is-open",x_),V.setAttribute("aria-expanded",String(x_))}),t.appendChild(V),t.appendChild(B),E.appendChild(t)}return E},OS=()=>{if(!JT)return;JT.setAttribute("aria-expanded",String(b_))},RE=(_)=>{SS(D_),D_=[],ZE=null,IE=null;let T=G?.config.hasPasscode===!0,E=G?.config.showAis??!0,S=G?.config.compactQuota??!0,A=G?.config.url??EE,f=document.createDocumentFragment(),k=c("button","pq-settings-toggle");k.type="button",k.setAttribute("aria-expanded",String(b_)),k.appendChild(c("span","pq-card-title","连接与显示设置"));let I=c("span",`pq-chevron${b_?" is-open":""}`,"▾");if(k.appendChild(I),k.addEventListener("click",()=>{b_=!b_,OS(),RE(_)}),f.appendChild(k),!b_){let W=[E?"AIS 显示":"AIS 隐藏",S?"紧凑文案":"详细文案",HS(A),T?"已设口令":"无口令"];f.appendChild(c("div","pq-settings-summary pq-mono",W.join(" · "))),_.replaceChildren(f);return}let R=c("div","pq-settings-body"),n=c("div","pq-settings-group");n.appendChild(c("div","pq-settings-section-label","显示偏好"));let N=c("div");ZE=KE(N,{label:"显示 AIStudio 号池",description:"同时控制顶栏/Usage 总卡、Work Status 与本面板是否展示 AIS 模型余量",checked:E,disabled:HE,onChange:(W)=>void vS(W)}),D_.push(()=>ZE?.dispose()),n.appendChild(N);let r=c("div");IE=KE(r,{label:"紧凑配额文案（适配手机端）",description:"精简手机端浮层与 Usage 总卡文案避免窄屏叠字；本面板始终展示完整数据",checked:S,disabled:FE,onChange:(W)=>void eS(W)}),D_.push(()=>IE?.dispose()),n.appendChild(r),R.appendChild(n);let L=c("div","pq-settings-group");L.appendChild(c("div","pq-settings-section-label","看板连接"));let Y=c("div"),t=WE(Y,{label:"看板地址 URL",value:EE,placeholder:"http://127.0.0.1:18380 或 https://your-board.example.com",mono:!0,onChange:(W)=>{EE=W,gE=!0,t.update({value:W})}});D_.push(()=>t.dispose()),L.appendChild(Y);let V=c("div"),j=WE(V,{label:"访问口令 (X-View-Passcode)",value:kE,password:!0,placeholder:T?"已保存口令（留空保存将保持原口令不变）":"若看板未设口令可留空",helper:"仅写入本机 0600 配置文件，不会回显给前端或暴露给对话上下文。",onChange:(W)=>{kE=W,j.update({value:W})}});if(D_.push(()=>j.dispose()),L.appendChild(V),i_){let W=c("div"),B=QE(W,{tone:i_.tone,title:i_.text});D_.push(()=>B.dispose()),L.appendChild(W)}let Q=c("div","pq-settings-actions"),K=c("div"),a=X_(K,{label:g_?"测试中...":"测试并保存",size:"sm",loading:g_,disabled:g_,onClick:()=>void lo(!1)});if(D_.push(()=>a.dispose()),Q.appendChild(K),T){let W=c("div"),B=X_(W,{label:"清空口令",variant:"outline",size:"sm",disabled:g_,onClick:()=>void lo(!0)});D_.push(()=>B.dispose()),Q.appendChild(W)}L.appendChild(Q),R.appendChild(L),f.appendChild(R),_.replaceChildren(f)},lS=(_,T)=>{let E=_.antigravity?.accounts??[];for(let S=1;S<E.length;S+=1){let A=E[S];if(!A.has_history)continue;let f=SE(A.id),k=BT(A.id,f),I=iT.get(k);if(!T&&I&&Date.now()-I.fetchedAtMs<eo)continue;if(TE.has(k))continue;TE.add(k),OE("GET","/panel/history",{query:{account:A.id,window:f,range:f==="7d"?"7d":"24h",...T?{force:"1"}:{}}}).then((R)=>{nE(R);let n=document.querySelector(`[data-pq-chart-body="${CSS.escape(A.id)}"]`);if(n&&SE(A.id)===f)fE(n,gT(R,f,A,m_))}).catch(()=>{}).finally(()=>{TE.delete(k)})}},ME=async(_=!1,T=!1)=>{if(B_)return;if(B_=!0,!G)K_();else if(!T)ZT?.update({loading:!0});let E=G?.snapshot?.antigravity?.accounts?.[0]?.id,S=E?SE(E):"5h";try{let A=await OE("GET","/panel/state",{query:{force:_?"1":"0",window:S,range:S==="7d"?"7d":"24h"}});if(G=A,nE(A.history),!gE)EE=A.config.url;if(A.errorCode==="unauthorized"||A.errorCode==="unreachable")b_=!0;if(K_(),A.snapshot)lS(A.snapshot,_)}catch(A){let f=A instanceof p&&A.code==="NO_SERVICE"?"请先在 Settings → Extensions 中批准本扩展的本地服务权限。":A instanceof Error?A.message:String(A);G={config:G?.config??{url:EE,hasPasscode:!1,showAis:!0,compactQuota:!0},snapshot:G?.snapshot??null,history:G?.history??null,error:f,errorCode:"unreachable",fetchedAtMs:Date.now()},b_=!0,K_()}finally{B_=!1,ZT?.update({loading:!1})}},vS=async(_)=>{if(HE)return;HE=!0;let T=G?.config.showAis??!0;if(ZE?.update({checked:_,disabled:!0}),G)G={...G,config:{...G.config,showAis:_}},K_();try{let E=await OE("POST","/panel/config",{body:{showAis:_}});G=E,nE(E.history),p_.toast({kind:"success",message:_?"已开启 AIStudio 号池显示（Usage 与顶栏刷新后同步）":"已隐藏 AIStudio 号池（Usage 与顶栏刷新后同步）"})}catch(E){if(G)G={...G,config:{...G.config,showAis:T}};p_.toast({kind:"error",message:E instanceof Error?E.message:"切换失败"})}finally{HE=!1,K_()}},eS=async(_)=>{if(FE)return;FE=!0;let T=G?.config.compactQuota??!0;if(IE?.update({checked:_,disabled:!0}),G)G={...G,config:{...G.config,compactQuota:_}};try{let E=await OE("POST","/panel/config",{body:{compactQuota:_}});G=E,nE(E.history),p_.toast({kind:"success",message:_?"已开启紧凑配额文案（适配手机端，Usage 刷新后同步）":"已切换为详细配额文案（Usage 刷新后同步）"})}catch(E){if(G)G={...G,config:{...G.config,compactQuota:T}};p_.toast({kind:"error",message:E instanceof Error?E.message:"切换失败"})}finally{FE=!1,IE?.update({checked:G?.config.compactQuota??T,disabled:!1})}},lo=async(_=!1)=>{if(g_=!0,i_={tone:"info",text:"正在测试连接..."},W_)RE(W_);try{let T=await OE("POST","/panel/test",{body:{url:EE.trim()||"http://127.0.0.1:18380",...kE?{passcode:kE}:{},..._?{clearPasscode:!0}:{},showAis:G?.config.showAis??!0,compactQuota:G?.config.compactQuota??!0,save:!0}});if(!T.ok){i_={tone:"error",text:T.message||"连接测试失败"},p_.toast({kind:"error",message:T.message||"连接测试失败"});return}kE="",gE=!1,i_={tone:"success",text:T.summary||"连接成功并已保存"},p_.toast({kind:"success",message:T.summary||"配置已保存"}),await ME(!0,!1)}catch(T){let E=T instanceof Error?T.message:String(T);i_={tone:"error",text:E},p_.toast({kind:"error",message:E})}finally{if(g_=!1,W_)RE(W_);else K_()}},K_=()=>{let _=BS();if(_.prevHeight>0)oE.style.minHeight=`${Math.ceil(_.prevHeight)}px`;let T=[],E=new Set,S=m_;m_=E,UE=0;let A=c("div","pq-wrap"),f=G?.config.showAis??!0,k=c("div","pq-header"),I=c("div","pq-brand");if(I.appendChild(c("h3","pq-title","Pool Quota")),B_&&!G){let t=c("div"),V=YT(t,{size:"sm"});T.push(()=>V.dispose()),I.appendChild(t)}else if(G?.snapshot){let t=c("div","pq-pool-dots"),V=G.snapshot.antigravity,j=G.snapshot.aistudio,Q=!V.online?"is-err":V.status==="degraded"?"is-warn":"is-ok",K=c("span",`pq-dot-chip ${Q}`);if(K.appendChild(c("span","pq-dot")),K.appendChild(document.createTextNode("AG")),t.appendChild(K),f){let a=j.account_counts?.ready??0,W=j.account_counts?.enabled??0,B=!j.online?"is-err":a<W?"is-warn":"is-ok",v=c("span",`pq-dot-chip ${B}`);v.appendChild(c("span","pq-dot")),v.appendChild(document.createTextNode("AIS")),t.appendChild(v)}I.appendChild(t)}k.appendChild(I);let R=c("div","pq-actions"),n=c("div"),N=X_(n,{label:"刷新",variant:"outline",size:"xs",loading:B_,onClick:()=>void ME(!0,!1)});if(T.push(()=>N.dispose()),R.appendChild(n),G?.config.url){let t=c("div"),V=X_(t,{label:"看板",variant:"ghost",size:"xs",onClick:()=>{if(G?.config.url)p_.openUrl(G.config.url)}});T.push(()=>V.dispose()),R.appendChild(t)}let r=c("button","pq-icon-btn");if(r.type="button",r.title="连接与显示设置",r.setAttribute("aria-label","连接与显示设置"),r.setAttribute("aria-expanded",String(b_)),r.appendChild(ZS()),r.addEventListener("click",()=>{if(b_=!b_,OS(),W_){if(RE(W_),b_)requestAnimationFrame(()=>{W_?.scrollIntoView({behavior:"smooth",block:"nearest"})})}}),R.appendChild(r),k.appendChild(R),A.appendChild(k),G?.error){let t=c("div"),V=QE(t,{tone:G.errorCode==="unauthorized"?"warning":"error",title:G.errorCode==="unauthorized"?"需要访问口令":"看板连接异常",body:G.error});T.push(()=>V.dispose()),A.appendChild(t)}if(G?.snapshot){if(A.appendChild(aS(G.snapshot,T)),f)A.appendChild(sS(G.snapshot,T))}else if(!B_&&!G?.error){let t=c("div"),V=KT(t,{title:"尚未读取到号池数据",body:"请在下方「连接与显示设置」中填写看板地址与访问口令后点击测试并保存。",action:{label:"重试",onClick:()=>void ME(!0,!1)}});T.push(()=>V.dispose()),A.appendChild(t)}let L=c("div","pq-card");if(A.appendChild(L),G?.fetchedAtMs){let t=new Date(G.fetchedAtMs).toLocaleTimeString(),V=c("div","pq-footer-note pq-mono");V.appendChild(c("span","",`更新于 ${t}`)),V.appendChild(c("span","","Settings → Usage 可置顶总卡")),A.appendChild(V)}let Y=uo;uo=T,ZT=N,JT=r,W_=L,SS(Y),S.clear(),RE(L),oE.replaceChildren(A),mS(_)},_O=()=>{if(qo!==null)return;qo=window.setInterval(()=>{if(document.visibilityState!=="visible")return;if(B_||g_||gE||UE>0)return;let _=document.activeElement?.tagName;if(_==="INPUT"||_==="TEXTAREA")return;ME(!1,!0)},hS)};FS();p_.onReady((_)=>{if(NT(_,document.documentElement),wo)return;wo=!0,K_(),gS(),ME(!1,!1),_O()});})();
