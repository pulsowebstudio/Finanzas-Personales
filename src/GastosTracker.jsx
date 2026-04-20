import { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase ──────────────────────────────────────────────────────
const SUPABASE_URL = "https://guysgrjrlyyqyxfrtlgi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1eXNncmpybHl5cXl4ZnJ0bGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MTQ3NTEsImV4cCI6MjA5MjI5MDc1MX0.0qtEai8cyxcfV1YSCwDS_UZscj1nOQ5Z1pEXhaE-leU";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MESES_ORDER = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const MESES_SHORT  = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const fmt      = (n) => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(Math.round(n));
const fmtShort = (n) => { const abs=Math.abs(Math.round(n)); const s=abs>=1000?`$${(abs/1000).toFixed(1)}k`:`$${abs}`; return n<0?`-${s}`:s; };
const capitalize= (s) => s.charAt(0).toUpperCase()+s.slice(1);
const getMesFromFecha=(f)=>MESES_ORDER[new Date(f+"T12:00:00").getMonth()];
const getAnoFromFecha =(f)=>new Date(f+"T12:00:00").getFullYear();

const INITIAL_CATS = [
  {id:1,  name:"The Launch Box",      emoji:"💼", color:"#34d399", tipo:"ingreso",  naturaleza:"variable"},
  {id:2,  name:"Apoyo Ingreso",       emoji:"👨‍👩‍👦", color:"#22d3ee", tipo:"ingreso",  naturaleza:"fijo"},
  {id:3,  name:"Golf Ingreso",        emoji:"⛳", color:"#60a5fa", tipo:"ingreso",  naturaleza:"variable"},
  {id:4,  name:"Inversión",           emoji:"📈", color:"#4ade80", tipo:"inversion", naturaleza:"variable"},
  {id:5,  name:"Comida Afuera",       emoji:"🍴", color:"#f97316", tipo:"gasto",    naturaleza:"variable"},
  {id:6,  name:"Supermercado",        emoji:"🛒", color:"#eab308", tipo:"gasto",    naturaleza:"variable"},
  {id:7,  name:"Gasolina",            emoji:"⛽", color:"#c084fc", tipo:"gasto",    naturaleza:"variable"},
  {id:8,  name:"Salidas Personales",  emoji:"🎉", color:"#ec4899", tipo:"gasto",    naturaleza:"variable"},
  {id:9,  name:"Salidas Midori",      emoji:"💑", color:"#f43f5e", tipo:"gasto",    naturaleza:"variable"},
  {id:10, name:"Golf Membersia",      emoji:"🏌️", color:"#818cf8", tipo:"gasto",    naturaleza:"fijo"},
  {id:11, name:"Estacionamientos",    emoji:"🅿️", color:"#94a3b8", tipo:"gasto",    naturaleza:"variable"},
  {id:12, name:"Gimnasio",            emoji:"💪", color:"#2dd4bf", tipo:"gasto",    naturaleza:"fijo"},
  {id:13, name:"Ropa",                emoji:"👕", color:"#e879f9", tipo:"gasto",    naturaleza:"variable"},
  {id:14, name:"Farmacia",            emoji:"💊", color:"#fbbf24", tipo:"gasto",    naturaleza:"variable"},
  {id:15, name:"Movistar",            emoji:"📱", color:"#38bdf8", tipo:"gasto",    naturaleza:"fijo"},
  {id:16, name:"Kiwi",                emoji:"🐾", color:"#a3e635", tipo:"gasto",    naturaleza:"fijo"},
  {id:17, name:"Electrodomésticos",   emoji:"🔌", color:"#64748b", tipo:"gasto",    naturaleza:"variable"},
  {id:18, name:"Regalos",             emoji:"🎁", color:"#f0abfc", tipo:"gasto",    naturaleza:"variable"},
  {id:19, name:"Fact QRO",            emoji:"🏠", color:"#fb923c", tipo:"gasto",    naturaleza:"fijo"},
  {id:20, name:"Otro Gasto",          emoji:"📦", color:"#6b7280", tipo:"gasto",    naturaleza:"variable"},
  {id:21, name:"Salidas de Efectivo", emoji:"💵", color:"#9ca3af", tipo:"gasto",    naturaleza:"variable"},
];

const ALL_PALETTE=["#34d399","#22d3ee","#60a5fa","#4ade80","#f97316","#eab308","#c084fc","#ec4899","#f43f5e","#818cf8","#94a3b8","#2dd4bf","#e879f9","#fbbf24","#38bdf8","#a3e635","#64748b","#f0abfc","#fb923c","#6b7280","#9ca3af","#f87171","#facc15","#a78bfa","#fb7185","#34d3d3","#86efac","#fcd34d","#67e8f9","#c4b5fd","#f9a8d4","#6ee7b7","#fda4af","#7dd3fc","#bef264"];
const ALL_EMOJIS=["💼","👨‍👩‍👦","⛳","📈","🍴","🛒","⛽","🎉","💑","🏌️","🅿️","💪","👕","💊","📱","🐾","🔌","🎁","🏠","📦","💵","🏦","☕","🎮","✈️","🎵","🏋️","🐕","🚗","🏡","💻","👓","🍷","🎸","🌮","💈","🎯","🛍️","🎬","📚","🍕","🚀","⚽","🏊","🎨","🧴","🧸","🕹️","🏕️","🎪","🛺","🚴","🧗","🤿","🎻","🎺","🎭","🧩","🪴","🍣"];

const RAW_DATA = [
  {cat:"Movistar",monto:301,desc:"Movistar febrero 26",fecha:"2026-02-01",mes:"febrero",ano:2026},
  {cat:"Otro Gasto",monto:188,desc:"CB",fecha:"2026-02-05",mes:"febrero",ano:2026},
  {cat:"Comida Afuera",monto:172,desc:"Tortas",fecha:"2026-02-06",mes:"febrero",ano:2026},
  {cat:"Comida Afuera",monto:132,desc:"Tacos Omar Carlos",fecha:"2026-02-07",mes:"febrero",ano:2026},
  {cat:"Farmacia",monto:14,desc:"Agua Farmacia",fecha:"2026-02-06",mes:"febrero",ano:2026},
  {cat:"Estacionamientos",monto:34,desc:"Estacionamiento La Rioja",fecha:"2026-02-05",mes:"febrero",ano:2026},
  {cat:"Estacionamientos",monto:67,desc:"Estacionamiento Hard Rock",fecha:"2026-02-06",mes:"febrero",ano:2026},
  {cat:"Estacionamientos",monto:67,desc:"Estacionamiento Panarama",fecha:"2026-02-07",mes:"febrero",ano:2026},
  {cat:"Gasolina",monto:1128,desc:"Gasolina",fecha:"2026-02-07",mes:"febrero",ano:2026},
  {cat:"The Launch Box",monto:16874,desc:"Nomina 1 febrero",fecha:"2026-02-06",mes:"febrero",ano:2026},
  {cat:"Supermercado",monto:808,desc:"Super desayunos",fecha:"2026-02-09",mes:"febrero",ano:2026},
  {cat:"Farmacia",monto:399,desc:"Rasuradora electrica",fecha:"2026-02-09",mes:"febrero",ano:2026},
  {cat:"Comida Afuera",monto:110,desc:"Tacos Omar Carlos",fecha:"2026-02-09",mes:"febrero",ano:2026},
  {cat:"Supermercado",monto:60,desc:"Bebidas",fecha:"2026-02-08",mes:"febrero",ano:2026},
  {cat:"Salidas Personales",monto:218,desc:"Gelato con DJ",fecha:"2026-02-08",mes:"febrero",ano:2026},
  {cat:"Comida Afuera",monto:110,desc:"Tacos Omar Carlos",fecha:"2026-02-09",mes:"febrero",ano:2026},
  {cat:"Kiwi",monto:2788,desc:"Croquetas Kiwi",fecha:"2026-02-10",mes:"febrero",ano:2026},
  {cat:"Ropa",monto:5759,desc:"Reloj Impuestos",fecha:"2026-02-10",mes:"febrero",ano:2026},
  {cat:"Estacionamientos",monto:73,desc:"Sao Paulo",fecha:"2026-02-14",mes:"febrero",ano:2026},
  {cat:"Comida Afuera",monto:112,desc:"Tacos",fecha:"2026-02-12",mes:"febrero",ano:2026},
  {cat:"Salidas Personales",monto:407,desc:"Turbio",fecha:"2026-02-13",mes:"febrero",ano:2026},
  {cat:"Salidas Personales",monto:64,desc:"Bar",fecha:"2026-02-13",mes:"febrero",ano:2026},
  {cat:"Comida Afuera",monto:159,desc:"Dominos",fecha:"2026-02-13",mes:"febrero",ano:2026},
  {cat:"Salidas Midori",monto:784,desc:"Sushi",fecha:"2026-02-14",mes:"febrero",ano:2026},
  {cat:"Comida Afuera",monto:150,desc:"Tamales",fecha:"2026-02-15",mes:"febrero",ano:2026},
  {cat:"Salidas Midori",monto:300,desc:"Algun Lugar Pizzeria",fecha:"2026-02-15",mes:"febrero",ano:2026},
  {cat:"Salidas Personales",monto:64,desc:"Krispy Kreme",fecha:"2026-02-16",mes:"febrero",ano:2026},
  {cat:"Fact QRO",monto:2500,desc:"Renta QRO",fecha:"2026-02-10",mes:"febrero",ano:2026},
  {cat:"Apoyo Ingreso",monto:12000,desc:"Apoyo Papás",fecha:"2026-02-16",mes:"febrero",ano:2026},
  {cat:"Estacionamientos",monto:23,desc:"Las Villas",fecha:"2026-02-18",mes:"febrero",ano:2026},
  {cat:"Farmacia",monto:103,desc:"Desodorante",fecha:"2026-02-18",mes:"febrero",ano:2026},
  {cat:"Comida Afuera",monto:319,desc:"Cenaduría",fecha:"2026-02-19",mes:"febrero",ano:2026},
  {cat:"Golf Ingreso",monto:1000,desc:"Eduardo Feb",fecha:"2026-02-21",mes:"febrero",ano:2026},
  {cat:"The Launch Box",monto:20534,desc:"Nomina 2 Feb + Prima Vac",fecha:"2026-02-20",mes:"febrero",ano:2026},
  {cat:"Comida Afuera",monto:119,desc:"Pizza",fecha:"2026-02-20",mes:"febrero",ano:2026},
  {cat:"Salidas Midori",monto:270,desc:"McDonalds",fecha:"2026-02-20",mes:"febrero",ano:2026},
  {cat:"Salidas Personales",monto:167,desc:"Cheve en el Golf",fecha:"2026-02-22",mes:"febrero",ano:2026},
  {cat:"Gimnasio",monto:599,desc:"Gym Feb",fecha:"2026-02-20",mes:"febrero",ano:2026},
  {cat:"Otro Gasto",monto:60,desc:"Papeleria",fecha:"2026-02-20",mes:"febrero",ano:2026},
  {cat:"Gasolina",monto:1085,desc:"Gasolina",fecha:"2026-02-20",mes:"febrero",ano:2026},
  {cat:"Supermercado",monto:98,desc:"Bebidas",fecha:"2026-02-20",mes:"febrero",ano:2026},
  {cat:"Salidas Personales",monto:319,desc:"Cheve Albercada",fecha:"2026-02-21",mes:"febrero",ano:2026},
  {cat:"Salidas Midori",monto:140,desc:"Renta Scooter Kairi",fecha:"2026-02-21",mes:"febrero",ano:2026},
  {cat:"Electrodomésticos",monto:131,desc:"Cargador MagSafe",fecha:"2026-02-26",mes:"febrero",ano:2026},
  {cat:"Comida Afuera",monto:100,desc:"Tacos Los Primos",fecha:"2026-02-25",mes:"febrero",ano:2026},
  {cat:"Salidas Midori",monto:1188,desc:"Grazianos",fecha:"2026-02-27",mes:"febrero",ano:2026},
  {cat:"Comida Afuera",monto:174,desc:"Tortas",fecha:"2026-03-01",mes:"marzo",ano:2026},
  {cat:"Movistar",monto:521,desc:"Mensualidad + Anualidad",fecha:"2026-03-03",mes:"marzo",ano:2026},
  {cat:"Farmacia",monto:69,desc:"Bebidas",fecha:"2026-03-02",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:132,desc:"Omar Carlos",fecha:"2026-03-05",mes:"marzo",ano:2026},
  {cat:"Supermercado",monto:570,desc:"Fresko",fecha:"2026-03-05",mes:"marzo",ano:2026},
  {cat:"Salidas Midori",monto:535,desc:"Algun Lugar Pizzeria",fecha:"2026-03-05",mes:"marzo",ano:2026},
  {cat:"Supermercado",monto:65,desc:"Carniceria",fecha:"2026-03-02",mes:"marzo",ano:2026},
  {cat:"Gimnasio",monto:599,desc:"Anualidad",fecha:"2026-03-02",mes:"marzo",ano:2026},
  {cat:"Golf Membersia",monto:8080,desc:"Golf",fecha:"2026-03-04",mes:"marzo",ano:2026},
  {cat:"Electrodomésticos",monto:366,desc:"Silla Gamer MSI",fecha:"2026-03-04",mes:"marzo",ano:2026},
  {cat:"Gasolina",monto:945,desc:"Gasolina",fecha:"2026-03-05",mes:"marzo",ano:2026},
  {cat:"Inversión",monto:5000,desc:"Nu Bank",fecha:"2026-03-06",mes:"marzo",ano:2026},
  {cat:"Inversión",monto:10000,desc:"GBM",fecha:"2026-03-06",mes:"marzo",ano:2026},
  {cat:"The Launch Box",monto:16873,desc:"TLB",fecha:"2026-03-06",mes:"marzo",ano:2026},
  {cat:"Apoyo Ingreso",monto:12000,desc:"Marzo",fecha:"2026-03-12",mes:"marzo",ano:2026},
  {cat:"Inversión",monto:5000,desc:"Nu Bank",fecha:"2026-03-19",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:135,desc:"Omar Carlos",fecha:"2026-03-05",mes:"marzo",ano:2026},
  {cat:"Salidas Midori",monto:374,desc:"Tacos Provi",fecha:"2026-03-06",mes:"marzo",ano:2026},
  {cat:"Salidas Midori",monto:752,desc:"Alma Vieja",fecha:"2026-03-07",mes:"marzo",ano:2026},
  {cat:"Salidas Personales",monto:248,desc:"Omar Carlos",fecha:"2026-03-08",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:62,desc:"Tacos Los Primos",fecha:"2026-03-08",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:140,desc:"McDonalds",fecha:"2026-03-10",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:144,desc:"Tacos Los Primos",fecha:"2026-03-12",mes:"marzo",ano:2026},
  {cat:"Supermercado",monto:15,desc:"Agua",fecha:"2026-03-13",mes:"marzo",ano:2026},
  {cat:"Salidas Personales",monto:126,desc:"Helado",fecha:"2026-03-13",mes:"marzo",ano:2026},
  {cat:"Salidas Personales",monto:610,desc:"Mantela",fecha:"2026-03-13",mes:"marzo",ano:2026},
  {cat:"Salidas Personales",monto:270,desc:"Chapala CC",fecha:"2026-03-14",mes:"marzo",ano:2026},
  {cat:"Salidas Midori",monto:408,desc:"Hamburguesas",fecha:"2026-03-15",mes:"marzo",ano:2026},
  {cat:"Salidas Personales",monto:75,desc:"Helado",fecha:"2026-03-15",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:50,desc:"WeWork",fecha:"2026-03-17",mes:"marzo",ano:2026},
  {cat:"Estacionamientos",monto:12,desc:"Parco",fecha:"2026-03-08",mes:"marzo",ano:2026},
  {cat:"Estacionamientos",monto:23,desc:"Parco",fecha:"2026-03-08",mes:"marzo",ano:2026},
  {cat:"Supermercado",monto:39,desc:"Agua",fecha:"2026-03-08",mes:"marzo",ano:2026},
  {cat:"Estacionamientos",monto:12,desc:"Parco",fecha:"2026-03-12",mes:"marzo",ano:2026},
  {cat:"Golf Membersia",monto:950,desc:"Chapala CC Green Fee",fecha:"2026-03-14",mes:"marzo",ano:2026},
  {cat:"Regalos",monto:1399,desc:"Adidas Midori",fecha:"2026-03-15",mes:"marzo",ano:2026},
  {cat:"Gasolina",monto:1109,desc:"Gasolina",fecha:"2026-03-15",mes:"marzo",ano:2026},
  {cat:"Salidas Midori",monto:450,desc:"Snacks Teatro",fecha:"2026-03-15",mes:"marzo",ano:2026},
  {cat:"Estacionamientos",monto:12,desc:"Parco",fecha:"2026-03-15",mes:"marzo",ano:2026},
  {cat:"Salidas Personales",monto:110,desc:"Summit",fecha:"2026-03-16",mes:"marzo",ano:2026},
  {cat:"Ropa",monto:1599,desc:"Tenis Nike",fecha:"2026-03-16",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:167,desc:"Tortas Nueva Galicia",fecha:"2026-03-16",mes:"marzo",ano:2026},
  {cat:"Supermercado",monto:51,desc:"Aguas",fecha:"2026-03-16",mes:"marzo",ano:2026},
  {cat:"Estacionamientos",monto:23,desc:"Parco",fecha:"2026-03-16",mes:"marzo",ano:2026},
  {cat:"Supermercado",monto:831,desc:"Fresko",fecha:"2026-03-28",mes:"marzo",ano:2026},
  {cat:"Fact QRO",monto:2500,desc:"Marzo",fecha:"2026-03-07",mes:"marzo",ano:2026},
  {cat:"Salidas de Efectivo",monto:2500,desc:"SF",fecha:"2026-03-15",mes:"marzo",ano:2026},
  {cat:"Supermercado",monto:15,desc:"Aguas",fecha:"2026-03-19",mes:"marzo",ano:2026},
  {cat:"Otro Gasto",monto:55,desc:"Aspiradora",fecha:"2026-03-20",mes:"marzo",ano:2026},
  {cat:"Otro Gasto",monto:360,desc:"Corte de pelo",fecha:"2026-03-20",mes:"marzo",ano:2026},
  {cat:"Gimnasio",monto:599,desc:"Membersia marzo",fecha:"2026-03-20",mes:"marzo",ano:2026},
  {cat:"Ropa",monto:899,desc:"Under Aurmor",fecha:"2026-03-21",mes:"marzo",ano:2026},
  {cat:"Estacionamientos",monto:69,desc:"Parco",fecha:"2026-03-21",mes:"marzo",ano:2026},
  {cat:"Regalos",monto:1064,desc:"Impuestos Whoop",fecha:"2026-03-24",mes:"marzo",ano:2026},
  {cat:"Estacionamientos",monto:12,desc:"Parco",fecha:"2026-03-24",mes:"marzo",ano:2026},
  {cat:"Gasolina",monto:1076,desc:"Gasolina",fecha:"2026-03-25",mes:"marzo",ano:2026},
  {cat:"Supermercado",monto:15,desc:"Aguas",fecha:"2026-03-25",mes:"marzo",ano:2026},
  {cat:"Electrodomésticos",monto:1778,desc:"Masajeadora",fecha:"2026-03-27",mes:"marzo",ano:2026},
  {cat:"Salidas Midori",monto:368,desc:"Dominos",fecha:"2026-03-20",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:167,desc:"Tortas Nueva Galicia",fecha:"2026-03-20",mes:"marzo",ano:2026},
  {cat:"Salidas Personales",monto:416,desc:"Insurgente",fecha:"2026-03-21",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:138,desc:"Tacos",fecha:"2026-03-21",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:165,desc:"Tacos",fecha:"2026-03-25",mes:"marzo",ano:2026},
  {cat:"Salidas Personales",monto:209,desc:"Hamburguesas",fecha:"2026-03-25",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:165,desc:"Tacos",fecha:"2026-03-25",mes:"marzo",ano:2026},
  {cat:"Salidas Midori",monto:784,desc:"Sushi",fecha:"2026-03-26",mes:"marzo",ano:2026},
  {cat:"The Launch Box",monto:15901,desc:"TLB",fecha:"2026-03-20",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:174,desc:"Tortas",fecha:"2026-03-27",mes:"marzo",ano:2026},
  {cat:"Farmacia",monto:29,desc:"Crema Zinc",fecha:"2026-03-27",mes:"marzo",ano:2026},
  {cat:"Salidas Midori",monto:929,desc:"El Pargo",fecha:"2026-03-28",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:200,desc:"Tacos",fecha:"2026-03-28",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:79,desc:"Tortas Nueva Galicia",fecha:"2026-03-30",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:227,desc:"Tacos",fecha:"2026-03-30",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:179,desc:"Comida China",fecha:"2026-03-31",mes:"marzo",ano:2026},
  {cat:"Estacionamientos",monto:23,desc:"Estacionamiento",fecha:"2026-03-27",mes:"marzo",ano:2026},
  {cat:"Estacionamientos",monto:23,desc:"Estacionamiento",fecha:"2026-03-29",mes:"marzo",ano:2026},
  {cat:"Estacionamientos",monto:12,desc:"Estacionamiento",fecha:"2026-03-29",mes:"marzo",ano:2026},
  {cat:"Supermercado",monto:1169,desc:"Super",fecha:"2026-03-30",mes:"marzo",ano:2026},
  {cat:"Estacionamientos",monto:12,desc:"Parco",fecha:"2026-03-30",mes:"marzo",ano:2026},
  {cat:"Gimnasio",monto:126,desc:"Gym Gabo",fecha:"2026-03-31",mes:"marzo",ano:2026},
  {cat:"The Launch Box",monto:17111,desc:"TLB",fecha:"2026-04-01",mes:"abril",ano:2026},
  {cat:"Golf Membersia",monto:9200,desc:"Golf",fecha:"2026-04-01",mes:"abril",ano:2026},
  {cat:"Golf Ingreso",monto:1000,desc:"Invitados marzo",fecha:"2026-03-28",mes:"marzo",ano:2026},
  {cat:"Comida Afuera",monto:140,desc:"McDonalds",fecha:"2026-04-05",mes:"abril",ano:2026},
  {cat:"Comida Afuera",monto:90,desc:"Tamales",fecha:"2026-04-03",mes:"abril",ano:2026},
  {cat:"Salidas Personales",monto:200,desc:"Pizza",fecha:"2026-04-03",mes:"abril",ano:2026},
  {cat:"Comida Afuera",monto:180,desc:"Tamales",fecha:"2026-04-02",mes:"abril",ano:2026},
  {cat:"Electrodomésticos",monto:366,desc:"Silla Gamer MSI",fecha:"2026-04-01",mes:"abril",ano:2026},
  {cat:"Estacionamientos",monto:67,desc:"Parco",fecha:"2026-04-04",mes:"abril",ano:2026},
  {cat:"Gasolina",monto:115,desc:"Gasolina",fecha:"2026-04-02",mes:"abril",ano:2026},
  {cat:"Ropa",monto:91,desc:"Playera",fecha:"2026-04-02",mes:"abril",ano:2026},
  {cat:"Estacionamientos",monto:23,desc:"Parco",fecha:"2026-04-02",mes:"abril",ano:2026},
  {cat:"Movistar",monto:301,desc:"Movistar",fecha:"2026-04-01",mes:"abril",ano:2026},
  {cat:"Golf Membersia",monto:4000,desc:"Partners Open",fecha:"2026-04-01",mes:"abril",ano:2026},
  {cat:"Inversión",monto:10000,desc:"Nu Bank",fecha:"2026-03-31",mes:"marzo",ano:2026},
  {cat:"Fact QRO",monto:2500,desc:"Queretaro abril",fecha:"2026-04-10",mes:"abril",ano:2026},
  {cat:"Salidas de Efectivo",monto:500,desc:"Efectivo",fecha:"2026-04-10",mes:"abril",ano:2026},
  {cat:"Supermercado",monto:21,desc:"Aguas",fecha:"2026-04-10",mes:"abril",ano:2026},
  {cat:"Salidas Personales",monto:200,desc:"Gelato",fecha:"2026-04-11",mes:"abril",ano:2026},
  {cat:"Salidas Midori",monto:270,desc:"McDonalds",fecha:"2026-04-11",mes:"abril",ano:2026},
  {cat:"Salidas Midori",monto:200,desc:"Tacos",fecha:"2026-04-12",mes:"abril",ano:2026},
  {cat:"Salidas Personales",monto:229,desc:"Pizza con DJ",fecha:"2026-04-12",mes:"abril",ano:2026},
  {cat:"Estacionamientos",monto:23,desc:"Parco",fecha:"2026-04-10",mes:"abril",ano:2026},
  {cat:"Supermercado",monto:134,desc:"Aguas",fecha:"2026-04-10",mes:"abril",ano:2026},
  {cat:"Gasolina",monto:1036,desc:"Gasolina",fecha:"2026-04-11",mes:"abril",ano:2026},
  {cat:"Estacionamientos",monto:12,desc:"Parco",fecha:"2026-04-12",mes:"abril",ano:2026},
  {cat:"Estacionamientos",monto:36,desc:"Parco",fecha:"2026-04-12",mes:"abril",ano:2026},
];

// ─── Tiny charts ─────────────────────────────────────────────────
function Sparkline({data,color}){
  if(data.length<2)return null;
  const max=Math.max(...data,1),W=72,H=28;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*W},${H-(v/max)*(H-4)-2}`).join(" ");
  return(<svg width={W} height={H} style={{position:"absolute",bottom:14,right:16,opacity:0.4}}><polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
}
function Donut({slices,size=120}){
  const total=slices.reduce((s,d)=>s+d.value,0)||1;
  const cx=size/2,cy=size/2,R=size/2-8,ri=R-28;let a=-Math.PI/2;
  const paths=slices.map(d=>{const da=(d.value/total)*2*Math.PI,x1=cx+R*Math.cos(a),y1=cy+R*Math.sin(a),xi1=cx+ri*Math.cos(a),yi1=cy+ri*Math.sin(a);a+=da;const x2=cx+R*Math.cos(a),y2=cy+R*Math.sin(a),xi2=cx+ri*Math.cos(a),yi2=cy+ri*Math.sin(a),lg=da>Math.PI?1:0;return{d:`M${x1},${y1} A${R},${R} 0 ${lg},1 ${x2},${y2} L${xi2},${yi2} A${ri},${ri} 0 ${lg},0 ${xi1},${yi1} Z`,c:d.color};});
  return(<svg width={size} height={size}>{paths.map((p,i)=><path key={i} d={p.d} fill={p.c}/>)}<circle cx={cx} cy={cy} r={ri-3} fill="#111827"/></svg>);
}
function MiniBar({labels,gastos,ingresos}){
  const max=Math.max(...gastos,...ingresos,1),H=90,W=300,pad=24,bw=14,step=(W-pad*2)/(labels.length||1);
  return(<svg width="100%" viewBox={`0 0 ${W} ${H+22}`} style={{overflow:"visible"}}>{labels.map((m,i)=>{const cx=pad+i*step+step/2;return(<g key={i}><rect x={cx-bw-2} y={H-(ingresos[i]/max)*H} width={bw} height={(ingresos[i]/max)*H} fill="#34d399" rx={3}/><rect x={cx+2} y={H-(gastos[i]/max)*H} width={bw} height={(gastos[i]/max)*H} fill="#fb923c" rx={3}/><text x={cx} y={H+15} textAnchor="middle" fontSize={9} fill="#4b5563" fontWeight={600}>{m}</text></g>);})}<line x1={pad-4} y1={0} x2={pad-4} y2={H} stroke="#1f2937" strokeWidth={1}/><line x1={pad-4} y1={H} x2={W-8} y2={H} stroke="#1f2937" strokeWidth={1}/></svg>);
}

// ─── Detail popup ────────────────────────────────────────────────
function DetailPopup({items, label, onClose}){
  if(!items)return null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div style={{background:"#111827",borderRadius:18,padding:0,width:"100%",maxWidth:400,border:"1px solid #1f2937",boxShadow:"0 24px 64px rgba(0,0,0,0.7)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #1f2937",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#4b5563",marginBottom:2}}>{label.mes} {label.ano}</div>
            <div style={{fontSize:15,fontWeight:700,color:"#f9fafb"}}>{label.cat}</div>
          </div>
          <button onClick={onClose} style={{background:"#1f2937",border:"none",color:"#6b7280",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{maxHeight:340,overflowY:"auto"}}>
          {items.length===0
            ? <div style={{padding:"24px 20px",color:"#374151",fontSize:13,textAlign:"center"}}>Sin movimientos</div>
            : items.map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 20px",borderBottom:i<items.length-1?"1px solid #0d1117":"none"}}>
                <div>
                  <div style={{fontSize:13,color:"#e5e7eb"}}>{r.desc}</div>
                  <div style={{fontSize:11,color:"#4b5563",marginTop:2}}>{r.fecha}</div>
                </div>
                <div style={{fontSize:13,fontWeight:600,color:"#f9fafb",flexShrink:0,marginLeft:16}}>{fmt(r.monto)}</div>
              </div>
            ))
          }
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #1f2937",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0d1117"}}>
          <span style={{fontSize:12,color:"#4b5563",fontWeight:600}}>Total</span>
          <span style={{fontSize:15,fontWeight:800,color:"#f9fafb"}}>{fmt(items.reduce((s,r)=>s+r.monto,0))}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Add Row ─────────────────────────────────────────────────────
function AddRow({cats,onSave,onCancel}){
  const [tipo,setTipo]=useState("gasto");
  const [fecha,setFecha]=useState(new Date().toISOString().split("T")[0]);
  const [catId,setCatId]=useState(()=>cats.find(c=>c.tipo==="gasto")?.id||cats[0]?.id);
  const [monto,setMonto]=useState("");const[desc,setDesc]=useState("");
  const inp={background:"#1f2937",border:"1px solid #374151",borderRadius:8,color:"#f9fafb",fontSize:13,padding:"7px 10px",outline:"none",width:"100%"};
  const avail=cats.filter(c=>c.tipo===tipo||(tipo==="gasto"&&c.tipo==="inversion"));
  return(
    <tr style={{background:"linear-gradient(90deg,#0c1a2e,#111827)",borderLeft:"3px solid #34d399"}}>
      <td style={{padding:"10px 12px",verticalAlign:"top"}}><input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} style={{...inp,width:130}}/></td>
      <td style={{padding:"10px 8px",verticalAlign:"top"}}>
        <select value={tipo} onChange={e=>{setTipo(e.target.value);setCatId(cats.find(c=>c.tipo===e.target.value||(e.target.value==="gasto"&&c.tipo==="inversion"))?.id);}} style={{...inp,marginBottom:6}}>
          <option value="ingreso">Ingreso</option><option value="gasto">Gasto / Inversión</option>
        </select>
        <select value={catId} onChange={e=>setCatId(Number(e.target.value))} style={inp}>{avail.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}</select>
      </td>
      <td style={{padding:"10px 8px",verticalAlign:"top"}}><input placeholder="Descripción" value={desc} onChange={e=>setDesc(e.target.value)} style={inp}/></td>
      <td style={{padding:"10px 8px",verticalAlign:"top",textAlign:"right"}}><input type="number" placeholder="0" value={monto} onChange={e=>setMonto(e.target.value)} style={{...inp,textAlign:"right",width:100}}/></td>
      <td style={{padding:"10px 8px",verticalAlign:"top"}}>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <button onClick={()=>{if(!monto||parseFloat(monto)<=0||!fecha)return;const cat=cats.find(c=>c.id===Number(catId))||cats[0];onSave({fecha,cat:cat.name,monto:parseFloat(monto),desc:desc||cat.name,mes:getMesFromFecha(fecha),ano:getAnoFromFecha(fecha)});}} style={{background:"#34d399",color:"#022c22",border:"none",borderRadius:8,padding:"7px 0",fontSize:12,fontWeight:700,cursor:"pointer"}}>✓ Guardar</button>
          <button onClick={onCancel} style={{background:"transparent",color:"#6b7280",border:"1px solid #374151",borderRadius:8,padding:"6px 0",fontSize:12,cursor:"pointer"}}>Cancelar</button>
        </div>
      </td>
    </tr>
  );
}

// ─── Cat Modal ────────────────────────────────────────────────────
function CatModal({cat,usedColors,usedEmojis,onSave,onClose}){
  const ownColor=cat?.color,ownEmoji=cat?.emoji;
  const [name,setName]=useState(cat?.name||"");const[emoji,setEmoji]=useState(cat?.emoji||"");const[color,setColor]=useState(cat?.color||"");
  const [tipo,setTipo]=useState(cat?.tipo||"gasto");const[naturaleza,setNaturaleza]=useState(cat?.naturaleza||"variable");
  const aC=ALL_PALETTE.filter(c=>c===ownColor||!usedColors.includes(c));
  const aE=ALL_EMOJIS.filter(e=>e===ownEmoji||!usedEmojis.includes(e));
  const ec=color&&aC.includes(color)?color:(aC[0]||ALL_PALETTE[0]);
  const ee=emoji&&aE.includes(emoji)?emoji:(aE[0]||ALL_EMOJIS[0]);
  const inp={background:"#1f2937",border:"1px solid #374151",borderRadius:10,color:"#f9fafb",fontSize:14,padding:"9px 12px",outline:"none",width:"100%"};
  const lbl={fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#4b5563",marginBottom:6,display:"block"};
  const Tog=({value,onChange,opts})=>(<div style={{display:"flex",background:"#1f2937",borderRadius:10,padding:3,gap:3}}>{opts.map(([val,label])=>(<button key={val} onClick={()=>onChange(val)} style={{flex:1,padding:"7px 0",fontSize:12,fontWeight:600,cursor:"pointer",border:"none",borderRadius:8,transition:"all 0.15s",background:value===val?"#374151":"transparent",color:value===val?"#f9fafb":"#6b7280"}}>{label}</button>))}</div>);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#111827",borderRadius:20,padding:28,width:"100%",maxWidth:420,border:"1px solid #1f2937",boxShadow:"0 24px 64px rgba(0,0,0,0.6)",maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}><div style={{fontSize:16,fontWeight:700,color:"#f9fafb"}}>{cat?"Editar categoría":"Nueva categoría"}</div><button onClick={onClose} style={{background:"transparent",border:"none",color:"#4b5563",fontSize:20,cursor:"pointer",lineHeight:1}}>✕</button></div>
        <div style={{display:"flex",alignItems:"center",gap:10,background:"#1f2937",borderRadius:12,padding:"10px 14px",marginBottom:22}}>
          <div style={{width:38,height:38,borderRadius:10,background:`${ec}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:`1px solid ${ec}40`}}>{ee||"?"}</div>
          <div><div style={{fontSize:14,fontWeight:600,color:"#f9fafb"}}>{name||"Sin nombre"}</div><div style={{fontSize:11,color:"#4b5563",marginTop:2}}><span style={{color:tipo==="ingreso"?"#34d399":tipo==="inversion"?"#4ade80":"#fb923c"}}>{tipo}</span>{" · "}<span style={{color:naturaleza==="fijo"?"#60a5fa":"#a78bfa"}}>{naturaleza}</span></div></div>
          <div style={{marginLeft:"auto",width:10,height:10,borderRadius:"50%",background:ec}}/>
        </div>
        <div style={{display:"grid",gap:18}}>
          <div><label style={lbl}>Nombre</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Ej: Netflix" style={inp}/></div>
          <div><label style={lbl}>Emoji <span style={{fontWeight:400,color:"#374151",textTransform:"none",letterSpacing:0}}>· {aE.length} disponibles</span></label>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,background:"#1f2937",borderRadius:12,padding:10,maxHeight:130,overflowY:"auto"}}>{ALL_EMOJIS.map(e=>{const taken=usedEmojis.includes(e)&&e!==ownEmoji;return(<button key={e} onClick={()=>!taken&&setEmoji(e)} style={{width:34,height:34,fontSize:18,cursor:taken?"not-allowed":"pointer",border:"none",borderRadius:8,background:ee===e?"#374151":"transparent",opacity:taken?0.2:1,transition:"all 0.1s"}}>{e}</button>);})}</div></div>
          <div><label style={lbl}>Color <span style={{fontWeight:400,color:"#374151",textTransform:"none",letterSpacing:0}}>· {aC.length} disponibles</span></label>
            <div style={{display:"flex",flexWrap:"wrap",gap:7,padding:"4px 0"}}>{ALL_PALETTE.map(c=>{const taken=usedColors.includes(c)&&c!==ownColor;return(<button key={c} onClick={()=>!taken&&setColor(c)} style={{width:26,height:26,borderRadius:6,background:taken?"#1f2937":"none",cursor:taken?"not-allowed":"pointer",border:ec===c?"2px solid #fff":"2px solid transparent",position:"relative",overflow:"hidden"}}>{taken?(<><div style={{width:"100%",height:"100%",background:c,opacity:0.15,borderRadius:4}}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:14,height:1.5,background:"#4b5563",transform:"rotate(45deg)"}}/></div></>):(<div style={{width:"100%",height:"100%",background:c,borderRadius:4}}/>)}</button>);})}</div></div>
          <div><label style={lbl}>Tipo</label><Tog value={tipo} onChange={setTipo} opts={[["ingreso","📈 Ingreso"],["gasto","💸 Gasto"],["inversion","💰 Inversión"]]}/></div>
          <div><label style={lbl}>Naturaleza</label><Tog value={naturaleza} onChange={setNaturaleza} opts={[["fijo","🔒 Fijo"],["variable","〰️ Variable"]]}/></div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:24}}>
          <button onClick={onClose} style={{flex:1,background:"transparent",color:"#6b7280",border:"1px solid #374151",borderRadius:10,padding:"10px 0",fontSize:14,fontWeight:600,cursor:"pointer"}}>Cancelar</button>
          <button onClick={()=>{if(!name.trim())return;onSave({...cat,name:name.trim(),emoji:ee,color:ec,tipo,naturaleza});}} style={{flex:2,background:"linear-gradient(135deg,#34d399,#22c55e)",color:"#022c22",border:"none",borderRadius:10,padding:"10px 0",fontSize:14,fontWeight:700,cursor:"pointer"}}>{cat?"Guardar cambios":"Crear categoría"}</button>
        </div>
      </div>
    </div>
  );
}

function CatCard({cat,txns,onEdit,onDelete}){
  const [confirm,setConfirm]=useState(false);
  const total=txns.filter(r=>r.cat===cat.name).reduce((s,r)=>s+r.monto,0);
  const count=txns.filter(r=>r.cat===cat.name).length;
  return(
    <div style={{background:"#111827",borderRadius:14,padding:"13px 14px",border:"1px solid #1f2937",display:"flex",alignItems:"center",gap:11}}>
      <div style={{width:38,height:38,borderRadius:11,background:`${cat.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0,border:`1px solid ${cat.color}30`}}>{cat.emoji}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3,flexWrap:"wrap"}}><span style={{fontSize:13,fontWeight:600,color:"#f9fafb"}}>{cat.name}</span>
          <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,letterSpacing:"0.06em",textTransform:"uppercase",background:cat.naturaleza==="fijo"?"rgba(96,165,250,0.1)":"rgba(167,139,250,0.1)",color:cat.naturaleza==="fijo"?"#60a5fa":"#a78bfa"}}>{cat.naturaleza}</span>
          {cat.tipo==="inversion"&&<span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,letterSpacing:"0.06em",textTransform:"uppercase",background:"rgba(74,222,128,0.1)",color:"#4ade80"}}>inversión</span>}
        </div>
        <div style={{fontSize:11,color:"#4b5563"}}>{count} mov. · {fmt(total)}</div>
      </div>
      <div style={{width:8,height:8,borderRadius:"50%",background:cat.color,flexShrink:0}}/>
      <div style={{display:"flex",gap:5,flexShrink:0}}>
        <button onClick={onEdit} style={{background:"#1f2937",border:"none",color:"#9ca3af",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✏️</button>
        {confirm?<button onClick={()=>{onDelete();setConfirm(false);}} style={{background:"#7f1d1d",border:"none",color:"#fca5a5",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>¿Sí?</button>:<button onClick={()=>setConfirm(true)} style={{background:"#1f2937",border:"none",color:"#6b7280",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>🗑️</button>}
      </div>
    </div>
  );
}

// ─── P&L Cash Flow Table ─────────────────────────────────────────
function CashFlowTable({txns,cats,ano}){
  const [exp,setExp]=useState({ingFijo:true,ingVar:true,gasFijo:true,gasVar:true,inv:true});
  const [popup,setPopup]=useState(null);
  const getCatObj=(n)=>cats.find(c=>c.name===n);
  const rowsForYear=txns.filter(r=>r.ano===ano);
  const val=(catName,mes)=>rowsForYear.filter(r=>r.cat===catName&&r.mes===mes).reduce((s,r)=>s+r.monto,0);
  const txnsForCell=(catName,mes)=>rowsForYear.filter(r=>r.cat===catName&&r.mes===mes);
  const txnsForSec=(catList,mes)=>rowsForYear.filter(r=>catList.some(c=>c.name===r.cat)&&r.mes===mes);
  const ingFijoCats =cats.filter(c=>c.tipo==="ingreso"&&c.naturaleza==="fijo");
  const ingVarCats  =cats.filter(c=>c.tipo==="ingreso"&&c.naturaleza==="variable");
  const gasFijoCats =cats.filter(c=>c.tipo==="gasto" &&c.naturaleza==="fijo");
  const gasVarCats  =cats.filter(c=>c.tipo==="gasto" &&c.naturaleza==="variable");
  const invCats     =cats.filter(c=>c.tipo==="inversion");
  const secTotal=(catList,mes)=>catList.reduce((s,c)=>s+val(c.name,mes),0);
  const totalIng=(mes)=>secTotal(ingFijoCats,mes)+secTotal(ingVarCats,mes);
  const totalGas=(mes)=>secTotal(gasFijoCats,mes)+secTotal(gasVarCats,mes);
  const neto    =(mes)=>totalIng(mes)-totalGas(mes);
  const totalInv=(mes)=>secTotal(invCats,mes);
  const yrVal  =(catName)=>MESES_ORDER.reduce((s,m)=>s+val(catName,m),0);
  const yrSec  =(catList)=>MESES_ORDER.reduce((s,m)=>s+secTotal(catList,m),0);
  const yrNeto =MESES_ORDER.reduce((s,m)=>s+neto(m),0);
  const yrInv  =MESES_ORDER.reduce((s,m)=>s+totalInv(m),0);
  const COL_W=80, LABEL_W=188;
  const openCell=(items,catLabel,mes)=>{if(!items.length)return;setPopup({items,label:{cat:catLabel,mes:capitalize(mes),ano}});};
  const numCell=(v,opts={})=>{
    const {bold=false,color=null,clickItems=null,clickLabel=null,clickMes=null,border=false}=opts;
    const c=color||(v===0?"#2d3748":"#e5e7eb");
    const clickable=clickItems&&clickItems.length>0;
    return(<td onClick={clickable?()=>openCell(clickItems,clickLabel,clickMes):undefined} style={{padding:"9px 10px",textAlign:"right",fontSize:12,fontWeight:bold?700:400,color:c,borderBottom:`1px solid ${border?"#1f2937":"#0d1117"}`,minWidth:COL_W,whiteSpace:"nowrap",cursor:clickable?"pointer":"default",borderLeft:border?"1px solid #374151":"none",transition:"background 0.1s"}} onMouseEnter={e=>{if(clickable)e.currentTarget.style.background="#1a2332";}} onMouseLeave={e=>{e.currentTarget.style.background="";}}>{v===0?"—":fmtShort(v)}</td>);
  };
  const sectionHdr=(label,accent,key,catList)=>(
    <tr style={{background:"#0d1117",cursor:"pointer"}} onClick={()=>setExp(p=>({...p,[key]:!p[key]}))}>
      <td style={{padding:"10px 16px",fontSize:11,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",color:accent,borderBottom:"1px solid #0d1117",position:"sticky",left:0,background:"#0d1117",zIndex:2,whiteSpace:"nowrap"}}>
        <span style={{marginRight:6,opacity:0.6}}>{exp[key]?"▾":"▸"}</span>{label}
      </td>
      {MESES_ORDER.map(m=>{const v=secTotal(catList,m);const items=txnsForSec(catList,m);const clickable=items.length>0;return(<td key={m} onClick={clickable?()=>openCell(items,label,m):undefined} style={{padding:"9px 10px",textAlign:"right",fontSize:12,fontWeight:700,color:v>0?accent:"#2d3748",borderBottom:"1px solid #0d1117",minWidth:COL_W,whiteSpace:"nowrap",cursor:clickable?"pointer":"default",transition:"background 0.1s"}} onMouseEnter={e=>{if(clickable)e.currentTarget.style.background="#1a2332";}} onMouseLeave={e=>{e.currentTarget.style.background="";}}>{v===0?"—":fmtShort(v)}</td>);})}
      <td style={{padding:"9px 10px",textAlign:"right",fontSize:12,fontWeight:700,color:yrSec(catList)>0?accent:"#2d3748",borderBottom:"1px solid #0d1117",borderLeft:"1px solid #374151",minWidth:COL_W,whiteSpace:"nowrap"}}>{yrSec(catList)===0?"—":fmtShort(yrSec(catList))}</td>
    </tr>
  );
  const catRow=(cat)=>(<tr key={cat.id} onMouseEnter={e=>e.currentTarget.style.background="#1a2332"} onMouseLeave={e=>e.currentTarget.style.background=""}><td style={{padding:"8px 16px 8px 28px",fontSize:12,color:"#6b7280",borderBottom:"1px solid #0d1117",position:"sticky",left:0,background:"inherit",zIndex:1,whiteSpace:"nowrap"}}><span style={{marginRight:7}}>{cat.emoji}</span>{cat.name}</td>{MESES_ORDER.map(m=>{const v=val(cat.name,m);const items=txnsForCell(cat.name,m);return numCell(v,{clickItems:items,clickLabel:cat.name,clickMes:m});})}{numCell(yrVal(cat.name),{color:"#9ca3af",border:true})}</tr>);
  const subtotalRow=(label,fn,accent)=>(<tr style={{background:"#0a1628"}}><td style={{padding:"9px 16px",fontSize:12,fontWeight:700,color:accent,borderTop:"1px solid #1f2937",borderBottom:"1px solid #1f2937",position:"sticky",left:0,background:"#0a1628",zIndex:2}}>{label}</td>{MESES_ORDER.map(m=>{const v=fn(m);const items=txnsForSec(label.includes("ING")?[...ingFijoCats,...ingVarCats]:label.includes("GAS")?[...gasFijoCats,...gasVarCats]:invCats,m);const clickable=items.length>0;return(<td key={m} onClick={clickable?()=>openCell(items,label,m):undefined} style={{padding:"9px 10px",textAlign:"right",fontSize:12,fontWeight:700,color:v>0?accent:"#2d3748",borderTop:"1px solid #1f2937",borderBottom:"1px solid #1f2937",minWidth:COL_W,whiteSpace:"nowrap",cursor:clickable?"pointer":"default",transition:"background 0.1s"}} onMouseEnter={e=>{if(clickable)e.currentTarget.style.background="#1a2332";}} onMouseLeave={e=>{e.currentTarget.style.background="";}}>{v===0?"—":fmtShort(v)}</td>);})}<td style={{padding:"9px 10px",textAlign:"right",fontSize:12,fontWeight:700,color:MESES_ORDER.reduce((s,m)=>s+fn(m),0)>0?accent:"#2d3748",borderTop:"1px solid #1f2937",borderBottom:"1px solid #1f2937",borderLeft:"1px solid #374151",minWidth:COL_W,whiteSpace:"nowrap"}}>{MESES_ORDER.reduce((s,m)=>s+fn(m),0)===0?"—":fmtShort(MESES_ORDER.reduce((s,m)=>s+fn(m),0))}</td></tr>);
  const divider=()=><tr><td colSpan={14} style={{height:6,background:"transparent",padding:0}}></td></tr>;
  return(
    <>
      <div style={{overflowX:"auto",borderRadius:16,border:"1px solid #1f2937",background:"#111827"}}>
        <table style={{borderCollapse:"collapse",width:"100%",minWidth:LABEL_W+13*COL_W}}>
          <thead>
            <tr style={{background:"#0d1117"}}>
              <th style={{padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",color:"#374151",borderBottom:"2px solid #1f2937",position:"sticky",left:0,background:"#0d1117",zIndex:3,minWidth:LABEL_W}}>Concepto</th>
              {MESES_ORDER.map(m=>(<th key={m} style={{padding:"10px 10px",textAlign:"right",fontSize:10,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:"#4b5563",borderBottom:"2px solid #1f2937",minWidth:COL_W,whiteSpace:"nowrap"}}>{MESES_SHORT[MESES_ORDER.indexOf(m)]}</th>))}
              <th style={{padding:"10px 10px",textAlign:"right",fontSize:10,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:"#34d399",borderBottom:"2px solid #1f2937",borderLeft:"1px solid #374151",minWidth:COL_W,whiteSpace:"nowrap"}}>Total</th>
            </tr>
          </thead>
          <tbody>
            {sectionHdr("Ingresos Fijos","#34d399","ingFijo",ingFijoCats)}
            {exp.ingFijo&&ingFijoCats.map(catRow)}
            {divider()}
            {sectionHdr("Ingresos Variables","#4ade80","ingVar",ingVarCats)}
            {exp.ingVar&&ingVarCats.map(catRow)}
            {divider()}
            {subtotalRow("TOTAL INGRESOS",totalIng,"#34d399")}
            {divider()}
            {sectionHdr("Gastos Fijos","#f87171","gasFijo",gasFijoCats)}
            {exp.gasFijo&&gasFijoCats.map(catRow)}
            {divider()}
            {sectionHdr("Gastos Variables","#fb923c","gasVar",gasVarCats)}
            {exp.gasVar&&gasVarCats.map(catRow)}
            {divider()}
            {subtotalRow("TOTAL GASTOS",totalGas,"#fb923c")}
            {divider()}
            <tr style={{background:"#0d1117"}}>
              <td style={{padding:"13px 16px",fontSize:13,fontWeight:800,letterSpacing:"0.04em",color:"#f9fafb",borderTop:"2px solid #374151",position:"sticky",left:0,background:"#0d1117",zIndex:2}}>FLUJO NETO</td>
              {MESES_ORDER.map(m=>{const v=neto(m);const items=[...txnsForSec(ingFijoCats,m),...txnsForSec(ingVarCats,m),...txnsForSec(gasFijoCats,m),...txnsForSec(gasVarCats,m)];const clickable=items.length>0;return(<td key={m} onClick={clickable?()=>openCell(items,"Flujo Neto",m):undefined} style={{padding:"13px 10px",textAlign:"right",fontSize:13,fontWeight:800,color:v>0?"#34d399":v<0?"#f87171":"#2d3748",borderTop:"2px solid #374151",minWidth:COL_W,whiteSpace:"nowrap",cursor:clickable?"pointer":"default",transition:"background 0.1s"}} onMouseEnter={e=>{if(clickable)e.currentTarget.style.background="#1a2332";}} onMouseLeave={e=>{e.currentTarget.style.background="";}}>{v===0?"—":fmtShort(v)}</td>);})}
              <td style={{padding:"13px 10px",textAlign:"right",fontSize:13,fontWeight:800,color:yrNeto>0?"#34d399":yrNeto<0?"#f87171":"#2d3748",borderTop:"2px solid #374151",borderLeft:"1px solid #374151",minWidth:COL_W,whiteSpace:"nowrap"}}>{yrNeto===0?"—":fmtShort(yrNeto)}</td>
            </tr>
            {divider()}
            {sectionHdr("Inversiones","#4ade80","inv",invCats)}
            {exp.inv&&invCats.map(catRow)}
            {divider()}
            <tr style={{background:"#0a1628"}}>
              <td style={{padding:"9px 16px",fontSize:12,fontWeight:700,color:"#4ade80",borderTop:"1px solid #1f2937",borderBottom:"1px solid #1f2937",position:"sticky",left:0,background:"#0a1628",zIndex:2}}>TOTAL INVERTIDO</td>
              {MESES_ORDER.map(m=>{const v=totalInv(m);const items=txnsForSec(invCats,m);const clickable=items.length>0;return(<td key={m} onClick={clickable?()=>openCell(items,"Inversiones",m):undefined} style={{padding:"9px 10px",textAlign:"right",fontSize:12,fontWeight:700,color:v>0?"#4ade80":"#2d3748",borderTop:"1px solid #1f2937",borderBottom:"1px solid #1f2937",minWidth:COL_W,whiteSpace:"nowrap",cursor:clickable?"pointer":"default",transition:"background 0.1s"}} onMouseEnter={e=>{if(clickable)e.currentTarget.style.background="#1a2332";}} onMouseLeave={e=>{e.currentTarget.style.background="";}}>{v===0?"—":fmtShort(v)}</td>);})}
              <td style={{padding:"9px 10px",textAlign:"right",fontSize:12,fontWeight:700,color:yrInv>0?"#4ade80":"#2d3748",borderTop:"1px solid #1f2937",borderBottom:"1px solid #1f2937",borderLeft:"1px solid #374151",minWidth:COL_W,whiteSpace:"nowrap"}}>{yrInv===0?"—":fmtShort(yrInv)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {popup&&<DetailPopup items={popup.items} label={popup.label} onClose={()=>setPopup(null)}/>}
    </>
  );
}

// ─── Golf Tab Component ───────────────────────────────────────────
function GolfTab({golfSales,showGolfAdd,setShowGolfAdd,golfFecha,setGolfFecha,golfCliente,setGolfCliente,golfInvitados,golfMonto,setGolfMonto,golfNotas,setGolfNotas,golfEfectivo,setGolfEfectivo,golfAnoFilt,setGolfAnoFilt,golfMesFilt,setGolfMesFilt,golfEditId,setGolfEditId,onSaveGolfSale,onDeleteGolfSale,onUpdateEfectivo,onAddInvitado,onDeleteInvitado,sel,showToast}){
  const golfAnos=[...new Set(golfSales.map(s=>s.ano))].sort((a,b)=>a-b);
  const golfActiveMeses=useMemo(()=>{const base=golfAnoFilt==="todos"?golfSales:golfSales.filter(s=>s.ano===Number(golfAnoFilt));return MESES_ORDER.filter(m=>base.some(s=>s.mes===m));},[golfSales,golfAnoFilt]);
  const filteredSales=useMemo(()=>{let s=[...golfSales];if(golfAnoFilt!=="todos") s=s.filter(x=>x.ano===Number(golfAnoFilt));if(golfMesFilt!=="todos") s=s.filter(x=>x.mes===golfMesFilt);return s.sort((a,b)=>b.fecha.localeCompare(a.fecha));},[golfSales,golfAnoFilt,golfMesFilt]);
  const totalFilt=filteredSales.reduce((s,x)=>s+x.monto,0);
  const monthlyStats=MESES_ORDER.map(m=>{const base=golfAnoFilt==="todos"?golfSales:golfSales.filter(s=>s.ano===Number(golfAnoFilt));const inMes=base.filter(s=>s.mes===m);return{mes:m,count:inMes.length,total:inMes.reduce((s,x)=>s+x.monto,0)};}).filter(x=>x.count>0);
  const inp={background:"#1f2937",border:"1px solid #374151",borderRadius:10,color:"#f9fafb",fontSize:13,padding:"8px 12px",outline:"none",width:"100%"};
  const handleSaveGolf=async()=>{
    if(!golfFecha||!golfCliente.trim()||!golfMonto||parseFloat(golfMonto)<=0)return;
    const mes=getMesFromFecha(golfFecha),ano=getAnoFromFecha(golfFecha);
    await onSaveGolfSale({id:golfEditId||undefined,fecha:golfFecha,mes,ano,cliente:golfCliente.trim(),monto:parseFloat(golfMonto),notas:golfNotas,efectivo:golfEfectivo});
    setGolfFecha(new Date().toISOString().split("T")[0]);
    setGolfCliente("");setGolfMonto("");setGolfNotas("");setGolfEfectivo("no");
    setGolfEditId(null);setShowGolfAdd(false);
  };
  const startEdit=(s)=>{setGolfFecha(s.fecha);setGolfCliente(s.cliente);setGolfMonto(String(s.monto));setGolfNotas(s.notas||"");setGolfEfectivo(s.efectivo||"no");setGolfEditId(s.id);setShowGolfAdd(true);};
  const deleteGolf=(id)=>onDeleteGolfSale(id);
  const [newInvitado,setNewInvitado]=useState("");
  const addInvitado=()=>{const nombre=newInvitado.trim();if(!nombre||golfInvitados.some(i=>i.nombre.toLowerCase()===nombre.toLowerCase()))return;onAddInvitado(nombre);setNewInvitado("");};
  const deleteInvitado=(id)=>onDeleteInvitado(id);
  return(
    <>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
        {[{label:"Pases vendidos",val:filteredSales.length,isMoney:false,color:"#60a5fa"},{label:"Total cobrado",val:totalFilt,isMoney:true,color:"#34d399"},{label:"Por cobrar / efectivo",val:filteredSales.filter(s=>s.efectivo==="no").reduce((s,x)=>s+x.monto,0),isMoney:true,color:"#fb923c"}].map(({label,val,isMoney,color})=>(<div key={label} style={{background:"#111827",borderRadius:16,padding:"18px 20px",borderTop:`2px solid ${color}20`}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#4b5563",marginBottom:6}}>{label}</div><div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em",color}}>{isMoney?fmt(val):val}</div></div>))}
      </div>
      {monthlyStats.length>0&&(<div style={{background:"#111827",borderRadius:16,padding:"18px 20px",marginBottom:20,border:"1px solid #1f2937"}}><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#374151",marginBottom:14}}>Por mes</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{monthlyStats.map(({mes,count,total})=>(<div key={mes} onClick={()=>setGolfMesFilt(golfMesFilt===mes?"todos":mes)} style={{background:golfMesFilt===mes?"#1e3a5f":"#0d1117",borderRadius:12,padding:"10px 14px",cursor:"pointer",border:`1px solid ${golfMesFilt===mes?"rgba(96,165,250,0.3)":"#1f2937"}`,transition:"all 0.15s",minWidth:80}}><div style={{fontSize:11,fontWeight:700,color:golfMesFilt===mes?"#60a5fa":"#4b5563",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{MESES_SHORT[MESES_ORDER.indexOf(mes)]}</div><div style={{fontSize:15,fontWeight:800,color:"#f9fafb"}}>{count} pases</div><div style={{fontSize:11,color:"#4b5563",marginTop:2}}>{fmt(total)}</div></div>))}</div></div>)}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <select style={sel} value={golfAnoFilt} onChange={e=>{setGolfAnoFilt(e.target.value);setGolfMesFilt("todos");}}><option value="todos">Todos los años</option>{golfAnos.map(a=><option key={a} value={a}>{a}</option>)}</select>
          <select style={sel} value={golfMesFilt} onChange={e=>setGolfMesFilt(e.target.value)}><option value="todos">Todos los meses</option>{golfActiveMeses.map(m=><option key={m} value={m}>{capitalize(m)}</option>)}</select>
        </div>
        <button onClick={()=>{if(showGolfAdd&&golfEditId===null){setShowGolfAdd(false);}else{setGolfEditId(null);setGolfFecha(new Date().toISOString().split("T")[0]);setGolfCliente("");setGolfMonto("");setGolfNotas("");setShowGolfAdd(v=>!v);}}} style={{display:"inline-flex",alignItems:"center",gap:6,background:showGolfAdd&&golfEditId===null?"#1f2937":"linear-gradient(135deg,#34d399,#22c55e)",color:showGolfAdd&&golfEditId===null?"#6b7280":"#022c22",border:showGolfAdd&&golfEditId===null?"1px solid #374151":"none",borderRadius:10,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.2s"}}>{showGolfAdd&&golfEditId===null?"✕ Cancelar":"+ Nuevo pase"}</button>
      </div>
      {showGolfAdd&&(<div style={{background:"#111827",borderRadius:16,padding:"20px 22px",marginBottom:16,border:"1px solid rgba(96,165,250,0.2)"}}><div style={{fontSize:13,fontWeight:700,color:"#60a5fa",marginBottom:16}}>{golfEditId!==null?"Editar pase":"Nuevo pase de golf"}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#4b5563",marginBottom:5}}>Fecha</div><input type="date" value={golfFecha} onChange={e=>setGolfFecha(e.target.value)} style={inp}/></div><div><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#4b5563",marginBottom:5}}>Monto (MXN)</div><input type="number" placeholder="0" value={golfMonto} onChange={e=>setGolfMonto(e.target.value)} style={{...inp,textAlign:"right"}}/></div><div><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#4b5563",marginBottom:5}}>Efectivo</div><select value={golfEfectivo} onChange={e=>setGolfEfectivo(e.target.value)} style={inp}><option value="no">No</option><option value="si">Sí</option></select></div><div style={{gridColumn:"1/-1"}}><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#4b5563",marginBottom:5}}>Invitado</div><select value={golfCliente} onChange={e=>setGolfCliente(e.target.value)} style={inp}><option value="">— Seleccionar invitado —</option>{golfInvitados.map(inv=><option key={inv.id} value={inv.nombre}>{inv.nombre}</option>)}</select></div><div style={{gridColumn:"1/-1"}}><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#4b5563",marginBottom:5}}>Notas (opcional)</div><input placeholder="Ej: Invitado del socio, torneo, green fee..." value={golfNotas} onChange={e=>setGolfNotas(e.target.value)} style={inp}/></div></div><div style={{display:"flex",gap:10,marginTop:16}}><button onClick={()=>{setShowGolfAdd(false);setGolfEditId(null);}} style={{flex:1,background:"transparent",color:"#6b7280",border:"1px solid #374151",borderRadius:10,padding:"9px 0",fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancelar</button><button onClick={handleSaveGolf} style={{flex:2,background:"linear-gradient(135deg,#34d399,#22c55e)",color:"#022c22",border:"none",borderRadius:10,padding:"9px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>{golfEditId!==null?"Guardar cambios":"Registrar pase"}</button></div></div>)}
      <div style={{background:"#111827",borderRadius:18,overflow:"hidden",border:"1px solid #1f2937"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#0d1117"}}>{["Fecha","Invitado","Notas","Efectivo","Monto",""].map((h,i)=>(<th key={i} style={{textAlign:i===4?"right":"left",color:"#374151",fontWeight:700,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",padding:"8px 12px",borderBottom:"1px solid #1f2937"}}>{h}</th>))}</tr></thead><tbody>{filteredSales.map((s,i)=>(<tr key={s.id} style={{background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}><td style={{padding:"11px 12px",borderBottom:"1px solid #111827",color:"#4b5563",fontSize:12,whiteSpace:"nowrap"}}>{s.fecha}</td><td style={{padding:"11px 12px",borderBottom:"1px solid #111827",fontSize:13,color:"#e5e7eb",fontWeight:500}}>{s.cliente}</td><td style={{padding:"11px 12px",borderBottom:"1px solid #111827",color:"#6b7280",fontSize:12}}>{s.notas||"—"}</td><td style={{padding:"8px 12px",borderBottom:"1px solid #111827"}}><select value={s.efectivo||"no"} onChange={e=>onUpdateEfectivo(s.id,e.target.value)} style={{background:s.efectivo==="si"?"rgba(52,211,153,0.12)":"rgba(251,146,60,0.12)",color:s.efectivo==="si"?"#34d399":"#fb923c",border:`1px solid ${s.efectivo==="si"?"rgba(52,211,153,0.3)":"rgba(251,146,60,0.3)"}`,borderRadius:20,fontSize:11,fontWeight:700,padding:"3px 8px",outline:"none",cursor:"pointer",letterSpacing:"0.04em"}}><option value="no" style={{background:"#1f2937",color:"#fb923c"}}>No</option><option value="si" style={{background:"#1f2937",color:"#34d399"}}>Sí</option></select></td><td style={{padding:"11px 12px",borderBottom:"1px solid #111827",textAlign:"right",fontWeight:700,fontSize:14,color:"#60a5fa"}}>+{fmt(s.monto)}</td><td style={{padding:"11px 12px",borderBottom:"1px solid #111827"}}><div style={{display:"flex",gap:5,justifyContent:"flex-end"}}><button onClick={()=>startEdit(s)} style={{background:"#1f2937",border:"none",color:"#9ca3af",borderRadius:7,width:28,height:28,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>✏️</button><button onClick={()=>deleteGolf(s.id)} style={{background:"#1f2937",border:"none",color:"#6b7280",borderRadius:7,width:28,height:28,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>🗑️</button></div></td></tr>))}{filteredSales.length===0&&(<tr><td colSpan={6} style={{padding:48,textAlign:"center",color:"#374151"}}>Sin pases registrados para este período</td></tr>)}</tbody></table></div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontSize:12,color:"#374151"}}><span>{filteredSales.length} pases</span><span>Total: {fmt(totalFilt)}</span></div>
      <div style={{background:"#111827",borderRadius:18,border:"1px solid #1f2937",marginTop:28,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #1f2937",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:700,color:"#f9fafb"}}>Invitados</div><div style={{fontSize:11,color:"#4b5563",marginTop:2}}>{golfInvitados.length} registrados</div></div></div>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #1f2937",display:"flex",gap:8}}><input placeholder="Nombre del invitado..." value={newInvitado} onChange={e=>setNewInvitado(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addInvitado()} style={{flex:1,background:"#1f2937",border:"1px solid #374151",borderRadius:10,color:"#f9fafb",fontSize:13,padding:"8px 12px",outline:"none"}}/><button onClick={addInvitado} style={{background:"linear-gradient(135deg,#34d399,#22c55e)",color:"#022c22",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>+ Agregar</button></div>
        {golfInvitados.length===0?<div style={{padding:"28px 20px",textAlign:"center",color:"#374151",fontSize:13}}>Sin invitados registrados</div>:golfInvitados.map((inv,i)=>{const pases=golfSales.filter(s=>s.cliente===inv.nombre).length;const total=golfSales.filter(s=>s.cliente===inv.nombre).reduce((s,x)=>s+x.monto,0);return(<div key={inv.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 20px",borderBottom:i<golfInvitados.length-1?"1px solid #0d1117":"none"}}><div style={{width:34,height:34,borderRadius:"50%",background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#60a5fa",flexShrink:0}}>{inv.nombre.charAt(0).toUpperCase()}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,color:"#e5e7eb"}}>{inv.nombre}</div><div style={{fontSize:11,color:"#4b5563",marginTop:2}}>{pases} {pases===1?"pase":"pases"}{pases>0?` · ${fmt(total)}`:""}</div></div><button onClick={()=>deleteInvitado(inv.id)} style={{background:"transparent",border:"none",color:"#374151",cursor:"pointer",fontSize:16,lineHeight:1,padding:"4px",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}} onMouseEnter={e=>e.currentTarget.style.color="#f87171"} onMouseLeave={e=>e.currentTarget.style.color="#374151"}>🗑️</button></div>);})}
      </div>
    </>
  );
}

// ─── Main App ─────────────────────────────────────────────────────
export default function GastosTracker(){
  const [dbReady, setDbReady]   = useState(false);
  const [loading, setLoading]   = useState(true);
  const [txns,setTxns]          = useState([]);
  const [cats,setCats]          = useState(INITIAL_CATS);
  const [tab,setTab]            = useState("resumen");
  const [appPassword, setAppPassword] = useState("2264");
  const [unlocked, setUnlocked]       = useState(false);
  const [loginInput, setLoginInput]   = useState("");
  const [loginError, setLoginError]   = useState(false);
  const [newPw,setNewPw]              = useState("");
  const [confirmPw,setConfirmPw]      = useState("");
  const [pwMsg,setPwMsg]              = useState(null);
  const [mesFiltro,setMesFiltro] = useState("todos");
  const [anoFiltro,setAnoFiltro] = useState("todos");
  const [catTipo,setCatTipo]     = useState("gasto");
  const [filtTipo,setFiltTipo]   = useState("todos");
  const [filtCat,setFiltCat]     = useState("todos");
  const [showAdd,setShowAdd]     = useState(false);
  const [modalCat,setModalCat]   = useState(null);
  const [toast,setToast]         = useState(null);
  const [catFilter,setCatFilter] = useState("todos");
  const [cfAno,setCfAno]         = useState(2026);
  const [showGolfAdd,setShowGolfAdd] = useState(false);
  const [golfFecha,setGolfFecha]     = useState(new Date().toISOString().split("T")[0]);
  const [golfCliente,setGolfCliente] = useState("");
  const [golfInvitados,setGolfInvitados] = useState([]);
  const [golfMonto,setGolfMonto]     = useState("");
  const [golfNotas,setGolfNotas]     = useState("");
  const [golfEfectivo,setGolfEfectivo] = useState("no");
  const [golfAnoFilt,setGolfAnoFilt] = useState("todos");
  const [golfMesFilt,setGolfMesFilt] = useState("todos");
  const [golfEditId,setGolfEditId]   = useState(null);
  const [golfSales, setGolfSales]    = useState([]);

  // ── Supabase: seed + load ─────────────────────────────────────
  useEffect(()=>{
    async function initDB(){
      setLoading(true);
      try {
        // Load password
        const {data:pwData}=await supabase.from("settings").select("value").eq("key","app_password").single();
        if(pwData) setAppPassword(pwData.value);

        // Check if transactions already seeded
        const {count}=await supabase.from("transactions").select("*",{count:"exact",head:true});
        if(count===0){
          // Seed transactions
          const txnRows=RAW_DATA.filter(r=>r.cat!=="Golf Ingreso").map((r,i)=>({id:i+1,cat:r.cat,monto:r.monto,descripcion:r.desc,fecha:r.fecha,mes:r.mes,ano:r.ano}));
          await supabase.from("transactions").insert(txnRows);

          // Seed categories
          await supabase.from("categories").insert(INITIAL_CATS);

          // Seed golf sales from RAW_DATA Golf Ingreso
          const golfRows=RAW_DATA.filter(r=>r.cat==="Golf Ingreso").map((r,i)=>({id:9000+i,fecha:r.fecha,mes:r.mes,ano:r.ano,cliente:r.desc,monto:r.monto,notas:"",efectivo:"no"}));
          await supabase.from("golf_sales").insert(golfRows);

          // Seed invitados
          const names=[...new Set(RAW_DATA.filter(r=>r.cat==="Golf Ingreso").map(r=>r.desc))].sort();
          const invRows=names.map((n,i)=>({id:8000+i,nombre:n}));
          if(invRows.length>0) await supabase.from("golf_invitados").insert(invRows);
        }

        // Load all data
        await loadAll();
        setDbReady(true);
      } catch(e){
        console.error("DB init error:",e);
        // Fallback to local data
        setTxns(RAW_DATA.filter(r=>r.cat!=="Golf Ingreso").map((r,i)=>({...r,id:i+1,desc:r.desc})));
        setCats(INITIAL_CATS);
        const golfRows=RAW_DATA.filter(r=>r.cat==="Golf Ingreso").map((r,i)=>({id:9000+i,fecha:r.fecha,mes:r.mes,ano:r.ano,cliente:r.desc,monto:r.monto,notas:"",efectivo:"no"}));
        setGolfSales(golfRows);
        const names=[...new Set(RAW_DATA.filter(r=>r.cat==="Golf Ingreso").map(r=>r.desc))].sort();
        setGolfInvitados(names.map((n,i)=>({id:8000+i,nombre:n})));
        setDbReady(true);
      }
      setLoading(false);
    }
    initDB();
  },[]);

  async function loadAll(){
    const [{data:txnData},{data:catData},{data:golfData},{data:invData}]=await Promise.all([
      supabase.from("transactions").select("*").order("fecha"),
      supabase.from("categories").select("*"),
      supabase.from("golf_sales").select("*").order("fecha"),
      supabase.from("golf_invitados").select("*").order("nombre"),
    ]);
    if(txnData) setTxns(txnData.map(r=>({...r,desc:r.descripcion})));
    if(catData&&catData.length>0) setCats(catData);
    if(golfData) setGolfSales(golfData);
    if(invData) setGolfInvitados(invData);
  }

  const usedColors=useMemo(()=>cats.map(c=>c.color),[cats]);
  const usedEmojis=useMemo(()=>cats.map(c=>c.emoji),[cats]);
  const getCatObj =(n)=>cats.find(c=>c.name===n);
  const isIngreso =(n)=>{const t=getCatObj(n)?.tipo;return t==="ingreso";};
  const isInversion=(n)=>getCatObj(n)?.tipo==="inversion";
  const getCatColor=(n)=>getCatObj(n)?.color||"#6b7280";
  const getCatEmoji=(n)=>getCatObj(n)?.emoji||"💰";

  const golfTxns = useMemo(()=>golfSales.map(s=>({id:s.id,cat:"Golf Ingreso",monto:s.monto,desc:s.cliente,fecha:s.fecha,mes:s.mes,ano:s.ano})),[golfSales]);
  const allTxns  = useMemo(()=>[...txns.filter(r=>r.cat!=="Golf Ingreso"),...golfTxns],[txns,golfTxns]);
  const allAnos  = useMemo(()=>[...new Set(allTxns.map(r=>r.ano))].sort((a,b)=>a-b),[allTxns]);
  const activeMeses=useMemo(()=>{const base=anoFiltro==="todos"?allTxns:allTxns.filter(r=>r.ano===Number(anoFiltro));return MESES_ORDER.filter(m=>base.some(r=>r.mes===m));},[allTxns,anoFiltro]);

  const byFiltro=(m)=>{let rows=anoFiltro==="todos"?allTxns:allTxns.filter(r=>r.ano===Number(anoFiltro));if(m!=="todos") rows=rows.filter(r=>r.mes===m);return rows;};
  const summary=useMemo(()=>{const rows=byFiltro(mesFiltro);const ing=rows.filter(r=>isIngreso(r.cat)).reduce((s,r)=>s+r.monto,0);const gas=rows.filter(r=>getCatObj(r.cat)?.tipo==="gasto").reduce((s,r)=>s+r.monto,0);const inv=rows.filter(r=>isInversion(r.cat)).reduce((s,r)=>s+r.monto,0);return{ing,gas,inv,bal:ing-gas,n:rows.length};},[allTxns,cats,mesFiltro,anoFiltro]);
  const catBreakdown=useMemo(()=>{const rows=byFiltro(mesFiltro).filter(r=>getCatObj(r.cat)?.tipo===catTipo);const map={};rows.forEach(r=>{map[r.cat]=(map[r.cat]||0)+r.monto;});return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([cat,value])=>({cat,value,color:getCatColor(cat)}));},[allTxns,cats,mesFiltro,anoFiltro,catTipo]);
  const trendG=useMemo(()=>activeMeses.map(m=>byFiltro(m).filter(r=>getCatObj(r.cat)?.tipo==="gasto").reduce((s,r)=>s+r.monto,0)),[allTxns,cats,activeMeses,anoFiltro]);
  const trendI=useMemo(()=>activeMeses.map(m=>byFiltro(m).filter(r=>isIngreso(r.cat)).reduce((s,r)=>s+r.monto,0)),[allTxns,cats,activeMeses,anoFiltro]);
  const filtered=useMemo(()=>{let rows=byFiltro(mesFiltro).filter(r=>r.cat!=="Golf Ingreso");if(filtTipo==="ingreso") rows=rows.filter(r=>isIngreso(r.cat));if(filtTipo==="gasto") rows=rows.filter(r=>getCatObj(r.cat)?.tipo==="gasto");if(filtTipo==="inversion") rows=rows.filter(r=>isInversion(r.cat));if(filtCat!=="todos") rows=rows.filter(r=>r.cat===filtCat);return[...rows].sort((a,b)=>b.fecha.localeCompare(a.fecha)||b.id-a.id);},[allTxns,cats,mesFiltro,anoFiltro,filtTipo,filtCat]);
  const txnIndexMap=useMemo(()=>{const all=[...allTxns].filter(r=>r.cat!=="Golf Ingreso").sort((a,b)=>a.fecha.localeCompare(b.fecha)||a.id-b.id);const map={};all.forEach((r,i)=>{map[r.id]=i+1;});return map;},[allTxns]);
  const filteredCats=useMemo(()=>{let c=[...cats];if(catFilter==="ingreso") c=c.filter(x=>x.tipo==="ingreso");if(catFilter==="gasto") c=c.filter(x=>x.tipo==="gasto");if(catFilter==="inversion") c=c.filter(x=>x.tipo==="inversion");if(catFilter==="fijo") c=c.filter(x=>x.naturaleza==="fijo");if(catFilter==="variable") c=c.filter(x=>x.naturaleza==="variable");return c.sort((a,b)=>a.name.localeCompare(b.name));},[cats,catFilter]);

  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(null),3000);};

  // ── Handlers with Supabase ────────────────────────────────────
  const handleSaveTxn=async({fecha,cat,monto,desc,mes,ano})=>{
    const newId=Date.now();
    const row={id:newId,cat,monto,descripcion:desc,fecha,mes,ano};
    const{error}=await supabase.from("transactions").insert(row);
    if(!error) setTxns(p=>[...p,{...row,desc}]);
    setShowAdd(false);
    showToast(`${isIngreso(cat)?"📈":isInversion(cat)?"💰":"💸"} ${fmt(monto)} agregado`);
  };

  const handleSaveCat=async(cat)=>{
    if(cat.id){
      await supabase.from("categories").update(cat).eq("id",cat.id);
      setCats(p=>p.map(c=>c.id===cat.id?cat:c));
      showToast("✓ Categoría actualizada");
    } else {
      const newId=Date.now();
      const newCat={...cat,id:newId};
      await supabase.from("categories").insert(newCat);
      setCats(p=>[...p,newCat]);
      showToast("✓ Categoría creada");
    }
    setModalCat(null);
  };

  const handleDeleteCat=async(id)=>{
    await supabase.from("categories").delete().eq("id",id);
    setCats(p=>p.filter(c=>c.id!==id));
    showToast("Categoría eliminada");
  };

  const handleSaveGolfSale=async({id,fecha,mes,ano,cliente,monto,notas,efectivo})=>{
    if(id){
      await supabase.from("golf_sales").update({fecha,mes,ano,cliente,monto,notas,efectivo}).eq("id",id);
      setGolfSales(p=>p.map(s=>s.id===id?{...s,fecha,mes,ano,cliente,monto,notas,efectivo}:s));
    } else {
      const newId=Date.now();
      const row={id:newId,fecha,mes,ano,cliente,monto,notas,efectivo};
      await supabase.from("golf_sales").insert(row);
      setGolfSales(p=>[...p,row]);
    }
    showToast("⛳ Pase de golf registrado");
  };

  const handleDeleteGolfSale=async(id)=>{
    await supabase.from("golf_sales").delete().eq("id",id);
    setGolfSales(p=>p.filter(s=>s.id!==id));
    showToast("Pase eliminado");
  };

  const handleUpdateGolfEfectivo=async(id,efectivo)=>{
    await supabase.from("golf_sales").update({efectivo}).eq("id",id);
    setGolfSales(p=>p.map(s=>s.id===id?{...s,efectivo}:s));
  };

  const handleAddInvitado=async(nombre)=>{
    const newId=Date.now();
    await supabase.from("golf_invitados").insert({id:newId,nombre});
    setGolfInvitados(p=>[...p,{id:newId,nombre}].sort((a,b)=>a.nombre.localeCompare(b.nombre)));
    showToast("Invitado agregado");
  };

  const handleDeleteInvitado=async(id)=>{
    await supabase.from("golf_invitados").delete().eq("id",id);
    setGolfInvitados(p=>p.filter(i=>i.id!==id));
  };

  const handleChangePassword=async()=>{
    if(!newPw||newPw.length<3){setPwMsg({text:"Mínimo 3 caracteres",ok:false});return;}
    if(newPw!==confirmPw){setPwMsg({text:"Las contraseñas no coinciden",ok:false});return;}
    await supabase.from("settings").upsert({key:"app_password",value:newPw});
    setAppPassword(newPw);
    setNewPw("");setConfirmPw("");setPwMsg({text:"✓ Contraseña actualizada",ok:true});
    setTimeout(()=>setPwMsg(null),3000);
  };

  const sel ={background:"#111827",border:"1px solid #1f2937",borderRadius:10,color:"#9ca3af",fontSize:13,padding:"7px 12px",outline:"none",cursor:"pointer"};
  const card={background:"#111827",borderRadius:18,padding:"20px 22px",marginBottom:16};
  const thS ={textAlign:"left",color:"#374151",fontWeight:700,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",padding:"8px 12px",borderBottom:"1px solid #1f2937"};
  const tdS ={padding:"12px 12px",borderBottom:"1px solid #111827",verticalAlign:"middle"};
  const TABS=[["resumen","Resumen"],["flujo","Flujo de Efectivo"],["movimientos","Movimientos"],["golf","Golf"],["categorias","Categorías"],["admin","Admin"]];

  // ── Loading screen ────────────────────────────────────────────
  if(loading) return(
    <div style={{background:"#0d1117",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{height:3,width:48,background:"linear-gradient(90deg,#34d399,#60a5fa)",borderRadius:2,marginBottom:20,margin:"0 auto 20px"}}/>
        <div style={{fontSize:13,color:"#4b5563",fontWeight:600}}>Cargando datos...</div>
      </div>
    </div>
  );

  // ── Login gate ────────────────────────────────────────────────
  if(!unlocked) return(
    <div style={{background:"#0d1117",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',system-ui,sans-serif",padding:24}}>
      <div style={{background:"#111827",borderRadius:20,padding:"40px 36px",width:"100%",maxWidth:360,border:"1px solid #1f2937",boxShadow:"0 24px 64px rgba(0,0,0,0.6)"}}>
        <div style={{height:3,width:48,background:"linear-gradient(90deg,#34d399,#60a5fa)",borderRadius:2,marginBottom:28}}/>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:"#34d399",textTransform:"uppercase",marginBottom:6}}>Mis Finanzas</div>
        <div style={{fontSize:24,fontWeight:800,letterSpacing:"-0.03em",color:"#f9fafb",marginBottom:32}}>Gastos Personales</div>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#4b5563",marginBottom:8}}>Contraseña</div>
        <input type="password" placeholder="••••" value={loginInput} onChange={e=>{setLoginInput(e.target.value);setLoginError(false);}}
          onKeyDown={e=>{if(e.key==="Enter"){if(loginInput===appPassword){setUnlocked(true);}else{setLoginError(true);setLoginInput("");}}}}
          autoFocus style={{width:"100%",background:"#1f2937",border:`1px solid ${loginError?"#f87171":"#374151"}`,borderRadius:12,color:"#f9fafb",fontSize:20,padding:"12px 16px",outline:"none",letterSpacing:"0.2em",textAlign:"center",boxSizing:"border-box",transition:"border-color 0.2s"}}/>
        {loginError&&(<div style={{color:"#f87171",fontSize:12,fontWeight:600,marginTop:8,textAlign:"center"}}>Contraseña incorrecta</div>)}
        <button onClick={()=>{if(loginInput===appPassword){setUnlocked(true);}else{setLoginError(true);setLoginInput("");}}}
          style={{width:"100%",marginTop:20,background:"linear-gradient(135deg,#34d399,#22c55e)",color:"#022c22",border:"none",borderRadius:12,padding:"12px 0",fontSize:14,fontWeight:700,cursor:"pointer"}}>Entrar</button>
      </div>
    </div>
  );

  return(
    <div style={{background:"#0d1117",minHeight:"100vh",fontFamily:"'DM Sans',system-ui,sans-serif",color:"#e5e7eb",paddingBottom:60}}>
      <div style={{background:"#111827",borderBottom:"1px solid #1f2937"}}>
        <div style={{padding:"24px 28px 0"}}>
          <div style={{height:3,width:48,background:"linear-gradient(90deg,#34d399,#60a5fa)",borderRadius:2,marginBottom:20}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:"#34d399",textTransform:"uppercase",marginBottom:4}}>Mis Finanzas</div>
              <div style={{fontSize:30,fontWeight:800,letterSpacing:"-0.04em",color:"#f9fafb",lineHeight:1}}>Gastos Personales</div>
            </div>
          </div>
          <div style={{display:"flex",gap:0,overflowX:"auto"}}>
            {TABS.map(([k,l])=>(<button key={k} style={{padding:"10px 20px",fontSize:13,fontWeight:600,cursor:"pointer",border:"none",background:"transparent",color:tab===k?"#f9fafb":"#4b5563",borderBottom:tab===k?"2px solid #34d399":"2px solid transparent",letterSpacing:"0.01em",transition:"all 0.15s",whiteSpace:"nowrap"}} onClick={()=>setTab(k)}>{l}</button>))}
          </div>
        </div>
      </div>

      <div style={{padding:"24px 28px"}}>

        {tab==="resumen"&&(<>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            <select style={sel} value={anoFiltro} onChange={e=>setAnoFiltro(e.target.value)}><option value="todos">Todos los años</option>{allAnos.map(a=><option key={a} value={a}>{a}</option>)}</select>
            <select style={sel} value={mesFiltro} onChange={e=>setMesFiltro(e.target.value)}><option value="todos">Todos los meses</option>{activeMeses.map(m=><option key={m} value={m}>{capitalize(m)}</option>)}</select>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
            {[{label:"Ingresos",val:summary.ing,color:"#34d399",spark:trendI},{label:"Gastos",val:summary.gas,color:"#fb923c",spark:trendG},{label:"Balance",val:summary.bal,color:summary.bal>=0?"#34d399":"#f87171",spark:activeMeses.map((_,i)=>trendI[i]-trendG[i])},{label:"Invertido",val:summary.inv,color:"#4ade80",spark:activeMeses.map(m=>byFiltro(m).filter(r=>isInversion(r.cat)).reduce((s,r)=>s+r.monto,0))}].map(({label,val,color,spark})=>(
              <div key={label} style={{...card,marginBottom:0,position:"relative",overflow:"hidden",borderTop:`2px solid ${color}20`,paddingBottom:14}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#4b5563",marginBottom:6}}>{label}</div>
                <div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em",color}}>{fmt(val)}</div>
                <Sparkline data={spark} color={color}/>
              </div>
            ))}
          </div>
          <div style={{background:"#111827",borderRadius:18,padding:"20px 22px",marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:8}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#374151"}}>Por categoría</div>
              <div style={{display:"flex",gap:4}}>{[["gasto","Gastos"],["ingreso","Ingresos"],["inversion","Inversiones"]].map(([v,l])=>(<button key={v} onClick={()=>setCatTipo(v)} style={{padding:"4px 12px",fontSize:11,fontWeight:700,cursor:"pointer",border:"none",borderRadius:20,letterSpacing:"0.04em",textTransform:"uppercase",transition:"all 0.15s",background:catTipo===v?(v==="gasto"?"rgba(251,146,60,0.15)":v==="ingreso"?"rgba(52,211,153,0.15)":"rgba(74,222,128,0.15)"):"#1f2937",color:catTipo===v?(v==="gasto"?"#fb923c":v==="ingreso"?"#34d399":"#4ade80"):"#4b5563"}}>{l}</button>))}</div>
            </div>
            <div style={{display:"flex",gap:24,alignItems:"flex-start"}}>
              <Donut slices={catBreakdown} size={116}/>
              <div style={{flex:1,minWidth:0}}>{catBreakdown.map(({cat,value,color})=>{const tot=catBreakdown.reduce((s,d)=>s+d.value,0)||1;const pct=Math.round((value/tot)*100);return(<div key={cat} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:15}}>{getCatEmoji(cat)}</span><div style={{flex:1,minWidth:0}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,color:"#9ca3af",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{cat}</span><span style={{fontSize:11,color:"#4b5563",flexShrink:0,marginLeft:6}}>{pct}%</span></div><div style={{height:3,background:"#1f2937",borderRadius:2}}><div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:2}}/></div></div><span style={{fontSize:12,color:"#6b7280",width:72,textAlign:"right",flexShrink:0}}>{fmt(value)}</span></div>);})}</div>
            </div>
          </div>
          <div style={card}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#374151",marginBottom:12}}>Evolución mensual</div>
            <div style={{display:"flex",gap:14,marginBottom:14}}>{[["#34d399","Ingresos"],["#fb923c","Gastos"]].map(([c,l])=>(<span key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"#6b7280"}}><span style={{width:8,height:8,borderRadius:2,background:c,display:"inline-block"}}/>{l}</span>))}</div>
            <MiniBar labels={activeMeses.map(m=>MESES_SHORT[MESES_ORDER.indexOf(m)])} gastos={trendG} ingresos={trendI}/>
          </div>
        </>)}

        {tab==="flujo"&&(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
            <div><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#4b5563",marginBottom:2}}>Estado de Flujo de Efectivo</div><div style={{fontSize:12,color:"#374151"}}>Haz clic en cualquier celda para ver el detalle de movimientos</div></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,color:"#4b5563"}}>Año:</span><div style={{display:"flex",gap:4}}>{allAnos.map(a=>(<button key={a} onClick={()=>setCfAno(a)} style={{padding:"6px 14px",fontSize:13,fontWeight:700,cursor:"pointer",border:"none",borderRadius:8,background:cfAno===a?"#374151":"#111827",color:cfAno===a?"#f9fafb":"#4b5563",transition:"all 0.15s"}}>{a}</button>))}</div></div>
          </div>
          <CashFlowTable txns={allTxns} cats={cats} ano={cfAno}/>
        </>)}

        {tab==="movimientos"&&(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,gap:12,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <select style={sel} value={anoFiltro} onChange={e=>setAnoFiltro(e.target.value)}><option value="todos">Todos los años</option>{allAnos.map(a=><option key={a} value={a}>{a}</option>)}</select>
              <select style={sel} value={mesFiltro} onChange={e=>setMesFiltro(e.target.value)}><option value="todos">Todos los meses</option>{activeMeses.map(m=><option key={m} value={m}>{capitalize(m)}</option>)}</select>
              <select style={sel} value={filtTipo} onChange={e=>setFiltTipo(e.target.value)}><option value="todos">Todo</option><option value="ingreso">Ingresos</option><option value="gasto">Gastos</option><option value="inversion">Inversiones</option></select>
              <select style={sel} value={filtCat} onChange={e=>setFiltCat(e.target.value)}><option value="todos">Todas las categorías</option>{cats.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}</select>
            </div>
            <button onClick={()=>setShowAdd(v=>!v)} style={{display:"inline-flex",alignItems:"center",gap:6,background:showAdd?"#1f2937":"linear-gradient(135deg,#34d399,#22c55e)",color:showAdd?"#6b7280":"#022c22",border:showAdd?"1px solid #374151":"none",borderRadius:10,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.2s"}}>{showAdd?"✕ Cancelar":"+ Nuevo movimiento"}</button>
          </div>
          <div style={{background:"#111827",borderRadius:18,overflow:"hidden",border:"1px solid #1f2937"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:"#0d1117"}}>{["#","Fecha","Categoría","Descripción","Monto",""].map((h,i)=>(<th key={i} style={{...thS,textAlign:i===4?"right":"left"}}>{h}</th>))}</tr></thead>
              <tbody>
                {showAdd&&<AddRow cats={cats.filter(c=>c.name!=="Golf Ingreso")} onSave={handleSaveTxn} onCancel={()=>setShowAdd(false)}/>}
                {filtered.map((r,i)=>{const ing=isIngreso(r.cat);const inv=isInversion(r.cat);const color=ing?"#34d399":inv?"#4ade80":"#f9fafb";return(<tr key={r.id} style={{background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}><td style={{...tdS,color:"#374151",fontSize:11,fontWeight:600,minWidth:36}}>{txnIndexMap[r.id]||"—"}</td><td style={{...tdS,color:"#4b5563",fontSize:12,whiteSpace:"nowrap"}}>{r.fecha}</td><td style={tdS}><div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:32,height:32,borderRadius:9,background:`${getCatColor(r.cat)}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{getCatEmoji(r.cat)}</div><span style={{fontSize:13,color:"#e5e7eb"}}>{r.cat}</span></div></td><td style={{...tdS,color:"#6b7280",fontSize:12}}>{r.desc}</td><td style={{...tdS,textAlign:"right",fontWeight:700,fontSize:14,color}}>{ing?"+":""}{fmt(r.monto)}</td><td style={tdS}><span style={{display:"inline-block",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,letterSpacing:"0.06em",textTransform:"uppercase",background:ing?"rgba(52,211,153,0.1)":inv?"rgba(74,222,128,0.1)":"rgba(251,146,60,0.1)",color:ing?"#34d399":inv?"#4ade80":"#fb923c"}}>{ing?"ingreso":inv?"inversión":"gasto"}</span></td></tr>);})}
                {filtered.length===0&&!showAdd&&(<tr><td colSpan={6} style={{...tdS,textAlign:"center",color:"#374151",padding:48}}>Sin movimientos</td></tr>)}
              </tbody>
            </table>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontSize:12,color:"#374151"}}><span>{filtered.length} movimientos</span><span>Total: {fmt(filtered.reduce((s,r)=>s+r.monto,0))}</span></div>
        </>)}

        {tab==="golf"&&(
          <GolfTab golfSales={golfSales} showGolfAdd={showGolfAdd} setShowGolfAdd={setShowGolfAdd} golfFecha={golfFecha} setGolfFecha={setGolfFecha} golfCliente={golfCliente} setGolfCliente={setGolfCliente} golfInvitados={golfInvitados} golfMonto={golfMonto} setGolfMonto={setGolfMonto} golfNotas={golfNotas} setGolfNotas={setGolfNotas} golfEfectivo={golfEfectivo} setGolfEfectivo={setGolfEfectivo} golfAnoFilt={golfAnoFilt} setGolfAnoFilt={setGolfAnoFilt} golfMesFilt={golfMesFilt} setGolfMesFilt={setGolfMesFilt} golfEditId={golfEditId} setGolfEditId={setGolfEditId} onSaveGolfSale={handleSaveGolfSale} onDeleteGolfSale={handleDeleteGolfSale} onUpdateEfectivo={handleUpdateGolfEfectivo} onAddInvitado={handleAddInvitado} onDeleteInvitado={handleDeleteInvitado} sel={sel} showToast={showToast}/>
        )}

        {tab==="categorias"&&(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{[["todos","Todas"],["ingreso","Ingresos"],["gasto","Gastos"],["inversion","Inversiones"],["fijo","Fijos"],["variable","Variables"]].map(([v,l])=>(<button key={v} onClick={()=>setCatFilter(v)} style={{padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer",border:"none",borderRadius:20,background:catFilter===v?"#374151":"#111827",color:catFilter===v?"#f9fafb":"#4b5563",transition:"all 0.15s"}}>{l}</button>))}</div>
            <button onClick={()=>setModalCat({})} style={{display:"inline-flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#34d399,#22c55e)",color:"#022c22",border:"none",borderRadius:10,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:"pointer"}}>+ Nueva categoría</button>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>{[{label:"Total",val:cats.length,color:"#60a5fa"},{label:"Ingresos",val:cats.filter(c=>c.tipo==="ingreso").length,color:"#34d399"},{label:"Gastos",val:cats.filter(c=>c.tipo==="gasto").length,color:"#fb923c"},{label:"Inversiones",val:cats.filter(c=>c.tipo==="inversion").length,color:"#4ade80"},{label:"Fijos",val:cats.filter(c=>c.naturaleza==="fijo").length,color:"#818cf8"},{label:"Variables",val:cats.filter(c=>c.naturaleza==="variable").length,color:"#a78bfa"}].map(({label,val,color})=>(<div key={label} style={{background:"#111827",borderRadius:12,padding:"10px 16px",display:"flex",alignItems:"center",gap:10,border:"1px solid #1f2937"}}><div style={{fontSize:20,fontWeight:800,color}}>{val}</div><div style={{fontSize:11,color:"#4b5563",fontWeight:600}}>{label}</div></div>))}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
            {(catFilter==="todos"||catFilter==="ingreso"||catFilter==="fijo"||catFilter==="variable")&&(<div><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#34d399",marginBottom:12,display:"flex",alignItems:"center",gap:8}}><span style={{width:6,height:6,borderRadius:"50%",background:"#34d399",display:"inline-block"}}/>Ingresos</div><div style={{display:"flex",flexDirection:"column",gap:8}}>{filteredCats.filter(c=>c.tipo==="ingreso").map(cat=>(<CatCard key={cat.id} cat={cat} txns={allTxns} onEdit={()=>setModalCat(cat)} onDelete={()=>handleDeleteCat(cat.id)}/>))}</div></div>)}
            {(catFilter==="todos"||catFilter==="gasto"||catFilter==="fijo"||catFilter==="variable")&&(<div><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#fb923c",marginBottom:12,display:"flex",alignItems:"center",gap:8}}><span style={{width:6,height:6,borderRadius:"50%",background:"#fb923c",display:"inline-block"}}/>Gastos</div><div style={{display:"flex",flexDirection:"column",gap:8}}>{filteredCats.filter(c=>c.tipo==="gasto").map(cat=>(<CatCard key={cat.id} cat={cat} txns={allTxns} onEdit={()=>setModalCat(cat)} onDelete={()=>handleDeleteCat(cat.id)}/>))}</div></div>)}
            {(catFilter==="todos"||catFilter==="inversion")&&(<div><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#4ade80",marginBottom:12,display:"flex",alignItems:"center",gap:8}}><span style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",display:"inline-block"}}/>Inversiones</div><div style={{display:"flex",flexDirection:"column",gap:8}}>{filteredCats.filter(c=>c.tipo==="inversion").map(cat=>(<CatCard key={cat.id} cat={cat} txns={allTxns} onEdit={()=>setModalCat(cat)} onDelete={()=>handleDeleteCat(cat.id)}/>))}</div></div>)}
          </div>
        </>)}

        {tab==="admin"&&(
          <div style={{maxWidth:420}}>
            <div style={{background:"#111827",borderRadius:18,padding:"24px 26px",border:"1px solid #1f2937"}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#4b5563",marginBottom:20}}>Cambiar contraseña de acceso</div>
              <div style={{display:"grid",gap:14}}>
                <div><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#4b5563",marginBottom:6}}>Nueva contraseña</div><input type="password" placeholder="••••" value={newPw} onChange={e=>setNewPw(e.target.value)} style={{background:"#1f2937",border:"1px solid #374151",borderRadius:10,color:"#f9fafb",fontSize:14,padding:"10px 14px",outline:"none",width:"100%",boxSizing:"border-box"}}/></div>
                <div><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#4b5563",marginBottom:6}}>Confirmar contraseña</div><input type="password" placeholder="••••" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") handleChangePassword();}} style={{background:"#1f2937",border:"1px solid #374151",borderRadius:10,color:"#f9fafb",fontSize:14,padding:"10px 14px",outline:"none",width:"100%",boxSizing:"border-box"}}/></div>
              </div>
              {pwMsg&&(<div style={{marginTop:14,padding:"10px 14px",borderRadius:10,fontSize:13,fontWeight:600,background:pwMsg.ok?"rgba(52,211,153,0.1)":"rgba(248,113,113,0.1)",color:pwMsg.ok?"#34d399":"#f87171",border:`1px solid ${pwMsg.ok?"rgba(52,211,153,0.2)":"rgba(248,113,113,0.2)"}`}}>{pwMsg.text}</div>)}
              <button onClick={handleChangePassword} style={{width:"100%",marginTop:18,background:"linear-gradient(135deg,#34d399,#22c55e)",color:"#022c22",border:"none",borderRadius:10,padding:"10px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>Guardar nueva contraseña</button>
            </div>
            <div style={{marginTop:16,background:"#111827",borderRadius:18,padding:"20px 26px",border:"1px solid #1f2937"}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#4b5563",marginBottom:14}}>Sesión</div>
              <button onClick={()=>{setUnlocked(false);setLoginInput("");}} style={{background:"transparent",color:"#f87171",border:"1px solid rgba(248,113,113,0.3)",borderRadius:10,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Cerrar sesión</button>
            </div>
          </div>
        )}
      </div>

      {modalCat!==null&&(<CatModal cat={modalCat.id?modalCat:null} usedColors={usedColors} usedEmojis={usedEmojis} onSave={handleSaveCat} onClose={()=>setModalCat(null)}/>)}
      {toast&&(<div style={{position:"fixed",bottom:24,right:24,background:"#111827",border:"1px solid #34d399",color:"#34d399",padding:"12px 20px",borderRadius:12,fontSize:13,fontWeight:600,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",zIndex:998}}>{toast}</div>)}
    </div>
  );
}
