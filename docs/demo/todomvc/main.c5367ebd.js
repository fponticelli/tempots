parcelRequire=function(e){var r="function"==typeof parcelRequire&&parcelRequire,n="function"==typeof require&&require,i={};function u(e,u){if(e in i)return i[e];var t="function"==typeof parcelRequire&&parcelRequire;if(!u&&t)return t(e,!0);if(r)return r(e,!0);if(n&&"string"==typeof e)return n(e);var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}return u.register=function(e,r){i[e]=r},i=e(u),u.modules=i,u}(function (require) {var h={};Object.defineProperty(h,"__esModule",{value:!0});var Ba=function(t,e,r){var $=t.style;null==r?$[e]=null:String(r)!==$[e]&&($[e]=String(r))};h.setOneStyle=Ba;var i=function(t,e,r){if(null==r)t.removeAttribute(e);else{var $=String(r);$!==t.getAttribute(e)&&t.setAttribute(e,$)}};h.setAttribute=i;var lb=function(t,e,r){var $=t;null==r&&null!=$[e]?$[e]=null:$[e]!==r&&($[e]=r)};h.setProperty=lb;var kb=function(t,e,r){if(null==r)t.removeAttribute(e);else if("string"==typeof r)i(t,e,r);else{var $=Object.keys(r).map(function(t){return t+": "+r[t]+";"}).join(" ");i(t,e,$.length&&$||null)}};h.setStyleAttribute=kb;var t=function(t,e,r){var $=t;if(null==r)$[e]=null;else{var o=!0===r||"true"===r;$[e]!==o&&($[e]=o)}};h.setBoolProperty=t;var O=function(t,e,r){i(t,e,!0===r||"true"===r?"true":!1===r?"false":null)};h.setEnumBoolAttribute=O;var c=function(t,e,r){i(t,e,!0===r||"true"===r?"":null)};h.setBoolAttribute=c;var P=function(t,e,r){Array.isArray(r)?i(t,e,r.join(", ")||null):i(t,e,r&&String(r)||null)};h.setCommaSeparated=P;var m=function(t,e,r){Array.isArray(r)?i(t,e,r.join(" ")||null):i(t,e,r&&String(r)||null)};h.setSpaceSeparated=m;var S={};Object.defineProperty(S,"__esModule",{value:!0});var Ua={acceptcharset:"accept-charset",asattr:"as",classname:"class",httpequiv:"http-equiv",htmlfor:"for"};S.htmlAttributeNameMap=Ua;var Qa={"accept-charset":m,class:m,acceptcharset:m,async:c,autofocus:c,autoplay:c,checked:t,contenteditable:O,controls:c,default:c,defer:c,disabled:c,draggable:O,formnovalidate:c,headers:m,hidden:c,ismap:c,itemscope:c,loop:c,multiple:t,muted:t,nomodule:c,novalidate:c,open:c,ping:m,playsinline:c,readonly:c,rel:m,required:c,reversed:c,selected:t,sizes:P,srcset:P,style:kb,typemustmatch:c,value:lb};S.htmlAttributeMap=Qa;var p={},Ma=p&&p.__extends||function(){var e=function(t,n){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(t,n)};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(p,"__esModule",{value:!0});var V=function(){function e(e,t,n){this.node=e,this.children=t,this.beforeDestroy=n}return e.prototype.destroy=function(){this.beforeDestroy&&this.beforeDestroy(),D(this.node);for(var e=0,t=this.children;e<t.length;e++){t[e].destroy()}},e}(),je=V;p.DOMBaseNodeView=je;var Hb=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.kind="static",t}return Ma(t,e),t}(V),W=Hb;p.DOMStaticNodeView=W;var Dd=function(e){function t(t,n,r,o){var $=e.call(this,t,n,o)||this;return $.node=t,$.children=n,$.change=r,$.beforeDestroy=o,$.kind="dynamic",$}return Ma(t,e),t}(V),Y=Dd;p.DOMDynamicNodeView=Y;var _={};Object.defineProperty(_,"__esModule",{value:!0});var Rb=function(e,t){var r=e.doc.createTextNode(t||""),$=new W(r,[]);return e.append(r),$},ic=function(e,t,r){var $=e.doc.createTextNode(r(t)||""),n=new Y($,[],function(e){var t=r(e)||"";$.nodeValue=t});return e.append($),n},ya=function(){function e(e){this.content=e}return e.prototype.render=function(e,t){return"function"==typeof this.content?ic(e,t,this.content):Rb(e,this.content)},e}(),yd=ya;_.DOMText=yd;var xa=function(e){return new ya(e)};_.text=xa;var k={};Object.defineProperty(k,"__esModule",{value:!0});var D=function(e){var t=e;t&&t.onblur&&(t.onblur=null),e&&e.parentElement&&e.parentElement.removeChild(e)};k.removeNode=D;var ua=function(e){return function(t){null!=e.parentElement&&e.parentElement.insertBefore(t,e)}};k.insertBefore=ua;var q=function(e){return e.filter(function(e){return"dynamic"===e.kind})};k.filterDynamics=q;var g=function(e){return"string"==typeof e||"function"==typeof e?xa(e):e};k.domChildToTemplate=g;var sa=function(e,t,r,$){t=t.toLowerCase(),t=Ua[t]||t;var o=Qa[t]||i;if("function"==typeof r){$.push(function($){return o(e,t,r($))})}else o(e,t,r);return $};k.processAttribute=sa;var qa=function(e,t,r,$,o){var n=e;t="on"+t.toLowerCase();return o.push(function(o){n[t]=function(t){var n=r(o,t,e);null!=n&&$(n)}}),o};k.processEvent=qa;var ma=function(e,t,r,$){t=t.toLowerCase();var o=Ba;if("function"==typeof r){$.push(function($){return o(e,t,r($))})}else o(e,t,r);return $};k.processStyle=ma;var j={},ia=j&&j.__extends||function(){var e=function(r,t){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,r){e.__proto__=r}||function(e,r){for(var t in r)r.hasOwnProperty(t)&&(e[t]=r[t])})(r,t)};return function(r,t){function n(){this.constructor=r}e(r,t),r.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}}();Object.defineProperty(j,"__esModule",{value:!0});var da=function(){function e(e){this.views=e}return e.prototype.destroy=function(){for(var e=0,r=this.views;e<r.length;e++){r[e].destroy()}},e}(),pd=da;j.DOMBaseFragmentView=pd;var Fa=function(e){function r(){var r=null!==e&&e.apply(this,arguments)||this;return r.kind="static",r}return ia(r,e),r}(da),Ia=Fa;j.DOMStaticFragmentView=Ia;var mb=function(e){function r(r,t){var n=e.call(this,r)||this;return n.change=t,n.kind="dynamic",n}return ia(r,e),r}(da),L=mb;j.DOMDynamicFragmentView=L;var K=function(e){var r=q(e);return r.length>0?new mb(e,function(e){for(var t=0,n=r;t<n.length;t++){n[t].change(e)}}):new Fa(e)};j.fragmentView=K;var za=function(){function e(e){this.children=e}return e.prototype.render=function(e,r){var t=this.children.map(function(t){return t.render(e,r)});return K(t)},e}(),dc=za;j.DOMFragment=dc;var gc=function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return new za(e.map(g))};j.fragment=gc;var I={};Object.defineProperty(I,"__esModule",{value:!0});var Lc=function(){function t(){this.listeners=[]}return t.ofOne=function(){return new t},t.ofTwo=function(){return new t},t.ofThree=function(){return new t},t.prototype.emit=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];for(var n=0,r=this.listeners;n<r.length;n++){r[n].apply(void 0,t)}},t.prototype.on=function(t){this.listeners.push(t)},t.prototype.off=function(t){var e=this.listeners.indexOf(t);return!(e<0)&&(this.listeners.splice(e,1),!0)},t.prototype.once=function(t){var e=this,n=function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];e.off(n),t.apply(void 0,r)};this.on(n)},t}(),hd=Lc;I.Emitter=hd;var md=function(t){return function(e){var n,r=!1;return function(){for(var o=[],i=0;i<arguments.length;i++)o[i]=arguments[i];n=o,r||(r=!0,setTimeout(function(){r=!1,e.apply(void 0,n)},t))}}};I.debounce=md;var nb=function(t){var e,n=!1;return function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];e=r,n||(n=!0,requestAnimationFrame(function(){n=!1,t.apply(void 0,e)}))}};I.nextFrame=nb;var n={},ud=n&&n.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function o(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o)}}();Object.defineProperty(n,"__esModule",{value:!0});var jb=function(e){function t(t,r,o,n,p){var $=e.call(this,o,function(e){t.property.set(e);for(var r=0,o=n;r<o.length;r++){o[r].change(e)}})||this;return $.store=t,$.dispatch=r,$._destroy=p,$}return ud(t,e),t.prototype.destroy=function(){this._destroy(),e.prototype.destroy.call(this)},t}(L),Cd=jb;n.DOMComponentView=Cd;var $a=function(){function e(e,t,r){this.store=e,this.children=t,this.delayed=r}return e.prototype.render=function(e,t){var r=function(e){return a.change(e)};this.delayed&&(r=nb(r));var o=this.store;o.property.observable.on(r);var n=function(e){o.process(e)},p=e.withDispatch(n),$=this.children.map(function(e){return e.render(p,o.property.get())}),u=q($),a=new jb(o,n,$,u,function(){o.property.observable.off(r)});return o.property.set(t),a},e}(),Kd=$a;n.DOMComponent=Kd;var Za=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];return new $a(e.store,t.map(g),e.delayed||!1)};n.component=Za;var Ya={};Object.defineProperty(Ya,"__esModule",{value:!0});var Nb=function(){function t(t,n,e,i){this.doc=t,this.append=n,this.parent=e,this.dispatch=i}return t.fromElement=function(n,e){return new t(n.ownerDocument||window&&window.document,function(t){return n.appendChild(t)},n,e)},t.prototype.mapAction=function(n){var e=this;return new t(this.doc,this.append,this.parent,function(t){return e.dispatch(n(t))})},t.prototype.conditionalMapAction=function(n){var e=this;return new t(this.doc,this.append,this.parent,function(t){var i=n(t);void 0!==i&&e.dispatch(i)})},t.prototype.withAppend=function(n){return new t(this.doc,n,this.parent,this.dispatch)},t.prototype.withParent=function(n){return new t(this.doc,this.append,n,this.dispatch)},t.prototype.withDispatch=function(n){return new t(this.doc,this.append,this.parent,n)},t}(),Wa=Nb;Ya.DOMContext=Wa;var T,ea={};Object.defineProperty(ea,"__esModule",{value:!0});var me;!function(e){e.renderComponent=function(e){var t=e.el,o=e.component,r=o.store,n=e.document||document,$=t||n.body,p=o.render(new Wa(n,function(e){return $.appendChild(e)},$,function(){}),r.property.get());return{destroy:function(){return p.destroy()},store:r}},e.render=function(t){var o=t.el,r=t.store,n=t.document,$=t.template,p=Za({store:r},$);return e.renderComponent({el:o,component:p,document:n})}}(me=T||(T={},ea.Tempo=T));var G={};Object.defineProperty(G,"__esModule",{value:!0});var Qc=function(){function t(){this.listeners=[]}return t.ofOne=function(){return new t},t.ofTwo=function(){return new t},t.ofThree=function(){return new t},t.prototype.emit=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];for(var o=0,n=this.listeners;o<n.length;o++){n[o].apply(void 0,t)}},t.prototype.on=function(t){this.listeners.push(t)},t.prototype.off=function(t){var e=this.listeners.indexOf(t);return!(e<0)&&(this.listeners.splice(e,1),!0)},t.prototype.once=function(t){var e=this,o=function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];e.off(o),t.apply(void 0,n)};this.on(o)},t}(),X=Qc;G.Emitter=X;var Ha=function(t){return function(e){var o,n=!1;return function(){for(var r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];o=r,n||(n=!0,setTimeout(function(){n=!1,e.apply(void 0,o)},t))}}};G.debounce=Ha;var nd=function(t){var e,o=!1;return function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];e=n,o||(o=!0,requestAnimationFrame(function(){o=!1,t.apply(void 0,e)}))}};G.nextFrame=nd;var Z={};Object.defineProperty(Z,"__esModule",{value:!0});var Ga=function(r,e){return r===e||r!=r&&e!=e};Z.strictEqual=Ga;var z=function(r,e){if(Ga(r,e))return!0;if(null==r||null==e)return!1;var t=Array.isArray(r);if(t!==Array.isArray(e))return!1;if(t){var a=r,n=e;if((y=a.length)!==n.length)return!1;for(var i=0;i<y;i++)if(!z(a[i],n[i]))return!1;return!0}var u=r instanceof Date;if(u!==e instanceof Date)return!1;if(u)return+r==+e;var f=r instanceof Set;if(f!==e instanceof Set)return!1;if(f){var l=r,o=e;if(l.size!==o.size)return!1;for(var s=l.keys();;){if((x=s.next()).done)break;if(!o.has(x.value))return!1}return!0}var $=r instanceof Map;if($!==e instanceof Map)return!1;if($){var p=r,v=e;if(p.size!==v.size)return!1;for(var c=p.keys();;){var x;if((x=c.next()).done)break;if(!z(p.get(x.value),v.get(x.value)))return!1}return!0}var m="object"==typeof r;if(m!==("object"==typeof e))return!1;if(m){var y,d=r,q=e,E=Object.keys(d),b=Object.keys(q);if((y=E.length)!==b.length)return!1;for(i=0;i<y;i++){var g=E[i];if(!q.hasOwnProperty(g))return!1;if(!z(d[g],q[g]))return!1}return!0}return!1};Z.deepEqual=z;var Ca={};Object.defineProperty(Ca,"__esModule",{value:!0});var Bd=function(){function e(e,t){void 0===t&&(t=z),this.value=e,this.equal=t,this.observable=this.emitter=X.ofOne()}return e.prototype.set=function(e){return!this.equal(this.value,e)&&(this.value=e,this.emit(this.value),!0)},e.prototype.get=function(){return this.value},e.prototype.emit=function(e){this.emitter.emit(e)},e}(),la=Bd;Ca.Property=la;var ha={};Object.defineProperty(ha,"__esModule",{value:!0});var Jd=function(){function e(e,r){this.property=e,this.reducer=r,this.observable=this.emitter=X.ofThree()}return e.ofState=function(r){return new e(new la(r.state,r.equal),r.reducer)},e.prototype.process=function(e){var r=this.reducer(this.property.get(),e),t=this.property.set(r);return this.emitter.emit(r,e,t),t},e}(),ga=Jd;ha.Store=ga;var fa={};Object.defineProperty(fa,"__esModule",{value:!0});var Eb=function(){function r(){}return r.uuid=function(){for(var r="",t=0;t<32;t++){var n=16*Math.random()|0;8!==t&&12!==t&&16!==t&&20!==t||(r+="-"),r+=(12===t?4:16===t?3&n|8:n).toString(16)}return r},r.pluralize=function(r,t){return 1===r?t:t+"s"},r}(),La=Eb;fa.Utils=La;var f,ca={};Object.defineProperty(ca,"__esModule",{value:!0});var le;!function(e){e[e.All=0]="All",e[e.Active=1]="Active",e[e.Completed=2]="Completed"}(le=f||(f={},ca.Filter=f));var pb=function(e){return{id:La.uuid(),title:e,completed:!1}};ca.createTodo=pb;var ja={};Object.defineProperty(ja,"__esModule",{value:!0});var ka="todomvc-tempo",zc=function(){function t(){}return t.get=function(){var t=localStorage.getItem(ka);return t&&JSON.parse(t)||{filter:f.All,todos:[]}},t.set=function(t){return localStorage.setItem(ka,JSON.stringify(t))},t}(),ba=zc;ja.DataStore=ba;var r={},na=r&&r.__assign||function(){return(na=Object.assign||function(e){for(var t,r=1,o=arguments.length;r<o;r++)for(var a in t=arguments[r])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e}).apply(this,arguments)},oa=r&&r.__spreadArrays||function(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var o=Array(e),a=0;for(t=0;t<r;t++)for(var d=arguments[t],i=0,s=d.length;i<s;i++,a++)o[a]=d[i];return o};Object.defineProperty(r,"__esModule",{value:!0});var pa=function(e,t){var r=Object.assign({},e);switch(t.kind){case"adding-todo":t.title?r.adding=t.title:delete r.adding;break;case"create-todo":t.title&&(r.todos=e.todos.concat([pb(t.title)])),delete r.adding;break;case"editing-todo":r.editing={id:t.id,title:t.title};break;case"cancel-adding-todo":delete r.adding;break;case"cancel-editing-todo":delete r.editing;break;case"clear-completed":r.todos=e.todos.filter(function(e){return!e.completed});break;case"remove-todo":r.todos=e.todos.filter(function(e){return e.id!==t.id});break;case"toggle-completed":var o=e.todos.findIndex(function(e){return e.id===t.id}),a=e.todos[o],d=na(na({},a),{completed:!a.completed});r.todos=oa(e.todos.slice(0,o),[d],e.todos.slice(o+1));break;case"toggle-filter":r.filter=t.filter;break;case"update-todo":delete r.editing;var i=e.todos.findIndex(function(e){return e.id===t.id});if(i>=0){var s={id:t.id,title:t.title,completed:e.todos[i].completed};r.todos=oa(e.todos.slice(0,i),[s],e.todos.slice(i+1))}break;default:throw"unreacheable code";}return r};r.reducer=pa;var l={};Object.defineProperty(l,"__esModule",{value:!0});var ra=function(e,r,t){return function($,n){return e($,r,t,n)}},td=function(e,r,t,$){return null!=e?e($,r,t):void 0},x=function(){function e(e,r,t){this.createElement=e,this.attributes=r,this.children=t}return e.prototype.render=function(e,r){var t=this.createElement(e.doc),$=void 0,n=this.attributes,a=n.attrs,m=n.events,o=n.styles,l=n.afterrender,u=n.beforechange,i=n.afterchange,p=n.beforedestroy,M=p&&function(){return p(t,e,$)},v=[];a&&Object.keys(a).forEach(function(e){return sa(t,e,a[e],v)}),m&&Object.keys(m).forEach(function(r){return qa(t,r,m[r],e.dispatch,v)}),o&&Object.keys(o).forEach(function(e){return ma(t,e,o[e],v)});for(var c=0,j=v;c<j.length;c++){(0,j[c])(r)}var f=e.withAppend(function(e){return t.appendChild(e)}).withParent(t),s=this.children.map(function(e){return e.render(f,r)});e.append(t),l&&($=td(l,t,e,r));var d=q(s).map(function(e){return function(r){return e.change(r)}});if(v.push.apply(v,d),u){var h=ra(u,t,e),E=function(e){$=h(e,$)};v.unshift(E)}if(i){var x=ra(i,t,e);E=function(e){$=x(e,$)};v.push(E)}return v.length>0?new Y(t,s,function(e){for(var r=0,t=v;r<t.length;r++){(0,t[r])(e)}},M):new W(t,s,M)},e}(),wd=x;l.DOMElement=wd;var ta=function(e){return function(r){return r.createElement(e)}},zd=function(e,r){for(var t=[],$=2;$<arguments.length;$++)t[$-2]=arguments[$];return new x(ta(e),r,t.map(g))};l.el=zd;var b=function(e){return function(r){for(var t=[],$=1;$<arguments.length;$++)t[$-1]=arguments[$];return new x(ta(e),r,t.map(g))}};l.el2=b;var va={svg:"http://www.w3.org/2000/svg"};l.defaultNamespaces=va;var wa=function(e,r){return function(t){return t.createElementNS(e,r)}},Fd=function(e,r,t){for(var $=[],n=3;n<arguments.length;n++)$[n-3]=arguments[n];var a=va[e]||e;return new x(wa(a,r),t,$.map(g))};l.elNS=Fd;var Hd=function(e,r){return function(t){for(var $=[],n=1;n<arguments.length;n++)$[n-1]=arguments[n];return new x(wa(e,r),t,$.map(g))}};l.elNS2=Hd;var a={};Object.defineProperty(a,"__esModule",{value:!0});var o=b("a");a.a=o;var Md=b("abbr");a.abbr=Md;var Od=b("address");a.address=Od;var Qd=b("applet");a.applet=Qd;var Sd=b("area");a.area=Sd;var Ud=b("article");a.article=Ud;var Wd=b("aside");a.aside=Wd;var Yd=b("audio");a.audio=Yd;var $d=b("b");a.b=$d;var ae=b("base");a.base=ae;var ce=b("basefont");a.basefont=ce;var de=b("bdi");a.bdi=de;var ee=b("bdo");a.bdo=ee;var fe=b("blockquote");a.blockquote=fe;var he=b("body");a.body=he;var ie=b("br");a.br=ie;var J=b("button");a.button=J;var qb=b("canvas");a.canvas=qb;var rb=b("caption");a.caption=rb;var sb=b("cite");a.cite=sb;var tb=b("code");a.code=tb;var ub=b("col");a.col=ub;var vb=b("colgroup");a.colgroup=vb;var wb=b("data");a.data=wb;var xb=b("datalist");a.datalist=xb;var yb=b("dd");a.dd=yb;var zb=b("del");a.del=zb;var Ab=b("details");a.details=Ab;var Bb=b("dfn");a.dfn=Bb;var Cb=b("dialog");a.dialog=Cb;var Db=b("dir");a.dir=Db;var Aa=b("div");a.div=Aa;var Fb=b("dl");a.dl=Fb;var Gb=b("dt");a.dt=Gb;var ke=b("em");a.em=ke;var Ib=b("embed");a.embed=Ib;var Jb=b("fieldset");a.fieldset=Jb;var Kb=b("figcaption");a.figcaption=Kb;var Lb=b("figure");a.figure=Lb;var Mb=b("font");a.font=Mb;var aa=b("footer");a.footer=aa;var Ob=b("form");a.form=Ob;var Pb=b("frame");a.frame=Pb;var Qb=b("frameset");a.frameset=Qb;var Da=b("h1");a.h1=Da;var Sb=b("h2");a.h2=Sb;var Tb=b("h3");a.h3=Tb;var Ub=b("h4");a.h4=Ub;var Vb=b("h5");a.h5=Vb;var Wb=b("h6");a.h6=Wb;var Xb=b("head");a.head=Xb;var Ea=b("header");a.header=Ea;var Zb=b("hgroup");a.hgroup=Zb;var $b=b("hr");a.hr=$b;var _b=b("html");a.html=_b;var ac=b("i");a.i=ac;var bc=b("iframe");a.iframe=bc;var cc=b("img");a.img=cc;var w=b("input");a.input=w;var ec=b("ins");a.ins=ec;var fc=b("kbd");a.kbd=fc;var $=b("label");a.label=$;var hc=b("legend");a.legend=hc;var u=b("li");a.li=u;var jc=b("link");a.link=jc;var kc=b("listing");a.listing=kc;var lc=b("main");a.main=lc;var mc=b("map");a.map=mc;var nc=b("mark");a.mark=nc;var oc=b("marquee");a.marquee=oc;var pc=b("menu");a.menu=pc;var qc=b("meta");a.meta=qc;var rc=b("meter");a.meter=rc;var sc=b("nav");a.nav=sc;var tc=b("noscript");a.noscript=tc;var uc=b("object");a.object=uc;var vc=b("ol");a.ol=vc;var wc=b("optgroup");a.optgroup=wc;var xc=b("option");a.option=xc;var yc=b("output");a.output=yc;var F=b("p");a.p=F;var Ac=b("param");a.param=Ac;var Bc=b("picture");a.picture=Bc;var Cc=b("pre");a.pre=Cc;var Dc=b("progress");a.progress=Dc;var Ec=b("q");a.q=Ec;var Fc=b("rp");a.rp=Fc;var Gc=b("rt");a.rt=Gc;var Hc=b("ruby");a.ruby=Hc;var Ic=b("s");a.s=Ic;var Jc=b("samp");a.samp=Jc;var Kc=b("script");a.script=Kc;var E=b("section");a.section=E;var Mc=b("select");a.select=Mc;var Nc=b("slot");a.slot=Nc;var Oc=b("small");a.small=Oc;var Pc=b("source");a.source=Pc;var Ka=b("span");a.span=Ka;var Rc=b("strong");a.strong=Rc;var Sc=b("style");a.style=Sc;var Tc=b("sub");a.sub=Tc;var Uc=b("summary");a.summary=Uc;var Vc=b("sup");a.sup=Vc;var Wc=b("table");a.table=Wc;var Xc=b("tbody");a.tbody=Xc;var Yc=b("td");a.td=Yc;var Zc=b("template");a.template=Zc;var $c=b("textarea");a.textarea=$c;var _c=b("tfoot");a.tfoot=_c;var ad=b("th");a.th=ad;var bd=b("thead");a.thead=bd;var cd=b("time");a.time=cd;var dd=b("title");a.title=dd;var ed=b("tr");a.tr=ed;var fd=b("track");a.track=fd;var gd=b("u");a.u=gd;var U=b("ul");a.ul=U;var id=b("var");a.varEl=id;var jd=b("video");a.video=jd;var kd=b("wbr");a.wbr=kd;var ld=b("xmp");a.xmp=ld;var s={};Object.defineProperty(s,"__esModule",{value:!0});var Na=function(){function e(e,t){this.map=e,this.children=t}return e.prototype.render=function(e,t){var a=this.children,r=this.map,$=r(t),n=a.map(function(t){return t.render(e,$)}),p=q(n);return 0===p.length?new Ia(n):new L(n,function(e){for(var t=r(e),a=0,$=p;a<$.length;a++){$[a].change(t)}})},e}(),od=Na;s.MapStateTemplate=od;var Oa=function(e){for(var t=[],a=1;a<arguments.length;a++)t[a-1]=arguments[a];return new Na(e.map,t.map(g))};s.mapState=Oa;var Pa=function(){function e(e,t){this.map=e,this.children=t}return e.prototype.render=function(e,t){var a=this.children,r=this.map,$=a.map(function(a){return a.render(e.conditionalMapAction(r),t)});return K($)},e}(),rd=Pa;s.MapActionTemplate=rd;var sd=function(e){for(var t=[],a=1;a<arguments.length;a++)t[a-1]=arguments[a];return new Pa(e.map,t.map(g))};s.mapAction=sd;var A={};Object.defineProperty(A,"__esModule",{value:!0});var Ra=function(){function i(i,e,t,r){this.ref=i,this.repeatUntil=e,this.ctx=t,this.children=r,this.kind="dynamic",this.childrenView=[]}return i.prototype.destroy=function(){D(this.ref);for(var i=0,e=this.childrenView;i<e.length;i++)for(var t=0,r=e[i];t<r.length;t++){r[t].destroy()}this.childrenView=[]},i.prototype.change=function(i){for(var e,t=this,r=this.childrenView.length,n=0;void 0!==(e=this.repeatUntil(i,n));){if(n<r)for(var h=0,$=q(this.childrenView[n]);h<$.length;h++){$[h].change(e)}else this.childrenView.push(this.children.map(function(i){return i.render(t.ctx,e)}));n++}for(var o=n;o<r;){for(var l=0,a=this.childrenView[o];l<a.length;l++){a[l].destroy()}o++}this.childrenView=this.childrenView.slice(0,n)},i}(),vd=Ra;A.DOMUntilView=vd;var Sa=function(){function i(i,e){this.options=i,this.children=e}return i.prototype.render=function(i,e){var t=i.doc.createComment(this.options.refId||"md:until");i.append(t);var r=new Ra(t,this.options.repeatUntil,i.withAppend(ua(t)),this.children);return r.change(e),r},i}(),xd=Sa;A.DOMUntilTemplate=xd;var Ta=function(i){for(var e=[],t=1;t<arguments.length;t++)e[t-1]=arguments[t];return new Sa(i,e.map(g))};A.until=Ta;var y={},Ad=y&&y.__spreadArrays||function(){for(var r=0,o=0,e=arguments.length;o<e;o++)r+=arguments[o].length;var $=Array(r),a=0;for(o=0;o<e;o++)for(var t=arguments[o],n=0,x=t.length;n<x;n++,a++)$[a]=t[n];return $};Object.defineProperty(y,"__esModule",{value:!0});var Va=function(r){for(var o=[],e=1;e<arguments.length;e++)o[e-1]=arguments[e];return Ta.apply(void 0,Ad([{refId:r.refId||"md:for_each",repeatUntil:function(r,o){return r[o]}}],o))};y.forEach=Va;var v={};Object.defineProperty(v,"__esModule",{value:!0});var Xa=function(){function e(e,r,t,n,i){this.condition=e,this.ctx=r,this.dispatch=t,this.removeNode=n,this.children=i,this.kind="dynamic"}return e.prototype.change=function(e){var r=this;if(this.condition(e)){if(null==this.views)this.views=this.children.map(function(t){return t.render(r.ctx,e)}),this.dynamics=q(this.views);else if(this.dynamics)for(var t=0,n=this.dynamics;t<n.length;t++){n[t].change(e)}}else this.destroyViews()},e.prototype.destroy=function(){this.destroyViews(),this.removeNode()},e.prototype.destroyViews=function(){if(null!=this.views){for(var e=0,r=this.views;e<r.length;e++){r[e].destroy()}this.views=void 0,this.dynamics=void 0}},e}(),Ed=Xa;v.DOMWhenView=Ed;var R=function(){function e(e,r){this.options=e,this.children=r}return e.prototype.render=function(e,r){var t=e.doc.createComment(this.options.refId||"md:when");e.append(t);var n=t.parentElement,i=new Xa(this.options.condition,e.withAppend(function(e){return n.insertBefore(e,t)}),e.dispatch,function(){return D(t)},this.children.map(g));return i.change(r),i},e}(),Gd=R;v.DOMWhen=Gd;var Q=function(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];return new R(e,r)};v.when=Q;var Id=function(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];return new R({condition:function(r){return!e.condition(r)},refId:e.refId||"md:unless"},r)};v.unless=Id;var e={};Object.defineProperty(e,"__esModule",{value:!0});var _a=function(){return function(e){this.title=e,this.kind="adding-todo"}}(),Ld=_a;e.AddingTodo=Ld;var ab=function(){return function(e){this.title=e,this.kind="create-todo"}}(),Nd=ab;e.CreateTodo=Nd;var bb=function(){return function(){this.kind="cancel-adding-todo"}}(),Pd=bb;e.CancelAddingTodo=Pd;var cb=function(){return function(){this.kind="cancel-editing-todo"}}(),Rd=cb;e.CancelEditingTodo=Rd;var db=function(){return function(){this.kind="clear-completed"}}(),Td=db;e.ClearCompleted=Td;var eb=function(){return function(e,o){this.id=e,this.title=o,this.kind="editing-todo"}}(),Vd=eb;e.EditingTodo=Vd;var fb=function(){return function(e){this.id=e,this.kind="remove-todo"}}(),Xd=fb;e.RemoveTodo=Xd;var gb=function(){return function(e){this.filter=e,this.kind="toggle-filter"}}(),Zd=gb;e.ToggleFilter=Zd;var hb=function(){return function(e){this.id=e,this.kind="toggle-completed"}}(),_d=hb;e.ToggleTodo=_d;var ib=function(){return function(e,o){this.id=e,this.title=o,this.kind="update-todo"}}(),be=ib;e.UpdateTodo=be;var d={adddingTodo:function(e){return new _a(e)},addTodo:function(e){return new ab(e)},cancelAddTodo:new bb,cancelUpdateTodo:new cb,clearCompleted:new db,editingTodo:function(e,o){return new eb(e,o)},removeTodo:function(e){return new fb(e)},toggleTodo:function(e){return new hb(e)},toggleFilter:function(e){return new gb(e)},updateTodo:function(e,o){return new ib(e,o)}};e.Action=d;var H={},C=H&&H.__assign||function(){return(C=Object.assign||function(t){for(var e,o=1,$=arguments.length;o<$;o++)for(var r in e=arguments[o])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t}).apply(this,arguments)};Object.defineProperty(H,"__esModule",{value:!0});var N=function(t){return function(e){return e.filter===t?void 0:d.toggleFilter(t)}},ge=function(t){return t===f.All?function(t){return!0}:t===f.Completed?function(t){return t.completed}:function(t){return!t.completed}},M=function(t){return function(e){return e.filter===t?"selected":void 0}},ob=E({},E({attrs:{className:"todoapp"}},Ea({attrs:{className:"header"}},Da({},"todos"),w({attrs:{className:"new-todo",placeholder:"What needs to be done?",autofocus:function(t){return null==t.editing},value:function(t){return t.adding}},events:{keydown:function(t,e,o){return 13===e.keyCode?d.addTodo(o.value.trim()):27===e.keyCode?d.cancelAddTodo:d.adddingTodo(o.value)}}})),E({attrs:{className:"main"}},w({attrs:{id:"toggle-all",className:"toggle-all",type:"checkbox"}}),$({attrs:{for:"toggle-all"}},"Mark all as complete"),U({attrs:{className:"todo-list"}},Oa({map:function(t){return t.todos.filter(ge(t.filter)).map(function(e){return t.editing&&t.editing.id===e.id?C(C({},e),{editing:!0,title:t.editing.title}):C(C({},e),{editing:!1})})}},Va({},u({attrs:{className:function(t){return[t.completed?"completed":void 0,t.editing?"editing":void 0].filter(function(t){return null!=t}).join(" ")||void 0}}},Aa({attrs:{className:"view"}},w({attrs:{className:"toggle",type:"checkbox",checked:function(t){return t.completed}},events:{change:function(t){return d.toggleTodo(t.id)}}}),$({events:{dblclick:function(t){return d.editingTodo(t.id,t.title)}}},function(t){return t.title}),J({attrs:{className:"destroy"},events:{click:function(t){return d.removeTodo(t.id)}}})),Q({condition:function(t){return t.editing}},w({afterrender:function(t,e){return e.focus()},attrs:{className:"edit",value:function(t){return t.title}},events:{keypress:function(t,e,o){if(13===e.keyCode){var $=o.value.trim();return $?d.updateTodo(t.id,$):d.removeTodo(t.id)}return 27===e.keyCode?d.cancelUpdateTodo:d.editingTodo(t.id,o.value)},blur:function(t,e,o){return d.updateTodo(t.id,o.value.trim())}}}))))))),aa({attrs:{className:"footer"},styles:{display:function(t){return 0===t.todos.length?"none":"block"}}},Ka({attrs:{className:"todo-count"}},function(t){var e=t.todos.filter(function(t){return t.completed}).length,o=t.todos.length-e;return 1===o?"1 item left":o+" items left"}),U({attrs:{className:"filters"}},u({},o({attrs:{href:"#/",className:M(f.All)},events:{click:N(f.All)}},"All")),u({},o({attrs:{href:"#/active",className:M(f.Active)},events:{click:N(f.Active)}},"Active")),u({},o({attrs:{href:"#/completed",className:M(f.Completed)},events:{click:N(f.Completed)}},"Completed"))),Q({condition:function(t){return t.todos.filter(function(t){return t.completed}).length>0}},J({attrs:{className:"clear-completed"},events:{click:function(){return d.clearCompleted}}},"Clear completed")))),aa({attrs:{className:"info"}},F({},"Double-click to edit a todo"),F({},"Created by ",o({attrs:{href:"http://github.com/fponticelli"}},"Franco Ponticelli")),F({},"Part of ",o({attrs:{href:"http://todomvc.com"}},"TodoMVC"))));H.template=ob;var B={};Object.defineProperty(B,"__esModule",{value:!0});var Yb=ba.get(),Ja=ga.ofState({state:Yb,reducer:pa}),qd=Ha(250)(function(e){return ba.set(e)});Ja.property.observable.on(qd),T.render({store:Ja,template:ob});if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=B}else if(typeof define==="function"&&define.amd){define(function(){return B})}return{"ZCfc":B};});