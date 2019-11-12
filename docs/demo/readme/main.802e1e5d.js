(function () {var e={};Object.defineProperty(e,"__esModule",{value:!0});var la=function(t,e,r){var $=t.style;null==r?$[e]=null:String(r)!==$[e]&&($[e]=String(r))};e.setOneStyle=la;var ua=function(t){return function(e,r,$){var o=e;o[r]=null==$?null:function(e){var r=$(e);null!=r&&t(r)}}};e.setEvent=ua;var h=function(t,e,r){if(null==r)t.removeAttribute(e);else{var $=String(r);$!==t.getAttribute(e)&&t.setAttribute(e,$)}};e.setAttribute=h;var ma=function(t,e,r){var $=t;null==r&&null!=$[e]?$[e]=null:$[e]!==r&&($[e]=r)};e.setProperty=ma;var ja=function(t,e,r){if(null==r)t.removeAttribute(e);else{var $=Object.keys(r).map(function(t){return t+": "+r[t]+";"}).join(" ");h(t,e,$.length&&$||null)}};e.setStyleAttribute=ja;var q=function(t,e,r){var $=t;if(null==r)$[e]=null;else{var o=Boolean(r);$[e]!==o&&($[e]=o)}};e.setBoolProperty=q;var C=function(t,e,r){h(t,e,!0===r?"true":!1===r?"false":null)};e.setEnumBoolAttribute=C;var c=function(t,e,r){h(t,e,!0===r?"":null)};e.setBoolAttribute=c;var D=function(t,e,r){h(t,e,r&&r.length>0&&r.join(", ")||null)};e.setCommaSeparated=D;var j=function(t,e,r){h(t,e,r&&r.length>0&&r.join(" ")||null)};e.setSpaceSeparated=j;var G={};Object.defineProperty(G,"__esModule",{value:!0});var U={acceptcharset:"accept-charset",asattr:"as",classname:"class",httpequiv:"http-equiv",htmlfor:"for"};G.htmlAttributeNameMap=U;var N={"accept-charset":j,acceptcharset:j,async:c,autofocus:c,autoplay:c,checked:q,contenteditable:C,controls:c,default:c,defer:c,disabled:c,draggable:C,formnovalidate:c,headers:j,hidden:c,ismap:c,itemscope:c,loop:c,multiple:q,muted:q,nomodule:c,novalidate:c,open:c,ping:j,playsinline:c,readonly:c,rel:j,required:c,reversed:c,selected:q,sizes:D,srcset:D,style:ja,typemustmatch:c,value:ma};G.htmlAttributeMap=N;var l={},ga=l&&l.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function o(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o)}}();Object.defineProperty(l,"__esModule",{value:!0});var A=function(){function e(e,t,r){this.node=e,this.children=t,this.beforeDestroy=r}return e.prototype.destroy=function(){this.beforeDestroy&&this.beforeDestroy(),qa(this.node);for(var e=0,t=this.children;e<t.length;e++){t[e].destroy()}},e}(),ed=A;l.DOMBaseNodeView=ed;var Aa=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.kind="static",t}return ga(t,e),t}(A),z=Aa;l.DOMStaticNodeView=z;var ub=function(e){function t(t,r,o,$){var i=e.call(this,t,r,$)||this;return i.node=t,i.children=r,i.change=o,i.beforeDestroy=$,i.kind="dynamic",i}return ga(t,e),t}(A),J=ub;l.DOMDynamicNodeView=J;var F={};Object.defineProperty(F,"__esModule",{value:!0});var nd=function(e,t){var r=e.doc.createTextNode(t||""),n=new z(r,[]);return e.append(r),n},Xa=function(e,t,r){var n=e.doc.createTextNode(r(t)||""),$=new J(n,[],function(e){var t=r(e)||"";n.textContent!==t&&(n.textContent=t)});return e.append(n),$},sa=function(){function e(e){this.content=e}return e.prototype.render=function(e,t){return"function"==typeof this.content?Xa(e,t,this.content):nd(e,this.content)},e}(),jd=sa;F.DOMText=jd;var ra=function(e){return new sa(e)};F.text=ra;var n={};Object.defineProperty(n,"__esModule",{value:!0});var qa=function(t){var e=t;e&&e.onblur&&(e.onblur=null),t&&t.parentElement&&t.parentElement.removeChild(t)};n.removeNode=qa;var _c=function(t){return function(e){null!=t.parentElement&&t.parentElement.insertBefore(e,t)}};n.insertBefore=_c;var x=function(t){return t.filter(function(t){return"dynamic"===t.kind}).map(function(t){return t})};n.filterDynamics=x;var g=function(t){return"string"==typeof t||"function"==typeof t?ra(t):t};n.domChildToTemplate=g;var ka=function(t,e,a,r,$){var n,c=(e=U[e]||e).startsWith("on");c?(e=e.toLowerCase(),n=ua(r)):e.startsWith("$")?(e=e.substring(1),n=la):n=N[e]||h;var i=a;if(i&&i.kind&&"derived"===i.kind){var o=i,m=function(a){return n(t,e,o.resolve(a))};return{dynamics:$.dynamics.concat([m]),statics:$.statics}}if(c||"function"!=typeof a){m=function(){return n(t,e,a)};return{dynamics:$.dynamics,statics:$.statics.concat([m])}}var m=function(r){return n(t,e,a(r))};return{dynamics:$.dynamics.concat([m]),statics:$.statics}};n.processAttribute=ka;var i={},da=i&&i.__extends||function(){var t=function(e,r){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(e,r)};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(i,"__esModule",{value:!0});var E=function(){function t(t){this.views=t}return t.prototype.destroy=function(){for(var t=0,e=this.views;t<e.length;t++){e[t].destroy()}},t}(),kb=E;i.DOMBaseFragmentView=kb;var aa=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.kind="static",e}return da(e,t),e}(E),_=aa;i.DOMStaticFragmentView=_;var $=function(t){function e(e,r){var n=t.call(this,e)||this;return n.change=r,n.kind="dynamic",n}return da(e,t),e}(E),I=$;i.DOMDynamicFragmentView=I;var Y=function(t){var e=x(t);return e.length>0?new $(t,function(t){for(var r=0,n=e;r<n.length;r++){n[r].change(t)}}):new aa(t)};i.fragmentView=Y;var t={};Object.defineProperty(t,"__esModule",{value:!0});var Ba=function(){function t(){this.listeners=[]}return t.ofOne=function(){return new t},t.ofTwo=function(){return new t},t.ofThree=function(){return new t},t.prototype.emit=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];for(var n=0,r=this.listeners;n<r.length;n++){r[n].apply(void 0,t)}},t.prototype.on=function(t){this.listeners.push(t)},t.prototype.off=function(t){var e=this.listeners.indexOf(t);return!(e<0)&&(this.listeners.splice(e,1),!0)},t.prototype.once=function(t){var e=this,n=function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];e.off(n),t.apply(void 0,r)};this.on(n)},t}(),Da=Ba;t.Emitter=Da;var Ga=function(t){return function(e){var n,r=!1;return function(){for(var o=[],i=0;i<arguments.length;i++)o[i]=arguments[i];n=o,r||(r=!0,setTimeout(function(){r=!1,e.apply(void 0,n)},t))}}};t.debounce=Ga;var S=function(t){var e,n=!1;return function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];e=r,n||(n=!0,requestAnimationFrame(function(){n=!1,t.apply(void 0,e)}))}};t.nextFrame=S;var k={},Vc=k&&k.__extends||function(){var e=function(n,t){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])})(n,t)};return function(n,t){function r(){this.constructor=n}e(n,t),n.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}}();Object.defineProperty(k,"__esModule",{value:!0});var fa=function(e){function n(n,t,r,o,$){var p=e.call(this,r,function(e){n.property.set(e);for(var t=0,r=o;t<r.length;t++){r[t].change(e)}})||this;return p.store=n,p.dispatch=t,p._destroy=$,p}return Vc(n,e),n.prototype.destroy=function(){this._destroy(),e.prototype.destroy.call(this)},n}(I),bd=fa;k.DOMComponentView=bd;var O=function(){function e(e,n,t){this.store=e,this.children=n,this.delayed=t}return e.prototype.render=function(e,n){var t=function(e){return i.change(e)};this.delayed&&(t=S(t));var r=this.store;r.property.observable.on(t);var o=function(e){r.process(e)},$=e.withDispatch(o),p=this.children.map(function(e){return e.render($,r.property.get())}),a=x(p),i=new fa(r,o,p,a,function(){r.property.observable.off(t)});return r.property.set(n),i},e}(),gd=O;k.DOMComponent=gd;var P=function(e){for(var n=[],t=1;t<arguments.length;t++)n[t-1]=arguments[t];return new O(e.store,n.map(g),e.delayed||!1)};k.component=P;var Q={};Object.defineProperty(Q,"__esModule",{value:!0});var kd=function(){function t(t,n,i,e){this.doc=t,this.append=n,this.parent=i,this.dispatch=e}return t.fromElement=function(n,i){return new t(n.ownerDocument||window&&window.document,function(t){return n.appendChild(t)},n,i)},t.prototype.mapAction=function(n){var i=this;return new t(this.doc,this.append,this.parent,function(t){return i.dispatch(n(t))})},t.prototype.conditionalMapAction=function(n){var i=this;return new t(this.doc,this.append,this.parent,function(t){var e=n(t);void 0!==e&&i.dispatch(e)})},t.prototype.withAppend=function(n){return new t(this.doc,n,this.parent,this.dispatch)},t.prototype.withParent=function(n){return new t(this.doc,this.append,n,this.dispatch)},t.prototype.withDispatch=function(n){return new t(this.doc,this.append,this.parent,n)},t}(),R=kd;Q.DOMContext=R;var L,T={};Object.defineProperty(T,"__esModule",{value:!0});var m;!function(e){e.renderComponent=function(e){var o=e.el,r=e.component,t=r.store,n=e.document||document,$=o||n.body,c=r.render(new R(n,function(e){return $.appendChild(e)},$,function(){}),t.property.get());return{destroy:function(){return c.destroy()},store:t}},e.render=function(o){var r=o.el,t=o.store,n=o.document,$=o.template,c=P({store:t},$);return e.renderComponent({el:r,component:c,document:n})}}(m=L||(L={},T.Mood=L));var f={},V=f&&f.__extends||function(){var e=function(r,t){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,r){e.__proto__=r}||function(e,r){for(var t in r)r.hasOwnProperty(t)&&(e[t]=r[t])})(r,t)};return function(r,t){function $(){this.constructor=r}e(r,t),r.prototype=null===t?Object.create(t):($.prototype=t.prototype,new $)}}();Object.defineProperty(f,"__esModule",{value:!0});var W=function(){return function(){}}(),X=function(e){function r(r){var t=e.call(this)||this;return t.value=r,t.kind="literal",t}return V(r,e),r.prototype.resolve=function(e){return this.value},r}(W),Uc=X;f.WrappedLiteralValue=Uc;var za=function(e){function r(r){var t=e.call(this)||this;return t.map=r,t.kind="derived",t}return V(r,e),r.prototype.resolve=function(e){return this.map(e)},r}(W),Xc=za;f.WrappedDerivedValue=Xc;var Yc=function(e){return new za(e)};f.derived=Yc;var Z=function(e){return new X(e)};f.literal=Z;var u=function(e){return e&&"derived"===e.kind?e:Z(e)};f.wrapLiteral=u;var d={},fd=d&&d.__assign||function(){return(fd=Object.assign||function(e){for(var r,t=1,$=arguments.length;t<$;t++)for(var o in r=arguments[t])Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o]);return e}).apply(this,arguments)};Object.defineProperty(d,"__esModule",{value:!0});var y=function(e,r){return function(t){var $=r.resolve(t);null!=$&&$(e)}};d.applyMood=y;var ba=function(e,r){return function(t){null!=r&&y(e,r)(t)}};d.maybeApplyMood=ba;var ca=function(e){var r=fd({},e),t=r.moodAfterRender&&u(r.moodAfterRender),$=r.moodBeforeChange&&u(r.moodBeforeChange),o=r.moodAfterChange&&u(r.moodAfterChange),a=r.moodBeforeDestroy,n=a&&function(){return a(M)};return delete r.moodAfterRender,delete r.moodBeforeChange,delete r.moodAfterChange,delete r.moodBeforeDestroy,{attributes:r,afterRender:t,beforeChange:$,afterChange:o,beforeDestroy:n}};d.prepareAttributes=ca;var p=function(){function e(e,r,t){this.createElement=e,this.attributes=r,this.children=t}return e.prototype.render=function(e,r){var t=this.createElement(e.doc),$=ca(this.attributes),o=$.attributes,a=$.afterRender,n=$.beforeChange,p=$.afterChange,l=$.beforeDestroy,O=Object.keys(o).reduce(function(r,$){return ka(t,$,o[$],e.dispatch,r)},{statics:[],dynamics:[]}),i=O.statics,u=O.dynamics;e.append(t);for(var s=0,j=i;s<j.length;s++){(0,j[s])()}for(var d=0,V=u;d<V.length;d++){(0,V[d])(r)}var m=function(e){return t.appendChild(e)},Y=this.children.map(function($){return $.render(e.withAppend(m).withParent(t),r)});ba(t,a)(r);var v=x(Y).map(function(e){return function(r){return e.change(r)}}),f=u.concat(v);return n&&f.unshift(y(t,n)),p&&f.push(y(t,p)),f.length>0?new J(t,Y,function(e){for(var r=0,t=f;r<t.length;r++){(0,t[r])(e)}},l):new z(t,Y,l)},e}(),md=p;d.DOMElement=md;var ea=function(e){return function(r){return r.createElement(e)}},M=function(e,r){for(var t=[],$=2;$<arguments.length;$++)t[$-2]=arguments[$];return new p(ea(e),r,t.map(g))};d.el=M;var b=function(e){return function(r){for(var t=[],$=1;$<arguments.length;$++)t[$-1]=arguments[$];return new p(ea(e),r,t.map(g))}};d.el2=b;var ha={svg:"http://www.w3.org/2000/svg"};d.defaultNamespaces=ha;var ia=function(e,r){return function(t){return t.createElementNS(e,r)}},Ea=function(e,r,t){for(var $=[],o=3;o<arguments.length;o++)$[o-3]=arguments[o];var a=ha[e]||e;return new p(ia(a,r),t,$.map(g))};d.elNS=Ea;var Fa=function(e,r){return function(t){for(var $=[],o=1;o<arguments.length;o++)$[o-1]=arguments[o];return new p(ia(e,r),t,$.map(g))}};d.elNS2=Fa;var a={};Object.defineProperty(a,"__esModule",{value:!0});var Ha=b("a");a.a=Ha;var Ia=b("abbr");a.abbr=Ia;var Ja=b("address");a.address=Ja;var Ka=b("applet");a.applet=Ka;var La=b("area");a.area=La;var Ma=b("article");a.article=Ma;var Na=b("aside");a.aside=Na;var Oa=b("audio");a.audio=Oa;var Pa=b("b");a.b=Pa;var Qa=b("base");a.base=Qa;var Ra=b("basefont");a.basefont=Ra;var Sa=b("bdi");a.bdi=Sa;var Ta=b("bdo");a.bdo=Ta;var Ua=b("blockquote");a.blockquote=Ua;var Va=b("body");a.body=Va;var Wa=b("br");a.br=Wa;var B=b("button");a.button=B;var Ya=b("canvas");a.canvas=Ya;var Za=b("caption");a.caption=Za;var $a=b("cite");a.cite=$a;var _a=b("code");a.code=_a;var ab=b("col");a.col=ab;var bb=b("colgroup");a.colgroup=bb;var cb=b("data");a.data=cb;var db=b("datalist");a.datalist=db;var eb=b("dd");a.dd=eb;var fb=b("del");a.del=fb;var gb=b("details");a.details=gb;var hb=b("dfn");a.dfn=hb;var ib=b("dialog");a.dialog=ib;var jb=b("dir");a.dir=jb;var r=b("div");a.div=r;var lb=b("dl");a.dl=lb;var mb=b("dt");a.dt=mb;var nb=b("em");a.em=nb;var ob=b("embed");a.embed=ob;var pb=b("fieldset");a.fieldset=pb;var qb=b("figcaption");a.figcaption=qb;var rb=b("figure");a.figure=rb;var sb=b("font");a.font=sb;var tb=b("footer");a.footer=tb;var sd=b("form");a.form=sd;var vb=b("frame");a.frame=vb;var wb=b("frameset");a.frameset=wb;var xb=b("h1");a.h1=xb;var yb=b("h2");a.h2=yb;var zb=b("h3");a.h3=zb;var Ab=b("h4");a.h4=Ab;var Bb=b("h5");a.h5=Bb;var Cb=b("h6");a.h6=Cb;var Db=b("head");a.head=Db;var Eb=b("header");a.header=Eb;var Fb=b("hgroup");a.hgroup=Fb;var Gb=b("hr");a.hr=Gb;var Hb=b("html");a.html=Hb;var Ib=b("i");a.i=Ib;var Jb=b("iframe");a.iframe=Jb;var Kb=b("img");a.img=Kb;var Lb=b("input");a.input=Lb;var Mb=b("ins");a.ins=Mb;var Nb=b("kbd");a.kbd=Nb;var Ob=b("label");a.label=Ob;var Pb=b("legend");a.legend=Pb;var Qb=b("li");a.li=Qb;var Rb=b("link");a.link=Rb;var Sb=b("listing");a.listing=Sb;var Tb=b("main");a.main=Tb;var Ub=b("map");a.map=Ub;var Vb=b("mark");a.mark=Vb;var Wb=b("marquee");a.marquee=Wb;var Xb=b("menu");a.menu=Xb;var Yb=b("meta");a.meta=Yb;var Zb=b("meter");a.meter=Zb;var $b=b("nav");a.nav=$b;var _b=b("noscript");a.noscript=_b;var ac=b("object");a.object=ac;var bc=b("ol");a.ol=bc;var cc=b("optgroup");a.optgroup=cc;var dc=b("option");a.option=dc;var ec=b("output");a.output=ec;var fc=b("p");a.p=fc;var gc=b("param");a.param=gc;var hc=b("picture");a.picture=hc;var ic=b("pre");a.pre=ic;var jc=b("progress");a.progress=jc;var kc=b("q");a.q=kc;var lc=b("rp");a.rp=lc;var mc=b("rt");a.rt=mc;var nc=b("ruby");a.ruby=nc;var oc=b("s");a.s=oc;var pc=b("samp");a.samp=pc;var qc=b("script");a.script=qc;var rc=b("section");a.section=rc;var sc=b("select");a.select=sc;var tc=b("slot");a.slot=tc;var uc=b("small");a.small=uc;var vc=b("source");a.source=vc;var wc=b("span");a.span=wc;var xc=b("strong");a.strong=xc;var yc=b("style");a.style=yc;var zc=b("sub");a.sub=zc;var Ac=b("summary");a.summary=Ac;var Bc=b("sup");a.sup=Bc;var Cc=b("table");a.table=Cc;var Dc=b("tbody");a.tbody=Dc;var Ec=b("td");a.td=Ec;var Fc=b("template");a.template=Fc;var Gc=b("textarea");a.textarea=Gc;var Hc=b("tfoot");a.tfoot=Hc;var Ic=b("th");a.th=Ic;var Jc=b("thead");a.thead=Jc;var Kc=b("time");a.time=Kc;var Lc=b("title");a.title=Lc;var Mc=b("tr");a.tr=Mc;var Nc=b("track");a.track=Nc;var Oc=b("u");a.u=Oc;var Pc=b("ul");a.ul=Pc;var Qc=b("var");a.varEl=Qc;var Rc=b("video");a.video=Rc;var Sc=b("wbr");a.wbr=Sc;var Tc=b("xmp");a.xmp=Tc;var o={};Object.defineProperty(o,"__esModule",{value:!0});var na=function(){function e(e,t){this.map=e,this.children=t}return e.prototype.render=function(e,t){var a=this.children,r=this.map,$=r(t),n=a.map(function(t){return t.render(e,$)}),p=x(n);return 0===p.length?new _(n):new I(n,function(e){for(var t=r(e),a=0,$=p;a<$.length;a++){$[a].change(t)}})},e}(),Wc=na;o.MapStateTemplate=Wc;var oa=function(e){for(var t=[],a=1;a<arguments.length;a++)t[a-1]=arguments[a];return new na(e.map,t.map(g))};o.mapState=oa;var pa=function(){function e(e,t){this.map=e,this.children=t}return e.prototype.render=function(e,t){var a=this.children,r=this.map,$=a.map(function(a){return a.render(e.conditionalMapAction(r),t)});return Y($)},e}(),Zc=pa;o.MapActionTemplate=Zc;var $c=function(e){for(var t=[],a=1;a<arguments.length;a++)t[a-1]=arguments[a];return new pa(e.map,t.map(g))};o.mapAction=$c;var s={};Object.defineProperty(s,"__esModule",{value:!0});var ad=function(){function t(){this.listeners=[]}return t.ofOne=function(){return new t},t.ofTwo=function(){return new t},t.ofThree=function(){return new t},t.prototype.emit=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];for(var n=0,r=this.listeners;n<r.length;n++){r[n].apply(void 0,t)}},t.prototype.on=function(t){this.listeners.push(t)},t.prototype.off=function(t){var e=this.listeners.indexOf(t);return!(e<0)&&(this.listeners.splice(e,1),!0)},t.prototype.once=function(t){var e=this,n=function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];e.off(n),t.apply(void 0,r)};this.on(n)},t}(),K=ad;s.Emitter=K;var cd=function(t){return function(e){var n,r=!1;return function(){for(var o=[],u=0;u<arguments.length;u++)o[u]=arguments[u];n=o,r||(r=!0,setTimeout(function(){r=!1,e.apply(void 0,n)},t))}}};s.debounce=cd;var dd=function(t){var e,n=!1;return function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];e=r,n||(n=!0,requestAnimationFrame(function(){n=!1,t.apply(void 0,e)}))}};s.nextFrame=dd;var H={};Object.defineProperty(H,"__esModule",{value:!0});var ta=function(r,e){return r===e||r!=r&&e!=e};H.strictEqual=ta;var w=function(r,e){if(ta(r,e))return!0;if(null==r||null==e)return!1;var t=Array.isArray(r);if(t!==Array.isArray(e))return!1;if(t){var n=r,a=e;if((D=n.length)!==a.length)return!1;for(var o=0;o<D;o++)if(!w(n[o],a[o]))return!1;return!0}var i=r instanceof Date;if(i!==e instanceof Date)return!1;if(i)return+r==+e;var u=r instanceof Set;if(u!==e instanceof Set)return!1;if(u){var f=r,v=e;if(f.size!==v.size)return!1;for(var s=f.keys();;){if((A=s.next()).done)break;if(!v.has(A.value))return!1}return!0}var $=r instanceof Map;if($!==e instanceof Map)return!1;if($){var p=r,l=e;if(p.size!==l.size)return!1;for(var c=p.keys();;){var A;if((A=c.next()).done)break;if(!w(p.get(A.value),l.get(A.value)))return!1}return!0}var x="object"==typeof r;if(x!==("object"==typeof e))return!1;if(x){var D,y=r,d=e,q=Object.keys(y),E=Object.keys(d);if((D=q.length)!==E.length)return!1;for(o=0;o<D;o++){var b=q[o];if(!d.hasOwnProperty(b))return!1;if(!w(y[b],d[b]))return!1}return!0}return!1};H.deepEqual=w;var va={};Object.defineProperty(va,"__esModule",{value:!0});var id=function(){function e(e,t){void 0===t&&(t=w),this.value=e,this.equal=t,this.observable=this.emitter=K.ofOne()}return e.prototype.set=function(e){return!this.equal(this.value,e)&&(this.value=e,this.emit(this.value),!0)},e.prototype.get=function(){return this.value},e.prototype.emit=function(e){this.emitter.emit(e)},e}(),wa=id;va.Property=wa;var xa={};Object.defineProperty(xa,"__esModule",{value:!0});var ld=function(){function t(t,e){this.property=t,this.reducer=e,this.observable=this.emitter=K.ofThree()}return t.ofState=function(e){return new t(new wa(e.state,e.equal),e.reducer)},t.prototype.process=function(t){var e=this.reducer(this.property.get(),t),r=this.property.set(e);return this.emitter.emit(e,t,r),r},t}(),ya=ld;xa.Store=ya;var v={};Object.defineProperty(v,"__esModule",{value:!0});var od={count:0},pd=function($){return{kind:"decrement"}},qd=function($){return{kind:"increment"}},rd=function($,e){switch(e.kind){case"increment":return{count:$.count+1};case"decrement":return{count:$.count-1};default:throw"this should never happen";}},Ca=ya.ofState({state:od,reducer:rd}),hd=r({className:"app"},oa({map:function($){return $.count}},r({className:"count count-small"},"count"),r({className:"count"},String),r({className:"buttons"},B({onclick:pd,disabled:function($){return $<=0}},"-"),B({onclick:qd},"+"))));L.render({store:Ca,template:hd});if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=v}else if(typeof define==="function"&&define.amd){define(function(){return v})}})();