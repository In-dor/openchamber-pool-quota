(()=>{var h="openchamber.sdk",K=1;var vE=`
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
`;function sE(_){let E=_.documentElement;if(E.hasAttribute("data-oc-scrollbar-activity"))return;E.setAttribute("data-oc-scrollbar-activity","");let T=new WeakMap;_.addEventListener("scroll",(o)=>{let O=o.target===_?E:o.target;if(!(O instanceof Element))return;if(!O.hasAttribute("data-oc-scrolling"))O.setAttribute("data-oc-scrolling","");let f=T.get(O);if(f!==void 0)clearTimeout(f);T.set(O,setTimeout(()=>{T.delete(O),O.removeAttribute("data-oc-scrolling")},1000))},{capture:!0,passive:!0})}var Ro=`(${sE.toString()})(document);`;var eE=128,_T=65536;var LE=128;var PE=65536;var ET=8000,TT=192000,ST=120000;var aT=(_)=>{let E=[],T=0,o=0;return{push:(O)=>{E.push(O),o+=O.length;while(o-T>_&&E.length>1){let f=E.shift();o-=f?.length??0,T=0}},pull:(O)=>{let f=0;while(f<O.length&&E.length>0){let k=E[0],U=Math.min(O.length-f,k.length-T);if(O.set(k.subarray(T,T+U),f),f+=U,T+=U,T>=k.length)E.shift(),o-=k.length,T=0}O.fill(0,f)},clear:()=>{E.length=0,T=0,o=0},get size(){return o-T}}};var _S=/^[a-z][a-z0-9-]{0,39}$/;var vT=(_)=>Object(_)===_&&!Array.isArray(_),oT=(_,E)=>Object.keys(_).every((T)=>E.includes(T)),sT=(_)=>String(_)===_&&_.length>=1&&_.length<=60,eT=(_)=>String(_)===_&&_.length>=1&&_.length<=80,ES=(_)=>{if(!Array.isArray(_)||_.length>4)return!1;let E=new Set;for(let T of _){if(!vT(T)||!_S.test(T.id)||!sT(T.label))return!1;if(T.disabled!==void 0&&T.disabled!==!0&&T.disabled!==!1)return!1;if(E.has(T.id))return!1;if(E.add(T.id),T.kind==="button"){if(!oT(T,["kind","id","label","disabled"]))return!1;continue}if(T.kind!=="select"||!oT(T,["kind","id","label","value","options","disabled"]))return!1;if(!eT(T.value)||!Array.isArray(T.options)||T.options.length<1||T.options.length>16)return!1;let o=new Set;for(let O of T.options){if(!vT(O)||!oT(O,["value","label"])||!eT(O.value)||!sT(O.label)||o.has(O.value))return!1;o.add(O.value)}if(!o.has(T.value))return!1}return!0};var TS=["{id}","{segment}","{segments+}"];var bO=new Set(TS);var SS=["turn-finished","turn-failed","permission-asked","question-asked","turn-started","session-created","session-archived","session-deleted"];var XO=new Set(SS);var DE=20000000,dE=256;var OT=(_)=>("bytes"in _)?_.bytes.byteLength:_.content.length,oS=(_,E)=>{if(_.path!==E.path||_.readOnly!==E.readOnly)return!1;if(_.encoding==="text"||E.encoding==="text")return _.encoding==="text"&&E.encoding==="text"&&_.content===E.content;if(_.bytes.byteLength!==E.bytes.byteLength)return!1;for(let T=0;T<_.bytes.byteLength;T+=1)if(_.bytes[T]!==E.bytes[T])return!1;return!0};var OS=/^[A-Za-z0-9_-]{1,80}$/;var AS=["left","right","top","bottom"];var cS=(_,E=0,T={remaining:16000})=>{if(--T.remaining<0||E>=32)return!1;if(_===null)return!0;let o=Array.isArray(_)?_:Object(_)===_?Object.values(_):[];for(let O of o)if(!cS(O,E+1,T))return!1;return!0},AT=(_)=>{if(_===null||_===!0||_===!1)return!0;if(Array.isArray(_))return Object.keys(_).every((E)=>/^(0|[1-9]\d*)$/.test(E)&&Number(E)<_.length)&&_.every(AT);if(Object(_)===_){let E=Object.getPrototypeOf(_);return(E===null||E===Object.prototype)&&Object.values(_).every(AT)}return String(_)===_||Number.isFinite(_)},cT=(_)=>{try{if(String(_.id)!==_.id||!OS.test(_.id)||!Number.isFinite(_.anchor.x)||Math.abs(_.anchor.x)>1e5||!Number.isFinite(_.anchor.y)||Math.abs(_.anchor.y)>1e5||!Number.isFinite(_.anchor.width)||!Number.isFinite(_.anchor.height)||_.anchor.width<=0||_.anchor.height<=0||_.anchor.width>1e5||_.anchor.height>1e5||!Number.isInteger(_.width)||_.width<160||_.width>640||!Number.isInteger(_.height)||_.height<48||_.height>480||_.side!==void 0&&!AS.includes(_.side)||_.focus!==void 0&&_.focus!==!0&&_.focus!==!1||!cS(_.data)||!AT(_.data))return!1;return JSON.stringify(_.data).length<=16000}catch{return!1}};var fS=/^[0-9a-f]{7,64}$/i,kS=(_)=>fS.test(_),fT=255,US=(_,E,T)=>({openCommit:(o)=>kS(o)?_({channel:h,v:K,type:"open-commit",id:E(),payload:{sha:o}}):T("Commit id must be 7 to 64 hex characters."),openWalkthrough:({base:o})=>{let O=o.trim();if(!O||O.length>fT)return T(`Base must contain 1 to ${fT} characters.`);return _({channel:h,v:K,type:"open-walkthrough",id:E(),payload:{base:O}})}});var UT=2000;var RS=["file","directory","other","missing"],IT=(_)=>Boolean(_&&"sessionId"in _),RT=(_)=>Boolean(_&&"sent"in _&&!("sessionId"in _));var zE=500,hE=32000,MS=16000,xS=128,$S=200,CS=2000,NS=16000,GS=80,bS=200,nS=16000;var XS=2000;var MT=20000,KE=1024,WE=2000000;var tE=64000,QE=8000,xT=4000;var $T=960000;var VS=999,pS=1e4,xE=500,rS=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],LS=["stopped","starting","ready","failed"],xo=new Set(rS),PS=(_)=>xo.has(_),DS=(_)=>_&&PS(_)?_:"HOST_REJECTED",s_=(_)=>{if(_===void 0)return!1;if(_===null||_===!0||_===!1)return!0;if(String(_)===_)return!0;if(Number(_)===_)return Number.isFinite(_);if(Array.isArray(_))return _.every(s_);if(Object(_)===_)return Object.values(_).every(s_);return!1},dS=(_)=>s_(_)&&JSON.stringify(_).length<=nS,IS=(_)=>_?.trim().slice(0,bS)??"",e_=(_)=>{let E=_.id.trim().slice(0,xS),T=_.title.trim().slice(0,$S),o=_.url.trim().slice(0,CS),O=_.text?.trim().slice(0,NS),f=_.author?.trim().slice(0,GS),k=_.kind==="pull"?"pull":"issue",U={providerId:_.providerId.trim(),id:E,title:T||E,url:o,kind:k};if(O)U.text=O;if(f)U.author=f;if(k==="pull"){let R=IS(_.branches?.head),x=IS(_.branches?.base);if(R&&x)U.branches={head:R,base:x}}if(dS(_.data))U.data=_.data;return U},CT=(_)=>{let E=e_(_);if(_.projectId)E.projectId=_.projectId;if(_.navigation)E.navigation=_.navigation;if(_.worktree)E.worktree=_.worktree;return E},NT=(_)=>{let E={text:_.text.trim().slice(0,MS)};if(_.send)E.send=!0;return E},GT=(_)=>{if(_===null||!Number.isFinite(_))return null;return Math.min(VS,Math.max(0,Math.round(_)))},bT=(_)=>{if(!Number.isFinite(_))return 0;return Math.min(pS,Math.max(0,Math.ceil(_)))};var _E=(_)=>_.length>0&&_.length<=KE&&!_.includes("\x00")&&!_.includes("\\");var YE=(_)=>{if(!_.startsWith("/")||_.includes("\x00")||_.includes("\\")||_.includes("://"))return!1;if(_.length>XS)return!1;return!_.split("/").some((T)=>T==="."||T==="..")},$o=new Set(LS),nT=(_)=>Boolean(_&&"status"in _&&$o.has(String(_.status))&&!("body"in _)),HE=(_)=>Boolean(_&&"status"in _&&"body"in _&&Number.isInteger(_.status)),XT=(_)=>Boolean(_&&"content"in _&&String(_.content)===_.content),VT=(_)=>Boolean(_&&"written"in _&&_.written===!0),pT=(_)=>Boolean(_&&"entries"in _&&Array.isArray(_.entries)),Co=new Set(RS),rT=(_)=>Boolean(_&&"kind"in _&&"size"in _&&Co.has(String(_.kind))&&Number.isFinite(_.size)),LT=(_)=>Boolean(_&&"text"in _&&String(_.text)===_.text&&!("status"in _)),No=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","service-event","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late","microphone-audio","microphone-ended"]),Go=(_)=>Object(_)===_?_:null,kT=(_)=>String(_)===_&&_.length>0,bo=(_)=>{if(!kT(_.id))return null;if(_.ok===!0){let E={channel:h,v:K,type:"result",id:_.id,ok:!0};if(Object(_.payload)===_.payload)E.payload=_.payload;return E}if(_.ok===!1&&kT(_.error))return{channel:h,v:K,type:"result",id:_.id,ok:!1,error:_.error,code:DS(kT(_.code)?_.code:void 0)};return null},PT=(_)=>{let E=Go(_);if(!E||E.channel!==h||E.v!==K)return null;if(E.type==="result")return bo(E);if(!No.has(String(E.type))||Object(E.payload)!==E.payload)return null;return E};var zS=(_)=>("key"in _)&&("metaKey"in _)&&("ctrlKey"in _),no=(_)=>(_.metaKey||_.ctrlKey)&&!_.altKey&&!_.shiftKey&&_.key.toLowerCase()==="s";class p extends Error{code;constructor(_,E){super(E);this.name="HostRequestError",this.code=_}}var hS=()=>Promise.reject(new p("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),ZE=()=>Promise.reject(new p("BAD_PATH",`File path must be 1 to ${KE} characters without NUL or backslash.`)),jE=(_)=>{if(_===void 0)return;if(Object(_)!==_||Array.isArray(_)||_.scope!==void 0&&_.scope!=="instance"&&_.scope!=="device")throw new p("HOST_REJECTED",'Storage scope must be "instance" or "device".');return _.scope==="device"?"device":void 0},D=(_)=>{return _.value+=1,`oc-${_.value}`},DT=(_={})=>{let E=_.target??("window"in globalThis?window:null);if(!E)throw new p("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let T=_.acceptSource??((S)=>S===E.parent),o=_.requestTimeoutMs??MT,O=new Set,f=new Set,k=new Set,U=new Set,R=new Set,x=new Set,X=new Set,C=new Set,L=new Set,W=new Set,N=new Set,G=new Set,Y=[],H=null,j=null,w=new Set,t=new Set,m=null,a=null,r_=!1,S_=new Map,o_=new Map,b_=new Map,Q=!1,P={value:0},V=null,n_=null,F_=!1,B_=!1,z_=null,U_=null,ME=(S)=>{if(!S)return null;return{sessionId:S.id,phase:S.busy?"started":"completed"}},O_=(S)=>{E.parent.postMessage(S,"*")},t_=()=>{if(Q||E.parent===E||G.size===0||V?.features?.lateGenerateResults!==!0)return;O_({channel:h,v:K,type:"generate-late-listen"})},F=(S,A)=>{for(let n of S)try{n(A)}catch(b){console.error(b)}},pE=(S)=>{if(!(S instanceof MessageEvent))return;if(!T(S.source))return;let A=PT(S.data);if(!A)return;if(A.type==="workspace"){let b=o_.get(A.payload.subscriptionId);if(b)F([b],A.payload.snapshot);return}if(A.type==="shells"){let b=b_.get(A.payload.subscriptionId);if(b)F([b],A.payload.snapshot);return}if(A.type==="microphone-audio"){U_?.queue.push(A.payload.samples);return}if(A.type==="microphone-ended"){let b=U_;if(!b)return;U_=null,b.release(),F(b.endedListeners,A.payload.reason);return}if(A.type==="ready"){if(V=A.payload,n_=ME(A.payload.session),F(O,A.payload),F(f,A.payload.directory),F(k,A.payload.session),n_)F(U,n_);if(F(R,A.payload.connection),F(x,A.payload.settings),F(X,A.payload.item),A.payload.block)F(C,A.payload.block);t_();return}if(A.type==="service-event"){F(L,A.payload);return}if(A.type==="generate-late"){if(G.size===0)Y.push(A.payload);else F(G,A.payload);return}if(A.type==="directory"){if(V)V={...V,directory:A.payload.directory};F(f,A.payload.directory);return}if(A.type==="session"){if(V)V={...V,session:A.payload.session};if(!A.payload.session)n_=null;else if(n_?.sessionId!==A.payload.session.id)n_=ME(A.payload.session);F(k,A.payload.session);return}if(A.type==="session-lifecycle"){n_=A.payload,F(U,A.payload);return}if(A.type==="connection"){if(V)V={...V,connection:A.payload.connection};F(R,A.payload.connection);return}if(A.type==="settings"){if(V)V={...V,settings:A.payload.settings};F(x,A.payload.settings);return}if(A.type==="item"){if(V)V={...V,item:A.payload.item};F(X,A.payload.item);return}if(A.type==="status-control-event"){F(W,A.payload);return}if(A.type==="popover-closed"){F(N,A.payload);return}if(A.type==="action"){let b=(y)=>{if(!Q)O_({channel:h,v:K,type:"action-result",id:A.id,payload:y})},g=j;if(!g){b({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>g(A.payload)).then(()=>b({ok:!0}),(y)=>{let i=(y instanceof Error?y.message:String(y)).trim();b({ok:!1,error:(i||"Action failed.").slice(0,xE)})});return}if(A.type==="file-open"){let b=A.payload;if(a&&oS(a,b))return;a=b,F(w,A.payload);return}if(A.type==="file-saved"){F(t,A.payload.version);return}if(A.type==="file-snapshot"){let b=(i)=>{if(!Q)O_({channel:h,v:K,type:"file-snapshot-result",id:A.id,payload:i})},g=(i)=>b({error:(i.trim()||"Could not read the edited file.").slice(0,xE)}),y=m;if(!y){g("This extension does not edit files.");return}Promise.resolve().then(()=>y(A.payload.purpose)).then((i)=>{if(OT(i)>DE){g(`The file is over ${DE} ${"bytes"in i?"bytes":"characters"}.`);return}if(i.version.length>dE){g(`The snapshot version is over ${dE} characters.`);return}b({snapshot:"bytes"in i?{bytes:i.bytes,version:i.version}:{content:i.content,version:i.version}})},(i)=>g(i instanceof Error?i.message:String(i)));return}if(A.type==="resolve"){let b=(y)=>{O_({channel:h,v:K,type:"resolve-result",id:A.id,payload:y})},g=H;if(!g){b({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>g(A.payload)).then((y)=>b({item:y?e_(y):null}),(y)=>{let i=(y instanceof Error?y.message:String(y)).trim();b({error:(i||"Command failed.").slice(0,xE)})});return}let n=S_.get(A.id);if(!n)return;if(clearTimeout(n.timer),S_.delete(A.id),A.ok){n.resolve(A.payload);return}n.reject(new p(A.code,A.error))};E.addEventListener("message",pE),O_({channel:h,v:K,type:"hello"});let A_=(S,A=o)=>{if(Q||E.parent===E)return Promise.reject(new p("HOST_UNAVAILABLE","No host frame. This page is not in an iframe."));return new Promise((n,b)=>{let g=setTimeout(()=>{S_.delete(S.id),b(new p("HOST_TIMEOUT","Host did not answer in time."))},A);S_.set(S.id,{resolve:n,reject:b,timer:g}),O_(S)})},M=(S)=>A_(S).then(()=>{return}),$={channel:h,v:K},J=(S)=>{if(!Q&&E.parent!==E)O_(S)},Z=()=>J({...$,type:"file-save"}),__=()=>{if(!Q&&E.parent!==E)O_({...$,type:"microphone-close",id:D(P)})},f_=async()=>{if(U_)throw new p("HOST_REJECTED","The microphone is already open in this frame.");if(V?.features?.microphone!==!0)throw new p("UNSUPPORTED","This OpenChamber cannot share the microphone with extensions.");let S=globalThis.AudioContext;if(typeof S!=="function")throw new p("UNSUPPORTED","This frame has no Web Audio.");let A=new S;if(A.sampleRate<ET||A.sampleRate>TT)throw A.close().catch(()=>{return}),new p("UNSUPPORTED",`Audio at ${A.sampleRate} Hz is not supported.`);let n=A.state==="suspended"?A.resume().catch(()=>{return}):void 0,b=aT(Math.round(A.sampleRate/4)),g=A.createScriptProcessor(1024,1,1);g.onaudioprocess=(X_)=>b.pull(X_.outputBuffer.getChannelData(0));let y=A.createMediaStreamDestination();g.connect(y);let i=new Set,v_={queue:b,endedListeners:i,release:()=>{g.onaudioprocess=null,g.disconnect(),b.clear();for(let X_ of y.stream.getTracks())X_.stop();A.close().catch(()=>{return})}};U_=v_;try{let X_=await A_({...$,type:"microphone-open",id:D(P),payload:{sampleRate:A.sampleRate}},ST);if(!X_||!("opened"in X_)||X_.opened!==!0)throw new p("HOST_REJECTED","Host did not open the microphone.");if(await n,U_!==v_)throw new p("DISCONNECTED","The microphone closed while it was opening.")}catch(X_){if(U_===v_)U_=null;throw v_.release(),__(),X_}return{stream:y.stream,close:()=>{if(U_!==v_)return;U_=null,v_.release(),__()},onEnded:(X_)=>{return i.add(X_),()=>{i.delete(X_)}}}},R_=(S)=>{if(!zS(S)||!no(S))return;S.preventDefault(),Z()},P_=(S)=>{if(!zS(S)||S.key!=="Escape"||V?.surface!=="popover"||!V.popover)return;S.preventDefault(),Q_(V.popover.id,"escape").catch(()=>{return})},$_=()=>{let S=V?.surface==="popover"?V.popover:void 0;if(!S)return;let A=F_||B_;if(z_===A)return;z_=A,rE(S.id,A).catch(()=>{return})},E_=()=>{if(V?.surface!=="popover"||F_)return;F_=!0,$_()},x_=(S)=>{if(V?.surface!=="popover"||S.relatedTarget!==null||!F_)return;F_=!1,$_()},c_=()=>{if(V?.surface!=="popover"||B_)return;B_=!0,$_()},k_=()=>{if(V?.surface!=="popover"||!B_)return;B_=!1,$_()},z=(S,A=1024)=>{if(!S.trim()||S.length>A)throw new p("HOST_REJECTED",`Identity must contain 1 to ${A} characters.`)},B=async(S)=>{if(S.kind!=="projects")z(S.projectId);let A=await A_({...$,type:"workspace-read",id:D(P),payload:S});if(!A||!("kind"in A)||!("state"in A)||A.kind!==S.kind)throw new p("HOST_REJECTED","Host did not return workspace data.");return A},I_=async(S,A)=>{if(S.kind!=="projects")z(S.projectId);let n=D(P);o_.set(n,A);try{await M({...$,type:"workspace-subscribe",id:D(P),payload:{subscriptionId:n,query:S}})}catch(b){if(o_.delete(n),!Q)O_({...$,type:"workspace-unsubscribe",id:D(P),payload:{subscriptionId:n}});throw b}return()=>{if(!o_.delete(n)||Q)return;O_({...$,type:"workspace-unsubscribe",id:D(P),payload:{subscriptionId:n}})}},l_=async(S,A)=>{if(S.kind==="session")z(S.sessionId);if(S.kind==="project")z(S.projectId);let n=D(P);b_.set(n,A);try{await M({...$,type:"shells-subscribe",id:D(P),payload:{subscriptionId:n,scope:S}})}catch(b){if(b_.delete(n),!Q)O_({...$,type:"shells-unsubscribe",id:D(P),payload:{subscriptionId:n}});throw b}return()=>{if(!b_.delete(n)||Q)return;O_({...$,type:"shells-unsubscribe",id:D(P),payload:{subscriptionId:n}})}},a_=async(S)=>{if("key"in S&&(S.key.length===0||S.key.length>eE))throw new p("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(S.op==="set"&&!s_(S.value))throw new p("HOST_REJECTED","Storage values must be JSON.");if(S.op==="set"&&new TextEncoder().encode(JSON.stringify(S.value)).length>_T)throw new p("HOST_REJECTED","Storage value exceeds 64 KiB.");if(S.scope==="device"&&V?.features?.deviceStorage!==!0)throw new p("UNSUPPORTED","This host does not support device storage.");let A=await A_({...$,type:"storage",id:D(P),payload:S});if(!A||!("storage"in A)||A.op!==S.op)throw new p("HOST_REJECTED","Host did not return storage data.");return A},Q_=(S,A)=>V?.features?.popovers!==!0&&!(V?.surface==="popover"&&V.popover?.id===S)?Promise.reject(new p("UNSUPPORTED","This host does not support popovers.")):M({...$,type:"popover-close",id:D(P),payload:A?{id:S,reason:A}:{id:S}}),rE=(S,A)=>V?.features?.popovers!==!0&&!(V?.surface==="popover"&&V.popover?.id===S)?Promise.reject(new p("UNSUPPORTED","This host does not support popovers.")):M({...$,type:"popover-anchor",id:D(P),payload:{id:S,active:A}});return E.addEventListener("keydown",P_,!0),E.addEventListener("pointerover",E_),E.addEventListener("pointermove",E_),E.addEventListener("pointerout",x_),E.addEventListener("focus",c_),E.addEventListener("blur",k_),{onAction:(S)=>{return j=S,()=>{if(j===S)j=null}},listProjects:async()=>{let S=await B({kind:"projects"});if(S.kind!=="projects")throw new p("HOST_REJECTED","Expected projects.");return S},listWorktrees:async(S)=>{let A=await B({kind:"worktrees",projectId:S});if(A.kind!=="worktrees")throw new p("HOST_REJECTED","Expected worktrees.");return A},listSessions:async(S)=>{let A=await B({kind:"sessions",projectId:S});if(A.kind!=="sessions")throw new p("HOST_REJECTED","Expected sessions.");return A},onProjects:(S)=>I_({kind:"projects"},(A)=>{if(A.kind==="projects")S(A)}),onWorktrees:(S,A)=>I_({kind:"worktrees",projectId:S},(n)=>{if(n.kind==="worktrees")A(n)}),onSessions:(S,A)=>I_({kind:"sessions",projectId:S},(n)=>{if(n.kind==="sessions")A(n)}),onRunningShells:(S,A)=>l_(S,A),readShellOutput:async(S,A)=>{z(S,LE);let n=A?.cursor;if(n!==void 0&&(!Number.isInteger(n)||n<0))throw new p("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let b=A?.tailBytes;if(b!==void 0&&(!Number.isInteger(b)||b<1||b>PE))throw new p("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${PE}.`);let y=await A_({...$,type:"shell-output",id:D(P),payload:{shellId:S,cursor:n,tailBytes:b}});if(!y||typeof y.output!=="string"||!Number.isFinite(y.cursor))throw new p("HOST_REJECTED","Host did not return shell output.");return y},stopShell:async(S)=>{if(z(S,LE),(await A_({...$,type:"shell-stop",id:D(P),payload:{shellId:S}}))?.stopped!==!0)throw new p("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async(S)=>{z(S),await M({...$,type:"open-session",id:D(P),payload:{sessionId:S}})},storage:{get:async(S,A)=>{let n=jE(A),b={op:"get",key:S};if(n)b.scope=n;let g=await a_(b);return g.op==="get"&&g.found?g.value:void 0},set:async(S,A,n)=>{let b=jE(n),g={op:"set",key:S,value:A};if(b)g.scope=b;await a_(g)},delete:async(S,A)=>{let n=jE(A),b={op:"delete",key:S};if(n)b.scope=n;await a_(b)},keys:async(S)=>{let A=jE(S),n={op:"keys"};if(A)n.scope=A;let b=await a_(n);if(b.op!=="keys")throw new p("HOST_REJECTED","Expected storage keys.");return b.keys}},onReady:(S)=>{if(O.add(S),V)S(V);return()=>{O.delete(S)}},onDirectory:(S)=>{if(f.add(S),V)S(V.directory);return()=>{f.delete(S)}},onSession:(S)=>{if(k.add(S),V)S(V.session);return()=>{k.delete(S)}},onSessionLifecycle:(S)=>{if(U.add(S),n_)S(n_);return()=>{U.delete(S)}},onConnection:(S)=>{if(R.add(S),V)S(V.connection);return()=>{R.delete(S)}},onSettings:(S)=>{if(x.add(S),V)S(V.settings);return()=>{x.delete(S)}},onItem:(S)=>{if(X.add(S),V)S(V.item);return()=>{X.delete(S)}},onBlock:(S)=>{if(C.add(S),V?.block)S(V.block);return()=>{C.delete(S)}},onServiceEvent:(S)=>{return L.add(S),()=>{L.delete(S)}},onStatusControl:(S)=>{return W.add(S),()=>{W.delete(S)}},onPopoverClosed:(S)=>{return N.add(S),()=>{N.delete(S)}},setStatusControls:(S)=>{if(V?.features?.statusControls!==!0)return Promise.reject(new p("UNSUPPORTED","This host does not support status controls."));if(!ES(S))return Promise.reject(new p("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options."));return M({...$,type:"status-controls",id:D(P),payload:{controls:S}})},openPopover:(S)=>{if(V?.features?.popovers!==!0)return Promise.reject(new p("UNSUPPORTED","This host does not support popovers."));if(!cT(S))return Promise.reject(new p("HOST_REJECTED","Popover requests need bounded geometry and JSON data."));return M({...$,type:"popover-open",id:D(P),payload:S})},closePopover:Q_,setPopoverAnchorActive:rE,onResolve:(S)=>{return H=S,()=>{if(H===S)H=null}},toast:(S)=>{let A=S.message.trim();if(!A||A.length>zE)return Promise.reject(new p("HOST_REJECTED",`Toast message must contain 1 to ${zE} characters.`));if(S.copy&&S.copy!==!0&&(!S.copy.text.length||S.copy.text.length>hE))return Promise.reject(new p("HOST_REJECTED",`Toast copy text must contain 1 to ${hE} characters.`));return M({channel:h,v:K,type:"toast",id:D(P),payload:{...S,message:A}})},openUrl:(S)=>M({channel:h,v:K,type:"open-url",id:D(P),payload:{url:S}}),...US(M,()=>D(P),(S)=>Promise.reject(new p("HOST_REJECTED",S))),answerBlock:(S)=>M({channel:h,v:K,type:"block-answer",id:D(P),payload:{text:S.trim().slice(0,UT)}}),openSurface:(S)=>M({channel:h,v:K,type:"open-surface",id:D(P),payload:{surfaceId:S}}),writeClipboard:(S)=>M({channel:h,v:K,type:"clipboard-write",id:D(P),payload:{text:S}}),compose:(S)=>M({channel:h,v:K,type:"compose",id:D(P),payload:S}),attach:(S)=>M({channel:h,v:K,type:"attach",id:D(P),payload:e_(S)}),startSession:async(S)=>{if(S.projectId!==void 0)z(S.projectId);let A=S.worktree;if(A&&A!==!0)if(A.kind==="existing")z(A.directory);else{if(A.name!==void 0)z(A.name,200);if(A.baseBranch!==void 0)z(A.baseBranch,200)}let n=await A_({channel:h,v:K,type:"start-session",id:D(P),payload:CT(S)},_.requestTimeoutMs??180000);if(!IT(n))throw new p("HOST_REJECTED","Host did not return a session.");return n},prompt:(S)=>A_({channel:h,v:K,type:"prompt",id:D(P),payload:NT(S)}).then((A)=>{if(!RT(A))throw new p("HOST_REJECTED","Host did not return a prompt result.");return A}),sessionLink:(S)=>M({channel:h,v:K,type:"session-link",id:D(P),payload:e_(S)}),close:()=>M({channel:h,v:K,type:"close",id:D(P)}),oauthStart:()=>M({channel:h,v:K,type:"oauth-start",id:D(P)}),oauthDisconnect:()=>M({channel:h,v:K,type:"oauth-disconnect",id:D(P)}),request:(S)=>(YE(S.path)?A_({channel:h,v:K,type:"request",id:D(P),payload:S}):hS()).then((A)=>{if(!HE(A))throw new p("HOST_REJECTED","Host request result was empty.");return A}),serviceRequest:(S)=>(YE(S.path)?A_({channel:h,v:K,type:"service-request",id:D(P),payload:S}):hS()).then((A)=>{if(!HE(A))throw new p("HOST_REJECTED","Host service request result was empty.");return A}),serviceStatus:()=>A_({channel:h,v:K,type:"service-status",id:D(P)}).then((S)=>{if(!nT(S))throw new p("HOST_REJECTED","Host did not return service status.");return S}),readFile:(S)=>(_E(S)?A_({channel:h,v:K,type:"file-read",id:D(P),payload:{path:S}}):ZE()).then((A)=>{if(!XT(A))throw new p("HOST_REJECTED","Host did not return file content.");return A}),writeFile:(S,A)=>{if(!_E(S))return ZE();if(A.length>WE)return Promise.reject(new p("FILE_TOO_LARGE",`Content is over ${WE} characters.`));return A_({channel:h,v:K,type:"file-write",id:D(P),payload:{path:S,content:A}}).then((n)=>{if(!VT(n))throw new p("HOST_REJECTED","Host did not confirm the write.");return n})},listDir:(S)=>(_E(S)?A_({channel:h,v:K,type:"file-list",id:D(P),payload:{path:S}}):ZE()).then((A)=>{if(!pT(A))throw new p("HOST_REJECTED","Host did not return directory entries.");return A}),stat:(S)=>(_E(S)?A_({channel:h,v:K,type:"file-stat",id:D(P),payload:{path:S}}):ZE()).then((A)=>{if(!rT(A))throw new p("HOST_REJECTED","Host did not return file status.");return A}),generate:(S)=>{let A=S.prompt.trim(),n=S.system?.trim();if(A.length===0||A.length>tE)return Promise.reject(new p("HOST_REJECTED",`Prompt must be 1 to ${tE} characters.`));if(n!==void 0&&(n.length===0||n.length>QE))return Promise.reject(new p("HOST_REJECTED",`System prompt must be 1 to ${QE} characters.`));let b=S.maxOutputTokens===void 0?void 0:Math.min(xT,Math.max(1,Math.floor(S.maxOutputTokens)));if(b!==void 0&&!Number.isFinite(b))return Promise.reject(new p("HOST_REJECTED","maxOutputTokens must be a number."));let g={prompt:A};if(n!==void 0)g.system=n;if(b!==void 0)g.maxOutputTokens=b;return A_({channel:h,v:K,type:"generate",id:D(P),payload:g},_.requestTimeoutMs??$T).then((y)=>{if(!LT(y))throw new p("HOST_REJECTED","Host did not return generated text.");return y})},onLateGenerateResult:(S)=>{G.add(S);for(let A of Y.splice(0))F([S],A);return t_(),()=>{G.delete(S)}},openMicrophone:f_,setBadge:(S)=>M({channel:h,v:K,type:"badge",id:D(P),payload:{count:GT(S)}}),setHeight:(S)=>M({channel:h,v:K,type:"resize",id:D(P),payload:{height:bT(S)}}),onFileOpen:(S)=>{if(w.add(S),!r_)r_=!0,E.addEventListener("keydown",R_,!0);if(a)S(a);return()=>{w.delete(S)}},onFileSnapshot:(S)=>{return m=S,()=>{if(m===S)m=null}},onFileSaved:(S)=>{return t.add(S),()=>{t.delete(S)}},reportFileChange:(S)=>J({...$,type:"file-change",payload:{dirty:S.dirty,edited:S.edited}}),requestFileSave:Z,reportFileUnsupported:()=>J({...$,type:"file-unsupported"}),dispose:()=>{for(let S of o_.keys())O_({...$,type:"workspace-unsubscribe",id:D(P),payload:{subscriptionId:S}});o_.clear();for(let S of b_.keys())O_({...$,type:"shells-unsubscribe",id:D(P),payload:{subscriptionId:S}});if(b_.clear(),U_)__(),U_.release(),U_=null;if(Q=!0,H=null,j=null,m=null,w.clear(),t.clear(),r_)E.removeEventListener("keydown",R_,!0);E.removeEventListener("message",pE),E.removeEventListener("keydown",P_,!0),E.removeEventListener("pointerover",E_),E.removeEventListener("pointermove",E_),E.removeEventListener("pointerout",x_),E.removeEventListener("focus",c_),E.removeEventListener("blur",k_);for(let S of S_.values())clearTimeout(S.timer),S.reject(new p("HOST_UNAVAILABLE","Host client was disposed."));S_.clear(),O.clear(),f.clear(),k.clear(),U.clear(),R.clear(),x.clear(),X.clear(),C.clear(),L.clear(),W.clear(),N.clear(),G.clear(),Y.length=0}}};var KS=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var BO=new Set(KS);var WS=["none","agent","user"];var yO=new Set(WS);var Xo=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],Vo=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],tS=(_,E)=>{E.style.colorScheme=_.mode;for(let[T,o]of Xo)E.style.setProperty(T,_.tokens[o]);for(let[T,o,O]of Vo){let f=_.tokens[O]??"";E.style.setProperty(T,f),E.style.setProperty(o,f)}E.style.setProperty("font-family",_.tokens.font),E.style.setProperty("font-size",_.tokens.fontSize??"0.875rem"),E.style.setProperty("line-height","1.45"),E.style.setProperty("color",_.tokens.foreground)},dT=(_,E)=>{if(tS(_.theme,E),E.dataset)E.dataset.ocSurface=_.surface,E.dataset.ocTheme=_.theme.mode};var po={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},q=(_,E)=>`var(--${_}, var(--oc-${po[_]}, ${E}))`,K_=q("surface-background","transparent"),FE=q("surface-elevated","transparent"),EE=q("surface-elevated-foreground","inherit"),N_=q("surface-foreground","inherit"),v=q("surface-muted-foreground","gray"),ro=q("surface-muted","transparent"),g_=q("interactive-border","currentColor"),C_=q("interactive-hover","transparent"),y_=q("interactive-active","transparent"),zT=q("interactive-selection","transparent"),hT=q("interactive-selection-foreground","inherit"),h_=q("primary","currentColor"),KT=q("primary-text","inherit"),WT=q("error-text","inherit"),Lo=q("font-sans","inherit"),tT=q("font-mono","monospace"),ZS=q("radius","9px"),QT=`calc(${ZS} - 2px)`,QS=`calc(${ZS} - 4px)`,s=(_,E,T="transparent")=>`color-mix(in srgb, ${_} ${E}%, ${T})`,YS=`background-image: linear-gradient(${C_}, ${C_});`,YT=(_,E="0.5px")=>`box-shadow: inset 0 0 0 ${E} ${_}, var(--oc-sdk-field-lift);`,HT="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",HS="box-shadow: var(--oc-sdk-lit);",ZT=`inset 0 0.5px 0 0 ${s(N_,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,Po=`
:root {
  --oc-sdk-edge: ${s(N_,16)};
  --oc-sdk-field-bg: ${FE};
  --oc-sdk-raised-bg: ${K_};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${s(N_,14)};
  --oc-sdk-field-bg: ${s(K_,50,FE)};
  --oc-sdk-raised-bg: ${FE};
  --oc-sdk-field-lift: ${ZT};
  --oc-sdk-raised-lift: ${ZT};
  --oc-sdk-lit: ${ZT};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,JE=(_)=>{let E=q(`status-${_}`,"currentColor");return`
.oc-sdk[data-tone="${_}"], .oc-sdk [data-tone="${_}"] { --oc-sdk-tone: ${E}; --oc-sdk-tone-text: ${q(`${_}-text`,"inherit")}; }`},I=(_)=>`calc(${_}rem / 14)`,Do=`
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
`,jS=`${Po}
.oc-sdk { color: ${N_}; font-family: ${Lo}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${YS} }
.oc-sdk-mono { font-family: ${tT}; }
.oc-sdk-muted { color: ${v}; }
${JE("success")}${JE("warning")}${JE("error")}${JE("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${h_}; --oc-sdk-tone-text: ${KT}; }

.oc-sdk-btn { border-radius: ${QT}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${QS}; }
.oc-sdk-btn[data-variant="default"] { color: ${KT}; background: ${s(h_,10,K_)}; border-color: ${s(h_,12)}; ${HS} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${s(h_,16,K_)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${s(h_,22,K_)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${ro}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${C_}, ${C_}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${y_}, ${y_}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${EE}; ${HT} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${C_}, ${C_}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${y_}, ${y_}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${C_}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${y_}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${q("status-error","red")}; color: ${WT}; background: ${s("var(--oc-sdk-tone)",7,K_)}; border-color: ${s("var(--oc-sdk-tone)",12)}; ${HS} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${s("var(--oc-sdk-tone)",9,K_)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${s("var(--oc-sdk-tone)",11,K_)}; box-shadow: none; }

.oc-sdk-field-note { color: ${v}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${WT}; }
.oc-sdk-input { border-radius: ${QT}; background: var(--oc-sdk-field-bg); color: ${EE}; ${YT("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${v}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${C_}, ${C_}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${YT(s(N_,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${YT(q("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${tT}; }

.oc-sdk-search-icon { color: ${v}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${h_}; }
.oc-sdk-search-clear { border-radius: ${QS}; color: ${v}; }
.oc-sdk-search-clear:hover { background: ${C_}; color: ${N_}; }

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
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${zT}; color: ${hT}; }
.oc-sdk-option-check { color: ${N_}; }
.oc-sdk-option[data-destructive="true"] { color: ${WT}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${s(q("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${v}; }
.oc-sdk-popup-empty { color: ${v}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${g_}; border-radius: 4px; color: ${N_}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${s(N_,60,g_)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${g_}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${K_}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${h_}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(var(--oc-sdk-thumb-travel, 16px)); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${YS} }
.oc-sdk-check-desc { color: ${v}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${s(N_,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${v}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${N_}; }
.oc-sdk-tab[aria-selected="true"] { color: ${hT}; background: ${zT}; border-color: ${g_}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${EE}; background: var(--oc-sdk-raised-bg); ${HT} }
.oc-sdk-tab-count { color: ${v}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${s(N_,6)}; color: ${v}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${s("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${C_}; }
.oc-sdk-row[aria-selected="true"] { background: ${zT}; color: ${hT}; }
.oc-sdk-row-lead { font-family: ${tT}; color: ${v}; }
.oc-sdk-row-sub { color: ${v}; }
.oc-sdk-row-meta { color: ${v}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${v}; }

.oc-sdk-empty-body { color: ${v}; }

.oc-sdk-spinner { color: ${v}; }
.oc-sdk-spinner-ring { border-color: ${g_}; border-top-color: ${h_}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${s("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${v}; }

.oc-sdk-separator { color: ${v}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${s(g_,40)}; }

.oc-sdk-progress-label { color: ${v}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${s(N_,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${h_}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${q("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${q("success-text","inherit")}; }

.oc-sdk-text a { color: ${KT}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${s(g_,60)}; }
`,u=`
${vE}
${Do}
${jS}`;var JS="oc-sdk-ui-style",TE=(_)=>{while(_.firstChild)_.removeChild(_.firstChild)},l=(_)=>{let E=document.getElementById(JS);if(E instanceof HTMLStyleElement){if(E.textContent!==_)E.textContent=_;return}sE(document);let T=document.createElement("style");T.id=JS,T.textContent=_,document.head.appendChild(T)},d=(_,E)=>{let T=document.createElement(_);if(E)T.className=E;return T},D_=(_)=>{let E=d("button",_);return E.type="button",E},T_=(_,E)=>{let T=E??"";if(_.textContent!==T)_.textContent=T},Y_=(_,E,T)=>{if(T===void 0||T===null||T==="")_.removeAttribute(E);else if(_.getAttribute(E)!==T)_.setAttribute(E,T)};var zo=()=>{let _=document.createElement("span");return _.className="oc-sdk-spinner-ring",_.setAttribute("aria-hidden","true"),_},L_=(_,E)=>{l(u);let T=E,o=D_("oc-sdk oc-sdk-btn"),O=zo(),f=document.createElement("span");o.append(f),_.append(o);let k=()=>{if(o.dataset.variant=T.variant??"default",o.dataset.size=T.size??"default",o.disabled=Boolean(T.disabled)||Boolean(T.loading),o.dataset.loading=T.loading?"true":"false",o.setAttribute("aria-busy",T.loading?"true":"false"),T.loading&&O.parentNode!==o)o.prepend(O);else if(!T.loading&&O.parentNode===o)O.remove();T_(f,T.label)},U=()=>{if(T.disabled||T.loading)return;T.onClick()};return o.addEventListener("click",U),k(),{update:(R)=>{T={...T,...R},k()},dispose:()=>{o.removeEventListener("click",U),o.remove()}}};var BE=(_,E)=>{l(u);let T=E,o=d("label","oc-sdk oc-sdk-field"),O=d("span","oc-sdk-field-label"),f=T.multiline?d("textarea","oc-sdk-input"):d("input","oc-sdk-input"),k=d("span","oc-sdk-field-note");o.append(O,f,k),_.append(o);let U=()=>{if(T_(O,T.label),O.hidden=!T.label,f instanceof HTMLInputElement)f.type=T.password?"password":"text";else f.rows=T.rows??3;if(f.value!==T.value)f.value=T.value;f.disabled=Boolean(T.disabled),Y_(f,"placeholder",T.placeholder),f.dataset.mono=T.mono?"true":"false";let x=Boolean(T.error);o.dataset.invalid=x?"true":"false",f.setAttribute("aria-invalid",x?"true":"false");let X=T.error??T.helper??"";T_(k,X),k.hidden=X===""},R=()=>{T.onChange(f.value)};return f.addEventListener("input",R),U(),{update:(x)=>{T={...T,...x},U()},dispose:()=>{f.removeEventListener("input",R),o.remove()}}};var FS="http://www.w3.org/2000/svg",ho={search:"M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z",chevron:"M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z",check:"M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z",close:"M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"},SE=(_,E,T)=>{let o=document.createElementNS(FS,"svg");if(o.setAttribute("viewBox","0 0 24 24"),o.setAttribute("width",String(E)),o.setAttribute("height",String(E)),o.style.width=I(E),o.style.height=I(E),o.setAttribute("aria-hidden","true"),o.setAttribute("fill","currentColor"),T)o.setAttribute("class",T);let O=document.createElementNS(FS,"path");return O.setAttribute("d",ho[_]),o.append(O),o};var oE=(_,E="vertical")=>{let[T,o]=E==="vertical"?["ArrowDown","ArrowUp"]:["ArrowRight","ArrowLeft"];if(_.key===T||_.ctrlKey&&_.key.toLowerCase()==="n")return"next";if(_.key===o||_.ctrlKey&&_.key.toLowerCase()==="p")return"previous";if(_.key==="Home")return"first";if(_.key==="End")return"last";return null},OE=(_,E,T)=>{let o=_.filter((R)=>!R.disabled);if(o.length===0)return null;let O=o[0],f=o[o.length-1];if(T==="first"||!O||!f)return O?.id??null;if(T==="last")return f.id;let k=o.findIndex((R)=>R.id===E);if(k===-1)return T==="next"?O.id:f.id;return o[Math.min(o.length-1,Math.max(0,k+(T==="next"?1:-1)))]?.id??null};var Qo=(_,E,T)=>{l(u);let o=E,O=D_("oc-sdk oc-sdk-check");O.setAttribute("role",T);let f=d("span",T==="switch"?"oc-sdk-check-thumb":"oc-sdk-check-box");if(T==="checkbox")f.append(SE("check",12));let k=d("span","oc-sdk-check-text"),U=d("span","oc-sdk-check-label"),R=d("span","oc-sdk-check-desc");k.append(U,R),O.append(f,k),_.append(O);let x=()=>{O.setAttribute("aria-checked",o.checked?"true":"false"),O.disabled=Boolean(o.disabled),T_(U,o.label),T_(R,o.description),R.hidden=!o.description},X=()=>{if(!o.disabled)o.onChange(!o.checked)};return O.addEventListener("click",X),x(),{update:(C)=>{o={...o,...C},x()},dispose:()=>{O.removeEventListener("click",X),O.remove()}}};var gE=(_,E)=>Qo(_,E,"switch");var jT=(_,E)=>{l(u);let T=E,o=d("div","oc-sdk oc-sdk-tabs");o.setAttribute("role","tablist"),_.append(o);let O=()=>{TE(o),o.dataset.track=T.trackBackground?"true":"false";for(let k of T.items){let U=D_("oc-sdk-tab");U.setAttribute("role","tab");let R=k.id===T.activeId;U.setAttribute("aria-selected",R?"true":"false"),U.tabIndex=R?0:-1,U.dataset.id=k.id;let x=d("span");if(x.textContent=k.label,U.append(x),k.count!==void 0){let X=d("span","oc-sdk-tab-count");X.textContent=String(k.count),U.append(X)}U.addEventListener("click",()=>{if(k.id!==T.activeId)T.onChange(k.id)}),o.append(U)}},f=(k)=>{let U=oE(k,"horizontal");if(!U)return;let R=OE(T.items,T.activeId,U);if(R&&R!==T.activeId){k.preventDefault(),T.onChange(R);let x=o.querySelector(`[data-id="${CSS.escape(R)}"]`);if(x instanceof HTMLElement)x.focus()}};return o.addEventListener("keydown",f),O(),{update:(k)=>{T={...T,...k},O()},dispose:()=>{o.removeEventListener("keydown",f),o.remove()}}};var JT=(_,E)=>{Y_(_,"data-tone",E&&E!=="neutral"?E:null)},yE=(_,E)=>{l(u);let T=E,o=d("span","oc-sdk oc-sdk-badge");_.append(o);let O=()=>{T_(o,T.label),JT(o,T.tone)};return O(),{update:(f)=>{T={...T,...f},O()},dispose:()=>{o.remove()}}};var FT=(_,E)=>{l(u);let T=E,o=d("div","oc-sdk oc-sdk-empty"),O=d("h2","oc-sdk-empty-title"),f=d("p","oc-sdk-empty-body"),k=d("div","oc-sdk-empty-action");o.append(O,f,k),_.append(o);let U=null,R=()=>{if(T_(O,T.title),T_(f,T.body),f.hidden=!T.body,k.hidden=!T.action,!T.action){U?.dispose(),U=null;return}let x={label:T.action.label,onClick:T.action.onClick};if(U)U.update(x);else U=L_(k,{...x,variant:"outline",size:"sm"})};return R(),{update:(x)=>{T={...T,...x},R()},dispose:()=>{U?.dispose(),U=null,o.remove()}}};var BT=(_,E={})=>{l(u);let T=E,o=d("span","oc-sdk oc-sdk-spinner");o.setAttribute("role","status");let O=d("span","oc-sdk-spinner-ring");O.setAttribute("aria-hidden","true");let f=d("span");o.append(O,f),_.append(o);let k=()=>{o.dataset.size=T.size??"default",T_(f,T.label),f.hidden=!T.label,o.setAttribute("aria-label",T.label??"Loading")};return k(),{update:(U)=>{T={...T,...U},k()},dispose:()=>{o.remove()}}};var mE=(_,E)=>{l(u);let T=E,o=d("div","oc-sdk oc-sdk-banner"),O=d("div","oc-sdk-banner-text"),f=d("div","oc-sdk-banner-title"),k=d("div","oc-sdk-banner-body"),U=d("div","oc-sdk-banner-action");O.append(f,k),o.append(O,U),_.append(o);let R=null,x=()=>{if(o.dataset.tone=T.tone,o.setAttribute("role",T.tone==="error"||T.tone==="warning"?"alert":"status"),T_(f,T.title),T_(k,T.body),k.hidden=!T.body,U.hidden=!T.action,!T.action){R?.dispose(),R=null;return}let X={label:T.action.label,onClick:T.action.onClick};if(R)R.update(X);else R=L_(U,{...X,variant:"outline",size:"xs"})};return x(),{update:(X)=>{T={...T,...X},x()},dispose:()=>{R?.dispose(),R=null,o.remove()}}};var M_=(_)=>{if(!Number.isFinite(_))return 0;return Math.max(0,Math.min(100,_))};var d_=(_)=>{let E=M_(_);if(Math.abs(E-Math.round(E))<0.05)return`${Math.round(E)}%`;return`${E.toFixed(1)}%`},AE=(_)=>{if(!Number.isFinite(_)||_<0)return"$0";if(_>=100)return`$${Math.round(_)}`;if(_>=10)return`$${_.toFixed(1)}`;return`$${_.toFixed(2)}`},$E=(_)=>{if(!Number.isFinite(_)||_<=0)return"0";if(_>=1e9)return`${(_/1e9).toFixed(2)}B`;if(_>=1e6){let E=_/1e6;return E>=100?`${Math.round(E)}M`:`${E.toFixed(1)}M`}if(_>=1000)return`${Math.round(_/1000)}K`;return String(Math.round(_))},wE=(_,E=Date.now())=>{if(!_||!Number.isFinite(_)||_<=E)return"即将重置";let T=Math.max(0,Math.floor((_-E)/1000)),o=Math.floor(T/86400),O=Math.floor(T%86400/3600),f=Math.floor(T%3600/60);if(o>0)return`${o}d ${O}h`;if(O>0)return`${O}h ${f}m`;return`${Math.max(1,f)}m`},BS=(_,E=Date.now())=>{if(!_||!Number.isFinite(_)||_<=0)return null;let T=_>1000000000000?_:_*1000,o=Math.max(0,Math.floor((E-T)/1000));if(o<60)return"刚刚采样";let O=Math.floor(o/60);if(O<60)return`采样 ${O}m 前`;let f=Math.floor(O/60);if(f<24)return`采样 ${f}h 前`;return`采样 ${Math.floor(f/24)}d 前`},iE=(_,E=!1)=>{if(_==="previous")return E?"参考":"上期参考";return E?"预测":"满额预测"};var gT=(_)=>!Number.isFinite(_.limit_tokens)||(_.limit_tokens??0)<=0;var gS=(_)=>{if(gT(_))return!1;let E=_.limit_requests>0?_.effective_remaining_requests/_.limit_requests*100:100;return _.effective_remaining_tokens/_.limit_tokens*100<E-0.5};var Yo="http://www.w3.org/2000/svg",yS=["gemini_5h","gemini_weekly","claude_5h","claude_weekly","argon_weekly"],mS=["claude_weekly","claude_5h","argon_weekly","gemini_weekly","gemini_5h"],wS=["gemini_5h","gemini_weekly","claude_5h","claude_weekly","argon_weekly"],oo="pq:panel-ui-prefs:v1",iS=15000,Oo=13000,qS=[{r:239,g:68,b:68},{r:245,g:158,b:11},{r:16,g:185,b:129}],Ho=0,nE=(_,E=!1)=>{let T=M_(_);if(E||T<=0.05)return"empty";if(T>=99.95)return"full";if(T>60)return"healthy";if(T>=25)return"moderate";return"low"},Ao=(_,E)=>{let T=_.toLowerCase(),o=(E??"").toLowerCase();return T==="argon_weekly"||o==="argon"||T.includes("argon")},co=(_)=>{return String(_||"").trim().toLowerCase()==="pro"},Zo=(_)=>{let E=co(_.tier);return(_.windows??[]).filter((T)=>E||!Ao(T.key,T.group))},uS=(_)=>{let E=M_(_.remaining_percent);if(E<99.95)return!0;if(typeof _.estimated_remaining_percent==="number"&&Number.isFinite(_.estimated_remaining_percent)&&E-M_(_.estimated_remaining_percent)>=0.25)return!0;return Boolean(_.has_current_usage&&(_.current_cost>0||_.current_tokens>0||_.current_requests>0))},jo=(_)=>{if(M_(_.effective_percent)<99.95)return!0;if(_.eligible_accounts>0&&_.available_accounts<_.eligible_accounts)return!0;return(_.used_requests??0)>0||(_.used_tokens??0)>0},m_=(_,E)=>{let T=_.toLowerCase(),o=(E??"").toLowerCase();if(T==="gemini_5h")return"var(--pq-series-gemini)";if(T==="gemini_weekly"||o==="gemini")return"var(--pq-series-gemini-2)";if(T==="claude_5h")return"var(--pq-series-claude)";if(T==="claude_weekly"||o==="claude")return"var(--pq-series-claude-2)";if(T.includes("argon")||o==="argon")return"var(--pq-series-argon)";return"var(--pq-full)"},lS=(_)=>{switch(_.key){case"gemini_5h":return"Gemini 5h";case"gemini_weekly":return"Gemini 周";case"claude_5h":return"Claude 5h";case"claude_weekly":return"Claude 周";case"argon_weekly":return"Argon 周";default:return _.label||_.key}},fo=(_)=>{let E=String(_||"").trim().toLowerCase();if(E==="ultra")return"pq-tier-ultra";if(E==="pro")return"pq-tier-pro";return"pq-tier-free"},Jo=(_)=>{switch(String(_||"").toLowerCase()){case"available":case"ready":return"pq-st-ok";case"limited":case"cooldown":return"pq-st-warn";case"exhausted":case"unavailable":case"auth_required":return"pq-st-err";default:return"pq-st-muted"}},Fo=(_)=>{let E=Math.max(0,Math.min(1,_)),T=E<0.5?0:1,o=T===0?E*2:(E-0.5)*2,O=qS[T],f=qS[T+1],k=Math.round(O.r+(f.r-O.r)*o),U=Math.round(O.g+(f.g-O.g)*o),R=Math.round(O.b+(f.b-O.b)*o);return`rgb(${k}, ${U}, ${R})`},j_=(_)=>_>1000000000000?_:_*1000,aS=(_)=>_>1000000000000?_/1000:_,H_=(_)=>String(_).padStart(2,"0"),mT=(_,E)=>{let T=new Date(_);if(E==="md")return`${H_(T.getMonth()+1)}/${H_(T.getDate())}`;return`${H_(T.getHours())}:${H_(T.getMinutes())}`},Bo=(_)=>{let E=new Date(_);return`${H_(E.getMonth()+1)}/${H_(E.getDate())} ${H_(E.getHours())}:${H_(E.getMinutes())}`},go=(_)=>{try{return new URL(_).host}catch{return _}},yo=()=>{if(document.getElementById("pq-styles"))return;let _=document.createElement("style");_.id="pq-styles",_.textContent=`
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

    .pq-pill-mode {
      background: color-mix(in srgb, var(--pq-border) 38%, transparent);
      color: var(--pq-muted);
      border-color: color-mix(in srgb, var(--pq-border) 65%, transparent);
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
  `,document.head.appendChild(_)},c=(_,E,T)=>{let o=document.createElement(_);if(E)o.className=E;if(T!==void 0)o.textContent=T;return o},e=(_,E={})=>{let T=document.createElementNS(Yo,_);for(let[o,O]of Object.entries(E))T.setAttribute(o,String(O));return T},mo=()=>{let _=e("svg",{width:14,height:14,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"});return _.appendChild(e("circle",{cx:12,cy:12,r:3})),_.appendChild(e("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})),_},p_=DT(),kE=document.querySelector("#root"),vS=!1,q_=!1,w_=!1,qE=!1,uE=!1,r=null,V_=!1,G_=!1,cE="http://127.0.0.1:18380",NE="",aE=!1,i_=null,GE=0,ko=new Map,uT=new Map,fE=new Set,yT=new WeakMap,sS=[],W_=[],u_=new Set,wT=null,iT=null,Z_=null,lE=null,bE=null,eS=null,UE=(_)=>ko.get(_)??"5h",lT=(_,E)=>`${_}|${E}`,Uo=(_)=>{for(let E of _)try{E()}catch{}},wo=()=>{for(let _ of u_)try{_()}catch{}};document.addEventListener("pointerdown",(_)=>{if(!_.target?.closest(".pq-chart-box"))wo()});var io=async()=>{try{let _=await p_.storage.get(oo);if(_&&typeof _==="object"&&!Array.isArray(_)){let E=_;if(typeof E.aisFullExpanded==="boolean"&&E.aisFullExpanded!==G_){if(G_=E.aisFullExpanded,r?.snapshot)J_()}}}catch{}},qo=()=>{p_.storage.set(oo,{aisFullExpanded:G_}).catch(()=>{})},uo=()=>({winX:window.scrollX||0,winY:window.scrollY||0,docTop:document.documentElement?.scrollTop||0,bodyTop:document.body?.scrollTop||0,rootTop:kE.scrollTop||0,prevHeight:kE.getBoundingClientRect().height}),lo=(_)=>{let E=()=>{if(_.rootTop>0)kE.scrollTop=_.rootTop;if(_.docTop>0&&document.documentElement)document.documentElement.scrollTop=_.docTop;if(_.bodyTop>0&&document.body)document.body.scrollTop=_.bodyTop;let T=_.winY||_.docTop||_.bodyTop;if(T>0||_.winX>0)window.scrollTo({left:_.winX,top:T,behavior:"instant"})};E(),requestAnimationFrame(()=>{E(),kE.style.minHeight=""})},RE=async(_,E,T={})=>{let o=await p_.serviceRequest({method:_,path:E,...T.query?{query:T.query}:{},...T.body?{body:JSON.stringify(T.body)}:{}}),O=null;try{O=o.body?JSON.parse(o.body):null}catch{O=null}if(o.status<200||o.status>=300){let f=O&&typeof O==="object"&&"error"in O&&typeof O.error==="string"?O.error:`服务返回 HTTP ${o.status}`;throw Error(f)}return O},VE=(_)=>{if(!_||!_.account_id)return;let E=_.window==="7d"?"7d":"5h";uT.set(lT(_.account_id,E),{data:_,fetchedAtMs:Date.now()})},ao=5,vo=(_)=>{let E=[];if(Array.isArray(_.cycle_resets)&&_.cycle_resets.length>0){for(let o of _.cycle_resets)if(typeof o==="number"&&Number.isFinite(o)&&o>0)E.push(j_(o))}else if(Array.isArray(_.resets)&&_.resets.length>=2){let o=Array.isArray(_.points)?_.points:[],O=(f)=>{let k=null;for(let U=0;U<o.length;U+=1){let R=o[U];if(j_(R[0])<f)k=M_(R[1]);else break}return k};for(let f=1;f<_.resets.length;f+=1){let k=_.resets[f-1],U=_.resets[f];if(!Array.isArray(k)||!Array.isArray(U)||k.length<2||U.length<2)continue;let R=aS(k[1]),x=aS(U[1]),X=j_(U[0]);if(!Number.isFinite(X)||X<=0)continue;if(R>0&&x>R+60)E.push(X);else if(R>0&&x===0){let C=O(X);if(C!==null&&C<99.999)E.push(X)}}}if(E.length<=1)return E;E.sort((o,O)=>o-O);let T=[E[0]];for(let o=1;o<E.length;o+=1)if(E[o]>T[T.length-1])T.push(E[o]);return T},so=(_)=>{if(!Array.isArray(_.estimated_point)||_.estimated_point.length<2)return null;let E=_.estimated_point[0],T=_.estimated_point[1];if(typeof E!=="number"||!Number.isFinite(E)||E<=0)return null;if(typeof T!=="number"||!Number.isFinite(T))return null;let o=_.points[_.points.length-1];if(!o)return null;let O=j_(E),f=j_(o[0]);if(O<=f)return null;return{t:O,r:M_(T)}},qT=(_,E,T,o)=>{let O=c("div"),f=co(T.tier),k=(_.series??[]).filter((M)=>{if(!f&&Ao(M.key,M.group))return!1;return Array.isArray(M.points)&&M.points.length>=2});if(k.length===0)return O.appendChild(c("div","pq-chart-empty",`暂无 ${E==="7d"?"7d":"5h"} 历史采样曲线`)),O;let U=[...k].sort((M,$)=>{let J=mS.indexOf(M.key),Z=mS.indexOf($.key);return(J===-1?0:J)-(Z===-1?0:Z)}),R=[...k].sort((M,$)=>{let J=wS.indexOf(M.key),Z=wS.indexOf($.key);return(J===-1?99:J)-(Z===-1?99:Z)}),x=320,X=112,C=30,L=8,W=10,N=18,G=x-C-L,Y=X-W-N,H=W+Y,j=new Map,w=Number.POSITIVE_INFINITY,t=Number.NEGATIVE_INFINITY;for(let M of k){for(let J of M.points){let Z=j_(J[0]);if(Z<w)w=Z;if(Z>t)t=Z}let $=so(M);if($){if(j.set(M.key,$),$.t>t)t=$.t}}let m=Math.max(1,t-w),a=(M)=>C+(M-w)/m*G,r_=(M)=>W+Y*(1-M_(M)/100),S_=c("div","pq-chart-readout"),o_=()=>{S_.classList.remove("is-scrubbing"),S_.replaceChildren();let M=c("div","pq-readout-items");for(let $ of R){let J=M_($.points[$.points.length-1]?.[1]??$.remaining),Z=nE(J),__=c("span","pq-readout-item"),f_=c("span","pq-fam-dot");f_.style.background=m_($.key,$.group),__.appendChild(f_),__.appendChild(c("span","pq-muted",lS($))),__.appendChild(c("strong",`pq-mono pq-lv-${Z}`,d_(J))),M.appendChild(__)}S_.appendChild(M),S_.appendChild(c("span","pq-readout-hint","悬停/滑动"))};o_(),O.appendChild(S_);let b_=c("div","pq-chart-svg-wrap"),Q=e("svg",{viewBox:`0 0 ${x} ${X}`,class:"pq-chart-svg",role:"img","aria-label":`${E} 周期剩余趋势`}),P=e("defs"),V=new Map;for(let M of U){let $=`pq-grad-${++Ho}`;V.set(M.key,$);let J=m_(M.key,M.group),Z=e("linearGradient",{id:$,x1:"0",y1:"0",x2:"0",y2:"1"});Z.appendChild(e("stop",{offset:"0%","stop-color":J,"stop-opacity":"0.26"})),Z.appendChild(e("stop",{offset:"100%","stop-color":J,"stop-opacity":"0.01"})),P.appendChild(Z)}Q.appendChild(P);for(let M of[100,50,25,0]){let $=r_(M),J=M===25,Z=M===0;if(Q.appendChild(e("line",{x1:C,x2:x-L,y1:$.toFixed(1),y2:$.toFixed(1),stroke:J?"var(--pq-low)":"var(--pq-border)","stroke-opacity":J?"0.26":Z?"0.75":"0.45","stroke-dasharray":Z?"":"2.5 3","stroke-width":"1"})),M===100||M===50||M===0){let __=e("text",{x:C-4,y:($+3).toFixed(1),"text-anchor":"end",class:"pq-svg-axis"});__.textContent=`${M}%`,Q.appendChild(__)}}let n_=new Map;for(let M of U){let $=m_(M.key,M.group),J=V.get(M.key),Z=M.points.map((z)=>{let B=j_(z[0]),I_=M_(z[1]);return{t:B,r:I_,x:a(B),y:r_(I_)}}),__=[...Z],f_=j.get(M.key),R_=f_?{t:f_.t,r:f_.r,x:a(f_.t),y:r_(f_.r),estimated:!0}:null;if(R_)__.push(R_);n_.set(M.key,__);let P_=vo(M),$_=0,E_=[],x_=[],c_=[];for(let z=0;z<Z.length;z+=1){let B=Z[z],I_=c_[c_.length-1];if(I_){while($_<P_.length&&P_[$_]<=I_.t)$_+=1;if($_<P_.length&&P_[$_]<=B.t||B.r-I_.r>=ao){c_.push({t:B.t,r:I_.r,x:B.x,y:I_.y}),E_.push(c_),x_.push({x:B.x,yFrom:I_.y,yTo:B.y}),c_=[B];continue}}c_.push(B)}if(c_.length>0)E_.push(c_);for(let z of E_)if(z.length>=2){let B=z.map((Q_,rE)=>`${rE===0?"M":"L"}${Q_.x.toFixed(1)},${Q_.y.toFixed(1)}`).join(" "),I_=z[0],l_=z[z.length-1],a_=`M${I_.x.toFixed(1)},${H.toFixed(1)} ${z.map((Q_)=>`L${Q_.x.toFixed(1)},${Q_.y.toFixed(1)}`).join(" ")} L${l_.x.toFixed(1)},${H.toFixed(1)} Z`;Q.appendChild(e("path",{d:a_,fill:`url(#${J})`,stroke:"none"})),Q.appendChild(e("path",{d:B,fill:"none",stroke:$,"stroke-width":"1.9","stroke-linecap":"round","stroke-linejoin":"round"}))}else if(z.length===1){let B=z[0],I_=B.x+1.5<=x-L?B.x:Math.max(C,B.x-1.5),l_=B.x+1.5<=x-L?B.x+1.5:B.x;Q.appendChild(e("line",{x1:I_.toFixed(1),x2:l_.toFixed(1),y1:B.y.toFixed(1),y2:B.y.toFixed(1),stroke:$,"stroke-width":"1.9","stroke-linecap":"round"}))}for(let z of x_){if(Math.abs(z.yTo-z.yFrom)<1)continue;Q.appendChild(e("line",{x1:z.x.toFixed(1),x2:z.x.toFixed(1),y1:z.yFrom.toFixed(1),y2:z.yTo.toFixed(1),stroke:$,"stroke-opacity":"0.32","stroke-width":"1","stroke-dasharray":"2 2","pointer-events":"none"}))}let k_=Z[Z.length-1];if(k_&&R_)Q.appendChild(e("line",{x1:k_.x.toFixed(1),y1:k_.y.toFixed(1),x2:R_.x.toFixed(1),y2:R_.y.toFixed(1),stroke:$,"stroke-opacity":"0.72","stroke-width":"1.6","stroke-dasharray":"3 2.5","stroke-linecap":"round","pointer-events":"none"})),Q.appendChild(e("circle",{cx:R_.x.toFixed(1),cy:R_.y.toFixed(1),r:"2.2",fill:"var(--pq-surface)",stroke:$,"stroke-opacity":"0.85","stroke-width":"1.4","pointer-events":"none"}));if(k_)Q.appendChild(e("circle",{cx:k_.x.toFixed(1),cy:k_.y.toFixed(1),r:"4.6",fill:$,"fill-opacity":"0.24"})),Q.appendChild(e("circle",{cx:k_.x.toFixed(1),cy:k_.y.toFixed(1),r:"2.5",fill:$,stroke:"var(--pq-surface)","stroke-width":"1.2"}))}let F_=E==="7d"||m>=129600000?"md":"hm",B_=[{x:C,t:w,anchor:"start"},{x:C+G/2,t:w+m/2,anchor:"middle"},{x:x-L,t,anchor:"end"}];for(let M of B_){let $=e("text",{x:M.x.toFixed(1),y:String(X-3),"text-anchor":M.anchor,class:"pq-svg-axis"});$.textContent=mT(M.t,F_),Q.appendChild($)}let z_=e("line",{x1:C,x2:C,y1:W,y2:H,stroke:"var(--pq-fg)","stroke-opacity":"0.42","stroke-width":"1","stroke-dasharray":"2.5 2.5","pointer-events":"none"});z_.style.display="none",Q.appendChild(z_);let U_=new Map;for(let M of U){let $=e("circle",{cx:C,cy:W,r:"3.6",fill:"var(--pq-surface)",stroke:m_(M.key,M.group),"stroke-width":"2","pointer-events":"none"});$.style.display="none",Q.appendChild($),U_.set(M.key,$)}let ME=e("rect",{x:C,y:W,width:G,height:Y,fill:"transparent"});ME.style.cursor="crosshair",Q.appendChild(ME);let O_=!1,t_=!1,F=()=>{if(!O_)return;O_=!1,t_=!1,GE=Math.max(0,GE-1),z_.style.display="none";for(let M of U_.values())M.style.display="none";o_()},pE=(M,$)=>{let J=M[0],Z=Math.abs(J.t-$);for(let __=1;__<M.length;__+=1){let f_=M[__],R_=Math.abs(f_.t-$);if(R_<=Z)J=f_,Z=R_;else if(f_.t>$)break}return J},A_=(M,$)=>{let J=Q.getBoundingClientRect();if(!J.width)return;let Z=Math.max(C,Math.min(x-L,(M-J.left)/J.width*x)),__=w+(Z-C)/G*m;if(!O_)O_=!0,GE+=1;let f_=__,R_=[];for(let E_ of R){let x_=n_.get(E_.key);if(!x_||x_.length===0)continue;let c_=pE(x_,__);f_=c_.t,R_.push({s:E_,r:c_.r,estimated:c_.estimated});let k_=U_.get(E_.key);if(k_)k_.setAttribute("cx",c_.x.toFixed(1)),k_.setAttribute("cy",c_.y.toFixed(1)),k_.style.display=""}let P_=a(f_);z_.setAttribute("x1",P_.toFixed(1)),z_.setAttribute("x2",P_.toFixed(1)),z_.style.display="",S_.classList.add("is-scrubbing"),S_.replaceChildren();let $_=c("div","pq-readout-items");$_.appendChild(c("span","pq-readout-time pq-mono",Bo(f_)));for(let{s:E_,r:x_,estimated:c_}of R_){let k_=nE(x_),z=c("span","pq-readout-item"),B=c("span","pq-fam-dot");B.style.background=m_(E_.key,E_.group),z.appendChild(B),z.appendChild(c("span","pq-muted",lS(E_))),z.appendChild(c("strong",`pq-mono pq-lv-${k_}`,c_?`~${x_.toFixed(1)}%`:d_(x_))),$_.appendChild(z)}if(S_.appendChild($_),$){let E_=c("button","pq-readout-clear","×");E_.type="button",E_.title="关闭读数",E_.addEventListener("click",(x_)=>{x_.stopPropagation(),F()}),S_.appendChild(E_)}};return Q.addEventListener("pointerdown",(M)=>{let $=M.pointerType!=="mouse";if($)t_=!0;A_(M.clientX,$)}),Q.addEventListener("pointermove",(M)=>{let $=M.pointerType!=="mouse";if(!$||t_)A_(M.clientX,$)}),Q.addEventListener("pointerup",()=>{t_=!1}),Q.addEventListener("pointercancel",()=>{t_=!1}),Q.addEventListener("pointerleave",(M)=>{if(M.pointerType==="mouse")F()}),o.add(F),O.__pqClearScrub=F,b_.appendChild(Q),O.appendChild(b_),O},CE=(_,E)=>{let T=yT.get(_);if(T){try{T()}catch{}u_.delete(T),yT.delete(_)}let o=E.__pqClearScrub;if(o)yT.set(_,o);_.replaceChildren(E)},_o=(_,E,T,o=!1)=>{let O=lT(E.id,T),f=uT.get(O),k=Date.now();if(f){if(CE(_,qT(f.data,T,E,u_)),!o&&k-f.fetchedAtMs<Oo)return}else{let U=c("div","pq-chart-loading");U.textContent=`加载 ${T==="7d"?"7d":"5h"} 燃烧趋势…`,CE(_,U)}if(fE.has(O))return;fE.add(O),RE("GET","/panel/history",{query:{account:E.id,window:T,range:T==="7d"?"7d":"24h",...o?{refresh:"1",force:"1"}:{}}}).then((U)=>{if(VE(U),!_.isConnected)return;if(UE(E.id)!==T)return;CE(_,qT(U,T,E,u_))}).catch(()=>{if(!_.isConnected)return;if(UE(E.id)!==T)return;if(!f)CE(_,c("div","pq-chart-empty","历史趋势暂不可用"))}).finally(()=>{fE.delete(O)})},eo=(_,E)=>{if(!_)return null;if(_.has_recent_buckets&&Array.isArray(_.recent_buckets)&&_.recent_buckets.length>0){let T=_.recent_buckets,o=_.recent_window_success||0,O=_.recent_window_failure||0,f=o+O>0,k=_.recent_window_rate,R=`近 ${_.recent_window_minutes||200}m 成功率`,x=c("div","pq-recent-strip"),X=c("div","pq-recent-top"),C=c("span","pq-recent-label pq-num",R);X.appendChild(C);let L=c("div","pq-recent-meta pq-mono");if(f){if(L.appendChild(c("span","pq-recent-ok",`✓${o}`)),O>0)L.appendChild(c("span","pq-recent-fail",`✕${O}`))}let W=!f||k==null?"":k>=95?"is-high":k>=80?"is-med":"is-low",N=f&&k!=null?d_(k):"空闲";L.appendChild(c("span",`pq-rate-capsule ${W}`,N)),X.appendChild(L),x.appendChild(X);let G=c("div","pq-buckets"),Y=600000,H=(E||Date.now())-T.length*Y,j=null;return T.forEach((w,t)=>{let m=w.success||0,a=w.failed||0,r_=m+a,S_=r_===0,o_=c("div",`pq-bucket${S_?"":" is-active"}`);if(!S_)o_.style.background=Fo(m/r_);let b_=w.time||`${mT(H+t*Y,"hm")}-${mT(H+(t+1)*Y,"hm")}`,Q=S_?`${b_} · 无请求`:`${b_} · ✓${m}${a>0?` ✕${a}`:""} (${d_(m/r_*100)})`;o_.title=Q;let P=()=>{if(j&&j!==o_)j.classList.remove("is-focus");j=o_,o_.classList.add("is-focus"),C.textContent=Q};o_.addEventListener("pointerenter",(V)=>{if(V.pointerType==="mouse")P()}),o_.addEventListener("click",(V)=>{if(V.stopPropagation(),j===o_)o_.classList.remove("is-focus"),j=null,C.textContent=R;else P()}),G.appendChild(o_)}),G.addEventListener("pointerleave",(w)=>{if(w.pointerType==="mouse"){if(j)j.classList.remove("is-focus");j=null,C.textContent=R}}),x.appendChild(G),x}if(Array.isArray(_.recent_bars)&&_.recent_bars.length>0){let{recent_bars:T,recent_success_rate:o}=_,O=c("div","pq-recent-strip"),f=c("div","pq-recent-top");f.appendChild(c("span","pq-recent-label pq-num",`近 ${T.length} 次请求`));let k=o==null?"":o>=95?"is-high":o>=80?"is-med":"is-low";f.appendChild(c("span",`pq-rate-capsule pq-mono ${k}`,o!=null?d_(o):"--")),O.appendChild(f);let U=c("div","pq-buckets");for(let R of T){let x=c("div","pq-bucket is-active");x.style.background=R.ok?"var(--pq-healthy-bar)":"var(--pq-low-bar)",U.appendChild(x)}return O.appendChild(U),O}if(_.available&&_.success_rate!=null){let T=c("div","pq-recent-strip"),o=c("div","pq-recent-top");o.appendChild(c("span","pq-recent-label","历史成功率"));let O=_.success_rate,f=O>=95?"is-high":O>=80?"is-med":"is-low";return o.appendChild(c("span",`pq-rate-capsule pq-mono ${f}`,d_(O))),T.appendChild(o),T}return null},_O=(_)=>{let E=M_(_.remaining_percent),T=nE(E),o=c("div",`pq-win-active${T==="empty"?" is-empty":""}`),O=c("div","pq-win-top"),f=c("div","pq-win-name-wrap"),k=c("span","pq-fam-dot");k.style.background=m_(_.key,_.group),f.appendChild(k),f.appendChild(c("span","pq-win-name",_.label||_.key));let U=BS(_.observed_at_ms);if(U){let N=c("span",`pq-sample-age pq-num${_.stale?" is-stale":""}`,U),G=j_(_.observed_at_ms);N.title=`真实采样时间：${new Date(G).toLocaleTimeString()}`,f.appendChild(N)}O.appendChild(f);let R=c("div","pq-win-val-wrap");if(T==="empty")R.appendChild(c("span","pq-pill pq-pill-empty","已耗尽"));R.appendChild(c("span",`pq-win-val pq-lv-${T}`,`剩 ${d_(E)}`)),O.appendChild(R),o.appendChild(O);let x=c("div",`pq-bar-track${T==="empty"?" is-empty":""}`),X=c("div",`pq-bar-fill pq-bar-${T}`);X.style.width=`${E}%`,x.appendChild(X),o.appendChild(x);let C=c("div","pq-win-sub"),L=c("div","pq-win-usage pq-mono");if(_.has_current_usage&&(_.current_cost>0||_.current_tokens>0)){let N=[`已用 ${AE(_.current_cost)}`];if(_.current_tokens>0)N.push($E(_.current_tokens));if(L.appendChild(c("span","",N.join(" / "))),_.has_forecast&&_.forecast_cost>0){let G=iE(_.forecast_basis,!0),Y=c("span","",`· ${G} ${AE(_.forecast_cost)}`);Y.title=`${iE(_.forecast_basis,!1)} ${AE(_.forecast_cost)}`,L.appendChild(Y)}}else if(_.has_forecast&&_.forecast_cost>0){let N=iE(_.forecast_basis,!1);L.appendChild(c("span","",`${N} ${AE(_.forecast_cost)}`))}else L.appendChild(c("span","","本窗暂无费用记录"));if(C.appendChild(L),_.stale)C.appendChild(c("span","pq-win-reset pq-mono","待采样"));else if(_.reset_at_ms>0)C.appendChild(c("span","pq-win-reset pq-mono",`重置 ${wE(_.reset_at_ms)}`));o.appendChild(C);let W=typeof _.estimated_remaining_percent==="number"&&Number.isFinite(_.estimated_remaining_percent)?M_(_.estimated_remaining_percent):null;if(W!==null&&E-W>=0.25){let N=nE(W),G=c("div","pq-win-est"),Y=c("span",`pq-est-badge pq-mono pq-lv-${N}`);Y.appendChild(c("span","pq-est-dot")),Y.appendChild(document.createTextNode(`实时估算 ~${W.toFixed(1)}%`)),G.appendChild(Y);let H=[];if(typeof _.post_sample_cost_usd==="number"&&_.post_sample_cost_usd>0)H.push(`+${AE(_.post_sample_cost_usd)}`);if(typeof _.post_sample_requests==="number"&&_.post_sample_requests>0)H.push(`${Math.round(_.post_sample_requests)}次`);else if(typeof _.post_sample_tokens==="number"&&_.post_sample_tokens>0)H.push(`+${$E(_.post_sample_tokens)}`);if(H.length>0){let j=c("span","pq-est-delta pq-mono",`采样后 ${H.join(" · ")}`);G.appendChild(j)}G.title=`基于采样后实时用量推算（权威采样值仍为 ${d_(E)}）`,o.appendChild(G)}return o},EO=(_)=>{let E=c("div","pq-win-idle-tile"),T=c("div","pq-win-idle-top"),o=c("span","pq-win-idle-name"),O=c("span","pq-fam-dot");O.style.background=m_(_.key,_.group),o.appendChild(O),o.appendChild(c("span","",_.label||_.key)),T.appendChild(o),T.appendChild(c("span","pq-win-idle-pct pq-mono","100%")),E.appendChild(T);let f=c("div","pq-bar-track is-thin"),k=c("div","pq-bar-fill pq-bar-full");k.style.width="100%",f.appendChild(k),E.appendChild(f);let U=!_.stale&&_.reset_at_ms>0?`满血 · ${wE(_.reset_at_ms)}`:"满血未动用";return E.appendChild(c("div","pq-win-idle-sub pq-mono",U)),E},TO=(_,E,T)=>{let o=c("div","pq-acct-block"),O=c("div","pq-acct-head"),f=c("div","pq-acct-id");if(f.appendChild(c("span","pq-acct-name",_.code_name||_.id)),_.tier)f.appendChild(c("span",`pq-pill ${fo(_.tier)}`,_.tier));O.appendChild(f);let k=_.status_label||(_.status==="available"?"可用":_.status||"未知");O.appendChild(c("span",`pq-pill ${Jo(_.status)}`,k)),o.appendChild(O);let U=eo(_.history,E);if(U)o.appendChild(U);let R=Zo(_).sort((C,L)=>{let W=yS.indexOf(C.key),N=yS.indexOf(L.key);return(W===-1?99:W)-(N===-1?99:N)}),x=R.filter(uS),X=R.filter((C)=>!uS(C));if(x.length>0){let C=c("div","pq-win-list");for(let L of x)C.appendChild(_O(L));o.appendChild(C)}if(X.length>0){let C=c("div",`pq-win-idle-grid${X.length===1?" is-single":""}`);for(let L of X)C.appendChild(EO(L));o.appendChild(C)}if(R.length===0)o.appendChild(c("div","pq-muted","暂无配额窗口采样"));if(_.has_history){let C=c("div","pq-chart-box"),L=c("div","pq-chart-head");L.appendChild(c("span","pq-chart-title","周期燃烧趋势"));let W=c("div","pq-chart-tabs"),N=c("div","pq-chart-body");N.dataset.pqChartBody=_.id;let G=UE(_.id),Y=null;Y=jT(W,{items:[{id:"5h",label:"5h"},{id:"7d",label:"7d"}],activeId:G,trackBackground:!0,onChange:(H)=>{if(H!=="5h"&&H!=="7d")return;ko.set(_.id,H),Y?.update({activeId:H}),_o(N,_,H,!1)}}),T.push(()=>Y?.dispose()),L.appendChild(W),C.appendChild(L),C.appendChild(N),o.appendChild(C),_o(N,_,G,!1)}return o},SO=(_,E)=>{let T=c("div","pq-card"),o=_.antigravity,O=c("div","pq-card-head"),f=c("div","pq-card-head-left");if(f.appendChild(c("h4","pq-card-title","Antigravity 号池")),o.online&&o.accounts.length>1&&o.summary?.tier_counts)for(let X of["Ultra","Pro","Free"]){let C=o.summary.tier_counts[X]??0;if(C>0)f.appendChild(c("span",`pq-pill pq-num ${fo(X)}`,`${X}×${C}`))}O.appendChild(f);let k=c("div"),U=o.summary?.active_accounts??o.accounts.length,R=yE(k,{label:o.online?`${U} 号在线`:"离线",tone:o.online?o.status==="degraded"?"warning":"success":"error"});if(E.push(()=>R.dispose()),O.appendChild(k),T.appendChild(O),!o.online||!Array.isArray(o.accounts)||o.accounts.length===0)return T.appendChild(c("div","pq-muted",o.status_message||"暂无活跃 Antigravity 账号数据")),T;let x=c("div","pq-acct-list");for(let X of o.accounts)x.appendChild(TO(X,_.generated_at_ms,E));return T.appendChild(x),T},Eo=(_,E=!1)=>{let T=M_(_.effective_percent),o=_.eligible_accounts>0&&_.available_accounts===0,O=gT(_),f=nE(T,o),k=c("div",`pq-model-row${f==="empty"?" is-empty":""}${E?" is-full-compact":""}`),U=c("div","pq-model-top");U.appendChild(c("span","pq-model-name",_.label||_.id));let R=c("div","pq-model-right");if(o)R.appendChild(c("span","pq-pill pq-pill-empty","已耗尽"));else if(!E&&_.eligible_accounts>0&&(T<99.5||(_.used_requests??0)>0||(_.used_tokens??0)>0))if(O)R.appendChild(c("span","pq-pill pq-pill-mode","按次计额"));else{let N=gS(_);R.appendChild(c("span",`pq-pill ${N?"pq-bottleneck-tok":"pq-bottleneck-req"}`,N?"Token 短板":"次数短板"))}R.appendChild(c("span",`pq-win-val pq-lv-${f}`,d_(T))),U.appendChild(R),k.appendChild(U);let x=c("div",`pq-bar-track${E?" is-thin":""}${f==="empty"?" is-empty":""}`),X=c("div",`pq-bar-fill pq-bar-${f}`);X.style.width=`${T}%`,x.appendChild(X),k.appendChild(x);let C=c("div","pq-win-sub"),L=_.cooling_accounts>0?`可用 ${_.available_accounts}/${_.eligible_accounts} 号 · ${_.cooling_accounts} 冷却`:`可用 ${_.available_accounts}/${_.eligible_accounts} 号`;C.appendChild(c("span","pq-mono",L));let W=O?(_.used_tokens??0)>0?`剩 ${_.effective_remaining_requests}次 · 已耗 ${$E(_.used_tokens)} tok`:`剩 ${_.effective_remaining_requests}次`:`剩 ${_.effective_remaining_requests}次 / ${$E(_.effective_remaining_tokens)}`;return C.appendChild(c("span","pq-mono",W)),k.appendChild(C),k},oO=(_,E)=>{let T=c("div","pq-card"),o=_.aistudio,O=c("div","pq-card-head");O.appendChild(c("h4","pq-card-title","AIStudio2API 号池"));let f=c("div"),k=o.account_counts?.ready??0,U=o.account_counts?.enabled??0,R=yE(f,{label:o.online?`${k}/${U} 号就绪`:"离线",tone:o.online?k===U?"success":"warning":"error"});if(E.push(()=>R.dispose()),O.appendChild(f),T.appendChild(O),!o.online)return T.appendChild(c("div","pq-muted",o.status_message||"AIStudio2API 当前离线")),T;let x=c("div","pq-ais-meta pq-mono"),X=o.playground;if(x.appendChild(c("span","",`Playground ${X?.requests??0}次`)),o.next_reset_ms>0)x.appendChild(c("span","",`16:00 重置 · ${wE(o.next_reset_ms)}`));T.appendChild(x);let C=Array.isArray(o.models)?o.models:[];if(C.length===0)return T.appendChild(c("div","pq-muted","暂无模型配额数据")),T;let L=[],W=[];for(let N of C)if(jo(N))L.push(N);else W.push(N);if(L.sort((N,G)=>{let Y=N.eligible_accounts>0&&N.available_accounts===0?0:1,H=G.eligible_accounts>0&&G.available_accounts===0?0:1;if(Y!==H)return Y-H;return M_(N.effective_percent)-M_(G.effective_percent)}),L.length>0){let N=c("div","pq-model-list");for(let G of L)N.appendChild(Eo(G,!1));T.appendChild(N)}if(W.length>0){let N=c("div","pq-full-group"),G=c("button","pq-full-toggle");G.type="button";let Y=c("span","pq-full-toggle-left"),H=c("span","pq-fam-dot");H.style.background="var(--pq-full-bar)",Y.appendChild(H);let j=c("span","pq-full-toggle-text"),w=(a)=>L.length>0?`其余 ${W.length} 个模型 100% 满血 · ${a?"点击收起":"点击展开"}`:`全部 ${W.length} 个模型 100% 满血 · ${a?"点击收起":"点击展开"}`;j.textContent=w(G_),Y.appendChild(j);let t=c("span",`pq-chevron${G_?" is-open":""}`,"▾");G.appendChild(Y),G.appendChild(t),G.setAttribute("aria-expanded",String(G_));let m=c("div","pq-full-list");m.hidden=!G_;for(let a of W)m.appendChild(Eo(a,!0));G.addEventListener("click",()=>{G_=!G_,qo(),m.hidden=!G_,j.textContent=w(G_),t.classList.toggle("is-open",G_),G.setAttribute("aria-expanded",String(G_))}),N.appendChild(G),N.appendChild(m),T.appendChild(N)}return T},Io=()=>{if(!iT)return;iT.setAttribute("aria-expanded",String(V_))},XE=(_)=>{Uo(W_),W_=[],lE=null,bE=null;let E=r?.config.hasPasscode===!0,T=r?.config.showAis??!0,o=r?.config.compactQuota??!0,O=r?.config.url??cE,f=document.createDocumentFragment(),k=c("button","pq-settings-toggle");k.type="button",k.setAttribute("aria-expanded",String(V_)),k.appendChild(c("span","pq-card-title","连接与显示设置"));let U=c("span",`pq-chevron${V_?" is-open":""}`,"▾");if(k.appendChild(U),k.addEventListener("click",()=>{V_=!V_,Io(),XE(_)}),f.appendChild(k),!V_){let t=[T?"AIS 显示":"AIS 隐藏",o?"紧凑文案":"详细文案",go(O),E?"已设口令":"无口令"];f.appendChild(c("div","pq-settings-summary pq-mono",t.join(" · "))),_.replaceChildren(f);return}let R=c("div","pq-settings-body"),x=c("div","pq-settings-group");x.appendChild(c("div","pq-settings-section-label","显示偏好"));let X=c("div");lE=gE(X,{label:"显示 AIStudio 号池",description:"同时控制顶栏/Usage 总卡、Work Status 与本面板是否展示 AIS 模型余量",checked:T,disabled:qE,onChange:(t)=>void AO(t)}),W_.push(()=>lE?.dispose()),x.appendChild(X);let C=c("div");bE=gE(C,{label:"紧凑配额文案（适配手机端）",description:"精简手机端浮层与 Usage 总卡文案避免窄屏叠字；本面板始终展示完整数据",checked:o,disabled:uE,onChange:(t)=>void cO(t)}),W_.push(()=>bE?.dispose()),x.appendChild(C),R.appendChild(x);let L=c("div","pq-settings-group");L.appendChild(c("div","pq-settings-section-label","看板连接"));let W=c("div"),N=BE(W,{label:"看板地址 URL",value:cE,placeholder:"http://127.0.0.1:18380 或 https://your-board.example.com",mono:!0,onChange:(t)=>{cE=t,aE=!0,N.update({value:t})}});W_.push(()=>N.dispose()),L.appendChild(W);let G=c("div"),Y=BE(G,{label:"访问口令 (X-View-Passcode)",value:NE,password:!0,placeholder:E?"已保存口令（留空保存将保持原口令不变）":"若看板未设口令可留空",helper:"仅写入本机 0600 配置文件，不会回显给前端或暴露给对话上下文。",onChange:(t)=>{NE=t,Y.update({value:t})}});if(W_.push(()=>Y.dispose()),L.appendChild(G),i_){let t=c("div"),m=mE(t,{tone:i_.tone,title:i_.text});W_.push(()=>m.dispose()),L.appendChild(t)}let H=c("div","pq-settings-actions"),j=c("div"),w=L_(j,{label:w_?"测试中...":"测试并保存",size:"sm",loading:w_,disabled:w_,onClick:()=>void To(!1)});if(W_.push(()=>w.dispose()),H.appendChild(j),E){let t=c("div"),m=L_(t,{label:"清空口令",variant:"outline",size:"sm",disabled:w_,onClick:()=>void To(!0)});W_.push(()=>m.dispose()),H.appendChild(t)}L.appendChild(H),R.appendChild(L),f.appendChild(R),_.replaceChildren(f)},OO=(_,E)=>{let T=_.antigravity?.accounts??[];for(let o=1;o<T.length;o+=1){let O=T[o];if(!O.has_history)continue;let f=UE(O.id),k=lT(O.id,f),U=uT.get(k);if(!E&&U&&Date.now()-U.fetchedAtMs<Oo)continue;if(fE.has(k))continue;fE.add(k),RE("GET","/panel/history",{query:{account:O.id,window:f,range:f==="7d"?"7d":"24h",...E?{refresh:"1",force:"1"}:{}}}).then((R)=>{VE(R);let x=document.querySelector(`[data-pq-chart-body="${CSS.escape(O.id)}"]`);if(x&&UE(O.id)===f)CE(x,qT(R,f,O,u_))}).catch(()=>{}).finally(()=>{fE.delete(k)})}},IE=async(_=!1,E=!1)=>{if(q_)return;if(q_=!0,!r)J_();else if(!E)wT?.update({loading:!0});let T=r?.snapshot?.antigravity?.accounts?.[0]?.id,o=T?UE(T):"5h";try{let O=await RE("GET","/panel/state",{query:{..._?{refresh:"1",force:"1"}:{},window:o,range:o==="7d"?"7d":"24h"}});if(r=O,VE(O.history),!aE)cE=O.config.url;if(O.errorCode==="unauthorized"||O.errorCode==="unreachable")V_=!0;if(J_(),O.snapshot)OO(O.snapshot,_)}catch(O){let f=O instanceof p&&O.code==="NO_SERVICE"?"请先在 Settings → Extensions 中批准本扩展的本地服务权限。":O instanceof Error?O.message:String(O);r={config:r?.config??{url:cE,hasPasscode:!1,showAis:!0,compactQuota:!0},snapshot:r?.snapshot??null,history:r?.history??null,error:f,errorCode:"unreachable",fetchedAtMs:Date.now()},V_=!0,J_()}finally{q_=!1,wT?.update({loading:!1})}},AO=async(_)=>{if(qE)return;qE=!0;let E=r?.config.showAis??!0;if(lE?.update({checked:_,disabled:!0}),r)r={...r,config:{...r.config,showAis:_}},J_();try{let T=await RE("POST","/panel/config",{body:{showAis:_}});r=T,VE(T.history),p_.toast({kind:"success",message:_?"已开启 AIStudio 号池显示（Usage 与顶栏刷新后同步）":"已隐藏 AIStudio 号池（Usage 与顶栏刷新后同步）"})}catch(T){if(r)r={...r,config:{...r.config,showAis:E}};p_.toast({kind:"error",message:T instanceof Error?T.message:"切换失败"})}finally{qE=!1,J_()}},cO=async(_)=>{if(uE)return;uE=!0;let E=r?.config.compactQuota??!0;if(bE?.update({checked:_,disabled:!0}),r)r={...r,config:{...r.config,compactQuota:_}};try{let T=await RE("POST","/panel/config",{body:{compactQuota:_}});r=T,VE(T.history),p_.toast({kind:"success",message:_?"已开启紧凑配额文案（适配手机端，Usage 刷新后同步）":"已切换为详细配额文案（Usage 刷新后同步）"})}catch(T){if(r)r={...r,config:{...r.config,compactQuota:E}};p_.toast({kind:"error",message:T instanceof Error?T.message:"切换失败"})}finally{uE=!1,bE?.update({checked:r?.config.compactQuota??E,disabled:!1})}},To=async(_=!1)=>{if(w_=!0,i_={tone:"info",text:"正在测试连接..."},Z_)XE(Z_);try{let E=await RE("POST","/panel/test",{body:{url:cE.trim()||"http://127.0.0.1:18380",...NE?{passcode:NE}:{},..._?{clearPasscode:!0}:{},showAis:r?.config.showAis??!0,compactQuota:r?.config.compactQuota??!0,save:!0}});if(!E.ok){i_={tone:"error",text:E.message||"连接测试失败"},p_.toast({kind:"error",message:E.message||"连接测试失败"});return}NE="",aE=!1,i_={tone:"success",text:E.summary||"连接成功并已保存"},p_.toast({kind:"success",message:E.summary||"配置已保存"}),await IE(!0,!1)}catch(E){let T=E instanceof Error?E.message:String(E);i_={tone:"error",text:T},p_.toast({kind:"error",message:T})}finally{if(w_=!1,Z_)XE(Z_);else J_()}},J_=()=>{let _=uo();if(_.prevHeight>0)kE.style.minHeight=`${Math.ceil(_.prevHeight)}px`;let E=[],T=new Set,o=u_;u_=T,GE=0;let O=c("div","pq-wrap"),f=r?.config.showAis??!0,k=c("div","pq-header"),U=c("div","pq-brand");if(U.appendChild(c("h3","pq-title","Pool Quota")),q_&&!r){let N=c("div"),G=BT(N,{size:"sm"});E.push(()=>G.dispose()),U.appendChild(N)}else if(r?.snapshot){let N=c("div","pq-pool-dots"),G=r.snapshot.antigravity,Y=r.snapshot.aistudio,H=!G.online?"is-err":G.status==="degraded"?"is-warn":"is-ok",j=c("span",`pq-dot-chip ${H}`);if(j.appendChild(c("span","pq-dot")),j.appendChild(document.createTextNode("AG")),N.appendChild(j),f){let w=Y.account_counts?.ready??0,t=Y.account_counts?.enabled??0,m=!Y.online?"is-err":w<t?"is-warn":"is-ok",a=c("span",`pq-dot-chip ${m}`);a.appendChild(c("span","pq-dot")),a.appendChild(document.createTextNode("AIS")),N.appendChild(a)}U.appendChild(N)}k.appendChild(U);let R=c("div","pq-actions"),x=c("div"),X=L_(x,{label:"刷新",variant:"outline",size:"xs",loading:q_,onClick:()=>void IE(!0,!1)});if(E.push(()=>X.dispose()),R.appendChild(x),r?.config.url){let N=c("div"),G=L_(N,{label:"看板",variant:"ghost",size:"xs",onClick:()=>{if(r?.config.url)p_.openUrl(r.config.url)}});E.push(()=>G.dispose()),R.appendChild(N)}let C=c("button","pq-icon-btn");if(C.type="button",C.title="连接与显示设置",C.setAttribute("aria-label","连接与显示设置"),C.setAttribute("aria-expanded",String(V_)),C.appendChild(mo()),C.addEventListener("click",()=>{if(V_=!V_,Io(),Z_){if(XE(Z_),V_)requestAnimationFrame(()=>{Z_?.scrollIntoView({behavior:"smooth",block:"nearest"})})}}),R.appendChild(C),k.appendChild(R),O.appendChild(k),r?.error){let N=c("div"),G=mE(N,{tone:r.errorCode==="unauthorized"?"warning":"error",title:r.errorCode==="unauthorized"?"需要访问口令":"看板连接异常",body:r.error});E.push(()=>G.dispose()),O.appendChild(N)}if(r?.snapshot){if(O.appendChild(SO(r.snapshot,E)),f)O.appendChild(oO(r.snapshot,E))}else if(!q_&&!r?.error){let N=c("div"),G=FT(N,{title:"尚未读取到号池数据",body:"请在下方「连接与显示设置」中填写看板地址与访问口令后点击测试并保存。",action:{label:"重试",onClick:()=>void IE(!0,!1)}});E.push(()=>G.dispose()),O.appendChild(N)}let L=c("div","pq-card");if(O.appendChild(L),r?.fetchedAtMs){let N=new Date(r.fetchedAtMs).toLocaleTimeString(),G=c("div","pq-footer-note pq-mono");G.appendChild(c("span","",`更新于 ${N}`)),G.appendChild(c("span","","Settings → Usage 可置顶总卡")),O.appendChild(G)}let W=sS;sS=E,wT=X,iT=C,Z_=L,Uo(W),o.clear(),XE(L),kE.replaceChildren(O),lo(_)},So=()=>{if(document.visibilityState!=="visible")return!1;if(q_||w_||aE||GE>0)return!1;let _=document.activeElement?.tagName;if(_==="INPUT"||_==="TEXTAREA")return!1;return!0},fO=()=>{if(eS!==null)return;eS=window.setInterval(()=>{if(!So())return;IE(!1,!0)},iS),document.addEventListener("visibilitychange",()=>{if(!So())return;if(Date.now()-(r?.fetchedAtMs??0)>=iS)IE(!1,!0)})};yo();p_.onReady((_)=>{if(dT(_,document.documentElement),vS)return;vS=!0,J_(),io(),IE(!1,!1),fO()});})();
