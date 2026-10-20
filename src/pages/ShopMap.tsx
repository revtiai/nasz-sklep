import { useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useT } from '../ui.tsx';

const SHOP_AT: [number, number] = [50.91054, -1.39916];

/** Real map that flies in from the whole city to the shop's street when it scrolls into view. */
export function ShopMap() {
  const t = useT();
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const flown = useRef(false);
  const pin = useRef<L.Marker | null>(null);
  const inView = useInView(box, { once: true, margin: '0px 0px -20% 0px' });

  useEffect(() => {
    if (!box.current || map.current) return;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    const m = L.map(box.current, { center: [50.9097, -1.4044], zoom: reduce ? 16 : 13, zoomControl: !touch, scrollWheelZoom: false, dragging: !touch, attributionControl: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'ns-tiles',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(m);
    const icon = L.divIcon({
      className: '',
      html: '<div class="ns-pin"><span class="ns-pulse"></span><span class="ns-dot"></span><span class="ns-label">Nasz Sklep</span></div>',
      iconSize: [0, 0],
    });
    pin.current = L.marker(SHOP_AT, { icon, keyboard: false });
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, [reduce]);

  useEffect(() => {
    if (!inView || !map.current || flown.current) return;
    flown.current = true;
    const m = map.current;
    const drop = () => { if (pin.current && !m.hasLayer(pin.current)) pin.current.addTo(m); };
    if (reduce) { m.setView(SHOP_AT, 16); drop(); return; }
    m.once('moveend', drop);
    setTimeout(() => m.flyTo(SHOP_AT, 16.5, { duration: 2.6, easeLinearity: 0.2 }), 300);
  }, [inView, reduce]);

  return (
    <div className="relative rounded-[2rem] overflow-hidden min-h-[380px] h-full bg-paper isolate">
      <div ref={box} className="absolute inset-0" role="img" aria-label={t('Map showing Nasz Sklep on St Mary’s Road, Southampton', 'Mapa: Nasz Sklep na St Mary’s Road w Southampton')} />
      <div className="pointer-events-none absolute left-4 top-4 z-[500] rounded-full bg-white/95 px-4 py-2 text-sm font-bold shadow">{t('St Mary’s, Southampton', 'St Mary’s, Southampton')}</div>
    </div>
  );
}
