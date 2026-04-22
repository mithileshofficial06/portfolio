"use client";
import{useState,useEffect,useRef,useCallback,useMemo}from"react";
import{gsap,ScrollTrigger}from"@/lib/gsap";
import{allSkills,skillCategories,catColors,iconUrls,BannerSkill}from"@/data/skills";

interface Star{x:number;y:number;r:number;a:number;sp:number;ph:number}

const PLANE_W=120,ROPE_L=60,CARD_W=80,CARD_H=68,CARD_GAP=18,THREAD_SAG=12,SPEED=1.2;

/* ═══════════════════════════════════════════════════════════════════
   RIPPLE — each card sways more the further it is from the plane
   ═══════════════════════════════════════════════════════════════════ */
function cardRippleY(idx:number,total:number,time:number):number{
  const t=(idx+1)/Math.max(total,1); // 0→1, far = more sway
  const amp=4+t*t*16;
  return Math.sin(t*3*Math.PI+time*0.003)*amp+Math.sin(t*5*Math.PI+time*0.005)*amp*0.25;
}

const PLANE_IMG_SRC = "/images/plane.svg";
const PLANE_DRAW_W = 140; // render width on canvas
const PLANE_DRAW_H = 70;  // render height on canvas

function roundRect(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);
  c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);
  c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();
}

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function Skills(){
  const sectionRef=useRef<HTMLElement>(null);
  const headerRef=useRef<HTMLDivElement>(null);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const[activeCat,setActiveCat]=useState("All");
  const[loaded,setLoaded]=useState(false);
  const catRef=useRef("All");
  const rafRef=useRef(0);
  const visRef=useRef(true);
  const sceneXRef=useRef(0);
  const iconsRef=useRef<Record<string,HTMLImageElement|null>>({});
  const planeImgRef=useRef<HTMLImageElement|null>(null);
  const starsRef=useRef<Star[]>([]);
  const mouseRef=useRef({x:-9999,y:-9999});

  useEffect(()=>{catRef.current=activeCat},[activeCat]);

  // Preload icons + plane image
  useEffect(()=>{
    const keys=new Set(allSkills.map(s=>s.iconKey).filter(k=>k!=="fallback"));
    let rem=keys.size+1; // +1 for plane image
    const done=()=>{if(--rem===0)setLoaded(true);};
    // Plane
    const pi=new Image();pi.src=PLANE_IMG_SRC;
    pi.onload=()=>{planeImgRef.current=pi;done();};
    pi.onerror=()=>done();
    // Skill icons
    keys.forEach(k=>{
      const url=iconUrls[k];if(!url){done();return;}
      const img=new Image();img.crossOrigin="anonymous";img.src=url;
      img.onload=()=>{iconsRef.current[k]=img;done();};
      img.onerror=()=>{iconsRef.current[k]=null;done();};
    });
  },[]);

  const initStars=useCallback((w:number,h:number)=>{
    const s:Star[]=[];
    for(let i=0;i<200;i++)s.push({x:Math.random()*w,y:Math.random()*h,r:0.4+Math.random()*1.2,a:0.1+Math.random()*0.35,sp:0.0008+Math.random()*0.002,ph:Math.random()*Math.PI*2});
    starsRef.current=s;
  },[]);

  useEffect(()=>{
    const ctx=gsap.context(()=>{
      gsap.fromTo(headerRef.current,{y:40,opacity:0},{y:0,opacity:1,duration:0.8,ease:"power3.out",
        scrollTrigger:{trigger:sectionRef.current,start:"top 70%",toggleActions:"play none none none"}});
    },sectionRef);return()=>ctx.revert();
  },[]);

  useEffect(()=>{
    if(!loaded)return;
    const canvas=canvasRef.current;if(!canvas)return;
    const resize=()=>{const w=canvas.parentElement!.clientWidth;const h=w<768?220:300;canvas.width=w;canvas.height=h;canvas.style.width=w+"px";canvas.style.height=h+"px";initStars(w,h);};
    resize();
    const ro=new ResizeObserver(resize);ro.observe(canvas.parentElement!);
    const io=new IntersectionObserver(([e])=>{visRef.current=e.isIntersecting},{threshold:0.05});io.observe(canvas);
    const onMM=(e:MouseEvent)=>{const r=canvas.getBoundingClientRect();mouseRef.current={x:e.clientX-r.left,y:e.clientY-r.top};};
    const onML=()=>{mouseRef.current={x:-9999,y:-9999};};
    canvas.addEventListener("mousemove",onMM);canvas.addEventListener("mouseleave",onML);

    sceneXRef.current=canvas.width+100;

    const render=(time:number)=>{
      if(!visRef.current){rafRef.current=requestAnimationFrame(render);return;}
      const ctx=canvas.getContext("2d");if(!ctx){rafRef.current=requestAnimationFrame(render);return;}
      const cw=canvas.width,ch=canvas.height;
      const mobile=cw<768;
      const planeY=mobile?90:120;
      const cardW=mobile?65:CARD_W;
      const cardH=mobile?55:CARD_H;
      const cardGap=mobile?12:CARD_GAP;
      const iconSz=mobile?22:30;
      const fontSize=mobile?8:10;
      const speed=mobile?0.9:SPEED;

      ctx.clearRect(0,0,cw,ch);

      // Stars
      for(const s of starsRef.current){
        const op=s.a+Math.sin(time*s.sp+s.ph)*0.12;
        ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${Math.max(0,op)})`;ctx.fill();
      }
      // Ground line
      const grd=ctx.createLinearGradient(0,0,cw,0);grd.addColorStop(0,"transparent");grd.addColorStop(0.1,"rgba(109,129,150,0.15)");grd.addColorStop(0.9,"rgba(109,129,150,0.15)");grd.addColorStop(1,"transparent");
      ctx.fillStyle=grd;ctx.fillRect(0,ch-1,cw,1);

      // Visible skills
      const vs:BannerSkill[]=catRef.current==="All"?allSkills:allSkills.filter(s=>s.category===catRef.current);
      const totalTrainW=PLANE_W+ROPE_L+vs.length*(cardW+cardGap)+200;

      sceneXRef.current-=speed;
      if(sceneXRef.current<-totalTrainW)sceneXRef.current=cw+100;
      const sx=sceneXRef.current;
      const pitch=Math.sin(time*0.0008)*0.02;
      const chainStartX=sx+PLANE_W+ROPE_L;
      const chainY=planeY+8;

      // ── Draw threads + cards ──
      let hovSkill:BannerSkill|null=null,hovX=0,hovY=0;

      // First thread: plane tail → first card
      const firstCardX=chainStartX;
      const firstRipple=cardRippleY(0,vs.length,time);
      const ropeSag=planeY+14+Math.sin(time*0.002)*3;
      ctx.beginPath();ctx.moveTo(sx+PLANE_W,planeY+2);
      ctx.quadraticCurveTo(sx+PLANE_W+ROPE_L/2,ropeSag,firstCardX,chainY+cardH/2+firstRipple);
      ctx.strokeStyle="rgba(200,190,170,0.6)";ctx.lineWidth=1.2;ctx.lineCap="round";ctx.stroke();

      for(let i=0;i<vs.length;i++){
        const sk=vs[i];
        const cx=chainStartX+i*(cardW+cardGap);
        const ripple=cardRippleY(i,vs.length,time);
        const cy=chainY+ripple;
        const cc=catColors[sk.category]||"#6D8196";

        // Thread to next card
        if(i<vs.length-1){
          const nextRipple=cardRippleY(i+1,vs.length,time);
          const nextX=chainStartX+(i+1)*(cardW+cardGap);
          const midX=(cx+cardW+nextX)/2;
          const midY=Math.max(cy+cardH/2,chainY+nextRipple+cardH/2)+THREAD_SAG+Math.sin(time*0.003+i)*3;
          ctx.beginPath();
          ctx.moveTo(cx+cardW,cy+cardH/2);
          ctx.quadraticCurveTo(midX,midY,nextX,chainY+nextRipple+cardH/2);
          ctx.strokeStyle="rgba(200,190,170,0.5)";ctx.lineWidth=1;ctx.stroke();

          // Thread knot at attachment points
          ctx.beginPath();ctx.arc(cx+cardW,cy+cardH/2,2,0,Math.PI*2);ctx.fillStyle="rgba(180,170,150,0.6)";ctx.fill();
          ctx.beginPath();ctx.arc(nextX,chainY+nextRipple+cardH/2,2,0,Math.PI*2);ctx.fill();
        }

        // Hit test
        if(Math.abs(mouseRef.current.x-cx-cardW/2)<cardW/2+5&&Math.abs(mouseRef.current.y-cy-cardH/2)<cardH/2+5){hovSkill=sk;hovX=cx+cardW/2;hovY=cy-10;}
        const isHov=hovSkill===sk;

        // ── Card background ──
        const s=isHov?1.08:1;
        ctx.save();
        if(isHov){ctx.translate(cx+cardW/2,cy+cardH/2);ctx.scale(s,s);ctx.translate(-cx-cardW/2,-cy-cardH/2);}
        roundRect(ctx,cx,cy,cardW,cardH,8);
        ctx.fillStyle="rgba(18,18,22,0.92)";ctx.fill();
        ctx.strokeStyle=isHov?cc:"rgba(109,129,150,0.2)";ctx.lineWidth=isHov?1.5:0.8;ctx.stroke();

        // Category color top accent bar
        roundRect(ctx,cx,cy,cardW,3,8);
        // Only top corners rounded — clip to card
        ctx.save();roundRect(ctx,cx,cy,cardW,cardH,8);ctx.clip();
        ctx.fillStyle=cc+(isHov?"55":"30");ctx.fillRect(cx,cy,cardW,3);
        ctx.restore();

        // Icon
        const img=sk.iconKey!=="fallback"?iconsRef.current[sk.iconKey]:null;
        const iSz=isHov?iconSz+4:iconSz;
        const iX=cx+cardW/2-iSz/2;
        const iY=cy+8;
        if(img){
          ctx.drawImage(img,iX,iY,iSz,iSz);
        }else{
          ctx.beginPath();ctx.arc(cx+cardW/2,iY+iSz/2,iSz/2-2,0,Math.PI*2);
          ctx.fillStyle=cc+"33";ctx.fill();ctx.strokeStyle=cc;ctx.lineWidth=1.2;ctx.stroke();
          ctx.font=`bold ${Math.floor(iSz*0.4)}px var(--font-jetbrains-mono),monospace`;
          ctx.fillStyle=cc;ctx.textAlign="center";ctx.textBaseline="middle";
          ctx.fillText(sk.name.slice(0,2),cx+cardW/2,iY+iSz/2);
        }

        // Label
        ctx.font=`bold ${fontSize}px var(--font-jetbrains-mono),monospace`;
        ctx.fillStyle=isHov?"#FFFFE3":"#CBCBCB";ctx.textAlign="center";ctx.textBaseline="top";
        ctx.fillText(sk.name,cx+cardW/2,cy+cardH-fontSize-6,cardW-8);

        ctx.restore();
      }

      // ── Plane (image) ──
      const pImg=planeImgRef.current;
      if(pImg){
        ctx.save();
        ctx.translate(sx+PLANE_DRAW_W/2,planeY);
        ctx.rotate(pitch);
        ctx.drawImage(pImg,-PLANE_DRAW_W/2,-PLANE_DRAW_H/2,PLANE_DRAW_W,PLANE_DRAW_H);
        ctx.restore();
      }

      // Engine trails
      for(let k=0;k<5;k++){
        const ox=PLANE_W+4+k*12;const r=3.5-k*0.6;const op=0.1-k*0.02;
        const jy=Math.sin(time*2.5+k*1.5)*1.5;
        ctx.beginPath();ctx.arc(sx+ox,planeY+10+jy,Math.max(0.3,r),0,Math.PI*2);
        ctx.fillStyle=`rgba(190,195,200,${Math.max(0,op)})`;ctx.fill();
      }

      // ── Tooltip ──
      if(hovSkill){
        canvas.style.cursor="pointer";
        const tw=130,th=40,ttx=hovX-tw/2,tty=hovY-th-8;
        const cc=catColors[hovSkill.category]||"#6D8196";
        ctx.fillStyle="rgba(10,10,15,0.92)";roundRect(ctx,ttx,tty,tw,th,6);ctx.fill();
        ctx.strokeStyle=cc;ctx.lineWidth=1;roundRect(ctx,ttx,tty,tw,th,6);ctx.stroke();
        ctx.textAlign="center";ctx.textBaseline="top";
        ctx.font=`bold 12px var(--font-jetbrains-mono),monospace`;ctx.fillStyle="#FFFFE3";ctx.fillText(hovSkill.name,hovX,tty+6);
        ctx.font="10px var(--font-inter),sans-serif";ctx.fillStyle=cc;ctx.fillText(hovSkill.category,hovX,tty+22);
      }else{canvas.style.cursor="default";}

      rafRef.current=requestAnimationFrame(render);
    };
    rafRef.current=requestAnimationFrame(render);
    return()=>{cancelAnimationFrame(rafRef.current);ro.disconnect();io.disconnect();canvas.removeEventListener("mousemove",onMM);canvas.removeEventListener("mouseleave",onML);};
  },[loaded,initStars]);

  return(
    <section ref={sectionRef} id="skills" style={{background:"#0a0a0f",padding:"80px 0 0"}}>
      <div ref={headerRef} style={{textAlign:"center",opacity:0,marginBottom:32,padding:"0 24px"}}>
        <p style={{fontFamily:"var(--font-jetbrains-mono),monospace",fontSize:11,color:"#6D8196",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:12}}>Expertise</p>
        <h2 style={{fontFamily:"var(--font-space-grotesk),sans-serif",fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:"#FFFFE3",margin:"0 0 12px"}}>Skills &amp; Technologies</h2>
        <p style={{fontFamily:"var(--font-inter),sans-serif",fontSize:16,color:"#CBCBCB",margin:"0 0 32px"}}>Advertising my stack since 2024.</p>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:10,marginBottom:0,padding:"0 24px"}}>
        {skillCategories.map(c=>{const a=activeCat===c;return(
          <button key={c} onClick={()=>setActiveCat(c)} style={{fontFamily:"var(--font-inter),sans-serif",fontSize:13,padding:"8px 20px",borderRadius:999,cursor:"pointer",transition:"all 0.25s",
            border:`1px solid ${a?"#6D8196":"rgba(109,129,150,0.25)"}`,background:a?"rgba(109,129,150,0.15)":"transparent",color:a?"#FFFFE3":"#CBCBCB"}}>{c}</button>
        );})}
      </div>
      <div style={{width:"100%",position:"relative"}}>
        {!loaded&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#6D8196",fontFamily:"var(--font-jetbrains-mono),monospace",fontSize:13,height:300}}>Loading skills...</div>}
        <canvas ref={canvasRef} style={{display:"block",width:"100%",height:300,opacity:loaded?1:0,transition:"opacity 0.5s"}}/>
      </div>
    </section>
  );
}
