/* Local, deterministic image assignment. No visual AI or product fact inference. */
(function(root){
'use strict';
const roles={auto:'自动分配',model:'上身 / 模特图',product:'商品主图',detail:'材质 / 细节图'};
const garmentSlots=['model','product','product2','product3','product4','look2','polaroid1','polaroid2','detail1','detail2','detail3'];
const targets={paper:['product'],lookbook:['model','look2'],street:['model','product','product2','product3','product4','polaroid1'],collage:['model','product','polaroid1','polaroid2','product2','detail1','detail2','detail3'],editorial:['model','product'],split:['model','product'],full:['model','product']};
function suggest(name){const s=String(name);if(/材质|面料|细节|领口|袖口|纽扣|纹理|fabric|texture|detail/i.test(s))return'detail';if(/上身|模特|穿搭|试穿|人像|真人|model|try.?on|look|outfit/i.test(s))return'model';if(/主图|商品|白底|挂拍|平铺|单品|product|flat.?lay|packshot/i.test(s))return'product';return'auto';}
function short(value,max=30){const chars=Array.from(String(value).trim());return chars.length>max?chars.slice(0,max-1).join('')+'…':chars.join('');}
function plan(layout,assets){
 const list=assets.filter(a=>a&&typeof a.src==='string'&&a.src&&Object.hasOwn(roles,a.role)),groups={model:[],product:[],detail:[],auto:[]};for(const a of list)groups[a.role].push(a);
 const slots={};const put=(key,a)=>{if(a)slots[key]=a.id;};
 put('model',groups.model[0]);put('look2',groups.model[1]);put('polaroid1',groups.model[1]);put('polaroid2',groups.model[2]);
 ['product','product2','product3','product4'].forEach((k,i)=>put(k,groups.product[i]));['detail1','detail2','detail3'].forEach((k,i)=>put(k,groups.detail[i]));
 const order=targets[layout]||targets.collage;const free=[...groups.auto];for(const k of [...order,...garmentSlots])if(!slots[k]&&free.length)put(k,free.shift());
 // Missing roles reuse an uploaded source. Old demo photos are never mixed in.
 if(!slots.product)put('product',list.find(a=>a.id!==slots.model)||list[0]);
 const hero=slots.model?'model':'product';const main=slots[hero]||slots.product;
 if(!slots.look2)slots.look2=slots.polaroid1||main;
 if(!slots.polaroid1)slots.polaroid1=slots.look2||main;
 if(!slots.polaroid2)slots.polaroid2=slots.polaroid1||main;
 const details=groups.detail.map(a=>a.id);for(let i=1;i<=3;i++)if(!slots['detail'+i])slots['detail'+i]=details[(i-1)%Math.max(1,details.length)]||slots.product||main;
 for(const k of Object.keys(slots))if(!slots[k])delete slots[k];
 const visible=layout==='paper'?['product']:layout==='lookbook'?[hero,'look2']:layout==='street'?[hero,'product','product2','product3','product4','polaroid1']:layout==='collage'?[hero,'product','product2','polaroid1','polaroid2','detail1','detail2','detail3']:[hero,'product'];
 const used=[...new Set(visible.map(k=>slots[k]).filter(Boolean))];
 return{slots,hero,visible,used,remaining:list.length-used.length,inset:!!slots.product,showPolaroids:list.length>1};
}
function copy(layout,name,facts,brand,year){
 const product=String(name).trim().slice(0,120),title=short(product,30),lines=String(facts).split(/\n|[;；]/).map(s=>s.trim()).filter(Boolean).slice(0,4),subtitle=lines.join(' · ').slice(0,90);
 const common={product,headline:title,subtitle:subtitle||[brand,year].filter(Boolean).join(' · '),features:lines.join('\n'),productCaption:short(product,44),product2Caption:short(product,22)+'\n单品展示 02',product3Caption:short(product,22)+'\n单品展示 03',product4Caption:short(product,22)+'\n单品展示 04'};
 if(layout==='paper')return{product,collectionTitle:title,collectionSubtitle:[brand,year,'PRODUCT EDIT'].filter(Boolean).join(' · ').slice(0,80),tagLeft:'Design',tagRight:'Details',paperTape:lines[0]?.slice(0,60)||'PRODUCT EDIT'};
 if(layout==='lookbook')return{product,collectionTitle:short(brand||'Everyday Collection',40),collectionSubtitle:short(product,50),scriptTitle:'Lookbook',footerScript:'STYLE EDIT',lookbookFooter:subtitle||[brand,year,'COLLECTION'].filter(Boolean).join(' / ')};
 if(layout==='street')return{...common,streetLabel:'Style Notes'};
 if(layout==='collage')return{...common,note:'本期单品\n'+short(product,18),scriptTitle:'Style Notes',caption1:'单品展示',caption2:'更多视角',detailText1:lines[0]||'细节展示 01\n局部放大',detailText2:lines[1]||'细节展示 02\n局部放大',detailText3:lines[2]||'细节展示 03\n局部放大',swatches:'',swatchLabel:'',footerScript:'Everyday Edit',footerNote:'本期单品 · '+short(product,18)};
 return common;
}
const api={roles,garmentSlots,suggest,short,plan,copy};if(typeof module==='object'&&module.exports)module.exports=api;else root.CoverBatchLayout=api;
})(typeof window==='object'?window:this);
