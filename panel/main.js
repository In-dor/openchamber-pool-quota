(()=>{var C="openchamber.sdk",a=1;var R_=`
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
`;function U_(o){let c=o.documentElement;if(c.hasAttribute("data-oc-scrollbar-activity"))return;c.setAttribute("data-oc-scrollbar-activity","");let t=new WeakMap;o.addEventListener("scroll",(T)=>{let S=T.target===o?c:T.target;if(!(S instanceof Element))return;if(!S.hasAttribute("data-oc-scrolling"))S.setAttribute("data-oc-scrolling","");let n=t.get(S);if(n!==void 0)clearTimeout(n);t.set(S,setTimeout(()=>{t.delete(S),S.removeAttribute("data-oc-scrolling")},1000))},{capture:!0,passive:!0})}var Ct=`(${U_.toString()})(document);`;var i_=128,x_=65536;var Ho=128;var Fo=65536;var M_=8000,b_=192000,C_=120000;var ac=(o)=>{let c=[],t=0,T=0;return{push:(S)=>{c.push(S),T+=S.length;while(T-t>o&&c.length>1){let n=c.shift();T-=n?.length??0,t=0}},pull:(S)=>{let n=0;while(n<S.length&&c.length>0){let d=c[0],f=Math.min(S.length-n,d.length-t);if(S.set(d.subarray(t,t+f),n),n+=f,t+=f,t>=d.length)c.shift(),T-=d.length,t=0}S.fill(0,n)},clear:()=>{c.length=0,t=0,T=0},get size(){return T-t}}};var Gc=/^[a-z][a-z0-9-]{0,39}$/;var sc=(o)=>Object(o)===o&&!Array.isArray(o),a_=(o,c)=>Object.keys(o).every((t)=>c.includes(t)),$c=(o)=>String(o)===o&&o.length>=1&&o.length<=60,Nc=(o)=>String(o)===o&&o.length>=1&&o.length<=80,hc=(o)=>{if(!Array.isArray(o)||o.length>4)return!1;let c=new Set;for(let t of o){if(!sc(t)||!Gc.test(t.id)||!$c(t.label))return!1;if(t.disabled!==void 0&&t.disabled!==!0&&t.disabled!==!1)return!1;if(c.has(t.id))return!1;if(c.add(t.id),t.kind==="button"){if(!a_(t,["kind","id","label","disabled"]))return!1;continue}if(t.kind!=="select"||!a_(t,["kind","id","label","value","options","disabled"]))return!1;if(!Nc(t.value)||!Array.isArray(t.options)||t.options.length<1||t.options.length>16)return!1;let T=new Set;for(let S of t.options){if(!sc(S)||!a_(S,["value","label"])||!Nc(S.value)||!$c(S.label)||T.has(S.value))return!1;T.add(S.value)}if(!T.has(t.value))return!1}return!0};var Lc=["{id}","{segment}","{segments+}"];var nE=new Set(Lc);var Vc=["turn-finished","turn-failed","permission-asked","question-asked","turn-started","session-created","session-archived","session-deleted"];var OE=new Set(Vc);var Bo=20000000,uo=256;var s_=(o)=>("bytes"in o)?o.bytes.byteLength:o.content.length,Xc=(o,c)=>{if(o.path!==c.path||o.readOnly!==c.readOnly)return!1;if(o.encoding==="text"||c.encoding==="text")return o.encoding==="text"&&c.encoding==="text"&&o.content===c.content;if(o.bytes.byteLength!==c.bytes.byteLength)return!1;for(let t=0;t<o.bytes.byteLength;t+=1)if(o.bytes[t]!==c.bytes[t])return!1;return!0};var gc=/^[A-Za-z0-9_-]{1,80}$/;var Pc=["left","right","top","bottom"];var Dc=(o,c=0,t={remaining:16000})=>{if(--t.remaining<0||c>=32)return!1;if(o===null)return!0;let T=Array.isArray(o)?o:Object(o)===o?Object.values(o):[];for(let S of T)if(!Dc(S,c+1,t))return!1;return!0},$_=(o)=>{if(o===null||o===!0||o===!1)return!0;if(Array.isArray(o))return Object.keys(o).every((c)=>/^(0|[1-9]\d*)$/.test(c)&&Number(c)<o.length)&&o.every($_);if(Object(o)===o){let c=Object.getPrototypeOf(o);return(c===null||c===Object.prototype)&&Object.values(o).every($_)}return String(o)===o||Number.isFinite(o)},N_=(o)=>{try{if(String(o.id)!==o.id||!gc.test(o.id)||!Number.isFinite(o.anchor.x)||Math.abs(o.anchor.x)>1e5||!Number.isFinite(o.anchor.y)||Math.abs(o.anchor.y)>1e5||!Number.isFinite(o.anchor.width)||!Number.isFinite(o.anchor.height)||o.anchor.width<=0||o.anchor.height<=0||o.anchor.width>1e5||o.anchor.height>1e5||!Number.isInteger(o.width)||o.width<160||o.width>640||!Number.isInteger(o.height)||o.height<48||o.height>480||o.side!==void 0&&!Pc.includes(o.side)||o.focus!==void 0&&o.focus!==!0&&o.focus!==!1||!Dc(o.data)||!$_(o.data))return!1;return JSON.stringify(o.data).length<=16000}catch{return!1}};var lc=/^[0-9a-f]{7,64}$/i,Wc=(o)=>lc.test(o),G_=255,mc=(o,c,t)=>({openCommit:(T)=>Wc(T)?o({channel:C,v:a,type:"open-commit",id:c(),payload:{sha:T}}):t("Commit id must be 7 to 64 hex characters."),openWalkthrough:({base:T})=>{let S=T.trim();if(!S||S.length>G_)return t(`Base must contain 1 to ${G_} characters.`);return o({channel:C,v:a,type:"open-walkthrough",id:c(),payload:{base:S}})}});var L_=2000;var Kc=["file","directory","other","missing"],V_=(o)=>Boolean(o&&"sessionId"in o),X_=(o)=>Boolean(o&&"sent"in o&&!("sessionId"in o));var Yo=500,Qo=32000,wc=16000,yc=128,Hc=200,Fc=2000,Bc=16000,uc=80,Yc=200,Qc=16000;var jc=2000;var g_=20000,jo=1024,Zo=2000000;var Jo=64000,qo=8000,P_=4000;var D_=960000;var Zc=999,Jc=1e4,Do=500,qc=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],vc=["stopped","starting","ready","failed"],st=new Set(qc),ec=(o)=>st.has(o),ot=(o)=>o&&ec(o)?o:"HOST_REJECTED",Mo=(o)=>{if(o===void 0)return!1;if(o===null||o===!0||o===!1)return!0;if(String(o)===o)return!0;if(Number(o)===o)return Number.isFinite(o);if(Array.isArray(o))return o.every(Mo);if(Object(o)===o)return Object.values(o).every(Mo);return!1},_t=(o)=>Mo(o)&&JSON.stringify(o).length<=Qc,zc=(o)=>o?.trim().slice(0,Yc)??"",bo=(o)=>{let c=o.id.trim().slice(0,yc),t=o.title.trim().slice(0,Hc),T=o.url.trim().slice(0,Fc),S=o.text?.trim().slice(0,Bc),n=o.author?.trim().slice(0,uc),d=o.kind==="pull"?"pull":"issue",f={providerId:o.providerId.trim(),id:c,title:t||c,url:T,kind:d};if(S)f.text=S;if(n)f.author=n;if(d==="pull"){let I=zc(o.branches?.head),i=zc(o.branches?.base);if(I&&i)f.branches={head:I,base:i}}if(_t(o.data))f.data=o.data;return f},l_=(o)=>{let c=bo(o);if(o.projectId)c.projectId=o.projectId;if(o.navigation)c.navigation=o.navigation;if(o.worktree)c.worktree=o.worktree;return c},W_=(o)=>{let c={text:o.text.trim().slice(0,wc)};if(o.send)c.send=!0;return c},m_=(o)=>{if(o===null||!Number.isFinite(o))return null;return Math.min(Zc,Math.max(0,Math.round(o)))},z_=(o)=>{if(!Number.isFinite(o))return 0;return Math.min(Jc,Math.max(0,Math.ceil(o)))};var Co=(o)=>o.length>0&&o.length<=jo&&!o.includes("\x00")&&!o.includes("\\");var vo=(o)=>{if(!o.startsWith("/")||o.includes("\x00")||o.includes("\\")||o.includes("://"))return!1;if(o.length>jc)return!1;return!o.split("/").some((t)=>t==="."||t==="..")},$t=new Set(vc),K_=(o)=>Boolean(o&&"status"in o&&$t.has(String(o.status))&&!("body"in o)),eo=(o)=>Boolean(o&&"status"in o&&"body"in o&&Number.isInteger(o.status)),w_=(o)=>Boolean(o&&"content"in o&&String(o.content)===o.content),y_=(o)=>Boolean(o&&"written"in o&&o.written===!0),H_=(o)=>Boolean(o&&"entries"in o&&Array.isArray(o.entries)),Nt=new Set(Kc),F_=(o)=>Boolean(o&&"kind"in o&&"size"in o&&Nt.has(String(o.kind))&&Number.isFinite(o.size)),B_=(o)=>Boolean(o&&"text"in o&&String(o.text)===o.text&&!("status"in o)),Gt=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","service-event","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late","microphone-audio","microphone-ended"]),ht=(o)=>Object(o)===o?o:null,h_=(o)=>String(o)===o&&o.length>0,Lt=(o)=>{if(!h_(o.id))return null;if(o.ok===!0){let c={channel:C,v:a,type:"result",id:o.id,ok:!0};if(Object(o.payload)===o.payload)c.payload=o.payload;return c}if(o.ok===!1&&h_(o.error))return{channel:C,v:a,type:"result",id:o.id,ok:!1,error:o.error,code:ot(h_(o.code)?o.code:void 0)};return null},u_=(o)=>{let c=ht(o);if(!c||c.channel!==C||c.v!==a)return null;if(c.type==="result")return Lt(c);if(!Gt.has(String(c.type))||Object(c.payload)!==c.payload)return null;return c};var ct=(o)=>("key"in o)&&("metaKey"in o)&&("ctrlKey"in o),Vt=(o)=>(o.metaKey||o.ctrlKey)&&!o.altKey&&!o.shiftKey&&o.key.toLowerCase()==="s";class R extends Error{code;constructor(o,c){super(c);this.name="HostRequestError",this.code=o}}var tt=()=>Promise.reject(new R("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),o_=()=>Promise.reject(new R("BAD_PATH",`File path must be 1 to ${jo} characters without NUL or backslash.`)),__=(o)=>{if(o===void 0)return;if(Object(o)!==o||Array.isArray(o)||o.scope!==void 0&&o.scope!=="instance"&&o.scope!=="device")throw new R("HOST_REJECTED",'Storage scope must be "instance" or "device".');return o.scope==="device"?"device":void 0},M=(o)=>{return o.value+=1,`oc-${o.value}`},Y_=(o={})=>{let c=o.target??("window"in globalThis?window:null);if(!c)throw new R("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let t=o.acceptSource??((_)=>_===c.parent),T=o.requestTimeoutMs??g_,S=new Set,n=new Set,d=new Set,f=new Set,I=new Set,i=new Set,O=new Set,$=new Set,B=new Set,H=new Set,W=new Set,F=new Set,L=[],V=null,N=null,co=new Set,v=new Set,to=null,Io=null,Xo=!1,Eo=new Map,fo=new Map,ko=new Map,Z=!1,x={value:0},U=null,no=null,go=!1,Po=!1,dc=null,J=null,fc=(_)=>{if(!_)return null;return{sessionId:_.id,phase:_.busy?"started":"completed"}},Q=(_)=>{c.parent.postMessage(_,"*")},kc=()=>{if(Z||c.parent===c||F.size===0||U?.features?.lateGenerateResults!==!0)return;Q({channel:C,v:a,type:"generate-late-listen"})},X=(_,E)=>{for(let p of _)try{p(E)}catch(k){console.error(k)}},pc=(_)=>{if(!(_ instanceof MessageEvent))return;if(!t(_.source))return;let E=u_(_.data);if(!E)return;if(E.type==="workspace"){let k=fo.get(E.payload.subscriptionId);if(k)X([k],E.payload.snapshot);return}if(E.type==="shells"){let k=ko.get(E.payload.subscriptionId);if(k)X([k],E.payload.snapshot);return}if(E.type==="microphone-audio"){J?.queue.push(E.payload.samples);return}if(E.type==="microphone-ended"){let k=J;if(!k)return;J=null,k.release(),X(k.endedListeners,E.payload.reason);return}if(E.type==="ready"){if(U=E.payload,no=fc(E.payload.session),X(S,E.payload),X(n,E.payload.directory),X(d,E.payload.session),no)X(f,no);if(X(I,E.payload.connection),X(i,E.payload.settings),X(O,E.payload.item),E.payload.block)X($,E.payload.block);kc();return}if(E.type==="service-event"){X(B,E.payload);return}if(E.type==="generate-late"){if(F.size===0)L.push(E.payload);else X(F,E.payload);return}if(E.type==="directory"){if(U)U={...U,directory:E.payload.directory};X(n,E.payload.directory);return}if(E.type==="session"){if(U)U={...U,session:E.payload.session};if(!E.payload.session)no=null;else if(no?.sessionId!==E.payload.session.id)no=fc(E.payload.session);X(d,E.payload.session);return}if(E.type==="session-lifecycle"){no=E.payload,X(f,E.payload);return}if(E.type==="connection"){if(U)U={...U,connection:E.payload.connection};X(I,E.payload.connection);return}if(E.type==="settings"){if(U)U={...U,settings:E.payload.settings};X(i,E.payload.settings);return}if(E.type==="item"){if(U)U={...U,item:E.payload.item};X(O,E.payload.item);return}if(E.type==="status-control-event"){X(H,E.payload);return}if(E.type==="popover-closed"){X(W,E.payload);return}if(E.type==="action"){let k=(h)=>{if(!Z)Q({channel:C,v:a,type:"action-result",id:E.id,payload:h})},G=N;if(!G){k({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>G(E.payload)).then(()=>k({ok:!0}),(h)=>{let g=(h instanceof Error?h.message:String(h)).trim();k({ok:!1,error:(g||"Action failed.").slice(0,Do)})});return}if(E.type==="file-open"){let k=E.payload;if(Io&&Xc(Io,k))return;Io=k,X(co,E.payload);return}if(E.type==="file-saved"){X(v,E.payload.version);return}if(E.type==="file-snapshot"){let k=(g)=>{if(!Z)Q({channel:C,v:a,type:"file-snapshot-result",id:E.id,payload:g})},G=(g)=>k({error:(g.trim()||"Could not read the edited file.").slice(0,Do)}),h=to;if(!h){G("This extension does not edit files.");return}Promise.resolve().then(()=>h(E.payload.purpose)).then((g)=>{if(s_(g)>Bo){G(`The file is over ${Bo} ${"bytes"in g?"bytes":"characters"}.`);return}if(g.version.length>uo){G(`The snapshot version is over ${uo} characters.`);return}k({snapshot:"bytes"in g?{bytes:g.bytes,version:g.version}:{content:g.content,version:g.version}})},(g)=>G(g instanceof Error?g.message:String(g)));return}if(E.type==="resolve"){let k=(h)=>{Q({channel:C,v:a,type:"resolve-result",id:E.id,payload:h})},G=V;if(!G){k({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>G(E.payload)).then((h)=>k({item:h?bo(h):null}),(h)=>{let g=(h instanceof Error?h.message:String(h)).trim();k({error:(g||"Command failed.").slice(0,Do)})});return}let p=Eo.get(E.id);if(!p)return;if(clearTimeout(p.timer),Eo.delete(E.id),E.ok){p.resolve(E.payload);return}p.reject(new R(E.code,E.error))};c.addEventListener("message",pc),Q({channel:C,v:a,type:"hello"});let u=(_,E=T)=>{if(Z||c.parent===c)return Promise.reject(new R("HOST_UNAVAILABLE","No host frame. This page is not in an iframe."));return new Promise((p,k)=>{let G=setTimeout(()=>{Eo.delete(_.id),k(new R("HOST_TIMEOUT","Host did not answer in time."))},E);Eo.set(_.id,{resolve:p,reject:k,timer:G}),Q(_)})},w=(_)=>u(_).then(()=>{return}),m={channel:C,v:a},f_=(_)=>{if(!Z&&c.parent!==c)Q(_)},Ic=()=>f_({...m,type:"file-save"}),k_=()=>{if(!Z&&c.parent!==c)Q({...m,type:"microphone-close",id:M(x)})},Mt=async()=>{if(J)throw new R("HOST_REJECTED","The microphone is already open in this frame.");if(U?.features?.microphone!==!0)throw new R("UNSUPPORTED","This OpenChamber cannot share the microphone with extensions.");let _=globalThis.AudioContext;if(typeof _!=="function")throw new R("UNSUPPORTED","This frame has no Web Audio.");let E=new _;if(E.sampleRate<M_||E.sampleRate>b_)throw E.close().catch(()=>{return}),new R("UNSUPPORTED",`Audio at ${E.sampleRate} Hz is not supported.`);let p=E.state==="suspended"?E.resume().catch(()=>{return}):void 0,k=ac(Math.round(E.sampleRate/4)),G=E.createScriptProcessor(1024,1,1);G.onaudioprocess=(e)=>k.pull(e.outputBuffer.getChannelData(0));let h=E.createMediaStreamDestination();G.connect(h);let g=new Set,xo={queue:k,endedListeners:g,release:()=>{G.onaudioprocess=null,G.disconnect(),k.clear();for(let e of h.stream.getTracks())e.stop();E.close().catch(()=>{return})}};J=xo;try{let e=await u({...m,type:"microphone-open",id:M(x),payload:{sampleRate:E.sampleRate}},C_);if(!e||!("opened"in e)||e.opened!==!0)throw new R("HOST_REJECTED","Host did not open the microphone.");if(await p,J!==xo)throw new R("DISCONNECTED","The microphone closed while it was opening.")}catch(e){if(J===xo)J=null;throw xo.release(),k_(),e}return{stream:h.stream,close:()=>{if(J!==xo)return;J=null,xo.release(),k_()},onEnded:(e)=>{return g.add(e),()=>{g.delete(e)}}}},Rc=(_)=>{if(!ct(_)||!Vt(_))return;_.preventDefault(),Ic()},Uc=(_)=>{if(!ct(_)||_.key!=="Escape"||U?.surface!=="popover"||!U.popover)return;_.preventDefault(),bc(U.popover.id,"escape").catch(()=>{return})},Ko=()=>{let _=U?.surface==="popover"?U.popover:void 0;if(!_)return;let E=go||Po;if(dc===E)return;dc=E,Cc(_.id,E).catch(()=>{return})},wo=()=>{if(U?.surface!=="popover"||go)return;go=!0,Ko()},ic=(_)=>{if(U?.surface!=="popover"||_.relatedTarget!==null||!go)return;go=!1,Ko()},xc=()=>{if(U?.surface!=="popover"||Po)return;Po=!0,Ko()},Mc=()=>{if(U?.surface!=="popover"||!Po)return;Po=!1,Ko()},oo=(_,E=1024)=>{if(!_.trim()||_.length>E)throw new R("HOST_REJECTED",`Identity must contain 1 to ${E} characters.`)},p_=async(_)=>{if(_.kind!=="projects")oo(_.projectId);let E=await u({...m,type:"workspace-read",id:M(x),payload:_});if(!E||!("kind"in E)||!("state"in E)||E.kind!==_.kind)throw new R("HOST_REJECTED","Host did not return workspace data.");return E},I_=async(_,E)=>{if(_.kind!=="projects")oo(_.projectId);let p=M(x);fo.set(p,E);try{await w({...m,type:"workspace-subscribe",id:M(x),payload:{subscriptionId:p,query:_}})}catch(k){if(fo.delete(p),!Z)Q({...m,type:"workspace-unsubscribe",id:M(x),payload:{subscriptionId:p}});throw k}return()=>{if(!fo.delete(p)||Z)return;Q({...m,type:"workspace-unsubscribe",id:M(x),payload:{subscriptionId:p}})}},bt=async(_,E)=>{if(_.kind==="session")oo(_.sessionId);if(_.kind==="project")oo(_.projectId);let p=M(x);ko.set(p,E);try{await w({...m,type:"shells-subscribe",id:M(x),payload:{subscriptionId:p,scope:_}})}catch(k){if(ko.delete(p),!Z)Q({...m,type:"shells-unsubscribe",id:M(x),payload:{subscriptionId:p}});throw k}return()=>{if(!ko.delete(p)||Z)return;Q({...m,type:"shells-unsubscribe",id:M(x),payload:{subscriptionId:p}})}},yo=async(_)=>{if("key"in _&&(_.key.length===0||_.key.length>i_))throw new R("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(_.op==="set"&&!Mo(_.value))throw new R("HOST_REJECTED","Storage values must be JSON.");if(_.op==="set"&&new TextEncoder().encode(JSON.stringify(_.value)).length>x_)throw new R("HOST_REJECTED","Storage value exceeds 64 KiB.");if(_.scope==="device"&&U?.features?.deviceStorage!==!0)throw new R("UNSUPPORTED","This host does not support device storage.");let E=await u({...m,type:"storage",id:M(x),payload:_});if(!E||!("storage"in E)||E.op!==_.op)throw new R("HOST_REJECTED","Host did not return storage data.");return E},bc=(_,E)=>U?.features?.popovers!==!0&&!(U?.surface==="popover"&&U.popover?.id===_)?Promise.reject(new R("UNSUPPORTED","This host does not support popovers.")):w({...m,type:"popover-close",id:M(x),payload:E?{id:_,reason:E}:{id:_}}),Cc=(_,E)=>U?.features?.popovers!==!0&&!(U?.surface==="popover"&&U.popover?.id===_)?Promise.reject(new R("UNSUPPORTED","This host does not support popovers.")):w({...m,type:"popover-anchor",id:M(x),payload:{id:_,active:E}});return c.addEventListener("keydown",Uc,!0),c.addEventListener("pointerover",wo),c.addEventListener("pointermove",wo),c.addEventListener("pointerout",ic),c.addEventListener("focus",xc),c.addEventListener("blur",Mc),{onAction:(_)=>{return N=_,()=>{if(N===_)N=null}},listProjects:async()=>{let _=await p_({kind:"projects"});if(_.kind!=="projects")throw new R("HOST_REJECTED","Expected projects.");return _},listWorktrees:async(_)=>{let E=await p_({kind:"worktrees",projectId:_});if(E.kind!=="worktrees")throw new R("HOST_REJECTED","Expected worktrees.");return E},listSessions:async(_)=>{let E=await p_({kind:"sessions",projectId:_});if(E.kind!=="sessions")throw new R("HOST_REJECTED","Expected sessions.");return E},onProjects:(_)=>I_({kind:"projects"},(E)=>{if(E.kind==="projects")_(E)}),onWorktrees:(_,E)=>I_({kind:"worktrees",projectId:_},(p)=>{if(p.kind==="worktrees")E(p)}),onSessions:(_,E)=>I_({kind:"sessions",projectId:_},(p)=>{if(p.kind==="sessions")E(p)}),onRunningShells:(_,E)=>bt(_,E),readShellOutput:async(_,E)=>{oo(_,Ho);let p=E?.cursor;if(p!==void 0&&(!Number.isInteger(p)||p<0))throw new R("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let k=E?.tailBytes;if(k!==void 0&&(!Number.isInteger(k)||k<1||k>Fo))throw new R("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${Fo}.`);let h=await u({...m,type:"shell-output",id:M(x),payload:{shellId:_,cursor:p,tailBytes:k}});if(!h||typeof h.output!=="string"||!Number.isFinite(h.cursor))throw new R("HOST_REJECTED","Host did not return shell output.");return h},stopShell:async(_)=>{if(oo(_,Ho),(await u({...m,type:"shell-stop",id:M(x),payload:{shellId:_}}))?.stopped!==!0)throw new R("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async(_)=>{oo(_),await w({...m,type:"open-session",id:M(x),payload:{sessionId:_}})},storage:{get:async(_,E)=>{let p=__(E),k={op:"get",key:_};if(p)k.scope=p;let G=await yo(k);return G.op==="get"&&G.found?G.value:void 0},set:async(_,E,p)=>{let k=__(p),G={op:"set",key:_,value:E};if(k)G.scope=k;await yo(G)},delete:async(_,E)=>{let p=__(E),k={op:"delete",key:_};if(p)k.scope=p;await yo(k)},keys:async(_)=>{let E=__(_),p={op:"keys"};if(E)p.scope=E;let k=await yo(p);if(k.op!=="keys")throw new R("HOST_REJECTED","Expected storage keys.");return k.keys}},onReady:(_)=>{if(S.add(_),U)_(U);return()=>{S.delete(_)}},onDirectory:(_)=>{if(n.add(_),U)_(U.directory);return()=>{n.delete(_)}},onSession:(_)=>{if(d.add(_),U)_(U.session);return()=>{d.delete(_)}},onSessionLifecycle:(_)=>{if(f.add(_),no)_(no);return()=>{f.delete(_)}},onConnection:(_)=>{if(I.add(_),U)_(U.connection);return()=>{I.delete(_)}},onSettings:(_)=>{if(i.add(_),U)_(U.settings);return()=>{i.delete(_)}},onItem:(_)=>{if(O.add(_),U)_(U.item);return()=>{O.delete(_)}},onBlock:(_)=>{if($.add(_),U?.block)_(U.block);return()=>{$.delete(_)}},onServiceEvent:(_)=>{return B.add(_),()=>{B.delete(_)}},onStatusControl:(_)=>{return H.add(_),()=>{H.delete(_)}},onPopoverClosed:(_)=>{return W.add(_),()=>{W.delete(_)}},setStatusControls:(_)=>{if(U?.features?.statusControls!==!0)return Promise.reject(new R("UNSUPPORTED","This host does not support status controls."));if(!hc(_))return Promise.reject(new R("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options."));return w({...m,type:"status-controls",id:M(x),payload:{controls:_}})},openPopover:(_)=>{if(U?.features?.popovers!==!0)return Promise.reject(new R("UNSUPPORTED","This host does not support popovers."));if(!N_(_))return Promise.reject(new R("HOST_REJECTED","Popover requests need bounded geometry and JSON data."));return w({...m,type:"popover-open",id:M(x),payload:_})},closePopover:bc,setPopoverAnchorActive:Cc,onResolve:(_)=>{return V=_,()=>{if(V===_)V=null}},toast:(_)=>{let E=_.message.trim();if(!E||E.length>Yo)return Promise.reject(new R("HOST_REJECTED",`Toast message must contain 1 to ${Yo} characters.`));if(_.copy&&_.copy!==!0&&(!_.copy.text.length||_.copy.text.length>Qo))return Promise.reject(new R("HOST_REJECTED",`Toast copy text must contain 1 to ${Qo} characters.`));return w({channel:C,v:a,type:"toast",id:M(x),payload:{..._,message:E}})},openUrl:(_)=>w({channel:C,v:a,type:"open-url",id:M(x),payload:{url:_}}),...mc(w,()=>M(x),(_)=>Promise.reject(new R("HOST_REJECTED",_))),answerBlock:(_)=>w({channel:C,v:a,type:"block-answer",id:M(x),payload:{text:_.trim().slice(0,L_)}}),openSurface:(_)=>w({channel:C,v:a,type:"open-surface",id:M(x),payload:{surfaceId:_}}),writeClipboard:(_)=>w({channel:C,v:a,type:"clipboard-write",id:M(x),payload:{text:_}}),compose:(_)=>w({channel:C,v:a,type:"compose",id:M(x),payload:_}),attach:(_)=>w({channel:C,v:a,type:"attach",id:M(x),payload:bo(_)}),startSession:async(_)=>{if(_.projectId!==void 0)oo(_.projectId);let E=_.worktree;if(E&&E!==!0)if(E.kind==="existing")oo(E.directory);else{if(E.name!==void 0)oo(E.name,200);if(E.baseBranch!==void 0)oo(E.baseBranch,200)}let p=await u({channel:C,v:a,type:"start-session",id:M(x),payload:l_(_)},o.requestTimeoutMs??180000);if(!V_(p))throw new R("HOST_REJECTED","Host did not return a session.");return p},prompt:(_)=>u({channel:C,v:a,type:"prompt",id:M(x),payload:W_(_)}).then((E)=>{if(!X_(E))throw new R("HOST_REJECTED","Host did not return a prompt result.");return E}),sessionLink:(_)=>w({channel:C,v:a,type:"session-link",id:M(x),payload:bo(_)}),close:()=>w({channel:C,v:a,type:"close",id:M(x)}),oauthStart:()=>w({channel:C,v:a,type:"oauth-start",id:M(x)}),oauthDisconnect:()=>w({channel:C,v:a,type:"oauth-disconnect",id:M(x)}),request:(_)=>(vo(_.path)?u({channel:C,v:a,type:"request",id:M(x),payload:_}):tt()).then((E)=>{if(!eo(E))throw new R("HOST_REJECTED","Host request result was empty.");return E}),serviceRequest:(_)=>(vo(_.path)?u({channel:C,v:a,type:"service-request",id:M(x),payload:_}):tt()).then((E)=>{if(!eo(E))throw new R("HOST_REJECTED","Host service request result was empty.");return E}),serviceStatus:()=>u({channel:C,v:a,type:"service-status",id:M(x)}).then((_)=>{if(!K_(_))throw new R("HOST_REJECTED","Host did not return service status.");return _}),readFile:(_)=>(Co(_)?u({channel:C,v:a,type:"file-read",id:M(x),payload:{path:_}}):o_()).then((E)=>{if(!w_(E))throw new R("HOST_REJECTED","Host did not return file content.");return E}),writeFile:(_,E)=>{if(!Co(_))return o_();if(E.length>Zo)return Promise.reject(new R("FILE_TOO_LARGE",`Content is over ${Zo} characters.`));return u({channel:C,v:a,type:"file-write",id:M(x),payload:{path:_,content:E}}).then((p)=>{if(!y_(p))throw new R("HOST_REJECTED","Host did not confirm the write.");return p})},listDir:(_)=>(Co(_)?u({channel:C,v:a,type:"file-list",id:M(x),payload:{path:_}}):o_()).then((E)=>{if(!H_(E))throw new R("HOST_REJECTED","Host did not return directory entries.");return E}),stat:(_)=>(Co(_)?u({channel:C,v:a,type:"file-stat",id:M(x),payload:{path:_}}):o_()).then((E)=>{if(!F_(E))throw new R("HOST_REJECTED","Host did not return file status.");return E}),generate:(_)=>{let E=_.prompt.trim(),p=_.system?.trim();if(E.length===0||E.length>Jo)return Promise.reject(new R("HOST_REJECTED",`Prompt must be 1 to ${Jo} characters.`));if(p!==void 0&&(p.length===0||p.length>qo))return Promise.reject(new R("HOST_REJECTED",`System prompt must be 1 to ${qo} characters.`));let k=_.maxOutputTokens===void 0?void 0:Math.min(P_,Math.max(1,Math.floor(_.maxOutputTokens)));if(k!==void 0&&!Number.isFinite(k))return Promise.reject(new R("HOST_REJECTED","maxOutputTokens must be a number."));let G={prompt:E};if(p!==void 0)G.system=p;if(k!==void 0)G.maxOutputTokens=k;return u({channel:C,v:a,type:"generate",id:M(x),payload:G},o.requestTimeoutMs??D_).then((h)=>{if(!B_(h))throw new R("HOST_REJECTED","Host did not return generated text.");return h})},onLateGenerateResult:(_)=>{F.add(_);for(let E of L.splice(0))X([_],E);return kc(),()=>{F.delete(_)}},openMicrophone:Mt,setBadge:(_)=>w({channel:C,v:a,type:"badge",id:M(x),payload:{count:m_(_)}}),setHeight:(_)=>w({channel:C,v:a,type:"resize",id:M(x),payload:{height:z_(_)}}),onFileOpen:(_)=>{if(co.add(_),!Xo)Xo=!0,c.addEventListener("keydown",Rc,!0);if(Io)_(Io);return()=>{co.delete(_)}},onFileSnapshot:(_)=>{return to=_,()=>{if(to===_)to=null}},onFileSaved:(_)=>{return v.add(_),()=>{v.delete(_)}},reportFileChange:(_)=>f_({...m,type:"file-change",payload:{dirty:_.dirty,edited:_.edited}}),requestFileSave:Ic,reportFileUnsupported:()=>f_({...m,type:"file-unsupported"}),dispose:()=>{for(let _ of fo.keys())Q({...m,type:"workspace-unsubscribe",id:M(x),payload:{subscriptionId:_}});fo.clear();for(let _ of ko.keys())Q({...m,type:"shells-unsubscribe",id:M(x),payload:{subscriptionId:_}});if(ko.clear(),J)k_(),J.release(),J=null;if(Z=!0,V=null,N=null,to=null,co.clear(),v.clear(),Xo)c.removeEventListener("keydown",Rc,!0);c.removeEventListener("message",pc),c.removeEventListener("keydown",Uc,!0),c.removeEventListener("pointerover",wo),c.removeEventListener("pointermove",wo),c.removeEventListener("pointerout",ic),c.removeEventListener("focus",xc),c.removeEventListener("blur",Mc);for(let _ of Eo.values())clearTimeout(_.timer),_.reject(new R("HOST_UNAVAILABLE","Host client was disposed."));Eo.clear(),S.clear(),n.clear(),d.clear(),f.clear(),I.clear(),i.clear(),O.clear(),$.clear(),B.clear(),H.clear(),W.clear(),F.clear(),L.length=0}}};var Et=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var VE=new Set(Et);var Tt=["none","agent","user"];var gE=new Set(Tt);var Xt=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],gt=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],St=(o,c)=>{c.style.colorScheme=o.mode;for(let[t,T]of Xt)c.style.setProperty(t,o.tokens[T]);for(let[t,T,S]of gt){let n=o.tokens[S]??"";c.style.setProperty(t,n),c.style.setProperty(T,n)}c.style.setProperty("font-family",o.tokens.font),c.style.setProperty("font-size",o.tokens.fontSize??"0.875rem"),c.style.setProperty("line-height","1.45"),c.style.setProperty("color",o.tokens.foreground)},Q_=(o,c)=>{if(St(o.theme,c),c.dataset)c.dataset.ocSurface=o.surface,c.dataset.ocTheme=o.theme.mode};var Pt={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},P=(o,c)=>`var(--${o}, var(--oc-${Pt[o]}, ${c}))`,Oo=P("surface-background","transparent"),t_=P("surface-elevated","transparent"),ao=P("surface-elevated-foreground","inherit"),q=P("surface-foreground","inherit"),z=P("surface-muted-foreground","gray"),Dt=P("surface-muted","transparent"),Ro=P("interactive-border","currentColor"),j=P("interactive-hover","transparent"),Uo=P("interactive-active","transparent"),j_=P("interactive-selection","transparent"),Z_=P("interactive-selection-foreground","inherit"),Ao=P("primary","currentColor"),J_=P("primary-text","inherit"),q_=P("error-text","inherit"),lt=P("font-sans","inherit"),v_=P("font-mono","monospace"),Ot=P("radius","9px"),e_=`calc(${Ot} - 2px)`,rt=`calc(${Ot} - 4px)`,K=(o,c,t="transparent")=>`color-mix(in srgb, ${o} ${c}%, ${t})`,nt=`background-image: linear-gradient(${j}, ${j});`,oc=(o,c="0.5px")=>`box-shadow: inset 0 0 0 ${c} ${o}, var(--oc-sdk-field-lift);`,_c="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",At="box-shadow: var(--oc-sdk-lit);",cc=`inset 0 0.5px 0 0 ${K(q,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,Wt=`
:root {
  --oc-sdk-edge: ${K(q,16)};
  --oc-sdk-field-bg: ${t_};
  --oc-sdk-raised-bg: ${Oo};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${K(q,14)};
  --oc-sdk-field-bg: ${K(Oo,50,t_)};
  --oc-sdk-raised-bg: ${t_};
  --oc-sdk-field-lift: ${cc};
  --oc-sdk-raised-lift: ${cc};
  --oc-sdk-lit: ${cc};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,c_=(o)=>{let c=P(`status-${o}`,"currentColor");return`
.oc-sdk[data-tone="${o}"], .oc-sdk [data-tone="${o}"] { --oc-sdk-tone: ${c}; --oc-sdk-tone-text: ${P(`${o}-text`,"inherit")}; }`},r=(o)=>`calc(${o}rem / 14)`,mt=`
.oc-sdk { box-sizing: border-box; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: ${r(8)}; height: ${r(32)}; padding: 0 ${r(12)}; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; }
.oc-sdk-btn[data-size="sm"] { gap: ${r(6)}; height: ${r(28)}; padding: 0 ${r(10)}; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { gap: ${r(4)}; height: ${r(24)}; padding: 0 ${r(8)}; font-size: 0.75rem; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: ${r(14)}; height: ${r(14)}; }

.oc-sdk-field { display: flex; flex-direction: column; gap: ${r(4)}; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: ${r(32)}; padding: 0 ${r(10)}; border: 0; font-size: 0.875rem; line-height: 1.45; appearance: none; }
textarea.oc-sdk-input { height: auto; padding: ${r(8)} ${r(10)}; resize: vertical; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: ${r(34)}; padding-right: ${r(34)}; }
.oc-sdk-search-icon { position: absolute; left: ${r(11)}; top: 50%; transform: translateY(-50%); pointer-events: none; }
.oc-sdk-search-clear { position: absolute; right: ${r(6)}; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: ${r(24)}; height: ${r(24)}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: ${r(4)}; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: ${r(6)}; align-self: flex-start; width: auto; max-width: 100%; min-width: 0; height: ${r(28)}; padding: 0 ${r(10)}; border: 1px solid transparent; font-size: 0.8125rem; text-align: left; }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; }
.oc-sdk-popup { position: fixed; z-index: 50; display: flex; flex-direction: column; gap: ${r(2)}; min-width: ${r(160)}; max-width: calc(100vw - ${r(16)}); max-height: min(${r(320)}, calc(100vh - ${r(16)})); overflow: auto; padding: ${r(4)}; border: 1px solid transparent; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: ${r(2)} ${r(2)} ${r(4)}; }
.oc-sdk-popup-search .oc-sdk-input { height: ${r(28)}; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: ${r(8)}; width: 100%; padding: ${r(6)} ${r(8)}; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; }
.oc-sdk-option-check { flex: 0 0 auto; display: inline-flex; width: ${r(14)}; visibility: hidden; }
.oc-sdk-option[aria-selected="true"] > .oc-sdk-option-check { visibility: visible; }
.oc-sdk-popup-empty { padding: ${r(8)}; font-size: 0.8125rem; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: ${r(8)}; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: ${r(14)}; height: ${r(14)}; margin-top: ${r(3)}; border: 1px solid transparent; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: ${r(36)}; height: ${r(20)}; --oc-sdk-thumb-travel: ${r(16)}; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: ${r(2)}; left: ${r(2)}; width: ${r(16)}; height: ${r(16)}; }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; }

.oc-sdk-tabs { display: inline-flex; gap: ${r(2)}; padding: ${r(2)}; max-width: 100%; overflow: auto; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: ${r(6)}; height: ${r(28)}; padding: 0 ${r(10)}; border: 1px solid transparent; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: ${r(1)} ${r(6)}; font-size: ${r(11)}; font-weight: 500; line-height: ${r(16)}; white-space: nowrap; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: ${r(8)}; width: 100%; padding: ${r(6)} ${r(8)}; text-align: left; }
.oc-sdk-row-lead { flex: 0 0 auto; width: ${r(64)}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-list-empty { padding: ${r(16)} ${r(8)}; text-align: center; font-size: 0.8125rem; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${r(4)}; padding: ${r(40)} ${r(16)}; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; }
.oc-sdk-empty-action { margin-top: ${r(12)}; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: ${r(8)}; font-size: 0.8125rem; }
.oc-sdk-spinner-ring { width: ${r(16)}; height: ${r(16)}; border: 2px solid transparent; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: ${r(12)}; height: ${r(12)}; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: ${r(12)}; padding: ${r(8)} ${r(12)}; border: 1px solid transparent; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: ${r(2)}; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-banner-body { font-size: 0.8125rem; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: ${r(8)}; width: 100%; margin: ${r(8)} 0; font-size: 0.75rem; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: ${r(4)} 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: ${r(4)}; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: ${r(6)}; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; transform-origin: left; transition: transform 200ms ease-out; }
.oc-sdk-progress-value { display: inline-flex; align-items: center; gap: ${r(2)}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { font-weight: 600; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text img { display: block; max-width: 100%; margin: ${r(8)} 0; }

/* Under a finger the controls reach the app's touch sizes: rows and options 44px like its sheets, every other
   control at least 36px. Inputs keep 16px text, below which iOS zooms the page on focus. */
@media (pointer: coarse) {
  .oc-sdk-btn, .oc-sdk-input { height: ${r(40)}; }
  .oc-sdk-btn[data-size="sm"], .oc-sdk-btn[data-size="xs"], .oc-sdk-trigger, .oc-sdk-tab, .oc-sdk-popup-search .oc-sdk-input { height: ${r(36)}; }
  .oc-sdk-input, .oc-sdk-popup-search .oc-sdk-input { font-size: max(16px, 0.875rem); }
  .oc-sdk-search-clear { width: ${r(36)}; height: ${r(36)}; right: 0; }
  .oc-sdk-row, .oc-sdk-option { min-height: ${r(44)}; }
  .oc-sdk-check { min-height: ${r(36)}; padding: ${r(8)} 0; }
}
`,dt=`${Wt}
.oc-sdk { color: ${q}; font-family: ${lt}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${nt} }
.oc-sdk-mono { font-family: ${v_}; }
.oc-sdk-muted { color: ${z}; }
${c_("success")}${c_("warning")}${c_("error")}${c_("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${Ao}; --oc-sdk-tone-text: ${J_}; }

.oc-sdk-btn { border-radius: ${e_}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${rt}; }
.oc-sdk-btn[data-variant="default"] { color: ${J_}; background: ${K(Ao,10,Oo)}; border-color: ${K(Ao,12)}; ${At} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${K(Ao,16,Oo)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${K(Ao,22,Oo)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${Dt}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${j}, ${j}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${Uo}, ${Uo}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${ao}; ${_c} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${j}, ${j}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${Uo}, ${Uo}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${j}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${Uo}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${P("status-error","red")}; color: ${q_}; background: ${K("var(--oc-sdk-tone)",7,Oo)}; border-color: ${K("var(--oc-sdk-tone)",12)}; ${At} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${K("var(--oc-sdk-tone)",9,Oo)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${K("var(--oc-sdk-tone)",11,Oo)}; box-shadow: none; }

.oc-sdk-field-note { color: ${z}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${q_}; }
.oc-sdk-input { border-radius: ${e_}; background: var(--oc-sdk-field-bg); color: ${ao}; ${oc("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${z}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${j}, ${j}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${oc(K(q,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${oc(P("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${v_}; }

.oc-sdk-search-icon { color: ${z}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${Ao}; }
.oc-sdk-search-clear { border-radius: ${rt}; color: ${z}; }
.oc-sdk-search-clear:hover { background: ${j}; color: ${q}; }

.oc-sdk-trigger { border-radius: ${e_}; background: var(--oc-sdk-raised-bg); color: ${ao}; ${_c} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${j}, ${j}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${Uo}, ${Uo}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${z}; }
.oc-sdk-trigger-chevron { color: ${z}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${ao}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${t_}; background-clip: padding-box; color: ${ao}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${j}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${j_}; color: ${Z_}; }
.oc-sdk-option-check { color: ${q}; }
.oc-sdk-option[data-destructive="true"] { color: ${q_}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${K(P("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${z}; }
.oc-sdk-popup-empty { color: ${z}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${Ro}; border-radius: 4px; color: ${q}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${K(q,60,Ro)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${Ro}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${Oo}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${Ao}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(var(--oc-sdk-thumb-travel, 16px)); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${nt} }
.oc-sdk-check-desc { color: ${z}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${K(q,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${z}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${q}; }
.oc-sdk-tab[aria-selected="true"] { color: ${Z_}; background: ${j_}; border-color: ${Ro}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${ao}; background: var(--oc-sdk-raised-bg); ${_c} }
.oc-sdk-tab-count { color: ${z}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${K(q,6)}; color: ${z}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${K("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${j}; }
.oc-sdk-row[aria-selected="true"] { background: ${j_}; color: ${Z_}; }
.oc-sdk-row-lead { font-family: ${v_}; color: ${z}; }
.oc-sdk-row-sub { color: ${z}; }
.oc-sdk-row-meta { color: ${z}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${z}; }

.oc-sdk-empty-body { color: ${z}; }

.oc-sdk-spinner { color: ${z}; }
.oc-sdk-spinner-ring { border-color: ${Ro}; border-top-color: ${Ao}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${K("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${z}; }

.oc-sdk-separator { color: ${z}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${K(Ro,40)}; }

.oc-sdk-progress-label { color: ${z}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${K(q,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${Ao}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${P("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${P("success-text","inherit")}; }

.oc-sdk-text a { color: ${J_}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${K(Ro,60)}; }
`,D=`
${R_}
${mt}
${dt}`;var ft="oc-sdk-ui-style",so=(o)=>{while(o.firstChild)o.removeChild(o.firstChild)},l=(o)=>{let c=document.getElementById(ft);if(c instanceof HTMLStyleElement){if(c.textContent!==o)c.textContent=o;return}U_(document);let t=document.createElement("style");t.id=ft,t.textContent=o,document.head.appendChild(t)},b=(o,c)=>{let t=document.createElement(o);if(c)t.className=c;return t},To=(o)=>{let c=b("button",o);return c.type="button",c},y=(o,c)=>{let t=c??"";if(o.textContent!==t)o.textContent=t},po=(o,c,t)=>{if(t===void 0||t===null||t==="")o.removeAttribute(c);else if(o.getAttribute(c)!==t)o.setAttribute(c,t)};var zt=()=>{let o=document.createElement("span");return o.className="oc-sdk-spinner-ring",o.setAttribute("aria-hidden","true"),o},_o=(o,c)=>{l(D);let t=c,T=To("oc-sdk oc-sdk-btn"),S=zt(),n=document.createElement("span");T.append(n),o.append(T);let d=()=>{if(T.dataset.variant=t.variant??"default",T.dataset.size=t.size??"default",T.disabled=Boolean(t.disabled)||Boolean(t.loading),T.dataset.loading=t.loading?"true":"false",T.setAttribute("aria-busy",t.loading?"true":"false"),t.loading&&S.parentNode!==T)T.prepend(S);else if(!t.loading&&S.parentNode===T)S.remove();y(n,t.label)},f=()=>{if(t.disabled||t.loading)return;t.onClick()};return T.addEventListener("click",f),d(),{update:(I)=>{t={...t,...I},d()},dispose:()=>{T.removeEventListener("click",f),T.remove()}}};var E_=(o,c)=>{l(D);let t=c,T=b("label","oc-sdk oc-sdk-field"),S=b("span","oc-sdk-field-label"),n=t.multiline?b("textarea","oc-sdk-input"):b("input","oc-sdk-input"),d=b("span","oc-sdk-field-note");T.append(S,n,d),o.append(T);let f=()=>{if(y(S,t.label),S.hidden=!t.label,n instanceof HTMLInputElement)n.type=t.password?"password":"text";else n.rows=t.rows??3;if(n.value!==t.value)n.value=t.value;n.disabled=Boolean(t.disabled),po(n,"placeholder",t.placeholder),n.dataset.mono=t.mono?"true":"false";let i=Boolean(t.error);T.dataset.invalid=i?"true":"false",n.setAttribute("aria-invalid",i?"true":"false");let O=t.error??t.helper??"";y(d,O),d.hidden=O===""},I=()=>{t.onChange(n.value)};return n.addEventListener("input",I),f(),{update:(i)=>{t={...t,...i},f()},dispose:()=>{n.removeEventListener("input",I),T.remove()}}};var kt="http://www.w3.org/2000/svg",Kt={search:"M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z",chevron:"M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z",check:"M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z",close:"M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"},$o=(o,c,t)=>{let T=document.createElementNS(kt,"svg");if(T.setAttribute("viewBox","0 0 24 24"),T.setAttribute("width",String(c)),T.setAttribute("height",String(c)),T.style.width=r(c),T.style.height=r(c),T.setAttribute("aria-hidden","true"),T.setAttribute("fill","currentColor"),t)T.setAttribute("class",t);let S=document.createElementNS(kt,"path");return S.setAttribute("d",Kt[o]),T.append(S),T};var No=(o,c="vertical")=>{let[t,T]=c==="vertical"?["ArrowDown","ArrowUp"]:["ArrowRight","ArrowLeft"];if(o.key===t||o.ctrlKey&&o.key.toLowerCase()==="n")return"next";if(o.key===T||o.ctrlKey&&o.key.toLowerCase()==="p")return"previous";if(o.key==="Home")return"first";if(o.key==="End")return"last";return null},Go=(o,c,t)=>{let T=o.filter((I)=>!I.disabled);if(T.length===0)return null;let S=T[0],n=T[T.length-1];if(t==="first"||!S||!n)return S?.id??null;if(t==="last")return n.id;let d=T.findIndex((I)=>I.id===c);if(d===-1)return t==="next"?S.id:n.id;return T[Math.min(T.length-1,Math.max(0,d+(t==="next"?1:-1)))]?.id??null};var Ft=(o,c,t)=>{l(D);let T=c,S=To("oc-sdk oc-sdk-check");S.setAttribute("role",t);let n=b("span",t==="switch"?"oc-sdk-check-thumb":"oc-sdk-check-box");if(t==="checkbox")n.append($o("check",12));let d=b("span","oc-sdk-check-text"),f=b("span","oc-sdk-check-label"),I=b("span","oc-sdk-check-desc");d.append(f,I),S.append(n,d),o.append(S);let i=()=>{S.setAttribute("aria-checked",T.checked?"true":"false"),S.disabled=Boolean(T.disabled),y(f,T.label),y(I,T.description),I.hidden=!T.description},O=()=>{if(!T.disabled)T.onChange(!T.checked)};return S.addEventListener("click",O),i(),{update:($)=>{T={...T,...$},i()},dispose:()=>{S.removeEventListener("click",O),S.remove()}}};var T_=(o,c)=>Ft(o,c,"switch");var tc=(o,c)=>{l(D);let t=c,T=b("div","oc-sdk oc-sdk-tabs");T.setAttribute("role","tablist"),o.append(T);let S=()=>{so(T),T.dataset.track=t.trackBackground?"true":"false";for(let d of t.items){let f=To("oc-sdk-tab");f.setAttribute("role","tab");let I=d.id===t.activeId;f.setAttribute("aria-selected",I?"true":"false"),f.tabIndex=I?0:-1,f.dataset.id=d.id;let i=b("span");if(i.textContent=d.label,f.append(i),d.count!==void 0){let O=b("span","oc-sdk-tab-count");O.textContent=String(d.count),f.append(O)}f.addEventListener("click",()=>{if(d.id!==t.activeId)t.onChange(d.id)}),T.append(f)}},n=(d)=>{let f=No(d,"horizontal");if(!f)return;let I=Go(t.items,t.activeId,f);if(I&&I!==t.activeId){d.preventDefault(),t.onChange(I);let i=T.querySelector(`[data-id="${CSS.escape(I)}"]`);if(i instanceof HTMLElement)i.focus()}};return T.addEventListener("keydown",n),S(),{update:(d)=>{t={...t,...d},S()},dispose:()=>{T.removeEventListener("keydown",n),T.remove()}}};var Ec=(o,c)=>{po(o,"data-tone",c&&c!=="neutral"?c:null)},S_=(o,c)=>{l(D);let t=c,T=b("span","oc-sdk oc-sdk-badge");o.append(T);let S=()=>{y(T,t.label),Ec(T,t.tone)};return S(),{update:(n)=>{t={...t,...n},S()},dispose:()=>{T.remove()}}};var Tc=(o,c)=>{l(D);let t=c,T=b("div","oc-sdk oc-sdk-empty"),S=b("h2","oc-sdk-empty-title"),n=b("p","oc-sdk-empty-body"),d=b("div","oc-sdk-empty-action");T.append(S,n,d),o.append(T);let f=null,I=()=>{if(y(S,t.title),y(n,t.body),n.hidden=!t.body,d.hidden=!t.action,!t.action){f?.dispose(),f=null;return}let i={label:t.action.label,onClick:t.action.onClick};if(f)f.update(i);else f=_o(d,{...i,variant:"outline",size:"sm"})};return I(),{update:(i)=>{t={...t,...i},I()},dispose:()=>{f?.dispose(),f=null,T.remove()}}};var Sc=(o,c={})=>{l(D);let t=c,T=b("span","oc-sdk oc-sdk-spinner");T.setAttribute("role","status");let S=b("span","oc-sdk-spinner-ring");S.setAttribute("aria-hidden","true");let n=b("span");T.append(S,n),o.append(T);let d=()=>{T.dataset.size=t.size??"default",y(n,t.label),n.hidden=!t.label,T.setAttribute("aria-label",t.label??"Loading")};return d(),{update:(f)=>{t={...t,...f},d()},dispose:()=>{T.remove()}}};var r_=(o,c)=>{l(D);let t=c,T=b("div","oc-sdk oc-sdk-banner"),S=b("div","oc-sdk-banner-text"),n=b("div","oc-sdk-banner-title"),d=b("div","oc-sdk-banner-body"),f=b("div","oc-sdk-banner-action");S.append(n,d),T.append(S,f),o.append(T);let I=null,i=()=>{if(T.dataset.tone=t.tone,T.setAttribute("role",t.tone==="error"||t.tone==="warning"?"alert":"status"),y(n,t.title),y(d,t.body),d.hidden=!t.body,f.hidden=!t.action,!t.action){I?.dispose(),I=null;return}let O={label:t.action.label,onClick:t.action.onClick};if(I)I.update(O);else I=_o(f,{...O,variant:"outline",size:"xs"})};return i(),{update:(O)=>{t={...t,...O},i()},dispose:()=>{I?.dispose(),I=null,T.remove()}}};var ho=(o)=>{if(!Number.isFinite(o))return 0;return Math.max(0,Math.min(100,o))};var n_=(o)=>{let c=ho(o);if(Math.abs(c-Math.round(c))<0.05)return`${Math.round(c)}%`;return`${c.toFixed(1)}%`},A_=(o)=>{if(!Number.isFinite(o)||o<0)return"$0";if(o>=100)return`$${Math.round(o)}`;if(o>=10)return`$${o.toFixed(1)}`;return`$${o.toFixed(2)}`},pt=(o)=>{if(!Number.isFinite(o)||o<=0)return"0";if(o>=1e9)return`${(o/1e9).toFixed(2)}B`;if(o>=1e6){let c=o/1e6;return c>=100?`${Math.round(c)}M`:`${c.toFixed(1)}M`}if(o>=1000)return`${Math.round(o/1000)}K`;return String(Math.round(o))},rc=(o,c=Date.now())=>{if(!o||!Number.isFinite(o)||o<=c)return"即将重置";let t=Math.max(0,Math.floor((o-c)/1000)),T=Math.floor(t/86400),S=Math.floor(t%86400/3600),n=Math.floor(t%3600/60);if(T>0)return`${T}d ${S}h`;if(S>0)return`${S}h ${n}m`;return`${Math.max(1,n)}m`},nc=(o)=>{let c=ho(o);if(c<=20)return"error";if(c<=50)return"warning";return"success"};var It=(o)=>{let c=o.limit_requests>0?o.effective_remaining_requests/o.limit_requests*100:100;return(o.limit_tokens>0?o.effective_remaining_tokens/o.limit_tokens*100:100)<c-0.5};var Rt=["gemini_5h","gemini_weekly","claude_5h","claude_weekly"],Bt=()=>{if(document.getElementById("pq-styles"))return;let o=document.createElement("style");o.id="pq-styles",o.textContent=`
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
  `,document.head.appendChild(o)},A=(o,c,t)=>{let T=document.createElement(o);if(c)T.className=c;if(t!==void 0)T.textContent=t;return T},ut=(o)=>{let c=A("div"),t=(o.series??[]).filter((L)=>Array.isArray(L.points)&&L.points.length>=2);if(t.length===0)return c.appendChild(A("div","pq-muted","暂无历史采样曲线")),c;let T=320,S=84,n=6,d=8,f=T-n*2,I=S-d*2,i=Number.POSITIVE_INFINITY,O=Number.NEGATIVE_INFINITY;for(let L of t)for(let V of L.points){if(V[0]<i)i=V[0];if(V[0]>O)O=V[0]}let $=Math.max(1,O-i),B={gemini_5h:"var(--primary, #3b82f6)",gemini_weekly:"var(--primary, #3b82f6)",claude_5h:"var(--success, #22c55e)",claude_weekly:"var(--success, #22c55e)"},H="http://www.w3.org/2000/svg",W=document.createElementNS(H,"svg");W.setAttribute("viewBox",`0 0 ${T} ${S}`),W.setAttribute("class","pq-chart-svg");for(let L of[100,50,20]){let V=d+I*(1-L/100),N=document.createElementNS(H,"line");N.setAttribute("x1",String(n)),N.setAttribute("x2",String(T-n)),N.setAttribute("y1",V.toFixed(1)),N.setAttribute("y2",V.toFixed(1)),N.setAttribute("stroke",L===20?"var(--destructive, #ef4444)":"var(--border, rgba(127,127,127,0.3))"),N.setAttribute("stroke-opacity",L===20?"0.4":"0.6"),N.setAttribute("stroke-dasharray","3 3"),N.setAttribute("stroke-width","1"),W.appendChild(N)}for(let L of t){let V=B[L.key]??"var(--info, #06b6d4)",N="",co=null;for(let to=0;to<L.points.length;to+=1){let[Io,Xo]=L.points[to],Eo=ho(Xo),fo=n+(Io-i)/$*f,ko=d+I*(1-Eo/100),Z=co!==null&&Eo-co>12;N+=`${to===0||Z?"M":"L"}${fo.toFixed(1)},${ko.toFixed(1)} `,co=Eo}let v=document.createElementNS(H,"path");v.setAttribute("d",N.trim()),v.setAttribute("fill","none"),v.setAttribute("stroke",V),v.setAttribute("stroke-width","2"),v.setAttribute("stroke-linecap","round"),v.setAttribute("stroke-linejoin","round"),W.appendChild(v)}c.appendChild(W);let F=A("div","pq-legend");for(let L of t){let V=A("span"),N=A("span","pq-legend-dot");N.style.background=B[L.key]??"var(--info, #06b6d4)",V.appendChild(N),V.appendChild(document.createTextNode(`${L.label} ${n_(L.remaining)}`)),F.appendChild(V)}return c.appendChild(F),c},So=Y_(),Ut=document.querySelector("#root"),it=!1,Wo=!1,Lo=!1,s=null,O_="5h",lo=!1,Vo="http://127.0.0.1:18380",mo="",Oc=!1,io=null,Ac=[],Yt=()=>{for(let o of Ac)try{o()}catch{}Ac=[]},Y=(o)=>{return Ac.push(()=>o.dispose()),o},d_=async(o,c,t={})=>{let T=await So.serviceRequest({method:o,path:c,...t.query?{query:t.query}:{},...t.body?{body:JSON.stringify(t.body)}:{}}),S=null;try{S=T.body?JSON.parse(T.body):null}catch{S=null}if(T.status<200||T.status>=300){let n=S&&typeof S==="object"&&"error"in S&&typeof S.error==="string"?S.error:`服务返回 HTTP ${T.status}`;throw Error(n)}return S},zo=async(o=!1)=>{Wo=!0,ro();try{let c=await d_("GET","/panel/state",{query:{force:o?"1":"0",window:O_,range:O_==="7d"?"7d":"24h"}});if(s=c,!Oc)Vo=c.config.url;if(c.errorCode==="unauthorized"||c.errorCode==="unreachable")lo=!0}catch(c){let t=c instanceof R&&c.code==="NO_SERVICE"?"请先在 Settings → Extensions 中批准本扩展的本地服务权限。":c instanceof Error?c.message:String(c);s={config:s?.config??{url:Vo,hasPasscode:!1,showAis:!0,compactQuota:!0},snapshot:s?.snapshot??null,history:s?.history??null,error:t,errorCode:"unreachable",fetchedAtMs:Date.now()}}finally{Wo=!1,ro()}},Qt=async(o)=>{if(s)s={...s,config:{...s.config,showAis:o}},ro();try{s=await d_("POST","/panel/config",{body:{showAis:o}}),So.toast({kind:"success",message:o?"已开启 AIStudio 号池显示（Usage 页点击刷新后同步）":"已隐藏 AIStudio 号池（Usage 页点击刷新后同步）"})}catch(c){So.toast({kind:"error",message:c instanceof Error?c.message:"切换失败"})}finally{ro()}},jt=async(o)=>{if(s)s={...s,config:{...s.config,compactQuota:o}},ro();try{s=await d_("POST","/panel/config",{body:{compactQuota:o}}),So.toast({kind:"success",message:o?"已开启紧凑配额文案（适配手机端，Usage 刷新后同步）":"已切换为详细配额文案（Usage 刷新后同步）"})}catch(c){So.toast({kind:"error",message:c instanceof Error?c.message:"切换失败"})}finally{ro()}},xt=async(o=!1)=>{Lo=!0,io={tone:"info",text:"正在测试连接..."},ro();try{let c=await d_("POST","/panel/test",{body:{url:Vo.trim()||"http://127.0.0.1:18380",...mo?{passcode:mo}:{},...o?{clearPasscode:!0}:{},showAis:s?.config.showAis??!0,compactQuota:s?.config.compactQuota??!0,save:!0}});if(!c.ok){io={tone:"error",text:c.message||"连接测试失败"},So.toast({kind:"error",message:c.message||"连接测试失败"});return}mo="",Oc=!1,io={tone:"success",text:c.summary||"连接成功并已保存"},So.toast({kind:"success",message:c.summary||"配置已保存"}),await zo(!0)}catch(c){let t=c instanceof Error?c.message:String(c);io={tone:"error",text:t},So.toast({kind:"error",message:t})}finally{Lo=!1,ro()}},Zt=(o)=>{let c=A("div","pq-card"),t=o.antigravity,T=A("div","pq-card-head");T.appendChild(A("h4","pq-card-title","Antigravity 号池"));let S=A("div");Y(S_(S,{label:t.online?`${t.summary?.active_accounts??t.accounts.length} 号在线`:"离线",tone:t.online?"success":"error"})),T.appendChild(S),c.appendChild(T);let n=t.accounts[0];if(!t.online||!n)return c.appendChild(A("div","pq-muted",t.status_message||"暂无活跃 Antigravity 账号数据")),c;let d=A("div","pq-win-list"),f=[...n.windows??[]].sort(($,B)=>{let H=Rt.indexOf($.key),W=Rt.indexOf(B.key);return(H===-1?99:H)-(W===-1?99:W)});for(let $ of f){let B=ho($.remaining_percent),H=nc(B),W=A("div","pq-win"),F=A("div","pq-win-top");F.appendChild(A("span","pq-win-name",$.label||$.key)),F.appendChild(A("span",`pq-win-val pq-text-${H}`,`剩 ${n_(B)}`)),W.appendChild(F);let L=A("div","pq-bar-track"),V=A("div",`pq-bar-fill pq-tone-${H}`);V.style.width=`${B}%`,L.appendChild(V),W.appendChild(L);let N=A("div","pq-win-sub"),co=$.has_current_usage&&$.current_cost>0?$.has_forecast&&$.forecast_cost>0?`已用 ${A_($.current_cost)} · 满额预测 ${A_($.forecast_cost)}`:`已用 ${A_($.current_cost)}`:"本轮暂无消耗";if(N.appendChild(A("span","pq-mono",co)),$.reset_at_ms>0)N.appendChild(A("span","pq-mono",`重置 ${rc($.reset_at_ms)}`));W.appendChild(N),d.appendChild(W)}c.appendChild(d);let I=A("div","pq-chart-box"),i=A("div","pq-chart-head");i.appendChild(A("span","pq-muted","周期剩余趋势"));let O=A("div");if(Y(tc(O,{items:[{id:"5h",label:"5h / 24h"},{id:"7d",label:"7d 周期"}],activeId:O_,onChange:($)=>{if($!=="5h"&&$!=="7d")return;O_=$,zo(!1)}})),i.appendChild(O),I.appendChild(i),s?.history)I.appendChild(ut(s.history));else I.appendChild(A("div","pq-muted","暂无历史趋势数据"));return c.appendChild(I),c},Jt=(o)=>{let c=A("div","pq-card"),t=o.aistudio,T=A("div","pq-card-head");T.appendChild(A("h4","pq-card-title","AIStudio2API 号池"));let S=A("div"),n=t.account_counts?.ready??0,d=t.account_counts?.enabled??0;if(Y(S_(S,{label:t.online?`${n}/${d} 号就绪`:"离线",tone:t.online?n===d?"success":"warning":"error"})),T.appendChild(S),c.appendChild(T),!t.online)return c.appendChild(A("div","pq-muted",t.status_message||"AIStudio2API 当前离线")),c;let f=A("div","pq-win-sub"),I=t.playground;if(f.appendChild(A("span","pq-mono",`Playground ${I?.requests??0}次`)),t.next_reset_ms>0)f.appendChild(A("span","pq-mono",`16:00 重置 · ${rc(t.next_reset_ms)}`));c.appendChild(f);let i=A("div","pq-model-list");for(let O of t.models??[]){let $=ho(O.effective_percent),B=O.available_accounts===0?"error":nc($),H=A("div","pq-model-row"),W=A("div","pq-model-top");W.appendChild(A("span","pq-model-name",O.label||O.id));let F=A("div","pq-actions");if(O.eligible_accounts>0&&$<99.5)F.appendChild(A("span","pq-pill",It(O)?"Token瓶颈":"次数瓶颈"));F.appendChild(A("span",`pq-win-val pq-text-${B}`,`${n_($)}`)),W.appendChild(F),H.appendChild(W);let L=A("div","pq-bar-track"),V=A("div",`pq-bar-fill pq-tone-${B}`);V.style.width=`${$}%`,L.appendChild(V),H.appendChild(L);let N=A("div","pq-win-sub");N.appendChild(A("span","pq-mono",`可用 ${O.available_accounts}/${O.eligible_accounts} 号`)),N.appendChild(A("span","pq-mono",`剩 ${O.effective_remaining_requests}次 / ${pt(O.effective_remaining_tokens)}`)),H.appendChild(N),i.appendChild(H)}return c.appendChild(i),c},qt=()=>{let o=A("div","pq-card"),c=s?.config.hasPasscode===!0,t=A("button","pq-settings-toggle");if(t.type="button",t.appendChild(A("span","pq-card-title","连接设置（看板地址与口令）")),t.appendChild(A("span","pq-muted",lo?"收起 ▲":"展开 ▼")),t.addEventListener("click",()=>{lo=!lo,ro()}),o.appendChild(t),!lo)return o.appendChild(A("div","pq-muted pq-mono",`${s?.config.url??Vo} · ${c?"已保存口令":"无口令"}`)),o;let T=A("div","pq-settings-body"),S=A("div"),n=Y(E_(S,{label:"看板地址 URL",value:Vo,placeholder:"http://127.0.0.1:18380 或 https://your-board.example.com",mono:!0,onChange:(O)=>{Vo=O,Oc=!0,n.update({value:O})}}));T.appendChild(S);let d=A("div"),f=Y(E_(d,{label:"访问口令 (X-View-Passcode)",value:mo,password:!0,placeholder:c?"已保存口令（留空保存将保持原口令不变）":"若看板未设口令可留空",helper:"仅写入本机 0600 配置文件，不会回显给前端或暴露给对话上下文。",onChange:(O)=>{mo=O,f.update({value:O})}}));if(T.appendChild(d),io){let O=A("div");Y(r_(O,{tone:io.tone,title:io.text})),T.appendChild(O)}let I=A("div","pq-settings-actions"),i=A("div");if(Y(_o(i,{label:Lo?"测试中...":"测试并保存",size:"sm",loading:Lo,disabled:Lo,onClick:()=>void xt(!1)})),I.appendChild(i),c){let O=A("div");Y(_o(O,{label:"清空口令",variant:"outline",size:"sm",disabled:Lo,onClick:()=>void xt(!0)})),I.appendChild(O)}return T.appendChild(I),o.appendChild(T),o},ro=()=>{Yt(),Ut.innerHTML="";let o=A("div","pq-wrap"),c=A("div","pq-header"),t=A("div","pq-title-row");if(t.appendChild(A("h3","pq-title","Pool Quota")),Wo&&!s){let O=A("div");Y(Sc(O,{size:"sm"})),t.appendChild(O)}c.appendChild(t);let T=A("div","pq-actions"),S=A("div");if(Y(_o(S,{label:"刷新",variant:"outline",size:"xs",loading:Wo,onClick:()=>void zo(!0)})),T.appendChild(S),s?.config.url){let O=A("div");Y(_o(O,{label:"打开看板",variant:"ghost",size:"xs",onClick:()=>{if(s?.config.url)So.openUrl(s.config.url)}})),T.appendChild(O)}c.appendChild(T),o.appendChild(c);let n=A("div","pq-card"),d=A("div"),f=s?.config.showAis??!0;Y(T_(d,{label:"显示 AIStudio 号池",description:"同时控制顶栏/Usage 总卡、Work Status 与本面板是否展示 AIS 模型余量",checked:f,onChange:(O)=>void Qt(O)})),n.appendChild(d);let I=A("div"),i=s?.config.compactQuota??!0;if(Y(T_(I,{label:"紧凑配额文案（适配手机端）",description:"精简手机端浮层与 Usage 总卡文案避免窄屏叠字；本面板与 Work Status 始终保留完整费用与次数/Token",checked:i,onChange:(O)=>void jt(O)})),n.appendChild(I),o.appendChild(n),s?.error){let O=A("div");Y(r_(O,{tone:s.errorCode==="unauthorized"?"warning":"error",title:s.errorCode==="unauthorized"?"需要访问口令":"看板连接异常",body:s.error})),o.appendChild(O)}if(s?.snapshot){if(o.appendChild(Zt(s.snapshot)),f)o.appendChild(Jt(s.snapshot))}else if(!Wo&&!s?.error){let O=A("div");Y(Tc(O,{title:"尚未读取到号池数据",body:"请在下方连接设置中填写看板地址与访问口令后点击测试并保存。",action:{label:"重试",onClick:()=>void zo(!0)}})),o.appendChild(O)}if(o.appendChild(qt()),s?.fetchedAtMs){let O=new Date(s.fetchedAtMs).toLocaleTimeString();o.appendChild(A("div","pq-footer-note pq-mono",`上次更新：${O} · 原生总卡在 Settings → Usage 中可勾选置顶到顶栏`))}Ut.appendChild(o)};Bt();So.onReady((o)=>{if(Q_(o,document.documentElement),it)return;it=!0,ro(),zo(!1)});})();
