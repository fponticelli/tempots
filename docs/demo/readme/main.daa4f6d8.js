(function () {var xa={};Object.defineProperty(xa,"__esModule",{value:!0});var g=function(r,e){for(var t=r.length,$=new Array(t),a=0;a<t;a++)$[a]=e(r[a]);return $};xa.mapArray=g;var f={};Object.defineProperty(f,"__esModule",{value:!0});function ad(t,e,$){var r=t.style;r[e]=null==$?null:$}var N=ad;function h(t,e,$){null==$?t.removeAttribute(e):t.setAttribute(e,$)}f.setOneStyle=N;var sa=h;function rb(t,e,$){var r=t;r[e]=null==$?null:$}f.setAttribute=sa;var qa=rb;function zd(t,e,$){if(null==$)t.removeAttribute(e);else if("string"==typeof $)h(t,e,$);else{var r=g(Object.keys($),function(t){return t+": "+$[t]+";"}).join(" ");h(t,e,r.length&&r||null)}}f.setProperty=qa;var pa=zd;function Ja(t,e,$){var r=t;if(null==$)r[e]=null;else{var E=!0===$||"true"===$;r[e]=E}}f.setStyleAttribute=pa;var o=Ja;function _c(t,e,$){h(t,e,!0===$||"true"===$?"true":!1===$?"false":null)}f.setBoolProperty=o;var M=_c;function ld(t,e,$){h(t,e,!0===$||"true"===$?"":null)}f.setEnumBoolAttribute=M;var c=ld;function Cd(t,e,$){Array.isArray($)?h(t,e,$.join(", ")||null):h(t,e,$&&String($)||null)}f.setBoolAttribute=c;var t=Cd;function Ia(t,e,$){Array.isArray($)?h(t,e,$.join(" ")||null):h(t,e,$&&String($)||null)}f.setCommaSeparated=t;var l=Ia;f.setSpaceSeparated=l;var z={};Object.defineProperty(z,"__esModule",{value:!0});var oa={acceptcharset:"accept-charset",asattr:"as",classname:"class",httpequiv:"http-equiv",htmlfor:"for"};z.attributeNameMap=oa;var na={"accept-charset":l,class:l,acceptcharset:l,async:c,autofocus:c,autoplay:c,checked:o,contenteditable:M,controls:c,default:c,defer:c,disabled:c,draggable:M,formnovalidate:c,headers:l,hidden:c,ismap:c,itemscope:c,loop:c,multiple:o,muted:o,nomodule:c,novalidate:c,open:c,ping:l,playsinline:c,readonly:c,rel:l,required:c,reversed:c,selected:o,sizes:t,srcset:t,style:pa,typemustmatch:c,value:qa};z.htmlAttributeMap=na;var n={},ia=n&&n.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function o(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o)}}();Object.defineProperty(n,"__esModule",{value:!0});var F=function(){function e(e,t,r,o){this.node=e,this.children=t,this.request=r,this.beforeDestroy=o}return e.prototype.destroy=function(){this.beforeDestroy&&this.beforeDestroy(),P(this.node);for(var e=0,t=this.children;e<t.length;e++){t[e].destroy()}},e}(),za=F;n.DOMBaseNodeView=za;var Da=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.kind="static",t}return ia(t,e),t}(F),H=Da;n.DOMStaticNodeView=H;var Ga=function(e){function t(t,r,o,w,$){var i=e.call(this,t,r,w,$)||this;return i.node=t,i.children=r,i.change=o,i.request=w,i.beforeDestroy=$,i.kind="dynamic",i}return ia(t,e),t}(F),I=Ga;n.DOMDynamicNodeView=I;var J={};Object.defineProperty(J,"__esModule",{value:!0});var Na=function(e,t){var n=e.doc.createTextNode(t||""),r=new H(n,[],function(){});return e.append(n),r},cb=function(e,t,n){var r=e.doc.createTextNode(n(t)||""),$="",o=new I(r,[],function(e){var t=n(e)||"";t!==$&&(r.nodeValue=t,t.length<5e3&&($=t))},function(){});return e.append(r),o},ha=function(){function e(e){this.content=e}return e.prototype.render=function(e,t){return"function"==typeof this.content?cb(e,t,this.content):Na(e,this.content)},e}(),sb=ha;J.DOMTextTemplate=sb;var ga=function(e){return new ha(e)};J.text=ga;var j={};Object.defineProperty(j,"__esModule",{value:!0});function hd(e){var t=e;t&&t.onblur&&(t.onblur=null),e&&void 0!==e.ownerDocument&&e.parentElement&&e.parentElement.removeChild(e)}var P=hd;function rd(e){return function(t){null!=e.parentElement&&e.parentElement.insertBefore(t,e)}}j.removeNode=P;var vd=rd;function wd(e){return e.filter(function(e){return"dynamic"===e.kind})}j.insertBefore=vd;var q=wd;function Ad(e){return"string"==typeof e||"function"==typeof e||void 0===e?ga(e):e}j.filterDynamics=q;var d=Ad;function ya(e,t,r,$){var n=na[t]||sa;if("function"==typeof r){if("INPUT"===e.nodeName||"TEXTAREA"===e.nodeName){var o=function($){var o=r($);n(e,t,o)};$.push(o)}else{var a=void 0;o=function($){var o=r($);o!==a&&(n(e,t,o),String(o).length<5e4&&(a=o))};$.push(o)}}else n(e,t,r);return $}j.domChildToTemplate=d;var ea=ya;function Ba(e,t,r,$,n){var o;e[t]=function(t){var n=r(o,t,e);void 0!==n&&$(n)};return n.push(function(e){o=e}),n}j.processAttribute=ea;var da=Ba;function Ea(e,t,r,$){if("function"==typeof r){var n;$.push(function($){var o=r($);o!==n&&(N(e,t,o),n=o)})}else N(e,t,r);return $}j.processEvent=da;var aa=Ea;j.processStyle=aa;var i={},$=i&&i.__extends||function(){var t=function(e,a){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var a in e)e.hasOwnProperty(a)&&(t[a]=e[a])})(e,a)};return function(e,a){function r(){this.constructor=e}t(e,a),e.prototype=null===a?Object.create(a):(r.prototype=a.prototype,new r)}}();Object.defineProperty(i,"__esModule",{value:!0});var G=function(){function t(t){this.views=t}return t.prototype.destroy=function(){for(var t=0,e=this.views;t<e.length;t++){e[t].destroy()}},t.prototype.request=function(t){for(var e=0,a=this.views;e<a.length;e++){a[e].request(t)}},t}(),Ka=G;i.DOMBaseFragmentView=Ka;var Z=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.kind="static",e}return $(e,t),e}(G),Y=Z;i.DOMStaticFragmentView=Y;var X=function(t){function e(e,a){var r=t.call(this,e)||this;return r.change=a,r.kind="dynamic",r}return $(e,t),e}(G),K=X;i.DOMDynamicFragmentView=K;var L=function(t){var e=q(t);return e.length>0?new X(t,function(t){for(var a=0,r=e;a<r.length;a++){r[a].change(t)}}):new Z(t)};i.fragmentView=L;var V=function(){function t(t){this.children=t}return t.prototype.render=function(t,e){var a=g(this.children,function(a){return a.render(t,e)});return L(a)},t}(),cd=V;i.DOMFragmentTemplate=cd;var ed=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return new V(g(t,d))};i.fragment=ed;var m={},jd=m&&m.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function o(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o)}}();Object.defineProperty(m,"__esModule",{value:!0});var T=function(e){function t(t,r,o,n,$){var p=e.call(this,o,function(e){t.property.set(e);for(var r=0,o=n;r<o.length;r++){o[r].change(e)}})||this;return p.store=t,p.dispatch=r,p._destroy=$,p}return jd(t,e),t.prototype.request=function(e){throw"TODO"},t.prototype.destroy=function(){this._destroy(),e.prototype.destroy.call(this)},t}(K),pd=T;m.DOMComponentView=pd;var Q=function(){function e(e,t,r){this.store=e,this.children=t,this.delayed=r}return e.prototype.render=function(e,t){var r;if(this.delayed){var o=!0;r=function(e){o&&(o=!1,setTimeout(function(){c.change(e),o=!0}))}}else r=function(e){c.change(e)};var n=this.store,$=n.property;$.observable.on(r);var p=function(e){n.process(e)},a=e.withDispatch(p),i=g(this.children,function(e){return e.render(a,$.get())}),y=q(i),c=new T(n,p,i,y,function(){$.observable.off(r)});return $.set(t),c},e}(),ud=Q;m.DOMComponentTemplate=ud;var fa=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];return new Q(e.store,g(t,d),e.delayed||!1)};m.component=fa;var R={};Object.defineProperty(R,"__esModule",{value:!0});var xd=function(){function t(t,n,e,r){this.doc=t,this.append=n,this.parent=e,this.dispatch=r}return t.fromElement=function(n,e){return new t(n.ownerDocument||window&&window.document,function(t){return n.appendChild(t)},n,e)},t.prototype.mapAction=function(n){var e=this;return new t(this.doc,this.append,this.parent,function(t){return e.dispatch(n(t))})},t.prototype.conditionalMapAction=function(n){var e=this;return new t(this.doc,this.append,this.parent,function(t){var r=n(t);void 0!==r&&e.dispatch(r)})},t.prototype.withAppend=function(n){return new t(this.doc,n,this.parent,this.dispatch)},t.prototype.withParent=function(n){return new t(this.doc,this.append,n,this.dispatch)},t.prototype.withDispatch=function(n){return new t(this.doc,this.append,this.parent,n)},t}(),S=xd;R.DOMContext=S;var O,U={};Object.defineProperty(U,"__esModule",{value:!0});var Jd;!function(e){e.renderComponent=function(e){var o=e.el,r=e.component,t=r.store,n=e.document||document,$=o||n.body,p=r.render(new S(n,function(e){return $.appendChild(e)},$,function(){}),t.property.get());return{destroy:function(){return p.destroy()},request:function(e){return p.request(e)},store:t}},e.render=function(o){var r=o.el,t=o.store,n=o.document,$=o.template,p=o.delayed,c=fa({store:t,delayed:p},$);return e.renderComponent({el:r,component:c,document:n})}}(Jd=O||(O={},U.Tempo=O));var k={};Object.defineProperty(k,"__esModule",{value:!0});var W=function(e,r,t){return function(a,$){return e(a,r,t,$)}},Aa=function(e,r,t,a){return void 0!==typeof e?e(a,r,t):void 0},p=function(){function e(e,r,t,a,$,n,b,o,s,v){this.createElement=e,this.attrs=r,this.events=t,this.styles=a,this.afterrender=$,this.beforechange=n,this.afterchange=b,this.beforedestroy=o,this.respond=s,this.children=v}return e.prototype.render=function(e,r){for(var t=this,a=this.createElement(e.doc),$=void 0,n=[],b=0,o=this.attrs;b<o.length;b++){var s=o[b];ea(a,s.name,s.value,n)}for(var v=0,p=this.events;v<p.length;v++){s=p[v];da(a,s.name,s.value,e.dispatch,n)}for(var i=0,c=this.styles;i<c.length;i++){s=c[i];aa(a,s.name,s.value,n)}for(var l=0,u=n;l<u.length;l++){(0,u[l])(r)}var f=e.withAppend(function(e){return a.appendChild(e)}).withParent(a),m=g(this.children,function(e){return e.render(f,r)});e.append(a),this.afterrender&&($=Aa(this.afterrender,a,e,r));var L=g(q(m),function(e){return function(r){return e.change(r)}});if(n.push.apply(n,L),this.beforechange){var X=W(this.beforechange,a,e),d=function(e){$=X(e,$)};n.unshift(d)}if(this.afterchange){var h=W(this.afterchange,a,e);d=function(e){$=h(e,$)};n.push(d)}var y=this.beforedestroy&&function(){return t.beforedestroy(a,e,$)},x=this.respond?function(r){m.forEach(function(e){return e.request(r)}),t.respond(r,a,e)}:function(){};return n.length>0?new I(a,m,function(e){for(var r=0,t=n;r<t.length;r++){(0,t[r])(e)}},x,y):new H(a,m,x,y)},e}(),Ca=p;function x(e){return g(Object.keys(e||{}),function(r){var t=r.toLowerCase();return{name:t=oa[t]||t,value:e[r]}})}function v(e){return g(Object.keys(e||{}),function(r){return{name:"on"+r.toLowerCase(),value:e[r]}})}function u(e){return g(Object.keys(e||{}),function(r){return{name:r,value:e[r]}})}k.DOMElement=Ca;var _=function(e){return function(r){return r.createElement(e)}},Ha=function(e,r){for(var t=[],a=2;a<arguments.length;a++)t[a-2]=arguments[a];return new p(_(e),x(r.attrs),v(r.events),u(r.styles),r.afterrender,r.beforechange,r.afterchange,r.beforedestroy,r.respond,g(t,d))};k.el=Ha;var b=function(e){return function(r){for(var t=[],a=1;a<arguments.length;a++)t[a-1]=arguments[a];return new p(_(e),x(r.attrs),v(r.events),u(r.styles),r.afterrender,r.beforechange,r.afterchange,r.beforedestroy,r.respond,g(t,d))}};k.el2=b;var ba={svg:"http://www.w3.org/2000/svg"};k.defaultNamespaces=ba;var ca=function(e,r){return function(t){return t.createElementNS(e,r)}},La=function(e,r,t){for(var a=[],$=3;$<arguments.length;$++)a[$-3]=arguments[$];var n=ba[e]||e;return new p(ca(n,r),x(t.attrs),v(t.events),u(t.styles),t.afterrender,t.beforechange,t.afterchange,t.beforedestroy,t.respond,g(a,d))};k.elNS=La;var Ma=function(e,r){return function(t){for(var a=[],$=1;$<arguments.length;$++)a[$-1]=arguments[$];return new p(ca(e,r),x(t.attrs),v(t.events),u(t.styles),t.afterrender,t.beforechange,t.afterchange,t.beforedestroy,t.respond,g(a,d))}};k.elNS2=Ma;var a={};Object.defineProperty(a,"__esModule",{value:!0});var Oa=b("a");a.a=Oa;var Pa=b("abbr");a.abbr=Pa;var Qa=b("address");a.address=Qa;var Ra=b("applet");a.applet=Ra;var Sa=b("area");a.area=Sa;var Ta=b("article");a.article=Ta;var Ua=b("aside");a.aside=Ua;var Va=b("audio");a.audio=Va;var Wa=b("b");a.b=Wa;var Xa=b("base");a.base=Xa;var Ya=b("basefont");a.basefont=Ya;var Za=b("bdi");a.bdi=Za;var $a=b("bdo");a.bdo=$a;var _a=b("blockquote");a.blockquote=_a;var ab=b("body");a.body=ab;var bb=b("br");a.br=bb;var B=b("button");a.button=B;var db=b("canvas");a.canvas=db;var eb=b("caption");a.caption=eb;var fb=b("cite");a.cite=fb;var gb=b("code");a.code=gb;var hb=b("col");a.col=hb;var ib=b("colgroup");a.colgroup=ib;var jb=b("data");a.data=jb;var kb=b("datalist");a.datalist=kb;var lb=b("dd");a.dd=lb;var mb=b("del");a.del=mb;var nb=b("details");a.details=nb;var ob=b("dfn");a.dfn=ob;var pb=b("dialog");a.dialog=pb;var qb=b("dir");a.dir=qb;var r=b("div");a.div=r;var Id=b("dl");a.dl=Id;var tb=b("dt");a.dt=tb;var ub=b("em");a.em=ub;var vb=b("embed");a.embed=vb;var wb=b("fieldset");a.fieldset=wb;var xb=b("figcaption");a.figcaption=xb;var yb=b("figure");a.figure=yb;var zb=b("font");a.font=zb;var Ab=b("footer");a.footer=Ab;var Bb=b("form");a.form=Bb;var Cb=b("frame");a.frame=Cb;var Db=b("frameset");a.frameset=Db;var Eb=b("h1");a.h1=Eb;var Fb=b("h2");a.h2=Fb;var Gb=b("h3");a.h3=Gb;var Hb=b("h4");a.h4=Hb;var Ib=b("h5");a.h5=Ib;var Jb=b("h6");a.h6=Jb;var Kb=b("head");a.head=Kb;var Lb=b("header");a.header=Lb;var Mb=b("hgroup");a.hgroup=Mb;var Nb=b("hr");a.hr=Nb;var Ob=b("html");a.html=Ob;var Pb=b("i");a.i=Pb;var Qb=b("iframe");a.iframe=Qb;var Rb=b("img");a.img=Rb;var Sb=b("input");a.input=Sb;var Tb=b("ins");a.ins=Tb;var Ub=b("kbd");a.kbd=Ub;var Vb=b("label");a.label=Vb;var Wb=b("legend");a.legend=Wb;var Xb=b("li");a.li=Xb;var Yb=b("link");a.link=Yb;var Zb=b("listing");a.listing=Zb;var $b=b("main");a.main=$b;var _b=b("map");a.map=_b;var ac=b("mark");a.mark=ac;var bc=b("marquee");a.marquee=bc;var cc=b("menu");a.menu=cc;var dc=b("meta");a.meta=dc;var ec=b("meter");a.meter=ec;var fc=b("nav");a.nav=fc;var gc=b("noscript");a.noscript=gc;var hc=b("object");a.object=hc;var ic=b("ol");a.ol=ic;var jc=b("optgroup");a.optgroup=jc;var kc=b("option");a.option=kc;var lc=b("output");a.output=lc;var mc=b("p");a.p=mc;var nc=b("param");a.param=nc;var oc=b("picture");a.picture=oc;var pc=b("pre");a.pre=pc;var qc=b("progress");a.progress=qc;var rc=b("q");a.q=rc;var sc=b("rp");a.rp=sc;var tc=b("rt");a.rt=tc;var uc=b("ruby");a.ruby=uc;var vc=b("s");a.s=vc;var wc=b("samp");a.samp=wc;var xc=b("script");a.script=xc;var yc=b("section");a.section=yc;var zc=b("select");a.select=zc;var Ac=b("slot");a.slot=Ac;var Bc=b("small");a.small=Bc;var Cc=b("source");a.source=Cc;var Dc=b("span");a.span=Dc;var Ec=b("strong");a.strong=Ec;var Fc=b("style");a.style=Fc;var Gc=b("sub");a.sub=Gc;var Hc=b("summary");a.summary=Hc;var Ic=b("sup");a.sup=Ic;var Jc=b("table");a.table=Jc;var Kc=b("tbody");a.tbody=Kc;var Lc=b("td");a.td=Lc;var Mc=b("template");a.template=Mc;var Nc=b("textarea");a.textarea=Nc;var Oc=b("tfoot");a.tfoot=Oc;var Pc=b("th");a.th=Pc;var Qc=b("thead");a.thead=Qc;var Rc=b("time");a.time=Rc;var Sc=b("title");a.title=Sc;var Tc=b("tr");a.tr=Tc;var Uc=b("track");a.track=Uc;var Vc=b("u");a.u=Vc;var Wc=b("ul");a.ul=Wc;var Xc=b("var");a.varEl=Xc;var Yc=b("video");a.video=Yc;var Zc=b("wbr");a.wbr=Zc;var $c=b("xmp");a.xmp=$c;var e={};Object.defineProperty(e,"__esModule",{value:!0});var E=function(){function e(e,r){this.map=e,this.children=r}return e.prototype.render=function(e,r){var t=this.children,p=this.map,a=p(r),$=g(t,function(r){return r.render(e,a)}),n=q($);return 0===n.length?new Y($):new K($,function(e){for(var r=p(e),t=0,a=n;t<a.length;t++){a[t].change(r)}})},e}(),bd=E;e.MapStateTemplate=bd;var ja=function(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];return new E(e.map,g(r,d))};e.mapState=ja;var dd=function(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];return new E(function(r){return[e.map(r),r]},g(r,d))};e.mapStateAndKeep=dd;var ka=function(){function e(e,r){this.map=e,this.children=r}return e.prototype.render=function(e,r){var t=this.children,p=this.map,a=g(t,function(t){return t.render(e.conditionalMapAction(p),r)});return L(a)},e}(),fd=ka;e.MapActionTemplate=fd;var gd=function(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];return new ka(e.map,g(r,d))};e.mapAction=gd;var la=function(){function e(e,r,t){this.map=e,this.views=r,this.dynamicViews=t,this.kind="dynamic"}return e.prototype.request=function(e){var r=this.map(e);void 0!==r&&this.views.forEach(function(e){return e.request(r)})},e.prototype.change=function(e){this.dynamicViews.forEach(function(r){return r.change(e)})},e.prototype.destroy=function(){this.views.forEach(function(e){return e.destroy()})},e}(),id=la;e.MapQueryDynamicView=id;var ma=function(){function e(e,r){this.map=e,this.views=r,this.kind="static"}return e.prototype.request=function(e){var r=this.map(e);void 0!==r&&this.views.forEach(function(e){return e.request(r)})},e.prototype.destroy=function(){this.views.forEach(function(e){return e.destroy()})},e}(),kd=ma;e.MapQueryStaticView=kd;var C=function(){function e(e,r){this.map=e,this.children=r}return e.prototype.render=function(e,r){var t=this.children,p=this.map,a=g(t,function(t){return t.render(e,r)}),$=q(a);return $.length>0?new la(p,a,$):new ma(p,a)},e}(),md=C;e.MapQueryTemplate=md;var nd=function(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];return new C(e.map,g(r,d))};e.mapQuery=nd;var od=function(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];return new C(e.map,g(r,d))};e.mapQueryConditional=od;var s={};Object.defineProperty(s,"__esModule",{value:!0});var qd=function(){function t(){this.listeners=[]}return t.ofOne=function(){return new t},t.ofTwo=function(){return new t},t.ofThree=function(){return new t},t.prototype.emit=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];for(var n=0,r=this.listeners;n<r.length;n++){r[n].apply(void 0,t)}},t.prototype.on=function(t){this.listeners.push(t)},t.prototype.off=function(t){var e=this.listeners.indexOf(t);return!(e<0)&&(this.listeners.splice(e,1),!0)},t.prototype.once=function(t){var e=this,n=function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];e.off(n),t.apply(void 0,r)};this.on(n)},t}(),A=qd;s.Emitter=A;var sd=function(t){return function(e){var n,r=!1;return function(){for(var o=[],i=0;i<arguments.length;i++)o[i]=arguments[i];n=o,r||(r=!0,setTimeout(function(){r=!1,e.apply(void 0,n)},t))}}};s.debounce=sd;var td=function(t){var e,n=!1;return function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];e=r,n||(n=!0,requestAnimationFrame(function(){n=!1,t.apply(void 0,e)}))}};s.nextFrame=td;var y={};Object.defineProperty(y,"__esModule",{value:!0});var ra=function(r,e){return r===e||r!=r&&e!=e};y.strictEqual=ra;var w=function(r,e){if(ra(r,e))return!0;if(null==r||null==e)return!1;var t=Array.isArray(r);if(t!==Array.isArray(e))return!1;if(t){var n=r,a=e;if((x=n.length)!==a.length)return!1;for(var i=0;i<x;i++)if(!w(n[i],a[i]))return!1;return!0}var u=r instanceof Date;if(u!==e instanceof Date)return!1;if(u)return+r==+e;var f=r instanceof Set;if(f!==e instanceof Set)return!1;if(f){var o=r,s=e;if(o.size!==s.size)return!1;for(var $=o.keys();;){if((v=$.next()).done)break;if(!s.has(v.value))return!1}return!0}var p=r instanceof Map;if(p!==e instanceof Map)return!1;if(p){var l=r,d=e;if(l.size!==d.size)return!1;for(var E=l.keys();;){var v;if((v=E.next()).done)break;if(!w(l.get(v.value),d.get(v.value)))return!1}return!0}var c="object"==typeof r;if(c!==("object"==typeof e))return!1;if(c){var x,y=r,G=e,L=Object.keys(y),q=Object.keys(G);if((x=L.length)!==q.length)return!1;for(i=0;i<x;i++){var b=L[i];if(!G.hasOwnProperty(b))return!1;if(!w(y[b],G[b]))return!1}return!0}return!1};y.deepEqual=w;var ta={};Object.defineProperty(ta,"__esModule",{value:!0});var yd=function(){function e(e,t){void 0===t&&(t=w),this.value=e,this.equal=t,this.observable=this.emitter=A.ofOne()}return e.prototype.set=function(e){return!this.equal(this.value,e)&&(this.value=e,this.emit(this.value),!0)},e.prototype.get=function(){return this.value},e.prototype.emit=function(e){this.emitter.emit(e)},e}(),ua=yd;ta.Property=ua;var va={};Object.defineProperty(va,"__esModule",{value:!0});var Bd=function(){function r(r,e){this.property=r,this.reducer=e,this.observable=this.emitter=A.ofThree()}return r.ofState=function(e){return new r(new ua(e.state,e.equal),e.reducer)},r.prototype.process=function(r){var e=this.reducer(this.property.get(),r),t=this.property.set(e);return this.emitter.emit(e,r,t),t},r}(),wa=Bd;va.Store=wa;var D={};Object.defineProperty(D,"__esModule",{value:!0});var Ed={count:0},Fd=function(){return{kind:"decrement"}},Gd=function(){return{kind:"increment"}},Hd=function(e,t){switch(t.kind){case"increment":return{count:e.count+1};case"decrement":return{count:e.count-1};default:throw"this should never happen";}},Dd=wa.ofState({state:Ed,reducer:Hd}),Fa=r({attrs:{className:"app"}},ja({map:function(e){return e.count}},r({attrs:{className:"count count-small"}},"count"),r({attrs:{className:"count"}},String),r({attrs:{className:"buttons"}},B({events:{click:Fd},attrs:{disabled:function(e){return e<=0}}},"-"),B({events:{click:Gd}},"+"))));O.render({store:Dd,template:Fa});if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=D}else if(typeof define==="function"&&define.amd){define(function(){return D})}})();