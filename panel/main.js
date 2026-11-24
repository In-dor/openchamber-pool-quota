(()=>{var t="openchamber.sdk",z=1;var vE=`
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
`;function sE(_){let E=_.documentElement;if(E.hasAttribute("data-oc-scrollbar-activity"))return;E.setAttribute("data-oc-scrollbar-activity","");let T=new WeakMap;_.addEventListener("scroll",(o)=>{let O=o.target===_?E:o.target;if(!(O instanceof Element))return;if(!O.hasAttribute("data-oc-scrolling"))O.setAttribute("data-oc-scrolling","");let f=T.get(O);if(f!==void 0)clearTimeout(f);T.set(O,setTimeout(()=>{T.delete(O),O.removeAttribute("data-oc-scrolling")},1000))},{capture:!0,passive:!0})}var Io=`(${sE.toString()})(document);`;var eE=128,_T=65536;var rE=128;var LE=65536;var ET=8000,TT=192000,ST=120000;var lT=(_)=>{let E=[],T=0,o=0;return{push:(O)=>{E.push(O),o+=O.length;while(o-T>_&&E.length>1){let f=E.shift();o-=f?.length??0,T=0}},pull:(O)=>{let f=0;while(f<O.length&&E.length>0){let k=E[0],U=Math.min(O.length-f,k.length-T);if(O.set(k.subarray(T,T+U),f),f+=U,T+=U,T>=k.length)E.shift(),o-=k.length,T=0}O.fill(0,f)},clear:()=>{E.length=0,T=0,o=0},get size(){return o-T}}};var eT=/^[a-z][a-z0-9-]{0,39}$/;var aT=(_)=>Object(_)===_&&!Array.isArray(_),oT=(_,E)=>Object.keys(_).every((T)=>E.includes(T)),vT=(_)=>String(_)===_&&_.length>=1&&_.length<=60,sT=(_)=>String(_)===_&&_.length>=1&&_.length<=80,_S=(_)=>{if(!Array.isArray(_)||_.length>4)return!1;let E=new Set;for(let T of _){if(!aT(T)||!eT.test(T.id)||!vT(T.label))return!1;if(T.disabled!==void 0&&T.disabled!==!0&&T.disabled!==!1)return!1;if(E.has(T.id))return!1;if(E.add(T.id),T.kind==="button"){if(!oT(T,["kind","id","label","disabled"]))return!1;continue}if(T.kind!=="select"||!oT(T,["kind","id","label","value","options","disabled"]))return!1;if(!sT(T.value)||!Array.isArray(T.options)||T.options.length<1||T.options.length>16)return!1;let o=new Set;for(let O of T.options){if(!aT(O)||!oT(O,["value","label"])||!sT(O.value)||!vT(O.label)||o.has(O.value))return!1;o.add(O.value)}if(!o.has(T.value))return!1}return!0};var ES=["{id}","{segment}","{segments+}"];var NO=new Set(ES);var TS=["turn-finished","turn-failed","permission-asked","question-asked","turn-started","session-created","session-archived","session-deleted"];var GO=new Set(TS);var dE=20000000,PE=256;var OT=(_)=>("bytes"in _)?_.bytes.byteLength:_.content.length,SS=(_,E)=>{if(_.path!==E.path||_.readOnly!==E.readOnly)return!1;if(_.encoding==="text"||E.encoding==="text")return _.encoding==="text"&&E.encoding==="text"&&_.content===E.content;if(_.bytes.byteLength!==E.bytes.byteLength)return!1;for(let T=0;T<_.bytes.byteLength;T+=1)if(_.bytes[T]!==E.bytes[T])return!1;return!0};var oS=/^[A-Za-z0-9_-]{1,80}$/;var OS=["left","right","top","bottom"];var AS=(_,E=0,T={remaining:16000})=>{if(--T.remaining<0||E>=32)return!1;if(_===null)return!0;let o=Array.isArray(_)?_:Object(_)===_?Object.values(_):[];for(let O of o)if(!AS(O,E+1,T))return!1;return!0},AT=(_)=>{if(_===null||_===!0||_===!1)return!0;if(Array.isArray(_))return Object.keys(_).every((E)=>/^(0|[1-9]\d*)$/.test(E)&&Number(E)<_.length)&&_.every(AT);if(Object(_)===_){let E=Object.getPrototypeOf(_);return(E===null||E===Object.prototype)&&Object.values(_).every(AT)}return String(_)===_||Number.isFinite(_)},cT=(_)=>{try{if(String(_.id)!==_.id||!oS.test(_.id)||!Number.isFinite(_.anchor.x)||Math.abs(_.anchor.x)>1e5||!Number.isFinite(_.anchor.y)||Math.abs(_.anchor.y)>1e5||!Number.isFinite(_.anchor.width)||!Number.isFinite(_.anchor.height)||_.anchor.width<=0||_.anchor.height<=0||_.anchor.width>1e5||_.anchor.height>1e5||!Number.isInteger(_.width)||_.width<160||_.width>640||!Number.isInteger(_.height)||_.height<48||_.height>480||_.side!==void 0&&!OS.includes(_.side)||_.focus!==void 0&&_.focus!==!0&&_.focus!==!1||!AS(_.data)||!AT(_.data))return!1;return JSON.stringify(_.data).length<=16000}catch{return!1}};var cS=/^[0-9a-f]{7,64}$/i,fS=(_)=>cS.test(_),fT=255,kS=(_,E,T)=>({openCommit:(o)=>fS(o)?_({channel:t,v:z,type:"open-commit",id:E(),payload:{sha:o}}):T("Commit id must be 7 to 64 hex characters."),openWalkthrough:({base:o})=>{let O=o.trim();if(!O||O.length>fT)return T(`Base must contain 1 to ${fT} characters.`);return _({channel:t,v:z,type:"open-walkthrough",id:E(),payload:{base:O}})}});var UT=2000;var IS=["file","directory","other","missing"],IT=(_)=>Boolean(_&&"sessionId"in _),RT=(_)=>Boolean(_&&"sent"in _&&!("sessionId"in _));var DE=500,hE=32000,RS=16000,MS=128,xS=200,$S=2000,CS=16000,nS=80,NS=200,bS=16000;var GS=2000;var MT=20000,tE=1024,zE=2000000;var KE=64000,WE=8000,xT=4000;var $T=960000;var pS=999,XS=1e4,xE=500,VS=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],rS=["stopped","starting","ready","failed"],Mo=new Set(VS),LS=(_)=>Mo.has(_),dS=(_)=>_&&LS(_)?_:"HOST_REJECTED",s_=(_)=>{if(_===void 0)return!1;if(_===null||_===!0||_===!1)return!0;if(String(_)===_)return!0;if(Number(_)===_)return Number.isFinite(_);if(Array.isArray(_))return _.every(s_);if(Object(_)===_)return Object.values(_).every(s_);return!1},PS=(_)=>s_(_)&&JSON.stringify(_).length<=bS,US=(_)=>_?.trim().slice(0,NS)??"",e_=(_)=>{let E=_.id.trim().slice(0,MS),T=_.title.trim().slice(0,xS),o=_.url.trim().slice(0,$S),O=_.text?.trim().slice(0,CS),f=_.author?.trim().slice(0,nS),k=_.kind==="pull"?"pull":"issue",U={providerId:_.providerId.trim(),id:E,title:T||E,url:o,kind:k};if(O)U.text=O;if(f)U.author=f;if(k==="pull"){let R=US(_.branches?.head),x=US(_.branches?.base);if(R&&x)U.branches={head:R,base:x}}if(PS(_.data))U.data=_.data;return U},CT=(_)=>{let E=e_(_);if(_.projectId)E.projectId=_.projectId;if(_.navigation)E.navigation=_.navigation;if(_.worktree)E.worktree=_.worktree;return E},nT=(_)=>{let E={text:_.text.trim().slice(0,RS)};if(_.send)E.send=!0;return E},NT=(_)=>{if(_===null||!Number.isFinite(_))return null;return Math.min(pS,Math.max(0,Math.round(_)))},bT=(_)=>{if(!Number.isFinite(_))return 0;return Math.min(XS,Math.max(0,Math.ceil(_)))};var _E=(_)=>_.length>0&&_.length<=tE&&!_.includes("\x00")&&!_.includes("\\");var QE=(_)=>{if(!_.startsWith("/")||_.includes("\x00")||_.includes("\\")||_.includes("://"))return!1;if(_.length>GS)return!1;return!_.split("/").some((T)=>T==="."||T==="..")},xo=new Set(rS),GT=(_)=>Boolean(_&&"status"in _&&xo.has(String(_.status))&&!("body"in _)),YE=(_)=>Boolean(_&&"status"in _&&"body"in _&&Number.isInteger(_.status)),pT=(_)=>Boolean(_&&"content"in _&&String(_.content)===_.content),XT=(_)=>Boolean(_&&"written"in _&&_.written===!0),VT=(_)=>Boolean(_&&"entries"in _&&Array.isArray(_.entries)),$o=new Set(IS),rT=(_)=>Boolean(_&&"kind"in _&&"size"in _&&$o.has(String(_.kind))&&Number.isFinite(_.size)),LT=(_)=>Boolean(_&&"text"in _&&String(_.text)===_.text&&!("status"in _)),Co=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","service-event","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late","microphone-audio","microphone-ended"]),no=(_)=>Object(_)===_?_:null,kT=(_)=>String(_)===_&&_.length>0,No=(_)=>{if(!kT(_.id))return null;if(_.ok===!0){let E={channel:t,v:z,type:"result",id:_.id,ok:!0};if(Object(_.payload)===_.payload)E.payload=_.payload;return E}if(_.ok===!1&&kT(_.error))return{channel:t,v:z,type:"result",id:_.id,ok:!1,error:_.error,code:dS(kT(_.code)?_.code:void 0)};return null},dT=(_)=>{let E=no(_);if(!E||E.channel!==t||E.v!==z)return null;if(E.type==="result")return No(E);if(!Co.has(String(E.type))||Object(E.payload)!==E.payload)return null;return E};var DS=(_)=>("key"in _)&&("metaKey"in _)&&("ctrlKey"in _),bo=(_)=>(_.metaKey||_.ctrlKey)&&!_.altKey&&!_.shiftKey&&_.key.toLowerCase()==="s";class V extends Error{code;constructor(_,E){super(E);this.name="HostRequestError",this.code=_}}var hS=()=>Promise.reject(new V("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),HE=()=>Promise.reject(new V("BAD_PATH",`File path must be 1 to ${tE} characters without NUL or backslash.`)),ZE=(_)=>{if(_===void 0)return;if(Object(_)!==_||Array.isArray(_)||_.scope!==void 0&&_.scope!=="instance"&&_.scope!=="device")throw new V("HOST_REJECTED",'Storage scope must be "instance" or "device".');return _.scope==="device"?"device":void 0},P=(_)=>{return _.value+=1,`oc-${_.value}`},PT=(_={})=>{let E=_.target??("window"in globalThis?window:null);if(!E)throw new V("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let T=_.acceptSource??((S)=>S===E.parent),o=_.requestTimeoutMs??MT,O=new Set,f=new Set,k=new Set,U=new Set,R=new Set,x=new Set,G=new Set,C=new Set,L=new Set,H=new Set,n=new Set,N=new Set,Q=[],Y=null,j=null,i=new Set,K=new Set,m=null,a=null,r_=!1,S_=new Map,o_=new Map,b_=new Map,W=!1,d={value:0},X=null,G_=null,J_=!1,g_=!1,h_=null,U_=null,ME=(S)=>{if(!S)return null;return{sessionId:S.id,phase:S.busy?"started":"completed"}},O_=(S)=>{E.parent.postMessage(S,"*")},W_=()=>{if(W||E.parent===E||N.size===0||X?.features?.lateGenerateResults!==!0)return;O_({channel:t,v:z,type:"generate-late-listen"})},J=(S,A)=>{for(let p of S)try{p(A)}catch(b){console.error(b)}},XE=(S)=>{if(!(S instanceof MessageEvent))return;if(!T(S.source))return;let A=dT(S.data);if(!A)return;if(A.type==="workspace"){let b=o_.get(A.payload.subscriptionId);if(b)J([b],A.payload.snapshot);return}if(A.type==="shells"){let b=b_.get(A.payload.subscriptionId);if(b)J([b],A.payload.snapshot);return}if(A.type==="microphone-audio"){U_?.queue.push(A.payload.samples);return}if(A.type==="microphone-ended"){let b=U_;if(!b)return;U_=null,b.release(),J(b.endedListeners,A.payload.reason);return}if(A.type==="ready"){if(X=A.payload,G_=ME(A.payload.session),J(O,A.payload),J(f,A.payload.directory),J(k,A.payload.session),G_)J(U,G_);if(J(R,A.payload.connection),J(x,A.payload.settings),J(G,A.payload.item),A.payload.block)J(C,A.payload.block);W_();return}if(A.type==="service-event"){J(L,A.payload);return}if(A.type==="generate-late"){if(N.size===0)Q.push(A.payload);else J(N,A.payload);return}if(A.type==="directory"){if(X)X={...X,directory:A.payload.directory};J(f,A.payload.directory);return}if(A.type==="session"){if(X)X={...X,session:A.payload.session};if(!A.payload.session)G_=null;else if(G_?.sessionId!==A.payload.session.id)G_=ME(A.payload.session);J(k,A.payload.session);return}if(A.type==="session-lifecycle"){G_=A.payload,J(U,A.payload);return}if(A.type==="connection"){if(X)X={...X,connection:A.payload.connection};J(R,A.payload.connection);return}if(A.type==="settings"){if(X)X={...X,settings:A.payload.settings};J(x,A.payload.settings);return}if(A.type==="item"){if(X)X={...X,item:A.payload.item};J(G,A.payload.item);return}if(A.type==="status-control-event"){J(H,A.payload);return}if(A.type==="popover-closed"){J(n,A.payload);return}if(A.type==="action"){let b=(y)=>{if(!W)O_({channel:t,v:z,type:"action-result",id:A.id,payload:y})},B=j;if(!B){b({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>B(A.payload)).then(()=>b({ok:!0}),(y)=>{let w=(y instanceof Error?y.message:String(y)).trim();b({ok:!1,error:(w||"Action failed.").slice(0,xE)})});return}if(A.type==="file-open"){let b=A.payload;if(a&&SS(a,b))return;a=b,J(i,A.payload);return}if(A.type==="file-saved"){J(K,A.payload.version);return}if(A.type==="file-snapshot"){let b=(w)=>{if(!W)O_({channel:t,v:z,type:"file-snapshot-result",id:A.id,payload:w})},B=(w)=>b({error:(w.trim()||"Could not read the edited file.").slice(0,xE)}),y=m;if(!y){B("This extension does not edit files.");return}Promise.resolve().then(()=>y(A.payload.purpose)).then((w)=>{if(OT(w)>dE){B(`The file is over ${dE} ${"bytes"in w?"bytes":"characters"}.`);return}if(w.version.length>PE){B(`The snapshot version is over ${PE} characters.`);return}b({snapshot:"bytes"in w?{bytes:w.bytes,version:w.version}:{content:w.content,version:w.version}})},(w)=>B(w instanceof Error?w.message:String(w)));return}if(A.type==="resolve"){let b=(y)=>{O_({channel:t,v:z,type:"resolve-result",id:A.id,payload:y})},B=Y;if(!B){b({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>B(A.payload)).then((y)=>b({item:y?e_(y):null}),(y)=>{let w=(y instanceof Error?y.message:String(y)).trim();b({error:(w||"Command failed.").slice(0,xE)})});return}let p=S_.get(A.id);if(!p)return;if(clearTimeout(p.timer),S_.delete(A.id),A.ok){p.resolve(A.payload);return}p.reject(new V(A.code,A.error))};E.addEventListener("message",XE),O_({channel:t,v:z,type:"hello"});let A_=(S,A=o)=>{if(W||E.parent===E)return Promise.reject(new V("HOST_UNAVAILABLE","No host frame. This page is not in an iframe."));return new Promise((p,b)=>{let B=setTimeout(()=>{S_.delete(S.id),b(new V("HOST_TIMEOUT","Host did not answer in time."))},A);S_.set(S.id,{resolve:p,reject:b,timer:B}),O_(S)})},M=(S)=>A_(S).then(()=>{return}),$={channel:t,v:z},F=(S)=>{if(!W&&E.parent!==E)O_(S)},Z=()=>F({...$,type:"file-save"}),__=()=>{if(!W&&E.parent!==E)O_({...$,type:"microphone-close",id:P(d)})},f_=async()=>{if(U_)throw new V("HOST_REJECTED","The microphone is already open in this frame.");if(X?.features?.microphone!==!0)throw new V("UNSUPPORTED","This OpenChamber cannot share the microphone with extensions.");let S=globalThis.AudioContext;if(typeof S!=="function")throw new V("UNSUPPORTED","This frame has no Web Audio.");let A=new S;if(A.sampleRate<ET||A.sampleRate>TT)throw A.close().catch(()=>{return}),new V("UNSUPPORTED",`Audio at ${A.sampleRate} Hz is not supported.`);let p=A.state==="suspended"?A.resume().catch(()=>{return}):void 0,b=lT(Math.round(A.sampleRate/4)),B=A.createScriptProcessor(1024,1,1);B.onaudioprocess=(p_)=>b.pull(p_.outputBuffer.getChannelData(0));let y=A.createMediaStreamDestination();B.connect(y);let w=new Set,v_={queue:b,endedListeners:w,release:()=>{B.onaudioprocess=null,B.disconnect(),b.clear();for(let p_ of y.stream.getTracks())p_.stop();A.close().catch(()=>{return})}};U_=v_;try{let p_=await A_({...$,type:"microphone-open",id:P(d),payload:{sampleRate:A.sampleRate}},ST);if(!p_||!("opened"in p_)||p_.opened!==!0)throw new V("HOST_REJECTED","Host did not open the microphone.");if(await p,U_!==v_)throw new V("DISCONNECTED","The microphone closed while it was opening.")}catch(p_){if(U_===v_)U_=null;throw v_.release(),__(),p_}return{stream:y.stream,close:()=>{if(U_!==v_)return;U_=null,v_.release(),__()},onEnded:(p_)=>{return w.add(p_),()=>{w.delete(p_)}}}},R_=(S)=>{if(!DS(S)||!bo(S))return;S.preventDefault(),Z()},d_=(S)=>{if(!DS(S)||S.key!=="Escape"||X?.surface!=="popover"||!X.popover)return;S.preventDefault(),Q_(X.popover.id,"escape").catch(()=>{return})},$_=()=>{let S=X?.surface==="popover"?X.popover:void 0;if(!S)return;let A=J_||g_;if(h_===A)return;h_=A,VE(S.id,A).catch(()=>{return})},E_=()=>{if(X?.surface!=="popover"||J_)return;J_=!0,$_()},x_=(S)=>{if(X?.surface!=="popover"||S.relatedTarget!==null||!J_)return;J_=!1,$_()},c_=()=>{if(X?.surface!=="popover"||g_)return;g_=!0,$_()},k_=()=>{if(X?.surface!=="popover"||!g_)return;g_=!1,$_()},h=(S,A=1024)=>{if(!S.trim()||S.length>A)throw new V("HOST_REJECTED",`Identity must contain 1 to ${A} characters.`)},g=async(S)=>{if(S.kind!=="projects")h(S.projectId);let A=await A_({...$,type:"workspace-read",id:P(d),payload:S});if(!A||!("kind"in A)||!("state"in A)||A.kind!==S.kind)throw new V("HOST_REJECTED","Host did not return workspace data.");return A},I_=async(S,A)=>{if(S.kind!=="projects")h(S.projectId);let p=P(d);o_.set(p,A);try{await M({...$,type:"workspace-subscribe",id:P(d),payload:{subscriptionId:p,query:S}})}catch(b){if(o_.delete(p),!W)O_({...$,type:"workspace-unsubscribe",id:P(d),payload:{subscriptionId:p}});throw b}return()=>{if(!o_.delete(p)||W)return;O_({...$,type:"workspace-unsubscribe",id:P(d),payload:{subscriptionId:p}})}},l_=async(S,A)=>{if(S.kind==="session")h(S.sessionId);if(S.kind==="project")h(S.projectId);let p=P(d);b_.set(p,A);try{await M({...$,type:"shells-subscribe",id:P(d),payload:{subscriptionId:p,scope:S}})}catch(b){if(b_.delete(p),!W)O_({...$,type:"shells-unsubscribe",id:P(d),payload:{subscriptionId:p}});throw b}return()=>{if(!b_.delete(p)||W)return;O_({...$,type:"shells-unsubscribe",id:P(d),payload:{subscriptionId:p}})}},a_=async(S)=>{if("key"in S&&(S.key.length===0||S.key.length>eE))throw new V("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(S.op==="set"&&!s_(S.value))throw new V("HOST_REJECTED","Storage values must be JSON.");if(S.op==="set"&&new TextEncoder().encode(JSON.stringify(S.value)).length>_T)throw new V("HOST_REJECTED","Storage value exceeds 64 KiB.");if(S.scope==="device"&&X?.features?.deviceStorage!==!0)throw new V("UNSUPPORTED","This host does not support device storage.");let A=await A_({...$,type:"storage",id:P(d),payload:S});if(!A||!("storage"in A)||A.op!==S.op)throw new V("HOST_REJECTED","Host did not return storage data.");return A},Q_=(S,A)=>X?.features?.popovers!==!0&&!(X?.surface==="popover"&&X.popover?.id===S)?Promise.reject(new V("UNSUPPORTED","This host does not support popovers.")):M({...$,type:"popover-close",id:P(d),payload:A?{id:S,reason:A}:{id:S}}),VE=(S,A)=>X?.features?.popovers!==!0&&!(X?.surface==="popover"&&X.popover?.id===S)?Promise.reject(new V("UNSUPPORTED","This host does not support popovers.")):M({...$,type:"popover-anchor",id:P(d),payload:{id:S,active:A}});return E.addEventListener("keydown",d_,!0),E.addEventListener("pointerover",E_),E.addEventListener("pointermove",E_),E.addEventListener("pointerout",x_),E.addEventListener("focus",c_),E.addEventListener("blur",k_),{onAction:(S)=>{return j=S,()=>{if(j===S)j=null}},listProjects:async()=>{let S=await g({kind:"projects"});if(S.kind!=="projects")throw new V("HOST_REJECTED","Expected projects.");return S},listWorktrees:async(S)=>{let A=await g({kind:"worktrees",projectId:S});if(A.kind!=="worktrees")throw new V("HOST_REJECTED","Expected worktrees.");return A},listSessions:async(S)=>{let A=await g({kind:"sessions",projectId:S});if(A.kind!=="sessions")throw new V("HOST_REJECTED","Expected sessions.");return A},onProjects:(S)=>I_({kind:"projects"},(A)=>{if(A.kind==="projects")S(A)}),onWorktrees:(S,A)=>I_({kind:"worktrees",projectId:S},(p)=>{if(p.kind==="worktrees")A(p)}),onSessions:(S,A)=>I_({kind:"sessions",projectId:S},(p)=>{if(p.kind==="sessions")A(p)}),onRunningShells:(S,A)=>l_(S,A),readShellOutput:async(S,A)=>{h(S,rE);let p=A?.cursor;if(p!==void 0&&(!Number.isInteger(p)||p<0))throw new V("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let b=A?.tailBytes;if(b!==void 0&&(!Number.isInteger(b)||b<1||b>LE))throw new V("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${LE}.`);let y=await A_({...$,type:"shell-output",id:P(d),payload:{shellId:S,cursor:p,tailBytes:b}});if(!y||typeof y.output!=="string"||!Number.isFinite(y.cursor))throw new V("HOST_REJECTED","Host did not return shell output.");return y},stopShell:async(S)=>{if(h(S,rE),(await A_({...$,type:"shell-stop",id:P(d),payload:{shellId:S}}))?.stopped!==!0)throw new V("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async(S)=>{h(S),await M({...$,type:"open-session",id:P(d),payload:{sessionId:S}})},storage:{get:async(S,A)=>{let p=ZE(A),b={op:"get",key:S};if(p)b.scope=p;let B=await a_(b);return B.op==="get"&&B.found?B.value:void 0},set:async(S,A,p)=>{let b=ZE(p),B={op:"set",key:S,value:A};if(b)B.scope=b;await a_(B)},delete:async(S,A)=>{let p=ZE(A),b={op:"delete",key:S};if(p)b.scope=p;await a_(b)},keys:async(S)=>{let A=ZE(S),p={op:"keys"};if(A)p.scope=A;let b=await a_(p);if(b.op!=="keys")throw new V("HOST_REJECTED","Expected storage keys.");return b.keys}},onReady:(S)=>{if(O.add(S),X)S(X);return()=>{O.delete(S)}},onDirectory:(S)=>{if(f.add(S),X)S(X.directory);return()=>{f.delete(S)}},onSession:(S)=>{if(k.add(S),X)S(X.session);return()=>{k.delete(S)}},onSessionLifecycle:(S)=>{if(U.add(S),G_)S(G_);return()=>{U.delete(S)}},onConnection:(S)=>{if(R.add(S),X)S(X.connection);return()=>{R.delete(S)}},onSettings:(S)=>{if(x.add(S),X)S(X.settings);return()=>{x.delete(S)}},onItem:(S)=>{if(G.add(S),X)S(X.item);return()=>{G.delete(S)}},onBlock:(S)=>{if(C.add(S),X?.block)S(X.block);return()=>{C.delete(S)}},onServiceEvent:(S)=>{return L.add(S),()=>{L.delete(S)}},onStatusControl:(S)=>{return H.add(S),()=>{H.delete(S)}},onPopoverClosed:(S)=>{return n.add(S),()=>{n.delete(S)}},setStatusControls:(S)=>{if(X?.features?.statusControls!==!0)return Promise.reject(new V("UNSUPPORTED","This host does not support status controls."));if(!_S(S))return Promise.reject(new V("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options."));return M({...$,type:"status-controls",id:P(d),payload:{controls:S}})},openPopover:(S)=>{if(X?.features?.popovers!==!0)return Promise.reject(new V("UNSUPPORTED","This host does not support popovers."));if(!cT(S))return Promise.reject(new V("HOST_REJECTED","Popover requests need bounded geometry and JSON data."));return M({...$,type:"popover-open",id:P(d),payload:S})},closePopover:Q_,setPopoverAnchorActive:VE,onResolve:(S)=>{return Y=S,()=>{if(Y===S)Y=null}},toast:(S)=>{let A=S.message.trim();if(!A||A.length>DE)return Promise.reject(new V("HOST_REJECTED",`Toast message must contain 1 to ${DE} characters.`));if(S.copy&&S.copy!==!0&&(!S.copy.text.length||S.copy.text.length>hE))return Promise.reject(new V("HOST_REJECTED",`Toast copy text must contain 1 to ${hE} characters.`));return M({channel:t,v:z,type:"toast",id:P(d),payload:{...S,message:A}})},openUrl:(S)=>M({channel:t,v:z,type:"open-url",id:P(d),payload:{url:S}}),...kS(M,()=>P(d),(S)=>Promise.reject(new V("HOST_REJECTED",S))),answerBlock:(S)=>M({channel:t,v:z,type:"block-answer",id:P(d),payload:{text:S.trim().slice(0,UT)}}),openSurface:(S)=>M({channel:t,v:z,type:"open-surface",id:P(d),payload:{surfaceId:S}}),writeClipboard:(S)=>M({channel:t,v:z,type:"clipboard-write",id:P(d),payload:{text:S}}),compose:(S)=>M({channel:t,v:z,type:"compose",id:P(d),payload:S}),attach:(S)=>M({channel:t,v:z,type:"attach",id:P(d),payload:e_(S)}),startSession:async(S)=>{if(S.projectId!==void 0)h(S.projectId);let A=S.worktree;if(A&&A!==!0)if(A.kind==="existing")h(A.directory);else{if(A.name!==void 0)h(A.name,200);if(A.baseBranch!==void 0)h(A.baseBranch,200)}let p=await A_({channel:t,v:z,type:"start-session",id:P(d),payload:CT(S)},_.requestTimeoutMs??180000);if(!IT(p))throw new V("HOST_REJECTED","Host did not return a session.");return p},prompt:(S)=>A_({channel:t,v:z,type:"prompt",id:P(d),payload:nT(S)}).then((A)=>{if(!RT(A))throw new V("HOST_REJECTED","Host did not return a prompt result.");return A}),sessionLink:(S)=>M({channel:t,v:z,type:"session-link",id:P(d),payload:e_(S)}),close:()=>M({channel:t,v:z,type:"close",id:P(d)}),oauthStart:()=>M({channel:t,v:z,type:"oauth-start",id:P(d)}),oauthDisconnect:()=>M({channel:t,v:z,type:"oauth-disconnect",id:P(d)}),request:(S)=>(QE(S.path)?A_({channel:t,v:z,type:"request",id:P(d),payload:S}):hS()).then((A)=>{if(!YE(A))throw new V("HOST_REJECTED","Host request result was empty.");return A}),serviceRequest:(S)=>(QE(S.path)?A_({channel:t,v:z,type:"service-request",id:P(d),payload:S}):hS()).then((A)=>{if(!YE(A))throw new V("HOST_REJECTED","Host service request result was empty.");return A}),serviceStatus:()=>A_({channel:t,v:z,type:"service-status",id:P(d)}).then((S)=>{if(!GT(S))throw new V("HOST_REJECTED","Host did not return service status.");return S}),readFile:(S)=>(_E(S)?A_({channel:t,v:z,type:"file-read",id:P(d),payload:{path:S}}):HE()).then((A)=>{if(!pT(A))throw new V("HOST_REJECTED","Host did not return file content.");return A}),writeFile:(S,A)=>{if(!_E(S))return HE();if(A.length>zE)return Promise.reject(new V("FILE_TOO_LARGE",`Content is over ${zE} characters.`));return A_({channel:t,v:z,type:"file-write",id:P(d),payload:{path:S,content:A}}).then((p)=>{if(!XT(p))throw new V("HOST_REJECTED","Host did not confirm the write.");return p})},listDir:(S)=>(_E(S)?A_({channel:t,v:z,type:"file-list",id:P(d),payload:{path:S}}):HE()).then((A)=>{if(!VT(A))throw new V("HOST_REJECTED","Host did not return directory entries.");return A}),stat:(S)=>(_E(S)?A_({channel:t,v:z,type:"file-stat",id:P(d),payload:{path:S}}):HE()).then((A)=>{if(!rT(A))throw new V("HOST_REJECTED","Host did not return file status.");return A}),generate:(S)=>{let A=S.prompt.trim(),p=S.system?.trim();if(A.length===0||A.length>KE)return Promise.reject(new V("HOST_REJECTED",`Prompt must be 1 to ${KE} characters.`));if(p!==void 0&&(p.length===0||p.length>WE))return Promise.reject(new V("HOST_REJECTED",`System prompt must be 1 to ${WE} characters.`));let b=S.maxOutputTokens===void 0?void 0:Math.min(xT,Math.max(1,Math.floor(S.maxOutputTokens)));if(b!==void 0&&!Number.isFinite(b))return Promise.reject(new V("HOST_REJECTED","maxOutputTokens must be a number."));let B={prompt:A};if(p!==void 0)B.system=p;if(b!==void 0)B.maxOutputTokens=b;return A_({channel:t,v:z,type:"generate",id:P(d),payload:B},_.requestTimeoutMs??$T).then((y)=>{if(!LT(y))throw new V("HOST_REJECTED","Host did not return generated text.");return y})},onLateGenerateResult:(S)=>{N.add(S);for(let A of Q.splice(0))J([S],A);return W_(),()=>{N.delete(S)}},openMicrophone:f_,setBadge:(S)=>M({channel:t,v:z,type:"badge",id:P(d),payload:{count:NT(S)}}),setHeight:(S)=>M({channel:t,v:z,type:"resize",id:P(d),payload:{height:bT(S)}}),onFileOpen:(S)=>{if(i.add(S),!r_)r_=!0,E.addEventListener("keydown",R_,!0);if(a)S(a);return()=>{i.delete(S)}},onFileSnapshot:(S)=>{return m=S,()=>{if(m===S)m=null}},onFileSaved:(S)=>{return K.add(S),()=>{K.delete(S)}},reportFileChange:(S)=>F({...$,type:"file-change",payload:{dirty:S.dirty,edited:S.edited}}),requestFileSave:Z,reportFileUnsupported:()=>F({...$,type:"file-unsupported"}),dispose:()=>{for(let S of o_.keys())O_({...$,type:"workspace-unsubscribe",id:P(d),payload:{subscriptionId:S}});o_.clear();for(let S of b_.keys())O_({...$,type:"shells-unsubscribe",id:P(d),payload:{subscriptionId:S}});if(b_.clear(),U_)__(),U_.release(),U_=null;if(W=!0,Y=null,j=null,m=null,i.clear(),K.clear(),r_)E.removeEventListener("keydown",R_,!0);E.removeEventListener("message",XE),E.removeEventListener("keydown",d_,!0),E.removeEventListener("pointerover",E_),E.removeEventListener("pointermove",E_),E.removeEventListener("pointerout",x_),E.removeEventListener("focus",c_),E.removeEventListener("blur",k_);for(let S of S_.values())clearTimeout(S.timer),S.reject(new V("HOST_UNAVAILABLE","Host client was disposed."));S_.clear(),O.clear(),f.clear(),k.clear(),U.clear(),R.clear(),x.clear(),G.clear(),C.clear(),L.clear(),H.clear(),n.clear(),N.clear(),Q.length=0}}};var tS=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var JO=new Set(tS);var zS=["none","agent","user"];var BO=new Set(zS);var Go=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],po=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],KS=(_,E)=>{E.style.colorScheme=_.mode;for(let[T,o]of Go)E.style.setProperty(T,_.tokens[o]);for(let[T,o,O]of po){let f=_.tokens[O]??"";E.style.setProperty(T,f),E.style.setProperty(o,f)}E.style.setProperty("font-family",_.tokens.font),E.style.setProperty("font-size",_.tokens.fontSize??"0.875rem"),E.style.setProperty("line-height","1.45"),E.style.setProperty("color",_.tokens.foreground)},DT=(_,E)=>{if(KS(_.theme,E),E.dataset)E.dataset.ocSurface=_.surface,E.dataset.ocTheme=_.theme.mode};var Xo={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},q=(_,E)=>`var(--${_}, var(--oc-${Xo[_]}, ${E}))`,z_=q("surface-background","transparent"),FE=q("surface-elevated","transparent"),EE=q("surface-elevated-foreground","inherit"),n_=q("surface-foreground","inherit"),v=q("surface-muted-foreground","gray"),Vo=q("surface-muted","transparent"),B_=q("interactive-border","currentColor"),C_=q("interactive-hover","transparent"),y_=q("interactive-active","transparent"),hT=q("interactive-selection","transparent"),tT=q("interactive-selection-foreground","inherit"),t_=q("primary","currentColor"),zT=q("primary-text","inherit"),KT=q("error-text","inherit"),ro=q("font-sans","inherit"),WT=q("font-mono","monospace"),HS=q("radius","9px"),QT=`calc(${HS} - 2px)`,WS=`calc(${HS} - 4px)`,s=(_,E,T="transparent")=>`color-mix(in srgb, ${_} ${E}%, ${T})`,QS=`background-image: linear-gradient(${C_}, ${C_});`,YT=(_,E="0.5px")=>`box-shadow: inset 0 0 0 ${E} ${_}, var(--oc-sdk-field-lift);`,HT="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",YS="box-shadow: var(--oc-sdk-lit);",ZT=`inset 0 0.5px 0 0 ${s(n_,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,Lo=`
:root {
  --oc-sdk-edge: ${s(n_,16)};
  --oc-sdk-field-bg: ${FE};
  --oc-sdk-raised-bg: ${z_};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${s(n_,14)};
  --oc-sdk-field-bg: ${s(z_,50,FE)};
  --oc-sdk-raised-bg: ${FE};
  --oc-sdk-field-lift: ${ZT};
  --oc-sdk-raised-lift: ${ZT};
  --oc-sdk-lit: ${ZT};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,jE=(_)=>{let E=q(`status-${_}`,"currentColor");return`
.oc-sdk[data-tone="${_}"], .oc-sdk [data-tone="${_}"] { --oc-sdk-tone: ${E}; --oc-sdk-tone-text: ${q(`${_}-text`,"inherit")}; }`},I=(_)=>`calc(${_}rem / 14)`,Po=`
.oc-sdk { box-sizing: border-box; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: ${I(8)}; height: ${I(32)}; padding: 0 ${I(12)}; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; }
.oc-sdk-btn[data-size="sm"] { gap: ${I(6)}; height: ${I(28)}; padding: 0 ${I(10)}; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { gap: ${I(4)}; height: ${I(24)}; padding: 0 ${I(8)}; font-size: 0.75rem; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: ${I(14)}; height: ${I(14)}; }

.oc-sdk-field { display: flex; flex-direction: column; gap: ${I(4)}; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: ${I(32)}; padding: 0 ${I(10)}; border: 0; font-size: 0.875rem; line-height: 1.45; appearance: none; }
textarea.oc-sdk-input { height: auto; padding: ${I(8)} ${I(10)}; resize: vertical; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: ${I(34)}; padding-right: ${I(34)}; }
.oc-sdk-search-icon { position: absolute; left: ${I(11)}; top: 50%; transform: translateY(-50%); pointer-events: none; }
.oc-sdk-search-clear { position: absolute; right: ${I(6)}; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: ${I(24)}; height: ${I(24)}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: ${I(4)}; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: ${I(6)}; align-self: flex-start; width: auto; max-width: 100%; min-width: 0; height: ${I(28)}; padding: 0 ${I(10)}; border: 1px solid transparent; font-size: 0.8125rem; text-align: left; }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; }
.oc-sdk-popup { position: fixed; z-index: 50; display: flex; flex-direction: column; gap: ${I(2)}; min-width: ${I(160)}; max-width: calc(100vw - ${I(16)}); max-height: min(${I(320)}, calc(100vh - ${I(16)})); overflow: auto; padding: ${I(4)}; border: 1px solid transparent; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: ${I(2)} ${I(2)} ${I(4)}; }
.oc-sdk-popup-search .oc-sdk-input { height: ${I(28)}; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: ${I(8)}; width: 100%; padding: ${I(6)} ${I(8)}; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; }
.oc-sdk-option-check { flex: 0 0 auto; display: inline-flex; width: ${I(14)}; visibility: hidden; }
.oc-sdk-option[aria-selected="true"] > .oc-sdk-option-check { visibility: visible; }
.oc-sdk-popup-empty { padding: ${I(8)}; font-size: 0.8125rem; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: ${I(8)}; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: ${I(14)}; height: ${I(14)}; margin-top: ${I(3)}; border: 1px solid transparent; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: ${I(36)}; height: ${I(20)}; --oc-sdk-thumb-travel: ${I(16)}; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: ${I(2)}; left: ${I(2)}; width: ${I(16)}; height: ${I(16)}; }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; }

.oc-sdk-tabs { display: inline-flex; gap: ${I(2)}; padding: ${I(2)}; max-width: 100%; overflow: auto; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: ${I(6)}; height: ${I(28)}; padding: 0 ${I(10)}; border: 1px solid transparent; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: ${I(1)} ${I(6)}; font-size: ${I(11)}; font-weight: 500; line-height: ${I(16)}; white-space: nowrap; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: ${I(8)}; width: 100%; padding: ${I(6)} ${I(8)}; text-align: left; }
.oc-sdk-row-lead { flex: 0 0 auto; width: ${I(64)}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-list-empty { padding: ${I(16)} ${I(8)}; text-align: center; font-size: 0.8125rem; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${I(4)}; padding: ${I(40)} ${I(16)}; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; }
.oc-sdk-empty-action { margin-top: ${I(12)}; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: ${I(8)}; font-size: 0.8125rem; }
.oc-sdk-spinner-ring { width: ${I(16)}; height: ${I(16)}; border: 2px solid transparent; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: ${I(12)}; height: ${I(12)}; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: ${I(12)}; padding: ${I(8)} ${I(12)}; border: 1px solid transparent; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: ${I(2)}; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-banner-body { font-size: 0.8125rem; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: ${I(8)}; width: 100%; margin: ${I(8)} 0; font-size: 0.75rem; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: ${I(4)} 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: ${I(4)}; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: ${I(6)}; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; transform-origin: left; transition: transform 200ms ease-out; }
.oc-sdk-progress-value { display: inline-flex; align-items: center; gap: ${I(2)}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { font-weight: 600; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text img { display: block; max-width: 100%; margin: ${I(8)} 0; }

/* Under a finger the controls reach the app's touch sizes: rows and options 44px like its sheets, every other
   control at least 36px. Inputs keep 16px text, below which iOS zooms the page on focus. */
@media (pointer: coarse) {
  .oc-sdk-btn, .oc-sdk-input { height: ${I(40)}; }
  .oc-sdk-btn[data-size="sm"], .oc-sdk-btn[data-size="xs"], .oc-sdk-trigger, .oc-sdk-tab, .oc-sdk-popup-search .oc-sdk-input { height: ${I(36)}; }
  .oc-sdk-input, .oc-sdk-popup-search .oc-sdk-input { font-size: max(16px, 0.875rem); }
  .oc-sdk-search-clear { width: ${I(36)}; height: ${I(36)}; right: 0; }
  .oc-sdk-row, .oc-sdk-option { min-height: ${I(44)}; }
  .oc-sdk-check { min-height: ${I(36)}; padding: ${I(8)} 0; }
}
`,ZS=`${Lo}
.oc-sdk { color: ${n_}; font-family: ${ro}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${QS} }
.oc-sdk-mono { font-family: ${WT}; }
.oc-sdk-muted { color: ${v}; }
${jE("success")}${jE("warning")}${jE("error")}${jE("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${t_}; --oc-sdk-tone-text: ${zT}; }

.oc-sdk-btn { border-radius: ${QT}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${WS}; }
.oc-sdk-btn[data-variant="default"] { color: ${zT}; background: ${s(t_,10,z_)}; border-color: ${s(t_,12)}; ${YS} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${s(t_,16,z_)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${s(t_,22,z_)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${Vo}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${C_}, ${C_}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${y_}, ${y_}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${EE}; ${HT} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${C_}, ${C_}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${y_}, ${y_}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${C_}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${y_}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${q("status-error","red")}; color: ${KT}; background: ${s("var(--oc-sdk-tone)",7,z_)}; border-color: ${s("var(--oc-sdk-tone)",12)}; ${YS} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${s("var(--oc-sdk-tone)",9,z_)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${s("var(--oc-sdk-tone)",11,z_)}; box-shadow: none; }

.oc-sdk-field-note { color: ${v}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${KT}; }
.oc-sdk-input { border-radius: ${QT}; background: var(--oc-sdk-field-bg); color: ${EE}; ${YT("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${v}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${C_}, ${C_}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${YT(s(n_,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${YT(q("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${WT}; }

.oc-sdk-search-icon { color: ${v}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${t_}; }
.oc-sdk-search-clear { border-radius: ${WS}; color: ${v}; }
.oc-sdk-search-clear:hover { background: ${C_}; color: ${n_}; }

.oc-sdk-trigger { border-radius: ${QT}; background: var(--oc-sdk-raised-bg); color: ${EE}; ${HT} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${C_}, ${C_}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${y_}, ${y_}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${v}; }
.oc-sdk-trigger-chevron { color: ${v}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${EE}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${FE}; background-clip: padding-box; color: ${EE}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${C_}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${hT}; color: ${tT}; }
.oc-sdk-option-check { color: ${n_}; }
.oc-sdk-option[data-destructive="true"] { color: ${KT}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${s(q("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${v}; }
.oc-sdk-popup-empty { color: ${v}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${B_}; border-radius: 4px; color: ${n_}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${s(n_,60,B_)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${B_}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${z_}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${t_}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(var(--oc-sdk-thumb-travel, 16px)); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${QS} }
.oc-sdk-check-desc { color: ${v}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${s(n_,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${v}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${n_}; }
.oc-sdk-tab[aria-selected="true"] { color: ${tT}; background: ${hT}; border-color: ${B_}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${EE}; background: var(--oc-sdk-raised-bg); ${HT} }
.oc-sdk-tab-count { color: ${v}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${s(n_,6)}; color: ${v}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${s("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${C_}; }
.oc-sdk-row[aria-selected="true"] { background: ${hT}; color: ${tT}; }
.oc-sdk-row-lead { font-family: ${WT}; color: ${v}; }
.oc-sdk-row-sub { color: ${v}; }
.oc-sdk-row-meta { color: ${v}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${v}; }

.oc-sdk-empty-body { color: ${v}; }

.oc-sdk-spinner { color: ${v}; }
.oc-sdk-spinner-ring { border-color: ${B_}; border-top-color: ${t_}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${s("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${v}; }

.oc-sdk-separator { color: ${v}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${s(B_,40)}; }

.oc-sdk-progress-label { color: ${v}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${s(n_,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${t_}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${q("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${q("success-text","inherit")}; }

.oc-sdk-text a { color: ${zT}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${s(B_,60)}; }
`,u=`
${vE}
${Po}
${ZS}`;var jS="oc-sdk-ui-style",TE=(_)=>{while(_.firstChild)_.removeChild(_.firstChild)},l=(_)=>{let E=document.getElementById(jS);if(E instanceof HTMLStyleElement){if(E.textContent!==_)E.textContent=_;return}sE(document);let T=document.createElement("style");T.id=jS,T.textContent=_,document.head.appendChild(T)},D=(_,E)=>{let T=document.createElement(_);if(E)T.className=E;return T},P_=(_)=>{let E=D("button",_);return E.type="button",E},T_=(_,E)=>{let T=E??"";if(_.textContent!==T)_.textContent=T},Y_=(_,E,T)=>{if(T===void 0||T===null||T==="")_.removeAttribute(E);else if(_.getAttribute(E)!==T)_.setAttribute(E,T)};var Do=()=>{let _=document.createElement("span");return _.className="oc-sdk-spinner-ring",_.setAttribute("aria-hidden","true"),_},L_=(_,E)=>{l(u);let T=E,o=P_("oc-sdk oc-sdk-btn"),O=Do(),f=document.createElement("span");o.append(f),_.append(o);let k=()=>{if(o.dataset.variant=T.variant??"default",o.dataset.size=T.size??"default",o.disabled=Boolean(T.disabled)||Boolean(T.loading),o.dataset.loading=T.loading?"true":"false",o.setAttribute("aria-busy",T.loading?"true":"false"),T.loading&&O.parentNode!==o)o.prepend(O);else if(!T.loading&&O.parentNode===o)O.remove();T_(f,T.label)},U=()=>{if(T.disabled||T.loading)return;T.onClick()};return o.addEventListener("click",U),k(),{update:(R)=>{T={...T,...R},k()},dispose:()=>{o.removeEventListener("click",U),o.remove()}}};var JE=(_,E)=>{l(u);let T=E,o=D("label","oc-sdk oc-sdk-field"),O=D("span","oc-sdk-field-label"),f=T.multiline?D("textarea","oc-sdk-input"):D("input","oc-sdk-input"),k=D("span","oc-sdk-field-note");o.append(O,f,k),_.append(o);let U=()=>{if(T_(O,T.label),O.hidden=!T.label,f instanceof HTMLInputElement)f.type=T.password?"password":"text";else f.rows=T.rows??3;if(f.value!==T.value)f.value=T.value;f.disabled=Boolean(T.disabled),Y_(f,"placeholder",T.placeholder),f.dataset.mono=T.mono?"true":"false";let x=Boolean(T.error);o.dataset.invalid=x?"true":"false",f.setAttribute("aria-invalid",x?"true":"false");let G=T.error??T.helper??"";T_(k,G),k.hidden=G===""},R=()=>{T.onChange(f.value)};return f.addEventListener("input",R),U(),{update:(x)=>{T={...T,...x},U()},dispose:()=>{f.removeEventListener("input",R),o.remove()}}};var FS="http://www.w3.org/2000/svg",ho={search:"M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z",chevron:"M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z",check:"M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z",close:"M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"},SE=(_,E,T)=>{let o=document.createElementNS(FS,"svg");if(o.setAttribute("viewBox","0 0 24 24"),o.setAttribute("width",String(E)),o.setAttribute("height",String(E)),o.style.width=I(E),o.style.height=I(E),o.setAttribute("aria-hidden","true"),o.setAttribute("fill","currentColor"),T)o.setAttribute("class",T);let O=document.createElementNS(FS,"path");return O.setAttribute("d",ho[_]),o.append(O),o};var oE=(_,E="vertical")=>{let[T,o]=E==="vertical"?["ArrowDown","ArrowUp"]:["ArrowRight","ArrowLeft"];if(_.key===T||_.ctrlKey&&_.key.toLowerCase()==="n")return"next";if(_.key===o||_.ctrlKey&&_.key.toLowerCase()==="p")return"previous";if(_.key==="Home")return"first";if(_.key==="End")return"last";return null},OE=(_,E,T)=>{let o=_.filter((R)=>!R.disabled);if(o.length===0)return null;let O=o[0],f=o[o.length-1];if(T==="first"||!O||!f)return O?.id??null;if(T==="last")return f.id;let k=o.findIndex((R)=>R.id===E);if(k===-1)return T==="next"?O.id:f.id;return o[Math.min(o.length-1,Math.max(0,k+(T==="next"?1:-1)))]?.id??null};var Wo=(_,E,T)=>{l(u);let o=E,O=P_("oc-sdk oc-sdk-check");O.setAttribute("role",T);let f=D("span",T==="switch"?"oc-sdk-check-thumb":"oc-sdk-check-box");if(T==="checkbox")f.append(SE("check",12));let k=D("span","oc-sdk-check-text"),U=D("span","oc-sdk-check-label"),R=D("span","oc-sdk-check-desc");k.append(U,R),O.append(f,k),_.append(O);let x=()=>{O.setAttribute("aria-checked",o.checked?"true":"false"),O.disabled=Boolean(o.disabled),T_(U,o.label),T_(R,o.description),R.hidden=!o.description},G=()=>{if(!o.disabled)o.onChange(!o.checked)};return O.addEventListener("click",G),x(),{update:(C)=>{o={...o,...C},x()},dispose:()=>{O.removeEventListener("click",G),O.remove()}}};var gE=(_,E)=>Wo(_,E,"switch");var jT=(_,E)=>{l(u);let T=E,o=D("div","oc-sdk oc-sdk-tabs");o.setAttribute("role","tablist"),_.append(o);let O=()=>{TE(o),o.dataset.track=T.trackBackground?"true":"false";for(let k of T.items){let U=P_("oc-sdk-tab");U.setAttribute("role","tab");let R=k.id===T.activeId;U.setAttribute("aria-selected",R?"true":"false"),U.tabIndex=R?0:-1,U.dataset.id=k.id;let x=D("span");if(x.textContent=k.label,U.append(x),k.count!==void 0){let G=D("span","oc-sdk-tab-count");G.textContent=String(k.count),U.append(G)}U.addEventListener("click",()=>{if(k.id!==T.activeId)T.onChange(k.id)}),o.append(U)}},f=(k)=>{let U=oE(k,"horizontal");if(!U)return;let R=OE(T.items,T.activeId,U);if(R&&R!==T.activeId){k.preventDefault(),T.onChange(R);let x=o.querySelector(`[data-id="${CSS.escape(R)}"]`);if(x instanceof HTMLElement)x.focus()}};return o.addEventListener("keydown",f),O(),{update:(k)=>{T={...T,...k},O()},dispose:()=>{o.removeEventListener("keydown",f),o.remove()}}};var FT=(_,E)=>{Y_(_,"data-tone",E&&E!=="neutral"?E:null)},BE=(_,E)=>{l(u);let T=E,o=D("span","oc-sdk oc-sdk-badge");_.append(o);let O=()=>{T_(o,T.label),FT(o,T.tone)};return O(),{update:(f)=>{T={...T,...f},O()},dispose:()=>{o.remove()}}};var JT=(_,E)=>{l(u);let T=E,o=D("div","oc-sdk oc-sdk-empty"),O=D("h2","oc-sdk-empty-title"),f=D("p","oc-sdk-empty-body"),k=D("div","oc-sdk-empty-action");o.append(O,f,k),_.append(o);let U=null,R=()=>{if(T_(O,T.title),T_(f,T.body),f.hidden=!T.body,k.hidden=!T.action,!T.action){U?.dispose(),U=null;return}let x={label:T.action.label,onClick:T.action.onClick};if(U)U.update(x);else U=L_(k,{...x,variant:"outline",size:"sm"})};return R(),{update:(x)=>{T={...T,...x},R()},dispose:()=>{U?.dispose(),U=null,o.remove()}}};var gT=(_,E={})=>{l(u);let T=E,o=D("span","oc-sdk oc-sdk-spinner");o.setAttribute("role","status");let O=D("span","oc-sdk-spinner-ring");O.setAttribute("aria-hidden","true");let f=D("span");o.append(O,f),_.append(o);let k=()=>{o.dataset.size=T.size??"default",T_(f,T.label),f.hidden=!T.label,o.setAttribute("aria-label",T.label??"Loading")};return k(),{update:(U)=>{T={...T,...U},k()},dispose:()=>{o.remove()}}};var yE=(_,E)=>{l(u);let T=E,o=D("div","oc-sdk oc-sdk-banner"),O=D("div","oc-sdk-banner-text"),f=D("div","oc-sdk-banner-title"),k=D("div","oc-sdk-banner-body"),U=D("div","oc-sdk-banner-action");O.append(f,k),o.append(O,U),_.append(o);let R=null,x=()=>{if(o.dataset.tone=T.tone,o.setAttribute("role",T.tone==="error"||T.tone==="warning"?"alert":"status"),T_(f,T.title),T_(k,T.body),k.hidden=!T.body,U.hidden=!T.action,!T.action){R?.dispose(),R=null;return}let G={label:T.action.label,onClick:T.action.onClick};if(R)R.update(G);else R=L_(U,{...G,variant:"outline",size:"xs"})};return x(),{update:(G)=>{T={...T,...G},x()},dispose:()=>{R?.dispose(),R=null,o.remove()}}};var M_=(_)=>{if(!Number.isFinite(_))return 0;return Math.max(0,Math.min(100,_))};var D_=(_)=>{let E=M_(_);if(Math.abs(E-Math.round(E))<0.05)return`${Math.round(E)}%`;return`${E.toFixed(1)}%`},AE=(_)=>{if(!Number.isFinite(_)||_<0)return"$0";if(_>=100)return`$${Math.round(_)}`;if(_>=10)return`$${_.toFixed(1)}`;return`$${_.toFixed(2)}`},mE=(_)=>{if(!Number.isFinite(_)||_<=0)return"0";if(_>=1e9)return`${(_/1e9).toFixed(2)}B`;if(_>=1e6){let E=_/1e6;return E>=100?`${Math.round(E)}M`:`${E.toFixed(1)}M`}if(_>=1000)return`${Math.round(_/1000)}K`;return String(Math.round(_))},iE=(_,E=Date.now())=>{if(!_||!Number.isFinite(_)||_<=E)return"即将重置";let T=Math.max(0,Math.floor((_-E)/1000)),o=Math.floor(T/86400),O=Math.floor(T%86400/3600),f=Math.floor(T%3600/60);if(o>0)return`${o}d ${O}h`;if(O>0)return`${O}h ${f}m`;return`${Math.max(1,f)}m`},JS=(_,E=Date.now())=>{if(!_||!Number.isFinite(_)||_<=0)return null;let T=_>1000000000000?_:_*1000,o=Math.max(0,Math.floor((E-T)/1000));if(o<60)return"刚刚采样";let O=Math.floor(o/60);if(O<60)return`采样 ${O}m 前`;let f=Math.floor(O/60);if(f<24)return`采样 ${f}h 前`;return`采样 ${Math.floor(f/24)}d 前`},wE=(_,E=!1)=>{if(_==="previous")return E?"参考":"上期参考";return E?"预测":"满额预测"};var gS=(_)=>{let E=_.limit_requests>0?_.effective_remaining_requests/_.limit_requests*100:100;return(_.limit_tokens>0?_.effective_remaining_tokens/_.limit_tokens*100:100)<E-0.5};var Qo="http://www.w3.org/2000/svg",BS=["gemini_5h","gemini_weekly","claude_5h","claude_weekly","argon_weekly"],yS=["claude_weekly","claude_5h","argon_weekly","gemini_weekly","gemini_5h"],mS=["gemini_5h","gemini_weekly","claude_5h","claude_weekly","argon_weekly"],So="pq:panel-ui-prefs:v1",iS=15000,oo=13000,wS=[{r:239,g:68,b:68},{r:245,g:158,b:11},{r:16,g:185,b:129}],Yo=0,bE=(_,E=!1)=>{let T=M_(_);if(E||T<=0.05)return"empty";if(T>=99.95)return"full";if(T>60)return"healthy";if(T>=25)return"moderate";return"low"},Oo=(_,E)=>{let T=_.toLowerCase(),o=(E??"").toLowerCase();return T==="argon_weekly"||o==="argon"||T.includes("argon")},Ao=(_)=>{return String(_||"").trim().toLowerCase()==="pro"},Ho=(_)=>{let E=Ao(_.tier);return(_.windows??[]).filter((T)=>E||!Oo(T.key,T.group))},qS=(_)=>{let E=M_(_.remaining_percent);if(E<99.95)return!0;if(typeof _.estimated_remaining_percent==="number"&&Number.isFinite(_.estimated_remaining_percent)&&E-M_(_.estimated_remaining_percent)>=0.25)return!0;return Boolean(_.has_current_usage&&(_.current_cost>0||_.current_tokens>0||_.current_requests>0))},Zo=(_)=>{if(M_(_.effective_percent)<99.95)return!0;if(_.eligible_accounts>0&&_.available_accounts<_.eligible_accounts)return!0;return _.used_requests>0||_.used_tokens>0},m_=(_,E)=>{let T=_.toLowerCase(),o=(E??"").toLowerCase();if(T==="gemini_5h")return"var(--pq-series-gemini)";if(T==="gemini_weekly"||o==="gemini")return"var(--pq-series-gemini-2)";if(T==="claude_5h")return"var(--pq-series-claude)";if(T==="claude_weekly"||o==="claude")return"var(--pq-series-claude-2)";if(T.includes("argon")||o==="argon")return"var(--pq-series-argon)";return"var(--pq-full)"},uS=(_)=>{switch(_.key){case"gemini_5h":return"Gemini 5h";case"gemini_weekly":return"Gemini 周";case"claude_5h":return"Claude 5h";case"claude_weekly":return"Claude 周";case"argon_weekly":return"Argon 周";default:return _.label||_.key}},co=(_)=>{let E=String(_||"").trim().toLowerCase();if(E==="ultra")return"pq-tier-ultra";if(E==="pro")return"pq-tier-pro";return"pq-tier-free"},jo=(_)=>{switch(String(_||"").toLowerCase()){case"available":case"ready":return"pq-st-ok";case"limited":case"cooldown":return"pq-st-warn";case"exhausted":case"unavailable":case"auth_required":return"pq-st-err";default:return"pq-st-muted"}},Fo=(_)=>{let E=Math.max(0,Math.min(1,_)),T=E<0.5?0:1,o=T===0?E*2:(E-0.5)*2,O=wS[T],f=wS[T+1],k=Math.round(O.r+(f.r-O.r)*o),U=Math.round(O.g+(f.g-O.g)*o),R=Math.round(O.b+(f.b-O.b)*o);return`rgb(${k}, ${U}, ${R})`},j_=(_)=>_>1000000000000?_:_*1000,lS=(_)=>_>1000000000000?_/1000:_,H_=(_)=>String(_).padStart(2,"0"),yT=(_,E)=>{let T=new Date(_);if(E==="md")return`${H_(T.getMonth()+1)}/${H_(T.getDate())}`;return`${H_(T.getHours())}:${H_(T.getMinutes())}`},Jo=(_)=>{let E=new Date(_);return`${H_(E.getMonth()+1)}/${H_(E.getDate())} ${H_(E.getHours())}:${H_(E.getMinutes())}`},go=(_)=>{try{return new URL(_).host}catch{return _}},Bo=()=>{if(document.getElementById("pq-styles"))return;let _=document.createElement("style");_.id="pq-styles",_.textContent=`
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

    .pq-sample-age {
      display: inline-flex;
      align-items: center;
      padding: 0 5px;
      height: 16px;
      border-radius: 999px;
      font-size: 0.69em;
      font-weight: 500;
      color: var(--pq-muted);
      background: color-mix(in srgb, var(--pq-border) 42%, transparent);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .pq-sample-age.is-stale {
      color: var(--pq-moderate);
      background: var(--pq-moderate-bg);
    }

    .pq-win-est {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px 8px;
      flex-wrap: wrap;
      font-size: 0.75em;
      padding-top: 3px;
      border-top: 1px dashed color-mix(in srgb, var(--pq-border) 62%, transparent);
      min-width: 0;
    }

    .pq-est-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 600;
      white-space: nowrap;
    }

    .pq-est-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.85;
      flex-shrink: 0;
    }

    .pq-est-delta {
      color: var(--pq-muted);
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
  `,document.head.appendChild(_)},c=(_,E,T)=>{let o=document.createElement(_);if(E)o.className=E;if(T!==void 0)o.textContent=T;return o},e=(_,E={})=>{let T=document.createElementNS(Qo,_);for(let[o,O]of Object.entries(E))T.setAttribute(o,String(O));return T},yo=()=>{let _=e("svg",{width:14,height:14,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"});return _.appendChild(e("circle",{cx:12,cy:12,r:3})),_.appendChild(e("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})),_},V_=PT(),kE=document.querySelector("#root"),aS=!1,q_=!1,i_=!1,qE=!1,uE=!1,r=null,X_=!1,N_=!1,cE="http://127.0.0.1:18380",CE="",aE=!1,w_=null,nE=0,fo=new Map,qT=new Map,fE=new Set,BT=new WeakMap,vS=[],K_=[],u_=new Set,mT=null,iT=null,Z_=null,lE=null,NE=null,sS=null,UE=(_)=>fo.get(_)??"5h",uT=(_,E)=>`${_}|${E}`,ko=(_)=>{for(let E of _)try{E()}catch{}},mo=()=>{for(let _ of u_)try{_()}catch{}};document.addEventListener("pointerdown",(_)=>{if(!_.target?.closest(".pq-chart-box"))mo()});var io=async()=>{try{let _=await V_.storage.get(So);if(_&&typeof _==="object"&&!Array.isArray(_)){let E=_;if(typeof E.aisFullExpanded==="boolean"&&E.aisFullExpanded!==N_){if(N_=E.aisFullExpanded,r?.snapshot)F_()}}}catch{}},wo=()=>{V_.storage.set(So,{aisFullExpanded:N_}).catch(()=>{})},qo=()=>({winX:window.scrollX||0,winY:window.scrollY||0,docTop:document.documentElement?.scrollTop||0,bodyTop:document.body?.scrollTop||0,rootTop:kE.scrollTop||0,prevHeight:kE.getBoundingClientRect().height}),uo=(_)=>{let E=()=>{if(_.rootTop>0)kE.scrollTop=_.rootTop;if(_.docTop>0&&document.documentElement)document.documentElement.scrollTop=_.docTop;if(_.bodyTop>0&&document.body)document.body.scrollTop=_.bodyTop;let T=_.winY||_.docTop||_.bodyTop;if(T>0||_.winX>0)window.scrollTo({left:_.winX,top:T,behavior:"instant"})};E(),requestAnimationFrame(()=>{E(),kE.style.minHeight=""})},RE=async(_,E,T={})=>{let o=await V_.serviceRequest({method:_,path:E,...T.query?{query:T.query}:{},...T.body?{body:JSON.stringify(T.body)}:{}}),O=null;try{O=o.body?JSON.parse(o.body):null}catch{O=null}if(o.status<200||o.status>=300){let f=O&&typeof O==="object"&&"error"in O&&typeof O.error==="string"?O.error:`服务返回 HTTP ${o.status}`;throw Error(f)}return O},pE=(_)=>{if(!_||!_.account_id)return;let E=_.window==="7d"?"7d":"5h";qT.set(uT(_.account_id,E),{data:_,fetchedAtMs:Date.now()})},lo=5,ao=(_)=>{let E=[];if(Array.isArray(_.cycle_resets)&&_.cycle_resets.length>0){for(let o of _.cycle_resets)if(typeof o==="number"&&Number.isFinite(o)&&o>0)E.push(j_(o))}else if(Array.isArray(_.resets)&&_.resets.length>=2){let o=Array.isArray(_.points)?_.points:[],O=(f)=>{let k=null;for(let U=0;U<o.length;U+=1){let R=o[U];if(j_(R[0])<f)k=M_(R[1]);else break}return k};for(let f=1;f<_.resets.length;f+=1){let k=_.resets[f-1],U=_.resets[f];if(!Array.isArray(k)||!Array.isArray(U)||k.length<2||U.length<2)continue;let R=lS(k[1]),x=lS(U[1]),G=j_(U[0]);if(!Number.isFinite(G)||G<=0)continue;if(R>0&&x>R+60)E.push(G);else if(R>0&&x===0){let C=O(G);if(C!==null&&C<99.999)E.push(G)}}}if(E.length<=1)return E;E.sort((o,O)=>o-O);let T=[E[0]];for(let o=1;o<E.length;o+=1)if(E[o]>T[T.length-1])T.push(E[o]);return T},vo=(_)=>{if(!Array.isArray(_.estimated_point)||_.estimated_point.length<2)return null;let E=_.estimated_point[0],T=_.estimated_point[1];if(typeof E!=="number"||!Number.isFinite(E)||E<=0)return null;if(typeof T!=="number"||!Number.isFinite(T))return null;let o=_.points[_.points.length-1];if(!o)return null;let O=j_(E),f=j_(o[0]);if(O<=f)return null;return{t:O,r:M_(T)}},wT=(_,E,T,o)=>{let O=c("div"),f=Ao(T.tier),k=(_.series??[]).filter((M)=>{if(!f&&Oo(M.key,M.group))return!1;return Array.isArray(M.points)&&M.points.length>=2});if(k.length===0)return O.appendChild(c("div","pq-chart-empty",`暂无 ${E==="7d"?"7d":"5h"} 历史采样曲线`)),O;let U=[...k].sort((M,$)=>{let F=yS.indexOf(M.key),Z=yS.indexOf($.key);return(F===-1?0:F)-(Z===-1?0:Z)}),R=[...k].sort((M,$)=>{let F=mS.indexOf(M.key),Z=mS.indexOf($.key);return(F===-1?99:F)-(Z===-1?99:Z)}),x=320,G=112,C=30,L=8,H=10,n=18,N=x-C-L,Q=G-H-n,Y=H+Q,j=new Map,i=Number.POSITIVE_INFINITY,K=Number.NEGATIVE_INFINITY;for(let M of k){for(let F of M.points){let Z=j_(F[0]);if(Z<i)i=Z;if(Z>K)K=Z}let $=vo(M);if($){if(j.set(M.key,$),$.t>K)K=$.t}}let m=Math.max(1,K-i),a=(M)=>C+(M-i)/m*N,r_=(M)=>H+Q*(1-M_(M)/100),S_=c("div","pq-chart-readout"),o_=()=>{S_.classList.remove("is-scrubbing"),S_.replaceChildren();let M=c("div","pq-readout-items");for(let $ of R){let F=M_($.points[$.points.length-1]?.[1]??$.remaining),Z=bE(F),__=c("span","pq-readout-item"),f_=c("span","pq-fam-dot");f_.style.background=m_($.key,$.group),__.appendChild(f_),__.appendChild(c("span","pq-muted",uS($))),__.appendChild(c("strong",`pq-mono pq-lv-${Z}`,D_(F))),M.appendChild(__)}S_.appendChild(M),S_.appendChild(c("span","pq-readout-hint","悬停/滑动"))};o_(),O.appendChild(S_);let b_=c("div","pq-chart-svg-wrap"),W=e("svg",{viewBox:`0 0 ${x} ${G}`,class:"pq-chart-svg",role:"img","aria-label":`${E} 周期剩余趋势`}),d=e("defs"),X=new Map;for(let M of U){let $=`pq-grad-${++Yo}`;X.set(M.key,$);let F=m_(M.key,M.group),Z=e("linearGradient",{id:$,x1:"0",y1:"0",x2:"0",y2:"1"});Z.appendChild(e("stop",{offset:"0%","stop-color":F,"stop-opacity":"0.26"})),Z.appendChild(e("stop",{offset:"100%","stop-color":F,"stop-opacity":"0.01"})),d.appendChild(Z)}W.appendChild(d);for(let M of[100,50,25,0]){let $=r_(M),F=M===25,Z=M===0;if(W.appendChild(e("line",{x1:C,x2:x-L,y1:$.toFixed(1),y2:$.toFixed(1),stroke:F?"var(--pq-low)":"var(--pq-border)","stroke-opacity":F?"0.26":Z?"0.75":"0.45","stroke-dasharray":Z?"":"2.5 3","stroke-width":"1"})),M===100||M===50||M===0){let __=e("text",{x:C-4,y:($+3).toFixed(1),"text-anchor":"end",class:"pq-svg-axis"});__.textContent=`${M}%`,W.appendChild(__)}}let G_=new Map;for(let M of U){let $=m_(M.key,M.group),F=X.get(M.key),Z=M.points.map((h)=>{let g=j_(h[0]),I_=M_(h[1]);return{t:g,r:I_,x:a(g),y:r_(I_)}}),__=[...Z],f_=j.get(M.key),R_=f_?{t:f_.t,r:f_.r,x:a(f_.t),y:r_(f_.r),estimated:!0}:null;if(R_)__.push(R_);G_.set(M.key,__);let d_=ao(M),$_=0,E_=[],x_=[],c_=[];for(let h=0;h<Z.length;h+=1){let g=Z[h],I_=c_[c_.length-1];if(I_){while($_<d_.length&&d_[$_]<=I_.t)$_+=1;if($_<d_.length&&d_[$_]<=g.t||g.r-I_.r>=lo){c_.push({t:g.t,r:I_.r,x:g.x,y:I_.y}),E_.push(c_),x_.push({x:g.x,yFrom:I_.y,yTo:g.y}),c_=[g];continue}}c_.push(g)}if(c_.length>0)E_.push(c_);for(let h of E_)if(h.length>=2){let g=h.map((Q_,VE)=>`${VE===0?"M":"L"}${Q_.x.toFixed(1)},${Q_.y.toFixed(1)}`).join(" "),I_=h[0],l_=h[h.length-1],a_=`M${I_.x.toFixed(1)},${Y.toFixed(1)} ${h.map((Q_)=>`L${Q_.x.toFixed(1)},${Q_.y.toFixed(1)}`).join(" ")} L${l_.x.toFixed(1)},${Y.toFixed(1)} Z`;W.appendChild(e("path",{d:a_,fill:`url(#${F})`,stroke:"none"})),W.appendChild(e("path",{d:g,fill:"none",stroke:$,"stroke-width":"1.9","stroke-linecap":"round","stroke-linejoin":"round"}))}else if(h.length===1){let g=h[0],I_=g.x+1.5<=x-L?g.x:Math.max(C,g.x-1.5),l_=g.x+1.5<=x-L?g.x+1.5:g.x;W.appendChild(e("line",{x1:I_.toFixed(1),x2:l_.toFixed(1),y1:g.y.toFixed(1),y2:g.y.toFixed(1),stroke:$,"stroke-width":"1.9","stroke-linecap":"round"}))}for(let h of x_){if(Math.abs(h.yTo-h.yFrom)<1)continue;W.appendChild(e("line",{x1:h.x.toFixed(1),x2:h.x.toFixed(1),y1:h.yFrom.toFixed(1),y2:h.yTo.toFixed(1),stroke:$,"stroke-opacity":"0.32","stroke-width":"1","stroke-dasharray":"2 2","pointer-events":"none"}))}let k_=Z[Z.length-1];if(k_&&R_)W.appendChild(e("line",{x1:k_.x.toFixed(1),y1:k_.y.toFixed(1),x2:R_.x.toFixed(1),y2:R_.y.toFixed(1),stroke:$,"stroke-opacity":"0.72","stroke-width":"1.6","stroke-dasharray":"3 2.5","stroke-linecap":"round","pointer-events":"none"})),W.appendChild(e("circle",{cx:R_.x.toFixed(1),cy:R_.y.toFixed(1),r:"2.2",fill:"var(--pq-surface)",stroke:$,"stroke-opacity":"0.85","stroke-width":"1.4","pointer-events":"none"}));if(k_)W.appendChild(e("circle",{cx:k_.x.toFixed(1),cy:k_.y.toFixed(1),r:"4.6",fill:$,"fill-opacity":"0.24"})),W.appendChild(e("circle",{cx:k_.x.toFixed(1),cy:k_.y.toFixed(1),r:"2.5",fill:$,stroke:"var(--pq-surface)","stroke-width":"1.2"}))}let J_=E==="7d"||m>=129600000?"md":"hm",g_=[{x:C,t:i,anchor:"start"},{x:C+N/2,t:i+m/2,anchor:"middle"},{x:x-L,t:K,anchor:"end"}];for(let M of g_){let $=e("text",{x:M.x.toFixed(1),y:String(G-3),"text-anchor":M.anchor,class:"pq-svg-axis"});$.textContent=yT(M.t,J_),W.appendChild($)}let h_=e("line",{x1:C,x2:C,y1:H,y2:Y,stroke:"var(--pq-fg)","stroke-opacity":"0.42","stroke-width":"1","stroke-dasharray":"2.5 2.5","pointer-events":"none"});h_.style.display="none",W.appendChild(h_);let U_=new Map;for(let M of U){let $=e("circle",{cx:C,cy:H,r:"3.6",fill:"var(--pq-surface)",stroke:m_(M.key,M.group),"stroke-width":"2","pointer-events":"none"});$.style.display="none",W.appendChild($),U_.set(M.key,$)}let ME=e("rect",{x:C,y:H,width:N,height:Q,fill:"transparent"});ME.style.cursor="crosshair",W.appendChild(ME);let O_=!1,W_=!1,J=()=>{if(!O_)return;O_=!1,W_=!1,nE=Math.max(0,nE-1),h_.style.display="none";for(let M of U_.values())M.style.display="none";o_()},XE=(M,$)=>{let F=M[0],Z=Math.abs(F.t-$);for(let __=1;__<M.length;__+=1){let f_=M[__],R_=Math.abs(f_.t-$);if(R_<=Z)F=f_,Z=R_;else if(f_.t>$)break}return F},A_=(M,$)=>{let F=W.getBoundingClientRect();if(!F.width)return;let Z=Math.max(C,Math.min(x-L,(M-F.left)/F.width*x)),__=i+(Z-C)/N*m;if(!O_)O_=!0,nE+=1;let f_=__,R_=[];for(let E_ of R){let x_=G_.get(E_.key);if(!x_||x_.length===0)continue;let c_=XE(x_,__);f_=c_.t,R_.push({s:E_,r:c_.r,estimated:c_.estimated});let k_=U_.get(E_.key);if(k_)k_.setAttribute("cx",c_.x.toFixed(1)),k_.setAttribute("cy",c_.y.toFixed(1)),k_.style.display=""}let d_=a(f_);h_.setAttribute("x1",d_.toFixed(1)),h_.setAttribute("x2",d_.toFixed(1)),h_.style.display="",S_.classList.add("is-scrubbing"),S_.replaceChildren();let $_=c("div","pq-readout-items");$_.appendChild(c("span","pq-readout-time pq-mono",Jo(f_)));for(let{s:E_,r:x_,estimated:c_}of R_){let k_=bE(x_),h=c("span","pq-readout-item"),g=c("span","pq-fam-dot");g.style.background=m_(E_.key,E_.group),h.appendChild(g),h.appendChild(c("span","pq-muted",uS(E_))),h.appendChild(c("strong",`pq-mono pq-lv-${k_}`,c_?`~${x_.toFixed(1)}%`:D_(x_))),$_.appendChild(h)}if(S_.appendChild($_),$){let E_=c("button","pq-readout-clear","×");E_.type="button",E_.title="关闭读数",E_.addEventListener("click",(x_)=>{x_.stopPropagation(),J()}),S_.appendChild(E_)}};return W.addEventListener("pointerdown",(M)=>{let $=M.pointerType!=="mouse";if($)W_=!0;A_(M.clientX,$)}),W.addEventListener("pointermove",(M)=>{let $=M.pointerType!=="mouse";if(!$||W_)A_(M.clientX,$)}),W.addEventListener("pointerup",()=>{W_=!1}),W.addEventListener("pointercancel",()=>{W_=!1}),W.addEventListener("pointerleave",(M)=>{if(M.pointerType==="mouse")J()}),o.add(J),O.__pqClearScrub=J,b_.appendChild(W),O.appendChild(b_),O},$E=(_,E)=>{let T=BT.get(_);if(T){try{T()}catch{}u_.delete(T),BT.delete(_)}let o=E.__pqClearScrub;if(o)BT.set(_,o);_.replaceChildren(E)},eS=(_,E,T,o=!1)=>{let O=uT(E.id,T),f=qT.get(O),k=Date.now();if(f){if($E(_,wT(f.data,T,E,u_)),!o&&k-f.fetchedAtMs<oo)return}else{let U=c("div","pq-chart-loading");U.textContent=`加载 ${T==="7d"?"7d":"5h"} 燃烧趋势…`,$E(_,U)}if(fE.has(O))return;fE.add(O),RE("GET","/panel/history",{query:{account:E.id,window:T,range:T==="7d"?"7d":"24h",...o?{refresh:"1",force:"1"}:{}}}).then((U)=>{if(pE(U),!_.isConnected)return;if(UE(E.id)!==T)return;$E(_,wT(U,T,E,u_))}).catch(()=>{if(!_.isConnected)return;if(UE(E.id)!==T)return;if(!f)$E(_,c("div","pq-chart-empty","历史趋势暂不可用"))}).finally(()=>{fE.delete(O)})},so=(_,E)=>{if(!_)return null;if(_.has_recent_buckets&&Array.isArray(_.recent_buckets)&&_.recent_buckets.length>0){let T=_.recent_buckets,o=_.recent_window_success||0,O=_.recent_window_failure||0,f=o+O>0,k=_.recent_window_rate,R=`近 ${_.recent_window_minutes||200}m 成功率`,x=c("div","pq-recent-strip"),G=c("div","pq-recent-top"),C=c("span","pq-recent-label pq-num",R);G.appendChild(C);let L=c("div","pq-recent-meta pq-mono");if(f){if(L.appendChild(c("span","pq-recent-ok",`✓${o}`)),O>0)L.appendChild(c("span","pq-recent-fail",`✕${O}`))}let H=!f||k==null?"":k>=95?"is-high":k>=80?"is-med":"is-low",n=f&&k!=null?D_(k):"空闲";L.appendChild(c("span",`pq-rate-capsule ${H}`,n)),G.appendChild(L),x.appendChild(G);let N=c("div","pq-buckets"),Q=600000,Y=(E||Date.now())-T.length*Q,j=null;return T.forEach((i,K)=>{let m=i.success||0,a=i.failed||0,r_=m+a,S_=r_===0,o_=c("div",`pq-bucket${S_?"":" is-active"}`);if(!S_)o_.style.background=Fo(m/r_);let b_=i.time||`${yT(Y+K*Q,"hm")}-${yT(Y+(K+1)*Q,"hm")}`,W=S_?`${b_} · 无请求`:`${b_} · ✓${m}${a>0?` ✕${a}`:""} (${D_(m/r_*100)})`;o_.title=W;let d=()=>{if(j&&j!==o_)j.classList.remove("is-focus");j=o_,o_.classList.add("is-focus"),C.textContent=W};o_.addEventListener("pointerenter",(X)=>{if(X.pointerType==="mouse")d()}),o_.addEventListener("click",(X)=>{if(X.stopPropagation(),j===o_)o_.classList.remove("is-focus"),j=null,C.textContent=R;else d()}),N.appendChild(o_)}),N.addEventListener("pointerleave",(i)=>{if(i.pointerType==="mouse"){if(j)j.classList.remove("is-focus");j=null,C.textContent=R}}),x.appendChild(N),x}if(Array.isArray(_.recent_bars)&&_.recent_bars.length>0){let{recent_bars:T,recent_success_rate:o}=_,O=c("div","pq-recent-strip"),f=c("div","pq-recent-top");f.appendChild(c("span","pq-recent-label pq-num",`近 ${T.length} 次请求`));let k=o==null?"":o>=95?"is-high":o>=80?"is-med":"is-low";f.appendChild(c("span",`pq-rate-capsule pq-mono ${k}`,o!=null?D_(o):"--")),O.appendChild(f);let U=c("div","pq-buckets");for(let R of T){let x=c("div","pq-bucket is-active");x.style.background=R.ok?"var(--pq-healthy-bar)":"var(--pq-low-bar)",U.appendChild(x)}return O.appendChild(U),O}if(_.available&&_.success_rate!=null){let T=c("div","pq-recent-strip"),o=c("div","pq-recent-top");o.appendChild(c("span","pq-recent-label","历史成功率"));let O=_.success_rate,f=O>=95?"is-high":O>=80?"is-med":"is-low";return o.appendChild(c("span",`pq-rate-capsule pq-mono ${f}`,D_(O))),T.appendChild(o),T}return null},eo=(_)=>{let E=M_(_.remaining_percent),T=bE(E),o=c("div",`pq-win-active${T==="empty"?" is-empty":""}`),O=c("div","pq-win-top"),f=c("div","pq-win-name-wrap"),k=c("span","pq-fam-dot");k.style.background=m_(_.key,_.group),f.appendChild(k),f.appendChild(c("span","pq-win-name",_.label||_.key));let U=JS(_.observed_at_ms);if(U){let n=c("span",`pq-sample-age pq-num${_.stale?" is-stale":""}`,U),N=j_(_.observed_at_ms);n.title=`真实采样时间：${new Date(N).toLocaleTimeString()}`,f.appendChild(n)}O.appendChild(f);let R=c("div","pq-win-val-wrap");if(T==="empty")R.appendChild(c("span","pq-pill pq-pill-empty","已耗尽"));R.appendChild(c("span",`pq-win-val pq-lv-${T}`,`剩 ${D_(E)}`)),O.appendChild(R),o.appendChild(O);let x=c("div",`pq-bar-track${T==="empty"?" is-empty":""}`),G=c("div",`pq-bar-fill pq-bar-${T}`);G.style.width=`${E}%`,x.appendChild(G),o.appendChild(x);let C=c("div","pq-win-sub"),L=c("div","pq-win-usage pq-mono");if(_.has_current_usage&&(_.current_cost>0||_.current_tokens>0)){let n=[`已用 ${AE(_.current_cost)}`];if(_.current_tokens>0)n.push(mE(_.current_tokens));if(L.appendChild(c("span","",n.join(" / "))),_.has_forecast&&_.forecast_cost>0){let N=wE(_.forecast_basis,!0),Q=c("span","",`· ${N} ${AE(_.forecast_cost)}`);Q.title=`${wE(_.forecast_basis,!1)} ${AE(_.forecast_cost)}`,L.appendChild(Q)}}else if(_.has_forecast&&_.forecast_cost>0){let n=wE(_.forecast_basis,!1);L.appendChild(c("span","",`${n} ${AE(_.forecast_cost)}`))}else L.appendChild(c("span","","本窗暂无费用记录"));if(C.appendChild(L),_.stale)C.appendChild(c("span","pq-win-reset pq-mono","待采样"));else if(_.reset_at_ms>0)C.appendChild(c("span","pq-win-reset pq-mono",`重置 ${iE(_.reset_at_ms)}`));o.appendChild(C);let H=typeof _.estimated_remaining_percent==="number"&&Number.isFinite(_.estimated_remaining_percent)?M_(_.estimated_remaining_percent):null;if(H!==null&&E-H>=0.25){let n=bE(H),N=c("div","pq-win-est"),Q=c("span",`pq-est-badge pq-mono pq-lv-${n}`);Q.appendChild(c("span","pq-est-dot")),Q.appendChild(document.createTextNode(`实时估算 ~${H.toFixed(1)}%`)),N.appendChild(Q);let Y=[];if(typeof _.post_sample_cost_usd==="number"&&_.post_sample_cost_usd>0)Y.push(`+${AE(_.post_sample_cost_usd)}`);if(typeof _.post_sample_requests==="number"&&_.post_sample_requests>0)Y.push(`${Math.round(_.post_sample_requests)}次`);else if(typeof _.post_sample_tokens==="number"&&_.post_sample_tokens>0)Y.push(`+${mE(_.post_sample_tokens)}`);if(Y.length>0){let j=c("span","pq-est-delta pq-mono",`采样后 ${Y.join(" · ")}`);N.appendChild(j)}N.title=`基于采样后实时用量推算（权威采样值仍为 ${D_(E)}）`,o.appendChild(N)}return o},_O=(_)=>{let E=c("div","pq-win-idle-tile"),T=c("div","pq-win-idle-top"),o=c("span","pq-win-idle-name"),O=c("span","pq-fam-dot");O.style.background=m_(_.key,_.group),o.appendChild(O),o.appendChild(c("span","",_.label||_.key)),T.appendChild(o),T.appendChild(c("span","pq-win-idle-pct pq-mono","100%")),E.appendChild(T);let f=c("div","pq-bar-track is-thin"),k=c("div","pq-bar-fill pq-bar-full");k.style.width="100%",f.appendChild(k),E.appendChild(f);let U=!_.stale&&_.reset_at_ms>0?`满血 · ${iE(_.reset_at_ms)}`:"满血未动用";return E.appendChild(c("div","pq-win-idle-sub pq-mono",U)),E},EO=(_,E,T)=>{let o=c("div","pq-acct-block"),O=c("div","pq-acct-head"),f=c("div","pq-acct-id");if(f.appendChild(c("span","pq-acct-name",_.code_name||_.id)),_.tier)f.appendChild(c("span",`pq-pill ${co(_.tier)}`,_.tier));O.appendChild(f);let k=_.status_label||(_.status==="available"?"可用":_.status||"未知");O.appendChild(c("span",`pq-pill ${jo(_.status)}`,k)),o.appendChild(O);let U=so(_.history,E);if(U)o.appendChild(U);let R=Ho(_).sort((C,L)=>{let H=BS.indexOf(C.key),n=BS.indexOf(L.key);return(H===-1?99:H)-(n===-1?99:n)}),x=R.filter(qS),G=R.filter((C)=>!qS(C));if(x.length>0){let C=c("div","pq-win-list");for(let L of x)C.appendChild(eo(L));o.appendChild(C)}if(G.length>0){let C=c("div",`pq-win-idle-grid${G.length===1?" is-single":""}`);for(let L of G)C.appendChild(_O(L));o.appendChild(C)}if(R.length===0)o.appendChild(c("div","pq-muted","暂无配额窗口采样"));if(_.has_history){let C=c("div","pq-chart-box"),L=c("div","pq-chart-head");L.appendChild(c("span","pq-chart-title","周期燃烧趋势"));let H=c("div","pq-chart-tabs"),n=c("div","pq-chart-body");n.dataset.pqChartBody=_.id;let N=UE(_.id),Q=null;Q=jT(H,{items:[{id:"5h",label:"5h"},{id:"7d",label:"7d"}],activeId:N,trackBackground:!0,onChange:(Y)=>{if(Y!=="5h"&&Y!=="7d")return;fo.set(_.id,Y),Q?.update({activeId:Y}),eS(n,_,Y,!1)}}),T.push(()=>Q?.dispose()),L.appendChild(H),C.appendChild(L),C.appendChild(n),o.appendChild(C),eS(n,_,N,!1)}return o},TO=(_,E)=>{let T=c("div","pq-card"),o=_.antigravity,O=c("div","pq-card-head"),f=c("div","pq-card-head-left");if(f.appendChild(c("h4","pq-card-title","Antigravity 号池")),o.online&&o.accounts.length>1&&o.summary?.tier_counts)for(let G of["Ultra","Pro","Free"]){let C=o.summary.tier_counts[G]??0;if(C>0)f.appendChild(c("span",`pq-pill pq-num ${co(G)}`,`${G}×${C}`))}O.appendChild(f);let k=c("div"),U=o.summary?.active_accounts??o.accounts.length,R=BE(k,{label:o.online?`${U} 号在线`:"离线",tone:o.online?o.status==="degraded"?"warning":"success":"error"});if(E.push(()=>R.dispose()),O.appendChild(k),T.appendChild(O),!o.online||!Array.isArray(o.accounts)||o.accounts.length===0)return T.appendChild(c("div","pq-muted",o.status_message||"暂无活跃 Antigravity 账号数据")),T;let x=c("div","pq-acct-list");for(let G of o.accounts)x.appendChild(EO(G,_.generated_at_ms,E));return T.appendChild(x),T},_o=(_,E=!1)=>{let T=M_(_.effective_percent),o=_.eligible_accounts>0&&_.available_accounts===0,O=bE(T,o),f=c("div",`pq-model-row${O==="empty"?" is-empty":""}${E?" is-full-compact":""}`),k=c("div","pq-model-top");k.appendChild(c("span","pq-model-name",_.label||_.id));let U=c("div","pq-model-right");if(o)U.appendChild(c("span","pq-pill pq-pill-empty","已耗尽"));else if(!E&&_.eligible_accounts>0&&(T<99.5||_.used_requests>0||_.used_tokens>0)){let L=gS(_);U.appendChild(c("span",`pq-pill ${L?"pq-bottleneck-tok":"pq-bottleneck-req"}`,L?"Token 短板":"次数短板"))}U.appendChild(c("span",`pq-win-val pq-lv-${O}`,D_(T))),k.appendChild(U),f.appendChild(k);let R=c("div",`pq-bar-track${E?" is-thin":""}${O==="empty"?" is-empty":""}`),x=c("div",`pq-bar-fill pq-bar-${O}`);x.style.width=`${T}%`,R.appendChild(x),f.appendChild(R);let G=c("div","pq-win-sub"),C=_.cooling_accounts>0?`可用 ${_.available_accounts}/${_.eligible_accounts} 号 · ${_.cooling_accounts} 冷却`:`可用 ${_.available_accounts}/${_.eligible_accounts} 号`;return G.appendChild(c("span","pq-mono",C)),G.appendChild(c("span","pq-mono",`剩 ${_.effective_remaining_requests}次 / ${mE(_.effective_remaining_tokens)}`)),f.appendChild(G),f},SO=(_,E)=>{let T=c("div","pq-card"),o=_.aistudio,O=c("div","pq-card-head");O.appendChild(c("h4","pq-card-title","AIStudio2API 号池"));let f=c("div"),k=o.account_counts?.ready??0,U=o.account_counts?.enabled??0,R=BE(f,{label:o.online?`${k}/${U} 号就绪`:"离线",tone:o.online?k===U?"success":"warning":"error"});if(E.push(()=>R.dispose()),O.appendChild(f),T.appendChild(O),!o.online)return T.appendChild(c("div","pq-muted",o.status_message||"AIStudio2API 当前离线")),T;let x=c("div","pq-ais-meta pq-mono"),G=o.playground;if(x.appendChild(c("span","",`Playground ${G?.requests??0}次`)),o.next_reset_ms>0)x.appendChild(c("span","",`16:00 重置 · ${iE(o.next_reset_ms)}`));T.appendChild(x);let C=Array.isArray(o.models)?o.models:[];if(C.length===0)return T.appendChild(c("div","pq-muted","暂无模型配额数据")),T;let L=[],H=[];for(let n of C)if(Zo(n))L.push(n);else H.push(n);if(L.sort((n,N)=>{let Q=n.eligible_accounts>0&&n.available_accounts===0?0:1,Y=N.eligible_accounts>0&&N.available_accounts===0?0:1;if(Q!==Y)return Q-Y;return M_(n.effective_percent)-M_(N.effective_percent)}),L.length>0){let n=c("div","pq-model-list");for(let N of L)n.appendChild(_o(N,!1));T.appendChild(n)}if(H.length>0){let n=c("div","pq-full-group"),N=c("button","pq-full-toggle");N.type="button";let Q=c("span","pq-full-toggle-left"),Y=c("span","pq-fam-dot");Y.style.background="var(--pq-full-bar)",Q.appendChild(Y);let j=c("span","pq-full-toggle-text"),i=(a)=>L.length>0?`其余 ${H.length} 个模型 100% 满血 · ${a?"点击收起":"点击展开"}`:`全部 ${H.length} 个模型 100% 满血 · ${a?"点击收起":"点击展开"}`;j.textContent=i(N_),Q.appendChild(j);let K=c("span",`pq-chevron${N_?" is-open":""}`,"▾");N.appendChild(Q),N.appendChild(K),N.setAttribute("aria-expanded",String(N_));let m=c("div","pq-full-list");m.hidden=!N_;for(let a of H)m.appendChild(_o(a,!0));N.addEventListener("click",()=>{N_=!N_,wo(),m.hidden=!N_,j.textContent=i(N_),K.classList.toggle("is-open",N_),N.setAttribute("aria-expanded",String(N_))}),n.appendChild(N),n.appendChild(m),T.appendChild(n)}return T},Uo=()=>{if(!iT)return;iT.setAttribute("aria-expanded",String(X_))},GE=(_)=>{ko(K_),K_=[],lE=null,NE=null;let E=r?.config.hasPasscode===!0,T=r?.config.showAis??!0,o=r?.config.compactQuota??!0,O=r?.config.url??cE,f=document.createDocumentFragment(),k=c("button","pq-settings-toggle");k.type="button",k.setAttribute("aria-expanded",String(X_)),k.appendChild(c("span","pq-card-title","连接与显示设置"));let U=c("span",`pq-chevron${X_?" is-open":""}`,"▾");if(k.appendChild(U),k.addEventListener("click",()=>{X_=!X_,Uo(),GE(_)}),f.appendChild(k),!X_){let K=[T?"AIS 显示":"AIS 隐藏",o?"紧凑文案":"详细文案",go(O),E?"已设口令":"无口令"];f.appendChild(c("div","pq-settings-summary pq-mono",K.join(" · "))),_.replaceChildren(f);return}let R=c("div","pq-settings-body"),x=c("div","pq-settings-group");x.appendChild(c("div","pq-settings-section-label","显示偏好"));let G=c("div");lE=gE(G,{label:"显示 AIStudio 号池",description:"同时控制顶栏/Usage 总卡、Work Status 与本面板是否展示 AIS 模型余量",checked:T,disabled:qE,onChange:(K)=>void OO(K)}),K_.push(()=>lE?.dispose()),x.appendChild(G);let C=c("div");NE=gE(C,{label:"紧凑配额文案（适配手机端）",description:"精简手机端浮层与 Usage 总卡文案避免窄屏叠字；本面板始终展示完整数据",checked:o,disabled:uE,onChange:(K)=>void AO(K)}),K_.push(()=>NE?.dispose()),x.appendChild(C),R.appendChild(x);let L=c("div","pq-settings-group");L.appendChild(c("div","pq-settings-section-label","看板连接"));let H=c("div"),n=JE(H,{label:"看板地址 URL",value:cE,placeholder:"http://127.0.0.1:18380 或 https://your-board.example.com",mono:!0,onChange:(K)=>{cE=K,aE=!0,n.update({value:K})}});K_.push(()=>n.dispose()),L.appendChild(H);let N=c("div"),Q=JE(N,{label:"访问口令 (X-View-Passcode)",value:CE,password:!0,placeholder:E?"已保存口令（留空保存将保持原口令不变）":"若看板未设口令可留空",helper:"仅写入本机 0600 配置文件，不会回显给前端或暴露给对话上下文。",onChange:(K)=>{CE=K,Q.update({value:K})}});if(K_.push(()=>Q.dispose()),L.appendChild(N),w_){let K=c("div"),m=yE(K,{tone:w_.tone,title:w_.text});K_.push(()=>m.dispose()),L.appendChild(K)}let Y=c("div","pq-settings-actions"),j=c("div"),i=L_(j,{label:i_?"测试中...":"测试并保存",size:"sm",loading:i_,disabled:i_,onClick:()=>void Eo(!1)});if(K_.push(()=>i.dispose()),Y.appendChild(j),E){let K=c("div"),m=L_(K,{label:"清空口令",variant:"outline",size:"sm",disabled:i_,onClick:()=>void Eo(!0)});K_.push(()=>m.dispose()),Y.appendChild(K)}L.appendChild(Y),R.appendChild(L),f.appendChild(R),_.replaceChildren(f)},oO=(_,E)=>{let T=_.antigravity?.accounts??[];for(let o=1;o<T.length;o+=1){let O=T[o];if(!O.has_history)continue;let f=UE(O.id),k=uT(O.id,f),U=qT.get(k);if(!E&&U&&Date.now()-U.fetchedAtMs<oo)continue;if(fE.has(k))continue;fE.add(k),RE("GET","/panel/history",{query:{account:O.id,window:f,range:f==="7d"?"7d":"24h",...E?{refresh:"1",force:"1"}:{}}}).then((R)=>{pE(R);let x=document.querySelector(`[data-pq-chart-body="${CSS.escape(O.id)}"]`);if(x&&UE(O.id)===f)$E(x,wT(R,f,O,u_))}).catch(()=>{}).finally(()=>{fE.delete(k)})}},IE=async(_=!1,E=!1)=>{if(q_)return;if(q_=!0,!r)F_();else if(!E)mT?.update({loading:!0});let T=r?.snapshot?.antigravity?.accounts?.[0]?.id,o=T?UE(T):"5h";try{let O=await RE("GET","/panel/state",{query:{..._?{refresh:"1",force:"1"}:{},window:o,range:o==="7d"?"7d":"24h"}});if(r=O,pE(O.history),!aE)cE=O.config.url;if(O.errorCode==="unauthorized"||O.errorCode==="unreachable")X_=!0;if(F_(),O.snapshot)oO(O.snapshot,_)}catch(O){let f=O instanceof V&&O.code==="NO_SERVICE"?"请先在 Settings → Extensions 中批准本扩展的本地服务权限。":O instanceof Error?O.message:String(O);r={config:r?.config??{url:cE,hasPasscode:!1,showAis:!0,compactQuota:!0},snapshot:r?.snapshot??null,history:r?.history??null,error:f,errorCode:"unreachable",fetchedAtMs:Date.now()},X_=!0,F_()}finally{q_=!1,mT?.update({loading:!1})}},OO=async(_)=>{if(qE)return;qE=!0;let E=r?.config.showAis??!0;if(lE?.update({checked:_,disabled:!0}),r)r={...r,config:{...r.config,showAis:_}},F_();try{let T=await RE("POST","/panel/config",{body:{showAis:_}});r=T,pE(T.history),V_.toast({kind:"success",message:_?"已开启 AIStudio 号池显示（Usage 与顶栏刷新后同步）":"已隐藏 AIStudio 号池（Usage 与顶栏刷新后同步）"})}catch(T){if(r)r={...r,config:{...r.config,showAis:E}};V_.toast({kind:"error",message:T instanceof Error?T.message:"切换失败"})}finally{qE=!1,F_()}},AO=async(_)=>{if(uE)return;uE=!0;let E=r?.config.compactQuota??!0;if(NE?.update({checked:_,disabled:!0}),r)r={...r,config:{...r.config,compactQuota:_}};try{let T=await RE("POST","/panel/config",{body:{compactQuota:_}});r=T,pE(T.history),V_.toast({kind:"success",message:_?"已开启紧凑配额文案（适配手机端，Usage 刷新后同步）":"已切换为详细配额文案（Usage 刷新后同步）"})}catch(T){if(r)r={...r,config:{...r.config,compactQuota:E}};V_.toast({kind:"error",message:T instanceof Error?T.message:"切换失败"})}finally{uE=!1,NE?.update({checked:r?.config.compactQuota??E,disabled:!1})}},Eo=async(_=!1)=>{if(i_=!0,w_={tone:"info",text:"正在测试连接..."},Z_)GE(Z_);try{let E=await RE("POST","/panel/test",{body:{url:cE.trim()||"http://127.0.0.1:18380",...CE?{passcode:CE}:{},..._?{clearPasscode:!0}:{},showAis:r?.config.showAis??!0,compactQuota:r?.config.compactQuota??!0,save:!0}});if(!E.ok){w_={tone:"error",text:E.message||"连接测试失败"},V_.toast({kind:"error",message:E.message||"连接测试失败"});return}CE="",aE=!1,w_={tone:"success",text:E.summary||"连接成功并已保存"},V_.toast({kind:"success",message:E.summary||"配置已保存"}),await IE(!0,!1)}catch(E){let T=E instanceof Error?E.message:String(E);w_={tone:"error",text:T},V_.toast({kind:"error",message:T})}finally{if(i_=!1,Z_)GE(Z_);else F_()}},F_=()=>{let _=qo();if(_.prevHeight>0)kE.style.minHeight=`${Math.ceil(_.prevHeight)}px`;let E=[],T=new Set,o=u_;u_=T,nE=0;let O=c("div","pq-wrap"),f=r?.config.showAis??!0,k=c("div","pq-header"),U=c("div","pq-brand");if(U.appendChild(c("h3","pq-title","Pool Quota")),q_&&!r){let n=c("div"),N=gT(n,{size:"sm"});E.push(()=>N.dispose()),U.appendChild(n)}else if(r?.snapshot){let n=c("div","pq-pool-dots"),N=r.snapshot.antigravity,Q=r.snapshot.aistudio,Y=!N.online?"is-err":N.status==="degraded"?"is-warn":"is-ok",j=c("span",`pq-dot-chip ${Y}`);if(j.appendChild(c("span","pq-dot")),j.appendChild(document.createTextNode("AG")),n.appendChild(j),f){let i=Q.account_counts?.ready??0,K=Q.account_counts?.enabled??0,m=!Q.online?"is-err":i<K?"is-warn":"is-ok",a=c("span",`pq-dot-chip ${m}`);a.appendChild(c("span","pq-dot")),a.appendChild(document.createTextNode("AIS")),n.appendChild(a)}U.appendChild(n)}k.appendChild(U);let R=c("div","pq-actions"),x=c("div"),G=L_(x,{label:"刷新",variant:"outline",size:"xs",loading:q_,onClick:()=>void IE(!0,!1)});if(E.push(()=>G.dispose()),R.appendChild(x),r?.config.url){let n=c("div"),N=L_(n,{label:"看板",variant:"ghost",size:"xs",onClick:()=>{if(r?.config.url)V_.openUrl(r.config.url)}});E.push(()=>N.dispose()),R.appendChild(n)}let C=c("button","pq-icon-btn");if(C.type="button",C.title="连接与显示设置",C.setAttribute("aria-label","连接与显示设置"),C.setAttribute("aria-expanded",String(X_)),C.appendChild(yo()),C.addEventListener("click",()=>{if(X_=!X_,Uo(),Z_){if(GE(Z_),X_)requestAnimationFrame(()=>{Z_?.scrollIntoView({behavior:"smooth",block:"nearest"})})}}),R.appendChild(C),k.appendChild(R),O.appendChild(k),r?.error){let n=c("div"),N=yE(n,{tone:r.errorCode==="unauthorized"?"warning":"error",title:r.errorCode==="unauthorized"?"需要访问口令":"看板连接异常",body:r.error});E.push(()=>N.dispose()),O.appendChild(n)}if(r?.snapshot){if(O.appendChild(TO(r.snapshot,E)),f)O.appendChild(SO(r.snapshot,E))}else if(!q_&&!r?.error){let n=c("div"),N=JT(n,{title:"尚未读取到号池数据",body:"请在下方「连接与显示设置」中填写看板地址与访问口令后点击测试并保存。",action:{label:"重试",onClick:()=>void IE(!0,!1)}});E.push(()=>N.dispose()),O.appendChild(n)}let L=c("div","pq-card");if(O.appendChild(L),r?.fetchedAtMs){let n=new Date(r.fetchedAtMs).toLocaleTimeString(),N=c("div","pq-footer-note pq-mono");N.appendChild(c("span","",`更新于 ${n}`)),N.appendChild(c("span","","Settings → Usage 可置顶总卡")),O.appendChild(N)}let H=vS;vS=E,mT=G,iT=C,Z_=L,ko(H),o.clear(),GE(L),kE.replaceChildren(O),uo(_)},To=()=>{if(document.visibilityState!=="visible")return!1;if(q_||i_||aE||nE>0)return!1;let _=document.activeElement?.tagName;if(_==="INPUT"||_==="TEXTAREA")return!1;return!0},cO=()=>{if(sS!==null)return;sS=window.setInterval(()=>{if(!To())return;IE(!1,!0)},iS),document.addEventListener("visibilitychange",()=>{if(!To())return;if(Date.now()-(r?.fetchedAtMs??0)>=iS)IE(!1,!0)})};Bo();V_.onReady((_)=>{if(DT(_,document.documentElement),aS)return;aS=!0,F_(),io(),IE(!1,!1),cO()});})();
