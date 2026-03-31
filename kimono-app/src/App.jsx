import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

const SHOPS = [
  { id: 1, name: "たんす屋福岡店", nameEn: "Tansuya Fukuoka", category: "Recycle", city: "Fukuoka", status: "active", teaCeremony: "High", priceLevel: "Budget", details: "Japan's largest recycle chain. Men's kimono, haori, kaku-obi. Accessories from ¥100.", openDays: [1,2,3,4,5,6,0], openTime: "10:00", closeTime: "19:00", address: "中央区清川1-10-9", specialty: "Monthly treasure sales", lat: 33.5783, lng: 130.3985 },
  { id: 2, name: "和らく", nameEn: "Waraku", category: "Recycle", city: "Fukuoka", status: "active", teaCeremony: "High", priceLevel: "Budget", details: "Consignment recycle. Antique kimono from ¥1,575. Quarterly sales.", openDays: [1,2,3,4,5,6], openTime: "10:30", closeTime: "18:30", address: "中央区渡辺通1-1-1 サンセルコ1F", specialty: "Consignment; quarterly blowout sales", lat: 33.5845, lng: 130.4042 },
  { id: 3, name: "あやみ", nameEn: "Ayami", category: "Recycle/Bespoke", city: "Fukuoka", status: "active", teaCeremony: "Very High", priceLevel: "Budget–Mid", details: "Recycle + bespoke from bolt. Best for non-standard sizing.", openDays: [1,2,3,4,5,6], openTime: "10:00", closeTime: "18:00", address: "中央区渡辺通1-1-1 サンセルコ", specialty: "Custom tailoring; non-JP sizing", lat: 33.5846, lng: 130.4043 },
  { id: 4, name: "壱萬屋", nameEn: "Ichimanya", category: "Recycle", city: "Fukuoka", status: "active", teaCeremony: "Medium", priceLevel: "Budget", details: "40+ yrs expertise. Men's from ¥1,000. Fri–Sun only.", openDays: [5,6,0], openTime: "11:00", closeTime: "17:00", address: "Fukuoka city", specialty: "Open Fri–Sun only; lessons", lat: 33.5890, lng: 130.3780 },
  { id: 5, name: "OKANO", nameEn: "OKANO Hakata", category: "Weaver/New", city: "Fukuoka", status: "active", teaCeremony: "Very High", priceLevel: "High-end", details: "Premier Hakata-ori weaver est. 1897. Kaku-obi from ¥74,800.", openDays: [1,2,3,4,5,6,0], openTime: "10:00", closeTime: "20:00", address: "博多リバレイン", specialty: "Hakata-ori obi; est. 1897", lat: 33.5950, lng: 130.4097 },
  { id: 6, name: "きものやまと福岡", nameEn: "Kimono Yamato FK", category: "Chain/New", city: "Fukuoka", status: "active", teaCeremony: "High", priceLevel: "Mid–High", details: "Y.&SONS men's brand. Professional fitting, custom orders.", openDays: [1,2,3,4,5,6,0], openTime: "10:00", closeTime: "21:00", address: "ららぽーと福岡1F", specialty: "Y.&SONS men's brand", lat: 33.5720, lng: 130.4280 },
  { id: 7, name: "銀座いち利 天神", nameEn: "Ginza Ichiri", category: "Chain/Reuse", city: "Fukuoka", status: "active", teaCeremony: "Medium", priceLevel: "Mid-range", details: "National reuse chain. All items labeled with measurements.", openDays: [1,2,3,4,5,6,0], openTime: "10:30", closeTime: "19:00", address: "Tenjin area", specialty: "Measurement labels on all items", lat: 33.5902, lng: 130.3992 },
  { id: 8, name: "毛利呉服店", nameEn: "Mouri Gofukuten", category: "Traditional/New", city: "Fukuoka", status: "active", teaCeremony: "High", priceLevel: "Mid–High", details: "Est. 1943. Dedicated men's. Kondaya Genbei brand.", openDays: [1,2,3,4,5], openTime: "10:00", closeTime: "18:00", address: "南区向野2-11-1", specialty: "Kondaya Genbei; custom sizing", lat: 33.5630, lng: 130.4150 },
  { id: 9, name: "いちご堂", nameEn: "Ichigodo", category: "Recycle", city: "Fukuoka", status: "active", teaCeremony: "Medium", priceLevel: "Budget", details: "Recycle shop in Nishijin. Active Instagram.", openDays: [4,5,6,0], openTime: "11:00", closeTime: "17:00", address: "早良区西新4-7-10 2F", specialty: "Instagram-active; limited days", lat: 33.5850, lng: 130.3580 },
  { id: 10, name: "KIMONO-男子", nameEn: "KIMONO-Danshi", category: "Men's Specialist", city: "Kumamoto", status: "active", teaCeremony: "Very High", priceLevel: "Budget–Mid", details: "Only dedicated men's kimono shop in Kyushu. Recycle + bespoke.", openDays: [2,3,4,5,6], openTime: "11:00", closeTime: "18:00", address: "中央区山崎町31", specialty: "100% men's focus; bespoke", lat: 32.8032, lng: 130.7080 },
  { id: 11, name: "着物のこう吉", nameEn: "Koukichi", category: "Recycle/Tea", city: "Kumamoto", status: "active", teaCeremony: "Very High", priceLevel: "Budget", details: "Recycle kimono + tea utensils + Rikyu bags. Etsy: HitoikiKimono.", openDays: [1,2,3,4,5,6], openTime: "10:00", closeTime: "18:00", address: "中央区上林町並木坂3-32", specialty: "Tea utensils alongside kimono", lat: 32.8060, lng: 130.7075 },
  { id: 12, name: "和のそうこ", nameEn: "Wa no Souko", category: "Recycle", city: "Kumamoto", status: "active", teaCeremony: "Medium", priceLevel: "Very Budget", details: "Warehouse-style. Kimono from ¥500. Dyeing classes.", openDays: [3,4,5,6,0], openTime: "10:00", closeTime: "17:00", address: "東区吉原町277-1", specialty: "Warehouse; dyeing classes", lat: 32.8020, lng: 130.7450 },
  { id: 13, name: "呉楽", nameEn: "Goraku", category: "Recycle", city: "Kumamoto", status: "active", teaCeremony: "High", priceLevel: "Budget", details: "Serves tea ceremony customers. On-site changing.", openDays: [1,2,3,4,5,6], openTime: "10:00", closeTime: "18:00", address: "中央区南坪井町", specialty: "Popular with 茶会 attendees", lat: 32.8075, lng: 130.7055 },
  { id: 14, name: "和の國", nameEn: "Wa no Kuni", category: "Traditional/New", city: "Kumamoto", status: "active", teaCeremony: "Very High", priceLevel: "High-end", details: "Est. 109 yrs. Owners practice tea/Noh. 97.5% satisfaction.", openDays: [1,2,3,4,5,6], openTime: "10:00", closeTime: "18:30", address: "中央区城東町4-7", specialty: "Owners practice Urasenke", lat: 32.8085, lng: 130.7120 },
  { id: 15, name: "ら・たんす 熊本", nameEn: "Ra-Tansu", category: "Chain/Accessories", city: "Kumamoto", status: "active", teaCeremony: "High", priceLevel: "Mid-range", details: "Men's accessories: setta, kaku-obi, fukusa.", openDays: [1,2,3,4,5,6,0], openTime: "10:00", closeTime: "21:00", address: "イオンモール熊本2F", specialty: "Fukusa & tea items", lat: 32.7520, lng: 130.7350 },
  { id: 16, name: "古楽屋", nameEn: "Korakuya", category: "Recycle", city: "Nagasaki", status: "active", teaCeremony: "High", priceLevel: "Budget", details: "Dedicated men's section. Thu/Fri/Sat only.", openDays: [4,5,6], openTime: "11:00", closeTime: "18:00", address: "浜町8-34 4F", specialty: "Recycle specialist; 3 days/week", lat: 32.7445, lng: 129.8785 },
  { id: 17, name: "きものやまと長崎", nameEn: "Kimono Yamato NG", category: "Chain/New", city: "Nagasaki", status: "active", teaCeremony: "High", priceLevel: "Mid–High", details: "Y.&SONS men's brand. Professional fitting.", openDays: [1,2,3,4,5,6,0], openTime: "10:00", closeTime: "21:00", address: "元船町10-1 夢彩都2F", specialty: "Y.&SONS; kitsuke lessons", lat: 32.7530, lng: 129.8720 },
  { id: 18, name: "ヒラコバ", nameEn: "HIRAKOBA", category: "Recycle/Multi", city: "Nagasaki", status: "active", teaCeremony: "Low–Medium", priceLevel: "Budget", details: "Multi-category recycle in arcade. Open daily.", openDays: [1,2,3,4,5,6,0], openTime: "10:00", closeTime: "19:00", address: "浜町10-11 1F", specialty: "Multi-category; arcade", lat: 32.7440, lng: 129.8790 },
  { id: 19, name: "わらく(長崎)", nameEn: "Waraku Nagasaki", category: "Traditional/New", city: "Nagasaki", status: "inactive", teaCeremony: "Low", priceLevel: "Mid-range", details: "Primarily women's. Very limited men's.", openDays: [1,2,3,4,5,6,0], openTime: "10:00", closeTime: "19:00", address: "浜町2-17", specialty: "Women's focus", lat: 32.7448, lng: 129.8778 },
];

const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAY_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const CATEGORIES = [...new Set(SHOPS.map(s => s.category))];
const CITIES = ["Fukuoka","Kumamoto","Nagasaki"];
const TEA_COLORS = {"Very High":"#6B4C2A","High":"#8B6914","Medium":"#A68B5B","Low–Medium":"#BFA882","Low":"#D4C4A8"};
const CITY_ACCENTS = {Fukuoka:"#8B4513",Kumamoto:"#556B2F",Nagasaki:"#4A6B8A"};
const CITY_CENTERS = {Fukuoka:{lat:33.583,lng:130.395,span:0.045},Kumamoto:{lat:32.795,lng:130.720,span:0.065},Nagasaki:{lat:32.748,lng:129.877,span:0.020}};

function createShopIcon(color){
  return L.divIcon({
    className: "",
    html: `<div style="width:18px;height:18px;border-radius:999px;background:${color};border:2px solid rgba(255,253,247,0.95);box-shadow:0 4px 10px rgba(0,0,0,0.18);"></div>`,
    iconSize: [18,18],
    iconAnchor: [9,9],
    popupAnchor: [0,-10],
  });
}

function getGoogleMapsUrl(shop){
  const placeQuery = [
    shop.nameEn || shop.name,
    shop.name,
    shop.address,
    shop.city,
    "Japan",
  ].join(" ");

  return `https://www.google.com/maps/place/${encodeURIComponent(placeQuery)}/@${shop.lat},${shop.lng},17z`;
}

function timeToFrac(t){const[h,m]=t.split(":").map(Number);return(h+m/60-7)/16;}

function TimeBar({openTime,closeTime,isOpen}){
  const l=Math.max(0,timeToFrac(openTime)*100),r=Math.min(100,timeToFrac(closeTime)*100);
  return(<div style={{position:"relative",height:20,mt:10,marginTop:10,marginBottom:4}}>
    <div style={{position:"absolute",top:8,left:0,right:0,height:4,background:"#E8DFD0",borderRadius:2}}/>
    <div style={{position:"absolute",top:4,left:`${l}%`,width:`${r-l}%`,height:12,background:isOpen?"linear-gradient(90deg,#A67C52,#8B6914,#A67C52)":"#C8BDA8",borderRadius:6,transition:"all 0.4s",boxShadow:isOpen?"0 1px 4px rgba(139,105,20,0.3)":"none"}}/>
    {[0,50,100].map((p,i)=><div key={i} style={{position:"absolute",top:18,left:i===2?"auto":`${p}%`,right:i===2?0:undefined,transform:i===1?"translateX(-50%)":undefined,fontSize:9,fontFamily:"'Cormorant Garamond',serif",color:"#8B7D6B"}}>{["7:00","15:00","23:00"][i]}</div>)}
  </div>);
}

function ShopCard({shop,selectedDay,index}){
  const isOpen=shop.openDays.includes(selectedDay)&&shop.status==="active";
  return(<div style={{background:isOpen?"#FFFDF7":"#F5F0E8",border:`1px solid ${isOpen?"#D4C4A8":"#E8E0D4"}`,borderLeft:`4px solid ${CITY_ACCENTS[shop.city]}`,borderRadius:8,padding:"16px 18px",opacity:isOpen?1:0.55,transition:"all 0.4s",animation:`cardIn 0.4s ease ${index*0.05}s both`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
      <div style={{flex:1,minWidth:0}}>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:700,margin:0,color:isOpen?"#3B2F1E":"#8B7D6B",lineHeight:1.2}}>{shop.name}</h3>
        <div style={{fontFamily:"'Lora',serif",fontSize:12,color:"#8B7D6B",marginTop:2,fontStyle:"italic"}}>{shop.nameEn}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
        <span style={{padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:600,fontFamily:"'Lora',serif",background:isOpen?"#E8F0E0":"#EDE8E0",color:isOpen?"#3D5A1E":"#8B7D6B",textTransform:"uppercase"}}>{isOpen?"Open Today":shop.status==="active"?"Closed Today":"Inactive"}</span>
        <span style={{fontSize:10,fontWeight:600,fontFamily:"'Lora',serif",color:CITY_ACCENTS[shop.city]}}>{shop.city}</span>
      </div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:4,margin:"8px 0"}}>
      {[{l:shop.category,bg:"#F0EBE0",c:"#6B5D4A"},{l:`Tea: ${shop.teaCeremony}`,bg:TEA_COLORS[shop.teaCeremony]+"18",c:TEA_COLORS[shop.teaCeremony],b:`1px solid ${TEA_COLORS[shop.teaCeremony]}30`,fw:600},{l:shop.priceLevel,bg:"#EDE8F0",c:"#5A4B6B"}].map((t,i)=>
        <span key={i} style={{padding:"2px 7px",borderRadius:4,fontSize:10,fontFamily:"'Lora',serif",background:t.bg,color:t.c,fontWeight:t.fw||400,border:t.b||"none"}}>{t.l}</span>
      )}
    </div>
    <p style={{fontFamily:"'Lora',serif",fontSize:12.5,lineHeight:1.55,color:"#5A4F3E",margin:"0 0 6px"}}>{shop.details}</p>
    <div style={{fontFamily:"'Lora',serif",fontSize:11,color:"#8B7D6B",fontStyle:"italic"}}>{shop.specialty}</div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:6}}>
      <div style={{fontFamily:"'Lora',serif",fontSize:10.5,color:"#A89880"}}>{shop.address}</div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:isOpen?"#3B2F1E":"#A89880",letterSpacing:"0.02em"}}>{shop.openTime}–{shop.closeTime}</div>
    </div>
    <div style={{display:"flex",gap:2,marginTop:6}}>
      {DAY_NAMES.map((d,i)=>(<span key={d} style={{width:22,height:18,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:3,fontSize:8.5,fontWeight:600,fontFamily:"'Lora',serif",background:shop.openDays.includes(i)?(i===selectedDay?CITY_ACCENTS[shop.city]:"#E8DFD0"):"transparent",color:shop.openDays.includes(i)?(i===selectedDay?"#FFF":"#6B5D4A"):"#D4C4A8",border:i===selectedDay?"none":"1px solid #E8DFD0",transition:"all 0.3s"}}>{d[0]}</span>))}
    </div>
    <TimeBar openTime={shop.openTime} closeTime={shop.closeTime} isOpen={isOpen}/>
  </div>);
}

function MapViewport({activeCity, plotShops}){
  const map=useMap();
  const center=CITY_CENTERS[activeCity];

  useEffect(()=>{
    if(plotShops.length===0){
      map.setView([center.lat,center.lng], activeCity==="Nagasaki"?14:12);
      return;
    }

    if(plotShops.length===1){
      map.setView([plotShops[0].lat,plotShops[0].lng], 14);
      return;
    }

    map.fitBounds(plotShops.map(shop=>[shop.lat,shop.lng]), { padding:[28,28] });
  },[activeCity, center.lat, center.lng, map, plotShops]);

  return null;
}

function MapView({shops,selectedDay}){
  const availableCities=CITIES.filter(ci=>shops.some(s=>s.city===ci));
  const [mapCity,setMapCity]=useState(availableCities[0]||CITIES[0]);
  const activeCity=availableCities.includes(mapCity)?mapCity:(availableCities[0]||CITIES[0]);
  const cityShops=shops.filter(s=>s.city===activeCity);
  const openShops=cityShops.filter(s=>s.openDays.includes(selectedDay)&&s.status==="active");
  const plotShops=openShops.length>0?openShops:cityShops.filter(s=>s.status==="active");
  const center=CITY_CENTERS[activeCity];

  return(
    <div>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {CITIES.map(ci=>{
          const count=shops.filter(s=>s.city===ci&&s.openDays.includes(selectedDay)&&s.status==="active").length;
          const hasShops=shops.some(s=>s.city===ci);
          return(
            <button key={ci} onClick={()=>setMapCity(ci)} disabled={!hasShops}
              style={{flex:1,padding:"8px 0",borderRadius:6,border:`1.5px solid ${activeCity===ci?CITY_ACCENTS[ci]:"#D4C4A8"}`,fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontWeight:activeCity===ci?700:400,cursor:hasShops?"pointer":"not-allowed",background:activeCity===ci?CITY_ACCENTS[ci]:"transparent",color:activeCity===ci?"#FFFDF7":hasShops?"#6B5D4A":"#BFAF98",transition:"all 0.25s",opacity:hasShops?1:0.45}}>
              {ci} ({count})
            </button>
          );
        })}
      </div>

      <div style={{borderRadius:12,overflow:"hidden",border:"1px solid #D4C4A8",marginBottom:12,background:`radial-gradient(circle at top left, ${CITY_ACCENTS[activeCity]}22, transparent 42%), linear-gradient(180deg,#F8F3EA 0%,#EFE6D8 100%)`,boxShadow:"inset 0 1px 0 rgba(255,255,255,0.6)"}}>
        <div style={{padding:"14px 16px 6px",display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:12}}>
          <div>
            <div style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:"#8B7D6B",fontWeight:600}}>Map Layout</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#3B2F1E"}}>{activeCity}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:CITY_ACCENTS[activeCity]}}>{openShops.length}</div>
            <div style={{fontSize:10,fontFamily:"'Lora',serif",color:"#8B7D6B"}}>open on {DAY_NAMES[selectedDay]}</div>
          </div>
        </div>

        <div style={{position:"relative",height:320,margin:12,borderRadius:12,overflow:"hidden",background:"#F7F1E7"}}>
          <MapContainer center={[center.lat,center.lng]} zoom={activeCity==="Nagasaki"?14:12} style={{height:"100%",width:"100%"}} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapViewport activeCity={activeCity} plotShops={plotShops} />
            {plotShops.map((shop,index)=>{
              const isOpen=openShops.some(s=>s.id===shop.id);
              return(
                <Marker
                  key={shop.id}
                  position={[shop.lat,shop.lng]}
                  icon={createShopIcon(isOpen?CITY_ACCENTS[activeCity]:"#B5A894")}
                >
                  <Popup>
                    <div style={{fontFamily:"Georgia, serif",minWidth:160}}>
                    <div style={{fontWeight:700,marginBottom:4}}>{index+1}. {shop.name}</div>
                      <div style={{fontSize:12,marginBottom:4}}>{shop.nameEn}</div>
                      <div style={{fontSize:12,marginBottom:4}}>{shop.address}</div>
                      <div style={{fontSize:12,marginBottom:4}}>{shop.openTime}–{shop.closeTime}</div>
                      <a href={getGoogleMapsUrl(shop)} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {cityShops.length===0&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px",textAlign:"center",fontFamily:"'Lora',serif",fontSize:13,color:"#8B7D6B",fontStyle:"italic",background:"rgba(247,241,231,0.92)",zIndex:500}}>No shops match the current filters for {activeCity}.</div>}
          {cityShops.length>0&&openShops.length===0&&<div style={{position:"absolute",left:16,right:16,bottom:14,padding:"8px 10px",borderRadius:8,background:"rgba(255,253,247,0.9)",border:"1px solid #E8DFD0",fontFamily:"'Lora',serif",fontSize:11,color:"#8B7D6B",fontStyle:"italic",textAlign:"center",zIndex:500}}>No shops in {activeCity} are open on {DAY_FULL[selectedDay]}. Active shops are still shown on the map for reference.</div>}
        </div>
      </div>

      <div style={{fontSize:10,fontFamily:"'Lora',serif",color:"#A89880",textAlign:"center",marginBottom:10,fontStyle:"italic"}}>
        OpenStreetMap now shows the filtered shops for {activeCity}. Tap a marker or row to open the location in Google Maps.
      </div>

      {openShops.length===0&&cityShops.length>0?<div style={{padding:"16px 18px",borderRadius:8,background:"#FFFDF7",border:"1px solid #E8DFD0",textAlign:"center",fontFamily:"'Lora',serif",fontSize:12,color:"#8B7D6B",fontStyle:"italic"}}>No open shops for {activeCity} on {DAY_FULL[selectedDay]}.</div>
      :openShops.map((shop,index)=>(
        <a key={shop.id} href={getGoogleMapsUrl(shop)} target="_blank" rel="noopener noreferrer"
          style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:6,background:"#FFFDF7",border:"1px solid #E8DFD0",marginBottom:6,textDecoration:"none",transition:"all 0.2s"}}>
          <div style={{width:24,height:24,borderRadius:"50%",background:CITY_ACCENTS[activeCity],color:"#FFFDF7",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Lora',serif",fontSize:11,fontWeight:700,flexShrink:0}}>{index+1}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,color:"#3B2F1E"}}>{shop.name} <span style={{fontFamily:"'Lora',serif",fontSize:10,color:"#A89880",fontWeight:400}}>{shop.nameEn}</span></div>
            <div style={{fontFamily:"'Lora',serif",fontSize:10,color:"#8B7D6B"}}>{shop.address}</div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:10,padding:"1px 6px",borderRadius:8,background:"#E8F0E0",color:"#3D5A1E",fontWeight:600,fontFamily:"'Lora',serif",marginBottom:2}}>OPEN</div>
            <div style={{fontSize:9,fontFamily:"'Lora',serif",color:"#A89880"}}>{shop.openTime}–{shop.closeTime}</div>
          </div>
        </a>
      ))}
    </div>
  );
}

function TimelineView({shops,selectedDay}){
  const openShops=shops.filter(s=>s.openDays.includes(selectedDay)&&s.status==="active").sort((a,b)=>a.openTime.localeCompare(b.openTime));
  const closedShops=shops.filter(s=>!s.openDays.includes(selectedDay)||s.status!=="active");
  const now=new Date();const nowFrac=now.getHours()+now.getMinutes()/60;
  const nowPct=((nowFrac-7)/16)*100;const showNow=nowPct>=0&&nowPct<=100&&selectedDay===now.getDay();
  const axisHours=[7,9,11,13,15,17,19,21];

  const Axis=()=>(
    <div style={{position:"relative",height:16,marginBottom:2}}>
      {axisHours.map(h=>{const p=((h-7)/16)*100;return <div key={h} style={{position:"absolute",left:`${p}%`,fontSize:9,fontFamily:"'Lora',serif",color:"#A89880",transform:"translateX(-50%)"}}>{h}:00</div>;})}
    </div>
  );

  const Bar=({shop,isOpen,h})=>{
    const l=timeToFrac(shop.openTime)*100,r=timeToFrac(shop.closeTime)*100;
    return(
      <div style={{position:"relative",height:h}}>
        <div style={{position:"absolute",top:"50%",left:0,right:0,height:1,background:"#E8DFD0",transform:"translateY(-50%)"}}/>
        <a
          href={getGoogleMapsUrl(shop)}
          target="_blank"
          rel="noopener noreferrer"
          style={{position:"absolute",top:Math.floor((h-Math.min(h,24))/2),left:`${l}%`,width:`${r-l}%`,height:Math.min(h,24),borderRadius:5,background:isOpen?`linear-gradient(90deg,${CITY_ACCENTS[shop.city]}DD,${CITY_ACCENTS[shop.city]}99)`:"#C8BDA8",display:"flex",alignItems:"center",paddingLeft:6,overflow:"hidden",cursor:"pointer",textDecoration:"none"}}
          title={shop.nameEn+": "+shop.openTime+"–"+shop.closeTime+" • Open in Google Maps"}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:isOpen?11:10,fontWeight:700,color:isOpen?"#FFFDF7":"#8B7D6B",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",textShadow:isOpen?"0 1px 2px rgba(0,0,0,0.3)":"none"}}>{shop.name}</span>
        </a>
      </div>
    );
  };

  return(
    <div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:"#3B2F1E",marginBottom:12,textAlign:"center"}}>
        {DAY_FULL[selectedDay]} — {openShops.length} shop{openShops.length!==1?"s":""} open
      </div>
      <Axis/>
      <div style={{display:"flex",flexDirection:"column",gap:2,position:"relative",paddingBottom:4}}>
        {showNow&&<div style={{position:"absolute",left:`${nowPct}%`,top:0,bottom:0,width:2,background:"#C0392B",zIndex:5,borderRadius:1,opacity:0.5}}/>}
        {openShops.map((shop,i)=><Bar key={shop.id} shop={shop} isOpen={true} h={30}/>)}
      </div>
      {closedShops.length>0&&(
        <div style={{marginTop:8}}>
          <div style={{height:1,background:"#D4C4A8",marginBottom:6,opacity:0.4}}/>
          <div style={{fontSize:10,fontFamily:"'Lora',serif",color:"#A89880",fontStyle:"italic",textAlign:"center",marginBottom:6}}>Closed on {DAY_NAMES[selectedDay]}</div>
          <div style={{display:"flex",flexDirection:"column",gap:2,opacity:0.35}}>
            {closedShops.map(shop=><Bar key={shop.id} shop={shop} isOpen={false} h={22}/>)}
          </div>
        </div>
      )}
      <div style={{marginTop:6}}><Axis/></div>
      {showNow&&<div style={{textAlign:"center",marginTop:4,fontSize:10,fontFamily:"'Lora',serif",color:"#C0392B",fontStyle:"italic"}}>Red line = current time</div>}
    </div>
  );
}

export default function App(){
  const today=new Date().getDay();
  const [selectedDay,setSelectedDay]=useState(today);
  const [selectedCities,setSelectedCities]=useState(new Set(CITIES));
  const [selectedCategories,setSelectedCategories]=useState(new Set());
  const [openOnly,setOpenOnly]=useState(false);
  const [tab,setTab]=useState("cards");
  const toggle=(set,v)=>{const n=new Set(set);n.has(v)?n.delete(v):n.add(v);return n;};

  const filtered=useMemo(()=>{
    let r=SHOPS.filter(s=>selectedCities.has(s.city));
    if(selectedCategories.size>0)r=r.filter(s=>selectedCategories.has(s.category));
    if(openOnly)r=r.filter(s=>s.openDays.includes(selectedDay)&&s.status==="active");
    r.sort((a,b)=>{const ao=a.openDays.includes(selectedDay)&&a.status==="active"?0:1,bo=b.openDays.includes(selectedDay)&&b.status==="active"?0:1;if(ao!==bo)return ao-bo;const t={"Very High":0,"High":1,"Medium":2,"Low–Medium":3,"Low":4};return(t[a.teaCeremony]||5)-(t[b.teaCeremony]||5);});
    return r;
  },[selectedCities,selectedCategories,openOnly,selectedDay]);

  const openCount=filtered.filter(s=>s.openDays.includes(selectedDay)&&s.status==="active").length;

  return(<div style={{minHeight:"100vh",background:"linear-gradient(165deg,#F7F0E4 0%,#EDE5D6 40%,#F2EBE0 100%)",fontFamily:"'Lora',Georgia,serif",padding:"0 0 40px"}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
      @keyframes cardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      *{box-sizing:border-box}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:#C8BDA8;border-radius:3px}
    `}</style>
    <div style={{maxWidth:480,margin:"0 auto",padding:"0 16px"}}>
      {/* Header */}
      <div style={{padding:"28px 0 16px",borderBottom:"1px solid #D4C4A8",marginBottom:16,textAlign:"center"}}>
        <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#A89880",fontWeight:600,marginBottom:4}}>九州 · Kyūshū</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:"#3B2F1E",margin:0,lineHeight:1.15}}>Men's Kimono Shops</h1>
        <div style={{fontSize:12,color:"#8B7D6B",marginTop:6,fontStyle:"italic"}}>Fukuoka · Kumamoto · Nagasaki</div>
      </div>
      {/* Tabs */}
      <div style={{display:"flex",gap:0,marginBottom:14,background:"#E8DFD0",borderRadius:8,padding:3}}>
        {[{k:"cards",l:"Cards"},{k:"map",l:"Map"},{k:"timeline",l:"Timeline"}].map(t=>
          <button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,padding:"8px 0",borderRadius:6,border:"none",fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontWeight:tab===t.k?700:400,cursor:"pointer",transition:"all 0.25s",background:tab===t.k?"#FFFDF7":"transparent",color:tab===t.k?"#3B2F1E":"#8B7D6B",boxShadow:tab===t.k?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>{t.l}</button>
        )}
      </div>
      {/* Day */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"#8B7D6B",marginBottom:6,fontWeight:600}}>Day of Week</div>
        <div style={{display:"flex",gap:4}}>
          {DAY_NAMES.map((d,i)=>(<button key={d} onClick={()=>setSelectedDay(i)} style={{flex:1,padding:"8px 0",borderRadius:6,border:"none",fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontWeight:i===selectedDay?700:400,cursor:"pointer",transition:"all 0.25s",background:i===selectedDay?"#3B2F1E":"#FFFDF7",color:i===selectedDay?"#F7F0E4":"#6B5D4A",boxShadow:i===selectedDay?"0 2px 8px rgba(59,47,30,0.25)":"0 1px 2px rgba(0,0,0,0.06)"}}>
            <div>{d}</div>{i===today&&<div style={{width:4,height:4,borderRadius:"50%",background:i===selectedDay?"#D4A054":"#A89880",margin:"3px auto 0"}}/>}
          </button>))}
        </div>
        <div style={{textAlign:"center",marginTop:6,fontSize:11,color:"#A89880",fontStyle:"italic"}}>{DAY_FULL[selectedDay]}{selectedDay===today?" (today)":""}</div>
      </div>
      {/* Filters */}
      <>
        <div style={{marginBottom:10}}>
          <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"#8B7D6B",marginBottom:6,fontWeight:600}}>City</div>
          <div style={{display:"flex",gap:6}}>
            {CITIES.map(c=>(<button key={c} onClick={()=>setSelectedCities(p=>toggle(p,c))} style={{flex:1,padding:"7px 0",borderRadius:6,border:`1.5px solid ${selectedCities.has(c)?CITY_ACCENTS[c]:"#D4C4A8"}`,fontFamily:"'Lora',serif",fontSize:12,fontWeight:selectedCities.has(c)?600:400,cursor:"pointer",transition:"all 0.25s",background:selectedCities.has(c)?CITY_ACCENTS[c]+"14":"transparent",color:selectedCities.has(c)?CITY_ACCENTS[c]:"#A89880"}}>{c}</button>))}
          </div>
        </div>
        <div style={{marginBottom:10}}>
          <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"#8B7D6B",marginBottom:6,fontWeight:600}}>Category{selectedCategories.size>0&&<span onClick={()=>setSelectedCategories(new Set())} style={{cursor:"pointer",color:"#A67C52",fontWeight:400,textTransform:"none",letterSpacing:0}}> — clear</span>}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {CATEGORIES.map(c=>(<button key={c} onClick={()=>setSelectedCategories(p=>toggle(p,c))} style={{padding:"4px 10px",borderRadius:14,border:`1px solid ${selectedCategories.has(c)?"#8B6914":"#D4C4A8"}`,fontFamily:"'Lora',serif",fontSize:11,cursor:"pointer",transition:"all 0.25s",background:selectedCategories.has(c)?"#8B6914":"transparent",color:selectedCategories.has(c)?"#FFFDF7":"#6B5D4A",fontWeight:selectedCategories.has(c)?600:400}}>{c}</button>))}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,padding:"10px 14px",background:"#FFFDF7",borderRadius:8,border:"1px solid #E8DFD0"}}>
          <div><div style={{fontSize:12,fontWeight:600,color:"#3B2F1E"}}>Open only</div><div style={{fontSize:10,color:"#A89880",marginTop:1}}>{openCount} of {filtered.length} open</div></div>
          <button onClick={()=>setOpenOnly(!openOnly)} style={{width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",position:"relative",transition:"background 0.3s",background:openOnly?"#6B4C2A":"#D4C4A8"}}>
            <div style={{width:18,height:18,borderRadius:"50%",background:"#FFFDF7",position:"absolute",top:3,left:openOnly?23:3,transition:"left 0.3s",boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}}/>
          </button>
        </div>
      </>
      {/* Content */}
      {tab==="cards"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.length===0?<div style={{textAlign:"center",padding:"40px 20px",color:"#A89880",fontStyle:"italic"}}>No shops match. Adjust filters.</div>
        :filtered.map((s,i)=><ShopCard key={s.id} shop={s} selectedDay={selectedDay} index={i}/>)}
      </div>}
      {tab==="map"&&<MapView shops={filtered} selectedDay={selectedDay}/>}
      {tab==="timeline"&&<TimelineView shops={filtered} selectedDay={selectedDay}/>}
      <div style={{textAlign:"center",marginTop:24,paddingTop:16,borderTop:"1px solid #E8DFD0",fontSize:10,color:"#B5A894",lineHeight:1.6,fontStyle:"italic"}}>Hours approximate — confirm before visiting. Tap/hover pins for details.</div>
    </div>
  </div>);
}
