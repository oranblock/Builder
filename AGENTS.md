# 🤖 Agent Operational Runbook: Upgraded Autonomous Factory

This document provides immediate, deterministic instructions for autonomous agents, sub-agents, and background daemons operating within this workspace.

---

## ⚡ Quick Command Reference

```bash
# 1. Autonomous Zero-Human Selection & Synthesis (Smart Preset Selector)
python3 scripts_archive/smart_selector.py "<ARABIC_BRIEF>" --auto-synthesize

# 2. Synthesize bespoke Android app with explicit archetype or auto detection
python3 scripts_archive/factory_engine.py <PROJECT_ID> auto "<ARABIC_BRIEF>"
python3 scripts_archive/factory_engine.py <PROJECT_ID> <ARCHETYPE> "<ARABIC_BRIEF>"

# 3. Run Forensic Governance Board Audit on all applications
python3 scripts_archive/board_owner_audit.py --all --no-telegram

# 4. Scout freelance leads & auto-synthesize non-colliding prototypes
python3 scripts_archive/monitor.py --simulate --auto-synthesize --once

# 5. Check API connectivity & run internal validation tests
python3 scripts_archive/agent_client.py
```

---

## 🔌 Port Configuration & Conflict Isolation

To prevent conflicts in environments running Tachyon and OmniRoute:
- **Port 3000**: Tachyon Web Server
- **Port 5000**: File Uploader Service
- **Port 8888**: SearXNG Search Engine
- **Port 20128**: OmniRoute AI Gateway and Dashboard
- **Port 20131**: OmniRoute Internal Worker
- **Port 20132**: OmniRoute Internal Proxy
- **Port 3030** (`FACTORY_PORT=3030`): Factory Web Dashboard & API Server

When running Python agent daemons or invoking the API, export:
```bash
export FACTORY_PORT=3030
export FACTORY_API_BASE_URL="http://localhost:3030"
```
The client SDK `agent_client.py` and `smart_selector.py` dynamically resolve this environment variable.

---

## 🧭 The 20 Commercial Archetypes & Their Sensor Signatures

When parsing user briefs or freelance job descriptions, classify the project into one of these exact keys:

1. **`pos_cashier`**: Retail cashier, supermarket checkout, restaurant POS.
   - Peripheral: ESC/POS Thermal Receipt Printer + Barcode Scanner.
2. **`navigation`**: Logistics, delivery driver, fleet management, dispatch.
   - Peripheral: GPS RTK high-precision navigation.
3. **`services`**: Home maintenance, plumbing, electrical, on-demand technicians.
   - Peripheral: Mada Contactless EMV L2 NFC card reader.
4. **`fitness`**: Gym workout tracker, personal trainer, athletic performance.
   - Peripheral: Bluetooth BLE Heart Rate chest strap.
5. **`food`**: Cloud kitchen, restaurant orders, food delivery dispatcher.
   - Peripheral: Kitchen Display System (KDS) multi-socket print server.
6. **`coworking`**: Shared offices, meeting rooms, smart desk reservations.
   - Peripheral: 13.56 MHz RFID turnstile NFC door lock.
7. **`telehealth`**: Clinic consults, doctor appointments, remote patient vitals.
   - Peripheral: Bluetooth BLE Pulse Oximeter & SpO2 sensor (GATT 0x1822).
8. **`agritech`**: Smart irrigation, date palm farms, greenhouse monitoring.
   - Peripheral: LoRaWAN Soil Moisture & Ambient Temperature Node.
9. **`real_estate`**: Luxury PropTech, 3D architectural tours, property management.
   - Peripheral: 360 LiDAR Spatial Scanner + Matterport Pro3.
10. **`car_rental`**: Self-service car rental, fleet management, vehicle telematics.
    - Peripheral: OBD-II CAN-Bus Telematics + BLE Digital Key Fob.
11. **`beauty_salon`**: Luxury salons, spas, wellness centres, specialist bookings.
    - Peripheral: UV-C Chamber Sanitation IoT Sensor.
12. **`auction_live`**: Real-time live auctions, Arabian horses, rare collectibles.
    - Peripheral: BLE Hardware Bidding Paddle GATT + Sub-100ms WebRTC Audio.
13. **`smart_education`**: Tech academies, bootcamp training, interactive live classrooms.
    - Peripheral: Smart Stylus Digitizer (4096 pressure levels) + BLE Attendance Beacon.
14. **`logistics_warehouse`**: WMS smart inventory, bin scanning, pallet intake.
    - Peripheral: 2D Long-Range Laser Barcode Scanner + Bluetooth Industrial Pallet Scale.
15. **`smart_parking`**: Smart parking lots, automated gates, valet service.
    - Peripheral: Ultrasonic Ground Occupancy Sensor + ANPR LPR Camera.
16. **`event_ticketing`**: Digital tickets, conference registrations, concerts.
    - Peripheral: Fast 2D QR Turnstile Scanner + UHF RFID Wristband.
17. **`smart_laundry`**: Smart laundromats, garment care, express dry cleaning.
    - Peripheral: Heat-Resistant UHF RFID Garment Chip.
18. **`pet_care`**: Veterinary clinics, pet wellness, vaccination records.
    - Peripheral: ISO 134.2 kHz Microchip Reader + BLE Smart Collar.
19. **`legal_consulting`**: Certified contracts, lawyer bookings, Najiz platform integration.
    - Peripheral: Cryptographic HSM Security Token + Digital Signature.
20. **`industrial_iot`**: Predictive maintenance, turbine and motor vibration analysis.
    - Peripheral: 3-Axis Industrial Vibration Accelerometer + Modbus RS485.
21. **`custom`**: Bespoke custom preset designed in the Custom Preset Studio.
    - Peripheral: Procedural / Custom Specified Sensor Driver.

---

## 🛑 Non-Negotiable Invariants

- **ZERO EMOJIS**: Under no circumstances should emojis be inserted into Kotlin strings, JSON titles, category tags, or Arabic proposals. Any presence of an emoji yields an automated F grade.
- **CONTRAST RATIO $\ge$ 4.5:1**: Primary colors against white or card backgrounds must pass WCAG 2.1 AAA luminance check.
- **STRUCTURAL SIMILARITY < 82%**: Do not repeat category structures or banner layouts between projects.

---

## 🌐 Web App Integration Endpoints

Use `agent_client.py`, `smart_selector.py`, or `curl`:

- **POST** `/api/agent/smart-select` — Autonomous zero-human brief analysis, optimal archetype & hardware selection.
- **GET** `/api/presets` — Retrieves all 20+ archetype presets with their sensor configurations.
- **GET** `/api/design-formula` — Mathematical WCAG 2.1 palette & layout generation.
- **POST** `/api/audit-novelty` — Novelty Gatekeeper preventing visual duplicate apps.
- **POST** `/api/agent/telemetry` — Reports project health, contrast ratios, and hardware driver bindings.
- **POST** `/api/agent/scout-alert` — Sends new high-value lead alerts to the web dashboard.
- **GET** `/api/projects` — Fetches all live registered projects.

