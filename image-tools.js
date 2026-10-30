/* Pure colour matting fallback. AI segmentation and brush editing are separate tools. */
(function(root){
'use strict';
function removeConnectedBackground(data,width,height,tolerance=30){
 const out=new Uint8ClampedArray(data),border=[];
 for(let x=0;x<width;x+=Math.max(1,Math.floor(width/30))){for(const y of [0,height-1]){const i=(y*width+x)*4;if(data[i+3])border.push([data[i],data[i+1],data[i+2]])}}
 for(let y=0;y<height;y+=Math.max(1,Math.floor(height/30))){for(const x of [0,width-1]){const i=(y*width+x)*4;if(data[i+3])border.push([data[i],data[i+1],data[i+2]])}}
 if(!border.length)return {data:out,removed:0};
 const median=channel=>border.map(p=>p[channel]).sort((a,b)=>a-b)[Math.floor(border.length/2)];
 const bg=[median(0),median(1),median(2)],limit=Math.max(8,Math.min(100,tolerance))*2.15;
 const mask=new Uint8Array(width*height),queue=new Int32Array(width*height);let head=0,tail=0;
 function push(p){if(mask[p])return;const i=p*4;if(!data[i+3]||Math.hypot(data[i]-bg[0],data[i+1]-bg[1],data[i+2]-bg[2])<=limit){mask[p]=1;queue[tail++]=p}}
 for(let x=0;x<width;x++){push(x);push((height-1)*width+x)}for(let y=1;y<height-1;y++){push(y*width);push(y*width+width-1)}
 while(head<tail){const p=queue[head++],x=p%width,y=(p/width)|0;if(x)push(p-1);if(x<width-1)push(p+1);if(y)push(p-width);if(y<height-1)push(p+width)}
 let removed=0;for(let p=0;p<mask.length;p++){if(mask[p]){if(out[p*4+3])removed++;out[p*4+3]=0;}}
 return {data:out,removed};
}
function cleanAlpha(data,width,height){
 const out=new Uint8ClampedArray(data),labels=new Int32Array(width*height),queue=new Int32Array(width*height),sizes=[0];let largest=0,id=0;
 for(let start=0;start<labels.length;start++){if(labels[start]||data[start*4+3]<12)continue;id++;let head=0,tail=0;labels[start]=id;queue[tail++]=start;
 while(head<tail){const p=queue[head++],x=p%width,y=(p/width)|0;for(const n of [x?p-1:-1,x<width-1?p+1:-1,y?p-width:-1,y<height-1?p+width:-1])if(n>=0&&!labels[n]&&data[n*4+3]>=12){labels[n]=id;queue[tail++]=n}}
 sizes[id]=tail;largest=Math.max(largest,tail);}
 const minimum=Math.max(20,largest*.003);for(let p=0;p<labels.length;p++)if(!labels[p]||sizes[labels[p]]<minimum)out[p*4+3]=0;
 return out;
}
const api={removeConnectedBackground,cleanAlpha};if(typeof module==='object'&&module.exports)module.exports=api;else root.CoverImageTools=api;
})(typeof window==='object'?window:this);
