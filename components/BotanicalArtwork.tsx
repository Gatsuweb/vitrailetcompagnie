import s from '../app/home-sections.module.css';

const stems = [
 'M155 365C150 290 180 220 145 145C127 108 109 78 116 45',
 'M157 302C151 298 145 293 139 289',
 'M162 258C164 256 167 253 170 252',
 'M155 206C153 203 151 201 149 199',
 'M149 162C150 161 151 159 151 158',
];
const leaves = [
 'M139 289C102 294 70 250 73 209C112 224 143 246 139 289Z',
 'M170 252C181 208 204 180 243 163C246 204 215 244 170 252Z',
 'M149 199C107 213 73 182 81 145C113 150 140 173 149 199Z',
 'M151 158C151 111 169 88 195 78C210 121 185 152 151 158Z',
];
export default function BotanicalArtwork() {
 return <>{['Top','Bottom'].map(position=><svg key={position} className={s.botanical+' '+s['botanical'+position]} viewBox="0 0 310 390" aria-hidden="true" focusable="false">
  {stems.map(d=><path key={d} d={d} pathLength="1"/>)}
  {leaves.map(d=><path key={d} d={d} pathLength="1"/>)}
  <g className={s.petals}>
   {[0,60,120,180,240,300].map(angle=><path key={angle} d="M116 47C91 34 91 8 108 7C127 5 139 29 116 47Z" transform={'rotate('+angle+' 116 47)'} pathLength="1"/>)}
   <circle cx="116" cy="47" r="7"/>
  </g>
 </svg>)}</>;
}

