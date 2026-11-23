(()=>{var h="openchamber.sdk",z=1;var yE=`
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
`;function wE(_){let E=_.documentElement;if(E.hasAttribute("data-oc-scrollbar-activity"))return;E.setAttribute("data-oc-scrollbar-activity","");let T=new WeakMap;_.addEventListener("scroll",(S)=>{let O=S.target===_?E:S.target;if(!(O instanceof Element))return;if(!O.hasAttribute("data-oc-scrolling"))O.setAttribute("data-oc-scrolling","");let f=T.get(O);if(f!==void 0)clearTimeout(f);T.set(O,setTimeout(()=>{T.delete(O),O.removeAttribute("data-oc-scrolling")},1000))},{capture:!0,passive:!0})}var fS=`(${wE.toString()})(document);`;var qE=128,uE=65536;var rE=128;var NE=65536;var aE=8000,lE=192000,sE=120000;var qT=(_)=>{let E=[],T=0,S=0;return{push:(O)=>{E.push(O),S+=O.length;while(S-T>_&&E.length>1){let f=E.shift();S-=f?.length??0,T=0}},pull:(O)=>{let f=0;while(f<O.length&&E.length>0){let k=E[0],U=Math.min(O.length-f,k.length-T);if(O.set(k.subarray(T,T+U),f),f+=U,T+=U,T>=k.length)E.shift(),S-=k.length,T=0}O.fill(0,f)},clear:()=>{E.length=0,T=0,S=0},get size(){return S-T}}};var sT=/^[a-z][a-z0-9-]{0,39}$/;var uT=(_)=>Object(_)===_&&!Array.isArray(_),vE=(_,E)=>Object.keys(_).every((T)=>E.includes(T)),aT=(_)=>String(_)===_&&_.length>=1&&_.length<=60,lT=(_)=>String(_)===_&&_.length>=1&&_.length<=80,vT=(_)=>{if(!Array.isArray(_)||_.length>4)return!1;let E=new Set;for(let T of _){if(!uT(T)||!sT.test(T.id)||!aT(T.label))return!1;if(T.disabled!==void 0&&T.disabled!==!0&&T.disabled!==!1)return!1;if(E.has(T.id))return!1;if(E.add(T.id),T.kind==="button"){if(!vE(T,["kind","id","label","disabled"]))return!1;continue}if(T.kind!=="select"||!vE(T,["kind","id","label","value","options","disabled"]))return!1;if(!lT(T.value)||!Array.isArray(T.options)||T.options.length<1||T.options.length>16)return!1;let S=new Set;for(let O of T.options){if(!uT(O)||!vE(O,["value","label"])||!lT(O.value)||!aT(O.label)||S.has(O.value))return!1;S.add(O.value)}if(!S.has(T.value))return!1}return!0};var eT=["{id}","{segment}","{segments+}"];var xO=new Set(eT);var _o=["turn-finished","turn-failed","permission-asked","question-asked","turn-started","session-created","session-archived","session-deleted"];var $O=new Set(_o);var GE=20000000,pE=256;var eE=(_)=>("bytes"in _)?_.bytes.byteLength:_.content.length,Eo=(_,E)=>{if(_.path!==E.path||_.readOnly!==E.readOnly)return!1;if(_.encoding==="text"||E.encoding==="text")return _.encoding==="text"&&E.encoding==="text"&&_.content===E.content;if(_.bytes.byteLength!==E.bytes.byteLength)return!1;for(let T=0;T<_.bytes.byteLength;T+=1)if(_.bytes[T]!==E.bytes[T])return!1;return!0};var To=/^[A-Za-z0-9_-]{1,80}$/;var oo=["left","right","top","bottom"];var So=(_,E=0,T={remaining:16000})=>{if(--T.remaining<0||E>=32)return!1;if(_===null)return!0;let S=Array.isArray(_)?_:Object(_)===_?Object.values(_):[];for(let O of S)if(!So(O,E+1,T))return!1;return!0},_T=(_)=>{if(_===null||_===!0||_===!1)return!0;if(Array.isArray(_))return Object.keys(_).every((E)=>/^(0|[1-9]\d*)$/.test(E)&&Number(E)<_.length)&&_.every(_T);if(Object(_)===_){let E=Object.getPrototypeOf(_);return(E===null||E===Object.prototype)&&Object.values(_).every(_T)}return String(_)===_||Number.isFinite(_)},ET=(_)=>{try{if(String(_.id)!==_.id||!To.test(_.id)||!Number.isFinite(_.anchor.x)||Math.abs(_.anchor.x)>1e5||!Number.isFinite(_.anchor.y)||Math.abs(_.anchor.y)>1e5||!Number.isFinite(_.anchor.width)||!Number.isFinite(_.anchor.height)||_.anchor.width<=0||_.anchor.height<=0||_.anchor.width>1e5||_.anchor.height>1e5||!Number.isInteger(_.width)||_.width<160||_.width>640||!Number.isInteger(_.height)||_.height<48||_.height>480||_.side!==void 0&&!oo.includes(_.side)||_.focus!==void 0&&_.focus!==!0&&_.focus!==!1||!So(_.data)||!_T(_.data))return!1;return JSON.stringify(_.data).length<=16000}catch{return!1}};var Oo=/^[0-9a-f]{7,64}$/i,Ao=(_)=>Oo.test(_),TT=255,co=(_,E,T)=>({openCommit:(S)=>Ao(S)?_({channel:h,v:z,type:"open-commit",id:E(),payload:{sha:S}}):T("Commit id must be 7 to 64 hex characters."),openWalkthrough:({base:S})=>{let O=S.trim();if(!O||O.length>TT)return T(`Base must contain 1 to ${TT} characters.`);return _({channel:h,v:z,type:"open-walkthrough",id:E(),payload:{base:O}})}});var ST=2000;var ko=["file","directory","other","missing"],OT=(_)=>Boolean(_&&"sessionId"in _),AT=(_)=>Boolean(_&&"sent"in _&&!("sessionId"in _));var XE=500,VE=32000,Uo=16000,Io=128,Ro=200,Mo=2000,xo=16000,no=80,$o=200,Co=16000;var bo=2000;var cT=20000,dE=1024,tE=2000000;var LE=64000,PE=8000,fT=4000;var kT=960000;var ro=999,No=1e4,kE=500,Go=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],po=["stopped","starting","ready","failed"],US=new Set(Go),Xo=(_)=>US.has(_),Vo=(_)=>_&&Xo(_)?_:"HOST_REJECTED",u_=(_)=>{if(_===void 0)return!1;if(_===null||_===!0||_===!1)return!0;if(String(_)===_)return!0;if(Number(_)===_)return Number.isFinite(_);if(Array.isArray(_))return _.every(u_);if(Object(_)===_)return Object.values(_).every(u_);return!1},to=(_)=>u_(_)&&JSON.stringify(_).length<=Co,fo=(_)=>_?.trim().slice(0,$o)??"",a_=(_)=>{let E=_.id.trim().slice(0,Io),T=_.title.trim().slice(0,Ro),S=_.url.trim().slice(0,Mo),O=_.text?.trim().slice(0,xo),f=_.author?.trim().slice(0,no),k=_.kind==="pull"?"pull":"issue",U={providerId:_.providerId.trim(),id:E,title:T||E,url:S,kind:k};if(O)U.text=O;if(f)U.author=f;if(k==="pull"){let R=fo(_.branches?.head),M=fo(_.branches?.base);if(R&&M)U.branches={head:R,base:M}}if(to(_.data))U.data=_.data;return U},UT=(_)=>{let E=a_(_);if(_.projectId)E.projectId=_.projectId;if(_.navigation)E.navigation=_.navigation;if(_.worktree)E.worktree=_.worktree;return E},IT=(_)=>{let E={text:_.text.trim().slice(0,Uo)};if(_.send)E.send=!0;return E},RT=(_)=>{if(_===null||!Number.isFinite(_))return null;return Math.min(ro,Math.max(0,Math.round(_)))},MT=(_)=>{if(!Number.isFinite(_))return 0;return Math.min(No,Math.max(0,Math.ceil(_)))};var l_=(_)=>_.length>0&&_.length<=dE&&!_.includes("\x00")&&!_.includes("\\");var DE=(_)=>{if(!_.startsWith("/")||_.includes("\x00")||_.includes("\\")||_.includes("://"))return!1;if(_.length>bo)return!1;return!_.split("/").some((T)=>T==="."||T==="..")},IS=new Set(po),xT=(_)=>Boolean(_&&"status"in _&&IS.has(String(_.status))&&!("body"in _)),hE=(_)=>Boolean(_&&"status"in _&&"body"in _&&Number.isInteger(_.status)),nT=(_)=>Boolean(_&&"content"in _&&String(_.content)===_.content),$T=(_)=>Boolean(_&&"written"in _&&_.written===!0),CT=(_)=>Boolean(_&&"entries"in _&&Array.isArray(_.entries)),RS=new Set(ko),bT=(_)=>Boolean(_&&"kind"in _&&"size"in _&&RS.has(String(_.kind))&&Number.isFinite(_.size)),rT=(_)=>Boolean(_&&"text"in _&&String(_.text)===_.text&&!("status"in _)),MS=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","service-event","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late","microphone-audio","microphone-ended"]),xS=(_)=>Object(_)===_?_:null,oT=(_)=>String(_)===_&&_.length>0,nS=(_)=>{if(!oT(_.id))return null;if(_.ok===!0){let E={channel:h,v:z,type:"result",id:_.id,ok:!0};if(Object(_.payload)===_.payload)E.payload=_.payload;return E}if(_.ok===!1&&oT(_.error))return{channel:h,v:z,type:"result",id:_.id,ok:!1,error:_.error,code:Vo(oT(_.code)?_.code:void 0)};return null},NT=(_)=>{let E=xS(_);if(!E||E.channel!==h||E.v!==z)return null;if(E.type==="result")return nS(E);if(!MS.has(String(E.type))||Object(E.payload)!==E.payload)return null;return E};var Lo=(_)=>("key"in _)&&("metaKey"in _)&&("ctrlKey"in _),$S=(_)=>(_.metaKey||_.ctrlKey)&&!_.altKey&&!_.shiftKey&&_.key.toLowerCase()==="s";class G extends Error{code;constructor(_,E){super(E);this.name="HostRequestError",this.code=_}}var Po=()=>Promise.reject(new G("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),zE=()=>Promise.reject(new G("BAD_PATH",`File path must be 1 to ${dE} characters without NUL or backslash.`)),KE=(_)=>{if(_===void 0)return;if(Object(_)!==_||Array.isArray(_)||_.scope!==void 0&&_.scope!=="instance"&&_.scope!=="device")throw new G("HOST_REJECTED",'Storage scope must be "instance" or "device".');return _.scope==="device"?"device":void 0},P=(_)=>{return _.value+=1,`oc-${_.value}`},GT=(_={})=>{let E=_.target??("window"in globalThis?window:null);if(!E)throw new G("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let T=_.acceptSource??((o)=>o===E.parent),S=_.requestTimeoutMs??cT,O=new Set,f=new Set,k=new Set,U=new Set,R=new Set,M=new Set,C=new Set,n=new Set,L=new Set,Y=new Set,X=new Set,t=new Set,j=[],F=null,Q=null,s=new Set,W=new Set,y=null,E_=null,c_=!1,R_=new Map,o_=new Map,Z=new Map,f_=!1,d={value:0},N=null,G_=null,H_=!1,C_=!1,w_=null,k_=null,F_=(o)=>{if(!o)return null;return{sessionId:o.id,phase:o.busy?"started":"completed"}},S_=(o)=>{E.parent.postMessage(o,"*")},Z_=()=>{if(f_||E.parent===E||t.size===0||N?.features?.lateGenerateResults!==!0)return;S_({channel:h,v:z,type:"generate-late-listen"})},B=(o,A)=>{for(let r of o)try{r(A)}catch(b){console.error(b)}},cE=(o)=>{if(!(o instanceof MessageEvent))return;if(!T(o.source))return;let A=NT(o.data);if(!A)return;if(A.type==="workspace"){let b=o_.get(A.payload.subscriptionId);if(b)B([b],A.payload.snapshot);return}if(A.type==="shells"){let b=Z.get(A.payload.subscriptionId);if(b)B([b],A.payload.snapshot);return}if(A.type==="microphone-audio"){k_?.queue.push(A.payload.samples);return}if(A.type==="microphone-ended"){let b=k_;if(!b)return;k_=null,b.release(),B(b.endedListeners,A.payload.reason);return}if(A.type==="ready"){if(N=A.payload,G_=F_(A.payload.session),B(O,A.payload),B(f,A.payload.directory),B(k,A.payload.session),G_)B(U,G_);if(B(R,A.payload.connection),B(M,A.payload.settings),B(C,A.payload.item),A.payload.block)B(n,A.payload.block);Z_();return}if(A.type==="service-event"){B(L,A.payload);return}if(A.type==="generate-late"){if(t.size===0)j.push(A.payload);else B(t,A.payload);return}if(A.type==="directory"){if(N)N={...N,directory:A.payload.directory};B(f,A.payload.directory);return}if(A.type==="session"){if(N)N={...N,session:A.payload.session};if(!A.payload.session)G_=null;else if(G_?.sessionId!==A.payload.session.id)G_=F_(A.payload.session);B(k,A.payload.session);return}if(A.type==="session-lifecycle"){G_=A.payload,B(U,A.payload);return}if(A.type==="connection"){if(N)N={...N,connection:A.payload.connection};B(R,A.payload.connection);return}if(A.type==="settings"){if(N)N={...N,settings:A.payload.settings};B(M,A.payload.settings);return}if(A.type==="item"){if(N)N={...N,item:A.payload.item};B(C,A.payload.item);return}if(A.type==="status-control-event"){B(Y,A.payload);return}if(A.type==="popover-closed"){B(X,A.payload);return}if(A.type==="action"){let b=(i)=>{if(!f_)S_({channel:h,v:z,type:"action-result",id:A.id,payload:i})},g=Q;if(!g){b({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>g(A.payload)).then(()=>b({ok:!0}),(i)=>{let w=(i instanceof Error?i.message:String(i)).trim();b({ok:!1,error:(w||"Action failed.").slice(0,kE)})});return}if(A.type==="file-open"){let b=A.payload;if(E_&&Eo(E_,b))return;E_=b,B(s,A.payload);return}if(A.type==="file-saved"){B(W,A.payload.version);return}if(A.type==="file-snapshot"){let b=(w)=>{if(!f_)S_({channel:h,v:z,type:"file-snapshot-result",id:A.id,payload:w})},g=(w)=>b({error:(w.trim()||"Could not read the edited file.").slice(0,kE)}),i=y;if(!i){g("This extension does not edit files.");return}Promise.resolve().then(()=>i(A.payload.purpose)).then((w)=>{if(eE(w)>GE){g(`The file is over ${GE} ${"bytes"in w?"bytes":"characters"}.`);return}if(w.version.length>pE){g(`The snapshot version is over ${pE} characters.`);return}b({snapshot:"bytes"in w?{bytes:w.bytes,version:w.version}:{content:w.content,version:w.version}})},(w)=>g(w instanceof Error?w.message:String(w)));return}if(A.type==="resolve"){let b=(i)=>{S_({channel:h,v:z,type:"resolve-result",id:A.id,payload:i})},g=F;if(!g){b({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>g(A.payload)).then((i)=>b({item:i?a_(i):null}),(i)=>{let w=(i instanceof Error?i.message:String(i)).trim();b({error:(w||"Command failed.").slice(0,kE)})});return}let r=R_.get(A.id);if(!r)return;if(clearTimeout(r.timer),R_.delete(A.id),A.ok){r.resolve(A.payload);return}r.reject(new G(A.code,A.error))};E.addEventListener("message",cE),S_({channel:h,v:z,type:"hello"});let x=(o,A=S)=>{if(f_||E.parent===E)return Promise.reject(new G("HOST_UNAVAILABLE","No host frame. This page is not in an iframe."));return new Promise((r,b)=>{let g=setTimeout(()=>{R_.delete(o.id),b(new G("HOST_TIMEOUT","Host did not answer in time."))},A);R_.set(o.id,{resolve:r,reject:b,timer:g}),S_(o)})},$=(o)=>x(o).then(()=>{return}),V={channel:h,v:z},J=(o)=>{if(!f_&&E.parent!==E)S_(o)},v=()=>J({...V,type:"file-save"}),O_=()=>{if(!f_&&E.parent!==E)S_({...V,type:"microphone-close",id:P(d)})},p_=async()=>{if(k_)throw new G("HOST_REJECTED","The microphone is already open in this frame.");if(N?.features?.microphone!==!0)throw new G("UNSUPPORTED","This OpenChamber cannot share the microphone with extensions.");let o=globalThis.AudioContext;if(typeof o!=="function")throw new G("UNSUPPORTED","This frame has no Web Audio.");let A=new o;if(A.sampleRate<aE||A.sampleRate>lE)throw A.close().catch(()=>{return}),new G("UNSUPPORTED",`Audio at ${A.sampleRate} Hz is not supported.`);let r=A.state==="suspended"?A.resume().catch(()=>{return}):void 0,b=qT(Math.round(A.sampleRate/4)),g=A.createScriptProcessor(1024,1,1);g.onaudioprocess=(b_)=>b.pull(b_.outputBuffer.getChannelData(0));let i=A.createMediaStreamDestination();g.connect(i);let w=new Set,q_={queue:b,endedListeners:w,release:()=>{g.onaudioprocess=null,g.disconnect(),b.clear();for(let b_ of i.stream.getTracks())b_.stop();A.close().catch(()=>{return})}};k_=q_;try{let b_=await x({...V,type:"microphone-open",id:P(d),payload:{sampleRate:A.sampleRate}},sE);if(!b_||!("opened"in b_)||b_.opened!==!0)throw new G("HOST_REJECTED","Host did not open the microphone.");if(await r,k_!==q_)throw new G("DISCONNECTED","The microphone closed while it was opening.")}catch(b_){if(k_===q_)k_=null;throw q_.release(),O_(),b_}return{stream:i.stream,close:()=>{if(k_!==q_)return;k_=null,q_.release(),O_()},onEnded:(b_)=>{return w.add(b_),()=>{w.delete(b_)}}}},z_=(o)=>{if(!Lo(o)||!$S(o))return;o.preventDefault(),v()},U_=(o)=>{if(!Lo(o)||o.key!=="Escape"||N?.surface!=="popover"||!N.popover)return;o.preventDefault(),yT(N.popover.id,"escape").catch(()=>{return})},u=()=>{let o=N?.surface==="popover"?N.popover:void 0;if(!o)return;let A=H_||C_;if(w_===A)return;w_=A,wT(o.id,A).catch(()=>{return})},K=()=>{if(N?.surface!=="popover"||H_)return;H_=!0,u()},H=(o)=>{if(N?.surface!=="popover"||o.relatedTarget!==null||!H_)return;H_=!1,u()},m=()=>{if(N?.surface!=="popover"||C_)return;C_=!0,u()},V_=()=>{if(N?.surface!=="popover"||!C_)return;C_=!1,u()},M_=(o,A=1024)=>{if(!o.trim()||o.length>A)throw new G("HOST_REJECTED",`Identity must contain 1 to ${A} characters.`)},t_=async(o)=>{if(o.kind!=="projects")M_(o.projectId);let A=await x({...V,type:"workspace-read",id:P(d),payload:o});if(!A||!("kind"in A)||!("state"in A)||A.kind!==o.kind)throw new G("HOST_REJECTED","Host did not return workspace data.");return A},fE=async(o,A)=>{if(o.kind!=="projects")M_(o.projectId);let r=P(d);o_.set(r,A);try{await $({...V,type:"workspace-subscribe",id:P(d),payload:{subscriptionId:r,query:o}})}catch(b){if(o_.delete(r),!f_)S_({...V,type:"workspace-unsubscribe",id:P(d),payload:{subscriptionId:r}});throw b}return()=>{if(!o_.delete(r)||f_)return;S_({...V,type:"workspace-unsubscribe",id:P(d),payload:{subscriptionId:r}})}},cS=async(o,A)=>{if(o.kind==="session")M_(o.sessionId);if(o.kind==="project")M_(o.projectId);let r=P(d);Z.set(r,A);try{await $({...V,type:"shells-subscribe",id:P(d),payload:{subscriptionId:r,scope:o}})}catch(b){if(Z.delete(r),!f_)S_({...V,type:"shells-unsubscribe",id:P(d),payload:{subscriptionId:r}});throw b}return()=>{if(!Z.delete(r)||f_)return;S_({...V,type:"shells-unsubscribe",id:P(d),payload:{subscriptionId:r}})}},bE=async(o)=>{if("key"in o&&(o.key.length===0||o.key.length>qE))throw new G("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(o.op==="set"&&!u_(o.value))throw new G("HOST_REJECTED","Storage values must be JSON.");if(o.op==="set"&&new TextEncoder().encode(JSON.stringify(o.value)).length>uE)throw new G("HOST_REJECTED","Storage value exceeds 64 KiB.");if(o.scope==="device"&&N?.features?.deviceStorage!==!0)throw new G("UNSUPPORTED","This host does not support device storage.");let A=await x({...V,type:"storage",id:P(d),payload:o});if(!A||!("storage"in A)||A.op!==o.op)throw new G("HOST_REJECTED","Host did not return storage data.");return A},yT=(o,A)=>N?.features?.popovers!==!0&&!(N?.surface==="popover"&&N.popover?.id===o)?Promise.reject(new G("UNSUPPORTED","This host does not support popovers.")):$({...V,type:"popover-close",id:P(d),payload:A?{id:o,reason:A}:{id:o}}),wT=(o,A)=>N?.features?.popovers!==!0&&!(N?.surface==="popover"&&N.popover?.id===o)?Promise.reject(new G("UNSUPPORTED","This host does not support popovers.")):$({...V,type:"popover-anchor",id:P(d),payload:{id:o,active:A}});return E.addEventListener("keydown",U_,!0),E.addEventListener("pointerover",K),E.addEventListener("pointermove",K),E.addEventListener("pointerout",H),E.addEventListener("focus",m),E.addEventListener("blur",V_),{onAction:(o)=>{return Q=o,()=>{if(Q===o)Q=null}},listProjects:async()=>{let o=await t_({kind:"projects"});if(o.kind!=="projects")throw new G("HOST_REJECTED","Expected projects.");return o},listWorktrees:async(o)=>{let A=await t_({kind:"worktrees",projectId:o});if(A.kind!=="worktrees")throw new G("HOST_REJECTED","Expected worktrees.");return A},listSessions:async(o)=>{let A=await t_({kind:"sessions",projectId:o});if(A.kind!=="sessions")throw new G("HOST_REJECTED","Expected sessions.");return A},onProjects:(o)=>fE({kind:"projects"},(A)=>{if(A.kind==="projects")o(A)}),onWorktrees:(o,A)=>fE({kind:"worktrees",projectId:o},(r)=>{if(r.kind==="worktrees")A(r)}),onSessions:(o,A)=>fE({kind:"sessions",projectId:o},(r)=>{if(r.kind==="sessions")A(r)}),onRunningShells:(o,A)=>cS(o,A),readShellOutput:async(o,A)=>{M_(o,rE);let r=A?.cursor;if(r!==void 0&&(!Number.isInteger(r)||r<0))throw new G("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let b=A?.tailBytes;if(b!==void 0&&(!Number.isInteger(b)||b<1||b>NE))throw new G("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${NE}.`);let i=await x({...V,type:"shell-output",id:P(d),payload:{shellId:o,cursor:r,tailBytes:b}});if(!i||typeof i.output!=="string"||!Number.isFinite(i.cursor))throw new G("HOST_REJECTED","Host did not return shell output.");return i},stopShell:async(o)=>{if(M_(o,rE),(await x({...V,type:"shell-stop",id:P(d),payload:{shellId:o}}))?.stopped!==!0)throw new G("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async(o)=>{M_(o),await $({...V,type:"open-session",id:P(d),payload:{sessionId:o}})},storage:{get:async(o,A)=>{let r=KE(A),b={op:"get",key:o};if(r)b.scope=r;let g=await bE(b);return g.op==="get"&&g.found?g.value:void 0},set:async(o,A,r)=>{let b=KE(r),g={op:"set",key:o,value:A};if(b)g.scope=b;await bE(g)},delete:async(o,A)=>{let r=KE(A),b={op:"delete",key:o};if(r)b.scope=r;await bE(b)},keys:async(o)=>{let A=KE(o),r={op:"keys"};if(A)r.scope=A;let b=await bE(r);if(b.op!=="keys")throw new G("HOST_REJECTED","Expected storage keys.");return b.keys}},onReady:(o)=>{if(O.add(o),N)o(N);return()=>{O.delete(o)}},onDirectory:(o)=>{if(f.add(o),N)o(N.directory);return()=>{f.delete(o)}},onSession:(o)=>{if(k.add(o),N)o(N.session);return()=>{k.delete(o)}},onSessionLifecycle:(o)=>{if(U.add(o),G_)o(G_);return()=>{U.delete(o)}},onConnection:(o)=>{if(R.add(o),N)o(N.connection);return()=>{R.delete(o)}},onSettings:(o)=>{if(M.add(o),N)o(N.settings);return()=>{M.delete(o)}},onItem:(o)=>{if(C.add(o),N)o(N.item);return()=>{C.delete(o)}},onBlock:(o)=>{if(n.add(o),N?.block)o(N.block);return()=>{n.delete(o)}},onServiceEvent:(o)=>{return L.add(o),()=>{L.delete(o)}},onStatusControl:(o)=>{return Y.add(o),()=>{Y.delete(o)}},onPopoverClosed:(o)=>{return X.add(o),()=>{X.delete(o)}},setStatusControls:(o)=>{if(N?.features?.statusControls!==!0)return Promise.reject(new G("UNSUPPORTED","This host does not support status controls."));if(!vT(o))return Promise.reject(new G("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options."));return $({...V,type:"status-controls",id:P(d),payload:{controls:o}})},openPopover:(o)=>{if(N?.features?.popovers!==!0)return Promise.reject(new G("UNSUPPORTED","This host does not support popovers."));if(!ET(o))return Promise.reject(new G("HOST_REJECTED","Popover requests need bounded geometry and JSON data."));return $({...V,type:"popover-open",id:P(d),payload:o})},closePopover:yT,setPopoverAnchorActive:wT,onResolve:(o)=>{return F=o,()=>{if(F===o)F=null}},toast:(o)=>{let A=o.message.trim();if(!A||A.length>XE)return Promise.reject(new G("HOST_REJECTED",`Toast message must contain 1 to ${XE} characters.`));if(o.copy&&o.copy!==!0&&(!o.copy.text.length||o.copy.text.length>VE))return Promise.reject(new G("HOST_REJECTED",`Toast copy text must contain 1 to ${VE} characters.`));return $({channel:h,v:z,type:"toast",id:P(d),payload:{...o,message:A}})},openUrl:(o)=>$({channel:h,v:z,type:"open-url",id:P(d),payload:{url:o}}),...co($,()=>P(d),(o)=>Promise.reject(new G("HOST_REJECTED",o))),answerBlock:(o)=>$({channel:h,v:z,type:"block-answer",id:P(d),payload:{text:o.trim().slice(0,ST)}}),openSurface:(o)=>$({channel:h,v:z,type:"open-surface",id:P(d),payload:{surfaceId:o}}),writeClipboard:(o)=>$({channel:h,v:z,type:"clipboard-write",id:P(d),payload:{text:o}}),compose:(o)=>$({channel:h,v:z,type:"compose",id:P(d),payload:o}),attach:(o)=>$({channel:h,v:z,type:"attach",id:P(d),payload:a_(o)}),startSession:async(o)=>{if(o.projectId!==void 0)M_(o.projectId);let A=o.worktree;if(A&&A!==!0)if(A.kind==="existing")M_(A.directory);else{if(A.name!==void 0)M_(A.name,200);if(A.baseBranch!==void 0)M_(A.baseBranch,200)}let r=await x({channel:h,v:z,type:"start-session",id:P(d),payload:UT(o)},_.requestTimeoutMs??180000);if(!OT(r))throw new G("HOST_REJECTED","Host did not return a session.");return r},prompt:(o)=>x({channel:h,v:z,type:"prompt",id:P(d),payload:IT(o)}).then((A)=>{if(!AT(A))throw new G("HOST_REJECTED","Host did not return a prompt result.");return A}),sessionLink:(o)=>$({channel:h,v:z,type:"session-link",id:P(d),payload:a_(o)}),close:()=>$({channel:h,v:z,type:"close",id:P(d)}),oauthStart:()=>$({channel:h,v:z,type:"oauth-start",id:P(d)}),oauthDisconnect:()=>$({channel:h,v:z,type:"oauth-disconnect",id:P(d)}),request:(o)=>(DE(o.path)?x({channel:h,v:z,type:"request",id:P(d),payload:o}):Po()).then((A)=>{if(!hE(A))throw new G("HOST_REJECTED","Host request result was empty.");return A}),serviceRequest:(o)=>(DE(o.path)?x({channel:h,v:z,type:"service-request",id:P(d),payload:o}):Po()).then((A)=>{if(!hE(A))throw new G("HOST_REJECTED","Host service request result was empty.");return A}),serviceStatus:()=>x({channel:h,v:z,type:"service-status",id:P(d)}).then((o)=>{if(!xT(o))throw new G("HOST_REJECTED","Host did not return service status.");return o}),readFile:(o)=>(l_(o)?x({channel:h,v:z,type:"file-read",id:P(d),payload:{path:o}}):zE()).then((A)=>{if(!nT(A))throw new G("HOST_REJECTED","Host did not return file content.");return A}),writeFile:(o,A)=>{if(!l_(o))return zE();if(A.length>tE)return Promise.reject(new G("FILE_TOO_LARGE",`Content is over ${tE} characters.`));return x({channel:h,v:z,type:"file-write",id:P(d),payload:{path:o,content:A}}).then((r)=>{if(!$T(r))throw new G("HOST_REJECTED","Host did not confirm the write.");return r})},listDir:(o)=>(l_(o)?x({channel:h,v:z,type:"file-list",id:P(d),payload:{path:o}}):zE()).then((A)=>{if(!CT(A))throw new G("HOST_REJECTED","Host did not return directory entries.");return A}),stat:(o)=>(l_(o)?x({channel:h,v:z,type:"file-stat",id:P(d),payload:{path:o}}):zE()).then((A)=>{if(!bT(A))throw new G("HOST_REJECTED","Host did not return file status.");return A}),generate:(o)=>{let A=o.prompt.trim(),r=o.system?.trim();if(A.length===0||A.length>LE)return Promise.reject(new G("HOST_REJECTED",`Prompt must be 1 to ${LE} characters.`));if(r!==void 0&&(r.length===0||r.length>PE))return Promise.reject(new G("HOST_REJECTED",`System prompt must be 1 to ${PE} characters.`));let b=o.maxOutputTokens===void 0?void 0:Math.min(fT,Math.max(1,Math.floor(o.maxOutputTokens)));if(b!==void 0&&!Number.isFinite(b))return Promise.reject(new G("HOST_REJECTED","maxOutputTokens must be a number."));let g={prompt:A};if(r!==void 0)g.system=r;if(b!==void 0)g.maxOutputTokens=b;return x({channel:h,v:z,type:"generate",id:P(d),payload:g},_.requestTimeoutMs??kT).then((i)=>{if(!rT(i))throw new G("HOST_REJECTED","Host did not return generated text.");return i})},onLateGenerateResult:(o)=>{t.add(o);for(let A of j.splice(0))B([o],A);return Z_(),()=>{t.delete(o)}},openMicrophone:p_,setBadge:(o)=>$({channel:h,v:z,type:"badge",id:P(d),payload:{count:RT(o)}}),setHeight:(o)=>$({channel:h,v:z,type:"resize",id:P(d),payload:{height:MT(o)}}),onFileOpen:(o)=>{if(s.add(o),!c_)c_=!0,E.addEventListener("keydown",z_,!0);if(E_)o(E_);return()=>{s.delete(o)}},onFileSnapshot:(o)=>{return y=o,()=>{if(y===o)y=null}},onFileSaved:(o)=>{return W.add(o),()=>{W.delete(o)}},reportFileChange:(o)=>J({...V,type:"file-change",payload:{dirty:o.dirty,edited:o.edited}}),requestFileSave:v,reportFileUnsupported:()=>J({...V,type:"file-unsupported"}),dispose:()=>{for(let o of o_.keys())S_({...V,type:"workspace-unsubscribe",id:P(d),payload:{subscriptionId:o}});o_.clear();for(let o of Z.keys())S_({...V,type:"shells-unsubscribe",id:P(d),payload:{subscriptionId:o}});if(Z.clear(),k_)O_(),k_.release(),k_=null;if(f_=!0,F=null,Q=null,y=null,s.clear(),W.clear(),c_)E.removeEventListener("keydown",z_,!0);E.removeEventListener("message",cE),E.removeEventListener("keydown",U_,!0),E.removeEventListener("pointerover",K),E.removeEventListener("pointermove",K),E.removeEventListener("pointerout",H),E.removeEventListener("focus",m),E.removeEventListener("blur",V_);for(let o of R_.values())clearTimeout(o.timer),o.reject(new G("HOST_UNAVAILABLE","Host client was disposed."));R_.clear(),O.clear(),f.clear(),k.clear(),U.clear(),R.clear(),M.clear(),C.clear(),n.clear(),L.clear(),Y.clear(),X.clear(),t.clear(),j.length=0}}};var Do=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var HO=new Set(Do);var ho=["none","agent","user"];var ZO=new Set(ho);var CS=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],bS=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],zo=(_,E)=>{E.style.colorScheme=_.mode;for(let[T,S]of CS)E.style.setProperty(T,_.tokens[S]);for(let[T,S,O]of bS){let f=_.tokens[O]??"";E.style.setProperty(T,f),E.style.setProperty(S,f)}E.style.setProperty("font-family",_.tokens.font),E.style.setProperty("font-size",_.tokens.fontSize??"0.875rem"),E.style.setProperty("line-height","1.45"),E.style.setProperty("color",_.tokens.foreground)},pT=(_,E)=>{if(zo(_.theme,E),E.dataset)E.dataset.ocSurface=_.surface,E.dataset.ocTheme=_.theme.mode};var rS={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},q=(_,E)=>`var(--${_}, var(--oc-${rS[_]}, ${E}))`,P_=q("surface-background","transparent"),QE=q("surface-elevated","transparent"),s_=q("surface-elevated-foreground","inherit"),x_=q("surface-foreground","inherit"),e=q("surface-muted-foreground","gray"),NS=q("surface-muted","transparent"),j_=q("interactive-border","currentColor"),I_=q("interactive-hover","transparent"),J_=q("interactive-active","transparent"),XT=q("interactive-selection","transparent"),VT=q("interactive-selection-foreground","inherit"),L_=q("primary","currentColor"),dT=q("primary-text","inherit"),tT=q("error-text","inherit"),GS=q("font-sans","inherit"),LT=q("font-mono","monospace"),Yo=q("radius","9px"),PT=`calc(${Yo} - 2px)`,Ko=`calc(${Yo} - 4px)`,__=(_,E,T="transparent")=>`color-mix(in srgb, ${_} ${E}%, ${T})`,Wo=`background-image: linear-gradient(${I_}, ${I_});`,DT=(_,E="0.5px")=>`box-shadow: inset 0 0 0 ${E} ${_}, var(--oc-sdk-field-lift);`,hT="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",Qo="box-shadow: var(--oc-sdk-lit);",zT=`inset 0 0.5px 0 0 ${__(x_,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,pS=`
:root {
  --oc-sdk-edge: ${__(x_,16)};
  --oc-sdk-field-bg: ${QE};
  --oc-sdk-raised-bg: ${P_};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${__(x_,14)};
  --oc-sdk-field-bg: ${__(P_,50,QE)};
  --oc-sdk-raised-bg: ${QE};
  --oc-sdk-field-lift: ${zT};
  --oc-sdk-raised-lift: ${zT};
  --oc-sdk-lit: ${zT};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,WE=(_)=>{let E=q(`status-${_}`,"currentColor");return`
.oc-sdk[data-tone="${_}"], .oc-sdk [data-tone="${_}"] { --oc-sdk-tone: ${E}; --oc-sdk-tone-text: ${q(`${_}-text`,"inherit")}; }`},I=(_)=>`calc(${_}rem / 14)`,XS=`
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
`,Ho=`${pS}
.oc-sdk { color: ${x_}; font-family: ${GS}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${Wo} }
.oc-sdk-mono { font-family: ${LT}; }
.oc-sdk-muted { color: ${e}; }
${WE("success")}${WE("warning")}${WE("error")}${WE("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${L_}; --oc-sdk-tone-text: ${dT}; }

.oc-sdk-btn { border-radius: ${PT}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${Ko}; }
.oc-sdk-btn[data-variant="default"] { color: ${dT}; background: ${__(L_,10,P_)}; border-color: ${__(L_,12)}; ${Qo} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${__(L_,16,P_)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${__(L_,22,P_)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${NS}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${I_}, ${I_}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${J_}, ${J_}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${s_}; ${hT} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${I_}, ${I_}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${J_}, ${J_}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${I_}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${J_}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${q("status-error","red")}; color: ${tT}; background: ${__("var(--oc-sdk-tone)",7,P_)}; border-color: ${__("var(--oc-sdk-tone)",12)}; ${Qo} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${__("var(--oc-sdk-tone)",9,P_)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${__("var(--oc-sdk-tone)",11,P_)}; box-shadow: none; }

.oc-sdk-field-note { color: ${e}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${tT}; }
.oc-sdk-input { border-radius: ${PT}; background: var(--oc-sdk-field-bg); color: ${s_}; ${DT("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${e}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${I_}, ${I_}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${DT(__(x_,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${DT(q("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${LT}; }

.oc-sdk-search-icon { color: ${e}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${L_}; }
.oc-sdk-search-clear { border-radius: ${Ko}; color: ${e}; }
.oc-sdk-search-clear:hover { background: ${I_}; color: ${x_}; }

.oc-sdk-trigger { border-radius: ${PT}; background: var(--oc-sdk-raised-bg); color: ${s_}; ${hT} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${I_}, ${I_}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${J_}, ${J_}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${e}; }
.oc-sdk-trigger-chevron { color: ${e}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${s_}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${QE}; background-clip: padding-box; color: ${s_}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${I_}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${XT}; color: ${VT}; }
.oc-sdk-option-check { color: ${x_}; }
.oc-sdk-option[data-destructive="true"] { color: ${tT}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${__(q("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${e}; }
.oc-sdk-popup-empty { color: ${e}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${j_}; border-radius: 4px; color: ${x_}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${__(x_,60,j_)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${j_}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${P_}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${L_}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(var(--oc-sdk-thumb-travel, 16px)); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${Wo} }
.oc-sdk-check-desc { color: ${e}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${__(x_,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${e}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${x_}; }
.oc-sdk-tab[aria-selected="true"] { color: ${VT}; background: ${XT}; border-color: ${j_}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${s_}; background: var(--oc-sdk-raised-bg); ${hT} }
.oc-sdk-tab-count { color: ${e}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${__(x_,6)}; color: ${e}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${__("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${I_}; }
.oc-sdk-row[aria-selected="true"] { background: ${XT}; color: ${VT}; }
.oc-sdk-row-lead { font-family: ${LT}; color: ${e}; }
.oc-sdk-row-sub { color: ${e}; }
.oc-sdk-row-meta { color: ${e}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${e}; }

.oc-sdk-empty-body { color: ${e}; }

.oc-sdk-spinner { color: ${e}; }
.oc-sdk-spinner-ring { border-color: ${j_}; border-top-color: ${L_}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${__("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${e}; }

.oc-sdk-separator { color: ${e}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${__(j_,40)}; }

.oc-sdk-progress-label { color: ${e}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${__(x_,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${L_}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${q("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${q("success-text","inherit")}; }

.oc-sdk-text a { color: ${dT}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${__(j_,60)}; }
`,a=`
${yE}
${XS}
${Ho}`;var Fo="oc-sdk-ui-style",v_=(_)=>{while(_.firstChild)_.removeChild(_.firstChild)},l=(_)=>{let E=document.getElementById(Fo);if(E instanceof HTMLStyleElement){if(E.textContent!==_)E.textContent=_;return}wE(document);let T=document.createElement("style");T.id=Fo,T.textContent=_,document.head.appendChild(T)},D=(_,E)=>{let T=document.createElement(_);if(E)T.className=E;return T},d_=(_)=>{let E=D("button",_);return E.type="button",E},T_=(_,E)=>{let T=E??"";if(_.textContent!==T)_.textContent=T},K_=(_,E,T)=>{if(T===void 0||T===null||T==="")_.removeAttribute(E);else if(_.getAttribute(E)!==T)_.setAttribute(E,T)};var VS=()=>{let _=document.createElement("span");return _.className="oc-sdk-spinner-ring",_.setAttribute("aria-hidden","true"),_},X_=(_,E)=>{l(a);let T=E,S=d_("oc-sdk oc-sdk-btn"),O=VS(),f=document.createElement("span");S.append(f),_.append(S);let k=()=>{if(S.dataset.variant=T.variant??"default",S.dataset.size=T.size??"default",S.disabled=Boolean(T.disabled)||Boolean(T.loading),S.dataset.loading=T.loading?"true":"false",S.setAttribute("aria-busy",T.loading?"true":"false"),T.loading&&O.parentNode!==S)S.prepend(O);else if(!T.loading&&O.parentNode===S)O.remove();T_(f,T.label)},U=()=>{if(T.disabled||T.loading)return;T.onClick()};return S.addEventListener("click",U),k(),{update:(R)=>{T={...T,...R},k()},dispose:()=>{S.removeEventListener("click",U),S.remove()}}};var YE=(_,E)=>{l(a);let T=E,S=D("label","oc-sdk oc-sdk-field"),O=D("span","oc-sdk-field-label"),f=T.multiline?D("textarea","oc-sdk-input"):D("input","oc-sdk-input"),k=D("span","oc-sdk-field-note");S.append(O,f,k),_.append(S);let U=()=>{if(T_(O,T.label),O.hidden=!T.label,f instanceof HTMLInputElement)f.type=T.password?"password":"text";else f.rows=T.rows??3;if(f.value!==T.value)f.value=T.value;f.disabled=Boolean(T.disabled),K_(f,"placeholder",T.placeholder),f.dataset.mono=T.mono?"true":"false";let M=Boolean(T.error);S.dataset.invalid=M?"true":"false",f.setAttribute("aria-invalid",M?"true":"false");let C=T.error??T.helper??"";T_(k,C),k.hidden=C===""},R=()=>{T.onChange(f.value)};return f.addEventListener("input",R),U(),{update:(M)=>{T={...T,...M},U()},dispose:()=>{f.removeEventListener("input",R),S.remove()}}};var Zo="http://www.w3.org/2000/svg",dS={search:"M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z",chevron:"M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z",check:"M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z",close:"M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"},e_=(_,E,T)=>{let S=document.createElementNS(Zo,"svg");if(S.setAttribute("viewBox","0 0 24 24"),S.setAttribute("width",String(E)),S.setAttribute("height",String(E)),S.style.width=I(E),S.style.height=I(E),S.setAttribute("aria-hidden","true"),S.setAttribute("fill","currentColor"),T)S.setAttribute("class",T);let O=document.createElementNS(Zo,"path");return O.setAttribute("d",dS[_]),S.append(O),S};var _E=(_,E="vertical")=>{let[T,S]=E==="vertical"?["ArrowDown","ArrowUp"]:["ArrowRight","ArrowLeft"];if(_.key===T||_.ctrlKey&&_.key.toLowerCase()==="n")return"next";if(_.key===S||_.ctrlKey&&_.key.toLowerCase()==="p")return"previous";if(_.key==="Home")return"first";if(_.key==="End")return"last";return null},EE=(_,E,T)=>{let S=_.filter((R)=>!R.disabled);if(S.length===0)return null;let O=S[0],f=S[S.length-1];if(T==="first"||!O||!f)return O?.id??null;if(T==="last")return f.id;let k=S.findIndex((R)=>R.id===E);if(k===-1)return T==="next"?O.id:f.id;return S[Math.min(S.length-1,Math.max(0,k+(T==="next"?1:-1)))]?.id??null};var DS=(_,E,T)=>{l(a);let S=E,O=d_("oc-sdk oc-sdk-check");O.setAttribute("role",T);let f=D("span",T==="switch"?"oc-sdk-check-thumb":"oc-sdk-check-box");if(T==="checkbox")f.append(e_("check",12));let k=D("span","oc-sdk-check-text"),U=D("span","oc-sdk-check-label"),R=D("span","oc-sdk-check-desc");k.append(U,R),O.append(f,k),_.append(O);let M=()=>{O.setAttribute("aria-checked",S.checked?"true":"false"),O.disabled=Boolean(S.disabled),T_(U,S.label),T_(R,S.description),R.hidden=!S.description},C=()=>{if(!S.disabled)S.onChange(!S.checked)};return O.addEventListener("click",C),M(),{update:(n)=>{S={...S,...n},M()},dispose:()=>{O.removeEventListener("click",C),O.remove()}}};var HE=(_,E)=>DS(_,E,"switch");var KT=(_,E)=>{l(a);let T=E,S=D("div","oc-sdk oc-sdk-tabs");S.setAttribute("role","tablist"),_.append(S);let O=()=>{v_(S),S.dataset.track=T.trackBackground?"true":"false";for(let k of T.items){let U=d_("oc-sdk-tab");U.setAttribute("role","tab");let R=k.id===T.activeId;U.setAttribute("aria-selected",R?"true":"false"),U.tabIndex=R?0:-1,U.dataset.id=k.id;let M=D("span");if(M.textContent=k.label,U.append(M),k.count!==void 0){let C=D("span","oc-sdk-tab-count");C.textContent=String(k.count),U.append(C)}U.addEventListener("click",()=>{if(k.id!==T.activeId)T.onChange(k.id)}),S.append(U)}},f=(k)=>{let U=_E(k,"horizontal");if(!U)return;let R=EE(T.items,T.activeId,U);if(R&&R!==T.activeId){k.preventDefault(),T.onChange(R);let M=S.querySelector(`[data-id="${CSS.escape(R)}"]`);if(M instanceof HTMLElement)M.focus()}};return S.addEventListener("keydown",f),O(),{update:(k)=>{T={...T,...k},O()},dispose:()=>{S.removeEventListener("keydown",f),S.remove()}}};var WT=(_,E)=>{K_(_,"data-tone",E&&E!=="neutral"?E:null)},FE=(_,E)=>{l(a);let T=E,S=D("span","oc-sdk oc-sdk-badge");_.append(S);let O=()=>{T_(S,T.label),WT(S,T.tone)};return O(),{update:(f)=>{T={...T,...f},O()},dispose:()=>{S.remove()}}};var QT=(_,E)=>{l(a);let T=E,S=D("div","oc-sdk oc-sdk-empty"),O=D("h2","oc-sdk-empty-title"),f=D("p","oc-sdk-empty-body"),k=D("div","oc-sdk-empty-action");S.append(O,f,k),_.append(S);let U=null,R=()=>{if(T_(O,T.title),T_(f,T.body),f.hidden=!T.body,k.hidden=!T.action,!T.action){U?.dispose(),U=null;return}let M={label:T.action.label,onClick:T.action.onClick};if(U)U.update(M);else U=X_(k,{...M,variant:"outline",size:"sm"})};return R(),{update:(M)=>{T={...T,...M},R()},dispose:()=>{U?.dispose(),U=null,S.remove()}}};var YT=(_,E={})=>{l(a);let T=E,S=D("span","oc-sdk oc-sdk-spinner");S.setAttribute("role","status");let O=D("span","oc-sdk-spinner-ring");O.setAttribute("aria-hidden","true");let f=D("span");S.append(O,f),_.append(S);let k=()=>{S.dataset.size=T.size??"default",T_(f,T.label),f.hidden=!T.label,S.setAttribute("aria-label",T.label??"Loading")};return k(),{update:(U)=>{T={...T,...U},k()},dispose:()=>{S.remove()}}};var ZE=(_,E)=>{l(a);let T=E,S=D("div","oc-sdk oc-sdk-banner"),O=D("div","oc-sdk-banner-text"),f=D("div","oc-sdk-banner-title"),k=D("div","oc-sdk-banner-body"),U=D("div","oc-sdk-banner-action");O.append(f,k),S.append(O,U),_.append(S);let R=null,M=()=>{if(S.dataset.tone=T.tone,S.setAttribute("role",T.tone==="error"||T.tone==="warning"?"alert":"status"),T_(f,T.title),T_(k,T.body),k.hidden=!T.body,U.hidden=!T.action,!T.action){R?.dispose(),R=null;return}let C={label:T.action.label,onClick:T.action.onClick};if(R)R.update(C);else R=X_(U,{...C,variant:"outline",size:"xs"})};return M(),{update:(C)=>{T={...T,...C},M()},dispose:()=>{R?.dispose(),R=null,S.remove()}}};var n_=(_)=>{if(!Number.isFinite(_))return 0;return Math.max(0,Math.min(100,_))};var D_=(_)=>{let E=n_(_);if(Math.abs(E-Math.round(E))<0.05)return`${Math.round(E)}%`;return`${E.toFixed(1)}%`},HT=(_)=>{if(!Number.isFinite(_)||_<0)return"$0";if(_>=100)return`$${Math.round(_)}`;if(_>=10)return`$${_.toFixed(1)}`;return`$${_.toFixed(2)}`},FT=(_)=>{if(!Number.isFinite(_)||_<=0)return"0";if(_>=1e9)return`${(_/1e9).toFixed(2)}B`;if(_>=1e6){let E=_/1e6;return E>=100?`${Math.round(E)}M`:`${E.toFixed(1)}M`}if(_>=1000)return`${Math.round(_/1000)}K`;return String(Math.round(_))},jE=(_,E=Date.now())=>{if(!_||!Number.isFinite(_)||_<=E)return"即将重置";let T=Math.max(0,Math.floor((_-E)/1000)),S=Math.floor(T/86400),O=Math.floor(T%86400/3600),f=Math.floor(T%3600/60);if(S>0)return`${S}d ${O}h`;if(O>0)return`${O}h ${f}m`;return`${Math.max(1,f)}m`};var jo=(_)=>{let E=_.limit_requests>0?_.effective_remaining_requests/_.limit_requests*100:100;return(_.limit_tokens>0?_.effective_remaining_tokens/_.limit_tokens*100:100)<E-0.5};var hS="http://www.w3.org/2000/svg",Jo=["gemini_5h","gemini_weekly","claude_5h","claude_weekly","argon_weekly"],go=["claude_weekly","claude_5h","argon_weekly","gemini_weekly","gemini_5h"],io=["gemini_5h","gemini_weekly","claude_5h","claude_weekly","argon_weekly"],eo="pq:panel-ui-prefs:v1",zS=30000,_S=30000,Bo=[{r:239,g:68,b:68},{r:245,g:158,b:11},{r:16,g:185,b:129}],KS=0,BE=(_,E=!1)=>{let T=n_(_);if(E||T<=0.05)return"empty";if(T>=99.95)return"full";if(T>60)return"healthy";if(T>=25)return"moderate";return"low"},ES=(_,E)=>{let T=_.toLowerCase(),S=(E??"").toLowerCase();return T==="argon_weekly"||S==="argon"||T.includes("argon")},TS=(_)=>{return String(_||"").trim().toLowerCase()==="pro"},WS=(_)=>{let E=TS(_.tier);return(_.windows??[]).filter((T)=>E||!ES(T.key,T.group))},mo=(_)=>{if(n_(_.remaining_percent)<99.95)return!0;return Boolean(_.has_current_usage&&(_.current_cost>0||_.current_tokens>0||_.current_requests>0))},QS=(_)=>{if(n_(_.effective_percent)<99.95)return!0;if(_.eligible_accounts>0&&_.available_accounts<_.eligible_accounts)return!0;return _.used_requests>0||_.used_tokens>0},g_=(_,E)=>{let T=_.toLowerCase(),S=(E??"").toLowerCase();if(T==="gemini_5h")return"var(--pq-series-gemini)";if(T==="gemini_weekly"||S==="gemini")return"var(--pq-series-gemini-2)";if(T==="claude_5h")return"var(--pq-series-claude)";if(T==="claude_weekly"||S==="claude")return"var(--pq-series-claude-2)";if(T.includes("argon")||S==="argon")return"var(--pq-series-argon)";return"var(--pq-full)"},yo=(_)=>{switch(_.key){case"gemini_5h":return"Gemini 5h";case"gemini_weekly":return"Gemini 周";case"claude_5h":return"Claude 5h";case"claude_weekly":return"Claude 周";case"argon_weekly":return"Argon 周";default:return _.label||_.key}},oS=(_)=>{let E=String(_||"").trim().toLowerCase();if(E==="ultra")return"pq-tier-ultra";if(E==="pro")return"pq-tier-pro";return"pq-tier-free"},YS=(_)=>{switch(String(_||"").toLowerCase()){case"available":case"ready":return"pq-st-ok";case"limited":case"cooldown":return"pq-st-warn";case"exhausted":case"unavailable":case"auth_required":return"pq-st-err";default:return"pq-st-muted"}},HS=(_)=>{let E=Math.max(0,Math.min(1,_)),T=E<0.5?0:1,S=T===0?E*2:(E-0.5)*2,O=Bo[T],f=Bo[T+1],k=Math.round(O.r+(f.r-O.r)*S),U=Math.round(O.g+(f.g-O.g)*S),R=Math.round(O.b+(f.b-O.b)*S);return`rgb(${k}, ${U}, ${R})`},IE=(_)=>_>1000000000000?_:_*1000,wo=(_)=>_>1000000000000?_/1000:_,W_=(_)=>String(_).padStart(2,"0"),jT=(_,E)=>{let T=new Date(_);if(E==="md")return`${W_(T.getMonth()+1)}/${W_(T.getDate())}`;return`${W_(T.getHours())}:${W_(T.getMinutes())}`},FS=(_)=>{let E=new Date(_);return`${W_(E.getMonth()+1)}/${W_(E.getDate())} ${W_(E.getHours())}:${W_(E.getMinutes())}`},ZS=(_)=>{try{return new URL(_).host}catch{return _}},jS=()=>{if(document.getElementById("pq-styles"))return;let _=document.createElement("style");_.id="pq-styles",_.textContent=`
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
  `,document.head.appendChild(_)},c=(_,E,T)=>{let S=document.createElement(_);if(E)S.className=E;if(T!==void 0)S.textContent=T;return S},A_=(_,E={})=>{let T=document.createElementNS(hS,_);for(let[S,O]of Object.entries(E))T.setAttribute(S,String(O));return T},JS=()=>{let _=A_("svg",{width:14,height:14,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"});return _.appendChild(A_("circle",{cx:12,cy:12,r:3})),_.appendChild(A_("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})),_},N_=GT(),SE=document.querySelector("#root"),qo=!1,m_=!1,i_=!1,JE=!1,gE=!1,p=null,r_=!1,$_=!1,TE="http://127.0.0.1:18380",RE="",mE=!1,B_=null,ME=0,SS=new Map,BT=new Map,oE=new Set,ZT=new WeakMap,uo=[],h_=[],y_=new Set,JT=null,gT=null,Q_=null,iE=null,xE=null,ao=null,OE=(_)=>SS.get(_)??"5h",mT=(_,E)=>`${_}|${E}`,OS=(_)=>{for(let E of _)try{E()}catch{}},gS=()=>{for(let _ of y_)try{_()}catch{}};document.addEventListener("pointerdown",(_)=>{if(!_.target?.closest(".pq-chart-box"))gS()});var iS=async()=>{try{let _=await N_.storage.get(eo);if(_&&typeof _==="object"&&!Array.isArray(_)){let E=_;if(typeof E.aisFullExpanded==="boolean"&&E.aisFullExpanded!==$_){if($_=E.aisFullExpanded,p?.snapshot)Y_()}}}catch{}},BS=()=>{N_.storage.set(eo,{aisFullExpanded:$_}).catch(()=>{})},mS=()=>({winX:window.scrollX||0,winY:window.scrollY||0,docTop:document.documentElement?.scrollTop||0,bodyTop:document.body?.scrollTop||0,rootTop:SE.scrollTop||0,prevHeight:SE.getBoundingClientRect().height}),yS=(_)=>{let E=()=>{if(_.rootTop>0)SE.scrollTop=_.rootTop;if(_.docTop>0&&document.documentElement)document.documentElement.scrollTop=_.docTop;if(_.bodyTop>0&&document.body)document.body.scrollTop=_.bodyTop;let T=_.winY||_.docTop||_.bodyTop;if(T>0||_.winX>0)window.scrollTo({left:_.winX,top:T,behavior:"instant"})};E(),requestAnimationFrame(()=>{E(),SE.style.minHeight=""})},AE=async(_,E,T={})=>{let S=await N_.serviceRequest({method:_,path:E,...T.query?{query:T.query}:{},...T.body?{body:JSON.stringify(T.body)}:{}}),O=null;try{O=S.body?JSON.parse(S.body):null}catch{O=null}if(S.status<200||S.status>=300){let f=O&&typeof O==="object"&&"error"in O&&typeof O.error==="string"?O.error:`服务返回 HTTP ${S.status}`;throw Error(f)}return O},CE=(_)=>{if(!_||!_.account_id)return;let E=_.window==="7d"?"7d":"5h";BT.set(mT(_.account_id,E),{data:_,fetchedAtMs:Date.now()})},wS=5,qS=(_)=>{let E=[];if(Array.isArray(_.cycle_resets)&&_.cycle_resets.length>0){for(let S of _.cycle_resets)if(typeof S==="number"&&Number.isFinite(S)&&S>0)E.push(IE(S))}else if(Array.isArray(_.resets)&&_.resets.length>=2){let S=Array.isArray(_.points)?_.points:[],O=(f)=>{let k=null;for(let U=0;U<S.length;U+=1){let R=S[U];if(IE(R[0])<f)k=n_(R[1]);else break}return k};for(let f=1;f<_.resets.length;f+=1){let k=_.resets[f-1],U=_.resets[f];if(!Array.isArray(k)||!Array.isArray(U)||k.length<2||U.length<2)continue;let R=wo(k[1]),M=wo(U[1]),C=IE(U[0]);if(!Number.isFinite(C)||C<=0)continue;if(R>0&&M>R+60)E.push(C);else if(R>0&&M===0){let n=O(C);if(n!==null&&n<99.999)E.push(C)}}}if(E.length<=1)return E;E.sort((S,O)=>S-O);let T=[E[0]];for(let S=1;S<E.length;S+=1)if(E[S]>T[T.length-1])T.push(E[S]);return T},iT=(_,E,T,S)=>{let O=c("div"),f=TS(T.tier),k=(_.series??[]).filter((x)=>{if(!f&&ES(x.key,x.group))return!1;return Array.isArray(x.points)&&x.points.length>=2});if(k.length===0)return O.appendChild(c("div","pq-chart-empty",`暂无 ${E==="7d"?"7d":"5h"} 历史采样曲线`)),O;let U=[...k].sort((x,$)=>{let V=go.indexOf(x.key),J=go.indexOf($.key);return(V===-1?0:V)-(J===-1?0:J)}),R=[...k].sort((x,$)=>{let V=io.indexOf(x.key),J=io.indexOf($.key);return(V===-1?99:V)-(J===-1?99:J)}),M=320,C=112,n=30,L=8,Y=10,X=18,t=M-n-L,j=C-Y-X,F=Y+j,Q=Number.POSITIVE_INFINITY,s=Number.NEGATIVE_INFINITY;for(let x of k)for(let $ of x.points){let V=IE($[0]);if(V<Q)Q=V;if(V>s)s=V}let W=Math.max(1,s-Q),y=(x)=>n+(x-Q)/W*t,E_=(x)=>Y+j*(1-n_(x)/100),c_=c("div","pq-chart-readout"),R_=()=>{c_.classList.remove("is-scrubbing"),c_.replaceChildren();let x=c("div","pq-readout-items");for(let $ of R){let V=n_($.points[$.points.length-1]?.[1]??$.remaining),J=BE(V),v=c("span","pq-readout-item"),O_=c("span","pq-fam-dot");O_.style.background=g_($.key,$.group),v.appendChild(O_),v.appendChild(c("span","pq-muted",yo($))),v.appendChild(c("strong",`pq-mono pq-lv-${J}`,D_(V))),x.appendChild(v)}c_.appendChild(x),c_.appendChild(c("span","pq-readout-hint","悬停/滑动"))};R_(),O.appendChild(c_);let o_=c("div","pq-chart-svg-wrap"),Z=A_("svg",{viewBox:`0 0 ${M} ${C}`,class:"pq-chart-svg",role:"img","aria-label":`${E} 周期剩余趋势`}),f_=A_("defs"),d=new Map;for(let x of U){let $=`pq-grad-${++KS}`;d.set(x.key,$);let V=g_(x.key,x.group),J=A_("linearGradient",{id:$,x1:"0",y1:"0",x2:"0",y2:"1"});J.appendChild(A_("stop",{offset:"0%","stop-color":V,"stop-opacity":"0.26"})),J.appendChild(A_("stop",{offset:"100%","stop-color":V,"stop-opacity":"0.01"})),f_.appendChild(J)}Z.appendChild(f_);for(let x of[100,50,25,0]){let $=E_(x),V=x===25,J=x===0;if(Z.appendChild(A_("line",{x1:n,x2:M-L,y1:$.toFixed(1),y2:$.toFixed(1),stroke:V?"var(--pq-low)":"var(--pq-border)","stroke-opacity":V?"0.26":J?"0.75":"0.45","stroke-dasharray":J?"":"2.5 3","stroke-width":"1"})),x===100||x===50||x===0){let v=A_("text",{x:n-4,y:($+3).toFixed(1),"text-anchor":"end",class:"pq-svg-axis"});v.textContent=`${x}%`,Z.appendChild(v)}}let N=new Map;for(let x of U){let $=g_(x.key,x.group),V=d.get(x.key),J=x.points.map((K)=>{let H=IE(K[0]),m=n_(K[1]);return{t:H,r:m,x:y(H),y:E_(m)}});N.set(x.key,J);let v=qS(x),O_=0,p_=[],z_=[],U_=[];for(let K=0;K<J.length;K+=1){let H=J[K],m=U_[U_.length-1];if(m){while(O_<v.length&&v[O_]<=m.t)O_+=1;if(O_<v.length&&v[O_]<=H.t||H.r-m.r>=wS){U_.push({t:H.t,r:m.r,x:H.x,y:m.y}),p_.push(U_),z_.push({x:H.x,yFrom:m.y,yTo:H.y}),U_=[H];continue}}U_.push(H)}if(U_.length>0)p_.push(U_);for(let K of p_)if(K.length>=2){let H=K.map((t_,fE)=>`${fE===0?"M":"L"}${t_.x.toFixed(1)},${t_.y.toFixed(1)}`).join(" "),m=K[0],V_=K[K.length-1],M_=`M${m.x.toFixed(1)},${F.toFixed(1)} ${K.map((t_)=>`L${t_.x.toFixed(1)},${t_.y.toFixed(1)}`).join(" ")} L${V_.x.toFixed(1)},${F.toFixed(1)} Z`;Z.appendChild(A_("path",{d:M_,fill:`url(#${V})`,stroke:"none"})),Z.appendChild(A_("path",{d:H,fill:"none",stroke:$,"stroke-width":"1.9","stroke-linecap":"round","stroke-linejoin":"round"}))}else if(K.length===1){let H=K[0],m=H.x+1.5<=M-L?H.x:Math.max(n,H.x-1.5),V_=H.x+1.5<=M-L?H.x+1.5:H.x;Z.appendChild(A_("line",{x1:m.toFixed(1),x2:V_.toFixed(1),y1:H.y.toFixed(1),y2:H.y.toFixed(1),stroke:$,"stroke-width":"1.9","stroke-linecap":"round"}))}for(let K of z_){if(Math.abs(K.yTo-K.yFrom)<1)continue;Z.appendChild(A_("line",{x1:K.x.toFixed(1),x2:K.x.toFixed(1),y1:K.yFrom.toFixed(1),y2:K.yTo.toFixed(1),stroke:$,"stroke-opacity":"0.32","stroke-width":"1","stroke-dasharray":"2 2","pointer-events":"none"}))}let u=J[J.length-1];if(u)Z.appendChild(A_("circle",{cx:u.x.toFixed(1),cy:u.y.toFixed(1),r:"4.6",fill:$,"fill-opacity":"0.24"})),Z.appendChild(A_("circle",{cx:u.x.toFixed(1),cy:u.y.toFixed(1),r:"2.5",fill:$,stroke:"var(--pq-surface)","stroke-width":"1.2"}))}let G_=E==="7d"||W>=129600000?"md":"hm",H_=[{x:n,t:Q,anchor:"start"},{x:n+t/2,t:Q+W/2,anchor:"middle"},{x:M-L,t:s,anchor:"end"}];for(let x of H_){let $=A_("text",{x:x.x.toFixed(1),y:String(C-3),"text-anchor":x.anchor,class:"pq-svg-axis"});$.textContent=jT(x.t,G_),Z.appendChild($)}let C_=A_("line",{x1:n,x2:n,y1:Y,y2:F,stroke:"var(--pq-fg)","stroke-opacity":"0.42","stroke-width":"1","stroke-dasharray":"2.5 2.5","pointer-events":"none"});C_.style.display="none",Z.appendChild(C_);let w_=new Map;for(let x of U){let $=A_("circle",{cx:n,cy:Y,r:"3.6",fill:"var(--pq-surface)",stroke:g_(x.key,x.group),"stroke-width":"2","pointer-events":"none"});$.style.display="none",Z.appendChild($),w_.set(x.key,$)}let k_=A_("rect",{x:n,y:Y,width:t,height:j,fill:"transparent"});k_.style.cursor="crosshair",Z.appendChild(k_);let F_=!1,S_=!1,Z_=()=>{if(!F_)return;F_=!1,S_=!1,ME=Math.max(0,ME-1),C_.style.display="none";for(let x of w_.values())x.style.display="none";R_()},B=(x,$)=>{let V=x[0],J=Math.abs(V.t-$);for(let v=1;v<x.length;v+=1){let O_=x[v],p_=Math.abs(O_.t-$);if(p_<=J)V=O_,J=p_;else if(O_.t>$)break}return V},cE=(x,$)=>{let V=Z.getBoundingClientRect();if(!V.width)return;let J=Math.max(n,Math.min(M-L,(x-V.left)/V.width*M)),v=Q+(J-n)/t*W;if(!F_)F_=!0,ME+=1;let O_=v,p_=[];for(let u of R){let K=N.get(u.key);if(!K||K.length===0)continue;let H=B(K,v);O_=H.t,p_.push({s:u,r:H.r});let m=w_.get(u.key);if(m)m.setAttribute("cx",H.x.toFixed(1)),m.setAttribute("cy",H.y.toFixed(1)),m.style.display=""}let z_=y(O_);C_.setAttribute("x1",z_.toFixed(1)),C_.setAttribute("x2",z_.toFixed(1)),C_.style.display="",c_.classList.add("is-scrubbing"),c_.replaceChildren();let U_=c("div","pq-readout-items");U_.appendChild(c("span","pq-readout-time pq-mono",FS(O_)));for(let{s:u,r:K}of p_){let H=BE(K),m=c("span","pq-readout-item"),V_=c("span","pq-fam-dot");V_.style.background=g_(u.key,u.group),m.appendChild(V_),m.appendChild(c("span","pq-muted",yo(u))),m.appendChild(c("strong",`pq-mono pq-lv-${H}`,D_(K))),U_.appendChild(m)}if(c_.appendChild(U_),$){let u=c("button","pq-readout-clear","×");u.type="button",u.title="关闭读数",u.addEventListener("click",(K)=>{K.stopPropagation(),Z_()}),c_.appendChild(u)}};return Z.addEventListener("pointerdown",(x)=>{let $=x.pointerType!=="mouse";if($)S_=!0;cE(x.clientX,$)}),Z.addEventListener("pointermove",(x)=>{let $=x.pointerType!=="mouse";if(!$||S_)cE(x.clientX,$)}),Z.addEventListener("pointerup",()=>{S_=!1}),Z.addEventListener("pointercancel",()=>{S_=!1}),Z.addEventListener("pointerleave",(x)=>{if(x.pointerType==="mouse")Z_()}),S.add(Z_),O.__pqClearScrub=Z_,o_.appendChild(Z),O.appendChild(o_),O},UE=(_,E)=>{let T=ZT.get(_);if(T){try{T()}catch{}y_.delete(T),ZT.delete(_)}let S=E.__pqClearScrub;if(S)ZT.set(_,S);_.replaceChildren(E)},lo=(_,E,T,S=!1)=>{let O=mT(E.id,T),f=BT.get(O),k=Date.now();if(f){if(UE(_,iT(f.data,T,E,y_)),!S&&k-f.fetchedAtMs<_S)return}else{let U=c("div","pq-chart-loading");U.textContent=`加载 ${T==="7d"?"7d":"5h"} 燃烧趋势…`,UE(_,U)}if(oE.has(O))return;oE.add(O),AE("GET","/panel/history",{query:{account:E.id,window:T,range:T==="7d"?"7d":"24h",...S?{force:"1"}:{}}}).then((U)=>{if(CE(U),!_.isConnected)return;if(OE(E.id)!==T)return;UE(_,iT(U,T,E,y_))}).catch(()=>{if(!_.isConnected)return;if(OE(E.id)!==T)return;if(!f)UE(_,c("div","pq-chart-empty","历史趋势暂不可用"))}).finally(()=>{oE.delete(O)})},uS=(_,E)=>{if(!_)return null;if(_.has_recent_buckets&&Array.isArray(_.recent_buckets)&&_.recent_buckets.length>0){let T=_.recent_buckets,S=_.recent_window_success||0,O=_.recent_window_failure||0,f=S+O>0,k=_.recent_window_rate,R=`近 ${_.recent_window_minutes||200}m 成功率`,M=c("div","pq-recent-strip"),C=c("div","pq-recent-top"),n=c("span","pq-recent-label pq-num",R);C.appendChild(n);let L=c("div","pq-recent-meta pq-mono");if(f){if(L.appendChild(c("span","pq-recent-ok",`✓${S}`)),O>0)L.appendChild(c("span","pq-recent-fail",`✕${O}`))}let Y=!f||k==null?"":k>=95?"is-high":k>=80?"is-med":"is-low",X=f&&k!=null?D_(k):"空闲";L.appendChild(c("span",`pq-rate-capsule ${Y}`,X)),C.appendChild(L),M.appendChild(C);let t=c("div","pq-buckets"),j=600000,F=(E||Date.now())-T.length*j,Q=null;return T.forEach((s,W)=>{let y=s.success||0,E_=s.failed||0,c_=y+E_,R_=c_===0,o_=c("div",`pq-bucket${R_?"":" is-active"}`);if(!R_)o_.style.background=HS(y/c_);let Z=s.time||`${jT(F+W*j,"hm")}-${jT(F+(W+1)*j,"hm")}`,f_=R_?`${Z} · 无请求`:`${Z} · ✓${y}${E_>0?` ✕${E_}`:""} (${D_(y/c_*100)})`;o_.title=f_;let d=()=>{if(Q&&Q!==o_)Q.classList.remove("is-focus");Q=o_,o_.classList.add("is-focus"),n.textContent=f_};o_.addEventListener("pointerenter",(N)=>{if(N.pointerType==="mouse")d()}),o_.addEventListener("click",(N)=>{if(N.stopPropagation(),Q===o_)o_.classList.remove("is-focus"),Q=null,n.textContent=R;else d()}),t.appendChild(o_)}),t.addEventListener("pointerleave",(s)=>{if(s.pointerType==="mouse"){if(Q)Q.classList.remove("is-focus");Q=null,n.textContent=R}}),M.appendChild(t),M}if(Array.isArray(_.recent_bars)&&_.recent_bars.length>0){let{recent_bars:T,recent_success_rate:S}=_,O=c("div","pq-recent-strip"),f=c("div","pq-recent-top");f.appendChild(c("span","pq-recent-label pq-num",`近 ${T.length} 次请求`));let k=S==null?"":S>=95?"is-high":S>=80?"is-med":"is-low";f.appendChild(c("span",`pq-rate-capsule pq-mono ${k}`,S!=null?D_(S):"--")),O.appendChild(f);let U=c("div","pq-buckets");for(let R of T){let M=c("div","pq-bucket is-active");M.style.background=R.ok?"var(--pq-healthy-bar)":"var(--pq-low-bar)",U.appendChild(M)}return O.appendChild(U),O}if(_.available&&_.success_rate!=null){let T=c("div","pq-recent-strip"),S=c("div","pq-recent-top");S.appendChild(c("span","pq-recent-label","历史成功率"));let O=_.success_rate,f=O>=95?"is-high":O>=80?"is-med":"is-low";return S.appendChild(c("span",`pq-rate-capsule pq-mono ${f}`,D_(O))),T.appendChild(S),T}return null},aS=(_)=>{let E=n_(_.remaining_percent),T=BE(E),S=c("div",`pq-win-active${T==="empty"?" is-empty":""}`),O=c("div","pq-win-top"),f=c("div","pq-win-name-wrap"),k=c("span","pq-fam-dot");k.style.background=g_(_.key,_.group),f.appendChild(k),f.appendChild(c("span","pq-win-name",_.label||_.key)),O.appendChild(f);let U=c("div","pq-win-val-wrap");if(T==="empty")U.appendChild(c("span","pq-pill pq-pill-empty","已耗尽"));U.appendChild(c("span",`pq-win-val pq-lv-${T}`,`剩 ${D_(E)}`)),O.appendChild(U),S.appendChild(O);let R=c("div",`pq-bar-track${T==="empty"?" is-empty":""}`),M=c("div",`pq-bar-fill pq-bar-${T}`);M.style.width=`${E}%`,R.appendChild(M),S.appendChild(R);let C=c("div","pq-win-sub"),n=c("div","pq-win-usage pq-mono");if(_.has_current_usage&&(_.current_cost>0||_.current_tokens>0)){let L=[`已用 ${HT(_.current_cost)}`];if(_.current_tokens>0)L.push(FT(_.current_tokens));if(n.appendChild(c("span","",L.join(" / "))),_.has_forecast&&_.forecast_cost>0){let Y=_.forecast_basis==="previous"?"参考":"预测";n.appendChild(c("span","",`· ${Y} ${HT(_.forecast_cost)}`))}}else n.appendChild(c("span","","本窗暂无费用记录"));if(C.appendChild(n),_.stale)C.appendChild(c("span","pq-win-reset pq-mono","待采样"));else if(_.reset_at_ms>0)C.appendChild(c("span","pq-win-reset pq-mono",`重置 ${jE(_.reset_at_ms)}`));return S.appendChild(C),S},lS=(_)=>{let E=c("div","pq-win-idle-tile"),T=c("div","pq-win-idle-top"),S=c("span","pq-win-idle-name"),O=c("span","pq-fam-dot");O.style.background=g_(_.key,_.group),S.appendChild(O),S.appendChild(c("span","",_.label||_.key)),T.appendChild(S),T.appendChild(c("span","pq-win-idle-pct pq-mono","100%")),E.appendChild(T);let f=c("div","pq-bar-track is-thin"),k=c("div","pq-bar-fill pq-bar-full");k.style.width="100%",f.appendChild(k),E.appendChild(f);let U=!_.stale&&_.reset_at_ms>0?`满血 · ${jE(_.reset_at_ms)}`:"满血未动用";return E.appendChild(c("div","pq-win-idle-sub pq-mono",U)),E},sS=(_,E,T)=>{let S=c("div","pq-acct-block"),O=c("div","pq-acct-head"),f=c("div","pq-acct-id");if(f.appendChild(c("span","pq-acct-name",_.code_name||_.id)),_.tier)f.appendChild(c("span",`pq-pill ${oS(_.tier)}`,_.tier));O.appendChild(f);let k=_.status_label||(_.status==="available"?"可用":_.status||"未知");O.appendChild(c("span",`pq-pill ${YS(_.status)}`,k)),S.appendChild(O);let U=uS(_.history,E);if(U)S.appendChild(U);let R=WS(_).sort((n,L)=>{let Y=Jo.indexOf(n.key),X=Jo.indexOf(L.key);return(Y===-1?99:Y)-(X===-1?99:X)}),M=R.filter(mo),C=R.filter((n)=>!mo(n));if(M.length>0){let n=c("div","pq-win-list");for(let L of M)n.appendChild(aS(L));S.appendChild(n)}if(C.length>0){let n=c("div",`pq-win-idle-grid${C.length===1?" is-single":""}`);for(let L of C)n.appendChild(lS(L));S.appendChild(n)}if(R.length===0)S.appendChild(c("div","pq-muted","暂无配额窗口采样"));if(_.has_history){let n=c("div","pq-chart-box"),L=c("div","pq-chart-head");L.appendChild(c("span","pq-chart-title","周期燃烧趋势"));let Y=c("div","pq-chart-tabs"),X=c("div","pq-chart-body");X.dataset.pqChartBody=_.id;let t=OE(_.id),j=null;j=KT(Y,{items:[{id:"5h",label:"5h"},{id:"7d",label:"7d"}],activeId:t,trackBackground:!0,onChange:(F)=>{if(F!=="5h"&&F!=="7d")return;SS.set(_.id,F),j?.update({activeId:F}),lo(X,_,F,!1)}}),T.push(()=>j?.dispose()),L.appendChild(Y),n.appendChild(L),n.appendChild(X),S.appendChild(n),lo(X,_,t,!1)}return S},vS=(_,E)=>{let T=c("div","pq-card"),S=_.antigravity,O=c("div","pq-card-head"),f=c("div","pq-card-head-left");if(f.appendChild(c("h4","pq-card-title","Antigravity 号池")),S.online&&S.accounts.length>1&&S.summary?.tier_counts)for(let C of["Ultra","Pro","Free"]){let n=S.summary.tier_counts[C]??0;if(n>0)f.appendChild(c("span",`pq-pill pq-num ${oS(C)}`,`${C}×${n}`))}O.appendChild(f);let k=c("div"),U=S.summary?.active_accounts??S.accounts.length,R=FE(k,{label:S.online?`${U} 号在线`:"离线",tone:S.online?S.status==="degraded"?"warning":"success":"error"});if(E.push(()=>R.dispose()),O.appendChild(k),T.appendChild(O),!S.online||!Array.isArray(S.accounts)||S.accounts.length===0)return T.appendChild(c("div","pq-muted",S.status_message||"暂无活跃 Antigravity 账号数据")),T;let M=c("div","pq-acct-list");for(let C of S.accounts)M.appendChild(sS(C,_.generated_at_ms,E));return T.appendChild(M),T},so=(_,E=!1)=>{let T=n_(_.effective_percent),S=_.eligible_accounts>0&&_.available_accounts===0,O=BE(T,S),f=c("div",`pq-model-row${O==="empty"?" is-empty":""}${E?" is-full-compact":""}`),k=c("div","pq-model-top");k.appendChild(c("span","pq-model-name",_.label||_.id));let U=c("div","pq-model-right");if(S)U.appendChild(c("span","pq-pill pq-pill-empty","已耗尽"));else if(!E&&_.eligible_accounts>0&&(T<99.5||_.used_requests>0||_.used_tokens>0)){let L=jo(_);U.appendChild(c("span",`pq-pill ${L?"pq-bottleneck-tok":"pq-bottleneck-req"}`,L?"Token 短板":"次数短板"))}U.appendChild(c("span",`pq-win-val pq-lv-${O}`,D_(T))),k.appendChild(U),f.appendChild(k);let R=c("div",`pq-bar-track${E?" is-thin":""}${O==="empty"?" is-empty":""}`),M=c("div",`pq-bar-fill pq-bar-${O}`);M.style.width=`${T}%`,R.appendChild(M),f.appendChild(R);let C=c("div","pq-win-sub"),n=_.cooling_accounts>0?`可用 ${_.available_accounts}/${_.eligible_accounts} 号 · ${_.cooling_accounts} 冷却`:`可用 ${_.available_accounts}/${_.eligible_accounts} 号`;return C.appendChild(c("span","pq-mono",n)),C.appendChild(c("span","pq-mono",`剩 ${_.effective_remaining_requests}次 / ${FT(_.effective_remaining_tokens)}`)),f.appendChild(C),f},eS=(_,E)=>{let T=c("div","pq-card"),S=_.aistudio,O=c("div","pq-card-head");O.appendChild(c("h4","pq-card-title","AIStudio2API 号池"));let f=c("div"),k=S.account_counts?.ready??0,U=S.account_counts?.enabled??0,R=FE(f,{label:S.online?`${k}/${U} 号就绪`:"离线",tone:S.online?k===U?"success":"warning":"error"});if(E.push(()=>R.dispose()),O.appendChild(f),T.appendChild(O),!S.online)return T.appendChild(c("div","pq-muted",S.status_message||"AIStudio2API 当前离线")),T;let M=c("div","pq-ais-meta pq-mono"),C=S.playground;if(M.appendChild(c("span","",`Playground ${C?.requests??0}次`)),S.next_reset_ms>0)M.appendChild(c("span","",`16:00 重置 · ${jE(S.next_reset_ms)}`));T.appendChild(M);let n=Array.isArray(S.models)?S.models:[];if(n.length===0)return T.appendChild(c("div","pq-muted","暂无模型配额数据")),T;let L=[],Y=[];for(let X of n)if(QS(X))L.push(X);else Y.push(X);if(L.sort((X,t)=>{let j=X.eligible_accounts>0&&X.available_accounts===0?0:1,F=t.eligible_accounts>0&&t.available_accounts===0?0:1;if(j!==F)return j-F;return n_(X.effective_percent)-n_(t.effective_percent)}),L.length>0){let X=c("div","pq-model-list");for(let t of L)X.appendChild(so(t,!1));T.appendChild(X)}if(Y.length>0){let X=c("div","pq-full-group"),t=c("button","pq-full-toggle");t.type="button";let j=c("span","pq-full-toggle-left"),F=c("span","pq-fam-dot");F.style.background="var(--pq-full-bar)",j.appendChild(F);let Q=c("span","pq-full-toggle-text"),s=(E_)=>L.length>0?`其余 ${Y.length} 个模型 100% 满血 · ${E_?"点击收起":"点击展开"}`:`全部 ${Y.length} 个模型 100% 满血 · ${E_?"点击收起":"点击展开"}`;Q.textContent=s($_),j.appendChild(Q);let W=c("span",`pq-chevron${$_?" is-open":""}`,"▾");t.appendChild(j),t.appendChild(W),t.setAttribute("aria-expanded",String($_));let y=c("div","pq-full-list");y.hidden=!$_;for(let E_ of Y)y.appendChild(so(E_,!0));t.addEventListener("click",()=>{$_=!$_,BS(),y.hidden=!$_,Q.textContent=s($_),W.classList.toggle("is-open",$_),t.setAttribute("aria-expanded",String($_))}),X.appendChild(t),X.appendChild(y),T.appendChild(X)}return T},AS=()=>{if(!gT)return;gT.setAttribute("aria-expanded",String(r_))},nE=(_)=>{OS(h_),h_=[],iE=null,xE=null;let E=p?.config.hasPasscode===!0,T=p?.config.showAis??!0,S=p?.config.compactQuota??!0,O=p?.config.url??TE,f=document.createDocumentFragment(),k=c("button","pq-settings-toggle");k.type="button",k.setAttribute("aria-expanded",String(r_)),k.appendChild(c("span","pq-card-title","连接与显示设置"));let U=c("span",`pq-chevron${r_?" is-open":""}`,"▾");if(k.appendChild(U),k.addEventListener("click",()=>{r_=!r_,AS(),nE(_)}),f.appendChild(k),!r_){let W=[T?"AIS 显示":"AIS 隐藏",S?"紧凑文案":"详细文案",ZS(O),E?"已设口令":"无口令"];f.appendChild(c("div","pq-settings-summary pq-mono",W.join(" · "))),_.replaceChildren(f);return}let R=c("div","pq-settings-body"),M=c("div","pq-settings-group");M.appendChild(c("div","pq-settings-section-label","显示偏好"));let C=c("div");iE=HE(C,{label:"显示 AIStudio 号池",description:"同时控制顶栏/Usage 总卡、Work Status 与本面板是否展示 AIS 模型余量",checked:T,disabled:JE,onChange:(W)=>void EO(W)}),h_.push(()=>iE?.dispose()),M.appendChild(C);let n=c("div");xE=HE(n,{label:"紧凑配额文案（适配手机端）",description:"精简手机端浮层与 Usage 总卡文案避免窄屏叠字；本面板始终展示完整数据",checked:S,disabled:gE,onChange:(W)=>void TO(W)}),h_.push(()=>xE?.dispose()),M.appendChild(n),R.appendChild(M);let L=c("div","pq-settings-group");L.appendChild(c("div","pq-settings-section-label","看板连接"));let Y=c("div"),X=YE(Y,{label:"看板地址 URL",value:TE,placeholder:"http://127.0.0.1:18380 或 https://your-board.example.com",mono:!0,onChange:(W)=>{TE=W,mE=!0,X.update({value:W})}});h_.push(()=>X.dispose()),L.appendChild(Y);let t=c("div"),j=YE(t,{label:"访问口令 (X-View-Passcode)",value:RE,password:!0,placeholder:E?"已保存口令（留空保存将保持原口令不变）":"若看板未设口令可留空",helper:"仅写入本机 0600 配置文件，不会回显给前端或暴露给对话上下文。",onChange:(W)=>{RE=W,j.update({value:W})}});if(h_.push(()=>j.dispose()),L.appendChild(t),B_){let W=c("div"),y=ZE(W,{tone:B_.tone,title:B_.text});h_.push(()=>y.dispose()),L.appendChild(W)}let F=c("div","pq-settings-actions"),Q=c("div"),s=X_(Q,{label:i_?"测试中...":"测试并保存",size:"sm",loading:i_,disabled:i_,onClick:()=>void vo(!1)});if(h_.push(()=>s.dispose()),F.appendChild(Q),E){let W=c("div"),y=X_(W,{label:"清空口令",variant:"outline",size:"sm",disabled:i_,onClick:()=>void vo(!0)});h_.push(()=>y.dispose()),F.appendChild(W)}L.appendChild(F),R.appendChild(L),f.appendChild(R),_.replaceChildren(f)},_O=(_,E)=>{let T=_.antigravity?.accounts??[];for(let S=1;S<T.length;S+=1){let O=T[S];if(!O.has_history)continue;let f=OE(O.id),k=mT(O.id,f),U=BT.get(k);if(!E&&U&&Date.now()-U.fetchedAtMs<_S)continue;if(oE.has(k))continue;oE.add(k),AE("GET","/panel/history",{query:{account:O.id,window:f,range:f==="7d"?"7d":"24h",...E?{force:"1"}:{}}}).then((R)=>{CE(R);let M=document.querySelector(`[data-pq-chart-body="${CSS.escape(O.id)}"]`);if(M&&OE(O.id)===f)UE(M,iT(R,f,O,y_))}).catch(()=>{}).finally(()=>{oE.delete(k)})}},$E=async(_=!1,E=!1)=>{if(m_)return;if(m_=!0,!p)Y_();else if(!E)JT?.update({loading:!0});let T=p?.snapshot?.antigravity?.accounts?.[0]?.id,S=T?OE(T):"5h";try{let O=await AE("GET","/panel/state",{query:{force:_?"1":"0",window:S,range:S==="7d"?"7d":"24h"}});if(p=O,CE(O.history),!mE)TE=O.config.url;if(O.errorCode==="unauthorized"||O.errorCode==="unreachable")r_=!0;if(Y_(),O.snapshot)_O(O.snapshot,_)}catch(O){let f=O instanceof G&&O.code==="NO_SERVICE"?"请先在 Settings → Extensions 中批准本扩展的本地服务权限。":O instanceof Error?O.message:String(O);p={config:p?.config??{url:TE,hasPasscode:!1,showAis:!0,compactQuota:!0},snapshot:p?.snapshot??null,history:p?.history??null,error:f,errorCode:"unreachable",fetchedAtMs:Date.now()},r_=!0,Y_()}finally{m_=!1,JT?.update({loading:!1})}},EO=async(_)=>{if(JE)return;JE=!0;let E=p?.config.showAis??!0;if(iE?.update({checked:_,disabled:!0}),p)p={...p,config:{...p.config,showAis:_}},Y_();try{let T=await AE("POST","/panel/config",{body:{showAis:_}});p=T,CE(T.history),N_.toast({kind:"success",message:_?"已开启 AIStudio 号池显示（Usage 与顶栏刷新后同步）":"已隐藏 AIStudio 号池（Usage 与顶栏刷新后同步）"})}catch(T){if(p)p={...p,config:{...p.config,showAis:E}};N_.toast({kind:"error",message:T instanceof Error?T.message:"切换失败"})}finally{JE=!1,Y_()}},TO=async(_)=>{if(gE)return;gE=!0;let E=p?.config.compactQuota??!0;if(xE?.update({checked:_,disabled:!0}),p)p={...p,config:{...p.config,compactQuota:_}};try{let T=await AE("POST","/panel/config",{body:{compactQuota:_}});p=T,CE(T.history),N_.toast({kind:"success",message:_?"已开启紧凑配额文案（适配手机端，Usage 刷新后同步）":"已切换为详细配额文案（Usage 刷新后同步）"})}catch(T){if(p)p={...p,config:{...p.config,compactQuota:E}};N_.toast({kind:"error",message:T instanceof Error?T.message:"切换失败"})}finally{gE=!1,xE?.update({checked:p?.config.compactQuota??E,disabled:!1})}},vo=async(_=!1)=>{if(i_=!0,B_={tone:"info",text:"正在测试连接..."},Q_)nE(Q_);try{let E=await AE("POST","/panel/test",{body:{url:TE.trim()||"http://127.0.0.1:18380",...RE?{passcode:RE}:{},..._?{clearPasscode:!0}:{},showAis:p?.config.showAis??!0,compactQuota:p?.config.compactQuota??!0,save:!0}});if(!E.ok){B_={tone:"error",text:E.message||"连接测试失败"},N_.toast({kind:"error",message:E.message||"连接测试失败"});return}RE="",mE=!1,B_={tone:"success",text:E.summary||"连接成功并已保存"},N_.toast({kind:"success",message:E.summary||"配置已保存"}),await $E(!0,!1)}catch(E){let T=E instanceof Error?E.message:String(E);B_={tone:"error",text:T},N_.toast({kind:"error",message:T})}finally{if(i_=!1,Q_)nE(Q_);else Y_()}},Y_=()=>{let _=mS();if(_.prevHeight>0)SE.style.minHeight=`${Math.ceil(_.prevHeight)}px`;let E=[],T=new Set,S=y_;y_=T,ME=0;let O=c("div","pq-wrap"),f=p?.config.showAis??!0,k=c("div","pq-header"),U=c("div","pq-brand");if(U.appendChild(c("h3","pq-title","Pool Quota")),m_&&!p){let X=c("div"),t=YT(X,{size:"sm"});E.push(()=>t.dispose()),U.appendChild(X)}else if(p?.snapshot){let X=c("div","pq-pool-dots"),t=p.snapshot.antigravity,j=p.snapshot.aistudio,F=!t.online?"is-err":t.status==="degraded"?"is-warn":"is-ok",Q=c("span",`pq-dot-chip ${F}`);if(Q.appendChild(c("span","pq-dot")),Q.appendChild(document.createTextNode("AG")),X.appendChild(Q),f){let s=j.account_counts?.ready??0,W=j.account_counts?.enabled??0,y=!j.online?"is-err":s<W?"is-warn":"is-ok",E_=c("span",`pq-dot-chip ${y}`);E_.appendChild(c("span","pq-dot")),E_.appendChild(document.createTextNode("AIS")),X.appendChild(E_)}U.appendChild(X)}k.appendChild(U);let R=c("div","pq-actions"),M=c("div"),C=X_(M,{label:"刷新",variant:"outline",size:"xs",loading:m_,onClick:()=>void $E(!0,!1)});if(E.push(()=>C.dispose()),R.appendChild(M),p?.config.url){let X=c("div"),t=X_(X,{label:"看板",variant:"ghost",size:"xs",onClick:()=>{if(p?.config.url)N_.openUrl(p.config.url)}});E.push(()=>t.dispose()),R.appendChild(X)}let n=c("button","pq-icon-btn");if(n.type="button",n.title="连接与显示设置",n.setAttribute("aria-label","连接与显示设置"),n.setAttribute("aria-expanded",String(r_)),n.appendChild(JS()),n.addEventListener("click",()=>{if(r_=!r_,AS(),Q_){if(nE(Q_),r_)requestAnimationFrame(()=>{Q_?.scrollIntoView({behavior:"smooth",block:"nearest"})})}}),R.appendChild(n),k.appendChild(R),O.appendChild(k),p?.error){let X=c("div"),t=ZE(X,{tone:p.errorCode==="unauthorized"?"warning":"error",title:p.errorCode==="unauthorized"?"需要访问口令":"看板连接异常",body:p.error});E.push(()=>t.dispose()),O.appendChild(X)}if(p?.snapshot){if(O.appendChild(vS(p.snapshot,E)),f)O.appendChild(eS(p.snapshot,E))}else if(!m_&&!p?.error){let X=c("div"),t=QT(X,{title:"尚未读取到号池数据",body:"请在下方「连接与显示设置」中填写看板地址与访问口令后点击测试并保存。",action:{label:"重试",onClick:()=>void $E(!0,!1)}});E.push(()=>t.dispose()),O.appendChild(X)}let L=c("div","pq-card");if(O.appendChild(L),p?.fetchedAtMs){let X=new Date(p.fetchedAtMs).toLocaleTimeString(),t=c("div","pq-footer-note pq-mono");t.appendChild(c("span","",`更新于 ${X}`)),t.appendChild(c("span","","Settings → Usage 可置顶总卡")),O.appendChild(t)}let Y=uo;uo=E,JT=C,gT=n,Q_=L,OS(Y),S.clear(),nE(L),SE.replaceChildren(O),yS(_)},oO=()=>{if(ao!==null)return;ao=window.setInterval(()=>{if(document.visibilityState!=="visible")return;if(m_||i_||mE||ME>0)return;let _=document.activeElement?.tagName;if(_==="INPUT"||_==="TEXTAREA")return;$E(!1,!0)},zS)};jS();N_.onReady((_)=>{if(pT(_,document.documentElement),qo)return;qo=!0,Y_(),iS(),$E(!1,!1),oO()});})();
