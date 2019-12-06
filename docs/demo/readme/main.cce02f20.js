(function () {var ua={};Object.defineProperty(ua,"__esModule",{value:!0});var g=function(r,e){for(var t=r.length,$=new Array(t),a=0;a<t;a++)$[a]=e(r[a]);return $};ua.mapArray=g;var d={};Object.defineProperty(d,"__esModule",{value:!0});function ad(t,e,$){var r=t.style;r[e]=null==$?null:$}var J=ad;function h(t,e,$){null==$?t.removeAttribute(e):t.setAttribute(e,$)}d.setOneStyle=J;var pa=h;function ob(t,e,$){var r=t;r[e]=null==$?null:$}d.setAttribute=pa;var na=ob;function vd(t,e,$){if(null==$)t.removeAttribute(e);else if("string"==typeof $)h(t,e,$);else{var r=g(Object.keys($),function(t){return t+": "+$[t]+";"}).join(" ");h(t,e,r.length&&r||null)}}d.setProperty=na;var ma=vd;function Ja(t,e,$){var r=t;if(null==$)r[e]=null;else{var E=!0===$||"true"===$;r[e]=E}}d.setStyleAttribute=ma;var o=Ja;function _c(t,e,$){h(t,e,!0===$||"true"===$?"true":!1===$?"false":null)}d.setBoolProperty=o;var D=_c;function md(t,e,$){h(t,e,!0===$||"true"===$?"":null)}d.setEnumBoolAttribute=D;var c=md;function wa(t,e,$){Array.isArray($)?h(t,e,$.join(", ")||null):h(t,e,$&&String($)||null)}d.setBoolAttribute=c;var L=wa;function Ia(t,e,$){Array.isArray($)?h(t,e,$.join(" ")||null):h(t,e,$&&String($)||null)}d.setCommaSeparated=L;var j=Ia;d.setSpaceSeparated=j;var z={};Object.defineProperty(z,"__esModule",{value:!0});var la={acceptcharset:"accept-charset",asattr:"as",classname:"class",httpequiv:"http-equiv",htmlfor:"for"};z.attributeNameMap=la;var ia={"accept-charset":j,class:j,acceptcharset:j,async:c,autofocus:c,autoplay:c,checked:o,contenteditable:D,controls:c,default:c,defer:c,disabled:c,draggable:D,formnovalidate:c,headers:j,hidden:c,ismap:c,itemscope:c,loop:c,multiple:o,muted:o,nomodule:c,novalidate:c,open:c,ping:j,playsinline:c,readonly:c,rel:j,required:c,reversed:c,selected:o,sizes:L,srcset:L,style:ma,typemustmatch:c,value:na};z.htmlAttributeMap=ia;var m={},ha=m&&m.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function o(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o)}}();Object.defineProperty(m,"__esModule",{value:!0});var E=function(){function e(e,t,r,o){this.node=e,this.children=t,this.request=r,this.beforeDestroy=o}return e.prototype.destroy=function(){this.beforeDestroy&&this.beforeDestroy(),ea(this.node);for(var e=0,t=this.children;e<t.length;e++){t[e].destroy()}},e}(),za=E;m.DOMBaseNodeView=za;var Da=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.kind="static",t}return ha(t,e),t}(E),F=Da;m.DOMStaticNodeView=F;var Ga=function(e){function t(t,r,o,w,$){var i=e.call(this,t,r,w,$)||this;return i.node=t,i.children=r,i.change=o,i.request=w,i.beforeDestroy=$,i.kind="dynamic",i}return ha(t,e),t}(E),H=Ga;m.DOMDynamicNodeView=H;var I={};Object.defineProperty(I,"__esModule",{value:!0});var Na=function(e,t){var n=e.doc.createTextNode(t||""),r=new F(n,[],function(){});return e.append(n),r},cb=function(e,t,n){var r=e.doc.createTextNode(n(t)||""),$="",o=new H(r,[],function(e){var t=n(e)||"";t!==$&&(r.nodeValue=t,t.length<5e3&&($=t))},function(){});return e.append(r),o},ga=function(){function e(e){this.content=e}return e.prototype.render=function(e,t){return"function"==typeof this.content?cb(e,t,this.content):Na(e,this.content)},e}(),rb=ga;I.DOMTextTemplate=rb;var fa=function(e){return new ga(e)};I.text=fa;var i={};Object.defineProperty(i,"__esModule",{value:!0});function hd(e){var t=e;t&&t.onblur&&(t.onblur=null),e&&void 0!==e.ownerDocument&&e.parentElement&&e.parentElement.removeChild(e)}var ea=hd;function od(e){return function(t){null!=e.parentElement&&e.parentElement.insertBefore(t,e)}}i.removeNode=ea;var rd=od;function sd(e){return e.filter(function(e){return"dynamic"===e.kind})}i.insertBefore=rd;var q=sd;function va(e){return"string"==typeof e||"function"==typeof e||void 0===e?fa(e):e}i.filterDynamics=q;var f=va;function ya(e,t,r,$){var n=ia[t]||pa;if("function"==typeof r){if("INPUT"===e.nodeName||"TEXTAREA"===e.nodeName){var o=function($){var o=r($);n(e,t,o)};$.push(o)}else{var a=void 0;o=function($){var o=r($);o!==a&&(n(e,t,o),String(o).length<5e4&&(a=o))};$.push(o)}}else n(e,t,r);return $}i.domChildToTemplate=f;var O=ya;function Ba(e,t,r,$,n){var o;e[t]=function(t){var n=r(o,t,e);void 0!==n&&$(n)};return n.push(function(e){o=e}),n}i.processAttribute=O;var aa=Ba;function Ea(e,t,r,$){if("function"==typeof r){var n;$.push(function($){var o=r($);o!==n&&(J(e,t,o),n=o)})}else J(e,t,r);return $}i.processEvent=aa;var _=Ea;i.processStyle=_;var e={},Z=e&&e.__extends||function(){var t=function(e,a){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var a in e)e.hasOwnProperty(a)&&(t[a]=e[a])})(e,a)};return function(e,a){function r(){this.constructor=e}t(e,a),e.prototype=null===a?Object.create(a):(r.prototype=a.prototype,new r)}}();Object.defineProperty(e,"__esModule",{value:!0});var G=function(){function t(t){this.views=t}return t.prototype.destroy=function(){for(var t=0,e=this.views;t<e.length;t++){e[t].destroy()}},t.prototype.request=function(t){for(var e=0,a=this.views;e<a.length;e++){a[e].request(t)}},t}(),Ka=G;e.DOMBaseFragmentView=Ka;var Y=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.kind="static",e}return Z(e,t),e}(G),X=Y;e.DOMStaticFragmentView=X;var V=function(t){function e(e,a){var r=t.call(this,e)||this;return r.change=a,r.kind="dynamic",r}return Z(e,t),e}(G),K=V;e.DOMDynamicFragmentView=K;var y=function(t){var e=q(t);return e.length>0?new V(t,function(t){for(var a=0,r=e;a<r.length;a++){r[a].change(t)}}):new Y(t)};e.fragmentView=y;var T=function(){function t(t){this.children=t}return t.prototype.render=function(t,e){var a=g(this.children,function(a){return a.render(t,e)});return y(a)},t}(),cd=T;e.DOMFragmentTemplate=cd;var ed=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return new T(g(t,f))};e.fragment=ed;var n={},jd=n&&n.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function o(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o)}}();Object.defineProperty(n,"__esModule",{value:!0});var P=function(e){function t(t,r,o,n,$){var p=e.call(this,o,function(e){t.property.set(e);for(var r=0,o=n;r<o.length;r++){o[r].change(e)}})||this;return p.store=t,p.dispatch=r,p._destroy=$,p}return jd(t,e),t.prototype.request=function(e){throw"TODO"},t.prototype.destroy=function(){this._destroy(),e.prototype.destroy.call(this)},t}(K),nd=P;n.DOMComponentView=nd;var da=function(){function e(e,t,r){this.store=e,this.children=t,this.delayed=r}return e.prototype.render=function(e,t){var r;if(this.delayed){var o=!0;r=function(e){o&&(o=!1,setTimeout(function(){c.change(e),o=!0}))}}else r=function(e){c.change(e)};var n=this.store,$=n.property;$.observable.on(r);var p=function(e){n.process(e)},a=e.withDispatch(p),i=g(this.children,function(e){return e.render(a,$.get())}),y=q(i),c=new P(n,p,i,y,function(){$.observable.off(r)});return $.set(t),c},e}(),pd=da;n.DOMComponentTemplate=pd;var Q=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];return new da(e.store,g(t,f),e.delayed||!1)};n.component=Q;var R={};Object.defineProperty(R,"__esModule",{value:!0});var ud=function(){function t(t,n,e,r){this.doc=t,this.append=n,this.parent=e,this.dispatch=r}return t.fromElement=function(n,e){return new t(n.ownerDocument||window&&window.document,function(t){return n.appendChild(t)},n,e)},t.prototype.mapAction=function(n){var e=this;return new t(this.doc,this.append,this.parent,function(t){return e.dispatch(n(t))})},t.prototype.conditionalMapAction=function(n){var e=this;return new t(this.doc,this.append,this.parent,function(t){var r=n(t);void 0!==r&&e.dispatch(r)})},t.prototype.withAppend=function(n){return new t(this.doc,n,this.parent,this.dispatch)},t.prototype.withParent=function(n){return new t(this.doc,this.append,n,this.dispatch)},t.prototype.withDispatch=function(n){return new t(this.doc,this.append,this.parent,n)},t}(),S=ud;R.DOMContext=S;var M,U={};Object.defineProperty(U,"__esModule",{value:!0});var Bd;!function(e){e.renderComponent=function(e){var o=e.el,r=e.component,t=r.store,n=e.document||document,$=o||n.body,p=r.render(new S(n,function(e){return $.appendChild(e)},$,function(){}),t.property.get());return{destroy:function(){return p.destroy()},request:function(e){return p.request(e)},store:t}},e.render=function(o){var r=o.el,t=o.store,n=o.document,$=o.template,p=o.delayed,c=Q({store:t,delayed:p},$);return e.renderComponent({el:r,component:c,document:n})}}(Bd=M||(M={},U.Tempo=M));var k={};Object.defineProperty(k,"__esModule",{value:!0});var W=function(e,r,t){return function(a,$){return e(a,r,t,$)}},Aa=function(e,r,t,a){return void 0!==typeof e?e(a,r,t):void 0},s=function(){function e(e,r,t,a,$,n,b,o,s,v){this.createElement=e,this.attrs=r,this.events=t,this.styles=a,this.afterrender=$,this.beforechange=n,this.afterchange=b,this.beforedestroy=o,this.respond=s,this.children=v}return e.prototype.render=function(e,r){for(var t=this,a=this.createElement(e.doc),$=void 0,n=[],b=0,o=this.attrs;b<o.length;b++){var s=o[b];O(a,s.name,s.value,n)}for(var v=0,p=this.events;v<p.length;v++){s=p[v];aa(a,s.name,s.value,e.dispatch,n)}for(var i=0,l=this.styles;i<l.length;i++){s=l[i];_(a,s.name,s.value,n)}for(var c=0,u=n;c<u.length;c++){(0,u[c])(r)}var m=e.withAppend(function(e){return a.appendChild(e)}).withParent(a),L=g(this.children,function(e){return e.render(m,r)});e.append(a),this.afterrender&&($=Aa(this.afterrender,a,e,r));var f=g(q(L),function(e){return function(r){return e.change(r)}});if(n.push.apply(n,f),this.beforechange){var X=W(this.beforechange,a,e),d=function(e){$=X(e,$)};n.unshift(d)}if(this.afterchange){var h=W(this.afterchange,a,e);d=function(e){$=h(e,$)};n.push(d)}var y=this.beforedestroy&&function(){return t.beforedestroy(a,e,$)},x=this.respond?function(r){return t.respond(r,a,e)}:function(){};return n.length>0?new H(a,L,function(e){for(var r=0,t=n;r<t.length;r++){(0,t[r])(e)}},x,y):new F(a,L,x,y)},e}(),Ca=s;function u(e){return g(Object.keys(e||{}),function(r){var t=r.toLowerCase();return{name:t=la[t]||t,value:e[r]}})}function v(e){return g(Object.keys(e||{}),function(r){return{name:"on"+r.toLowerCase(),value:e[r]}})}function x(e){return g(Object.keys(e||{}),function(r){return{name:r,value:e[r]}})}k.DOMElement=Ca;var $=function(e){return function(r){return r.createElement(e)}},Ha=function(e,r){for(var t=[],a=2;a<arguments.length;a++)t[a-2]=arguments[a];return new s($(e),u(r.attrs),v(r.events),x(r.styles),r.afterrender,r.beforechange,r.afterchange,r.beforedestroy,r.respond,g(t,f))};k.el=Ha;var a=function(e){return function(r){for(var t=[],a=1;a<arguments.length;a++)t[a-1]=arguments[a];return new s($(e),u(r.attrs),v(r.events),x(r.styles),r.afterrender,r.beforechange,r.afterchange,r.beforedestroy,r.respond,g(t,f))}};k.el2=a;var ba={svg:"http://www.w3.org/2000/svg"};k.defaultNamespaces=ba;var ca=function(e,r){return function(t){return t.createElementNS(e,r)}},La=function(e,r,t){for(var a=[],$=3;$<arguments.length;$++)a[$-3]=arguments[$];var n=ba[e]||e;return new s(ca(n,r),u(t.attrs),v(t.events),x(t.styles),t.afterrender,t.beforechange,t.afterchange,t.beforedestroy,t.respond,g(a,f))};k.elNS=La;var Ma=function(e,r){return function(t){for(var a=[],$=1;$<arguments.length;$++)a[$-1]=arguments[$];return new s(ca(e,r),u(t.attrs),v(t.events),x(t.styles),t.afterrender,t.beforechange,t.afterchange,t.beforedestroy,t.respond,g(a,f))}};k.elNS2=Ma;var b={};Object.defineProperty(b,"__esModule",{value:!0});var Oa=a("a");b.a=Oa;var Pa=a("abbr");b.abbr=Pa;var Qa=a("address");b.address=Qa;var Ra=a("applet");b.applet=Ra;var Sa=a("area");b.area=Sa;var Ta=a("article");b.article=Ta;var Ua=a("aside");b.aside=Ua;var Va=a("audio");b.audio=Va;var Wa=a("b");b.b=Wa;var Xa=a("base");b.base=Xa;var Ya=a("basefont");b.basefont=Ya;var Za=a("bdi");b.bdi=Za;var $a=a("bdo");b.bdo=$a;var _a=a("blockquote");b.blockquote=_a;var ab=a("body");b.body=ab;var bb=a("br");b.br=bb;var t=a("button");b.button=t;var db=a("canvas");b.canvas=db;var eb=a("caption");b.caption=eb;var fb=a("cite");b.cite=fb;var gb=a("code");b.code=gb;var hb=a("col");b.col=hb;var ib=a("colgroup");b.colgroup=ib;var jb=a("data");b.data=jb;var kb=a("datalist");b.datalist=kb;var lb=a("dd");b.dd=lb;var mb=a("del");b.del=mb;var nb=a("details");b.details=nb;var Ad=a("dfn");b.dfn=Ad;var pb=a("dialog");b.dialog=pb;var qb=a("dir");b.dir=qb;var p=a("div");b.div=p;var sb=a("dl");b.dl=sb;var tb=a("dt");b.dt=tb;var ub=a("em");b.em=ub;var vb=a("embed");b.embed=vb;var wb=a("fieldset");b.fieldset=wb;var xb=a("figcaption");b.figcaption=xb;var yb=a("figure");b.figure=yb;var zb=a("font");b.font=zb;var Ab=a("footer");b.footer=Ab;var Bb=a("form");b.form=Bb;var Cb=a("frame");b.frame=Cb;var Db=a("frameset");b.frameset=Db;var Eb=a("h1");b.h1=Eb;var Fb=a("h2");b.h2=Fb;var Gb=a("h3");b.h3=Gb;var Hb=a("h4");b.h4=Hb;var Ib=a("h5");b.h5=Ib;var Jb=a("h6");b.h6=Jb;var Kb=a("head");b.head=Kb;var Lb=a("header");b.header=Lb;var Mb=a("hgroup");b.hgroup=Mb;var Nb=a("hr");b.hr=Nb;var Ob=a("html");b.html=Ob;var Pb=a("i");b.i=Pb;var Qb=a("iframe");b.iframe=Qb;var Rb=a("img");b.img=Rb;var Sb=a("input");b.input=Sb;var Tb=a("ins");b.ins=Tb;var Ub=a("kbd");b.kbd=Ub;var Vb=a("label");b.label=Vb;var Wb=a("legend");b.legend=Wb;var Xb=a("li");b.li=Xb;var Yb=a("link");b.link=Yb;var Zb=a("listing");b.listing=Zb;var $b=a("main");b.main=$b;var _b=a("map");b.map=_b;var ac=a("mark");b.mark=ac;var bc=a("marquee");b.marquee=bc;var cc=a("menu");b.menu=cc;var dc=a("meta");b.meta=dc;var ec=a("meter");b.meter=ec;var fc=a("nav");b.nav=fc;var gc=a("noscript");b.noscript=gc;var hc=a("object");b.object=hc;var ic=a("ol");b.ol=ic;var jc=a("optgroup");b.optgroup=jc;var kc=a("option");b.option=kc;var lc=a("output");b.output=lc;var mc=a("p");b.p=mc;var nc=a("param");b.param=nc;var oc=a("picture");b.picture=oc;var pc=a("pre");b.pre=pc;var qc=a("progress");b.progress=qc;var rc=a("q");b.q=rc;var sc=a("rp");b.rp=sc;var tc=a("rt");b.rt=tc;var uc=a("ruby");b.ruby=uc;var vc=a("s");b.s=vc;var wc=a("samp");b.samp=wc;var xc=a("script");b.script=xc;var yc=a("section");b.section=yc;var zc=a("select");b.select=zc;var Ac=a("slot");b.slot=Ac;var Bc=a("small");b.small=Bc;var Cc=a("source");b.source=Cc;var Dc=a("span");b.span=Dc;var Ec=a("strong");b.strong=Ec;var Fc=a("style");b.style=Fc;var Gc=a("sub");b.sub=Gc;var Hc=a("summary");b.summary=Hc;var Ic=a("sup");b.sup=Ic;var Jc=a("table");b.table=Jc;var Kc=a("tbody");b.tbody=Kc;var Lc=a("td");b.td=Lc;var Mc=a("template");b.template=Mc;var Nc=a("textarea");b.textarea=Nc;var Oc=a("tfoot");b.tfoot=Oc;var Pc=a("th");b.th=Pc;var Qc=a("thead");b.thead=Qc;var Rc=a("time");b.time=Rc;var Sc=a("title");b.title=Sc;var Tc=a("tr");b.tr=Tc;var Uc=a("track");b.track=Uc;var Vc=a("u");b.u=Vc;var Wc=a("ul");b.ul=Wc;var Xc=a("var");b.varEl=Xc;var Yc=a("video");b.video=Yc;var Zc=a("wbr");b.wbr=Zc;var $c=a("xmp");b.xmp=$c;var l={};Object.defineProperty(l,"__esModule",{value:!0});var B=function(){function e(e,p){this.map=e,this.children=p}return e.prototype.render=function(e,p){var a=this.children,t=this.map,r=t(p),$=g(a,function(p){return p.render(e,r)}),n=q($);return 0===n.length?new X($):new K($,function(e){for(var p=t(e),a=0,r=n;a<r.length;a++){r[a].change(p)}})},e}(),bd=B;l.MapStateTemplate=bd;var ja=function(e){for(var p=[],a=1;a<arguments.length;a++)p[a-1]=arguments[a];return new B(e.map,g(p,f))};l.mapState=ja;var dd=function(e){for(var p=[],a=1;a<arguments.length;a++)p[a-1]=arguments[a];return new B(function(p){return[e.map(p),p]},g(p,f))};l.mapStateAndKeep=dd;var ka=function(){function e(e,p){this.map=e,this.children=p}return e.prototype.render=function(e,p){var a=this.children,t=this.map,r=g(a,function(a){return a.render(e.conditionalMapAction(t),p)});return y(r)},e}(),fd=ka;l.MapActionTemplate=fd;var gd=function(e){for(var p=[],a=1;a<arguments.length;a++)p[a-1]=arguments[a];return new ka(e.map,g(p,f))};l.mapAction=gd;var r={};Object.defineProperty(r,"__esModule",{value:!0});var id=function(){function t(){this.listeners=[]}return t.ofOne=function(){return new t},t.ofTwo=function(){return new t},t.ofThree=function(){return new t},t.prototype.emit=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];for(var n=0,r=this.listeners;n<r.length;n++){r[n].apply(void 0,t)}},t.prototype.on=function(t){this.listeners.push(t)},t.prototype.off=function(t){var e=this.listeners.indexOf(t);return!(e<0)&&(this.listeners.splice(e,1),!0)},t.prototype.once=function(t){var e=this,n=function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];e.off(n),t.apply(void 0,r)};this.on(n)},t}(),A=id;r.Emitter=A;var kd=function(t){return function(e){var n,r=!1;return function(){for(var o=[],i=0;i<arguments.length;i++)o[i]=arguments[i];n=o,r||(r=!0,setTimeout(function(){r=!1,e.apply(void 0,n)},t))}}};r.debounce=kd;var ld=function(t){var e,n=!1;return function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];e=r,n||(n=!0,requestAnimationFrame(function(){n=!1,t.apply(void 0,e)}))}};r.nextFrame=ld;var N={};Object.defineProperty(N,"__esModule",{value:!0});var oa=function(r,e){return r===e||r!=r&&e!=e};N.strictEqual=oa;var w=function(r,e){if(oa(r,e))return!0;if(null==r||null==e)return!1;var t=Array.isArray(r);if(t!==Array.isArray(e))return!1;if(t){var n=r,a=e;if((x=n.length)!==a.length)return!1;for(var i=0;i<x;i++)if(!w(n[i],a[i]))return!1;return!0}var u=r instanceof Date;if(u!==e instanceof Date)return!1;if(u)return+r==+e;var f=r instanceof Set;if(f!==e instanceof Set)return!1;if(f){var o=r,s=e;if(o.size!==s.size)return!1;for(var $=o.keys();;){if((v=$.next()).done)break;if(!s.has(v.value))return!1}return!0}var p=r instanceof Map;if(p!==e instanceof Map)return!1;if(p){var l=r,d=e;if(l.size!==d.size)return!1;for(var E=l.keys();;){var v;if((v=E.next()).done)break;if(!w(l.get(v.value),d.get(v.value)))return!1}return!0}var c="object"==typeof r;if(c!==("object"==typeof e))return!1;if(c){var x,y=r,G=e,L=Object.keys(y),q=Object.keys(G);if((x=L.length)!==q.length)return!1;for(i=0;i<x;i++){var b=L[i];if(!G.hasOwnProperty(b))return!1;if(!w(y[b],G[b]))return!1}return!0}return!1};N.deepEqual=w;var qa={};Object.defineProperty(qa,"__esModule",{value:!0});var qd=function(){function e(e,t){void 0===t&&(t=w),this.value=e,this.equal=t,this.observable=this.emitter=A.ofOne()}return e.prototype.set=function(e){return!this.equal(this.value,e)&&(this.value=e,this.emit(this.value),!0)},e.prototype.get=function(){return this.value},e.prototype.emit=function(e){this.emitter.emit(e)},e}(),ra=qd;qa.Property=ra;var sa={};Object.defineProperty(sa,"__esModule",{value:!0});var td=function(){function r(r,e){this.property=r,this.reducer=e,this.observable=this.emitter=A.ofThree()}return r.ofState=function(e){return new r(new ra(e.state,e.equal),e.reducer)},r.prototype.process=function(r){var e=this.reducer(this.property.get(),r),t=this.property.set(e);return this.emitter.emit(e,r,t),t},r}(),ta=td;sa.Store=ta;var C={};Object.defineProperty(C,"__esModule",{value:!0});var wd={count:0},xd=function(){return{kind:"decrement"}},yd=function(){return{kind:"increment"}},zd=function(e,t){switch(t.kind){case"increment":return{count:e.count+1};case"decrement":return{count:e.count-1};default:throw"this should never happen";}},xa=ta.ofState({state:wd,reducer:zd}),Fa=p({attrs:{className:"app"}},ja({map:function(e){return e.count}},p({attrs:{className:"count count-small"}},"count"),p({attrs:{className:"count"}},String),p({attrs:{className:"buttons"}},t({events:{click:xd},attrs:{disabled:function(e){return e<=0}}},"-"),t({events:{click:yd}},"+"))));M.render({store:xa,template:Fa});if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=C}else if(typeof define==="function"&&define.amd){define(function(){return C})}})();