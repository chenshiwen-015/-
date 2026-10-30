'use strict';
const $ = s => document.querySelector(s);
const canvas = $('#cover'), ctx = canvas.getContext('2d');
const defaults = {
  brand: 'AP｜洛哥', product: '24351X【莫尚】莫代尔多色圆领打底衫', url: '', details: '莫代尔面料 / 多色可选 / 纯色百搭',
  masthead: 'AP', season: 'WINTER\nCOLLECTION', year: '2026', scriptTitle: 'Soft Essentials', note: '柔软包裹\n把舒适穿在身上 ♥',
  headline: '莫代尔圆领衫', subtitle: '柔软亲肤 · 简约高级 · 日常百搭', features: '莫代尔亲肤\n舒适透气\n轻盈不压身\n一件百搭',
  caption1: '简约有质感\n日常百搭 ♥', caption2: '温柔的日常\n多一点柔软 ♥', productCaption: '莫代尔圆领打底衫\n24351X【莫尚】', product2Caption: '多色可选\n随心搭配',
  detailText1: '圆领设计\n简约利落\n日常好搭', detailText2: '柔软莫代尔\n亲肤细腻\n舒适自在', detailText3: '袖口细节\n利落线条\n自在穿着',
  footerScript: 'Everyday Outfit', footerNote: '把柔软，穿进每一个日常', eyebrow: 'SIMPLE\nBASIC\nFOR A BETTER YOU', swatchLabel: '多色可选',
  fontHeading: 'template', fontBody: 'template', fontScript: 'template', backgroundPreset: 'solid', backgroundWash: 0, collectionTitle: 'Everyday Collection', collectionSubtitle: '2026 Spring / Summer Edit', tagLeft: 'Soft', tagRight: 'Daily', paperTape: 'Soft Fabric · Everyday Comfort', streetLabel: 'Fashion style', product3Caption: '配饰名称\n颜色 / 价格可自填', product4Caption: '搭配单品\n品牌 / 款号可自填', lookbookFooter: 'STYLE NOTES / EVERYDAY WARDROBE', fontSize: 47, layout: 'collage', bg: '#eee6da', ink: '#392b23', accent: '#8b705a', swatches: '#644834,#aa937d,#c3b4a3,#a9a8a2,#666661,#171717',
  leftWidth: 60, polaroidSize: 285, polaroidTilt: 7, showPolaroids: true, hero: 'model', inset: true, ratio: 'portrait'
};
const themes = {
  paper: {name:'纸感单品企划',en:'PAPER PRODUCT',layout:'paper',bg:'#f4f1eb',ink:'#603f34',accent:'#bfa582'},
  street: {name:'街拍穿搭清单',en:'STREET STYLE',layout:'street',bg:'#f8f7f3',ink:'#242424',accent:'#8c725a'},
  lookbook: {name:'双人 Lookbook',en:'EDITORIAL DUO',layout:'lookbook',bg:'#f5f4f0',ink:'#211e1b',accent:'#870c18'},
  collage: { name: '参考图 · AP 杂志拼贴', en: 'YOUR REFERENCE', bg: '#eee6da', ink: '#392b23', accent: '#8b705a', layout: 'collage' },
  natural: { name: '自然叙事', en: 'NATURAL EDIT', bg: '#eeeade', ink: '#263e33', accent: '#849170', layout: 'editorial' },
  minimal: { name: '黑白刊物', en: 'MONO JOURNAL', bg: '#f3f1ec', ink: '#252525', accent: '#8c8c85', layout: 'split' },
  warm: { name: '暖调典藏', en: 'WARM ARCHIVE', bg: '#e8d7c4', ink: '#583b2c', accent: '#b2744f', layout: 'full' }
};
const slots = { model: '模特图', product: '商品图', reference: '参考图', polaroid1: '拍立得一', polaroid2: '拍立得二', product2: '商品二', detail1: '细节一', detail2: '细节二', detail3: '细节三', look2: 'Lookbook 人物二', product3: '商品三', product4: '商品四', background: '背景图' };
const initialSources = { model: 'assets/model.webp', product: 'assets/product.webp', reference: 'assets/reference.png', polaroid1: '', polaroid2: 'assets/angle.webp', product2: '', detail1: '', detail2: '', detail3: '', look2: '', product3: '', product4: '', background: '', backgroundCustom: '' };
const defaultCrops = { hero: { zoom: 1, x: 50, y: 50 }, product: { zoom: 1, x: 50, y: 50 }, product2: { zoom: 1, x: 50, y: 50 }, polaroid1: { zoom: 1.6, x: 50, y: 22 }, polaroid2: { zoom: 1.3, x: 50, y: 30 }, detail1: { zoom: 2.9, x: 50, y: 14 }, detail2: { zoom: 4, x: 50, y: 43 }, detail3: { zoom: 3.4, x: 77, y: 72 } };
for (const key of ['look2','product3','product4','background','reference']) defaultCrops[key] = {zoom:1,x:50,y:50,fit:key==='background'?'cover':'contain'};
const fontChoices = {template:{name:'跟随模板',family:''},sans:{name:'中文黑体 · 简洁现代',family:'"PingFang SC","Microsoft YaHei",sans-serif'},song:{name:'中文宋体 · 经典刊物',family:'"Songti SC",SimSun,STSong,serif'},kai:{name:'中文楷体 · 手写气质',family:'"Kaiti SC",KaiTi,STKaiti,serif'},didot:{name:'时尚衬线 · 英文杂志',family:'Didot,"Bodoni 72",Georgia,"Songti SC",serif'},serif:{name:'经典衬线 · Georgia',family:'Georgia,"Songti SC",serif'},hand:{name:'优雅手写 · 英文装饰',family:'"Snell Roundhand","Apple Chancery",cursive'}};
function fontFamily(role, fallback='serif'){return fontChoices[state['font'+role[0].toUpperCase()+role.slice(1)]]?.family || fallback;}
const clone = x => JSON.parse(JSON.stringify(x));
let state = { ...defaults }, sources = { ...initialSources }, crops = clone(defaultCrops), images = {}, revision = 0, loading = false;
let cropTarget = 'hero';
const templateModel=CoverTemplateModel;
let templateDrafts={};
const batchModel=CoverBatchLayout;let batchAssets=[],batchUndo=null,batchBusy=false;
let processedSources = {}, processedImages = {}, processedBounds = {}, assetVersions = {}, aiBusy = false;
const backgroundPresets = {street:{name:'时尚街区',src:'assets/backgrounds/street.jpg'},indoor:{name:'温馨室内',src:'assets/backgrounds/indoor.jpg'},outdoor:{name:'户外庭院',src:'assets/backgrounds/outdoor.jpg'}};
let photoRegions = [], dragState = null;
const transform = CoverImageTransform;
for (const key of Object.keys(defaultCrops)) defaultCrops[key] = transform.normalize(defaultCrops[key]);
crops = clone(defaultCrops);
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => $('#toast').classList.remove('show'), 3200); }
function cropName(key) { return key === 'hero' ? '主视觉（' + slots[state.hero] + '）' : slots[key]; }
function syncCrops() {
  const c = crops[cropTarget] = transform.normalize(crops[cropTarget]);
  $('#cropTarget').value = cropTarget;
  $('#cropTarget').options[0].textContent = cropName('hero');
  $('#cropZoom').value = c.zoom; $('#cropX').value = c.offsetX; $('#cropY').value = c.offsetY; $('#cropFit').value = c.fit; $('#cropOpacity').value=c.opacity; $('#opacityValue').textContent=Math.round(c.opacity*100)+'%';
  $('#cropZoomValue').textContent = Math.round(c.zoom * 100) + '%';
  $('#cropXValue').textContent = (c.offsetX > 0 ? '+' : '') + Math.round(c.offsetX) + '%';
  $('#cropYValue').textContent = (c.offsetY > 0 ? '+' : '') + Math.round(c.offsetY) + '%';
  $('#cropCurrent').textContent = cropName(cropTarget);
  if(!aiBusy)$('#cutoutStatus').textContent=processedSources[cropTarget]?'当前图位已编辑，可继续修边或恢复原图。':'AI 模型首次下载较慢；纯色抠除和手动修边可直接使用。';
  const preview=imageFor(cropTarget);
  $('#aiCutout').disabled=loading||aiBusy||!preview;for(const id of ['colorCutout','manualCutout','downloadCutout'])$('#'+id).disabled=loading||!preview;$('#restoreImage').disabled=!processedSources[cropTarget];
  $('#editingPreview').src=preview?.src||'';$('#editingPreview').hidden=!preview;$('#editingPreview').style.opacity=c.opacity;
  const fallback = !images[cropTarget] && cropTarget !== 'hero' && imageFor(cropTarget);
  $('#cropHelp').textContent = (cropTarget==='reference'?'参考图仅用于对照，不参与封面导出。':'') + (fallback ? '当前图位借用' + (cropTarget.startsWith('detail') ? '商品图' : '主视觉') + '，调整参数单独保存。' : '每个图位独立保存调整参数。') + '可拖动预览中的图片；水平正值向右、垂直正值向下，0 为原位。超出画框的部分会被裁切。';
}
function sync() {
  renderTemplateForm();syncTemplateControls();syncBackgroundControls();
  document.querySelectorAll('[data-key]').forEach(el => { if (el.type === 'checkbox') el.checked = state[el.dataset.key]; else el.value = state[el.dataset.key]; });
  document.querySelectorAll('[data-style]').forEach(el => el.classList.toggle('selected', themes[el.dataset.style].layout === state.layout));
  $('#fontValue').textContent = state.fontSize + ' px'; $('#widthValue').textContent = state.leftWidth + '%'; syncCrops();renderBatch();
  for(const [id,role] of [['headingSample','heading'],['bodySample','body'],['scriptSample','script']]) $('#'+id).style.fontFamily=fontFamily(role,role==='script'?'cursive':'serif');
  document.querySelectorAll('[data-background]').forEach(b=>b.classList.toggle('selected',b.dataset.background===state.backgroundPreset));
}
function textLines(text, maxWidth, font, maxLines = 4) {
  ctx.font = font;
  let lines = [];
  for (const paragraph of String(text).split('\n')) {
    let current = '';
    for (const char of paragraph) {
      if (current && ctx.measureText(current + char).width > maxWidth) { lines.push(current); current = char; } else current += char;
    }
    lines.push(current);
  }
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines); let last = lines.at(-1);
    while (last && ctx.measureText(last + '…').width > maxWidth) last = last.slice(0, -1);
    lines[lines.length - 1] = last + '…';
  }
  return lines;
}
function text(value, x, y, width, size, options = {}) {
  const { color = state.ink, maxLines = 4, align = 'left', family = '"PingFang SC","Microsoft YaHei",sans-serif', weight = 'normal', lineHeight = 1.35 } = options;
  const resolved = fontFamily(options.role || (size>=32?'heading':'body'), family);
  const font = `${weight} ${size}px ${resolved}`, lines = textLines(value, width, font, maxLines);
  ctx.save(); ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  lines.forEach((line, index) => ctx.fillText(line, align === 'center' ? x + width / 2 : align === 'right' ? x + width : x, y + index * size * lineHeight)); ctx.restore();
  return lines.length * size * lineHeight;
}
function rule(x, y, width, color = state.accent) { ctx.save(); ctx.fillStyle = color; ctx.fillRect(x, y, width, 1); ctx.restore(); }
function rawImageFor(key) {
  if(key==='hero')return images[state.hero];
  if(key.startsWith('polaroid'))return images[key]||images[state.hero];
  if(key.startsWith('detail'))return images[key]||images.product;
  if(key==='look2')return images.look2||images.polaroid2||images[state.hero];
  return images[key];
}
function imageFor(key){return processedImages[key]||rawImageFor(key);}
function photo(key, x, y, width, height, { contain = false, radius = 0 } = {}) {
  const im = imageFor(key), crop = crops[key] || defaultCrops.hero;
  photoRegions.push({ key, x, y, width, height, matrix: ctx.getTransform() });
  ctx.save(); ctx.beginPath(); if (radius) ctx.roundRect(x, y, width, height, radius); else ctx.rect(x, y, width, height); ctx.clip();
  if (im) {
    ctx.globalAlpha = crop.opacity ?? 1;
    const b=processedBounds[key]||{x:0,y:0,width:im.width,height:im.height};
    const r = transform.rectangle(b.width, b.height, width, height, crop, processedBounds[key]?true:contain);
    ctx.drawImage(im,b.x,b.y,b.width,b.height,x+r.x,y+r.y,r.width,r.height);
  } else {
    ctx.fillStyle = '#d8cbbc'; ctx.fillRect(x, y, width, height);
    text('＋', x, y + height / 2 - 3, width, Math.min(30, width / 5), { align: 'center', color: '#836b55' });
    text('上传' + (slots[key] || '主视觉'), x + 6, y + height / 2 + 25, width - 12, Math.min(18, width / 9), { align: 'center', maxLines: 1, color: '#836b55' });
  }
  ctx.restore();
}
function paper(x, y, width, height, fill, roughness = 4) {
  ctx.save(); ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(x, y + roughness);
  for (let dx = 0; dx <= width; dx += 8) ctx.lineTo(x + dx, y + Math.sin(dx * .63) * roughness + Math.cos(dx * .19) * roughness * .4);
  ctx.lineTo(x + width, y + height); ctx.lineTo(x, y + height); ctx.closePath(); ctx.fill(); ctx.restore();
}
function script(value, x, y, width, size, color = state.accent, rotation = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rotation);
  let fontSize = size; const family = fontFamily('script','"Snell Roundhand","Apple Chancery","URW Chancery L",cursive');
  ctx.font=`italic ${fontSize}px ${family}`;
  while (fontSize > 16 && ctx.measureText(value).width > width) { ctx.font = `italic ${--fontSize}px ${family}`; }
  text(value, 0, 0, width, fontSize, { family, color, weight: 'italic', maxLines: 1, role:'script' }); ctx.restore();
}
function icon(kind, x, y, radius) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = state.ink; ctx.lineWidth = 1.7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  if (kind === 0) { ctx.ellipse(0, 0, 13, 16, -.7, 0, Math.PI * 2); ctx.moveTo(-15, 10); ctx.lineTo(16, -14); ctx.moveTo(-15, 17); ctx.lineTo(14, -7); ctx.moveTo(-10, -11); ctx.lineTo(12, 9); ctx.moveTo(-15, -4); ctx.lineTo(9, 16); }
  if (kind === 1) { for (let i = -10; i <= 10; i += 10) { ctx.moveTo(i, -15); ctx.bezierCurveTo(i - 8, -8, i + 8, -4, i, 3); } ctx.moveTo(-17, 12); ctx.quadraticCurveTo(-9, 4, -1, 12); ctx.quadraticCurveTo(7, 20, 16, 12); ctx.moveTo(-17, 20); ctx.lineTo(16, 20); }
  if (kind === 2) { ctx.moveTo(-13, 14); ctx.quadraticCurveTo(-21, -13, 15, -18); ctx.quadraticCurveTo(19, 7, -13, 14); ctx.moveTo(-18, 20); ctx.lineTo(9, -9); ctx.moveTo(-7, 7); ctx.lineTo(-8, -5); }
  if (kind === 3) { ctx.moveTo(-9, -15); ctx.lineTo(-22, -6); ctx.lineTo(-16, 4); ctx.lineTo(-10, 0); ctx.lineTo(-10, 19); ctx.lineTo(10, 19); ctx.lineTo(10, 0); ctx.lineTo(16, 4); ctx.lineTo(22, -6); ctx.lineTo(9, -15); ctx.quadraticCurveTo(0, -5, -9, -15); }
  ctx.stroke(); ctx.restore();
}
function polaroid(key, x, y, width, caption, tilt) {
  const height = width * 1.27;
  ctx.save(); ctx.translate(x + width / 2, y + height / 2); ctx.rotate(tilt * Math.PI / 180);
  ctx.shadowColor = '#1f160f3a'; ctx.shadowBlur = 13; ctx.shadowOffsetY = 5; ctx.fillStyle = '#f8f2e8'; ctx.fillRect(-width / 2, -height / 2, width, height); ctx.shadowColor = 'transparent';
  photo(key, -width / 2 + 15, -height / 2 + 15, width - 30, width - 20);
  text(caption, -width / 2 + 20, height / 2 - 48, width - 40, 21, { family: '"Kaiti SC",KaiTi,STKaiti,serif', maxLines: 2, lineHeight: 1.4 });
  if (key === 'polaroid1') { ctx.fillStyle = '#d5cabc8a'; ctx.fillRect(-43, -height / 2 - 11, 86, 24); }
  ctx.restore();
}
function drawCollage(H) {
  ctx.save(); ctx.scale(1, H / 1440);
  const left = 1080 * state.leftWidth / 100, rx = left + 28, rw = 1080 - rx - 28;
  if(!hasBackdrop()){ctx.fillStyle = state.bg; ctx.fillRect(0, 0, left + 15, 1440);} photo('hero', 0, 0, left + 15, 1440);
  const shade = ctx.createLinearGradient(0, 0, left, 0); shade.addColorStop(0, '#2d201d9c'); shade.addColorStop(.5, '#2d201d12'); shade.addColorStop(1, '#00000000'); ctx.fillStyle = shade; ctx.fillRect(0, 0, left + 15, 1440);
  let mastSize = Math.min(274, left * .44); while (mastSize > 45 && ctx.measureText(state.masthead).width > left - 40) { ctx.font = `${--mastSize}px Didot,Georgia,serif`; }
  text(state.masthead, 28, 200, left - 40, mastSize, { family: 'Didot,"Bodoni 72",Georgia,serif', color: '#fbf5e9', maxLines: 1 });
  text(`${state.year} ${state.season}`, 31, 239, 300, 18, { family: 'Georgia,serif', color: '#f5ecdd', lineHeight: 1.5, maxLines: 3 });
  script(state.scriptTitle, 31, 352, left - 120, 63, '#d4b89b', -.08);
  text(state.note, 34, 433, Math.min(295, left * .47), 25, { family: '"Kaiti SC",KaiTi,STKaiti,serif', color: '#fff7ec', maxLines: 3, lineHeight: 1.4 });
  if (state.showPolaroids) {
    polaroid('polaroid1', 27, 535, state.polaroidSize, state.caption1, -state.polaroidTilt);
    polaroid('polaroid2', 40, 895, state.polaroidSize, state.caption2, state.polaroidTilt * .8);
  }
  text(state.eyebrow, 31, 1336, left - 70, 17, { color: '#fff6e8', family: 'Georgia,serif', lineHeight: 1.6, maxLines: 3 });
  const pg = ctx.createLinearGradient(left, 0, 1080, 900); pg.addColorStop(0, state.bg); pg.addColorStop(1, state.bg);
  paper(left, 49, 1080 - left, 1391, pg, 5);
  text(state.brand, rx, 109, rw, 28, { family: 'Georgia,"Songti SC",serif', weight: 'bold', maxLines: 1 });
  text(state.product, rx, 143, rw, 16, { maxLines: 2, lineHeight: 1.3 }); rule(rx, 179, rw, '#9b8978');
  // The title has its own fixed region; auto-fit keeps long product names clear of the banner.
  let fs = state.fontSize;
  while (fs > 22 && textLines(state.headline, rw, `${fs}px serif`, 10).length * fs * 1.16 > 96) fs--;
  text(state.headline, rx, 225, rw, fs, { family: '"Songti SC",STSong,serif', weight: 'bold', lineHeight: 1.16, maxLines: 2 });
  paper(rx - 3, 291, rw + 6, 59, state.accent, 3);
  text(state.subtitle, rx + 12, 319, rw - 24, 20, { color: '#fff6e9', align: 'center', maxLines: 2, lineHeight: 1.1 });
  const features = state.features.split('\n').filter(Boolean).slice(0, 4);
  features.forEach((label, i) => { const width = rw / Math.max(features.length, 1), cx = rx + width * (i + .5); icon(i, cx, 399, Math.min(31, width * .34)); text(label, cx - width / 2 + 3, 453, width - 6, 16, { align: 'center', maxLines: 2, lineHeight: 1.25 }); });
  rule(rx, 490, rw, '#b9a998');
  if (images.product2) {
    const gap = 18, pw = (rw - gap) / 2;
    photo('product', rx, 512, pw, 220, { contain: true }); photo('product2', rx + pw + gap, 512, pw, 220, { contain: true });
    text(state.productCaption, rx, 755, pw, 16, { align: 'center', maxLines: 2 }); text(state.product2Caption, rx + pw + gap, 755, pw, 16, { align: 'center', maxLines: 2 });
  } else {
    photo('product', rx + 38, 512, rw - 76, 220, { contain: true });
    text(state.productCaption, rx + 12, 755, rw - 24, 18, { align: 'center', maxLines: 2 });
  }
  const colors = state.swatches.split(/[,，\s]+/).filter(v => /^#[0-9a-f]{6}$/i.test(v)).slice(0, 7);
  const dotSpace = Math.min(37, (rw - 114) / Math.max(colors.length, 1));
  colors.forEach((color, i) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(rx + 14 + i * dotSpace, 813, 13, 0, Math.PI * 2); ctx.fill(); });
  text(state.swatchLabel, rx + rw - 108, 820, 108, 22, { family: '"Songti SC",serif', maxLines: 1, align: 'right' });
  if (state.inset) {
    text('DETAILS / 细节放大', rx, 879, rw, 23, { family: 'Georgia,"Songti SC",serif', maxLines: 1 }); rule(rx, 895, rw, '#b9a998');
    [1, 2, 3].forEach((n, i) => {
      const y = 921 + i * 122, pw = rw * .52;
      photo('detail' + n, rx + 8, y, pw, 111, { radius: 5 });
      const copy = state['detailText' + n].split('\n');
      text(copy[0] || '', rx + pw + 28, y + 29, rw - pw - 30, 20, { family: '"Songti SC",serif', maxLines: 2 });
      text(copy.slice(1).join('\n'), rx + pw + 28, y + 67, rw - pw - 30, 16, { maxLines: 2, lineHeight: 1.4 });
    });
  }
  script(state.footerScript, rx + 3, 1346, rw - 8, 55, state.accent, -.08);
  text(state.footerNote, rx + 5, 1390, rw - 10, 19, { family: '"Kaiti SC",KaiTi,STKaiti,serif', align: 'center', maxLines: 2 });
  ctx.restore();
}
function drawOther(H) {
  const full = state.layout === 'full', split = state.layout === 'split';
  const rect = full ? [0, 0, 1080, H] : split ? [470, 165, 555, H - 310] : [50, 155, 980, H - 650];
  photo('hero', ...rect);
  if (full) { const g = ctx.createLinearGradient(0, H * .35, 0, H); g.addColorStop(0, '#00000000'); g.addColorStop(1, '#000000c9'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, H); }
  const ink = full ? '#fff8eb' : state.ink;
  text(state.brand, 55, 70, 850, 30, { color: ink }); text(state.year, 930, 70, 95, 24, { color: ink, align: 'right' }); rule(55, 115, 970);
  const ty = full ? H - 360 : split ? 280 : H - 435, width = split ? 365 : 940;
  const used = text(state.headline, 55, ty, width, state.fontSize * 1.6, { color: ink, maxLines: split ? 4 : 2 });
  text(state.subtitle, 55, ty + used + 20, width, 25, { color: ink, maxLines: 2 });
  state.features.split('\n').filter(Boolean).slice(0, 4).forEach((v, i) => text(v, split ? 55 : 55 + i * 245, split ? H - 400 + i * 45 : H - 160, split ? 350 : 220, 23, { color: ink, maxLines: 1 }));
  if (state.inset && images.product) photo('product', split ? 55 : 825, split ? H - 300 : rect[1] + rect[3] - 225, 200, 200, { contain: true });
  rule(55, H - 104, 970); text(state.product, 55, H - 60, 950, 21, { color: ink, maxLines: 1 });
}
function draw() {
  const H = state.ratio === 'tall' ? 1620 : 1440; canvas.height = H; photoRegions = [];
  ctx.fillStyle = state.bg; ctx.fillRect(0, 0, 1080, H); paintBackground(H);
  if(state.layout==='paper')drawPaper(H);else if(state.layout==='street')drawStreet(H);else if(state.layout==='lookbook')drawLookbook(H);else if (state.layout === 'collage') drawCollage(H); else drawOther(H);
  $('#dimensions').textContent = `1080 × ${H} px`; $('#fontValue').textContent = state.fontSize + ' px'; $('#widthValue').textContent = state.leftWidth + '%';
  $('#templateName').textContent = Object.values(themes).find(t => t.layout === state.layout)?.name || '自定义封面';
  $('#state').textContent = loading ? '正在载入图片…' : '预览已更新';
  drawSelection();
  if($('#refImage')){$('#refImage').src=processedSources.reference||sources.reference||'';$('#refImage').style.opacity=crops.reference?.opacity??1;}
}
async function decode(src) { const im = new Image(); await new Promise((resolve, reject) => { im.onload = resolve; im.onerror = reject; im.src = src; }); return im; }
async function readFile(file) { return new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(file); }); }
async function loadImages() {
  const ticket = ++revision, loaded = {}; loading = true; $('#export').disabled = true; $('#state').textContent = '正在载入图片…';
  const failures = [];
  await Promise.all(Object.entries(sources).map(async ([k, src]) => { if (!src) return; try { loaded[k] = await decode(src); } catch { failures.push(slots[k]); } }));
  if (ticket !== revision) return; const edited={};await Promise.all(Object.entries(processedSources).map(async([k,src])=>{try{edited[k]=await decode(src)}catch{failures.push(cropName(k))}}));if(ticket!==revision)return;images = loaded;processedImages=edited;processedBounds={};for(const[k,im]of Object.entries(edited))processedBounds[k]=alphaBounds(im); loading = false; $('#export').disabled = false; uploads(); syncCrops(); draw(); refreshTemplateThumbnails();
  if (failures.length) toast('部分素材无法读取：' + failures.join('、'));
}
function uploads() {
  $('#uploads').replaceChildren(); $('#extraUploads').replaceChildren(); $('#unusedUploads').replaceChildren();
  const active=new Set(templateModel.activeAssets(state.layout,state)),context=templateModel.spec(state.layout);
  for (const [key, name] of Object.entries(slots)) {
    if(key==='background')continue;
    const box = document.createElement('div'); box.className = 'upload';
    const label = document.createElement('label'); label.style.margin = '0';
    if (sources[key] || imageFor(key==='model'?'hero':key)) { const im = document.createElement('img'); im.src = processedSources[key==='model'?'hero':key]||sources[key]||imageFor(key==='model'?'hero':key)?.src; im.alt = name; label.append(im); }
    else { const empty = document.createElement('div'); empty.className = 'empty'; empty.textContent = '＋'; label.append(empty); }
    const title = document.createElement('b'); title.textContent = context.assetLabels?.[key]||name; label.append(title);
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/png,image/jpeg,image/webp'; input.setAttribute('aria-label', '上传' + name);
    input.onchange = async () => {
      const file = input.files[0]; if (!file) return;
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 15 * 1024 * 1024) return toast('请选择 15 MB 以内的 JPG、PNG 或 WebP 图片');
      try { const src = await readFile(file); await decode(src); sources[key] = src; if (crops[key]) crops[key] = transform.normalize(); if (key === state.hero) crops.hero = transform.normalize(); invalidateEdited(key==='model'?'hero':key); syncCrops(); await loadImages(); toast(name + '已更新'); } catch { toast('图片无法读取，请更换文件'); }
    };
    label.append(input); box.append(label);
    if (sources[key]) { const remove = document.createElement('button'); remove.textContent = '移除'; remove.setAttribute('aria-label', '移除' + name); remove.onclick = () => { sources[key] = '';invalidateEdited(key==='model'?'hero':key); loadImages(); }; box.append(remove); }
    { const adjust = document.createElement('button'); adjust.className = 'adjust-button'; adjust.textContent = '抠图 · 调整'; adjust.setAttribute('aria-label', '调整' + name + '的位置和比例'); adjust.disabled = !sources[key] && !imageFor(key === 'model' ? 'hero' : key); adjust.onclick = () => { if (key === 'model') { state.hero = 'model'; sync(); } openCropEditor(key === 'model' ? 'hero' : key); }; box.append(adjust); }
    (!active.has(key)?$('#unusedUploads'):['model','product','reference'].includes(key)?$('#uploads'):$('#extraUploads')).append(box);
  }
  $('#extraAssets').hidden=!$('#extraUploads').children.length;$('#otherAssets').hidden=!$('#unusedUploads').children.length;
  $('#currentTemplateLabel').textContent=context.name+' · 上传此模板需要的图片；其它素材会保留。';
  $('#reference').classList.toggle('has-image', !!sources.reference); $('#refImage').src = sources.reference || '';renderBatch();
}
for (const [key, theme] of Object.entries(themes)) {
  const button = document.createElement('button'); button.dataset.style = key;
  const name = document.createElement('span'); name.textContent = theme.name; const en = document.createElement('small'); en.textContent = theme.en; const preview=document.createElement('img');preview.alt=theme.name+'版式预览';preview.dataset.preview=key;button.append(preview,name,en);
  button.onclick = () => switchTemplate(theme.layout,theme); $('#styles').append(button);
}
document.addEventListener('input',event=>{
 const el=event.target.closest('[data-key]');if(!el)return;const k=el.dataset.key;
 if(k==='layout'){switchTemplate(el.value);return;}
 if(k==='bg'){setSolidBackground(el.value);return;}
 state[k]=el.type==='checkbox'?el.checked:el.type==='range'?+el.value:el.value;
 document.querySelectorAll('[data-key="'+k+'"]').forEach(other=>{if(other!==el){if(other.type==='checkbox')other.checked=state[k];else other.value=state[k];}});
 if(k==='hero')invalidateEdited('hero');if(k.startsWith('font'))sync();if(k==='hero'){syncTemplateControls();uploads();}
 updateCopyOutputs();if(k==='product')renderBatch();draw();
});
document.querySelectorAll('[data-tab]').forEach(button => button.onclick = () => { document.querySelectorAll('.panel').forEach(p => p.hidden = p.id !== button.dataset.tab); document.querySelectorAll('[data-tab]').forEach(t => t.classList.toggle('active', t === button)); });
function openCropEditor(key, scroll = true) {
  const previousLayout=state.layout;
  cropTarget = crops[key] ? key : 'hero';
  if (['polaroid1','polaroid2','detail1','detail2','detail3','product2','product3','product4','look2'].includes(cropTarget)) {
    if(cropTarget==='look2')state.layout='lookbook';
    else if(cropTarget==='product3'||cropTarget==='product4')state.layout='street';
    else if(!['collage','street','lookbook','paper'].includes(state.layout))state.layout='collage';
    if(cropTarget.startsWith('detail')||cropTarget.startsWith('polaroid')){
      if(cropTarget.startsWith('detail')){state.inset=true;if(state.layout!=='collage')state.layout='collage';}
      if(cropTarget.startsWith('polaroid')){state.showPolaroids=true;if(state.layout!=='collage'&&state.layout!=='street')state.layout='collage';}
    }
  } else if(cropTarget==='background'&&sources.background&&['none','solid'].includes(state.backgroundPreset))state.backgroundPreset='custom';
  if(cropTarget==='hero'&&state.layout==='paper')state.layout='lookbook';
  if(cropTarget==='product'&&state.layout==='lookbook')state.layout='paper';
  if(cropTarget==='product2'&&['paper','lookbook'].includes(state.layout))state.layout='street';
  if(cropTarget==='polaroid2'&&state.layout==='street')state.layout='collage';
  if(state.layout!==previousLayout){const next=state.layout;state.layout=previousLayout;switchTemplate(next);}
  $('#cropEditor').hidden = false; canvas.classList.add('image-editing'); sync(); draw();
  if (scroll) $('#cropEditor').scrollIntoView({behavior: 'smooth', block: 'start'});
}
function drawSelection() {
  const overlay = $('#selectionOverlay'); overlay.width = canvas.width; overlay.height = canvas.height;
  if ($('#cropEditor').hidden) return;
  const region = photoRegions.find(r => r.key === cropTarget); if (!region) return;
  const c = overlay.getContext('2d'); c.setTransform(region.matrix); c.strokeStyle = '#c77230'; c.lineWidth = 4; c.setLineDash([13, 9]);
  c.strokeRect(region.x + 3, region.y + 3, region.width - 6, region.height - 6);
}
$('#editImages').onclick = () => openCropEditor(cropTarget);
$('#closeCrop').onclick = () => { $('#cropEditor').hidden = true; canvas.classList.remove('image-editing'); drawSelection(); };
$('#cropTarget').onchange = e => openCropEditor(e.target.value, false);
for (const [id, key] of [['cropZoom', 'zoom'], ['cropX', 'offsetX'], ['cropY', 'offsetY'], ['cropOpacity','opacity']]) {
  $('#' + id).oninput = e => { crops[cropTarget][key] = +e.target.value; syncCrops(); draw(); };
}
$('#cropFit').onchange = e => { crops[cropTarget].fit = e.target.value; syncCrops(); draw(); };
$('#resetCrop').onclick = () => { crops[cropTarget] = clone(defaultCrops[cropTarget]); syncCrops(); draw(); };
function pointInRegion(event, region) {
  const bounds = canvas.getBoundingClientRect();
  return region.matrix.inverse().transformPoint({x: (event.clientX - bounds.left) * canvas.width / bounds.width, y: (event.clientY - bounds.top) * canvas.height / bounds.height});
}
canvas.addEventListener('pointerdown', event => {
  if (event.button !== 0 || loading) return;
  const region = [...photoRegions].reverse().find(r => { const p = pointInRegion(event, r); return p.x >= r.x && p.x <= r.x + r.width && p.y >= r.y && p.y <= r.y + r.height; });
  if (!region || !imageFor(region.key)) return;
  event.preventDefault(); openCropEditor(region.key, false);
  dragState = {pointerId: event.pointerId, region, origin: pointInRegion(event, region), crop: {...crops[region.key]}};
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointermove', event => {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  const {region, origin, crop} = dragState, p = pointInRegion(event, region), c = crops[region.key];
  c.offsetX = Math.max(-100, Math.min(100, crop.offsetX + (p.x - origin.x) / region.width * 100));
  c.offsetY = Math.max(-100, Math.min(100, crop.offsetY + (p.y - origin.y) / region.height * 100)); syncCrops(); draw();
});
for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(name, () => { dragState = null; });
canvas.addEventListener('keydown', event => {
  if ($('#cropEditor').hidden || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
  event.preventDefault(); const c = crops[cropTarget], step = event.shiftKey ? 5 : 1;
  if (event.key === 'ArrowLeft') c.offsetX -= step; if (event.key === 'ArrowRight') c.offsetX += step;
  if (event.key === 'ArrowUp') c.offsetY -= step; if (event.key === 'ArrowDown') c.offsetY += step;
  crops[cropTarget] = transform.normalize(c); syncCrops(); draw();
});
function download(blob, name) { const link = document.createElement('a'), url = URL.createObjectURL(blob); link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 10000); }
$('#export').onclick = () => { if (loading) return toast('图片载入完成后即可导出'); try { draw(); canvas.toBlob(blob => { if (blob) { download(blob, `AP商品封面-${state.year}.png`); toast('PNG 已导出'); } else toast('导出失败，请重试'); }, 'image/png'); } catch { toast('导出失败，请重新上传图片后重试'); } };
$('#save').onclick = async () => {
  try {
    snapshotTemplate();
    const embedded = {},embedCache=new Map();
    const embed=async src=>{if(!src||src.startsWith('data:'))return src;if(embedCache.has(src))return embedCache.get(src);const response=await fetch(src);if(!response.ok)throw Error();const result=await readFile(await response.blob());embedCache.set(src,result);return result;};
    for(const [key,src]of Object.entries(sources))embedded[key]=await embed(src);
    const savedDrafts=clone(templateDrafts);for(const draft of Object.values(savedDrafts))draft.background.source=await embed(draft.background.source);
    const savedBatch=batchAssets.map(({src,...metadata})=>{const sourceKey=Object.keys(embedded).find(key=>embedded[key]===src);return sourceKey?{...metadata,sourceKey}:{...metadata,src};});
    download(new Blob([JSON.stringify({ version: 6, state, crops, images: embedded, processed:processedSources,templateDrafts:savedDrafts,batchAssets:savedBatch,batchFacts:$('#batchFacts').value })], { type: 'application/json' }), 'AP封面项目.json'); toast('项目已保存，包含图片、文案和裁切参数');
  } catch { toast('保存失败；使用静态服务器打开，或重新上传示例图片后再试'); }
};
$('#open').onchange = async e => {
  try {
    const file = e.target.files[0]; if (!file) return; if (file.size > 200 * 1024 * 1024) throw Error();
    const project = JSON.parse(await file.text()); if (![1, 2, 3, 4, 5, 6].includes(project.version) || !project.state || !project.images) throw Error();
    const next = { ...defaults };
    for (const key of Object.keys(defaults)) if (typeof project.state[key] === typeof defaults[key]) next[key] = typeof defaults[key] === 'string' ? project.state[key].slice(0, 2000) : project.state[key];
    for (const key of ['bg', 'ink', 'accent']) if (!/^#[0-9a-f]{6}$/i.test(next[key])) throw Error();
    if (!['collage', 'editorial', 'split', 'full','paper','street','lookbook'].includes(next.layout) || !['model', 'product'].includes(next.hero) || !['portrait', 'tall'].includes(next.ratio)) throw Error();
    for (const [key, min, max] of [['fontSize', 28, 80], ['leftWidth', 54, 64], ['polaroidSize', 210, 320], ['polaroidTilt', 0, 12]]) { if (!Number.isFinite(next[key])) throw Error(); next[key] = Math.max(min, Math.min(max, next[key])); }
    const nextSources = {};
    for (const key of [...Object.keys(slots),'backgroundCustom']) { const src = project.images[key] || ''; if (typeof src !== 'string' || src.length > 23 * 1024 * 1024 || (src && !/^data:image\/(png|jpeg|webp);base64,/.test(src))) throw Error(); if (src) await decode(src); nextSources[key] = src; }
    const nextCrops = clone(defaultCrops);
    for (const key of Object.keys(nextCrops)) nextCrops[key] = transform.normalize({...nextCrops[key], ...project.crops?.[key]});
    if (project.version === 1) nextCrops.hero = { zoom: Math.max(1, Math.min(5, +project.state.zoom || 1)), x: Math.max(0, Math.min(100, +project.state.panX || 50)), y: Math.max(0, Math.min(100, +project.state.panY || 50)) };
    const nextProcessed={};for(const key of Object.keys(nextCrops)){const src=project.processed?.[key];if(!src)continue;if(typeof src!=='string'||src.length>25*1024*1024||!/^data:image\/(png|jpeg|webp);base64,/.test(src))throw Error();await decode(src);nextProcessed[key]=src;}
    const nextBatch=restoreBatchAssets(project.batchAssets||[],nextSources,true);for(const asset of nextBatch)await decode(asset.src);
    state = next; sources = nextSources; crops = nextCrops;processedSources=nextProcessed;assetVersions={};batchAssets=nextBatch;batchUndo=null;$('#batchFacts').value=typeof project.batchFacts==='string'?project.batchFacts.slice(0,400):'';templateDrafts=templateModel.createBank(defaults,state,sources,project.templateDrafts);sync(); await loadImages(); toast('项目已打开');
  } catch { toast('项目文件无效，请选择本工具保存的 JSON 文件'); }
  e.target.value = '';
};
$('#reset').onclick=resetCurrentTemplate;
function alphaBounds(im){const c=workCanvas(im,1800),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let x0=c.width,y0=c.height,x1=0,y1=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>24){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}if(x0>x1||y0>y1)return {x:0,y:0,width:im.width,height:im.height};const pad=3;x0=Math.max(0,x0-pad);y0=Math.max(0,y0-pad);x1=Math.min(c.width-1,x1+pad);y1=Math.min(c.height-1,y1+pad);return {x:x0*im.width/c.width,y:y0*im.height/c.height,width:(x1-x0+1)*im.width/c.width,height:(y1-y0+1)*im.height/c.height};}
function hasBackdrop(){return !['none','solid'].includes(state.backgroundPreset)&&!!imageFor('background');}
function paintBackground(H, target=ctx){
 if(hasBackdrop())photo('background',0,0,1080,H);
 if(state.backgroundWash>0){ctx.save();ctx.globalAlpha=Math.min(.9,state.backgroundWash);ctx.fillStyle=state.bg;ctx.fillRect(0,0,1080,H);ctx.restore();}
}
function fittedText(value,x,y,width,size,options={}){
 const family=fontFamily(options.role||'heading',options.family||'Georgia,serif');ctx.font=`${options.weight||'normal'} ${size}px ${family}`;
 while(size>16&&ctx.measureText(value).width>width){size--;ctx.font=`${options.weight||'normal'} ${size}px ${family}`}
 text(value,x,y,width,size,{...options,family,role:options.role||'heading',maxLines:1});
}
function curvedArrow(x1,y1,x2,y2){ctx.save();ctx.strokeStyle=state.ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.quadraticCurveTo((x1+x2)/2,y1-65,x2,y2);ctx.lineTo(x2-7,y2-13);ctx.moveTo(x2,y2);ctx.lineTo(x2+12,y2-5);ctx.stroke();ctx.restore();}
function drawPaper(H){
 ctx.save();ctx.scale(1,H/1440);
 ctx.shadowColor='#3b30212b';ctx.shadowBlur=16;ctx.shadowOffsetX=10;ctx.shadowOffsetY=13;ctx.fillStyle='#fffdf8f2';ctx.fillRect(60,65,960,1310);ctx.shadowColor='transparent';
 // A deterministic paper weave, made from drawing primitives rather than a borrowed texture.
 ctx.save();ctx.strokeStyle='#7e6c4b08';ctx.lineWidth=1;for(let x=64;x<1015;x+=5){ctx.beginPath();ctx.moveTo(x,68);ctx.lineTo(x+Math.sin(x)*3,1372);ctx.stroke()}for(let y=70;y<1374;y+=7){ctx.beginPath();ctx.moveTo(62,y);ctx.lineTo(1018,y+1);ctx.stroke()}ctx.restore();
 for(let x=130;x<980;x+=75){ctx.fillStyle='#dedbd58c';ctx.beginPath();ctx.arc(x,104,12,0,Math.PI*2);ctx.fill()}
 fittedText(state.collectionTitle,125,280,830,55,{family:'Georgia,serif',weight:'italic',align:'center'});
 text(state.collectionSubtitle,150,330,780,20,{align:'center',maxLines:1});
 photo('product',270,470,550,535,{contain:true});
 text(state.tagLeft,130,605,210,31,{family:'Georgia,serif',align:'center',maxLines:1});curvedArrow(355,565,292,585);
 text(state.tagRight,785,565,175,31,{family:'Georgia,serif',align:'center',maxLines:1});curvedArrow(745,610,830,585);
 paper(310,1110,470,105,'#e5d5b5',5);fittedText(state.paperTape,340,1175,410,27,{family:'Georgia,serif',weight:'bold',align:'center'});
 text(state.product,180,1283,720,20,{align:'center',maxLines:2});ctx.restore();
}
function drawStreet(H){
 ctx.save();ctx.scale(1,H/1440);const left=665;
 photo('hero',0,0,left,1440);ctx.fillStyle='#fffefaed';ctx.fillRect(left,0,415,1440);
 ctx.save();ctx.translate(left-10,25);ctx.rotate(Math.PI/2);fittedText(state.streetLabel,0,0,650,62,{family:'Arial,sans-serif',weight:'bold',color:state.ink});ctx.restore();
 const available=['product','product2','product3','product4'].filter(key=>imageFor(key));const keys=available.length?available:['product'];keys.forEach((key,i)=>{
 const cell=1360/keys.length,height=Math.min(560,cell-125),y=45+i*cell+(cell-height-105)/2;photo(key,left+65,y,285,height,{contain:true});
 text(state[key==='product'?'productCaption':key+'Caption'],left+38,y+height+35,339,25,{align:'center',maxLines:3,lineHeight:1.32,weight:'normal'});
 });
 photo('polaroid1',400,875,300,560,{contain:true});
 text(state.brand,30,65,560,28,{color:'#fff7ee',maxLines:1,weight:'bold'});ctx.restore();
}
function drawLookbook(H){
 ctx.save();ctx.scale(1,H/1440);
 fittedText(state.collectionTitle,55,160,970,117,{family:'Didot,Georgia,serif',color:state.accent,weight:'italic',align:'center'});
 fittedText(state.collectionSubtitle,100,235,880,52,{family:'Georgia,serif',align:'center'});
 photo('hero',175,280,355,850,{contain:true});photo('look2',555,280,355,850,{contain:true});
 script(state.scriptTitle,820,1142,220,32,state.ink,-.15);
 fittedText(state.footerScript,65,1240,950,95,{family:'Didot,Georgia,serif',color:state.accent,weight:'italic',align:'center'});
 rule(50,1292,980,state.ink);text(state.lookbookFooter,90,1345,900,28,{family:'Georgia,serif',align:'center',maxLines:2});
 text(state.brand+' · '+state.year,150,1400,780,20,{align:'center',maxLines:1});ctx.restore();
}
function refreshTemplateThumbnails(){
 const previous=state,previousCrops=crops;crops=clone(defaultCrops);const small=document.createElement('canvas');small.width=180;small.height=240;
 try{for(const [key,theme]of Object.entries(themes)){
  state={...previous,layout:theme.layout,bg:theme.bg,ink:theme.ink,accent:theme.accent,ratio:'portrait',backgroundPreset:'none',backgroundWash:0,fontHeading:'template',fontBody:'template',fontScript:'template'};draw();small.getContext('2d').drawImage(canvas,0,0,180,240);const el=document.querySelector(`[data-preview="${key}"]`);if(el)el.src=small.toDataURL('image/jpeg',.8);
 }}finally{state=previous;crops=previousCrops;draw();}
}
function invalidateEdited(key){delete processedSources[key];delete processedImages[key];delete processedBounds[key];assetVersions[key]=(assetVersions[key]||0)+1;}
async function applyProcessed(key,url,ticket){
 const img=await decode(url);if(ticket!==undefined&&ticket!==(assetVersions[key]||0))return false;
 processedSources[key]=url;processedImages[key]=img;processedBounds[key]=alphaBounds(img);uploads();syncCrops();draw();return true;
}
function workCanvas(im,maxSide=1800){const c=document.createElement('canvas');const ratio=Math.min(1,maxSide/Math.max(im.width,im.height));c.width=Math.max(1,Math.round(im.width*ratio));c.height=Math.max(1,Math.round(im.height*ratio));c.getContext('2d').drawImage(im,0,0,c.width,c.height);return c;}
$('#colorCutout').onclick=async()=>{
 const key=cropTarget,im=rawImageFor(key),ticket=assetVersions[key]||0;if(!im)return toast('请先上传这张图片');
 try{const c=workCanvas(im),cx=c.getContext('2d'),frame=cx.getImageData(0,0,c.width,c.height);const result=CoverImageTools.removeConnectedBackground(frame.data,c.width,c.height,+$('#cutoutTolerance').value);
 if(result.removed<c.width*c.height*.002)return toast('未找到连续纯色背景，请使用 AI 或手动修边');
 frame.data.set(result.data);cx.putImageData(frame,0,0);if(await applyProcessed(key,c.toDataURL('image/png'),ticket))toast(cropName(key)+'已抠除相近背景');
 }catch{toast('图片处理失败，请重新上传后重试');}
};
let aiModule;
$('#aiCutout').onclick=async()=>{
 if(aiBusy)return;const key=cropTarget,im=rawImageFor(key),ticket=assetVersions[key]||0;if(!im)return toast('请先上传这张图片');
 aiBusy=true;$('#aiCutout').disabled=true;const status=$('#cutoutStatus');status.textContent='正在加载 AI 抠图模型，首次需要下载，图片在本机处理…';
 try{
  aiModule ||= import('https://esm.sh/@imgly/background-removal@1.7.0?bundle');
  const lib=await aiModule, c=workCanvas(im,1600),blob=await new Promise(ok=>c.toBlob(ok,'image/png'));
  const result=await lib.removeBackground(blob,{model:'isnet_fp16',device:'cpu',proxyToWorker:false,output:{format:'image/png',quality:1,type:'foreground'},progress:(name,current,total)=>{if(total)status.textContent='正在下载抠图资源 '+Math.min(100,Math.round(current/total*100))+'%'}});
  const resultImage=await decode(await readFile(result)),clean=workCanvas(resultImage,1800),cc=clean.getContext('2d'),frame=cc.getImageData(0,0,clean.width,clean.height);frame.data.set(CoverImageTools.cleanAlpha(frame.data,clean.width,clean.height));cc.putImageData(frame,0,0);
  if(await applyProcessed(key,clean.toDataURL('image/png'),ticket)){status.textContent=cropName(key)+'智能抠图完成，可继续手动修边。';toast('AI 抠图完成');}
 }catch(error){aiModule=null;status.textContent='AI 资源暂时未能加载。可使用纯色抠除或手动修边，原图已保留。';console.warn('Background removal:',String(error));toast('AI 抠图未完成，原图已保留');}
 finally{aiBusy=false;$('#aiCutout').disabled=false;}
};
$('#restoreImage').onclick=()=>{const key=cropTarget;invalidateEdited(key);uploads();syncCrops();draw();toast('当前图位已恢复原图');};
$('#downloadCutout').onclick=()=>{const im=imageFor(cropTarget);if(!im)return toast('请先上传图片');const c=workCanvas(im,4096);c.toBlob(b=>b&&download(b,cropName(cropTarget)+'.png'),'image/png');};
let maskKey,maskOriginal,brushDrawing=false,brushLast,brushUndo=[],maskTicket;
const maskCanvas=$('#maskCanvas'),mc=maskCanvas.getContext('2d');
$('#manualCutout').onclick=()=>{
 const im=imageFor(cropTarget),original=rawImageFor(cropTarget);if(!im||!original)return toast('请先上传这张图片');
 maskKey=cropTarget;maskTicket=assetVersions[maskKey]||0;maskOriginal=workCanvas(original,1600);maskCanvas.width=maskOriginal.width;maskCanvas.height=maskOriginal.height;mc.clearRect(0,0,maskCanvas.width,maskCanvas.height);mc.drawImage(im,0,0,maskCanvas.width,maskCanvas.height);brushUndo=[];$('#maskDialog').showModal();
};
function brushPoint(e){const b=maskCanvas.getBoundingClientRect();return {x:(e.clientX-b.left)*maskCanvas.width/b.width,y:(e.clientY-b.top)*maskCanvas.height/b.height};}
function brushStroke(p){
 const radius=+$('#brushSize').value*maskCanvas.width/maskCanvas.getBoundingClientRect().width/2;const last=brushLast||p,steps=Math.max(1,Math.ceil(Math.hypot(p.x-last.x,p.y-last.y)/Math.max(1,radius/3)));
 for(let i=1;i<=steps;i++){const x=last.x+(p.x-last.x)*i/steps,y=last.y+(p.y-last.y)*i/steps;mc.save();mc.beginPath();mc.arc(x,y,radius,0,Math.PI*2);if($('#brushMode').value==='restore'){mc.clip();mc.drawImage(maskOriginal,0,0);}else{mc.globalCompositeOperation='destination-out';mc.fill();}mc.restore();}brushLast=p;
}
maskCanvas.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();brushUndo.push(mc.getImageData(0,0,maskCanvas.width,maskCanvas.height));if(brushUndo.length>5)brushUndo.shift();brushDrawing=true;brushLast=brushPoint(e);maskCanvas.setPointerCapture(e.pointerId);brushStroke(brushLast);};
maskCanvas.onpointermove=e=>{if(brushDrawing)brushStroke(brushPoint(e));};
for(const event of ['pointerup','pointercancel','lostpointercapture'])maskCanvas.addEventListener(event,()=>{brushDrawing=false;brushLast=null;});
$('#undoBrush').onclick=()=>{const prev=brushUndo.pop();if(prev)mc.putImageData(prev,0,0);};
$('#cancelMask').onclick=()=>$('#maskDialog').close();
$('#applyMask').onclick=async()=>{if(await applyProcessed(maskKey,maskCanvas.toDataURL('image/png'),maskTicket)){toast('已应用当前图片的修边');$('#maskDialog').close();}};
for(const [key,preset]of Object.entries(backgroundPresets)){
 const b=document.createElement('button');b.dataset.background=key;const img=document.createElement('img');img.src=preset.src;img.alt=preset.name+'背景';const name=document.createElement('span');name.textContent=preset.name;b.append(img,name);
 b.onclick=async()=>{state.backgroundPreset=key;sources.background=preset.src;invalidateEdited('background');crops.background=transform.normalize({fit:'cover'});await loadImages();sync();};$('#backgroundLibrary').append(b);
}
$('#backgroundUpload').onchange=async e=>{
 const f=e.target.files[0];if(!f)return;if(!['image/png','image/jpeg','image/webp'].includes(f.type)||f.size>15*1024*1024)return toast('请选择 15 MB 以内的 JPG、PNG 或 WebP');
 try{const url=await readFile(f);await decode(url);sources.background=sources.backgroundCustom=url;state.backgroundPreset='custom';crops.background=transform.normalize({fit:'cover'});invalidateEdited('background');await loadImages();sync();toast('背景已替换，可继续调整位置与透明度');}catch{toast('背景图片无法读取');}e.target.value='';
};
$('#editBackground').onclick=()=>{if(!sources.background)return toast('请先选择或上传场景背景');openCropEditor('background');};
$('#removeBackground').onclick=()=>setSolidBackground(state.bg);
$('#downloadBackground').onclick=()=>{const c=document.createElement('canvas');c.width=1080;c.height=state.ratio==='tall'?1620:1440;const x=c.getContext('2d');x.fillStyle=state.bg;x.fillRect(0,0,c.width,c.height);if(hasBackdrop()){const im=imageFor('background'),r=transform.rectangle(im.width,im.height,c.width,c.height,crops.background);x.globalAlpha=crops.background.opacity;x.drawImage(im,r.x,r.y,r.width,r.height);x.globalAlpha=1;}if(state.backgroundWash>0){x.globalAlpha=state.backgroundWash;x.fillStyle=state.bg;x.fillRect(0,0,c.width,c.height);}c.toBlob(b=>b&&download(b,'封面背景.png'),'image/png');};
for(const color of ['#f4f1eb','#e6d9c6','#dccbc8','#a9b4a2','#343b36','#ffffff']){const b=document.createElement('button');b.style.backgroundColor=color;b.title=color;b.setAttribute('aria-label','纯色 '+color);b.onclick=()=>setSolidBackground(color);$('#solidColors').append(b);}
for(const select of document.querySelectorAll('.font-select'))for(const [key,font]of Object.entries(fontChoices)){const o=document.createElement('option');o.value=key;o.textContent=font.name;select.append(o);}

function updateCopyOutputs(){document.querySelectorAll('[data-copy-value]').forEach(el=>el.textContent=state[el.dataset.copyValue]+' px');}
function renderTemplateForm(){
 const host=$('#templateTextFields'),spec=templateModel.spec(state.layout);$('#textTitle').textContent=spec.name+' · 文案';
 if(host.dataset.layout!==state.layout){host.replaceChildren();host.dataset.layout=state.layout;
  for(const key of spec.keys){const desc=templateModel.fields[key],label=document.createElement('label'),title=document.createElement('span');title.className='copy-label';title.textContent=spec.labels?.[key]||desc.label;label.append(title);
   const input=document.createElement(desc.type==='textarea'?'textarea':'input');input.dataset.key=key;input.id='copy-'+key;if(desc.type==='range'){input.type='range';input.min=desc.min;input.max=desc.max;const value=document.createElement('output');value.dataset.copyValue=key;label.append(value);}else if(desc.max)input.maxLength=desc.max;
   input.value=state[key]??'';label.append(input);host.append(label);
  }
 }
 updateCopyOutputs();
}
function syncTemplateControls(){
 const allowed=new Set(['layout','bg','ink','accent','ratio',...templateModel.spec(state.layout).design]);
 document.querySelectorAll('#design [data-key]').forEach(input=>{input.closest('label').hidden=!allowed.has(input.dataset.key);});
}
function snapshotTemplate(){templateDrafts[state.layout]=templateModel.capture(state.layout,state,sources.background||'');}
function switchTemplate(layout,theme){
 const next=templateModel.prepareSwitch(state,sources,templateDrafts,layout,defaults);templateDrafts=next.bank;
 const preset=theme||Object.values(themes).find(t=>t.layout===layout);if(preset)Object.assign(state,{ink:preset.ink,accent:preset.accent});
 Object.assign(state,next.patch);const changed=sources.background!==next.source;sources.background=next.source;if(changed)invalidateEdited('background');
 sync();uploads();draw();if(changed)loadImages();
}
function resetCurrentTemplate(){
 const layout=state.layout,preset=Object.values(themes).find(t=>t.layout===layout);const fresh=templateModel.fresh(layout,defaults);
 templateDrafts[layout]=fresh;Object.assign(state,fresh.values,{backgroundPreset:'solid',backgroundWash:0,bg:fresh.background.color});if(preset)Object.assign(state,{ink:preset.ink,accent:preset.accent});
 sync();uploads();draw();toast('已重置当前模板文案与样式，其它模板及图片已保留');
}
function setSolidBackground(color){if(!/^#[0-9a-f]{6}$/i.test(color))return;state.bg=color;state.backgroundPreset='solid';state.backgroundWash=0;sync();draw();}
function syncBackgroundControls(){
 const photo=!['solid','none'].includes(state.backgroundPreset)&&!!sources.background;
 $('#backgroundStatus').textContent=photo?(state.backgroundPreset==='custom'?'当前：已上传的背景图':'当前：'+(backgroundPresets[state.backgroundPreset]?.name||'图片背景')):'当前：纯色背景（默认）';
 $('#backgroundHex').value=state.bg;$('#backgroundWashLabel').hidden=!photo;$('#editBackground').disabled=!photo;
 const custom=sources.backgroundCustom||(state.backgroundPreset==='custom'?sources.background:'');$('#uploadedBackgroundCard').hidden=!custom;$('#uploadedBackgroundPreview').src=custom||'';
 document.querySelectorAll('#solidColors button').forEach(b=>b.setAttribute('aria-pressed',String(!photo&&b.title.toLowerCase()===state.bg.toLowerCase())));
}
$('#backgroundHex').oninput=e=>{if(/^#[0-9a-f]{6}$/i.test(e.target.value))setSolidBackground(e.target.value);};
$('#backgroundHex').onchange=e=>{if(!/^#[0-9a-f]{6}$/i.test(e.target.value)){e.target.value=state.bg;toast('请输入 # 加六位颜色值，例如 #eee6da');}};
$('#useCustomBackground').onclick=async()=>{const src=sources.backgroundCustom||(state.backgroundPreset==='custom'?sources.background:'');if(!src)return toast('请先上传背景图片');if(sources.background!==src)invalidateEdited('background');sources.background=src;state.backgroundPreset='custom';await loadImages();sync();};

function restoreBatchAssets(raw,sourceMap={},strict=false){
 if(!Array.isArray(raw)||raw.length>16){if(strict)throw Error('batch');return[];}const out=[],ids=new Set();let bytes=0;
 for(const a of raw){const src=a?.sourceKey?sourceMap[a.sourceKey]:a?.src;const valid=a&&typeof a.id==='string'&&a.id.length<=80&&!ids.has(a.id)&&Object.hasOwn(batchModel.roles,a.role)&&typeof src==='string'&&src.length<=8*1024*1024&&/^data:image\/(png|jpeg|webp);base64,/.test(src);if(!valid){if(strict)throw Error('batch');continue;}bytes+=src.length;if(bytes>64*1024*1024){if(strict)throw Error('batch');break;}ids.add(a.id);out.push({id:a.id,name:String(a.name||'商品图片').slice(0,180),role:a.role,src});}return out;
}
function batchPlan(){return batchModel.plan(state.layout,batchAssets);}
async function trimBatchWhitespace(){
 const cache=new Map();let count=0;for(const key of ['hero','product','product2','product3','product4','look2','polaroid1','polaroid2']){
  const src=key==='hero'?sources[state.hero]:sources[key];if(!src)continue;const asset=batchAssets.find(a=>a.src===src);if(asset?.role==='detail')continue;
  if(!cache.has(src)){const im=await decode(src),original=workCanvas(im,1800),c=workCanvas(im,1800),cx=c.getContext('2d'),frame=cx.getImageData(0,0,c.width,c.height),edge=[];
   for(let i=0;i<24;i++){const x=Math.round(i*(c.width-1)/23),y=Math.round(i*(c.height-1)/23);for(const p of [x,(c.height-1)*c.width+x,y*c.width,y*c.width+c.width-1])edge.push(Array.from(frame.data.slice(p*4,p*4+4)));}
   const transparent=edge.filter(p=>p[3]<24).length/edge.length>.85,median=[0,1,2].map(ch=>edge.map(p=>p[ch]).sort((a,b)=>a-b)[Math.floor(edge.length/2)]),solid=edge.filter(p=>Math.hypot(p[0]-median[0],p[1]-median[1],p[2]-median[2])<38).length/edge.length>.9;
   const result=transparent?{data:frame.data,removed:c.width*c.height*.5}:solid?CoverImageTools.removeConnectedBackground(frame.data,c.width,c.height,22):{data:frame.data,removed:0},ratio=result.removed/(c.width*c.height);let trimmed='';
   if(ratio>=.15&&ratio<=.97){frame.data.set(result.data);cx.putImageData(frame,0,0);const b=alphaBounds(c),pad=Math.max(b.width,b.height)*.06,x=Math.max(0,Math.floor(b.x-pad)),y=Math.max(0,Math.floor(b.y-pad)),w=Math.min(original.width-x,Math.ceil(b.width+2*pad)),h=Math.min(original.height-y,Math.ceil(b.height+2*pad));
    if(w*h<original.width*original.height*.85&&w>original.width*.1&&h>original.height*.25){const out=document.createElement('canvas');out.width=w;out.height=h;out.getContext('2d').drawImage(original,x,y,w,h,0,0,w,h);trimmed=out.toDataURL('image/png');}
   }cache.set(src,trimmed);
  }
  const edited=cache.get(src);if(edited){processedSources[key]=edited;count++;}
 }return count;
}
function renderBatch(){
 const holder=$('#batchImages');if(!holder)return;const name=templateModel.spec(state.layout).name;$('#batchTemplateName').textContent=name;
 const plan=batchPlan(),signature=batchAssets.map(a=>a.id+':'+a.role).join('|');
 if(holder.dataset.signature!==signature){holder.replaceChildren();holder.dataset.signature=signature;
  batchAssets.forEach((asset,index)=>{const card=document.createElement('div');card.className='batch-image';const image=document.createElement('img');image.src=asset.src;image.alt='待排版图片 '+(index+1);const filename=document.createElement('span');filename.className='batch-filename';filename.textContent=asset.name;filename.title=asset.name;
   const select=document.createElement('select');select.setAttribute('aria-label','图片'+(index+1)+'的类型');select.dataset.batchId=asset.id;for(const[key,label]of Object.entries(batchModel.roles)){const option=document.createElement('option');option.value=key;option.textContent=label;select.append(option);}select.value=asset.role;select.onchange=()=>{asset.role=select.value;renderBatch();};
   const remove=document.createElement('button');remove.type='button';remove.className='batch-remove';remove.textContent='×';remove.setAttribute('aria-label','从待排版列表移除图片'+(index+1));remove.onclick=()=>{batchAssets=batchAssets.filter(a=>a.id!==asset.id);renderBatch();};const use=document.createElement('small');use.dataset.batchUse=asset.id;card.append(image,filename,select,use,remove);holder.append(card);
  });
 }
 for(const small of holder.querySelectorAll('[data-batch-use]'))small.textContent=plan.used.includes(small.dataset.batchUse)?'将用于当前模板':'保留，换模板可用';
 for(const input of holder.querySelectorAll('select,button'))input.disabled=batchBusy;
 $('#batchCount').textContent=batchAssets.length?batchAssets.length+' 张图片 · 可修改下方类型':'一次添加多张图片，先出一版再微调';
 $('#batchPlan').textContent=batchAssets.length?'「'+name+'」将使用 '+plan.used.length+' 张不同图片'+(plan.remaining?'，其余 '+plan.remaining+' 张保留在列表中。':'。')+'图位不足时会复用已上传图片。':'按文件名建议类型；未识别的图片按上传顺序分配。';
 $('#autoLayout').disabled=batchBusy||loading||!batchAssets.length||!state.product.trim();$('#undoAutoLayout').hidden=!batchUndo;$('#undoAutoLayout').disabled=batchBusy||loading;$('#batchUpload').disabled=batchBusy;$('#batchArea').setAttribute('aria-busy',String(batchBusy));
}
$('#batchUpload').onchange=async event=>{
 const files=Array.from(event.target.files||[]);event.target.value='';if(!files.length)return;batchBusy=true;renderBatch();let added=0,failed=0,limited=0;
 try{for(const file of files){if(batchAssets.length>=16){limited++;continue;}if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>15*1024*1024){failed++;continue;}
   $('#batchStatus').textContent='正在整理图片 '+(added+failed+1)+' / '+files.length+'…';try{const original=await readFile(file),im=await decode(original),c=workCanvas(im,2400),optimized=c.toDataURL('image/webp',.92),src=optimized.length<original.length?optimized:original;
    if(src.length>8*1024*1024||batchAssets.reduce((n,a)=>n+a.src.length,0)+src.length>64*1024*1024){failed++;continue;}
    batchAssets.push({id:'batch-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9),name:file.name,role:batchModel.suggest(file.name),src});added++;
   }catch{failed++;}
  }}finally{batchBusy=false;renderBatch();$('#batchStatus').textContent='已添加 '+added+' 张'+(failed?'，'+failed+' 张格式、大小或读取不符合要求':'')+(limited?'；最多保留 16 张，请移除部分图片后再添加':'')+'。确认类型后点击「按当前模板自动排版」。';}
};
$('#batchChooseTemplate').onclick=()=>document.querySelector('[data-tab="design"]').click();
$('#autoLayout').onclick=async()=>{
 if(batchBusy||loading)return;if(!batchAssets.length)return toast('请先批量添加图片');if(!state.product.trim())return toast('请填写商品名称');
 const plan=batchPlan();batchUndo={state:clone(state),sources:clone(sources),crops:clone(crops),processed:clone(processedSources),drafts:clone(templateDrafts)};batchBusy=true;renderBatch();$('#batchStatus').textContent='正在分配图片、适配比例和填入文案…';
 try{for(const key of batchModel.garmentSlots)sources[key]='';for(const[key,id]of Object.entries(plan.slots))sources[key]=batchAssets.find(a=>a.id===id)?.src||'';
  state.hero=plan.hero;state.showPolaroids=plan.showPolaroids;state.inset=plan.inset;
  if($('#batchCopy').checked){const generated=batchModel.copy(state.layout,state.product,$('#batchFacts').value,state.brand,state.year);const keys=new Set([...templateModel.spec(state.layout).keys,'swatches']);for(const[key,value]of Object.entries(generated))if(keys.has(key))state[key]=typeof value==='string'?value.slice(0,templateModel.fields[key]?.max||2000):value;}
  for(const key of ['hero',...batchModel.garmentSlots.filter(k=>k!=='model')]){invalidateEdited(key);crops[key]=transform.normalize({fit:key.startsWith('detail')?'cover':'contain'});}
  let trimmed=0;if($('#batchTrim').checked){$('#batchStatus').textContent='正在检查并裁紧纯色留白，原图会保留…';trimmed=await trimBatchWhitespace();}
  cropTarget='hero';$('#cropEditor').hidden=true;canvas.classList.remove('image-editing');snapshotTemplate();sync();await loadImages();$('#batchStatus').textContent='已按「'+templateModel.spec(state.layout).name+'」完成排版。'+(trimmed?'已裁紧 '+trimmed+' 个图位的外圈留白，可使用原图恢复。':'')+'点击预览中的图片可缩放、移动或抠图；文案可继续修改。';toast('自动排版完成，可继续微调');
 }catch{toast('排版未完成，可撤销后重试');$('#batchStatus').textContent='排版未完成，请撤销后重试。';}finally{batchBusy=false;renderBatch();}
};
$('#undoAutoLayout').onclick=async()=>{if(!batchUndo||batchBusy||loading)return;batchBusy=true;renderBatch();const previous=batchUndo;batchUndo=null;state=previous.state;sources=previous.sources;crops=previous.crops;processedSources=previous.processed;templateDrafts=previous.drafts;for(const k of Object.keys(defaultCrops))assetVersions[k]=(assetVersions[k]||0)+1;cropTarget='hero';sync();await loadImages();batchBusy=false;renderBatch();$('#batchStatus').textContent='已恢复自动排版前的素材、文案和调整参数。';toast('已撤销自动排版');};

// Preserve in-progress edits across a normal browser refresh within the same tab.
try { const cached = sessionStorage.getItem('cover-atelier-v2'); if (cached) { const data = JSON.parse(cached); state = { ...defaults, ...data.state }; sources = { ...initialSources, ...data.sources }; crops = { ...clone(defaultCrops), ...data.crops };processedSources=data.processed||{};templateDrafts=data.templateDrafts||{};batchAssets=restoreBatchAssets(data.batchAssets||[]);$('#batchFacts').value=typeof data.batchFacts==='string'?data.batchFacts.slice(0,400):'';if(!data.templateDrafts){state.backgroundPreset='solid';state.backgroundWash=0;} } } catch { /* Storage may be disabled or full. */ }
templateDrafts=templateModel.createBank(defaults,state,sources,templateDrafts);
window.addEventListener('pagehide', () => { try { snapshotTemplate();sessionStorage.setItem('cover-atelier-v2', JSON.stringify({ state, sources, crops,processed:processedSources,templateDrafts,batchAssets,batchFacts:$('#batchFacts').value })); } catch { /* Large image projects can still be saved as JSON. */ } });
for (const key of Object.keys(defaultCrops)) crops[key] = transform.normalize(crops[key] || defaultCrops[key]);
sync(); loadImages();
