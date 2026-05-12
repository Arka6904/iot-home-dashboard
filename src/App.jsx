import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Cloud,
  Cpu,
  Droplets,
  Fan,
  Gauge,
  Home,
  Leaf,
  PlugZap,
  Radio,
  RefreshCw,
  Server,
  Settings,
  Thermometer,
  Wifi,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

function Card({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

function CardContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

function Button({ className = "", children, onClick }) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api-iot-home.68.211.160.49.sslip.io";

const mockDevices = [
  {
    id: "D01",
    name: "Nodo Cacao Norte",
    type: "cacao",
    zone: "Cultivo",
    status: "online",
    metric: "Humedad suelo",
    value: 63.4,
    unit: "%",
  },
  {
    id: "D02",
    name: "Nodo Cacao Sur",
    type: "cacao",
    zone: "Cultivo",
    status: "online",
    metric: "Humedad suelo",
    value: 58.1,
    unit: "%",
  },
  {
    id: "D03",
    name: "Nodo Cacao Oriente",
    type: "cacao",
    zone: "Cultivo",
    status: "online",
    metric: "Humedad suelo",
    value: 61.7,
    unit: "%",
  },
  {
    id: "D04",
    name: "Nodo Cacao Occidente",
    type: "cacao",
    zone: "Cultivo",
    status: "warning",
    metric: "Humedad suelo",
    value: 38.9,
    unit: "%",
  },
  {
    id: "D05",
    name: "Nodo Granja Aves",
    type: "granja",
    zone: "Granja",
    status: "online",
    metric: "Calidad aire",
    value: 41.2,
    unit: "AQ",
  },
  {
    id: "D06",
    name: "Nodo Granja Bovinos",
    type: "granja",
    zone: "Granja",
    status: "online",
    metric: "Nivel agua",
    value: 74.6,
    unit: "%",
  },
  {
    id: "D07",
    name: "Nodo Granja Equinos",
    type: "granja",
    zone: "Granja",
    status: "online",
    metric: "Temp.",
    value: 27.3,
    unit: "°C",
  },
  {
    id: "D08",
    name: "Nodo Infraestructura",
    type: "granja",
    zone: "Granja",
    status: "online",
    metric: "Potencia",
    value: 18.8,
    unit: "W",
  },
  {
    id: "D09",
    name: "Gemelo Riego",
    type: "twin",
    zone: "Control",
    status: "active",
    metric: "Estado",
    value: "Activo",
    unit: "",
  },
  {
    id: "D10",
    name: "Gemelo Ventilación",
    type: "twin",
    zone: "Control",
    status: "idle",
    metric: "Estado",
    value: "Inactivo",
    unit: "",
  },
];

const mockSoilData = [
  { time: "10:00", D01: 66, D02: 61, D03: 63, D04: 43 },
  { time: "10:10", D01: 65, D02: 60, D03: 62, D04: 41 },
  { time: "10:20", D01: 64, D02: 59, D03: 62, D04: 39 },
  { time: "10:30", D01: 67, D02: 62, D03: 64, D04: 47 },
  { time: "10:40", D01: 65, D02: 60, D03: 63, D04: 44 },
  { time: "10:50", D01: 63, D02: 58, D03: 62, D04: 39 },
];

const mockClimateData = [
  { time: "10:00", temp: 26.1, humidity: 72, air: 39 },
  { time: "10:10", temp: 26.8, humidity: 70, air: 43 },
  { time: "10:20", temp: 27.0, humidity: 69, air: 48 },
  { time: "10:30", temp: 27.5, humidity: 68, air: 42 },
  { time: "10:40", temp: 27.2, humidity: 71, air: 40 },
  { time: "10:50", temp: 26.9, humidity: 73, air: 45 },
];

const mockPowerData = [
  { name: "Riego", watts: 118 },
  { name: "Vent.", watts: 0 },
  { name: "Granja", watts: 19 },
  { name: "Infra", watts: 14 },
];

const mockServices = [
  {
    name: "Mosquitto MQTT",
    icon: Radio,
    endpoint: "68.211.160.49:1883",
    status: "Conectado",
  },
  {
    name: "InfluxDB",
    icon: Server,
    endpoint: "68.211.160.49:8086",
    status: "Conectado",
  },
  {
    name: "Grafana",
    icon: BarChart3,
    endpoint: "68.211.160.49:3000",
    status: "Activo",
  },
  {
    name: "Simulador Python",
    icon: Cpu,
    endpoint: "tmux: simulator",
    status: "En ejecución",
  },
];

async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Error ${response.status} consultando ${path}`);
  }

  return response.json();
}

function statusClass(status) {
  if (status === "online" || status === "active") {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }

  if (status === "warning") {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

function statusText(status) {
  if (status === "online") return "Online";
  if (status === "warning") return "Advertencia";
  if (status === "active") return "Activo";
  if (status === "idle") return "Inactivo";
  return status;
}

export default function IoTHomeDashboard() {
  const [filter, setFilter] = useState("todos");
  const [timeRange, setTimeRange] = useState("12h");
  const [devices, setDevices] = useState(mockDevices);
  const [allSensors, setAllSensors] = useState([]);
  const [soilData, setSoilData] = useState(mockSoilData);
  const [climateData, setClimateData] = useState(mockClimateData);
  const [powerData, setPowerData] = useState(mockPowerData);
  const [mainChartTitle, setMainChartTitle] = useState(
    "Humedad de suelo por nodo"
  );
  const [mainChartSubtitle, setMainChartSubtitle] = useState(
    "D01-D04 / cultivo de cacao"
  );
  const [mainChartKeys, setMainChartKeys] = useState([
    "D01",
    "D02",
    "D03",
    "D04",
  ]);
  const [services, setServices] = useState(mockServices);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("Modo demo");
  const [lastUpdate, setLastUpdate] = useState("Sin actualización");

  async function loadDashboard() {
    setLoading(true);

    try {
      const [
        summaryRes,
        devicesRes,
        soilRes,
        climateRes,
        powerRes,
        servicesRes,
        allSensorsRes,
      ] = await Promise.all([
        getJson(`/api/summary?range=${timeRange}`),
        getJson(`/api/devices?range=${timeRange}`),
        getJson(`/api/series/soil?range=${timeRange}`),
        getJson(`/api/series/climate?range=${timeRange}`),
        getJson(`/api/series/power?range=${timeRange}`),
        getJson(`/api/services`),
        getJson(`/api/latest/all?range=${timeRange}`),
      ]);

      setSummary(summaryRes);
      setDevices(devicesRes);
      setAllSensors(allSensorsRes);
      setClimateData(climateRes);
      setPowerData(powerRes);
      setServices(
        servicesRes.map((s) => ({
          ...s,
          icon: serviceIcon(s.name),
        }))
      );
      setApiStatus("API conectada");
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error(error);
      setApiStatus("Modo demo / API no disponible");
    } finally {
      setLoading(false);
    }
  }

  async function loadChartByFilter(currentFilter, currentTimeRange) {
    try {
      if (currentFilter === "todos" || currentFilter === "cacao") {
        const data = await getJson(
          `/api/series/field?field=soil_moisture&type=cacao&range=${currentTimeRange}`
        );

        setSoilData(data);
        setMainChartTitle("Humedad de suelo por nodo");
        setMainChartSubtitle("D01-D04 / cultivo de cacao");
        setMainChartKeys(["D01", "D02", "D03", "D04"]);
      } else if (currentFilter === "granja") {
        const data = await getJson(
          `/api/series/field?field=air_quality&type=granja&range=${currentTimeRange}`
        );

        setSoilData(data);
        setMainChartTitle("Calidad del aire por nodo");
        setMainChartSubtitle("D05-D08 / granja");
        setMainChartKeys(["D05", "D06", "D07", "D08"]);
      } else if (currentFilter === "twin") {
        const data = await getJson(
          `/api/series/field?field=power&range=${currentTimeRange}`
        );

        setSoilData(data);
        setMainChartTitle("Potencia de gemelos digitales");
        setMainChartSubtitle("D09 riego / D10 ventilación");
        setMainChartKeys(["D09", "D10"]);
      }
    } catch (error) {
      console.error(error);
      // Fallback a mock data según el filtro activo
      if (currentFilter === "granja") {
        setSoilData(mockSoilData.map((d) => ({ time: d.time, D05: d.D01, D06: d.D02, D07: d.D03, D08: d.D04 })));
        setMainChartTitle("Calidad del aire por nodo");
        setMainChartSubtitle("D05-D08 / granja");
        setMainChartKeys(["D05", "D06", "D07", "D08"]);
      } else if (currentFilter === "twin") {
        setSoilData(mockSoilData.map((d) => ({ time: d.time, D09: d.D01, D10: d.D02 })));
        setMainChartTitle("Potencia de gemelos digitales");
        setMainChartSubtitle("D09 riego / D10 ventilación");
        setMainChartKeys(["D09", "D10"]);
      } else {
        setSoilData(mockSoilData);
        setMainChartTitle("Humedad de suelo por nodo");
        setMainChartSubtitle("D01-D04 / cultivo de cacao");
        setMainChartKeys(["D01", "D02", "D03", "D04"]);
      }
    }
  }

  useEffect(() => {
    loadDashboard();
    loadChartByFilter(filter, timeRange);

    const timer = setInterval(() => {
      loadDashboard();
      loadChartByFilter(filter, timeRange);
    }, 30000);

    return () => clearInterval(timer);
  }, [timeRange, filter]);

  const filteredDevices = useMemo(() => {
    if (filter === "todos") return devices;
    return devices.filter((d) => d.type === filter);
  }, [filter, devices]);

  const onlineCount =
    summary?.online_devices ??
    devices.filter((d) => d.status === "online" || d.status === "active")
      .length;

  const alerts =
    summary?.alerts ?? devices.filter((d) => d.status === "warning").length;

  const avgSoil =
    summary?.avg_soil ??
    Math.round(
      devices
        .filter((d) => d.type === "cacao" && typeof d.value === "number")
        .reduce((acc, d) => acc + d.value, 0) / 4
    );

  const avgTemp =
    summary?.avg_temp ??
    Math.round(
      climateData.reduce((acc, d) => acc + d.temp, 0) /
        Math.max(climateData.length, 1)
    );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-emerald-300">
              <Home size={18} />
              IoT Home / Finca Inteligente
            </div>

            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              Panel central IoT
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
              Vista integrada para monitorear cultivo de cacao, granja,
              servicios, conexiones y gemelos digitales.
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Estado: {apiStatus} · Última actualización: {lastUpdate} · API:{" "}
              {API_BASE_URL}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                loadDashboard();
                loadChartByFilter();
              }}
              className="rounded-2xl bg-emerald-500 text-slate-950 hover:bg-emerald-400"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>

            <Button className="rounded-2xl border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800">
              <Settings className="mr-2 h-4 w-4" />
              Conexiones
            </Button>
          </div>
        </motion.div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={Wifi}
            title="Dispositivos activos"
            value={`${onlineCount}/10`}
            note="Nodos y gemelos"
          />
          <KpiCard
            icon={AlertTriangle}
            title="Alertas"
            value={alerts}
            note="Pendientes"
            warning={alerts > 0}
          />
          <KpiCard
            icon={Droplets}
            title="Humedad suelo prom."
            value={`${avgSoil}%`}
            note="Cultivo cacao"
          />
          <KpiCard
            icon={Thermometer}
            title="Temp. promedio"
            value={`${avgTemp}°C`}
            note="Granja/cultivo"
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
          {services.map((s) => {
            const ServiceIcon = s.icon;

            return (
              <Card
                key={s.name}
                className="rounded-3xl border-slate-800 bg-slate-900/80 shadow-xl"
              >
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-300">
                      <ServiceIcon size={22} />
                    </div>

                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                      {s.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-100">{s.name}</h3>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {s.endpoint}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            ["todos", "Todos"],
            ["cacao", "Cacao"],
            ["granja", "Granja"],
            ["twin", "Gemelos"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-2xl border px-4 py-2 text-sm transition ${
                filter === key
                  ? "border-emerald-400 bg-emerald-400 text-slate-950"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            ["12h", "12 horas"],
            ["24h", "24 horas"],
            ["3d", "3 días"],
            ["7d", "7 días"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTimeRange(key)}
              className={`rounded-2xl border px-4 py-2 text-sm transition ${
                timeRange === key
                  ? "border-cyan-400 bg-cyan-400 text-slate-950"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="rounded-3xl border-slate-800 bg-slate-900/80 lg:col-span-2">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{mainChartTitle}</h2>
                  <p className="text-sm text-slate-400">{mainChartSubtitle}</p>
                </div>

                <Leaf className="text-emerald-300" />
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={soilData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        background: "#020617",
                        border: "1px solid #334155",
                        borderRadius: 14,
                      }}
                    />

                    {mainChartKeys.map((key, index) => {
                      const colors = [
                        "#22c55e",
                        "#38bdf8",
                        "#a78bfa",
                        "#f59e0b",
                        "#fb7185",
                        "#14b8a6",
                      ];

                      return (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={false}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Energía</h2>
                  <p className="text-sm text-slate-400">
                    Consumo por componente
                  </p>
                </div>

                <Zap className="text-yellow-300" />
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={powerData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        background: "#020617",
                        border: "1px solid #334155",
                        borderRadius: 14,
                      }}
                    />
                    <Bar
                      dataKey="watts"
                      fill="#facc15"
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Clima y calidad del aire
                  </h2>
                  <p className="text-sm text-slate-400">
                    Temperatura, humedad y aire
                  </p>
                </div>

                <Gauge className="text-sky-300" />
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={climateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        background: "#020617",
                        border: "1px solid #334155",
                        borderRadius: 14,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="temp"
                      stackId="1"
                      stroke="#fb7185"
                      fill="#fb718555"
                    />
                    <Area
                      type="monotone"
                      dataKey="humidity"
                      stackId="2"
                      stroke="#38bdf8"
                      fill="#38bdf855"
                    />
                    <Area
                      type="monotone"
                      dataKey="air"
                      stackId="3"
                      stroke="#a78bfa"
                      fill="#a78bfa55"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Dispositivos</h2>
                  <p className="text-sm text-slate-400">
                    Estado actual de nodos y gemelos
                  </p>
                </div>

                <Activity className="text-emerald-300" />
              </div>

              <div className="grid max-h-72 gap-3 overflow-auto pr-2">
                {filteredDevices.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-slate-800 p-2 text-slate-200">
                        {d.type === "cacao" ? (
                          <Leaf size={18} />
                        ) : d.type === "granja" ? (
                          <Cloud size={18} />
                        ) : (
                          <PlugZap size={18} />
                        )}
                      </div>

                      <div>
                        <div className="text-sm font-medium text-slate-100">
                          {d.id} · {d.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {d.zone} · {d.metric}: {d.value} {d.unit}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs ${statusClass(
                        d.status
                      )}`}
                    >
                      {statusText(d.status)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 rounded-3xl border-slate-800 bg-slate-900/80">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Sensores por dispositivo
                </h2>
                <p className="text-sm text-slate-400">
                  Lecturas completas según filtro y rango seleccionado
                </p>
              </div>

              <Gauge className="text-cyan-300" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allSensors
                .filter((device) => {
                  if (filter === "todos") return true;

                  if (filter === "twin") {
                    return (
                      device.type === "twin_riego" ||
                      device.type === "twin_ventilacion"
                    );
                  }

                  return device.type === filter;
                })
                .map((device) => (
                  <SensorCard key={device.id} device={device} />
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Conexiones del sistema
                </h2>
                <p className="text-sm text-slate-400">
                  Guía de integración para conectar datos reales.
                </p>
              </div>

              <Fan className="text-cyan-300" />
            </div>

            <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-3">
              <ConnectionStep
                title="1. Backend seguro"
                text="FastAPI consulta InfluxDB y entrega JSON al frontend sin exponer tokens."
              />
              <ConnectionStep
                title="2. MQTT"
                text="El simulador publica en Mosquitto y también escribe telemetría en InfluxDB."
              />
              <ConnectionStep
                title="3. Dashboard"
                text="La página consume /api/summary, /api/devices y /api/series/* cada 30 segundos."
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function serviceIcon(name) {
  const lower = String(name).toLowerCase();

  if (lower.includes("mqtt") || lower.includes("mosquitto")) return Radio;
  if (lower.includes("influx")) return Server;
  if (lower.includes("grafana")) return BarChart3;
  if (lower.includes("simulador") || lower.includes("python")) return Cpu;

  return Server;
}

function KpiCard({ icon: Icon, title, value, note, warning }) {
  return (
    <Card className="rounded-3xl border-slate-800 bg-slate-900/80 shadow-xl">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div
            className={`rounded-2xl p-3 ${
              warning
                ? "bg-amber-400/10 text-amber-300"
                : "bg-emerald-400/10 text-emerald-300"
            }`}
          >
            <Icon size={22} />
          </div>
        </div>

        <div className="text-3xl font-bold text-slate-100">{value}</div>
        <div className="mt-1 text-sm font-medium text-slate-300">{title}</div>
        <div className="mt-1 text-xs text-slate-500">{note}</div>
      </CardContent>
    </Card>
  );
}

function ConnectionStep({ title, text }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <h3 className="mb-1 font-semibold text-slate-100">{title}</h3>
      <p className="text-slate-400">{text}</p>
    </div>
  );
}

function SensorCard({ device }) {
  const values = device.values || {};

  const labels = {
    soil_moisture: "Humedad suelo",
    temperature: "Temperatura",
    humidity: "Humedad relativa",
    light: "Luz",
    air_quality: "Calidad aire",
    water_level: "Nivel agua",
    power: "Potencia",
    current: "Corriente",
    duration_remaining: "Duración restante",
    status: "Estado",
  };

  const units = {
    soil_moisture: "%",
    temperature: "°C",
    humidity: "%",
    light: "lux",
    air_quality: "AQ",
    water_level: "%",
    power: "W",
    current: "A",
    duration_remaining: "ciclos",
    status: "",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-100">{device.id}</h3>
          <p className="text-xs text-slate-400">
            {device.type} · {device.zone}
          </p>
        </div>

        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
          Online
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Object.entries(values).map(([key, value]) => (
          <div key={key} className="rounded-xl bg-slate-900 p-3">
            <p className="text-xs text-slate-500">{labels[key] || key}</p>

            <p className="text-lg font-bold text-slate-100">
              {typeof value === "number"
                ? Number(value).toFixed(2)
                : String(value)}
              <span className="ml-1 text-xs text-slate-400">
                {units[key] || ""}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}