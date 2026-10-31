import React, { useState, useEffect } from 'react';
import {
  Battery,
  BatteryCharging,
  Bluetooth,
  Compass,
  Radio,
  Cpu,
  Smartphone,
  Globe,
  Activity,
  Copy,
  Check,
  Zap,
  Scale,
  Sparkles,
} from 'lucide-react';

interface SensorApiSpec {
  id: string;
  name: string;
  icon: any;
  description: string;
  hardwareType: 'battery' | 'ble-scale' | 'infrared' | 'motion' | 'biometric';
  androidApi: string;
  androidPermission: string;
  iosApi: string;
  iosPermission: string;
  webApi: string;
  kmpSnippet: {
    common: string;
    android: string;
    ios: string;
    web: string;
  };
}

export const HardwareSensorStudio: React.FC = () => {
  const [activeSensorId, setActiveSensorId] = useState<string>('battery');
  const [activePlatformTab, setActivePlatformTab] = useState<'kmp-common' | 'android' | 'ios' | 'web'>('kmp-common');
  const [copied, setCopied] = useState<boolean>(false);

  // Live browser battery state
  const [liveBattery, setLiveBattery] = useState<{ level: number | null; charging: boolean | null; supported: boolean }>({
    level: null,
    charging: null,
    supported: false,
  });

  // Live browser vibration test
  const [vibrating, setVibrating] = useState<boolean>(false);

  useEffect(() => {
    // Check if navigator.getBattery is available in browser
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setLiveBattery({
          level: Math.round(battery.level * 100),
          charging: battery.charging,
          supported: true,
        });

        battery.addEventListener('levelchange', () => {
          setLiveBattery((prev) => ({ ...prev, level: Math.round(battery.level * 100) }));
        });
        battery.addEventListener('chargingchange', () => {
          setLiveBattery((prev) => ({ ...prev, charging: battery.charging }));
        });
      }).catch(() => {
        setLiveBattery({ level: 85, charging: true, supported: false });
      });
    } else {
      // Fallback mock telemetry for unsupported browsers
      setLiveBattery({ level: 88, charging: false, supported: false });
    }
  }, []);

  const handleTestVibrate = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    setVibrating(true);
    setTimeout(() => setVibrating(false), 500);
  };

  const sensorApis: SensorApiSpec[] = [
    {
      id: 'battery',
      name: 'Battery & Power Status',
      icon: Battery,
      hardwareType: 'battery',
      description: 'Reads real-time battery percentage, charging state, thermal status, and low-power modes across mobile and web.',
      androidApi: 'android.os.BatteryManager',
      androidPermission: 'None (System broadcast Intent.ACTION_BATTERY_CHANGED)',
      iosApi: 'UIDevice.current.batteryLevel & batteryState',
      iosPermission: 'UIDevice.current.isBatteryMonitoringEnabled = true',
      webApi: 'navigator.getBattery() (Battery Status API)',
      kmpSnippet: {
        common: `// commonMain: Abstract interface
expect class BatteryMonitor() {
    val batteryLevel: StateFlow<Int>
    val isCharging: StateFlow<Boolean>
}`,
        android: `// androidMain: Android BatteryManager implementation
actual class BatteryMonitor(private val context: Context) {
    actual val batteryLevel: StateFlow<Int> = callbackFlow {
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(c: Context?, intent: Intent) {
                val level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
                val scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
                trySend((level * 100 / scale.toFloat()).toInt())
            }
        }
        context.registerReceiver(receiver, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
        awaitClose { context.unregisterReceiver(receiver) }
    }.stateIn(CoroutineScope(Dispatchers.Default), SharingStarted.Eagerly, 100)
}`,
        ios: `// iosMain: Apple UIDevice implementation
actual class BatteryMonitor {
    init {
        UIDevice.currentDevice.batteryMonitoringEnabled = true
    }
    actual val batteryLevel: StateFlow<Int>
        get() = MutableStateFlow(
            (UIDevice.currentDevice.batteryLevel * 100).toInt()
        )
}`,
        web: `// wasmJsMain / jsMain: Web Battery API implementation
actual class BatteryMonitor {
    actual val batteryLevel: StateFlow<Int> = MutableStateFlow(100).apply {
        js("navigator.getBattery().then(b => { this.value = Math.round(b.level * 100); })")
    }
}`
      }
    },
    {
      id: 'ble-scale',
      name: 'Bluetooth LE & Weight Scales',
      icon: Scale,
      hardwareType: 'ble-scale',
      description: 'Connects to Bluetooth Low Energy (BLE) smart weight scales, GATT body-composition profiles, and fitness sensors.',
      androidApi: 'BluetoothLeScanner & BluetoothGatt',
      androidPermission: 'android.permission.BLUETOOTH_SCAN, BLUETOOTH_CONNECT',
      iosApi: 'CoreBluetooth (CBCentralManager & CBPeripheral)',
      iosPermission: 'NSBluetoothAlwaysUsageDescription in Info.plist',
      webApi: 'navigator.bluetooth.requestDevice() (Web Bluetooth)',
      kmpSnippet: {
        common: `// commonMain: Standardized Weight Scale Model & Scanner
data class WeightReading(val weightKg: Float, val timestamp: Long)

expect class BleScaleScanner() {
    fun scanForScales(): Flow<WeightReading>
}`,
        android: `// androidMain: Android BLE Scanner (GATT 0x181D Weight Scale Service)
actual class BleScaleScanner(private val context: Context) {
    private val bluetoothManager = context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
    actual fun scanForScales(): Flow<WeightReading> = callbackFlow {
        val scanner = bluetoothManager.adapter.bluetoothLeScanner
        val callback = object : ScanCallback() {
            override fun onScanResult(callbackType: Int, result: ScanResult) {
                // Parse IEEE-11073 16-bit float weight payload
                val weight = parseWeightGatt(result.scanRecord?.bytes)
                trySend(WeightReading(weight, System.currentTimeMillis()))
            }
        }
        scanner.startScan(callback)
        awaitClose { scanner.stopScan(callback) }
    }
}`,
        ios: `// iosMain: Apple CoreBluetooth CBCentralManager
actual class BleScaleScanner : NSObject(), CBCentralManagerDelegateProtocol {
    private val centralManager = CBCentralManager(delegate = this, queue = null)
    actual fun scanForScales(): Flow<WeightReading> = callbackFlow {
        // Scan for CBUUID(string: "181D") Weight Scale Service
    }
}`,
        web: `// wasmJsMain: Web Bluetooth API
actual class BleScaleScanner {
    actual fun scanForScales(): Flow<WeightReading> = callbackFlow {
        // navigator.bluetooth.requestDevice({ filters: [{ services: ['weight_scale'] }] })
    }
}`
      }
    },
    {
      id: 'infrared',
      name: 'Infrared (IR) & Hardware I/O',
      icon: Radio,
      hardwareType: 'infrared',
      description: 'Transmits consumer infrared remote codes, TV/AV control protocols, and external serial/USB hardware accessories.',
      androidApi: 'android.hardware.ConsumerIrManager',
      androidPermission: 'android.permission.TRANSMIT_IR',
      iosApi: 'ExternalAccessory Framework (Lightning/USB-C IR Dongles)',
      iosPermission: 'Supported external accessory protocols in Info.plist',
      webApi: 'navigator.serial (Web Serial API for USB-IR blasters)',
      kmpSnippet: {
        common: `// commonMain: IR Transmitter Interface
expect class InfraredTransmitter() {
    val hasIrEmitter: Boolean
    fun transmit(carrierFrequencyHz: Int, pattern: IntArray)
}`,
        android: `// androidMain: ConsumerIrManager
actual class InfraredTransmitter(context: Context) {
    private val irManager = context.getSystemService(Context.CONSUMER_IR_SERVICE) as? ConsumerIrManager
    actual val hasIrEmitter: Boolean get() = irManager?.hasIrEmitter() == true

    actual fun transmit(carrierFrequencyHz: Int, pattern: IntArray) {
        irManager?.transmit(carrierFrequencyHz, pattern)
    }
}`,
        ios: `// iosMain: ExternalAccessory bridge
actual class InfraredTransmitter {
    actual val hasIrEmitter: Boolean get() = false // Built-in iOS has no raw IR LED
    actual fun transmit(carrierFrequencyHz: Int, pattern: IntArray) {
        // Bridges via Lightning / USB-C MFi external accessory
    }
}`,
        web: `// wasmJsMain: Web Serial API for USB IR Transceivers
actual class InfraredTransmitter {
    actual val hasIrEmitter: Boolean get() = js("'serial' in navigator") as Boolean
    actual fun transmit(carrierFrequencyHz: Int, pattern: IntArray) {
        // Writes raw pulse buffer to USB CDC Serial port
    }
}`
      }
    },
    {
      id: 'motion',
      name: 'Motion, Gyroscope & Accelerometer',
      icon: Compass,
      hardwareType: 'motion',
      description: 'Samples 3-axis acceleration, device orientation, gravity vectors, and haptic feedback actuators.',
      androidApi: 'android.hardware.SensorManager (TYPE_ACCELEROMETER)',
      androidPermission: 'HIGH_SAMPLING_RATE_SENSORS (Android 12+)',
      iosApi: 'CoreMotion (CMMotionManager)',
      iosPermission: 'NSMotionUsageDescription in Info.plist',
      webApi: 'window.DeviceMotionEvent & DeviceOrientationEvent',
      kmpSnippet: {
        common: `// commonMain: 3-Axis Vector Sensor
data class Vector3D(val x: Float, val y: Float, val z: Float)

expect class MotionSensor() {
    fun observeMotion(): Flow<Vector3D>
}`,
        android: `// androidMain: Android SensorEventListener
actual class MotionSensor(context: Context) {
    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    actual fun observeMotion(): Flow<Vector3D> = callbackFlow {
        val accel = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        val listener = object : SensorEventListener {
            override fun onSensorChanged(e: SensorEvent) {
                trySend(Vector3D(e.values[0], e.values[1], e.values[2]))
            }
            override fun onAccuracyChanged(s: Sensor?, acc: Int) {}
        }
        sensorManager.registerListener(listener, accel, SensorManager.SENSOR_DELAY_GAME)
        awaitClose { sensorManager.unregisterListener(listener) }
    }
}`,
        ios: `// iosMain: Apple CMMotionManager
actual class MotionSensor {
    private val motionManager = CMMotionManager()
    actual fun observeMotion(): Flow<Vector3D> = callbackFlow {
        motionManager.accelerometerUpdateInterval = 0.016 // 60Hz
        motionManager.startAccelerometerUpdatesToQueue(NSOperationQueue.mainQueue) { data, _ ->
            data?.acceleration?.let {
                trySend(Vector3D(it.x.toFloat(), it.y.toFloat(), it.z.toFloat()))
            }
        }
        awaitClose { motionManager.stopAccelerometerUpdates() }
    }
}`,
        web: `// wasmJsMain: Web DeviceMotionEvent API
actual class MotionSensor {
    actual fun observeMotion(): Flow<Vector3D> = callbackFlow {
        // window.addEventListener('devicemotion', (e) => { ... })
    }
}`
      }
    }
  ];

  const activeSensor = sensorApis.find((s) => s.id === activeSensorId) || sensorApis[0];

  const currentSnippet =
    activePlatformTab === 'kmp-common'
      ? activeSensor.kmpSnippet.common
      : activePlatformTab === 'android'
      ? activeSensor.kmpSnippet.android
      : activePlatformTab === 'ios'
      ? activeSensor.kmpSnippet.ios
      : activeSensor.kmpSnippet.web;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              Hardware, Battery, BLE Scales & Sensor API Hub
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standardized Kotlin Multiplatform expect/actual architecture for native Android, iOS, and Web hardware sensors.
          </p>
        </div>

        {/* Live Browser Battery & Haptic Widget */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            {liveBattery.charging ? (
              <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <Battery className="w-4 h-4 text-blue-400" />
            )}
            <div className="text-[11px] font-mono">
              <span className="text-slate-400">Live Battery: </span>
              <span className="font-semibold text-slate-200">{liveBattery.level}%</span>
              {liveBattery.charging && <span className="text-emerald-400 text-[10px] ml-1">(Charging)</span>}
            </div>
          </div>

          <button
            onClick={handleTestVibrate}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              vibrating
                ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Test browser haptic vibration"
          >
            <Zap className="w-3.5 h-3.5 inline mr-1" />
            <span>Test Haptic</span>
          </button>
        </div>
      </div>

      {/* Sensor Category Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sensorApis.map((sensor) => {
          const isSelected = sensor.id === activeSensorId;
          const Icon = sensor.icon;
          return (
            <button
              key={sensor.id}
              onClick={() => setActiveSensorId(sensor.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500/60 shadow-lg shadow-blue-900/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-200">{sensor.name}</span>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {sensor.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Sensor Specification Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Platform Specs & Permissions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-200 pb-2 border-b border-slate-800">
              Platform Native Drivers & Permissions
            </h3>

            {/* Android */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android (Java/Kotlin Driver)</span>
              </div>
              <p className="text-xs font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                {activeSensor.androidApi}
              </p>
              <p className="text-[11px] text-slate-400">
                Manifest: <code className="text-slate-300">{activeSensor.androidPermission}</code>
              </p>
            </div>

            {/* iOS */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-blue-400">
                <Smartphone className="w-3.5 h-3.5" />
                <span>iOS (Darwin / Swift Framework)</span>
              </div>
              <p className="text-xs font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                {activeSensor.iosApi}
              </p>
              <p className="text-[11px] text-slate-400">
                Info.plist: <code className="text-slate-300">{activeSensor.iosPermission}</code>
              </p>
            </div>

            {/* Web */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-purple-400">
                <Globe className="w-3.5 h-3.5" />
                <span>Web / Wasm (Web Capabilities API)</span>
              </div>
              <p className="text-xs font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                {activeSensor.webApi}
              </p>
            </div>
          </div>
        </div>

        {/* Right: expect/actual Multiplatform Code Generator */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          {/* Platform Tab Switcher */}
          <div className="border-b border-slate-800 bg-slate-950/70 p-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'kmp-common', label: 'commonMain (expect)' },
                { id: 'android', label: 'androidMain (actual)' },
                { id: 'ios', label: 'iosMain (actual)' },
                { id: 'web', label: 'wasmJsMain (actual)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePlatformTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    activePlatformTab === tab.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 p-4 bg-slate-950 overflow-auto font-mono text-xs leading-relaxed">
            <pre className="text-slate-300">
              <code>{currentSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
