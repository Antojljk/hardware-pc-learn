// Catalogue composants pour le constructeur PC
export type ComponentType = 'cpu' | 'gpu' | 'ram' | 'motherboard' | 'ssd' | 'psu' | 'case' | 'cooler';

export type Component = {
  id: string;
  type: ComponentType;
  brand: string;
  model: string;
  price: number; // EUR
  specs: Record<string, string | number | boolean | string[]>;
  category?: string;
};

export const COMPONENTS: Component[] = [
  // ============ CPU ============
  { id: 'cpu-7800x3d', type: 'cpu', brand: 'AMD', model: 'Ryzen 7 7800X3D', price: 380,
    specs: { socket: 'AM5', cores: 8, threads: 16, tdp: 120, base: 4.2, boost: 5.0, arch: 'Zen 4', l3: 96 } },
  { id: 'cpu-7950x', type: 'cpu', brand: 'AMD', model: 'Ryzen 9 7950X', price: 520,
    specs: { socket: 'AM5', cores: 16, threads: 32, tdp: 170, base: 4.5, boost: 5.7, arch: 'Zen 4', l3: 64 } },
  { id: 'cpu-9950x', type: 'cpu', brand: 'AMD', model: 'Ryzen 9 9950X', price: 650,
    specs: { socket: 'AM5', cores: 16, threads: 32, tdp: 170, base: 4.3, boost: 5.7, arch: 'Zen 5', l3: 80 } },
  { id: 'cpu-7700x', type: 'cpu', brand: 'AMD', model: 'Ryzen 7 7700X', price: 280,
    specs: { socket: 'AM5', cores: 8, threads: 16, tdp: 105, base: 4.5, boost: 5.4, arch: 'Zen 4', l3: 32 } },
  { id: 'cpu-7600', type: 'cpu', brand: 'AMD', model: 'Ryzen 5 7600', price: 200,
    specs: { socket: 'AM5', cores: 6, threads: 12, tdp: 65, base: 3.8, boost: 5.1, arch: 'Zen 4', l3: 32 } },
  { id: 'cpu-5800x3d', type: 'cpu', brand: 'AMD', model: 'Ryzen 7 5800X3D', price: 250,
    specs: { socket: 'AM4', cores: 8, threads: 16, tdp: 105, base: 3.4, boost: 4.5, arch: 'Zen 3', l3: 96 } },
  { id: 'cpu-14900k', type: 'cpu', brand: 'Intel', model: 'Core i9-14900K', price: 580,
    specs: { socket: 'LGA1700', cores: 24, threads: 32, tdp: 125, base: 3.2, boost: 6.0, arch: 'Raptor Lake', p_cores: 8, e_cores: 16 } },
  { id: 'cpu-14700k', type: 'cpu', brand: 'Intel', model: 'Core i7-14700K', price: 420,
    specs: { socket: 'LGA1700', cores: 20, threads: 28, tdp: 125, base: 3.4, boost: 5.6, arch: 'Raptor Lake', p_cores: 8, e_cores: 12 } },
  { id: 'cpu-14600k', type: 'cpu', brand: 'Intel', model: 'Core i5-14600K', price: 320,
    specs: { socket: 'LGA1700', cores: 14, threads: 20, tdp: 125, base: 3.5, boost: 5.3, arch: 'Raptor Lake', p_cores: 6, e_cores: 8 } },
  { id: 'cpu-285k', type: 'cpu', brand: 'Intel', model: 'Core Ultra 9 285K', price: 590,
    specs: { socket: 'LGA1851', cores: 24, threads: 24, tdp: 125, base: 3.7, boost: 5.7, arch: 'Arrow Lake' } },

  // ============ GPU ============
  { id: 'gpu-rtx5090', type: 'gpu', brand: 'NVIDIA', model: 'GeForce RTX 5090', price: 2200,
    specs: { vram: 32, vram_type: 'GDDR7', power: 575, length: 304, bus: 'PCIe 5.0', arch: 'Blackwell' } },
  { id: 'gpu-rtx5080', type: 'gpu', brand: 'NVIDIA', model: 'GeForce RTX 5080', price: 1100,
    specs: { vram: 16, vram_type: 'GDDR7', power: 360, length: 280, bus: 'PCIe 5.0', arch: 'Blackwell' } },
  { id: 'gpu-rtx4090', type: 'gpu', brand: 'NVIDIA', model: 'GeForce RTX 4090', price: 1800,
    specs: { vram: 24, vram_type: 'GDDR6X', power: 450, length: 304, bus: 'PCIe 4.0', arch: 'Ada Lovelace' } },
  { id: 'gpu-rtx4080s', type: 'gpu', brand: 'NVIDIA', model: 'GeForce RTX 4080 Super', price: 1000,
    specs: { vram: 16, vram_type: 'GDDR6X', power: 320, length: 285, bus: 'PCIe 4.0', arch: 'Ada Lovelace' } },
  { id: 'gpu-rtx4070s', type: 'gpu', brand: 'NVIDIA', model: 'GeForce RTX 4070 Super', price: 600,
    specs: { vram: 12, vram_type: 'GDDR6X', power: 220, length: 244, bus: 'PCIe 4.0', arch: 'Ada Lovelace' } },
  { id: 'gpu-rtx4060', type: 'gpu', brand: 'NVIDIA', model: 'GeForce RTX 4060', price: 300,
    specs: { vram: 8, vram_type: 'GDDR6', power: 115, length: 220, bus: 'PCIe 4.0', arch: 'Ada Lovelace' } },
  { id: 'gpu-rx7900xtx', type: 'gpu', brand: 'AMD', model: 'Radeon RX 7900 XTX', price: 950,
    specs: { vram: 24, vram_type: 'GDDR6', power: 355, length: 287, bus: 'PCIe 4.0', arch: 'RDNA 3' } },
  { id: 'gpu-rx7900xt', type: 'gpu', brand: 'AMD', model: 'Radeon RX 7900 XT', price: 700,
    specs: { vram: 20, vram_type: 'GDDR6', power: 300, length: 276, bus: 'PCIe 4.0', arch: 'RDNA 3' } },
  { id: 'gpu-rx7800xt', type: 'gpu', brand: 'AMD', model: 'Radeon RX 7800 XT', price: 480,
    specs: { vram: 16, vram_type: 'GDDR6', power: 263, length: 267, bus: 'PCIe 4.0', arch: 'RDNA 3' } },
  { id: 'gpu-rx7600', type: 'gpu', brand: 'AMD', model: 'Radeon RX 7600', price: 270,
    specs: { vram: 8, vram_type: 'GDDR6', power: 150, length: 205, bus: 'PCIe 4.0', arch: 'RDNA 3' } },

  // ============ RAM ============
  { id: 'ram-ddr5-6000-32', type: 'ram', brand: 'G.Skill', model: 'Trident Z5 RGB 32 Go DDR5-6000 CL30', price: 130,
    specs: { size: 32, sticks: 2, type: 'DDR5', speed: 6000, cl: 30 } },
  { id: 'ram-ddr5-6000-16', type: 'ram', brand: 'Kingston', model: 'Fury Beast 16 Go DDR5-6000 CL30', price: 75,
    specs: { size: 16, sticks: 2, type: 'DDR5', speed: 6000, cl: 30 } },
  { id: 'ram-ddr5-7200-32', type: 'ram', brand: 'Corsair', model: 'Dominator 32 Go DDR5-7200 CL34', price: 200,
    specs: { size: 32, sticks: 2, type: 'DDR5', speed: 7200, cl: 34 } },
  { id: 'ram-ddr5-5600-64', type: 'ram', brand: 'G.Skill', model: 'Trident Z5 64 Go DDR5-5600 CL28', price: 250,
    specs: { size: 64, sticks: 2, type: 'DDR5', speed: 5600, cl: 28 } },
  { id: 'ram-ddr4-3600-32', type: 'ram', brand: 'Corsair', model: 'Vengeance LPX 32 Go DDR4-3600 CL18', price: 90,
    specs: { size: 32, sticks: 2, type: 'DDR4', speed: 3600, cl: 18 } },

  // ============ MOTHERBOARD ============
  { id: 'mb-b650-tomahawk', type: 'motherboard', brand: 'MSI', model: 'MAG B650 Tomahawk WiFi', price: 220,
    specs: { socket: 'AM5', chipset: 'B650', form: 'ATX', ram_type: 'DDR5', ram_slots: 4, m2_slots: 3, wifi: true, vrm_phases: '12+2+1' } },
  { id: 'mb-x870e-hero', type: 'motherboard', brand: 'ASUS', model: 'ROG Crosshair X870E Hero', price: 700,
    specs: { socket: 'AM5', chipset: 'X870E', form: 'ATX', ram_type: 'DDR5', ram_slots: 4, m2_slots: 5, wifi: true, vrm_phases: '20+2+1' } },
  { id: 'mb-b650-itx', type: 'motherboard', brand: 'Gigabyte', model: 'B650I AORUS Ultra', price: 280,
    specs: { socket: 'AM5', chipset: 'B650', form: 'ITX', ram_type: 'DDR5', ram_slots: 2, m2_slots: 2, wifi: true, vrm_phases: '8+2+1' } },
  { id: 'mb-z890-hero', type: 'motherboard', brand: 'ASUS', model: 'ROG Maximus Z890 Hero', price: 720,
    specs: { socket: 'LGA1851', chipset: 'Z890', form: 'ATX', ram_type: 'DDR5', ram_slots: 4, m2_slots: 5, wifi: true, vrm_phases: '22+1+2' } },
  { id: 'mb-z890-tomahawk', type: 'motherboard', brand: 'MSI', model: 'MAG Z890 Tomahawk WiFi', price: 360,
    specs: { socket: 'LGA1851', chipset: 'Z890', form: 'ATX', ram_type: 'DDR5', ram_slots: 4, m2_slots: 4, wifi: true, vrm_phases: '16+1+1' } },
  { id: 'mb-b760-ds3h', type: 'motherboard', brand: 'Gigabyte', model: 'B760 DS3H AX', price: 170,
    specs: { socket: 'LGA1700', chipset: 'B760', form: 'ATX', ram_type: 'DDR5', ram_slots: 4, m2_slots: 2, wifi: true, vrm_phases: '8+1+1' } },
  { id: 'mb-b550-tomahawk', type: 'motherboard', brand: 'MSI', model: 'MAG B550 Tomahawk Max', price: 160,
    specs: { socket: 'AM4', chipset: 'B550', form: 'ATX', ram_type: 'DDR4', ram_slots: 4, m2_slots: 2, wifi: false, vrm_phases: '10+2+1' } },
  { id: 'mb-x670e-pro', type: 'motherboard', brand: 'MSI', model: 'MAG X670E Tomahawk WiFi', price: 380,
    specs: { socket: 'AM5', chipset: 'X670E', form: 'ATX', ram_type: 'DDR5', ram_slots: 4, m2_slots: 4, wifi: true, vrm_phases: '14+2+1' } },

  // ============ SSD ============
  { id: 'ssd-990pro-2', type: 'ssd', brand: 'Samsung', model: '990 Pro 2 To', price: 180,
    specs: { capacity: 2000, interface: 'NVMe PCIe 4.0', read: 7450, write: 6900, dram: true } },
  { id: 'ssd-990pro-1', type: 'ssd', brand: 'Samsung', model: '990 Pro 1 To', price: 110,
    specs: { capacity: 1000, interface: 'NVMe PCIe 4.0', read: 7450, write: 6900, dram: true } },
  { id: 'ssd-sn850x-2', type: 'ssd', brand: 'WD', model: 'Black SN850X 2 To', price: 160,
    specs: { capacity: 2000, interface: 'NVMe PCIe 4.0', read: 7300, write: 6600, dram: true } },
  { id: 'ssd-mp600-1', type: 'ssd', brand: 'Corsair', model: 'MP600 Elite 1 To', price: 100,
    specs: { capacity: 1000, interface: 'NVMe PCIe 5.0', read: 10000, write: 8500, dram: true } },
  { id: 'ssd-mx500-1', type: 'ssd', brand: 'Crucial', model: 'MX500 1 To', price: 75,
    specs: { capacity: 1000, interface: 'SATA', read: 560, write: 510, dram: true } },

  // ============ PSU ============
  { id: 'psu-rm850x', type: 'psu', brand: 'Corsair', model: 'RM850x', price: 140,
    specs: { wattage: 850, certif: '80+ Gold', modular: true, connector: '12VHPWR-ready' } },
  { id: 'psu-rm1000x', type: 'psu', brand: 'Corsair', model: 'RM1000x SHIFT', price: 200,
    specs: { wattage: 1000, certif: '80+ Gold', modular: true, connector: '12VHPWR' } },
  { id: 'psu-hx1500i', type: 'psu', brand: 'Corsair', model: 'HX1500i', price: 380,
    specs: { wattage: 1500, certif: '80+ Platinum', modular: true, connector: '12VHPWR' } },
  { id: 'psu-tg-750', type: 'psu', brand: 'be quiet!', model: 'Pure Power 12 M 750W', price: 110,
    specs: { wattage: 750, certif: '80+ Gold', modular: true, connector: '12VHPWR-ready' } },
  { id: 'psu-sf750', type: 'psu', brand: 'Corsair', model: 'SF750', price: 180,
    specs: { wattage: 750, certif: '80+ Platinum', modular: true, form: 'SFX', connector: '8-pin' } },
  { id: 'psu-prime-1300', type: 'psu', brand: 'Seasonic', model: 'Prime 1300W Platinum', price: 320,
    specs: { wattage: 1300, certif: '80+ Platinum', modular: true, connector: '12VHPWR' } },

  // ============ CASE ============
  { id: 'case-o11d', type: 'case', brand: 'Lian Li', model: 'O11 Dynamic EVO', price: 180,
    specs: { form: 'ATX', gpu_length: 422, cooler_height: 167, fans: 'préinstallés' } },
  { id: 'case-h7-flow', type: 'case', brand: 'NZXT', model: 'H7 Flow', price: 150,
    specs: { form: 'ATX', gpu_length: 400, cooler_height: 185 } },
  { id: 'case-4000d', type: 'case', brand: 'Corsair', model: '4000D Airflow', price: 110,
    specs: { form: 'ATX', gpu_length: 360, cooler_height: 170 } },
  { id: 'case-h1-flow', type: 'case', brand: 'NZXT', model: 'H1 Flow Mini', price: 280,
    specs: { form: 'ITX', gpu_length: 320, cooler_height: 67, sfx: true } },
  { id: 'case-air-3', type: 'case', brand: 'Lian Li', model: 'A3-mATX', price: 100,
    specs: { form: 'mATX', gpu_length: 360, cooler_height: 165 } },

  // ============ COOLER ============
  { id: 'cooler-nh-d15', type: 'cooler', brand: 'Noctua', model: 'NH-D15', price: 110,
    specs: { type: 'Air', height: 165, tdp_max: 220 } },
  { id: 'cooler-peerless', type: 'cooler', brand: 'Thermalright', model: 'Peerless Assassin 120 SE', price: 40,
    specs: { type: 'Air', height: 157, tdp_max: 245 } },
  { id: 'cooler-ak620', type: 'cooler', brand: 'Deepcool', model: 'AK620', price: 70,
    specs: { type: 'Air', height: 160, tdp_max: 260 } },
  { id: 'cooler-aio-360-arctic', type: 'cooler', brand: 'Arctic', model: 'Liquid Freezer III 360', price: 110,
    specs: { type: 'AIO', radiator: 360, tdp_max: 350 } },
  { id: 'cooler-aio-360-kraken', type: 'cooler', brand: 'NZXT', model: 'Kraken Elite 360 RGB', price: 280,
    specs: { type: 'AIO', radiator: 360, tdp_max: 350 } },
  { id: 'cooler-aio-280-mafrost', type: 'cooler', brand: 'Deepcool', model: 'Mafrost 280', price: 90,
    specs: { type: 'AIO', radiator: 280, tdp_max: 280 } },
  { id: 'cooler-lp-65', type: 'cooler', brand: 'Noctua', model: 'NH-L9a-AM5', price: 60,
    specs: { type: 'Low profile', height: 37, tdp_max: 95 } },
];
