(function () {var ga={};Object.defineProperty(ga,"__esModule",{value:!0});var g=function(r,e){for(var t=r.length,$=new Array(t),a=0;a<t;a++)$[a]=e(r[a]);return $};ga.mapArray=g;var e={};Object.defineProperty(e,"__esModule",{value:!0});function la(t,e,$){var r=t.style;r[e]=null==$?null:$}var D=la;function h(t,e,$){null==$?t.removeAttribute(e):t.setAttribute(e,$)}e.setOneStyle=D;var ba=h;function bd(t,e,$){var r=t;r[e]=null==$?null:$}e.setAttribute=ba;var _=bd;function Va(t,e,$){if(null==$)t.removeAttribute(e);else if("string"==typeof $)h(t,e,$);else{var r=g(Object.keys($),function(t){return t+": "+$[t]+";"}).join(" ");h(t,e,r.length&&r||null)}}e.setProperty=_;var $=Va;function Vc(t,e,$){var r=t;if(null==$)r[e]=null;else{var E=!0===$||"true"===$;r[e]=E}}e.setStyleAttribute=$;var n=Vc;function ia(t,e,$){h(t,e,!0===$||"true"===$?"true":!1===$?"false":null)}e.setBoolProperty=n;var C=ia;function pa(t,e,$){h(t,e,!0===$||"true"===$?"":null)}e.setEnumBoolAttribute=C;var c=pa;function Ec(t,e,$){Array.isArray($)?h(t,e,$.join(", ")||null):h(t,e,$&&String($)||null)}e.setBoolAttribute=c;var E=Ec;function Pc(t,e,$){Array.isArray($)?h(t,e,$.join(" ")||null):h(t,e,$&&String($)||null)}e.setCommaSeparated=E;var k=Pc;e.setSpaceSeparated=k;var G={};Object.defineProperty(G,"__esModule",{value:!0});var Z={acceptcharset:"accept-charset",asattr:"as",classname:"class",httpequiv:"http-equiv",htmlfor:"for"};G.attributeNameMap=Z;var Y={"accept-charset":k,class:k,acceptcharset:k,async:c,autofocus:c,autoplay:c,checked:n,contenteditable:C,controls:c,default:c,defer:c,disabled:c,draggable:C,formnovalidate:c,headers:k,hidden:c,ismap:c,itemscope:c,loop:c,multiple:n,muted:n,nomodule:c,novalidate:c,open:c,ping:k,playsinline:c,readonly:c,rel:k,required:c,reversed:c,selected:n,sizes:E,srcset:E,style:$,typemustmatch:c,value:_};G.htmlAttributeMap=Y;var r={};Object.defineProperty(r,"__esModule",{value:!0});var H=function(){function e(e){this.makeContent=e}return e.prototype.render=function(e,t){var r=this.makeContent,$=r(t)||"",n=e.doc.createTextNode($);return e.append(n),{change:function(e){var t=r(e)||"";t!==$&&(n.nodeValue=t,t.length<5e3&&($=t))},destroy:function(){w(n)},request:function(e){}}},e}(),eb=H;r.DOMDerivedTextTemplate=eb;var U=function(){function e(e){this.content=e}return e.prototype.render=function(e,t){var r=e.doc.createTextNode(this.content);return e.append(r),{change:function(e){},destroy:function(){w(r)},request:function(e){}}},e}(),Gc=U;r.DOMLiteralTextTemplate=Gc;var T=function(e){return"function"==typeof e?new H(e):new U(e||"")};r.text=T;var i={};Object.defineProperty(i,"__esModule",{value:!0});function Rc(e){var t=e;t&&t.onblur&&(t.onblur=null),e&&void 0!==e.ownerDocument&&e.parentElement&&e.parentElement.removeChild(e)}var w=Rc;function Wc(e){return function(t){null!=e.parentElement&&e.parentElement.insertBefore(t,e)}}i.removeNode=w;var Zc=Wc;function ad(e){return"string"==typeof e||"function"==typeof e||void 0===e?T(e):e}i.insertBefore=Zc;var d=ad;function ha(e,t,r,n){var $=Y[t]||ba;if("function"==typeof r){if("INPUT"===e.nodeName||"TEXTAREA"===e.nodeName){var o=function(n){var o=r(n);$(e,t,o)};n.push(o)}else{var a=void 0;o=function(n){var o=r(n);o!==a&&($(e,t,o),String(o).length<5e4&&(a=o))};n.push(o)}}else $(e,t,r);return n}i.domChildToTemplate=d;var S=ha;function ka(e,t,r,n,$){var o;e[t]=function(t){var $=r(o,t,e);void 0!==$&&n($)};return $.push(function(e){o=e}),$}i.processAttribute=S;var R=ka;function ma(e,t,r,n){if("function"==typeof r){var $;n.push(function(n){var o=r(n);o!==$&&(D(e,t,o),$=o)})}else D(e,t,r);return n}i.processEvent=R;var Q=ma;i.processStyle=Q;var Ga=function(e){for(var t=[],r=0;r<e.children.length;r++){var n=e.children[r];t[r]=n.style.display,n.style.display="none"}var $={width:e.offsetWidth,height:e.offsetHeight};for(r=0;r<e.children.length;r++){(n=e.children[r]).style.display=t[r]}return $};i.containerSize=Ga;var z={};Object.defineProperty(z,"__esModule",{value:!0});var N=function(){function e(e,r,t){this.store=e,this.children=r,this.delayed=t}return e.prototype.render=function(e,r){var t;if(this.delayed){var o=!0;t=function(e){o&&(o=!1,setTimeout(function(){i.change(e),o=!0}))}}else t=function(e){i.change(e)};var n=this.store,$=n.property;$.observable.on(t);var a=e.withDispatch(function(e){n.process(e)}),p=g(this.children,function(e){return e.render(a,$.get())}),i={change:function(e){n.property.set(e);for(var r=0,t=p;r<t.length;r++){t[r].change(e)}},destroy:function(){$.observable.off(t);for(var e=0,r=p;e<r.length;e++){r[e].destroy()}},request:function(e){for(var r=0,t=p;r<t.length;r++){t[r].request(e)}}};return $.set(r),i},e}(),Dc=N;z.DOMComponentTemplate=Dc;var L=function(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];return new N(e.store,g(r,d),e.delayed||!1)};z.component=L;var K={};Object.defineProperty(K,"__esModule",{value:!0});var Ic=function(){function t(t,n,e,r){this.doc=t,this.append=n,this.parent=e,this.dispatch=r}return t.fromElement=function(n,e){return new t(n.ownerDocument||window&&window.document,function(t){return n.appendChild(t)},n,e)},t.prototype.mapAction=function(n){var e=this;return new t(this.doc,this.append,this.parent,function(t){return e.dispatch(n(t))})},t.prototype.conditionalMapAction=function(n){var e=this;return new t(this.doc,this.append,this.parent,function(t){var r=n(t);void 0!==r&&e.dispatch(r)})},t.prototype.withAppend=function(n){return new t(this.doc,n,this.parent,this.dispatch)},t.prototype.withParent=function(n){return new t(this.doc,this.append,n,this.dispatch)},t.prototype.withDispatch=function(n){return new t(this.doc,this.append,this.parent,n)},t}(),J=Ic;K.DOMContext=J;var t,V={};Object.defineProperty(V,"__esModule",{value:!0});var hd;!function(e){e.renderComponent=function(e){var o=e.el,r=e.component,t=r.store,n=e.document||document,$=o||n.body,p=r.render(new J(n,function(e){return $.appendChild(e)},$,function(){}),t.property.get());return{destroy:function(){return p.destroy()},request:function(e){return p.request(e)},store:t}},e.render=function(o){var r=o.el,t=o.store,n=o.document,$=o.template,p=o.delayed,c=L({store:t,delayed:p},$);return e.renderComponent({el:r,component:c,document:n})}}(hd=t||(t={},V.Tempo=t));var j={};Object.defineProperty(j,"__esModule",{value:!0});var I=function(e,r,t){return function(a,$){return e(a,r,t,$)}},Xc=function(e,r,t,a){return void 0!==typeof e?e(a,r,t):void 0},o=function(){function e(e,r,t,a,$,n,b,o,s,v){this.createElement=e,this.attrs=r,this.events=t,this.styles=a,this.afterrender=$,this.beforechange=n,this.afterchange=b,this.beforedestroy=o,this.respond=s,this.children=v}return e.prototype.render=function(e,r){for(var t=this,a=this.createElement(e.doc),$=void 0,n=[],b=0,o=this.attrs;b<o.length;b++){var s=o[b];S(a,s.name,s.value,n)}for(var v=0,p=this.events;v<p.length;v++){s=p[v];R(a,s.name,s.value,e.dispatch,n)}for(var l=0,c=this.styles;l<c.length;l++){s=c[l];Q(a,s.name,s.value,n)}for(var u=0,i=n;u<i.length;u++){(0,i[u])(r)}var f=e.withAppend(function(e){return a.appendChild(e)}).withParent(a),m=g(this.children,function(e){return e.render(f,r)});e.append(a),this.afterrender&&($=Xc(this.afterrender,a,e,r));var L=g(m,function(e){return function(r){return e.change(r)}});if(n.push.apply(n,L),this.beforechange){var X=I(this.beforechange,a,e),h=function(e){$=X(e,$)};n.unshift(h)}if(this.afterchange){var d=I(this.afterchange,a,e);h=function(e){$=d(e,$)};n.push(h)}var y=this.beforedestroy&&function(){return t.beforedestroy(a,e,$)},x=this.respond;return{change:function(e){for(var r=0,t=n;r<t.length;r++){(0,t[r])(e)}},destroy:function(){y&&y(),w(a);for(var e=0,r=m;e<r.length;e++){r[e].destroy()}},request:function(r){x&&($=x(r,a,e,$));for(var t=0,n=m;t<n.length;t++){n[t].request(r)}}}},e}(),$c=o;function u(e){return g(Object.keys(e||{}),function(r){var t=r.toLowerCase();return{name:t=Z[t]||t,value:e[r]}})}function s(e){return g(Object.keys(e||{}),function(r){return{name:"on"+r.toLowerCase(),value:e[r]}})}function q(e){return g(Object.keys(e||{}),function(r){return{name:r,value:e[r]}})}j.DOMElement=$c;var M=function(e){return function(r){return r.createElement(e)}},ja=function(e,r){for(var t=[],a=2;a<arguments.length;a++)t[a-2]=arguments[a];return new o(M(e),u(r.attrs),s(r.events),q(r.styles),r.afterrender,r.beforechange,r.afterchange,r.beforedestroy,r.respond,g(t,d))};j.el=ja;var a=function(e){return function(r){for(var t=[],a=1;a<arguments.length;a++)t[a-1]=arguments[a];return new o(M(e),u(r.attrs),s(r.events),q(r.styles),r.afterrender,r.beforechange,r.afterchange,r.beforedestroy,r.respond,g(t,d))}};j.el2=a;var O={svg:"http://www.w3.org/2000/svg"};j.defaultNamespaces=O;var P=function(e,r){return function(t){return t.createElementNS(e,r)}},na=function(e,r,t){for(var a=[],$=3;$<arguments.length;$++)a[$-3]=arguments[$];var n=O[e]||e;return new o(P(n,r),u(t.attrs),s(t.events),q(t.styles),t.afterrender,t.beforechange,t.afterchange,t.beforedestroy,t.respond,g(a,d))};j.elNS=na;var oa=function(e,r){return function(t){for(var a=[],$=1;$<arguments.length;$++)a[$-1]=arguments[$];return new o(P(e,r),u(t.attrs),s(t.events),q(t.styles),t.afterrender,t.beforechange,t.afterchange,t.beforedestroy,t.respond,g(a,d))}};j.elNS2=oa;var b={};Object.defineProperty(b,"__esModule",{value:!0});var qa=a("a");b.a=qa;var ra=a("abbr");b.abbr=ra;var sa=a("address");b.address=sa;var ta=a("applet");b.applet=ta;var ua=a("area");b.area=ua;var va=a("article");b.article=va;var wa=a("aside");b.aside=wa;var xa=a("audio");b.audio=xa;var ya=a("b");b.b=ya;var za=a("base");b.base=za;var Aa=a("basefont");b.basefont=Aa;var Ba=a("bdi");b.bdi=Ba;var Ca=a("bdo");b.bdo=Ca;var Da=a("blockquote");b.blockquote=Da;var Ea=a("body");b.body=Ea;var Fa=a("br");b.br=Fa;var x=a("button");b.button=x;var Ha=a("canvas");b.canvas=Ha;var Ia=a("caption");b.caption=Ia;var Ja=a("cite");b.cite=Ja;var Ka=a("code");b.code=Ka;var La=a("col");b.col=La;var Ma=a("colgroup");b.colgroup=Ma;var Na=a("data");b.data=Na;var Oa=a("datalist");b.datalist=Oa;var Pa=a("dd");b.dd=Pa;var Qa=a("del");b.del=Qa;var Ra=a("details");b.details=Ra;var Sa=a("dfn");b.dfn=Sa;var Ta=a("dialog");b.dialog=Ta;var Ua=a("dir");b.dir=Ua;var l=a("div");b.div=l;var Wa=a("dl");b.dl=Wa;var Xa=a("dt");b.dt=Xa;var Ya=a("em");b.em=Ya;var Za=a("embed");b.embed=Za;var $a=a("fieldset");b.fieldset=$a;var _a=a("figcaption");b.figcaption=_a;var ab=a("figure");b.figure=ab;var bb=a("font");b.font=bb;var cb=a("footer");b.footer=cb;var db=a("form");b.form=db;var gd=a("frame");b.frame=gd;var fb=a("frameset");b.frameset=fb;var gb=a("h1");b.h1=gb;var hb=a("h2");b.h2=hb;var ib=a("h3");b.h3=ib;var jb=a("h4");b.h4=jb;var kb=a("h5");b.h5=kb;var lb=a("h6");b.h6=lb;var mb=a("head");b.head=mb;var nb=a("header");b.header=nb;var ob=a("hgroup");b.hgroup=ob;var pb=a("hr");b.hr=pb;var qb=a("html");b.html=qb;var rb=a("i");b.i=rb;var sb=a("iframe");b.iframe=sb;var tb=a("img");b.img=tb;var ub=a("input");b.input=ub;var vb=a("ins");b.ins=vb;var wb=a("kbd");b.kbd=wb;var xb=a("label");b.label=xb;var yb=a("legend");b.legend=yb;var zb=a("li");b.li=zb;var Ab=a("link");b.link=Ab;var Bb=a("listing");b.listing=Bb;var Cb=a("main");b.main=Cb;var Db=a("map");b.map=Db;var Eb=a("mark");b.mark=Eb;var Fb=a("marquee");b.marquee=Fb;var Gb=a("menu");b.menu=Gb;var Hb=a("meta");b.meta=Hb;var Ib=a("meter");b.meter=Ib;var Jb=a("nav");b.nav=Jb;var Kb=a("noscript");b.noscript=Kb;var Lb=a("object");b.object=Lb;var Mb=a("ol");b.ol=Mb;var Nb=a("optgroup");b.optgroup=Nb;var Ob=a("option");b.option=Ob;var Pb=a("output");b.output=Pb;var Qb=a("p");b.p=Qb;var Rb=a("param");b.param=Rb;var Sb=a("picture");b.picture=Sb;var Tb=a("pre");b.pre=Tb;var Ub=a("progress");b.progress=Ub;var Vb=a("q");b.q=Vb;var Wb=a("rp");b.rp=Wb;var Xb=a("rt");b.rt=Xb;var Yb=a("ruby");b.ruby=Yb;var Zb=a("s");b.s=Zb;var $b=a("samp");b.samp=$b;var _b=a("script");b.script=_b;var ac=a("section");b.section=ac;var bc=a("select");b.select=bc;var cc=a("slot");b.slot=cc;var dc=a("small");b.small=dc;var ec=a("source");b.source=ec;var fc=a("span");b.span=fc;var gc=a("strong");b.strong=gc;var hc=a("style");b.style=hc;var ic=a("sub");b.sub=ic;var jc=a("summary");b.summary=jc;var kc=a("sup");b.sup=kc;var lc=a("table");b.table=lc;var mc=a("tbody");b.tbody=mc;var nc=a("td");b.td=nc;var oc=a("template");b.template=oc;var pc=a("textarea");b.textarea=pc;var qc=a("tfoot");b.tfoot=qc;var rc=a("th");b.th=rc;var sc=a("thead");b.thead=sc;var tc=a("time");b.time=tc;var uc=a("title");b.title=uc;var vc=a("tr");b.tr=vc;var wc=a("track");b.track=wc;var xc=a("u");b.u=xc;var yc=a("ul");b.ul=yc;var zc=a("var");b.varEl=zc;var Ac=a("video");b.video=Ac;var Bc=a("wbr");b.wbr=Bc;var Cc=a("xmp");b.xmp=Cc;var f={};Object.defineProperty(f,"__esModule",{value:!0});var B=function(){function e(e,r){this.map=e,this.children=r}return e.prototype.render=function(e,r){var p=this.children,t=this.map,a=t(r),$=g(p,function(r){return r.render(e,a)});return{change:function(e){for(var r=t(e),p=0,a=$;p<a.length;p++){a[p].change(r)}},destroy:function(){for(var e=0,r=$;e<r.length;e++){r[e].destroy()}},request:function(e){for(var r=0,p=$;r<p.length;r++){p[r].request(e)}}}},e}(),Fc=B;f.MapStateTemplate=Fc;var W=function(e){for(var r=[],p=1;p<arguments.length;p++)r[p-1]=arguments[p];return new B(e.map,g(r,d))};f.mapState=W;var Hc=function(e){for(var r=[],p=1;p<arguments.length;p++)r[p-1]=arguments[p];return new B(function(r){return[e.map(r),r]},g(r,d))};f.mapStateAndKeep=Hc;var X=function(){function e(e,r){this.map=e,this.children=r}return e.prototype.render=function(e,r){var p=this.children,t=this.map,a=e.conditionalMapAction(t),$=g(p,function(e){return e.render(a,r)});return{change:function(e){for(var r=0,p=$;r<p.length;r++){p[r].change(e)}},destroy:function(){for(var e=0,r=$;e<r.length;e++){r[e].destroy()}},request:function(e){for(var r=0,p=$;r<p.length;r++){p[r].request(e)}}}},e}(),Jc=X;f.MapActionTemplate=Jc;var Kc=function(e){for(var r=[],p=1;p<arguments.length;p++)r[p-1]=arguments[p];return new X(e.map,g(r,d))};f.mapAction=Kc;var y=function(){function e(e,r){this.map=e,this.children=r}return e.prototype.render=function(e,r){var p=this.children,t=this.map,a=g(p,function(p){return p.render(e,r)});return{change:function(e){for(var r=0,p=a;r<p.length;r++){p[r].change(e)}},destroy:function(){for(var e=0,r=a;e<r.length;e++){r[e].destroy()}},request:function(e){var r=t(e);void 0!==r&&a.forEach(function(e){return e.request(r)})}}},e}(),Mc=y;f.MapQueryTemplate=Mc;var Nc=function(e){for(var r=[],p=1;p<arguments.length;p++)r[p-1]=arguments[p];return new y(e.map,g(r,d))};f.mapQuery=Nc;var Oc=function(e){for(var r=[],p=1;p<arguments.length;p++)r[p-1]=arguments[p];return new y(e.map,g(r,d))};f.mapQueryConditional=Oc;var p={};Object.defineProperty(p,"__esModule",{value:!0});var Qc=function(){function t(){this.listeners=[]}return t.ofOne=function(){return new t},t.ofTwo=function(){return new t},t.ofThree=function(){return new t},t.prototype.emit=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];for(var n=0,r=this.listeners;n<r.length;n++){r[n].apply(void 0,t)}},t.prototype.on=function(t){this.listeners.push(t)},t.prototype.off=function(t){var e=this.listeners.indexOf(t);return!(e<0)&&(this.listeners.splice(e,1),!0)},t.prototype.once=function(t){var e=this,n=function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];e.off(n),t.apply(void 0,r)};this.on(n)},t}(),v=Qc;p.Emitter=v;var Sc=function(t){return function(e){var n,r=!1;return function(){for(var o=[],i=0;i<arguments.length;i++)o[i]=arguments[i];n=o,r||(r=!0,setTimeout(function(){r=!1,e.apply(void 0,n)},t))}}};p.debounce=Sc;var Tc=function(t){var e,n=!1;return function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];e=r,n||(n=!0,requestAnimationFrame(function(){n=!1,t.apply(void 0,e)}))}};p.nextFrame=Tc;var F={};Object.defineProperty(F,"__esModule",{value:!0});var aa=function(r,e){return r===e||r!=r&&e!=e};F.strictEqual=aa;var m=function(r,e){if(aa(r,e))return!0;if(null==r||null==e)return!1;var t=Array.isArray(r);if(t!==Array.isArray(e))return!1;if(t){var n=r,a=e;if((x=n.length)!==a.length)return!1;for(var i=0;i<x;i++)if(!m(n[i],a[i]))return!1;return!0}var u=r instanceof Date;if(u!==e instanceof Date)return!1;if(u)return+r==+e;var f=r instanceof Set;if(f!==e instanceof Set)return!1;if(f){var o=r,s=e;if(o.size!==s.size)return!1;for(var $=o.keys();;){if((v=$.next()).done)break;if(!s.has(v.value))return!1}return!0}var p=r instanceof Map;if(p!==e instanceof Map)return!1;if(p){var l=r,d=e;if(l.size!==d.size)return!1;for(var E=l.keys();;){var v;if((v=E.next()).done)break;if(!m(l.get(v.value),d.get(v.value)))return!1}return!0}var c="object"==typeof r;if(c!==("object"==typeof e))return!1;if(c){var x,y=r,G=e,L=Object.keys(y),q=Object.keys(G);if((x=L.length)!==q.length)return!1;for(i=0;i<x;i++){var b=L[i];if(!G.hasOwnProperty(b))return!1;if(!m(y[b],G[b]))return!1}return!0}return!1};F.deepEqual=m;var ca={};Object.defineProperty(ca,"__esModule",{value:!0});var Yc=function(){function e(e,t){void 0===t&&(t=m),this.value=e,this.equal=t,this.observable=this.emitter=v.ofOne()}return e.prototype.set=function(e){return!this.equal(this.value,e)&&(this.value=e,this.emit(this.value),!0)},e.prototype.get=function(){return this.value},e.prototype.emit=function(e){this.emitter.emit(e)},e}(),da=Yc;ca.Property=da;var ea={};Object.defineProperty(ea,"__esModule",{value:!0});var _c=function(){function r(r,e){this.property=r,this.reducer=e,this.observable=this.emitter=v.ofThree()}return r.ofState=function(e){return new r(new da(e.state,e.equal),e.reducer)},r.prototype.process=function(r){var e=this.reducer(this.property.get(),r),t=this.property.set(e);return this.emitter.emit(e,r,t),t},r}(),fa=_c;ea.Store=fa;var A={};Object.defineProperty(A,"__esModule",{value:!0});var cd={count:0},dd=function(){return{kind:"decrement"}},ed=function(){return{kind:"increment"}},fd=function(e,t){switch(t.kind){case"increment":return{count:e.count+1};case"decrement":return{count:e.count-1};default:throw"this should never happen";}},Uc=fa.ofState({state:cd,reducer:fd}),Lc=l({attrs:{className:"app"}},W({map:function(e){return e.count}},l({attrs:{className:"count count-small"}},"count"),l({attrs:{className:"count"}},String),l({attrs:{className:"buttons"}},x({events:{click:dd},attrs:{disabled:function(e){return e<=0}}},"-"),x({events:{click:ed}},"+"))));t.render({store:Uc,template:Lc});if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=A}else if(typeof define==="function"&&define.amd){define(function(){return A})}})();