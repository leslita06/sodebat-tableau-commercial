(function(){
"use strict";
var D=window.D, ICO=window.ICO, T=D.now.slice(0,10), NOWH=new Date(D.now);
var $=function(id){return document.getElementById(id);};
var nf=new Intl.NumberFormat("fr-FR");
function fm(n){return nf.format(Math.round(n)).replace(/\u202f|\u00a0/g,"\u00a0");}
function M(n){return fm(n)+"\u00a0FCFA";}
function Mc(n){if(n>=1e9){return (Math.round(n/1e7)/100).toString().replace(".",",")+"\u00a0Md";}if(n>=1e6){var v=Math.round(n/1e5)/10;return v.toString().replace(".",",")+"\u00a0M";}if(n>=1e3)return Math.round(n/1e3)+"\u00a0k";return fm(n);}
function Mx(n){return (Math.round(n/1e4)/100).toString().replace(".",",");}
function f1(x){return (Math.round(x*10)/10).toString().replace(".",",");}
function dobj(s){var p=s.slice(0,10).split("-");return new Date(+p[0],+p[1]-1,+p[2]);}
function isoD(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);}
function addD(s,n){var d=dobj(s);d.setDate(d.getDate()+n);return isoD(d);}
function days(a,b){return Math.round((dobj(b)-dobj(a))/864e5);}
function dd(s){var p=s.slice(0,10).split("-");return p[2]+"/"+p[1]+"/"+p[0];}
function ds(s){var p=s.slice(0,10).split("-");return p[2]+"/"+p[1];}
function hm(s){return s.slice(11,16).replace(":"," h ");}
var MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],MC=["Janv.","Févr.","Mars","Avr.","Mai","Juin","Juil.","Août","Sept.","Oct.","Nov.","Déc."],JRS=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
function longD(s){var d=dobj(s);return JRS[d.getDay()]+" "+d.getDate()+" "+MOIS[d.getMonth()]+" "+d.getFullYear();}
function shortD(s){var d=dobj(s);return JRS[d.getDay()]+" "+d.getDate()+" "+MOIS[d.getMonth()];}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function ic(n,c){return '<svg class="i'+(c?" "+c:"")+'" viewBox="0 0 24 24" aria-hidden="true">'+(ICO[n]||"")+"</svg>";}
function sum(a,f){return a.reduce(function(s,x){return s+(f?f(x):x);},0);}
function pl(n,s,p){return n+" "+(n>1?(p||(/s$/.test(s)?s:s+"s")):s);}
var COM={};D.coms.forEach(function(c){COM[c.id]=c;});
function av(id,sm){var c=COM[id]||{c:"c1",id:"?"};return '<span class="av '+c.c+(sm?" sm":"")+'" title="'+esc(c.nom||"")+'">'+id+"</span>";}
function cn(id){return COM[id]?COM[id].nom:id;}
function cfirst(id){return COM[id]?COM[id].nom.split(" ")[0]:id;}
function cini(n){var w=n.replace(/[’']/g," ").split(/[\s-]+/).filter(function(x){return x&&!/^(du|des|de|d|la|le|les|l|et|en|au|aux|sci)$/i.test(x);});return ((w[0]||"").charAt(0)+((w[1]||w[0]||"").charAt(w[1]?0:1))).toUpperCase();}
var GI={neuf:"building-2",modern:"circle-arrow-up",conf:"shield-alert",maint:"wrench",rep:"cog",esc:"arrow-up-down"};
var SEGS=["Syndic","Promoteur","Bureaux","Hôtel","Clinique","Commerce","Banque","École"];
var SEGI={"Syndic":"users","Promoteur":"building-2","Bureaux":"briefcase","Hôtel":"sun","Clinique":"shield-alert","Commerce":"package","Banque":"landmark","École":"file-text"};
var SEGOF={};D.contrats.forEach(function(c){SEGOF[c.client]=c.seg;});

/* ---------- état et filtres ---------- */
var state={v:"jour",seg:"Tous",com:"Tous",fd:"Toutes",qd:"",fa:"Toutes",qa:"",fr:"90"};
function segOK(s){return state.seg==="Tous"||s===state.seg;}
function comOK(c){return state.com==="Tous"||c===state.com;}
function dem(){return D.demandes.filter(function(x){return segOK(x.seg)&&comOK(x.com);});}
function aff(){return D.affaires.filter(function(x){return segOK(x.seg)&&comOK(x.com);});}
function aos(){return D.ao.filter(function(x){return comOK(x.com);});}
function cts(){return D.contrats.filter(function(x){return segOK(x.seg)&&comOK(x.com);});}
function prc(){return D.parc.filter(function(x){var c=D.contrats.filter(function(k){return k.client===x.client;})[0];return segOK(SEGOF[x.client])&&(!c||comOK(c.com));});}
function rep(l){return l.filter(function(x){return x.envoye;});}
function pend(l){return l.filter(function(x){return !x.envoye;});}
function s24(l){return l.filter(function(x){return x.envoye&&x.heures<=24;});}
function nextRel(a){return addD(a.dern,7);}
function relDue(a){return a.relances<3&&nextRel(a)<=T;}
function requal(a){return a.relances>=3;}
function aoOpen(l){return l.filter(function(a){return !a.fait;});}
function manq(a){return a.pieces.filter(function(p){return !p[1];});}
function ren90(l){return l.filter(function(c){return c.jours<=90&&c.statut!=="renouvele";});}
function modOK(l){return l.filter(function(p){return p.score>=60;});}
function restant(x){return Math.round((24-x.heures)*10)/10;}
var STD={chiffrage:["Chiffrage en cours","a"],validation:["Prix à valider","b"],envoye:["Devis envoyé","n"],gagne:["Gagné","g"],perdu:["Perdu","r"],negociation:["En négociation","b"]};
function stp(s){var x=STD[s]||[s,"n"];return '<span class="pill '+x[1]+'"><span class="dot"></span>'+x[0]+"</span>";}

/* ---------- petits éléments ---------- */
function spark(vals,col){var w=92,h=36,n=vals.length,mx=Math.max.apply(null,vals.concat([1])),mn=0;
  var pts=vals.map(function(v,i){return [(i/(n-1))*w,h-3-((v-mn)/(mx-mn))*(h-8)];});
  var d=pts.map(function(p,i){return (i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1);}).join(" ");col=col||"#38B6FF";var last=pts[n-1];
  return '<svg viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none"><path d="'+d+' L'+w+' '+h+' L0 '+h+' Z" fill="'+col+'" fill-opacity=".1" stroke="none"/><path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/><circle cx="'+last[0]+'" cy="'+last[1]+'" r="2.6" fill="#004AAD"/></svg>';}
function ring(p,col){var r=15,c=2*Math.PI*r;return '<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="'+r+'" fill="none" stroke="#E3E8EF" stroke-width="4"/><circle cx="18" cy="18" r="'+r+'" fill="none" stroke="'+(col||"#004AAD")+'" stroke-width="4" stroke-linecap="round" stroke-dasharray="'+(c*p/100).toFixed(1)+" "+c.toFixed(1)+'" transform="rotate(-90 18 18)"/></svg>';}
function kc(o){var tag=o.go?'button type="button" data-goto="'+o.go+'"':"div";return "<"+tag+' class="kc'+(o.key?" key":"")+'"><p class="l">'+ic(o.ico)+o.l+'</p><div class="vr"><p class="v">'+o.v+(o.u?"<small>"+o.u+"</small>":"")+"</p>"+(o.sp?'<div class="sp">'+o.sp+"</div>":"")+'</div><div class="s">'+o.s+"</div></"+(o.go?"button":"div")+">";}
function dl(v,cls){return '<span class="dl '+cls+'">'+v+"</span>";}
function who(t,s,i){return '<div class="who">'+(i?'<span class="lgt">'+ic(i)+"</span>":'<span class="av cl">'+cini(t)+"</span>")+'<div><p class="nm">'+esc(t)+'</p><p class="mt2">'+s+"</p></div></div>";}
function cd(h){var bad=h<6;return '<span class="cd'+(bad?" bad":"")+'">'+f1(h)+"<small>h</small></span>";}
function hrs(h){return h<1?Math.round(h*60)+" min":f1(h)+" h";}

/* ---------- navigation ---------- */
var VIEWS={jour:"Aujourd'hui",devis:"Devis sous 24 h",affaires:"Affaires et relances",ao:"Appels d'offres",renouv:"Renouvellements",modern:"Modernisations"};
function go(v,noScroll){if(!VIEWS[v])v="jour";state.v=v;
  [].forEach.call(document.querySelectorAll(".view"),function(e){e.classList.toggle("on",e.id==="v-"+v);});
  [].forEach.call(document.querySelectorAll("[data-v]"),function(e){e.classList.toggle("on",e.getAttribute("data-v")===v);});
  $("crumb-v").textContent=VIEWS[v];
  if(location.hash!=="#"+v)history.replaceState(null,"","#"+v);
  render();if(!noScroll)window.scrollTo(0,0);}

function menus(){
  var all=["Tous"].concat(SEGS);
  $("seg-m").innerHTML=all.map(function(s){var n=s==="Tous"?D.demandes.length+D.contrats.length:D.demandes.filter(function(x){return x.seg===s;}).length+D.contrats.filter(function(x){return x.seg===s;}).length;
    return '<button class="mi'+(state.seg===s?" on":"")+'" data-seg="'+esc(s)+'"><span class="lgt">'+ic(s==="Tous"?"layers":SEGI[s])+'</span><span>'+(s==="Tous"?"Tous les clients":esc(s))+"<small>"+pl(n,"dossier")+"</small></span>"+ic("check","ck")+"</button>";}).join("");
  $("seg-l").textContent=state.seg==="Tous"?"Tous les clients":state.seg;$("seg-b").classList.toggle("on",state.seg!=="Tous");
  $("com-m").innerHTML=[{id:"Tous",nom:"Toute l'équipe",role:"3 commerciaux"}].concat(D.coms).map(function(c){
    return '<button class="mi'+(state.com===c.id?" on":"")+'" data-com="'+c.id+'">'+(c.id==="Tous"?'<span class="lgt">'+ic("users")+"</span>":av(c.id))+'<span>'+esc(c.nom)+"<small>"+esc(c.role)+"</small></span>"+ic("check","ck")+"</button>";}).join("");
  $("com-l").textContent=state.com==="Tous"?"Toute l'équipe":cn(state.com);$("com-b").classList.toggle("on",state.com!=="Tous");
}
function closeMenus(){$("seg-m").classList.remove("on");$("com-m").classList.remove("on");}
function filt(){var t=[];if(state.seg!=="Tous")t.push("clients « "+state.seg+" »");if(state.com!=="Tous")t.push(cn(state.com));return t.length?' <span class="fchip">'+ic("filter")+t.join(", ")+'<button data-clear="1" aria-label="Retirer le filtre">'+ic("x")+"</button></span>":"";}

/* ---------- AUJOURD'HUI ---------- */
function renderJour(){
  var dm=dem(),r=rep(dm),s=s24(dm),p=pend(dm),af=aff(),c=ren90(cts()),ao=aoOpen(aos());
  var tx=r.length?Math.round(100*s.length/r.length):0;
  var urg=p.filter(function(x){return restant(x)<8;}).length,rel=af.filter(relDue);
  $("lede-j").innerHTML="<b>"+pl(p.length,"demande")+" de devis</b> attend"+(p.length>1?"ent":"")+" une réponse, dont "+(urg?'<span class="r">'+urg+" à remettre avant ce soir</span>":"aucune urgente")+". <b>"+pl(rel.length,"relance")+"</b> à faire, "+pl(ao.filter(function(a){return days(T,a.remise)<=7;}).length,"appel")+" d'offres à rendre sous 7 jours, et <b>"+pl(c.filter(function(x){return x.risque.length;}).length,"contrat")+" de maintenance à risque</b> dans les 90 jours."+filt();
  $("kpis-j").innerHTML=
    kc({key:1,ico:"timer",l:"Devis envoyés sous 24 h",v:tx+"\u00a0%",u:s.length+" sur "+r.length,s:"délai moyen <b>"+hrs(r.length?sum(r,function(x){return x.heures;})/r.length:0)+"</b> en novembre",sp:spark([58,61,55,64,70,tx]),go:"devis"})+
    kc({ico:"briefcase",l:"Affaires en cours",v:Mc(sum(af,function(x){return x.montant;})),u:"FCFA",s:pl(af.length,"devis")+" ouverts, <b>"+Mc(sum(af,function(x){return x.montant*x.proba/100;}))+"</b> pondérés",go:"affaires"})+
    kc({ico:"refresh-cw",l:"Contrats à renouveler sous 90 jours",v:Mc(sum(c,function(x){return x.annuel;})),u:"FCFA par an",s:pl(c.length,"contrat")+", "+pl(sum(c,function(x){return x.appareils;}),"appareil")+" "+(c.filter(function(x){return x.risque.length;}).length?dl(c.filter(function(x){return x.risque.length;}).length+" à risque","bad"):""),go:"renouv"});
  $("j-dev").innerHTML=p.length?p.sort(function(a,b){return restant(a)-restant(b);}).map(function(x){var h=restant(x);
    return '<div class="li" data-dem="'+x.id+'"><div class="who"><span class="lgt">'+ic(GI[x.gamme])+'</span><div><p class="nm">'+esc(x.client)+'</p><p class="mt2">'+esc(x.objet)+'</p><div class="tags">'+stp(x.statut)+'<span class="pill n">'+esc(x.source)+'</span></div></div></div><div class="rr">'+av(x.com,1)+'<span class="amt">'+Mc(x.montant)+'</span><span class="cdw"><small>reste</small>'+cd(h)+"</span></div></div>";}).join(""):'<p class="empty">Aucune demande en attente.</p>';
  var a15=ao.filter(function(a){return days(T,a.remise)<=15;}).sort(function(a,b){return a.remise<b.remise?-1:1;});
  $("j-ao").innerHTML=a15.length?a15.map(function(a){var k=days(T,a.remise),m=manq(a).length;return '<div class="li" data-ao="'+a.id+'">'+who(a.acheteur,shortD(a.remise)+", "+(m?'<span class="r">'+pl(m,"pièce")+" manquante"+(m>1?"s":"")+"</span>":"dossier complet"),"landmark")+'<div class="rr"><span class="cd'+(k<=7?" bad":"")+'">'+k+"<small>j</small></span></div></div>";}).join(""):'<p class="empty">Aucun appel d\'offres sous 15 jours.</p>';
  var rk=c.filter(function(x){return x.risque.length;}).sort(function(a,b){return a.jours-b.jours;});
  $("j-ren").innerHTML=rk.length?rk.map(function(x){return '<div class="li" data-ct="'+esc(x.client)+'">'+who(x.client,x.risque.join(", ")+", échéance "+ds(x.echeance))+'<div class="rr"><span class="amt">'+Mc(x.annuel)+"</span></div></div>";}).join(""):'<p class="empty">Aucun contrat à risque sous 90 jours.</p>';
  $("t-jrel").innerHTML=relTable(rel.sort(function(a,b){return b.montant-a.montant;}),true);
  // par commercial
  var rows=D.coms.map(function(c){var d=D.demandes.filter(function(x){return x.com===c.id&&segOK(x.seg);}),r=rep(d),a=D.affaires.filter(function(x){return x.com===c.id&&segOK(x.seg);}),k=ren90(D.contrats.filter(function(x){return x.com===c.id&&segOK(x.seg);}));
    var t=r.length?Math.round(100*s24(d).length/r.length):null;
    return '<tr data-setcom="'+c.id+'" class="'+(state.com===c.id?"on":"")+'"><td class="w" data-l="Commercial"><div class="who">'+av(c.id)+'<div><p class="nm">'+esc(c.nom)+'</p><p class="mt2">'+esc(c.role)+'</p></div></div></td><td class="r" data-l="Demandes de novembre">'+d.length+'</td><td class="r" data-l="Sous 24 h">'+(t==null?'<span class="zero">0</span>':'<span class="pill '+(t>=80?"g":t>=60?"a":"r")+'">'+t+" %</span>")+'</td><td class="num" data-l="Affaires en cours">'+Mc(sum(a,function(x){return x.montant;}))+"<small>"+pl(a.length,"devis")+'</small></td><td class="r" data-l="Relances dues">'+(a.filter(relDue).length||'<span class="zero">0</span>')+'</td><td class="num" data-l="Contrats sous 90 jours">'+(k.length?Mc(sum(k,function(x){return x.annuel;}))+"<small>"+pl(k.length,"contrat")+"</small>":'<span class="zero">0</span>')+"</td></tr>";});
  $("t-coms").innerHTML="<thead><tr><th>Commercial</th><th class=\"r\">Demandes de novembre</th><th class=\"r\">Sous 24 h</th><th class=\"r\">Affaires en cours</th><th class=\"r\">Relances dues</th><th class=\"r\">Contrats sous 90 jours</th></tr></thead><tbody>"+rows.join("")+"</tbody>";
}
function relTable(l,short){if(!l.length)return '<tbody><tr><td class="empty">Aucune relance due.</td></tr></tbody>';
  return "<thead><tr><th>Client et objet</th><th>Commercial</th><th>Étape</th><th>Prochaine relance</th><th class=\"r\">Montant HT</th><th></th></tr></thead><tbody>"+l.map(function(a){var n=nextRel(a),k=days(n,T);
    return '<tr data-aff="'+a.id+'"><td class="w obj" data-l="Client"><b>'+esc(a.client)+"</b><small>"+a.id+", "+esc(a.objet)+'</small></td><td data-l="Commercial"><span class="com">'+av(a.com,1)+cfirst(a.com)+'</span></td><td data-l="Étape">'+(requal(a)?'<span class="pill r"><span class="dot"></span>À requalifier</span>':stp(a.statut))+' <span class="stp"><span class="steps">'+[0,1,2].map(function(i){return '<i class="'+(i<a.relances?"on":"")+'"></i>';}).join("")+"</span>"+a.relances+'/3</span></td><td data-l="Prochaine relance">'+(requal(a)?'<span class="zero">appel du responsable</span>':(k>0?'<span class="pill r">'+pl(k,"jour")+" de retard</span>":k===0?'<span class="pill a">aujourd\'hui</span>':ds(n)))+'</td><td class="num" data-l="Montant HT">'+Mc(a.montant)+'</td><td class="act"><span class="rowact"><button class="ib" data-aff="'+a.id+'" aria-label="Préparer la relance">'+ic("message-circle")+"</button></span></td></tr>";}).join("")+"</tbody>";}

/* ---------- DEVIS SOUS 24 H ---------- */
var charts={};
function chart(id,cfg){if(charts[id])charts[id].destroy();charts[id]=new Chart($(id),cfg);}
Chart.defaults.font.family='"Inter",system-ui,sans-serif';Chart.defaults.font.size=12;Chart.defaults.color="#6B7280";
var ANIM=!window.__CAPTURE;
function renderDev(){
  var dm=dem(),r=rep(dm),s=s24(dm),p=pend(dm),tx=r.length?Math.round(100*s.length/r.length):0,hors=r.filter(function(x){return x.heures>24;});
  $("lede-d").innerHTML="En novembre, <b>"+pl(dm.length,"demande")+"</b> de devis sont arrivées. "+pl(r.length,"devis")+" sont partis, dont <b>"+s.length+" en moins de 24 heures</b>"+(hors.length?' et <span class="r">'+hors.length+" hors délai</span>":"")+". "+pl(p.length,"demande")+" en cours de chiffrage."+filt();
  $("kpis-d").innerHTML=kc({key:1,ico:"timer",l:"Devis envoyés sous 24 h",v:tx+"\u00a0%",u:s.length+" sur "+r.length,s:"objectif de la maison : <b>90 %</b>",sp:spark([58,61,55,64,70,tx])})+
    kc({ico:"clock",l:"Délai moyen de réponse",v:r.length?f1(sum(r,function(x){return x.heures;})/r.length):"0",u:"heures",s:"de la demande au devis envoyé"})+
    kc({ico:"inbox",l:"Demandes en cours",v:p.length,u:"devis",s:Mc(sum(p,function(x){return x.montant;}))+" FCFA à chiffrer"});
  var B=[["Moins de 4 h",0,4],["4 à 8 h",4,8],["8 à 24 h",8,24],["24 à 48 h",24,48],["Plus de 48 h",48,1e9]];
  chart("c-delai",{type:"bar",data:{labels:B.map(function(b){return b[0];}),datasets:[{data:B.map(function(b){return r.filter(function(x){return x.heures>=b[1]&&x.heures<b[2];}).length;}),backgroundColor:B.map(function(b){return b[1]>=24?"#C8352B":"#004AAD";}),borderRadius:6,maxBarThickness:46}]},
    options:{animation:ANIM,responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return pl(c.raw,"devis");}}}},scales:{x:{grid:{display:false}},y:{beginAtZero:true,ticks:{stepSize:1,precision:0},grid:{color:"#EEF1F5"},border:{display:false}}}}});
  $("n-delai").innerHTML=hors.length?"Hors délai : "+hors.map(function(x){return "<b>"+esc(x.client)+"</b> ("+hrs(x.heures)+")";}).join(", ")+". Les trois demandaient une visite technique avant le chiffrage.":"Aucun devis hors délai.";
  var S={};dm.forEach(function(x){S[x.source]=(S[x.source]||0)+1;});var ks=Object.keys(S).sort(function(a,b){return S[b]-S[a];}),PAL=["#004AAD","#38B6FF","#3A3A3B","#7FA6DA","#B8D9F2","#A3A3A0"];
  chart("c-src",{type:"doughnut",data:{labels:ks,datasets:[{data:ks.map(function(k){return S[k];}),backgroundColor:PAL,borderWidth:2,borderColor:"#fff"}]},options:{animation:ANIM,responsive:true,maintainAspectRatio:false,cutout:"64%",plugins:{legend:{display:false}}}});
  $("l-src").innerHTML=ks.map(function(k,i){return '<span><i style="background:'+PAL[i]+'"></i>'+esc(k)+" <b>"+S[k]+"</b></span>";}).join("");
  var F={"Toutes":dm,"En cours":p,"Sous 24 h":s,"Hors délai":hors};
  $("seg-dev").innerHTML=Object.keys(F).map(function(k){return '<button class="'+(state.fd===k?"on":"")+'" data-fd="'+k+'">'+k+' <span class="c">'+F[k].length+"</span></button>";}).join("");
  var q=state.qd.toLowerCase(),l=F[state.fd].filter(function(x){return !q||(x.client+" "+x.objet+" "+x.id).toLowerCase().indexOf(q)>=0;}).sort(function(a,b){return (a.envoye?1:0)-(b.envoye?1:0)||(a.recu<b.recu?1:-1);});
  $("t-dev").innerHTML=l.length?"<thead><tr><th>Demande</th><th>Canal</th><th>Commercial</th><th>Reçue</th><th>Délai</th><th>Étape</th><th class=\"r\">Montant HT</th></tr></thead><tbody>"+l.map(function(x){
    var dl2=x.envoye?(x.heures<=24?'<span class="pill g">'+ic("check")+hrs(x.heures)+"</span>":'<span class="pill r">'+hrs(x.heures)+"</span>"):'<span class="pill '+(restant(x)<8?"r":"a")+'">'+ic("clock")+"reste "+hrs(restant(x))+"</span>";
    return '<tr data-dem="'+x.id+'"><td class="w obj" data-l="Demande"><b>'+esc(x.client)+"</b><small>"+x.id+", "+esc(x.objet)+'</small></td><td data-l="Canal">'+esc(x.source)+'</td><td data-l="Commercial"><span class="com">'+av(x.com,1)+cfirst(x.com)+'</span></td><td data-l="Reçue">'+ds(x.recu)+" à "+hm(x.recu)+'</td><td data-l="Délai">'+dl2+'</td><td data-l="Étape">'+stp(x.statut)+'</td><td class="num" data-l="Montant HT">'+Mc(x.montant)+"</td></tr>";}).join("")+"</tbody>":'<tbody><tr><td class="empty">Aucune demande pour ce filtre.</td></tr></tbody>';
}

/* ---------- AFFAIRES ---------- */
function renderAff(){
  var af=aff(),pipe=sum(af,function(x){return x.montant;}),pond=sum(af,function(x){return x.montant*x.proba/100;}),V=D.ventes,G=["neuf","modern","conf","maint","rep"];
  var nov=sum(G,function(g){return V[g][V[g].length-1];});
  $("lede-a").innerHTML="<b>"+pl(af.length,"devis")+"</b> attendent une décision du client, pour <b>"+M(pipe)+"</b>. "+pl(af.filter(relDue).length,"relance")+" sont dues, "+pl(af.filter(function(x){return x.statut==="negociation";}).length,"affaire")+" en négociation."+filt();
  $("kpis-a").innerHTML=kc({key:1,ico:"briefcase",l:"Affaires en cours",v:Mc(pipe),u:"FCFA",s:pl(af.length,"devis")+" envoyés, sans réponse définitive"})+
    kc({ico:"target",l:"Montant pondéré",v:Mc(pond),u:"FCFA",s:"25 % pour un devis envoyé, 50 % en négociation"})+
    kc({ico:"file-check",l:"Signé en novembre",v:f1(nov),u:"M FCFA",s:"objectif indicatif <b>100 M</b> par mois",sp:spark(V.mois.map(function(m,i){return sum(G,function(g){return V[g][i];});}))});
  var COL={neuf:"#004AAD",modern:"#38B6FF",conf:"#7FA6DA",maint:"#3A3A3B",rep:"#B8C2CF"};
  chart("c-ven",{type:"bar",data:{labels:V.mois,datasets:G.map(function(g){return {type:"bar",label:D.gammes[g],data:V[g],backgroundColor:COL[g],stack:"s",borderRadius:2,maxBarThickness:40};}).concat([{type:"line",label:"Objectif",data:V.objectif,borderColor:"#C8352B",borderDash:[5,4],borderWidth:1.6,pointRadius:0,fill:false}])},
    options:{animation:ANIM,responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.dataset.label+" : "+f1(c.raw)+" M";}}}},scales:{x:{stacked:true,grid:{display:false}},y:{stacked:true,beginAtZero:true,grid:{color:"#EEF1F5"},border:{display:false}}}}});
  $("l-ven").innerHTML=G.map(function(g){return '<span><i style="background:'+COL[g]+'"></i>'+D.gammes[g]+"</span>";}).join("")+'<span><i class="ln"></i>Objectif</span>';
  var byG={};af.forEach(function(x){byG[x.gamme]=(byG[x.gamme]||0)+x.montant;});var gk=Object.keys(byG).sort(function(a,b){return byG[b]-byG[a];}),mx=Math.max.apply(null,gk.map(function(k){return byG[k];}).concat([1]));
  $("hb-g").innerHTML=gk.map(function(k,i){return '<div class="r'+(i===0?" top":"")+'"><span class="n">'+D.gammes[k]+'</span><span class="t"><i style="width:'+(100*byG[k]/mx).toFixed(1)+'%"></i></span><span class="v">'+Mc(byG[k])+"</span></div>";}).join("");
  $("n-g").innerHTML=gk.length?"Les ascenseurs neufs pèsent <b>"+Math.round(100*(byG.neuf||0)/Math.max(pipe,1))+" %</b> du montant en cours, sur "+pl(af.filter(function(x){return x.gamme==="neuf";}).length,"affaire")+" seulement : une décision qui tarde sur l'un d'eux décale tout le trimestre.":"";
  var F={"Toutes":af,"À relancer":af.filter(relDue),"En négociation":af.filter(function(x){return x.statut==="negociation";}),"À requalifier":af.filter(requal)};
  $("seg-aff").innerHTML=Object.keys(F).map(function(k){return '<button class="'+(state.fa===k?"on":"")+'" data-fa="'+k+'">'+k+' <span class="c">'+F[k].length+"</span></button>";}).join("");
  var q=state.qa.toLowerCase(),l=F[state.fa].filter(function(x){return !q||(x.client+" "+x.objet+" "+x.id).toLowerCase().indexOf(q)>=0;}).sort(function(a,b){return nextRel(a)<nextRel(b)?-1:1;});
  $("t-aff").innerHTML=relTable(l);
}

/* ---------- APPELS D'OFFRES ---------- */
function renderAo(){
  var all=aos(),o=aoOpen(all).sort(function(a,b){return a.remise<b.remise?-1:1;}),k7=o.filter(function(a){return days(T,a.remise)<=7;}),mq=sum(o,function(a){return manq(a).length;}),fait=all.filter(function(a){return a.fait;});
  $("lede-o").innerHTML="<b>"+pl(o.length,"appel")+" d'offres</b> en préparation pour <b>"+M(sum(o,function(a){return a.montant;}))+"</b>. "+(k7.length?'<span class="r">'+pl(k7.length,"dossier")+" à rendre sous 7 jours</span>, ":"")+pl(mq,"pièce")+" encore à réunir."+(fait.length?" "+fait.map(function(a){return esc(a.fait.charAt(0).toLowerCase()+a.fait.slice(1))+" ("+esc(a.acheteur)+")";}).join(", ").replace(/^./,function(c){return c.toUpperCase();})+".":"")+(state.seg!=="Tous"?' <span class="fchip">'+ic("info")+"Le filtre client ne s'applique pas aux appels d'offres</span>":"");
  $("kpis-o").innerHTML=kc({key:1,ico:"landmark",l:"Appels d'offres ouverts",v:o.length,u:"dossiers",s:"<b>"+Mc(sum(o,function(a){return a.montant;}))+"</b> FCFA HT au total"})+
    kc({ico:"calendar-clock",l:"À rendre sous 7 jours",v:k7.length,u:"dossier"+(k7.length>1?"s":""),s:k7.length?esc(k7[0].acheteur)+", "+shortD(k7[0].remise):"aucun"})+
    kc({ico:"list-checks",l:"Pièces manquantes",v:mq,u:"pièces",s:"dont "+pl(o.filter(function(a){return a.pieces.some(function(p){return /Caution/.test(p[0])&&!p[1];});}).length,"caution")+" de soumission à obtenir de la banque"});
  $("ao-cards").innerHTML=o.length?o.map(function(a){var k=days(T,a.remise),m=manq(a),n=a.pieces.length,ok=n-m.length,p=Math.round(100*ok/n);
    return '<button class="card aoc" data-ao="'+a.id+'"><div class="aoc-h"><span class="pill '+(a.type==="Public"?"b":"n")+'">'+a.type+'</span><span class="cd'+(k<=7?" bad":"")+'">'+k+"<small>jours</small></span></div><p class=\"aoc-t\">"+esc(a.acheteur)+'</p><p class="aoc-o">'+esc(a.objet)+'</p><div class="aoc-m"><div><small>Montant estimé</small><b>'+Mc(a.montant)+'</b></div><div><small>Remise</small><b>'+shortD(a.remise)+'</b></div><div class="go"><span class="rg">'+ring(a.go,a.go>=75?"#004AAD":"#38B6FF")+"<b>"+a.go+'</b></span><small>opportunité</small></div></div><div class="aoc-p"><div class="prog"><span class="tr"><i class="'+(k<=7&&m.length?"bad":"")+'" style="width:'+p+'%"></i></span>'+ok+"/"+n+" pièces</div>"+(m.length?'<p class="aoc-x">Manque : '+m.map(function(x){return esc(x[0].toLowerCase());}).join(", ")+"</p>":'<p class="aoc-x ok">Dossier complet</p>')+'</div><div class="aoc-f">'+av(a.com,1)+cn(a.com)+ic("arrow-right")+"</div></button>";}).join(""):'<p class="empty card">Aucun appel d\'offres pour ce commercial.</p>';
}

/* ---------- RENOUVELLEMENTS ---------- */
function renderRen(){
  var c=cts(),c90=ren90(c),rk=c90.filter(function(x){return x.risque.length;});
  $("lede-r").innerHTML="<b>"+pl(c90.length,"contrat")+"</b> de maintenance arrivent à échéance dans les 90 jours ("+pl(sum(c90,function(x){return x.appareils;}),"appareil")+", "+M(sum(c90,function(x){return x.annuel;}))+" par an). "+(rk.length?'<span class="r">'+rk.length+" sont à risque</span> : la proposition doit partir cette semaine.":"Aucun n'est à risque.")+filt();
  var pr=c90.filter(function(x){return x.statut==="a_preparer";}).length;
  $("kpis-r").innerHTML=kc({key:1,ico:"refresh-cw",l:"À renouveler sous 90 jours",v:Mc(sum(c90,function(x){return x.annuel;})),u:"FCFA par an",s:pl(c90.length,"contrat")+", "+pl(sum(c90,function(x){return x.appareils;}),"appareil")})+
    kc({ico:"triangle-alert",l:"Contrats à risque",v:rk.length,u:"sur "+c90.length,s:rk.length?"<b>"+Mc(sum(rk,function(x){return x.annuel;}))+"</b> FCFA par an en jeu":"aucun"})+
    kc({ico:"file-text",l:"Propositions à préparer",v:pr,u:"contrat"+(pr>1?"s":""),s:pl(c90.filter(function(x){return x.statut==="proposition";}).length,"proposition")+" déjà envoyée"+(c90.filter(function(x){return x.statut==="proposition";}).length>1?"s":"")});
  var mo={},order=[];c.forEach(function(x){var k=x.echeance.slice(0,7);if(order.indexOf(k)<0)order.push(k);mo[k]=mo[k]||{r:0,o:0};mo[k][x.risque.length?"r":"o"]+=x.annuel/1e6;});order.sort();
  chart("c-ren",{type:"bar",data:{labels:order.map(function(k){var p=k.split("-");return MC[+p[1]-1]+" "+p[0].slice(2);}),datasets:[{label:"À risque",data:order.map(function(k){return Math.round(mo[k].r*100)/100;}),backgroundColor:"#C8352B",stack:"s",borderRadius:3,maxBarThickness:54},{label:"Sans alerte",data:order.map(function(k){return Math.round(mo[k].o*100)/100;}),backgroundColor:"#38B6FF",stack:"s",borderRadius:3,maxBarThickness:54}]},
    options:{animation:ANIM,responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(x){return x.dataset.label+" : "+f1(x.raw)+" M";}}}},scales:{x:{stacked:true,grid:{display:false}},y:{stacked:true,beginAtZero:true,grid:{color:"#EEF1F5"},border:{display:false}}}}});
  $("l-ren").innerHTML='<span><i style="background:#C8352B"></i>À risque</span><span><i style="background:#38B6FF"></i>Sans alerte</span>';
  var F={"90":["Sous 90 jours",c90],"180":["Sous 6 mois",c.filter(function(x){return x.jours<=190;})],"r":["À risque",c.filter(function(x){return x.risque.length&&x.statut!=="renouvele";})]};
  $("seg-ren").innerHTML=Object.keys(F).map(function(k){return '<button class="'+(state.fr===k?"on":"")+'" data-fr="'+k+'">'+F[k][0]+' <span class="c">'+F[k][1].length+"</span></button>";}).join("");
  var l=F[state.fr][1].slice().sort(function(a,b){return a.jours-b.jours;});
  var ST={a_preparer:["À préparer","a"],proposition:["Proposition envoyée","b"],renouvele:["Renouvelé","g"]};
  $("t-ren").innerHTML=l.length?"<thead><tr><th>Client</th><th>Commercial</th><th>Échéance</th><th class=\"r\">Appareils</th><th>Alertes</th><th>Étape</th><th class=\"r\">Montant annuel HT</th></tr></thead><tbody>"+l.map(function(x){
    return '<tr data-ct="'+esc(x.client)+'"><td class="w" data-l="Client">'+who(x.client,esc(x.seg)+", "+pl(x.pannes,"panne")+" en 12 mois")+'</td><td data-l="Commercial"><span class="com">'+av(x.com,1)+cfirst(x.com)+'</span></td><td data-l="Échéance"><span class="cd'+(x.jours<=45?" bad":"")+'">'+x.jours+"<small>j</small></span> <span class=\"zero\">"+ds(x.echeance)+'</span></td><td class="r" data-l="Appareils">'+x.appareils+'</td><td class="w" data-l="Alertes">'+(x.risque.length?'<span class="chips">'+x.risque.map(function(r){return '<span class="pill r">'+r+"</span>";}).join("")+"</span>":'<span class="zero">aucune</span>')+'</td><td data-l="Étape"><span class="pill '+ST[x.statut][1]+'"><span class="dot"></span>'+ST[x.statut][0]+'</span></td><td class="num" data-l="Montant annuel HT">'+Mc(x.annuel)+"</td></tr>";}).join("")+"</tbody>":'<tbody><tr><td class="empty">Aucun contrat pour ce filtre.</td></tr></tbody>';
}

/* ---------- MODERNISATIONS ---------- */
function renderMod(){
  var p=prc(),m=modOK(p).sort(function(a,b){return b.score-a.score;});
  var old=p.slice().sort(function(a,b){return b.age-a.age;})[0];
  $("lede-m").innerHTML="Sur les appareils que SODEBAT entretient, <b>"+pl(m.length,"appareil")+"</b> ont une note de priorité de 60 ou plus : à proposer en modernisation, pour environ <b>"+M(sum(m,function(x){return x.estimation;}))+"</b>. Les quatre premiers ont 25 ans ou plus."+filt();
  $("kpis-m").innerHTML=kc({key:1,ico:"circle-arrow-up",l:"Modernisations à proposer",v:Mc(sum(m,function(x){return x.estimation;})),u:"FCFA",s:pl(m.length,"appareil")+", note de priorité 60 ou plus"})+
    kc({ico:"history",l:"Appareil le plus ancien",v:old?old.age:0,u:"ans",s:old?esc(old.client)+", mis en service en "+old.annee:""})+
    kc({ico:"triangle-alert",l:"Pannes sur 12 mois",v:sum(m,function(x){return x.pannes;}),u:"pannes",s:"sur ces "+pl(m.length,"appareil")+", "+pl(sum(m,function(x){return x.arret;}),"jour")+" d'arrêt"});
  chart("c-mod",{type:"bubble",data:{datasets:[{label:"À proposer",data:m.map(function(x){return {x:x.age,y:x.pannes,r:Math.max(5,Math.sqrt(x.estimation/1e6)*2.6),n:x.client};}),backgroundColor:"rgba(0,74,173,.55)",borderColor:"#004AAD"},{label:"À suivre",data:p.filter(function(x){return x.score<60;}).map(function(x){return {x:x.age,y:x.pannes,r:5,n:x.client};}),backgroundColor:"rgba(56,182,255,.35)",borderColor:"#38B6FF"}]},
    options:{animation:ANIM,responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.raw.n+" : "+c.raw.x+" ans, "+c.raw.y+" pannes";}}}},scales:{x:{title:{display:true,text:"Âge (ans)"},min:8,max:36,grid:{color:"#EEF1F5"}},y:{title:{display:true,text:"Pannes sur 12 mois"},beginAtZero:true,max:11,grid:{color:"#EEF1F5"},border:{display:false}}}}});
  $("mod-why").innerHTML=[["shield-alert","Sécurité des usagers","Les commandes à relais et les portes battantes d'avant 2005 ne répondent plus aux règles actuelles de sécurité des ascenseurs."],["package","Pièces introuvables",pl(m.filter(function(x){return x.obsolete;}).length,"appareil")+" ont des pièces qui ne se fabriquent plus : chaque panne peut immobiliser l'ascenseur plusieurs jours."],["trending-down","Coût des pannes",pl(sum(m,function(x){return x.arret;}),"jour")+" d'arrêt en 12 mois sur ces appareils, autant de plaintes de résidents et de visiteurs."],["file-check","Le bon moment",(function(){var n=m.filter(function(x){var c=find(D.contrats,"client",x.client);return c&&c.jours<=190;}).length;return n+" de ces "+pl(m.length,"immeuble")+" renouvellent leur contrat de maintenance d'ici six mois : la modernisation se propose avec le renouvellement.";})()]].map(function(r){return '<div class="mini-h">'+'<span class="ic">'+ic(r[0])+'</span><div><p class="t">'+r[1]+'</p><p class="s">'+r[2]+"</p></div></div>";}).join("");
  $("t-mod").innerHTML="<thead><tr><th>Immeuble et appareil</th><th class=\"r\">Âge</th><th>Technologie</th><th class=\"r\">Pannes 12 mois</th><th class=\"r\">Jours d'arrêt</th><th>Note de priorité</th><th class=\"r\">Estimation HT</th></tr></thead><tbody>"+p.slice().sort(function(a,b){return b.score-a.score;}).map(function(x){
    return '<tr data-mod="'+esc(x.client)+'"><td class="w" data-l="Immeuble">'+who(x.client,esc(x.appareil),"building-2")+'</td><td class="r" data-l="Âge">'+x.age+' ans</td><td class="w" data-l="Technologie">'+esc(x.techno)+(x.obsolete?' <span class="pill a">pièces rares</span>':"")+'</td><td class="r" data-l="Pannes 12 mois">'+x.pannes+'</td><td class="r" data-l="Jours d\'arrêt">'+x.arret+'</td><td data-l="Note de priorité"><span class="prog"><span class="tr"><i class="'+(x.score>=80?"bad":"")+'" style="width:'+x.score+'%"></i></span><b>'+x.score+'</b></span></td><td class="num" data-l="Estimation HT">'+(x.estimation?Mc(x.estimation):'<span class="zero">non prioritaire</span>')+"</td></tr>";}).join("")+"</tbody>";
}

/* ---------- volets ---------- */
var lastMsg="";
function openDr(k,html){$("dr-k").innerHTML=k;$("dr-b").innerHTML=html;$("drawer").classList.add("on");$("scrim").classList.add("on");$("drawer").setAttribute("aria-hidden","false");}
function closeDr(){$("drawer").classList.remove("on");$("scrim").classList.remove("on");$("drawer").setAttribute("aria-hidden","true");}
function toast(t){var e=$("toast");e.textContent=t;e.classList.add("on");clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove("on");},2600);}
function msgBox(m,lab){lastMsg=m;return '<p class="lbl">'+(lab||"Message préparé")+'</p><div class="msg">'+esc(m)+'</div><div class="acts"><button class="btn pri" data-copy="1">'+ic("copy")+"Copier le message</button>";}
function find(arr,k,v){for(var i=0;i<arr.length;i++)if(arr[i][k]===v)return arr[i];return null;}
function drDem(x){var h=x.envoye?null:restant(x);
  var m=x.envoye?"Bonjour, je reviens vers vous au sujet de notre devis "+x.id+" ("+x.objet.charAt(0).toLowerCase()+x.objet.slice(1)+"), envoyé le "+ds(x.envoye)+". Avez-vous pu le consulter ? Je peux passer vous le présenter sur place si cela vous aide.":"Bonjour, nous avons bien reçu votre demande de devis ("+x.objet.charAt(0).toLowerCase()+x.objet.slice(1)+"). Votre devis vous sera remis avant "+(dobj(addD(x.recu,1)).getDay()===0?"lundi":JRS[dobj(addD(x.recu,1)).getDay()])+" "+hm(x.recu)+". Pour être précis, pouvez-vous nous indiquer le nombre de niveaux et l'année de mise en service de l'appareil ?";
  openDr(ic("timer")+x.id,'<div class="tags">'+stp(x.statut)+'<span class="pill n">'+esc(x.source)+"</span></div><h3>"+esc(x.client)+'</h3><p class="why">'+esc(x.objet)+'</p><dl class="props"><dt>Reçue</dt><dd>'+longD(x.recu)+" à "+hm(x.recu)+"</dd><dt>"+(x.envoye?"Envoyé":"Reste")+"</dt><dd>"+(x.envoye?longD(x.envoye)+" à "+hm(x.envoye)+", soit "+hrs(x.heures):hrs(h)+" pour tenir les 24 h")+"</dd><dt>Commercial</dt><dd>"+cn(x.com)+"</dd><dt>Montant HT</dt><dd>"+M(x.montant)+"</dd><dt>Type de client</dt><dd>"+esc(x.seg)+"</dd></dl>"+(x.envoye?"":'<p class="lbl">Pour remettre le devis à temps</p><ul><li>Relevé technique : niveaux, charge, année de l\'appareil.</li><li>Prix des pièces à confirmer avec le stock.</li><li>Validation du prix par le responsable si remise.</li></ul>')+msgBox(m,x.envoye?"Message de suivi":"Accusé de réception à envoyer tout de suite")+"</div>");}
function drAff(a){var n=nextRel(a),k=days(n,T);
  var m=requal(a)?"Bonjour, je me permets de vous appeler au sujet du devis "+a.id+". Le projet est-il toujours d'actualité, ou a-t-il été reporté ? Si le budget bloque, nous pouvons étaler les travaux ou commencer par la partie la plus urgente.":a.relances===0?"Bonjour, avez-vous bien reçu notre devis "+a.id+" ("+a.objet.charAt(0).toLowerCase()+a.objet.slice(1)+") ? Je reste disponible pour répondre à vos questions ou organiser une visite avec notre technicien.":"Bonjour, je reviens vers vous pour le devis "+a.id+" ("+a.objet.charAt(0).toLowerCase()+a.objet.slice(1)+"). Où en est votre décision ? Si un point vous retient (délai, prix, choix de l'appareil), dites-le moi et nous l'ajustons.";
  openDr(ic("briefcase")+a.id,'<div class="tags">'+(requal(a)?'<span class="pill r"><span class="dot"></span>À requalifier</span>':stp(a.statut))+'<span class="pill n">'+D.gammes[a.gamme]+"</span></div><h3>"+esc(a.client)+'</h3><p class="why">'+esc(a.objet)+'</p><dl class="props"><dt>Devis envoyé</dt><dd>'+longD(a.envoye)+"</dd><dt>Dernier contact</dt><dd>"+longD(a.dern)+"</dd><dt>Relances</dt><dd>"+a.relances+" sur 3</dd><dt>Prochaine</dt><dd>"+(requal(a)?"appel du responsable":longD(n)+(k>0?" ("+pl(k,"jour")+" de retard)":""))+"</dd><dt>Commercial</dt><dd>"+cn(a.com)+"</dd><dt>Montant HT</dt><dd>"+M(a.montant)+"</dd></dl>"+msgBox(m,requal(a)?"Trame de l'appel":"Relance à envoyer")+'<button class="btn" data-done="Relance notée pour '+esc(a.client)+'">'+ic("check")+"Noter la relance comme faite</button></div>");}
function drAo(a){var k=days(T,a.remise),m=manq(a);
  var msg="Bonjour, pour l'appel d'offres « "+a.objet+" » ("+a.acheteur+"), à rendre le "+shortD(a.remise)+", il manque encore : "+(m.length?m.map(function(x){return x[0].toLowerCase();}).join(", "):"aucune pièce")+". Pouvez-vous me dire quand ces pièces seront prêtes ?";
  openDr(ic("landmark")+"Appel d'offres",'<div class="tags"><span class="pill '+(a.type==="Public"?"b":"n")+'">'+a.type+'</span><span class="pill '+(k<=7?"r":"a")+'">'+pl(k,"jour")+" restants</span></div><h3>"+esc(a.acheteur)+'</h3><p class="why">'+esc(a.objet)+'</p><dl class="props"><dt>Remise</dt><dd>'+longD(a.remise)+"</dd><dt>Montant estimé</dt><dd>"+M(a.montant)+"</dd><dt>Caution</dt><dd>"+(a.caution?M(a.caution):"non demandée")+"</dd><dt>Responsable</dt><dd>"+cn(a.com)+"</dd><dt>Opportunité</dt><dd>"+a.go+" sur 100</dd></dl>"+'<p class="lbl">Pièces du dossier</p><ul class="ck">'+a.pieces.map(function(p){return '<li class="'+(p[1]?"ok":"no")+'">'+ic(p[1]?"check":"x")+esc(p[0])+"</li>";}).join("")+"</ul>"+msgBox(msg,"Message à l'équipe")+"</div>");}
function drCt(c){var p=find(D.parc,"client",c.client);
  var msg="Bonjour, votre contrat de maintenance SODEBAT pour vos "+pl(c.appareils,"appareil")+" arrive à échéance le "+dd(c.echeance)+". Nous souhaitons vous présenter le bilan de l'année et notre proposition de renouvellement"+(p&&p.score>=60?", avec une option de modernisation de l'"+p.appareil.charAt(0).toLowerCase()+p.appareil.slice(1):"")+". Quel jour vous conviendrait pour une rencontre ?";
  openDr(ic("refresh-cw")+"Contrat de maintenance",'<div class="tags">'+(c.risque.length?c.risque.map(function(r){return '<span class="pill r">'+r+"</span>";}).join(""):'<span class="pill g">Sans alerte</span>')+"</div><h3>"+esc(c.client)+'</h3><p class="why">'+esc(c.seg)+", "+pl(c.appareils,"appareil")+' entretenus</p><dl class="props"><dt>Échéance</dt><dd>'+longD(c.echeance)+" (dans "+pl(c.jours,"jour")+")</dd><dt>Montant annuel</dt><dd>"+M(c.annuel)+" HT</dd><dt>Pannes 12 mois</dt><dd>"+c.pannes+"</dd><dt>Paiement</dt><dd>"+(c.retard?c.retard+" jours de retard":"à jour")+"</dd><dt>Commercial</dt><dd>"+cn(c.com)+"</dd></dl>"+msgBox(msg,"Demande de rendez-vous de renouvellement")+"</div>");}
function drMod(x){var c=find(D.contrats,"client",x.client);
  var msg="Bonjour, votre "+x.appareil.charAt(0).toLowerCase()+x.appareil.slice(1)+", en service depuis "+x.annee+", a connu "+pl(x.pannes,"panne")+" et "+pl(x.arret,"jour")+" d'arrêt sur les 12 derniers mois"+(x.obsolete?", et certaines de ses pièces ne se fabriquent plus":"")+". Une modernisation réduirait ces arrêts et remettrait l'appareil aux règles de sécurité actuelles. Pouvons-nous organiser une visite technique gratuite pour vous chiffrer les options ?";
  openDr(ic("circle-arrow-up")+"Modernisation",'<div class="tags"><span class="pill '+(x.score>=80?"r":x.score>=60?"a":"n")+'">Priorité '+x.score+"/100</span></div><h3>"+esc(x.client)+'</h3><p class="why">'+esc(x.appareil)+", "+esc(x.techno.charAt(0).toLowerCase()+x.techno.slice(1))+'</p><dl class="props"><dt>Mise en service</dt><dd>'+x.annee+" ("+x.age+" ans)</dd><dt>Pannes 12 mois</dt><dd>"+x.pannes+"</dd><dt>Jours d'arrêt</dt><dd>"+x.arret+"</dd><dt>Estimation</dt><dd>"+(x.estimation?M(x.estimation)+" HT":"non prioritaire")+"</dd>"+(c?"<dt>Contrat</dt><dd>échéance le "+dd(c.echeance)+"</dd>":"")+"</dl>"+msgBox(msg,"Proposition de visite")+"</div>");}

/* ---------- rendu ---------- */
function badges(){var p=pend(D.demandes).filter(function(x){return restant(x)<8;}).length,r=D.affaires.filter(relDue).length,c=ren90(D.contrats).filter(function(x){return x.risque.length;}).length;
  $("k-jour").textContent=r||"";$("k-dev").textContent=pend(D.demandes).length||"";$("k-aff").textContent=D.affaires.length;$("k-ao").textContent=aoOpen(D.ao).length;$("k-ren").textContent=c||"";$("k-mod").textContent=modOK(D.parc).length;
  $("m-jour").textContent=r||"";$("m-dev").textContent=p||"";$("m-ren").textContent=c||"";}
function render(){menus();
  ({jour:renderJour,devis:renderDev,affaires:renderAff,ao:renderAo,renouv:renderRen,modern:renderMod})[state.v]();
  [].forEach.call(document.querySelectorAll("i[data-i]"),function(e){e.outerHTML=ic(e.getAttribute("data-i"));});}

document.addEventListener("click",function(e){var t=e.target.closest("button,tr,.li,[data-goto]");
  if(!e.target.closest(".sel"))closeMenus();
  if(!t)return;var a;
  if(t.id==="seg-b"){$("com-m").classList.remove("on");$("seg-m").classList.toggle("on");return;}
  if(t.id==="com-b"){$("seg-m").classList.remove("on");$("com-m").classList.toggle("on");return;}
  if((a=t.getAttribute("data-seg"))){state.seg=a;closeMenus();render();return;}
  if((a=t.getAttribute("data-com"))){state.com=a;closeMenus();render();return;}
  if(t.getAttribute("data-clear")){state.seg="Tous";state.com="Tous";render();return;}
  if((a=t.getAttribute("data-setcom"))){state.com=state.com===a?"Tous":a;render();return;}
  if((a=t.getAttribute("data-v"))){go(a);return;}
  if((a=t.getAttribute("data-goto"))){go(a);return;}
  if((a=t.getAttribute("data-fd"))){state.fd=a;render();return;}
  if((a=t.getAttribute("data-fa"))){state.fa=a;render();return;}
  if((a=t.getAttribute("data-fr"))){state.fr=a;render();return;}
  if(t.getAttribute("data-copy")){(navigator.clipboard?navigator.clipboard.writeText(lastMsg):Promise.reject()).then(function(){toast("Message copié. Collez-le dans WhatsApp ou dans un e-mail.");},function(){toast("Sélectionnez le texte pour le copier.");});return;}
  if((a=t.getAttribute("data-done"))){toast(a);closeDr();return;}
  if(t.id==="dr-x"){closeDr();return;}
  if((a=t.getAttribute("data-dem"))){drDem(find(D.demandes,"id",a));return;}
  if((a=t.getAttribute("data-aff"))){drAff(find(D.affaires,"id",a));return;}
  if((a=t.getAttribute("data-ao"))){drAo(find(D.ao,"id",a));return;}
  if((a=t.getAttribute("data-ct"))){drCt(find(D.contrats,"client",a));return;}
  if((a=t.getAttribute("data-mod"))){drMod(find(D.parc,"client",a));return;}
});
$("scrim").addEventListener("click",closeDr);
document.addEventListener("keydown",function(e){if(e.key==="Escape"){closeDr();closeMenus();}});
$("q-dev").addEventListener("input",function(e){state.qd=e.target.value;renderDev();});
$("q-aff").addEventListener("input",function(e){state.qa=e.target.value;renderAff();});
window.addEventListener("hashchange",function(){go(location.hash.slice(1),true);});
$("date").textContent=longD(T)+", 8 h";
badges();go(location.hash.slice(1)||"jour",true);
window.__K=function(){var dm=D.demandes,r=rep(dm);return {taux24:Math.round(100*s24(dm).length/r.length),delai:Math.round(10*sum(r,function(x){return x.heures;})/r.length)/10,pipe:sum(D.affaires,function(x){return x.montant;}),pond:sum(D.affaires,function(x){return x.montant*x.proba/100;}),ao:aoOpen(D.ao).length,aoM:sum(aoOpen(D.ao),function(a){return a.montant;}),ren:sum(ren90(D.contrats),function(x){return x.annuel;}),renN:ren90(D.contrats).length,mod:sum(modOK(D.parc),function(x){return x.estimation;}),modN:modOK(D.parc).length};};
})();
