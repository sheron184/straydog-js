export function getMetrics(){
	return {
		memory: process.memoryUsage(),
		cpu: process.cpuUsage(),
		uptime: process.uptime()
	};
}