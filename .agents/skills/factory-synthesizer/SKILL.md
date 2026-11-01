---
name: factory-synthesizer
description: Autonomous Ephemeral Software Factory and Forensics Governance Skill. Synthesizes bespoke Android Jetpack Compose applications across 8 commercial archetypes, binds real hardware sensor drivers, enforces WCAG 2.1 contrast math and Zero-Emoji invariants, generates professional Arabic proposals, and syncs live telemetry with the web dashboard.
version: 2.5.0
---

# Autonomous Ephemeral Software Factory — Agent Skill Specification

## 1. Executive Overview & Core Philosophy
This skill empowers autonomous agents to monitor freelance client requests (e.g. Mostaql), instantly synthesize bespoke native Android prototypes with real hardware drivers, verify them against strict forensic governance standards, and stream live telemetry to the management web dashboard.

### Core Tenets:
1. **Zero-Duplication Engine**: Never emit cookie-cutter templates. Every project must possess a distinct archetype, bespoke color palette, custom navigation graph, and genuine domain data model.
2. **Real Hardware Drivers**: Every synthesized application must bind to a physical sensor or peripheral driver (Thermal Printer, Mada NFC, GPS RTK, LoRaWAN, BLE Oximeter, RFID) rather than passive mock screens.
3. **Zero Local Bloat**: Temporary generation occurs in ephemeral memory or `/tmp/factory_<project_id>`, pushes live JSON previews to `specs/<id>.json`, and logs to the SQLite vault.
4. **Forensic Grade Standards**: All outputs undergo a 6-pillar automated audit before being approved for client delivery.

---

## 2. Supported Archetypes & Hardware Sensor Matrix (20 Commercial Domains + Custom)

Agents must select from the following 20 commercial archetypes or generate a custom preset:

| Archetype Code | Industry Domain | Bound Hardware Peripheral | Driver Protocol | Target Commercial Value |
| :--- | :--- | :--- | :--- | :--- |
| `pos_cashier` | Retail & Supermarket POS | ESC/POS Thermal Receipt Printer + Barcode Scanner | Raw Bluetooth Socket (9600 baud) | 12,000 - 18,000 SAR |
| `navigation` | Logistics & Fleet Tracking | High-precision GPS RTK Receiver | Android `LocationManager` + NMEA | 18,000 - 28,000 SAR |
| `services` | Home & Field Maintenance | Mada Contactless EMV L2 NFC Reader | Android `NfcAdapter` ISO 14443-4 | 14,000 - 22,000 SAR |
| `fitness` | Gym & Health Club | Bluetooth BLE Heart Rate Chest Strap | Android BLE GATT `0x180D` | 9,000 - 15,000 SAR |
| `food` | Cloud Kitchen & Restaurants | Kitchen Display System (KDS) Dispatcher | Multi-socket TCP/IP Print Server | 15,000 - 24,000 SAR |
| `coworking` | Business Hubs & Meeting Rooms | 13.56 MHz RFID / NFC Door Turnstile Access | Android HCE (Host Card Emulation) | 11,000 - 19,000 SAR |
| `telehealth` | Clinic & Remote Patient Monitor | BLE Pulse Oximeter & SpO2 Medical Sensor | Android BLE GATT `0x1822` (PLX) | 22,000 - 35,000 SAR |
| `agritech` | Smart Greenhouse & Farms | LoRaWAN Soil Moisture & Temp Sensor Node | Serial UART / AT Command Bridge | 16,000 - 26,000 SAR |
| `real_estate` | PropTech & Luxury Estates | 360 LiDAR Spatial Scanner + Matterport Pro3 | LiDAR Point Cloud Mesh / BLE | 25,000 - 45,000 SAR |
| `car_rental` | Smart Automotive & Fleet | OBD-II CAN-Bus Telematics + BLE Digital Key | CAN-Bus Protocol / BLE Key Fob | 18,000 - 32,000 SAR |
| `beauty_salon` | Luxury Salon, Spa & Wellness | UV-C Chamber Sanitation IoT Sensor | Bluetooth IoT Sensor Stream | 12,000 - 20,000 SAR |
| `auction_live` | Live Real-time Auctions | BLE Hardware Bidding Paddle + Opus Audio | BLE GATT + Sub-100ms WebRTC | 28,000 - 55,000 SAR |
| `smart_education` | Interactive EdTech Academy | Smart Stylus Digitizer (Pressure 4096 levels) | Android Stylus MotionEvent / BLE | 16,000 - 30,000 SAR |
| `logistics_warehouse` | Logistics WMS & Inventory | 2D Laser Barcode Scanner + Pallet Scale | Zebra/Honeywell SDK + BLE Scale | 20,000 - 38,000 SAR |
| `smart_parking` | Smart Parking & Valet Gates | Ultrasonic Ground Sensor + ANPR LPR Camera | RTSP Video + Rest/MQTT Event | 22,000 - 36,000 SAR |
| `event_ticketing` | Event Passes & Conferences | 2D Turnstile Fast Scanner + UHF Wristband | NFC ISO 15693 / UHF EPC Gen2 | 16,000 - 28,000 SAR |
| `smart_laundry` | Smart Laundry & Garments | Heat-Resistant UHF RFID Garment Chip | Impinj RFID SDK / BLE Bridge | 14,000 - 24,000 SAR |
| `pet_care` | Veterinary Clinics & Pets | ISO 134.2 kHz Microchip Reader + BLE Collar | FDX-B / HDX RFID Reader | 12,000 - 22,000 SAR |
| `legal_consulting` | Legal Practice & Najiz | Cryptographic HSM Security Token (FIPS 140-2) | PKCS#11 / USB-C CCID Token | 24,000 - 42,000 SAR |
| `industrial_iot` | Predictive Vibration IoT | 3-Axis Vibration Sensor + Modbus RS485 | Modbus RTU / MQTT Gateway | 28,000 - 50,000 SAR |
| `custom` | Bespoke Custom Preset | Custom Specified Peripheral (Procedural) | Dynamic Driver Bridge | 15,000 - 45,000 SAR |

---

## 3. Strict Quality Invariants (Zero-Tolerance Rules)

Any agent that violates these rules will receive an **F (FAIL)** grade from `board_owner_audit.py`:

### Invariant 1: The Zero-Emoji Law
- **Rule**: Absolutely no emoji unicode characters (e.g., 🍔, 🚀, 📱, ✨, ☕, 💼, 🚗, 🏥) may appear anywhere in code, titles, descriptions, icons, button labels, or proposals.
- **Enforcement**: Clean, industrial iconography using standard SVG tokens or semantic Lucide names (e.g., `receipt`, `navigation`, `credit-card`, `activity`, `utensils`, `key`, `heart-pulse`, `sprout`).

### Invariant 2: WCAG 2.1 Contrast Math
- **Rule**: All UI color combinations must mathematically achieve a minimum contrast ratio of **4.5:1** for standard text and **3.0:1** for large titles and graphical elements.
- **Formula**:
  $$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$
  where $L = 0.2126 \cdot R + 0.7152 \cdot G + 0.0722 \cdot B$ using sRGB linear expansion.

### Invariant 3: Structural Novelty & Anti-Duplication
- **Rule**: dHash structural fingerprinting compares the visual/item layout across all active projects. Structural similarity between any two applications must not exceed **82%**.
- **Action**: When generating a new app, randomize hero banner layout, category tag counts (3 to 6 items), and card metadata properties.

### Invariant 4: Professional Arabic Bid Structure
- **Rule**: All client proposals (`PROPOSAL_AR.md`) must be written in formal, corporate Arabic.
- **Required Sections**:
  1. مقدمة تنفيذية مخصصة (Executive Introduction matching client brief)
  2. الربط مع العتاد الفيزيائي (Hardware integration specifications)
  3. هيكل التسليم والمراحل (3-Milestone phased delivery with exact SAR pricing)
  4. الضمان والدعم الفني (SLA and technical guarantee)
  5. رابط المعاينة التفاعلية الحية (Interactive live preview URL)

---

## 4. CLI Command Runbook

Agents must use the following standard commands to trigger synthesis, auditing, and market monitoring:

### A. Autonomous App Synthesis (`factory_engine.py`)
Synthesize a complete native project specification, Jetpack Compose source tree, hardware driver, and Arabic proposal:
### A. Smart Preset Selector (`smart_selector.py`)
Autonomous zero-human selection of archetype, hardware, and non-colliding design:
```bash
python3 scripts_archive/smart_selector.py "<ARABIC_BRIEF>" --auto-synthesize
```

### B. Core App Synthesizer (`factory_engine.py`)
Synthesize a brand new application from scratch with automatic or explicit archetype:
```bash
python3 scripts_archive/factory_engine.py <PROJECT_ID> auto "<ARABIC_BRIEF>"
python3 scripts_archive/factory_engine.py <PROJECT_ID> <ARCHETYPE> "<ARABIC_BRIEF>"
```

### C. Forensic Board Audit (`board_owner_audit.py`)
Run a 6-pillar compliance audit on all generated projects or a single target:
```bash
python3 scripts_archive/board_owner_audit.py --all --no-telegram
```

### D. Freelance Marketplace Scout (`monitor.py`)
Scrape and parse active high-budget mobile development jobs from Mostaql:
```bash
python3 scripts_archive/monitor.py --simulate --auto-synthesize --once
```

### E. Agent Client Library (`agent_client.py`)
Python helper library for scripting and programmatic telemetry:
```bash
python3 scripts_archive/agent_client.py
```

---

## 5. Web Application Telemetry API Bridge & Port Isolation

To avoid collisions with user host ports (Tachyon: 3000, File Uploader: 5000, SearXNG: 8888, OmniRoute: 20128/20131/20132):
- Set `FACTORY_PORT=3030` and `FACTORY_API_BASE_URL="http://localhost:3030"`
- All scripts dynamically resolve the configured port.

API Endpoints:
- `POST /api/agent/smart-select` — Autonomous zero-human brief analysis & archetype selector
- `GET /api/presets` — List of all 20+ archetype presets
- `GET /api/design-formula` — Mathematical WCAG 2.1 palette generation
- `POST /api/audit-novelty` — Novelty gatekeeper & collision check
- `POST /api/agent/telemetry` — Project telemetry streaming
- `POST /api/agent/scout-alert` — Scout opportunity broadcast
- `GET /api/projects` — Active project registry

